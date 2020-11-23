/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
/// <reference path="Constants.ts" />
/// <reference path="../../TypeDefinitions/AppRuntimeClientSdk.d.ts" />
/// <reference path="../TelemetryHelper.ts" />
/// <reference path="FPIHelper.ts" />

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

    function consolidateLookupObj(formInput: any): any {
        let ret: any = {};
        if (isNullOrUndefined(formInput)) {
            return ret;
        }
        let temp = formInput;
        Object.keys(temp).forEach(function (key) {
            let attribName = "";
            let _flag = true;
            if (key.endsWith("name"))
                attribName = key.substr(0, key.length - 4);

            if (key.endsWith("entitytype")) {
                attribName = key.substr(0, key.length - 10);
                _flag = false
            }

            if (_flag && key.endsWith("type"))
                attribName = key.substr(0, key.length - 4);

            if ((attribName != "") && (attribName in formInput) && (attribName + "name" in formInput) && ((attribName + "entitytype" in formInput) || (attribName + "type" in formInput))) {
                var lookupValue = new Array();
                lookupValue[0] = new Object();
                lookupValue[0].id = formInput[attribName];
                lookupValue[0].name = formInput[attribName + "name"];
                lookupValue[0].entityType = (attribName + "type" in formInput) ? formInput[attribName + "type"] : formInput[attribName + "entitytype"];
                ret[attribName] = lookupValue;

                delete formInput[attribName];
                delete formInput[attribName + "name"];
                attribName + "type" in formInput ? delete formInput[attribName + "type"] : delete formInput[attribName + "entitytype"];
            }
            else {
                if (key in formInput)
                    ret[key] = formInput[key];
            }
        });

        return ret;
    }

    function getCustomArrayFromEntityCollection(entities: any): any {
        let arrayObj: any = [];
        entities.forEach(function (item: any) {
            let obj: any = {};
            obj["Name"] = item.msdyn_name;
            obj["Value"] = item.msdyn_value;
            arrayObj.push(obj);
        });
        return arrayObj;
    }

    function focusTab(tabId: string): Promise<any> {
        if (!(isNullOrUndefined(tabId))) {
            return new Promise<any>((resolve, reject) => {
                let sessionId: string = getFocusedSessionId();
                let session = Microsoft.AppRuntime.Sessions.getSession(sessionId);
                let tab = session.getTab(tabId);
                tab.focus();
                resolve("tab in focus");
            });
        } else {
            return Promise.reject("tabId is null or undefined");
        }
    }

    function refreshTab(tabId: string): Promise<any> {
        if (!(isNullOrUndefined(tabId))) {
            return new Promise<any>((resolve, reject) => {
                let sessionId: string = getFocusedSessionId();
                let session = Microsoft.AppRuntime.Sessions.getSession(sessionId);
                let tab = session.getTab(tabId);
                tab.refresh();
                resolve("tab refreshed");
            });
        } else {
            return Promise.reject("tabId is null or undefined");
        }
    }

    function openTab(actionName: string, pageInput: XrmClientApi.PageInput, options: any): Promise<string> {
        return new Promise<any>(function (resolve, reject) {
            var tabInput: XrmClientApi.TabInput = {
                pageInput: pageInput,
                options: options
            }
            createTab(tabInput).then(
                function (tabId: string) {
                    var ouputResponse: any = {};
                    var sessionContextParams: any = {};
                    sessionContextParams[actionName + ".TabId"] = tabId;
                    sessionContextParams[actionName + ".PageType"] = tabInput.pageInput.pageType;
                    ouputResponse["result"] = sessionContextParams;
                    resolve(ouputResponse);
                },
                function (error: Error) {
                    reject(error.message);
                }
            );
        });
    }

    function getApplicationTemplate(guid: string): Promise<any> { // update consoleapplication
        return new Promise<any>(function (resolve, reject) {
            let xml = `<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
                          <entity name="msdyn_templateparameter">
                            <attribute name='msdyn_name' />
                            <attribute name='msdyn_value' />
                            <order attribute="msdyn_name" descending="false" />
                            <filter type="and">
                                <condition attribute='msdyn_applicationtabtemplateid' operator='eq' uitype='msdyn_applicationtabtemplate' value='{` + guid + `}' />
                            </filter>
                          </entity>
                        </fetch>`;

            Xrm.WebApi.retrieveMultipleRecords("msdyn_templateparameter", "?fetchXml=" + encodeURIComponent(xml)).then(function (result) {
                if (result.entities.length > 0)
                    resolve(result);
                else
                    reject("No Parameter found for given Applicate Tab Template - openApplicationTamplate");
            },
                function (error) {
                    reject(error)
                });
        });
    }

    function getApplicationTemplateRecord(guid: string): Promise<any> { 
        return new Promise<any>(function (resolve, reject) {
            let xml = `<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
                          <entity name="msdyn_applicationtabtemplate">
                            <attribute name='msdyn_title' />
                            <filter type="and">
                                <condition attribute='msdyn_applicationtabtemplateid' operator='eq' uitype='msdyn_applicationtabtemplate' value='{` + guid + `}' />
                            </filter>
                          </entity>
                        </fetch>`;
            Xrm.WebApi.retrieveMultipleRecords("msdyn_applicationtabtemplate", "?fetchXml=" + encodeURIComponent(xml)).then(function (result) {
                if (result.entities.length > 0)
                    resolve(result);
                else
                    reject("No Parameter found for given Applicate Tab Template - openApplicationTamplate");
            },
            function (error) {
                reject(error)
            });
        });
    }

    function getPageInput(entityData: any): XrmClientApi.PageInput {
        var pageInput: any = {};
        let i: number;
        let AppTabConstant = OpenAppTabType;
        switch (entityData.PageType.replace(/\s/g, "").toLowerCase()) {
            case AppTabConstant.CustomControlInputString:
            case AppTabConstant.Control:
                pageInput.pageType = AppTabConstant.Control;
                for (i = 0; i < entityData.Custom_Array.length; i++) {
                    try {
                        if (entityData.Custom_Array[i].Value !== undefined) {
                            pageInput[entityData.Custom_Array[i].Name] = entityData.Custom_Array[i].Value;
                            if (entityData.Custom_Array[i].Name.toLowerCase() == AppTabConstant.Data)
                                pageInput[entityData.Custom_Array[i].Name] = JSON.parse(entityData.Custom_Array[i].Value);
                        }
                    }
                    catch (e) {
                        continue;
                    }
                }
                break;
            case AppTabConstant.DashboardInputString:
                pageInput.pageType = AppTabConstant.Dashboard;
                for (i = 0; i < entityData.Custom_Array.length; i++) {
                    if (entityData.Custom_Array[i].Value !== undefined) {
                        pageInput[entityData.Custom_Array[i].Name] = entityData.Custom_Array[i].Value;
                    }
                }
                break;
            case AppTabConstant.EntityViewInputString:
            case AppTabConstant.Entitylist:
                pageInput.pageType = AppTabConstant.Entitylist;
                for (i = 0; i < entityData.Custom_Array.length; i++) {
                    if (entityData.Custom_Array[i].Value !== undefined) {
                        pageInput[entityData.Custom_Array[i].Name] = entityData.Custom_Array[i].Value;
                    }
                }
                break;
            case AppTabConstant.EntityRecordInputString:
                pageInput.pageType = AppTabConstant.Entityrecord;
                for (i = 0; i < entityData.Custom_Array.length; i++) {
                    try {
                        if (entityData.Custom_Array[i].Value !== undefined) {
                            switch (entityData.Custom_Array[i].Name.toLowerCase()) {
                                case AppTabConstant.Relationship:
                                    pageInput.relationship = JSON.parse(entityData.Custom_Array[i].Value);
                                    break;
                                case AppTabConstant.CreateFromEntity:
                                    pageInput.processInstanceId = JSON.parse(entityData.Custom_Array[i].Value);
                                    break;
                                case AppTabConstant.Data:
                                    pageInput.data = JSON.parse(entityData.Custom_Array[i].Value);
                                    break;
                                default:
                                    pageInput[entityData.Custom_Array[i].Name] = entityData.Custom_Array[i].Value;
                            }
                        }
                    }
                    catch (e) {
                        continue;
                    }
                }
                break;
            case AppTabConstant.EntitySearchInputString:
                pageInput.pageType = AppTabConstant.Search;
                for (i = 0; i < entityData.Custom_Array.length; i++) {
                    try {
                        if (entityData.Custom_Array[i].Value !== undefined) {
                            pageInput[entityData.Custom_Array[i].Name] = entityData.Custom_Array[i].Value;
                            if (entityData.Custom_Array[i].Name == AppTabConstant.SearchType)
                                pageInput[entityData.Custom_Array[i].Name] = parseInt(entityData.Custom_Array[i].Value);
                        }
                    }
                    catch (e) {
                        continue;
                    }
                }
                break;
            case AppTabConstant.WebResourceInputString:
                pageInput.pageType = AppTabConstant.Webresource;
                for (i = 0; i < entityData.Custom_Array.length; i++) {
                    if (entityData.Custom_Array[i].Value !== undefined) {
                        pageInput[entityData.Custom_Array[i].Name] = entityData.Custom_Array[i].Value;
                    }
                }
                break;
            case AppTabConstant.ThirdPartyWebsiteInputString:
            case AppTabConstant.ThirdPartyWebsiteInputString1:
                //keeping thirthpartyWebsite as weresource as currently we are not able to access
                //CIF public API and we are consuming Microsoft.CIFramework.External.CIFExternalUtilityImpl() to create tab
                //pageInput.pageType = "ThirdPartyWebsite";
                pageInput.pageType = AppTabConstant.Webresource;
                for (i = 0; i < entityData.Custom_Array.length; i++) {
                    if (entityData.Custom_Array[i].Value !== undefined) {
                        switch (entityData.Custom_Array[i].Name) {
                            case AppTabConstant.Data:
                                //pageInput.data = entityData.Custom_Array[i].Value;
                                pageInput.webresourceName = "msdyn_ExternalWebPageContainer.html";
                                break;
                            case AppTabConstant.Url:
                                //pageInput.url = entityData.Custom_Array[i].Value;
                                pageInput.data = "cif_thirdpartyurl" + entityData.Custom_Array[i].Value;
                                break;
                        }
                    }
                }
                break;
        }
        return pageInput;
    }

    function getFocusedSessionId() {
        if (Microsoft.AppRuntime && Microsoft.AppRuntime.Sessions) {
            return Microsoft.AppRuntime.Sessions.getFocusedSession().sessionId;
        } else {
            return Xrm.App.sessions.getFocusedSession().sessionId;
        }
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
                        if (!isNullOrUndefined(formInputs.FormId)) {
                            (tabInput.pageInput as XrmClientApi.FormPageInput).formId = formInputs.FormId;
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
                        if (!isNullOrUndefined(formInputs.FormId)) {
                            efo["formId"] = formInputs.FormId;
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
                        if (!isNullOrUndefined(entityFormOptions.FormId)) {
                            (tabInput.pageInput as XrmClientApi.FormPageInput).formId = entityFormOptions.FormId;
                        }
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

                        if (!isNullOrUndefined(entityFormOptions.FormId)) {
                            efo["formId"] = entityFormOptions.FormId;
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

    export function openKbArticle(actionName: string, entityFormOptions: any): Promise<String> {
        if (!(isNullOrUndefined(entityFormOptions) || entityFormOptions == "")) {
            entityFormOptions.EntityName = "knowledgearticle";
            return new Promise<any>((resolve, reject) => {
                openExistingForm(actionName, entityFormOptions).then(
                    (result) => {
                        return resolve(result);
                    },
                    function (error: Error) {
                        let errorObject = generateErrorObject(error, "ProductivityMacrosWrapper - openKbArticle", errorTypes.GenericError);
                        logFailure("openKbArticle", errorObject, "");
                        return reject(error.message);
                    }
                );
            })
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
                return reject(errorMessage);
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

    function getAttributeFromCollection(recordTitle: string): any{

        let windowXrm: any;
        try {
            //we are using here windows.top.xrm.page 
            //this api will work in case of crm forms are focused
            //if anything else is focused then it will contradict the action it self as this action for cloning a record on crm form. 
            //in that case we are catching exception and returning as macro triggered for invalide form.  
            windowXrm = (((((window as any).top) as any).Xrm) as any);
        }
        catch (e) {
            return Promise.reject(createErrorMap("Macro executed for invalid form", "cloneRecord"));
        }

        let entityObj: any = {};
        entityObj["attributeObj"] = {};

        //let attributeObj: any = {};
        let col = windowXrm.Page.data.entity.attributes._collection;
        let entityRef = windowXrm.Page.data.entity.getEntityReference();
        entityObj["entityName"] = entityRef.entityType;
        Object.keys(col).forEach(function (key) {          
            entityObj.attributeObj[key] = col[key].getValue();
            }
        );
        entityObj.attributeObj = removeExtraData(entityObj.attributeObj,entityObj.entityName);
        return entityObj;
    }

    function removeExtraData(obj: any, entityName: string): {} {
        let tempObj = obj;
        let tempArray = Attributes.commmonAttributes;
        tempArray.push(entityName + "id");
        tempArray.forEach(function (attrib) {
            Object.keys(obj).forEach(function (key) {
                if (key.includes(attrib) || tempObj[key] == null) {
                    delete tempObj[key];
                }
            });
        });
        
        return tempObj;
    }

    function arrangeLookupValue(obj: any, entityName: string): {} {
        let temp: any = obj;
        let result: any = {};
        
        let formatedValue: string = "_value@OData.Community.Display.V1.FormattedValue";
        let navigationProperty: string = "_value@Microsoft.Dynamics.CRM.associatednavigationproperty";
        let lookupLogicalName: string = "_value@Microsoft.Dynamics.CRM.lookuplogicalname";
        let value: string = "_value";
        let underScor: string = "_";

        Object.keys(temp).forEach(function (key) {
            let attribName = "";
            if (key.endsWith(value))
                attribName = key.substr(1, key.length - value.length-1);

            if (key.endsWith(lookupLogicalName))
                attribName = key.substr(1, key.length - lookupLogicalName.length-1);

            if (key.endsWith(navigationProperty))
                attribName = key.substr(1, key.length - navigationProperty.length-1);

            if (key.endsWith(formatedValue))
                attribName = key.substr(1, key.length - formatedValue.length-1);

            if ((attribName != "") && (underScor + attribName + value in obj) && (underScor + attribName + lookupLogicalName in obj) &&
                (underScor + attribName + navigationProperty in obj) && (underScor + attribName + formatedValue in obj)) {
               
                var lookupValue = new Array();
                lookupValue[0] = new Object();
                lookupValue[0].id = obj[underScor + attribName + value];
                lookupValue[0].name = obj[underScor + attribName + formatedValue];
                lookupValue[0].entityType = obj[underScor + attribName + lookupLogicalName]
                result[attribName] = lookupValue;

                delete obj[underScor + attribName + value];
                delete obj[underScor + attribName + lookupLogicalName];
                delete obj[underScor + attribName + navigationProperty];
                delete obj[underScor + attribName + formatedValue];
            }
            else {
                if (key in obj)
                    result[key] = obj[key];
            }
        });

        return result;
    }

    export function cloneInputRecord(actionName: string, entityData: any, telemetryData?: Object | any): Promise<string> {
        let recordTitle = "_copy";
        if (!entityData) {
            return Promise.reject(createErrorMap("Need values to clone record", "cloneInputRecord")); 
        }
        return new Promise<string>((resolve, reject) => {

            if (entityData.hasOwnProperty("RecordTitle") && typeof (entityData.RecordTitle) !== "undefined") {
                    recordTitle = entityData.RecordTitle;
                }
                getPrimaryNameAttribute(entityData.EntityName).then(
                    function (primaryAttrib) {
                        getRecordToClone(actionName, entityData, primaryAttrib, recordTitle).then(
                            function (dataObj) {
                                cloneRecord_DefaultBehaviour(actionName, entityData.EntityName, dataObj).then(
                                    function (outParameter) {
                                        resolve(outParameter);
                                    },
                                    function (error) {
                                        reject(error);
                                    }
                                );
                            },
                            function (error) {
                                reject(error);
                            }
                        );
                    }
                );
            
        });
    }

    export function cloneFocusedRecord(actionName: string, entityData: any, telemetryData?: Object | any): Promise<string> {
        let recordTitle = "_copy";
        if (!entityData) {
            return Promise.reject(createErrorMap("Need values to clone record", "cloneFocusedRecord")); 
        }
        return new Promise<string>((resolve, reject) => {

            if (entityData.hasOwnProperty("RecordTitle") && typeof (entityData.RecordTitle) !== "undefined") {
                recordTitle = entityData.RecordTitle;
            }
            let entityObj = getAttributeFromCollection(recordTitle);

            getPrimaryNameAttribute(entityObj.entityName).then(
                function (primaryAttrib) {
                    if (primaryAttrib !== "") {
                        if (recordTitle === "_copy")
                            entityObj.attributeObj[primaryAttrib] = entityObj.attributeObj[primaryAttrib] + "_copy";
                        else {
                            entityObj.attributeObj[primaryAttrib] = recordTitle;
                        }
                    }
                    resolve(cloneRecord_DefaultBehaviour(actionName, entityObj.entityName, entityObj.attributeObj));
                }
            );
            
        });
    }

    function getPrimaryNameAttribute(entityName: string): Promise < string > {        
        return new Promise<string>(function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.0/EntityDefinitions(LogicalName='" + entityName + "')/?$select=PrimaryNameAttribute", true);
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");

            req.onreadystatechange = function () {
                if (req.readyState === 4) {
                    req.onreadystatechange = null;
                    if (req.status === 200) {
                        let name: string = JSON.parse(req.response).PrimaryNameAttribute;
                        if (name === undefined) {
                            name = "";
                        }
                        resolve(name);
                    } else {
                        resolve("");
                    }
                }
            };
            req.send();
        });
    }

    function getRecordToClone(actionName : string,entityData : any,primaryNameAttribute : string,recordTitle : string): Promise<any> {
        return new Promise<string>((resolve, reject) => {
            let startTime = new Date();
            Xrm.WebApi.retrieveRecord(entityData.EntityName, entityData.EntityId).then(function success(result1 : any){                
                result1 = arrangeLookupValue(result1, entityData.EntityName);
                result1 = removeExtraData(result1, entityData.EntityName);

                delete result1["@odata.context"];
                delete result1["@odata.etag"];
                if (primaryNameAttribute != "") 
                    result1[primaryNameAttribute] = (recordTitle == "_copy") ? result1[primaryNameAttribute] + recordTitle : recordTitle;
                
                resolve(result1);
            },
            function(error){
                let errorData = generateErrorObject(error, "ProductivityMacrosWrapper - cloneRecord", errorTypes.XrmApiError);
                logFailure("cloneRecord", errorData, "");
                reject(error);
            });
        });
    }

    function cloneRecord_DefaultBehaviour(actionName: string, entityName: string, entityData: {}): Promise<string>{
        
        return new Promise<any>((resolve, reject) => {
            getNavigationType().then((navigationType: any) => {
                if (navigationType == 1) {
                    var tabInput: XrmClientApi.TabInput = {
                        pageInput: {
                            pageType: "entityrecord" as any,
                            entityName: entityName,
                            data: entityData
                        },
                        options: { isFocused: true }
                    }
                    createTab(tabInput).then(
                        function (tabId: string) {
                            var ouputResponse: any = {};
                            var sessionContextParams: any = {};
                            sessionContextParams[actionName + ".TabId"] = tabId;
                            sessionContextParams[actionName + ".EntityName"] = entityName;
                            sessionContextParams[actionName + ".PageType"] = "entityrecord";
                            ouputResponse[Constants.OutputResult] = sessionContextParams;
                            logSuccess("ProductivityMacrosWrapper - cloneRecord", "");
                            resolve(ouputResponse);
                        },
                        function (error: Error) {
                            let errorObject = generateErrorObject(error, "ProductivityMacrosWrapper - cloneRecord", errorTypes.GenericError);
                            logFailure("cloneRecord", errorObject, "");
                            reject(error.message);
                        }
                    );
                } else {
                    var efo: XrmClientApi.EntityFormOptions = {
                        entityName: entityName,
                        useQuickCreateForm: false
                    }

                    var parameters: XrmClientApi.FormParameters = entityData;
                    Xrm.Navigation.openForm(efo, parameters).then(function (res) {
                        var ouputResponse: any = {};
                        var sessionContextParams: any = {};
                        sessionContextParams[actionName + ".EntityName"] = entityName;
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
    }

    function getPartyListValue(data: any): any {
        try {
            let partyList = JSON.parse(data);
            if (Array.isArray(partyList)) {
                let partylistData = new Array();
                let i: number = 0;
                partyList.forEach((item: any) => {
                    if (item.hasOwnProperty("id") && item.hasOwnProperty("name") && (item.hasOwnProperty("entitytype") || item.hasOwnProperty("type"))) {
                        partylistData[i] = new Object();
                        partylistData[i].id = item.id;
                        partylistData[i].name = item.name;
                        partylistData[i].entityType = item.hasOwnProperty("entitytype") ? item.entitytype : item.type;
                        i++;
                    }
                });
                return partylistData;
            }
        }
        catch (e) {
            return data;
        }
        return data;
    }

    export function updateFormAttribute(actionName: string, entityData: any, telemetryData?: Object | any): Promise<Map<string, any>> {
        if (!entityData) {
            return Promise.reject(createErrorMap("Need values to Update for updateFormAttribute", "updateFormAttribute")); // should be removed add logrejectanderror mrthod here
        }
        let windowXrm: any;
        try {
            //we are using here windows.top.xrm.page and windows.top.xrm.page.ui.formselector
            //this api will work in case of crm forms are focused
            //if anything else is focused then it will contradict the action it self as this action for pupulating fields on crm form. 
            //in that case we are catching exception and returning as macro triggered for invalide form.  
            windowXrm = (((((window as any).top) as any).Xrm) as any);
            if (entityData.EntityName != windowXrm.Page.ui.formSelector._entityName) {
                return Promise.reject(createErrorMap("Macro executed for invalid form", "updateFormAttribute")); // should be removed add logrejectanderror mrthod here
            }
        }
        catch (e) {
            return Promise.reject(createErrorMap("Macro executed for invalid form", "updateFormAttribute")); // should be removed add logrejectanderror mrthod here
        }
        return new Promise<Map<string, any>>((resolve, reject) => {
            let startTime = new Date();

            try {
                let data = consolidateLookupObj(getCustomArray(entityData))
                Object.keys(data).forEach(function (key) {

                    let dataType = windowXrm.Page.getAttribute(key).getAttributeType();
                    try {
                        switch (dataType) {
                            case "decimal":
                            case "optionset":
                            case "integer":
                                windowXrm.Page.getAttribute(key).setValue(parseInt(data[key]));
                                break;
                            case "boolean":
                                windowXrm.Page.getAttribute(key).setValue(Boolean.parse(data[key]));
                                break;
                            case "double":
                            case "money":
                                windowXrm.Page.getAttribute(key).setValue(parseFloat(data[key]));
                                break;
                            case "datetime":
                                windowXrm.Page.getAttribute(key).setValue(new Date(data[key]));
                                break;
                            case "multiselectoptionset":
                                let tempArray = data[key].split(",");
                                let multiOptionSet: number[] = new Array();
                                tempArray.forEach(function (item : string) {
                                    multiOptionSet.push(parseInt(item));
                                })
                                windowXrm.Page.getAttribute(key).setValue(multiOptionSet);
                                break;
                            case "lookup":
                                data[key] = getPartyListValue(data[key]);
                                windowXrm.Page.getAttribute(key).setValue(data[key]);
                                break;
                            default:
                                windowXrm.Page.getAttribute(key).setValue(data[key]);
                        }
                    }
                    catch (e) {
                        let errorData = generateErrorObject(e, "ProductivityMacrosWrapper - updateFormAttribute - unable to parse input parameter " + key + "-" + data[key], errorTypes.InvalidParams);
                        logFailure("updateFormAttribute", errorData, "");
                    }
                });
                let timeTaken = Date.now() - startTime.getTime();
                var ouputResponse: any = {};
                var sessionContextParams: any = {};
                sessionContextParams[actionName + Constants.SuffixEntityName] = entityData.EntityName;
                sessionContextParams[actionName + Constants.SuffixTabId] = windowXrm.App.sessions.getFocusedSession().tabs.getFocusedTab().tabId;
                ouputResponse[Constants.OutputResult] = sessionContextParams;
                logSuccess("ProductivityMacrosWrapper - updateFormAttribute", "", telemetryData);
                resolve(ouputResponse);
            }
            catch (e) {
                let errorData = generateErrorObject(e, "ProductivityMacrosWrapper - updateFormAttribute", errorTypes.XrmApiError);
                logFailure("updateFormAttribute", errorData, "");
                reject(e);
            }

        });
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

    export function foucsTabAction(actionName: string, actionInputs: any): Promise<any> {
        if (!(isNullOrUndefined(actionInputs))) {
            return new Promise<any>((resolve, reject) => {
                let tabId: string = actionInputs.TabId;
                focusTab(tabId).then((success) => {
                    var ouputResponse: any = {};
                    var sessionContextParams: any = {};
                    sessionContextParams[actionName + ".TabId"] = tabId;
                    ouputResponse["result"] = sessionContextParams;
                    resolve(ouputResponse);
                }, (error: any) => {
                    reject(error);
                });
            });
        } else {
            return Promise.reject("foucsTabAction is null or undefined");
        }
    }

    export function getCurrentPageAction(actionName: string, actionInputs: any): Promise<any> {
        if (!(isNullOrUndefined(actionInputs))) {
            return new Promise<any>((resolve, reject) => {
                let sessionId = getFocusedSessionId();
                let session = Microsoft.AppRuntime.Sessions.getSession(sessionId);
                var tabId = session.getFocusedTab().tabId;
                var ouputResponse: any = {};
                var sessionContextParams: any = {};
                sessionContextParams[actionName + ".TabId"] = tabId;
                ouputResponse["result"] = sessionContextParams;
                resolve(ouputResponse);
            });
        } else {
            return Promise.reject("getCurrentPageAction is null or undefined");
        }
    }

    export function openApplicationTemplate(actionName: string, entityData: any): Promise<string> {

        if (!entityData || entityData.PageType === undefined || entityData.ApplicationTemplateId === undefined) {
            return Promise.reject("Need values to open application template - openApplicationTamplate");
        }

        return new Promise<string>((resolve, reject) => {
            let pageInput: XrmClientApi.PageInput;
            let options: any = { isFocused: true };
            if (entityData.Custom_Array == undefined) {
                let promises = [];
                promises.push(getApplicationTemplate(entityData.ApplicationTemplateId));
                promises.push(getApplicationTemplateRecord(entityData.ApplicationTemplateId));
                Promise.all(promises).then(function (result) {
                    entityData.Custom_Array = getCustomArrayFromEntityCollection(result[0].entities);
                    pageInput = getPageInput(entityData);
                    var title = result[1].entities[0].msdyn_title;
                    if (!isNullOrUndefined(title)) {
                        options = { isFocused: true, title: title };
                    }
                    resolve(openTab(actionName, pageInput, options));
                },
                function (error) {
                    reject(error.message);
                });
            }
            else {
                pageInput = getPageInput(entityData);
                resolve(openTab(actionName, pageInput, options));
            }
        });
    }

    export function refreshPageAction(actionName: string, actionInputs: any): Promise<any> {
        if (!(isNullOrUndefined(actionInputs))) {
            return new Promise<any>((resolve, reject) => {
                let tabId: string = actionInputs.TabId;
                refreshTab(tabId).then((success) => {
                    var ouputResponse: any = {};
                    var sessionContextParams: any = {};
                    sessionContextParams[actionName + ".TabId"] = tabId;
                    ouputResponse["result"] = sessionContextParams;
                    resolve(ouputResponse);
                }, (error) => {
                    reject(error);
                });
            });
        } else {
            return Promise.reject("refreshPageAction is null or undefined");
        }
    }

    export function resolveSlug(context: any, paramName: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            var callbackResponse: { [key: string]: any } = {};
            let sessionContext = await Microsoft.AppRuntime.Sessions.getFocusedSession().getContext();

            sessionContext.resolveSlug(paramName).then((result) => {
                callbackResponse["statusCode"] = 200;
                callbackResponse["status"] = "succedded";
                callbackResponse["result"] = result;
                resolve(callbackResponse);
            },
                (error) => {
                    callbackResponse["statusCode"] = 500;
                    callbackResponse["status"] = "failed";
                    callbackResponse["result"] = error;
                    reject(callbackResponse);
                });
        });
    }

    function createTab(input: XrmClientApi.TabInput, telemetryData?: Object): Promise<string> {
        if (Microsoft.AppRuntime && Microsoft.AppRuntime.Internal) {
            return Microsoft.AppRuntime.Internal.createTab(input);
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
                        return reject(req.responseText);
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
                        return reject(req.responseText);
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

    export function triggerFlow(actionName: string, actionInputs: any): Promise<string> {
        if (!(isNullOrUndefined(actionInputs))) {
            return new Promise<any>((resolve, reject) => {
                var ouputResponse: any = {};
                var sessionContextParams: any = {};

                let fpiHelper = new FPIHelper();
                fpiHelper.fetchFlowsEnvId()
                    .then((flowEnvIdResponse) => {
                        var flowEnvId: string = flowEnvIdResponse.name;
                        // Build dialog parameters for Flow MDD.
                        const dialogParams: XrmClientApi.Parameters = populateFlowDialogParams(
                            actionInputs.flowId,
                            actionInputs.entityLogicalName,
                            actionInputs.entityRecordId,
                            flowEnvId);

                        // Set dialog options
                        const dialogOptions: XrmClientApi.DialogOptions = {} as XrmClientApi.DialogOptions;
                        dialogOptions.height = Constants.DIALOG_HEIGHT;
                        dialogOptions.width = Constants.DIALOG_WIDTH;

                        // Open dialog to invoke the Flow
                        return Xrm.Navigation.openDialog(Constants.MICROSOFT_FLOWS_DIALOG, dialogOptions, dialogParams).then((result: any) => {
                            sessionContextParams[actionName + Constants.SuffixFlowId] = result.parameters.flow_id;
                            ouputResponse[Constants.OutputResult] = sessionContextParams;
                            return resolve(ouputResponse);
                        },
                            (error: Error) => {
                                let errorData = generateErrorObject(error, "ProductivityMacrosWrapper - triggerFlow", errorTypes.XrmApiError);
                                logFailure("triggerFlow", errorData, "");
                                return reject(error);
                            });
                    });

            });
        } else {
            let errorObject = {} as IErrorHandler;
            errorObject.errorMsg = "formInputs is Null or Undefined";
            errorObject.errorType = errorTypes.InvalidParams;
            errorObject.reportTime = new Date().toUTCString();
            errorObject.sourceFunc = "ProductivityMacrosWrapper - triggerFlow";
            logFailure("triggerFlow", errorObject, "");
            return Promise.reject("triggerFlow - formInputs is Null or Undefined");
        }
    }


    function populateFlowDialogParams(flowId: any, entityLogicalName: any, entityRecordId: any,
        flowEnvId: String): XrmClientApi.Parameters {
        const dialogParams: XrmClientApi.Parameters = {};
        const entityIds = [];
        entityIds.push(entityRecordId);
        const entityId = JSON.stringify(entityIds);
        dialogParams[Constants.ENTITIES_ID] = entityId;

        dialogParams[Constants.DIALOG_FLOW_ID] = flowId;
        dialogParams[Constants.DIALOG_FLOWS_ENVIRONMENT_ID] = flowEnvId;
        dialogParams[Constants.DIALOG_ORG_UNIQUE_NAME] = Xrm.Utility.getGlobalContext().organizationSettings.uniqueName;
        const destinationUrl = Xrm.Utility.getGlobalContext().getAdvancedConfigSetting(
            Constants.FLOW_DESTINATION_URL
        );

        dialogParams[Constants.DIALOG_ENTITY_LOGICAL_NAME] = entityLogicalName;
        dialogParams[Constants.DIALOG_FLOWS_DESTINATION_URL] = destinationUrl;

        const flowFpiUrl = Xrm.Utility.getGlobalContext().getAdvancedConfigSetting(Constants.FLOW_FPI_URL);
        dialogParams[Constants.DIALOG_FLOWS_FPI_SITE_URL] =
            flowFpiUrl + Constants.FLOW_FPI_URL_ENABLE_WIDGET_V2_PARAMETER;

        // Always load widget v2.
        dialogParams[Constants.DIALOG_FLOWS_ENABLE_WIDGET_V2] = true;

        return dialogParams;
    }

}