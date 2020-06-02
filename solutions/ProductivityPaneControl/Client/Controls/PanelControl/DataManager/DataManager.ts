/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../privatereferences.ts"/>

module MscrmControls.ProductivityToolPanel {
	'use strict';

    export class DataManager {
        // Properties
        private context: Mscrm.ControlData<IInputBag>;
        private telemetryContext: string;
        private telemetryLogger: TelemetryLogger;
        private languageId: number;
        //public productivityPaneConfigData: ProductivityPane;

        // Default constructor
        constructor(context: Mscrm.ControlData<IInputBag>) {
            this.context = context;
            this.telemetryContext = TelemetryComponents.DataManager;
            this.telemetryLogger = new TelemetryLogger(context);
            this.languageId = context.userSettings.languageId;
        }

        //This function returns productivity pane configuration data
        public getProductivityPaneConfigData(appName: string): Promise<ProductivityPaneConfig> {
            let methodName = 'GetProductivityPaneConfigData';
            try {
                return new Promise<ProductivityPaneConfig>((resolve, reject) => {
                    let productivityPaneQuery = this.getProductivityPanelQuery(appName);
                    let retrieveDataPromise = Xrm.WebApi.retrieveMultipleRecords(ProductivityPaneConfigConstants.entityName, productivityPaneQuery);
                    retrieveDataPromise.then(
                        (response: any) => {
                            let productivityPane = new ProductivityPaneConfig(response.entities[0].msdyn_productivitypanestate, response.entities[0].msdyn_productivitypanemode, new ProductivityToolsConfig(this.toolsConfigData()));
                            resolve(productivityPane);
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

        //TODO: read data from config entity and propulate the data model
        private toolsConfigData(): ToolConfig[] {
            var toolsList: ToolConfig[] = [];
            toolsList.push(new ToolConfig("MscrmControls.ProductivityToolAgentGuidance.AgentGuidance", Constants.agentScriptIcon, 10, true, Constants.agentGuidance, Constants.agentGuidanceTooltip));
            return toolsList;
        }

        //This function generates query to fetch productivity pane config data
        //applicationName is set to static. Need to make dynamic.
        public getProductivityPanelQuery(appName: string): string {
            let query = String.format("{0}{1},{2},{3}&{4}{5} eq '{6}'", QueryDataConstants.SelectOperator, ProductivityPaneConfigConstants.productivityPaneState, ProductivityPaneConfigConstants.productivityPaneMode,
                ProductivityPaneConfigConstants.applicationName, QueryDataConstants.FilterOperator, ProductivityPaneConfigConstants.applicationName, appName);
            return query;
        }
                                
		private logFieldError(context: string, recordId: string, attribute: string) {
			let errorMessage = "Retrieved attribute value is null";
			let eventParam = new EventParameters();
			eventParam.addParameter("context", context);
			eventParam.addParameter("recordId", recordId);
			eventParam.addParameter("attribute", attribute);
		}

		

	}
}