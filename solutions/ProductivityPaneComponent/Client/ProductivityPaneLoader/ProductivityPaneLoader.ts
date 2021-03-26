/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
/// <reference path="./Data/APMConfigExtractor.ts" />
module ProductivityPaneLoader {
    let loadMacrosComponentInternal = function () {
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

    let loadLogicAppExecutor = function () {
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

    let loadMacrosDataLayer = function () {
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

    let _xrmApp: any = Xrm.App;

    let configExtractor = new APMConfigExtractor();
    // get app config name
    // Need to use AppRuntime.Utility.getEnvironment() to get AppConfigName
    let appConfigUniqueName = 'msdyn_csw_app_configuration';

    configExtractor.getProductivityPaneConfigData(appConfigUniqueName).then((productivityPaneConfig) => {
        productivityPaneConfig.productivityToolsConfig.ToolsList.forEach((tool: ToolConfig) => {
            if (tool.isEnabled && tool.toolName == 'msdyn_csw_productivitypane_sa_tab') {
                let props = {
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
                    key: 'roductivitytoolcontrol_child0',
                    id: 'productivitytoolcontrol_child0',
                };

                _xrmApp.sidePanes
                    .createPane({
                        canClose: true,
                        title: 'SmartAssist',
                        width: 340,
                    })
                    .then(function (pane) {
                        pane.navigate(
                            {
                                pageType: PCFControlConstants.pageType,
                                controlName: 'MscrmControls.SmartassistPanelControl.SmartassistPanelControl',
                                data: props.parameters,
                            },
                            {
                                replaceState: false,
                                resetHistory: false,
                            },
                        );
                        //return 'helloworld';
                        return pane.paneId;
                    })
                    .then(
                        function (paneId) {
                            console.log('Panel load success ' + paneId);
                            sessionStorage.setItem(PCFControlConstants.sidePaneKey, paneId);
                        },
                        function (error) {
                            console.log('Panel load failed', error);
                        },
                    );
            }
            if (tool.isEnabled && tool.toolName == 'msdyn_csw_productivitypane_cs_tab') {
                let props1 = {
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
                    key: 'roductivitytoolcontrol_child1',
                    id: 'productivitytoolcontrol_child1',
                };
                _xrmApp.sidePanes
                    .createPane({
                        canClose: true,
                        title: 'AgentScript',
                        width: 340,
                    })
                    .then(function (pane) {
                        pane.navigate(
                            {
                                pageType: PCFControlConstants.pageType,
                                controlName: 'MscrmControls.Callscript.CallscriptControl',
                                data: props1.parameters,
                            },
                            {
                                replaceState: false,
                                resetHistory: false,
                            },
                        );
                        return pane.paneId;
                    })
                    .then(
                        function (paneId) {
                            console.log('Panel load success ' + paneId);
                            sessionStorage.setItem(PCFControlConstants.sidePaneKey, paneId);
                        },
                        function (error) {
                            console.log('Panel load failed', error);
                        },
                    );
            }
            if (tool.isEnabled && tool.toolName == 'msdyn_csw_productivitypane_ks_tab') {
                let props2 = {
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
                    key: 'roductivitytoolcontrol_child1',
                    id: 'productivitytoolcontrol_child1',
                };
                _xrmApp.sidePanes
                    .createPane({
                        canClose: true,
                        title: 'AgentScript',
                        width: 340,
                    })
                    .then(function (pane) {
                        pane.navigate(
                            {
                                pageType: PCFControlConstants.pageType,
                                controlName: 'MscrmControls.KnowledgeControl.KnowledgeControl',
                                data: props2.parameters,
                            },
                            {
                                replaceState: false,
                                resetHistory: false,
                            },
                        );
                        return pane.paneId;
                    })
                    .then(
                        function (paneId) {
                            console.log('Panel load success ' + paneId);
                            sessionStorage.setItem(PCFControlConstants.sidePaneKey, paneId);
                        },
                        function (error) {
                            console.log('Panel load failed', error);
                        },
                    );
            }
        });
    });
}
