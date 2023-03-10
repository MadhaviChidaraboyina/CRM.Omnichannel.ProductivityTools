/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="../../../../../references/external/TypeDefinitions/microsoft.ajax.d.ts" />
/// <reference path="../Models/ProductivityPaneConfig.ts"/>
/// <reference path="../Models/ProductivityToolsConfig.ts"/>
/// <reference path="../Utilities/Constants.ts"/>
/// <reference path="../Utilities/Utils.ts"/>
module ProductivityPaneLoader {
    export class APMConfigExtractor {
        public retrieveAPMConfig(appConfigName: string): Promise<ProductivityPaneConfig> {
            try {
                return new Promise<ProductivityPaneConfig>((resolve, reject) => {
                    this.getProductivityPaneUniqueName(appConfigName).then(
                        (productivityPaneUniqueName: string) => {
                            this.getProductivityPaneConfig(productivityPaneUniqueName).then(
                                (productivityPaneConfig: any) => {
                                    this.getToolsConfigData(
                                        productivityPaneConfig.entities[0].msdyn_msdyn_paneconfig_msdyn_tabconfig,
                                    ).then(
                                        (toolsConfig) => {
                                            if (toolsConfig.length > 0) {
                                                const productivityPane = new ProductivityPaneConfig(
                                                    productivityPaneConfig.entities[0].msdyn_panestate,
                                                    productivityPaneConfig.entities[0].msdyn_panemode,
                                                    new ProductivityToolsConfig(toolsConfig),
                                                );
                                                resolve(productivityPane);
                                            } else {
                                                reject('No tools configured');
                                            }
                                        },
                                        (error) => {
                                            Logger.logError(
                                                EventType.APM_CONFIG_EXTRACTOR_FAILURE,
                                                `${Constants.productivityToolsLogPrefix} Failed to get pane tools config Data`,
                                                error,
                                            );
                                            reject(error);
                                        },
                                    );
                                },
                                (error) => {
                                    Logger.logError(
                                        EventType.APM_CONFIG_EXTRACTOR_FAILURE,
                                        `${Constants.productivityToolsLogPrefix} Failed to get pane config data`,
                                        error,
                                    );
                                    reject(error);
                                },
                            );
                        },
                        (error) => {
                            Logger.logError(
                                EventType.APM_CONFIG_EXTRACTOR_FAILURE,
                                `${Constants.productivityToolsLogPrefix} Failed to get pane unique name`,
                                error,
                            );
                            reject(error);
                        },
                    );
                });
            } catch (error) {
                return new Promise<ProductivityPaneConfig>((resolve, reject) => {
                    Logger.logError(
                        EventType.APM_CONFIG_EXTRACTOR_XRM_API_FAILURE,
                        `${Constants.productivityToolsLogPrefix} Failed to retrieve APM config`,
                        error,
                    );
                    reject(error.message);
                });
            }
        }

        public validateToolIconConfigAndReturn(toolsConfig: ToolConfig[]): Promise<ToolConfig[]> {
            return new Promise<ToolConfig[]>((resolve, reject) => {
                let tPromises: Promise<any>[] = [];
                toolsConfig.forEach((tool) => {
                    tPromises.push(this.isValidIconPath(tool.toolIcon));
                    tPromises.push(this.isValidIconPath(tool.defaultIcon));
                });
                Promise.all(tPromises).then(
                    (results: any[]) => {
                        let pos = 0;
                        results.forEach((result: any, index: number) => {
                            if (index % 2 == 0) {
                                toolsConfig[pos].isToolIconValid = result;
                            } else {
                                toolsConfig[pos].isDefaultIconValid = result;
                                pos++;
                            }
                        });
                        resolve(toolsConfig);
                    },
                    (error) => {
                        Logger.logError(
                            EventType.APM_CONFIG_EXTRACTOR_FAILURE,
                            `${Constants.productivityToolsLogPrefix} Failed to validate tool icon config`,
                            error,
                        );
                        reject(error);
                    },
                );
            });
        }

        private isValidIconPath(iconPath: string): Promise<boolean> {
            try {
                return new Promise<boolean>((resolve, reject) => {
                    if (iconPath == null || iconPath.trim() == '') {
                        resolve(false);
                    } else {
                        iconPath = iconPath.includes('WebResources')
                            ? iconPath.includes('/WebResources/')
                                ? iconPath.replace('/WebResources/', '')
                                : iconPath.replace('WebResources/', '')
                            : iconPath;
                        const webResourceQuery = this.getWebResourceQuery(iconPath);
                        Xrm.WebApi.retrieveMultipleRecords('webresource', webResourceQuery).then(
                            (response: any) => {
                                response.entities.length > 0 ? resolve(true) : resolve(false);
                            },
                            (error) => {
                                Logger.logError(
                                    EventType.APM_CONFIG_EXTRACTOR_XRM_API_FAILURE,
                                    `${Constants.productivityToolsLogPrefix} Failed to retrieve icon path from web resources`,
                                    error,
                                );
                                reject(error);
                            },
                        );
                    }
                });
            } catch (error) {
                return new Promise<boolean>((resolve, reject) => {
                    Logger.logError(
                        EventType.APM_CONFIG_EXTRACTOR_FAILURE,
                        `${Constants.productivityToolsLogPrefix} Failed to get icon from web resources`,
                        error,
                    );
                    resolve(false);
                });
            }
        }

        private getWebResourceQuery(WebResourceName: string): string {
            return String.format("?{0}{1} eq '{2}'", QueryDataConstants.FilterOperator, 'name', WebResourceName);
        }

        private getToolsConfigData(tabConfig: any): Promise<ToolConfig[]> {
            return new Promise<ToolConfig[]>((resolve, reject) => {
                let toolsList: ToolConfig[] = [];
                let tPromises: Promise<any>[] = [];
                const expandString = this.getToolConfigurationQueryExpand();
                tabConfig.forEach((tab) => {
                    tPromises.push(Xrm.WebApi.retrieveRecord(ToolConfigConstants.entityName, tab._msdyn_toolid_value, expandString));
                });
                Promise.all(tPromises).then(
                    (results: any[]) => {
                        results.forEach((toolConfig: any, index: number) => {
                            if (
                                tabConfig[index].msdyn_isenabled &&
                                Utils.isEqual(toolConfig.statecode, Constants.stateCodeActive)
                            ) {
                                toolsList.push(
                                    new ToolConfig(
                                        toolConfig.msdyn_uniquename,
                                        toolConfig.msdyn_controlname,
                                        this.getWebResourceIconPath(toolConfig.msdyn_icon) || tabConfig[index].msdyn_iconpath, // Eventually remove tabconfig icon path
                                        tabConfig[index].msdyn_order,
                                        tabConfig[index].msdyn_uniquename,
                                        toolConfig.msdyn_name,
                                        toolConfig.msdyn_type,
                                        toolConfig.msdyn_data,
                                        toolConfig.msdyn_defaulticon,
                                    ),
                                );
                            }
                        });
                        resolve(toolsList);
                    },
                    (error) => {
                        Logger.logError(
                            EventType.APM_CONFIG_EXTRACTOR_XRM_API_FAILURE,
                            `${Constants.productivityToolsLogPrefix} Failed to retrieve pane tool config data from XrmApi`,
                            error,
                        );
                        reject(error);
                    },
                );
            });
        }

        private getProductivityPaneUniqueName(appConfigName: string): Promise<string> {
            return new Promise<string>((resolve, reject) => {
                const productivityPaneUniqueNameQuery = this.getProductivityPaneUniqueNameQuery(appConfigName);
                Xrm.WebApi.retrieveMultipleRecords(AppConfigConstants.entityName, productivityPaneUniqueNameQuery).then(
                    (response: any) => {
                        if (response.entities[0].msdyn_msdyn_paneconfig_msdyn_appconfig.length > 0) {
                            resolve(response.entities[0].msdyn_msdyn_paneconfig_msdyn_appconfig[0].msdyn_uniquename);
                        } else {
                            reject('No Pane Configured');
                        }
                    },
                    (error) => {
                        Logger.logError(
                            EventType.APM_CONFIG_EXTRACTOR_XRM_API_FAILURE,
                            `${Constants.productivityToolsLogPrefix} Failed to retrieve pane unique name from XrmApi`,
                            error,
                        );
                        reject(error);
                    },
                );
            });
        }

        private getProductivityPaneUniqueNameQuery(appConfigName: string) {
            return String.format(
                "?{0}{1}&{2}{3} eq '{4}'&{5}{6}({7}{8})",
                QueryDataConstants.SelectOperator,
                AppConfigConstants.msdyn_appmoduleuniquename,
                QueryDataConstants.FilterOperator,
                AppConfigConstants.msdyn_uniqueName,
                appConfigName,
                QueryDataConstants.ExpandOperator,
                AppConfigConstants.appPaneRelationship,
                QueryDataConstants.SelectOperator,
                ProductivityPaneConfigConstants.msdyn_uniqueName,
            );
        }

        private getProductivityPaneConfig(productivityPaneUniqueName: string): Promise<any> {
            return new Promise<any>((resolve, reject) => {
                const productivityPaneQuery = this.getProductivityPanelandTabsQuery(productivityPaneUniqueName);
                Xrm.WebApi.retrieveMultipleRecords(
                    ProductivityPaneConfigConstants.entityName,
                    productivityPaneQuery,
                ).then(
                    (response: any) => {
                        resolve(response);
                    },
                    (error) => {
                        Logger.logError(
                            EventType.APM_CONFIG_EXTRACTOR_XRM_API_FAILURE,
                            `${Constants.productivityToolsLogPrefix} Failed to retrieve pane config from XrmApi`,
                            error,
                        );
                        reject(error);
                    },
                );
            });
        }

        private getProductivityPanelandTabsQuery(paneUniqueName: string): string {
            return String.format(
                "?{0}{1} eq '{2}'&{3}{4}",
                QueryDataConstants.FilterOperator,
                ProductivityPaneConfigConstants.msdyn_uniqueName,
                paneUniqueName,
                QueryDataConstants.ExpandOperator,
                ProductivityPaneConfigConstants.paneTabRelationship,
            );
        }

        private getToolConfigurationQueryExpand(): string {
            return String.format(
                "?{0}{1}({2}{3})",
                QueryDataConstants.ExpandOperator,
                ToolConfigConstants.msdyn_icon,
                QueryDataConstants.SelectOperator,
                WebresourceConstants.webresourceName
            )
        }

        private getWebResourceIconPath(resource: any): string | null {
            if(Utils.isNullOrUndefined(resource) || Utils.isNullOrUndefined(resource.name)) {
                return null;
            }

            return WebresourceConstants.pathPrefix + resource.name;
        }
    }
}
