/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="./XrmAppProxy.ts" />
/// <reference path="../SessionChangeManager/SessionChangeManager.ts" />
/// <reference path="./Constants.ts" />
/// <reference path="./TelemetryData.ts" />
module ProductivityPaneLoader {
    export class LoadPanesHelper {
        public static afterProductivityToolLoad(productivityPaneMode: boolean, toolList: ToolConfig[]): void {
            // Step 0: Register state persistence for pane selection and panes state.
            Utils.registerSelectedAppSidePaneId();
            Utils.registerAppSidePanesState();

            // Step 1: if there is no selected app side pane, select the first productivity tool by default and set the app side panes states
            // based on APM config. If there is one app side pane loaded already, the selection and panes state will remain the same.
            const currentSelectedAppSidePane = XrmAppProxy.getSelectedAppSidePane();
            if (!currentSelectedAppSidePane) {
                XrmAppProxy.getAppSidePane(toolList[Constants.firstElement].paneId).select();
                XrmAppProxy.setAppSidePanesState(
                    productivityPaneMode ? Constants.appSidePanesExpanded : Constants.appSidePanesCollapsed,
                );
            }

            // Step 2: remove cached session state data after UCI reboots; instantiate session change manager.
            if (Microsoft.AppRuntime.Sessions.removeSessionState) {
                Microsoft.AppRuntime.Sessions.removeSessionState();
            }
            SessionChangeManager.Instantiate(toolList);

            // Step 3: Below handles the scenario where user create the first session so quickly that SessionChangeManager.Instantiate()
            // has not finished yet. It mocks the expected behaviors on before & on after session switch.
            const focusedSessionId = XrmAppProxy.getFocusedSessionId();
            if (!Utils.isHomeSession(focusedSessionId) && !Utils.isBeethovenDemoSession(focusedSessionId)) {
                // Cache home session state to handle the app side panes that are shown on home session.
                if (Microsoft.AppRuntime.Sessions.cacheSessionState) {
                    Microsoft.AppRuntime.Sessions.cacheSessionState(Constants.homeSessionId);
                }
                SessionChangeHelper.showAllProductivityTools(toolList);
            }
        }

        /*
         * Load productivity tools via app side panes APIs.
         */
        public static loadAppSidePanes(toolList: ToolConfig[], productivityPaneMode: boolean, inputTelemetryData?: ITelemetryData): Promise<Array<string | null>> {
            const telemetryData = TelemetryData.generate(ProductivityPaneLoggerConstants.loadPanesHelperloadAppSidePanesPrefix, inputTelemetryData);
            Logger.start(EventType.APP_SIDE_PANE_LOAD, 
                ProductivityPaneLoggerConstants.loadPanesHelperloadAppSidePanesPrefix, telemetryData);
            try {
                return new Promise<Array<string | null>>((resolve, reject) => {
                    const panePromises = new Array<Promise<string | null>>();
                    toolList.forEach((tool: ToolConfig) => {

                        // generate new telemetry for each tool
                        const toolTelemetry = TelemetryData.generate(ProductivityPaneLoggerConstants.loadPanesHelperloadAppSidePanesPrefix, telemetryData);
                        toolTelemetry.addCustomParameters([
                            [CustomParameterConstants.PaneId, tool.paneId],
                            [CustomParameterConstants.ToolUniqueName, tool.uniqueName],
                            [CustomParameterConstants.ToolType, tool.toolType],
                            [CustomParameterConstants.ToolControlName, tool.toolControlName]
                        ]);

                        const panePromise = XrmAppProxy.getXrmAppApis()
                            .sidePanes.createPane({
                                paneId: tool.paneId,
                                canClose: false,
                                isSelected: Utils.isShownOnAllSessions(tool.toolControlName) && productivityPaneMode,
                                imageSrc: this.getValidIcon(tool),
                                title: tool.toolTip,
                                hideHeader: Utils.hideHeader(tool.toolControlName),
                                hidden: !Utils.isShownOnAllSessions(tool.toolControlName),
                                alwaysRender: true,
                                keepBadgeOnSelect: Utils.keepBadgeOnSelect(tool.toolControlName),
                            })
                            .then((pane) => {
                                const paneInput = this.getPaneInput(tool);
                                pane.navigate(paneInput);
                                Logger.logInfo(EventType.APP_SIDE_PANE_LOAD, 
                                    `${Constants.productivityToolsLogPrefix} Success: app side pane loaded ${pane.paneId}`, toolTelemetry);
                                return pane.paneId;
                            }).catch(error => {
                                toolTelemetry.addError(error);
                                Logger.logError(
                                    EventType.APP_SIDE_PANE_LOAD_FAILURE,
                                    `${Constants.productivityToolsLogPrefix} Failed to load app side pane for control ${tool.toolControlName}`,
                                    toolTelemetry,
                                );
                                return null;
                            });
                        panePromises.push(panePromise);
                    });

                    Promise.all(panePromises).then((paneIds: Array<string | null>) => {
                        const successfulPaneIds = paneIds.filter((paneId) => {
                            return !Utils.isNullOrUndefined(paneId);
                        })

                        Logger.success(EventType.APP_SIDE_PANE_LOAD_SUCCESS, 
                            ProductivityPaneLoggerConstants.loadPanesHelperloadAppSidePanesPrefix, telemetryData)
                        resolve(successfulPaneIds);
                    });
                });
            } catch (error) {
                telemetryData.addError(error)
                Logger.logError(
                    EventType.APP_SIDE_PANE_LOAD_FAILURE,
                    `${Constants.productivityToolsLogPrefix} Failed to load app side panes`,
                    telemetryData,
                );
                return Promise.reject(error);
            }
        }

        private static getPaneInput(toolConfig: ToolConfig) {
            let paneInput = {};    

            switch(toolConfig.toolType) {
                case ToolType.CUSTOM_PAGE:
                    paneInput = {
                        pageType: CustomPageConstants.pageType,
                        name: toolConfig.toolControlName
                    };
                    break;
                case ToolType.CONTROL:
                    paneInput = { 
                        pageType: PcfControlConstants.pageType,
                        controlName: toolConfig.toolControlName,
                        data: PcfControlConstants.PcfControlProps.parameters,
                    };
                    break;
                default: // default to control in case tool type missing
                    paneInput = { 
                        pageType: PcfControlConstants.pageType,
                        controlName: toolConfig.toolControlName,
                        data: PcfControlConstants.PcfControlProps.parameters,
                    }
            }
            return paneInput;
        }

        private static getValidIcon(toolConfig: ToolConfig): string {
            return toolConfig.isToolIconValid ? toolConfig.toolIcon 
            : toolConfig.isDefaultIconValid ? toolConfig.defaultIcon : ""; 
        }
    }
}
