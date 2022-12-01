/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="CommonReferences.ts"/>

declare var $: JQueryStatic;

module MscrmControls.ProductivityPanel.TPBot {
	export class TPBotManager {
		private static instance: TPBotManager = null;
		private adaptiveCard: AdaptiveCards.AdaptiveCard = null;

		private constructor() {
			this.TPBotCards = {};
		}

		public TPBotCards: any;

		public static get Instance(): TPBotManager {
			if (!TPBotManager.instance) {
				TPBotManager.instance = new TPBotManager();
			}
			return TPBotManager.instance;
		}

		public async RenderTPBotCard(message: SmartAssist.Common.Message) {
			// Create telemetry timer to record the execution time for this function.
			const timer = TPBotControl.telemetryReporter.startTimer("RenderTPBotCard");
			const params = new TelemetryLogger.EventParameters();
			params.addParameter("MessageId", message.id);
			params.addParameter("SessionId", message.uiSessionId);
			params.addParameter("Type", message.type);

			try {
				const card = ProductivityPanel.TPBot.AdaptiveCardHelper.GetCardFromMessageContent(message.content!).content;
				const conversationId = message.conversationId;
				params.addParameter("ConversationId", conversationId);

				let conversationState = ConversationStateManager.GetConversationState(conversationId);
				//Get an ID for the card by saving it. Set the state of the card
				let cardId = conversationState.PersistCard(card);

				let currentConversationId = await ConversationStateManager.GetCurrentConversation();
				
				if (currentConversationId === conversationId) {
					// Render the card
					this.renderCard(card, cardId, conversationId);
					CardStateManager.SetState(conversationId, cardId, CardStates.New, true);
				}
				else {
					CardStateManager.SetState(conversationId, cardId, CardStates.New, false);
				}

				params.addParameter("Rendered", currentConversationId === conversationId);
				timer.stop(params);
			} catch (error) {
				params.addParameter("ExceptionDetails", error);
				timer.fail("Failure occurred while rendering third-party bot card", params);

				// Propagate error up to caller.
				throw error;
			}
		}

		public async ReRenderCards(conversationId: string, isRTL: boolean, reason: "init" | "update-view" | "update-state") {
			// Create telemetry timer to record the execution time for this function.
			const timer = TPBotControl.telemetryReporter.startTimer("ReRenderCards");
			const params = new TelemetryLogger.EventParameters();
			params.addParameter("ConversationId", conversationId);
			params.addParameter("Reason", reason);

			this.ResetTPBotControl(isRTL);
			this.RenderTitle(TPBotControl.getString(TPBot.LocalizedStrings.TPBotControlHeader));

			// Render the cards in this conversation if we're currently focused on this conversation.
			const currentConversationId = await ConversationStateManager.GetCurrentConversation();
			if (currentConversationId === conversationId) {
				let conversationState = ConversationStateManager.GetConversationState(conversationId);
				let cards = conversationState.GetAllCards();
				for (var key in cards) {
					let cardId = parseInt(key);
					let card = cards[key];
					this.renderCard(card, cardId, conversationId);
				}
				params.addParameter("NumCardsRendered", cards.length);
			} else {
				params.addParameter("NumCardsRendered", 0);
			}
			
			params.addParameter("IsCurrentConversation", currentConversationId === conversationId);
			timer.stop(params);
		}

		private ResetTPBotControl(isRTL: boolean) {
			$("#" + Constants.TPBotOuterContainer).html(TPBotTemplate.get(isRTL));
		}

		private RenderTitle(title: string) {
			let titleDiv = ViewTemplates.TPBotTitleTemplate.Format(title);
			$("#" + Constants.TPBotOuterContainer).append(titleDiv);
		}

		private renderCard(card, cardId, conversationId: string): void {
			if (!this.adaptiveCard) {
				this.adaptiveCard = AdaptiveCardHelper.InitializeAdaptiveCardsHostConfig();
			}
			this.adaptiveCard.hostConfig.cssClassNamePrefix = "tpb";
			this.adaptiveCard.parse(card);
			let renderedCard = this.adaptiveCard.render();

			// Render Card Container
			let id = Constants.TPBotCardContainerIdPrefix + cardId;
			let cardContainer = ViewTemplates.CardContainerTemplate.Format(id);
			$("." + Constants.TPBotTitleClass).after(cardContainer);
			$("." + Constants.TPBotTitleClass).hide();

			// Append card and dismiss button to container
			let tpBotCardContainer = $("#" + id);
			let dismissButton = ViewTemplates.DismissButtonTemplate.Format(cardId);
			tpBotCardContainer.append(renderedCard);
			tpBotCardContainer.append(dismissButton);

			// Bind actions for card buttons and dismiss
			this.BindOnExecuteAction();
			this.BindDismissActionForCard(conversationId, cardId);
			tpBotCardContainer.focus();

			// Render card state if any
			this.RenderCardState(conversationId, cardId, tpBotCardContainer);
		}

		private RenderCardState(conversationId, cardId, cardContainer) {
			let cardStates = CardStateManager.GetAllCardStates(conversationId);
			if (cardStates && cardStates[cardId]) {
				let cardState = cardStates[cardId];
				switch (cardState) {
					case CardStates.New:
						cardContainer.addClass(Constants.CardNewClass);
						$(cardContainer.find('.ac-container')[0]).addClass(Constants.CardNewClass);
						break;
					case CardStates.Error:
						cardContainer.addClass(Constants.CardErrorClass);
						break;
					case CardStates.Applied:
						cardContainer.addClass(Constants.CardAppliedClass);
						$(cardContainer.find('.ac-container')[0]).addClass(Constants.CardAppliedClass);
						break;
				}
			}
		}

		/*
		* Runs Custom action which can be OOB custom action or custom customaction
		* @params actionData Required parameters to run custom action
		*/
		private RunCustomAction(actionData: any): any {
			let eventParameters = new TelemetryLogger.EventParameters();
			eventParameters.addParameter("Message", "Running Custom Action");
			eventParameters.addParameter("actionData", actionData);

			if (actionData && actionData.CustomAction) {
				try {
					let customAction: CustomActionManager = new CustomActionManager(actionData);
					if (!customAction.isValidAction) {
						TPBotControl.telemetryReporter.logError("RunCustomAction", "Invalid CustomAction", eventParameters);
						return Promise.resolve();
					} else {
						switch (customAction.Name) {
							case CustomActionConstants.SendKB:
								customAction.CustomActionSendKB();
								break;
							case CustomActionConstants.OpenKB:
								customAction.CustomActionOpenKB();
								break;
							case CustomActionConstants.OpenForm:
							case CustomActionConstants.OpenCase:
								customAction.CustomActionOpenForm();
								break;
							case CustomActionConstants.CloneCase:
								customAction.CustomActionCreateEntity();
								break;
							default:
								TPBotControl.telemetryReporter.logSuccess("Running Custom CustomAction", eventParameters);
								return window.top[customAction.Name](customAction.Parameters);
						}
					}
				} catch (Error) {
					eventParameters.addParameter("ExceptionDetails", Error);
					TPBotControl.telemetryReporter.logError("RunCustomAction", "Error occurred while running custom action", eventParameters);
				}
			}
		}

		private async BindOnExecuteAction() {
			let self = this;
			let conversationId = await ConversationStateManager.GetCurrentConversation();
			let eventParameters = new TelemetryLogger.EventParameters();
			eventParameters.addParameter("LiveWorkitemId", conversationId);

			this.adaptiveCard.onExecuteAction = function (action: AdaptiveCards.SubmitAction) {

				const timer = TPBotControl.telemetryReporter.startTimer("onExecuteAction");

				let cardContainer = $(action.renderedElement).parents('.' + Constants.TPBotCardContainerClass);
				let cardId = cardContainer[0].id.substr(Constants.TPBotCardContainerIdPrefix.length);

				CardStateManager.SetState(conversationId, cardId, CardStates.Applied);
				self.RenderCardState(conversationId, cardId, cardContainer);

				let successMessage = ViewTemplates.SuccessMessageTemplate.Format(TPBotControl.getString(LocalizedStrings.TPBotSuccessMessage));
				let errorMessage = ViewTemplates.FailureMessageTemplates.Format(TPBotControl.getString(LocalizedStrings.TPBotFailureMessage));;

				let actionData = JSON.parse(JSON.stringify(action.data));
				let actionPromise = null;
				// Run Custom Action
				if (actionData.CustomAction && actionData.CustomParameters) {
					actionPromise = self.RunCustomAction(actionData);
				}
				//Run Macro
				else if (actionData.MacroName && actionData.MacroParameters) {
					actionPromise = new MacroUtil().executeMacro(actionData.MacroName, actionData.MacroParameters);
				}
				else {
					timer.fail("Action does not exist", eventParameters);
				}

				if (actionPromise != null) 
					actionPromise.then((value) => {
						// Set success if macro doesn't throw an error
						eventParameters.addParameter("MacroRun", "Success");
						timer.stop(eventParameters);
						cardContainer.after(successMessage);

						setTimeout(() => {
							$('.' + Constants.TPBotSuccessMessageClass).remove();
						}, 5000);
					}, (error) => {
						// Set failure if macro throws an error
						eventParameters.addParameter("MacroRun", "Failure");
						timer.stop(eventParameters);
						cardContainer.after(errorMessage);

						CardStateManager.SetState(conversationId, cardId, CardStates.Error);
						self.RenderCardState(conversationId, cardId, cardContainer);
						cardContainer.removeClass(Constants.CardAppliedClass);

						setTimeout(() => {
							$('.' + Constants.TPBotFailureClass).remove();
						}, 5000)
					});
			}
		}

		private BindDismissActionForCard(conversationId: string, cardId: number) {
			$('#' + Constants.TPBotDismissCardButtonId + cardId).on(Constants.eventClick, () => {
				let id = Constants.TPBotCardContainerIdPrefix + cardId;
				$("#" + id).remove();
				ConversationStateManager.GetConversationState(conversationId).RemoveCard(cardId);
			});
			$('#' + TPBot.Constants.TPBotDismissCardButtonId + cardId).on(Constants.eventKeyPress, function (args) {
				let id = TPBot.Constants.TPBotDismissCardButtonId + cardId;
				if (args.keyCode == Constants.EnterKeyCode) {
					$("#" + id).click();
				}
			});
		}

	}
}