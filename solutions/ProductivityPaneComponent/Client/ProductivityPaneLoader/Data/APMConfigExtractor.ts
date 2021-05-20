/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="../../../../../references/external/TypeDefinitions/microsoft.ajax.d.ts" />
/// <reference path="../Models/ProductivityPaneConfig.ts"/>
/// <reference path="../Models/ProductivityToolsConfig.ts"/>
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
                                            TelemetryLogger.logError(`${Constants.productivityToolsLogPrefix} Failed to get tools config Data`, error);
                                            console.error(Constants.productivityToolsLogPrefix + JSON.stringify(error));
                                            reject(error);
                                        },
                                    );
                                },
                                (error) => {
                                    TelemetryLogger.logError(`${Constants.productivityToolsLogPrefix} Failed to get Productivity Pane config`, error);
                                    console.error(Constants.productivityToolsLogPrefix + JSON.stringify(error));
                                    reject(error);
                                },
                            );
                        },
                        (error) => {
                            TelemetryLogger.logError(`${Constants.productivityToolsLogPrefix} Failed to get Productivity Pane unique name`, error);
                            console.error(Constants.productivityToolsLogPrefix + JSON.stringify(error));
                            reject(error);
                        },
                    );
                });
            } catch (error) {
                return new Promise<ProductivityPaneConfig>((resolve, reject) => {
                    TelemetryLogger.logError(`${Constants.productivityToolsLogPrefix} Failed to retrieve APM config`, error);
                    console.error(Constants.productivityToolsLogPrefix + JSON.stringify(error.message));
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
                                toolsConfig[pos].istoolIconValid = result;
                            } else {
                                toolsConfig[pos].isDefaultIconValid = result;
                                pos++;
                            }
                        });
                        resolve(toolsConfig);
                    },
                    (error) => {
                        TelemetryLogger.logError(`${Constants.productivityToolsLogPrefix} Failed to validate tool icon config`, error);
                        console.error(Constants.productivityToolsLogPrefix + JSON.stringify(error));
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
                                TelemetryLogger.logError(`${Constants.productivityToolsLogPrefix} Failed to retrieve record from webresource`, error);
                                console.error(Constants.productivityToolsLogPrefix + JSON.stringify(error));
                                reject(error);
                            },
                        );
                    }
                });
            } catch (error) {
                return new Promise<boolean>((resolve, reject) => {
                    TelemetryLogger.logError(`${Constants.productivityToolsLogPrefix} Failed to get Icon from webresources`, error);
                    console.error(Constants.productivityToolsLogPrefix + JSON.stringify(error));
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
                tabConfig.forEach((tab) => {
                    tPromises.push(Xrm.WebApi.retrieveRecord(ToolConfigConstants.entityName, tab._msdyn_toolid_value));
                });
                Promise.all(tPromises).then(
                    (results: any[]) => {
                        results.forEach((result: any, index: number) => {
                            if (tabConfig[index].msdyn_isenabled) {
                                toolsList.push(
                                    new ToolConfig(
                                        result.msdyn_controlname,
                                        tabConfig[index].msdyn_iconpath,
                                        tabConfig[index].msdyn_order,
                                        tabConfig[index].msdyn_isenabled,
                                        tabConfig[index].msdyn_uniquename,
                                        tabConfig[index].msdyn_tooltip,
                                        result.msdyn_data,
                                        result.msdyn_defaulticon,
                                    ),
                                );
                            }
                        });
                        resolve(toolsList);
                    },
                    (error) => {
                        TelemetryLogger.logError(`${Constants.productivityToolsLogPrefix} Failed to retrieve tools config data from XrmApi`, error);
                        console.error(Constants.productivityToolsLogPrefix + JSON.stringify(error));
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
                        TelemetryLogger.logError(`${Constants.productivityToolsLogPrefix} Failed to retrieve Productivity Pane unique name from XrmApi`, error);
                        console.error(Constants.productivityToolsLogPrefix + JSON.stringify(error));
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
                        TelemetryLogger.logError(`${Constants.productivityToolsLogPrefix} Failed to retrieve Productivity Pane config from XrmApi`, error);
                        console.error(Constants.productivityToolsLogPrefix + JSON.stringify(error));
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
    }
}
