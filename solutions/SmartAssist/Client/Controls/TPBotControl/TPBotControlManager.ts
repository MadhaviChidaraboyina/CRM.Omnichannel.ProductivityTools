/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="CommonReferences.ts"/>

declare var $: JQueryStatic;

module MscrmControls.ProductivityPanel.TPBot {
	export class TPBotManager {
		private static instance: TPBotManager = null;
		private adaptiveCard: AdaptiveCards.AdaptiveCard = null;
		private logger: TelemetryLogger;
        public callbackOnCardReceived: (value: any) => void;

		private constructor() {
			this.TPBotCards = {};
		}

		public SetLogger(logger: TelemetryLogger) {
			this.logger = logger;
		}

		public TPBotCards: any;

		public static get Instance(): TPBotManager {
			if (!TPBotManager.instance) {
				TPBotManager.instance = new TPBotManager();
			}
			return TPBotManager.instance;
		}

		public RenderTPBotCard(conversationId, card) {
			let conversationState = ConversationStateManager.GetConversationState(conversationId);
			//Get an ID for the card by saving it. Set the state of the card
			let cardId = conversationState.PersistCard(card);

			let currentConversationId = ConversationStateManager.GetCurrentConversation();

			if (conversationId == currentConversationId) {
				// Render the card
				this.renderCard(card, cardId, conversationId);
				CardStateManager.SetState(conversationId, cardId, CardStates.New, true);
			}
			else {
				CardStateManager.SetState(conversationId, cardId, CardStates.New, false);
			}
		}

        public ReRenderCards(isRTL: boolean) {

            this.ResetTPBotControl(isRTL);
            this.RenderTitle(TPBotControl.getString(TPBot.LocalizedStrings.TPBotControlHeader));

            let conversationId = ConversationStateManager.GetCurrentConversation();
            if (conversationId) {
				let conversationState = ConversationStateManager.GetConversationState(conversationId);
                let cards = conversationState.GetAllCards();
                for (var key in cards) {
					let cardId = parseInt(key);
					let card = cards[key];
					this.renderCard(card, cardId, conversationId);
				}
			}
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
			let eventParameters = new TPBot.EventParameters();
			eventParameters.addParameter("Message", "Running Custom Action");
			eventParameters.addParameter("actionData", actionData);

			if (actionData && actionData.CustomAction) {
				try {
					let customAction: CustomActionManager = new CustomActionManager(actionData);
					if (!customAction.isValidAction) {
						this.logger.logError(this.logger.baseComponent, "RunCustomAction", "Invalid CustomAction", eventParameters);
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
								this.logger.logSuccess(this.logger.baseComponent, "Running Custom CustomAction", eventParameters);
								return window.top[customAction.Name](customAction.Parameters);
						}
					}
				} catch (Error) {
					eventParameters.addParameter("Exception Details", Error);
					this.logger.logError(this.logger.baseComponent, "RunCustomAction", "Error occurred while running custom action", eventParameters);
				}
			}
		}

		private BindOnExecuteAction() {
			let self = this;
			let conversationId = ConversationStateManager.GetCurrentConversation();
			let eventParameters = new EventParameters();
			eventParameters.addParameter("LiveWorkitemId", conversationId);

			this.adaptiveCard.onExecuteAction = function (action: AdaptiveCards.SubmitAction) {
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
					self.logger.logError(TelemetryComponents.MainComponent, TelemetryComponents.MainComponent, "Action does not exist", eventParameters);
				}
				actionPromise.then((value) => {
					// Set success if macro doesn't throw an error
					eventParameters.addParameter("MacroRun", "Success");
					self.logger.logSuccess(TelemetryComponents.MainComponent, TelemetryComponents.MainComponent, eventParameters);
					cardContainer.after(successMessage);

					setTimeout(() => {
						$('.' + Constants.TPBotSuccessMessageClass).remove();
					}, 5000);
				}, (error) => {
					// Set failure if macro throws an error
					eventParameters.addParameter("MacroRun", "Failure");
					self.logger.logSuccess(TelemetryComponents.MainComponent, TelemetryComponents.MainComponent, eventParameters);
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
                var conversationState = TPBot.ConversationStateManager.GetConversationState(conversationId);
                var cards = conversationState.GetAllCards();                
                var length = Object.keys(cards).length;
                if (length == 0) {
                    this.callbackOnCardReceived(false);
                }
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