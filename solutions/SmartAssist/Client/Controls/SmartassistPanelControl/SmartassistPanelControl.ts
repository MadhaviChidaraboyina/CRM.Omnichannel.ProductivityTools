/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>

module MscrmControls.SmartassistPanelControl {
    'use strict';

    export class SmartassistPanelControl implements Mscrm.StandardControl<IInputBag, IOutputBag> {

        private smartAssistContainer: HTMLDivElement = null;
        public static _context: Mscrm.ControlData<IInputBag> = null;
        public static _telemetryReporter: TelemetryLogger.TelemetryLogger = null;
        private newInstance: boolean = false;
        private AnchorTabContext: any = null;
        private ppSessionContext: any = null;
        private previousSessionId: any = null;
        private tabSwitchEntityId: string = null;
        private anchorTabEntityId: string = null;
        private tabSwitchHandlerId: string = null;

        /**
         * Empty constructor.
         */
        constructor() {

        }

		/**
		 * This function should be used for any initial setup necessary for your control.
		 * @params context The "Input Bag" containing the parameters and other control metadata.
		 * @params notifyOutputchanged The method for this control to notify the framework that it has new outputs
		 * @params state The user state for this control set from setState in the last session
		 * @params container The div element to draw this control in
		 */
        public init(context: Mscrm.ControlData<IInputBag>, notifyOutputChanged: () => void, state: Mscrm.Dictionary, container: HTMLDivElement): void {

            // Initialize Telemetry Repoter
            SmartassistPanelControl._telemetryReporter = new TelemetryLogger.TelemetryLogger(context, Constants.ControlId);
            var methodName = "init";
            this.newInstance = true;
            this.previousSessionId = Utility.getCurrentSessionId();
            try {
                SmartassistPanelControl._context = context;
                this.smartAssistContainer = container;
                this.smartAssistContainer.setAttribute("style", Constants.SAPanelControlDivCss);

                //Control title
                var loaderElement: HTMLDivElement = document.createElement("div");
                loaderElement.innerHTML = Constants.SAPanelStyle + Constants.SAPanelTitleDiv.Format(Utility.getString(LocalizedStrings.SuggestionControlTitle), Utility.getString(LocalizedStrings.TitleIconInfoText));
                this.smartAssistContainer.appendChild(loaderElement);

                // Loader Element
                var loaderElement: HTMLDivElement = document.createElement("div");
                loaderElement.innerHTML = Constants.SAPanelLoaderDiv.Format(Utility.getString(LocalizedStrings.LoadingText));
                this.smartAssistContainer.appendChild(loaderElement);

                var SuggestionEl: HTMLDivElement = document.createElement("div");
                SuggestionEl.id = Constants.SuggestionOuterContainer;
                this.smartAssistContainer.appendChild(SuggestionEl);
                if (context.parameters.AnchorTabContext && Utility.IsValidJsonString(context.parameters.AnchorTabContext.raw)) {
                    this.AnchorTabContext = JSON.parse(context.parameters.AnchorTabContext.raw);
                }

                if (!this.tabSwitchHandlerId) {

                    //Listen to the CEC context change API
                    var eventId = Microsoft.AppRuntime.Sessions.addOnContextChange(this.listenCECContextChangeAPI.bind(this));
                    this.tabSwitchHandlerId = eventId;
                }

            } catch (Error) {
                this.hideLoader();
                let eventParameters = new TelemetryLogger.EventParameters();
                eventParameters.addParameter("Exception Details", Error.message);
                let message = "Error while initializing smart assist panel control";
                SmartassistPanelControl._telemetryReporter.logError(TelemetryComponents.MainComponent, methodName, message, eventParameters);
            }
        }

		/** 
		 * This function will recieve an "Input Bag" containing the values currently assigned to the parameters in your manifest
		 * It will send down the latest values (static or dynamic) that are assigned as defined by the manifest & customization experience
		 * as well as resource, client, and theming info (see mscrm.d.ts)
		 * @params context The "Input Bag" as described above
		 */
        public updateView(context: Mscrm.ControlData<IInputBag>): void {
            SmartassistPanelControl._context = context;
            if (context.parameters.AnchorTabContext && Utility.IsValidJsonString(context.parameters.AnchorTabContext.raw)) {
                this.AnchorTabContext = JSON.parse(context.parameters.AnchorTabContext.raw);
            }
            if (context.parameters.SessionContext && Utility.IsValidJsonString(context.parameters.SessionContext.raw)) {
                this.ppSessionContext = JSON.parse(context.parameters.SessionContext.raw);
            }
            if (this.newInstance) {
                let recordId = this.getEntityRecordId(this.AnchorTabContext);
                if (!Utility.isValidSourceEntityName(this.AnchorTabContext.entityName)
                    || Utility.isNullOrEmptyString(recordId)) {
                    // No data to PP
                    this.DispatchNoDataEvent();
                }
                this.renderSuggestions(false, this.AnchorTabContext.entityName, Utility.FormatGuid(recordId));
            }
            this.newInstance = false;
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
            Microsoft.AppRuntime.Sessions.removeOnContextChange(this.tabSwitchHandlerId);
        }

        /**
         * Load webresource for the given url in SAConfig.
         * @param saConfig saConfig
         * @param callback callback to create SmartassistAnyEntityControl
         */
        public loadWebresourceAndRenderSmartassistAnyEntity(saConfig: SAConfig, callback: (config: SAConfig, entityName, recordId: string, update: boolean) => void, entityName: string, recordId: string, update: boolean): void {
            let src = SmartassistPanelControl._context.page.getClientUrl() + "/" + saConfig.SuggestionWebResourceUrl;
            //SuggestionWebResourceUrl is empty for TPBot
            if (!document.getElementById(src) && !Utility.isNullOrEmptyString(saConfig.SuggestionWebResourceUrl)) {
                let script = document.createElement("script");
                script.onerror = function (event: ErrorEvent) {
                    let eventParameters = new TelemetryLogger.EventParameters();
                    eventParameters.addParameter("Exception Details", event.message);
                    let message = "Error while loading webresource for suggestion";
                    SmartassistPanelControl._telemetryReporter.logError(TelemetryComponents.MainComponent, "loadWebresourceAndRenderSmartassistAnyEntity", message, eventParameters);
                };
                script.onload = function () {
                    callback(saConfig, entityName, recordId, update);
                };

                script.src = src;
                script.id = src;
                script.type = "text/javascript";
                document.getElementsByTagName("head")[0].appendChild(script);
            } else {
                callback(saConfig, entityName, recordId, update);
            }
        }

        public renderSmartassistAnyEntityControl(config: SAConfig, entityName: string, recordId: string, update: boolean): void {
            const componentId = Constants.SAAnyEntityControlContainerId + config.SmartassistConfigurationId;
            let properties: any =
            {
                parameters: {
                    SAConfig: {
                        Type: "Multiple",
                        Primary: false,
                        Static: true,
                        Usage: 1, // input
                        Value: config
                    },
                    RecordId: {
                        Type: "SingleLine.Text",
                        Primary: false,
                        Static: true,
                        Usage: 1, // input
                        Value: recordId
                    },
                    PPSessionContext: {
                        type: "Multiple",
                        Primary: false,
                        Static: true,
                        Usage: 1, // input
                        Value: this.ppSessionContext
                    },
                    EmptyStatus: {
                        type: "Multiple",
                        Primary: false,
                        Static: true,
                        Usage: 1, // input
                        Value: this.checkEmptyStatus(entityName, recordId)
                    }
                },
                key: componentId,
                id: componentId,
            };
            var divElement = document.createElement("div");
            divElement.id = Constants.SuggestionInnerDiv + config.SmartassistConfigurationId;
            // Init SmartAssistAnyEntityControl
            if (update) {
                SmartassistPanelControl._context.utils.unbindDOMComponent(componentId);
            }
            let anyEntityControl = SmartassistPanelControl._context.factory.createComponent("MscrmControls.SmartAssistAnyEntityControl.SmartAssistAnyEntityControl", componentId, properties);
            SmartassistPanelControl._context.utils.bindDOMElement(anyEntityControl, divElement);
            $("#" + Utility.getConfigDivId(config.SmartassistConfigurationId)).append(divElement);
        }

        /**
         * Initialize SmartAssistAnyEntityControl to render suggestions
         * @param recordId: Anchor tab Entity id from PP control
         */
        public async renderSuggestions(update: boolean, entityName: string, recordId: string = null): Promise<void> {
            this.showLoader();
        
            var configs: SAConfig[] = await SAConfigDataManager.Instance.getFilteredSAConfig(entityName);
            configs = (configs.length > 0 ? configs : SAConfigDataManager.Instance.getSAConfigBySource(entityName));
            configs = (configs.length > 0 ? configs : await SAConfigDataManager.Instance.getCaseKMConfigByAppId());

            if (configs.length < 1) {
                // No Data to PP
                this.DispatchNoDataEvent();
            }
            configs = configs.sort((a, b) => (a.Order < b.Order) ? -1 : 1);
            for (let i = 0; i <= (configs.length - 1); i++) {
                this.addDivForSmartAssistConfig(configs[i]);
                this.loadWebresourceAndRenderSmartassistAnyEntity(configs[i], this.renderSmartassistAnyEntityControl.bind(this), entityName, recordId, update);
            }
            this.hideLoader();
        }

        private addDivForSmartAssistConfig(config: SAConfig) {
            var configDivId = Utility.getConfigDivId(config.SmartassistConfigurationId);
            if (!document.getElementById(configDivId)) {
                var divElement = document.createElement("div");
                divElement.id = configDivId;
                $("#" + Constants.SuggestionOuterContainer).append(divElement);
            }
        }

        /**
         * CEC AddOnContextChange callback
         * @param event: Current tab opened context
         */
        public async listenCECContextChangeAPI(event: any) {
            var sessionId = Utility.getCurrentSessionId()
            var context = await Microsoft.AppRuntime.Sessions.getFocusedSession().getContext();
            //Get anchor context
            var anchorContext = context.getTabContext("anchor") as any;
            var recordId = null;
            if (event && event.context && event.context.entityId) {
                recordId = Utility.FormatGuid(event.context.entityId);
            }
            if (!this.isSameSession(sessionId)) {
                if (anchorContext && anchorContext.entityName) {
                    var configs = await SAConfigDataManager.Instance.getSAConfigurations() as SmartassistPanelControl.SAConfig[];
                    //Unbind all configs- in OC both(lwi and case) configs could be present 
                    this.unbindSAConfigs(configs);

                    // to handle the ordering when settings updated
                    $("#" + Constants.SuggestionOuterContainer).empty();

                    let entityId = this.getEntityRecordId(anchorContext);
                    if (!Utility.isValidSourceEntityName(anchorContext.entityName)
                        || Utility.isNullOrEmptyString(entityId)) {
                        // No Data to PP
                        this.DispatchNoDataEvent();
                    }
                    this.anchorTabEntityId = Utility.FormatGuid(entityId);
                    this.renderSuggestions(true, anchorContext.entityName, this.anchorTabEntityId);
                }
            }
            this.tabSwitchEntityId = recordId;
            this.previousSessionId = sessionId;
        }

        /**Show loader component */
        private showLoader() {
            $("#" + Constants.SAPanelLoaderId).removeClass(Constants.hideElementCss);
        }

        /**Hide loader component */
        private hideLoader() {
            $("#" + Constants.SAPanelLoaderId).addClass(Constants.hideElementCss);
        }

        /**
         * Check for same session comparing session id
         * 
         * @param sessionId: CEC Current session id
         */
        private isSameSession(sessionId: string): boolean {
            // From home to session switch PreviousSessionId will always be null and return false.
            if (Utility.isNullOrEmptyString(this.previousSessionId) || this.previousSessionId != sessionId) {
                return false;
            }
            return true;
        }

        /**Dispatch No data event to PP */
        private DispatchNoDataEvent() {
            var sessionId = Utility.getCurrentSessionId();
            var ppRerender = new MscrmControls.PanelControl.Rerender(sessionId, true);

            // Dispatch No Data PP event 
            Utility.DispatchPanelInboundEvent(ppRerender);
        }

        /**
         * Get entity recordId from anchor Context
         * @param anchorContext: anchor tab context
         */
        private getEntityRecordId(anchorContext: any): string {
            let recordId = anchorContext.entityId;
            if (anchorContext.entityName == Constants.LWIEntityName) {
                recordId = anchorContext.data.ocContext.config.sessionParams.LiveWorkItemId;
            }
            return recordId;
        }

        /**
         * unBind given config from pane UI
         * @param configs: list of unbinding configs
         */
        private unbindSAConfigs(configs: SAConfig[]) {
            for (let i = 0; i <= (configs.length - 1); i++) {
                const componentId = Constants.SAAnyEntityControlContainerId + configs[i].SmartassistConfigurationId;
                SmartassistPanelControl._context.utils.unbindDOMComponent(componentId);
            }
        }

        /**
         * Check suggestions empty status.
         * @param entityName
         * @param entityId
         */
        private checkEmptyStatus(entityName: string, entityId: string): SuggestionsEmptyStatus {
            if (!Utility.isValidSourceEntityName(entityName) || Utility.isNullOrEmptyString(entityId)) {
                return SuggestionsEmptyStatus.InvalidSource;
            }
            var currentSession = Utility.getCurrentSessionId();
            var settings = SAConfigDataManager.Instance.suggestionsSetting[currentSession]
            if (!settings.CaseIsEnabled && !settings.KbIsEnable) {
                return SuggestionsEmptyStatus.SuggestionsDisabled;
            }
            return SuggestionsEmptyStatus.ValidSource;
        }

    }
}