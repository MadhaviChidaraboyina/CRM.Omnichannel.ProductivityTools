import { Utils } from "./sharedUtils";
import { Constants, Action, Parameter, Connector, Kind, Category, DesignerTemplateConfig } from "./sharedDefines";
import { isNullOrUndefined } from "util";
import * as Designer from "./DesignerDefinitions";
import flowScript from "./flowScript";
import { doTelemetry } from "./macroDesigner";
import * as SharedDefines from "./sharedDefines";

let globalContext: XrmClientApi.GlobalContext = (window.top as any).Xrm.Utility.getGlobalContext();


export const operationManifestMetadata: Designer.Metadata[] = [
    {
        conditions: {
            operationType: 'List_Flows'
        },
        connectorId: 'List_Flows',
        operationId: 'List_Flows',
        manifest: flowScript
    }
];

function _getIconUrl(icon: string): string {
    let url = new URL(icon, globalContext.getClientUrl());
    return url.toString();
}
function _localizeObject(obj: any): string | undefined {
    if (!obj) {
        return;
    }
    Object.keys(obj).forEach(
        function (prop) {
            let val = obj[prop];
            switch (typeof (val)) {
                case 'object':
                    obj[prop] = _localizeObject(val);
                    break;
                case 'string':
                    obj[prop] = Utils.getResourceString(val);
                    break;
            }
        });
    return obj;
}

function loadLocalizationResx(webresourceName: string): Promise<string> {
    return new Promise<any>((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let webfragment = "/api/data/v9.0/";
        let url = globalContext.getClientUrl() + webfragment + "GetClientMetadata(ClientMetadataQuery=@ClientMetadataQuery)?@ClientMetadataQuery={\"MetadataType\":\"webresource\",\"MetadataSubtype\":null,\"EntityLogicalName\":null,\"MetadataId\":null,\"MetadataNames\":[\"" + webresourceName + "\"],\"GetDefault\":false,\"DependencyDepth\":\"OnDemandWithoutContext\",\"Exclude\":[]}"
        xhr.open("GET", url, true);
        xhr.onload = function () {
            try {
                let response;
                if (xhr.readyState === 4 && xhr.status === 200) {
                    if (xhr.response !== null) {
                        let responseMetadata = JSON.parse(JSON.parse(xhr.response).Metadata);
                        if (responseMetadata.WebResources) {
                            let webresources = responseMetadata.WebResources;
                            webresources.forEach((resource) => {
                                if (resource.Type === "12") {
                                    response = resource.ContentJson;
                                    resolve(response);
                                }
                            });
                        }
                    }
                    else {
                        response = xhr.response;
                    }
                    resolve(response);
                }
                else {
                    response = Error(xhr.statusText);
                    reject(response);
                }
            } catch (e) {
                reject(e);
            }
        };
        // Handle network errors
        xhr.onerror = function () {
            reject(Error("Network Error"));
        };

        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Accept-Language", "en-US,en;q=0.8");
        xhr.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
        xhr.send();
    });
}

export class Macros {
    private static definition = {
        "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json",
    };
    public static async getActionTemplates(): Promise<DesignerTemplateConfig> {
        let actions: Action[] = [];
        let categories: Category[] = [];
        let promises: Promise<boolean>[] = [];
        let connectors: any[] = [];
        let operationManifestData = operationManifestMetadata;
        let res1 = await Promise.all([
            window.top.Xrm.WebApi.retrieveMultipleRecords("msdyn_productivitymacroconnector", "?$filter=statecode eq 0&$select=msdyn_productivitymacroconnectorid,msdyn_name,msdyn_title,msdyn_displayname,msdyn_brandcolor,msdyn_description,msdyn_icon,msdyn_categorykey,msdyn_categorylabel,msdyn_type,msdyn_webresourcename"),
            window.top.Xrm.WebApi.retrieveMultipleRecords("msdyn_productivitymacroactiontemplate", "?$filter=statecode eq 0&$select=msdyn_name,msdyn_title,msdyn_subtitle,msdyn_displayname,msdyn_brandcolor,msdyn_actiondescription,msdyn_icon,msdyn_summary,msdyn_visibility,msdyn_kind&$expand=msdyn_msdyn_prod_macroactiontemplate_msdyn_actioninput($select=msdyn_name,msdyn_visibility),msdyn_msdyn_prod_macroactiontemplate_msdyn_actionout($select=msdyn_name),msdyn_macroconnector($select=msdyn_name)")
        ]).catch(function (err) {
                let obj: SharedDefines.LogObject = {
                    level: SharedDefines.LogLevel.Error,
                    eventName: SharedDefines.WrapperEvents.UserPermissionErrorEvent,
                    message: Utils.genMsgForTelemetry("Insufficient admin permissions to view macros", err),
                    eventTimeStamp: new Date(),
                    eventType: SharedDefines.TelemetryEventType.Trace
                };
                doTelemetry(obj, "MACRO_DESIGNER_CONTROL_PERMISSION_ERROR", true);
                return { actions: actions, connectors: connectors, categories: categories, operationManifestData: operationManifestData };
            });

        let connectorData = await res1[0];
        let templates = await res1[1];

        let mPromises: Promise<string>[] = [];
        connectorData.entities.forEach(function (templ) {
            if (!isNullOrUndefined(templ.msdyn_webresourcename)) {
                mPromises.push(loadLocalizationResx(templ.msdyn_webresourcename));
            }
        });
        let responseLocale = await Promise.all(mPromises);
        connectorData.entities.forEach(function (templ) {
            let connector: Connector = {
                id: templ.msdyn_productivitymacroconnectorid,
                type: templ.msdyn_type,
                name: templ.msdyn_name,
                title: Utils.getResourceString(templ.msdyn_title, responseLocale),
                brandColor: templ.msdyn_brandcolor,
                description: Utils.getResourceString(templ.msdyn_description, responseLocale),
                icon: _getIconUrl(templ.msdyn_icon),
                capabilities: [],
                displayName: Utils.getResourceString(templ.msdyn_displayname, responseLocale),
                category: templ.msdyn_categorykey
            };
            let newCategory: Category = { itemKey: templ.msdyn_categorykey, linkText: Utils.getResourceString(templ.msdyn_categorylabel, responseLocale) };
            if (categories.findIndex(
                function (value) {
                    return value.linkText === newCategory.linkText;
                }) < 0) {
                categories.push(newCategory);
            }
            connectors.push(connector);
        });

        templates.entities.forEach(function (templ) {
            let action: Action = {
                id: templ.msdyn_name,
                type: templ.msdyn_name,
                name: Utils.getResourceString(templ.msdyn_displayname, responseLocale),
                brandColor: templ.msdyn_brandcolor,
                description: Utils.getResourceString(templ.msdyn_actiondescription, responseLocale),
                icon: (templ.msdyn_icon && _getIconUrl(templ.msdyn_icon) || ""),
                subtitle: Utils.getResourceString(templ.msdyn_subtitle, responseLocale),
                title: Utils.getResourceString(templ.msdyn_title, responseLocale),
                summary: Utils.getResourceString(templ.msdyn_summary, responseLocale),
                kind: templ.msdyn_kind,
                visibility: (templ.msdyn_visibility || "true"),
                category: "CONNECTORS",
                connectorId: templ.msdyn_macroconnector && templ.msdyn_macroconnector.msdyn_productivitymacroconnectorid || ""
            };
            templ.msdyn_msdyn_prod_macroactiontemplate_msdyn_actioninput.forEach(async function (inputType) {
                let prom = new Promise<boolean>(async (res, rej) => {
                    try {
                        let paramData = await (window.top as any).Xrm.WebApi.retrieveMultipleRecords("msdyn_productivityactioninputparameter", "?$filter=msdyn_productivityactioninputparameterid eq '" + inputType.msdyn_productivityactioninputparameterid + "'&$expand=msdyn_msdyn_prod_actioninputparameter_msdyn_par($select=msdyn_defaultvalue,msdyn_description,msdyn_displayname,msdyn_name,msdyn_parametertype,msdyn_jsonobjectstructure)&$select=msdyn_name");
                        paramData.entities.forEach(function (inputParamType) {
                            inputParamType.msdyn_msdyn_prod_actioninputparameter_msdyn_par.forEach(function (input) {
                                let param: Parameter = {
                                    name: input.msdyn_name,
                                    description: "---",
                                    title: Utils.getResourceString(input.msdyn_displayname, responseLocale),
                                    type: input.msdyn_parametertype,
                                    visibility: inputType.msdyn_visibility
                                }
                                if (input.msdyn_jsonobjectstructure) {
                                    param.compoundObjectDefinitionJSON = JSON.stringify(_localizeObject(JSON.parse(input.msdyn_jsonobjectstructure)));
                                }
                                if (isNullOrUndefined(action.inputs)) {
                                    action.inputs = [];
                                }
                                action.inputs.push(param);
                            });
                        });
                        res(true);
                    }
                    catch (error) {
                        rej(error);
                    }
                });
                promises.push(prom);
            });

            templ.msdyn_msdyn_prod_macroactiontemplate_msdyn_actionout.forEach(async function (outputType) {
                let prom = new Promise<boolean>(async (res, rej) => {
                    try {
                        let paramData = await (window.top as any).Xrm.WebApi.retrieveMultipleRecords("msdyn_productivityactionoutputparameter", "?$filter=msdyn_productivityactionoutputparameterid eq '" + outputType.msdyn_productivityactionoutputparameterid + "'&$expand=msdyn_msdyn_prod_actionoutputparameter_msdyn_pa($select=msdyn_defaultvalue,msdyn_description,msdyn_displayname,msdyn_name,msdyn_parametertype)&$select=msdyn_name");
                        paramData.entities.forEach(function (outputParamType) {
                            outputParamType.msdyn_msdyn_prod_actionoutputparameter_msdyn_pa.forEach(function (output) {
                                let param: Parameter = {
                                    name: output.msdyn_name,
                                    description: "",
                                    title: Utils.getResourceString(output.msdyn_displayname, responseLocale),
                                    type: output.msdyn_parametertype
                                }
                                if (isNullOrUndefined(action.outputs)) {
                                    action.outputs = [];
                                }
                                action.outputs.push(param);
                            });
                        });
                        res(true);
                    }
                    catch (error) {
                        rej(error);
                    }

                });
                promises.push(prom);
            });
            actions.push(action);
        });
        await Promise.all(promises);
        return { actions: actions, connectors: connectors, categories: categories, operationManifestData: operationManifestData };
    }

    public static async getDefinition() {
        let id = Utils.getUrlParam(Constants.MACRO_ID);
        if (!id) {
            return { definition: Macros.definition, name: "", description: "", id: "" };
        }
        try {
            let defn = await (window.top as any).Xrm.WebApi.retrieveRecord(Constants.WORKFLOW_ENTITY, id, "?$select=name,description,clientdata");
            return { definition: JSON.parse(defn.clientdata).properties.definition, name: defn.name, description: defn.description, id: id };
        }
        catch (error) {
            //TODO - log error
            return { definition: Macros.definition, name: "", description: "", id: "" };
        }
	}

	public static async getExecutionStatus() {
		let id = Utils.getUrlParam(Constants.MACRO_ID);
		if (!id) {
			return { executionstatus: {}, name: "" };
		}
		try {
			let defn = await (window.top as any).Xrm.WebApi.retrieveRecord(Constants.MACROS_SESSION_ENTITY, id, "?$select=msdyn_executioncontext,msdyn_macroname");
			return { executionstatus: JSON.parse(defn.msdyn_executioncontext), name: defn.msdyn_macroname};  // Check whether defn is eexecutionJSON only or {executionJson}
			//return { definition: JSON.parse(defn.clientdata).properties.definition, name: defn.name, description: defn.description, id: id };
		}
		catch (error) {
			//TODO - log error
			return { executionstatus: {}, name: "" };
		}
	}

    public static testDefinition = { "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json", "actions": { "TestBuiltInActionPropertiesSummary": { "type": "TestBuiltInActionType", "runAfter": {} }, "TestBuiltInActionPropertiesSummary_2": { "type": "TestBuiltInActionType", "runAfter": { "TestBuiltInActionPropertiesSummary": ["Succeeded"] } }, "TestBuiltInActionPropertiesSummary_3": { "type": "TestBuiltInActionType", "runAfter": { "TestBuiltInActionPropertiesSummary_2": ["Succeeded"] } } }, "parameters": { "$authentication": { "defaultValue": {}, "type": "SecureObject" } }, "triggers": { "manual": { "kind": "PowerApps", "type": "manual", "inputs": {} } }, "contentVersion": "1.0.0.0" };
}