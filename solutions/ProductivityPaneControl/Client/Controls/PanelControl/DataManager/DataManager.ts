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
                        
        public fetchAgentScriptRecords(SessionTemplateId: string) {

            let IsAgentScriptAvailable: boolean = false;

            let isApiCalled: any = PanelState.getState(LocalStorageKeyConstants.dbCall + SessionTemplateId);

            if (isApiCalled == null) {

                PanelState.SetState(LocalStorageKeyConstants.dbCall  + SessionTemplateId, SessionTemplateId);

                //fetching agent script
                let fetchXml = this.getCallscriptFetchxml(SessionTemplateId);
                let agentScriptDataPromise = this.retrieveAgentScriptRecords(AgentScriptEntity.entityName, fetchXml, DataManagerComponents.AgentScriptFetch);
                agentScriptDataPromise.then((isAgentScriptFound: boolean) => {
                    IsAgentScriptAvailable = isAgentScriptFound;
                    PanelState.SetState(SessionTemplateId + LocalStorageKeyConstants.isAgentScriptFound, IsAgentScriptAvailable);
                    PanelState.DeleteState(LocalStorageKeyConstants.dbCall  + SessionTemplateId);
                    this.context.utils.requestRender();
                },
                    (errorMessage: string) => {
                        IsAgentScriptAvailable = false;
                        PanelState.SetState(SessionTemplateId + LocalStorageKeyConstants.isAgentScriptFound, IsAgentScriptAvailable);
                        PanelState.DeleteState(LocalStorageKeyConstants.dbCall  + SessionTemplateId);
                        this.context.utils.requestRender();
                    });
            }
            
        }

        public fetchSmartAssistRecords(liveWorkStreamId: string) {

            //fetching Live work stream id from form params
            let isSmartAssistAvailable: boolean = false;

            let isApiCalled: any = PanelState.getState(LocalStorageKeyConstants.dbCall  + liveWorkStreamId);

            if (isApiCalled == null) {

                PanelState.SetState(LocalStorageKeyConstants.dbCall  + liveWorkStreamId, liveWorkStreamId);

                //fetch smart assist bots
                let fetchXml = this.getSmartAssistFetchXml(liveWorkStreamId);
                let smartAssistDataPromise = this.retrieveAgentScriptRecords(SmartAssistBot.entityName, fetchXml, DataManagerComponents.SmartAssistBotRecordFetch);
                smartAssistDataPromise.then((isSmartAssistBotFound: boolean) => {
                    isSmartAssistAvailable = isSmartAssistBotFound;
                    PanelState.SetState(liveWorkStreamId + LocalStorageKeyConstants.isSmartAssistFound, isSmartAssistAvailable);
                    PanelState.DeleteState(LocalStorageKeyConstants.dbCall  + liveWorkStreamId);
                    this.context.utils.requestRender();
                },
                    (errorMessage: string) => {
                        isSmartAssistAvailable = false;
                        PanelState.SetState(liveWorkStreamId + LocalStorageKeyConstants.isSmartAssistFound, isSmartAssistAvailable);
                        PanelState.DeleteState(LocalStorageKeyConstants.dbCall  + liveWorkStreamId);
                        this.context.utils.requestRender();
                    });
            }
        }
                        
        

		/**
		 * Retrieves agent script records associated with given session template id
		 * Minimal details required to show call script records in selector are retrieved
		 * @param sessionTemplateId session template id
		 */
        private retrieveAgentScriptRecords(entityName:string,fetchXml:string,msg:string ): Promise<boolean>
        {
            return new Promise<boolean>((resolve, reject) => {
                				
				let fetchXmlQuery = FetchXmlConstants.FetchOperator + encodeURIComponent(fetchXml);
				let dataFetchPromise = this.context.webAPI.retrieveMultipleRecords(entityName, fetchXmlQuery);

				dataFetchPromise.then(
					(dataResponse: any) => {
						let entityRecords: WebApi.Entity[] = dataResponse.entities;
						
                        let eventParam = new EventParameters();
                        eventParam.addParameter("total " + msg, entityRecords.length.toString());
                        this.telemetryLogger.logSuccess(this.telemetryContext, msg, eventParam);

                        // Resolve the promise
                        resolve(entityRecords.length>0);
					},
					(errorResponse: Mscrm.ErrorResponse) => {

                        let errorMessage = "Failed to load " + msg;
						let errorParam = new EventParameters();
						errorParam.addParameter("message", errorResponse.message);
                        errorParam.addParameter("code", errorResponse.errorCode.toString());
                        this.telemetryLogger.logError(this.telemetryContext, msg, errorMessage, errorParam);

						// Reject the promise
						reject(errorMessage);
					}
				);
			});
        }

		/**
		 * Get fetchxml query to get call script records associated with given session template id
		 * @param sessionTemplateId session template id
		 */
		private getCallscriptFetchxml(sessionTemplateId: string): string
		{
			let fetchXml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' returntotalrecordcount='true' page='1' no-lock='false'>" +
								"<entity name='msdyn_agentscript'>" + 
									"<attribute name='msdyn_agentscriptid'/>"  +
									"<attribute name='msdyn_name'/>" +
									"<attribute name='msdyn_description'/>" +
									"<order attribute='msdyn_name' descending='false'/>" +
									"<filter type='and'>" +
										`<condition attribute='msdyn_language' operator='eq' value='${this.languageId}' />` +
									"</filter>" +
									"<link-entity name='msdyn_msdyn_agentscript_msdyn_sessiontemplate' intersect='true' visible='false' to='msdyn_agentscriptid' from='msdyn_agentscriptid'>" +
									"<link-entity name='msdyn_consoleapplicationsessiontemplate' from='msdyn_consoleapplicationsessiontemplateid' to='msdyn_consoleapplicationsessiontemplateid' alias='bb'>" +
									"<filter type='and'>" +
										`<condition attribute='msdyn_consoleapplicationsessiontemplateid' operator='eq' value='${sessionTemplateId}'/>` +
									"</filter>"  +
									"</link-entity>" +
									"</link-entity>" +
								"</entity>" +
							"</fetch>";

			return fetchXml;
		}

        private getSmartAssistFetchXml(workStreamId: string): string {

            let fetchXrml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>" +
                "<entity name='systemuser'>" +
                "<attribute name='fullname' />" +
                "<attribute name='businessunitid' />" +
                "<attribute name='systemuserid' />" +
                "<order attribute='fullname' descending='false' />" +
                "<link-entity name='msdyn_msdyn_liveworkstream_systemuser' from='systemuserid' to='systemuserid' visible='false' intersect='true'>" +
                "<link-entity name='msdyn_liveworkstream' from='msdyn_liveworkstreamid' to='msdyn_liveworkstreamid' alias='aa'>" +
                "<filter type='and'>" +
                "<condition attribute='msdyn_liveworkstreamid' operator='eq' uitype='msdyn_liveworkstream' value='{"+workStreamId+"}' />" +
                "</filter>" +
                "</link-entity>" +
                "</link-entity>" +
                "</entity>" +
                "</fetch>";
            return fetchXrml;
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