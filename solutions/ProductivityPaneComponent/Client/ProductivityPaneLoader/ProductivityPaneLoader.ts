/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="./Utilities/LoadScripts.ts" />
/// <reference path="./Utilities/Utils.ts" />
/// <reference path="./Utilities/LoadPanesHelper.ts" />
/// <reference path="./Utilities/Logger.ts" />
/// <reference path="./Data/APMConfigExtractor.ts" />
/// <reference path="../../../../references/internal/TypeDefinitions/AppRuntimeClientSdk.d.ts" />
/// <reference path="./Utilities/XrmAppProxy.ts" />
module ProductivityPaneLoader {

    const telemetryData = TelemetryData.generate(ProductivityPaneLoggerConstants.productivityPaneLoaderPrefix);
    Logger.start(EventType.PRODUCTIVITY_TOOLS_LOAD, 
        ProductivityPaneLoggerConstants.loadPanesHelperloadAppSidePanesPrefix, telemetryData);

    LoadScripts.loadLogicAppExecutor();
    LoadScripts.loadMacrosComponentInternal();
    LoadScripts.loadMacrosDataLayer();
    
    try {
        const configExtractor = new APMConfigExtractor();

        Microsoft.AppRuntime.Utility.getEnvironment().then((environmentData) => {
            // environmentData and appConfigUniqueName cannot be null
            // or undefined, but appConfigUniqueName may be empty.
            const appConfigUniqueName = environmentData.AppConfigName;
            if (!Utils.isEmpty(appConfigUniqueName)) {
                configExtractor
                    .retrieveAPMConfig(appConfigUniqueName)
                    .then((productivityPaneConfig: ProductivityPaneConfig) => {
                        // If pane state is false, it means that user turn off all
                        // the tools and no tools will be loaded subsequently.
                        if (productivityPaneConfig.productivityPaneState) {
                            configExtractor
                                .validateToolIconConfigAndReturn(
                                    productivityPaneConfig.productivityToolsConfig.ToolsList,
                                )
                                .then((toolList: ToolConfig[]) => {
                                    // productivityPaneMode indicates whether or not user
                                    // want to expand all productivity tools. true: expand
                                    // all tools by default; false: collapse all tools.
                                    const paneMode = productivityPaneConfig.productivityPaneMode;
                                    telemetryData.addCustomParameter(CustomParameterConstants.PaneMode, paneMode)
                                    LoadPanesHelper.loadAppSidePanes(toolList, paneMode, telemetryData).then((successfulPaneIds) => {
                                        const successfulIdSet = new Set(successfulPaneIds);
                                        const successfulTools = toolList.filter((tool) => {
                                            return successfulIdSet.has(tool.paneId);
                                        })

                                        if(successfulTools.length === 0) {
                                            Logger.logError(
                                                EventType.PRODUCTIVITY_TOOLS_LOAD_FAILURE,
                                                `${Constants.productivityToolsLogPrefix} No tools were successfully created and rendered`,
                                                telemetryData,
                                            );
                                            return;
                                        }

                                        LoadPanesHelper.afterProductivityToolLoad(paneMode, successfulTools);

                                        // Grab information for telemetry
                                        const defaultToolCount = successfulTools.filter((tool) => Utils.isDefaultTool(tool)).length;
                                        const customToolCount = successfulTools.filter((tool) => !Utils.isDefaultTool(tool)).length;
                                        const controlToolCount = successfulTools.filter((tool) => tool.toolType === ToolType.CONTROL 
                                            || Utils.isNullOrUndefined(tool.toolType)).length;
                                        const customPageToolCount = successfulTools.filter((tool) => tool.toolType === ToolType.CUSTOM_PAGE).length;
                                        telemetryData.addCustomParameters([
                                            [CustomParameterConstants.DefaultToolCount, defaultToolCount],
                                            [CustomParameterConstants.CustomToolCount, customToolCount],
                                            [CustomParameterConstants.ControlToolCount, controlToolCount],
                                            [CustomParameterConstants.CustomPageToolCount, customPageToolCount],
                                        ]);
                                        Logger.success(EventType.PRODUCTIVITY_TOOLS_LOAD_SUCCESS, 
                                            ProductivityPaneLoggerConstants.productivityPaneLoaderPrefix, telemetryData);
                                    });
                                })
                                .catch((error) => {
                                    telemetryData.addError(error);
                                    Logger.logError(
                                        EventType.PRODUCTIVITY_TOOLS_LOAD_FAILURE,
                                        `${Constants.productivityToolsLogPrefix} Failed to load app side panes during tool creation`,
                                        telemetryData,
                                    );
                                });
                        }
                    })
                    .catch((error) => {
                        telemetryData.addError(error);
                        Logger.logError(
                            EventType.PRODUCTIVITY_TOOLS_LOAD_FAILURE,
                            `${Constants.productivityToolsLogPrefix} Failed to load app side panes during or after app config fetch`,
                            telemetryData,
                        );
                    });
            }
        });
    } catch (error) {
        telemetryData.addError(error);
        Logger.logError(
            EventType.PRODUCTIVITY_TOOLS_LOAD_FAILURE,
            `${Constants.productivityToolsLogPrefix} Failed to load app side panes`,
            telemetryData,
        );
    }
}
