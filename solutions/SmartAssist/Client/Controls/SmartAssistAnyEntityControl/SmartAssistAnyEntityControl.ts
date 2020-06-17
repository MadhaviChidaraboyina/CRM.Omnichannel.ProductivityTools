/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>

module MscrmControls.SmartAssistAnyEntityControl {
    'use strict';

    export class SmartAssistAnyEntityControl implements Mscrm.StandardControl<IInputBag, IOutputBag> {

        private static _context: Mscrm.ControlData<IInputBag> = null;
        private initCompleted: boolean;
        private saConfig: SAConfig = null;
        private recordId: string;
        private anyEntityDataManager: AnyEntityDataManager = null

		/**
		 * Empty constructor.
		 */
        constructor() {
            this.initCompleted = false;
            this.anyEntityDataManager = new AnyEntityDataManager();
        }

		/**
		 * This function should be used for any initial setup necessary for your control.
		 * @params context The "Input Bag" containing the parameters and other control metadata.
		 * @params notifyOutputchanged The method for this control to notify the framework that it has new outputs
		 * @params state The user state for this control set from setState in the last session
		 * @params container The div element to draw this control in
		 */
        public init(context: Mscrm.ControlData<IInputBag>, notifyOutputChanged: () => void, state: Mscrm.Dictionary, container: HTMLDivElement): void {
            try {
                if (this.initCompleted == false) {
                    SmartAssistAnyEntityControl._context = context;
                    this.validateParameters(context);
                    this.recordId = context.parameters.RecordId.raw;
                    this.saConfig = context.parameters.SAConfig.raw as any;
                    window.top.addEventListener('dismissCard', this.handleDismissEvent, false);
                    this.initCompleted = true;
                }
                this.InitiateSuggestionControl()
            }
            catch (error) {
                //TODO: telemetry
                console.log(error);
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

        }

        /**
         * Intitiate Recomendation Control
         */
        public async InitiateSuggestionControl(): Promise<void> {
            // Get Suggestions data records for provide saConfig
            var data = await this.anyEntityDataManager.getSuggestionsData(this.saConfig, this.recordId, true) as { [key: string]: any };
            var dataLength = data[this.saConfig.SmartassistConfigurationId].length;

            this.appendTitle();
            if (dataLength < 1) {
                var emptyRecordElm = document.createElement("div");
                for (let style in Styles.TitleDivStyle) {
                    emptyRecordElm.style[style] = Styles.TitleDivStyle[style];
                }
                emptyRecordElm.style.marginTop = "10px";
                switch (this.saConfig.SuggestionType) {
                    case SuggestionType.KnowledgeArticleSuggestion:
                        emptyRecordElm.innerHTML = `<img src="${StringConstants.NoRecordDivIcon}" style="height:16px;width:16px; margin-right:5px"><label style="font-family:Segoe UI;font-size:11px;line-height:20px;align-items:center;color:#8A8886">${StringConstants.NoKnowledgeArticleText}</label>`
                        break;
                    case SuggestionType.SimilarCaseSuggestion:
                        emptyRecordElm.innerHTML = `<img src="${StringConstants.NoRecordDivIcon}" style="height:14px;width:14px;margin-right:5px"><label style="font-family:Segoe UI;font-size:11px;line-height:20px;align-items:center;color:#8A8886">${StringConstants.NoSimilarCaseText}</label>`
                        break;
                    default:
                }
                $("#" + StringConstants.SuggestionInnerDiv + this.saConfig.SmartassistConfigurationId).append(emptyRecordElm)
            }
            for (let i = 0; i <= (dataLength - 1); i++) {
                var record = data[this.saConfig.SmartassistConfigurationId][i];
                let properties: any =
                {
                    parameters: {
                        data: {
                            Type: "Multiple",
                            Primary: false,
                            Static: true,
                            Usage: 1, // input
                            Value: record
                        },
                        Template: {
                            Type: "Multiple",
                            Primary: false,
                            Static: true,
                            Usage: 1,
                            Value: this.saConfig.ACTemplate
                        },
                        DataContext: {
                            Type: "Multiple",
                            Primary: false,
                            Static: true,
                            Usage: 1,
                            Value: { resource: "" }
                        }
                    },
                    key: "Suggestion_" + record.SuggestionId,
                    id: "Suggestion_" + record.SuggestionId,
                };
                var divElement = document.createElement("div");
                divElement.id = "Suggestion_" + record.SuggestionId;

                //Initiate Suggestion Control
                const suggestionControl = SmartAssistAnyEntityControl._context.factory.createComponent("MscrmControls.Smartassist.RecommendationControl", "RecommendationControl", properties);
                SmartAssistAnyEntityControl._context.utils.bindDOMElement(suggestionControl, divElement);
                $("#" + StringConstants.SuggestionInnerDiv + this.saConfig.SmartassistConfigurationId).append(divElement)
            }
        }

        /** Append title for Specific SA suggestions */
        private appendTitle() {
            var titleElement = document.createElement("div");
            for (let style in Styles.TitleDivStyle) {
                titleElement.style[style] = Styles.TitleDivStyle[style];
            }
            switch (this.saConfig.SuggestionType) {
                case SuggestionType.KnowledgeArticleSuggestion:
                    titleElement.innerHTML = `<img src="${StringConstants.KnowledgeArticleEncodedIcon}" style="height:16px;width:16px; margin-right:5px"><label style="font-family:Segoe UI;font-size:12px;line-height:16px;align-items:center">${StringConstants.KnowledgeArticleTitle}</label>`
                    break;
                case SuggestionType.SimilarCaseSuggestion:
                    titleElement.innerHTML = `<img src="${StringConstants.CaseEncodedIcon}" style="height:14px;width:14px;margin-right:5px"><label style="font-family:Segoe UI;font-size:12px;line-height:16px;align-items:center;">${StringConstants.SimilarCaseTitle}</label>`
                    break;
                default:
            }
            $("#" + StringConstants.SuggestionInnerDiv + this.saConfig.SmartassistConfigurationId).append(titleElement)
        }

        /**
         * Validates input parameters
         * @param context: The "Input Bag" containing the parameters and other control metadata.
         */
        private validateParameters(context: Mscrm.ControlData<IInputBag>) {
            if (context.utils.isNullOrUndefined(context.parameters.SAConfig) ||
                context.utils.isNullOrUndefined(context.parameters.RecordId)) {
                // one or more required parameters are null or undefined
                let errorMessage = "In-correct parameters are passed";
                //todo: Add telemetry     
                throw errorMessage;
            }
        }

        /**
         * Handles dismiss suggestions action
         * @param args: event argument
         */
        private handleDismissEvent(args: any) {
            var id = "Suggestion_" + args.detail;
            var el = <HTMLElement>document.querySelector('#' + id);
            var speed = 1000;
            var seconds = 1;
            el.style.transition = "opacity " + seconds + "s ease";
            el.style.opacity = "0";
            setTimeout(function () {
                el.parentNode.removeChild(el);
            }, speed);
        }

        /**
         * Get localized value
         * @param resourceName: Localized resource constant
         */
        public static getString(resourceName: string): string {
            if (this._context) {
                return resourceName;
            }
            return this._context.resources.getString(resourceName);
        }
    }
}