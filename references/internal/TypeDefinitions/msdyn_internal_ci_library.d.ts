/// <reference path="XrmClientApi.d.ts" />
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * Constants for CIFramework.
 */
declare namespace Microsoft.CIFramework.postMessageNamespace {
    /**
     * retry count for post message function
     */
    const retryCount = 3;
    /**
     * wait time for receiving a response from the listener window, before we reject the promise
     */
    const promiseTimeOut = 10000;
    /**
     * String for correlationId to be used as a key.
     */
    const messageCorrelationId = "messageCorrelationId";
    /**
     * String to represent a successful result.
     */
    const messageSuccess = "success";
    const messageFailure = "failure";
    /**
     * String to represent a web-socket message.
     */
    const messageConstant = "message";
    const originURL = "originURL";
    const message = "message";
    /**
    * utility func to create a promise and reject it with the passed error message
    */
    function rejectWithErrorMessage(errorMessage: string): Promise<never>;
}
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
    }
    enum ErrorCode {
        Notes_Flap_Already_Expanded = 101,
    }
}
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
declare namespace Microsoft.CIFramework.Internal {
    interface AppConfig {
        resolveTitle(input: any): Promise<string>;
    }
    interface SessionConfig extends AppConfig {
        panelState: number;
    }
    class SessionInfo {
        private _associatedProvider;
        private _tabsByTag;
        private _tabsByName;
        private _tabConfigs;
        private _sessionConfig;
        private _templateParams;
        constructor(provider: CIProvider, config?: SessionConfig, templateParams?: any);
        readonly templateParams: any;
        readonly sessionConfig: any;
        readonly associatedProvider: CIProvider;
        setTemplateParams(input: any): void;
        setTab(tabConfig: AppConfig, tabid: string, name: string, tags?: string[]): void;
        removeTab(tabid: string): void;
        getTabsByTag(tag: string): string[];
        getTabsByName(name: string): string[];
        resolveTitle(input: any): Promise<string>;
        resolveTabTitle(tabid: string, input: any): Promise<string>;
        getPanelState(): number;
    }
    abstract class SessionManager {
        protected sessions: Map<string, SessionInfo>;
        constructor();
        getProvider(sessionId: string): CIProvider;
        associateTabWithSession(sessionId: string, tabId: string, tabConfig: AppConfig, name: string, tags?: string[]): void;
        disassociateTab(sessionId: string, tabId: string): void;
        getTabsByTagOrName(sessionId: string, name: string, tag: string): string[];
        getPanelState(sessionId: string): number;
        getTabsByName(sessionId: string, name: string): string[];
        abstract getFocusedSession(telemetryData?: Object): string;
        abstract isDefaultSession(sessionId: string, telemetryData?: Object): boolean;
        abstract canCreateSession(telemetryData?: Object): boolean;
        abstract createSession(provider: CIProvider, input: any, context: any, customerName: string, telemetryData?: Object, appId?: any, cifVersion?: any): Promise<string>;
        abstract focusSession(sessionId: string): Promise<void>;
        abstract requestFocusSession(sessionId: string, messagesCount: number, telemetryData?: Object): Promise<void>;
        abstract closeSession(sessionId: string): Promise<boolean>;
        abstract getFocusedTab(sessionId: string, telemetryData?: Object): string;
        abstract createTab(sessionId: string, input: any, telemetryData?: Object, appId?: any, cifVersion?: any): Promise<string>;
        abstract createTabInternal(sessionId: string, input: any): Promise<string>;
        abstract focusTab(sessionId: string, tabId: string, telemetryData?: Object): Promise<void>;
        abstract closeTab(sessionId: string, tabId: string): Promise<boolean>;
        abstract refreshTab(sessionId: string, tabId: string): Promise<boolean>;
        setSessionTitle(sessionId: string, input: any): Promise<string>;
        setTabTitle(sessionId: string, tabId: string, input: any): Promise<string>;
        setTabTitleInternal(sessionId: string, tabId: string, title: string): Promise<string>;
    }
    function GetSessionManager(clientType: string): SessionManager;
}
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
declare namespace Microsoft.CIFramework.Internal {
    class ConsoleAppSessionManager extends SessionManager {
        sessionSwitchHandlerID: string;
        sessionCloseHandlerID: string;
        sessionCreateHandlerID: string;
        constructor();
        /**
        * The handler called by the client for SessionSwitched event. The client is expected
        * to pass a SessionEventArguments object with details of the event. This handler will pass the
        * sessionSwitch message to the widget as an event resulting in the registered widget-side
        * handler, if any, being invoked
        * @param event event detail will be set to a map {"oldSessionId": oldSessionId, "newSessionId": newSessionId} where
        * 'oldSessionId is the ID of the Session which is currently focussed and the newSessionId is the ID of the Session
        * which is to be focussed now
        */
        onSessionSwitched(event: any): void;
        /**
         * The handler called by the client for SessionClosed event. The client is expected
        * to pass a SessionEventArguments object with details of the event. This handler will pass the
        * sessionClosed message to the widget as an event resulting in the registered widget-side
        * handler, if any, being invoked.
         * @param event event detail will be set to a map {"sessionId": sessionId} where sessionId is the ID
         * of the session which is being closed
         */
        onSessionClosed(event: any): void;
        /**
         * The handler called by the client for SessionCreated event. The client is expected
        * to pass a SessionEventArguments object with details of the event. This handler will collapse
        * the SidePanel which will be expanded on createSession for provider based sessions.
         * @param event event detail will be set to a map {"sessionId": sessionId} where sessionId is the ID
         * of the session which was created
         */
        onSessionCreated(event: any): void;
        getFocusedSession(telemetryData?: Object): string;
        isDefaultSession(sessionId: string, telemetryData?: Object): boolean;
        canCreateSession(telemetryData?: Object): boolean;
        createSession(provider: CIProvider, input: any, context: any, customerName: string, telemetryData?: Object, appId?: any, cifVersion?: any, correlationId?: string): Promise<string>;
        requestFocusSession(sessionId: string, messagesCount: number, telemetryData?: Object): Promise<void>;
        focusSession(sessionId: string): Promise<void>;
        closeSession(sessionId: string): Promise<boolean>;
        getFocusedTab(sessionId: string, telemetryData?: Object): string;
        createTab(sessionId: string, input: any, telemetryData?: Object, appId?: any, cifVersion?: any, correlationId?: string): Promise<string>;
        createTabInternal(sessionId: string, input: any, telemetryData?: Object): Promise<string>;
        focusTab(sessionId: string, tabId: string, telemetryData?: Object): Promise<void>;
        closeTab(sessionId: string, tabId: string): Promise<boolean>;
        refreshTab(sessionId: string, tabId: string): Promise<boolean>;
    }
}
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
import Internal = Microsoft.CIFramework.Internal;
declare namespace Microsoft.CIFramework.External {
    interface CIFExternalUtility {
        getTemplateForSession(sessionId?: string): any;
        getSessionTemplateParams(sessionId?: string): any;
        setSessionTemplateParams(data: any, sessionId?: string): void;
        resolveTemplateString(input: string, templateParams: any, scope: string): Promise<string>;
    }
    class CIFExternalUtilityImpl extends Internal.ConsoleAppSessionManager implements CIFExternalUtility {
        getTemplateForSession(sessionId?: string): any;
        getSessionTemplateParams(sessionId?: string): any;
        /**
        * API to set key/value pairs in templateparams dictionary
        * @param input set of key/value pairs
        * returns an Object Promise: The returned Object has the same structure as the underlying Xrm.Navigation.openForm() API
        */
        setSessionTemplateParams(input: any, sessionId?: string): any;
        resolveTemplateString(input: string, templateParams: any, scope: string): Promise<string>;
    }
}
declare namespace Microsoft.CIFramework.Internal {
    interface WidgetContainer {
        setHeight(height: number): boolean;
        setVisibility(visibility: boolean): boolean;
        setWidth(height: number): boolean;
        getContentWindow(): Window;
        setProvider(provider: CIProvider): void;
    }
    class WidgetIFrameWrapper implements WidgetContainer {
        hostIFrame: HTMLIFrameElement;
        provider: CIProvider;
        visibility: boolean;
        preservedHeight: number;
        preservedWidth: number;
        constructor(hostIFrame: HTMLIFrameElement);
        setVisibility(visibility: boolean): boolean;
        setHeight(height: number): boolean;
        private static getDefaultWidth();
        setWidth(width: number): boolean;
        getContentWindow(): Window;
        setProvider(provider: CIProvider): void;
    }
}
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * Wrapper for postMessage. This wrapper will be loaded on both widget and CI domains,
 * and will be the common messaging layer between these two. Without this layer,
 * postMessage acts as a common messaging API between the widget and CI.
 * This wrapper just wraps postMessage with more useful functionality of promises.

   Exposes a function postMsg that accepts a target window, a message and an origin
 */
/**
 * Creates a new type for mapping an open promise representing a postMessage call, against a correlation Id sent to the message receiver.
 */
declare namespace Microsoft.CIFramework.postMessageNamespace {
    type IDeferred = {
        timerId: number;
        promise: Promise<Map<string, any>>;
        resolve: <T>(value?: T | Promise<T>) => void;
        reject: <T>(error?: T) => void;
    };
    type Handler = (dictionary: Map<string, any> | string) => Promise<Map<string, any>>;
    /**
     * Creates a new request message type, for message exchange between CI and any widget
     */
    interface IExternalRequestMessageType {
        messageType: string;
        messageData: Map<string, any> | string;
    }
    /**
     * Creates a new response message type, for message exchange between CI and any widget
     */
    interface IExternalResponseMessageType {
        messageOutcome: string;
        messageData: Map<string, any>;
    }
    class postMsgWrapper {
        /**
         * Creates and loads an instance of the wrapper on the CI or widget domain, wherever it is loaded
         */
        constructor(listenerWindow?: Window, domains?: string[], handlers?: Map<string, Set<Handler>>, responseTargetWindow?: Window);
        /**
         * Collection for promises created on the caller (widget/CI), that represent open requests on the receiver (CI/widget)
         */
        pendingPromises: Map<string, IDeferred>;
        listInclusionListedDomains: string[];
        messageHandlers: Map<string, Set<Handler>>;
        responseTargetWindow: Window;
        /**
         * Function for add handlers separate from the constructor
         */
        addHandler(messageType: string, handler: Handler): void;
        /**
         * Function for getting handlers registered for an event
         */
        getHandlers(messageType: string): Set<Handler>;
        /**
         * Function for remove a particular handler
         */
        removeHandler(messageType: string, handler: Handler): void;
        /**
         * Create a new correlation Id to map a promise against it, on the caller side (widget/CI)
         */
        getCorrelationId(): string;
        private createDeferred(noTimeout?);
        /**
         * removes the entry from pendingPromises, given the value for that entry.
         * @param deferred deferred object based on which entry should be deleted.
         */
        private removePromise(deferred);
        /**
         * Function on caller (widget/CI) to add a new correlation Id to a message, map a new promise against it and post the message to the receiver (CI/widget)
         */
        postMsg(receivingWindow: Window, message: IExternalRequestMessageType, targetOrigin: string, isEventFlag: boolean, noTimeout?: boolean): Promise<Map<string, any>>;
        /**
         * Internal function that post messages to the window with retry logic
         * @param receivingWindow window to post message to
         * @param message message to post
         * @param targetOrigin target url
         * @param deferred deferred object related with this message
         */
        private postMsgInternal(receivingWindow, message, targetOrigin, deferred?);
        /**
         * Function on receiver (widget/CI) to send back a response against an open request to the caller (CI/widget)
         */
        private sendResponseMsg<T>(receivingWindow, message, targetOrigin);
        /**
         * Common function on caller and receiver to process requests and responses
         */
        private processMessage(event);
    }
}
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
declare namespace Microsoft.CIFramework.Internal {
    /**
     * type defined for storing all global information at one place.
    */
    type IState = {
        /**
         * this will refer to the actual IClient implementation based on the type of client CI library is loaded on
        */
        client: IClient;
        /**
         *  Information about sessions
        */
        sessionManager: SessionManager;
        /**
         *  Information about providers
        */
        providerManager: ProviderManager;
        /**
         * Post message wrapper object
         */
        messageLibrary: postMessageNamespace.postMsgWrapper;
    };
    class ProviderManager {
        ciProviders: Map<string, CIProvider>;
        _activeProvider: CIProvider;
        _defaultProvider: CIProvider;
        _client: IClient;
        constructor(client: IClient, defaultProviderUrl?: string, defaultProvider?: CIProvider);
        addProvider(url: string, provider: CIProvider): void;
        setActiveProvider(provider: CIProvider): void;
        getActiveProvider(): CIProvider;
    }
    type Session = {
        sessionId: string;
        input: any;
        context: string;
        customerName: string;
        notesInfo: NotesInfo;
        focused: boolean;
    };
    type NotesInfo = {
        notesDetails: Map<string, any>;
        resolve: any;
        reject: any;
    };
    class CIProvider {
        providerId: string;
        name: string;
        label: string;
        landingUrl: string;
        _state: IState;
        _minimizedHeight: number;
        clickToAct: boolean;
        _widgetContainer: WidgetContainer;
        sortOrder: string;
        apiVersion: string;
        orgId: string;
        orgName: string;
        crmVersion: string;
        appId: string;
        trustedDomain: string;
        sessions: Map<string, Session>;
        constructor(x: XrmClientApi.WebApi.Entity, state: IState, environmentInfo: any);
        raiseEvent(data: Map<string, any>, messageType: string, noTimeout?: boolean): Promise<Map<string, any>>;
        getContainer(): WidgetContainer;
        setContainer(container: WidgetContainer, minimizedHeight: number): void;
        getAllSessions(): string[];
        getFocusedSession(telemetryData?: Object): string;
        getSession(sessionId: string, telemetryData?: Object): Promise<Map<string, any>>;
        canCreateSession(telemetryData?: Object): boolean;
        createSession(input: any, context: any, customerName: string, telemetryData: Object, appId?: any, cifVersion?: any, correlationId?: string): Promise<string>;
        requestFocusSession(sessionId: string, messagesCount: number, telemetryData?: Object): Promise<any>;
        setFocusedSession(sessionId: string, showWidget?: boolean): void;
        setUnfocusedSession(sessionId: string, hideWidget?: boolean): void;
        closeSession(sessionId: string, telemetryData?: Object): void;
        getFocusedTab(telemetryData?: Object): string;
        getTabsByTagOrName(name: string, tag: string): Promise<string[]>;
        refreshTab(tabId: string): Promise<boolean>;
        setSessionTitle(input: any): Promise<string>;
        setTabTitle(tabId: string, input: any): Promise<string>;
        createTab(input: any, telemetryData?: Object, appId?: any, cifVersion?: any, correlationId?: string): Promise<string>;
        focusTab(tabId: string, telemetryData?: Object): Promise<string>;
    }
}
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
declare namespace Microsoft.CIFramework.Internal {
    function toggleNotesVisibility(): void;
    function insertNotesClient(notesDetails: Map<string, any>): Promise<any>;
    function saveNotes(notesDetails: Map<string, any>, newTextArea: any): Promise<Map<string, any>>;
    function cancelNotes(): void;
    function intermediateSaveNotes(event?: CustomEvent): void;
}
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
declare namespace Microsoft.CIFramework.Internal {
    type PresenceInfo = {
        presenceId: string;
        presenceColor: string;
        presenceText: string;
        basePresenceStatus: string;
    };
    type AgentInfo = {
        agentId: string;
        agentName: string;
        presenceId: string;
        currentPresenceStatusInfo: PresenceInfo;
    };
    class PresenceControl {
        private static instance;
        constructor();
        static readonly Instance: PresenceControl;
        setAllPresences(presenceList: PresenceInfo[]): HTMLDivElement;
        setAgentPresence(presenceInfo: PresenceInfo): HTMLDivElement;
        private toggleList();
        private keyboardToggleList(e);
        private raiseSetPresence(e);
        private keyboardPresenceHandler(e);
    }
}
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
declare namespace Microsoft.CIFramework.Internal {
    type EventHandler = (event?: CustomEvent) => void;
    type XrmEventHandler = (context?: XrmClientApi.EventContext) => void;
    type RegisterHandler = (eventName: string, handler: EventHandler) => boolean;
    type RemoveHandler = (eventName: string) => EventHandler;
    /**
     * Func type for all CRUD functions.
    */
    type CRUDFunction = (entityName: string, entityId?: string, telemetryData?: Object, data?: Map<string, any> | string) => Promise<Map<string, any>>;
    /**
     * Func type for all set a setting kind of functions.
    */
    type SetSettingFunction = (name: string, value: any, telemetryData?: Object) => string | number | void;
    /**
     * Func type for all get a specific setting/context functions for which we dont need an input param.
    */
    type GetContextFunction = (telemetryData?: Object) => string | number | Map<string, any>;
    /**
     * Func type for getting environment details such as org details, user and page specific information
    */
    type GetEnvironment = (provider: CIProvider, telemetryData?: Object) => Map<string, any>;
    /**
     * Func type for retrieve multiple reords and open one of them.
    */
    type RetrieveMultipleAndOpenFunction = (entityName: string, queryParmeters: string, searchOnly: boolean, telemetryData?: Object) => Promise<Map<string, any>>;
    /**
     * Func type for opening a new or an existing form page
    */
    type OpenFormFunction = (entityFormOptions: string, entityFormParameters?: string, telemetryData?: Object) => Promise<Map<string, any>>;
    /**
     * Func type for opening a new or an existing form page
    */
    type RefreshFormFunction = (save: boolean, telemetryData?: Object) => Promise<Object>;
    /**
     * Func type for opening a KB serach control
    */
    type openKBSearchControlFunction = (searchString: string, telemetryData?: Object) => boolean;
    /**
     * Func type for showing the current provider chat widget and hide the rest in multi provider scenario
    */
    type SetProviderVisibilityFunction = (ciProviders: Map<string, CIProvider>, provider: string) => void;
    /**
     * Func type for loading all widgets.
    */
    type LoadWidgetsFunction = (ciProviders: Map<string, CIProvider>) => Promise<Map<string, boolean | string>>;
    /**
     * Func type for get Metadata about an entity
    */
    type getMetadataFunction = (entityName: string, attributes?: Array<string>) => Promise<Object>;
    /**
     * Func type to check if this client can and should load CIF
    */
    type CheckCapabilityFunction = () => boolean;
    /**
     * Func type for search based on Search String
    */
    type renderSearchPageFunction = (entityName: string, searchString: string, telemetryData?: Object) => Promise<void>;
    /**
     * Func type for Setting Agent Presence
    */
    type setAgentPresenceFunction = (presenceInfo: PresenceInfo, telemetryData?: Object) => boolean;
    /**
     * Func type for Setting all presences
    */
    type initializeAgentPresenceListFunction = (presenceList: PresenceInfo[], telemetryData?: Object) => boolean;
    /**
     * Func type for using the flap for rendering any control
    */
    type expandFlapFunction = (handler: EventHandler) => number;
    type collapseFlapFunction = (sessionId?: string) => number;
    type flapInUseFunction = () => boolean;
    /**
     * Func type to add Session
    */
    type createSessionFunction = (id: string, initials: string, sessionColor: string, providerId: string, customerName: string) => void;
    /**
     * Func type to remove Session
    */
    type closeSessionFunction = (id: string) => void;
    /**
     * Func type to get color of Session
    */
    type getSessionColorFunction = (id: string) => string;
    /**
     * Func type to update Session
    */
    type updateSessionFunction = (id: string, focused: boolean) => void;
    /**
     * Func type to update Session on unread messages
    */
    type notifySessionFunction = (id: string, messagesCount: number) => void;
    /**
     * Client interface/type which all clients will be extending and implementing for client specific logic.
     * This type specifies all the functions that are exposed to clients for impl.
    */
    type IClient = {
        sizeChanged: XrmEventHandler;
        modeChanged: XrmEventHandler;
        navigationHandler: XrmEventHandler;
        registerHandler: RegisterHandler;
        removeHandler: RemoveHandler;
        createRecord: CRUDFunction;
        updateRecord: CRUDFunction;
        deleteRecord: CRUDFunction;
        retrieveRecord: CRUDFunction;
        getUserID: GetContextFunction;
        loadWidgets: LoadWidgetsFunction;
        retrieveMultipleAndOpenRecords: RetrieveMultipleAndOpenFunction;
        setProviderVisibility: SetProviderVisibilityFunction;
        setPanelMode: SetSettingFunction;
        setWidgetWidth: SetSettingFunction;
        setPanelWidth: SetSettingFunction;
        setPanelPosition: SetSettingFunction;
        getPanelPosition: GetContextFunction;
        getWidgetMode: GetContextFunction;
        getEnvironment: GetEnvironment;
        getWidgetWidth: GetContextFunction;
        openForm: OpenFormFunction;
        refreshForm: RefreshFormFunction;
        openKBSearchControl: openKBSearchControlFunction;
        getEntityMetadata: getMetadataFunction;
        checkCIFCapability: CheckCapabilityFunction;
        renderSearchPage: renderSearchPageFunction;
        expandFlap: expandFlapFunction;
        collapseFlap: collapseFlapFunction;
        createSession: createSessionFunction;
        closeSession: closeSessionFunction;
        getSessionColor: getSessionColorFunction;
        updateSession: updateSessionFunction;
        notifySession: notifySessionFunction;
        flapInUse: flapInUseFunction;
    };
    type IPresenceManager = {
        setAgentPresence: setAgentPresenceFunction;
        initializeAgentPresenceList: initializeAgentPresenceListFunction;
    };
    /**
     * Set the actual client implementation based on client type passed.
     * @param clientType type of client
     */
    function setClient(clientType: string): IClient;
    function GetPresenceManager(clientType: string): IPresenceManager;
}
