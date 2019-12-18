/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
/// <reference path="msdyn_internal_ci_library.d.ts" />

/** @internal */
namespace Microsoft.ChannelIntegrationFramework.Macros {

    export function refreshPageAction(actionName: string, actionInputs: any): Promise<any> {
        if (!(isNullOrUndefined(actionInputs))) {
            return new Promise<any>((resolve, reject) => {
                let tabId: string = actionInputs.TabId;
                var cifExternal = new Microsoft.CIFramework.External.CIFExternalUtilityImpl();
                cifExternal.refreshTab(tabId).then((success) => {
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

    export function getCurrentPageAction(actionName: string, actionInputs: any): Promise<any> {
        if (!(isNullOrUndefined(actionInputs))) {
            return new Promise<any>((resolve, reject) => {
                var cifExternal = new Microsoft.CIFramework.External.CIFExternalUtilityImpl();
                var tabId = cifExternal.getCurrentTab();
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

    export function foucsTabAction(actionName: string, actionInputs: any): Promise<any> {
        if (!(isNullOrUndefined(actionInputs))) {
            return new Promise<any>((resolve, reject) => {
                let tabId: string = actionInputs.TabId;
                var cifExternal = new Microsoft.CIFramework.External.CIFExternalUtilityImpl();
                cifExternal.focusTab(tabId).then((success) => {
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
            return Promise.reject("foucsTabAction is null or undefined");
        }
    }

    export function resolveSlug(context: any, paramName: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            var callbackResponse: { [key: string]: any } = {};
            var cifExternal = new Microsoft.CIFramework.External.CIFExternalUtilityImpl();
            cifExternal.resolveTemplateString(paramName, cifExternal.getSessionTemplateParams(), "").then((result) => {
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

    function isNullOrUndefined(obj: any) {
        return (obj == null || typeof obj === "undefined");
    }
}