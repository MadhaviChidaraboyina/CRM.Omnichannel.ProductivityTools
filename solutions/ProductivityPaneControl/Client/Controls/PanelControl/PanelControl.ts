/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="utils/Constants.ts"/>
/// <reference path="utils/PanelControlManager.ts"/>
/// <reference path="privatereferences.ts"/>
/// <reference path="utils/TelemetryLogger.ts"/>
/// <reference path="Styles/ControlStyle.ts"/>
/// <reference path="SessionChangeManager/SessionChangeManager.ts"/>

module MscrmControls.ProductivityToolPanel {
    'use strict';

    export class ProductivityPanelControl implements Mscrm.Control<IInputBag, IOutputBag> {

        private initCompleted: boolean;
        private context: Mscrm.ControlData<IInputBag>;
        private dataManager: DataManager;
        private panelState: PanelState;
        private productivityToolSelected: string;
        private panelToggle: boolean;
        private currentSessionId: string;
        private telemetryContext: string;
        private telemetryLogger: TelemetryLogger;
        protected notifyOutputChanged: () => void;
        public productivityPaneConfigData: ProductivityPaneConfig;
        public isDataFetched: boolean;

        private sessionChangeManager: SessionChangeManager;
        private controls: Mscrm.Component[];
        private isSessionChanged: boolean;
        private notificationCount: number;
		/**
		 * Constructor.
		 */
        constructor() {
            this.initCompleted = false;
            this.telemetryContext = TelemetryComponents.MainComponent;
            this.productivityPaneConfigData = new ProductivityPaneConfig(false, false);
        }

		/**
		 * This function should be used for any initial setup necessary for your control.
		 * @params context The "Input Bag" containing the parameters and other control metadata.
		 * @params notifyOutputchanged The method for this control to notify the framework that it has new outputs
		 * @params state The user state for this control set from setState in the last session
		 * @params container The div element to draw this control in
		 */
        public init(context: Mscrm.ControlData<IInputBag>, notifyOutputChanged: () => void, state: Mscrm.Dictionary): void {
            if (this.initCompleted == false) {
                this.context = context;
                this.telemetryLogger = new TelemetryLogger(context);
                this.notifyOutputChanged = notifyOutputChanged;
                this.dataManager = new DataManager(context);
                this.panelState = new PanelState(context);
                this.isDataFetched = false;
                this.retrieveIntitialData();
                this.initCompleted = true;
                let params = new EventParameters();
                this.telemetryLogger.logSuccess(this.telemetryContext, "Init", params);
                this.currentSessionId = Constants.emptyString;
                this.sessionChangeManager = new SessionChangeManager(this.onSessionContextChanged.bind(this), this.telemetryLogger);
                this.panelToggle = false;
                this.productivityToolSelected = Constants.agentGuidance;
                localStorage.setItem(LocalStorageKeyConstants.productivityToolDataModel, JSON.stringify({}));
            }


        }

        private onSessionContextChanged(sessionContextData: SessionChangeEventData, actionType: string): void {
            this.isSessionChanged = true;
            this.currentSessionId = this.sessionChangeManager.getCurrentFocusedSessionId();

            if (this.currentSessionId == Constants.homeSessionId) {
                this.isSessionChanged = false;
                this.currentSessionId = Constants.emptyString;
                sessionContextData.newSessionId = Constants.emptyString;
                this.context.utils.requestRender();
            }
            else {

                if (actionType === Constants.sessionCreated) {
                    const data = {
                        productivityToolSelected: Constants.agentGuidance,
                        panelToggle: this.productivityPaneConfigData.productivityPaneMode,
                        notificationCount: 0
                    }
                    PanelState.SetState(sessionContextData.newSessionId + LocalStorageKeyConstants.sessionData, data);
                }
                if (actionType === Constants.sessionSwitched) {
                    let sessionData = PanelState.getState(sessionContextData.newSessionId + LocalStorageKeyConstants.sessionData);
                    this.productivityToolSelected = sessionData.productivityToolSelected;
                    this.panelToggle = sessionData.panelToggle;
                    this.notificationCount = sessionData.notificationCount;
                    this.context.utils.requestRender();
                }
                if (actionType === Constants.sessionClosed) {
                    PanelState.DeleteState(sessionContextData.newSessionId + LocalStorageKeyConstants.sessionData);
                }
            }
        }

		/**
		 * getPanelContainer generates a side panel.
		 */
        private getPanelContainer(): Mscrm.Component {
            let isRTL = this.context.client.isRTL;
            let sessionContextJSON = JSON.stringify(this.sessionChangeManager.getSessionChangeEventData());
            let isCallScriptAvail = this.panelState.checkAgentScript(this.currentSessionId);
            let isSmartassistAvail = this.panelState.checkSmartAssist(this.currentSessionId);
            const properties_agentguidance: any = {
                parameters: {},
                key: Constants.agentGuidanceControlKey,
                id: Constants.agentGuidanceControlKey,
                configuration: {
                    CustomControlId: Constants.agentGuidanceControlId,
                    Name: Constants.agentGuidanceControlName,
                    Parameters: {
                        SessionContext: {
                            Usage: 1,
                            Static: true,
                            Value: sessionContextJSON,
                            Primary: false,
                            Attributes: { isCallScript: isCallScriptAvail, isSmartassist: isSmartassistAvail },
                            Callback: (value: any) => {
                                if (!this.panelToggle) {
                                    const data = {
                                        productivityToolSelected: this.productivityToolSelected,
                                        panelToggle: this.panelToggle,
                                        notificationCount: ++this.notificationCount
                                    }
                                    PanelState.SetState(this.currentSessionId + LocalStorageKeyConstants.sessionData, data);
                                }
                                this.context.utils.requestRender();
                            },
                        },
                    },
                }
            };

            let agentguidance = this.context.factory.createComponent(
                "MscrmControls.ProductivityTool.AgentGuidance",
                "agentguidancechild1",
                properties_agentguidance
            );

            const panelContainer = this.context.factory.createElement(
                "CONTAINER",
                {
                    id: Constants.panelContainerId,
                    key: "panelContainer",
                    style: this.panelToggle ? ControlStyle.getProductivityPaneStyle(Constants.TRUE, isRTL) : ControlStyle.getProductivityPaneStyle(Constants.FALSE, isRTL)
                },
                agentguidance);

            return panelContainer;
        }

        private getProductivityToolSelectionIndicator(buttonId: string): Mscrm.Component {
            const indicatorContainer = this.context.factory.createElement(
                "CONTAINER",
                {
                    id: `${Constants.toolIndicatorId}${buttonId}`,
                    key: "productivityToolIndicatorContainer",
                    style: (this.productivityToolSelected === buttonId && this.panelToggle) ? ControlStyle.getSelectionIndicatorStyle(Constants.TRUE) : ControlStyle.getSelectionIndicatorStyle(Constants.FALSE)
                },
                Constants.emptyString);

            return indicatorContainer;
        }


		/**
		 * getProductivityToolButton generates the toggle button.
		 */

        private getProductivityToolButton(iconId: string, iconPath: string, buttonId: string, selectionIndicator: boolean, toolTip: string, properties: any = {}): Mscrm.Component {
            const icon = this.getProductivityToolIcon(iconId, iconPath);
            let btnProperties = {
                id: buttonId,
                key: buttonId,
                onClick: this.onButtonClick.bind(this, buttonId),
                style: (this.productivityToolSelected === buttonId && this.panelToggle) ? ControlStyle.getProductivityPanelBtnStyle(Constants.TRUE) : ControlStyle.getProductivityPanelBtnStyle(Constants.FALSE)
            };
            if (Object.keys(properties).length != 0) {
                for (let i in properties)
                    btnProperties[i] = properties[i];
            }

            const toggleButton = this.context.factory.createElement(
                "BUTTON",
                btnProperties,
                [icon, (!this.panelToggle && this.notificationCount > 0 && buttonId == Constants.agentGuidance) ? this.notificationContainer() : Constants.emptyString, selectionIndicator ? this.getProductivityToolSelectionIndicator(buttonId) : Constants.emptyString]);

            const listItem = this.context.factory.createElement(
                "LISTITEM",
                {
                    id: `${Constants.listItemId}${buttonId}`,
                    key: `${Constants.listItemId}${buttonId}`,
                    style: {
                        display: "flex"
                    },
                    title: this.context.resources.getString(toolTip)
                },
                toggleButton);

            return listItem;
        }

        private getNavBarLastContainer(): Mscrm.Component {
            const lastContainer = this.context.factory.createElement(
                "CONTAINER",
                {
                    id: "productivity-tools-last-button-container",
                    key: "productivityToolLastContainer",
                    style: ControlStyle.getNavigationBarLastContainer()
                },
                "");

            return lastContainer;
        }

        private toolSeparator(): Mscrm.Component {
            const separator = this.context.factory.createElement(
                "Label",
                {
                    id: Constants.toolSeparatorId,
                    key: Constants.toolSeparatorId,
                    style: ControlStyle.toolSeparatorStyle(this.panelToggle)
                },
                Constants.emptyString);

            const listItem = this.context.factory.createElement(
                "LISTITEM",
                {
                    id: `${Constants.listItemId}${Constants.toolSeparatorId}`,
                    key: `${Constants.listItemId}${Constants.toolSeparatorId}`,
                    style: {
                        display: "flex"
                    }
                },
                separator);

            return listItem;
        }

        private notificationContainer(): Mscrm.Component {
            const notificationLabel = this.context.factory.createElement(
                "Label",
                {
                    id: Constants.notificationLabelId,
                    key: Constants.notificationLabelId,
                    style: ControlStyle.getNotificationLabelStyle()
                },
                this.notificationCount);

            const notificationContainer = this.context.factory.createElement(
                "CONTAINER",
                {
                    id: Constants.notificationContainerId,
                    key: Constants.notificationContainerId,
                    style: ControlStyle.getNotificationContainerStyle()
                },
                notificationLabel);

            return notificationContainer;
        }

        private getproductivityToolButtons(): Mscrm.Component {
            let listItems: Mscrm.Component[] = [];
            let iconPath;
            let toolTip;
            if (this.panelToggle) {
                iconPath = Constants.panelToggleExpand;
                toolTip = Constants.collpaseToolTip;
            }
            else {
                iconPath = Constants.panelToggleCollpase;
                toolTip = Constants.expandToolTip;
            }

            const toggleButton = this.getProductivityToolButton(Constants.toggleIconId, iconPath, Constants.toggle, false, toolTip, { "accessibilityLabel": String.format("{0} {1}", this.context.resources.getString(toolTip), this.context.resources.getString('CC_Panel_Control')) });
            const agentGuidanceButton = this.getProductivityToolButton(Constants.agentScriptIconId, Constants.agentScriptIcon, Constants.agentGuidance, true, Constants.agentGuidanceTooltip, { "accessibilityLabel": this.context.resources.getString(Constants.agentGuidanceTooltip) });
            const toolSeparator = this.toolSeparator();

            listItems.push(toggleButton);
            listItems.push(toolSeparator);
            listItems.push(agentGuidanceButton);

            const buttonContainer = this.context.factory.createElement(
                "LIST",
                {
                    id: "productivity-tools-button-container",
                    key: "productivityToolContainer",
                    role: "list"
                },
                listItems);

            return buttonContainer;
        }

		/**
		 * This function will recieve an "Input Bag" containing the values currently assigned to the parameters in your manifest
		 * It will send down the latest values (static or dynamic) that are assigned as defined by the manifest & customization experience
		 * as well as resource, client, and theming info (see mscrm.d.ts)
		 * @params context The "Input Bag" as described above
		 */
        public updateView(context: Mscrm.ControlData<IInputBag>): Mscrm.Component {
            let isRTL = context.client.isRTL;
            // fetch data 
            let navbarContainer;
            if (this.isDataFetched) {
                let paneState = this.productivityPaneConfigData.productivityPaneState;
                //this.panelToggle = this.productivityPaneConfigData.productivityPaneMode;
                if (paneState == true) {
                    this.panelState.storeSessionTemplateIdInLocStorage(this.currentSessionId);
                    this.panelState.storeLiveWorkStreamIdInLocStorage(this.currentSessionId);
                    if(!this.panelState.checkAgentScriptAndSmartAssistBot(this.currentSessionId))
                    {
                        this.setSidePanelControlState(SidePanelControlState.Hidden);
                        return navbarContainer;
                    }

                    this.controls = [];
                    if (this.isSessionChanged ) {
                        this.controls.push(this.getproductivityToolButtons());
                        this.controls.push(this.getNavBarLastContainer());
                        this.controls.push(this.getPanelContainer());
                    }
                    navbarContainer = this.context.factory.createElement(
                        "CONTAINER",
                        {
                            id: "navbar-container-container",
                            key: "navbarContainer",
                            style: ControlStyle.getProductivityNavBarStyle(isRTL)
                        },
                        this.controls
                    );
                    if (!(this.currentSessionId === Constants.emptyString)) {
                        if (this.panelToggle) {
                            this.setSidePanelControlState(SidePanelControlState.Expand);
                        } else {
                            this.setSidePanelControlState(SidePanelControlState.Collpase);
                        }
                    }
                    else {
                        this.setSidePanelControlState(SidePanelControlState.Hidden);
                    }
                }
                else {
                    this.setSidePanelControlState(SidePanelControlState.Hidden);
                }
            }
            else {
                this.setSidePanelControlState(SidePanelControlState.Hidden);
            }

            return navbarContainer;
        }

        private setSidePanelControlState(stateId: number): void {
            let methodName = "setSidePanelControlState";
            try {
                PanelControlManager.toggleSidePanelControl(stateId);
            }
            catch (error) {
                let eventParams = new EventParameters();
                eventParams.addParameter("message", "Failed to set sidePanel state");
                this.telemetryLogger.logError(this.telemetryContext, methodName, error, eventParams);
            }
        }

        private toggleButtonClick(): void {
            if (!this.panelToggle) {
                if (this.productivityToolSelected === Constants.emptyString) {
                    this.productivityToolSelected = Constants.agentGuidance;
                }
                this.setSidePanelControlState(SidePanelControlState.Expand);
                this.notificationCount = 0;
            }
            else {
                this.setSidePanelControlState(SidePanelControlState.Collpase);
            }
            this.panelToggle = !this.panelToggle;
            const data = {
                productivityToolSelected: this.productivityToolSelected,
                panelToggle: this.panelToggle,
                notificationCount: this.notificationCount
            }
            PanelState.SetState(this.currentSessionId + LocalStorageKeyConstants.sessionData, data);
            this.context.utils.requestRender();
        }

        private productivityToolButtonClick(buttonId: string): void {
            if (!this.panelToggle) {
                this.setSidePanelControlState(SidePanelControlState.Expand);
                this.panelToggle = !this.panelToggle;
                this.productivityToolSelected = buttonId;
            }
            if (!(this.productivityToolSelected === buttonId)) {
                this.productivityToolSelected = buttonId;
            }
            if (buttonId == Constants.agentGuidance) {
                this.notificationCount = 0;
            }
            const data = {
                productivityToolSelected: this.productivityToolSelected,
                panelToggle: this.panelToggle,
                notificationCount: this.notificationCount
            }
            PanelState.SetState(this.currentSessionId + LocalStorageKeyConstants.sessionData, data);
            this.context.utils.requestRender();
        }

        private onButtonClick(buttonId: string): void {
            if (buttonId === Constants.toggle) {
                this.toggleButtonClick();
            }
            else {
                this.productivityToolButtonClick(buttonId);
            }
        }

        private getProductivityToolIcon(iconId: string, iconPath: string): Mscrm.Component {
            const icon = this.context.factory.createElement("IMG", {
                id: iconId,
                source: iconPath,
                style: {
                    verticalAlign: "middle"
                }
            });
            return icon;
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
            delete localStorage[LocalStorageKeyConstants.productivityToolDataModel];
        }

        public retrieveIntitialData() {
            let methodName = 'retrieveIntitialData';
            try {
                //get application name
                Xrm.Utility.getGlobalContext().getCurrentAppProperties().then(
                    (properties: { [key: string]: string }) => {
                        if (!this.context.utils.isNullOrUndefined(properties)) {
                            let appName = properties["uniqueName"];

                            //get productivity pane configuration data
                            this.dataManager.getProductivityPaneConfigData(appName).then(
                                (configData: ProductivityPaneConfig) => {
                                    this.productivityPaneConfigData = configData;
                                    this.isDataFetched = true;
                                    this.context.utils.requestRender();
                                },
                                (error: XrmClientApi.ErrorResponse) => {
                                    let errorParam = new EventParameters();
                                    errorParam.addParameter("errorObj", JSON.stringify(error));
                                    this.telemetryLogger.logError(this.telemetryContext, 'getProductivityPaneConfigData', error.message, errorParam);
                                }
                            );
                        }
                    },
                    (error: XrmClientApi.ErrorResponse) => {
                        let errorParam = new EventParameters();
                        errorParam.addParameter("errorObj", JSON.stringify(error));
                        this.telemetryLogger.logError(this.telemetryContext, 'Failed to fetch app name at getProductivityPaneConfigData().', error.message, errorParam);
                    });
            }
            catch (e) {
                let errorParam = new EventParameters();
                errorParam.addParameter("errorObj", JSON.stringify(e));
                this.telemetryLogger.logError(this.telemetryContext, methodName, e.message, errorParam);
            }
        }
    }
}