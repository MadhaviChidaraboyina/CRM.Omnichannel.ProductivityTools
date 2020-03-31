/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="CommonReferences.ts"/>

declare var $: JQueryStatic;

module MscrmControls.ProductivityPanel.Smartassist {
	export class SmartAssistManager {
		private static instance: SmartAssistManager = null;
		private adaptiveCard: AdaptiveCards.AdaptiveCard = null;
		private logger: TelemetryLogger;
        public callbackOnCardReceived: (value: any) => void;

		private constructor() {
			this.SmartAssistCards = {};
		}

		public SetLogger(logger: TelemetryLogger) {
			this.logger = logger;
		}

		public SmartAssistCards: any;

		public static get Instance(): SmartAssistManager {
			if (!SmartAssistManager.instance) {
				SmartAssistManager.instance = new SmartAssistManager();
			}
			return SmartAssistManager.instance;
		}

		public RenderSmartAssistCard(conversationId, card) {
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

            this.ResetSmartAssistControl(isRTL);
            this.RenderTitle(SmartassistControl.getString(Smartassist.LocalizedStrings.SmartAssistControlHeader));

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

		private ResetSmartAssistControl(isRTL: boolean) {
			$("#" + Constants.SmartAssistOuterContainer).html(SmartAssistTemplate.get(isRTL));
		}

		private RenderTitle(title: string) {
			let titleDiv = ViewTemplates.SmartAssistTitleTemplate.Format(title);
			$("#" + Constants.SmartAssistOuterContainer).append(titleDiv);
		}

		private renderCard(card, cardId, conversationId: string): void {
			if (!this.adaptiveCard) {
				this.adaptiveCard = AdaptiveCardHelper.InitializeAdaptiveCardsHostConfig();
			}
			this.adaptiveCard.parse(card);
			let renderedCard = this.adaptiveCard.render();

			// Render Card Container
			let id = Constants.SmartAssistCardContainerIdPrefix + cardId;
			let cardContainer = ViewTemplates.CardContainerTemplate.Format(id);
			$("." + Constants.SmartAssistTitleClass).after(cardContainer);
			$("." + Constants.SmartAssistTitleClass).hide();

			// Append card and dismiss button to container
			let smartAssistCardContainer = $("#" + id);
			let dismissButton = ViewTemplates.DismissButtonTemplate.Format(cardId);
			smartAssistCardContainer.append(renderedCard);
			smartAssistCardContainer.append(dismissButton);

			// Bind actions for card buttons and dismiss
			this.BindOnExecuteAction();
			this.BindDismissActionForCard(conversationId, cardId);
			smartAssistCardContainer.focus();

			// Render card state if any
			this.RenderCardState(conversationId, cardId, smartAssistCardContainer);
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
			let eventParameters = new Smartassist.EventParameters();
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
				let cardContainer = $(action.renderedElement).parents('.' + Constants.SmartAssistCardContainerClass);
				let cardId = cardContainer[0].id.substr(Constants.SmartAssistCardContainerIdPrefix.length);

				CardStateManager.SetState(conversationId, cardId, CardStates.Applied);
				self.RenderCardState(conversationId, cardId, cardContainer);

				let successMessage = ViewTemplates.SuccessMessageTemplate.Format(SmartassistControl.getString(LocalizedStrings.SmartAssistSuccessMessage));
				let errorMessage = ViewTemplates.FailureMessageTemplates.Format(SmartassistControl.getString(LocalizedStrings.SmartAssistFailureMessage));;


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
						$('.' + Constants.SmartAssistSuccessMessageClass).remove();
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
						$('.' + Constants.SmartAssistFailureClass).remove();
					}, 5000)
				});
			}
		}

        private BindDismissActionForCard(conversationId: string, cardId: number) {
			$('#' + Constants.SmartAssistDismissCardButtonId + cardId).on(Constants.eventClick, () => {
				let id = Constants.SmartAssistCardContainerIdPrefix + cardId;
				$("#" + id).remove();
                ConversationStateManager.GetConversationState(conversationId).RemoveCard(cardId);
                var conversationState = Smartassist.ConversationStateManager.GetConversationState(conversationId);
                var cards = conversationState.GetAllCards();                
                var length = Object.keys(cards).length;
                if (length == 0) {
                    this.callbackOnCardReceived(false);
                }
			});
			$('#' + Smartassist.Constants.SmartAssistDismissCardButtonId + cardId).on(Constants.eventKeyPress, function (args) {
				let id = Smartassist.Constants.SmartAssistDismissCardButtonId + cardId;
				if (args.keyCode == Constants.EnterKeyCode) {
					$("#" + id).click();
				}
            });
		}

	}
}