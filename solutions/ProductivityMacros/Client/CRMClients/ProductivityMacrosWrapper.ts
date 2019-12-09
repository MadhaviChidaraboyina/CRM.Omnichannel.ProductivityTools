/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
/// <reference path="Constants.ts" />
/// <reference path="../../TypeDefinitions/msdyn_internal_ci_library.d.ts" />
/// <reference path="../TelemetryHelper.ts" />

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
          return new Promise<any>((resolve, reject) => {
            getNavigationType().then((navigationType: any) => { 
                if (navigationType == 1) {
                    var tabInput: XrmClientApi.TabInput = {
                        pageInput: {
                            pageType: "entityrecord" as any,
                            entityName: formInputs.EntityName,
                            data: getCustomArray(formInputs)
                        },
                        options: { isFocused: true }
                    }
                    createTab(tabInput).then(
                        function (tabId: string) {
                            var ouputResponse: any = {};
                            var sessionContextParams: any = {};
                            sessionContextParams[actionName + ".TabId"] = tabId;
                            sessionContextParams[actionName + ".EntityName"] = formInputs.EntityName;
                            sessionContextParams[actionName + ".PageType"] = "entityrecord";
                            ouputResponse[Constants.OutputResult] = sessionContextParams;
                            logSuccess("ProductivityMacrosWrapper - openNewForm", "");
                            resolve(ouputResponse);
                        },
                        function (error: Error) {
                            let errorObject = generateErrorObject(error, "ProductivityMacrosWrapper - openNewForm", errorTypes.GenericError);
                            logFailure("openNewForm", errorObject, "");
                            reject(error.message);
                        }
                    );
                } else {
                    var efo: XrmClientApi.EntityFormOptions = {
                        entityName: formInputs.EntityName,
                        useQuickCreateForm: false
                    }

                    var parameters: XrmClientApi.FormParameters = getCustomArray(formInputs);

                    Xrm.Navigation.openForm(efo, parameters).then(function (res) {
                        var ouputResponse: any = {};
                        var sessionContextParams: any = {};
                        sessionContextParams[actionName + ".EntityName"] = formInputs.EntityName;
                        sessionContextParams[actionName + ".PageType"] = "entityrecord";
                        sessionContextParams[actionName + ".EntityId"] = res.savedEntityReference[0].id;
                        ouputResponse[Constants.OutputResult] = sessionContextParams;
                        return resolve(ouputResponse);
                    },
                    function (error: Error) {
                        let errorData = generateErrorObject(error, "client.openForm - Xrm.Navigation.openForm", errorTypes.XrmApiError);
                        return reject(errorData);
                    });
                }
            });
        });
    } else {
        let errorObject = {} as IErrorHandler;
        errorObject.errorMsg = "formInputs is Null or Undefined";
        errorObject.errorType = errorTypes.InvalidParams;
        errorObject.reportTime = new Date().toUTCString();
        errorObject.sourceFunc = "ProductivityMacrosWrapper - openNewForm";
        logFailure("openNewForm", errorObject, "");
        return Promise.reject("openNewForm - formInputs is Null or Undefined");
    }
    }

    export function openExistingForm(actionName: string, entityFormOptions: any): Promise<string> {
        if (!(isNullOrUndefined(entityFormOptions) || entityFormOptions == "")) {
            return new Promise<any>((resolve, reject) => {
                getNavigationType().then((navigationType: any) => { 
                    if (navigationType == 1) {
                        var tabInput: XrmClientApi.TabInput = {
                            pageInput: {
                                pageType: "entityrecord" as any,
                                entityName: entityFormOptions.EntityName,
                                entityId: entityFormOptions.EntityId,
                                data: {}
                            },
                            options: { isFocused: true }
                        };

                        createTab(tabInput).then(
                            function (tabId: string) {
                                var ouputResponse: any = {};
                                var sessionContextParams: any = {};
                                sessionContextParams[actionName + Constants.SuffixTabId] = tabId;
                                sessionContextParams[actionName + Constants.SuffixEntityName] = entityFormOptions.EntityName;
                                sessionContextParams[actionName + Constants.SuffixEntityId] = entityFormOptions.EntityId;
                                sessionContextParams[actionName + Constants.SuffixPageType] = "entityrecord";
                                ouputResponse[Constants.OutputResult] = sessionContextParams;
                                logSuccess("ProductivityMacrosWrapper - openExistingForm", "");
                                resolve(ouputResponse);
                            },
                            function (error: Error) {
                                let errorObject = generateErrorObject(error, "ProductivityMacrosWrapper - openExistingForm", errorTypes.GenericError);
                                logFailure("openExistingForm", errorObject, "");
                                reject(error.message);
                            }
                        );
                    } else {
                        var efo: XrmClientApi.EntityFormOptions = {
                            entityName: entityFormOptions.EntityName,
                            entityId: entityFormOptions.EntityId
                        }

                        Xrm.Navigation.openForm(efo,null).then(function (res) {
                            var ouputResponse: any = {};
                            var sessionContextParams: any = {};
                            sessionContextParams[actionName + Constants.SuffixEntityName] = res.savedEntityReference[0].name;
                            sessionContextParams[actionName + Constants.SuffixPageType] = "entityrecord";
                            sessionContextParams[actionName + Constants.SuffixEntityId] = res.savedEntityReference[0].id;
                            ouputResponse[Constants.OutputResult] = sessionContextParams;
                            return resolve(ouputResponse);
                        },
                        function (error: Error) {
                            let errorData = generateErrorObject(error, "client.openForm - Xrm.Navigation.openForm", errorTypes.XrmApiError);
                            return reject(errorData);
                        });
                    }
                });
            });
            } else {
                let errorObject = {} as IErrorHandler;
                errorObject.errorMsg = "entityFormOptions is Null or Undefined";
                errorObject.errorType = errorTypes.InvalidParams;
                errorObject.reportTime = new Date().toUTCString();
                errorObject.sourceFunc = "ProductivityMacrosWrapper - openExistingForm";
                logFailure("openExistingForm", errorObject, "");
                return Promise.reject("openExistingForm - entityFormOptions is Null or Undefined");
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
                            getNavigationType().then((navigationType: any) => {
                                if (navigationType == 1) {
                                    createTab(tabInput).then(
                                        function (tabId: string) {
                                            var ouputResponse: any = {};
                                            var sessionContextParams: any = {};
                                            sessionContextParams[actionName + Constants.SuffixTabId] = tabId;
                                            sessionContextParams[actionName + Constants.SuffixEntityName] = entityFormData.EntityName;
                                            sessionContextParams[actionName + Constants.SuffixPageType] = "entityrecord";
                                            ouputResponse[Constants.OutputResult] = sessionContextParams;
                                            logSuccess("ProductivityMacrosWrapper - draftEmail", "");
                                            return resolve(ouputResponse);
                                        },
                                        function (error: Error) {
                                            let errorObject = generateErrorObject(error, "ProductivityMacrosWrapper - draftEmail", errorTypes.GenericError);
                                            logFailure("draftEmail", errorObject, "");
                                            reject(error.message);
                                        }
                                    );
                                }
                            });
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
                    getNavigationType().then((navigationType: any) => {
                        if (navigationType == 1) {
                            createTab(tabInput).then(
                                function (success: any) {
                                    logSuccess("ProductivityMacrosWrapper - draftEmail", "");
                                    resolve(success);
                                }.bind(this, actionName),
                                function (error: Error) {
                                    let errorObject = generateErrorObject(error, "ProductivityMacrosWrapper - draftEmail", errorTypes.GenericError);
                                    logFailure("draftEmail", errorObject, "");
                                    reject(error.message);
                                }
                            );
                        }
                    });
                });
            }
        } else {
            let errorObject = {} as IErrorHandler;
            errorObject.errorMsg = "entityFormData is Null or Undefined";
            errorObject.errorType = errorTypes.InvalidParams;
            errorObject.reportTime = new Date().toUTCString();
            errorObject.sourceFunc = "ProductivityMacrosWrapper - draftEmail";
            logFailure("draftEmail", errorObject, "");
            return Promise.reject("draftEmail - entityFormData is Null or Undefined");
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
                getNavigationType().then((navigationType: any) => {
                    if (navigationType == 1) {
                        createTab(tabInput).then(
                            function (tabId: string) {
                                var ouputResponse: any = {};
                                var sessionContextParams: any = {};
                                sessionContextParams[actionName + Constants.SuffixTabId] = tabId;
                                sessionContextParams[actionName + Constants.SuffixEntityName] = entityListOptions.EntityName;
                                sessionContextParams[actionName + Constants.SuffixPageType] = "entityrecord";
                                ouputResponse[Constants.OutputResult] = sessionContextParams;
                                logSuccess("ProductivityMacrosWrapper - openGrid", "");
                                resolve(ouputResponse);
                            }.bind(this, actionName),
                            function (error: Error) {
                                let errorObject = generateErrorObject(error, "ProductivityMacrosWrapper - openGrid", errorTypes.GenericError);
                                logFailure("openGrid", errorObject, "");
                                reject(error.message);
                            }
                        );
                    }
                });
            });
        } else {
            let errorObject = {} as IErrorHandler;
            errorObject.errorMsg = "entityListOptions is Null or Undefined";
            errorObject.errorType = errorTypes.InvalidParams;
            errorObject.reportTime = new Date().toUTCString();
            errorObject.sourceFunc = "ProductivityMacrosWrapper - openGrid";
            logFailure("openGrid", errorObject, "");
            return Promise.reject("openGrid - entityListOptions is Null or Undefined");
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
                getNavigationType().then((navigationType: any) => {
                    if (navigationType == 1) {
                        createTab(tabInput).then(
                            function (success: any) {
                                logSuccess("ProductivityMacrosWrapper - openDashboard", "");
                                resolve(success);
                            }.bind(this, actionName),
                            function (error: Error) {
                                let errorObject = generateErrorObject(error, "ProductivityMacrosWrapper - openDashboard", errorTypes.GenericError);
                                logFailure("openDashboard", errorObject, "");
                                reject(error.message);
                            }
                        );
                    }
                });
            });
        } else {
            let errorObject = {} as IErrorHandler;
            errorObject.errorMsg = "dashboardPageOptions is Null or Undefined";
            errorObject.errorType = errorTypes.InvalidParams;
            errorObject.reportTime = new Date().toUTCString();
            errorObject.sourceFunc = "ProductivityMacrosWrapper - openDashboard";
            logFailure("openDashboard", errorObject, "");
            return Promise.reject("openDashboard - dashboardPageOptions is Null or Undefined");
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
                getNavigationType().then((navigationType: any) => {
                    if (navigationType == 1) {
                        createTab(tabInput).then(
                            function (tabId: string) {
                                var ouputResponse: any = {};
                                var sessionContextParams: any = {};
                                sessionContextParams[actionName + Constants.SuffixTabId] = tabId;
                                ouputResponse[Constants.OutputResult] = sessionContextParams;
                                logSuccess("ProductivityMacrosWrapper - openSearchPage", "");
                                resolve(ouputResponse);
                            }.bind(this, actionName),
                            function (error: Error) {
                                let errorObject = generateErrorObject(error, "ProductivityMacrosWrapper - openSearchPage", errorTypes.GenericError);
                                logFailure("openSearchPage", errorObject, "");
                                reject(error.message);
                            }
                        );
                    }
                });
            });
        } else {
            let errorObject = {} as IErrorHandler;
            errorObject.errorMsg = "searchPageOptions is Null or Undefined";
            errorObject.errorType = errorTypes.InvalidParams;
            errorObject.reportTime = new Date().toUTCString();
            errorObject.sourceFunc = "ProductivityMacrosWrapper - openSearchPage";
            logFailure("openSearchPage", errorObject, "");
            return Promise.reject("openSearchPage - searchPageOptions is Null or Undefined");
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
                getNavigationType().then((navigationType: any) => {
                    if (navigationType == 1) {
                        createTab(tabInput).then(
                            function (tabId: string) {
                                var ouputResponse: any = {};
                                var sessionContextParams: any = {};
                                sessionContextParams[actionName + Constants.SuffixTabId] = tabId;
                                ouputResponse[Constants.OutputResult] = sessionContextParams;
                                logSuccess("ProductivityMacrosWrapper - openKBSearchControl", "");
                                resolve(ouputResponse);
                            }.bind(this, actionName),
                            function (error: Error) {
                                let errorObject = generateErrorObject(error, "ProductivityMacrosWrapper - openKBSearchControl", errorTypes.GenericError);
                                logFailure("openKBSearchControl", errorObject, "");
                                reject(error.message);
                            }
                        );
                    }
                });
            });
        }
        catch (error) {
            let errorObject = {} as IErrorHandler;
            errorObject.errorMsg = error;
            errorObject.errorType = errorTypes.InvalidParams;
            errorObject.reportTime = new Date().toUTCString();
            errorObject.sourceFunc = "ProductivityMacrosWrapper - openKBSearchControl";
            logFailure("openKBSearchControl", errorObject, "");
            return Promise.reject(error);
        }
    }

    export function save(actionName: string): Promise<any> {
        let telemetryData =  new Object() ;
        return new Promise(function (resolve: any, reject: any) {
            let startTime = new Date();
            (((((window as any).top) as any).Xrm) as any).Page.data.save().then(function (response: any) {
                logNestedApiData(telemetryData, startTime, Date.now() - startTime.getTime(), "Xrm.Page.data.save");
                logSuccess("ProductivityMacrosWrapper - save", "", telemetryData);
                var ouputResponse: any = {};
                var sessionContextParams: any = {};
                sessionContextParams[actionName + ProductivityMacros.Constants.SuffixEntityName] = response.savedEntityReference.entityType;
                sessionContextParams[actionName + ProductivityMacros.Constants.SuffixEntityId] = response.savedEntityReference.id;
                sessionContextParams[actionName + ProductivityMacros.Constants.SuffixPrimaryNameAttributeValue] = response.savedEntityReference.name;
                ouputResponse[Constants.OutputResult] = sessionContextParams;
                resolve(ouputResponse);
            }.bind(this), function (errorMessage: string) {
                let errorObject = {} as IErrorHandler;
                errorObject.errorMsg = errorMessage;
                errorObject.errorType = errorTypes.XrmApiError;
                errorObject.reportTime = new Date().toUTCString();
                errorObject.sourceFunc = "ProductivityMacrosWrapper - save";
                logFailure("save", errorObject, "");
                return Promise.reject(errorMessage);
            });
        });
    }

    export function getEnvironment(): Map<string, any> {
        //Xrm.Page is deprecated hence definition not available in .d.ts
        //Using eval(...) to avoid compiler error
        var data: Map<string, any> = new Map<string, any>();
        try {
            let telemetryData = new Object();
            let startTime = new Date();
            let pageUrl: any = new URL(eval("window.top.Xrm.Page.getUrl()") as string);
            let timeTaken = Date.now() - startTime.getTime();
            logNestedApiData(telemetryData, startTime, timeTaken, "Xrm.Page.getUrl");
            for (var entry of pageUrl.searchParams.entries()) {
                data.set(entry[0], entry[1]);
            }
        }
        catch (error) {
            let errorObject = {} as IErrorHandler;
            errorObject.errorMsg = "geturl not available on this page";
            errorObject.errorType = errorTypes.GenericError;
            errorObject.reportTime = new Date().toUTCString();
            errorObject.sourceFunc = "ProductivityMacrosWrapper - getEnvironment";
            logFailure("getEnvironment", errorObject, "");
            return createErrorMap("getUrl not available on this page", "getEnvironment");
        }

        let startTime = new Date();
        let telemetryData = new Object;
        var context: XrmClientApi.GlobalContext = Xrm.Utility.getGlobalContext();
        let timeTaken = Date.now() - startTime.getTime();
        logNestedApiData(telemetryData, startTime, timeTaken, "Xrm.Utility.getGlobalContext");

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
        logSuccess("ProductivityMacrosWrapper - getEnvironment", "", telemetryData);
        return data;
    }

    export function updateRecord(actionName: string, entityData: any,telemetryData?: Object | any): Promise<Map<string, any>> {
        if (!entityData) {
            /* let errorData = {} as IErrorHandler;
            errorData.errorMsg = "Need values to Update for updateRecord";
            errorData.errorType = errorTypes.InvalidParams;
            errorData.reportTime = new Date().toUTCString();
            errorData.sourceFunc = "ProductivityMacros.updateRecord";
            //return Promise.reject(errorData);
            */
            return Promise.reject(createErrorMap("Need values to Update for updateRecord", "updateRecord")); // should be removed add logrejectanderror mrthod here
        }
        let data = getCustomArray(entityData)
        return new Promise<Map<string, any>>((resolve, reject) => {
            let startTime = new Date();
            return Xrm.WebApi.updateRecord(entityData.EntityName, entityData.EntityId, data).then(
                (result: XrmClientApi.LookupValue) => {
                    let timeTaken = Date.now() - startTime.getTime();
                    var ouputResponse: any = {};
                    var sessionContextParams: any = {};
                    sessionContextParams[actionName + Constants.SuffixEntityName] = entityData.EntityName;
                    sessionContextParams[actionName + Constants.SuffixEntityId] = entityData.EntityId;
                    ouputResponse[Constants.OutputResult] = sessionContextParams;
                    logNestedApiData(telemetryData, startTime, timeTaken, "Xrm.WebApi.updateRecord");
                    logSuccess("ProductivityMacrosWrapper - updateRecord", "", telemetryData);
                    return resolve(ouputResponse);
                },
                (error: Error) => {
                    let errorData = generateErrorObject(error, "ProductivityMacrosWrapper - updateRecord", errorTypes.XrmApiError);
                    logFailure("openNewForm", errorData, "");
                    return reject(error);
                });
        });
    }

    export function retrieveRecord(entityData: any, telemetryData?: Object | any): Promise<Map<string, any>> {
        return new Promise<Map<string, any>>((resolve, reject) => {
            let startTime = new Date();
            return Xrm.WebApi.retrieveRecord(entityData.EntityName, entityData.EntityId, entityData.Query).then(
                (result: XrmClientApi.WebApi.Entity) => {
                    let timeTaken = Date.now() - startTime.getTime();
                    logNestedApiData(telemetryData, startTime, timeTaken, "Xrm.WebApi.retrieveRecord");
                    logSuccess("ProductivityMacrosWrapper - retrieveRecord", "", telemetryData);
                    return resolve(buildMap(result));
                },
                (error: Error) => {
                    let errorData = generateErrorObject(error, "ProductivityMacrosWrapper - retrieveRecord", errorTypes.XrmApiError);
                    logFailure("openNewForm", errorData, "");
                    return reject(error);
                });
        });
    }

    function createTab(input: XrmClientApi.TabInput, telemetryData?: Object): Promise<string> {
        if (Microsoft.CIFramework && Microsoft.CIFramework.External) {  // For OC, CIF state is rehydrated using it's own runtime dictionary. So, we are creating tab using CIF createTab api here
            let cifExternal = new Microsoft.CIFramework.External.CIFExternalUtilityImpl();
            return cifExternal.createTab(input);
        } else {
            return Xrm.App.sessions.getFocusedSession().tabs.createTab(input);
        }
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
        let telemetryData = new Object();
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
            let startTime = new Date();
            var context: XrmClientApi.GlobalContext = Xrm.Utility.getGlobalContext();
            
            let timeTaken = Date.now() - startTime.getTime();
            logNestedApiData(telemetryData, startTime, timeTaken, "Xrm.Utility.getGlobalContext");
            
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
                        var ouputResponse: any = {};
                        var sessionContextParams: any = {};
                        sessionContextParams[actionName + Constants.SuffixEntityName] = "incident";
                        sessionContextParams[actionName + Constants.SuffixEntityId] = entityFormData.IncidentId;
                        sessionContextParams[actionName + Constants.SuffixPageType] = "entityrecord";
                        ouputResponse[Constants.OutputResult] = sessionContextParams;
                        logSuccess("ProductivityMacrosWrapper - resolveIncident", "", telemetryData);
                        resolve(ouputResponse);
                    } else {
                        let errorObject = {} as IErrorHandler;
                        errorObject.errorMsg = req.responseText;
                        errorObject.errorType = errorTypes.GenericError;
                        errorObject.reportTime = new Date().toUTCString();
                        errorObject.sourceFunc = "ProductivityMacrosWrapper - resolveIncident";
                        logFailure("resolveIncident", errorObject, "");
                        return Promise.reject(req.responseText);
                    }
                }
            };
            req.send(JSON.stringify(parameters));
        });
    }

    function InstantiateEmailTemplate(entityFormData: any): Promise<any> {
        let telemetryData = new Object();
        return new Promise<any>((resolve, reject) => {
            var parameters = {
                "TemplateId": entityFormData.TemplateId, //template Id
                "ObjectType": entityFormData.EntityName, //Entity logical name in lowercase
                "ObjectId": entityFormData.EntityId //record id for the entity above
            };
            var requestUrl = "/api/data/v9.1/InstantiateTemplate";
            let startTime = new Date();
            var context: XrmClientApi.GlobalContext = Xrm.Utility.getGlobalContext();
            
            let timeTaken = Date.now() - startTime.getTime();
            logNestedApiData(telemetryData, startTime, timeTaken, "Xrm.Utility.getGlobalContext");
            
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
                        logSuccess("ProductivityMacrosWrapper - InstantiateEmailTemplate", "", telemetryData);
                        resolve(result);
                    } else {
                        let errorObject = {} as IErrorHandler;
                        errorObject.errorMsg = req.responseText;
                        errorObject.errorType = errorTypes.GenericError;
                        errorObject.reportTime = new Date().toUTCString();
                        errorObject.sourceFunc = "ProductivityMacrosWrapper - instantiateEmailTemplate";
                        logFailure("instantiateEmailTemplate", errorObject, "");
                        return Promise.reject(req.responseText);
                    }
                }
            };
            req.send(JSON.stringify(parameters));
        });
    }

    function getNavigationType(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            var context: XrmClientApi.GlobalContext = Xrm.Utility.getGlobalContext();
            context.getCurrentAppProperties().then((result: any) => {
                var appId = result.appId;
                Xrm.WebApi.retrieveRecord("appmodule", appId, "?$select=name,navigationtype").then(
                    (data: any) => {
                        return resolve(data.navigationtype);
                    },
                    (error: any) => {
                        let errorObject = {} as IErrorHandler;
                        errorObject.errorMsg = error;
                        errorObject.errorType = errorTypes.XrmApiError;
                        errorObject.reportTime = new Date().toUTCString();
                        errorObject.sourceFunc = "ProductivityMacrosWrapper - getNavigationType";
                        logFailure("getNavigationType", errorObject, "");
                        return reject(error);
                    }
                );
            });
        });
    }
}