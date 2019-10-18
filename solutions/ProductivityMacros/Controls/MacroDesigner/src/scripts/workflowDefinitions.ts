import { Utils } from "./sharedUtils";
import { Constants, Action, Parameter, Connector, Kind, Category, DesignerTemplateConfig } from "./sharedDefines";
import { isNullOrUndefined } from "util";

let globalContext: XrmClientApi.GlobalContext = (window.top as any).Xrm.Utility.getGlobalContext();

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
export class Macros {
    private static definition = {
        "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json",
    };
    public static async getActionTemplates(): Promise<DesignerTemplateConfig> {
        let actions: Action[] = [];
        let categories: Category[] = [];
        let promises: Promise<boolean>[] = [];
        let res1 = await Promise.all([
            window.top.Xrm.WebApi.retrieveMultipleRecords("msdyn_macroconnector", "?$filter=statecode eq 0&$select=msdyn_macroconnectorid,msdyn_name,msdyn_title,msdyn_displayname,msdyn_brandcolor,msdyn_description,msdyn_icon,msdyn_categorykey,msdyn_categorylabel,msdyn_type"),
            window.top.Xrm.WebApi.retrieveMultipleRecords("msdyn_macroactiontemplate", "?$filter=statecode eq 0&$select=msdyn_name,msdyn_title,msdyn_subtitle,msdyn_displayname,msdyn_brandcolor,msdyn_actionDescription,msdyn_icon,msdyn_summary,msdyn_visibility,msdyn_kind&$expand=msdyn_msdyn_macroactiontemplate_msdyn_actioninput($select=msdyn_name,msdyn_visibility),msdyn_msdyn_macroactiontemplate_msdyn_actionout($select=msdyn_name),msdyn_macroconnector($select=msdyn_name)")
        ]);
        let connectorData = await res1[0];
        let templates = await res1[1];

        let connectors: Connector[] = [];
        connectorData.entities.forEach(function (templ) {
            let connector: Connector = {
                id: templ.msdyn_macroconnectorid,
                type: templ.msdyn_type,
                name: templ.msdyn_name,
                title: templ.msdyn_title,
                brandColor: templ.msdyn_brandcolor,
                description: templ.msdyn_description,
                icon: _getIconUrl(templ.msdyn_icon),
                capabilities: [],
                displayName: templ.msdyn_displayname,
                category: templ.msdyn_categorykey
            };
            let newCategory: Category = { itemKey: templ.msdyn_categorykey, linkText: templ.msdyn_categorylabel };
            if (categories.findIndex(
                function (value) {
                    return value === newCategory;
                }) < 0) {
                categories.push(newCategory);
            }
            connectors.push(connector);
        });

        templates.entities.forEach(function (templ) {
            let action: Action = {
                id: templ.msdyn_name,
                type: templ.msdyn_name,
                name: templ.msdyn_displayname,
                brandColor: templ.msdyn_brandcolor,
                description: templ.msdyn_actionDescription,
                icon: (templ.msdyn_icon && _getIconUrl(templ.msdyn_icon) || ""),
                subtitle: templ.msdyn_subtitle,
                title: templ.msdyn_title,
                summary: templ.msdyn_summary,
                kind: templ.msdyn_kind,
                visibility: templ.msdyn_visibility,
                category: "CONNECTORS",
                connectorId: templ.msdyn_macroconnector && templ.msdyn_macroconnector.msdyn_macroconnectorid || ""
            };
            templ.msdyn_msdyn_macroactiontemplate_msdyn_actioninput.forEach(async function (inputType) {
                let prom = new Promise<boolean>(async (res, rej) => {
                    try {
                        let paramData = await (window.top as any).Xrm.WebApi.retrieveMultipleRecords("msdyn_actioninputparameter", "?$filter=msdyn_actioninputparameterid eq '" + inputType.msdyn_actioninputparameterid + "'&$expand=msdyn_msdyn_paramdef_msdyn_actioninputparam($select=msdyn_defaultvalue,msdyn_description,msdyn_displayname,msdyn_name,msdyn_parametertype,msdyn_jsonobjectstructure)&$select=msdyn_name");
                        paramData.entities.forEach(function (inputParamType) {
                            inputParamType.msdyn_msdyn_paramdef_msdyn_actioninputparam.forEach(function (input) {
                                let param: Parameter = {
                                    name: input.msdyn_name,
                                    description: input.msdyn_description,
                                    title: input.msdyn_displayname,
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

            templ.msdyn_msdyn_macroactiontemplate_msdyn_actionout.forEach(async function (outputType) {
                let prom = new Promise<boolean>(async (res, rej) => {
                    try {
                        let paramData = await (window.top as any).Xrm.WebApi.retrieveMultipleRecords("msdyn_actionoutputparameter", "?$filter=msdyn_actionoutputparameterid eq '" + outputType.msdyn_actionoutputparameterid + "'&$expand=msdyn_msdyn_paramdef_msdyn_actionoutputparam($select=msdyn_defaultvalue,msdyn_description,msdyn_displayname,msdyn_name,msdyn_parametertype)&$select=msdyn_name");
                        paramData.entities.forEach(function (outputParamType) {
                            outputParamType.msdyn_msdyn_paramdef_msdyn_actionoutputparam.forEach(function (output) {
                                let param: Parameter = {
                                    name: output.msdyn_name,
                                    description: output.msdyn_description,
                                    title: output.msdyn_displayname,
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
        return { actions: actions, connectors: connectors, categories: categories };
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
    public static testDefinition = { "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json", "actions": { "TestBuiltInActionPropertiesSummary": { "type": "TestBuiltInActionType", "runAfter": {} }, "TestBuiltInActionPropertiesSummary_2": { "type": "TestBuiltInActionType", "runAfter": { "TestBuiltInActionPropertiesSummary": ["Succeeded"] } }, "TestBuiltInActionPropertiesSummary_3": { "type": "TestBuiltInActionType", "runAfter": { "TestBuiltInActionPropertiesSummary_2": ["Succeeded"] } } }, "parameters": { "$authentication": { "defaultValue": {}, "type": "SecureObject" } }, "triggers": { "manual": { "kind": "PowerApps", "type": "manual", "inputs": {} } }, "contentVersion": "1.0.0.0" };
}