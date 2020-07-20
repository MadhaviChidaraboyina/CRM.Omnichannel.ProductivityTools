import { AgentScriptUtils } from "./utilities/agentScriptUtils";
import { Utils } from "../sharedUtils";
import { Constants, LogicAppDesignerTemplateConfig } from "../sharedDefines";
import * as CustomOperations from "./Data/ManifestJson/customOperations";
import { Category } from "../DesignerDefinitions";
import { LogicAppsCategories } from "./hostService";

export class Macros {
    public static start_header = AgentScriptUtils.getResourceString("LADESIGNER_START_SUMMARY");
    public static condition_header = AgentScriptUtils.getResourceString("LADESIGNER_CONDITION_SUMMARY");
    public static definition = {
        "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json",
        actions: {
        },
        triggers: {  
        }
    };
    public static start_data = {
        "type": "start",
        "inputs": {
            "schema": {
                "type": "object",
                "required": [],
                "properties": {}
            }
        }
    };

    public static condition_data = {
        "actions": {},
        "expression": {
            "and": [{
                    "equals": ["", ""]
                }
            ]
        },
        "runAfter": {},
        "type": "If"
    };
    
    public static async getActionTemplates(): Promise<LogicAppDesignerTemplateConfig> {
        let actions = CustomOperations.CustomActions;
        let triggers = CustomOperations.CustomTriggers;
        let categories: Category[]=[] ;
        let connectors = CustomOperations.customConnectors;
        let operationManifestData = CustomOperations.operationManifestMetadata;
        categories = [
            {   itemKey: LogicAppsCategories.LOGIC_APPS_BUILTIN,
                linkText: AgentScriptUtils.getResourceString("LADESIGNER_RECOMMENDATION_CATEGORY_LOGICAPP_BUILTIN")
            },
            {   itemKey: LogicAppsCategories.CUSTOM,
                linkText: AgentScriptUtils.getResourceString("LADESIGNER_RECOMMENDATION_CATEGORY_CUSTOM")
            }];

        return { actions: actions, triggers:triggers,connectors: connectors, categories: categories , operationManifestData : operationManifestData};
    }
    public static async getDefinition() {
        let id = Utils.getUrlParam(Constants.MACRO_ID);
        Macros.definition.triggers[Macros.start_header] = Macros.start_data;
        Macros.definition.actions[Macros.condition_header] = Macros.condition_data;


        if (!id) {
            return { definition: Macros.definition, name: "", description: "", id: "" };
        }
        try {
            //retrieve record from session template entity
            let defn = await (window.top as any).Xrm.WebApi.retrieveRecord(Constants.SESSION_TEMPLATE_ENTITY, id, "?$select=msdyn_name,msdyn_description,msdyn_expressiondata");
            if(defn.msdyn_expressiondata)
                return { definition: JSON.parse(defn.msdyn_expressiondata).definition, name: defn.name, description: defn.description, id: id };
            else
                return { definition: Macros.definition, name: defn.name, description: defn.description, id: id };
        }
        catch (error) {
            //TODO - log error
            return { definition: Macros.definition, name: "", description: "", id: "" };
        }
    }
    public static testDefinition = { "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json", "actions": { "TestBuiltInActionPropertiesSummary": { "type": "TestBuiltInActionType", "runAfter": {} }, "TestBuiltInActionPropertiesSummary_2": { "type": "TestBuiltInActionType", "runAfter": { "TestBuiltInActionPropertiesSummary": ["Succeeded"] } }, "TestBuiltInActionPropertiesSummary_3": { "type": "TestBuiltInActionType", "runAfter": { "TestBuiltInActionPropertiesSummary_2": ["Succeeded"] } } }, "parameters": { "$authentication": { "defaultValue": {}, "type": "SecureObject" } }, "triggers": { "manual": { "kind": "PowerApps", "type": "manual", "inputs": {} } }, "contentVersion": "1.0.0.0"};
}