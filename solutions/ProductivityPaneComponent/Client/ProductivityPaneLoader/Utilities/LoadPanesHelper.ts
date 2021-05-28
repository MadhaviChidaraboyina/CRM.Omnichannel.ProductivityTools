/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="./XrmAppProxy.ts" />
/// <reference path="../SessionChangeManager/SessionChangeManager.ts" />
/// <reference path="../SessionStateManager/SessionStateManager.ts" />
/// <reference path="./Constants.ts" />
module ProductivityPaneLoader {
    export class LoadPanesHelper {
        /*
         * Init session change manager with pane mode and enabled tool list.
         */
        public static initSessionChangeManager(
            productivityPaneMode: boolean,
            productivityToolList: ToolConfig[],
        ): void {
            // Clean up session storage data related to app side panes.
            SessionStateManager.cleanSessionState();
            new SessionChangeManager(productivityPaneMode, productivityToolList);
        }

        /*
         * Load productivity tools via app side panes APIs.
         */
        public static loadAppSidePanes(toolList: ToolConfig[]): Promise<void> {
            try {
                return new Promise<void>((resolve, reject) => {
                    toolList.forEach((tool: ToolConfig) => {
                        XrmAppProxy.getXrmAppApis()
                            .sidePanes.createPane({
                                paneId: tool.toolControlName,
                                canClose: false,
                                isSelected: false,
                                imageSrc: tool.toolIcon,
                                title: tool.tooltip,
                                hidden: true,
                                alwaysRender: true,
                                keepBadgeOnSelect: false,
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
                                        `${Constants.productivityToolsLogPrefix} Failed to laod app side pane ${tool.toolControlName}`,
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
         * Mock the expected behaviors on before & on after session switch to handle the scenario where
         * user create the first session so quickly that SessionChangeManager has not been initialized yet.
         */
        public static initSessionStorageAndRefreshPanes(
            sessionId: string,
            productivityToolList: ToolConfig[],
            isDefaultExpanded: boolean,
        ) {
            SessionChangeHelper.showAllProductivityTools(productivityToolList);

            // Init session state for home session.
            SessionStateManager.updateSessionState(Constants.homeSessionId);

            SessionStateManager.initSessionState(isDefaultExpanded, productivityToolList, sessionId);

            SessionStateManager.restoreSessionState(sessionId);
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
                    // =false: will create new sidepanel at position, event have another sidepanel alredy
                    replaceIfExisted: true,
                    width: 340,
                    position: 2, // 1=left, 2=right, default = right
                    state: 2, // 0=collapsed, 1=Expanded, 2=Hidden, default = Expanded
                    showTitle: false, // default = true
                    canBeClosed: false, // will display close button in title bar
                    canBeCollapsed: true, // will display expland / collapse in title bar,
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
                        `${Constants.productivityToolsLogPrefix} Lagacy pane load failed`,
                        error,
                    );
                };
        }
    }
}
