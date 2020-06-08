/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../CommonReferences.ts"/>
/// <reference path="../../../TypeDefinitions/adaptivecards-templating.d.ts"/>
//import * from 'adaptivecards-templating/template-engine';

module MscrmControls.Smartassist.Recommendation {
	export class AdaptiveCardHelper {

		/**
		 * This method binds the template and data using adaptivecards-template sdk.
		 * @param template AdaptiveCard template
		 * @param data Data to bind with adaptive card
		 */
		public static getCardFromTemplateAndData(template: string, data: any): any { 
			try {
				const templatePayload = JSON.parse(template);
				const cardTemplate = new ACData.Template(templatePayload);

				const dataToBind: any = data;
				var context: ACData.IEvaluationContext = {
					$root: dataToBind
				};

				const card = cardTemplate.expand(context);
				const adaptiveCard = new AdaptiveCards.AdaptiveCard();
				AdaptiveCardHelper.initializeAdaptiveCardsHostConfig(adaptiveCard);
				AdaptiveCards.AdaptiveCard.elementTypeRegistry.registerType(Recommendation.Constants.PopupActionName, () => { return new PopupAction(dataToBind.filterActionTag, dataToBind.id); });
				adaptiveCard.parse(card);
				this.onActionHandler(adaptiveCard);
				const htmlElement = adaptiveCard.render();
				return htmlElement;
			} catch (error) {
				// TODO: Telemetry for erors in template parsing.
            }
		}

		/**
		 * Action handler for adaptivecard.
		 * @param adaptiveCard: Card to
		 */
		public static onActionHandler(adaptiveCard: AdaptiveCards.AdaptiveCard): void {
			adaptiveCard.onExecuteAction = (action: AdaptiveCards.Action) => {
				/* TODO */
			}
		}

		/**
		 * Initialize the default hostconfig for the given adaptivecard.
		 * @param adaptiveCard: The adaptivecard to be displayed for the recomendation.
		 */
		public static initializeAdaptiveCardsHostConfig(adaptiveCard: AdaptiveCards.AdaptiveCard): void {
			adaptiveCard.hostConfig = new AdaptiveCards.HostConfig(Recommendation.hostConfig);
		}
	}
}