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
		public static onUISessionVisibilityChanged = "onUISessionVisibilityChanged";
		public static getEntityMetadata = "getEntityMetadata";
		public static notifyEvent = "notifyEvent";
		public static softNotification = "softNotification";
		public static broadCast = "broadCast";
		public static internalCommunication = "internalCommunication";
		public static notification = "notification";
		public static transfer = "transfer";
		public static escalation = "escalation";
		public static renderSearchPage = "renderSearchPage";
		public static startUISession = "startUISession";
		public static switchUISession = "switchUISession";
		public static endUISession = "endUISession";
		public static onMaxUISessionsReached = "onMaxUISessionsReached";
		public static setAgentPresence = "setAgentPresence";
		public static setAllPresence = "setAllPresence";
		public static insertNotes = "insertNotes";
		public static openKBSearchControl = "openkbsearchcontrol";
		public static onSetPresenceEvent = "setPresenceEvent";
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
		public static ScriptIdAttributeName = "data-cifid";
		public static ScriptIdAttributeValue = "CIFMainLibrary";
		public static ScriptCRMUrlAttributeName = "data-crmurl";
		public static name = "msdyn_name";

		public static originURL = "originURL";
		public static CIClickToAct = "CIClickToAct";
		public static CISendKBArticle = "KMClickToSend";
		public static SetPresenceEvent = "setPresenceEvent";
		public static widgetIframeId = "SidePanelIFrame";
		public static clickToActAttributeName = "msdyn_clicktoact";
		public static systemUserLogicalName = "systemuser";
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
		public static trustedDomain = "msdyn_trustedDomain";
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
		public static SMS = "SMS";
		public static Chat = "Chat";
		public static SearchString = "searchString";
		public static context = "context";
		public static initials = "initials";
		public static sessionId = "sessionId";
		public static MaxUISessions = 5;
		public static sessionColors = ["#2A757D", "#464775", "#9E2069", "#427825", "#511466", "#365C99", "#9C4141", "#84612A"];
		public static activeSessionColors = ["#D7F5F3", "#EBECF7", "#FFE5F5", "#E0F5D5", "#F7E6FC", "#D9E8FF", "#FFE3E3", "#F2EBDF"];
		public static DEFAULT_WIDGET_WIDTH = 378;
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
	}

	/**
	 * utility func to check whether an object is null or undefined
	*/
	/** @internal */
	export function isNullOrUndefined(obj: any)
	{
		return (obj == null || typeof obj === "undefined");
	}
}