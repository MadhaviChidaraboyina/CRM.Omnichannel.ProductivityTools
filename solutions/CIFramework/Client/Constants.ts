/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

namespace Microsoft.CIFramework
{
	/**
	 * All the message types/ APIs that are exposed to the widget
	*/
	export namespace MessageType
	{
		export const setClickToAct = "setclicktoact";
		export const getClickToAct = "getclicktoact";
		export const searchAndOpenRecords = "searchandopenrecords";
		export const openForm = "openform";
		export const createRecord = "createrecord";
		export const deleteRecord = "deleterecord";
		export const retrieveRecord = "retrieverecord";
		export const updateRecord = "updaterecord";
		export const search = "search";
		export const setMode = "setmode";
		export const setWidth = "setwidth";
		export const getMode = "getmode";
		export const getEnvironment = "getenvironment";
		export const getWidth = "getwidth";
		export const onClickToAct = "onclicktoact";
		export const onModeChanged = "onmodechanged";
		export const onSizeChanged = "onsizechanged";
		export const onPageNavigate = "onpagenavigate";
		export const onSendKBArticle = "onsendkbarticle";
		export const onUISessionVisibilityChanged = "onUISessionVisibilityChanged";
		export const getEntityMetadata = "getEntityMetadata";
		export const notifyEvent = "notifyEvent";
		export const softNotification = "softNotification";
		export const broadCast = "broadCast";
		export const internalCommunication = "internalCommunication";
		export const notification = "notification";
		export const transfer = "transfer";
		export const escalation = "escalation";
		export const renderSearchPage = "renderSearchPage";
		export const startUISession = "startUISession";
		export const switchUISession = "switchUISession";
		export const endUISession = "endUISession";
		export const onMaxUISessionsReached = "onMaxUISessionsReached";
		export const setAgentPresence = "setAgentPresence";
		export const setAllPresence = "setAllPresence";
		export const insertNotes = "insertNotes";
	}

	/**
	 * All constants for widget side logic should be placed here
	*/
	export namespace Constants
	{
		export const value: string = "value";
		export const entityName: string = "entityName";
		export const entityId: string = "entityId";
		export const queryParameters: string = "queryParameters";
		export const message: string = "message";
		export const searchOnly = "searchOnly";
		export const entityFormOptions = "entityFormOptions";
		export const entityFormParameters = "entityFormParameters";
		export const ScriptIdAttributeName = "data-cifid";
		export const ScriptIdAttributeValue = "CIFMainLibrary";
		export const ScriptCRMUrlAttributeName = "data-crmurl";
		export const name = "msdyn_name";

		export const originURL = "originURL";
		export const CIClickToAct = "CIClickToAct";
		export const CISendKBArticle = "KMClickToSend";
		export const widgetIframeId = "SidePanelIFrame";
		export const clickToActAttributeName = "msdyn_clicktoact";
		export const systemUserLogicalName = "systemuser";
		export const appSelectorFieldName = "msdyn_appselector";
		export const sortOrderFieldName = "msdyn_sortorder";
		export const roleSelectorFieldName = "msdyn_roleselector";
		export const providerOdataQuery = "?$select=fullname&$expand=msdyn_ciprovider_systemuser_membership($filter=statecode eq 0;$orderby=msdyn_sortorder asc,createdon asc;$top={0})";
		export const providerNavigationProperty = "msdyn_ciprovider_systemuser_membership";
		export const providerId = "msdyn_ciproviderid";
		export const landingUrl = "msdyn_landingurl";
		export const label = "msdyn_label";
		export const providerLogicalName = "msdyn_ciprovider";
		export const widgetHeight = "msdyn_widgetheight";
		export const widgetWidth = "msdyn_widgetwidth";
		export const SizeChangeHandler = "sizeChangeHandler";
		export const ModeChangeHandler = "modeChangedHandler";
		export const NavigationHandler = "NavigationHandler";
		export const AppName = "appName";
		export const ClientUrl = "clientUrl";
		export const AppUrl = "appUrl";
		export const Theme = "themeName";
		export const OrgLcid = "orgLcid";
		export const OrgUniqueName = "orgUniqueName";
		export const UserId = "userId";
		export const UserLcid = "userLcid";
		export const UserName = "username";
		export const DefaultCountryCode = "defaultCountryCode";
		export const MinimizedHeight = 34;
		export const DefaultFullWidth = 100;
		export const APIVersion = "msdyn_ciproviderapiversion";
		export const SortOrder = "msdyn_sortorder";
		export const crmVersion = "crmVersion";
		export const CIFInitEvent = "CIFInitDone";
		export const Attributes = "attributes";
		export const UciLib = "ucilib";
		export const OrgId = "orgId";
		export const trustedDomain = "msdyn_trustedDomain";
		export const eventType: string = "eventType";
		export const headerDataCIF: string = "headerDataCIF";
		export const bodyDataCIF: string = "bodyDataCIF";
		export const notificationUXObject: string = "notificationUXObject";
		export const actionDisplayText = "actionDisplayText";
		export const actionReturnValue = "actionReturnValue";
		export const actionsCIF = "actions";
		export const actionName = "actionName";
		export const CIFNotificationIcon = "CIFNotificationIcon";
		export const actionColor = "actionColor";
		export const actionImage = "actionImage";
		export const Timeout = "Timeout";
		export const Accept = "Accept";
		export const Reject = "Reject";
		export const actionType = "actionType";
		export const notificationType = "notificationType"; 
		export const Timer = "Timer";
		export const NoOfNotifications = "NoOfNotifications";
		export const SMS = "SMS";
		export const Chat = "Chat";
		export const SearchString = "searchString";
		export const context = "context";
		export const initials = "initials";
		export const sessionId = "sessionId";
		export const MaxUISessions = 5;
		export const sessionColors = ["#2A757D", "#464775", "#9E2069", "#427825", "#511466", "#365C99", "#9C4141", "#84612A"];
		export const activeSessionColors = ["#D7F5F3", "#EBECF7", "#FFE5F5", "#E0F5D5", "#F7E6FC", "#D9E8FF", "#FFE3E3", "#F2EBDF"];
		export const DEFAULT_WIDGET_WIDTH = 378;
		export const presenceInfo = "presenceInfo";
		export const presenceList = "presenceList";
		export const activityType = "activityType";
		export const sessionDetails = "sessionDetails";
		export const activityId = "activityId";
		export const Id = "id";
		export const notetext = "notetext";
		export const annotation = "annotation";
		export const entitySetName = "entitySetName";
	}

	/**
	 * utility func to check whether an object is null or undefined
	*/
	export function isNullOrUndefined(obj: any)
	{
		return (obj == null || typeof obj === "undefined");
	}
}