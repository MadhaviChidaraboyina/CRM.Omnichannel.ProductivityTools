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
    }
    enum ErrorCode {
        Notes_Flap_Already_Expanded = 101,
    }
}
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
import Internal = Microsoft.CIFramework.Internal;
declare namespace Microsoft.CIFramework.External {
    interface CIFExternalUtility {
        getSessionInfoObject(sessionId: string): Internal.SessionInfo;
        getCurrentSessionInfoObject(): Internal.SessionInfo;
        setSessionInfoObject(sessionInfo: Internal.SessionInfo, sessionId?: string): void;
        resolveTemplateString(input: string, templateParams: any, scope: string): Promise<string>;
    }
    class CIFExternalUtilityImpl extends Internal.ConsoleAppSessionManager implements CIFExternalUtility {
        getSessionInfoObject(sessionId: string): Internal.SessionInfo;
        getCurrentSessionInfoObject(): Internal.SessionInfo;
        setSessionInfoObject(sessionInfo: Internal.SessionInfo, sessionId?: string): void;
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
declare namespace Microsoft.CIFramework.Internal {
    function toggleNotesVisibility(): void;
    function insertNotesClient(notesDetails: Map<string, any>): Promise<any>;
    function saveNotes(notesDetails: Map<string, any>, newTextArea: any): Promise<Map<string, any>>;
    function cancelNotes(): void;
	function intermediateSaveNotes(event?: CustomEvent): void;
	function openKBSearchControl(parameters: Map<string, any>): Promise<Map<string, any>>;
	function search(parameters: Map<string, any>): Promise<Map<string, any>>;
	function openForm(parameters: Map<string, any>): Promise<Map<string, any>>;
	function createSession(parameters: Map<string, any>): Promise<Map<string, any>>;
	function createTab(parameters: Map<string, any>): Promise<Map<string, any>>;
	function logErrorsAndReject(parameters: Map<string, any>): Promise<any>;
}
