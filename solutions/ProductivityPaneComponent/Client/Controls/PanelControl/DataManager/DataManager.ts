/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../privatereferences.ts"/>

module MscrmControls.PanelControl {
	'use strict';

    export class DataManager {
        // Properties
        private context: Mscrm.ControlData<IInputBag>;
        private telemetryContext: string;
        private telemetryLogger: TelemetryLogger;
        private languageId: number;

        // Default constructor
        constructor(context: Mscrm.ControlData<IInputBag>) {
            this.context = context;
            this.telemetryContext = TelemetryComponents.DataManager;
            this.telemetryLogger = new TelemetryLogger(context);
            this.languageId = context.userSettings.languageId;
        }

        //This function returns productivity pane configuration data
        public getProductivityPaneConfigData(appConfigName: string): Promise<ProductivityPaneConfig> {
            let methodName = 'GetProductivityPaneConfigData';
            try {
                return new Promise<ProductivityPaneConfig>((resolve, reject) => {
                    this.getProductivityPaneUniqueName(appConfigName).then((productivityPaneUniqueName: string) => {
                        let productivityPaneQuery = this.getProductivityPanelandTabsQuery(productivityPaneUniqueName);
                        let retrieveDataPromise = Xrm.WebApi.retrieveMultipleRecords(ProductivityPaneConfigConstants.entityName, productivityPaneQuery);
                        retrieveDataPromise.then(
                           (response: any) => {
                               this.getToolsConfigData(response.entities[0].msdyn_msdyn_paneconfig_msdyn_tabconfig).then((toolsConfig) => {
                                   if (toolsConfig.length > 0) {
                                       this.getToolsIconConfigData(toolsConfig).then((toolsConfig) => {
                                           let productivityPane = new ProductivityPaneConfig(response.entities[0].msdyn_panestate, response.entities[0].msdyn_panemode, new ProductivityToolsConfig(toolsConfig));
                                           resolve(productivityPane);
                                       });

                                   } else {
                                       reject("No tools configured");
                                   }
                                });
                            },
                            (error) => {
                                let errorParam = new EventParameters();
                                errorParam.addParameter("errorObj", JSON.stringify(error));
                                this.telemetryLogger.logError(this.telemetryContext, methodName, error.message, errorParam);
                                reject(error);
                            }
                        );
                    },
                        (error) => {
                            let errorParam = new EventParameters();
                            errorParam.addParameter("errorObj", JSON.stringify(error));
                            this.telemetryLogger.logError(this.telemetryContext, methodName, error.message, errorParam);
                            reject(error);
                        }
                    );
                });
            } catch (e) {
                return new Promise<ProductivityPaneConfig>((resolve, reject) => {
                    let errorParam = new EventParameters();
                    errorParam.addParameter("errorObj", JSON.stringify(e));
                    this.telemetryLogger.logError(this.telemetryContext, methodName, e.message, errorParam);
                    reject(e.message);
                });
            }
        }

        private getProductivityPaneUniqueName(appConfigName: string): Promise<string> {
            let methodName = 'GetProductivityPaneUniqueName';
            return new Promise<string>((resolve, reject) => {
                let productivityPaneUniqueNameQuery = this.getProductivityPaneUniqueNameQuery(appConfigName);
                let retrieveDataPromise = Xrm.WebApi.retrieveMultipleRecords(AppConfigConstants.entityName, productivityPaneUniqueNameQuery);
                retrieveDataPromise.then(
                    (response: any) => {
                        if (response.entities[0].msdyn_msdyn_paneconfig_msdyn_appconfig.length > 0) {
                            resolve(response.entities[0].msdyn_msdyn_paneconfig_msdyn_appconfig[0].msdyn_uniquename);
                        } else {
                            reject("No Pane Configured");
                        }
                    },
                    (error) => {
                        let errorParam = new EventParameters();
                        errorParam.addParameter("errorObj", JSON.stringify(error));
                        this.telemetryLogger.logError(this.telemetryContext, methodName, error.message, errorParam);
                        reject(error);
                    }
                );
            });
        }

        private getToolsConfigData(tabconfig: any): Promise<ToolConfig[]> {
            let methodName = 'getToolsConfigData';
            return new Promise<ToolConfig[]>((resolve, reject) => { 
                var toolsList: ToolConfig[] = [];
                let tPromises: Promise<any>[] = [];
                tabconfig.forEach((tab) => {
                    tPromises.push(Xrm.WebApi.retrieveRecord(ToolConfigConstants.entityName, tab._msdyn_toolid_value));
                });
                Promise.all(tPromises).then((results: any[]) => {
                    results.forEach((result: any, index:number)=> {
                        toolsList.push(new ToolConfig(
                            result.msdyn_controlname,
                            tabconfig[index].msdyn_iconpath,
                            tabconfig[index].msdyn_order,
                            tabconfig[index].msdyn_isenabled,
                            tabconfig[index].msdyn_uniquename,
                            tabconfig[index].msdyn_tooltip,
                            result.msdyn_data,
                            result.msdyn_defaulticon,
                            new ToolIconConfig(false, false))
                        );
                    });
                    resolve(toolsList);
                },
                (error) => {
                    let errorParam = new EventParameters();
                    errorParam.addParameter("errorObj", JSON.stringify(error));
                    this.telemetryLogger.logError(this.telemetryContext, methodName, error.message, errorParam);
                    reject(error);
                });
            });
        }

        public getToolsIconConfigData(tabconfig: ToolConfig[]): Promise<ToolConfig[]> {
            let methodName = 'getToolsConfigData';
            return new Promise<ToolConfig[]>((resolve, reject) => {
                let tPromises: Promise<any>[] = [];
                tabconfig.forEach((tab) => {
                    tPromises.push(this.isValidIconPath(tab.toolIcon));
                    tPromises.push(this.isValidIconPath(tab.defaultIcon));
                });
                Promise.all(tPromises).then((results: any[]) => {
                    var pos = 0;
                    results.forEach((result: any, index: number) => {
                        if (index % 2 == 0) {
                            tabconfig[pos].toolIconConfig.toolIcon = result;
                        } else {
                            tabconfig[pos].toolIconConfig.defaultIcon = result;
                            pos++;
                        }
                    });
                    resolve(tabconfig);
                },
                (error) => {
                    let errorParam = new EventParameters();
                    errorParam.addParameter("errorObj", JSON.stringify(error));
                    this.telemetryLogger.logError(this.telemetryContext, methodName, error.message, errorParam);
                    reject(error);
                });
            });
        }

        private getProductivityPaneUniqueNameQuery(appConfigName: string) {
            let query = String.format("?{0}{1}&{2}{3} eq '{4}'&{5}{6}({7}{8})", 
                QueryDataConstants.SelectOperator, 
                AppConfigConstants.msdyn_appmoduleuniquename,
                QueryDataConstants.FilterOperator,
                AppConfigConstants.msdyn_uniqueName,
                appConfigName,
                QueryDataConstants.ExpandOperator,
                AppConfigConstants.appPaneRelationship,
                QueryDataConstants.SelectOperator,
                ProductivityPaneConfigConstants.msdyn_uniqueName
            );
            return query;
        }

        //This function generates query to fetch productivity pane config data
        //applicationName is set to static. Need to make dynamic.
        public getProductivityPanelandTabsQuery(paneUniqueName: string): string {
            let query = String.format("?{0}{1} eq '{2}'&{3}{4}", 
                QueryDataConstants.FilterOperator, 
                ProductivityPaneConfigConstants.msdyn_uniqueName, 
                paneUniqueName,
                QueryDataConstants.ExpandOperator,
                ProductivityPaneConfigConstants.paneTabRelationship
            );
            return query;
        }

		private logFieldError(context: string, recordId: string, attribute: string) {
			let errorMessage = "Retrieved attribute value is null";
			let eventParam = new EventParameters();
			eventParam.addParameter("context", context);
			eventParam.addParameter("recordId", recordId);
			eventParam.addParameter("attribute", attribute);
		}

        private isValidIconPath(iconPath: string): Promise<boolean> {
            let methodName = "isValidIconPath";
            try {
                return new Promise<boolean>((resolve, reject) => {
                    if (iconPath == null || iconPath.trim() == "") {
                        resolve(false);
                    } else {
                        iconPath = iconPath.includes("WebResources") ? iconPath.replace("/WebResources/", "") : iconPath;
                        let webResourceQuery = this.getWebResourceQuery(iconPath);
                        let getIconPath = Xrm.WebApi.retrieveMultipleRecords("webresource", webResourceQuery);
                        getIconPath.then((response: any) => {
                            response.entities.length > 0 ? resolve(true) : resolve(false);
                        },
                        (error) => {
                            resolve(false);
                        })
                    }
                });
            }
            catch (error) {
                return new Promise<boolean>((resolve, reject) => {
                    let eventParams = new EventParameters();
                    eventParams.addParameter("message", "Failed to validate icon path");
                    this.telemetryLogger.logError(this.telemetryContext, methodName, error, eventParams);
                    resolve(false);
                })
            }
        }

        public getWebResourceQuery(WebResourceName: string): string {
            let query = String.format("?{0}{1} eq '{2}'",
                QueryDataConstants.FilterOperator,
                "name",
                WebResourceName,
            );
            return query;
        }

	}
}