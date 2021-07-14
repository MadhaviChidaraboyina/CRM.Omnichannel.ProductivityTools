/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="./Utilities/LoadScripts.ts" />
/// <reference path="./Utilities/Utils.ts" />
/// <reference path="./Utilities/LoadPanesHelper.ts" />
/// <reference path="./Utilities/Logger.ts" />
/// <reference path="./Data/APMConfigExtractor.ts" />
/// <reference path="../TypeDefinitions/AppRuntimeClientSdk.d.ts" />
/// <reference path="./Utilities/XrmAppProxy.ts" />
module ProductivityPaneLoader {
    LoadScripts.loadLogicAppExecutor();
    LoadScripts.loadMacrosComponentInternal();
    LoadScripts.loadMacrosDataLayer();

    // Else block should be removed post Oct 2021 release.
    if (Utils.isUsingAppSidePanes()) {
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
                                        LoadPanesHelper.loadAppSidePanes(toolList, paneMode).then(() => {
                                            LoadPanesHelper.afterProductivityToolLoad(paneMode, toolList);
                                            Logger.logInfo(
                                                EventType.PRODUCTIVITY_TOOLS_LOAD_SUCCESS,
                                                `${Constants.productivityToolsLogPrefix} Success: productivity tools loaded`,
                                            );
                                        });
                                    });
                            }
                        });
                }
            });
        } catch (error) {
            Logger.logError(
                EventType.PRODUCTIVITY_TOOLS_LOAD_FAILURE,
                `${Constants.productivityToolsLogPrefix} Failed to load app side panes`,
                error,
            );
        }
    } else {
        LoadPanesHelper.loadLegacyProductivityPane();
    }
}
