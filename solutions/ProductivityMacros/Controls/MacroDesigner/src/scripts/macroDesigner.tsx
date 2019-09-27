import * as SharedDefines from "./sharedDefines";
import * as Utils from "./sharedUtils";

import * as Workflow from "./workflowDefinitions";
//import * as Url from "url";
//import "XrmClientApi";

function getDesignerBlobUrl(): URL {
    //TODO - read from serviceendpoint
    let lcid = (window.top as any).Xrm.Utility.getGlobalContext().getOrgLcid();
    let locale = SharedDefines.LOCALE_MAP[lcid] || "en";
    return new URL("designer-dev/DesignerBlob/iframedesigner.html?locale=" + locale + "&base=" + encodeURIComponent((window.top as any).Xrm.Utility.getGlobalContext().getClientUrl()), "https://ocwdevel.blob.core.windows.net/");
}
function loadDesignerIframe() {
    let designerIframe = (document.getElementById("designerIframe") as HTMLIFrameElement);
    let url = getDesignerBlobUrl();
    designerIframe.src = url.toString();
}

loadDesignerIframe();

let operKindDisplayText = {};
operKindDisplayText[SharedDefines.Kind.Action] = Utils.Utils.getResourceString("DESIGNER_ACTION");
operKindDisplayText[SharedDefines.Kind.Trigger] = Utils.Utils.getResourceString("DESIGNER_TRIGGER");

let designerOptions: SharedDefines.IDesignerOptions = {
    ApiVersion: "1.0.0.0",  //K
    BaseUrl: window.location.hostname,  //K
    location: "NAM",    //K
    resourceGroup: "resourcegroup", //K
    subscriptionId: "subscription", //K
    resourceId: "resourceId",   //K    
    Categories: [],
    SearchHint: Utils.Utils.getResourceString("DESIGNER_SEARCHMACROS"),
    UserVoiceMessage: Utils.Utils.getResourceString("DESIGNER_USERVOICEMSG"),
    UserVoiceURL: "https://experience.dynamics.com/ideas/categories/list/?category=31047c64-7e28-e911-a95a-000d3a4f3883&forum=b68e50a6-88d9-e811-a96b-000d3a1be7ad",
    environmentName: (window.top as any).Xrm.Utility.getGlobalContext().getOrgUniqueName(),
    environmentDescription: (window.top as any).Xrm.Utility.getGlobalContext().getOrgUniqueName(),
    Connectors: [
    ],
    Actions: [
    ],
    operationKindDisplayText: operKindDisplayText
};

let CurrentWorkflowDetails = { definition: "", id: "", name: "", description: "" };


async function startDesigner(rpc) {
    try {
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
                    (window.top as any).Xrm.WebApi.updateRecord(SharedDefines.Constants.WORKFLOW_ENTITY, CurrentWorkflowDetails.id, { name: name, description: description, clientdata: JSON.stringify(clientData) }).then(function () {
                        (window.top as any).Xrm.Page.ui.close();
                    });
                }
                else {
                    try {
                        let rec = await (window.top as any).Xrm.WebApi.createRecord(SharedDefines.Constants.WORKFLOW_ENTITY, { name: name, description: description, clientdata: JSON.stringify(clientData), businessprocesstype: 0, category: 6, type: 1, primaryentity: "systemuser" }).then(function () {
                            (window.top as any).Xrm.Page.ui.close();
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
                (window.top as any).Xrm.Page.ui.close();
            });
        }
    }
    catch (error) {
        console.log("designer load error " + error);
    }
}


require(["LogicApps/rpc/Scripts/logicappdesigner/libs/rpc/rpc.standalone"], function (Rpc) {
    let designerIframe = (document.getElementById("designerIframe") as HTMLIFrameElement);
    let rpc = new Rpc.Rpc({
        signature: SharedDefines.Constants.WRAPPER_CONTROL_SIGNATURE,
        targetOrigin: getDesignerBlobUrl().toString(),
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