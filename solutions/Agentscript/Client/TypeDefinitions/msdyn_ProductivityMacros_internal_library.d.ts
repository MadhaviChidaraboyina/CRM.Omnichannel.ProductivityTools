/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/** @internal */
declare namespace Microsoft.ProductivityMacros.Internal {
    interface IActionItem {
        name: string;
        type: string;
        inputs: any;
        runAfter: any;
    }
    interface IMacroActions {
        actionName: IActionItem;
    }
    interface ISortByDependency {
        objectMap: Map<string, IActionItem>;
        visited: Map<string, boolean>;
        result: IActionItem[];
    }
    class Constants {
        static AppName: string;
        static ClientUrl: string;
        static AppUrl: string;
        static OrgLcid: string;
        static OrgUniqueName: string;
        static UserId: string;
        static UserLcid: string;
        static UserName: string;
        static UserRoles: string;
        static OrgId: string;
        static crmVersion: string;
    }
    class ActionTypes {
        static CREATE_NEW: string;
        static OPEN_FORM: string;
        static OPEN_GRID: string;
        static OPEN_KNOWLEDGE_SEARCH: string;
        static SEARCH_KNOWLEDGE_BASE: string;
        static SEARCH_BY_RELEVANCE: string;
        static UPDATE_RECORD: string;
        static OPEN_ASSOCIATED: string;
        static DRAFT_EMAIL: string;
        static GET_ENVIRONMENT: string;
    }
}
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
declare namespace Microsoft.ProductivityMacros.Internal {
    function runMacro(macroName: string, params?: string): Promise<string>;
}
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/** @internal */
declare namespace Microsoft.ProductivityMacros.Internal {
    /**
     * utility func to check whether an object is null or undefined
     */
    function isNullOrUndefined(obj: any): boolean;
    function openNewForm(formInputs: any): Promise<string>;
    function openExistingForm(entityFormOptions: any, result?: any): Promise<string>;
    function draftEmail(entityFormData: any, templateId?: string): Promise<string>;
    function openGrid(entityListOptions: any): Promise<string>;
    function openDashboard(dashboardPageOptions: any): Promise<string>;
    function openSearchPage(searchPageOptions: any): Promise<string>;
    function openKBSearchControl(): Promise<boolean>;
    function save(): Promise<any>;
    function getEnvironment(): Map<string, any>;
    function updateRecord(entityName: string, entityId: string, telemetryData?: Object | any, valuesToUpdate?: Map<string, any> | string): Promise<Map<string, any>>;
    function retrieveRecord(entityName: string, entityId: string, telemetryData?: Object | any, query?: string): Promise<Map<string, any>>;
    /**
     * Given a key-value object, this func returns an equivalent Map object for it.
     * @param dict Object to build the map for.
     */
    function buildMap(dict: XrmClientApi.WebApi.Entity | Error): Map<string, any>;
    /**
     * utility func to create a error map with the error message and optional error code
    */
    function createErrorMap(errorMessage: string, apiName?: string): Map<any, any>;
    /**
     * utility func to check whether argument passed if of type Error Object
     * @param arg Object to check whether it is Error or not.
    */
    function isError(arg: XrmClientApi.WebApi.Entity | Error): arg is Error;
}
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
declare namespace Microsoft.Macros {
    class Constants {
        static CreateMacrosDialog: string;
        static RecordIdParam: string;
        static DesignerID: string;
    }
    class Guids {
        static AllMacrosViewGuid: string;
        static ActiveMacrosViewGuid: string;
        static InactiveMacrosViewGuid: string;
    }
}
declare namespace Microsoft.Macros.Utility {
    function getResourceString(key: any): any;
    function isMacrosView(viewId: any): boolean;
    function openRecordHandler(selectedControlSelectedItemReferences: any, selectedControl: any): void;
    function macrosEnableRule(selectedControlSelectedItemReferences: any, selectedControl: any): boolean;
    function newRecordHandler(selectedControl: any): void;
    function dialogOnLoadHandler(eventContext: any): void;
}
