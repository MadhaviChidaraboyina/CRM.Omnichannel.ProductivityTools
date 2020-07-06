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
		private _localStorageManager: Suggestion.LocalStorageManager;

		constructor(refreshCallback: (args: Suggestion.CardRefreshArgs) => void) {
			this._refreshCardCallback = refreshCallback;
			this._localStorageManager = Suggestion.LocalStorageManager.Instance;
		}

		public SetContext(context: Mscrm.ControlData<IInputBag>) {
			this._context = context;
		}

		public SetSuggestionId(suggestionId) {
			this._suggestionId = suggestionId;
		}

		/**
		 * Create or get the suggestion card from caches.
		 * @param suggestionId This id is used to fetch the card from caches.
		 * @param template AdaptiveCard template.
		 * @param data Data to bind with template.
		 */
		getOrCreateSuggestionCard(suggestionId: string, template: string, data: any): SuggestionCardElement {
			try {
				const cacheResult = window.localStorage.getItem(suggestionId);
				let cacheData: SuggestionCard;
				if (cacheResult) {
					cacheData = JSON.parse(window.localStorage.getItem(suggestionId));
				}
				if (cacheData && cacheData.cardId && cacheData.cardContent) {
					const htmlElement = this.createAdaptiveCard(cacheData.cardContent);
					return { card: cacheData, cardHTMLElement: htmlElement };
				}
				else {

					return this.createCardFromTemplateAndData(suggestionId, template, data);
				}
			} catch (error) {
				// TODO: Telemetry.
				return null;
			}
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
				// TODO: Telemetry for erors in template parsing.
				return null;
			}
		}

		createAdaptiveCard(cardContent: any): HTMLElement {
			const adaptiveCard = new AdaptiveCards.AdaptiveCard();
			this.initializeAdaptiveCardsHostConfig(adaptiveCard);
			AdaptiveCards.AdaptiveCard.elementTypeRegistry.registerType(Suggestion.Constants.PopupActionName, () => { return new PopupAction(this.onExecuteAction.bind(this)) });
			adaptiveCard.parse(cardContent);
			adaptiveCard.onExecuteAction = this.onExecuteAction.bind(this);
			const htmlElement = adaptiveCard.render();
			return htmlElement;
		}

		/**
		 * This method is used to cache the SuggestionCard against the given suggestion id.
		 * @param suggestionId cache key.
		 * @param card SuggestionCard.
		 */
		persistCard(suggestionId: string, card: SuggestionCard) {
			try {
				window.localStorage.setItem(suggestionId, JSON.stringify(card));
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
				if (action instanceof AdaptiveCards.SubmitAction) {
					const submitAction = <AdaptiveCards.SubmitAction>action;
					if (Suggestion.CustomActionHelper.validateCustomAction(submitAction.data, this._context)) {
						let customActionArgs: Suggestion.CustomActionArgs = { customActionParams: submitAction.data[Constants.CustomActionParams], refreshCallback: this._refreshCardCallback };
						let customAction = {
							customActionName: submitAction.data[Constants.CustomActionName], customActionArgs: customActionArgs
						};
						
						let actionPromise = Suggestion.CustomActionHelper.invokeCustomAction(customAction);
						const notificationBarId = "resolve_" + this._suggestionId;
						const successMessageTemplate = ViewTemplates.CustomActionResolveIcon.Format(Constants.SuccessImageEncode, CustomActionHelper.getString(this._context, LocalizedStrings.CustomActionSuccessMessage));
						const successMessage = ViewTemplates.SuccessMessageTemplate.Format(notificationBarId, successMessageTemplate);
						const errorMessageTemplate = ViewTemplates.CustomActionResolveIcon.Format(Constants.ErrorImageEncode, CustomActionHelper.getString(this._context, LocalizedStrings.CustomActionFailureMessage));
						let errorMessage = ViewTemplates.FailureMessageTemplates.Format(notificationBarId, errorMessageTemplate);

						actionPromise.then((data) => {

							$("#" + Suggestion.Util.getSuggestionCardId(this._suggestionId)).before(successMessage);
							$("#" + Suggestion.Constants.RecommendationOuterContainer + this._suggestionId).addClass(Constants.CustomActionSuccessStyle);
							setTimeout(() => {
								$('#' + notificationBarId).remove();
								$("#" + Suggestion.Constants.RecommendationOuterContainer + this._suggestionId).removeClass(Constants.CustomActionSuccessStyle);
							}, 3000);

						}).catch((e) => {
							$("#" + Suggestion.Util.getSuggestionCardId(this._suggestionId)).before(errorMessage);
							$("#" + Suggestion.Constants.RecommendationOuterContainer + this._suggestionId).addClass(Constants.CustomActionErrorStyle);
							setTimeout(() => {
								$('#' + notificationBarId).remove();
								$("#" + Suggestion.Constants.RecommendationOuterContainer + this._suggestionId).removeClass(Constants.CustomActionErrorStyle);
							}, 3000);
						});
					}
					else {
						//TODO: Telemetry for invalid action
					}
				}
				else if (action instanceof AdaptiveCards.OpenUrlAction) {
					const openAction = <AdaptiveCards.OpenUrlAction>action;
					window.open(openAction.url.toString());
				}
				else {
					//TODO: Telemetry for any other adaptivecard action.
				}
			} catch (error) {
				//TODO: Telemetry
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