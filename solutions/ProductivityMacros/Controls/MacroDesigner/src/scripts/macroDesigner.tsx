import * as SharedDefines from "./sharedDefines";
import * as Utils from "./sharedUtils";

import * as Workflow from "./workflowDefinitions";
//import * as Url from "url";
//import "XrmClientApi";

let cancelButton = document.getElementById("cancelButton");
if (cancelButton) {
    cancelButton.addEventListener("click", async function (event) {
        console.log("Cancelling the MDD");
        (window.top.Xrm.Page.ui as XrmClientApi.FormUi).close();
    });
}

enum WrapperEvents {
    WrapperConfigErrorEvent = "MSWP.CONFIG_ERROR",
    WrapperConfigLoadEvent = "MSWP.CONFIG_LOAD",
    DesignerIframeLoadEvent = "MSWP.IFRAME_LOAD_DONE",
    //TemplateDefinitionLoadEvent = "MSWP.TEMPLATES_LOADED",
    DesignerControlInitEvent = "MSWP.DESIGNER_CONTROL_INIT",
    DesignerControlInitErrorEvent = "MSWP.DESIGNER_CONTROL_INIT_ERROR",
    DesignerControlExecutionEvent = "MSWP.DESIGNER_CONTROL_EXECUTION_EVENT",
    DesignerControlExecutionErrorEvent = "MSWP.DESIGNER_CONTROL_EXECUTION_ERROR"
};
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
        let designerConfig: SharedDefines.MacroDesignerConfig = {
            DesignerInstanceId: Utils.Utils.GenGuid()
        };
        let macroCDSConfig = await window.top.Xrm.WebApi.retrieveMultipleRecords(SharedDefines.Constants.MACRO_CONFIG_ENTITY, "?$select=msdyn_designerfallbackurl,msdyn_designerurlrelativepath,msdyn_designerurlconfigentity,msdyn_designerurlconfigentityid,msdyn_designerurlconfigentityattrib,msdyn_designerurlconfigentityquery,msdyn_name,msdyn_uservoicelink,msdyn_searchhint,msdyn_uservoicetext,msdyn_macrosversion");
        if (macroCDSConfig.entities.length > 0) {
            let config = macroCDSConfig.entities[0];
            path = config.msdyn_designerurlrelativepath;
            designerConfig.UserVoiceText = config.msdyn_uservoicetext;
            designerConfig.UserVoiceLink = config.msdyn_uservoicelink;
            designerConfig.SearchHint = config.msdyn_searchhint;
            designerConfig.DesignerSolutionVersion = config.msdyn_macrosversion;
            //baseUrl = config.msdyn_designerfallbackurl;
            if (config.msdyn_designerurlconfigentity && config.msdyn_designerurlconfigentityattrib) {
                if (config.msdyn_designerurlconfigentityid) {
                    try {
                        let designerConfig = await window.top.Xrm.WebApi.retrieveRecord(config.msdyn_designerurlconfigentity, config.msdyn_designerurlconfigentityid, "?$select=" + config.msdyn_designerurlconfigentityattrib);
                        baseUrl = designerConfig[config.msdyn_designerurlconfigentityattrib];
                    }
                    catch (error) {
                        let obj: SharedDefines.LogObject = {
                            level: SharedDefines.LogLevel.Warning,
                            eventName: WrapperEvents.WrapperConfigErrorEvent,
                            message: Utils.Utils.genMsgForTelemetry("Config entity id configured but unable to read designer URL", error),
                            eventTimeStamp: new Date(),
                            eventType: SharedDefines.TelemetryEventType.Trace,
                            exception: error.stack
                        };
                        doTelemetry(obj);
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
                        let obj: SharedDefines.LogObject = {
                            level: SharedDefines.LogLevel.Warning,
                            eventName: WrapperEvents.WrapperConfigErrorEvent,
                            message: Utils.Utils.genMsgForTelemetry("Config entity query configured but unable to read designer URL", error),
                            eventTimeStamp: new Date(),
                            eventType: SharedDefines.TelemetryEventType.Trace,
                            exception: error.stack
                        };
                        doTelemetry(obj);
                    }
                }
            }
            if (!baseUrl) {
                baseUrl = config.msdyn_designerfallbackurl;
            }
        }
        if (!baseUrl || !path) {
            let obj: SharedDefines.LogObject = {
                level: SharedDefines.LogLevel.Error,
                eventName: WrapperEvents.WrapperConfigErrorEvent,
                message: Utils.Utils.genMsgForTelemetry("No valid designer URL configured"),
                eventTimeStamp: new Date(),
                eventType: SharedDefines.TelemetryEventType.Trace,
                //exception: error.stack
            };
            doTelemetry(obj);
            reject(new Error("Unable to find designer config"));
        }
        else {
            designerConfig.DesignerBaseURL = new URL(path + "?locale=" + locale + "&base=" + encodeURIComponent(window.top.Xrm.Utility.getGlobalContext().getClientUrl()), baseUrl).toString();
            _macroDesignerConfig = designerConfig;
            let obj: SharedDefines.LogObject = {
                level: SharedDefines.LogLevel.Info,
                eventName: WrapperEvents.WrapperConfigLoadEvent,
                message: Utils.Utils.genMsgForTelemetry("Designer config loaded"),
                eventTimeStamp: new Date(),
                eventType: SharedDefines.TelemetryEventType.Trace,
                eventData: { data: _macroDesignerConfig }
                //exception: error.stack
            };
            doTelemetry(obj);
            resolve(designerConfig);
        }
    });
    return _designerConfigPromise;
}

async function loadDesignerIframe() {
    let designerIframe = (document.getElementById("designerIframe") as HTMLIFrameElement);
    let url: string = (await getDesignerBlobConfig()).DesignerBaseURL || "";
    designerIframe.onload = function () {
        let obj: SharedDefines.LogObject = {
            level: SharedDefines.LogLevel.Info,
            eventName: WrapperEvents.DesignerIframeLoadEvent,
            message: Utils.Utils.genMsgForTelemetry("Designer iframe loaded"),
            eventTimeStamp: new Date(),
            eventType: SharedDefines.TelemetryEventType.Trace,
            //exception: error.stack
        };
        doTelemetry(obj);
    };
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
            ApiVersion: designerConfig.DesignerSolutionVersion || "1.0",  //K
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
        //console.log("Starting designer init");
        try {
            let templates = await Workflow.Macros.getActionTemplates();
            designerOptions.Actions = templates.actions;
            designerOptions.Connectors = templates.connectors;
            designerOptions.Categories = templates.categories;
            let obj: SharedDefines.LogObject = {
                level: SharedDefines.LogLevel.Info,
                eventName: WrapperEvents.WrapperConfigLoadEvent,
                message: Utils.Utils.genMsgForTelemetry("Designer action templates loaded"),
                eventTimeStamp: new Date(),
                eventType: SharedDefines.TelemetryEventType.Trace,
                //exception: error.stack
            };
            doTelemetry(obj);
        }
        catch (error) {
            let obj: SharedDefines.LogObject = {
                level: SharedDefines.LogLevel.Error,
                eventName: WrapperEvents.WrapperConfigErrorEvent,
                message: Utils.Utils.genMsgForTelemetry("Unable to load templates", error),
                eventTimeStamp: new Date(),
                eventType: SharedDefines.TelemetryEventType.Trace,
                exception: error.stack
            };
            doTelemetry(obj);
        }
        try {
            let initResult = await rpc.call(SharedDefines.DesignerMessages.Initialize, [JSON.stringify(designerOptions)]);
            let obj: SharedDefines.LogObject = {
                level: SharedDefines.LogLevel.Info,
                eventName: WrapperEvents.DesignerControlInitEvent,
                message: Utils.Utils.genMsgForTelemetry("Designer control init done"),
                eventTimeStamp: new Date(),
                eventType: SharedDefines.TelemetryEventType.Trace,
                //exception: error.stack
            };
            doTelemetry(obj);
        }
        catch (error) {
            let obj: SharedDefines.LogObject = {
                level: SharedDefines.LogLevel.Error,
                eventName: WrapperEvents.DesignerControlInitErrorEvent,
                message: Utils.Utils.genMsgForTelemetry("Unable to initialize designer control", error),
                eventTimeStamp: new Date(),
                eventType: SharedDefines.TelemetryEventType.Trace,
                exception: error.stack
            };
            doTelemetry(obj);
        }
        //console.log("Starting designer loaddef");
        try {
            CurrentWorkflowDetails = await Workflow.Macros.getDefinition();
            if (CurrentWorkflowDetails.name) {
                (window.top as any).Xrm.Page.getControl("macrosname_id").getAttribute().setValue(CurrentWorkflowDetails.name);
            }
            if (CurrentWorkflowDetails.description) {
                (window.top as any).Xrm.Page.getControl("macrosdesc_id").getAttribute().setValue(CurrentWorkflowDetails.description);
            }
            let obj: SharedDefines.LogObject = {
                level: SharedDefines.LogLevel.Info,
                eventName: WrapperEvents.DesignerControlInitEvent,
                message: Utils.Utils.genMsgForTelemetry("Workflow definition read from CDS done"),
                eventTimeStamp: new Date(),
                eventType: SharedDefines.TelemetryEventType.Trace,
                //exception: error.stack
            };
            doTelemetry(obj);
        }
        catch (error) {
            let obj: SharedDefines.LogObject = {
                level: SharedDefines.LogLevel.Error,
                eventName: WrapperEvents.DesignerControlInitErrorEvent,
                message: Utils.Utils.genMsgForTelemetry("Unable to read workflow definition from CDS", error),
                eventTimeStamp: new Date(),
                eventType: SharedDefines.TelemetryEventType.Trace,
                exception: error.stack
            };
            doTelemetry(obj);
        }
        try {
            let loadDef = await rpc.call(SharedDefines.DesignerMessages.LoadDefinition, [JSON.stringify({ definition: CurrentWorkflowDetails.definition, references: [], sku: { name: "Free" } }), JSON.stringify(designerOptions)]);
            let obj: SharedDefines.LogObject = {
                level: SharedDefines.LogLevel.Info,
                eventName: WrapperEvents.DesignerControlInitEvent,
                message: Utils.Utils.genMsgForTelemetry("Macro definition loaded into designer control"),
                eventTimeStamp: new Date(),
                eventType: SharedDefines.TelemetryEventType.Trace,
                //exception: error.stack
            };
            doTelemetry(obj);
        }
        catch (error) {
            let obj: SharedDefines.LogObject = {
                level: SharedDefines.LogLevel.Error,
                eventName: WrapperEvents.DesignerControlInitEvent,
                message: Utils.Utils.genMsgForTelemetry("Unable to load macro definition to designer", error),
                eventTimeStamp: new Date(),
                eventType: SharedDefines.TelemetryEventType.Trace,
                exception: error.stack
            };
            doTelemetry(obj);
        }
        //console.log("Starting designer render");   
        try {
            let rendRes = await rpc.call(SharedDefines.DesignerMessages.RenderDesigner);
            console.log("Called");
            let designerIframe = (document.getElementById("designerIframe") as HTMLIFrameElement);
            designerIframe.style.display = "inline";
            let obj: SharedDefines.LogObject = {
                level: SharedDefines.LogLevel.Info,
                eventName: WrapperEvents.DesignerControlInitEvent,
                message: Utils.Utils.genMsgForTelemetry("Designer render complete"),
                eventTimeStamp: new Date(),
                eventType: SharedDefines.TelemetryEventType.Trace,
                //exception: error.stack
            };
            doTelemetry(obj);
        }
        catch (error) {
            let obj: SharedDefines.LogObject = {
                level: SharedDefines.LogLevel.Error,
                eventName: WrapperEvents.DesignerControlInitErrorEvent,
                message: Utils.Utils.genMsgForTelemetry("Unable to render designer", error),
                eventTimeStamp: new Date(),
                eventType: SharedDefines.TelemetryEventType.Trace,
                exception: error.stack
            };
            doTelemetry(obj);
        }
        let saveButton = document.getElementById("saveButton");
        if (saveButton) {
            saveButton.addEventListener("click", async function (event) {
                //console.log("Asking designer for workflow definition");
                try {
                    let workflowDefn = await rpc.call(SharedDefines.DesignerMessages.GetDefinition);
                    let obj: SharedDefines.LogObject = {
                        level: SharedDefines.LogLevel.Info,
                        eventName: WrapperEvents.DesignerControlExecutionEvent,
                        message: Utils.Utils.genMsgForTelemetry("Macro definition JSON generation done"),
                        eventTimeStamp: new Date(),
                        eventType: SharedDefines.TelemetryEventType.Trace,
                        //exception: error.stack
                    };
                    doTelemetry(obj);
                    let name = (window.top as any).Xrm.Page.getControl("macrosname_id").getValue() as string;
                    let description = (window.top as any).Xrm.Page.getControl("macrosdesc_id").getValue() as string;
                    let clientData = {
                        subcategory: "CDSClientAutomation",
                        schemaVersion: "1.0.0",
                        properties: {
                            definition: JSON.parse(workflowDefn).definition
                        }
                    };
                    //TODO - handle the scenario where name is empty
                    console.log("Got workflow definition for macro '" + name + "' =" + JSON.stringify(clientData));
                    if (CurrentWorkflowDetails.id) {
                        try {
                            let rec = await window.top.Xrm.WebApi.updateRecord(SharedDefines.Constants.WORKFLOW_ENTITY, CurrentWorkflowDetails.id, { name: name, description: description, clientdata: JSON.stringify(clientData) });
                            let obj: SharedDefines.LogObject = {
                                level: SharedDefines.LogLevel.Info,
                                eventName: WrapperEvents.DesignerControlExecutionEvent,
                                message: Utils.Utils.genMsgForTelemetry("Macro definition successfully updated"),
                                eventTimeStamp: new Date(),
                                eventType: SharedDefines.TelemetryEventType.Trace,
                                //exception: error.stack
                            };
                            doTelemetry(obj);
                            (window.top.Xrm.Page.ui as XrmClientApi.FormUi).close();
                        }
                        catch (error) {
                            let obj: SharedDefines.LogObject = {
                                level: SharedDefines.LogLevel.Error,
                                eventName: WrapperEvents.DesignerControlExecutionErrorEvent,
                                message: Utils.Utils.genMsgForTelemetry("Unable to update macro definition", error),
                                eventTimeStamp: new Date(),
                                eventType: SharedDefines.TelemetryEventType.Trace,
                                exception: error.stack
                            };
                            doTelemetry(obj);
                        }
                    }
                    else {
                        try {
                            let rec = await window.top.Xrm.WebApi.createRecord(SharedDefines.Constants.WORKFLOW_ENTITY, { name: name, description: description, clientdata: JSON.stringify(clientData), businessprocesstype: 0, category: 6, type: 1, primaryentity: "systemuser" });
                            let obj: SharedDefines.LogObject = {
                                level: SharedDefines.LogLevel.Info,
                                eventName: WrapperEvents.DesignerControlExecutionEvent,
                                message: Utils.Utils.genMsgForTelemetry("New macro creation success"),
                                eventTimeStamp: new Date(),
                                eventType: SharedDefines.TelemetryEventType.Trace,
                                //exception: error.stack
                            };
                            doTelemetry(obj);
                            (window.top.Xrm.Page.ui as XrmClientApi.FormUi).close();
                        }
                        catch (error) {
                            //TODO - log error save failed
                            let obj: SharedDefines.LogObject = {
                                level: SharedDefines.LogLevel.Error,
                                eventName: WrapperEvents.DesignerControlExecutionErrorEvent,
                                message: Utils.Utils.genMsgForTelemetry("Unable to create macro", error),
                                eventTimeStamp: new Date(),
                                eventType: SharedDefines.TelemetryEventType.Trace,
                                exception: error.stack
                            };
                            doTelemetry(obj);
                        }
                    }
                }
                catch (error) {
                    let obj: SharedDefines.LogObject = {
                        level: SharedDefines.LogLevel.Error,
                        eventName: WrapperEvents.DesignerControlExecutionErrorEvent,
                        message: Utils.Utils.genMsgForTelemetry("Macro definition JSON generation error", error),
                        eventTimeStamp: new Date(),
                        eventType: SharedDefines.TelemetryEventType.Trace,
                        exception: error.stack
                    };
                    doTelemetry(obj);
                }


            });
        }
    }
    catch (error) {
        console.log("designer load error " + error);
    }
}

function doTelemetry(msg: SharedDefines.LogObject) {
    //let msgObj: SharedDefines.LogObject = JSON.parse(msg);
    //console.log(JSON.stringify(msg));   //TODO: Log stuff from msgObj to telemetry
    console.log(msg.eventTimeStamp + " " + msg.eventType + " " + msg.level + " " + msg.eventName + " " + msg.message);
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
    rpc.register(SharedDefines.WrapperMessages.LOG, function (msgStr) {
        doTelemetry(JSON.parse(msgStr));
    });
    rpc.register(SharedDefines.WrapperMessages.DesignerInitDone,
        function () {
            console.log("Designer Init Done");
            startDesigner(rpc);
        });
});