/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>

module MscrmControls.Smartassist
{
	'use strict';

	export class RecommendationControl implements Mscrm.StandardControl<IInputBag, IOutputBag> {

		private _recommendationContainer: HTMLDivElement = null;
		public _context: Mscrm.ControlData<IInputBag> = null;
		private _template: string;
		private _data: any;
		private _dataContext: any;
		private _suggestionId: string;
		private _adaptiveCardRenderer: Recommendation.AdaptiveCardRenderer;
		/**
		 * Empty constructor.
		 */
		constructor()
		{
			this._adaptiveCardRenderer = new Recommendation.AdaptiveCardRenderer();
		}

		/**
		 * This function should be used for any initial setup necessary for your control.
		 * @params context The "Input Bag" containing the parameters and other control metadata.
		 * @params notifyOutputchanged The method for this control to notify the framework that it has new outputs
		 * @params state The user state for this control set from setState in the last session
		 * @params container The div element to draw this control in
		 */
		public init(context: Mscrm.ControlData<IInputBag>, notifyOutputChanged: () => void, state: Mscrm.Dictionary, container: HTMLDivElement): void
		{
			// custom code goes here
			try {
				this._context = context;
				this._recommendationContainer = container;

				this._data = context.parameters.data.raw;
				this._template = context.parameters.Template.raw;
				if (context.parameters.DataContext) {
					this._dataContext = context.parameters.DataContext.raw;
				}

				this._suggestionId = this._data.SuggestionId;
				this._adaptiveCardRenderer.SetContext(context);
				this._adaptiveCardRenderer.SetSuggestionId(this._suggestionId);
				var el: HTMLDivElement = document.createElement("div");
				el.className = Recommendation.Constants.RecommendationOuterContainer;
				el.id = Recommendation.Constants.RecommendationOuterContainer + this._suggestionId;
				this._recommendationContainer.appendChild(el);
	
				$("#" + el.id).html(Smartassist.RecommendationTemplate.get(false));
				this.renderRecommendation();
			} catch (error) {
				/* TODO: Add Telemetry logs  */
            }
		}

		/**
		 * Binds template and data to render the recommendation inside the 
		 * control's container.
		 * */
		private renderRecommendation(): void {
			var finalObject = Object.assign({}, this._data, this._dataContext);
			const suggestionCardElement: Recommendation.SuggestionCardElement = this._adaptiveCardRenderer.getOrCreateSuggestionCard(this._suggestionId, this._template, finalObject);
			const cardId = suggestionCardElement.card.cardId;
			var cardContainer = Smartassist.Recommendation.ViewTemplates.CardContainerTemplate.Format(cardId);
			$("#" + Recommendation.Constants.RecommendationOuterContainer + this._suggestionId).append(cardContainer);
			const cardHtml = suggestionCardElement.cardHTMLElement;
			if (cardHtml) {
				$("#" + cardId).append(cardHtml);
				// Adding css style for the new card.
				if (suggestionCardElement.card.cardState == Recommendation.CardState.New) {
					$("#" + cardId).addClass(Recommendation.Constants.CardNewClass);
				}
			}
		}

		/** 
		 * This function will recieve an "Input Bag" containing the values currently assigned to the parameters in your manifest
		 * It will send down the latest values (static or dynamic) that are assigned as defined by the manifest & customization experience
		 * as well as resource, client, and theming info (see mscrm.d.ts)
		 * @params context The "Input Bag" as described above
		 */
		public updateView(context: Mscrm.ControlData<IInputBag>): void
		{
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
		public getOutputs(): IOutputBag
		{
			// custom code goes here - remove the line below and return the correct output
			return null;
		}

		/**
		 * This function will be called when the control is destroyed
		 * It should be used for cleanup and releasing any memory the control is using
		 */
		public destroy(): void
		{
			this._context = null;
			this._adaptiveCardRenderer = null;
		}
	}
}