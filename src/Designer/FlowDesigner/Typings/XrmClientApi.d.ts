/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

declare let Xrm: XrmClientApi.XrmStatic;

declare namespace XrmClientApi {
	/**
	 * Static Xrm object.
	 */
	export interface XrmStatic {
		/**
		 * Constants
		 */
		Constants: Constants.ConstantsStatic;

		/**
		 * Provides a container for useful functions to call device capabilities.
		 */
		Device: Device;

		/**
		 * Provides interface for encoding string
		 */
		Encoding: XrmClientApi.Encoding;

		/**
		 * Provides a container for useful functions which open data in separate viewer.
		 */
		Navigation: Navigation;

		/**
		 * Provides a container for useful functions for the side panel.
		 */
		Panel: Panel;

		/**
		 * Xrm.UI
		 */
		UI: ApplicationUI;

		/**
		 * Provides a container for useful functions not directly related to the current page.
		 */
		Utility: Utility;

		/**
		 * Provides a namespace for the methods to execute webApi actions.
		 */
		WebApi: WebApiSdk;

		/**
		 * Provides a container for application shell level components.
		 */
		App: App;
	}

	/**
	 * Interface used by Xrm.Mobile.
	 */
	export interface Mobile {
		/**
		 * Gets the Xrm.Mobile.offline instance.
		 * @returns The Xrm.Mobile.offline instance.
		 */
		offline: MobileOfflineSdk;
	}

	/**
	 * CrudSdk Interface to be extended by Offline Sdk and Online Sdk
	 */
	export interface CrudSdk {
		/**
		 * To retrieve a record from offline db
		 * @param id guid to retrieve the record
		 * @param entityType schema name of the entity type record to create
		 * @param options Options having select and expand conditions
		 * @returns The deferred object for the result of the operation
		 */
		retrieveRecord(entityType: string, id: string, options?: string): Promise<WebApi.Entity>;

		/**
		 * To create a new record in mobile offline db
		 * @param data dictionary with attribute schema name and value
		 * @param entityType logical name of the entity type record to create
		 * @returns The deferred object for the result of the operation.
		 */
		createRecord(entityType: string, data: WebApi.Entity): Promise<LookupValue>;

		/**
		 * To update a record in mobile offline db
		 * @param id guid to update the record
		 * @param data dictionary containing changed attributes with schema name and value
		 * @param entityType logical name of the entity type record to update
		 * @returns The deferred object for the result of the operation.
		 */
		updateRecord(entityType: string, id: string, data: WebApi.Entity): Promise<LookupValue>;

		/**
		 * To delete the record mobile offline db
		 * @param id guid to delete the record
		 * @param entityType logical name of the entity type record to delete
		 * @returns The deferred object for the result of the operation.
		 */
		deleteRecord(entityType: string, id: string): Promise<LookupValue>;

		/**
		 * To retrieve the records from mobile offline db
		 * @param entityType Schema name of the entity type record to retrieve
		 * @param options Record retrieval options
		 * @param maxPageSize Records to be retrieved per page
		 * @returns The deferred object for the result of the operation.
		 */
		retrieveMultipleRecords(
			entityType: string,
			options?: string,
			maxPageSize?: number
		): Promise<WebApi.RetrieveMultipleResponse>;
	}

	/**
	 * Interface used by Xrm.WebApi.
	 */
	export interface WebApiSdk extends CrudSdk {
		/**
		 * Access to the online Web API.
		 */
		online: OnlineSdk;

		/**
		 * Access to the offline Web API.
		 */
		offline: OfflineWebApiSdk;
	}

	/**
	 * Deprecated, do not use
	 */
	export interface MobileOfflineSdk {}

	export interface OnlineSdk extends CrudSdk {
		/**
		 * execute single request
		 * @param request to be executed
		 */
		execute(request: WebApi.ODataContract): Promise<WebApi.Response>;

		/**
		 * execute multiple request
		 * @param requests array containing	 request to be executed
		 */
		executeMultiple(requests: (WebApi.ODataContract | WebApi.ChangeSet)[]): Promise<WebApi.Response[]>;
	}

	/**
	 * Interface for Xrm.WebApi.Offline
	 */
	export interface OfflineWebApiSdk extends CrudSdk {
		/**
		 * execute single request
		 * @param request to be executed
		 * @param additionalParams Optional parameter in addition to the request required for offline
		 */
		execute(request: WebApi.ODataContract, additionalParams?: { [key: string]: any }): Promise<WebApi.Response>;

		/**
		 * Check if entity is offline enabled
		 * @param entityType logical name of the entity type record for which check need to be done. For an Account record, use "account"
		 * @returns True if entity is offline enabled
		 */
		isAvailableOffline(entityType: string): boolean;
	}

	/**
	 * Interface for a Dashboard (Xrm.Page)
	 */
	export interface Dashboard {
		/**
		 * Contains properties and methods to retrieve information about the user interface as well as collections for several subcomponents of the dashboard.
		 */
		ui: DashboardUi;

		/**
		 * Gets all controls.
		 *
		 * @return	An array of controls.
		 */
		getControl(): Controls.Control[];

		/**
		 * Gets a control matching controlName.
		 *
		 * @tparam	T	A Control type
		 * @param	{string} controlName Name of the control.
		 *
		 * @return	The control.
		 */
		getControl<T extends Controls.Control>(controlName: string): T;

		/**
		 * Gets a control matching controlName.
		 *
		 * @param	{string} controlName Name of the control.
		 *
		 * @return	The control.
		 */
		getControl(controlName: string): Controls.Control;

		/**
		 * Gets a control by index.
		 *
		 * @param	{number} index	 The control index.
		 *
		 * @return	The control.
		 */
		getControl(index: number): Controls.Control;

		/**
		 * Gets a control.
		 *
		 * @param	{Collection.MatchingDelegate{Control}}	delegateFunction A matching delegate function.
		 *
		 * @return	An array of control.
		 */
		getControl(delegateFunction: Collection.MatchingDelegate<Controls.Control>): Controls.Control[];
	}

	/**
	 * Interface for a Form (Xrm.Page).
	 */
	export interface Form {
		/**
		 * Provides methods to work with the form.
		 */
		data: FormData;

		/**
		 * Contains properties and methods to retrieve information about the user interface as well as collections for several subcomponents of the form.
		 */
		ui: FormUi;

		/**
		 * Gets all attributes.
		 *
		 * @return	An array of attributes.
		 */
		getAttribute(): Attributes.Attribute[];

		/**
		 * Gets an attribute matching attributeName.
		 *
		 * @tparam	T	An Attribute type.
		 * @param	{string} attributeName	 Name of the attribute.
		 *
		 * @return	The attribute.
		 */
		getAttribute<T extends Attributes.Attribute>(attributeName: string): T;

		/**
		 * Gets an attribute matching attributeName.
		 *
		 * @param	{string} attributeName	 Name of the attribute.
		 *
		 * @return	The attribute.
		 */
		getAttribute(attributeName: string): Attributes.Attribute;

		/**
		 * Gets an attribute by index.
		 *
		 * @param	{number} index	 The attribute index.
		 *
		 * @return	The attribute.
		 */
		getAttribute(index: number): Attributes.Attribute;

		/**
		 * Gets an attribute.
		 *
		 * @param	{Collection.MatchingDelegate{Attribute}} delegateFunction A matching delegate function
		 *
		 * @return	An array of attribute.
		 */
		getAttribute(delegateFunction: Collection.MatchingDelegate<Attributes.Attribute>): Attributes.Attribute[];

		/**
		 * Gets all controls.
		 *
		 * @return	An array of controls.
		 */
		getControl(): Controls.Control[];

		/**
		 * Gets a control matching controlName.
		 *
		 * @tparam	T	A Control type
		 * @param	{string} controlName Name of the control.
		 *
		 * @return	The control.
		 */
		getControl<T extends Controls.Control>(controlName: string): T;

		/**
		 * Gets a control matching controlName.
		 *
		 * @param	{string} controlName Name of the control.
		 *
		 * @return	The control.
		 */
		getControl(controlName: string): Controls.Control;

		/**
		 * Gets a control by index.
		 *
		 * @param	{number} index	 The control index.
		 *
		 * @return	The control.
		 */
		getControl(index: number): Controls.Control;

		/**
		 * Gets a control.
		 *
		 * @param	{Collection.MatchingDelegate{Control}}	delegateFunction A matching delegate function.
		 *
		 * @return	An array of control.
		 */
		getControl(delegateFunction: Collection.MatchingDelegate<Controls.Control>): Controls.Control[];

		/**
		 * Gets the URL for the current page.
		 * @param The optional client type parameter.
		 * @returns The URL for the current page.
		 */
		getUrl(clientType?: XrmClientApi.Constants.ClientType): string;
	}

	/**
	 *Interface for Encoding
	 */
	export interface Encoding {
		/**
		 * Applies XML encoding to supplied string
		 * @param text String to be encoded
		 * @return Encoded string
		 */
		xmlEncode(text: string): string;

		/**
		 * Applies attribute encoding to supplied string
		 * @param text String to be encoded
		 * @return Encoded string
		 */
		xmlAttributeEncode(text: string): string;

		/**
		 * Applies html encoding to supplied string
		 * @param text String to be encoded
		 * @return Attribute encoded string
		 */
		htmlEncode(text: string): string;

		/**
		 * Applies html attribute encoding to supplied string
		 * @param text String to be encoded
		 * @return Attribute encoded string
		 */
		htmlAttributeEncode(text: string): string;

		/**
		 * Applies html decoding to supplied string
		 * @param text String to be decoded
		 * @return Attribute decoded string
		 */
		htmlDecode(text: string): string;
	}

	/**
	 * The class for PickFileOptions Information.
	 */
	export interface PickFileOptions {
		allowMultipleFiles?: boolean;
		maximumAllowedFileSize?: number;
		accept?: string | "audio/*" | "video/*" | "image/*";
	}

	/**
	 * The interface for capture image settings.
	 */
	export interface CaptureImageOptions {
		height: number;
		width: number;
		allowEdit: boolean;
		quality: number;
		preferFrontCamera: boolean;
	}

	/**
	 * The interface for File Information.
	 */
	export interface File {
		/**
		 * File name.
		 */
		fileName: string;

		/**
		 * Mime type.
		 */
		mimeType: string;

		/**
		 * File content.
		 */
		fileContent: string;

		/**
		 * Gets the file size.
		 */
		readonly fileSize: number;
	}

	/**
	 * Interface for Xrm.Navigation.
	 */
	export interface Navigation {
		/**
		 * Opens Alert Dialog
		 * @param alertStrings Strings to be used in alert dialog
		 * @param options Dialog options
		 * @returns promise defining success or failure of operation
		 */
		openAlertDialog(alertStrings: AlertDialogStrings, options?: AlertDialogOptions): Promise<AlertDialogResponse>;

		/**
		 * Opens Confirm Dialog
		 * @param confirmStrings String which will be used in the dialog
		 * @param options Options for the dialog
		 * @returns promise defining success or failure of operation. the success case returns a boolean specifying if yes or no button where pressed
		 */
		openConfirmDialog(
			confirmStrings: ConfirmDialogStrings,
			options?: ConfirmDialogOptions
		): Promise<ConfirmDialogResponse>;

		/**
		 * Opens a dialog.
		 * @param name name of the dialog.
		 * @param options entity form options.
		 * @param parameters entity form parameters.
		 * @returns promise defining success or failure of operation
		 */
		openDialog(name: string, options?: DialogOptions, parameters?: DialogParameters): Promise<DialogResponse>;

		/**
		 * Opens an Error Dialog.
		 * @param options Error Dialog options.
		 * @returns promise defining success or failure of operation.
		 */
		openErrorDialog(options: ErrorDialogOptions): Promise<ErrorDialogResponse>;

		/**
		 * Open a file.
		 * @param file file to be opened description.
		 * @param options Options for openFile.
		 *
		 * @remarks	 Values of openMode in OpenFileOptions:
		 *	   1  open
		 *	   2  save
		 *
		 * by default it will be "open" value, if options isn't passed.
		 */
		openFile(file: File, options?: OpenFileOptions): Promise<void>;

		/**
		 * Opens an entity form or quick create form.
		 * @param options entity form options.
		 * @param parameters entity form parameters.
		 * @returns promise defining success or failure of operation
		 */
		openForm(options: EntityFormOptions, parameters?: FormParameters): Promise<OpenFormSuccessResponse>;

		/**
		 * Navigates to the page specified by the page input parameter.
		 * @param input Input information that describes which page to load.
		 */
		navigateTo(input: PageInput): Promise<void>;

		/**
		 * Opens a task flow.
		 * @param name name of the task flow.
		 * @param options task flow options.
		 * @param parameters task flow parameters.
		 * @returns promise defining success or failure of operation
		 */
		openTaskFlow(name: string, options: TaskFlowOptions, parameters?: TaskFlowParameters): Promise<TaskFlowResponse>;

		/**
		 * Open url, including file urls.
		 * @param url url to be opened.
		 * @param options options for the url.
		 */
		openUrl(url: string, options?: OpenUrlOptions): void;

		/**
		 * Adds a handler to be called when the openURL is loaded
		 * @param   {EventHandler}   handler The handler.
		 */
		addOnOpenUrl(handler: XrmClientApi.EventHandler): void;

		/**
		 * Removes the handler from onOpenURL event
		 * @param   {EventHandler}   handler The handler.
		 */
		removeOnOpenUrl(handler: XrmClientApi.EventHandler): void;

		/**
		 * Opens an HTML web resource.
		 * @param name The name of the HTML web resource to open.
		 * @param options Window options for the web resource.
		 * @param data Data to be passed into the data parameter.
		 */
		openWebResource(name: string, options?: OpenWebResourceOptions, data?: string): void;
	}

	/**
	 * Interface for Xrm.Panel.
	 */
	export interface Panel {
		/*
		 * Indicates the panel position.
		 */
		position?: XrmClientApi.Constants.PanelPosition;

		/*
		 * Indicates the initial panel state.
		 */
		state?: XrmClientApi.Constants.PanelState;

		/*
		 * Indicates the initial panel title.
		 */
		title?: string;

		/*
		 * The URL currently loaded in the panel.
		 */
		readonly url: string;

		/*
		 * Width of the side panel in pixels.
		 */
		width?: number;

		/**
		 * Loads the side panel with the provided panel options
		 * @param options the desired options for the side panel
		 */
		loadPanel(options: PanelOptions): Promise<void>;

		/**
		 * Used to post a message to the Side Panel iFrame.
		 * @param message Message to send to the Side Panel iFrame.
		 */
		postMessage(message: any): void;

		/**
		 * Add a handler for listening to messages sent to Xrm Panel from the Side Panel iFrame.
		 * @param handler Handler to invoke when a message is sent to Xrm Panel
		 */
		addOnMessageReceived(handler: XrmClientApi.EventHandler): void;

		/**
		 * Remove a handler for listening to messages sent to Xrm Panel from the Side Panel iFrame.
		 * @param handler Handler to invoke when a message is sent to Xrm Panel
		 */
		removeOnMessageReceived(handler: XrmClientApi.EventHandler): void;

		/**
		 * Adds a handler to be called when the size of the panel is changed.
		 * @param handler The handler to add for this event.
		 */
		addOnSizeChange(handler: XrmClientApi.EventHandler): void;

		/**
		 * Removes a handler to be called when the size of the panel is changed.
		 * @param handler The handler to remove for this event.
		 */
		removeOnSizeChange(handler: XrmClientApi.EventHandler): void;

		/**
		 * Adds a handler to be called when the state of the panel is changed.
		 * @param handler The handler to add for this event.
		 */
		addOnStateChange(handler: XrmClientApi.EventHandler): void;

		/**
		 * Removes a handler to be called when the state of the panel is changed.
		 * @param handler The handler to remove for this event.
		 */
		removeOnStateChange(handler: XrmClientApi.EventHandler): void;
	}

	/**
	 * Interface that represents the options for the side panel
	 */
	export interface NewPanelOptions {
		/*
		 * Indicates the panel position.
		 */
		position?: XrmClientApi.Constants.PanelPosition;

		/*
		 * Indicates the initial panel state.
		 */
		state?: XrmClientApi.Constants.PanelState;

		/*
		 * Indicates the initial defaultCollapsedBehavior.
		 */
		defaultCollapsedBehavior?: boolean;

		/*
		 * Indicates the initial panel title.
		 */
		title?: string;

		/*
		 * The URL currently loaded in the panel.
		 */
		url: string;

		/*
		 * Width of the side panel in pixels.
		 */
		width?: number;
	}

	/**
	 * Interface that represents the old options for the side panel.  These are defined in XrmClientApiDeprecated.d.ts.
	 */
	export interface _OldPanelOptions {}

	// TODO: Can PanelOptions be better defined so as to not break old code and at the same time work once the old interfaces are removed?  Without allowing the old interface to be used when making the new call?
	export type PanelOptions = _OldPanelOptions | NewPanelOptions;

	/**
	 * Interface for a context-sensitive handler that can return a value
	 */
	export interface SessionEventHandler {
		/**
		 * @param	{EventContext}	context The event context.
		 */
		(context?: EventContext): any;
	}

	/**
	 * Input parameters for creating a new Session.
	 */
	export interface SessionInput {
		/**
		 * The input for the initial page to open when the session is created.
		 */
		pageInput: PageInput;

		/**
		 * Additional parameters of the new session.
		 */
		options?: SessionOptions;
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
	 * Additional parameters for new session creation.
	 */
	export interface SessionOptions {
		/**
		 * Whether or not the session can be closed.
		 */
		canBeClosed?: boolean;

		/**
		 * The title to use for this session.
		 */
		title?: string;

		/**
		 * The icon to use for this session.
		 */
		iconPath?: string;

		/**
		 * will focus after session is created.
		 */
		isFocused?: boolean;

		/**
		 * Update the the UI to indicate to the user that this session requires attention.
		 */
		isFocusRequested?: boolean;
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
	 * Interface for Xrm App object which contains functionality related to Application Shell.
	 */
	export interface App {
		sessions: AppSessions;
	}

	/**
	 * Interface of the XrmAppSessions object.
	 */
	export interface AppSessions {
		/**
		 * Returns the session corresponding to the id passed in.
		 * @param id ID of the session to return.
		 */
		getSession(id: string): AppSession;

		/**
		 * Returns the current focused session.
		 */
		getFocusedSession(): AppSession;

		/**
		 * Returns true if another session can be created.
		 */
		canCreateSession(): boolean;

		/**
		 * Create a new session
		 * @param input Input properties for creating a session
		 */
		createSession(input: SessionInput): Promise<string>;

		/**
		 * Gets the list of sessions currently open.
		 * @returns Returns array of sessionIds.
		 */
		getAll(): Collection.ItemCollection<AppSession>;

		/**
		 * Add a SessionCreate handler. Will be fired after session is created.
		 * @param handler handler to fire on session create.
		 */
		addOnAfterSessionCreate(handler: SessionEventHandler): string;

		/**
		 * Remove a SessionCreate handler.
		 * @param handlerId Identifier of handler to remove
		 */
		removeOnAfterSessionCreate(handlerId: string): void;

		/**
		 * Add a SessionClose handler. Will be fired after session is closed.
		 * @param handler handler to fire on session close.
		 */
		addOnAfterSessionClose(handler: SessionEventHandler): string;

		/**
		 * Remove a SessionClose handler.
		 * @param handlerId Identifier of handler to remove
		 */
		removeOnAfterSessionClose(handlerId: string): void;

		/**
		 * Add a SessionSwitch handler. Will be fired after session is switched.
		 * @param handler handler to fire on session switch.
		 */
		addOnAfterSessionSwitch(handler: SessionEventHandler): string;

		/**
		 * Remove a SessionSwitch handler.
		 * @param handlerId Identifier of handler to remove
		 */
		removeOnAfterSessionSwitch(handlerId: string): void;
	}

	/**
	 * Interface of the XrmAppSession object.
	 */
	export interface AppSession {
		/**
		 * The id of the session.
		 */
		sessionId: string;

		/**
		 * The title of the session.
		 */
		title: string;

		/**
		 * Indicates whether or not this session can be closed.
		 */
		canClose: boolean;

		/**
		 * Indicates whether or not this session is Default/Home session.
		 */
		isDefault: boolean;

		/**
		 * The tabs opened under this session.
		 */
		tabs: AppTabs;

		/**
		 * Sets the focus to this session.
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
	}

	/**
	 * Interface of the XrmAppTabs object.
	 */
	export interface AppTabs {
		/**
		 * Returns the tab corresponding to the tabId passed in.
		 */
		getTab(tabId: string): AppTab;

		/**
		 * Returns the focused tab.
		 */
		getFocusedTab(): AppTab;

		/**
		 * Can the user create a new tab
		 */
		canCreateTab(): boolean;

		/**
		 * Create a new tab
		 * @param input contains parameters for new tab creation
		 */
		createTab(input: TabInput): Promise<string>;

		/**
		 * Gets the list of tabs currently open.
		 * @returns Returns collection of tabs.
		 */
		getAll(): Collection.ItemCollection<AppTab>;
	}

	/**
	 * Interface for the XrmAppTab object.
	 */
	export interface AppTab {
		/**
		 * return the tab id of the tab.
		 */
		tabId: string;

		/**
		 * Returns the title of the tab.
		 */
		title: string;

		/**
		 * Returns whether this tab can be closed.
		 */
		canClose: boolean;

		/**
		 * Returns page url of current active page in tab
		 */
		currentUrl: string;

		/**
		 * Get the navigation history of this tab.
		 */
		history: AppTabHistory;

		/**
		 * Set the focus to this tab
		 */
		focus(): void;

		/**
		 * Close this tab
		 */
		close(): Promise<boolean>;

		/**
		 * Reload the contents of this tab.
		 */
		refresh(): Promise<void>;

		/**
		 * Perform a navigation within this tab.
		 */
		navigateTo(input: PageInput): Promise<void>;

		/**
		 * Return the session ID of the session containing this tab.
		 */
		getParentSessionId(): string;
	}

	/**
	 * Interface for the XrmAppTabHistory object.
	 */
	export interface AppTabHistory {
		/**
		 * Navigate back in the history of the tab.
		 */
		back(): Promise<void>;

		/**
		 * Clear the history of the tab.
		 */
		clear(): void;
	}

	/**
	 * Base interface for the information needed to load the page.
	 */
	export type PageInput =
		| CustomControlPageInput
		| SearchPageInput
		| EntityListPageInput
		| DashboardPageInput
		| FormPageInput
		| InlineDialogPageInput
		| WebResourcePageInput;

	/**
	 * Interface for the input class for navigating to a webresource page.
	 */
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
	 * Interface for the input class for navigating to a dashboard page.
	 */
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

	/**
	 * Interface for the input class for form page navigation
	 */
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
		relationship?: XrmClientApi.IRelationship;

		/**
		 * Indicates if there are any sync error
		 */
		isOfflineSyncError?: boolean;

		/**
		 * The optional data parameter that is specific to set field value/default value for a form
		 */
		data: FormParameters;
	}

	/**
	 * Interface for the input class for inline dialog navigation
	 */
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

	/**
	 * Interface for the input class for record list page navigation.
	 */
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

	/**
	 * Interface for the input class for custom control page navigation.
	 */
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

	/**
	 * Interface for the input class for search page navigation
	 */
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
		searchType?: Constants.SearchType;

		/**
		 * List of Entity for which we need to fetch result
		 */
		EntityNames?: string[];

		/**
		 * Entity Group Name
		 */
		EntityGroupName?: string;
	}

	/**
	 * Enum for the page type.
	 * Should match the URL value of page type
	 */
	export const enum PageType {
		control = "control",
		entityList = "entitylist",
		search = "search",
		dashboard = "dashboard",
		entityRecord = "entityrecord",
		inlineDialog = "inlinedialog",
		webresource = "webresource",
	}

	/**
	 * Enum for dashboard type
	 */
	export const enum DashboardType {
		system = "system",
		user = "user",
	}

	/**
	 * Enum for the view type.
	 */
	export const enum ViewType {
		savedView = "savedview",
		userView = "userview",
	}

	/**
	 * Interface for Xrm.Device.
	 */
	export interface Device {
		/**
		 * Capture image.
		 * @param options capture picture options.
		 */
		captureImage(options?: XrmClientApi.CaptureImageOptions): Promise<File>;

		/**
		 * Capture audio.
		 */
		captureAudio(): Promise<File>;

		/**
		 * Capture video.
		 */
		captureVideo(): Promise<File>;

		/**
		 * Pick one or more files from device
		 * @param options file pick options
		 */
		pickFile(options?: XrmClientApi.PickFileOptions): Promise<File[]>;

		/**
		 * Invoke camera to scan Barcode and returns the Scanned Barcode value as string
		 * In case of error, returns the ErrorResponse.
		 * @returns A deferred containing the Scanned Barcode value. Or, error response object.
		 */
		getBarcodeValue(): Promise<string>;

		/**
		 * Returns the current geolocation object.
		 * In case of error, returns the error object.
		 * @returns A deferred containing cordova geolocation object. Or, the error object.
		 */
		getCurrentPosition(): Promise<Position>;
	}

	/**
	 * Interface for Xrm.Utility.
	 */
	export interface Utility {
		/**
		 * Gets the entity metadata for the specified entity.
		 * @param entityType The logical name of the entity.
		 * @param attributes The attributes to get metadata for.
		 */
		getEntityMetadata(entityType: string, attributes?: string[]): Promise<EntityMetadata>;

		/**
		 * Gets the Xrm global context.
		 * @returns The Xrm global context.
		 */
		getGlobalContext(): GlobalContext;

		/**
		 * Opens a lookup dialog allowing the user to select one or more entities.
		 * @param	{LookupOptions} lookupOptions  Options for opening the lookup dialog.
		 * @returns XRM promise with array of entity reference.
		 */
		lookupObjects(lookupOptions: LookupOptions): Promise<LookupValue[]>;

		/**
		 * Gets the localized string from the web resource for the given key
		 * @param webResourceName name of the webresource
		 * @param key key for the localized string
		 * @returns localized string
		 */
		getResourceString(webResourceName: string, key: string): string;

		/**
		 * Displays a progress indicator while a long-running async action is in progress.
		 * @param message Message to display in the dialog.
		 */
		showProgressIndicator(message: string): void;

		/**
		 * Closes the progress indicator.
		 */
		closeProgressIndicator(): void;

		/**
		 * this function is not supported
		 * @param entityType entity type
		 * @param entityId entity id
		 */
		showHierarchyPage(entityType: string, entityId: string): void;

		/**
		 * Returns the allowed status transitions from the current status
		 * @param entityLogicalName entity logical name
		 * @param statusCode status code
		 */
		getAllowedStatusTransitions(entityLogicalName: string, stateCode: number): Promise<number[]>;

		/**
		 * Invokes the given process action
		 * @param name the name of the process action to invoke
		 * @param parameters the params to pass with the process action
		 * @returns Odata result along with any outputs from the PA
		 */
		invokeProcessAction(name: string, parameters?: { [parameter: string]: any }): Promise<{ [parameter: string]: any }>;

		/**
		 * refresh the grid from parent page
		 * @param lookupValue name of the entity to be refresh
		 */
		refreshParentGrid(lookupValue: XrmClientApi.LookupValue): void;

		/**
		 * Gets the DOM Attribute name expected by LearningPath
		 * for enumerating UI components
		 * @return LearningPath DOM Attrribute name
		 */
		getLearningPathAttributeName(): string;

		/**
		 * Executes a function in a web resource
		 * @param webResource The name of the web resource to load.
		 * @param method: The name of the method to be executed.
		 * @param parameters: An array of parameters to send to the function.
		 * @returns The return value of the executed method.
		 */
		executeFunction(webResource: string, method: string, parameters: {}[]): Promise<any>;
	}

	/**
	 * Interface for ApplicationUI.
	 */
	export interface ApplicationUI {
		/**
		 * Adds the global notification.
		 * @param type The type of the notification
		 * @param level The level of the notification.
		 * @param message The message of the notification.
		 * @param title The message of the notification.
		 * @param action The action of the notification.
		 * @param onCloseHandler The onCloseHandler for the notification.
		 * @returns promise defining success or failure of operation. the success case returns an Id of toast
		 */
		addGlobalNotification(
			type: XrmClientApi.Constants.GlobalNotificationType,
			level: XrmClientApi.Constants.GlobalNotificationLevel,
			message: string,
			title: string,
			action: XrmClientApi.ActionDescriptor,
			onCloseHandler: XrmClientApi.EventHandler
		): Promise<string>;

		/**
		 * Clears the global Notification.
		 * @param id The id of a GlobalNotification.
		 * @returns promise defining success or failure of operation
		 */
		clearGlobalNotification(id: string): Promise<void>;

		/**
		 * Clears all global Notifications.
		 * @returns promise defining success or failure of operation
		 */
		clearGlobalNotifications(): Promise<void>;
	}

	/**
	 * Interface for the client context.
	 */
	export interface ClientContext {
		/**
		 * Returns a value to indicate which client the script is executing in.
		 *
		 * @return	The client, as either "Web", "Outlook", or "Mobile"
		 */
		getClient(): string;

		/**
		 * Gets client's current state.
		 *
		 * @return	The client state, as either "Online" or "Offline"
		 */
		getClientState(): string;

		/**
		 * Gets information about the kind of device the user is using.
		 * @returns Information about the kind of device the user is using.
		 */
		getFormFactor(): Constants.FormFactor;

		/**
		 * Checks if server status is offline.
		 */
		isOffline(): boolean;
	}

	/**
	 * Interface for the XRM application context.
	 */
	interface GlobalContext {
		/**
		 * The user's localisation settings.
		 */
		userSettings: UserSettings;

		/**
		 * The client's context instance.
		 */
		client: ClientContext;

		/**
		 * organization variables for the organization
		 */
		organizationSettings: OrganizationSettings;

		/**
		 * Gets advanced config settings
		 */
		getAdvancedConfigSetting(setting: string): any;

		/**
		 * Gets client's base URL for Dynamics CRM
		 *
		 * @return	The client's base URL
		 * @remarks For Dynamics CRM On-Premises:	http(s)://server/org
		 * For Dynamics CRM Online:	 https://org.crm.dynamics.com
		 * For Dynamics CRM for Outlook (Offline):	http://localhost:2525
		 */
		getClientUrl(): string;

		/**
		 * Prefixes the current organization's unique name to a string; typically a URL path.
		 *
		 * @param	{string} sPath	 Local pathname of the resource.
		 *
		 * @return	A path string with the organization name.
		 *
		 * @remarks Format: "/"+ OrgName + sPath
		 */
		prependOrgName(sPath: string): string;

		/**
		 * returns true id the server is on premises
		 * @returns boolean indicating if the server is on-line of on-premises
		 */
		isOnPremises(): boolean;

		/**
		 * returns the version of the CRM
		 * @returns version of CRM
		 */
		getVersion(): string;

		/**
		 * Gets the Appmodule base URL that was used to access the application.
		 * @returns The Appmodule base URL used to access the application.
		 */
		getCurrentAppUrl(): string;

		/**
		 * Gets the name of the App that was used to access the application
		 * @returns Name of the App used to access the application
		 */
		getCurrentAppName(): Promise<string>;

		/**
		 * Gets the properties of the current Application.
		 * @returns dictionary of app properties.
		 */
		getCurrentAppProperties(): Promise<{ [key: string]: string }>;
	}

	/**
	 * Interface for the Xrm.Page.data object.
	 */
	export interface FormData {
		/**
		 * The record context of the form.
		 */
		entity: Entity;

		/**
		 * The process API for Xrm.Page.data.
		 *
		 * @remarks This member may be undefined when Process Flows are not used by the current entity.
		 */
		process: Process.ProcessManager;

		/**
		 * Collection of unbound data on the form
		 */
		attributes: XrmClientApi.Collection.ItemCollection<XrmClientApi.Attributes.Attribute>;

		/**
		 * Asynchronously refreshes data on the form, without reloading the page.
		 *
		 * @param	{boolean}	save true to save the record, after the refresh.
		 *
		 * @return	A Promise.
		 */
		refresh(save?: boolean): Promise<SuccessResponse>;

		/**
		 * Asynchronously saves the record.
		 *
		 * @return	AnPromise.
		 */
		save(saveOptions?: XrmClientApi.SaveOptions): Promise<SaveSuccessResponse>;

		/**
		 * Returns true if all of the form data is valid
		 */
		isValid(): boolean;

		/**
		 * Adds a handler to be called when the data is loaded
		 * @param	{EventHandler}	 handler The handler.
		 */
		addOnLoad(handler: EventHandler): void;

		/**
		 *	Removes the handler from the "on load" event.
		 * @param	{EventHandler}	 handler The handler.
		 */
		removeOnLoad(handler: EventHandler): void;

		/**
		 * Gets a value indicating whether the form data has been modified.
		 * @returns A value indicating whether the form data is dirty.
		 */
		getIsDirty(): boolean;
	}

	/**
	 * Interface for the Xrm.Page.ui object on dashboards.
	 */
	export interface DashboardUi {
		/**
		 * A reference to the collection of controls on the form.
		 */
		controls: Collection.ItemCollection<Controls.Control>;

		/**
		 * The form selector API.
		 *
		 * @remarks This API does not exist with Microsoft Dynamics CRM for tablets.
		 */
		formSelector: Controls.FormSelector<XrmClientApi.DashboardSelectorItem>;

		/**
		 * A reference to the collection of tabs on the form.
		 */
		tabs: Collection.ItemCollection<Controls.Tab>;

		/**
		 * Re-evaluates the ribbon's configured EnableRules
		 * @param refreshAll If true, all command bars on the current page are refreshed. Otherwise only the page-level command bar is refreshed (defaults value false).
		 */
		refreshRibbon(refreshAll?: boolean): void;
	}

	/**
	 * Interface for the Xrm.Page.ui object.
	 */
	export interface FormUi {
		/**
		 * The process API for Xrm.Page.ui.
		 *
		 * @remarks This member may be undefined when Process Flows are not used by the current entity.
		 */
		process: Controls.ProcessControl;

		/**
		 * A reference to the collection of controls on the form.
		 */
		controls: Collection.ItemCollection<Controls.Control>;

		/**
		 * The form selector API.
		 *
		 * @remarks This API does not exist with Microsoft Dynamics CRM for tablets.
		 */
		formSelector: Controls.FormSelector<XrmClientApi.FormSelectorItem>;

		/**
		 * The navigation API.
		 *
		 * @remarks This API does not exist with Microsoft Dynamics CRM for tablets.
		 */
		navigation: Controls.FormNavigation;

		quickForms: Collection.ItemCollection<Controls.QuickFormControl>;

		/**
		 * A reference to the collection of tabs on the form.
		 */
		tabs: Collection.ItemCollection<Controls.Tab>;

		/**
		 * The header section.
		 *
		 * @remarks This API returns header section of the form.
		 */
		headerSection: Controls.Section;

		/**
		 * The footer section.
		 *
		 * @remarks This API returns footer section of the form.
		 */
		footerSection: Controls.Section;

		/**
		 * Clears the form notification described by uniqueId.
		 *
		 * @param	{string} uniqueId Unique identifier.
		 *
		 * @return	true if it succeeds, otherwise false.
		 */
		clearFormNotification(uniqueId: string): boolean;

		/**
		 * Closes the form.
		 */
		close(): void;

		/**
		 * Gets form type.
		 *
		 * @return	The form type.
		 *
		 * @remarks	 Values returned are: 0	 Undefined
		 *	   1  Create
		 *	   2  Update
		 *	   3  Read Only
		 *	   4  Disabled
		 *	   6  Bulk Edit
		 *	Deprecated values are 5 (Quick Create), and 11 (Read Optimized)
		 */
		getFormType(): Constants.FormType;

		/**
		 * Gets view port height.
		 *
		 * @return	The view port height, in pixels.
		 *
		 * @remarks This method does not work with Microsoft Dynamics CRM for tablets.
		 */
		getViewPortHeight(): number;

		/**
		 * Gets view port width.
		 *
		 * @return	The view port width, in pixels.
		 *
		 * @remarks This method does not work with Microsoft Dynamics CRM for tablets.
		 */
		getViewPortWidth(): number;

		/**
		 * Re-evaluates the ribbon's configured EnableRules
		 * @param refreshAll If true, all command bars on the current page are refreshed. Otherwise only the page-level command bar is refreshed (defaults value false).
		 */
		refreshRibbon(refreshAll?: boolean): void;

		/**
		 * Sets the name of the entity that will be displayed on the form.
		 */
		setFormEntityName(name: string): void;

		/**
		 * Sets a form-level notification.
		 *
		 * @param	{string} message  The message.
		 * @param	{"ERROR"}	level An error message.
		 * @param	{string} uniqueId A unique identifier for the message.
		 *
		 * @return	true if it succeeds, false if it fails.
		 */
		setFormNotification(message: string, level: "ERROR", uniqueId: string): boolean;

		/**
		 * Sets a form-level notification.
		 *
		 * @param	{string} message  The message.
		 * @param	{"WARNING"} level A warning message.
		 * @param	{string} uniqueId A unique identifier for the message.
		 *
		 * @return	true if it succeeds, false if it fails.
		 */
		setFormNotification(message: string, level: "WARNING", uniqueId: string): boolean;

		/**
		 * Sets a form-level notification.
		 *
		 * @param	{string} message  The message.
		 * @param	{"INFO"} level An informational message.
		 * @param	{string} uniqueId A unique identifier for the message.
		 *
		 * @return	true if it succeeds, false if it fails.
		 */
		setFormNotification(message: string, level: "INFO", uniqueId: string): boolean;

		/**
		 * Sets a form-level notification.
		 *
		 * @param	{string} message  The message.
		 * @param	{string} level The level, as either "ERROR", "WARNING", or "INFO".
		 * @param	{string} uniqueId A unique identifier for the message.
		 *
		 * @return	true if it succeeds, otherwise false.
		 */
		setFormNotification(message: string, level: string, uniqueId: string): boolean;

		/**
		 * Adds a handler to form onLoad
		 * @param handler function to be fired on load
		 */
		addOnLoad(handler: EventHandler): void;

		/**
		 * Removes given function from onLoad
		 * @param handler function to be removed
		 */
		removeOnLoad(handler: EventHandler): void;

		/**
		 * refresh the UI and fire the on-load event
		 */
		refresh(): Promise<XrmClientApi.SuccessResponse>;
	}

	/**
	 * Interface for the Xrm.Page.ui.navigableFormUi object.
	 */
	export interface NavigableFormUi {
		/**
		 * Gets the name of the default next page for navigation.
		 * The value returned will be the page navigated to on MoveNext when no branching logic is present.
		 * @returns The name of the default next page for navigation.
		 */
		getDefaultNextPageName(): string;

		/**
		 * Moves to the previous page.
		 */
		movePrevious(): void;

		/**
		 * Moves to the specified page.
		 * @param pageName The name of the page to navigate to.
		 */
		moveTo(pageName: string): void;
	}

	/**
	 * The interface for the Calendar exposed in DateFormattingInfo
	 */
	interface Calendar {
		MinSupportedDateTime: Date; // "/Date(-62135568000000)/"
		MaxSupportedDateTime: Date; // "/Date(253402300799999)/"
		AlgorithmType: number; // 1
		CalendarType: number; // 1
		Eras: number[]; // [1]
		TwoDigitYearMax: number; //2029
		IsReadOnly: boolean; // false
	}

	/**
	 * The interface for Org Date Format Info exposed to a custom control
	 * Comments indicate example values
	 */
	interface DateFormattingInfo {
		AMDesignator: string; // "AM"
		AbbreviatedDayNames: string[]; // { "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" }
		AbbreviatedMonthGenitiveNames: string[]; // { "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "" }
		AbbreviatedMonthNames: string[]; // { "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "" }
		CalendarWeekRule: number; // 0
		Calendar: Calendar;
		DateSeparator: string; // "/"
		DayNames: string[]; // { "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" }
		FirstDayOfWeek: Constants.DayOfWeek;
		FullDateTimePattern: string; // "dddd, MMMM d, yyyy h:mm:ss tt"
		LongDatePattern: string; // "dddd, MMMM d, yyyy"
		LongTimePattern: string; // "h:mm:ss tt"
		MonthDayPattern: string; // "MMMM dd"
		MonthGenitiveNames: string[]; // { "January", "February", "March", ...	 "December", "" }
		MonthNames: string[]; // { "January", "February", "March", ...	"December", "" }
		PMDesignator: string; // "PM"
		ShortDatePattern: string; // "M/d/yyyy"
		ShortTimePattern: string; // "h:mm tt"
		ShortestDayNames: string[]; // { "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" }
		SortableDateTimePattern: string; // "yyyy'-'MM'-'dd'T'HH':'mm':'ss"
		TimeSeparator: string; // ":"
		UniversalSortableDateTimePattern: string; // "yyyy'-'MM'-'dd HH':'mm':'ss'Z'"
		YearMonthPattern: string; // "MMMM yyyy"
	}

	/**
	 * interface for user settings
	 */
	export interface UserSettings {
		/**
		 * user longuage id
		 */
		languageId: number;

		/**
		 * The user ID.(User ID).
		 */
		userId: string;

		/**
		 * The user Name.(User Name).
		 */
		userName: string;

		/**
		 * Returns a collection of SecurityRole objects.
		 *  The role ID is the key.
		 */
		roles: Collection.ItemCollection<SecurityRole>;

		/**
		 * The user security roles.(Security Roles).
		 */
		securityRoles: string[];

		/**
		 * The user security roles.(Security Role Privileges).
		 */
		securityRolePrivileges: string[];

		/**
		 * Returns true if guided help is enabled
		 */
		isGuidedHelpEnabled: boolean;

		/**
		 * Returns true if High Contrast is enabled
		 */
		isHighContrastEnabled: boolean;

		/**
		 * Returns true if the language is right to left
		 */
		isRTL: boolean;

		/**
		 * Returns true if email conversation view is enabled
		 */
		isEmailConversationViewEnabled: boolean;

		/**
		 * Returns the transaction currency id.
		 */
		transactionCurrencyId: string;

		/**
		 * Returns the data formatting info.
		 */
		dateFormattingInfo: DateFormattingInfo;

		/**
		 * Returns the default dashboard id.
		 */
		defaultDashboardId: string;

		/**
		 * Return the transaction currency.
		 */
		transactionCurrency: XrmClientApi.LookupValue;

		/**
		 * Returns the difference between the local time and Coordinated Universal Time (UTC).
		 *
		 * @return	The time zone offset, in minutes.
		 */
		getTimeZoneOffsetMinutes(): number;
	}

	/**
	 * Interface for Security Roles
	 */
	export interface SecurityRole {
		/**
		 * The security role ID (GUID).
		 * The ID is formatted in all lower case without curly braces.
		 */
		id: string;

		/**
		 * The security role name.
		 */
		name: string;
	}

	/**
	 * interface for organization settings
	 */
	export interface OrganizationSettings {
		/**
		 * language code for the organization
		 */
		languageId: number;

		/**
		 * Indicates if auto-save is enabled for the organization
		 */
		isAutoSaveEnabled: boolean;

		/**
		 * Indicates if AppointmentRichEditorExperience is enabled for the organization
		 */
		appointmentRichEditorExperience: boolean;

		/**
		 *  Unique name of the organization
		 */
		uniqueName: string;

		/**
		 * All attributes of the org entity that are available.
		 */
		attributes: { [key: string]: any };

		/**
		 * Organization GUID
		 */
		organizationId: string;

		/**
		 * returns the default country code for phone number
		 */
		defaultCountryCode: string;

		/**
		 * returns true if Skype protocol is enabled
		 */
		useSkypeProtocol: boolean;

		/**
		 * The base currency the organization.
		 */
		baseCurrencyId: string;

		/**
		 * Return the base currency.
		 */
		baseCurrency: XrmClientApi.LookupValue;

		/**
		 * Returns true if Yammer is enabled
		 */
		isYammerConfigured: boolean;
	}

	/**
	 * Called when the operation is successful.
	 */
	export type SuccessCallbackDelegate<T> = (successParameter: T) => void;

	/**
	 * Called when the operation fails.
	 */
	export type ErrorCallbackDelegate<T> = (errorParameter: T) => void;

	/**
	 * A definition module for collection interface declarations.
	 */
	export namespace Collection {
		/**
		 * Interface for a matching delegate.
		 *
		 * @tparam	T	Generic type parameter.
		 */
		export interface MatchingDelegate<T> {
			/**
			 * Called for each item in an array
			 *
			 * @param	{T} item   The item.
			 * @param	{number} index	 Zero-based index of the item array.
			 *
			 * @return	true if the item matches, false if it does not.
			 */
			(item: T, index: number): boolean;
		}

		/**
		 * Interface for iterative delegate.
		 *
		 * @tparam	T	Generic type parameter.
		 */
		export interface IterativeDelegate<T> {
			/**
			 * Called for each item in an array
			 *
			 * @param	{T} item   The item.
			 * @param	{number} index	 Zero-based index of the item array.
			 */
			(item: T, index: number): void;
		}

		/**
		 * Interface for an item collection.
		 *
		 * @tparam	T	Generic type parameter.
		 */
		export interface ItemCollection<T> {
			/**
			 * Applies an operation to all items in this collection.
			 *
			 * @param	{IterativeDelegate{T}}	delegate An iterative delegate function
			 */
			forEach(delegate: IterativeDelegate<T>): void;

			/**
			 * Gets.
			 *
			 * @param	{MatchingDelegate{T}}	delegate A matching delegate function
			 *
			 * @return	A T[] whose members have been validated by delegate.
			 */
			get(delegate: MatchingDelegate<T>): T[];

			/**
			 * Gets the item given by the index.
			 *
			 * @param	{number} itemNumber	 The item number to get.
			 *
			 * @return	The T in the itemNumber-th place.
			 */
			get(itemNumber: number): T;

			/**
			 * Gets the item given by the key.
			 *
			 * @param	{string} itemName The item name to get.
			 *
			 * @return	The T matching the key itemName.
			 *
			 * @see {@link Xrm.Page.Control.getName()} for Control-naming schemes.
			 */
			get(itemName: string): T;

			/**
			 * Gets the entire array of T.
			 *
			 * @return	A T[].
			 */
			get(): T[];

			/**
			 * Gets the length of the collection.
			 *
			 * @return	The length.
			 */
			getLength(): number;
		}
	}

	/**
	 * Interface for the event context.
	 */
	export interface EventContext {
		/**
		 * Gets the Xrm context.
		 *
		 * @return	The Xrm context.
		 */
		getContext(): GlobalContext;

		/**
		 * Gets the handler's depth, which is the order in which the handler is executed.
		 *
		 * @return	The depth, a 0-based index.
		 */
		getDepth(): number;

		/**
		 * Gets save-event arguments.
		 *
		 * @return	The event arguments.
		 *
		 * @remarks Returns null for all but the "save" event.
		 */
		getEventArgs(): EventArguments;

		/**
		 * Gets a reference to the object for which event occurred.
		 *
		 * @return	The event source.
		 */
		getEventSource(): Attributes.Attribute | Entity;

		/**
		 * Gets the form context.
		 * @returns The form context.
		 */
		getFormContext(): XrmClientApi.Form;

		/**
		 * Gets the shared variable with the specified key.
		 *
		 * @tparam	T	Generic type parameter.
		 * @param	{string} key The key.
		 *
		 * @return	The shared variable.
		 *
		 * @remarks Used to pass values between handlers of an event.
		 */
		getSharedVariable<T>(key: string): T;

		/**
		 * Sets a shared variable.
		 *
		 * @tparam	T	Generic type parameter.
		 * @param	{string} key The key.
		 * @param	{T} value The value.
		 *
		 * @remarks Used to pass values between handlers of an event.
		 */
		setSharedVariable<T>(key: string, value: T): void;
	}

	/**
	 * The User's action.
	 */
	interface ActionDescriptor {
		eventHandler: XrmClientApi.EventHandler;
		actionLabel: string;
	}

	/**
	 * The Timeout's action.
	 */
	interface TimeoutActionDescriptor extends ActionDescriptor {
		/**
		 * Number of millisecond to wait before executing the event Handler
		 */
		timeout: number;
	}

	/**
	 * A UI notification on a control.
	 */
	interface BusinessRuleNotification {
		uniqueId: string;
		messages: string[];
		priority: number;
		notificationLevel: string;
		actions?: ActionCollection[];
	}

	/**
	 * Structure of Action Collection
	 */
	interface ActionCollection {
		/* Collection of actions for control */
		actions?: (() => void)[];

		/* Notification messages for control */
		message?: string;
	}

	/**
	 * Interface for a Lookup value.
	 */
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

	/**
	 * Interface for an OptionSet value.
	 */
	export interface OptionSetItem {
		/**
		 * The label text.
		 */
		text: string;

		/**
		 * The value, as a string.
		 *
		 * @remarks	 You must use parseInt to convert this value to a number before you can use it to
		 *	set the value of an OptionSetAttribute.
		 */
		value: number;
	}

	/**
	 * Interface for a privilege.
	 */
	export interface AttributePrivilege {
		/**
		 * true if the user can read.
		 */
		canRead: boolean;

		/**
		 * true if the user can update.
		 */
		canUpdate: boolean;

		/**
		 * true if the user can create.
		 */
		canCreate: boolean;
	}

	/**
	 * Interface for a context-sensitive handler.
	 */
	export interface EventHandler {
		/**
		 * @param	{EventContext}	context The event context.
		 */
		(context?: EventContext): void;
	}

	export namespace Attributes {
		/**
		 * Interface for an Entity attribute.
		 */
		export interface Attribute {
			/**
			 * A collection of all the controls on the form that interface with this attribute.
			 */
			controls: Collection.ItemCollection<Controls.DataControl>;

			/**
			 * Adds a handler to be called when the attribute's value is changed.
			 *
			 * @param	{EventHandler}	handler The function reference.
			 */
			addOnChange(handler: EventHandler): void;

			/**
			 * Fire all "on change" event handlers.
			 */
			fireOnChange(): void;

			/**
			 * Gets attribute type.
			 *
			 * @return	The attribute's type name.
			 *
			 * @remarks Values returned are: boolean
			 *	  datetime
			 *	  decimal
			 *	  double
			 *	  integer
			 *	  lookup
			 *	  memo
			 *	  money
			 *	  optionset
			 *	  string
			 */
			getAttributeType(): string;

			/**
			 * Gets the attribute format.
			 *
			 * @return	The format of the attribute.
			 *
			 * @see {@link getAttributeType()}
			 *
			 * @remarks Values returned are: date  (datetime)
			 *	  datetime (datetime)
			 *	  duration (integer)
			 *	  email (string)
			 *	  language (optionset)
			 *	  none	(integer)
			 *	  phone (string)
			 *	  text	(string)
			 *	  textarea (string)
			 *	  tickersymbol	 (string)
			 *	  timezone (optionset)
			 *	  url	(string)
			 */
			getFormat(): string;

			/**
			 * Gets a boolean value indicating whether this Attribute has unsaved changes.
			 *
			 * @return	true if there are unsaved changes, otherwise false.
			 */
			getIsDirty(): boolean;

			/**
			 * Gets the logical name of the attribute.
			 *
			 * @return	The logical name.
			 */
			getName(): string;

			/**
			 * Gets a reference to the record context of this attribute.
			 *
			 * @return	The parent record context.
			 */
			getParent(): Entity;

			/**
			 * Gets the current level of requirement for the attribute.
			 *
			 * @return	The required level, as either "none", "required", or "recommended"
			 */
			getRequiredLevel(): string;

			/**
			 * Gets current submit mode for the attribute.
			 *
			 * @return	The submit mode, as either "always", "never", or "dirty"
			 *
			 * @remarks The default value is "dirty"
			 */
			getSubmitMode(): string;

			/**
			 * Gets the current user's privileges for the attribute.
			 *
			 * @return	The user privileges.
			 */
			getUserPrivilege(): AttributePrivilege;

			/**
			 * gets te value of the attribute
			 *
			 * @return return the value of attribute
			 */
			getValue(): any;

			/**
			 * set the value of the attribute
			 * @param value the value to be set
			 */
			setValue(value: any): void;

			/**
			 * Removes the handler from the "on change" event.
			 *
			 * @param	{EventHandler}	 handler The handler.
			 */
			removeOnChange(handler: EventHandler): void;

			/**
			 * Sets required level.
			 *
			 * @param	{"none"} requirementLevel Not required.
			 */
			setRequiredLevel(requirementLevel: "none"): void;

			/**
			 * Sets required level.
			 *
			 * @param	{"required"} requirementLevel Required.
			 */
			setRequiredLevel(requirementLevel: "required"): void;

			/**
			 * Sets required level.
			 *
			 * @param	{"recommended"} requirementLevel Recommended.
			 */
			setRequiredLevel(requirementLevel: "recommended"): void;

			/**
			 * Sets the required level.
			 *
			 * @param	{string} requirementLevel The requirement level, as either "none", "required", or "recommended"
			 */
			setRequiredLevel(requirementLevel: string): void;

			/**
			 * Sets submit mode.
			 *
			 * @param	{"always"} submitMode  Always submit this attribute.
			 */
			setSubmitMode(submitMode: "always"): void;

			/**
			 * Sets submit mode.
			 *
			 * @param	{"never"} submitMode  Never submit this attribute.
			 */
			setSubmitMode(submitMode: "never"): void;

			/**
			 * Sets submit mode.
			 *
			 * @param	{"dirty"} submitMode  Submit this attribute when changed.
			 */
			setSubmitMode(submitMode: "dirty"): void;

			/**
			 * Sets the submit mode.
			 *
			 * @param	{string} submitMode	 The submit mode, as either "always", "never", or "dirty".
			 *
			 * @remarks The default value is "dirty"
			 */
			setSubmitMode(submitMode: string): void;

			/**
			 * returns true if the value of the attribute isvalid
			 */
			isValid(): boolean;
		}

		/**
		 * Interface for a Number attribute.
		 *
		 * @sa	Attribute
		 */
		export interface NumberAttribute extends Attribute {
			/**
			 * Gets the maximum value allowed.
			 *
			 * @return	The maximum value allowed.
			 */
			getMax(): number;

			/**
			 * Gets the minimum value allowed.
			 *
			 * @return	The minimum value allowed.
			 */
			getMin(): number;

			/**
			 * Gets the attribute's configured precision.
			 *
			 * @return	The total number of allowed decimal places.
			 */
			getPrecision(): number;

			/**
			 * Gets the value.
			 *
			 * @return	The value.
			 */
			getValue(): number;

			/**
			 * Sets the value.
			 *
			 * @param	{number} value	 The value.
			 */
			setValue(value: number): void;

			/**
			 * Sets the precision.
			 *
			 * @param	{precision} precision	The precision.
			 */
			setPrecision(precision: number): void;
		}

		/**
		 * Interface for a String attribute.
		 *
		 * @sa	Attribute
		 */
		export interface StringAttribute extends Attribute {
			/**
			 * Gets maximum length allowed.
			 *
			 * @return	The maximum length allowed.
			 *
			 * @remarks The email form's "Description" attribute does not have the this method.
			 */
			getMaxLength(): number;

			/**
			 * Gets the value.
			 *
			 * @return	The value.
			 */
			getValue(): string;

			/**
			 * Sets the value.
			 *
			 * @param	{string} value	 The value.
			 *
			 * @remarks	 A String field with the {@link Attribute.getFormat|email} format enforces email
			 *	address formatting. Attributes on Quick Create Forms will not save values set
			 *	with this method.
			 */
			setValue(value: string): void;
		}

		/**
		 * Interface for a Boolean attribute.
		 *
		 * @sa	Attribute
		 */
		export interface BooleanAttribute extends OptionSetBase {
			/**
			 * Gets the initial value of the attribute.
			 *
			 * @return	The initial value.
			 * @remarks Valid for optionset and boolean attribute types
			 */
			getInitialValue(): number;

			/**
			 * Gets the value.
			 *
			 * @return	true if it succeeds, false if it fails.
			 */
			getValue(): boolean;

			/**
			 * Sets the value.
			 *
			 * @param	{boolean}	value	The value.
			 *
			 * @remarks	 Attributes on Quick Create Forms will not save values set with this method.
			 */
			setValue(value: boolean): void;
		}

		/**
		 * Interface for a Date attribute.
		 *
		 * @sa	Attribute
		 */
		export interface DateAttribute extends Attribute {
			/**
			 * Gets the value.
			 *
			 * @return	The value.
			 */
			getValue(): Date;

			/**
			 * Gets the Utc value.
			 *
			 * @return	The Utc value.
			 */
			getUtcValue(): Date;

			/**
			 * Sets the value.
			 *
			 * @param	{Date}	value	The value.
			 *
			 * @remarks	 Attributes on Quick Create Forms will not save values set with this method.
			 */
			setValue(value: Date): void;

			/**
			 * Sets the Utc value.
			 *
			 * @param	{Date}	value	The Utc value.
			 *
			 * @remarks	 Attributes on Quick Create Forms will not save values set with this method.
			 */
			setUtcValue(value: Date): void;
		}

		/**
		 * Interface for a OptionSetBase.
		 *
		 * @sa	Attribute
		 */
		export interface OptionSetBase extends Attribute {
			/**
			 * Gets the option matching a value.
			 *
			 * @param	{number} value	 The enumeration value of the option desired.
			 *
			 * @return	The option.
			 */
			getOption(value: number): OptionSetItem;

			/**
			 * Gets the option matching a label.
			 *
			 * @param	{string} label	 The enumeration value of the option desired.
			 *
			 * @return	The option.
			 */
			getOption(label: string): OptionSetItem;

			/**
			 * Gets all of the options.
			 *
			 * @return	An array of options.
			 */
			getOptions(): OptionSetItem[];
		}

		/**
		 * Interface an OptionSet attribute.
		 *
		 * @sa	OptionSetBase
		 */
		export interface OptionSetAttribute extends OptionSetBase {
			/**
			 * Gets the initial value of the attribute.
			 *
			 * @return	The initial value.
			 * @remarks Valid for optionset and boolean attribute types
			 */
			getInitialValue(): number;

			/**
			 * Gets selected option.
			 *
			 * @return	The selected option.
			 */
			getSelectedOption(): OptionSetItem;

			/**
			 * Gets the label of the currently selected option.
			 *
			 * @return	The current value's label.
			 */
			getText(): string;

			/**
			 * Gets the value.
			 *
			 * @return	The value.
			 */
			getValue(): number;

			/**
			 * Sets the value.
			 *
			 * @param	{number} value	 The value.
			 *
			 * @remarks	 The getOptions() method returns option values as strings. You must use parseInt
			 *	to convert them to numbers before you can use those values to set the value of an
			 *	OptionSet attribute. Attributes on Quick Create Forms will not save values set
			 *	with this method.
			 */
			setValue(value: number): void;
		}

		/**
		 * Interface for an Entity Type OptionSet attribute.
		 */
		export interface EntityTypeOptionSetAttribute extends Attribute {
			/**
			 * Gets the value.
			 *
			 * @return	The value.
			 */
			getValue(): string;

			/**
			 * Sets the value.
			 *
			 * @param	{string} value	 The value.
			 */
			setValue(value: string): void;
		}

		/*
		 * Interface a MultiSelect OptionSet attribute.
		 *
		 * @sa	OptionSetBase
		 */
		export interface MultiSelectOptionSetAttribute extends OptionSetBase {
			/**
			 * Gets the initial value of the attribute.
			 *
			 * @return	The initial value.
			 * @remarks Valid for optionset and boolean attribute types
			 */
			getInitialValue(): number[];

			/**
			 * Gets selected option.
			 *
			 * @return	The selected option.
			 */
			getSelectedOption(): OptionSetItem[];

			/**
			 * Gets the label of the currently selected option.
			 *
			 * @return	The current value's label.
			 */
			getText(): string[];

			/**
			 * Gets the value.
			 *
			 * @return	The value.
			 */
			getValue(): number[];

			/**
			 * Sets the value.
			 *
			 * @param	{number[]} value	 The value.
			 *
			 * @remarks	 The getOptions() method returns option values as strings. You must use parseInt
			 *	to convert them to numbers before you can use those values to set the value of an
			 *	OptionSet attribute. Attributes on Quick Create Forms will not save values set
			 *	with this method.
			 */
			setValue(value: number[]): void;
		}

		/**
		 * Interface a Lookup attribute.
		 *
		 * @sa	Attribute
		 */
		export interface LookupAttribute extends Attribute {
			/**
			 * Gets a boolean value indicating whether the Lookup is a multi-value PartyList.
			 *
			 * @return	true the attribute is a PartyList, otherwise false.
			 */
			getIsPartyList(): boolean;

			/**
			 * Gets the value.
			 *
			 * @return	An array of LookupValue.
			 */
			getValue(): LookupValue[];

			/**
			 * Sets the value.
			 *
			 * @param	{LookupValue[]} value	The value.
			 *
			 * @remarks Attributes on Quick Create Forms will not save values set with this method.
			 */
			setValue(value: LookupValue[]): void;
		}
	}

	/**
	 * Interface for the form's record context, Xrm.Page.data.entity
	 */
	export interface Entity {
		/**
		 * The collection of attributes for the record.
		 */
		attributes: Collection.ItemCollection<Attributes.Attribute>;

		/**
		 * the list of related entity
		 */
		relatedEntities: XrmClientApi.Collection.ItemCollection<Entity>;

		/**
		 * Adds a handler to be called when the record is saved.
		 *
		 * @param	{EventHandler}	 handler The handler.
		 */
		addOnSave(handler: EventHandler): void;

		/**
		 * Gets an serialized-XML string representing data that will be passed to the server upon saving
		 * the record.
		 * @return	The XML in string format.
		 * @remarks	 This function does not work with Microsoft Dynamics CRM for tablets. Example:
		 *	"<account><name>Contoso</name><accountnumber>55555</accountnumber><telephone2>425
		 *	555-1234</telephone2></account>".
		 */
		getDataXml(): string;

		/**
		 * Returns a LookupValue that references this record.
		 * NOTE: This is not yet published for Entity, but is for GridEntity, so including here for compatibility.
		 *
		 * @return	The entity reference.
		 */
		getEntityReference(): LookupValue;

		/**
		 * Gets entity's logical name.
		 *
		 * @return	The logical name.
		 */
		getEntityName(): string;

		/**
		 * Gets the record's unique identifier.
		 *
		 * @return	The identifier, in Guid format.
		 *
		 * @remarks	 Example: "{825CB223-A651-DF11-AA8B-00155DBA3804}".
		 */
		getId(): string;

		/**
		 * Gets a boolean value indicating whether the record has unsaved changes.
		 *
		 * @return	true if there are unsaved changes, otherwise false.
		 */
		getIsDirty(): boolean;

		/**
		 * Gets the record's primary attribute value.
		 *
		 * @return	The primary attribute value.
		 *
		 * @remarks The value for this attribute is used when links to the record are displayed.
		 */
		getPrimaryAttributeValue(): string;

		/**
		 * Removes the handler from the "on save" event.
		 *
		 * @param	{EventHandler}	 handler The handler.
		 */
		removeOnSave(handler: EventHandler): void;

		/**
		 * Saves the record.
		 * @param action saveOptions specifies the save mode
		 */
		save(action?: XrmClientApi.SaveOptions): void;

		/**
		 * Returns true if all of the entity data is valid
		 */
		isValid(): boolean;

		/**
		 * sets the id of the record if its in create record
		 * @param id GUID to be set
		 */
		setRecordId(id: string): void;
	}

	/**
	 * Interface for session close event arguments
	 *
	 */
	export interface SessionEventArguments extends EventArguments {
		/**
		 * Returns a boolean value to indicate if the record's close has been prevented.
		 *
		 * @return	true if close is prevented, otherwise false.
		 */
		isDefaultPrevented(): boolean;

		/**
		 * Prevents the close operation from being submitted to the server.
		 * @remarks All remaining "on close" handlers will continue execution.
		 */
		preventDefault(): void;
	}

	export interface SessionArguments extends XrmClientApi.EventArguments {
		sessionId: string;
	}

	/**
	 * Interface for SessionSwitch Arguments
	 */
	export interface SessionFocusChangeArguments extends XrmClientApi.EventArguments {
		/**
		 * New session Id
		 */
		newSessionId: string;

		/**
		 * Previous session Id
		 */
		previousSessionId: string;
	}

	/**
	 * Interface for save event arguments.
	 */
	export interface SaveEventArguments extends PreventDefaultEventArguments {
		/**
		 * Gets save mode, as an integer.
		 *
		 * @return	The save mode.
		 * @remarks Values returned are: 1	 Save
		 *	  2	  Save and Close
		 *	  59  Save and New
		 *	  70  AutoSave (Where enabled; can be used with an OnSave handler
		 *	 to conditionally disable auto-saving)
		 *	  58  Save as Completed (Activities)
		 *	  5	  Deactivate
		 *	  6	  Reactivate
		 *	  47  Assign (All user- or team-owned entities)
		 *	  7	  Send (Email)
		 *	  16  Qualify (Lead)
		 *	  15  Disqualify (Lead)
		 */
		getSaveMode(): Constants.SaveMode;
	}

	/**
	 * Event Argument
	 */
	export interface EventArguments {}

	/**
	 * Interface for event that support prevent default
	 */
	export interface PreventDefaultEventArguments extends EventArguments {
		/**
		 * Returns a boolean value to indicate if the default event has been prevented.
		 *
		 * @return	true if default event is prevented, otherwise false.
		 */
		isDefaultPrevented(): boolean;

		/**
		 * Prevents the default event operation from being fired.
		 * @remarks All remaining event handlers will continue execution.
		 */
		preventDefault(): void;
	}

	/**
	 * Interface for onOpenUrl event arguments.
	 */
	export interface OnOpenUrlEventArguments extends PreventDefaultEventArguments {
		/**
		 * Url Provided to OpenURl
		 */
		url: string;
	}

	/**
	 * Interface for post message event arguments.
	 */
	export interface PostMessageArguments extends XrmClientApi.EventArguments {
		/**
		 * The post message data being sent.
		 */
		message: any;

		/**
		 * The origin of the iframe where this post message originated.
		 */
		origin: string;
	}

	/**
	 * Interface for the XRM status.
	 */
	export interface XrmStatus extends XrmClientApi.EventArguments {
		mainForm?: XrmClientApi.Form;
		mainGrid?: XrmClientApi.Controls.GridControl;
		pageType: string;
		xrmInstance: XrmClientApi.XrmStatic;
	}

	export interface DataLoadEventArguments extends EventArguments {
		getDataLoadState(): Constants.DataLoadState;
	}

	export interface ProcessControlEventArgs extends EventArguments {
		/**
		 * Gets the stage object corresponding to the event fired. Selected stage in case of OnStageSelected event and
		 * next or previous stage objects in case of OnStageChange event depending on direction moved in.
		 * @returns Xrm stage
		 */
		getStage(): Process.Stage;

		/* Gets the direction (Next / Previous) of the stage advance action.
		 * @returns Direction the stage movement occurred in
		 */
		getDirection(): Constants.ProcessNavigationDirectionValue;
	}

	export namespace Controls {
		/**
		 * Interface for focusable UI elements.
		 */
		export interface UiFocusable {
			/**
			 * Sets focus on the element.
			 */
			setFocus(): void;
		}

		/**
		 * Base interface for UI elements.
		 */
		export interface UiElement {
			/**
			 * Gets the label.
			 *
			 * @return	The label.
			 */
			getLabel(): string;

			/**
			 * Gets the visibility state.
			 *
			 * @return	true if the tab is visible, otherwise false.
			 */
			getVisible(): boolean;

			/**
			 * Sets the label.
			 *
			 * @param	{string} label	 The label.
			 */
			setLabel(label: string): void;

			/**
			 * Sets the visibility state.
			 *
			 * @param	{boolean}	visible true to show, false to hide.
			 */
			setVisible(visible: boolean): void;
		}

		export interface NamedUiElement extends UiElement {
			/**
			 * Gets the name of the control on the form.
			 *
			 * @return	The name of the control.
			 */
			getName(): string;
		}

		export interface ProcessControl {
			/**
			 * Gets display state of the process control.
			 *
			 * @return	The display state, as either "expanded" or "collapsed" or "floating"
			 */
			getDisplayState(): string;

			/**
			 * Gets the visibility state.
			 *
			 * @return	true if the process control is visible, otherwise false.
			 */
			getVisible(): boolean;

			/**
			 * Sets display state of the process flow control.
			 *
			 * @param	{"collapsed"}	displayState Collapsed process flow control.
			 */
			setDisplayState(displayState: "collapsed"): void;

			/**
			 * Sets display state of the process flow control.
			 *
			 * @param	{"expanded"} displayState Expanded process flow control.
			 */
			setDisplayState(displayState: "expanded"): void;

			/**
			 * Sets display state of the process flow control.
			 *
			 * @param	{"floating"} displayState floating process flow control.
			 */
			setDisplayState(displayState: "floating"): void;

			/**
			 * Sets display state of the process flow control.
			 *
			 * @param	{string} displayState	Display state of the process flow control, as either "expanded" or "collapsed"
			 */
			setDisplayState(displayState: string): void;

			/**
			 * Sets the visibility state.
			 *
			 * @param	{boolean}	visible true to show, false to hide.
			 */
			setVisible(visible: boolean): void;
		}

		/**
		 * Interface for Xrm.Page.ui controls.
		 *
		 * @sa	UiElement
		 */
		export interface Control extends NamedUiElement, UiFocusable {
			/**
			 * Gets the control's type.
			 *
			 * @return	The control type.
			 * @remarks Values returned are: standard
			 *	  iframe
			 *	  lookup
			 *	  optionset
			 *	  subgrid
			 *	  webresource
			 *	  notes
			 *	  timercontrol
			 *	  kbsearch (CRM Online Only, use parature.d.ts)
			 *	  customcontrol
			 *	  customsubgrid
			 */
			getControlType(): string;

			/**
			 * Gets a boolean value, indicating whether the control is disabled.
			 *
			 * @return	true if it is disabled, otherwise false.
			 */
			getDisabled(): boolean;

			/**
			 * Gets a reference to the Section parent of the control.
			 *
			 * @return	The parent Section.
			 */
			getParent(): Section;

			/**
			 * Sets the state of the control to either enabled, or disabled.
			 *
			 * @param	{boolean}	disabled true to disable, false to enable.
			 */
			setDisabled(disabled: boolean): void;
		}

		/**
		 * Interface for a button control.
		 */
		export interface XrmControlButton extends Control {
			/**
			 * Adds a handler to the attribute's Click event.
			 * @param handler Click event handler.
			 */
			addOnClick(handler: XrmClientApi.EventHandler): void;

			/**
			 * Removes a handler from the attribute's Click event.
			 * @param handler Click event handler.
			 */
			removeOnClick(handler: XrmClientApi.EventHandler): void;
		}

		/**
		 * Interface for a standard control.
		 *
		 * @sa	Control
		 */
		export interface DataControl extends Control {
			/**
			 * Gets the control's bound attribute.
			 *
			 * @tparam	T	An Attribute type.
			 *
			 * @return	The attribute.
			 */
			getAttribute<T extends Attributes.Attribute>(): T;

			/**
			 * Gets the control's bound attribute.
			 *
			 * @return	The attribute.
			 */
			getAttribute(): Attributes.Attribute;

			/**
			 * Clears the notification identified by uniqueId.
			 *
			 * @param	{string} uniqueId (Optional) Unique identifier.
			 *
			 * @return	true if it succeeds, false if it fails.
			 *
			 * @remarks If the uniqueId parameter is not used, the current notification shown will be removed.
			 */
			clearNotification(uniqueId?: string): boolean;

			/**
			 * Sets a control-local notification message.
			 *
			 * @param	{string} message  The message.
			 * @param	{string} uniqueId Unique identifier.
			 *
			 * @return	true if it succeeds, false if it fails.
			 *
			 * @remarks	 When this method is used on Microsoft Dynamics CRM for tablets a red "X" icon
			 *	appears next to the control. Tapping on the icon will display the message.
			 */
			setNotification(message: string, uniqueId?: string): boolean;

			/**
			 * Adds a notification.
			 * @param notification The notification to add.
			 * @returns True if the notification was successfully added.
			 */
			addNotification(notification: BusinessRuleNotification): boolean;
		}

		/**
		 * Interface for a Date control.
		 *
		 * @sa	DataControl
		 */
		export interface DateControl extends DataControl {
			/**
			 * Gets the control's bound attribute.
			 *
			 * @return	The attribute.
			 */
			getAttribute(): Attributes.DateAttribute;

			/**
			 * Gets the status of the time-of-day component of the Date control.
			 *
			 * @return	true if the time is shown, otherwise false.
			 */
			getShowTime(): boolean;

			/**
			 * Sets the visibility of the time component of the Date control.
			 *
			 * @param	{boolean}	showTimeValue	true to show, false to hide the time value.
			 */
			setShowTime(showTimeValue: boolean): void;
		}

		/**
		 * Interface for a Lookup control.
		 *
		 * @sa	DataControl
		 */
		export interface LookupControl extends DataControl {
			/**
			 *  Whether the MRU will be disabled.  Default is false.
			 */
			disableMru?: boolean;

			/**
			 * Adds a handler to the "pre search" event of the Lookup control.
			 *
			 * @param	{Function}	handler The handler.
			 */
			addPreSearch(handler: EventHandler): void;

			/**
			 * Adds an additional custom filter to the lookup, with the "AND" filter operator.
			 * Can only be used within a "pre search" event handler
			 *
			 * @sa addPreSearch
			 *
			 * @param	{string} filter	 Specifies the filter, as a serialized FetchXML
			 *	 "filter" node.
			 * @param	{string} entityLogicalName	 (Optional) The logical name of the entity.
			 */
			addCustomFilter(filter: string, entityLogicalName?: string): void;

			/**
			 * Adds a custom view for the Lookup dialog.
			 *
			 * @param	{string} viewId Unique identifier for the view, in Guid format.
			 * @param	{string} entityName	  Name of the entity.
			 * @param	{string} viewDisplayName Name of the view to display.
			 * @param	{string} fetchXml  The FetchXML query for the view's contents, serialized as a string.
			 * @param	{string} layoutXml The Layout XML, serialized as a string.
			 * @param	{boolean}	isDefault true, to treat this view as default.
			 */
			addCustomView(
				viewId: string,
				entityName: string,
				viewDisplayName: string,
				fetchXml: string,
				layoutXml: string,
				isDefault: boolean
			): void;

			/**
			 * Gets the control's bound attribute.
			 *
			 * @return	The attribute.
			 */
			getAttribute(): Attributes.LookupAttribute;

			/**
			 * Gets the unique identifier of the default view.
			 *
			 * @return	The default view, in Guid format.
			 *
			 * @remarks Example: "{00000000-0000-0000-0000-000000000000}"
			 */
			getDefaultView(): string;

			/**
			 * Gets the types of entities that can be used by this control.
			 * @returns The types of entities that can be used by this control.
			 */
			getEntityTypes(): string[];

			/**
			 * Sets the types of entities to allow in this lookup control.
			 * @param entityTypes The types of entities to allow in this lookup control.
			 */
			setEntityTypes(entityTypes: string[]): void;

			/**
			 * Removes the handler from the "pre search" event of the Lookup control.
			 *
			 * @param	{Function}	handler The handler.
			 */
			removePreSearch(handler: EventHandler): void;

			/**
			 * Sets the Lookup's default view.
			 *
			 * @param	{string} viewGuid Unique identifier for the view.
			 *
			 * @remarks Example viewGuid value: "{00000000-0000-0000-0000-000000000000}"
			 */
			setDefaultView(viewGuid: string): void;
		}

		/**
		 * Interface for an OptionSet control.
		 *
		 * @sa	DataControl
		 */
		export interface OptionSetControlBase extends DataControl {
			/**
			 * Adds an option.
			 *
			 * @param	{OptionSetItem} option	The option.
			 * @param	{number} index	(Optional) zero-based index of the option.
			 *
			 * @remarks This method does not check that the values within the options you add are valid.
			 * If index is not provided, the new option will be added to the end of the list.
			 */
			addOption(option: OptionSetItem, index?: number): void;

			/**
			 * Clears all options.
			 */
			clearOptions(): void;

			/**
			 * Removes the option matching the value.
			 *
			 * @param	{number} value	 The value.
			 */
			removeOption(value: number): void;

			/**
			 * Gets the collection of option objects.
			 * @returns Collection of option objects.
			 */
			getOptions(): XrmClientApi.OptionSetItem[];
		}

		/**
		 * Interface for an OptionSet control.
		 *
		 * @sa	OptionSetControlBase
		 */
		export interface OptionSetControl extends OptionSetControlBase {
			/**
			 * Gets the control's bound attribute.
			 *
			 * @return	The attribute.
			 */
			getAttribute(): Attributes.OptionSetAttribute;
		}

		/**
		 * Interface for an MultiSelectOptionSet control.
		 *
		 * @sa	OptionSetControlBase
		 */
		export interface MultiSelectOptionSetControl extends OptionSetControlBase {
			/**
			 * Gets the control's bound attribute.
			 *
			 * @return	The attribute.
			 */
			getAttribute(): Attributes.MultiSelectOptionSetAttribute;
		}

		/**
		 * Text control on the form.
		 */
		interface KeyPressEnabledControl {
			/**
			 * Adds or Sets a function to be called on key press event
			 * @param keyPressEventhandler The function to be called on key press event
			 */
			addOnKeyPress(keyPressEventhandler: EventHandler): void;

			/**
			 * Fires an event handler that is subscribed for a specific text or number field to be executed on the keypress event.
			 */
			fireOnKeyPress(): void;

			/**
			 * Removes a function to be called on key press event
			 * @param keyPressEventhandler The function to be called on key press event
			 */
			removeOnKeyPress(keyPressEventhandler: EventHandler): void;
		}

		/**
		 * Standard control on the form.
		 */
		interface StandardControl extends DataControl, KeyPressEnabledControl {
			/**
			 * returns value of an input field
			 */
			getValue(): string;
		}

		/**
		 * Timer control on the form.
		 */
		interface TimerControl extends Control {
			/**
			 * Refreshes the timer control
			 */
			refresh(): void;
		}

		/**
		 * The Xrm Quick Form Control
		 */
		interface QuickFormControl extends Control {
			// TODO: Task 135645: This should also extend Form rather than redefining the form interface here.
			ui: FormUi;
			data: FormData;

			/**
			 * Gets all controls.
			 *
			 * @return	An array of controls.
			 */
			getControl(): Controls.Control[];

			/**
			 * Gets a control matching controlName.
			 *
			 * @tparam	T	A Control type
			 * @param	{string} controlName Name of the control.
			 *
			 * @return	The control.
			 */
			getControl<T extends Controls.Control>(controlName: string): T;

			/**
			 * Gets a control matching controlName.
			 *
			 * @param	{string} controlName Name of the control.
			 *
			 * @return	The control.
			 */
			getControl(controlName: string): Controls.Control;

			/**
			 * Gets a control by index.
			 *
			 * @param	{number} index	 The control index.
			 *
			 * @return	The control.
			 */
			getControl(index: number): Controls.Control;

			/**
			 * Gets a control.
			 *
			 * @param	{Collection.MatchingDelegate{Control}}	delegateFunction A matching delegate function.
			 *
			 * @return	An array of control.
			 */
			getControl(delegateFunction: Collection.MatchingDelegate<Controls.Control>): Controls.Control[];

			/**
			 * Returns whether Quick Form is completely loaded or not
			 * @returns Whether Quick form is completely loaded or not
			 */
			isLoaded(): boolean;

			/**
			 * Refreshes the Quick View Form control
			 */
			refresh(): void;

			// TODO: Task 135671: This has setVisible inherited from the base, but it shouldn't have that method.
		}

		/**
		 * The search widget control on the form.
		 */
		interface SearchWidgetControl extends Control {
			/**
			 * sets searchquery string
			 * @param value the search text
			 */
			setSearchQuery(value: string): void;

			/**
			 * gets Search Query
			 * @returns returns search query
			 */
			getSearchQuery(): string;

			/**
			 * Gets the selected results
			 * @returns returns selected results
			 */
			getSelectedResults(): KBSearchResult;

			/**
			 * Opens the Search result with the specified index in the specified mode
			 * @param resultNumber 1-based index into the results list
			 * @param mode mode to open the result in: "Popout" or "Inline"
			 * @returns 1 if successful, 0 if unsuccessful, and -1 if an argument was invalid
			 */
			openSearchResult(resultNumber: number, mode?: string): number;

			/**
			 * Returns the total result count from the search
			 * @returns integer specifying the total result count from the search
			 */
			getTotalResultCount(): number;

			/**
			 * Update the articles for selected filter
			 */
			changeSelectedMenuItem(command: Constants.SearchWidgetCommand, value: number): void;

			/**
			 * returns boolean specifying whether parature is enabled or disabled for knowledge management
			 */
			getUseNativeCrm(): boolean;

			/**
			 * sets number of result to shown
			 * @param value number of result
			 */
			setNumberOfResults(value: number): void;

			/**
			 * Blocks the search result selection
			 * @param value whether to block the result or not
			 */
			setBlockResult(value: boolean): void;

			/**
			 * Adds event handler on selection
			 * @param handler event handler
			 */
			addOnSelection(handler: EventHandler): void;

			/**
			 * Removes event handler on selection
			 * @param handler event handler
			 */
			removeOnSelection(handler: EventHandler): void;

			/**
			 * adds event handler onResultOpened
			 * @param handler event handler
			 */
			addOnResultOpened(handler: EventHandler): void;

			/**
			 * Removes event handler on result opened
			 * @param handler event handler
			 */
			removeOnResultOpened(handler: EventHandler): void;

			/**
			 * Adds event handler post search
			 * @param handler event handler
			 */
			addOnPostSearch(handler: EventHandler): void;

			/**
			 * Removes event handler on post search
			 * @param handler event handler
			 */
			removeOnPostSearch(handler: EventHandler): void;
		}

		/**
		 * Interface for a CRM grid control.
		 * This is used for both main grids and subgrids.
		 */
		export interface GridControl {
			/**
			 * Adds an additional custom filter to the grid with the "AND" filter operator.
			 *
			 * @param	{string} fetchXmlFilter	 Specifies the filter, as a serialized FetchXML "filter" node.
			 */
			setFilterXml(fetchXmlFilter: string): void;

			/**
			 * Gets the custom filtee XML
			 *
			 * @return	Custom filter XML
			 */
			getFilterXml(): string;

			/**
			 * Use this method to get the logical name of the entity data displayed in the grid.
			 *
			 * @return	The entity name.
			 */
			getEntityName(): string;

			/**
			 * Gets the fetch xml used by the grid to retrieve the grid data.
			 *
			 * @return	The fetch xml.
			 */
			getFetchXml(): string;

			/**
			 * Use this method to get access to the Grid available in the GridControl.
			 *
			 * @return	The grid.
			 */
			getGrid(): Grid;

			/**
			 * Use this method to get access to the ViewSelector available for the GridControl when it is configured to display views.
			 *
			 * @return	The view selector.
			 */
			getViewSelector(): ViewSelector;

			/**
			 * Refreshes the sub grid.
			 *
			 * @remarks Not available during the "on load" event of the form.
			 */
			refresh(): void;

			/**
			 * Refresh the ribbon rules for grid context.
			 */
			refreshRibbon(): void;

			/**
			 * Gets the URL for the current grid control.
			 * @param The optional client type parameter.
			 * @returns The URL for the current grid control.
			 */
			getUrl(clientType?: XrmClientApi.Constants.ClientType): string;

			/**
			 * gets the grid type.
			 * @Returns The grid type.
			 */
			getGridType(): Constants.GridType;

			/**
			 * gets the relationship detail for the subgrid
			 * @Returns Relationship object defining the entity relationship
			 */
			getRelationship(): IRelationship;
		}

		export interface SubGridControl extends GridControl, Control {
			/**
			 * Use this method to add event handlers to the GridControl's OnLoad event.
			 *
			 * @param	{Function} handler The event handler.
			 */
			addOnLoad(handler: EventHandler): void;

			/**
			 * gets the grid type.
			 * @Returns The grid type.
			 */
			getGridType(): Constants.GridType;

			/**
			 * opens the related grid
			 */
			openRelatedGrid(): void;

			/**
			 * Use this method to remove event handlers from the GridControl's OnLoad event.
			 *
			 * @param	{Function} handler The handler.
			 */
			removeOnLoad(handler: EventHandler): void;
		}

		/**
		 * Interface for a stream control
		 */
		export interface StreamControl {
			/**
			 * Refreshes all of the streams in the stream control.
			 */
			refresh(): void;
		}

		/**
		 * Interface for a framed control, which is either a Web Resource or an Iframe.
		 *
		 * @sa	Control
		 *
		 * @remarks	 An Iframe control provides additional methods, so use {@link IframeControl} where
		 *	appropriate.  Silverlight controls should use {@link SilverlightControl}.
		 */
		export interface FramedControl extends Control {
			/**
			 * Gets the DOM element containing the control.
			 *
			 * @return	The container object.
			 *
			 * @remarks Unavailable for Microsoft Dynamics CRM for tablets.
			 */
			getObject(): HTMLIFrameElement;

			/**
			 * Gets the URL value of the control.
			 *
			 * @return	The source URL.
			 *
			 * @remarks Unavailable for Microsoft Dynamics CRM for tablets.
			 */
			getSrc(): string;

			/**
			 * Sets the URL value of the control.
			 *
			 * @param	{string} src The source URL.
			 *
			 * @remarks Unavailable for Microsoft Dynamics CRM for tablets.
			 */
			setSrc(src: string): void;
		}

		/**
		 * Interface for an Iframe control.
		 *
		 * @sa	FramedControl
		 */
		export interface IframeControl extends FramedControl {
			/**
			 * Gets initial URL defined for the Iframe.
			 *
			 * @return	The initial URL.
			 *
			 * @remarks Unavailable for Microsoft Dynamics CRM for tablets.
			 */
			getInitialUrl(): string;
		}

		/**
		 * Interface for a form tab.
		 *
		 * @sa	UiElement
		 * @sa	UiFocusable
		 */
		export interface Tab extends NamedUiElement, UiFocusable {
			/**
			 * A reference to the collection of form sections within this tab.
			 */
			sections: Collection.ItemCollection<Section>;

			/**
			 * Adds or Sets a function to be called on tab's state ("expanded" or "collapsed") change.
			 * @param handler The function to be called on tab state change.
			 */
			addTabStateChange(handler: EventHandler): void;

			/**
			 * Gets display state of the tab.
			 *
			 * @return	The display state, as either "expanded" or "collapsed"
			 */
			getDisplayState(): string;

			/**
			 * Gets a reference to the Xrm.Page.ui parent of the tab.
			 *
			 * @return	The parent.
			 */
			getParent(): FormUi;

			/**
			 * Removes the tab state change event handler funtion that was added previously.
			 * @param handler The function to be removed from the list of event handlers.
			 */
			removeTabStateChange(handler: EventHandler): void;

			/**
			 * Sets display state of the tab.
			 *
			 * @param	{"collapsed"}	displayState Collapsed tab.
			 */
			setDisplayState(displayState: "collapsed"): void;

			/**
			 * Sets display state of the tab.
			 *
			 * @param	{"expanded"} displayState Expanded tab.
			 */
			setDisplayState(displayState: "expanded"): void;

			/**
			 * Sets display state of the tab.
			 *
			 * @param	{string} displayState	Display state of the tab, as either "expanded" or "collapsed"
			 */
			setDisplayState(displayState: string): void;
		}

		/**
		 * Interface for a form section.
		 *
		 * @sa	UiElement
		 */
		export interface Section extends NamedUiElement {
			/**
			 * A reference to the collection of controls within this tab.
			 */
			controls: Collection.ItemCollection<Control>;

			/**
			 * Gets a reference to the Xrm.Page.Tab parent of this item.
			 *
			 * @return	The parent.
			 */
			getParent(): Tab;
		}

		/**
		 * Interface for a grid.  Use Grid methods to access information about data in the grid. Grid is returned by the
		 * GridControl.getGrid method.
		 */
		export interface Grid {
			/**
			 * Returns a collection of every GridRow in the Grid.
			 *
			 * @return	The rows.
			 */
			getRows(): Collection.ItemCollection<Grid.GridRow>;

			/**
			 * Returns a collection of every selected GridRow in the Grid.
			 *
			 * @return	The selected rows.
			 */
			getSelectedRows(): Collection.ItemCollection<Grid.GridRow>;

			/**
			 * Returns the total number of records in the Grid.
			 *
			 * @return	The total record count.
			 */
			getTotalRecordCount(): number;

			/**
			 * Removes a handler from the attribute's Click event.
			 * @param handler Click event handler.
			 */
			removeOnRecordSelect(handler: XrmClientApi.EventHandler): void;

			/**
			 * Adds a handler to the attribute's Click event.
			 * @param handler Click event handler.
			 */
			addOnRecordSelect(handler: XrmClientApi.EventHandler): void;

			/**
			 * Removes a handler from the attribute's Click event.
			 * @param handler Click event handler.
			 */
			runOnRecordSelect(eventSource?: any): void;
		}

		/**
		 * Interface for the view selector.	 Use the ViewSelector methods to get or set information about the view selector
		 * of the grid control.
		 */
		export interface ViewSelector {
			/**
			 * Use this method to get a reference to the current view.
			 *
			 * @return	The current view.
			 */
			getCurrentView(): LookupValue;

			/**
			 * Use this method to determine whether the view selector is visible.
			 *
			 * @return	true if visible, false if not.
			 */
			isVisible(): boolean;

			/**
			 * Use this method to set the current view.
			 *
			 * @param	{LookupValue}  viewSelectorItem The view selector item.
			 */
			setCurrentView(viewSelectorItem: LookupValue): void;
		}

		/**
		 * Interface for the form selector control.
		 */
		export interface FormSelector<TFormSelectorItem extends XrmClientApi.FormSelectorItem> {
			/**
			 * A reference to the collection of available forms.
			 */
			items: Collection.ItemCollection<TFormSelectorItem>;

			/**
			 * Gets current form.
			 *
			 * @return	The current item.
			 *
			 * @remarks When only one form is available this method will return null.
			 */
			getCurrentItem(): TFormSelectorItem;
		}

		/**
		 * Interface for Xrm.Page.ui.navigation.
		 */
		export interface FormNavigation {
			/**
			 * A reference to the collection of available navigation items.
			 */
			items: Collection.ItemCollection<NavigationItem>;
		}

		/**
		 * Interface for a navigation item.
		 *
		 * @sa	UiElement
		 * @sa	UiFocusable
		 */
		export interface NavigationItem extends UiElement, UiFocusable {
			/**
			 * Gets the name of the item.
			 *
			 * @return	The identifier.
			 */
			getId(): string;
		}
	}

	export namespace Grid {
		/**
		 * Interface for a grid row.  Use the GridRow.getData method to access the GridRowData. A collection of GridRow is
		 * returned by Grid.getRows and Grid.getSelectedRows methods.
		 */
		export interface GridRow {
			/**
			 * the GridRowData for the GridRow.
			 */
			data: GridRowData;
		}

		/**
		 * Interface for grid row data.	 Use the GridRowData.getEntity method to access the GridEntity. GridRowData is
		 * returned by the GridRow.getData method.
		 */
		export interface GridRowData {
			/**
			 * Returns the GridEntity for the GridRowData.
			 *
			 * @return	The entity.
			 */
			entity: GridEntity;
		}

		/**
		 * Interface for a grid entity.	 Use the GridEntity methods to access data about the specific records in the rows.
		 * GridEntity is returned by the GridRowData.getEntity method.
		 */
		export interface GridEntity {
			/**
			 * Returns the logical name for the record in the row.
			 *
			 * @return	The entity name.
			 */
			getEntityName(): string;

			/**
			 * Returns a LookupValue that references this record.
			 *
			 * @return	The entity reference.
			 */
			getEntityReference(): LookupValue;

			/**
			 * Returns the id for the record in the row.
			 *
			 * @return	The identifier of the GridEntity, in GUID format.
			 *
			 * @remarks Example return: "{00000000-0000-0000-0000-000000000000}"
			 */
			getId(): string;

			/**
			 * Returns the primary attribute value for the record in the row.  (Commonly the name.)
			 *
			 * @return	The primary attribute value.
			 */
			getPrimaryAttributeValue(): string;
		}
	}

	/**
	 * Interface for a dashboard selector item.
	 */
	export interface DashboardSelectorItem extends XrmClientApi.FormSelectorItem {
		/**
		 * Gets whether the dashboard is a bound dashboard
		 *
		 * @return  Whether the dashboard is a bound dashboard
		 */
		isBoundDashboard: boolean;

		/**
		 * Gets whether the dashboard is a user dashboard
		 *
		 * @return  Whether the dashboard is a user dashboard
		 */
		isUserDashboard: boolean;
	}

	/**
	 * Interface for an entity's form selector item.
	 */
	export interface FormSelectorItem {
		/**
		 * Gets the unique identifier of the form.
		 *
		 * @return	The identifier, in Guid format.
		 */
		getId(): string;

		/**
		 * Gets the label for the form.
		 *
		 * @return	The label.
		 */
		getLabel(): string;

		/**
		 * Navigates the user to this form.
		 */
		navigate(): void;
	}

	/**
	 * Objects related to interacting with the Web API.
	 */
	namespace WebApi {
		/**
		 * Interface that describes the OData response for retrieve multiple.
		 */
		export interface RetrieveMultipleResponse {
			entities: Entity[];
			nextLink: string;
		}

		export interface EntityReference {
			/**
			 * The id of the referenced entity record
			 */
			id: string;

			/**
			 * The logical name of the referenced entity record
			 */
			logicalName: string;
		}

		/**
		 * Interface that describes an entity sent to or received from the SDK through the Web API.
		 */
		export interface Entity {
			[key: string]: any;
		}

		/**
		 * The enum that describes the structure of the type.
		 * @see Section 4.3 of Odata v4.0 standard for more info:
		 * http://docs.oasis-open.org/odata/odata/v4.0/errata03/os/complete/part3-csdl/odata-v4.0-errata03-os-part3-csdl-complete.html#_Toc453752516
		 */
		export const enum ODataStructuralProperty {
			Unknown = 0,
			PrimitiveType = 1,
			ComplexType = 2,
			EnumerationType = 3,
			Collection = 4,
			EntityType = 5,
		}

		/**
		 * OData enum parameter metadata
		 */
		export interface ODataEnumValue {
			/**
			 * The string key for the enum value
			 */
			name: string;

			/**
			 * The enum value
			 */
			value: number;
		}

		/**
		 * The interface that describes metadata for the OData request parameter type.
		 */
		export interface ODataParameterType {
			/**
			 * The category of the type (primitive/comples/enum/collection/entity)
			 */
			structuralProperty: ODataStructuralProperty;

			/**
			 * The fully qualified name of the parameter type.
			 */
			typeName: string;

			/**
			 * The metadata for enum types
			 */
			enumProperties?: ODataEnumValue[];
		}

		/**
		 * The interface that describes the metadata for the OData request.
		 */
		export interface ODataContractMetadata {
			/**
			 * The name of the bound parameter. This should have a value of "undefined" if the OData function/action is undefined.
			 */
			boundParameter?: string;

			/**
			 * The metadata for parameter types.
			 */
			parameterTypes: { [parameterName: string]: ODataParameterType };

			/**
			 * Name of the operation
			 */
			operationName?: string;

			/**
			 * The type of the operation.
			 */
			operationType?: ODataOperationType;

			/**
			 * The Type name of the operation
			 */
			typeName?: string;
		}

		/**
		 * The interface that describes the OData contract (request and response).
		 */
		export interface ODataContract {
			/**
			 * ODataContract is a dictionary of parameters that will be passed to an OData endpoint.
			 */
			[parameter: string]: any;

			/**
			 * Each OData contract must have a way to get information about its attributes.
			 */
			getMetadata(): ODataContractMetadata;
		}

		/**
		 * Change set defining a Odata Transaction
		 */
		export type ChangeSet = ODataContract[];

		/**
		 * The interface that describes the Response.
		 * This is a subset of the browser Response.
		 */
		interface Response {
			status: number;
			ok: boolean;
			statusText: string;
			url: string;
			json(): Promise<any>;
			text(): Promise<string>;
		}

		/**
		 * Represents Tye of the Odata Operation
		 */
		const enum ODataOperationType {
			Action = 0,
			Function = 1,
			CRUD = 2,
		}
	}

	/**
	 * Generic parameters class that's a dictionary of strings.
	 */
	export interface Parameters {
		[key: string]: any;
	}

	export interface DialogParameters extends Parameters {}

	export interface FormParameters extends Parameters {
		/**
		 * Additional parameters can be provided to the request, by overloading
		 * this object with additional key and value pairs. This can only be used
		 * to provide default field values for the form.
		 */
		[key: string]: boolean | Date | number | string;
	}

	export interface TaskFlowParameters extends Parameters {}

	export interface OpenParameters extends Parameters {
		/**
		 * Additional parameters can be provided to the request, by overloading
		 * this object with additional key and value pairs. This can only be used
		 * to provide default field values for the form, or pass data to custom
		 * parameters that have been customized for the form.
		 */
	}

	/**
	 * Interface for defining parameters on a Xrm.Utility.openEntityForm() request.
	 */
	export interface FormOpenParameters extends OpenParameters {
		/**
		 * The identifier of the form to use, when several are available.
		 */
		formid: string;

		/**
		 * Controls whether the Navigation bar is displayed on the form.
		 * Accepted values are: "on"   (The navigation bar is displayed.)
		 *	  "off"	 (The navigation bar is not displayed.)
		 *	  "entity"	(On an entity form, only the navigation options for related
		 *	entities are available.)
		 */
		navbar?: string;

		/**
		 * Controls whether the command bar is displayed.
		 * Accepted values are: "true" (The command bar is displayed.)
		 *	  "false"	(The command bar is not displayed.)
		 */
		cmdbar?: string;
	}

	/**
	 * Options for when save is called.
	 */
	interface SaveOptions {
		useSchedulingEngine?: boolean;
		saveMode?: Constants.SaveMode;
	}

	/**
	 * Interface for window options.
	 */
	export interface OpenWebResourceOptions {
		height?: number;
		width?: number;
	}

	/**
	 * Interface for open url options.
	 */
	export interface OpenUrlOptions {
		height?: number;
		width?: number;
	}

	/**
	 * Interface for dialog options.
	 */
	export interface DialogOptions {
		height: number;
		width: number;
		position: XrmClientApi.Constants.WindowPosition;
	}

	/**
	 * Interface for alert dialog options.
	 */
	export interface AlertDialogOptions {
		height: number;
		width: number;
	}

	/**
	 * Interface for confirm dialog options.
	 */
	export interface ConfirmDialogOptions {
		height: number;
		width: number;
	}

	/**
	 * Interface for error dialog options.
	 */
	export interface ErrorDialogOptions {
		message?: string;
		errorCode?: number;
		details?: string;
	}

	/**
	 * Interface for entity form options.
	 */
	export interface EntityFormOptions {
		entityName: string;
		entityId?: string;
		useQuickCreateForm?: boolean; // Defaults to true.  Ignored when entityId is specified.
		createFromEntity?: LookupValue;
		formId?: string;
		openInNewWindow?: boolean; // Defaults to false.  Ignored when in an app shim.
		width?: number; // Ignored when openInNewWindow is false.
		height?: number; // Ignored when openInNewWindow is false.
		cmdbar?: boolean;
		navbar?: string; // “on”, “off”, “entity”
		processId?: string;
		processInstanceId?: string;
		selectedStageId?: string;
		isCrossEntityNavigate?: boolean;
		position?: Constants.WindowPosition;
		relationship?: XrmClientApi.IRelationship;
		isOfflineSyncError?: boolean; //Indicating if there is any sync error
	}

	//TODO: Move this interface to an Internal API only file #436019
	export interface EntityFormOptionsWithInternalParameters extends EntityFormOptions {
		recordSetQueryKey?: string;
	}

	/**
	 * Interface for task flow options.
	 */
	export interface TaskFlowOptions {
		primaryEntityContext: LookupValue;
	}

	/**
	 * Interface for open file options.
	 */
	export interface OpenFileOptions {
		openMode: XrmClientApi.Constants.OpenFileMode;
	}

	/**
	 * Class passed to an async callback on success.
	 */
	interface SuccessResponse {}

	/**
	 * Class passed to an async callback on close.
	 */
	interface TaskFlowResponse {
		parameters: TaskFlowParameters;
	}

	/**
	 * Class passed to an async callback on OpenDialog close.
	 */
	interface DialogResponse {
		parameters: DialogParameters;
	}

	/**
	 * Class passed to an async callback on AlertDialog close.
	 */
	interface AlertDialogResponse {}

	/**
	 * Class passed to an async callback on ErrorDialog close.
	 */
	interface ErrorDialogResponse {}

	/**
	 * Class passed to an async callback on ConfirmDialog close.
	 */
	interface ConfirmDialogResponse {
		confirmed: boolean;
	}

	/**
	 * The class returned when a save is successful.
	 */
	interface SaveSuccessResponse extends SuccessResponse {
		savedEntityReference: LookupValue;
	}

	/**
	 * The class returned when a open-form is successful.
	 */
	interface OpenFormSuccessResponse extends SuccessResponse {
		savedEntityReference: LookupValue[];
	}

	/**
	 * Class representing an error.
	 */
	interface ErrorResponse {
		errorCode: number;
		message: string;
	}

	/**
	 * The result returned from a KB search.
	 */
	interface KBSearchResult {
		answer: string;
		articleId: string;
		articleUid: string;
		attachmentCount: number;
		createdOn: Date;
		expiredDate: Date;
		folderHref: string;
		href: string;
		isAssociated: boolean;
		lastModifiedOn: Date;
		publicUrl: string;
		published: boolean;
		question: string;
		rating: number;
		searchBlurb: string;
		serviceDeskUri: string;
		timesViewed: number;
	}

	/**
	 * Entity metadata
	 */
	interface EntityMetadata {
		ActivityTypeMask?: number;
		AutoRouteToOwnerQueue?: boolean;
		CanEnableSyncToExternalSearchIndex?: boolean;
		CanTriggerWorkflow?: boolean;
		Description?: string;
		DisplayCollectionName?: string;
		DisplayName?: string;
		EnforceStateTransitions?: boolean;
		EntityColor?: string;
		EntitySetName?: string;
		HasActivities?: boolean;
		IconVectorName?: string;
		IsActivity?: boolean;
		IsActivityParty?: boolean;
		IsBusinessProcessEnabled?: boolean;
		IsBPFEntity?: boolean;
		IsChildEntity?: boolean;
		IsConnectionsEnabled?: boolean;
		IsCustomEntity?: boolean;
		IsCustomizable?: boolean;
		IsDocumentManagementEnabled?: boolean;
		IsDocumentRecommendationsEnabled?: boolean;
		IsDuplicateDetectionEnabled?: boolean;
		IsEnabledForCharts?: boolean;
		IsImportable?: boolean;
		IsInteractionCentricEnabled?: boolean;
		IsKnowledgeManagementEnabled?: boolean;
		IsMailMergeEnabled?: boolean;
		IsManaged?: boolean;
		IsOneNoteIntegrationEnabled?: boolean;
		IsMSTeamsIntegrationEnabled?: boolean;
		IsOptimisticConcurrencyEnabled?: boolean;
		IsQuickCreateEnabled?: boolean;
		IsReadOnlyInMobileClient?: boolean;
		IsStateModelAware?: boolean;
		IsValidForAdvancedFind?: boolean;
		IsVisibleInMobileClient?: boolean;
		IsEnabledInUnifiedInterface?: boolean;
		LogicalCollectionName?: string;
		LogicalName: string;
		ObjectTypeCode: number;
		OwnershipType?: Constants.EntityOwnershipType;
		PrimaryIdAttribute?: string;
		PrimaryImageAttribute?: string;
		PrimaryNameAttribute?: string;
		Privileges?: SecurityPrivilegeMetadata[];
		Attributes: Collection.ItemCollection<AttributeMetadata>;
		ManyToManyRelationships?: Collection.ItemCollection<ManyToManyRelationshipMetadata>;
		ManyToOneRelationships?: Collection.ItemCollection<OneToManyRelationshipMetadata>;
		OneToManyRelationships?: Collection.ItemCollection<OneToManyRelationshipMetadata>;
	}

	/**
	 * Interface for relationship base
	 */
	interface RelationshipMetadataBase {
		IntroducedVersion: string;
		IsCustomizable: boolean;
		IsCustomRelationship: boolean;
		IsManaged: boolean;
		IsValidForAdvancedFind: boolean;
		RelationshipType: RelationshipType;
		SchemaName: string;
		SecurityTypes: SecurityTypes;
	}

	/**
	 * Interface for many to many relationship
	 */
	interface ManyToManyRelationshipMetadata extends RelationshipMetadataBase {
		Entity1AssociatedMenuConfiguration: AssociatedMenuConfiguration;
		Entity1IntersectAttribute: string;
		Entity1LogicalName: string;
		Entity1NavigationPropertyName: string;
		Entity2AssociatedMenuConfiguration: AssociatedMenuConfiguration;
		Entity2IntersectAttribute: string;
		Entity2LogicalName: string;
		Entity2NavigationPropertyName: string;
		IntersectEntityName: string;
	}

	/**
	 * Interface for one to many relationship
	 */
	interface OneToManyRelationshipMetadata extends RelationshipMetadataBase {
		AssociatedMenuConfiguration: AssociatedMenuConfiguration;
		CascadeConfiguration: CascadeConfiguration;
		IsHierarchical: boolean;
		ReferencedAttribute: string;
		ReferencedEntity: string;
		ReferencedEntityNavigationPropertyName: string;
		ReferencingAttribute: string;
		ReferencingEntity: string;
		ReferencingEntityNavigationPropertyName: string;
	}

	/**
	 * Interface for CascadeConfiguration
	 */
	interface CascadeConfiguration {
		Assign: CascadeType;
		Delete: CascadeType;
		Merge: CascadeType;
		Reparent: CascadeType;
		Share: CascadeType;
		Unshare: CascadeType;
	}

	/**
	 * Interface for AssociatedMenuConfiguration
	 */
	interface AssociatedMenuConfiguration {
		AvailableOffline?: boolean;
		Behavior?: AssociatedMenuBehavior;
		Group?: AssociatedMenuGroup;
		Icon?: string;
		IsCustomizable?: boolean;
		Label: string;
		MenuId?: string;
		Order?: number;
		QueryApi?: string;
		ViewId?: string;
	}

	/**
	 * Enum for CascadeType
	 */
	const enum CascadeType {
		NoCascade = 0,
		Cascade = 1,
		Active = 2,
		UserOwned = 3,
		RemoveLink = 4,
		Restrict = 5,
	}

	/**
	 * Enum for RelationshipType
	 */
	const enum RelationshipType {
		OneToManyRelationship = 0,
		ManyToManyRelationship = 1,
	}

	/**
	 * Enum for SecurityTypes
	 */
	const enum SecurityTypes {
		None = 0,
		Append = 1,
		ParentChild = 2,
		Pointer = 4,
		Inheritance = 8,
	}

	/**
	 * Enum for AssociatedMenuBehavior
	 */
	const enum AssociatedMenuBehavior {
		UseCollectionName = 0,
		UseLabel = 1,
		DoNotDisplay = 2,
	}

	/**
	 * Enum for AssociatedMenuGroup
	 */
	const enum AssociatedMenuGroup {
		Details = 0,
		Sales = 1,
		Service = 2,
		Marketing = 3,
	}

	/**
	 * Entity metadata security privileges.
	 */
	interface SecurityPrivilegeMetadata {
		CanBeBasic: boolean;
		CanBeDeep: boolean;
		CanBeGlobal: boolean;
		CanBeLocal: boolean;
		CanBeEntityReference: boolean;
		CanBeParentEntityReference: boolean;
		Name: string;
		PrivilegeId: string;
		PrivilegeType: Constants.PrivilegeType;
	}

	/**
	 * Interface for Process
	 */
	export namespace Process {
		/**
		 * Interface for a CRM Business Process Flow instance.
		 */
		export interface Process {
			/**
			 * Returns the unique identifier of the process.
			 *
			 * @return The identifier for this process, in GUID format.
			 *
			 * @remarks	 Example: "{825CB223-A651-DF11-AA8B-00155DBA3804}".
			 */
			getId(): string;

			/**
			 * Returns the name of the process.
			 *
			 * @return	The name.
			 */
			getName(): string;

			/**
			 * Returns an collection of stages in the process.
			 *
			 * @return	The stages.
			 */
			getStages(): Collection.ItemCollection<Stage>;

			/**
			 * Returns a boolean value to indicate if the process is rendered.
			 *
			 * @return	true if the process is rendered, false if not.
			 */
			isRendered(): boolean;
		}

		/**
		 * Interface for CRM Business Process Flow stages.
		 */
		export interface Stage {
			/**
			 * Returns an object with a getValue method which will return the integer value of the business process flow
			 * category.
			 *
			 * @return	The stage category.
			 */
			getCategory(): { getValue(): Constants.StageCategory };

			/**
			 * Returns the logical name of the entity associated with the stage.
			 *
			 * @return	The entity name.
			 */
			getEntityName(): string;

			/**
			 * Returns the unique identifier of the stage.
			 *
			 * @return	The identifier of the Stage, in GUID format.
			 *
			 * @remarks	 Example: "{825CB223-A651-DF11-AA8B-00155DBA3804}".
			 */
			getId(): string;

			/**
			 * Returns the name of the stage.
			 *
			 * @return	The name.
			 */
			getName(): string;

			/**
			 * Returns the status of the stage.
			 *
			 * @return	The status.
			 *
			 * @remarks	 This method will return either "active" or "inactive".
			 */
			getStatus(): string;

			/**
			 * Returns a collection of steps in the stage.
			 *
			 * @return	An array of Step.
			 */
			getSteps(): Collection.ItemCollection<Step>;

			/**
			 * Returns a Navigation behavior object.
			 *
			 * @return  Navigation behavior object.
			 */
			getNavigationBehavior(): XrmProcessNavigationBehavior;
		}

		export interface Step {
			/**
			 * Returns the logical name of the attribute associated to the step.
			 *
			 * @return	The attribute.
			 *
			 * @remarks	 Some steps don’t contain an attribute value.
			 */
			getAttribute(): string;

			/**
			 * Returns the name of the step.
			 *
			 * @return	The name.
			 */
			getName(): string;

			/**
			 * Returns whether the step is required in the business process flow.
			 *
			 * @return	true if required, false if not.
			 *
			 * @remarks	 Returns true if the step is marked as required in the Business Process Flow editor; otherwise, false.
			 *	There is no connection between this value and the values you can change in the Xrm.Page.data.entity
			 *	attribute RequiredLevel methods.
			 */
			isRequired(): boolean;

			/**
			 * returns the progress of the step
			 */
			getProgress(): Constants.StepProgress;

			/**
			 * sets the progress of the step
			 */
			setProgress(progress: Constants.StepProgress, message?: string): string;
		}

		/**
		 * Interface for the Xrm.Page.data.process API.
		 */
		export interface ProcessManager {
			/**
			 * Sets a function to be called when a process state change is detected.
			 * @param handler The function to be called when a process state change is detected.
			 */
			addOnProcessStatusChange(handler: ProcessCallbackDelegate): void;

			/**
			 * Remove a handler from the process control's OnProcessStatusChange event.
			 * @param handler OnProcessStatusChange event handler.
			 */
			removeOnProcessStatusChange(handler: ProcessCallbackDelegate): void;

			/**
			 * Sets a function to be called before process status change
			 * @param handler The function to be called when a process state change is detected.
			 */
			addOnPreProcessStatusChange(handler: ProcessCallbackDelegate): void;

			/**
			 * Remove a handler from the process control's OnPreProcessStatusChange event.
			 * @param handler OnProcessStatusChange event handler.
			 */
			removeOnPreProcessStatusChange(handler: ProcessCallbackDelegate): void;

			/**
			 * Use this to add a function as an event handler for the OnStageChange event so that it will be called when the
			 * business process flow stage changes.
			 *
			 * @param	{EventHandler}	handler The function will be added to the bottom of the event handler
			 *	  pipeline. The execution context is automatically set to be the first
			 *	  parameter passed to the event handler.
			 */
			addOnStageChange(handler: EventHandler): void;

			/**
			 * Removes a handler from the process control's OnStageChange event.
			 * @param handler OnStageChange event handler.
			 */
			removeOnStageChange(handler: EventHandler): void;

			/**
			 * Use this to add a function as an event handler for the OnPreStageChange event so that it will be called when the
			 * business process flow stage changes.
			 *
			 * @param	{EventHandler}	handler The function will be added to the top of the event handler
			 *	  pipeline. The execution context is automatically set to be the first
			 *	  parameter passed to the event handler.
			 */
			addOnPreStageChange(handler: EventHandler): void;

			/**
			 * Removes a handler from the process control's OnPreStageChange event.
			 * @param handler OnStageChange event handler.
			 */
			removeOnPreStageChange(handler: EventHandler): void;

			/**
			 * Use this to add a function as an event handler for the OnStageSelected event so that it will be called when the
			 * business process flow stage is selected.
			 *
			 * @param	{EventHandler}	handler The function will be added to the bottom of the event handler
			 *	  pipeline. The execution context is automatically set to be the first
			 *	  parameter passed to the event handler.
			 */
			addOnStageSelected(handler: EventHandler): void;

			/**
			 * Use this to remove a function as an event handler for the OnStageSelected event.
			 *
			 * @param	{EventHandler}	handler If an anonymous function is set using the addOnStageSelected method it
			 *	  cannot be removed using this method.
			 */
			removeOnStageSelected(handler: EventHandler): void;

			/**
			 * Returns a Process object representing the active process.
			 *
			 * @return	current active process.
			 */
			getActiveProcess(): Process;

			/**
			 * Sets the specified process as active.
			 * @param processInstanceId ID of the processInstance definition.
			 * @param callback The success callback.
			 */
			setActiveProcessInstance(processInstanceId: string, callback: ProcessCallbackDelegate): void;

			/**
			 * Set a Process as the active process.
			 *
			 * @param	{string} processId	the Id of the process to make the active process.
			 * @param	{function}	callbackFunction (Optional) a function to call when the operation is complete.
			 */
			setActiveProcess(processId: string, callbackFunction?: ProcessCallbackDelegate): void;

			/**
			 * Gets status of bpf instance
			 * @param newStatus status of BPF instance
			 * @param callback The success callback.
			 */
			setStatus(newStatus: string, callback: ProcessCallbackDelegate): void;

			/**
			 * Gets status of bpf instance
			 * @returns Instance Status
			 */
			getStatus(): string;

			/**
			 * Gets Name of bpf instance
			 * @returns Instance Status
			 */
			getInstanceName(): string;

			/**
			 * Gets Id of bpf instance
			 * @returns Instance Status
			 */
			getInstanceId(): string;

			/**
			 * Returns a Stage object representing the active stage.
			 *
			 * @return	current active stage.
			 */
			getActiveStage(): Stage;

			/**
			 * Set a stage as the active stage.
			 *
			 * @param	{string} stageId the Id of the stage to make the active stage.
			 * @param	{function}	callbackFunction (Optional) a function to call when the operation is complete.
			 */
			setActiveStage(stageId: string, callbackFunction?: ProcessCallbackDelegate): void;

			/**
			 * Use this method to get a collection of stages currently in the active path with methods to interact with the
			 * stages displayed in the business process flow control. The active path represents stages currently rendered in
			 * the process control based on the branching rules and current data in the record.
			 *
			 * @return	A collection of all completed stages, the currently active stage, and the predicted set of future stages
			 * based on satisfied conditions in the branching rule. This may be a subset of the stages returned with
			 * Xrm.Page.data.process.getActiveProcess because it will only include those stages which represent a valid
			 * transition from the current stage based on branching that has occurred in the process.
			 */
			getActivePath(): Collection.ItemCollection<Stage>;

			/**
			 * Use this method to asynchronously retrieve the enabled business process flows that the user can switch to for an
			 * entity.
			 *
			 * @param	{Function} callbackFunction	  The callback function must accept a parameter
			 *		 that contains an object with dictionary
			 *		 properties where the name of the property is the
			 *		 Id of the business process flow and the value of
			 *		 the property is the name of the business process
			 *		 flow.
			 *
			 *		 The enabled processes are filtered according to
			 *		 the user’s privileges. The list of enabled
			 *		 processes is the same ones a user can see in the
			 *		 UI if they want to change the process manually.
			 */
			getEnabledProcesses(callbackFunction: (enabledProcesses: ProcessDictionary) => void): void;

			/**
			 * Get the list of all processes that a user can access
			 * @param	{Function} callbackFunction	The callback function must accept a parameter
			 *		 that with the following attributes and their corresponding values as the key: value pair.
			 *		 CreatedOnDate, ProcessDefinitionID, ProcessDefinitionName, ProcessInstanceID, ProcessInstanceName, StatusCodeName
			 *		 The processes instances are filtered according to the user’s privileges.
			 */
			getProcessInstances(callbackFunction: (processInstances: ProcessInstanceDictionary) => void): void;

			/**
			 * Returns an object for the selected stage.
			 * @returns Stage Object.
			 */
			getSelectedStage(): Process.Stage;

			/**
			 * Progresses to the next stage.
			 *
			 * @param	{ProcessCallbackDelegate}	callbackFunction (Optional) A function to call when the operation is
			 *	  complete.
			 */
			moveNext(callbackFunction?: ProcessCallbackDelegate): void;

			/**
			 * Moves to the previous stage.
			 *
			 * @param	{ProcessCallbackDelegate}	callbackFunction (Optional) A function to call when the operation is
			 *	  complete.
			 */
			movePrevious(callbackFunction?: ProcessCallbackDelegate): void;
		}

		/**
		 * Called when process change methods have completed.
		 *
		 * @param {string} status  The result of the process change operation.
		 * @remarks	 Values returned are: success  (The operation succeeded.)
		 *	   crossEntity (The previous stage is for a different entity.)
		 *	   beginning   (The active stage is the first stage of the active path.)
		 *	   invalid	(The operation failed because the selected stage isn’t the same
		 *	   as the active stage.)
		 *	   unreachable (The stage exists on a different path.)
		 */

		export type ProcessCallbackDelegate = (status: string) => void;

		/**
		 * Represents a key-value pair, where the key is the Process Flow's ID, and the value is the name thereof.
		 */
		export type ProcessDictionary = { [index: string]: string };

		/*
		 * Represents process instance object model
		 */
		export interface ProcessInstance {
			/* The date when process was created */
			CreatedOnDate: Date;

			/* The process defintion id */
			ProcessDefinitionID: string;

			/* The process definition name */
			ProcessDefinitionName: string;

			/* The process instance id */
			ProcessInstanceID: string;

			/* The process instance name */
			ProcessInstanceName: string;

			/* The status code name of the process instance */
			StatusCodeName: string;
		}

		/**
		 * Represents a key-value pair, where the key is the Process Instance ID, and the value is the instance model thereof.
		 */
		export type ProcessInstanceDictionary = { [index: string]: ProcessInstance };
	}

	export namespace Constants {
		export interface ConstantsStatic {
			AttributeTypes: AttributeTypeStatic;
			ClientNames: ClientNameStatic;
			ClientStates: ClientStateStatic;
			ControlTypes: ControlTypeStatic;
			FormNotificationLevels: FormNotificationLevelStatic;
			ControlNotificationLevel: ControlNotificationLevelStatic;
			FormSaveActions: FormSaveActionStatic;
			AttributeRequiredLevels: AttributeRequiredLevelStatic;
			AttributeSubmitModes: AttributeSubmitModeStatic;
			TabDisplayStates: TabDisplayStateStatic;
			AttributeFormats: AttributeFormatStatic;
			EntityNames: EntityNameStatic;
			ProcessInstanceStatuses: ProcessInstanceStatusStatic;
			ProcessNavigationDirections: ProcessNavigationDirectionStatic;
			ProcessStageStatuses: ProcessStageStatusStatic;
		}

		/**
		 * List of days in the week
		 */
		const enum DayOfWeek {
			Sunday = 0,
			Monday = 1,
			Tuesday = 2,
			Wednesday = 3,
			Thursday = 4,
			Friday = 5,
			Saturday = 6,
		}

		const enum DataLoadState {
			InitialLoad = 1,
			Save = 2,
			Refresh = 3,
		}

		/**
		 * Enumeration of entity form states/types.
		 */
		const enum FormType {
			Undefined = 0,
			Create = 1,
			Update = 2,
			ReadOnly = 3,
			Disabled = 4,
			TaskBasedFlow = 5,
			BulkEdit = 6,
			Dialog = 12,
		}

		/**
		 * Enumeration of window position
		 */
		const enum WindowPosition {
			center = 1,
			side = 2,
			inline = 3,
		}

		/**
		 * Enumeration of entity form save modes.
		 */
		const enum SaveMode {
			Save = 1,
			SaveAndClose = 2,
			Deactivate = 5,
			Reactivate = 6,
			Send = 7,
			Disqualify = 15,
			Qualify = 16,
			Assign = 47,
			SaveAsCompleted = 58,
			SaveAndNew = 59,
			AutoSave = 70,
		}

		/**
		 * Entity privilege types.
		 */
		const enum PrivilegeType {
			None = 0,
			Create = 1,
			Read = 2,
			Write = 3,
			Delete = 4,
			Assign = 5,
			Share = 6,
			Append = 7,
			AppendTo = 8,
		}

		/**
		 * Enumeration of stage categories.
		 */
		const enum StageCategory {
			Qualify = 0,
			Develop = 1,
			Propose = 2,
			Close = 3,
			Identify = 4,
			Research = 5,
			Resolve = 6,
		}

		/**
		 * Enumeration of step progress
		 */
		const enum StepProgress {
			None = 0,
			Processing = 1,
			Completed = 2,
			Failure = 3,
			Invalid = 4,
		}

		/**
		 * Return values for the client form factor.
		 */
		const enum FormFactor {
			Unknown = 0,
			Desktop = 1,
			Tablet = 2,
			Phone = 3,
		}

		/**
		 * Enum used to inidicate the client type
		 */
		const enum ClientType {
			Browser = 0,
			MobileApplication = 1,
		}

		/**
		 * role type in relations
		 */
		const enum roleType {
			Referencing = 1,
			AssociationEntity = 2,
		}

		const enum relationshipType {
			OneToMany = 0,
			ManyToMany = 1,
		}

		/**
		 * Options for the grid type.
		 */
		export const enum GridType {
			HomePageGrid = 1,
			Associated = 2,
			Subgrid = 3,
		}

		/**
		 * Entity ownership types.
		 */
		const enum EntityOwnershipType {
			/**
			 * The entity does not have an owner. For internal use only.
			 */
			None = 0,

			/**
			 * The entity is owned by a system user.
			 */
			UserOwned = 1,

			/**
			 * The entity is owned by a team. For internal use only.
			 */
			TeamOwned = 2,

			/**
			 * The entity is owned by a business unit. For internal use only.
			 */
			BusinessOwned = 4,

			/**
			 * The entity is owned by an organization.
			 */
			OrganizationOwned = 8,

			/**
			 * The entity is parented by a business unit. For internal use only.
			 */
			BusinessParented = 16,
		}

		/**
		 * The options for global notification types.
		 */
		const enum GlobalNotificationType {
			/**
			 * Toast notification type.
			 */
			toast = 1,
		}

		/**
		 * The options for global notification levels.
		 */
		const enum GlobalNotificationLevel {
			/**
			 * Success notification level.
			 */
			success = 1,

			/**
			 * Error notification level.
			 */
			error = 2,

			/**
			 * Warning notification level.
			 */
			warning = 3,

			/**
			 * Information notification level.
			 */
			information = 4,
		}

		/**
		 * The options for openFile mode.
		 */
		const enum OpenFileMode {
			open = 1,
			save = 2,
		}

		/**
		 * Enum indicating navigation direction. Same enum values as BusinessProcessFlow/Utils/BusinessProcessFlowNavigationDirection
		 */
		const enum ProcessNavigationDirectionEnum {
			/**
			 * Indicates forward navigation.
			 */
			Next = 0,

			/**
			 *  Indicates backward navigation.
			 */
			Previous = 1,
		}

		/**
		 * Enum indicating desired side panel state
		 */
		const enum PanelState {
			/**
			 * Indicates collapsed state.
			 */
			Collapsed = 0,

			/**
			 *  Indicates expanded state
			 */
			Expanded = 1,

			/**
			 *  Indicates hidden state
			 */
			Hidden = 2,
		}

		/**
		 * Enum indicating desired side panel position
		 */
		const enum PanelPosition {
			/**
			 * Indicates left position.
			 */
			Left = 1,

			/**
			 *  Indicates right position
			 */
			Right = 2,
		}

		interface AttributeTypeStatic {
			/**
			 * Boolean attribute type.
			 */
			booleanType: "boolean";

			/**
			 * DateTime attribute type.
			 */
			dateTimeType: "datetime";

			/**
			 * decimal Attribute Type
			 */
			decimalType: "decimal";

			/**
			 * double Attribute Type
			 */
			doubleType: "double";

			/**
			 * integer Attribute Type
			 */
			integerType: "integer";

			/**
			 * lookup Attribute Type
			 */
			lookupType: "lookup";

			/**
			 * memo Attribute Type
			 */
			memoType: "memo";

			/**
			 * money Attribute Type
			 */
			moneyType: "money";

			/**
			 * optionSet Attribute Type
			 */
			optionSetType: "optionset";

			/**
			 * string Attribute Type
			 */
			stringType: "string";
		}

		type AttributeType =
			| "boolean"
			| "datetime"
			| "decimal"
			| "double"
			| "integer"
			| "lookup"
			| "memo"
			| "money"
			| "optionset"
			| "string";

		interface ClientNameStatic {
			/**
			 * String representing the mobile client (MoCA).
			 */
			mobile: "Mobile";

			/**
			 * String representing the Outlook client.
			 */
			outlook: "Outlook";

			/**
			 * String representing the Web client (classic app).
			 */
			web: "Web";

			/**
			 * String representing the Desktop client (Unified Service Desk).
			 */
			unifiedServiceDesk: "UnifiedServiceDesk";
		}

		type ClientName = "Mobile" | "Outlook" | "Web" | "UnifiedServiceDesk";

		interface ClientStateStatic {
			/**
			 * Name for the Online State.
			 */
			online: "Online";

			/**
			 * Name for the Offline State.
			 */
			offline: "Offline";
		}

		type ClientState = "Online" | "Offline";

		/**
		 * The type of control.
		 */
		interface ControlTypeStatic {
			/**
			 * Button control type.
			 * NOT PUBLISHED
			 */
			button: "button";

			/**
			 * Standard control type.
			 */
			standard: "standard";

			/**
			 * IFrame control type.
			 */
			iFrame: "iframe";

			/**
			 * Lookup control type.
			 */
			lookup: "lookup";

			/**
			 * OptionSet control type.
			 */
			optionSet: "optionset";

			/**
			 * SubGrid control type.
			 */
			subGrid: "subgrid";

			/**
			 * WebResource control type.
			 */
			webResource: "webresource";

			/**
			 * Notes control type.
			 */
			notes: "notes";

			/**
			 * Timer control type.
			 */
			timer: "timercontrol";

			/**
			 * Kb search control type.
			 */
			kbsearch: "kbsearch";

			/**
			 * Quick form control type.
			 * NOT PUBLISHED
			 */
			quickFormControl: "quickform";

			/**
			 * custom control type.
			 */
			customcontrol: "customcontrol";

			/**
			 * custom subgrid control type.
			 */
			customsubgrid: "customsubgrid";
		}

		type ControlType =
			| "quickform"
			| "kbsearch"
			| "notes"
			| "webresource"
			| "subgrid"
			| "lookup"
			| "optionset"
			| "iframe"
			| "standard"
			| "button"
			| "customcontrol"
			| "customsubgrid";

		/**
		 * The options for notification levels.
		 */
		interface FormNotificationLevelStatic {
			/**
			 * Error notification level.
			 */
			error: "ERROR";

			/**
			 * Warning notification level.
			 */
			warning: "WARNING";

			/**
			 * Information notification level.
			 */
			information: "INFO";
		}

		type FormNotificationLevel = "ERROR" | "WARNING" | "INFO";

		/**
		 * The options for notification levels.
		 */
		interface ControlNotificationLevelStatic {
			/**
			 * Error notification level.
			 */
			error: "ERROR";

			/**
			 * recommendation notification level.
			 */
			recommendation: "RECOMMENDATION";
		}

		type ControlNotificationLevel = "ERROR" | "RECOMMENDATION";

		/**
		 * The type of save action to perform on the form.
		 */
		interface FormSaveActionStatic {
			/**
			 * Save only.
			 */
			save: "save";

			/**
			 * Save and Close.
			 */
			saveAndClose: "saveandclose";

			/**
			 * Save and New.
			 */
			saveAndNew: "saveandnew";
		}

		type FormSaveAction = "save" | "saveandclose" | "saveandnew";

		interface AttributeFormatStatic {
			/**
			 * Date format.
			 */
			date: "date";

			/**
			 * DateTime format.
			 */
			dateTime: "datetime";

			/**
			 * Duration format.
			 */
			duration: "duration";

			/**
			 * Email format.
			 */
			email: "email";

			/**
			 * Language format.
			 */
			language: "language";

			/**
			 * None format.
			 */
			none: "none";

			/**
			 * Phone format.
			 */
			phone: "phone";

			/**
			 * Text format.
			 */
			text: "text";

			/**
			 * TextArea format.
			 */
			textArea: "textarea";

			/**
			 * TickerSymbol format.
			 */
			tickerSymbol: "tickersymbol";

			/**
			 * TimeZone format.
			 */
			timeZone: "timezone";

			/**
			 * Url format.
			 */
			url: "url";
		}

		type AttributeFormat =
			| "url"
			| "timezone"
			| "tickersymbol"
			| "textarea"
			| "text"
			| "phone"
			| "none"
			| "language"
			| "email"
			| "duration"
			| "datetime"
			| "date";

		/**
		 * The requirement level of an attribute.
		 */
		interface AttributeRequiredLevelStatic {
			/**
			 * Required level None.
			 */
			none: "none";

			/**
			 * Required level Recommended.
			 */
			recommended: "recommended";

			/**
			 * Required level Required.
			 */
			required: "required";
		}

		type AttributeRequiredLevel = "none" | "recommended" | "required";

		interface AttributeSubmitModeStatic {
			/**
			 * Submit only when dirty.
			 */
			dirty: "dirty";
			/**
			 * Submit always.
			 */
			always: "always";

			/**
			 * Submit never.
			 */
			never: "never";
		}

		type AttributeSubmitMode = "dirty" | "always" | "never";

		/**
		 * Possible values for the tab display state.
		 */
		interface TabDisplayStateStatic {
			/**
			 * Tab is expanded.
			 */
			expanded: "expanded";
			/**
			 * Tab is collapsed.
			 */
			collapsed: "collapsed";
		}

		type TabDisplayState = "expanded" | "collapsed";

		/**
		 * Name of the Entity
		 */
		interface EntityNameStatic {
			/**
			 * Name of entity type ActivityParty
			 */
			ActivityParty: "activityparty";

			/**
			 * Name of entity type ActivityPointer
			 */
			ActivityPointer: "activitypointer";

			/**
			 * Name of entity type Annotation
			 */
			Annotation: "annotation";

			/**
			 * Name of entity type Attachment
			 */
			Attachment: "attachment";

			/**
			 * Name of entity type Category
			 */
			Category: "category";

			/**
			 * Name of entity type Connection
			 */
			Connection: "connection";

			/**
			 * Name of entity type ConnectionRole
			 */
			ConnectionRole: "connectionrole";

			/**
			 * Name of entity type SystemUser
			 */
			SystemUser: "systemuser";

			/**
			 * Name of entity type Team
			 */
			Team: "team";

			/**
			 * Name of entity type TeamMembership
			 */
			TeamMembership: "teammembership";

			/**
			 * Name of entity type WebResource
			 */
			WebResource: "webresource";
		}

		type EntityName =
			| "activityparty"
			| "activitypointer"
			| "annotation"
			| "attachment"
			| "category"
			| "connection"
			| "connectionrole"
			| "systemuser"
			| "team"
			| "teammembership"
			| "webresource";

		/**
		 * The possible values for process instance status
		 */
		interface ProcessInstanceStatusStatic {
			/**
			 * instance is active
			 */
			active: "active";

			/**
			 * instance is finished
			 */
			finished: "finished";

			/**
			 * instance is aborted
			 */
			aborted: "aborted";
		}

		type ProcessInstanceStatus = "active" | "finish" | "aborted";

		/**
		 * The possible values for process navigation direction
		 */
		export interface ProcessNavigationDirectionStatic {
			/**
			 * Indicates forward navigation.
			 */
			Next: "Next";

			/**
			 *  Indicates backward navigation.
			 */
			Previous: "Previous";
		}

		export type ProcessNavigationDirectionValue = "Next" | "Previous";

		interface ProcessStageStatusStatic {
			/**
			 * The stage is active
			 */
			active: "active";

			/**
			 * The stage is inactive
			 */
			inactive: "inactive";
		}

		type ProcessStageStatus = "active" | "inactive";

		/**
		 * Attribute type code for attribute metadata
		 */
		const enum AttributeTypeCode {
			Boolean = 0,
			Customer = 1,
			DateTime = 2,
			Decimal = 3,
			Double = 4,
			Integer = 5,
			Lookup = 6,
			Memo = 7,
			Money = 8,
			Owner = 9,
			PartyList = 10,
			Picklist = 11,
			State = 12,
			Status = 13,
			String = 14,
			Uniqueidentifier = 15,
			CalendarRules = 16,
			Virtual = 17,
			BigInt = 18,
			ManagedProperty = 19,
			EntityName = 20,
			Image = 23,
		}

		/**
		 * Type of filter command for KBSearch control
		 */
		const enum SearchWidgetCommand {
			ArticlesFilter = 0,
			LanguageFilter = 1,
			SortFilter = 2,
		}

		/**
		 * search Type
		 */
		const enum SearchType {
			RelevanceSearch = 0,
			CategorizedSearch = 1,
			CustomSearch = 2,
		}
	}

	/**
	 * Represents the String parameters for Confirm Dialog.
	 */
	export interface ConfirmDialogStrings {
		/**
		 * Confirm Dialog Title.
		 */
		title?: string;

		/**
		 * Confirm Dialog Subtitle
		 */
		subtitle?: string;

		/**
		 * Confirm Dialog Text\Message.
		 */
		text: string;

		/**
		 * Confirm Button Label
		 */
		confirmButtonLabel?: string;

		/**
		 * Cancel Button label.
		 */
		cancelButtonLabel?: string;
	}

	/**
	 * Represents the String parameters for Alert Dialog.
	 */
	export interface AlertDialogStrings {
		/**
		 * Alert Dialog Text
		 */
		text: string;

		/**
		 * Confirm button label.
		 */
		confirmButtonLabel?: string;
	}

	/**
	 * Options used when opening a lookup dialog.
	 */
	export interface LookupOptions {
		/**
		 *	Whether the lookup allows more than one item to be selected.
		 */
		allowMultiSelect?: boolean;

		/**
		 *	The default entity type.
		 */
		defaultEntityType?: string;

		/**
		 *	The default view to use.
		 */
		defaultViewId?: string;

		/**
		 *  Whether the MRU will be disabled.  Default is false.
		 */
		disableMru?: boolean;

		/**
		 *	The entity types to display.
		 */
		entityTypes: string[];

		/**
		 * Filters to apply to the data source when displaying values.
		 */
		filters?: LookupFilter[];

		/**
		 *	The views to be available in the view picker.  Only System views are supported (not user views).
		 */
		viewIds?: string[];

		/**
		 *	Specifies whether the lookup control should show the barcode scanner in app shims.
		 */
		showBarcodeScanner?: boolean;
	}

	/**
	 * Filters for Lookup Control
	 */
	export interface LookupFilter {
		/**
		 * Filter XML
		 */
		filterXml: string;

		/**
		 * Entity logical name
		 */
		entityLogicalName?: string;
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
		roleType: Constants.roleType;

		/**
		 * type of relationship
		 */
		relationshipType: Constants.relationshipType;

		/**
		 * Name of the navigation property for this relationship
		 */
		navigationPropertyName: string;
	}

	/**
	 * Interface for commanding
	 */
	export namespace Commanding {
		/**
		 *	Entity Reference definition
		 */
		export interface EntityReference {
			/**
			 * A string of the GUID Id value for the record.
			 */
			Id: string;

			/**
			 * A string of the value of the Primary field for the record.
			 */
			Name: string;

			/**
			 * A string representing the unique name of the entity for the record.
			 */
			TypeName: string;
		}

		/**
		 * Grid object definition
		 */
		export interface Grid extends Controls.GridControl {}

		/**
		 * Dashboard object definition
		 */
		export interface Dashboard extends XrmClientApi.Dashboard {}

		/**
		 * Form object definition
		 */
		export interface Form extends XrmClientApi.Form {}

		/**
		 * KBSearch object definition
		 */
		export interface KBSearch extends XrmClientApi.KBSearch {}
	}

	/**
	 * Base type for attribute metadata
	 */
	interface AttributeMetadata {
		LogicalName: string;
		DisplayName: string;
		AttributeType: XrmClientApi.Constants.AttributeTypeCode;
		EntityLogicalName: string;
	}

	/**
	 * Attribute metadata type for lookup type
	 */
	interface LookupAttributeMetadata extends AttributeMetadata {
		Targets: string[];
	}

	/**
	 * Attribute metadata type for state-code attribute
	 */
	interface StateAttributeMetadata extends EnumAttributeMetadata {
		getDefaultStatus(state: number): number;
		getStatusValuesForState(state: number): number[];
	}

	/**
	 * Attribute metadata type for status-code attribute
	 */
	interface StatusAttributeMetadata extends EnumAttributeMetadata {
		getState(status: number): number;
	}

	/**
	 * Attribute metadata type for option-set and boolean attribute
	 */
	interface EnumAttributeMetadata extends AttributeMetadata {
		OptionSet: OptionSetOptions;
	}

	/**
	 * Attribute metadata type for option-set and boolean attribute
	 */
	interface BooleanAttributeMetadata extends EnumAttributeMetadata {
		DefaultFormValue?: boolean;
	}

	/**
	 * Attribute metadata type for option-set and boolean attribute
	 */
	interface PicklistAttributeMetadata extends EnumAttributeMetadata {
		DefaultFormValue?: number;
	}

	/**
	 * Interface for Optionset value
	 */
	interface OptionSetOptions {
		[key: number]: OptionSetItem;
	}

	/**
	 * Navigation behavior definition
	 */
	export interface XrmProcessNavigationBehavior {
		allowCreateNew: (currentStage: XrmClientApi.Process.Stage) => boolean;
	}
}
