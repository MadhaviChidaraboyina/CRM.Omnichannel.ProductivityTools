/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="utils/Constants.ts"/>
/// <reference path="utils/PanelControlManager.ts"/>
/// <reference path="privatereferences.ts"/>
/// <reference path="utils/TelemetryLogger.ts"/>
/// <reference path="Styles/ControlStyle.ts"/>
/// <reference path="SessionChangeManager/SessionChangeManager.ts"/>
/// <reference path="Communication/EventManager.ts"/>
/// <reference path="DataManager/DataManager.ts" />
/// <reference path="PanelStateManager/PanelState.ts" />
/// <reference path="Models/ProductivityPaneConfig.ts" />
/// <reference path="Models/ProductivityToolsConfig.ts" />


module MscrmControls.PanelControl {
    'use strict';

    export class PanelControl implements Mscrm.Control<IInputBag, IOutputBag> {

        private initCompleted: boolean;
        private eventManager: EventManager;
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
        private productivityToolButtonContainerId:string = "productivity-tools-button-container";
        private productivityToolButtonIds: string[];
        /**
         * Constructor.
         */
        constructor() {
            this.initCompleted = false;
            this.telemetryContext = TelemetryComponents.MainComponent;
            this.productivityPaneConfigData = new ProductivityPaneConfig(false, false, new ProductivityToolsConfig());
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
                this.productivityToolSelected = Constants.emptyString;
                this.panelState.init();
                this.eventManager = new EventManager(this.context, this.panelState);
                this.productivityToolButtonIds = [];
            }
        }

        private isBeethovenChatWidgetSession(sessionId: string): boolean {
            // Temporary workaround for disabling legacy pane control in chat widget session.
            // Legacy pane control will be removed after Oct release
            try {
                const session = Xrm.App.sessions.getSession(sessionId) as any;
                if (session && session.anchorTab && session.anchorTab.currentPageInput && session.anchorTab.currentPageInput.data) {
                    return JSON.parse(session.anchorTab.currentPageInput.data).pageType === "chatDemo";
                }
            }
            catch (e) {
            }
            return false;
        }

        private onSessionContextChanged(sessionContextData: SessionChangeEventData, actionType: string): void {
            this.isSessionChanged = true;
            this.currentSessionId = sessionContextData.newSessionId;

            if (this.currentSessionId == Constants.homeSessionId ||
                this.isDataFetched == false ||
                this.isBeethovenChatWidgetSession(this.currentSessionId)) {
                this.isSessionChanged = false;
                this.currentSessionId = Constants.emptyString;
                sessionContextData.newSessionId = Constants.emptyString;
                this.context.utils.requestRender();
            }
            else {
                if (actionType === Constants.sessionCreated) {
                    this.setSessionData(sessionContextData.newSessionId);
                }
                if (actionType === Constants.sessionSwitched) {
                    let sessionData = this.panelState.getState(sessionContextData.newSessionId + LocalStorageKeyConstants.sessionData);
                    if (this.context.utils.isNullOrUndefined(sessionData)) {
                        //event recieved out of order
                        this.setSessionData(sessionContextData.newSessionId);
                        sessionData = this.panelState.getState(sessionContextData.newSessionId + LocalStorageKeyConstants.sessionData);
                    }

                    this.productivityToolSelected = sessionData.productivityToolSelected;
                    this.panelToggle = sessionData.panelToggle;

                    this.eventManager.CurrentSessionId = this.currentSessionId;
                    if (this.panelToggle) {
                        this.eventManager.SelectedTool = this.productivityPaneConfigData.getToolByName(this.productivityToolSelected).toolControlName;
                        this.setNotificationCountToZero();
                    }
                    this.context.utils.requestRender();
                }
                if (actionType === Constants.sessionClosed) {
                    this.panelState.DeleteState(sessionContextData.newSessionId + LocalStorageKeyConstants.sessionData);
                    this.panelState.DeleteState(sessionContextData.newSessionId + LocalStorageKeyConstants.notificationCount);
                    this.currentSessionId = this.sessionChangeManager.getCurrentFocusedSessionId();
                    if (this.currentSessionId == Constants.homeSessionId) {
                        this.isSessionChanged = false;
                        this.currentSessionId = Constants.emptyString;
                    }
                }
            }
        }

        private setSessionData(sessionId: string) {
            const data = {
                productivityToolSelected: this.productivityPaneConfigData.getDefaultTool().toolName,
                panelToggle: this.productivityPaneConfigData.productivityPaneMode,
                isCollapsedByUser: false,
                isToggledByUser: false
            }
            for (let tool of this.productivityPaneConfigData.productivityToolsConfig.ToolsList) {
                data[LocalStorageKeyConstants.hasData + tool.toolControlName] = true;
            }
            this.panelState.SetState(sessionId + LocalStorageKeyConstants.sessionData, data);
        }

        /**
         * getPanelContainer generates a side panel.
         */
        private getToolsContainer(): Mscrm.Component {
            let isRTL = this.context.client.isRTL;
            let sessionContextJSON = JSON.stringify(this.sessionChangeManager.getSessionChangeEventData());
            let anchorTabContextJSON = JSON.stringify(this.sessionChangeManager.AnchorTabContext);
            let sessionData = this.panelState.getState(this.currentSessionId + LocalStorageKeyConstants.sessionData);
            let toolSelected: ToolConfig = this.productivityPaneConfigData.getToolByName(sessionData.productivityToolSelected);

            let toolsList: Mscrm.Component[] = [];
            this.productivityPaneConfigData.productivityToolsConfig.ToolsList.forEach((tool, index) => {

                let props: any = {
                    parameters: {
                        SessionContext: {
                            Usage: 1,
                            Static: true,
                            Value: sessionContextJSON,
                            Primary: false
                        },
                        AnchorTabContext: {
                            Usage: 1,
                            Static: true,
                            Value: anchorTabContextJSON,
                            Primary: false
                        },
                        IsLoadedInPanel: {
                            Usage: 1,
                            Static: true,
                            Value: true,
                            Primary: false
                        },
                        StaticData: {
                            Usage: 1,
                            Static: true,
                            Value: tool.staticData,
                            Primary: false
                        },
                        IsSelected: {
                            Usage: 1,
                            Static: true,
                            Value: (tool.toolControlName === toolSelected.toolControlName) ? true : false,
                            Primary: false
                        }
                    },
                    key: Constants.productivitytoolControlKey + index,
                    id: Constants.productivitytoolControlKey + index
                };

                let toolComponent = this.context.factory.createComponent(
                    tool.toolControlName,
                    "productivitytoolchild" + index,
                    props
                );

                toolsList.push(this.context.factory.createElement(
                    "CONTAINER",
                    {
                        id: "toolContainer" + index,
                        key: "toolContainer" + index,
                        style: (toolSelected.toolName === tool.toolName) ? ControlStyle.isToolVisible(Constants.TRUE) : ControlStyle.isToolVisible(Constants.FALSE),
                    },
                    toolComponent));
            });

            const panelContainer = this.context.factory.createElement(
                "CONTAINER",
                {
                    id: Constants.panelContainerId,
                    key: "panelContainer",
                    style: this.panelToggle ? ControlStyle.getProductivityPaneStyle(Constants.TRUE, isRTL) : ControlStyle.getProductivityPaneStyle(Constants.FALSE, isRTL)
                },
                toolsList);

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

        private getProductivityToolButton(iconId: string, iconPath: string, buttonId: string, selectionIndicator: boolean, toolTip: string, properties: any = {}, notificationCount: number, toolIndex: number): Mscrm.Component {
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
                [icon, this.getNotificationContainer(notificationCount, toolIndex), selectionIndicator ? this.getProductivityToolSelectionIndicator(buttonId) : Constants.emptyString]);

            const listItem = this.context.factory.createElement(
                "LISTITEM",
                {
                    id: `${Constants.listItemId}${buttonId}`,
                    key: `${Constants.listItemId}${buttonId}`,
                    style: {
                        display: "flex"
                    },
                    title: this.context.resources.getString(toolTip),
                    role: "listitem",
                    onKeyDown: (event) => this.handleKeyDownEventOnToolButton(event, toolIndex)
                    ,
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


        private getNotificationContainer(notificationCount: number, toolIndex: number): any {

            if (notificationCount == 0) {
                return Constants.emptyString;
            }

            //notificationLabel shows the total count of notification, since we are not showing count
            //and not using notificationLabel but keeping for future
            const notificationLabel = this.context.factory.createElement(
                "Label",
                {
                    id: Constants.notificationLabelId,
                    key: Constants.notificationLabelId,
                    style: ControlStyle.getNotificationLabelStyle()
                },
                notificationCount);

            const notificationContainer = this.context.factory.createElement(
                "CONTAINER",
                {
                    id: Constants.notificationContainerId,
                    key: Constants.notificationContainerId,
                    style: ControlStyle.getNotificationContainerStyle(toolIndex + 1)
                },
                Constants.emptyString);

            return notificationContainer;
        }

        private getNotificationCountForTool(controlName: string): number {
            let count = 0;
            let sessionNotification: {} = this.panelState.getState(this.currentSessionId + LocalStorageKeyConstants.notificationCount);
            if (!this.context.utils.isNullOrUndefined(sessionNotification) && sessionNotification.hasOwnProperty(controlName) && !this.context.utils.isNullOrUndefined(sessionNotification[controlName])) {
                count = sessionNotification[controlName];
            }

            return count;
        }

        private getproductivityToolButtons(): Mscrm.Component {
            let listItems: Mscrm.Component[] = [];
            let buttonIds: string[] = [];
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

            const toggleButton = this.getProductivityToolButton(Constants.toggleIconId, iconPath, Constants.toggle, false, toolTip, { "accessibilityLabel": String.format("{0} {1}", this.context.resources.getString(toolTip), this.context.resources.getString('CC_Panel_Control')) }, Constants.toggleButtonNotification, Constants.toggleButtonNotification);
            listItems.push(toggleButton);

            this.productivityPaneConfigData.productivityToolsConfig.ToolsList.forEach((tool, index) => {
                if (tool.isEnabled) {
                    let iconPath = this.getToolIcon(tool);
                    const toolButton = this.getProductivityToolButton(tool.toolName + "Icon", iconPath, tool.toolName, true, tool.tooltip, { "accessibilityLabel": this.context.resources.getString(tool.tooltip) }, this.getNotificationCountForTool(tool.toolControlName), index);
                    buttonIds.push(`${Constants.PanelControlIdPrefix}${tool.toolName}`)
                    listItems.push(toolButton);
                }
            });

            this.productivityToolButtonIds = buttonIds;
            const buttonContainer = this.context.factory.createElement(
                "LIST",
                {
                    id: this.productivityToolButtonContainerId,
                    key: "productivityToolContainer",
                    role: "list",
                },
                listItems);

            return buttonContainer;
        }

        private getToolIcon(tool: ToolConfig): string {

            if (tool.istoolIconValid) {
                return tool.toolIcon;
            }
            else if (tool.isDefaultIconValid) {
                return tool.defaultIcon;
            }
            else {
                //return fallback icon URL
                return "";
            }
        }

        private handleKeyDownEventOnToolButton(event: KeyboardEvent, toolIndex: number): void {
            if (event.keyCode == KeyCodes.DOWN_ARROW_KEY || event.keyCode == KeyCodes.UP_ARROW_KEY) {
                const indexToFocus = this.getToolButtonsIndexToFocus(event.keyCode, toolIndex);
                document.getElementById(this.productivityToolButtonIds[indexToFocus]).focus();
            }
        }

        private getToolButtonsIndexToFocus(keyCode: number, toolIndex: number): number {
            const offset = keyCode == KeyCodes.DOWN_ARROW_KEY ? 1 : this.productivityToolButtonIds.length - 1;
            const indexToFocus = (toolIndex + offset) % this.productivityToolButtonIds.length;
            return indexToFocus;
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
                let sessionData = this.panelState.getState(this.currentSessionId + LocalStorageKeyConstants.sessionData);
                if (sessionData != undefined) {
                    this.panelToggle = sessionData.panelToggle;
                    this.productivityToolSelected = sessionData.productivityToolSelected;
                }
                let paneState = this.productivityPaneConfigData.productivityPaneState;
                if (paneState == true) {
                    this.controls = [];
                    if (this.isSessionChanged) {
                        this.controls.push(this.getproductivityToolButtons());
                        this.controls.push(this.getNavBarLastContainer());
                        this.controls.push(this.getToolsContainer());
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
                            this.setSidePanelControlState(SidePanelControlState.Collapse);
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
            if (this.panelToggle) {
                this.eventManager.SelectedTool = Constants.emptyString;
                this.setSidePanelControlState(SidePanelControlState.Collapse);
            }
            else {
                if (this.productivityToolSelected === Constants.emptyString) {
                    this.productivityToolSelected = this.productivityPaneConfigData.getDefaultTool().toolName;
                }
                this.eventManager.SelectedTool = this.productivityPaneConfigData.getToolByName(this.productivityToolSelected).toolControlName;
                this.setNotificationCountToZero();
                this.setSidePanelControlState(SidePanelControlState.Expand);
            }

            let sessionData = this.panelState.getState(this.currentSessionId + LocalStorageKeyConstants.sessionData);
            sessionData.productivityToolSelected = this.productivityToolSelected;
            sessionData.isCollapsedByUser = this.panelToggle;
            sessionData.isToggledByUser = true;
            sessionData.panelToggle = !this.panelToggle;
            this.panelToggle = !this.panelToggle;
            this.panelState.SetState(this.currentSessionId + LocalStorageKeyConstants.sessionData, sessionData);
            this.context.utils.requestRender();
        }

        private setNotificationCountToZero() {
            let _notification = this.panelState.getState(this.currentSessionId + LocalStorageKeyConstants.notificationCount);
            if (_notification != undefined) {
                _notification[this.productivityPaneConfigData.getToolByName(this.productivityToolSelected).toolControlName] = 0;
                this.panelState.SetState(this.currentSessionId + LocalStorageKeyConstants.notificationCount, _notification);
            }
        }

        private productivityToolButtonClick(buttonId: string): void {
            let isCollapsedByUser: boolean = undefined;
            if (!this.panelToggle) {
                this.setSidePanelControlState(SidePanelControlState.Expand);
                this.panelToggle = !this.panelToggle;
                this.productivityToolSelected = buttonId;
                isCollapsedByUser = false;
            }
            if (!(this.productivityToolSelected === buttonId)) {
                this.productivityToolSelected = buttonId;
            }
            this.eventManager.SelectedTool = this.productivityPaneConfigData.getToolByName(this.productivityToolSelected).toolControlName;
            this.setNotificationCountToZero();

            let sessionData = this.panelState.getState(this.currentSessionId + LocalStorageKeyConstants.sessionData);
            sessionData.productivityToolSelected = this.productivityToolSelected;
            sessionData.panelToggle = this.panelToggle;
            sessionData.isToggledByUser = true;
            if (isCollapsedByUser != undefined) {
                sessionData.isCollapsedByUser = isCollapsedByUser;
            }
            this.panelState.SetState(this.currentSessionId + LocalStorageKeyConstants.sessionData, sessionData);
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
                    verticalAlign: "middle",
                    width: "unset",
                    height: "unset",
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
            this.panelState.deinit();
        }

        public retrieveIntitialData() {
            let methodName = 'retrieveIntitialData';
            try {
                //get app config name
                Microsoft.AppRuntime.Utility.getEnvironment().then(
                    (environmentData) => {
                        if (!this.context.utils.isNullOrUndefined(environmentData)) {
                            let appConfigUniqueName = environmentData.AppConfigName;

                            if (!this.context.utils.isNullOrUndefined(appConfigUniqueName)) {
                                //get productivity pane configuration data
                                this.dataManager.getProductivityPaneConfigData(appConfigUniqueName).then(
                                    (configData: ProductivityPaneConfig) => {
                                        this.dataManager.validateToolsIconConfigData(configData.productivityToolsConfig.ToolsList).then((toolsConfig) => {
                                            configData.productivityToolsConfig.ToolsList = toolsConfig;
                                            this.productivityPaneConfigData = configData;
                                            this.eventManager.ProductivityPaneConfigData = this.productivityPaneConfigData;
                                            if (this.productivityPaneConfigData.validateConfig()) {
                                                this.isDataFetched = true;
                                            }
                                            this.context.utils.requestRender();
                                        });
                                    },
                                    (error: XrmClientApi.ErrorResponse) => {
                                        let errorParam = new EventParameters();
                                        errorParam.addParameter("errorObj", JSON.stringify(error));
                                        this.telemetryLogger.logError(this.telemetryContext, 'getProductivityPaneConfigData', error.message, errorParam);
                                    }
                                );
                            }
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