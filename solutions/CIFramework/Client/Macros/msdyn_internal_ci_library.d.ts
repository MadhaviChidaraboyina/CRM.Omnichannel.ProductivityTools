declare namespace Microsoft.CIFramework.External {
    interface CIFExternalUtility {
        getTemplateForSession(sessionId?: string): any;
        getSessionTemplateParams(sessionId?: string): any;
        setSessionTemplateParams(data: any, sessionId?: string): void;
        resolveTemplateString(input: string, templateParams: any, scope: string): Promise<string>;
        focusTab(tabId: string, sessionId?: string): Promise<string>;
        getCurrentTab(sessionId?: string): any;
        refreshTab(tabId: string, sessionId?: string): Promise<string>;
    }
    class CIFExternalUtilityImpl implements CIFExternalUtility {
        getTemplateForSession(sessionId?: string): any;
        getSessionTemplateParams(sessionId?: string): any;
        /**
        * API to set key/value pairs in templateparams dictionary
        * @param input set of key/value pairs
        * returns an Object Promise: The returned Object has the same structure as the underlying Xrm.Navigation.openForm() API
        */
        setSessionTemplateParams(input: any, sessionId?: string): any;
        resolveTemplateString(input: string, templateParams: any, scope: string): Promise<string>;
        focusTab(tabId: string, sessionId?: string): Promise<string>;
        getCurrentTab(sessionId?: string): any;
        refreshTab(tabId: string, sessionId?: string): Promise<string>;
    }
}