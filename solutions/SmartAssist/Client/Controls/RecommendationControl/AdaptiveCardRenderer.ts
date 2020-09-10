﻿/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="./CommonReferences.ts"/>
/// <reference path="../../TypeDefinitions/adaptivecards-templating.d.ts"/>

module MscrmControls.Smartassist.Suggestion {

	export enum CardState {
		New = 0,
		Default = 1
	}

	export interface SuggestionCard {
		cardId: string,
		cardContent: any,
		cardState: CardState;
	}

	export interface SuggestionCardElement {
		card: SuggestionCard,
		cardHTMLElement: HTMLElement;
	}

	export class AdaptiveCardRenderer {

		private _context: Mscrm.ControlData<IInputBag>;
		private _suggestionId: string;
		private _refreshCardCallback: (args: Suggestion.CardRefreshArgs) => void;
		private _sessionStorageManager: Suggestion.SessionStorageManager;
		private adaptivecardRoot: AdaptiveCards.AdaptiveCard;

		constructor(refreshCallback: (args: Suggestion.CardRefreshArgs) => void) {
			this._refreshCardCallback = refreshCallback;
			this._sessionStorageManager = Suggestion.SessionStorageManager.Instance;
		}

		public SetContext(context: Mscrm.ControlData<IInputBag>) {
			this._context = context;
		}

		public SetSuggestionId(suggestionId) {
			this._suggestionId = suggestionId;
		}

		/**
		 * This method binds the template and data using adaptivecards-template sdk.
		 * @param suggestionId this is used to generate the unique card id.
		 * @param template AdaptiveCard template
		 * @param data Data to bind with adaptive card
		 */
		createCardFromTemplateAndData(suggestionId: string, template: string, data: any): SuggestionCardElement {
			try {
				const cardId = Suggestion.Util.getSuggestionCardId(suggestionId);
				const templatePayload = JSON.parse(template);
				const cardTemplate = new ACData.Template(templatePayload);

				const dataToBind: any = data;
				var context: ACData.IEvaluationContext = {
					$root: dataToBind
				};

				const card = cardTemplate.expand(context);
				const suggestionCard: SuggestionCard = { cardId: cardId, cardContent: card, cardState: CardState.New };

				const htmlElement = this.createAdaptiveCard(card);
				const suggestionCardElement: SuggestionCardElement = { card: suggestionCard, cardHTMLElement: htmlElement };

				return suggestionCardElement;
			} catch (error) {
				let eventParameters = new TelemetryLogger.EventParameters();
				eventParameters.addParameter("Exception Details", error.message);
				RecommendationControl._telemetryReporter.logError("MainComponent", "create card", "Recommendation control fails to create adaptivecard", eventParameters)
				return null;
			}
		}

		createAdaptiveCard(cardContent: any): HTMLElement {
			const adaptiveCard = new AdaptiveCards.AdaptiveCard();
			this.initializeAdaptiveCardsHostConfig(adaptiveCard);
			AdaptiveCards.AdaptiveCard.elementTypeRegistry.registerType(Suggestion.Constants.PopupActionName, () => { return new PopupAction(this.onExecuteAction.bind(this)) });
			adaptiveCard.parse(cardContent);
			adaptiveCard.onExecuteAction = this.onExecuteAction.bind(this);
			adaptiveCard.onElementVisibilityChanged = this.onVisibilityChanged.bind(this);
			const htmlElement = adaptiveCard.render();
			this.adaptivecardRoot = adaptiveCard;
			return htmlElement;
		}

		/**
		 * callback for onElementVisibilityChanged
		 * @param element
		 */
		onVisibilityChanged(element: AdaptiveCards.CardElement) {
			const cardId = Suggestion.Util.getSuggestionCardId(this._suggestionId);
			if ($("#" + cardId).hasClass(Suggestion.Constants.CardNewClass)) {
				$("#" + cardId).removeClass(Suggestion.Constants.CardNewClass);
				this._refreshCardCallback({ type: Smartassist.Suggestion.Action.CacheUpdate, data: { IsInteracted: true } });
			}
		}

		/**
		 * This method is used to cache the SuggestionCard against the given suggestion id.
		 * @param suggestionId cache key.
		 * @param card SuggestionCard.
		 */
		persistCard(suggestionId: string, card: SuggestionCard) {
			try {
				window.sessionStorage.setItem(suggestionId, JSON.stringify(card));
			} catch (error) {
				//TODO: Telemetry: Unable to catch the card.
			}
		}

		/**
		 * Action handler for adaptivecard
		 * @param action An AdaptiveCards.Action
		 */
		onExecuteAction(action: AdaptiveCards.Action) {
			try {
				const cardId = Suggestion.Util.getSuggestionCardId(this._suggestionId);

				// remove blueband
				if ($("#" + cardId).hasClass(Suggestion.Constants.CardNewClass)) {
					$("#" + cardId).removeClass(Suggestion.Constants.CardNewClass);
					this._refreshCardCallback({ type: Smartassist.Suggestion.Action.CacheUpdate, data: { IsInteracted: true } });
				}

				if (action instanceof AdaptiveCards.SubmitAction) {
					
					const submitAction = <AdaptiveCards.SubmitAction>action;
					if (Suggestion.CustomActionHelper.validateCustomAction(submitAction.data, this._context)) {
						let customActionArgs: Suggestion.CustomActionArgs = { customActionParams: submitAction.data[Constants.CustomActionParams], refreshCallback: this._refreshCardCallback, controlContext: this._context };
						let customAction = {
							customActionName: submitAction.data[Constants.CustomActionName], customActionArgs: customActionArgs
						};
						
						let actionPromise = Suggestion.CustomActionHelper.invokeCustomAction(customAction);
						const notificationBarId = "resolve_" + this._suggestionId;

						actionPromise.then((data) => {
							let successMessageTemplate;
							this.removePreviousActionMessage(notificationBarId);
							if (data) {
								successMessageTemplate = ViewTemplates.CustomActionResolveIcon.Format(Constants.SuccessImageEncode, data);
								const successMessage = ViewTemplates.SuccessMessageTemplate.Format(notificationBarId, successMessageTemplate);
								$("#" + Suggestion.Util.getSuggestionCardId(this._suggestionId)).before(successMessage);
								$("#" + Suggestion.Constants.RecommendationOuterContainer + this._suggestionId).addClass(Constants.CustomActionSuccessStyle);
								$("#" + notificationBarId).ready(() => {
									$("#" + notificationBarId).attr("tabindex", -1).focus();
								})
								var self = this;
								setTimeout(() => {
									self.removePreviousActionMessage(notificationBarId);
								}, 5000);
							}
						}).catch((error) => {
							this.removePreviousActionMessage(notificationBarId);
							let errorMessageTemplate;
							if (error) {
								errorMessageTemplate = ViewTemplates.CustomActionResolveIcon.Format(Constants.ErrorImageEncode, error);
							}
							else {
								errorMessageTemplate = ViewTemplates.CustomActionResolveIcon.Format(Constants.ErrorImageEncode, LocalizedStrings.CustomActionFailureMessage);
							}
							const errorString = error ? error : LocalizedStrings.CustomActionFailureMessage;
							let errorMessage = ViewTemplates.FailureMessageTemplates.Format(notificationBarId, errorMessageTemplate);
							$("#" + Suggestion.Util.getSuggestionCardId(this._suggestionId)).before(errorMessage);
							$("#" + Suggestion.Constants.RecommendationOuterContainer + this._suggestionId).addClass(Constants.CustomActionErrorStyle);
							$("#" + notificationBarId).ready(() => {
								$("#" + notificationBarId).attr("tabindex", -1).focus();
							})
							var self = this;
							setTimeout(() => {
								self.removePreviousActionMessage(notificationBarId);
							}, 5000);
						});
					}
					else {
						let eventParameters = new TelemetryLogger.EventParameters();
						eventParameters.addParameter("CustomAction Validation", "Invalid custom action");
						RecommendationControl._telemetryReporter.logError("MainComponent", "onExecuteAction", "invalid custom action", eventParameters);
					}
				}
				else if (action instanceof AdaptiveCards.OpenUrlAction) {
					const openAction = <AdaptiveCards.OpenUrlAction>action;
					window.open(openAction.url.toString());
				}
				else {
					let eventParameters = new TelemetryLogger.EventParameters();
					eventParameters.addParameter("CustomAction", "Action not supported");
					RecommendationControl._telemetryReporter.logError("MainComponent", "onExecuteAction", "action not supported", eventParameters);
				}
			} catch (error) {
				let eventParameters = new TelemetryLogger.EventParameters();
				eventParameters.addParameter("CustomAction", "Unable to invoke custom action");
				RecommendationControl._telemetryReporter.logError("MainComponent", "onExecuteAction", "unable to invoke custom action", eventParameters);
			}
		}

		private removePreviousActionMessage(notificationBarId) {
			if ($("#" + Suggestion.Constants.RecommendationOuterContainer + this._suggestionId).hasClass(Constants.CustomActionSuccessStyle)) {
				$('#' + notificationBarId).remove();
				if (this.adaptivecardRoot) {
					this.adaptivecardRoot.renderedElement.focus();
                }
				$("#" + Suggestion.Constants.RecommendationOuterContainer + this._suggestionId).removeClass(Constants.CustomActionSuccessStyle);
			}

			if ($("#" + Suggestion.Constants.RecommendationOuterContainer + this._suggestionId).hasClass(Constants.CustomActionErrorStyle)) {
				$('#' + notificationBarId).remove();
				if (this.adaptivecardRoot) {
					this.adaptivecardRoot.renderedElement.focus();
				}
				$("#" + Suggestion.Constants.RecommendationOuterContainer + this._suggestionId).removeClass(Constants.CustomActionErrorStyle);
			}
		}

		/**
		 * Initialize the default hostconfig for the given adaptivecard.
		 * @param adaptiveCard: The adaptivecard to be displayed for the recomendation.
		 */
		initializeAdaptiveCardsHostConfig(adaptiveCard: AdaptiveCards.AdaptiveCard): void {
			adaptiveCard.hostConfig = new AdaptiveCards.HostConfig(Suggestion.hostConfig);
		}
	}
}