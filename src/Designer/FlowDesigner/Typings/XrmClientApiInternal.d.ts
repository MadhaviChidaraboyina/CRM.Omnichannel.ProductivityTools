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
		 * this holds all the internal API
		 */
		Internal: XrmClientApi.Internal;

		/**
		 * Reporting
		 */
		Reporting: Reporting;

		/**
		 * Diagnostics
		 */
		Diagnostics: Diagnostics;

		/**
		 * Provides a container for useful functions to access external contexts.
		 */
		ExternalContext: ExternalContext;
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
		 * returns true if the disruptive feature is enabled
		 * @param featureName name of the feature
		 * @returns true if the disruptive feature is enabled
		 */
		isDisruptiveFeatureEnabled(featureName: string): boolean;

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
		 * @param caller caller function where error occured.
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
		openContextualHelpBrowser(): void;

		/**
		 * Closes the contextual help browser (Learning Path).
		 */
		closeContextualHelpBrowser(): void;

		/**
		 * Toggles the contextual help browser (Learning Path).
		 */
		toggleContextualHelpBrowser(): void;
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
		pinStatus: boolean;

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
	}

	/**
	 * Class representing an error.
	 */
	interface ErrorResponse {
		innerror?: InnerError;
		code?: number;
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
	}

	export module Controls {
		/**
		 * Interface for a CRM grid control.
		 * This is used for both main grids and sub-grids
		 */
		export interface GridControl {
			/**
			 * Returns the parent form object for the grid
			 */
			getParentForm(): XrmClientApi.Form;

			/**
			 * Use this method to get the team template id
			 *
			 * @return	The team template id as a string
			 */
			getTeamTemplateId(): string;
		}

		export interface ProcessControl {
			/**
			 * Reflow the UI of the process control
			 *
			 * @param	{boolean}	updateUI	Flag indicating if the ui should be updated or not.
			 * @param	{string}	arentStage	Indicate the stage whose child flow has been updated.
			 * @param	{string}	nextStage	Next stage of the parent stage.
			 */
			reflow(updateUI: boolean, parentStage: string, nextStage: string): void;
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
	}

	/**
	 * Interface for the XRM status.
	 */
	export interface XrmStatus extends XrmClientApi.EventArguments {
		mainForm?: XrmClientApi.Form;
		mainGrid?: XrmClientApi.Controls.GridControl;
		pageType: string;
		clientApiIFrameId: string;
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
		 * Gets the entity metadata for the specified entity.
		 * @param entityType The logical name of the entity.
		 * @param entityToAttributes The entity-attributes pair to get metadata for.
		 */
		getEntitiesMetadata(entityToAttributes: { [entityType: string]: string[] }): Promise<XrmClientApi.EntityMetadata[]>;

		/**
		 * Invokes the given process action
		 * @param name the name of the process action to invoke
		 * @param parameters the params to pass with the process action
		 * @param actionStepDescriptor the descriptor of action step which containts input/output parameter for process action
		 * @returns Odata result along with any outputs from the PA
		 */
		invokeProcessActionInternal(
			name: string,
			parameters?: { [parameter: string]: any },
			actionStepDescriptor?: IBusinessProcessFlowActionDescriptor
		): Promise<{ [parameter: string]: any }>;
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
