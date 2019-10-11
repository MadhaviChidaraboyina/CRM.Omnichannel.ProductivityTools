/// <reference path="../../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
declare namespace Microsoft.CIFramework {
    /**
     * All the message types/ APIs that are exposed to the widget
    */
    class MessageType {
        static setClickToAct: string;
        static getClickToAct: string;
        static searchAndOpenRecords: string;
        static openForm: string;
        static refreshForm: string;
        static createRecord: string;
        static deleteRecord: string;
        static retrieveRecord: string;
        static updateRecord: string;
        static search: string;
        static setMode: string;
        static setWidth: string;
        static getMode: string;
        static getEnvironment: string;
        static getWidth: string;
        static onClickToAct: string;
        static onModeChanged: string;
        static onSizeChanged: string;
        static onPageNavigate: string;
        static onSendKBArticle: string;
        static onSetPresence: string;
        static onSessionSwitched: string;
        static onSessionCreated: string;
        static onBeforeSessionClosed: string;
        static onSessionClosed: string;
        static getEntityMetadata: string;
        static notifyEvent: string;
        static softNotification: string;
        static broadCast: string;
        static internalCommunication: string;
        static notification: string;
        static transfer: string;
        static escalation: string;
        static renderSearchPage: string;
        static requestFocusSession: string;
        static getAllSessions: string;
        static getFocusedSession: string;
        static getSession: string;
        static canCreateSession: string;
        static createSession: string;
        static getFocusedTab: string;
        static getTabsByTagOrName: string;
        static refreshTab: string;
        static setSessionTitle: string;
        static setTabTitle: string;
        static createTab: string;
        static focusTab: string;
        static onMaxSessionsReached: string;
        static setAgentPresence: string;
        static initializeAgentPresenceList: string;
        static insertNotes: string;
        static openKBSearchControl: string;
        static onSetPresenceEvent: string;
        static hardNotification: string;
        static removeGenericHandler: string;
        static addGenericHandler: string;
        static setPosition: string;
        static isConsoleApp: string;
        static getPosition: string;
        static doSearch: string;
        static initializeCI: string;
        static loadProvider: string;
        static logErrorsAndReject: string;
        static initLogAnalytics: string;
        static logAnalyticsEvent: string;
        static updateContext: string;
    }
    /**
     * All constants for widget side logic should be placed here
    */
    class Constants {
        static value: string;
        static entityName: string;
        static entityId: string;
        static queryParameters: string;
        static message: string;
        static searchOnly: string;
        static entityFormOptions: string;
        static entityFormParameters: string;
        static Save: string;
        static ScriptIdAttributeName: string;
        static ScriptIdAttributeValue: string;
        static ScriptCRMUrlAttributeName: string;
        static nameParameter: string;
        static originURL: string;
        static CIClickToAct: string;
        static CISendKBArticle: string;
        static SetPresenceEvent: string;
        static widgetIframeId: string;
        static clickToActAttributeName: string;
        static enableAnalyticsAttributeName: string;
        static systemUserLogicalName: string;
        static templateTag: string;
        static appSelectorFieldName: string;
        static sortOrderFieldName: string;
        static roleSelectorFieldName: string;
        static providerOdataQuery: string;
        static providerNavigationProperty: string;
        static providerId: string;
        static landingUrl: string;
        static label: string;
        static providerLogicalName: string;
        static widgetHeight: string;
        static widgetWidth: string;
        static SizeChangeHandler: string;
        static ModeChangeHandler: string;
        static NavigationHandler: string;
        static AppName: string;
        static ClientUrl: string;
        static AppUrl: string;
        static Theme: string;
        static OrgLcid: string;
        static OrgUniqueName: string;
        static UserId: string;
        static UserLcid: string;
        static UserName: string;
        static UserRoles: string;
        static DefaultCountryCode: string;
        static MinimizedHeight: number;
        static DefaultFullWidth: number;
        static APIVersion: string;
        static SortOrder: string;
        static crmVersion: string;
        static CIFInitEvent: string;
        static Attributes: string;
        static UciLib: string;
        static OrgId: string;
        static trustedDomain: string;
        static eventType: string;
        static headerDataCIF: string;
        static bodyDataCIF: string;
        static notificationUXObject: string;
        static actionDisplayText: string;
        static actionReturnValue: string;
        static actionsCIF: string;
        static actionName: string;
        static CIFNotificationIcon: string;
        static actionColor: string;
        static actionImage: string;
        static Timeout: string;
        static Accept: string;
        static Reject: string;
        static actionType: string;
        static notificationType: string;
        static Timer: string;
        static NoOfNotifications: string;
        static SMS: string;
        static Chat: string;
        static Facebook: string;
        static Call: string;
        static Informational: string;
        static Failure: string;
        static Case: string;
        static SearchString: string;
        static input: string;
        static context: string;
        static customerName: string;
        static sessionId: string;
        static tabId: string;
        static messagesCount: string;
        static MaxSessions: number;
        static sessionColors: string[];
        static sessionPanel: string;
        static DEFAULT_WIDGET_WIDTH: number;
        static DEFAULT_SIDEPANEL_WIDTH: number;
        static DEFAULT_SIDEPANEL_WIDTH_WITH_BORDER: number;
        static presenceInfo: string;
        static presenceList: string;
        static activityType: string;
        static sessionDetails: string;
        static activityId: string;
        static Id: string;
        static notetext: string;
        static annotation: string;
        static entitySetName: string;
        static annotationId: string;
        static secRemaining: string;
        static CollapseFlapHandler: string;
        static newSessionId: string;
        static previousSessionId: string;
        static left: number;
        static right: number;
        static GLOBAL_PRESENCE_LIST: string;
        static presenceText: string;
        static presenceSelectControl: string;
        static OK_BUTTON_ID: string;
        static CANCEL_BUTTON_ID: string;
        static LAST_BUTTON_CLICKED: string;
        static SET_PRESENCE_MDD: string;
        static PRESENCE_SELECTED_VALUE: string;
        static CURRENT_PRESENCE_INFO: string;
        static PRESENCE_BUTTON_DATA_ID: string;
        static PRESENCE_LIST_ID: string;
        static sidePanelCollapsedState: number;
        static sidePanelExpandedState: number;
        static sidePanelHiddenState: number;
        static sessionNotValidErrorMessage: string;
        static cifSolVersion: string;
        static correlationId: string;
        static errorMessage: string;
        static functionName: string;
        static ErrorCode: string;
        static notificationTemplateIconAttribute: string;
        static notificationTemplateIconDefaultValue: string;
        static notificationTemplateTimeoutAttribute: string;
        static templateName: string;
        static notificationTemplate: string;
        static templateParameters: string;
        static notificationTemplateTimeoutDefaultValue: number;
        static templateNameResolver: string;
        static notificationResponse: string;
        static isDelete: string;
    }
    class AnalyticsConstants {
        static notificationResponseAction: string;
        static acceptNotificationResponse: string;
        static rejectNotificationResponse: string;
        static channelProviderName: string;
        static channelProviderId: string;
        static telemetryApiName: string;
        static telemetryInitApiName: string;
        static telemetryLogCustomEventApiName: string;
        static telemetryLogSystemEventApiName: string;
        static analyticsdata: string;
        static initLogAnalyticsEventName: string;
        static analyticsEventType: string;
        static analyticsEventName: string;
        static initAnalyticsPlatformEventName: string;
        static logAnalyticsPlatformEventName: string;
        static focussedSession: string;
        static clientSessionId: string;
        static enableAnalytics: string;
    }
    enum ErrorCode {
        Notes_Flap_Already_Expanded = 101,
    }
    enum EventType {
        SystemEvent = 0,
        CustomEvent = 1,
    }
    enum InternalEventName {
        NotificationReceived = 0,
        NotificationResponse = 1,
        NotificationTimedOut = 2,
        SessionStarted = 3,
        SessionInFocus = 4,
        SessionOutOfFocus = 5,
        SessionClosed = 6,
        NewTabOpened = 7,
    }
}
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
declare namespace Microsoft.CIFramework.Analytics {
    class InitData {
        conversation: Conversation;
    }
    class Conversation {
        conversationId: string;
        backendConversationId: string;
        channel: string;
        channelContext: string;
        regionData: string;
        providerId: string;
        externalProviderId: string;
        providerName: string;
        externalProviderName: string;
        accountId: string;
        externalAccountId: string;
        contactId: string;
        externalContactId: string;
        additionalData: string;
        externalCorrelationId: string;
        conversationTimestamp: string;
        externalConversationId: string;
        initialQueueName: string;
        primaryRelatedEntityName: string;
        primaryRelatedEntityRecordId: string;
        customData?: (CustomDataEntity)[] | null;
        session: Session;
    }
    class CustomDataEntity {
        attribute: string;
        value: string;
    }
    class Session {
        conversationId: string;
        sessionId: string;
        sessionName: string;
        clientSessionId: string;
        clientSessionName: string;
        sessionChannel: string;
        sessionCreationReason: string;
        sessionAdditionalData: string;
        externalCorrelationId: string;
        sessionCreatedTimestamp: string;
        sessionAgentAssignedTimestamp: string;
        sessionQueueAssignedTimestamp: string;
        queueId: string;
        queueName: string;
        customData?: (CustomDataEntity)[] | null;
        participants?: (ParticipantsEntity)[] | null;
    }
    class ParticipantsEntity {
        sessionId: string;
        conversationId: string;
        participantId: string;
        externalParticipantId: string;
        participantName: string;
        externalParticipantName: string;
        participantMode: string;
        participantType: string;
        participantAddedTimestamp: string;
        participantAssignReason: string;
        customData?: (CustomDataEntity)[] | null;
    }
    class EventData {
        conversationId: string;
        sessionId: string;
        clientSessionId: string;
        eventParticipantId: string;
        events?: (EventEntity)[] | null;
    }
    class EventEntity {
        kpiEventId: string;
        kpiEventName: string;
        kpiEventReason: string;
        eventTimestamp: string;
        entityName: string;
        entityRecordId: string;
        additionalData: string;
        knowledgeArticleId: string;
        knowledgeArticleName: string;
        oldPresence: string;
        newPresence: string;
        tabId: string;
        tabName: string;
        tabAction: string;
        notificationResponseAction: string;
        externalCorrelationId: string;
        customData?: (CustomDataEntity)[] | null;
    }
}
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
declare namespace Microsoft.CIFramework {
    /**
     * API to to check value of IsConsoleApp for a widget
     *
     * @param value. When set to 'true', then it's a console App.
     *
    */
    function isConsoleApp(): Promise<boolean>;
    /**
     * API to set/reset value of ClickToAct for a widget
     *
     * @param value. When set to 'true', invoke the registered 'onclicktoact' handler.
     *
    */
    function setClickToAct(value: boolean, correlationId?: string): Promise<void>;
    /**
     * API to insert notes control
     *
     * @param value. It's a string which contains session,activity details
     *
    */
    function insertNotes(entityName: string, entitySetName: string, entityId: string, annotationId: string, correlationId?: string): Promise<string>;
    /**
     * API to invoke toast popup widget
     *
     * @param value. It's a string which contains header,body of the popup
     *
    */
    function notifyEvent(input: any, correlationId?: string): Promise<string>;
    /**
     * API to open the create form for given entity with data passed in pre-populated
     * Invokes the api Xrm.Navigation.openForm(entityFormOptions, formParameters)
     * https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/clientapi/reference/xrm-navigation/openform
     *
     * @param entityFormOptions. A JSON string encoding the entityFormOptions parameter of
     * the openForm API
     * @param entityFormParameters. A JSON string encoding the formParameters parameter
     * of the openForm API
     *
     * returns an Object Promise: The returned Object has the same structure as the underlying Xrm.Navigation.openForm() API
    */
    function openForm(entityFormOptions: string, entityFormParameters?: string, correlationId?: string): Promise<string>;
    /**
     * API to refresh the main page if an entity form is currently opened
     *
     *
     * @param save. Optional boolean on whether to save the form on refresh
     * returns a boolean Promise
    */
    function refreshForm(save?: boolean, correlationId?: string): Promise<string>;
    /**
     * API to retrieve a given entity record based on entityId and oData query
     * Invokes the api Xrm.WebApi.retrieveRecord(entityName, entityId, options)
     * https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/clientapi/reference/xrm-webapi/retrieverecord
     *
     * @param entityName. The entity name to retrieve
     * @param entityId. The CRM record Id to retrieve
     *
     * @returns a map Promise: the result of the retrieve operation depending upon the query
    */
    function retrieveRecord(entityName: string, entityId: string, query?: string, correlationId?: string): Promise<string>;
    /**
     * API to update a given entity record based on entityId
     * Invokes the api Xrm.WebApi.updateRecord(entityName, entityId, data)
     * https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/clientapi/reference/xrm-webapi/updaterecord
     *
     * @param entityName. The entity name to retrieve
     * @param entityId. The CRM record Id to retrieve
     * @param data. A JSON string encoding the data parameter of the updateRecord XRM API
     *
     * @returns a map Promise: the result of the update operation
    */
    function updateRecord(entityName: string, entityId: string, data: string, correlationId?: string): Promise<string>;
    /**
     * API to create a new entity record based on passed data
     * Invokes the api Xrm.WebApi.createRecord(entityName, data)
     * https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/clientapi/reference/xrm-webapi/createrecord
     *
     * @param entityName. The entity name to retrieve
     * @param data. A JSON string encoding the data parameter of the createRecord XRM API
     *
     * @returns a map Promise: the result of the create operation
    */
    function createRecord(entityName: string, data: string, correlationId?: string): Promise<string>;
    /**
     * API to delete an entity record based on entityId
     * Invokes the api Xrm.WebApi.deleteRecord(entityName, entityId)
     * https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/clientapi/reference/xrm-webapi/deleterecord
     *
     * @param entityName. The entity name to delete
     * @param entityId. The record id to delete
     *
     * @returns a map Promise: the result of the delete operation
    */
    function deleteRecord(entityName: string, entityId: string, correlationid?: string): Promise<string>;
    /**
     * API to search records with respect to query parameters and open the respective record
     *
     * @param entityName. The name of the entity to search
     * @param queryParameter. An oData query string as supported by Dynamics CRM defining the search
     * @param searchOnly. When set to 'false', if the search record was a single record, open the record on the main UCI page
     * When set to 'true' return the search results but don't perform any navigation on the main page
     *
     * Returns a map Promise representing the search results as per the search query
    */
    function searchAndOpenRecords(entityName: string, queryParmeters: string, searchOnly: boolean, correlationid?: string): Promise<string>;
    /**
     * API to get the Panel State
     *
     * @returns a Promise: '0' for minimized and '1' for docked mode
    */
    function getMode(correlationid?: string): Promise<number>;
    /**
     * API to get the current main UCI page details
     *
     * @returns a Promise: map with available details of the current page
     *  'appid', 'pagetype', 'record-id' (if available), 'clientUrl', 'appUrl',
     * 'orgLcid', 'orgUniqueName', 'userId', 'userLcid', 'username', orgId
    */
    function getEnvironment(correlationId?: string): Promise<string>;
    /**
     * API to get the Panel width
     *
     * @returns a Promise with the panel width
    */
    function getWidth(correlationId?: string): Promise<number>;
    /**
     * API to call the openkbsearch control
     *
     * @params value. search string
    */
    function openKBSearchControl(value: string, correlationId?: string): Promise<boolean>;
    /**
     * API to set the Panel width
     *
     * @params value. The panel width to be set in pixels
    */
    function setWidth(value: number): Promise<void>;
    /**
     * API to set the Panel State
     *
     * @params value. The mode to set on the panel, '0' - minimized, '1' - docked, '2' - hidden
    */
    function setMode(value: number, correlationId?: string): Promise<void>;
    /**
     * API to check the whether clickToAct functionality is enabled or not
     *
     * @returns a boolean Promise on whether ClickToAct is currently enabled
    */
    function getClickToAct(correlationId?: string): Promise<boolean>;
    /**
     * API to add the subscriber for the named event
     *
     * @params eventName. The event for which to set the handler. The currently supported events are
     *  'onclicktoact' - when a click-to-act enabled field is clicked by the agent
     *  'onmodechanged' - when the panel mode is manually toggled between 'minimized' and 'docked'
     *  'onsizechanged' - when the panel size is manually changed by dragging
     *  'onpagenavigate' - triggered before a navigation event occurs on the main page
     *  'onsendkbarticle' - triggered when the agent clicks on the 'send KB Article' button on the KB control
     * @params func. The handler function to invoke on the event
     */
    function addHandler(eventName: string, handlerFunction: ((eventData: string) => Promise<Object>), correlationId?: string): Promise<{}>;
    /**
     * API to remove the subscriber
     */
    function removeHandler(eventName: string, handlerFunction: ((eventData: string) => Promise<Object>), correlationId?: string): Promise<{}>;
    /**
     * API to get the EntityMetadata
     * Invokes the API Xrm.Utility.getEntityMetadata(entityName, attributes)
     * https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/clientapi/reference/xrm-utility/getentitymetadata
     * @params entityName - Name of the Entity whose metadata is to be fetched
     * attributes - The attributes to get metadata for
     *
     * @returns a Promise: JSON String with available metadata of the current entity
    */
    function getEntityMetadata(entityName: string, attributes?: Array<string>, correlationId?: string): Promise<string>;
    /**
     * API to search based on the Search String
     * Invokes the API Xrm.Navigation.navigateTo(PageInput)
     * @param entityName -Name of the Entity for which the records are to be fetched
     * @param searchString - String based on which the search is to be made
     */
    function renderSearchPage(entityName: string, searchString: string, correlationId?: string): Promise<void>;
    /**
     * API to set the agent presence
     * Invokes the API setAgentPresence(presenceInfo)
     * @param presenceInfo - Details of the Presence to be set for the Agent

     * @returns a Promise: Boolean Status after setting the Agent Presence
     */
    function setAgentPresence(presenceInfo: string, correlationId?: string): Promise<boolean>;
    /**
     * API to get all Sessions
     */
    function getAllSessions(correlationId?: string): Promise<string[]>;
    /**
     * API to get focused Session
     */
    function getFocusedSession(correlationid?: string): Promise<string>;
    /**
     * API to get Session details
     */
    function getSession(sessionId: string, correlationid?: string): Promise<any>;
    /**
     * API to check if a new Session can be created
     */
    function canCreateSession(correlationId?: string): Promise<boolean>;
    /**
     * API to create Session
     */
    function createSession(input: any, correlationId?: string): Promise<string>;
    /**
     * API to notify incoming on an invisible Session
     */
    function requestFocusSession(sessionId: string, messagesCount?: number, correlationId?: string): Promise<string>;
    /**
     * API to get the focused tab in focused Session
     */
    function getFocusedTab(correlationId?: string): Promise<string>;
    /**
     * API to get the focused tab in focused Session
     */
    function getTabs(name: string, tag?: string, correlationId?: string): Promise<string[]>;
    function refreshTab(tabId: string, correlationId?: string): Promise<void>;
    function setSessionTitle(input: any, correlationId?: string): Promise<string>;
    function setTabTitle(tabId: string, input: any, correlationId?: string): Promise<string>;
    /**
     * API to create a Tab in focused Session
     */
    function createTab(input: any, correlationId?: string): Promise<string>;
    /**
     * API to focus a Tab in focused Session
     */
    function focusTab(tabId: string, correlationId?: string): Promise<string>;
    /**
     * API to set all the presences
    * Invokes the API initializeAgentPresenceList(presenceList)
    * @param presenceList - Array containing all the available Presences

    * @returns a Promise: Boolean Status after setting the list of presences
    */
    function initializeAgentPresenceList(presenceList: any, correlationId?: string): Promise<boolean>;
    /**
     * API to initialize the CIF Log Analytics session
    * @param data - Object containing the init data
    * @returns a Promise: JSON String with status message
    */
    function initLogAnalytics(data: any, correlationId?: string): Promise<string>;
    /**
     * API to log a custom analytics event
    * @param data - Object containing the event data
    * @returns a Promise: JSON String with status message
    */
    function logAnalyticsEvent(data: any, eventName: string, correlationId?: string): Promise<string>;
    /**
     * API to set automation dictionary
    * Invokes the API updateContext
    * @param input - List of parameters to be updated in form of json input, array of strings for deleting parameters
    * @returns a Promise with template parameters
    */
    function updateContext(input: any, sessionId?: string, isDelete?: boolean, correlationId?: string): Promise<any>;
}
