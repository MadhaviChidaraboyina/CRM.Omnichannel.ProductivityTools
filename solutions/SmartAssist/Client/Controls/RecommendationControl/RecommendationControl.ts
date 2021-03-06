/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>

module MscrmControls.Smartassist {
	'use strict';

	export class RecommendationControl implements Mscrm.StandardControl<IInputBag, IOutputBag> {

		private _recommendationContainer: HTMLDivElement = null;
		public static _telemetryReporter: TelemetryLogger.TelemetryLogger = null;
		public _context: Mscrm.ControlData<IInputBag> = null;
		private _template: string;
		private _data: any;
		private _suggestionId: string;
		private _adaptiveCardRenderer: Suggestion.AdaptiveCardRenderer;
		private _sessionStorageManager: Suggestion.SessionStorageManager;
		public static anchorTabContext: AppRuntimeClientSdk.ISessionContext;

		/**
		 * Empty constructor.
		 */
		constructor() {
			this._adaptiveCardRenderer = new Suggestion.AdaptiveCardRenderer(this.handleCardRefresh.bind(this));
			this._sessionStorageManager = Suggestion.SessionStorageManager.Instance;
		}

		/**
		 * This function should be used for any initial setup necessary for your control.
		 * @params context The "Input Bag" containing the parameters and other control metadata.
		 * @params notifyOutputchanged The method for this control to notify the framework that it has new outputs
		 * @params state The user state for this control set from setState in the last session
		 * @params container The div element to draw this control in
		 */
		public init(context: Mscrm.ControlData<IInputBag>, notifyOutputChanged: () => void, state: Mscrm.Dictionary, container: HTMLDivElement): void {
			// custom code goes here
			try {
				this._context = context;
				this._context.reporting.reportSuccess(Suggestion.TelemetryEventTypes.InitStarted);
				this._recommendationContainer = container;

				this._data = context.parameters.data.raw;
				this._template = context.parameters.Template.raw;

				RecommendationControl._telemetryReporter = new TelemetryLogger.TelemetryLogger(context, "MscrmControls.Smartassist.RecommendationControl")
				this._suggestionId = this._data.SuggestionId;
				this._adaptiveCardRenderer.SetContext(context);
				this._adaptiveCardRenderer.SetSuggestionId(this._suggestionId);
				var el: HTMLDivElement = document.createElement("div");
				el.className = Suggestion.Constants.RecommendationOuterContainer;
				el.id = Suggestion.Constants.RecommendationOuterContainer + this._suggestionId;
				this._recommendationContainer.appendChild(el);

				$("#" + el.id).html(Smartassist.RecommendationTemplate.get(false));
				
				Microsoft.AppRuntime.Sessions.getFocusedSession().getContext().then((context) => { RecommendationControl.anchorTabContext = context });

				this.renderRecommendation();
			} catch (error) {
				this._context.reporting.reportFailure(Suggestion.TelemetryEventTypes.InitFailed, error, "TSG-TODO", Suggestion.Util.getTelemetryParameter(null, this._suggestionId));
			}
		}

		/**
		 * Binds template and data to render the recommendation inside the 
		 * control's container.
		 * */
		private renderRecommendation(): void {
			const suggestionCardElement: Suggestion.SuggestionCardElement = this._adaptiveCardRenderer.createCardFromTemplateAndData(this._suggestionId, this._template, this._data);
			const cardId = suggestionCardElement.card.cardId;
			var cardContainer = Smartassist.Suggestion.ViewTemplates.CardContainerTemplate.Format(cardId);
			$("#" + Suggestion.Constants.RecommendationOuterContainer + this._suggestionId).append(cardContainer);
			const cardHtml = suggestionCardElement.cardHTMLElement;
			if (cardHtml) {
				$("#" + cardId).append(cardHtml);
				this._context.reporting.reportSuccess(Suggestion.TelemetryEventTypes.AdaptiveCardRenderingSucceed, Suggestion.Util.getTelemetryParameter([{ name: "UserSettingLanguage", value: this._context.userSettings.languageId }], this._suggestionId));
				if (!this._data.IsInteracted) {
					$("#" + cardId).addClass(Suggestion.Constants.CardNewClass);
                }
			}
		}

		/** 
		 * This function will recieve an "Input Bag" containing the values currently assigned to the parameters in your manifest
		 * It will send down the latest values (static or dynamic) that are assigned as defined by the manifest & customization experience
		 * as well as resource, client, and theming info (see mscrm.d.ts)
		 * @params context The "Input Bag" as described above
		 */
		public updateView(context: Mscrm.ControlData<IInputBag>): void {
			// custom code goes here
		}

		/** 
		 * This function will return an "Output Bag" to the Crm Infrastructure
		 * The ouputs will contain a value for each property marked as "input-output"/"bound" in your manifest 
		 * i.e. if your manifest has a property "value" that is an "input-output", and you want to set that to the local variable "myvalue" you should return:
		 * {
		 *		value: myvalue
		 * };
		 * @returns The "Output Bag" containing values to pass to the infrastructure
		 */
		public getOutputs(): IOutputBag {
			// custom code goes here - remove the line below and return the correct output
			return null;
		}

		/**
		 * This function will be called when the control is destroyed
		 * It should be used for cleanup and releasing any memory the control is using
		 */
		public destroy(): void {
			this._context = null;
			this._adaptiveCardRenderer = null;
		}

		public handleCardRefresh(args: Suggestion.CardRefreshArgs) {
			try {
				const suggestionId = this._suggestionId;
				const dataToOverride = args.data;
				const dataToRender = Object.assign({}, this._data, dataToOverride);
				this._data = dataToRender;
				this._sessionStorageManager.createOrUpdateRecord(suggestionId, JSON.stringify({ data: this._data }));
				const cardId = Suggestion.Util.getSuggestionCardId(suggestionId);
				var el = <HTMLElement>document.querySelector('#' + cardId);
				if (el) {
					if (args.type == Suggestion.Action.Refresh) {
						el.parentNode.removeChild(el);
						this._context.reporting.reportSuccess(Suggestion.TelemetryEventTypes.CardRefreshInitiated, Suggestion.Util.getTelemetryParameter(null, this._suggestionId));
						this.renderRecommendation();
						// After the card is refreshed, the focus should be on previous action element.
						if (args.actionType == Suggestion.CustomActionType.PopupAction) {
							this._adaptiveCardRenderer.popupAction._popupOwner.focus();
						}
						else if (this._adaptiveCardRenderer.previousActionClicked) {
							const uiElement = (<AdaptiveCards.ColumnSet>this._adaptiveCardRenderer.adaptivecardRoot.getElementById(this._adaptiveCardRenderer.previousActionClicked)).getItemAt(0);
							if (uiElement) {
								let focusable = uiElement.renderedElement.querySelectorAll("button, img");
								if (focusable.length > 0) {
									(<HTMLElement>focusable[0]).focus();
								}
							}
						}	
					}
					else if (args.type == Suggestion.Action.Dismiss) {
						let dismissEvent = new CustomEvent(Suggestion.Constants.DissmissCardAction, { detail: { id: this._suggestionId, data: dataToOverride } });
						this._context.reporting.reportSuccess(Suggestion.TelemetryEventTypes.CardDismissInitiated, Suggestion.Util.getTelemetryParameter(null, this._suggestionId));
						window.top.dispatchEvent(dismissEvent);
					}
				}

			} catch (error) {
				this._context.reporting.reportFailure(Suggestion.TelemetryEventTypes.HandleCardRefreshOrDismissFailed, error, "TSG-TODO", Suggestion.Util.getTelemetryParameter(null, this._suggestionId));
			}
		}
	}
}