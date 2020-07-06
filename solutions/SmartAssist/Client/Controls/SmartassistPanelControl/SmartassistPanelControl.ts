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
        private AnyentityControlInitiated: boolean = false;
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
            try {
                SmartassistPanelControl._context = context;
                this.smartAssistContainer = container;

                //Control title
                var loaderElement: HTMLDivElement = document.createElement("div");
                loaderElement.innerHTML = Constants.SAPanelStyle + Constants.SAPanelTitleDiv.Format(Utility.getString(LocalizedStrings.SuggestionControlTitle));
                this.smartAssistContainer.appendChild(loaderElement);

                // Loader Element
                var loaderElement: HTMLDivElement = document.createElement("div");
                loaderElement.innerHTML = Constants.SAPanelLoaderDiv.Format(Utility.getString(LocalizedStrings.LoadingText));
                this.smartAssistContainer.appendChild(loaderElement);

                var SuggestionEl: HTMLDivElement = document.createElement("div");
                SuggestionEl.id = Constants.SuggestionOuterContainer;
                SuggestionEl.style.overflow = "auto";
                this.smartAssistContainer.appendChild(SuggestionEl);
                if (context.parameters.AnchorTabContext && Utility.IsValidJsonString(context.parameters.AnchorTabContext.raw)) {
                    this.AnchorTabContext = JSON.parse(context.parameters.AnchorTabContext.raw);
                }

                if (!this.tabSwitchHandlerId) {

                    //Listen to the CEC context change API
                    var eventId = Microsoft.AppRuntime.Sessions.addOnContextChange((sessionContext) => this.listenCECContextChangeAPI(sessionContext));
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
            if (context.parameters.SessionContext && Utility.IsValidJsonString(context.parameters.SessionContext.raw)) {
                this.ppSessionContext = JSON.parse(context.parameters.SessionContext.raw);
            }
            if (this.newInstance && Constants.IncidentEntityName == this.AnchorTabContext.entityName) {
                this.showLoader();
                this.renderSuggestions(false, this.AnchorTabContext.entityId);
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
         * Initialize SmartAssistAnyEntityControl to render suggestions
         * @param recordId: Anchor tab Entity id from PP control
         */
        public async renderSuggestions(update: boolean, recordId: string = null): Promise<void> {
            // validate current context
            if (this.validateCurrentContext() || recordId) {
                if (Utility.isNullOrEmptyString(recordId)) {
                    recordId = this.tabSwitchEntityId;
                }
                var configs = await SAConfigDataManager.Instance.getSAConfigurations() as SmartassistPanelControl.SAConfig[];
                configs = configs.sort((a, b) => (a.Order < b.Order) ? -1 : 1);
                for (let i = 0; i <= (configs.length - 1); i++) {
                    const componentId = "SAAnyEntityControl_" + configs[i].SmartassistConfigurationId;
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
                            },
                            PPSessionContext: {
                                type: "Multiple",
                                Primary: false,
                                Static: true,
                                Usage: 1, // input
                                Value: this.ppSessionContext
                            }
                        },
                        key: componentId,
                        id: componentId,
                    };
                    var divElement = document.createElement("div");
                    divElement.id = Constants.SuggestionInnerDiv + configs[i].SmartassistConfigurationId;
                    // Init SmartAssistAnyEntityControl
                    if (update) {
                        SmartassistPanelControl._context.utils.unbindDOMComponent(componentId);
                    }
                    let anyEntityControl = SmartassistPanelControl._context.factory.createComponent("MscrmControls.SmartAssistAnyEntityControl.SmartAssistAnyEntityControl", componentId, properties);
                    SmartassistPanelControl._context.utils.bindDOMElement(anyEntityControl, divElement);
                    $("#" + Constants.SuggestionOuterContainer).append(divElement);
                }
                this.hideLoader();
            }
        }

        /**Re-render any entity control */
        public reRenderSuggestions() {
            this.showLoader();
            var element = document.getElementById(Constants.SuggestionOuterContainer);
            element.innerHTML = '';

            this.renderSuggestions(true);
        }

        /**
         * CEC AddOnContextChange callback
         * @param event: Current tab opened context
         */
        public listenCECContextChangeAPI(event: any) {
            var context = Microsoft.AppRuntime.Sessions.getFocusedSession().context;
            var anchorContext: any;

            if (!context && event.context.pageType && event.context.pageType == Constants.CECEntityRecordType) {
                //Todo:context should not null check with CEC
            }
            else {
                //Get Entity Id from anchor tab
                anchorContext = context.getTabContext("anchor") as any;
                if (anchorContext && anchorContext.entityName && anchorContext.entityId
                    && Constants.IncidentEntityName == anchorContext.entityName
                    && !Utility.isNullOrEmptyString(anchorContext.entityId)) {
                    this.anchorTabEntityId = anchorContext.entityId
                }
            }

            //Get Entity Id from current context
            if (event && event.context && event.context.entityName && event.context.entityId && event.context.pageType
                && event.context.pageType == Constants.CECEntityRecordType
                && event.context.entityName == Constants.IncidentEntityName
                && !Utility.isNullOrEmptyString(event.context.entityId)) {
                var recordId = Utility.FormatGuid(event.context.entityId);
                if (this.tabSwitchEntityId != recordId) {
                    this.AnyentityControlInitiated = false;
                    this.tabSwitchEntityId = recordId;
                    if (this.anchorTabEntityId) {
                        // Re-render Suggestions for tab switch
                        this.reRenderSuggestions();
                    }
                }
            }
            else { this.AnyentityControlInitiated = false; }
        }

        /**Validates valid case id */
        private validateCurrentContext(): boolean {
            var currentContextCurrentCtxEntId = this.tabSwitchEntityId;
            var currentContextAnchorEntId = this.anchorTabEntityId;
            if ((currentContextCurrentCtxEntId && currentContextAnchorEntId
                && currentContextCurrentCtxEntId == currentContextAnchorEntId && this.AnyentityControlInitiated == false) || (!currentContextAnchorEntId && currentContextCurrentCtxEntId)) {
                return true;
            }
            return false;
        }

        /**Show loader component */
        private showLoader() {
            $("#" + Constants.SAPanelLoaderId).removeClass(Constants.hideElementCss);
        }

        /**Hide loader component */
        private hideLoader() {
            $("#" + Constants.SAPanelLoaderId).addClass(Constants.hideElementCss);
        }
    }
}