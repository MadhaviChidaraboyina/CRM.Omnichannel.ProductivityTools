/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>

module MscrmControls.SmartassistPanelControl {
    'use strict';

    export class SmartassistPanelControl implements Mscrm.StandardControl<IInputBag, IOutputBag> {

        private smartAssistContainer: HTMLDivElement = null;
        public static _context: Mscrm.ControlData<IInputBag> = null;
        public static isRTL: boolean = false;
        private newInstance: boolean = false;
        private telemetryReporter: SmartassistPanelControl.TelemetryLogger;
        private AnyentityControlInitiated: boolean = false;

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
            this.telemetryReporter = new TelemetryLogger(context);
            var methodName = "init";

            // Listen for session close
            let handlerId;

            try {
                handlerId = Xrm.App.sessions.addOnAfterSessionClose(this.handleSessionClose);
                if (!context.utils.isNullOrUndefined(handlerId) &&
                    !context.utils.isNullOrEmptyString(handlerId)) {

                    localStorage.setItem(Constants.SessionCloseHandlerId, handlerId);
                    if (context.client.isRTL) {
                        SmartassistPanelControl.isRTL = true;
                    }
                    SmartassistPanelControl._context = context;
                    this.smartAssistContainer = container;
                    var SuggestionEl: HTMLDivElement = document.createElement("div");
                    SuggestionEl.id = Constants.SuggestionOuterContainer;
                    SuggestionEl.style.maxHeight = "500px";
                    SuggestionEl.style.overflow = "auto";
                    this.smartAssistContainer.appendChild(SuggestionEl);
                                        
                    //TODO: Keep local storage in separate module
                    if (!localStorage.getItem(Constants.currentContextChangeEeventId)) {

                        //Listen to the CEC context change API
                        var eventId = Microsoft.AppRuntime.Sessions.addOnContextChange((sessionContext) => this.listenCECContextChangeAPI(sessionContext));
                        //TODO: Keep local storage in separate module
                        localStorage.setItem(Constants.currentContextChangeEeventId, eventId);
                    }
                    //TODO: Remove this flag when session type available
                    this.newInstance = true;
                }
            } catch (Error) {

                let logConstants = TelemetryComponents;
                let eventParameters = new EventParameters();
                eventParameters.addParameter("handlerId", handlerId);
                let error = { name: "Smart Assist panel Control Init error", message: "Error while initializing smart assist panel control" };
                this.telemetryReporter.logError(logConstants.MainComponent, methodName, error.message, eventParameters);
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
            if (this.newInstance)
                this.renderSuggestions();   
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
        }

        public static getString(resourceName: string): string {
            if (!SmartassistPanelControl._context) {
                //TODO: add telemetry.
                return resourceName;
            }
            return SmartassistPanelControl._context.resources.getString(resourceName);
        }

        private handleSessionClose(context: XrmClientApi.EventContext) {
            let handlerId = localStorage.getItem(Constants.SessionCloseHandlerId);
            let currentContextChangeEeventId = localStorage.getItem(Constants.currentContextChangeEeventId)
            Xrm.App.sessions.removeOnAfterSessionClose(handlerId);
            Microsoft.AppRuntime.Sessions.removeOnContextChange(currentContextChangeEeventId);

            //TODO: Keep local storage in separate module
            localStorage.removeItem(Constants.currentContextChangeEeventId);
            localStorage.removeItem(Constants.currentContextAnchorEntId);
            localStorage.removeItem(Constants.currentContextCurrentCtxEntId);
        }

        /**Initialize SmartAssistAnyEntityControl to render suggestions  */
        public async renderSuggestions(): Promise<void> {
            // validate current context
            if (this.validateCurrentContext()) {

                //TODO: Keep local storage in separate module
                let recordId = localStorage.getItem(Constants.currentContextCurrentCtxEntId);
                var configs = await SAConfigDataManager.Instance.getSAConfigurations() as SmartassistPanelControl.SAConfig[];
                                
                configs = configs.sort((a, b) => (a.Order < b.Order) ? -1 : 1);

                for (let i = 0; i <= (configs.length - 1); i++) {
                    let properties: any =
                    {
                        parameters: {
                            SAConfig: {
                                Type: "Multiple",
                                Primary: false,
                                Static: true,
                                Usage: 1, // input
                                Value: configs[i]
                            },
                            RecordId: {
                                Type: "SingleLine.Text",
                                Primary: false,
                                Static: true,
                                Usage: 1, // input
                                Value: recordId
                            }
                            // TODO: Add Data Context
                        },
                        key: "AnyEntityControlComponent",
                        id: "AnyEntityControlComponent",
                    };
                    var divElement = document.createElement("div");
                    divElement.id = Constants.SuggestionInnerDiv + configs[i].SmartassistConfigurationId;

                    // Init SmartAssistAnyEntityControl
                    const anyEntityControl = SmartassistPanelControl._context.factory.createComponent("MscrmControls.SmartAssistAnyEntityControl.SmartAssistAnyEntityControl", "SmartAssistAnyEntityControl", properties);
                    SmartassistPanelControl._context.utils.bindDOMElement(anyEntityControl, divElement);
                    $("#" + Constants.SuggestionOuterContainer).append(divElement);
                }
            }
        }
        /**Re-render any entity control */
        public reRenderSuggestions() {
            var element = document.getElementById(Constants.SuggestionOuterContainer);
            element.innerHTML = '';
            this.renderSuggestions();
        }

        /**
         * CEC AddOnContextChange callback
         * @param event: Current tab opened context
         */
        public listenCECContextChangeAPI(event: any) {            
            var context = Microsoft.AppRuntime.Sessions.getFocusedSession().context;
            var anchorContext: any;

            if (event.context.pageType && event.context.pageType == Constants.CECDashboardType) {

                //TODO: Keep local storage in separate module
                localStorage.removeItem(Constants.currentContextAnchorEntId);
                localStorage.removeItem(Constants.currentContextCurrentCtxEntId);
            }
            if (!context && event.context.pageType && event.context.pageType == Constants.CECEntityRecordType) {
                //Todo:context should not null check with CEC
            }
            else {
                //Get Entity Id from anchor tab
                anchorContext = context.getTabContext("anchor") as any;
                if (anchorContext && anchorContext.entityName && anchorContext.entityId
                    && Constants.IncidentEntityName == anchorContext.entityName
                    && !Utility.isNullOrEmptyString(anchorContext.entityId)) {
                    localStorage.setItem(Constants.currentContextAnchorEntId, Utility.FormatGuid(anchorContext.entityId));
                }
            }

            //Get Entity Id from current context
            if (event && event.context && event.context.entityName && event.context.entityId && event.context.pageType
                && event.context.pageType == Constants.CECEntityRecordType
                && event.context.entityName == Constants.IncidentEntityName
                && !Utility.isNullOrEmptyString(event.context.entityId)) {
                var recordId = Utility.FormatGuid(event.context.entityId);
                var ctxEntId = localStorage.getItem(Constants.currentContextCurrentCtxEntId);
                if (ctxEntId != recordId) {
                    this.AnyentityControlInitiated = false;
                    localStorage.setItem(Constants.currentContextCurrentCtxEntId, recordId);
                    if (ctxEntId)
                        this.reRenderSuggestions();
                }
            }
            else { this.AnyentityControlInitiated = false; }
        }

        /**Validates valid case id */
        private validateCurrentContext(): boolean {
            var currentContextCurrentCtxEntId = localStorage.getItem(Constants.currentContextCurrentCtxEntId);
            var currentContextAnchorEntId = localStorage.getItem(Constants.currentContextAnchorEntId)
            if ((currentContextCurrentCtxEntId && currentContextAnchorEntId
                && currentContextCurrentCtxEntId == currentContextAnchorEntId && this.AnyentityControlInitiated == false) || (!currentContextAnchorEntId && currentContextCurrentCtxEntId)) {
                return true;
            }
            return false;
        }
    }
}