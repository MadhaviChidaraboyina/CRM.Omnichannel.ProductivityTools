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
        private anchorTabEntityId: string = null;
        private tabSwitchHandlerId: string = null;
        private telemetryHelper: TelemetryHelper;
        private smartAssistInfoIconElement: HTMLDivElement;

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
                SmartassistPanelControl._context.reporting.reportSuccess(TelemetryEventTypes.InitStarted);
                this.smartAssistContainer = container;
                this.smartAssistContainer.setAttribute("style", Constants.SAPanelControlDivCss);

                if (context.parameters.AnchorTabContext && Utility.IsValidJsonString(context.parameters.AnchorTabContext.raw)) {
                    this.AnchorTabContext = JSON.parse(context.parameters.AnchorTabContext.raw);
                }

                //Control title
                this.smartAssistInfoIconElement = document.createElement("div");
                this.setSmartAssistInfoIconText(this.AnchorTabContext);
                this.smartAssistContainer.appendChild(this.smartAssistInfoIconElement);

                var panelInfoIcon = document.getElementById(Constants.SAPanelInfoIcon);
                panelInfoIcon.onclick = (e) => {
                    Utility.toggleTooltip();
                }
                panelInfoIcon.onkeydown = (e: KeyboardEvent) => {
                    switch (e.keyCode) {
                        case KeyCodes.ENTER_KEY:
                            Utility.toggleTooltip();
                            break;
                        case KeyCodes.ESCAPE_KEY:
                            var popup = document.getElementById('IconPopOutId');
                            if (popup.classList.contains('show')) {
                                Utility.toggleTooltip();
                            }
                            break;
                    }
                }

                // Loader Element
                var loaderElement: HTMLDivElement = document.createElement("div");
                loaderElement.innerHTML = Constants.SAPanelLoaderDiv.Format(Utility.getString(LocalizedStrings.LoadingText));
                this.smartAssistContainer.appendChild(loaderElement);

                var SuggestionEl: HTMLDivElement = document.createElement("div");
                SuggestionEl.id = Constants.SuggestionOuterContainer;
                this.smartAssistContainer.appendChild(SuggestionEl);


                if (!this.tabSwitchHandlerId) {

                    //Listen to the CEC context change API
                    var eventId = Microsoft.AppRuntime.Sessions.addOnContextChange(this.listenCECContextChangeAPI.bind(this));
                    this.tabSwitchHandlerId = eventId;
                }

                this.telemetryHelper = new TelemetryHelper(Utility.FormatGuid(this.getEntityRecordId(this.AnchorTabContext)), this.AnchorTabContext.entityName);
                this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.InitCompleted, null);
            } catch (error) {
                this.hideLoader();
                this.telemetryHelper.logTelemetryError(TelemetryEventTypes.InitFailed, error, null);
            }
        }

        /** 
         * This function will recieve an "Input Bag" containing the values currently assigned to the parameters in your manifest
         * It will send down the latest values (static or dynamic) that are assigned as defined by the manifest & customization experience
         * as well as resource, client, and theming info (see mscrm.d.ts)
         * @params context The "Input Bag" as described above
         */
        public updateView(context: Mscrm.ControlData<IInputBag>): void {
            this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.UpdateViewStarted, null);
            SmartassistPanelControl._context = context;
            if (context.parameters.AnchorTabContext && Utility.IsValidJsonString(context.parameters.AnchorTabContext.raw)) {
                this.AnchorTabContext = JSON.parse(context.parameters.AnchorTabContext.raw);
            }
            this.telemetryHelper.updateValues(Utility.FormatGuid(this.getEntityRecordId(this.AnchorTabContext)), this.AnchorTabContext.entityName);
            if (context.parameters.SessionContext && Utility.IsValidJsonString(context.parameters.SessionContext.raw)) {
                this.ppSessionContext = JSON.parse(context.parameters.SessionContext.raw);
            }

            if (this.newInstance) {
                let recordId = this.getEntityRecordId(this.AnchorTabContext);
                this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.SessionInitStarted, null);
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
        public async loadWebresourceAndRenderSmartassistAnyEntity(
            saConfig: SAConfig,
            callback: (config: SAConfig, emptyStatus: AnyEntityContainerState, recordId: string, update: boolean, locString?: string) => void,
            emptyStatus: AnyEntityContainerState,
            recordId: string,
            update: boolean,
            telemetryHelper: TelemetryHelper): Promise<void> {

            let src = SmartassistPanelControl._context.page.getClientUrl() + "/" + saConfig.SuggestionWebResourceUrl;
            //SuggestionWebResourceUrl is empty for TPBot
            if (!document.getElementById(src) && !Utility.isNullOrEmptyString(saConfig.SuggestionWebResourceUrl)) {
                let script = document.createElement("script");
                script.onerror = function (event: ErrorEvent) {
                    document.getElementsByTagName("head")[0].removeChild(script);
                    telemetryHelper.logTelemetryError(TelemetryEventTypes.WebresourceLoadingFailed, new Error("Webresource loading failed"), null);
                    callback(saConfig, emptyStatus, recordId, update);
                };
                script.onload = function () {
                    telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.WebresourceLoadedSuccessfully, null);
                    callback(saConfig, emptyStatus, recordId, update);
                };

                script.src = src;
                script.id = src;
                script.type = "text/javascript";
                document.getElementsByTagName("head")[0].appendChild(script);
            } else {
                callback(saConfig, emptyStatus, recordId, update);
            }
        }

        public renderSmartassistAnyEntityControl(config: SAConfig, emptyStatus: AnyEntityContainerState, recordId: string, update: boolean): void {
            this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.RenderingSmartAssistAnyEntityControl, null);
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
                    AnyEntityContainerState: {
                        type: "Multiple",
                        Primary: false,
                        Static: true,
                        Usage: 1, // input
                        Value: emptyStatus
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
            this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.UpdateViewStarted, null);
            this.showLoader();

            // Get Configs to display suggestions
            var configs: SAConfig[] = await SAConfigDataManager.Instance.getFilteredSAConfig(entityName, this.telemetryHelper);

            var emptyStatus: AnyEntityContainerState = await this.checkEmptyStatus(entityName, recordId, configs);
            if (configs.length < 1 || emptyStatus != AnyEntityContainerState.Enabled) {
                this.telemetryHelper.logTelemetryError(TelemetryEventTypes.ConfigNotFound, new Error("SA config not found Or AI settings are disabled"), null);
                // No Data to PP
                this.DispatchNoDataEvent();
            }
            configs = configs.sort((a, b) => (a.Order < b.Order) ? -1 : 1);
            for (let i = 0; i <= (configs.length - 1); i++) {
                this.addDivForSmartAssistConfig(configs[i]);
                this.loadWebresourceAndRenderSmartassistAnyEntity(configs[i], this.renderSmartassistAnyEntityControl.bind(this), emptyStatus, recordId, update, this.telemetryHelper);
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

            // update recordId and entityName in telemetry helper;
            this.telemetryHelper.updateValues(Utility.FormatGuid(this.getEntityRecordId(anchorContext)), anchorContext.entityName);
            this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.SessionSwitchCECEventReceived, null);
            if (!this.isSameSession(sessionId)) {
                if (anchorContext && anchorContext.entityName) {
                    var configs = await SAConfigDataManager.Instance.getSAConfigurations(this.telemetryHelper) as SmartassistPanelControl.SAConfig[];
                    //Unbind all configs- in OC both(lwi and case) configs could be present 
                    this.unbindSAConfigs(configs);

                    // to handle the ordering when settings updated
                    $("#" + Constants.SuggestionOuterContainer).empty();
                    let entityId = this.getEntityRecordId(anchorContext);
                    this.anchorTabEntityId = Utility.FormatGuid(entityId);

                    this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.SessionSwitchDetected,
                        [
                            { name: "PrevSessionId", value: this.previousSessionId },
                            { name: "CurrentSessionId", value: sessionId }
                        ]);
                    this.renderSuggestions(true, anchorContext.entityName, this.anchorTabEntityId);
                }
            }
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
            if (anchorContext.entityName == Constants.LWIEntityName && anchorContext.data != null) {
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
                this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.UnbindingOldSAAnyEntityControl, null);
            }
        }

        /**
         * Check suggestions empty status.
         * @param entityName
         * @param entityId
         */
        private async checkEmptyStatus(entityName: string, entityId: string, configs: SAConfig[]) {
            try {
                if (!Utility.isValidSourceEntityName(entityName) || Utility.isNullOrEmptyString(entityId)) {
                    return AnyEntityContainerState.NoSuggestions;
                }
                var currentSession = Utility.getCurrentSessionId();
                var settings = await SAConfigDataManager.Instance.getSuggestionsSetting(currentSession, this.telemetryHelper);
                var botConfig = configs.find(i => i.SuggestionType == SuggestionType.BotSuggestion);
                if (!botConfig) {
                    this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.ThirdPartyBotDisabled, null);
                }
                if (!settings) {
                    this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.DIAPackageNotInstalled, null);
                    if (!botConfig) {
                        return AnyEntityContainerState.Disabled;
                    }
                    return AnyEntityContainerState.Enabled;
                }
                if (!settings.CaseIsEnabled) {
                    this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.CaseSettingDisabled, null);
                }
                if (!settings.KbIsEnable) {
                    this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.KBSettingDisabled, null);
                }
                if (!settings.CaseIsEnabled && !settings.KbIsEnable && !botConfig) {
                    this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.AllConfigsDisabled, null);
                    return AnyEntityContainerState.Disabled;
                }
                return AnyEntityContainerState.Enabled;
            } catch (error) {
                this.telemetryHelper.logTelemetryError(TelemetryEventTypes.ErrorInCheckEmptyStatus, error, null);
                return AnyEntityContainerState.Enabled;
            }
        }

        /**
         * Set icon text.
         * @param anchorContext
         */
        private setSmartAssistInfoIconText(anchorContext: any) {
            this.smartAssistInfoIconElement.innerHTML= "";
            const infoIconString = anchorContext && anchorContext.entityName === Constants.LWIEntityName ? LocalizedStrings.LWITitleIconInfoText : LocalizedStrings.TitleIconInfoText;
            this.smartAssistInfoIconElement.innerHTML = Constants.SAPanelStyle + Constants.SAPanelTitleDiv.Format(Utility.getString(LocalizedStrings.SuggestionControlTitle), Utility.getString(infoIconString), Utility.getString(LocalizedStrings.InfoIcon));
        }
    }
}