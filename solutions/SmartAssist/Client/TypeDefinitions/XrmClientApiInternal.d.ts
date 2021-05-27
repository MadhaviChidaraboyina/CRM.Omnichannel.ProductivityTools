/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/**
 * these api are for internal use and are not published
 */
 declare namespace XrmClientApi {
	/**
	 * Static Xrm object.
	 */
	export interface XrmStatic {
		/**
		 * Diagnostics
		 */
		Diagnostics: Diagnostics;

		/**
		 * Provides a container for useful functions to access external contexts.
		 */
		ExternalContext: ExternalContext;

		/**
		 * this holds all the internal API
		 */
		Internal: XrmClientApi.Internal;

		/**
		 * Reporting
		 */
		Reporting: Reporting;

		/**
		 * Provides a container for useful functions to call device capabilities.
		 */
		Device: Device;
	}

	/**
	 * Interface for Xrm App object which contains functionality related to Application Shell.
	 */
	export interface App {
		/**
		 * Gets the collection of sessions currently open.
		 * @returns Returns the XrmAppSessions object
		 */
		sessions: AppSessions;

		/**
		 * Gets the collection of panels currently open.
		 * @returns Returns the XrmAppPanels object
		 */
		panels: SidePanels;

		/**
		 * Object for managing side panes.
		 * @returns The the XrmAppSidePanes object
		 */
		sidePanes: AppSidePanes;
	}

	/**
	 * Options passed in when creating a new pane.
	 */
	export interface AppSidePaneOptions {
		/**
		 * If passed in, will be used as the ID of the new pane; otherwise will be auto generated.
		 */
		paneId?: string;
		/**
		 * Whether the pane header will show a close button.
		 */
		canClose?: boolean;
		/**
		 * The path of the icon to show in the pane switcher control.
		 */
		imageSrc?: string;
		/**
		 * The title of the pane. Will be used in pane header and for tooltip.
		 */
		title?: string;
		/**
		 * Hides the pane header, including title and close button, default = false
		 */
		hideHeader?: boolean;
		/**
		 * Will focus after Pane is created. Defaults to true.
		 */
		isSelected?: boolean;
		/**
		 * The width of the pane in pixels.
		 */
		width?: number;
		/**
		 * Hides the pane and the tab
		 */
		hidden?: boolean;
		/**
		 * Prevents panel from unmounting when it's hidden.
		 */
		alwaysRender?: boolean;
		/**
		 * 	Prevents the badge from getting cleared when the pane becomes selected.
		 */
		keepBadgeOnSelect?: boolean;
	}

	/**
	 * APIs for managing the history of a navigation context.
	 */
	export interface NavigationHistory {
		/**
		 * Navigate to previous page. If history stack is empty, default page will be navigated to.
		 */
		back(): Promise<void>;
		/**
		 * Clear the history stack. Current page will still be maintained.
		 */
		clear(): void;
		/**
		 * Get pageInput of current page.
		 */
		currentPageInput: PageInput;
		/**
		 * Get URL of current page.
		 */
		currentUrl: string;
		/**
		 * Whether the history stack is empty or not.
		 */
		canNavigateBack: boolean;
	}

	/**
	 * Options that can be passed in when performing a navigation.
	 */
	export interface NavigateOptions {
		/**
		 * If true, a new history entry will not be added, the current one will be replaced. i.e. refresh
		 */
		replaceState?: boolean;
		/**
		 * Whether the history stack should be cleared during the navigation.
		 */
		resetHistory?: boolean;
	}

	/**
	 * Represents a navigation surface.
	 */
	export interface NavigationContext {
		/**
		 * Navigate to a new page.
		 * @param input Page input of page to navigate to
		 * @param options Navigation options
		 */
		navigate(input: PageInput, options?: NavigateOptions): Promise<void>;
		/**
		 * Used to access the history APIs of the navigation context.
		 */
		history: NavigationHistory;
	}

	/**
	 * Collection of App level panes rendered on far side of UCI.
	 * Grouped together in vertical tab list.
	 */
	export interface AppSidePanes {
		/**
		 * Whether the selected pane is collapsed or expanded.
		 */
		state: XrmClientApi.Constants.SidePanesState;
		/**
		 * Add empty Pane to SideBar. Need to call pane.navigateTo() to load the page.
		 */
		createPane(input: AppSidePaneOptions): Promise<AppSidePane>;
		/**
		 * Returns a collection containing all active panes.
		 */
		getAllPanes(): Collection.ItemCollection<AppSidePane>;
		/**
		 * Returns the Pane corresponding to the input ID. If Pane does not exist, undefined is returned.
		 * @param id ID of the pane
		 */
		getPane(id: string): AppSidePane;
		/**
		 * Return the current selected pane.
		 */
		getSelectedPane(): AppSidePane;
	}

	/**
	 * Hosts a UCI page at the app level, side by side with the main page.
	 */
	export interface AppSidePane extends NavigationContext {
		/**
		 * Close the pane and remove it from the sideBar.
		 */
		close(): Promise<void>;
		/**
		 * Set this pane to be selected and expanded.
		 */
		select(): void;
		/**
		 * The badge of the pane.
		 * Set to true to show a dot badge; false to clear it.
		 * When a number value is assigned, the count will be displayed in the badge.
		 * When an imageSrc value is assigned, the image will be rendered in the badge.
		 */
		badge: boolean | number | string;
		/**
		 * ID of this pane.
		 */
		paneId: string;
		/**
		 * Title of the pane. Used for tab tooltip and header title.
		 */
		title: string;
		/**
		 * Whether the user can close this pane.
		 */
		canClose: boolean;
		/**
		 * Path of image to use in Pane Tab.
		 */
		imageSrc: string;
		/**
		 * Hides the pane and the tab
		 */
		hidden: boolean;
		/**
		 * Width of the pane in pixels.
		 */
		width: number;
		/**
		 * Prevents panel from unmounting when it's hidden.
		 */
		alwaysRender?: boolean;
		/**
		 * 	Prevents the badge from getting cleared when the pane becomes selected.
		 */
		keepBadgeOnSelect?: boolean;
	}

	/**
	 * Interface for Xrm.App.Panels object.
	 */
	export interface SidePanels {
		/**
		 * Loads the side panel with the provided panel options
		 * @param options the desired options for the side panel
		 */
		loadPanel(options: XrmClientApi.PanelOptions): Promise<string>;

		/**
		 * Returns the panel corresponding to the id passed in.
		 * @param id ID of the panel to return.
		 */
		getPanel(id: string): SidePanel;
	}

	/**
	 * Interface for SidePanel object
	 */
	export interface SidePanel {
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
		readonly url?: string;

		/*
		 * Width of the side panel in pixels.
		 */
		width?: number;

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

	type Panel = SidePanel | LegacyPanel;

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
		addOnAfterSessionCreate(handler: EventHandler): string;

		/**
		 * Remove a SessionCreate handler.
		 * @param handlerId Identifier of handler to remove
		 */
		removeOnAfterSessionCreate(handlerId: string): void;

		/**
		 * Add a SessionClose handler. Will be fired after session is closed.
		 * @param handler handler to fire on session close.
		 */
		addOnAfterSessionClose(handler: EventHandler): string;

		/**
		 * Remove a SessionClose handler.
		 * @param handlerId Identifier of handler to remove
		 */
		removeOnAfterSessionClose(handlerId: string): void;

		/**
		 * Add a SessionSwitch handler. Will be fired after session is switched.
		 * @param handler handler to fire on session switch.
		 */
		addOnAfterSessionSwitch(handler: EventHandler): string;

		/**
		 * Remove a SessionSwitch handler.
		 * @param handlerId Identifier of handler to remove
		 */
		removeOnAfterSessionSwitch(handlerId: string): void;

		/**
		 * Add a TabCreate handler. Will be fired after tab is created.
		 * @param handler handler to fire on tab create.
		 */
		addOnAfterTabCreate(handler: EventHandler): string;

		/**
		 * Remove a TabCreate handler.
		 * @param handlerId Identifier of handler to remove
		 */
		removeOnAfterTabCreate(handlerId: string): void;

		/**
		 * Add a TabClose handler. Will be fired after tab is closed.
		 * @param handler handler to fire on tab close.
		 */
		addOnAfterTabClose(handler: EventHandler): string;

		/**
		 * Remove a TabClose handler.
		 * @param handlerId Identifier of handler to remove
		 */
		removeOnAfterTabClose(handlerId: string): void;

		/**
		 * Add a TabSwitch handler. Will be fired after tab is switched.
		 * @param handler handler to fire on tab switch.
		 */
		addOnAfterTabSwitch(handler: EventHandler): string;

		/**
		 * Remove a TabSwitch handler.
		 * @param handlerId Identifier of handler to remove
		 */
		removeOnAfterTabSwitch(handlerId: string): void;

		/**
		 * Add a SessionCreate handler. Will be fired Before session is created.
		 * @param handler handler to fire on session create.
		 */
		addOnBeforeSessionCreate(handler: EventHandler): string;

		/**
		 * Remove a SessionCreate handler.
		 * @param handlerId Identifier of handler to remove
		 */
		removeOnBeforeSessionCreate(handlerId: string): void;

		/**
		 * Add a SessionSwitch handler. Will be fired Before session is switched.
		 * @param handler handler to fire on session switch.
		 */
		addOnBeforeSessionSwitch(handler: EventHandler): string;

		/**
		 * Remove a SessionSwitch handler.
		 * @param handlerId Identifier of handler to remove
		 */
		removeOnBeforeSessionSwitch(handlerId: string): void;

		/**
		 * Add a TabCreate handler. Will be fired Before tab is created.
		 * @param handler handler to fire on tab create.
		 */
		addOnBeforeTabCreate(handler: EventHandler): string;

		/**
		 * Remove a TabCreate handler.
		 * @param handlerId Identifier of handler to remove
		 */
		removeOnBeforeTabCreate(handlerId: string): void;

		/**
		 * Add a TabSwitch handler. Will be fired Before tab is switched.
		 * @param handler handler to fire on tab switch.
		 */
		addOnBeforeTabSwitch(handler: EventHandler): string;

		/**
		 * Remove a TabSwitch handler.
		 * @param handlerId Identifier of handler to remove
		 */
		removeOnBeforeTabSwitch(handlerId: string): void;
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

		/**
		 *Icon of the session
		 */
		iconPath: string;

		/**
		 *Title of theIcon of the session
		 */
		iconTitle: string;

		/**
		 * The session's anchor tab
		 */
		anchorTab: AppTab;
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
		 * Get the page input of the current active page in tab
		 */
		currentPageInput: PageInput;

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
	 * Interface for Xrm.Reporting.
	 */
	interface Reporting {
		/**
		 * Reports a success for the component - the sessionid, orgid and userid are automatically appended dimensions
		 *
		 * @param componentName Component that we are currently monitoring
		 * @param params optional parameters
		 */
		reportSuccess(componentName: string, params?: EventParameter[]): void;

		/**
		 * Reports a failure for the component - the sessionid, orgid and userid are automatically appended dimensions
		 *
		 * @param componentName Component that we are currently monitoring
		 * @param failureCode The name for the failure being monitored
		 * @param failureReason Reason for the failure being monitored
		 * @param suggestedMitigation Suggested next steps for how to handle this error
		 * @param failureError The error that was generated
		 * @param params optional parameters
		 */
		reportFailure(
			componentName: string,
			failureError: Error,
			suggestedMitigation?: string,
			params?: XrmClientApi.EventParameter[]
		): void;

		/**
		 * Sends off event to each event listener for processing
		 * @param event - Event to be handled
		 */
		reportEvent(event: XrmClientApi.ApplicationEvent): void;
	}

	/**
	 * Interface for Xrm.Diagnostics.
	 */
	interface Diagnostics {
		/**
		 * trace error.
		 *
		 * @param componentName - Component that we are currently tracing
		 * @param message - trace message
		 */
		traceError(componentName: string, message: string): void;

		/**
		 * trace warning.
		 *
		 * @param componentName - Component that we are currently tracing
		 * @param message - trace message
		 */
		traceWarning(componentName: string, message: string): void;

		/**
		 * trace info.
		 *
		 * @param componentName - Component that we are currently tracing
		 * @param message - trace message
		 */
		traceInfo(componentName: string, message: string): void;

		/**
		 * trace debug.
		 *
		 * @param componentName - Component that we are currently tracing
		 * @param message - trace message
		 */
		traceDebug(componentName: string, message: string): void;
	}

	/**
	 * Interface for Xrm.ExternalContext.
	 */
	export interface ExternalContext {
		/**
		 * Retrieves a property from an external context.
		 * @param {string} externalContextId - The context from which to retrieve the property
		 * @param {string} string - The property to retrieve
		 * @param {ExternalContextPropertyOptions} [options] - Optional. Any additional options for retrieving the property.
		 * @return {Promise<ExternalContextResult>} A promise for the external context property
		 */
		getExternalContextProperty(
			externalContextId: string,
			externalContextPropertyId: string,
			options?: ExternalContextPropertyOptions
		): Promise<ExternalContextSuccessResponse>;

		/**
		 * Invokes an action on an external context.
		 * @param {string} externalContextId - The context upon which to invoke the action
		 * @param {string} externalContextActionId - The action to invoke
		 * @param {ExternalContextActionOptions} [options] - Optional. Any additional options for invoking the action
		 * @return {Promise<ExternalContextResult>} A promise for the invocation result
		 */
		invokeExternalContextAction(
			externalContextId: string,
			externalContextActionId: string,
			options?: ExternalContextActionOptions
		): Promise<ExternalContextSuccessResponse>;

		/**
		 * Retrieves descriptors for all available external contexts.
		 * @return {Collection.ItemCollection<ExternalContextDescriptor>} A collection of the available external contexts.
		 */
		getAvailableExternalContexts(): Collection.ItemCollection<ExternalContextDescriptor>;

		/**
		 * Remove an external context property listener.
		 * @param {string} externalContextId - The context from which to retrieve the property
		 * @param {string} externalContextPropertyId - The property to retrieve
		 * @param {string} externalContextPropertyListenerKey - The update listener key
		 */
		removeExternalContextPropertyListener(
			externalContextId: string,
			externalContextPropertyId: string,
			listener: ExternalContextPropertyListener
		): void;
	}

	/**
	 * The success response from interacting with an external context.
	 */
	export type ExternalContextSuccessResponse = any;

	/**
	 * The error response from interacting with an external context.
	 */
	export interface ExternalContextErrorResponse extends ErrorResponse {
		/**
		 * The raw error from the external context.
		 */
		raw?: any;
	}

	/**
	 * The result from interacting with an external context.
	 */
	export interface ExternalContextResult {
		/**
		 * Whether or not the result was a success.
		 */
		status: "success" | "failure";

		/**
		 * On success, the value of the result.
		 */
		value?: ExternalContextSuccessResponse;

		/**
		 * On error, the resulting error response.
		 */
		error?: ExternalContextErrorResponse;
	}

	/**
	 * Options for retrieving an external context property.
	 */
	export interface ExternalContextPropertyOptions {
		/**
		 * Any arguments that should be used when retrieving the property.
		 */
		args?: { [name: string]: any };

		/**
		 * A listener for updates to the result.
		 * NOTE: This will not be called for the initial result. That will come through
		 * the returned promise. Only subsequent updates to the result will trigger the listener.
		 *
		 * @param {ExternalContextResult} updatedResult - The updated result object
		 */
		updateListener?: ExternalContextPropertyListener;
	}

	/**
	 * Options for retrieving an external context property.
	 */
	export type ExternalContextPropertyListener = (newValue: any) => any;

	/**
	 * Options for invoking an external context action.
	 */
	export interface ExternalContextActionOptions {
		/**
		 * Any arguments that should be used when invoking the action.
		 */
		args?: { [name: string]: any };
	}

	/**
	 * A descriptor for an external context.
	 */
	export interface ExternalContextDescriptor {
		/**
		 * The id of the context.
		 */
		id: string;

		/**
		 * A collection of properties available on the context.
		 */
		properties: Collection.ItemCollection<string>;

		/**
		 * A collection of actions available on the context.
		 */
		actions: Collection.ItemCollection<string>;
	}
	/**
	 * interface for internal API
	 */
	export interface Internal {
		/**
		 * gets the entity name for provided type code
		 * @param entityTypeCode entity type code
		 * @return returns entity name for given type code
		 */
		getEntityName(entityTypeCode: number): string;

		/**
		 * gets entity Name from Entity Type Code
		 * @param entityTypeCode type code of the entity
		 * @returns Entity Name
		 */
		getEntityNameAsync(entityTypeCode: number): Promise<string>;

		/**
		 * returns true if the feature is enabled
		 * @param featureName name of the feature
		 * @returns true if the feature is enabled
		 */
		isFeatureEnabled(featureName: string): boolean;

		/**
		 * Gets form id of the specified formType for the specified entityType
		 * @param entityType The logical name of the entity.
		 * @param formType Type of form
		 */
		getFormId(entityType: string, formType: string): Promise<string>;

		/**
		 * Returns true if the native feature is enabled
		 * @param featureName Name of the native feature
		 * @returns True if the native feature is enabled
		 */
		isNativeFeatureEnabled(featureName: string): boolean;

		/**
		 * returns true if the disruptive feature is enabled
		 * @param featureFCBName The name of the feature FCB
		 * @param serverSidePreviewFCB The name of the server side preview FCB (something like FCB.October2019Update/ FCB.April2020Update /FCB.October2020Update)
		 * @param groupFeatureOverrideFCB Optional parameter. The name of the group feature override FCB which can be used to override the ServerSidePreview FCB. Please sync with your PM/EM to identify if your feature needs
		 * @returns true if the disruptive feature is enabled
		 */
		isDisruptiveFeatureEnabled(
			featureFCBName: string,
			serverSidePreviewFCB?: string,
			groupFeatureOverrideFCB?: string
		): boolean;

		/**
		 * returns true if it's a unified client.
		 */
		isUci(): boolean;

		/**
		 * Starts a new performance stopwatch.
		 * @param name Name of the stopwatch
		 * @param parameters Additional performance event parameters to output.
		 * @returns Function that, when called, stops the stopwatch.
		 */
		createPerformanceStopwatch(
			name: string,
			parameters?: { [parameterName: string]: string }
		): (endParameters?: { [parameterName: string]: string }) => void;

		/** Report the error details to Watson.
		 * @param message error message for the error.
		 * @param url URL of the error.
		 * @param lineNumber line number of the error.
		 * @param sendReportToWatson whether report should be sent to watson.
		 * @param caller caller function where error occurred.
		 * @param exceptionNumber exception number for the error.
		 * @param reportFunctionBody whether to report function body.
		 * @returns XRM promise with CRM storage response.
		 */
		reportToWatson(
			message: string,
			url: string,
			lineNumber: number,
			sendReportToWatson: boolean,
			caller: any,
			exceptionNumber: number,
			reportFunctionBody: boolean
		): Promise<any>;

		/**
		 * Gets the entity type code for provided entity name.
		 * @param entityTypeName entity type name.
		 * @return returns entity type code for given entity type name.
		 */
		getEntityCode(entityTypeName: string): number;

		/**
		 * Gets the URL to the current page.
		 * @param entityRef reference for the entity to be used for URL.
		 * @param clientType Type of the client (Browser or App).
		 * @return	the URL to the current page.
		 */
		getCurrentPageUrl(entityRef: XrmClientApi.LookupValue, clientType?: XrmClientApi.Constants.ClientType): string;

		/**
		 * Gets authorization token
		 * @returns Token or null if current authorization scheme is not token based
		 */
		getAuthToken(): string | null;

		/**
		 * Gets the email link URL to the specified entity.
		 * @param entityRef reference for the entity to be used for URL.
		 * @return	the email link URL to the specified entity.
		 */
		getEmailLink(entityRef?: XrmClientApi.LookupValue): string;

		/**
		 * Returns the current activity Id from EventManager so that other applications can reuse it.
		 */
		getActivityId(): string;

		/**
		 * Verify that app is installed to open url.
		 * @param url url.
		 */
		canOpenUrl(url: string): Promise<boolean>;

		/**
		 * Indicates if AllowLegacyDialogsEmbedding is enabled for the organization
		 */
		getAllowLegacyDialogsEmbedding(): boolean;

		/**
		 * Open legacy dialog
		 * @param url url of legacy dialog
		 * @param options style of legacy dialog
		 * @param dialogArguments arguments of legacy dialog
		 * @param initFunctionName init function of legacy dialog
		 * @param returnFunction callback function of legacy dialog
		 */
		openLegacyWebDialog(
			url: string,
			options: XrmClientApi.DialogOptions,
			dialogArguments?: any,
			initFunctionName?: string,
			returnFunction?: Function
		): void;

		/**
		 * Client API to expose this --> function addRecentItem(recent: IRecentItem): ISyncAction<void> which adds recent item to state.
		 */
		addRecentItem(recent: XrmClientApi.IRecentItem): void;

		/**
		 * Adds a popup notification.
		 * @param popupNotification The definition of the notification.
		 */
		addPopupNotification(popupNotification: IPopupNotificationItem): Promise<string>;

		/**
		 * Clears the popup notification by id.
		 * @param id The id of a popup notification.
		 */
		clearPopupNotification(id: string): void;

		/**
		 * Returns a value indicating whether contextual help browser support is enabled.
		 */
		isContextualHelpBrowserEnabled(): boolean;

		/**
		 * Opens the contextual help browser (Learning Path).
		 */
		openContextualHelpBrowser(url?: string): void;

		/**
		 * Closes the contextual help browser (Learning Path).
		 */
		closeContextualHelpBrowser(): void;

		/**
		 * Start immediate offline data sync for given entities.
		 */
		initiateOfflineDataSync(entities: string[]): Promise<void>;

		/**
		 * Returns the organization's BAP environment id.
		 */
		getBAPEnvironmentId(): Promise<string>;
	}

	/**
	 * Interface to represent recent item in state.
	 * This maps to IRecentItem that is defined in src\features\storage\src\State\Data\IRecentItem.ts
	 */
	interface IRecentItem {
		/**
		 * Date when item was accessed last.
		 */
		lastAccessed: Date;

		/**
		 * String representing type of entity for recent item.
		 */
		entityTypeName: string;

		/**
		 * Unique identifier of associated entity record.
		 */
		objectId: string; // Guid

		/**
		 * Flag to determine whether item is pinned or not.
		 */
		pinStatus?: boolean;

		/**
		 * The string representing record type. RecentItemType with these values Invalid = "Invalid", Entity = "Entity", Grid = "Grid", Isv = "Isv"
		 */
		recordType: RecentItemType;

		/**
		 * Flag to determine whether it is a userview
		 */
		isUserView?: boolean;

		/**
		 * Title for specific view.
		 */
		title: string;

		/**
		 * IconPath for the recentItem
		 */
		iconPath?: string;

		/**
		 * Flag to determine whether item supports image field or not.
		 */
		hasPrimaryImageField?: boolean;
	}

	/**
	 * Interface for the input class for navigating to a dashboard page.
	 */
	export interface DashboardPageInput {
		/**
		 * Gets the name of the entity
		 */
		entityType: string;
	}

	/**
	 * Interface for the input class for form page navigation
	 */
	export interface FormPageInput {
		/**
		 * Record set query key is used by record set navigation feature to get grid records for navigation
		 */
		recordSetQueryKey?: string;
	}

	/**
	 * Interface for thin input class for custom page navigation
	 */
	export interface CustomPageInput {
		/**
		 * The entity logical name of the primary entity.
		 */
		entityName?: string;

		/**
		 * The id of the record to load.
		 */
		recordId?: string;

		/**
		 * The canvas app name.
		 */
		name: string;
	}

	/**
	 * Interface to represent the popup notification item
	 */
	interface IPopupNotificationItem {
		/**
		 * The title of the notification.
		 */
		title: string;

		/**
		 * The acceptAction for the notification.
		 */
		acceptAction: XrmClientApi.ActionDescriptor;

		/**
		 * The declineAction for the notification.
		 */
		declineAction: XrmClientApi.ActionDescriptor;

		/**
		 * The image url. If provided, we'll use this for the icon, it overrides the etn from entity reference.
		 */
		imageUrl?: string;

		/**
		 * The entity lookup value. If both entityLookUpValue and imageUrl are not provided, show initials based on the title.
		 */
		entityLookUpValue?: XrmClientApi.LookupValue;

		/**
		 * The details (key-value pairs to display) of the notification.
		 */
		details?: { [key: string]: string };

		/**
		 * The type of the notification, either show accept button or show accept and decline button.
		 */
		type?: XrmClientApi.Constants.PopupNotificationType;

		/**
		 * timeout Action for the notification
		 */
		timeoutAction?: XrmClientApi.TimeoutActionDescriptor;

		/**
		 * the theme: dark or light
		 */
		themeType?: PopupNotificationTheme;
	}

	/**
	 * Popup notification theme
	 */
	export const enum PopupNotificationTheme {
		Light = "light",
		Dark = "dark",
	}

	/**
	 * Enum for the RecentItemType with these values Invalid = "Invalid", Entity = "Entity", Grid = "Grid", Isv = "Isv"
	 */
	export const enum RecentItemType {
		Invalid = "Invalid",
		Entity = "Entity",
		Grid = "Grid",
		Isv = "Isv",
	}

	/*
	 * Defines an interface for ApplicationEvent
	 */
	interface ApplicationEvent {
		eventName: string;
		eventParameters: EventParameter[];
	}

	/*
	 * Defines an interface for EventParameter
	 */
	interface EventParameter {
		name: string;
		value: string | number | Date | boolean;
	}

	/**
	 * Parameters required to construct a UCI URL.
	 * Passed as arguments to Pre Navigation Handlers
	 */
	export interface PageParameters {
		/**
		 * The logical name of the entity.
		 */
		etn?: string;

		/**
		 * The form ID
		 */
		formid?: string;

		/**
		 *  Use this parameter to pass values to a form.  When no parameters are present the array will be empty.
		 */
		formParameters: { [key: string]: string };

		/**
		 * The type of page. All supported page types are valid here
		 */
		pagetype: string;

		/**
		 * The ID of the entity when on a form.
		 */
		id?: string;

		/**
		 * The ID of the savedquery or userquery entity record that defines the view.
		 */
		viewid?: string;

		/**
		 * Defines the view type. Possible values are as follows: "savedquery", "userquery"
		 */
		viewtype?: string;

		/**
		 * Controls whether the navigation bar is displayed and whether application navigation is available using the areas and subareas defined in the sitemap.
		 * @Values: "on", "off", or "entity"
		 */
		navbar?: string;

		/**
		 * Controls whether the command bar is displayed.
		 */
		cmdbar?: boolean;

		/**
		 * Controls whether the ribbon debug mode is enabled
		 */
		ribbonDebug?: boolean;

		/**
		 * The current app ID.
		 */
		appid: string;
	}

	/**
	 * Interface for arguments used in Pre Navigation Events.
	 */
	export interface NavigationEventArgs extends XrmClientApi.EventArguments {
		/**
		 * Returns a boolean value to indicate if page navigation has been prevented
		 *
		 * @return true if navigation is prevented, otherwise false.
		 */
		isDefaultPrevented(): boolean;

		/**
		 * Prevents navigation from taking place.
		 */
		preventDefault(): void;

		/**
		 * The URL of the page being navigated to.
		 */
		pageUrl: string;

		/**
		 * URL query string parameters which determine the page being navigated to
		 */
		pageParameters: PageParameters;

		/**
		 * Page Input of the page being navigated to
		 */
		pageInput: PageInput;
	}

	/**
	 * Class representing an error.
	 */
	interface ErrorResponse {
		innerror?: InnerError;
		code?: number;
		title?: string;
	}

	/**
	 * interface for inner error
	 */
	interface InnerError {
		message: string;
		stacktrace: string;
	}

	/**
	 * Interface for open url options.
	 */
	export interface OpenUrlOptions {
		isExternal?: boolean;
		openInNewWindow?: boolean;
	}

	export module Controls {
		/**
		 * Interface for a CRM grid control.
		 * This is used for both main grids and sub-grids
		 */
		export interface GridControl {
			/**
			 * Gets the custom filter XML
			 * @return	Custom filter XML
			 */
			getFilterXml(): string;

			/**
			 * Adds an additional custom filter to the grid with the "AND" filter operator.
			 * @param	{string} fetchXmlFilter	 Specifies the filter, as a serialized FetchXML "filter" node.
			 */
			setFilterXml(fetchXmlFilter: string): void;

			/**
			 * Returns the parent form object for the grid.
			 */
			getParentForm(): XrmClientApi.Form;

			/**
			 * Gets the recordset query key for this grid.
			 */
			getRecordSetQueryKey(): string;

			/**
			 * Use this method to get the team template id.
			 * @return	The team template id as a string
			 */
			getTeamTemplateId(): string;
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
		 * Interface for a Lookup control.
		 */
		export interface LookupControl {
			/**
			 *  Gets whether the MRU will be disabled.
			 */
			readonly disableMru: boolean;

			/**
			 * End of custom filters from the lookup query.
			 */
			endCustomFilter(): void;

			/**
			 * Start of custom filters from the lookup query.
			 */
			startCustomFilter(): void;
		}

		/**
		 * The search widget control on the form.
		 */
		interface SearchWidgetControl extends Control {
			/**
			 * Update the articles for selected filter
			 */
			changeSelectedMenuItem(command: Constants.SearchWidgetCommand, value: number): void;

			/**
			 * returns boolean specifying whether parature is enabled or disabled for knowledge management
			 */
			getUseNativeCrm(): boolean;

			/**
			 * Blocks the search result selection
			 * @param value whether to block the result or not
			 */
			setBlockResult(value: boolean): void;

			/**
			 * sets number of result to shown
			 * @param value number of result
			 */
			setNumberOfResults(value: number): void;
		}

		/**
		 * Interface for a timeline control
		 */
		export interface TimelineControl extends SubGridControl {
			/**
			 * Sets the target entity and refresh timeline. The target entity can be different than the entity of the current form.
			 * @param entityName Entity Name
			 * @param id Entity Guid
			 * @param refresh boolean. should timeline control refresh the data. Default is true
			 */
			setTargetEntity(entityName: string, id: string, refresh: boolean): Promise<void>;

			/**
			 * Open email record by setting the email entity reference that should be displayed within the Contextual Email Popup and signals updateView on Timeline.
			 * @param entityReference { id: string, logicalName: string }
			 */
			openEmail(entityReference: XrmClientApi.WebApi.EntityReference, emailAction?: string): void;
		}
	}

	/**
	 * Interface for Process
	 */
	export module Process {
		/**
		 * Interface for a CRM Business Process Flow instance.
		 */
		export interface ProcessManager {
			/**
			 * Call to abandon current process
			 */
			abandonProcess(): void;

			/**
			 * Call to open the Switch Process Dialog
			 */
			switchProcess(): void;

			/**
			 * Call to Reactivate a Process
			 */
			reactivateProcess(): void;

			/**
			 * Call to complete the process
			 */
			completeProcess(): void;
		}
	}

	export module Constants {
		/**
		 * The type for popupNotification.
		 */
		const enum PopupNotificationType {
			AcceptDecline = 0,
			AcceptOnly = 1,
		}

		/**
		 * The type for initialization intents for form components
		 */
		const enum InitializationIntent {
			Nothing = "nothing",
			FullLoad = "fullload",
		}
	}

	/**
	 * A definition module for collection interface declarations.
	 */
	export namespace Collection {
		/**
		 * Interface for an item collection.
		 *
		 * @tparam	T	Generic type parameter.
		 */
		export interface ItemCollection<T> {
			// These are all commented out because the change needs to be coordinated with the corresponding
			// Controls interface.  Tracked by bug 1565721.
			/**
			 * Gets all items.
			 * @returns All items.
			 */
			// getAll(): T[];
			/**
			 * Gets the item with the specified name.
			 * @param name The name of the item to get.
			 * @returns The item with the specified name.
			 */
			// getByName(name: string): T;
			/**
			 * Gets the item at the specified position.
			 * @param position The position of the item to get.
			 * @returns The item at the specified position.
			 */
			// getByIndex(position: number): T;
			/**
			 * Gets all items that meet the criteria of the specified filter.
			 * @param filter The filter to apply to the list as a delegate.
			 * @returns All items that meet the criteria of the specified filter.
			 */
			// getByFilter(filter: XrmClientApi.Collection.MatchingDelegate<T>): T[];
			/**
			 * Gets the first item in the collection that satisfies a provided filter
			 * @param filter A filter function which returns true for the item to return
			 * @returns The first item in the collection that satisfies the filter. If none do, null is returned.
			 */
			// getFirst(filter: XrmClientApi.Collection.MatchingDelegate<T>): T;
		}
	}

	/**
	 * Interface for Xrm.Navigation.
	 */
	export interface Navigation {
		/**
		 * Add navigation handler call back function.
		 * @param handler call back function. Returns true to allow navigation, false to cancel navigation.
		 */
		addOnPreNavigation(handler: XrmClientApi.EventHandler): void;

		/**
		 * Remove navigation handler call back function.
		 * @param handler call back function to remove.
		 */
		removeOnPreNavigation(handler: XrmClientApi.EventHandler): void;

		/**
		 * Add before onload handler call back function.
		 * @param handler call back function.
		 */
		addBeforeOnLoad(handler: XrmClientApi.EventHandler): void;

		/**
		 * Remove before onload handler call back function.
		 * @param handler call back function to remove.
		 */
		removeBeforeOnLoad(handler: XrmClientApi.EventHandler): void;

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
		 * Opens a dialog.
		 * @param name name of the dialog.
		 * @param options entity form options.
		 * @param parameters entity form parameters.
		 * @returns promise defining success or failure of operation
		 */
		openDialog(name: string, options?: DialogOptions, parameters?: DialogParameters): Promise<DialogResponse>;
	}

	/**
	 * Class passed to an async callback on OpenDialog close.
	 */
	export interface DialogResponse {
		parameters: DialogParameters;
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
	 * Interface for confirm dialog options.
	 */
	export interface ConfirmDialogOptions {
		height: number;
		width: number;
		restoreFocus?: boolean;
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
	 * Interface for the XRM status.
	 */
	export interface XrmStatus extends XrmClientApi.EventArguments {
		mainForm?: XrmClientApi.Form;
		mainGrid?: XrmClientApi.Controls.GridControl;
		pageType: string;
		clientApiIFrameId: string;
		xrmInstance: XrmClientApi.XrmStatic;
	}

	/*
	 * Defines an interface for BusinessProcessFlowActionDescriptor
	 */
	export interface IBusinessProcessFlowActionDescriptor {
		processActionMessageName?: string;
		inputParameters?: IBusinessProcessFlowActionParameterDescriptorDictionary;
		outputParameters?: IBusinessProcessFlowActionParameterDescriptorDictionary;
		inputBindings?: IBusinessProcessFlowActionStepParameterBindingDescriptor[];
		outputBindings?: IBusinessProcessFlowActionStepParameterBindingDescriptor[];
		workflowId?: string;
		actionType?: number;
		uniqueName?: string;
		actionId?: string;
	}

	/**
	 * Descriptor for a Process Action parameter binding data that is used by a BPF
	 */
	export interface IBusinessProcessFlowActionStepParameterBindingDescriptor {
		parameterName?: string;
		parameterStructuralProperty?: XrmClientApi.WebApi.ODataStructuralProperty;
		parameterType?: string;
		boundAttributeName?: string;
	}
	/**
	 * Dictionary of Process Action Parameters used by a process action
	 */
	export interface IBusinessProcessFlowActionParameterDescriptorDictionary {
		[parameterName: string]: IBusinessProcessFlowActionParameterDescriptor;
	}
	/**
	 * Descriptor for a Parameter that is used by a Process Action
	 */
	export interface IBusinessProcessFlowActionParameterDescriptor {
		parameterName?: string;
		parameterStructuralProperty?: XrmClientApi.WebApi.ODataStructuralProperty;
		parameterType?: string;
	}

	export interface Utility {
		/**
		 * Executes a function in a web resource
		 * @param webResource The name of the web resource to load.
		 * @param method: The name of the method to be executed.
		 * @param parameters: An array of parameters to send to the function.
		 * @returns The return value of the executed method.
		 */
		executeFunction(webResource: string, method: string, parameters: {}[]): Promise<any>;

		/**
		 * Gets the entity metadata for the specified entity.
		 * @param entityType The logical name of the entity.
		 * @param entityToAttributes The entity-attributes pair to get metadata for.
		 */
		getEntitiesMetadata(entityToAttributes: { [entityType: string]: string[] }): Promise<XrmClientApi.EntityMetadata[]>;

		/**
		 * Invokes the given process action
		 * @param name the name of the process action to invoke
		 * @param parameters the params to pass with the process action
		 * @param actionStepDescriptor the descriptor of action step which contains input/output parameter for process action
		 * @returns OData result along with any outputs from the PA
		 */
		invokeProcessActionInternal(
			name: string,
			parameters?: { [parameter: string]: any },
			actionStepDescriptor?: IBusinessProcessFlowActionDescriptor
		): Promise<{ [parameter: string]: any }>;
	}

	/**
	 * interface for user settings
	 */
	export interface UserSettings {
		/**
		 * Returns true if guided help is enabled
		 */
		isGuidedHelpEnabled: boolean;

		/**
		 * The paging limit represent the number of records per page.
		 * @returns Returns the pagingLimit represent the number of records per page.
		 */
		readonly pagingLimit: number;

		/**
		 * The code name of the culture used to localize data.
		 */
		formatInfoCultureName: string;
	}

	/**
	 * Interface for a KBSearch Page (Xrm.Page).
	 */
	export interface KBSearch {
		/**
		 * Provides methods to work with the form.
		 */
		data: FormData;

		/**
		 * Contains properties and methods to retrieve information about the user interface as well as collections for several subcomponents of the form.
		 */
		ui: KBSearchUi;

		/**
		 * Gets the KBSearch control.
		 *
		 * @return	The control.
		 */
		getControl(): Controls.SearchWidgetControl;

		/**
		 * Provides methods to retrieve information specific to an organization, a user, or parameters passed to a page.
		 */
		context: GlobalContext;
	}

	/**
	 * Interface for a Form (Xrm.Page).
	 */
	export interface Form {
		/**
		 * Gets the URL for the current page.
		 * @param The optional client type parameter.
		 * @returns The URL for the current page.
		 */
		getUrl(clientType?: XrmClientApi.Constants.ClientType): string;
	}

	/**
	 * Interface for the Xrm.Page.ui object.
	 */
	export interface FormUi {
		/**
		 * Form Context for the Form UI.
		 */
		formContext: XrmClientApi.Form;

		/**
		 * refresh the UI and fire the on-load event
		 */
		refresh(): Promise<XrmClientApi.SuccessResponse>;

		/**
		 * this function is to solve the issue with attribute.control initialization if we call XrmGridPageFormUI.controls
		 */
		getControls(): XrmClientApi.Collection.ItemCollection<XrmClientApi.Controls.Control>;
	}

	/**
	 * Interface for the Xrm.Page.ui.navigableFormUi object.
	 */
	export interface NavigableFormUi {
		/**
		 * Gets a task process.
		 * @returns A task process.
		 */
		taskProcess: XrmClientApi.NavigableFormUi;
	}

	/**
	 * Interface for the form's record context, Xrm.Page.data.entity
	 */
	export interface Entity {
		/**
		 * Refresh the entity data.
		 */
		refresh(): Promise<void>;

		/**
		 * The list of related entities.
		 */
		relatedEntities: XrmClientApi.Collection.ItemCollection<Entity>;

		/**
		 * Sets the id of the record if it's in create mode.
		 * @param id GUID to be set
		 */
		setRecordId(id: string): void;
	}

	/**
	 * interface for organization settings
	 */
	export interface OrganizationSettings {
		/**
		 * Returns true if Yammer is enabled
		 */
		isYammerConfigured: boolean;

		/**
		 * Returns whether the org is restricted or not.
		 */
		isSovereignCloud: boolean;
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
	}

	/**
	 * Interface for the Xrm.Page.ui object for KBSearch.
	 */
	export interface KBSearchUi {
		/**
		 * A reference to the KbSearchControl on the page
		 */
		control: Controls.SearchWidgetControl;
	}

	/**
	 * Internal interface for a Dashboard (Xrm.Page)
	 */
	export interface DashboardInternal {
		/**
		 * Object that executes dashboard commands
		 */
		commands: DashboardCommands;
	}

	/**
	 * Interface for the Xrm.Page.commands object on dashboards.
	 */
	export interface DashboardCommands {
		/**
		 * Opens the assign dialog to assign the specified dashboard to a user or team
		 * @param dashboardId The dashboard to assign
		 */
		assignDashboard(dashboardId: string): void;

		/**
		 * Opens the save as dialog to create a copy of the specified dashboard
		 * @param dashboardId The dashboard to save as
		 */
		saveDashboardAs(dashboardId: string): void;

		/**
		 * Sets the specified dashboard as the user's default dashboard
		 * @param dashboardId The dashboard to set as the default, or null to unset the default
		 */
		setUserDefaultDashboard(dashboardId: string): Promise<void>;

		/**
		 * Opens the share dialog to share the specified dashboard with a user or team
		 * @param dashboardId The dashboard to share
		 */
		shareDashboard(dashboardId: string): void;

		/**
		 * Deletes the specified dashboard
		 * @param dashboardId The dashboard to delete
		 */
		deleteDashboard(dashboardId: string): void;

		/**
		 * Opens the editor for the specified dashboard
		 * @param dashboardId The dashboard to edit
		 */
		editDashboard(dashboardId: string): void;

		/**
		 * Opens the specified power bi dashboard in power bi
		 * @param dashboardId The power bi dashboard to open in power bi
		 */
		openInPowerBI(dashboardId: string): void;

		/**
		 * Refreshes the specified dashboard
		 * @param dashboardId The dashboard to refresh
		 */
		refreshDashboard(dashboardId: string): void;

		/**
		 * Opens the editor to create a new dashboard
		 */
		createNewDashboard(): void;

		/**
		 * Opens the editor to create a new power bi dashboard
		 */
		createNewPowerBIDashboard(): void;
	}

	/**
	 * Interface for error dialog options.
	 */
	export interface ErrorDialogOptions {
		errorRegion?: ErrorRegion;
	}

	/**
	 * Enum for the ErrorRegion
	 */
	export const enum ErrorRegion {
		Sales = "Sales",
		Solution = "Solutions",
	}

	/**
	 * Interface for entity form options.
	 */
	export interface EntityFormOptions {
		recordSetQueryKey?: string;
		useQuickCreateForm?: boolean; // Defaults to false.
		lookupAttributeName?: string;
	}

	/**
	 * Interface for FormComponentControl XrmControl
	 */
	export interface FormComponentControl extends XrmClientApi.Controls.SubFormBaseControl {
		setInitializationIntent(intent: XrmClientApi.Constants.InitializationIntent): void;
	}

	/**
	 * Interface for Xrm.Device.
	 */
	export interface Device {
		tryShowRatingPrompt(): void;
	}

	/**
	 * Optional properties to extend behavior of global notifications.
	 */
	export interface GlobalNotificationOptions {
		/**
		 * Path of image to use in notification.
		 */
		imageSrc?: string;
	}
}

interface Window {
	IsUSD: boolean;

	/**
	 * this method returns promise with the current Xrm status
	 */
	getCurrentXrmStatus(): XrmClientApi.XrmStatus;

	/**
	 * this method returns the current Xrm.
	 */
	getCurrentXrm(): XrmClientApi.XrmStatic;
}
