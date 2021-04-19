/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
/// <reference path="./Data/APMConfigExtractor.ts" />
/// <reference path="../TypeDefinitions/AppRuntimeClientSdk.d.ts" />
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApiInternal.d.ts" />
module ProductivityPaneLoader {
    const loadMacrosComponentInternal = function () {
        try {
            let macrosLibScript = document.createElement('script');
            macrosLibScript.src =
                Xrm.Utility.getGlobalContext().getClientUrl() +
                '/' +
                '/WebResources/CRMClients/msdyn_ProductivityMacrosComponent_internal_library.js';
            document.getElementsByTagName('body')[0].appendChild(macrosLibScript);
            console.log('Loaded msdyn_ProductivityMacrosComponent_internal_library.js');
        } catch (error) {
            console.log('Failed to load msdyn_ProductivityMacrosComponent_internal_library.js');
        }
    };

    const loadLogicAppExecutor = function () {
        try {
            let macrosLibScript = document.createElement('script');
            macrosLibScript.src =
                Xrm.Utility.getGlobalContext().getClientUrl() +
                '/' +
                '/WebResources/CRMClients/msdyn_LogicAppExecutor_v2.js';
            document.getElementsByTagName('body')[0].appendChild(macrosLibScript);
            console.log('Loaded msdyn_LogicAppExecutor_v2.js');
        } catch (error) {
            console.log('Failed to load msdyn_LogicAppExecutor_v2.js');
        }
    };

    const loadMacrosDataLayer = function () {
        try {
            let macrosLibScript = document.createElement('script');
            macrosLibScript.src =
                Xrm.Utility.getGlobalContext().getClientUrl() +
                '/' +
                '/WebResources/MacrosDataLayer/msdyn_MacrosDataLayer.js';
            document.getElementsByTagName('body')[0].appendChild(macrosLibScript);
            console.log('Loaded msdyn_MacrosDataLayer.js');
        } catch (error) {
            console.log('Failed to load msdyn_MacrosDataLayer.js');
        }
    };

    loadLogicAppExecutor();
    loadMacrosComponentInternal();
    loadMacrosDataLayer();

    const _xrmApp: any = Xrm.App;
    /* const isFeatureEnabled = XrmInternal.Internal.isFeatureEnabled(FCBConstants.useAppSidePanes);
       Uncomment above and delete below once useAppSidePanes FCB is checked in.
    */
    const isFeatureEnabled: boolean = false;

    if (!isFeatureEnabled) {
        _xrmApp.panels
            .loadPanel({
                pageInput: {
                    pageType: PCFControlConstants.pageType,
                    controlName: PCFControlConstants.paneControlName,
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
                sessionStorage.setItem(PCFControlConstants.sidePaneKey, paneId);
            }),
            (error: any) => {
                console.log('Panel load failed');
            };
    } else {
        // Default mode from APM config, true -> expanded, false -> collapsed.
        let defaultMode: boolean;
        const configExtractor = new APMConfigExtractor();

        try {
            Microsoft.AppRuntime.Utility.getEnvironment().then((environmentData) => {
                // environmentData and AppCongigName can't be null or undefined, while the latter can be empty.
                const appConfigUniqueName = environmentData.AppConfigName;
                if (appConfigUniqueName != '') {
                    configExtractor
                        .retrieveAPMConfig(appConfigUniqueName)
                        .then((productivityPaneConfig: ProductivityPaneConfig) => {
                            configExtractor
                                .validateToolIconConfigData(productivityPaneConfig.productivityToolsConfig.ToolsList)
                                .then((toolsList: ToolConfig[]) => {
                                    if (productivityPaneConfig.productivityPaneState) {
                                        defaultMode = productivityPaneConfig.productivityPaneMode;
                                        // toolsList incorporates only enabled tools; it may be empty but it can't be undefined.
                                        toolsList.forEach((tool: ToolConfig) => {
                                            loadAppSidePane(
                                                tool.toolControlName,
                                                tool.tooltip,
                                                tool.toolName,
                                                tool.toolIcon,
                                            );
                                        });
                                    }
                                });
                        });
                }
            });
        } catch (error) {
            // Add telemetry
            console.log('Failed to load app side panes: ' + error);
        }

        const loadAppSidePane = function (
            toolControlName: string,
            tooltip: string,
            toolName: string,
            toolIcon: string,
        ) {
            try {
                const props = {
                    parameters: {
                        SessionContext: {
                            Usage: 1,
                            Static: true,
                            Value: '{}',
                            Primary: false,
                        },
                        AnchorTabContext: {
                            Usage: 1,
                            Static: true,
                            Value: '{}',
                            Primary: false,
                        },
                        IsLoadedInPanel: {
                            Usage: 1,
                            Static: true,
                            Value: true,
                            Primary: false,
                        },
                        StaticData: {
                            Usage: 1,
                            Static: true,
                            Value: '{}',
                            Primary: false,
                        },
                        IsSelected: {
                            Usage: 1,
                            Static: true,
                            Value: true,
                            Primary: false,
                        },
                    },
                };
                _xrmApp.sidePanes
                    .createPane({
                        paneId: toolName,
                        canClose: false,
                        isSelected: false,
                        imageSrc: toolIcon,
                        title: tooltip,
                        width: 296,
                        hidden: true,
                        alwaysRender: true,
                    })
                    .then((pane) => {
                        pane.navigate({
                            pageType: PCFControlConstants.pageType,
                            controlName: toolControlName,
                            data: props.parameters,
                        });
                        return pane.paneId;
                    })
                    .then(
                        (paneId) => {
                            console.log('Panel load success ' + paneId);
                        },
                        (error) => {
                            console.log('Panel load failed', error);
                        },
                    );
            } catch (error) {
                console.log('Failed to load' + toolControlName);
            }
        };
    }
}
