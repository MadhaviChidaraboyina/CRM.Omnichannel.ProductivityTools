/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

namespace Microsoft.CIFramework
{
	/**
	 * All the message types/ APIs that are exposed to the widget
	*/
	export class MessageType
	{
		public static setClickToAct = "setclicktoact";
		public static getClickToAct = "getclicktoact";
		public static searchAndOpenRecords = "searchandopenrecords";
		public static openForm = "openform";
		public static refreshForm = "refreshform";
		public static createRecord = "createrecord";
		public static deleteRecord = "deleterecord";
		public static retrieveRecord = "retrieverecord";
		public static updateRecord = "updaterecord";
		public static search = "search";
		public static setMode = "setmode";
		public static setWidth = "setwidth";
		public static getMode = "getmode";
		public static getEnvironment =  "getenvironment";
		public static getWidth = "getwidth";
		public static onClickToAct = "onclicktoact";
		public static onModeChanged = "onmodechanged";
		public static onSizeChanged = "onsizechanged";
		public static onPageNavigate = "onpagenavigate";
		public static onSendKBArticle = "onsendkbarticle";
		public static onSetPresence = "onSetPresence";
		public static onSessionSwitched = "onSessionSwitched";
		public static onSessionCreated = "onSessionCreated";
		public static onBeforeSessionClosed = "onBeforeSessionClosed";
		public static onSessionClosed = "onSessionClosed";
		public static getEntityMetadata = "getEntityMetadata";
		public static notifyEvent = "notifyEvent";
		public static softNotification = "softNotification";
		public static broadCast = "broadCast";
		public static internalCommunication = "internalCommunication";
		public static notification = "notification";
		public static transfer = "transfer";
		public static escalation = "escalation";
		public static renderSearchPage = "renderSearchPage";
		public static requestFocusSession = "requestFocusSession";
		public static getAllSessions = "getAllSessions";
		public static getFocusedSession = "getFocusedSession";
		public static getSession = "getSession";
		public static canCreateSession = "canCreateSession";
		public static createSession = "createSession";
		public static getFocusedTab = "getFocusedTab";
		public static getTabsByTagOrName = "getTabsByTagOrName";
		public static refreshTab = "refreshTab";
		public static setSessionTitle = "setSessionTitle";
		public static setTabTitle = "setTabTitle";
		public static createTab = "createTab";
		public static focusTab = "focusTab";
		public static onMaxSessionsReached = "onMaxSessionsReached";
		public static setAgentPresence = "setAgentPresence";
		public static initializeAgentPresenceList = "initializeAgentPresenceList";
		public static insertNotes = "insertNotes";
		public static openKBSearchControl = "openkbsearchcontrol";
		public static onSetPresenceEvent = "setPresenceEvent";
		public static hardNotification = "hardNotification";
		public static removeGenericHandler = "removeGenericHandler";
		public static addGenericHandler = "addGenericHandler";
		public static setPosition = "setPosition";
		public static isConsoleApp = "isConsoleApp";
		public static getPosition = "getPosition";
		public static doSearch = "doSearch";
		public static initializeCI = "initializeCI";
		public static loadProvider = "loadProvider";
		public static logErrorsAndReject = "logErrorsAndReject";
		public static initLogAnalytics = "initLogAnalytics";
		public static logAnalyticsEvent = "logAnalyticsEvent";
		public static updateContext = "updateContext";
	}

	/**
	 * All constants for widget side logic should be placed here
	*/
	export class Constants
	{
		public static value: string = "value";
		public static entityName: string = "entityName";
		public static entityId: string = "entityId";
		public static queryParameters: string = "queryParameters";
		public static message: string = "message";
		public static searchOnly = "searchOnly";
		public static entityFormOptions = "entityFormOptions";
		public static entityFormParameters = "entityFormParameters";
		public static Save = "save";
		public static ScriptIdAttributeName = "data-cifid";
		public static ScriptIdAttributeValue = "CIFMainLibrary";
		public static ScriptCRMUrlAttributeName = "data-crmurl";
		public static nameParameter = "msdyn_name";
		public static originURL = "originURL";
		public static CIClickToAct = "CIClickToAct";
		public static CISendKBArticle = "KMClickToSend";
		public static SetPresenceEvent = "setPresenceEvent";
		public static widgetIframeId = "SidePanelIFrame";
		public static clickToActAttributeName = "msdyn_clicktoact";
		public static enableAnalyticsAttributeName = "msdyn_enableanalytics";
		public static systemUserLogicalName = "systemuser";
		public static templateTag = "templateTag";
		public static appSelectorFieldName = "msdyn_appselector";
		public static sortOrderFieldName = "msdyn_sortorder";
		public static roleSelectorFieldName = "msdyn_roleselector";
		public static providerOdataQuery = "?$select=fullname&$expand=msdyn_ciprovider_systemuser_membership($filter=statecode eq 0;$orderby=msdyn_sortorder asc,createdon asc;$top={0})";
		public static providerNavigationProperty = "msdyn_ciprovider_systemuser_membership";
		public static providerId = "msdyn_ciproviderid";
		public static landingUrl = "msdyn_landingurl";
		public static label = "msdyn_label";
		public static providerLogicalName = "msdyn_ciprovider";
		public static widgetHeight = "msdyn_widgetheight";
		public static widgetWidth = "msdyn_widgetwidth";
		public static SizeChangeHandler = "sizeChangeHandler";
		public static ModeChangeHandler = "modeChangedHandler";
		public static NavigationHandler = "NavigationHandler";
		public static AppName = "appName";
		public static ClientUrl = "clientUrl";
		public static AppUrl = "appUrl";
		public static Theme = "themeName";
		public static OrgLcid = "orgLcid";
		public static OrgUniqueName = "orgUniqueName";
		public static UserId = "userId";
		public static UserLcid = "userLcid";
		public static UserName = "username";
		public static UserRoles = "userRoles";
		public static DefaultCountryCode = "defaultCountryCode";
		public static MinimizedHeight = 34;
		public static DefaultFullWidth = 100;
		public static APIVersion = "msdyn_ciproviderapiversion";
		public static SortOrder = "msdyn_sortorder";
		public static crmVersion = "crmVersion";
		public static CIFInitEvent = "CIFInitDone";
		public static Attributes = "attributes";
		public static UciLib = "ucilib";
		public static OrgId = "orgId";
		public static trustedDomain = "msdyn_trusteddomain";
		public static eventType: string = "eventType";
		public static headerDataCIF: string = "headerDataCIF";
		public static bodyDataCIF: string = "bodyDataCIF";
		public static notificationUXObject: string = "notificationUXObject";
		public static actionDisplayText = "actionDisplayText";
		public static actionReturnValue = "actionReturnValue";
		public static actionsCIF = "actions";
		public static actionName = "actionName";
		public static CIFNotificationIcon = "CIFNotificationIcon";
		public static actionColor = "actionColor";
		public static actionImage = "actionImage";
		public static Timeout = "Timeout";
		public static Accept = "Accept";
		public static Reject = "Reject";
		public static actionType = "actionType";
		public static notificationType = "notificationType"; 
		public static Timer = "Timer";
		public static NoOfNotifications = "NoOfNotifications";
		public static SMS = "sms";
		public static Chat = "chat";
		public static Facebook = "facebook";
		public static Call = "call";
		public static Informational = "informational";
		public static Failure = "failure";
		public static Case = "case";
		public static SearchString = "searchString";
		public static input = "input";
		public static context = "context";
		public static customerName = "customerName";
		public static sessionId = "sessionId";
		public static tabId = "tabId";
		public static messagesCount = "messagesCount";
		public static MaxSessions = 5;
		public static sessionColors = ["#2A757D", "#70278B", "#FF8C00", "#427825", "#B4009E", "#B4A0FF"];
		public static sessionPanel = "sessionPanel";
		public static DEFAULT_WIDGET_WIDTH = 378;
		public static DEFAULT_SIDEPANEL_WIDTH = 34;
		public static DEFAULT_SIDEPANEL_WIDTH_WITH_BORDER = 36;
		public static presenceInfo = "presenceInfo";
		public static presenceList = "presenceList";
		public static activityType = "activityType";
		public static sessionDetails = "sessionDetails";
		public static activityId = "activityId";
		public static Id = "id";
		public static notetext = "notetext";
		public static annotation = "annotation";
		public static entitySetName = "entitySetName";
		public static annotationId = "annotationid";
		public static secRemaining = "secs remaining";
		public static CollapseFlapHandler = "collapseFlapHandler";
		public static newSessionId = "newSessionId";
		public static previousSessionId = "previousSessionId";
		public static left = 1;
		public static right = 2;
		public static GLOBAL_PRESENCE_LIST = "GlobalToolBar_PresenceList";
		public static presenceText = "presenceText";
		public static presenceSelectControl = "presence_id";
		public static OK_BUTTON_ID = "ok_id";
		public static CANCEL_BUTTON_ID = "cancel_id";
		public static LAST_BUTTON_CLICKED = "param_lastButtonClicked";
		public static SET_PRESENCE_MDD = "SetAgentPresenceMDD";
		public static PRESENCE_SELECTED_VALUE = "param_selectedValue";
		public static CURRENT_PRESENCE_INFO = "GlobalToolBar_CurrentPresenceInfo";
		public static PRESENCE_BUTTON_DATA_ID = "[data-id='Microsoft.Dynamics.Service.CIFramework.Presence.Dialog']";
		public static PRESENCE_LIST_ID = "[id='|NoRelationship||Microsoft.Dynamics.Service.CIFramework.Presence.DialogCommand5crm_header_global']"
		public static sidePanelCollapsedState = 0;
		public static sidePanelExpandedState = 1;
		public static sidePanelHiddenState = 2;
		public static sessionNotValidErrorMessage = "Focused session is neither the default session nor it belongs to the provider";
		public static cifSolVersion = "msdyn_cifsolversion";
		public static correlationId = "correlationId";
		public static errorMessage = "errorMsg";
		public static functionName = "functName";
		public static ErrorCode = "errorCode";
		public static notificationTemplateIconAttribute = "msdyn_icon";
		public static notificationTemplateIconDefaultValue = "/webresources/msdyn_chat_icon_zfp.svg";
		public static notificationTemplateTimeoutAttribute = "msdyn_timeout"
		public static templateName = "templateName";
		public static notificationTemplate = "notificationTemplate";
		public static templateParameters = "templateParameters";
		public static notificationTemplateTimeoutDefaultValue = 120;
		public static templateNameResolver = "templateNameResolver";
		public static notificationResponse = "NotificationResponse";
		public static isDelete = "isDelete";
	}

	export class AnalyticsConstants {
		public static notificationResponseAction = "notificationResponseAction";
		public static acceptNotificationResponse = "accepted";
		public static rejectNotificationResponse = "rejected";
		public static channelProviderName = "providerName";
		public static channelProviderId = "providerId";
		public static telemetryApiName = "telemetryAPIName";
		public static telemetryInitApiName = "InitCIFAnalytics";
		public static telemetryLogCustomEventApiName = "LogCustomEvent";
		public static telemetryLogSystemEventApiName = "LogSystemEvent";
		public static analyticsdata = "analyticsData";
		public static initLogAnalyticsEventName = "initAnalytics";
		public static analyticsEventType = "analyticsEventtype";
		public static analyticsEventName = "analyticsEventname";
		public static initAnalyticsPlatformEventName = "initCIFAnalytics";
		public static logAnalyticsPlatformEventName = "logCIFAnalytics";
		public static focussedSession = "focussedSession";
		public static clientSessionId = "clientSessionId";
		public static enableAnalytics = "enableAnalytics";
	}

	export enum ErrorCode {
		Notes_Flap_Already_Expanded = 101 // Notes flap is already expanded.
	}

	export enum EventType {
		SystemEvent,
		CustomEvent,
	}

	export enum InternalEventName {
		NotificationReceived,
		NotificationResponse,
		NotificationTimedOut,
		SessionStarted,
		SessionSwitched,
		SessionClosed,
		NewTabOpened
	}
}