/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
/// <reference path="Constants.ts" />
/// <reference path="../../TypeDefinitions/msdyn_internal_ci_library.d.ts" />

/** @internal */
namespace Microsoft.ProductivityMacros.Internal {

	/**
	 * utility func to check whether an object is null or undefined
	 */
	export function isNullOrUndefined(obj: any) {
		return (obj == null || typeof obj === "undefined");
	}

    function getCustomArray(formInputs: any): any {
        let ret: any = {};
        if (isNullOrUndefined(formInputs.Custom_Array)) {
            return ret;
        }
        Object.keys(formInputs.Custom_Array).forEach(function (key) {
            let attrib = formInputs.Custom_Array[key];
            ret[attrib.Name] = attrib.Value;
        });
        return ret;
    }

	export function openNewForm(actionName: string, formInputs: any): Promise<string> {
		if (!(isNullOrUndefined(formInputs))) {
			var tabInput: XrmClientApi.TabInput = {
				pageInput: {
					pageType: "entityrecord" as any,
                    entityName: formInputs.EntityName,
                    data: getCustomArray(formInputs)
				},
				options: { isFocused: true }
			}
			return new Promise<any>((resolve, reject) => {
				createTab(tabInput).then(
					function (tabId: string) {
						var sessionContextParams: any = {};
						sessionContextParams[actionName + ".TabId"] = tabId;
						sessionContextParams[actionName + ".EntityName"] = formInputs.EntityName;
						sessionContextParams[actionName + ".PageType"] = "entityrecord";
						updateActionOutputInSessionContext(sessionContextParams);
						resolve(tabId);
					},
					function (error: Error) {
						reject(error);
					}
				);
			});

		} else {
			return Promise.reject("[openNewForm] - Input is undefined");
		}
	}

	export function openExistingForm(actionName: string, entityFormOptions: any): Promise<string> {
		if (!(isNullOrUndefined(entityFormOptions) || entityFormOptions == "")) {
			var tabInput: XrmClientApi.TabInput = {
				pageInput: {
					pageType: "entityrecord" as any,
					entityName: entityFormOptions.EntityName,
					entityId: entityFormOptions.EntityId,
					data: {}
				},
				options: { isFocused: true }
			};

			return new Promise<any>((resolve, reject) => {
				createTab(tabInput).then(
					function (tabId: string) {
						var sessionContextParams: any = {};
						sessionContextParams[actionName + Constants.SuffixTabId] = tabId;
						sessionContextParams[actionName + Constants.SuffixEntityName] = entityFormOptions.EntityName;
						sessionContextParams[actionName + Constants.SuffixEntityId] = entityFormOptions.EntityId;
						sessionContextParams[actionName + Constants.SuffixPageType] = "entityrecord";
						updateActionOutputInSessionContext(sessionContextParams);
						resolve(tabId);
					},
					function (error: Error) {
						reject(error);
					}
				);
			});
		} else {
			return Promise.reject("[openExistingForm] - Input is undefined");
		}
	}

	export function draftEmail(actionName: string, entityFormData: any): Promise<string> {
		if (!(isNullOrUndefined(entityFormData) || entityFormData == "")) {
			// Create new array
			var partylist = new Array();
			partylist[0] = new Object();
			partylist[0].id = entityFormData.EntityId;
			partylist[0].name = entityFormData.PartyListName;
			partylist[0].entityType = entityFormData.EntityName;
			var formParameters: any;
			if (entityFormData.TemplateId) {
				return InstantiateEmailTemplate(entityFormData).then((result: any) => {
					if (result && !isNullOrUndefined(result.value[0]) && !isNullOrUndefined(result.value[0].subject)
						&& !isNullOrUndefined(result.value[0].description)) {
						// Set form paramters
						formParameters = {
							"to": partylist,
							"subject": result.value[0].subject,
							"description": result.value[0].description
						};
						var tabInput: XrmClientApi.TabInput = {
							pageInput: {
								pageType: "entityrecord" as any,
								entityName: "email",
								data: formParameters
							},
							options: { isFocused: true }
						}
						return new Promise<any>((resolve, reject) => {
							//let createTabAction: Promise<string> = createTab(tabInput);
							createTab(tabInput).then(
								function (tabId: string) {
									var sessionContextParams: any = {};
									sessionContextParams[actionName + Constants.SuffixTabId] = tabId;
									sessionContextParams[actionName + Constants.SuffixEntityName] = entityFormData.EntityName;
									sessionContextParams[actionName + Constants.SuffixPageType] = "entityrecord";
									updateActionOutputInSessionContext(sessionContextParams);
									return resolve(tabId);
								},
								function (error: Error) {
									return reject(error);
								}
							);
						});
					}
				});
			} else {
				formParameters = {
					"to": partylist,
					"subject": entityFormData.subject,
					"description": entityFormData.description
				};
				var tabInput: XrmClientApi.TabInput = {
					pageInput: {
						pageType: "entityrecord" as any,
						entityName: "email",
						data: formParameters
					},
					options: { isFocused: true }
				}
				return new Promise<any>((resolve, reject) => {
					createTab(tabInput).then(
						function (success: any) {
							resolve(success);
						}.bind(this, actionName),
						function (error: Error) {
							reject(error);
						}
					);
				});
			}
		} else {
			// Log telemetry error
		}
	}

	export function openGrid(actionName: string, entityListOptions: any): Promise<string> {
		if (!(isNullOrUndefined(entityListOptions) || entityListOptions == "")) {
			var tabInput: XrmClientApi.TabInput = {
				pageInput: {
					pageType: "entitylist" as any,
					entityName: entityListOptions.EntityName,
					viewId: entityListOptions.ViewId,
					viewType: entityListOptions.ViewType
				},
				options: { isFocused: true }
			};
			return new Promise<any>((resolve, reject) => {
				createTab(tabInput).then(
					function (tabId: string) {
						var sessionContextParams: any = {};
						sessionContextParams[actionName + Constants.SuffixTabId] = tabId;
						sessionContextParams[actionName + Constants.SuffixEntityName] = entityListOptions.EntityName;
						sessionContextParams[actionName + Constants.SuffixPageType] = "entityrecord";
						updateActionOutputInSessionContext(sessionContextParams);
						resolve(tabId);
					}.bind(this, actionName),
					function (error: Error) {
						reject(error);
					}
				);
			});
		} else {
			// Log telemetry error
		}
	}

	export function openDashboard(actionName: string, dashboardPageOptions: any): Promise<string> {
		if (!(isNullOrUndefined(dashboardPageOptions) || dashboardPageOptions == "")) {
			var tabInput: XrmClientApi.TabInput = {
				pageInput: {
					pageType: "dashboard" as any,
					navigationPath: dashboardPageOptions.navigationPath,
					dashboardId: dashboardPageOptions.dashboardId,
					entityType: dashboardPageOptions.entityType,
					type: dashboardPageOptions.type
				},
				options: { isFocused: true }
			};
			return new Promise<any>((resolve, reject) => {
				createTab(tabInput).then(
					function (success: any) {
						resolve(success);
					}.bind(this, actionName),
					function (error: Error) {
						reject(error);
					}
				);
			});
		} else {
			// Log telemetry error
		}
	}

	export function openSearchPage(actionName: string, searchPageOptions: any): Promise<string> {
		if (!(isNullOrUndefined(searchPageOptions) || searchPageOptions == "")) {
			var tabInput: XrmClientApi.TabInput = {
				pageInput: {
					pageType: "search" as any,
					searchText: searchPageOptions.SearchString,
					searchType: XrmClientApi.Constants.SearchType.RelevanceSearch,
					EntityNames: searchPageOptions.EntityNames
				},
				options: { isFocused: true }
			};
			return new Promise<any>((resolve, reject) => {
				createTab(tabInput).then(
					function (tabId: string) {
						var sessionContextParams: any = {};
						sessionContextParams[actionName + Constants.SuffixTabId] = tabId;
						updateActionOutputInSessionContext(sessionContextParams);
						resolve(tabId);
					}.bind(this, actionName),
					function (error: Error) {
						reject(error);
					}
				);
			});
		} else {
			// Log telemetry error
		}
	}

	export function openKBSearchControl(actionName: string, searchPageOptions: any): Promise<string> {
		try {
			var tabInput: XrmClientApi.TabInput = {
				pageInput: {
					pageType: "webresource" as any,
					webresourceName: "msdyn_kbsearchpagehost.html",
					data: searchPageOptions.SearchString
				},
				options: { isFocused: true }
			};
			return new Promise<any>((resolve, reject) => {
				createTab(tabInput).then(
					function (tabId: string) {
						var sessionContextParams: any = {};
						sessionContextParams[actionName + Constants.SuffixTabId] = tabId;
						updateActionOutputInSessionContext(sessionContextParams);
						resolve(tabId);
					}.bind(this, actionName),
					function (error: Error) {
						reject(error);
					}
				);
			});
		}
		catch (error) {
			return Promise.reject(error);
		}
	}

	export function save(): Promise<any> {
		return new Promise(function (resolve: any, reject: any) {
			(((((window as any).top) as any).Xrm) as any).Page.data.save().then(function (tabId: any) {
				// Log telemetry data
				//logApiData(telemetryData, startTime, Date.now() - startTime.getTime(), apiName);
				resolve(tabId);
			}.bind(this), function (errorMessage: string) {
				// Log telemetry error
				reject(errorMessage);
			});
		});

	}

	export function getEnvironment(): Map<string, any> {
		//Xrm.Page is deprecated hence definition not available in .d.ts
		//Using eval(...) to avoid compiler error
		var data: Map<string, any> = new Map<string, any>();
		try {
			//let startTime = new Date();
			let pageUrl: any = new URL(eval("window.top.Xrm.Page.getUrl()") as string);
			//let timeTaken = Date.now() - startTime.getTime();
			//let apiName = "Xrm.Page.getUrl"
			//logApiData(telemetryData, startTime, timeTaken, apiName);

			for (var entry of pageUrl.searchParams.entries()) {
				data.set(entry[0], entry[1]);
			}
		}
		catch (error) {
			//geturl not available on this page
		}

		let startTime = new Date();
		var context: XrmClientApi.GlobalContext = Xrm.Utility.getGlobalContext();
		//let timeTaken = Date.now() - startTime.getTime();
		//let apiName = "Xrm.Utility.getGlobalContext";
		//logApiData(telemetryData, startTime, timeTaken, apiName);

		data.set(Constants.ClientUrl, context.getClientUrl());
		data.set(Constants.AppUrl, context.getCurrentAppUrl());
		data.set(Constants.OrgLcid, context.organizationSettings.languageId);
		data.set(Constants.OrgUniqueName, context.organizationSettings.uniqueName);
		data.set(Constants.OrgId, context.organizationSettings.organizationId);
		data.set(Constants.UserId, context.userSettings.userId);
		data.set(Constants.UserLcid, context.userSettings.languageId);
		data.set(Constants.UserName, context.userSettings.userName);
		data.set(Constants.UserRoles, context.userSettings.securityRoles);
		data.set(Constants.crmVersion, context.getVersion());
		return data;
	}

    export function updateRecord(actionName: string, entityData: any): Promise<Map<string, any>> {
        if (!entityData) {
			/*let errorData = {} as IErrorHandler;
			errorData.errorMsg = "Need values to Update for updateRecord";
			errorData.errorType = errorTypes.InvalidParams;
			errorData.reportTime = new Date().toUTCString();
			errorData.sourceFunc = "client.updateRecord";
			return Promise.reject(errorData);*/
        }
        let data = getCustomArray(entityData)
        return new Promise<Map<string, any>>((resolve, reject) => {
            //let startTime = new Date();
            return Xrm.WebApi.updateRecord(entityData.EntityName, entityData.EntityId, data).then(
                (result: XrmClientApi.LookupValue) => {
                    var sessionContextParams: any = {};
                    sessionContextParams[actionName + Constants.SuffixEntityName] = entityData.EntityName;
                    sessionContextParams[actionName + Constants.SuffixEntityId] = entityData.EntityId;
                    updateActionOutputInSessionContext(sessionContextParams);
                    return resolve(buildMap(result));
                },
                (error: Error) => {
					/*let errorData = generateErrorObject(error, "client.updateRecord - Xrm.WebApi.updateRecord", errorTypes.XrmApiError);
					return reject(errorData);*/
                });
        });
    }

	export function retrieveRecord(entityData: any): Promise<Map<string, any>> {
		return new Promise<Map<string, any>>((resolve, reject) => {
			let startTime = new Date();
			return Xrm.WebApi.retrieveRecord(entityData.EntityName, entityData.EntityId, entityData.Query).then(
				(result: XrmClientApi.WebApi.Entity) => {
					/*let timeTaken = Date.now() - startTime.getTime();
					let apiName = "Xrm.WebApi.retrieveRecord";
					logApiData(telemetryData, startTime, timeTaken, apiName);*/
					return resolve(buildMap(result));
				},
				(error: Error) => {
					/*let errorData = generateErrorObject(error, "client.retrieveRecord - Xrm.WebApi.retrieveRecord", errorTypes.XrmApiError);
					return reject(errorData);*/
				});
		});

	}

	function createTab(input: XrmClientApi.TabInput, telemetryData?: Object): Promise<string> {
		//let startTime = new Date();
		//let apiName = "Xrm.App.sessions.getSession(sessionId).tabs.createTab";
        let cifExternal = new Microsoft.CIFramework.External.CIFExternalUtilityImpl();
        return cifExternal.createTab(input);

	}

	/**
	 * Given a map, this func returns an equivalent XrmClientApi.WebApi.Entity object for it.
	 * @param map Object to build the entity for.
	 */
	function buildEntity(map: Map<string, any>): XrmClientApi.WebApi.Entity {
		let entity: XrmClientApi.WebApi.Entity = {};
		map.forEach((value, key) => {
			entity[key] = value;
		});
		return entity;
	}

	/**
	 * Given a key-value object, this func returns an equivalent Map object for it.
	 * @param dict Object to build the map for.
	 */
	export function buildMap(dict: XrmClientApi.WebApi.Entity | Error): Map<string, any> {
		if (isError(dict)) {
			return createErrorMap(dict.message);
		}
		else {
			let map = new Map<string, any>();
			Object.keys(dict).forEach((key) => {
				map.set(key, dict[key]);
			});
			return map;
		}
	}

	function updateActionOutputInSessionContext(input: any) {
		let cifExt = new Microsoft.CIFramework.External.CIFExternalUtilityImpl();
		cifExt.setSessionTemplateParams(input);
	}

	/**
	 * utility func to create a error map with the error message and optional error code
	*/
	export function createErrorMap(errorMessage: string, apiName?: string) {
		return new Map().set("message", errorMessage).set("msdyn_name", apiName);
	}

	/**
	 * utility func to check whether argument passed if of type Error Object
	 * @param arg Object to check whether it is Error or not.
	*/
	export function isError(arg: XrmClientApi.WebApi.Entity | Error): arg is Error {
		return ((<Error>arg).message !== undefined);
	}

	export function resolveIncident(actionName: string, entityFormData: any): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			var parameters = {
				"IncidentId":
				{
					"incidentid": entityFormData.IncidentId,
					"@odata.type": "Microsoft.Dynamics.CRM.incident"
				},
				"Status": 5,
				"BillableTime": entityFormData.BillableTime,
				"Resolution": entityFormData.Resolution,
				"Remarks": entityFormData.Remarks
			}
			var requestUrl = "/api/data/v9.0/ResolveIncident?tag=abortbpf";
			var context: XrmClientApi.GlobalContext = Xrm.Utility.getGlobalContext();
			var req = new XMLHttpRequest();
			req.open("POST", context.getClientUrl() + requestUrl, true);
			req.setRequestHeader("OData-MaxVersion", "4.0");
			req.setRequestHeader("OData-Version", "4.0");
			req.setRequestHeader("Accept", "application/json");
			req.setRequestHeader("Content-Type", "application/json; charset=utf-8");

			req.onreadystatechange = function () {
				if (req.readyState === 4) {
					req.onreadystatechange = null;
					if (req.status === 204) {
						var sessionContextParams: any = {};
						sessionContextParams[actionName + Constants.SuffixEntityName] = "incident";
						sessionContextParams[actionName + Constants.SuffixEntityId] = entityFormData.IncidentId;
						sessionContextParams[actionName + Constants.SuffixPageType] = "entityrecord";
						updateActionOutputInSessionContext(sessionContextParams)
						resolve("Success");
					} else {
						var errorText = req.responseText;
						reject(errorText);
					}
				}
			};
			req.send(JSON.stringify(parameters));
		});
	}

	function InstantiateEmailTemplate(entityFormData: any): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			var parameters = {
				"TemplateId": entityFormData.TemplateId, //template Id
				"ObjectType": entityFormData.EntityName, //Entity logical name in lowercase
				"ObjectId": entityFormData.EntityId //record id for the entity above
			};
			var requestUrl = "/api/data/v9.1/InstantiateTemplate";
			var context: XrmClientApi.GlobalContext = Xrm.Utility.getGlobalContext();
			var req = new XMLHttpRequest();
			req.open("POST", context.getClientUrl() + requestUrl, true);
			req.setRequestHeader("OData-MaxVersion", "4.0");
			req.setRequestHeader("OData-Version", "4.0");
			req.setRequestHeader("Accept", "application/json");
			req.setRequestHeader("Content-Type", "application/json; charset=utf-8");

			req.onreadystatechange = function () {
				if (req.readyState === 4) {
					req.onreadystatechange = null;
					if (req.status === 200) {
						var result = JSON.parse(req.response); //template result containing resolved subject and description fields
						resolve(result);
					} else {
						var errorText = req.responseText;
						reject(errorText);
					}
				}
			};
			req.send(JSON.stringify(parameters));
		});
	}
}