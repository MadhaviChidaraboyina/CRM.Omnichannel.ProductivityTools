/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="./XrmAppProxy.ts" />
/// <reference path="../SessionChangeManager/SessionChangeManager.ts" />
/// <reference path="./Constants.ts" />
module ProductivityPaneLoader {
    export class LoadPanesHelper {
        /*
         * Init session change manager with pane mode and enabled tool list.
         */
        public static async initSessionChangeManager(
            productivityPaneMode: boolean,
            productivityToolList: ToolConfig[],
        ): Promise<SessionChangeManager> {
            return new Promise<SessionChangeManager>((resolve) => {
                resolve(new SessionChangeManager(productivityPaneMode, productivityToolList));
            });
        }

        /*
         * Load productivity tools via app side panes APIs.
         */
        public static async loadAppSidePane(toolList: ToolConfig[]): Promise<void> {
            try {
                return new Promise<void>((resolve) => {
                    toolList.forEach((tool: ToolConfig) => {
                        XrmAppProxy.getXrmAppApis()
                            .sidePanes.createPane({
                                paneId: tool.toolName,
                                canClose: false,
                                isSelected: false,
                                imageSrc: tool.toolIcon,
                                title: tool.tooltip,
                                width: Constants.appSidePaneWidth,
                                hidden: true,
                                alwaysRender: true,
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
                                    console.log('App side pane load succeeded: ' + paneId);
                                },
                                (error) => {
                                    console.log('App side pane load failed: ', error);
                                },
                            );
                    });
                    resolve();
                });
            } catch (error) {
                console.log('Failed to load app side panes: ' + error);
            }
        }

        /*
         * Mock the expected behaviors on after session create/switch to handle the scenario where user
         * create the first session so quick that SessionChangeManager has not been initialized yet.
         */
        public static mockOnBeforeAfterSessionSwitch(
            sessionId: string,
            productivityToolList: ToolConfig[],
            isDefaultExpanded: boolean,
        ) {
            SessionChangeHelper.showAllProductivityTools(productivityToolList);

            const valueAppSidePanesState = isDefaultExpanded
                ? Constants.appSidePanesExpanded
                : Constants.appSidePanesCollapsed;
            const valueSelectedAppSidePaneId = productivityToolList[Constants.firstElement].toolName;

            let sessionStorageDataForNewSession = {
                appSidePanesState: valueAppSidePanesState,
                selectedAppSidePaneId: valueSelectedAppSidePaneId,
            };
            SessionStateManager.setSessionStorageData(
                Constants.appSidePaneSessionState + sessionId,
                sessionStorageDataForNewSession,
            );

            let sessionStorageDataForHomeSession = {
                appSidePanesState: valueAppSidePanesState,
                selectedAppSidePaneId: Constants.emptyString,
            };
            SessionStateManager.setSessionStorageData(
                Constants.appSidePaneSessionState + Constants.homeSessionId,
                sessionStorageDataForHomeSession,
            );

            if (!Utils.isEmpty(sessionStorageDataForNewSession.selectedAppSidePaneId)) {
                XrmAppProxy.setSelectedAppSidePane(sessionStorageDataForNewSession.selectedAppSidePaneId);
                XrmAppProxy.setAppSidePanesState(sessionStorageDataForNewSession.appSidePanesState);
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
                    console.log('Panel load success ' + paneId);
                    sessionStorage.setItem(PcfControlConstants.sidePaneKey, paneId);
                }),
                (error: any) => {
                    console.log('Panel load failed: ' + error);
                };
        }
    }
}
