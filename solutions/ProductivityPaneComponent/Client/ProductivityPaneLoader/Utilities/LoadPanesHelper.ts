/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="../../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
/// <reference path="./Constants.ts" />
module ProductivityPaneLoader {
    export class LoadPanesHelper {
        /*
         * Load productivity tools via app side panes APIs.
         */
        public static loadAppSidePane(toolControlName: string, tooltip: string, toolName: string, toolIcon: string) {
            const _xrmApp: any = Xrm.App;

            try {
                _xrmApp.sidePanes
                    .createPane({
                        paneId: toolName,
                        canClose: false,
                        isSelected: false,
                        imageSrc: toolIcon,
                        title: tooltip,
                        width: Constants.appSidePaneWidth,
                        hidden: true,
                        alwaysRender: true,
                    })
                    .then((pane) => {
                        pane.navigate({
                            pageType: PcfControlConstants.pageType,
                            controlName: toolControlName,
                            data: PcfControlConstants.PcfControlProps.parameters,
                        });
                        return pane.paneId;
                    })
                    .then(
                        (paneId) => {
                            console.log('Panel load success ' + paneId);
                        },
                        (error) => {
                            console.log('Panel load failed: ', error);
                        },
                    );
            } catch (error) {
                console.log('Failed to load ' + toolControlName + '. Error message: ' + error);
            }
        }

        /*
         * This method will be removed post Oct 2021 release, along with the invokers.
         */
        public static loadLegacyProductivityPane() {
            const _xrmApp: any = Xrm.App;

            _xrmApp.panels
                .loadPanel({
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
