import * as SharedDefines from "./sharedDefines";
import * as Utils from "./sharedUtils";

import * as Workflow from "./workflowDefinitions";
import { MouseEvent } from "react";

let cancelButton = document.getElementById("cancelButton");
async function closeDesigner(event?: Event) {
    (window.top.Xrm.Page.ui as XrmClientApi.FormUi).close();
}

if (cancelButton) {
    cancelButton.addEventListener("click", closeDesigner);
}

enum WrapperEvents {
    WrapperConfigErrorEvent = "MSWP.CONFIG_ERROR",
    WrapperConfigLoadEvent = "MSWP.CONFIG_LOAD",
    DesignerIframeLoadEvent = "MSWP.IFRAME_LOAD_DONE",
    DesignerControlInitEvent = "MSWP.DESIGNER_CONTROL_INIT",
    DesignerControlInitErrorEvent = "MSWP.DESIGNER_CONTROL_INIT_ERROR",
    DesignerControlExecutionEvent = "MSWP.DESIGNER_CONTROL_EXECUTION_EVENT",
    DesignerControlExecutionErrorEvent = "MSWP.DESIGNER_CONTROL_EXECUTION_ERROR"
};

enum RequiredCDSOpersForInit {
    DesignerConfig = "0",
    Templates = "1",
    WorkflowDefinition = "2"
};

let initOperations: { [operType: string]: Promise<any> } = {};

function triggerCDSInitOperations() {
    initOperations[RequiredCDSOpersForInit.DesignerConfig] = getDesignerBlobConfig();
    initOperations[RequiredCDSOpersForInit.Templates] = Workflow.Macros.getActionTemplates();
    initOperations[RequiredCDSOpersForInit.WorkflowDefinition] = Workflow.Macros.getDefinition();
}

triggerCDSInitOperations();

async function getDesignerBlobConfig(): Promise<SharedDefines.MacroDesignerConfig> {
    let _designerConfigPromise: Promise<SharedDefines.MacroDesignerConfig> = new Promise<SharedDefines.MacroDesignerConfig>(async function (resolve, reject) {
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
            designerConfig.UserVoiceText = Utils.Utils.getResourceString(config.msdyn_uservoicetext);
            designerConfig.UserVoiceLink = config.msdyn_uservoicelink;
            designerConfig.SearchHint = Utils.Utils.getResourceString(config.msdyn_searchhint);
            designerConfig.DesignerSolutionVersion = config.msdyn_macrosversion;
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
            };
            doTelemetry(obj, "DESIGNER_CONFIG_ERROR_URL_NOT_FOUND", true);
            reject(new Error("Unable to find designer config"));
        }
        else {
            designerConfig.DesignerBaseURL = new URL(path + "?locale=" + locale + "&base=" + encodeURIComponent(window.top.Xrm.Utility.getGlobalContext().getClientUrl()), baseUrl).toString();
            let obj: SharedDefines.LogObject = {
                level: SharedDefines.LogLevel.Info,
                eventName: WrapperEvents.WrapperConfigLoadEvent,
                message: Utils.Utils.genMsgForTelemetry("Designer config loaded"),
                eventTimeStamp: new Date(),
                eventType: SharedDefines.TelemetryEventType.Trace,
                eventData: { data: designerConfig }
            };
            doTelemetry(obj);
            resolve(designerConfig);
        }
    });
    return _designerConfigPromise;
}

async function loadDesignerIframe() {
    let designerIframe = (document.getElementById("designerIframe") as HTMLIFrameElement);
    let url: string = (await initOperations[RequiredCDSOpersForInit.DesignerConfig] as SharedDefines.MacroDesignerConfig).DesignerBaseURL || "";
    if (!url) {
        return;
    }
    designerIframe.onload = function () {
        let obj: SharedDefines.LogObject = {
            level: SharedDefines.LogLevel.Info,
            eventName: WrapperEvents.DesignerIframeLoadEvent,
            message: Utils.Utils.genMsgForTelemetry("Designer iframe loaded"),
            eventTimeStamp: new Date(),
            eventType: SharedDefines.TelemetryEventType.Trace,
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
        let designerOptions: SharedDefines.IDesignerOptions = {
            ApiVersion: "1.0",
            BaseUrl: window.location.hostname,
            location: "NAM",
            resourceGroup: "resourcegroup",
            subscriptionId: "subscription",
            resourceId: "resourceId",
            Categories: [],
            SearchHint: "",
            UserVoiceMessage: "",
            environmentName: window.top.Xrm.Utility.getGlobalContext().getOrgUniqueName(),
            environmentDescription: window.top.Xrm.Utility.getGlobalContext().getOrgUniqueName(),
            Connectors: [
            ],
            Actions: [
            ],
            operationKindDisplayText: operKindDisplayText
        };
        try {
            let designerConfig: SharedDefines.MacroDesignerConfig = await initOperations[RequiredCDSOpersForInit.DesignerConfig] as SharedDefines.MacroDesignerConfig;
            let templates = await initOperations[RequiredCDSOpersForInit.Templates] as SharedDefines.DesignerTemplateConfig;
            designerOptions.ApiVersion = designerConfig.DesignerSolutionVersion || designerOptions.ApiVersion;
            designerOptions.SearchHint = designerConfig.SearchHint || Utils.Utils.getResourceString("DESIGNER_SEARCHMACROS");
            designerOptions.UserVoiceMessage = designerConfig.UserVoiceText || Utils.Utils.getResourceString("DESIGNER_USERVOICEMSG");
            designerOptions.UserVoiceURL = designerConfig.UserVoiceLink;
            designerOptions.Actions = templates.actions;
            designerOptions.Connectors = templates.connectors;
            designerOptions.Categories = templates.categories;
            let obj: SharedDefines.LogObject = {
                level: SharedDefines.LogLevel.Info,
                eventName: WrapperEvents.WrapperConfigLoadEvent,
                message: Utils.Utils.genMsgForTelemetry("Designer action templates loaded"),
                eventTimeStamp: new Date(),
                eventType: SharedDefines.TelemetryEventType.Trace,
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
            doTelemetry(obj, "DESIGNER_CONFIG_ERROR_TEMPLATES_NOT_FOUND");
        }
        try {
            let initResult = await rpc.call(SharedDefines.DesignerMessages.Initialize, [JSON.stringify(designerOptions)]);
            let obj: SharedDefines.LogObject = {
                level: SharedDefines.LogLevel.Info,
                eventName: WrapperEvents.DesignerControlInitEvent,
                message: Utils.Utils.genMsgForTelemetry("Designer control init done"),
                eventTimeStamp: new Date(),
                eventType: SharedDefines.TelemetryEventType.Trace,
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
            doTelemetry(obj, "DESIGNER_CONTROL_INIT_FAILURE", true);
            return;
        }
        try {
            CurrentWorkflowDetails = await initOperations[RequiredCDSOpersForInit.WorkflowDefinition];
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
            doTelemetry(obj, "DESIGNER_CONFIG_ERROR_INVALID_MACRO_DEFINITION", true);
            return;
        }
        try {
            let loadDef = await rpc.call(SharedDefines.DesignerMessages.LoadDefinition, [JSON.stringify({ definition: CurrentWorkflowDetails.definition, references: [], sku: { name: "Free" } }), JSON.stringify(designerOptions)]);
            let obj: SharedDefines.LogObject = {
                level: SharedDefines.LogLevel.Info,
                eventName: WrapperEvents.DesignerControlInitEvent,
                message: Utils.Utils.genMsgForTelemetry("Macro definition loaded into designer control"),
                eventTimeStamp: new Date(),
                eventType: SharedDefines.TelemetryEventType.Trace,
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
            doTelemetry(obj, "DESIGNER_CONTROL_LOAD_FAILURE", true);
            return;
        }
        try {
            let rendRes = await rpc.call(SharedDefines.DesignerMessages.RenderDesigner);
            let spinner = document.getElementById("designerContainerSpinner") as HTMLImageElement;
            spinner.style.display = "none";
            let designerIframe = (document.getElementById("designerIframe") as HTMLIFrameElement);
            designerIframe.style.display = "inline";
            let obj: SharedDefines.LogObject = {
                level: SharedDefines.LogLevel.Info,
                eventName: WrapperEvents.DesignerControlInitEvent,
                message: Utils.Utils.genMsgForTelemetry("Designer render complete"),
                eventTimeStamp: new Date(),
                eventType: SharedDefines.TelemetryEventType.Trace,
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
            doTelemetry(obj, "DESIGNER_CONTROL_RENDER_FAILURE", true);
            return;
        }
        let saveButton = document.getElementById("saveButton");
        if (saveButton) {
            saveButton.addEventListener("click", async function (event) {
                try {
                    let workflowDefn = await rpc.call(SharedDefines.DesignerMessages.GetDefinition);
                    let obj: SharedDefines.LogObject = {
                        level: SharedDefines.LogLevel.Info,
                        eventName: WrapperEvents.DesignerControlExecutionEvent,
                        message: Utils.Utils.genMsgForTelemetry("Macro definition JSON generation done"),
                        eventTimeStamp: new Date(),
                        eventType: SharedDefines.TelemetryEventType.Trace,
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
                            };
                            doTelemetry(obj);
                            closeDesigner(event);
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
                            doTelemetry(obj, "DESIGNER_CONTROL_CDS_WRITE_ERROR");
                            return;
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
                            };
                            doTelemetry(obj);
                            try {
                                let upd = await window.top.Xrm.WebApi.updateRecord(SharedDefines.Constants.WORKFLOW_ENTITY, rec.id, { statecode: 1, statuscode: 2 });
                                let obj: SharedDefines.LogObject = {
                                    level: SharedDefines.LogLevel.Info,
                                    eventName: WrapperEvents.DesignerControlExecutionEvent,
                                    message: Utils.Utils.genMsgForTelemetry("Macro '" + rec.id + "' successfully activated"),
                                    eventTimeStamp: new Date(),
                                    eventType: SharedDefines.TelemetryEventType.Trace,
                                };
                                doTelemetry(obj);
                                closeDesigner(event);
                            }
                            catch (error) {
                                let obj: SharedDefines.LogObject = {
                                    level: SharedDefines.LogLevel.Error,
                                    eventName: WrapperEvents.DesignerControlExecutionErrorEvent,
                                    message: Utils.Utils.genMsgForTelemetry("Unable to activate macro + '" + rec.id + ",", error),
                                    eventTimeStamp: new Date(),
                                    eventType: SharedDefines.TelemetryEventType.Trace,
                                    exception: error.stack
                                };
                                doTelemetry(obj, "DESIGNER_CONTROL_CDS_WRITE_ERROR");
                                return;
                            }
                            //(window.top.Xrm.Page.ui as XrmClientApi.FormUi).close();
                        }
                        catch (error) {
                            let obj: SharedDefines.LogObject = {
                                level: SharedDefines.LogLevel.Error,
                                eventName: WrapperEvents.DesignerControlExecutionErrorEvent,
                                message: Utils.Utils.genMsgForTelemetry("Unable to create macro", error),
                                eventTimeStamp: new Date(),
                                eventType: SharedDefines.TelemetryEventType.Trace,
                                exception: error.stack
                            };
                            doTelemetry(obj, "DESIGNER_CONTROL_CDS_WRITE_ERROR");
                            return;
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
                    doTelemetry(obj, "DESIGNER_CONTROL_JSON_GENERATION_ERROR");
                    return;
                }
            });
        }
    }
    catch (error) {
        let obj: SharedDefines.LogObject = {
            level: SharedDefines.LogLevel.Error,
            eventName: WrapperEvents.DesignerControlInitErrorEvent,
            message: Utils.Utils.genMsgForTelemetry("Unknown error trying to load designer", error),
            eventTimeStamp: new Date(),
            eventType: SharedDefines.TelemetryEventType.Trace,
            exception: error.stack
        };
        doTelemetry(obj, "DESIGNER_CONTROL_INIT_FAILURE", true);
        return;
    }
}

function doTelemetry(msg: SharedDefines.LogObject, userVisibleError?: string, toClose?: boolean) {
    Utils.Utils.logAdminTelemetry(msg);
    console.log(msg.eventTimeStamp + " " + msg.eventType + " " + msg.level + " " + msg.eventName + " " + msg.message);
    if (userVisibleError) {
        window.top.Xrm.Navigation.openAlertDialog({ text: Utils.Utils.getResourceString(userVisibleError) }).then(function () {
            if (toClose) {
                closeDesigner();
            }
        });
    }
}

require(["LogicApps/rpc/Scripts/logicappdesigner/libs/rpc/rpc.standalone"], async function (Rpc) {
    let designerIframe = (document.getElementById("designerIframe") as HTMLIFrameElement);
    let targetOrigin = (await initOperations[RequiredCDSOpersForInit.DesignerConfig] as SharedDefines.MacroDesignerConfig).DesignerBaseURL || "*";
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
            startDesigner(rpc);
        });
});