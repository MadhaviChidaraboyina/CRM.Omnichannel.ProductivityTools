import * as SharedDefines from "./sharedDefines";
import * as Utils from "./sharedUtils";

import * as Workflow from "./workflowDefinitions";
//import * as Url from "url";
//import "XrmClientApi";

let _designerConfigPromise: Promise<SharedDefines.MacroDesignerConfig> | null = null;
let _macroDesignerConfig: SharedDefines.MacroDesignerConfig | null = null;

async function getDesignerBlobConfig(): Promise<SharedDefines.MacroDesignerConfig> {
    //TODO - read from serviceendpoint
    if (_macroDesignerConfig) {
        return Promise.resolve(_macroDesignerConfig);
    }
    if (_designerConfigPromise) {
        return _designerConfigPromise;
    }
    _designerConfigPromise = new Promise<SharedDefines.MacroDesignerConfig>(async function (resolve, reject) {
        let lcid = window.top.Xrm.Utility.getGlobalContext().getOrgLcid();
        let locale = SharedDefines.LOCALE_MAP[lcid] || "en";
        let baseUrl: string = "";
        let path: string = "";
        let designerConfig: SharedDefines.MacroDesignerConfig = {};
        let macroCDSConfig = await window.top.Xrm.WebApi.retrieveMultipleRecords(SharedDefines.Constants.MACRO_CONFIG_ENTITY, "?$select=msdyn_designerfallbackurl,msdyn_designerurlrelativepath,msdyn_designerurlconfigentity,msdyn_designerurlconfigentityid,msdyn_designerurlconfigentityattrib,msdyn_designerurlconfigentityquery,msdyn_name,msdyn_uservoicelink,msdyn_searchhint,msdyn_uservoicetext");
        if (macroCDSConfig.entities.length > 0) {
            let config = macroCDSConfig.entities[0];
            path = config.msdyn_designerurlrelativepath;
            designerConfig.UserVoiceText = config.msdyn_uservoicetext;
            designerConfig.UserVoiceLink = config.msdyn_uservoicelink;
            designerConfig.SearchHint = config.msdyn_searchhint;
            //baseUrl = config.msdyn_designerfallbackurl;
            if (config.msdyn_designerurlconfigentity && config.msdyn_designerurlconfigentityattrib) {
                if (config.msdyn_designerurlconfigentityid) {
                    try {
                        let designerConfig = await window.top.Xrm.WebApi.retrieveRecord(config.msdyn_designerurlconfigentity, config.msdyn_designerurlconfigentityid, "?$select=" + config.msdyn_designerurlconfigentityattrib);
                        baseUrl = designerConfig[config.msdyn_designerurlconfigentityattrib];
                    }
                    catch (error) {
                        console.log("Unable to retrieve designer URL from " + config.msdyn_designerurlconfigentity + "(" + config.msdyn_designerurlconfigentityid + ")" + " Error: " + error);
                    }
                }
                if (config.msdyn_designerurlconfigentityquery && !baseUrl) {
                    try {
                        let designerConfig = await window.top.Xrm.WebApi.retrieveMultipleRecords(config.msdyn_designerurlconfigentity, config.msdyn_designerurlconfigentityquery);
                        if (designerConfig.entities.length > 0) {
                            baseUrl = designerConfig.entities[0][config.msdyn_designerurlconfigentityattrib];
                        }
                    }
                    catch (error) {
                        console.log("Unable to retrieve designer URL from " + config.msdyn_designerurlconfigentity + "(" + config.msdyn_designerurlconfigentityquery + ")" + " Error: " + error);
                    }
                }
            }
            if (!baseUrl) {
                baseUrl = config.msdyn_designerfallbackurl;
            }
        }
        if (!baseUrl || !path) {
            reject(new Error("Unable to find designer config"));
        }

        designerConfig.DesignerBaseURL = new URL(path + "?locale=" + locale + "&base=" + encodeURIComponent(window.top.Xrm.Utility.getGlobalContext().getClientUrl()), baseUrl).toString();
        _macroDesignerConfig = designerConfig;
        resolve(designerConfig);
    });
    return _designerConfigPromise;
}

async function loadDesignerIframe() {
    let designerIframe = (document.getElementById("designerIframe") as HTMLIFrameElement);
    let url: string = (await getDesignerBlobConfig()).DesignerBaseURL || "";
    designerIframe.src = url;
}

loadDesignerIframe();

let operKindDisplayText = {};
operKindDisplayText[SharedDefines.Kind.Action] = Utils.Utils.getResourceString("DESIGNER_ACTION");
operKindDisplayText[SharedDefines.Kind.Trigger] = Utils.Utils.getResourceString("DESIGNER_TRIGGER");



let CurrentWorkflowDetails = { definition: "", id: "", name: "", description: "" };


async function startDesigner(rpc) {
    try {
        let designerConfig: SharedDefines.MacroDesignerConfig = await getDesignerBlobConfig();
        let designerOptions: SharedDefines.IDesignerOptions = {
            ApiVersion: "1.0.0.0",  //K
            BaseUrl: window.location.hostname,  //K
            location: "NAM",    //K
            resourceGroup: "resourcegroup", //K
            subscriptionId: "subscription", //K
            resourceId: "resourceId",   //K
            Categories: [],
            SearchHint: designerConfig.SearchHint || Utils.Utils.getResourceString("DESIGNER_SEARCHMACROS"),
            UserVoiceMessage: designerConfig.UserVoiceText || Utils.Utils.getResourceString("DESIGNER_USERVOICEMSG"),
            UserVoiceURL: designerConfig.UserVoiceLink,
            environmentName: window.top.Xrm.Utility.getGlobalContext().getOrgUniqueName(),
            environmentDescription: window.top.Xrm.Utility.getGlobalContext().getOrgUniqueName(),
            Connectors: [
            ],
            Actions: [
            ],
            operationKindDisplayText: operKindDisplayText
        };
        console.log("Starting designer init");
        let templates = await Workflow.Macros.getActionTemplates();
        designerOptions.Actions = templates.actions;
        designerOptions.Connectors = templates.connectors;
        designerOptions.Categories = templates.categories;
        let initResult = await rpc.call(SharedDefines.DesignerMessages.Initialize, [JSON.stringify(designerOptions)]);
        console.log("Starting designer loaddef");
        CurrentWorkflowDetails = await Workflow.Macros.getDefinition();
        let loadDef = await rpc.call(SharedDefines.DesignerMessages.LoadDefinition, [JSON.stringify({ definition: CurrentWorkflowDetails.definition, references: [], sku: { name: "Free" } }), JSON.stringify(designerOptions)]);
        console.log("Starting designer render");
        if (CurrentWorkflowDetails.name) {
            (window.top as any).Xrm.Page.getControl("macrosname_id").getAttribute().setValue(CurrentWorkflowDetails.name);
        }
        if (CurrentWorkflowDetails.description) {
            (window.top as any).Xrm.Page.getControl("macrosdesc_id").getAttribute().setValue(CurrentWorkflowDetails.description);
        }
        let rendRes = await rpc.call(SharedDefines.DesignerMessages.RenderDesigner);
        console.log("Called");
        let designerIframe = (document.getElementById("designerIframe") as HTMLIFrameElement);
        designerIframe.style.display = "inline";
        let saveButton = document.getElementById("saveButton");
        if (saveButton) {
            saveButton.addEventListener("click", async function (event) {
                console.log("Asking designer for workflow definition");
                let workflowDefn = await rpc.call(SharedDefines.DesignerMessages.GetDefinition);
                let name = (window.top as any).Xrm.Page.getControl("macrosname_id").getValue() as string;
                let description = (window.top as any).Xrm.Page.getControl("macrosdesc_id").getValue() as string;
                let clientData = {
                    subcategory: "CDSClientAutomation",
                    schemaVersion: "1.0.0",
                    properties: {
                        definition: JSON.parse(workflowDefn).definition
                    }
                };
                if (CurrentWorkflowDetails.id) {
                    window.top.Xrm.WebApi.updateRecord(SharedDefines.Constants.WORKFLOW_ENTITY, CurrentWorkflowDetails.id, { name: name, description: description, clientdata: JSON.stringify(clientData) }).then(function () {
                        (window.top.Xrm.Page.ui as XrmClientApi.FormUi).close();
                    });
                }
                else {
                    try {
                        let rec = await window.top.Xrm.WebApi.createRecord(SharedDefines.Constants.WORKFLOW_ENTITY, { name: name, description: description, clientdata: JSON.stringify(clientData), businessprocesstype: 0, category: 6, type: 1, primaryentity: "systemuser" }).then(function () {
                            (window.top.Xrm.Page.ui as XrmClientApi.FormUi).close();
                        });
                    }
                    catch (error) {
                        //TODO - log error save failed
                    }
                }
                console.log("Got workflow definition for macro '" + name + "' =" + JSON.stringify(clientData));
            });
        }
        let cancelButton = document.getElementById("cancelButton");
        if (cancelButton) {
            cancelButton.addEventListener("click", async function (event) {
                console.log("Cancelling the MDD");
                (window.top.Xrm.Page.ui as XrmClientApi.FormUi).close();
            });
        }
    }
    catch (error) {
        console.log("designer load error " + error);
    }
}


require(["LogicApps/rpc/Scripts/logicappdesigner/libs/rpc/rpc.standalone"], async function (Rpc) {
    let designerIframe = (document.getElementById("designerIframe") as HTMLIFrameElement);
    let targetOrigin = (await getDesignerBlobConfig()).DesignerBaseURL || "*";
    let rpc = new Rpc.Rpc({
        signature: SharedDefines.Constants.WRAPPER_CONTROL_SIGNATURE,
        targetOrigin: targetOrigin,
        rpcMessageHandler: new Rpc.WindowPostMessageRpcHandler({
            targetWindow: designerIframe.contentWindow,
            messageSerializer: function (message) {
                return Utils.Utils.serialize(message, SharedDefines.Constants.WRAPPER_CONTROL_SIGNATURE, SharedDefines.Constants.DESIGNER_CONTROL_SIGNATURE);
            },
            messageDeserializer: function (message) {
                return Utils.Utils.deserialize(message, SharedDefines.Constants.DESIGNER_CONTROL_SIGNATURE, SharedDefines.Constants.WRAPPER_CONTROL_SIGNATURE);
            }
        })
    });
    rpc.register(SharedDefines.WrapperMessages.DesignerInitDone,
        function () {
            console.log("Designer Init Done");
            startDesigner(rpc);
        });
});