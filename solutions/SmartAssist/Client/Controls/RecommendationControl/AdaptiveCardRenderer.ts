/**
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
		public adaptivecardRoot: AdaptiveCards.AdaptiveCard;
		public previousActionClicked: string;

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

				this._context.reporting.reportSuccess(TelemetryEventTypes.TemplateParsingCompleted, Util.getTelemetryParameter(null, this._suggestionId));

				// double bind template with merged data(loc strings + suggestion data) to support nested dynamic strings
				// first bind: "${KnowledgeSuggestions_ConfidenceText}" -> "${confidencescore}% confidence"
				// second bind: "${confidencescore}% confidence" -> "90% confidence"
				const tempCardTemplate = new ACData.Template(templatePayload);
				const dataToBind: any = data;
				var context: ACData.IEvaluationContext = {
					$root: dataToBind
				};
				const tempCard = tempCardTemplate.expand(context);
				const cardTemplate = new ACData.Template(tempCard);
				const card = cardTemplate.expand(context);

				const suggestionCard: SuggestionCard = { cardId: cardId, cardContent: card, cardState: CardState.New };

				const htmlElement = this.createAdaptiveCard(card);

				// TODO: To be removed and configure in adaptive card when uptaking adaptivecard >= 2.3 version
				htmlElement.removeAttribute("tabindex");				

				const suggestionCardElement: SuggestionCardElement = { card: suggestionCard, cardHTMLElement: htmlElement };

				
				return suggestionCardElement;
			} catch (error) {
				this._context.reporting.reportFailure(TelemetryEventTypes.AdaptiveCardRenderingFailed, error, "TSG-TODO", Util.getTelemetryParameter([{ name: "UserSettingLanguage", value: this._context.userSettings.languageId }], this._suggestionId));
				return null;
			}
		}

		createAdaptiveCard(cardContent: any): HTMLElement {
			const adaptiveCard = new AdaptiveCards.AdaptiveCard();
			this.initializeAdaptiveCardsHostConfig(adaptiveCard);
			Suggestion.PopupAction.onExecuteAction = this.onExecuteAction.bind(this);
			AdaptiveCards.AdaptiveCard.elementTypeRegistry.registerType(Suggestion.Constants.PopupActionName, () => { return new Suggestion.PopupAction(); });
			adaptiveCard.parse(cardContent);
			adaptiveCard.onExecuteAction = this.onExecuteAction.bind(this);
			adaptiveCard.onElementVisibilityChanged = this.onVisibilityChanged.bind(this);
			const htmlElement = adaptiveCard.render();
			Suggestion.PopupAction.onExecuteAction = null;
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
			// Validate if it is the info paragram is updated. If it is we update the screenreader section to announce the change.
			// We take the second paragraph as the information context while the first one for title.
			if (element && element.renderedElement) {
				let text = element.renderedElement.querySelectorAll('p');
				if (text.length >= 2) {
					let notification = document.getElementById(Suggestion.Constants.ScreenReaderClassId);
					if (notification) {
						Suggestion.Util.cleanUpContext(notification);
						let theText = document.createTextNode(text[1].textContent);
						notification.appendChild(theText);
					}
				}
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
				this.setPreviousActionClick(action);

				const executionStart = Date.now();
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

						let actionPromise = Suggestion.CustomActionHelper.invokeCustomAction(customAction, this._context);
						const notificationBarId = "resolve_" + this._suggestionId;

						// log telemetry for custom action invocation
						this._context.reporting.reportSuccess(TelemetryEventTypes.CustomActionInvocationSuccess, Util.getTelemetryParameter([
							{ name: "ActionName", value: submitAction.data[Constants.CustomActionName] },
							{ name: "UserSettingLanguage", value: this._context.userSettings.languageId }
						], this._suggestionId));

						actionPromise.then((customActionReturn: CustomActionReturn) => {
							const executionTime = Date.now() - executionStart;
							let successMessageTemplate;
							this.removePreviousActionMessage(notificationBarId);

							let data;
							if (customActionReturn) {
								data = customActionReturn.notificationMessage;
							}
							AdaptiveCardRenderer.logTelemetryForCustomActions(this._context, true, "", customActionReturn, executionTime + "ms");
							if (data) {
								successMessageTemplate = ViewTemplates.CustomActionResolveIcon.Format(Constants.SuccessImageEncode, data);
								const successMessage = ViewTemplates.SuccessMessageTemplate.Format(notificationBarId, successMessageTemplate);
								$("#" + Suggestion.Util.getSuggestionCardId(this._suggestionId)).before(successMessage);
								$("#" + Suggestion.Constants.RecommendationOuterContainer + this._suggestionId).addClass(Constants.CustomActionSuccessStyle);
								var self = this;
								setTimeout(() => {
									self.removePreviousActionMessage(notificationBarId);
								}, 5000);
							}
						}).catch((customActionReturn: CustomActionReturn) => {
							const executionTime = Date.now() - executionStart;
							let error;
							if (customActionReturn) {
								error = customActionReturn.notificationMessage;
							}
							
							this.removePreviousActionMessage(notificationBarId);
							let errorMessageTemplate;
							if (error) {
								errorMessageTemplate = ViewTemplates.CustomActionResolveIcon.Format(Constants.ErrorImageEncode, error);
							}
							else {
								errorMessageTemplate = ViewTemplates.CustomActionResolveIcon.Format(Constants.ErrorImageEncode, CustomActionHelper.getString(this._context, LocalizedStrings.CustomActionFailureMessage));
							}
							const errorString = error ? error : CustomActionHelper.getString(this._context, LocalizedStrings.CustomActionFailureMessage);
							AdaptiveCardRenderer.logTelemetryForCustomActions(this._context, false, errorString, customActionReturn, executionTime + "ms");
							let errorMessage = ViewTemplates.FailureMessageTemplates.Format(notificationBarId, errorMessageTemplate);
							$("#" + Suggestion.Util.getSuggestionCardId(this._suggestionId)).before(errorMessage);
							$("#" + Suggestion.Constants.RecommendationOuterContainer + this._suggestionId).addClass(Constants.CustomActionErrorStyle);
							var self = this;
							setTimeout(() => {
								self.removePreviousActionMessage(notificationBarId);
							}, 5000);
						});
					}
					else {
						this._context.reporting.reportFailure(TelemetryEventTypes.CustomActionValidationFailed, new Error("Invalid custom action"), "TSG-TODO", Util.getTelemetryParameter(null, this._suggestionId));
					}
				}
			} catch (error) {
				this._context.reporting.reportFailure(TelemetryEventTypes.CustomActionActivityFailed, error, "TSG-TODO", Util.getTelemetryParameter(null, this._suggestionId));
			}
		}

		/**
		 * Get column id which is a parent to this action element.
		 * @param action
		 */
		private setPreviousActionClick(action: AdaptiveCards.Action) {
			// This is required to resolve the accessibility issue for focusing Link/Unlink button on KB and SimilarCase card.
			// After the card is refreshed, the previous action image should be focused.
			if (action.parent && (action.parent.parent instanceof AdaptiveCards.Column)) {
				this.previousActionClicked = action.parent.parent.id;
			}
			else {
				this.previousActionClicked = null;
            }
		}

		private removePreviousActionMessage(notificationBarId) {
			if ($("#" + Suggestion.Constants.RecommendationOuterContainer + this._suggestionId).hasClass(Constants.CustomActionSuccessStyle)) {
				$('#' + notificationBarId).remove();
				$("#" + Suggestion.Constants.RecommendationOuterContainer + this._suggestionId).removeClass(Constants.CustomActionSuccessStyle);
			}

			if ($("#" + Suggestion.Constants.RecommendationOuterContainer + this._suggestionId).hasClass(Constants.CustomActionErrorStyle)) {
				$('#' + notificationBarId).remove();
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

		private static logTelemetryForCustomActions(context: Mscrm.ControlData<IInputBag>, success: boolean, message: string, customActionReturn: CustomActionReturn, executionTime: string) {
			if (!customActionReturn || !customActionReturn.telemetryContext) {
				return;
            }
			var telemetryParameter = customActionReturn.telemetryContext.telemetryParameters;
			var additionalTelemetry = customActionReturn.telemetryContext.additionalTelemetryParameters;
			let eventparams: Mscrm.EventParameter[] = [];
			const entityContext = Util.getSuggestedForRecordIdAndEntityLogicalName();
			eventparams.push({ name: "SuggestionForEntityId", value: entityContext.recordId });
			eventparams.push({ name: "SuggestedForEntityLogicalName", value: entityContext.entityLogicalName });
			if (telemetryParameter) {
				for (let param in telemetryParameter) {
					if (telemetryParameter[param]) {
						eventparams.push({ name: param, value: telemetryParameter[param] });
					}
				}
			}
			if (additionalTelemetry) {
				for (let param in telemetryParameter) {
					eventparams.push({ name: param, value: telemetryParameter[param] });
				}
			}
			eventparams.push({ name: "ExecutionTime", value: executionTime });
			
			if (success) {
				context.reporting.reportSuccess(TelemetryEventTypes.CustomActionActivitySuccess, eventparams);
			}
			else {
				const suggestedMitigation = "TSG guide -TODO";
				context.reporting.reportFailure(TelemetryEventTypes.CustomActionActivityFailed, new Error(message), suggestedMitigation, eventparams);
            }
        }
	}
}