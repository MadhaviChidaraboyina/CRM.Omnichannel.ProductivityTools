declare namespace Microsoft {
	let AppRuntime: AppRuntimeClientSdk.AppRuntime;
}
declare namespace AppRuntimeClientSdk {
	/**
	 *	Provides a collection of API to interact with the AppRuntime
	 */
	export interface AppRuntime {
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
		Internal: Internal;
	}

	export interface Internal {
		/**
		 * Creates a new tab
		 * @param input properties of the tab to be created
		 */
		createTab(input: XrmClientApi.TabInput): Promise<string>;

		/**
		 * Creates a new session or focus to session with same context
		 * @param input properties of the session to be created/focus
		 */
		findSessionWithPageInput(targetPageInput: XrmClientApi.PageInput): XrmClientApi.AppSession | null ;

		/**
		 * Registers handler for detecting window visibility change
		 * @param handler handler to fire on window visibility change
		 */
		addOnWindowVisibilityStateChangeHandler(handler: Function): string;

		/**
		 * Remove a window visibility state change handler.
		 * @param handlerId Identifier of handler to remove
		 */
		removeOnWindowVisibilityStateChangeHandler(handlerId: string): void;

		/**
		 * Gets the list of channel providers associated with the current App config
		 * @param correlationId String used to group all related API calls together for diagnostic telemetry
		 */
		getChannelProviders(correlationId?: string): Promise<Array<IChannelProvider>>;

		/**
		 * Returns the session template object
		 * @param sessionId ID of the session to return session template
		 * @param correlationId String used to group all related API calls together for diagnostic telemetry
		 */
		getSessionTemplate(sessionId: string, correlationId?: string): Promise<ISessionTemplate>;

		/**
		 * Returns the template object based on template type and template name passed
		 * @param templateType Type of the template i.e., Session | Notification | ApplicationTab
		 * @param templateName Unique name of the template
		 */
		getTemplate(templateType: TemplateType, templateName: string): Promise<INotificationTemplate | IApplicationTemplate | ISessionTemplate>;

		/**
		 * Returns the anchor tab page input defined in current active entity session template
		 * @param entityName The entity name
		 * @param entityId The entity id
		 */
		getEntityPageInput(entityName: string, entityId?: string): Promise<XrmClientApi.PageInput>;

		/**
		 * Returns the anchor tab page input from entity session template
		 * @param templateName The session template name
		 * @param context The session context
		 */
		 getPageInputFromSessionTemplate(templateName: string, context: Map<string, string>): Promise<XrmClientApi.PageInput>;

		/**
		 * Telemetry log information
		 * @param message Telemetry information message
		 * @param telemetryData Additional telemetry data
		 */
		telemetryLogInfo(message: string, telemetryData?: any): void;

		/**
		 * Telemetry log warning
		 * @param message Telemetry Warning message
		 * @param telemetryData Additional telemetry data
		 */
		telemetryLogWarning(message: string, telemetryData?: any): void;

		/**
		 * Telemetry log error
		 * @param message Telemetry Error message
		 * @param telemetryData Additional telemetry data
		 * @param shouldBubbletoHost set to true if we should bubble to host
		 */
		telemetryLogError(message: string, telemetryData?: any, shouldBubbletoHost?: boolean): void;

		/**
		 * Create a publisher for a topic.
		 * @param topicName topic name to which event can be published.
		 * @param correlationId correlation id for debugging purpose.
		 */
		publishTopic(topicName: string, correlationId?: string): IEventPublisher;

		/**
		 * Subscribe to a topic
		 * @param subscriberName subscriber name.
		 * @param topicName topic name to listen messages.
		 * @param callback action to invoke on recieving the message.
		 * @param correlationId correlation id for debugging purpose.
		 */
		subscribeTopic(subscriberName: string, topicName: string, callback: ()=> void, correlationId?: string): IEventSubscriber;

		/**
		 * Get APM runtime supported topics.
		 */
		getAPMRuntimeTopics(): Map<string, string>;
	}

	/**
	* Provides a collection of API related to Session and Context management
	*/
	export interface Sessions {
		/**
		 * Creates a new session
		 * @param sessionInput properties for creating a session
		 * @param correlationId String used to group all related API calls together for diagnostic telemetry
		 */
		create(sessionInput: SessionInput, correlationId?: string): Promise<string>;

		/**
		 * Returns the session corresponding to the id passed in.
		 * @param sessionId ID of the session to return.
		 * @param correlationId String used to group all related API calls together for diagnostic telemetry
		 */
		getSession(sessionId: string, correlationId?: string): Session;

		/**
		 * Returns the current focused session.
		 * @param correlationId String used to group all related API calls together for diagnostic telemetry
		 */
		getFocusedSession(correlationId? :string): Session;

		/**
		 * Returns true if a new session can be created.
		 * @param correlationId String used to group all related API calls together for diagnostic telemetry
		 */
		canCreateSession(correlationId?: string): boolean;

		/**
		 * Gets the list of sessions currently open.
		 * @returns Returns array of sessionIds.
		 * @param correlationId String used to group all related API calls together for diagnostic telemetry
		 */
		getAll(correlationId?: string): Array<string>;

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
		 * Remove a ContextChange handler.
		 * @param handlerId Identifier of handler to remove
		 */
		removeOnContextChange(handlerId: string): void;

		/**
		 * Registry session state persistence functions.
		 * @param id Identifier of the component that requires session state persistence.
		 * @param getValueFunc Function to get component state value on current session. It returns a string.
		 * @param restoreValueFunc Function to restore component state. It consumes the value returned from @getValueFunc
		 */
		registrySessionStatePersistence(id: string, getValueFunc: Function, restoreValueFunc: Function): void;

		/**
		 * Add a session refresh handler. Will be fired when the refreshSession API call is made and changes the session context.
		 * @param handler Handler to fire on context change.
		 */
		addOnSessionRefresh(handler: Function): string;

		/**
		 * remove a SessionRefresh handler
		 * @param handlerId Identifier of handler to remove
		 */
		removeOnSessionRefresh(handlerId: string): void;

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

		/**
		 * Cache and update session state.
		 * @param sessionId indicates the session that requires state caching.
		 */
		cacheSessionState(sessionId: string): void;

		/**
		 * Restore session state.
		 * @param sessionId indicates the session that needs to restore cached state.
		 */
		restoreSessionState(sessionId: string): void;

		/**
		 * Remove session state. If session id is undefined, remove session state for all sessions, otherwise, only remove the specified session state.
		 * @param sessionId indicates the session that needs to remove cached state.
		 */
		removeSessionState(sessionId?: string): void;
	}

	/**
	 * Input parameters for creating a new tab.
	 */
	export interface TabInput {
		/**
		 *  The input for the initial page to open when the tab is created.
		 */
		pageInput: PageInput;

		/**
		 * Additional properties of the tab.
		 */
		options?: TabOptions;
	}

	/**
	 * Additional parameters for new tab creation.
	 */
	export interface TabOptions {
		/**
		 * Determines whether or not the tab can be closed.
		 */
		canBeClosed?: boolean;

		/**
		 * The title for the tab.
		 */
		title?: string;

		/**
		 * The icon to display for this tab.
		 */
		iconPath?: string;

		/**
		 * will focus after tab is created
		 */
		isFocused?: boolean;
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

		/**
		 * will focus after session is created
		 */
		isFocused?: boolean;

		/**
		 * Flag to force confirmation dialog before close of the session
		 */
		 confirmBeforeClose?: boolean;

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
		 * @param correlationId String used to group all related API calls together for diagnostic telemetry
		 */
		close(correlationId?: string): Promise<boolean>;

		/**
		 * Indicates whether a new session can be created
		 */
		canCreateTab(): boolean;

		/**
		 * Returns the currently focused tab
		 */
		getFocusedTab(correlationId?: string): AppTab;

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
		 * Returns the ids of the tabs currently open in the session
		 */
		getAllTabs(): Array<string>;

		/**
		 * Returns the ids of the tabs with given templateName, currently open in the session.
		 */
		getAllTabsForTemplate(templateName?: string): Promise<string[]>;

		/**
		 * Returns a Promise of SessionContext for this session
		 */
		getContext(): Promise<ISessionContext>;

		/**
		 * update context for this session
		 * @param input properties of the session context to be updated,
		 *  formatted as {
		 *		[id: string]: string;
		 * 	};
		 * @param isDelete set to false if the properties need to be replaced/added, true if the properties need to be removed
		 */
		updateContext(input: object, isDelete?: boolean): Promise<ISessionContext>;

		/**
		 * Indicates if a KPI has been breached in this session
		 * @param show set to false if the KPI breach indication has to be cleared
		 */
		notifyKpiBreach(show: boolean): Promise<void>;

		/**
		 * Indicates the count of new updates in the session
		 * @param count 0 will render a blue dot, any other positive number will render an equivalent representation
		 * @param correlationId String used to group all related API calls together for diagnostic telemetry
		 */
		notifyNewActivity(count: number, correlationId?: string): Promise<void>;

		/**
		 * Resets the unread activity indication set using notifyNewActivity
		 */
		resetActivityIndicator(): Promise<void>;

		/**
		 * Sets session title and updates the initials
		* @param title title to set on session
		 */
		setTitleAndInitials(title: string): void;
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
		appContext?: Map<string, string>;
		isFocused?: boolean;
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
		 * @param correlationId String used to group all related API calls together for diagnostic telemetry
		 */
		cancelNotification(cancellationToken: string, correlationId?: string): Promise<INotificationResponse>;

		/**
		 * Registers handler for detecting notification state change
		 * @param handler handler to fire on notification state change
		 */
		addOnNotificationStateChangeHandler(handler: Function): string;

		/**
		 * Remove a Notification state change handler.
		 * @param handlerId Identifier of handler to remove
		 */
		removeOnNotificationStateChangeHandler(handlerId: string): void;
	}

	/**
	 * Interface for Notification Input
	 */
	export interface INotificationInput {
		/**
		 * Name of the notification template
		 */
		templateName: string;

		/**
		 * Unique Id passed by caller to be used for telemetry.
		*/
		correlationId: string;

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

		/**
		 * Resolves the Slug
		 * @param input input value that need to be resolved
		 * @param templateParams context from which input will be resolved
		 * @param scope scope of the input to resolution
		 */
		resolveSlug(input: string, templateParams: Map<string, any>, scope: string): Promise<string>;
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
		 * Entity name of this dashboard.
		 */
		entityName?: string;

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
		 * Whether the entity record is validated before tab is created
		 */
		validateRecord?: boolean;

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

	/**
	 *Enum for SessionRefresh event type
	 **/
	export enum SessionRefreshEventType {
		/**
		 * Represents a session refresh event
		 * */
		SessionRefresh = "SessionRefresh"
	}


	/**
	 * Enum for Template types
	 */
	export const enum TemplateType {
		Session = "Session",
		Notification = "Notification",
		ApplicationTab = "ApplicationTab"
	}

	/**
	 *Interface for Channel provider entity
	 **/
	export interface IChannelProvider {
		/**
		 *Channel Provider Id
		 **/
		id: string;

		/**
		 *Channel provider name
		 **/
		name: string;

		/**
		 *Channel provider uniqueName
		 **/
		uniqueName: string;

		/**
		 *Channel provider api version
		 **/
		apiVersion: string;

		/**
		 *Channel provider channel url
		 **/
		channelUrl: string;

		/**
		 *Channel provider enabled analytics value
		 **/
		enableAnalytics: boolean;

		/**
		 *Channel provider enabled out bound
		 **/
		enableOutBound: boolean;

		/**
		 *Channel provider sort order
		 **/
		sortOrder: string;

		/**
		 *Channel provider label
		 **/
		label: string;

		/**
		 *Channel provider Trusted Domain
		 **/
		trustedDomain: string;

		/**
		 *Channel provider Custom params
		 **/
		customParams: string;
	}

	/**
	*Interface for Session Template
	**/
	export interface ISessionTemplate {
		/**
		 *Session Template Id
		 **/
		id: string;

		/**
		 *Session Template name
		 **/
		name: string;

		/**
		 *Session Template uniqueName
		 **/
		uniqueName: string;

		/**
		 *Session Template title
		 **/
		title: string;

		/**
		 *Session Template entity name
		 **/
		entityName: string;

		/**
		 *Session Template is entity Template
		 **/
		isEntityTemplate: boolean;

		/**
		 *Session Template app configuration name
		 **/
		appConfigurationName: string;

		/**
		 *Session Template tabs array
		 **/
		tabs: IApplicationTemplate[];

		/**
		 *Session Template anchor Tab Template
		 **/
		anchorTabTemplate: IApplicationTemplate;

		/**
		 *Session Template panel state
		 **/
		panelState: string;
	}

	/**
	*Interface for Application Template
	**/
	export interface IApplicationTemplate {
		/**
		 *Application Template Id
		 **/
		id: string;

		/**
		 *Application Template name
		 **/
		name: string;

		/**
		 *Application Template uniqueName
		 **/
		uniqueName: string;

		/**
		 *Application Template title
		 **/
		title: string;

		/**
		 *Application Template entity logical name
		 **/
		entityLogicalName: string;

		/**
		 *Application Template page Type
		 **/
		pageType: PageInput;

		/**
		 *Application Templateparameters
		 **/
		parameters: Map<string, string>???;
	}

	/**
	*Interface for Notification Template
	**/
	export interface INotificationTemplate {
		/**
		 *Notification Template Id
		 **/
		id: string;

		/**
		 *Notification Template name
		 **/
		name: string;

		/**
		 *Notification Template uniqueName
		 **/
		uniqueName: string;

		/**
		 *Notification Template title
		 **/
		title: string;

		/**
		 *Notification Template entity logical name
		 **/
		entityLogicalName: string;

		/**
		 * Notification Template description
		 **/
		description: string;

		/**
		 * Icon used for the Notification Template
		 **/
		icon: string;

		/**
		 * Whether or not to show timeout on notification
		 **/
		showTimeout: boolean;

		/**
		* Timeout interval for notification (in secs)
		**/
		timeout: number;

		/**
		* Notification theme used for the template
		**/
		theme: PopupNotificationThemeType;

		/**
		* Notification Template Desktop Notification mode
		**/
		desktopNotificationMode: DesktopNotificationMode;

		/**
		* Accept button text for the notification template
		**/
		acceptButtonText: string;

		/**
		* Whether reject button to be shown on notification
		**/
		showRejectButton: boolean;

		/**
		* Reject button text for the notification template
		**/
		rejectButtonText: string;

		/**
		* Whether to auto accept the notification
		**/
		autoAcceptNotification: boolean;

		/**
		* Notification fields used in the template
		**/
		notificationFields: NotificationField[];
	}

	/**
	 * Enum Notification Theme type
	 * */
	export enum PopupNotificationThemeType {
		/**
		 * Dark theme
		 * */
		Dark = 509180000,

		/**
		 * Light theme
		 * */
		Light = 509180001
	}

	/**
	 * Enum for Desktop Notification mode
	 * */
	export enum DesktopNotificationMode {
		/**
		 * Never show desktop notifications
		 * */
		Never = 509180000,

		/**
		 * Show desktop notification when page is not in focus
		 * */
		OnlyWhenPageNotInFocus = 509180001
	}

	/**
	 * Interface for Notification Field
	 * */
	export interface NotificationField {
		/**
		 * Title for the field
		 * */
		title: string;

		/**
		* Value of the field
		* */
		value: string;

		/**
		* Priority of the field
		* */
		order: number;
	}

	/**
	 * Event Publisher interface
	 */
	export interface IEventPublisher {

		/**
		 * Publish data to event.
		 * @param payload payload to be posted on the channel
		 */
		postMessage(payload?: Object, correlationId?: string): void;

		/**
		 * Close topic and open it up for garbage collection
		 */
		close(correlationId?: string): void;
	}

	/**
	 * Event Subscriber interface
	 */
	export interface IEventSubscriber {

		/**
		 * Close topic and open it up for garbage collection
		 */
		close(correlationId?: string): void;
	}
}