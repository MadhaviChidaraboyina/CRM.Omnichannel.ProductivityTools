/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>

module MscrmControls.SmartAssistAnyEntityControl {
    'use strict';

    export class SmartAssistAnyEntityControl implements Mscrm.StandardControl<IInputBag, IOutputBag> {

        public static _context: Mscrm.ControlData<IInputBag> = null;
        private anyEntityContainer: HTMLDivElement = null;
        private initCompleted: boolean;
        private saConfig: SAConfig = null;
        private recordId: string;
        private anyEntityDataManager: AnyEntityDataManager = null;
        private parentDivId: string = "";
        private _sessionStateManager: SessionStateManager;
        private _localStorageManager: LocalStorageManager;
        private _handleDismissEvent: (args: any) => void;

		/**
		 * Empty constructor.
		 */
        constructor() {
            this.initCompleted = false;
            this.anyEntityDataManager = new AnyEntityDataManager();
            this._sessionStateManager = SessionStateManager.Instance;
            this._localStorageManager = LocalStorageManager.Instance;
            this._handleDismissEvent = this.handleDismissEvent.bind(this);
            window.top.addEventListener(StringConstants.DismissCardEvent, this._handleDismissEvent, false);
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
                    this.anyEntityContainer = container;
                    this.validateParameters(context);
                    this.recordId = context.parameters.RecordId.raw;
                    this.saConfig = context.parameters.SAConfig.raw as any;

                    // Anyentity Main Container
                    this.parentDivId = StringConstants.AnyEntityContainer + this.saConfig.SmartassistConfigurationId;
                    var anyEntityElement: HTMLDivElement = document.createElement("div");
                    anyEntityElement.id = this.parentDivId;
                    this.anyEntityContainer.appendChild(anyEntityElement);
                    this.anyEntityDataManager.initializeContextParameters(context);

                    // Anyentity inner Container with style
                    var currentElement = $("#" + this.parentDivId);
                    currentElement.html(AnyEntityTemplate.get());
                    var innerElm: HTMLDivElement = document.createElement("div");
                    innerElm.id = StringConstants.AnyEntityInnerDiv + this.saConfig.SmartassistConfigurationId;
                    $("#" + this.parentDivId).append(innerElm);

                    // Loader element
                    var loaderElement: HTMLDivElement = document.createElement("div");
                    var loaderLocale = Utility.getString(LocalizedStrings.LoadingText);
                    loaderElement.innerHTML = ViewTemplates.SALoader.Format(this.saConfig.SmartassistConfigurationId, loaderLocale);
                    $("#" + StringConstants.AnyEntityInnerDiv + this.saConfig.SmartassistConfigurationId).append(loaderElement);

                    this.initCompleted = true;
                }
                // fromcache: true; fromServer: false;
                this.InitiateSuggestionControl();
            }
            catch (error) {
                //TODO: telemetry
                console.log(error);
                this.hideLoader();
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
            this.anyEntityDataManager.initializeContextParameters(context);
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
            window.top.removeEventListener(StringConstants.DismissCardEvent, this._handleDismissEvent, false);
            this._sessionStateManager = null;
            this._localStorageManager = null;
        }

        /**
         * Intitiate Recomendation Control
         */
        public async InitiateSuggestionControl(): Promise<void> {
            this.appendTitle();
            this.showLoader();
            // Get Suggestions data records for provide saConfig
            var data = await this.anyEntityDataManager.getSuggestionsData(this.saConfig, this.recordId) as { [key: string]: any };
            var dataLength = data[this.saConfig.SmartassistConfigurationId].length;

            if (dataLength < 1) {
                var emptyRecordElm = ViewTemplates.getNoSuggestionsTemplate(this.saConfig.SuggestionType);
                $("#" + this.parentDivId).append(emptyRecordElm)
            }
            for (let i = 0; i <= (dataLength - 1); i++) {
                var record = data[this.saConfig.SmartassistConfigurationId][i];
                const componentId = Utility.getComponentId(record.SuggestionId);
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
                    key: componentId,
                    id: componentId,
                };
                var divElement = document.createElement("div");
                divElement.id = "Suggestion_" + record.SuggestionId;

                //Initiate Suggestion Control
                const suggestionControl = SmartAssistAnyEntityControl._context.factory.createComponent("MscrmControls.Smartassist.RecommendationControl", componentId, properties);
                SmartAssistAnyEntityControl._context.utils.bindDOMElement(suggestionControl, divElement);
                $("#" + StringConstants.AnyEntityInnerDiv + this.saConfig.SmartassistConfigurationId).append(divElement);
            }
            setTimeout(() => {
                this.hideLoader();
            }, StringConstants.LoaderTimeout);
        }

        /** Append title for Specific SA suggestions */
        private appendTitle() {
            var titleElement = ViewTemplates.getTitleTemplate(this.saConfig.TitleIconePath, this.saConfig.SAConfigTitle);
            $("#" + this.parentDivId).prepend(titleElement)
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
         * Handles dismiss card.
         * @param args: event argument
         */
        private handleDismissEvent(args: any) {
            try {
                const suggestionId = args.detail.id;
                const renderedSuggestionIds = this._sessionStateManager.getAllRecordsForConfigId(this.recordId, this.saConfig.SmartassistConfigurationId);

                if (renderedSuggestionIds.indexOf(suggestionId) != -1) {
                    const componentId = Utility.getComponentId(suggestionId);
                    var id = "Suggestion_" + suggestionId;
                    var el = <HTMLElement>document.querySelector('#' + id);
                    if (el) {
                        var speed = 1000;
                        var seconds = 1;
                        el.style.transition = "opacity " + seconds + "s ease";
                        el.style.opacity = "0";
                        setTimeout(function () {
                            SmartAssistAnyEntityControl._context.utils.unbindDOMComponent(componentId);
                            el.parentNode.removeChild(el);
                        }, speed);

                        this._sessionStateManager.deleteRecord(this.recordId, this.saConfig.SmartassistConfigurationId, suggestionId);
                    }

                    const dataToOverride = args.detail.data;
                    this._localStorageManager.updateSuggestionData(suggestionId, dataToOverride);
                }
            } catch (error) {
                //TODO: Telemetry: Error logged in dismiss event.
            }
        }

        /**Show loader element in the UI */
        private showLoader() {
            $("#" + StringConstants.AnyEntityInnerDiv + this.saConfig.SmartassistConfigurationId).addClass("relative-parent");
            $("#" + Utility.getLoaderComponent(this.saConfig.SmartassistConfigurationId)).removeClass(StringConstants.hideElementCss);
        }

        /**Hide loader element in the UI */
        private hideLoader() {
            $("#" + StringConstants.AnyEntityInnerDiv + this.saConfig.SmartassistConfigurationId).removeClass("relative-parent");
            $("#" + Utility.getLoaderComponent(this.saConfig.SmartassistConfigurationId)).addClass(StringConstants.hideElementCss);
        }
    }
}