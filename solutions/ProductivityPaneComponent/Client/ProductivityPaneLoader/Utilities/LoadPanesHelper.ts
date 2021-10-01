/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="./XrmAppProxy.ts" />
/// <reference path="../SessionChangeManager/SessionChangeManager.ts" />
/// <reference path="./Constants.ts" />
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
        public static loadAppSidePanes(toolList: ToolConfig[], productivityPaneMode: boolean): Promise<void> {
            try {
                return new Promise<void>((resolve, reject) => {
                    toolList.forEach((tool: ToolConfig) => {
                        XrmAppProxy.getXrmAppApis()
                            .sidePanes.createPane({
                                paneId: tool.paneId,
                                canClose: false,
                                isSelected: Utils.isShownOnAllSessions(tool.toolControlName) && productivityPaneMode,
                                imageSrc: tool.toolIcon,
                                title: tool.toolTip,
                                hideHeader: Utils.hideHeader(tool.toolControlName),
                                hidden: !Utils.isShownOnAllSessions(tool.toolControlName),
                                alwaysRender: true,
                                keepBadgeOnSelect: Utils.keepBadgeOnSelect(tool.toolControlName),
                            })
                            .then((pane) => {
                                pane.navigate({
                                    pageType: PcfControlConstants.pageType,
                                    controlName: tool.toolControlName,
                                    data: PcfControlConstants.PcfControlProps.parameters,
                                });
                                return pane.paneId;
                            })
                            .then(
                                (paneId) => {
                                    Logger.logInfo(
                                        EventType.APP_SIDE_PANE_LOAD_SUCCESS,
                                        `${Constants.productivityToolsLogPrefix} Success: app side pane loaded ${paneId}`,
                                    );
                                    resolve();
                                },
                                (error) => {
                                    Logger.logError(
                                        EventType.APP_SIDE_PANE_LOAD_FAILURE,
                                        `${Constants.productivityToolsLogPrefix} Failed to load app side pane for control ${tool.toolControlName}`,
                                        error,
                                    );
                                    reject(error);
                                },
                            );
                    });
                });
            } catch (error) {
                Logger.logError(
                    EventType.APP_SIDE_PANE_LOAD_FAILURE,
                    `${Constants.productivityToolsLogPrefix} Failed to load app side panes`,
                    error,
                );
            }
        }

        /*
         * This method will be removed post Oct 2021 release, along with the invokers.
         */
        public static loadLegacyProductivityPane() {
            XrmAppProxy.getXrmAppApis()
                .panels.loadPanel({
                    pageInput: {
                        pageType: PcfControlConstants.pageType,
                        controlName: PcfControlConstants.paneControlName,
                    },
                    // =True: If already have sidepanel with pageInput at target position, will auto replace with new content.
                    // =false: will create new sidepanel at position, event have another sidepanel already
                    replaceIfExisted: true,
                    width: 340,
                    position: 2, // 1=left, 2=right, default = right
                    state: 2, // 0=collapsed, 1=Expanded, 2=Hidden, default = Expanded
                    showTitle: false, // default = true
                    canBeClosed: false, // will display close button in title bar
                    canBeCollapsed: true, // will display expand / collapse in title bar,
                    defaultCollapsedBehavior: false, // default = true
                    isTitleStatic: true,
                })
                .then((paneId: string) => {
                    Logger.logInfo(
                        EventType.LEGACY_PANE_LOAD_SUCCESS,
                        `${Constants.productivityToolsLogPrefix} Success: legacy pane loaded: ${paneId}`,
                    );
                    sessionStorage.setItem(PcfControlConstants.sidePaneKey, paneId);
                }),
                (error: any) => {
                    Logger.logWarning(
                        EventType.LEGACY_PANE_LOAD_FAILURE,
                        `${Constants.productivityToolsLogPrefix} Legacy pane load failed`,
                        error,
                    );
                };
        }
    }
}
