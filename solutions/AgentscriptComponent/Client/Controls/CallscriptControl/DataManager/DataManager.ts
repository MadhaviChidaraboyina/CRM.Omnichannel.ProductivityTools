/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.Callscript
{
	'use strict';

	export class DataManager {
		// Properties
		private context: Mscrm.ControlData<IInputBag>;
		private telemetryContext: string;
        private telemetryLogger: TelemetryLogger;
        private cecUtil: CECUtil;
        private macroUtil: MacroUtil;
		private languageId: number;

		// Data fetch flags
		private isInitialDataFetchCompleted: boolean;

		// Default constructor
		constructor(context: Mscrm.ControlData<IInputBag>) {
			this.context = context;
			this.telemetryContext = TelemetryComponents.DataManager;
			this.telemetryLogger = new TelemetryLogger(context);
            this.cecUtil = new CECUtil(context);
            this.macroUtil = new MacroUtil(context);
			this.languageId = context.userSettings.languageId;
			this.isInitialDataFetchCompleted = false;
		}

		/**
		 * Retrieves initial data for call script control
		 * It gets session template and then retrieves call scripts associated with it
		 */
		public retrieveInitialData(): Promise<CallScript[]> {
            return new Promise<CallScript[]>(async (resolve, reject) => {
                let sessionTemplateUniqueName = await this.cecUtil.getSessionTemplateName();
                if (!this.context.utils.isNullOrUndefined(sessionTemplateUniqueName) && !this.context.utils.isNullOrEmptyString(sessionTemplateUniqueName)) {
                    let retrieveDataPromise = this.retrieveCallscriptRecords(sessionTemplateUniqueName);
					retrieveDataPromise.then(
						(records: CallScript[]) => {
							// Resolve the promise with record set
							resolve(records);
						},
						(errorMessage: string) => {
							reject(errorMessage);
						}
					);

					let eventParam = new EventParameters();
                    eventParam.addParameter("sessionTemplateUniqueName", sessionTemplateUniqueName);
					eventParam.addParameter("scenario", "Session template unique name retrieved");
					this.telemetryLogger.logSuccess(this.telemetryContext, DataManagerComponents.InitialDataFetch, eventParam);
				}
				else {
					let errorMessage = "Failed to retrieve session template Id";
					let errorParam = new EventParameters();
					// ToDo: Add error details based on API error structure
					this.telemetryLogger.logError(this.telemetryContext, DataManagerComponents.InitialDataFetch, errorMessage, errorParam);

					//Reject the promise
					reject(errorMessage);
                }   
			});
		}

		/**
		 * Retrieves default call script 
		 * It gets session template and then retrieves default script for it by executing logicAppExecutor
		 */
		public retrieveDefaultCallScript(): Promise<string> {
			return new Promise<string>(async (resolve, reject) => {
                let sessionTemplateName = await this.cecUtil.getSessionTemplateName();
                if (!this.context.utils.isNullOrUndefined(sessionTemplateName) && !this.context.utils.isNullOrEmptyString(sessionTemplateName)) {
					var request = new XMLHttpRequest();
					var context: XrmClientApi.GlobalContext = Xrm.Utility.getGlobalContext();
                    var requestUrl = context.getClientUrl() + "/api/data/v9.0/msdyn_sessiontemplates?$filter=msdyn_uniquename eq '" + sessionTemplateName + "'&$select=msdyn_enablebuildexpression,msdyn_expressiondata";
                    request.open('GET', requestUrl, false);
					request.send(null);
					if (request.status === 200) {
                        var parseResponse = JSON.parse(request.responseText);
                        var response = parseResponse.value[0];
						if (response.msdyn_enablebuildexpression && !this.context.utils.isNullOrEmptyString(response.msdyn_expressiondata)) {
							let retrieveDataPromise = Microsoft.LogicAppExecutor.ExecuteLogicApp(response.msdyn_expressiondata);
							retrieveDataPromise.then(
								function (callScriptID: string) {
									let param = new EventParameters();
                                    param.addParameter("sessionTemplateName", sessionTemplateName);
									param.addParameter("defaultCallScriptId", callScriptID);
									param.addParameter("scenario", "Default CallScript Id retrieved");
									this.telemetryLogger.logSuccess(this.telemetryContext, DataManagerComponents.RetrieveDefaultCallScript, param);
									resolve(callScriptID);
								}.bind(this),
								function (errorMessage: string) {
									let errorParams = new EventParameters();
									this.telemetryLogger.logError(this.telemetryContext, DataManagerComponents.RetrieveDefaultCallScript, errorMessage, errorParams);

									//Reject the promise
									reject(errorMessage);
								}
							);
						}
						else {
							let param = new EventParameters();
                            param.addParameter("sessionTemplateName", sessionTemplateName);
							param.addParameter("scenario", "build expression is Disabled");
							this.telemetryLogger.logSuccess(this.telemetryContext, DataManagerComponents.RetrieveDefaultCallScript, param);
							resolve(null);
						}
					}
					else {
						let errorMessage = "Failed to fetch expression details to retrieve default call script Id";
						let errorParams = new EventParameters();
                        errorParams.addParameter("sessionTemplateName", sessionTemplateName);
						this.telemetryLogger.logError(this.telemetryContext, DataManagerComponents.RetrieveDefaultCallScript, errorMessage, errorParams);

						//Reject the promise
						reject(errorMessage);
					}
				}
				else {
					let errorMessage = "Failed to retrieve session template name";
					let errorParam = new EventParameters();
					this.telemetryLogger.logError(this.telemetryContext, DataManagerComponents.RetrieveDefaultCallScript, errorMessage, errorParam);

					//Reject the promise
					reject(errorMessage);
				}
			});
		}


		/**
		 * Retrieves initial call script records associated with given session template name
		 * Minimal details required to show call script records in selector are retrieved
		 * @param sessionTemplateUniqueName session template unique name
		 */
        private retrieveCallscriptRecords(sessionTemplateUniqueName: string): Promise<CallScript[]>
		{
			return new Promise<CallScript[]>((resolve, reject) => {

                let fetchXml = this.getCallscriptFetchxml(sessionTemplateUniqueName);
				let fetchXmlQuery = FetchXmlConstants.FetchOperator + encodeURIComponent(fetchXml);
				let dataFetchPromise = this.context.webAPI.retrieveMultipleRecords(AgentScriptEntity.entityName, fetchXmlQuery);

				dataFetchPromise.then(
					(dataResponse: any) => {
						let entityRecords: WebApi.Entity[] = dataResponse.entities;
						let callscriptRecords = this.parseCallscriptData(entityRecords);

						this.isInitialDataFetchCompleted = true

						let eventParam = new EventParameters();
						eventParam.addParameter("totalScripts", callscriptRecords.length.toString());
						this.telemetryLogger.logSuccess(this.telemetryContext, DataManagerComponents.InitialDataFetch, eventParam);

						// Resolve the promise
						resolve(callscriptRecords);
					},
					(errorResponse: Mscrm.ErrorResponse) => {

						this.isInitialDataFetchCompleted = false;

						let errorMessage = "Failed to load initial data";
						let errorParam = new EventParameters();
						errorParam.addParameter("message", errorResponse.message);
						errorParam.addParameter("code", errorResponse.errorCode.toString());
						this.telemetryLogger.logError(this.telemetryContext, DataManagerComponents.InitialDataFetch, errorMessage, errorParam);

						// Reject the promise
						reject(errorMessage);
					}
				);
			});
		}

		/**
		 * Retrieve call script steps data for given call script id
		 * @param callScriptId call script id
		 */
		public retrieveCallScriptStepsData(callScriptId: string): Promise<CallScriptStep[]>
		{
			return new Promise<CallScriptStep[]>((resolve, reject) => {

				if (this.context.utils.isNullOrUndefined(callScriptId) || this.context.utils.isNullOrEmptyString(callScriptId))
				{
					let errorMessage = "Invalid call script id";
					let eventParam = new EventParameters();
					this.telemetryLogger.logError(this.telemetryContext, DataManagerComponents.StepsDataFetch, errorMessage, eventParam);
					reject(errorMessage);
					return;
				}

				let fetchXml = this.getStepsFetchxml(callScriptId);
				let fetchXmlQuery = FetchXmlConstants.FetchOperator + encodeURIComponent(fetchXml);
				let dataFetchPromise = this.context.webAPI.retrieveMultipleRecords(AgentScriptStepEntity.entityName, fetchXmlQuery);

				dataFetchPromise.then(
					async (dataResponse: any) => {
						let entityRecords: WebApi.Entity[] = dataResponse.entities;
						let callScriptStepRecords = await this.parseCallScriptStepsData(entityRecords);

						let eventParam = new EventParameters();
						eventParam.addParameter("totalSteps", callScriptStepRecords.length.toString());
						this.telemetryLogger.logSuccess(this.telemetryContext, DataManagerComponents.StepsDataFetch, eventParam);

						resolve(callScriptStepRecords);
					},
					(errorResponse: Mscrm.ErrorResponse) => {
						let errorMessage = "Error retrieving steps data";
						let eventParam = new EventParameters();
						eventParam.addParameter("callScriptId", callScriptId);
						this.telemetryLogger.logError(this.telemetryContext, DataManagerComponents.StepsDataFetch,
							errorMessage, eventParam, errorResponse);

						reject(errorMessage);
					})
			});
		}

		/**
		 * Retrieve call script and its steps
		 * @param callscriptId call script id to retrieve
		 */
		public retrieveCallscriptAndStepsData(callscriptId: string): Promise<CallScript>
		{
			return new Promise<CallScript>((resolve, reject) => {
				let callscriptRecordPromise = this.context.webAPI.retrieveRecord(AgentScriptEntity.entityName, callscriptId);

				callscriptRecordPromise.then(
					(dataResponse: WebApi.Entity) => {
						let callscriptRecord = this.parseCallscriptRecord(dataResponse);

						if (this.context.utils.isNullOrUndefined(callscriptRecord))
						{
							let errorMessage = "Could not parse call script record";
							let errorParam = new EventParameters();
							errorParam.addParameter("callscriptId", callscriptId);
							this.telemetryLogger.logError(this.telemetryContext, DataManagerComponents.CallscriptRecordFetch, errorMessage,
								errorParam);

							reject(errorMessage);
						}

						let stepsDataPromise = this.retrieveCallScriptStepsData(callscriptId);

						stepsDataPromise.then(
							(stepsRecords: CallScriptStep[]) => {
								callscriptRecord.steps = stepsRecords;
								callscriptRecord.isStepsDataRetrieved = true;

								let eventParam = new EventParameters();
								eventParam.addParameter("sceanario", "CallscriptRecordFetch");
								this.telemetryLogger.logSuccess(this.telemetryContext, DataManagerComponents.CallscriptRecordFetch, eventParam);

								resolve(callscriptRecord);
							},
							(errorResponse: string) => {
								let errorMessage = "Failed to get steps data for call script";
								let errorParam = new EventParameters();
								errorParam.addParameter("error", errorResponse);
								this.telemetryLogger.logError(this.telemetryContext, DataManagerComponents.CallscriptRecordFetch, errorMessage,
									errorParam);

								reject(errorMessage);
							}
						);
					},
					(errorResponse: Mscrm.ErrorResponse) => {
						let errorMessage = "Error getting call script record";
						let eventParam = new EventParameters();
						eventParam.addParameter("scenario", "retrieveCallscriptAndSteps");
						eventParam.addParameter("callScriptId", callscriptId);
						eventParam.addParameter("error", errorResponse.message);
						eventParam.addParameter("errorCode", errorResponse.errorCode.toString());
						this.telemetryLogger.logError(this.telemetryContext, DataManagerComponents.CallscriptRecordFetch,
							errorMessage, eventParam, errorResponse);

						reject(errorMessage);
					}
				);
			});
		}

		/**
		 * Parse call script record from data response
		 * @param entityRecord returned entity records
		 */
		private parseCallscriptRecord(entityRecord: WebApi.Entity): CallScript
		{
			let callScriptId = entityRecord[AgentScriptEntity.msdyn_agentscriptId];
			let callScriptName = entityRecord[AgentScriptEntity.msdyn_name];
			let callScriptDescription = entityRecord[AgentScriptEntity.msdyn_description];

			if (this.context.utils.isNullOrUndefined(callScriptId))
			{
				let errorMessage = "Error parsing call script record";
				let eventParam = new EventParameters();
				eventParam.addParameter("scenario", "ParseCallscriptRecord");
				this.telemetryLogger.logError(this.telemetryContext, DataManagerComponents.CallscriptRecordFetch,
					errorMessage, eventParam);
				return null;
			}

			let callScriptRecord = new CallScript(callScriptId, callScriptName, callScriptDescription, false, []);
			return callScriptRecord;
		}

		/**
		 * Parse call script records
		 * @param entityRecords retrieved entity records
		 */
		private parseCallscriptData(entityRecords: WebApi.Entity[]): CallScript[]
		{
			let callScriptRecords: CallScript[] = [];
			try
			{
				for (let i = 0; i < entityRecords.length; i++)
				{
					let entityRecord = entityRecords[i];
					let callScriptRecord = this.parseCallscriptRecord(entityRecord);

					if (this.context.utils.isNullOrUndefined(callScriptRecord))
					{
						continue;
					}

					callScriptRecords.push(callScriptRecord);
				}
			}
			catch (error)
			{
				let errorMessage = "Error in parsing call script records";
				let errorParam = new EventParameters();
				errorParam.addParameter("errorDetails", error);
				this.telemetryLogger.logError(this.telemetryContext, DataManagerComponents.InitialDataFetch, errorMessage, errorParam);
			}

			return callScriptRecords;
		}

		/**
		 * Parse call script steps data
		 * @param entityRecords retrieved entity records
		 * @returns call script steps records
		 */
        private async parseCallScriptStepsData(entityRecords: WebApi.Entity[]): Promise<CallScriptStep[]>
        {
            const methodName = "parseCallScriptStepsData";
			let callScriptStepRecords: CallScriptStep[] = [];
			try
			{
				for (let i = 0; i < entityRecords.length; i++)
				{
					let entityRecord = entityRecords[i];

					let id: string = entityRecord[AgentScriptStepEntity.msdyn_agentscriptstepid];
					let name: string = entityRecord[AgentScriptStepEntity.msdyn_name];
					let order: number = entityRecord[AgentScriptStepEntity.msdyn_order];
					let actionType: number = entityRecord[AgentScriptStepEntity.msdyn_actiontype];
					let description: string = entityRecord[AgentScriptStepEntity.msdyn_description];
					let stepAction = null;

					switch (actionType)
					{
						case AgentScriptStepActionType.TextAction:
							let textInstruction = entityRecord[AgentScriptStepEntity.msdyn_textinstruction];

							if (this.context.utils.isNullOrUndefined(textInstruction))
							{
								textInstruction = Constants.EmptyString;
								this.logFieldError("StepsDataParser", id, AgentScriptStepEntity.msdyn_textinstruction);
							}

                            stepAction = new TextAction(textInstruction);
							break;

						case AgentScriptStepActionType.MacroAction:
							let macroId = entityRecord[AgentScriptStepEntity.msdyn_macroactionId];
                            let macroName = entityRecord[AgentScriptStepEntity.msdyn_macroactionName];
                            let macroDescription = description;

							if (this.context.utils.isNullOrUndefined(macroId))
							{
								this.logFieldError("StepsDataParser", id, AgentScriptStepEntity.msdyn_macroactionId);
							}

                            stepAction = new MacroAction(macroId, macroName, macroDescription);
							break;

						case AgentScriptStepActionType.RouteAction:
							let scriptId = entityRecord[AgentScriptStepEntity.msdyn_routeactionId];
							let scriptName = entityRecord[AgentScriptStepEntity.msdyn_routeactionName];

							if (this.context.utils.isNullOrUndefined(scriptId))
							{
								this.logFieldError("StepsDataParser", id, AgentScriptStepEntity.msdyn_routeactionId);
							}

							stepAction = new RouteAction(scriptId, scriptName);
							break;

						default:
							let errorMessage = "Invalid action type";
							let errorParam = new EventParameters();
							errorParam.addParameter("stepRecordId", id);
							let currentActionType = "null";

							if (!this.context.utils.isNullOrUndefined(actionType))
							{
								currentActionType = actionType.toString();
							}
							errorParam.addParameter("actionType", actionType.toString());
							this.telemetryLogger.logError(this.telemetryContext, DataManagerComponents.StepsDataFetch, errorMessage, errorParam);
							break;
					}

                    await this.macroUtil.resolveInitMacroTemplate();
                    await this.macroUtil.resolveReplaceableParameters(name).then(
                        (resolvedText) => {
                            name = resolvedText; 
                        },
                        (error) => {
                            let errorMessage = "Failed to resolve slug";
                            let eventParams = new EventParameters();
                            eventParams.addParameter("stepId", id);
                            eventParams.addParameter("message", "Error in resolving text instruction for text step");
                            this.telemetryLogger.logError(this.telemetryContext, methodName, errorMessage, eventParams);
                        }
                    );
             
                    let stepRecord = new CallScriptStep(id, name, order, description, stepAction, this.context);
                    callScriptStepRecords.push(stepRecord);
				}
			}
			catch (error)
			{
				let errorMessage = "Error in parsing call script steps records";
				let errorParam = new EventParameters();
				errorParam.addParameter("errorDetails", error);
				this.telemetryLogger.logError(this.telemetryContext, DataManagerComponents.StepsDataFetch, errorMessage, errorParam);
			}
            return callScriptStepRecords;
		}


		/**
		 * Logs error for attributes
		 * @param attributeName attribute name
		 */
		private logFieldError(context: string, recordId: string, attribute: string)
		{
			let errorMessage = "Retrieved attribute value is null";
			let eventParam = new EventParameters();
			eventParam.addParameter("context", context);
			eventParam.addParameter("recordId", recordId);
			eventParam.addParameter("attribute", attribute);
			
		}

		/**
		 * Get fetchxml query to get call script records associated with given session template unique name
		 * @param sessionTemplateUniqueName session template unique name
		 */
        private getCallscriptFetchxml(sessionTemplateUniqueName: string): string
		{
			let fetchXml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' returntotalrecordcount='true' page='1' no-lock='false'>" +
								"<entity name='msdyn_agentscript_v2'>" + 
									"<attribute name='msdyn_agentscript_v2id'/>"  +
									"<attribute name='msdyn_name'/>" +
									"<attribute name='msdyn_description'/>" +
									"<order attribute='msdyn_name' descending='false'/>" +
									"<filter type='and'>" +
										`<condition attribute='msdyn_language' operator='eq' value='${this.languageId}' />` +
									"</filter>" +
									"<link-entity name='msdyn_msdyn_agentscript_v2_msdyn_sessiontempl' intersect='true' visible='false' to='msdyn_agentscript_v2id' from='msdyn_agentscript_v2id'>" +
									"<link-entity name='msdyn_sessiontemplate' from='msdyn_sessiontemplateid' to='msdyn_sessiontemplateid' alias='bb'>" +
									"<filter type='and'>" +
										`<condition attribute='msdyn_uniquename' operator='eq' value='${sessionTemplateUniqueName}'/>` +
									"</filter>"  +
									"</link-entity>" +
									"</link-entity>" +
								"</entity>" +
							"</fetch>";

			return fetchXml;
		}

		/**
		 * Get fetchxml query to retrieve call script steps for given call script id
		 * @param callscriptId call script id
		 */
		private getStepsFetchxml(callscriptId: string): string
		{
			let fetchxml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' returntotalrecordcount='true' page='1' no-lock='false'>" +
								"<entity name='msdyn_agentscriptstep_v2'>" +
									"<attribute name='msdyn_agentscriptstep_v2id'/>" +
									"<attribute name='msdyn_name'/>" +
									"<attribute name='msdyn_order'/>" +
									"<attribute name='msdyn_actiontype'/>" +
									"<attribute name='msdyn_description'/>" +
									"<attribute name='msdyn_textinstruction'/>" +
									"<attribute name='msdyn_routeactionid'/>" +
									"<attribute name='msdyn_macroactionid'/>" +
									"<order attribute='msdyn_order' descending='false'/>" +
									"<link-entity name='msdyn_agentscript_v2' from='msdyn_agentscript_v2id' to='msdyn_agentscriptid' alias='bb'>" +
										"<filter type='and'>" +
											`<condition attribute='msdyn_agentscript_v2id' operator='eq' value='${callscriptId}'/>` +
										"</filter>" +
									"</link-entity>" +
									"</entity>" +
								"</fetch>";

			return fetchxml;
        }     
	}
}