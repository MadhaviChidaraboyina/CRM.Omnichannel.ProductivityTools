import * as SharedDefines from "./sharedDefines";
import * as Utils from "./sharedUtils";
import * as Workflow from "./workflowDefinitions";
import { isNullOrUndefined } from "util";
import { Constants } from "../constants/DesignerConstants";

enum WrapperEvents {
	WrapperConfigErrorEvent = "MSWP.CONFIG_ERROR",
	WrapperConfigLoadEvent = "MSWP.CONFIG_LOAD",
	MonitorIframeLoadEvent = "MSWP.IFRAME_LOAD_DONE",
	MonitorControlInitEvent = "MSWP.MONITOR_CONTROL_INIT",
	MonitorControlInitErrorEvent = "MSWP.MONITOR_CONTROL_INIT_ERROR",
	MonitorControlExecutionEvent = "MSWP.MONITOR_CONTROL_EXECUTION_EVENT",
	MonitorControlExecutionErrorEvent = "MSWP.MONITOR_CONTROL_EXECUTION_ERROR"
};

enum RequiredCDSOpersForInit {
	MonitorConfig = "0",
	ExecutionStatusJSON = "1",
	Templates = "2"
};

let initOperations: { [operType: string]: Promise<any> } = {};

function triggerCDSInitOperations() {
	initOperations[RequiredCDSOpersForInit.MonitorConfig] = getMonitorBlobConfig();
	initOperations[RequiredCDSOpersForInit.ExecutionStatusJSON] = Workflow.Macros.getExecutionStatus();
	initOperations[RequiredCDSOpersForInit.Templates] = Workflow.Macros.getActionTemplates();
}

triggerCDSInitOperations();

async function getMonitorBlobConfig(): Promise<SharedDefines.MacroMonitorConfig> {
	let _monitorConfigPromise: Promise<SharedDefines.MacroMonitorConfig> = new Promise<SharedDefines.MacroMonitorConfig>(async function (resolve, reject) {
		let lcid = window.top.Xrm.Utility.getGlobalContext().getOrgLcid();
		let locale = SharedDefines.LOCALE_MAP[lcid] || "en";
		let baseUrl: string = window.origin;
		let path: string = SharedDefines.Constants.MACROS_MONITOR_PATH;
		let monitorConfig: SharedDefines.MacroMonitorConfig = {
			MonitorInstanceId: Utils.Utils.GenGuid()
		};
		let macroCDSConfig = await window.top.Xrm.WebApi.retrieveMultipleRecords(SharedDefines.Constants.MACRO_CONFIG_ENTITY, "?$select=msdyn_designerfallbackurl,msdyn_designerurlconfigentity,msdyn_designerurlconfigentityid,msdyn_designerurlconfigentityattrib,msdyn_designerurlconfigentityquery,msdyn_name,msdyn_uservoicelink,msdyn_searchhint,msdyn_uservoicetext,msdyn_macrosversion");
		if (macroCDSConfig.entities.length > 0) {
			let config = macroCDSConfig.entities[0];
			monitorConfig.UserVoiceText = config.msdyn_uservoicetext;
			monitorConfig.UserVoiceLink = config.msdyn_uservoicelink;
			monitorConfig.SearchHint = config.msdyn_searchhint;
			monitorConfig.MonitorSolutionVersion = config.msdyn_macrosversion;
		}
		monitorConfig.MonitorBaseURL = new URL(path + "#locale=" + locale + "&base=" + encodeURIComponent(window.top.Xrm.Utility.getGlobalContext().getClientUrl()), baseUrl).toString();
		(window as any)._macro_monitor_cdn = Utils.Utils.getCdnBase();
		let obj: SharedDefines.LogObject = {
			level: SharedDefines.LogLevel.Info,
			eventName: WrapperEvents.WrapperConfigLoadEvent,
			message: Utils.Utils.genMsgForTelemetry("Monitor config loaded"),
			eventTimeStamp: new Date(),
			eventType: SharedDefines.TelemetryEventType.Trace,
			eventData: { data: monitorConfig }
		};
		doTelemetry(obj);
		resolve(monitorConfig);
	});
	return _monitorConfigPromise;
}

async function loadMonitorIframe() {
	let monitorIframe = (document.getElementById("monitorIframe") as HTMLIFrameElement);
	let url: string = (await initOperations[RequiredCDSOpersForInit.MonitorConfig] as SharedDefines.MacroMonitorConfig).MonitorBaseURL || "";
	if (!url) {
		return;
	}
	 monitorIframe.onload = function () {
		 let obj: SharedDefines.LogObject = {
			 level: SharedDefines.LogLevel.Info,
			 eventName: WrapperEvents.MonitorIframeLoadEvent,
			 message: Utils.Utils.genMsgForTelemetry("Monitor iframe loaded"),
			 eventTimeStamp: new Date(),
			 eventType: SharedDefines.TelemetryEventType.Trace,
		 };
		 doTelemetry(obj);
	 };
	 monitorIframe.src = url;
	 
	return url;
}

loadMonitorIframe();

let operKindDisplayText = {};
operKindDisplayText[SharedDefines.Kind.Action] = Utils.Utils.getResourceString("DESIGNER_ACTION");
operKindDisplayText[SharedDefines.Kind.Trigger] = Utils.Utils.getResourceString("DESIGNER_TRIGGER");





async function startMonitor(rpc) {
	try {
		let executionStatusJSON = await initOperations[RequiredCDSOpersForInit.ExecutionStatusJSON];
		if (executionStatusJSON.executionstatus.name) {
			(window.top as any).Xrm.Page.getControl("macrosname_id").getAttribute().setValue(executionStatusJSON.executionstatus.name);
		}
		let monitorOptions: SharedDefines.IMonitorOptions = {
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
            operationKindDisplayText: operKindDisplayText,
            OperationManifest: [],
			executionStatusJSON: executionStatusJSON.executionstatus
		};
		try {
			let monitorConfig: SharedDefines.MacroDesignerConfig = await initOperations[RequiredCDSOpersForInit.MonitorConfig] as SharedDefines.MacroDesignerConfig;
			let templates = await initOperations[RequiredCDSOpersForInit.Templates] as SharedDefines.DesignerTemplateConfig;
			monitorOptions.ApiVersion = monitorConfig.DesignerSolutionVersion || monitorOptions.ApiVersion;
			monitorOptions.SearchHint = monitorConfig.SearchHint || Utils.Utils.getResourceString("DESIGNER_SEARCHMACROS");
			monitorOptions.UserVoiceMessage = monitorConfig.UserVoiceText || Utils.Utils.getResourceString("DESIGNER_USERVOICEMSG");
			monitorOptions.UserVoiceURL = monitorConfig.UserVoiceLink;
			monitorOptions.Actions = templates.actions;
			monitorOptions.Connectors = templates.connectors;
            monitorOptions.Categories = templates.categories;
            monitorOptions.OperationManifest = templates.operationManifestData;
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
			let initResult = await rpc.call(SharedDefines.DesignerMessages.InitializeMonitor, [JSON.stringify(monitorOptions)]); //PUT executionStatusJSON here
			let obj: SharedDefines.LogObject = {
				level: SharedDefines.LogLevel.Info,
				eventName: WrapperEvents.MonitorControlInitEvent,
				message: Utils.Utils.genMsgForTelemetry("Monitor control init done"),
				eventTimeStamp: new Date(),
				eventType: SharedDefines.TelemetryEventType.Trace,
			};
			doTelemetry(obj);
		}
		catch (error) {
			let obj: SharedDefines.LogObject = {
				level: SharedDefines.LogLevel.Error,
				eventName: WrapperEvents.MonitorControlInitErrorEvent,
				message: Utils.Utils.genMsgForTelemetry("Unable to initialize monitor control", error),
				eventTimeStamp: new Date(),
				eventType: SharedDefines.TelemetryEventType.Trace,
				exception: error.stack
			};
			doTelemetry(obj, "MONITOR_CONTROL_INIT_FAILURE", true);
			return;
		}
		try {
			let runid = executionStatusJSON.executionstatus.id;
			let rendRes = await rpc.call(SharedDefines.DesignerMessages.RenderMonitor, [runid]);
			let spinner = document.getElementById("monitorContainerSpinner") as HTMLImageElement;
			spinner.style.display = "none";
			let monitorIframe = (document.getElementById("monitorIframe") as HTMLIFrameElement);
			monitorIframe.style.display = "inline";
			let obj: SharedDefines.LogObject = {
				level: SharedDefines.LogLevel.Info,
				eventName: WrapperEvents.MonitorControlInitEvent,
				message: Utils.Utils.genMsgForTelemetry("Monitor render complete"),
				eventTimeStamp: new Date(),
				eventType: SharedDefines.TelemetryEventType.Trace,
			};
			doTelemetry(obj);
		}
		catch (error) {
			let obj: SharedDefines.LogObject = {
				level: SharedDefines.LogLevel.Error,
				eventName: WrapperEvents.MonitorControlInitErrorEvent,
				message: Utils.Utils.genMsgForTelemetry("Unable to render monitor", error),
				eventTimeStamp: new Date(),
				eventType: SharedDefines.TelemetryEventType.Trace,
				exception: error.stack
			};
			doTelemetry(obj, "MONITOR_CONTROL_RENDER_FAILURE", true);
			return;
		}
	}
	catch (error) {
		let obj: SharedDefines.LogObject = {
			level: SharedDefines.LogLevel.Error,
			eventName: WrapperEvents.MonitorControlInitErrorEvent,
			message: Utils.Utils.genMsgForTelemetry("Unknown error trying to load monitor", error),
			eventTimeStamp: new Date(),
			eventType: SharedDefines.TelemetryEventType.Trace,
			exception: error.stack
		};
		doTelemetry(obj, "MONITOR_CONTROL_INIT_FAILURE", true);
		return;
	}
}
async function closeMonitor(event?: Event) {
	(window.top.Xrm.Page.ui as XrmClientApi.FormUi).close();
}


function doTelemetry(msg: SharedDefines.LogObject, userVisibleError?: string, toClose?: boolean) {
	Utils.Utils.logAdminTelemetry(msg);
	console.log(msg.eventTimeStamp + " " + msg.eventType + " " + msg.level + " " + msg.eventName + " " + msg.message);
	if (userVisibleError) {
		window.top.Xrm.Navigation.openAlertDialog({ text: Utils.Utils.getResourceString(userVisibleError) }).then(function () {
			if (toClose) {
				closeMonitor();
			}
		});
	}
}

require(["LogicApps/rpc/Scripts/logicappdesigner/libs/rpc/rpc.standalone"], async function (Rpc) {
	let monitorIframe = (document.getElementById("monitorIframe") as HTMLIFrameElement);
	let targetOrigin = window.origin;
	let rpc = new Rpc.Rpc({
		signature: SharedDefines.Constants.MWRAPPER_CONTROL_SIGNATURE,
		targetOrigin: targetOrigin,
		rpcMessageHandler: new Rpc.WindowPostMessageRpcHandler({
			targetWindow: monitorIframe.contentWindow,
			messageSerializer: function (message) {
				return Utils.Utils.serialize(message, SharedDefines.Constants.MWRAPPER_CONTROL_SIGNATURE, SharedDefines.Constants.MONITOR_CONTROL_SIGNATURE);
			},
			messageDeserializer: function (message) {
				return Utils.Utils.deserialize(message, SharedDefines.Constants.MONITOR_CONTROL_SIGNATURE, SharedDefines.Constants.MWRAPPER_CONTROL_SIGNATURE);
			}
		})
	});
	rpc.register(SharedDefines.WrapperMessages.LOG, function (msgStr) {
		doTelemetry(JSON.parse(msgStr));
	});
	rpc.register(SharedDefines.WrapperMessages.MonitorInitDone,
		function () {
			startMonitor(rpc);
		});
});