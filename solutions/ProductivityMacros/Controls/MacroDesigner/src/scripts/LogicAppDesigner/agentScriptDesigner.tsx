import * as SharedDefines from "../sharedDefines";
import * as Utils from "../sharedUtils";
import * as DesignerConstants from "./../../constants/DesignerConstants";

import * as Workflow from "./workflowDefinitions";
import { MouseEvent } from "react";

let cancelButton = document.getElementById("cancelButton");
async function closeDesigner(event?: Event) {
    (window.top.Xrm.Page.ui as XrmClientApi.FormUi).close();
}

if (cancelButton) {
    cancelButton.addEventListener("click", closeDesigner);
}

let initOperations: { [operType: string]: Promise<any> } = {};

function triggerCDSInitOperations() {
    initOperations[SharedDefines.RequiredCDSOpersForInit.DesignerConfig] = getLogicAppDesignerBlobConfig();
    initOperations[SharedDefines.RequiredCDSOpersForInit.Templates] = Workflow.Macros.getActionTemplates();
    initOperations[SharedDefines.RequiredCDSOpersForInit.WorkflowDefinition] = Workflow.Macros.getDefinition();
}

triggerCDSInitOperations();

async function getLogicAppDesignerBlobConfig(): Promise<SharedDefines.MacroDesignerConfig> {
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
            path = DesignerConstants.Constants.LogicAppDesignerRelativeUrl; //  relative path for logicappdesigner
            designerConfig.UserVoiceText = config.msdyn_uservoicetext;
            designerConfig.UserVoiceLink = config.msdyn_uservoicelink;
            designerConfig.SearchHint = Utils.Utils.getResourceString("LADESIGNER_SEARCHTEXT");;
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
                            eventName: SharedDefines.WrapperEvents.WrapperConfigErrorEvent,
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
                            eventName: SharedDefines.WrapperEvents.WrapperConfigErrorEvent,
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
                eventName: SharedDefines.WrapperEvents.WrapperConfigErrorEvent,
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
                eventName: SharedDefines.WrapperEvents.WrapperConfigLoadEvent,
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
    let url: string = (await initOperations[SharedDefines.RequiredCDSOpersForInit.DesignerConfig] as SharedDefines.MacroDesignerConfig).DesignerBaseURL || "";
    if (!url) {
        return;
    }
    designerIframe.onload = function () {
        let obj: SharedDefines.LogObject = {
            level: SharedDefines.LogLevel.Info,
            eventName: SharedDefines.WrapperEvents.DesignerIframeLoadEvent,
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
        let designerOptions: SharedDefines.ILogicAppDesignerOptions = {
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
            Connectors: [],
            Actions: [],
            Triggers:[],
            OperationManifest:[],
            operationKindDisplayText: operKindDisplayText
        };
        try {
            let designerConfig: SharedDefines.MacroDesignerConfig = await initOperations[SharedDefines.RequiredCDSOpersForInit.DesignerConfig] as SharedDefines.MacroDesignerConfig;
            let templates = await initOperations[SharedDefines.RequiredCDSOpersForInit.Templates] as SharedDefines.LogicAppDesignerTemplateConfig;
            designerOptions.ApiVersion = designerConfig.DesignerSolutionVersion || designerOptions.ApiVersion;
            designerOptions.SearchHint = Utils.Utils.getResourceString("LADESIGNER_SEARCHTEXT");
            designerOptions.UserVoiceMessage = designerConfig.UserVoiceText || Utils.Utils.getResourceString("DESIGNER_USERVOICEMSG");
            designerOptions.UserVoiceURL = designerConfig.UserVoiceLink;
            designerOptions.Actions = templates.actions;
            designerOptions.Triggers = templates.triggers;
            designerOptions.Connectors = templates.connectors;
            designerOptions.Categories = templates.categories;
            designerOptions.OperationManifest = templates.operationManifestData;
            let obj: SharedDefines.LogObject = {
                level: SharedDefines.LogLevel.Info,
                eventName: SharedDefines.WrapperEvents.WrapperConfigLoadEvent,
                message: Utils.Utils.genMsgForTelemetry("Designer action templates loaded"),
                eventTimeStamp: new Date(),
                eventType: SharedDefines.TelemetryEventType.Trace,
            };
            doTelemetry(obj);
        }
        catch (error) {
            let obj: SharedDefines.LogObject = {
                level: SharedDefines.LogLevel.Error,
                eventName: SharedDefines.WrapperEvents.WrapperConfigErrorEvent,
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
                eventName: SharedDefines.WrapperEvents.DesignerControlInitEvent,
                message: Utils.Utils.genMsgForTelemetry("Designer control init done"),
                eventTimeStamp: new Date(),
                eventType: SharedDefines.TelemetryEventType.Trace,
            };
            doTelemetry(obj);
        }
        catch (error) {
            let obj: SharedDefines.LogObject = {
                level: SharedDefines.LogLevel.Error,
                eventName: SharedDefines.WrapperEvents.DesignerControlInitErrorEvent,
                message: Utils.Utils.genMsgForTelemetry("Unable to initialize designer control", error),
                eventTimeStamp: new Date(),
                eventType: SharedDefines.TelemetryEventType.Trace,
                exception: error.stack
            };
            doTelemetry(obj, "DESIGNER_CONTROL_INIT_FAILURE", true);
            return;
        }
        try {
            CurrentWorkflowDetails = await initOperations[SharedDefines.RequiredCDSOpersForInit.WorkflowDefinition];
            let obj: SharedDefines.LogObject = {
                level: SharedDefines.LogLevel.Info,
                eventName: SharedDefines.WrapperEvents.DesignerControlInitEvent,
                message: Utils.Utils.genMsgForTelemetry("Workflow definition read from CDS done"),
                eventTimeStamp: new Date(),
                eventType: SharedDefines.TelemetryEventType.Trace,
            };
            doTelemetry(obj);
        }
        catch (error) {
            let obj: SharedDefines.LogObject = {
                level: SharedDefines.LogLevel.Error,
                eventName: SharedDefines.WrapperEvents.DesignerControlInitErrorEvent,
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
            console.log("Starting designer render");
	        let obj: SharedDefines.LogObject = {
                level: SharedDefines.LogLevel.Info,
                eventName: SharedDefines.WrapperEvents.DesignerControlInitEvent,
                message: Utils.Utils.genMsgForTelemetry("Expression definition loaded into designer control"),
                eventTimeStamp: new Date(),
                eventType: SharedDefines.TelemetryEventType.Trace,
            };
            doTelemetry(obj);
        }
        catch (error) {
            let obj: SharedDefines.LogObject = {
                level: SharedDefines.LogLevel.Error,
                eventName: SharedDefines.WrapperEvents.DesignerControlInitEvent,
                message: Utils.Utils.genMsgForTelemetry("Unable to load expression definition to designer", error),
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
                eventName: SharedDefines.WrapperEvents.DesignerControlInitEvent,
                message: Utils.Utils.genMsgForTelemetry("Designer render complete"),
                eventTimeStamp: new Date(),
                eventType: SharedDefines.TelemetryEventType.Trace,
            };
            doTelemetry(obj);
        }
        catch (error) {
            let obj: SharedDefines.LogObject = {
                level: SharedDefines.LogLevel.Error,
                eventName: SharedDefines.WrapperEvents.DesignerControlInitErrorEvent,
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
                        eventName: SharedDefines.WrapperEvents.DesignerControlExecutionEvent,
                        message: Utils.Utils.genMsgForTelemetry("Macro definition JSON generation done"),
                        eventTimeStamp: new Date(),
                        eventType: SharedDefines.TelemetryEventType.Trace,
                    };
                    doTelemetry(obj);
                   // let name = (window.top as any).Xrm.Page.getControl("macrosname_id").getValue() as string;
                    //let description = (window.top as any).Xrm.Page.getControl("macrosdesc_id").getValue() as string;
                    let clientData = {
                            definition: JSON.parse(workflowDefn).definition
                    };
                    console.log("Got workflow definition for expression '" + name + "' =" + JSON.stringify(clientData));
                    if (CurrentWorkflowDetails.id) {
                        try {
                            let rec = await window.top.Xrm.WebApi.updateRecord(SharedDefines.Constants.SESSION_TEMPLATE_ENTITY, CurrentWorkflowDetails.id, { msdyn_expressiondata: JSON.stringify(clientData) });
                            let obj: SharedDefines.LogObject = {
                                level: SharedDefines.LogLevel.Info,
                                eventName: SharedDefines.WrapperEvents.DesignerControlExecutionEvent,
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
                                eventName: SharedDefines.WrapperEvents.DesignerControlExecutionErrorEvent,
                                message: Utils.Utils.genMsgForTelemetry("Unable to update expression definition", error),
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
                        eventName: SharedDefines.WrapperEvents.DesignerControlExecutionErrorEvent,
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
        console.log("designer load error " + error);
	let obj: SharedDefines.LogObject = {
            level: SharedDefines.LogLevel.Error,
            eventName: SharedDefines.WrapperEvents.DesignerControlInitErrorEvent,
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

async function getCRMData() {
    let response : SharedDefines.ListDynamicValuesResponse = {value: []};

    let sessionTemplateId = Utils.Utils.getUrlParam(SharedDefines.Constants.MACRO_ID);
    let agentScriptList : SharedDefines.ListDynamicValue[] =[];
    try {
        let result = await (window.top as any).Xrm.WebApi.retrieveMultipleRecords("msdyn_consoleapplicationsessiontemplate","?$filter=msdyn_consoleapplicationsessiontemplateid eq '" + sessionTemplateId +"'&$expand=msdyn_msdyn_agentscript_msdyn_sessiontemplate($select=msdyn_name,msdyn_agentscriptid,msdyn_description)&$select=msdyn_name");   
        result.entities.forEach(function (item) {
            item.msdyn_msdyn_agentscript_msdyn_sessiontemplate.forEach(function (input) {
                let agentScriptItem: SharedDefines.ListDynamicValue= {
                    value: input.msdyn_agentscriptid,
                    displayName: input.msdyn_name,
                    description: input.msdyn_description,
                    disabled: false
                }
                agentScriptList.push(agentScriptItem);
            });
        });
        response.value = agentScriptList;  
    }
    catch (error) {
        let obj: SharedDefines.LogObject = {
            level: SharedDefines.LogLevel.Error,
            eventName: SharedDefines.WrapperEvents.DesignerControlExecutionEvent,
            message: Utils.Utils.genMsgForTelemetry("Unable to get Agent Script List", error),
            eventTimeStamp: new Date(),
            eventType: SharedDefines.TelemetryEventType.Trace,
            exception: error.stack
        };
        doTelemetry(obj);
    }
    return (JSON.stringify(response));
}
 

require(["LogicApps/rpc/Scripts/logicappdesigner/libs/rpc/rpc.standalone"], async function (Rpc) {
    let designerIframe = (document.getElementById("designerIframe") as HTMLIFrameElement);
    let targetOrigin = (await initOperations[SharedDefines.RequiredCDSOpersForInit.DesignerConfig] as SharedDefines.MacroDesignerConfig).DesignerBaseURL || "*";
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
    rpc.register(SharedDefines.WrapperMessages.GetCrmData, function () {
        return getCRMData();

    });
    rpc.register(SharedDefines.WrapperMessages.DesignerInitDone,
        function () {
            console.log("Designer Init Done");
            startDesigner(rpc);
        });
});