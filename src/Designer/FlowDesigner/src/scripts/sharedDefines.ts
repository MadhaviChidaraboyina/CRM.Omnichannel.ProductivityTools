import { AnalyticsContext } from "./DesignerDefinitions";

export interface MacroDesignerConfig {
	DesignerBaseURL?: string;
	UserVoiceText?: string;
	UserVoiceLink?: string;
	SearchHint?: string;
	DesignerSolutionVersion?: string;
	DesignerInstanceId?: string;
}

export interface MacroMonitorConfig {
	MonitorBaseURL?: string;
	UserVoiceText?: string;
	UserVoiceLink?: string;
	SearchHint?: string;
	MonitorSolutionVersion?: string;
	MonitorInstanceId?: string;
}

declare global {
	interface Window {
		Xrm: XrmClientApi.XrmStatic;
	}
}

export class Constants {
	public static DESIGNER_CONTROL_SIGNATURE = "msladesigner";
	public static WRAPPER_CONTROL_SIGNATURE = "msladesigner";
	public static MACRO_ID = "id";
	public static WORKFLOW_ENTITY = "workflow";
	public static MACRO_CONFIG_ENTITY = "msdyn_macrosolutionconfiguration_v2";
	public static MONITOR_CONTROL_SIGNATURE = "mslamonitor";
	public static MWRAPPER_CONTROL_SIGNATURE = "mslamonitor";
	public static MACROS_SESSION_ENTITY = "msdyn_macrosession";
	public static MACROS_MONITOR_PATH = "/flowcontrol/DesignerBlob/iframemonitor.html";
	public static SESSION_TEMPLATE_ENTITY = "msdyn_sessiontemplate";
	public static EXPRESSION_DATA = "msdyn_expressiondata";
	public static BUILTIN_CATEGORY = "LOGIC_APPS_BUILTIN";
    public static BUILTIN_CATEGORY_DISPLAY = "LADESIGNER_RECOMMENDATION_CATEGORY_LOGICAPP_BUILTIN";
    public static MACRO_ACTION_SAVE_AND_CLOSE = "MACRO_ACTION_SAVE_AND_CLOSE";
    public static MACRO_ACTION_CANCEL = "MACRO_ACTION_CANCEL";
};

export class DesignerMessages {
	public static Initialize = "initialize";
	public static GetDefinition = "getDefinition";
	public static LoadDefinition = "loadDefinition";
	public static RenderDesigner = "renderDesigner";
	public static RPC_PONG = "__PONG__";
	public static InitializeMonitor = "initializeMonitor";
	public static RenderMonitor = "renderMonitor";
}

export class WrapperMessages {
	public static DesignerInitDone = "initDone";
	public static RPC_PING = "__PING__";
	public static LOG = "log";
	public static MonitorInitDone = "monitorInitDone";
	public static GetCrmData = "crmdata";
};
export enum LogLevel {
	Info = "Info",
	Warning = "Warning",
	Error = "Error",
	Trace = "Trace",
	Debug = "Debug"
}
export enum TelemetryEventType {
	Trace = "Trace",
	Request = "Request",
	Telemetry = "Telemetry",
	ProfileStart = "ProfileStart",
	ProfileEnd = "ProfileEnd"
}
export interface LogObject {
	//designerInstanceId: string,
	eventName: string,
	eventCorrelationId?: string,
	message: string,
	eventData?: { context?: AnalyticsContext, data?: any },
	eventId?: string,
	eventTimeStamp: Date,
	eventType: TelemetryEventType,
	level: LogLevel,
	exception?: any
}
export interface Parameter {
	name: string,
	type: string,
	description: string,
	title: string,
	visibility?: string,
	compoundObjectDefinitionJSON?: string,
	properties?: string
};
export enum Kind {
	Action = "ACTIONS",
	Trigger = "TRIGGERS"
};
export enum ParameterTypes {
	Any = "any",
	Array = "array",
	Boolean = "boolean",
	File = "file",   //Not supported for macros
	Integer = "integer",
	Null = "null",  //Not supported for macros
	Number = "number",
	Object = "object",
	String = "string"
};
export interface Action {
	id: string,
	type: string,
	name: string,
	brandColor: string,
	description: string,
	icon: string,
	subtitle: string,
	title: string,
	summary: string,
	kind: Kind,
	visibility: string,
	inputs?: Parameter[],
	outputs?: Parameter[],
	category: string,
	connectorId: string
};
export interface Category {
	itemKey: string,
	linkText: string
}
export interface Connector {
	id: string,
	type: string,
	name: string,
	title: string,
	brandColor: string,
	description: string,
	icon: string,
	category: string,
	capabilities: [],
	//connectionDisplayName: "Unified Interface automation",
	displayName: string
	//environmentBadge: testEnvBadge,
	//environment: testEnvBadge.name,
	//purpose: "Automate commonly used client-side tasks",
	//iconUri: "./icons/flow_placeholder.svg",
	//runtimeUrls: [],
}
export interface DesignerTemplateConfig {
	actions: Action[],
	connectors: Connector[],
	categories: Category[],
	triggers?: any[]
}
export interface IDesignerOptions {
	ApiVersion: string,
	BaseUrl: string,
	location: string,
	resourceGroup: string,
	subscriptionId: string,
	resourceId: string,
	//doNotAddRecommendation: true,
	Categories: Category[],
	SearchHint: string,
	Actions: Action[],
	Connectors: Connector[],
	UserVoiceMessage: string,
	UserVoiceURL?: string,
	environmentName: string,
	environmentDescription: string,
	operationKindDisplayText: { [kind: string]: string }
};

export interface IMonitorOptions {
	ApiVersion: string,
	BaseUrl: string,
	location: string,
	resourceGroup: string,
	subscriptionId: string,
	resourceId: string,
	//doNotAddRecommendation: true,
	Categories: Category[],
	SearchHint: string,
	Actions: Action[],
	Connectors: Connector[],
	UserVoiceMessage: string,
	UserVoiceURL?: string,
	environmentName: string,
	environmentDescription: string,
	operationKindDisplayText: { [kind: string]: string }
	executionStatusJSON: any
};
export interface LogicAppDesignerTemplateConfig {
	actions: any[],
	triggers: any[],
	connectors: any[],
	categories: Category[],
	operationManifestData: any[]
}
export interface ILogicAppDesignerOptions {
	ApiVersion: string,
	BaseUrl: string,
	location: string,
	resourceGroup: string,
	subscriptionId: string,
	resourceId: string,
	//doNotAddRecommendation: true,
	Categories: Category[],
	SearchHint: string,
	Actions: any[],
	Triggers: any[],
	Connectors: any[],
	OperationManifest: any[],
	UserVoiceMessage: string,
	UserVoiceURL?: string,
	environmentName: string,
	environmentDescription: string,
	operationKindDisplayText: { [kind: string]: string }
}

export interface ListDynamicValuesResponse {
	value: ListDynamicValue[];
}
export interface ListDynamicValue {
	value: any;        // tslint:disable-line: no-any
	displayName: string;
	description: string;
	disabled: boolean;
}

export enum Visibility {
	Required = "required",
	Important = "important",
	Advanced = "advanced",
	Internal = "internal",
	ReadOnly = "read-only"
};
export interface DesignerActionParameter {
	title: string,
	description: string,
	type: string,
	"x-ms-visibility"?: string,
	items?: DesignerActionParameter
};


const LOCALE_MAP = {
	1078: "af",
	1052: "sq",
	1118: "am",
	5121: "ar",
	15361: "ar",
	3073: "ar",
	2049: "ar",
	11265: "ar",
	13313: "ar",
	12289: "ar",
	4097: "ar",
	6145: "ar",
	8193: "ar",
	16385: "ar",
	1025: "ar",
	10241: "ar",
	7169: "ar",
	14337: "ar",
	9217: "ar",
	1067: "hy",
	1101: "as",
	2092: "az",
	1068: "az",
	1069: "eu",
	1059: "be",
	2117: "bn",
	1093: "bn",
	5146: "bs",
	1026: "bg",
	1109: "my",
	1027: "ca",
	2052: "zh",
	3076: "zh",
	5124: "zh",
	4100: "zh",
	1028: "zh",
	1050: "hr",
	1029: "cs",
	1030: "da",
	2067: "nl",
	1043: "nl",
	1126: "en",
	3081: "en",
	10249: "en",
	4105: "en",
	9225: "en",
	2057: "en",
	16393: "en",
	6153: "en",
	8201: "en",
	5129: "en",
	13321: "en",
	7177: "en",
	11273: "en",
	1033: "en",
	12297: "en",
	1061: "et",
	1071: "mk",
	1080: "fo",
	1065: "fa",
	1124: "en",
	1035: "fi",
	2060: "fr",
	11276: "fr",
	3084: "fr",
	9228: "fr",
	12300: "fr",
	1036: "fr",
	5132: "fr",
	13324: "fr",
	6156: "fr",
	14348: "fr",
	10252: "fr",
	4108: "fr",
	7180: "fr",
	1122: "en",
	2108: "gd",
	1084: "gd",
	1110: "gl",
	1079: "ka",
	3079: "de",
	1031: "de",
	5127: "de",
	4103: "de",
	2055: "de",
	1032: "el",
	1140: "gn",
	1095: "gu",
	1279: "en",
	1037: "he",
	1081: "hi",
	1038: "hu",
	1039: "is",
	1136: "en",
	1057: "id",
	1040: "it",
	2064: "it",
	1041: "ja",
	1099: "kn",
	1120: "ks",
	1087: "kk",
	1107: "km",
	1111: "en",
	1042: "ko",
	1088: "en",
	1108: "lo",
	1142: "la",
	1062: "lv",
	1063: "lt",
	2110: "ms",
	1086: "ms",
	1100: "ml",
	1082: "mt",
	1112: "en",
	1153: "mi",
	1102: "mr",
	2128: "mn",
	1104: "mn",
	1121: "ne",
	1044: "nb",
	2068: "nn",
	1096: "or",
	1045: "pl",
	1046: "pt",
	2070: "pt",
	1094: "pa",
	1047: "rm",
	2072: "ro",
	1048: "ro",
	1049: "ru",
	2073: "ru",
	1083: "en",
	1103: "sa",
	3098: "sr",
	2074: "sr",
	1072: "en",
	1074: "tn",
	1113: "sd",
	1051: "sk",
	1060: "sl",
	1143: "so",
	1070: "sb",
	11274: "es",
	16394: "es",
	13322: "es",
	9226: "es",
	5130: "es",
	7178: "es",
	12298: "es",
	17418: "es",
	4106: "es",
	18442: "es",
	2058: "es",
	19466: "es",
	6154: "es",
	15370: "es",
	10250: "es",
	20490: "es",
	1034: "es",
	14346: "es",
	8202: "es",
	1089: "sw",
	2077: "sv",
	1053: "sv",
	1114: "en",
	1064: "tg",
	1097: "ta",
	1092: "tt",
	1098: "te",
	1054: "th",
	1105: "bo",
	1073: "ts",
	1055: "tr",
	1090: "tk",
	1058: "uk",
	1056: "ur",
	2115: "uz",
	1091: "uz",
	1075: "en",
	1066: "vi",
	1106: "cy",
	1076: "xh",
	1085: "yi",
	1077: "zu"
};

export { LOCALE_MAP };

export enum WrapperEvents {
	WrapperConfigErrorEvent = "MSWP.CONFIG_ERROR",
	WrapperConfigLoadEvent = "MSWP.CONFIG_LOAD",
	DesignerIframeLoadEvent = "MSWP.IFRAME_LOAD_DONE",
	DesignerControlInitEvent = "MSWP.DESIGNER_CONTROL_INIT",
	DesignerControlInitErrorEvent = "MSWP.DESIGNER_CONTROL_INIT_ERROR",
	DesignerControlExecutionEvent = "MSWP.DESIGNER_CONTROL_EXECUTION_EVENT",
	DesignerControlExecutionErrorEvent = "MSWP.DESIGNER_CONTROL_EXECUTION_ERROR"
};

export enum RequiredCDSOpersForInit {
    DesignerConfig = "0",
    Templates = "1",
    WorkflowDefinition = "2"
};


