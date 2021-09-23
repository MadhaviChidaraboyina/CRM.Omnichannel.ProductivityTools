declare namespace Microsoft {
	let AppRuntime: AppRuntimeClientSdk.AppRuntime;
}
declare namespace AppRuntimeClientSdk {
	/**
	 *	Provides a collection of API to interact with the AppRuntime
	 */
	export interface AppRuntime
	{
		/**
		 * Returns the Sessions object
		 */
		Sessions: Sessions;

		/**
		* Returns the Notification object
		*/
		Notification: Notification;

		/**
		* Returns the Utility object 
		*/
		Utility: Utility;

		/**
		* Returns the Internal object
		*/
		Internal: Internal
	}

	/**
	* Provides a collection of API related to Session and Context management
	*/
	export interface Sessions {
		/**
		 * Creates a new session
		 * @param sessionInput properties for creating a session
		 */
		create(sessionInput: SessionInput): Promise<string>;

		/**
		 * Returns the session corresponding to the id passed in.
		 * @param sessionId ID of the session to return.
		 */
		getSession(sessionId: string): Session;

		/**
		 * Returns the current focused session.
		 */
		getFocusedSession(): Session;

		/**
		 * Returns true if a new session can be created.
		 */
		canCreateSession(): boolean;

		/**
		 * Gets the list of sessions currently open.
		 * @returns Returns array of sessionIds.
		 */
		getAll(): Array<string>;

		/**
		 * Add a SessionCreate handler. Will be fired after session is created.
		 * @param handler handler to fire on session create.
		 */
		addOnAfterSessionCreate(handler: Function): string;

		/**
		 * Remove a SessionCreate handler.
		 * @param handlerId Identifier of handler to remove
		 */
		removeOnAfterSessionCreate(handlerId: string): void;

		/**
		 * Add a SessionClose handler. Will be fired after session is closed.
		 * @param handler handler to fire on session close.
		 */
		addOnAfterSessionClose(handler: Function): string;

		/**
		 * Remove a SessionClose handler.
		 * @param handlerId Identifier of handler to remove
		 */
		removeOnAfterSessionClose(handlerId: string): void;

		/**
		 * Add a SessionSwitch handler. Will be fired after session is switched.
		 * @param handler handler to fire on session switch.
		 */
		addOnAfterSessionSwitch(handler: Function): string;

		/**
		 * Remove a SessionSwitch handler.
		 * @param handlerId Identifier of handler to remove
		 */
		removeOnAfterSessionSwitch(handlerId: string): void;

		/**
		 * Add a ContextChange handler. Will be fired when the current page context is changed as a result of a manual or programmatic interaction. 
		 * Returns @type IContextChangeEvent to the handler passed
		 * @param handler Handler to fire on context change.
		 */
		addOnContextChange(handler: Function): string;

		/**
		 * remove a ContextChange handler
		 * @param handlerId Identifier of handler to remove
		 */
		removeOnContextChange(handlerId: string): void;

		/**
		 * Refreshes the session context and corresponding anchor tab to reflect changes from in-page navigation.
		 * @param skipCreateAdditionalTabs optional parameter to indicate that the session context will be updated but additional
		 * tabs from the session template will not be created
		 * @param sessionTemplate optional parameter to give on custom element types
		 * @param templateParameters optional parameter for give the session template
		 * @param skipUpdateTitle optional parameter to indicate whether to update the session's title
		 * @param eventSource from where the refreshSession is called
		 */
		refreshSession(skipCreateAdditionalTabs?: boolean, sessionTemplateName?: string, templateParameters?: Map<string, string>, skipUpdateTitle?: boolean, eventSource?: string): Promise<string>;

    }

	export interface Internal {
		/**
		 * Create a new tab for macros
		 * @param input properties of the tab to be created
		 */
		createTab(input: XrmClientApi.TabInput): Promise<string>;
	}

	/**
	 * Interface for SessionInput
	 */
	export interface SessionInput {
		/**
		 * Name of the Session template
		 */
		templateName: string;

		/**
		 * Session level context bag. Also used for resolving slugs in the session.
		 * This will be available as a readonly object in Session.context
		 */
        sessionContext: Map<string, string>;
    }

	/**
	 *	An interface that represents a Session in the AppRuntime
	 */
	export interface Session {
		/**
		 * Unique id of the session 
		 */
		sessionId: string;

		/**
		 * Indicates whether or not this session is Default/Home session.
		 */
        isDefault: boolean;

		/**
		 * The title of the session.
		 */
		title: string;

		/**
		 * Indicates whether or not this session can be closed.
		 */
		canClose: boolean;

		/**
		 * Icon of the session
		 */
        iconPath: string;

		/**
		 * Title of the Icon of the session
		 */
		iconTitle: string;

		/**
		 * Brings this session to focus.
		 */
        focus(): Promise<void>;

		/**
		 * Update the the UI to indicate to the user that this session requires attention.
		 */
		requestFocus(): void;

		/**
		 * Close this session.
		 */
		close(): Promise<boolean>;

		/**
		 * Indicates whether a new session can be created
		 */
		canCreateTab(): boolean;

		/**
		 * Returns the currently focused tab 
		 */
		getFocusedTab(): AppTab;

		/**
		 * Returns a tab with the id
		 * @param tabId id of the tab
		 */
		getTab(tabId: string): AppTab;

		/**
		 * Create a new tab
		 * @param input properties of the tab to be created
		 */
        createTab(input: AppTabInput): Promise<string>;

        /**
		 * Create a new tab for macros
		 * @param input properties of the tab to be created
		 */
        createTabMacros(input: XrmClientApi.TabInput): Promise<string>;

		/**
		 * Returns the ids of the tabs currently open in the session	 
		 */
		getAllTabs(): Array<string>;

		/**
		 * Returns a Promise of SessionContext for this session 
		 */
		getContext(): Promise<ISessionContext>;

		/**
		 * Indicates if a KPI has been breached in this session
		 * @param show set to false if the KPI breach indication has to be cleared
		 */
		notifyKpiBreach(show: boolean): Promise<void>;

		/**
		 * Indicates the count of new updates in the session 
		 * @param count 0 will render a blue dot, any other positive number will render an equivalent representation
		 */
		notifyNewActivity(count: number): Promise<void>;

		/**
		 * Resets the unread activity indication set using notifyNewActivity
		 */
		resetActivityIndicator(): Promise<void>;
    }

	/**
	 * An interface that represents the Session Context 
	 */
	export interface ISessionContext {
		/**
		 * Returns the name of the template used in the session
		 * @readonly
		 */
		readonly templateName: string;

		/**
		 * Returns the SessionContext passed while creating this session
		 * @readonly
		 */
        readonly parameters: {
            [id: string]: string;
		};

		/**
		 * Returns the intial PageInput object for the tab
		 * @readonly
		 * @param tabId id of the tab. Use 'anchor' to refer to the anchor tab of the session
		 */
		getTabContext(tabId: string): PageInput;

		/**
		 * Get a context parameter being set using ISessionContext.set
		 * @param key
		 */
		get(key: string): any;

		/**
		 * Sets a context parameter in the session
		 * @param key key of the parameter
		 * @param value value of the parameter
		 */
		set(key: string, value: any): void;

		/**
		 * Resolves the slug passed against the Sessioncontext
		 * @param input slug value
		 */
        resolveSlug(input: string): Promise<string>;
    }

	/**
	 * Interface for AppTabInput
	 */
	export interface AppTabInput {
		/**
		 * Returns the name of the template used in the session
		 */
		templateName: string;
		/**
		 *  
		 */
        appContext: Map<string, string>;
    }

	/**
	 * Interface defining an Application Tab in the AppRuntime
	 */
	export interface AppTab {
		/**
		 * Id of the tab
		 */
		tabId: string;

		/** 
		 * Title of the tab
		 */
		title: string;

		/**
		 * Returns tru if the tab can be closed 
		 */
		canClose: boolean;

		/**
		 * Brings this tab to focus
		 */
		focus(): void;

		/** 
		 * Closes this tab
		 */
		close(): Promise<boolean>;

		/** 
		 * Refreshes this tab
		 */
        refresh(): Promise<void>;
    }

	/**
	* Provides a collection of API related to Notifications
	*/
	export interface Notification {
		/**
		 * Triggers a notification to be rendered
		 * @param input Definition of the notification
		 */
		showNotification(input: INotificationInput): Promise<INotificationResponse>;

		/**
		 * Cancels a notification that was triggered
		 * @param cancellationToken cancellation token of the notification to be cancelled
		 */
        cancelNotification(cancellationToken: string): Promise<INotificationResponse>;
    }

	/**
	 * Interface for Notification Input
	 */
	export interface INotificationInput {
		/**
		 * Name of the notification template 
		 */
		templateName: string

		/**
		 * Properties of the notification to be used for resolving slugs
		 */
		notificationContext?: Map<string, string>;

		/**
		 * Unique identifier to cancel this notification if requried 
		 */
        cancellationToken?: string;
    }

	/**
	 * Interface for Notification Response 
	 */
	export interface INotificationResponse {
		/**
		 * Notification action 
		 */
		actionName: NotificationAction;

		/**
		 * Response reason 
		 */
		responseReason: NotificationResponseReason;
	}

	/**
	 * enum for Notification Response reason 
	 */
	export enum NotificationResponseReason {
		/**
		 * Accept button was clicked 
		 */
		Accept = "Accept",

		/**
		 * Accepted automatically 
		 */
		AutoAccept = "AutoAccept",

		/**
		 * Cancelled by calling Notification.cancelNotification
		 */
		Cancelled = "Cancelled",

		/**
		 * Declined by user
		 */
		DeclinedByAgent = "DeclinedByAgent",

		/**
		 * Timed out as the user did not respond
		 */
		DisplayTimeout = "DisplayTimeout",

		/**
		 * Notification queue is full 
		 */
		NotificationQueueLimitExceeded = "NotificationQueueLimitExceeded",

		/**
		 * Timed out in the queue
		 */
        NotificationQueueTimeLimitExceeded = "NotificationQueueTimeLimitExceeded",

		/**
		 * Invalid notification template 
		 */
		NotificationTemplateNotFoundError = "NotificationTemplateNotFoundError",

		/**
		 * Invalid inputs 
		 */
		NotificationTemplateResolverNotFoundError = "NotificationTemplateResolverNotFoundError",

		/**
		 * Obsolete 
		 */
		RejectAfterTimeoutNonPlatformTimer = "RejectAfterTimeoutNonPlatformTimer",

		/**
		 * Rejected due to a client error 
		 */
        RejectAfterClientError = "RejectAfterClientError"
    }

	/**
	 * Enum for notification actions
	 **/
    export enum NotificationAction {
        Accept = "Accept",
        Reject = "Reject",
        Timeout = "Timeout",
        Cancel = "Cancel"
    }

	/**
	* Provides a collection of useful API related to AppRuntime
	*/
	export interface Utility {
		/**
		 * Returns the Environment context 
		 */
        getEnvironment(): Promise<EnvironmentContext>;
    }

	/**
	 * Interface for Environment Context
	 */
	export interface EnvironmentContext {
		/**
		 * Organization Unique name
		 */
		OrgUniqueName: string;

		/**
		 * Organization id 
		 **/
        OrgId: string;

		/**
		 * Logged in user id 
		 **/
		UserId: string;

		/**
		 * Current AppModule unique name 
		 **/
		AppName: string;

		/**
		 * Current Application Configuration unique name
		 **/
		AppConfigName: string;
    }

	/**
	 * Represents a Page rendered in an Application tab 
	 **/
    export type PageInput =
        | CustomControlPageInput
        | SearchPageInput
        | EntityListPageInput
        | DashboardPageInput
        | FormPageInput
        | InlineDialogPageInput
        | WebResourcePageInput;

    export interface CustomControlPageInput {
		/**
		 * The type of page to navigate to.
		 */
        pageType: PageType.control;

		/**
		 * The unique name of the control type to load.
		 */
        controlName: string;

		/**
		 * The json data parameters required for the control.
		 */
        data?: string;
    }

    export const enum PageType {
        control = "control",
        entityList = "entitylist",
        search = "search",
        dashboard = "dashboard",
        entityRecord = "entityrecord",
        inlineDialog = "inlinedialog",
        webresource = "webresource",
    }

    export interface SearchPageInput {
		/**
		 * The type of page to navigate to.
		 */
        pageType: PageType.search;

		/**
		 * The search text that user types into the search box.
		 */
        searchText?: string;

		/**
		 * Type of the search being performed.
		 */
        searchType?: SearchType;

		/**
		 * List of Entity for which we need to fetch result
		 */
        EntityNames?: string[];

		/**
		 * Entity Group Name
		 */
        EntityGroupName?: string;
    }

    const enum SearchType {
        RelevanceSearch = 0,
        CategorizedSearch = 1,
        CustomSearch = 2,
    }

    export interface EntityListPageInput {
		/**
		 * The type of page to navigate to.
		 */
        pageType: PageType.entityList;

		/**
		 * The logical name of the entity type to load in the list control.
		 */
        entityName: string;

		/**
		 * The ID of the view to load.
		 */
        viewId?: string;

		/**
		 * The type of view to load.
		 */
        viewType?: ViewType;
    }

    export const enum ViewType {
        savedView = "savedview",
        userView = "userview",
    }

    export interface DashboardPageInput {
		/**
		 * The type of page to navigate to.
		 */
        pageType: PageType.dashboard;

		/**
		 * The navigation path.
		 */
        navigationPath?: string;

		/**
		 * Guid of dashboard
		 */
        dashboardId?: string;

		/**
		 * Entity type of this dashboard.
		 */
        entityType?: string;

		/**
		 * Dashboard type, i.e. system or user.
		 */
        type?: DashboardType;

		/**
		 * Identify if the dashboard can be overriden with Default User Dashboard
		 */
        canOverride?: boolean;
    }

    export const enum DashboardType {
        system = "system",
        user = "user",
    }

    export interface FormPageInput {
		/**
		 * The type of page to navigate to.
		 */
        pageType: PageType.entityRecord;

		/**
		 * The entity type name of the primary
		 * entity associated with the form.
		 */
        entityName: string;

		/**
		 * The id of the record to load in the form
		 */
        entityId?: string;

		/**
		 * Indicating the form should be initialized with a parent entity
		 */
        createFromEntity?: LookupValue;

		/**
		 * The optional id of the form to use.
		 * If unspecified then the default will be used.
		 */
        formId?: string;

		/**
		 * The id of the process to load
		 */

        processId?: string;

		/**
		 * The id of the process instance to load
		 */
        processInstanceId?: string;

		/**
		 * The id of the stage selected in the BPF
		 */
        selectedStageId?: string;

		/**
		 * Whether the form is navigated to from a different entity using cross entity BPF
		 */
        isCrossEntityNavigate?: boolean;

		/**
		 * This determines referenced entity in offline scenarios.
		 */
        relationship?: IRelationship;

		/**
		 * Indicates if there are any sync error
		 */
        isOfflineSyncError?: boolean;

		/**
		 * The optional data parameter that is specific to set field value/default value for a form
		 */
        data: FormParameters;
    }

    export interface LookupValue {
		/**
		 * The identifier.
		 */
        id: string;

		/**
		 * The name
		 */
        name?: string;

		/**
		 * Type of the entity.
		 */
        entityType: string;
    }

    export interface IRelationship {
		/**
		 * Name of the relationship
		 */
        name: string;

		/**
		 * name of the attribute
		 */
        attributeName: string;

		/**
		 * type of role of relationship
		 */
        roleType: roleType;

		/**
		 * type of relationship
		 */
        relationshipType: relationshipType;

		/**
		 * Name of the navigation property for this relationship
		 */
        navigationPropertyName: string;
    }

    const enum roleType {
        Referencing = 1,
        AssociationEntity = 2,
    }

    const enum relationshipType {
        OneToMany = 0,
        ManyToMany = 1,
    }

    export interface Parameters {
        [key: string]: any;
    }

    export interface FormParameters extends Parameters {
		/**
		 * Additional parameters can be provided to the request, by overloading
		 * this object with additional key and value pairs. This can only be used
		 * to provide default field values for the form.
		 */
        [key: string]: boolean | Date | number | string;
    }

    export interface DialogParameters extends Parameters { }

    export interface InlineDialogPageInput {
		/**
		 * The type of page to navigate to.
		 */
        pageType: PageType.inlineDialog;

		/**
		 * Identifies the form.
		 */
        uniqueName: string;

		/**
		 * Input parameters for defaulting the dialog fields
		 */
        data: DialogParameters;
    }

    export interface WebResourcePageInput {
		/**
		 * The type of page to navigate to.
		 */
        pageType: PageType.webresource;

		/**
		 * Name of the webresource.
		 */
        webresourceName: string;

		/**
		 * Optional data to pass to the webresource.
		 */
        data?: string;
    }

	/**
	 * Interface for ContextChange event
	 **/
	export interface IContextChangeEvent {
		/*
		 * The type of event that changed the page context.
		 */
		eventType: ContextChangeEventType;

		/**
		 * Information describing the current page
		 **/
		context: PageInput;
	}

	/**
	 *Enum for ContextChange event type
	 **/
	export enum ContextChangeEventType {
		/**
		 * Represents a tab switch event
		 * */
		TabSwitch = "TabSwitch"
	}
}