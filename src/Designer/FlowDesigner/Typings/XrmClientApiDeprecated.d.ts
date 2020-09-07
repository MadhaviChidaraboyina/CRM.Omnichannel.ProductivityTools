/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/**
 * Following API are deprecated and should not be used.
 */
declare namespace XrmClientApi {
	/**
	 * Static Xrm object.
	 */
	export interface XrmStatic {
		/**
		 * Add Xrm.Mobile
		 */
		Mobile: Mobile;

		/**
		 * Provides a namespace container for the current page's form.
		 */
		Page: Form | KBSearch;
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
	 * Interface for Xrm.Mobile.Offline
	 */
	export interface MobileOfflineSdk {
		/**
		 * Check if entity is offline enabled
		 * @param entityType logical name of the entity type record for which check need to be done. For an Account record, use "account"
		 * @returns True if entity is offline enabled
		 */
		isOfflineEnabled(entityType: string): boolean;

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
		createRecord(entityType: string, data: WebApi.Entity): Promise<WebApi.EntityReference>;

		/**
		 * To update a record in mobile offline db
		 * @param id guid to update the record
		 * @param data dictionary containing changed attributes with schema name and value
		 * @param entityType logical name of the entity type record to update
		 * @returns The deferred object for the result of the operation.
		 */
		updateRecord(entityType: string, id: string, data: WebApi.Entity): Promise<WebApi.EntityReference>;

		/**
		 * To delete the record mobile offline db
		 * @param id guid to delete the record
		 * @param entityType logical name of the entity type record to delete
		 * @returns The deferred object for the result of the operation.
		 */
		deleteRecord(entityType: string, id: string): Promise<WebApi.EntityReference>;

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
	 * Interface for a grid.  Use Grid methods to access information about data in the grid. Grid is returned by the
	 * GridControl.getGrid method.
	 */
	export module Grid {
		/**
		 * Interface for a grid row.  Use the GridRow.getData method to access the GridRowData. A collection of GridRow is
		 * returned by Grid.getRows and Grid.getSelectedRows methods.
		 */
		export interface GridRow {
			/**
			 * Returns the GridRowData for the GridRow.
			 *
			 * @return  The data.
			 */
			getData(): GridRowData;
		}

		/**
		 * Interface for grid row data.  Use the GridRowData.getEntity method to access the GridEntity. GridRowData is
		 * returned by the GridRow.getData method.
		 */
		export interface GridRowData {
			/**
			 * Returns the GridEntity for the GridRowData.
			 *
			 * @return  The entity.
			 */
			getEntity(): GridEntity;
		}
	}

	/**
	 * Interface for the XRM application context.
	 */
	interface GlobalContext {
		/**
		 * Gets query string parameters.
		 *
		 * @return  The query string parameters, in a dictionary object representing name and value pairs.
		 */
		getQueryStringParameters(): { [key: string]: string };

		/**
		 * Returns the difference between the local time and Coordinated Universal Time (UTC).
		 *
		 * @return  The time zone offset, in minutes.
		 */
		getTimeZoneOffsetMinutes(): number;

		/**
		 * Gets user's unique identifier.
		 *
		 * @return  The user's identifier in Guid format.
		 *
		 * @remarks Example: "{B05EC7CE-5D51-DF11-97E0-00155DB232D0}"
		 */
		getUserId(): string;

		/**
		 * Gets user's LCID (language code).
		 *
		 * @return  The user's language code.
		 *
		 * @see  {@link http://msdn.microsoft.com/en-us/library/ms912047(WinEmbedded.10).aspx|Microsoft Locale ID Values}
		 */
		getUserLcid(): number;

		/**
		 * Gets the name of the current user.
		 *
		 * @return  The user's name.
		 */
		getUserName(): string;

		/**
		 * Gets all user security roles.
		 *
		 * @return  An array of user role identifiers, in Guid format.
		 *
		 * @remarks Example: ["cf4cc7ce-5d51-df11-97e0-00155db232d0"]
		 */
		getUserRoles(): string[];

		/**
		 * Gets whether automatic save is enabled.
		 *
		 * @return  true if automatic saving is enabled, otherwise false.
		 */
		getIsAutoSaveEnabled(): boolean;

		/**
		 * Gets organization's LCID (language code).
		 *
		 * @return  The organization language code.
		 *
		 * @see  {@link http://msdn.microsoft.com/en-us/library/ms912047(WinEmbedded.10).aspx|Microsoft Locale ID Values}
		 */
		getOrgLcid(): number;

		/**
		 * Gets organization's unique name.
		 *
		 * @return  The organization's unique name.
		 *
		 * @remarks This value can be found on the Developer Resources page within Dynamics CRM
		 */
		getOrgUniqueName(): string;

		/**
		 * A string representing the current Microsoft Office Outlook theme chosen by the user.
		 *
		 * @returns Returns a string representing the current Microsoft Office Outlook theme chosen by the user.
		 */
		getCurrentTheme(): string;
	}

	/**
	 * Interface for Xrm.Utility.
	 */
	export interface Utility {
		/**
		 * Displays an alert dialog, with an "OK" button.
		 *
		 * @param   {string}  message   The message.
		 * @param   {function()} onCloseCallback The "OK" callback.
		 */
		alertDialog(message: string, onCloseCallback?: () => void): void;

		/**
		 * Displays a confirmation dialog, with "OK" and "Cancel" buttons.
		 *
		 * @param   {string}  message The message.
		 * @param   {function()} yesCloseCallback The "OK" callback.
		 * @param   {function()} noCloseCallback  The "Cancel" callback.
		 */
		confirmDialog(message: string, yesCloseCallback?: () => void, noCloseCallback?: () => void): void;

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

		/**
		 * Begins a secure session for a 1st party resource.
		 * @param resource The resource for which the session is being started.
		 * @param cookieName The name of the cookie which will contain the token.
		 * @param cookieDomain The domain on which the cookie will be set.
		 * @param allowPrompt If UI experience is involved.
		 * @returns A deferred object which will provide the expiry time of the token if the request succeeded or the error code if it failed.
		 */
		beginSecureSessionForResource(
			resource: string,
			cookieName: string,
			cookieDomain: string,
			allowPrompt?: boolean
		): Promise<Date>;

		/**
		 * Query if 'entityType' is an Activity entity.
		 * @param	{string} entityType	 Type of the entity.
		 * @return	true if the entity is an Activity, false if not.
		 */
		isActivityType(entityType: string): boolean;

		/**
		 * Opens quick create.
		 * @param	{Function}	callback  The function that will be called when a record is created. This
		 *	   function is passed a LookupValue object as a parameter.
		 * @param	{string} entityLogicalName	The logical name of the entity to create.
		 * @param	{LookupValue}  createFromEntity (Optional) Designates a record that will provide default values
		 *	   based on mapped attribute values.
		 * @param	{OpenParameters} parameters (Optional) A dictionary object that passes extra query string
		 *	   parameters to the form. Invalid query string parameters will cause an
		 *	   error.
		 */
		openQuickCreate(
			entityLogicalName: string,
			createFromEntity?: LookupValue,
			parameters?: OpenParameters
		): Promise<XrmClientApi.SuccessResponse>;

		/**
		 * Opens an entity form.
		 * @param	{string} name The entity's logical name.
		 * @param	{string} id	  (Optional) The unique identifier for the record.
		 * @param	{FormParameters} parameters	 (Optional) A dictionary object that passes extra query string parameters to the form.
		 * @param	{WindowOptions} windowOptions	(Optional) Options for controlling the window.
		 */
		openEntityForm(name: string, id?: string, parameters?: FormOpenParameters, windowOptions?: WindowOptions): void;

		/**
		 * Opens an HTML Web Resource in a new browser window.
		 * @param	{string} webResourceName Name of the HTML web resource. Can be used to pass URL
		 *	   parameters.	See Remarks.
		 * @param	{string} webResourceData (Optional) Data to pass into the Web Resource's data parameter.
		 *	  It is advised to use encodeURIcomponent() to encode the value.
		 * @param	{number} width	(Optional) The width of the new window.
		 * @param	{number} height (Optional) The height of the new window.
		 * @return	A Window reference, containing the opened Web Resource.
		 * @remarks This function will not work with Microsoft Dynamics CRM for tablets.
		 * Valid WebResource URL Parameters:   typename
		 *	  type
		 *	  id
		 *	  orgname
		 *	  userlcid
		 *	  data (identical to this method's webResourceData parameter)
		 *	  formid
		 */
		openWebResource(webResourceName: string, webResourceData?: string, width?: number, height?: number): void;
	}

	/**
	 * Interface for Xrm.Panel.
	 */
	export interface Panel {
		/**
		 * Loads the side panel with the provided panel options
		 * @param url string to describe the URL to be loaded in the side panel
		 * @param title title to be displayed on the panel
		 * @param options the desired options for the side panel
		 */
		loadPanel(url: string, title?: string, options?: PanelOptions): Promise<void>;
	}

	/**
	 * Interface that represents the options for the side panel
	 */
	export interface OldPanelOptions {
		/*
		 * Initial panel width
		 */
		initialWidth?: number;

		/*
		 * boolean to describe the default collapsed panel behavior
		 */
		defaultCollapsedBehavior: boolean;

		/*
		 * A function to be executed after the size of the panel changes
		 */
		onSizeChangeHandler: XrmClientApi.EventHandler;

		/*
		 * A function to be executed after the state of the panel changes
		 */
		onStateChangeHandler: XrmClientApi.EventHandler;
	}

	/**
	 * Interface for a Form (Xrm.Page).
	 */
	export interface Form {
		/**
		 * Provides methods to retrieve information specific to an organization, a user, or parameters passed to a page.
		 */
		context: GlobalContext;

		/**
		 * Provides the application context methods.
		 */
		applicationContext?: any;
	}

	/**
	 * Interface for the form's record context, Xrm.Page.data.entity
	 */
	export interface Entity {
		/**
		 * Saves the record.
		 * @param action or saveOptions only one of the parameter will be present Form save action: null, "saveandclose", or "saveandnew".saveOptions specifies the save mode
		 */
		save(action?: string): void;
	}

	/**
	 * Interface for commanding
	 */
	export module Commanding {
		/**
		 *  Entity Reference definition
		 */
		export interface EntityReference {
			/**
			 *A number representing the unique type of entity for the record.Commented as it is to be deprecated .
			 */
			TypeCode: number;
		}
	}

	/**
	 * The Xrm.Page API
	 *
	 * @see {@link http://msdn.microsoft.com/en-us/library/gg328255.aspx|Documentation} for details.
	 */
	export module Process {
		/*
		 * Represents process instance object model
		 */
		export interface ProcessInstance {
			/*
			 * Deprecated. Release: Potassium, Spring 2017
			 * Use CreatedOnDate
			 * The date (in short date format e.g. 1/24/2016) when the process was created
			 */
			CreatedOn: string;

			/*
			 * Deprecated. Release: Potassium, Spring 2017
			 * Use ProcessDefinitionID
			 * The process definition id
			 */
			ProcessDefintionID: string;

			/*
			 * Deprecated. Release: Potassium, Spring 2017
			 * Use ProcessDefinitionName
			 * The process definition name
			 */
			ProcessDefintionName: string;
		}
	}

	/**
	 * Interface for window options.  Used in Xrm.Utility.openEntityForm
	 */
	export interface WindowOptions {
		openInNewWindow: boolean;
		height?: number;
		width?: number;
	}

	/**
	 * Enum for the page type.
	 * Should match the URL value of page type
	 */
	export const enum PageType {
		recordList = "recordlist",
	}
}
