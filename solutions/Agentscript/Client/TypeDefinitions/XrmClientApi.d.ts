declare var Xrm: XrmClientApi.XrmStatic;

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
		 * Provides a namespace for the methods to execute webApi actions.
		 */
        WebApi: WebApiSdk;

		/**
		 * Provides a container for useful functions not directly related to the current page.
		 */
        Utility: Utility;

		/**
		 * Provides a container for useful functions which open data in separate viewer.
		 */
        Navigation: Navigation;

		/**
		 * Provides a container for useful functions to call device capabilities.
		 */
        Device: Device;

		/**
		 * Constants
		 */
        Constants: Constants.ConstantsStatic;

		/**
		 * Provides a namespace container for the current page's form.
		 */
        Page: Form;

		/**
		 * Xrm.UI
		 */
        UI: ApplicationUI;

		/**
		 * Provides interface for encoding string
		 */
        Encoding: XrmClientApi.Encoding;
    }

	/**
	 * Interface used by Xrm.Mobile.
	 */
    export interface Mobile {
		/**
		 * Gets the Xrm.Mobile.offline instance.
		 * @returns The Xrm.Mobile.offline instance.
		 */
        offline: OfflineSdk;
    }

	/**
	 * CrudSdk Interface to be extended by OfflineSdk and Online Sdk
	 */
    export interface CrudSdk {
		/**
		 * To retrieve a record from offline db
		 * @param id guid to retrieve the record
		 * @param entityType schema name of the entity type record to create
		 * @param options Options having select and expand conditions
		 * @returns The deferred object for the result of the operation
		 */
        retrieveRecord(entityType: string, id: string, options?: string): XrmPromise<WebApi.Entity, ErrorResponse>;

		/**
		 * To create a new record in mobile offline db
		 * @param data dictionary with attribute schema name and value
		 * @param entityType logical name of the entity type record to create
		 * @returns The deferred object for the result of the operation.
		 */
        createRecord(entityType: string, data: WebApi.Entity): XrmPromise<LookupValue, ErrorResponse>;

		/**
		 * To update a record in mobile offline db
		 * @param id guid to update the record
		 * @param data dictionary containing changed attributes with schema name and value
		 * @param entityType logical name of the entity type record to update
		 * @returns The deferred object for the result of the operation.
		 */
        updateRecord(entityType: string, id: string, data: WebApi.Entity): XrmPromise<LookupValue, ErrorResponse>;

		/**
		 * To delete the record mobile offline db
		 * @param id guid to delete the record
		 * @param entityType logical name of the entity type record to delete
		 * @returns The deferred object for the result of the operation.
		 */
        deleteRecord(entityType: string, id: string): XrmPromise<LookupValue, ErrorResponse>;

		/**
		 * To retrieve the records from mobile offline db
		 * @param entityType Schema name of the entity type record to retrieve
		 * @param options Record retrieval options
		 * @param maxPageSize Records to be retrieved per page
		 * @returns The deferred object for the result of the operation.
		 */
        retrieveMultipleRecords(entityType: string, options?: string, maxPageSize?: number): XrmPromise<WebApi.Entity[], ErrorResponse>;
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
        offline: CrudSdk;
    }

	/**
	 * Interface for Xrm.Mobile.Offline
	 */
    export interface OfflineSdk {
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
        retrieveRecord(entityType: string, id: string, options?: string): XrmPromise<WebApi.Entity, ErrorResponse>;

		/**
		 * To create a new record in mobile offline db
		 * @param data dictionary with attribute schema name and value
		 * @param entityType logical name of the entity type record to create
		 * @returns The deferred object for the result of the operation.
		 */
        createRecord(entityType: string, data: WebApi.Entity): XrmPromise<WebApi.EntityReference, ErrorResponse>;

		/**
		 * To update a record in mobile offline db
		 * @param id guid to update the record
		 * @param data dictionary containing changed attributes with schema name and value
		 * @param entityType logical name of the entity type record to update
		 * @returns The deferred object for the result of the operation.
		 */
        updateRecord(entityType: string, id: string, data: WebApi.Entity): XrmPromise<WebApi.EntityReference, ErrorResponse>;

		/**
		 * To delete the record mobile offline db
		 * @param id guid to delete the record
		 * @param entityType logical name of the entity type record to delete
		 * @returns The deferred object for the result of the operation.
		 */
        deleteRecord(entityType: string, id: string): XrmPromise<WebApi.EntityReference, ErrorResponse>;

		/**
		 * To retrieve the records from mobile offline db
		 * @param entityType Schema name of the entity type record to retrieve
		 * @param options Record retrieval options
		 * @param maxPageSize Records to be retrieved per page
		 * @returns The deferred object for the result of the operation.
		 */
        retrieveMultipleRecords(entityType: string, options?: string, maxPageSize?: number): XrmPromise<WebApi.Entity[], ErrorResponse>;
    }

    export interface OnlineSdk extends CrudSdk {
		/**
		 * execute single request 
		 * @param request to be executed
		 */
        execute(request: WebApi.ODataContract): XrmPromise<WebApi.Response, ErrorResponse>;

		/**
		 * execute multiple request 
		 * @param requests array containing  request to be executed
		 */
        executeMultiple(requests: WebApi.ODataContract[]): XrmPromise<WebApi.Response[], ErrorResponse>;
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
		 * @return  An array of attributes.
		 */
        getAttribute(): Attributes.Attribute[];

		/**
		 * Gets an attribute matching attributeName.
		 *
		 * @tparam  T   An Attribute type.
		 * @param   {string} attributeName   Name of the attribute.
		 *
		 * @return  The attribute.
		 */
        getAttribute<T extends Attributes.Attribute>(attributeName: string): T;

		/**
		 * Gets an attribute matching attributeName.
		 *
		 * @param   {string} attributeName   Name of the attribute.
		 *
		 * @return  The attribute.
		 */
        getAttribute(attributeName: string): Attributes.Attribute;

		/**
		 * Gets an attribute by index.
		 *
		 * @param   {number} index   The attribute index.
		 *
		 * @return  The attribute.
		 */
        getAttribute(index: number): Attributes.Attribute;

		/**
		 * Gets an attribute.
		 *
		 * @param   {Collection.MatchingDelegate{Attribute}} delegateFunction A matching delegate function
		 *
		 * @return  An array of attribute.
		 */
        getAttribute(delegateFunction: Collection.MatchingDelegate<Attributes.Attribute>): Attributes.Attribute[];

		/**
		 * Gets all controls.
		 *
		 * @return  An array of controls.
		 */
        getControl(): Controls.Control[];

		/**
		 * Gets a control matching controlName.
		 *
		 * @tparam  T   A Control type
		 * @param   {string} controlName Name of the control.
		 *
		 * @return  The control.
		 */
        getControl<T extends Controls.Control>(controlName: string): T;

		/**
		 * Gets a control matching controlName.
		 *
		 * @param   {string} controlName Name of the control.
		 *
		 * @return  The control.
		 */
        getControl(controlName: string): Controls.Control;

		/**
		 * Gets a control by index.
		 *
		 * @param   {number} index   The control index.
		 *
		 * @return  The control.
		 */
        getControl(index: number): Controls.Control;

		/**
		 * Gets a control.
		 *
		 * @param   {Collection.MatchingDelegate{Control}}  delegateFunction A matching delegate function.
		 *
		 * @return  An array of control.
		 */
        getControl(delegateFunction: Collection.MatchingDelegate<Controls.Control>): Controls.Control[];
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
        fileSize: number;
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
        openAlertDialog(alertStrings: AlertDialogStrings, options?: AlertDialogOptions): XrmPromise<AlertDialogResponse, void>;

		/**
		 * Opens Confirm Dialog
		 * @param confirmStrings String which will be used in the dialog
		 * @param options Options for the dialog
		 * @returns promise defining success or failure of operation. the success case returns a boolean specifying if yes or no button where pressed 
		 */
        openConfirmDialog(confirmStrings: ConfirmDialogStrings, options?: ConfirmDialogOptions): XrmPromise<ConfirmDialogResponse, ErrorDialogResponse>;

		/**
		 * Opens a dialog.
		 * @param name name of the dialog.
		 * @param options entity form options.
		 * @param parameters entity form parameters.
		 * @returns promise defining success or failure of operation
		 */
        openDialog(name: string, options?: DialogOptions, parameters?: DialogParameters): XrmPromise<DialogResponse, void>;

		/**
		 * Opens an Error Dialog.
		 * @param options Error Dialog options.
		 * @returns promise defining success or failure of operation.
		 */
        openErrorDialog(options: ErrorDialogOptions): XrmPromise<ErrorDialogResponse, void>;

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
        openFile(file: File, options?: OpenFileOptions): XrmPromise<void, ErrorResponse>;

		/**
		* Opens an entity form or quick create form.
		* @param options entity form options.
		* @param parameters entity form parameters.
		* @returns promise defining success or failure of operation
		*/
        openForm(options: EntityFormOptions, parameters?: FormParameters): XrmPromise<SuccessResponse, ErrorResponse>;

		/**
		* Opens a task flow.
		* @param name name of the task flow.
		* @param options task flow options.
		* @param parameters task flow parameters.
		* @returns promise defining success or failure of operation
		*/
        openTaskFlow(name: string, options?: TaskFlowOptions, parameters?: TaskFlowParameters): XrmPromise<TaskFlowResponse, void>;

		/**
		 * Open url, including file urls.
		 * @param url url to be opened.
		 * @param options window options for the url.
		 */
        //openUrl(url: string, options?: XrmClientApi.OpenUrlOptions): void;

		/**
		 * Opens an HTML web resource.
		 * @param name The name of the HTML web resource to open.
		 * @param options Window options for the web resource.
		 * @param data Data to be passed into the data parameter.
		 */
        openWebResource(name: string, options?: WindowOptions, data?: string): void;
    }

	/**
	 * Interface for Xrm.Device.
	 */
    export interface Device {
		/**
		 * Capture image.
		 * @param options capture picture options.
		 */
        captureImage(options?: XrmClientApi.CaptureImageOptions): XrmPromise<File, ErrorResponse>;

		/**
		 * Capture audio.
		 */
        captureAudio(): XrmPromise<File, ErrorResponse>;

		/**
		 * Capture video.
		 */
        captureVideo(): XrmPromise<File, ErrorResponse>;

		/**
		 * Pick one or more files from device
		 * @param options file pick options
		 */
        pickFile(options?: XrmClientApi.PickFileOptions): XrmPromise<File[], ErrorResponse>;

		/**
		 * Invoke camera to scan Barcode and returns the Scanned Barcode value as string
		 * In case of error, returns the errorMessage.
		 * @returns A deferred containing the Scanned Barcode value. Or, string with errorMessage.
		 */
        getBarcodeValue(): XrmPromise<string, string>;

		/**
		 * Returns the current geolocation object.
		 * In case of error, returns the error object.
		 * @returns A deferred containing cordova geolocation object. Or, the error object.
		 */
        getCurrentPosition(): XrmPromise<Position, PositionError>;
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
        getEntityMetadata(entityType: string, attributes?: string[]): XrmPromise<EntityMetadata, ErrorResponse>;

		/**
		 * Gets the entity metadata for the specified entity.
		 * @param entityType The logical name of the entity.
		 * @param entityToAttributes The entity-attributes pair to get metadata for.
		 */
        getEntitiesMetadata(entityToAttributes: { [entityType: string]: string[] }): XrmPromise<EntityMetadata[], ErrorResponse>;

		/**
		 * Gets the Xrm global context.
		 * @returns The Xrm global context.
		 */
        getGlobalContext(): GlobalContext;

		/**
		 * Opens a lookup dialog allowing the user to select one or more entities.
		 *
		 * @param   {LookupOptions} lookupOptions  Options for opening the lookup dialog.
		 */
        lookupObjects(lookupOptions: LookupOptions): XrmPromise<LookupValue[], ErrorResponse>;

		/**
		 * Query if 'entityType' is an Activity entity.
		 *
		 * @param   {string} entityType  Type of the entity.
		 *
		 * @return  true if the entity is an Activity, false if not.
		 */
        isActivityType(entityType: string): boolean;

		/**
		 * Opens quick create.
		 *
		 * @param   {Function}  callback  The function that will be called when a record is created. This
		 *     function is passed a LookupValue object as a parameter.
		 * @param   {string} entityLogicalName  The logical name of the entity to create.
		 * @param   {LookupValue}  createFromEntity (Optional) Designates a record that will provide default values
		 *     based on mapped attribute values.
		 * @param   {OpenParameters} parameters (Optional) A dictionary object that passes extra query string
		 *     parameters to the form. Invalid query string parameters will cause an
		 *     error.
		 */
        openQuickCreate(entityLogicalName: string, createFromEntity?: LookupValue, parameters?: OpenParameters): XrmClientApi.XrmPromise<XrmClientApi.SuccessResponse, XrmClientApi.ErrorResponse>;

		/**
		 * Opens an entity form.
		 *
		 * @param   {string} name The entity's logical name.
		 * @param   {string} id   (Optional) The unique identifier for the record.
		 * @param   {FormParameters} parameters  (Optional) A dictionary object that passes extra query string parameters to the form.
		 * @param   {WindowOptions} windowOptions   (Optional) Options for controlling the window.
		 */
        openEntityForm(name: string, id?: string, parameters?: FormOpenParameters, windowOptions?: WindowOptions): void;

		/**
		 * Opens an HTML Web Resource in a new browser window.
		 *
		 * @param   {string} webResourceName Name of the HTML web resource. Can be used to pass URL
		 *     parameters.  See Remarks.
		 * @param   {string} webResourceData (Optional) Data to pass into the Web Resource's data parameter.
		 *    It is advised to use encodeURIcomponent() to encode the value.
		 * @param   {number} width  (Optional) The width of the new window.
		 * @param   {number} height (Optional) The height of the new window.
		 *
		 * @return  A Window reference, containing the opened Web Resource.
		 *
		 * @remarks This function will not work with Microsoft Dynamics CRM for tablets.
		 * Valid WebResource URL Parameters:   typename
		 *    type
		 *    id
		 *    orgname
		 *    userlcid
		 *    data (identical to this method's webResourceData parameter)
		 *    formid
		 */
        openWebResource(webResourceName: string, webResourceData?: string, width?: number, height?: number): void;

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
		* Begins a secure session for a 1st party resource.
		* @param resource The resource for which the session is being started.
		* @param cookieName The resource for which the session is being started.
		* @param cookieDomain The domain on which the cookie will be set.
		* @returns A deferred object which will provide the expiry time of the token if the request succeeded or the error code if it failed.
		 */
        beginSecureSessionForResource(resource: string, cookieName: string, cookieDomain: string): XrmClientApi.XrmPromise<Date, number>;

		/**
		 * Returns the allowed status transitions from the current status
		 * @param entityLogicalName entity logical name
		 * @param statusCode status code
		 */
        getAllowedStatusTransitions(entityLogicalName: string, stateCode: number): XrmPromise<number[], ErrorResponse>;
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
		 * @returns promise defining success or failure of operation. the success case returns a boolean specifying if yes or no button where pressed 
		 */
        addGlobalNotification(
            type: XrmClientApi.Constants.GlobalNotificationType,
            level: XrmClientApi.Constants.GlobalNotificationLevel,
            message: string,
            title: string,
            action: XrmClientApi.ActionDescriptor): XrmClientApi.XrmPromise<string, XrmClientApi.ErrorResponse>;

		/**
		 * Clears the global Notification.
		 * @param id The id of a GlobalNotification.
		 * @returns promise defining success or failure of operation. the success case returns a boolean specifying if yes or no button where pressed 
		 */
        clearGlobalNotification(id: string): XrmClientApi.XrmPromise<void, XrmClientApi.ErrorResponse>;
    }

	/**
	 * Interface for interacting with a progress window.
	 */
    export interface ProgressWindow {
		/**
		 * Closes tht progress window.
		 */
        close(): void;

		/**
		 * Gets or sets the message displayedin the progress window.
		 */
        message: string
    }

	/**
	 * Interface for the client context.
	 */
    export interface ClientContext {
		/**
		 * Returns a value to indicate which client the script is executing in.
		 *
		 * @return  The client, as either "Web", "Outlook", or "Mobile"
		 */
        getClient(): string;

		/**
		 * Gets client's current state.
		 *
		 * @return  The client state, as either "Online" or "Offline"
		 */
        getClientState(): string;

		/**
		 * Gets information about the kind of device the user is using.
		 * @returns Information about the kind of device the user is using.
		 */
        getFormFactor(): Constants.FormFactor;
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
		 * Gets client's base URL for Dynamics CRM
		 *
		 * @return  The client's base URL
		 * @remarks For Dynamics CRM On-Premises:   http(s)://server/org
		 * For Dynamics CRM Online:  https://org.crm.dynamics.com
		 * For Dynamics CRM for Outlook (Offline):  http://localhost:2525
		 */
        getClientUrl(): string;

		/**
		 * Gets current styling theme.
		 *
		 * @return  The name of the current theme, as either "default", "Office12Blue", or "Office14Silver"
		 *
		 * @remarks This function does not work with Dynamics CRM for tablets.
		 */
        getCurrentTheme(): string;

		/**
		 * Prefixes the current organization's unique name to a string; typically a URL path.
		 *
		 * @param   {string} sPath   Local pathname of the resource.
		 *
		 * @return  A path string with the organization name.
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
		 * organization variables for the organization 
		 */
        organizationSettings: OrganizationSettings;

		/**
		 * organization unique name
		 */
        getOrgUniqueName(): string;

		/**
		 * Returns value of the organization setting
		 */
        getAdvancedConfigSetting(setting: string): any;

		/**
		* Gets the properties of the current Application.
		* @returns dictionary of app properties.
		*/
        getCurrentAppProperties(): XrmPromise<{ [key: string]: string }, ErrorResponse>;
    }

	/**
	 * Interface for the Xrm.Page.data object.
	 */
    export interface FormData {
		/**
		 * Asynchronously refreshes data on the form, without reloading the page.
		 *
		 * @param   {boolean}   save true to save the record, after the refresh.
		 *
		 * @return  An XrmPromise.
		 */
        refresh(save?: boolean): XrmPromise<SuccessResponse, ErrorResponse>;

		/**
		 * Asynchronously saves the record.
		 *
		 * @return  An XrmPromise.
		 */
        save(saveOptions?: XrmClientApi.SaveOptions): XrmPromise<SaveSuccessResponse, ErrorResponse>;

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
		 * Returns true if all of the form data is valid
		 */
        isValid(): boolean

		/**
		 * Adds a handler to be called when the data is loaded
		 * @param   {EventHandler}   handler The handler.
		 */
        addOnLoad(handler: EventHandler): void;

		/**
		 *  Removes the handler from the "on load" event.
		 * @param   {EventHandler}   handler The handler.
		 */
        removeOnload(handler: EventHandler): void;
    }

	/**
	 * Interface for the Xrm.Page.ui object.
	 */
    export interface FormUi {
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
		 *
		 * @remarks This method does not work with Microsoft Dynamics CRM for tablets.
		 */
        refreshRibbon(): void;

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
        formSelector: Controls.FormSelector;

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
        refresh(): XrmClientApi.XrmPromise<XrmClientApi.SuccessResponse, void>;
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
	* interface for user settings
	*/
    export interface UserSettings {
		/**
		* user longuage id 
		*/
        languageId: number;

		/**
		 * The user's language Locale.(Language locale).
		 */
        localeId: number;

		/**
		 * The user ID.(User ID).
		 */
        userId: string;

		/**
		 * The user Name.(User Name).
		 */
        userName: string;

		/**
		 * The user security roles.(Security Roles).
		 */
        securityRoles: string[];

		/**
		 * Returns the difference between the local time and Coordinated Universal Time (UTC).
		 *
		 * @return  The time zone offset, in minutes.
		 */
        getTimeZoneOffsetMinutes(): number;

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
    }

	/**
	* interface for organization settings
	*/
    export interface OrganizationSettings {
		/**
		*language code for the organization
		*/
        languageId: number;

		/**
		* locale code for the organization 
		*/
        localeId: number;

		/**
		*Indicates if auto-save is enabled for the organization
		*/
        isAutoSaveEnabled: boolean;

		/**
		*Unique name of the organization 
		*/
        uniqueName: string;

		/**
		*All attributes of the org entity that are available.
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
		 *  returns true if Skype protocol is enabled 
		 */
        useSkypeProtocol: boolean;
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
	 * Interface for Xrm.Page.data promises.
	 */
    export interface XrmPromise<T1, T2> {
		/**
		 * A basic 'then' promise.
		 *
		 * @param   {SuccessCallbackDelegate}   successCallback   The success callback.
		 * @param   {ErrorCallbackDelegate}  errorCallback  The error callback.
		 */
        then(successCallback?: SuccessCallbackDelegate<T1>, errorCallback?: ErrorCallbackDelegate<T2>): void;
    }

	/**
	 * A definition module for collection interface declarations.
	 */
    export module Collection {
		/**
		 * Interface for a matching delegate.
		 *
		 * @tparam  T   Generic type parameter.
		 */
        export interface MatchingDelegate<T> {
			/**
			 * Called for each item in an array
			 *
			 * @param   {T} item   The item.
			 * @param   {number} index   Zero-based index of the item array.
			 *
			 * @return  true if the item matches, false if it does not.
			 */
            (item: T, index: number): boolean;
        }

		/**
		 * Interface for iterative delegate.
		 *
		 * @tparam  T   Generic type parameter.
		 */
        export interface IterativeDelegate<T> {
			/**
			 * Called for each item in an array
			 *
			 * @param   {T} item   The item.
			 * @param   {number} index   Zero-based index of the item array.
			 */
            (item: T, index: number): void;
        }

		/**
		 * Interface for an item collection.
		 *
		 * @tparam  T   Generic type parameter.
		 */
        export interface ItemCollection<T> {
			/**
			 * Applies an operation to all items in this collection.
			 *
			 * @param   {IterativeDelegate{T}}  delegate An iterative delegate function
			 */
            forEach(delegate: IterativeDelegate<T>): void;

			/**
			 * Gets.
			 *
			 * @param   {MatchingDelegate{T}}   delegate A matching delegate function
			 *
			 * @return  A T[] whose members have been validated by delegate.
			 */
            get(delegate: MatchingDelegate<T>): T[];

			/**
			 * Gets the item given by the index.
			 *
			 * @param   {number} itemNumber  The item number to get.
			 *
			 * @return  The T in the itemNumber-th place.
			 */
            get(itemNumber: number): T;

			/**
			 * Gets the item given by the key.
			 *
			 * @param   {string} itemName The item name to get.
			 *
			 * @return  The T matching the key itemName.
			 *
			 * @see {@link Xrm.Page.Control.getName()} for Control-naming schemes.
			 */
            get(itemName: string): T;

			/**
			 * Gets the entire array of T.
			 *
			 * @return  A T[].
			 */
            get(): T[];

			/**
			 * Gets the length of the collection.
			 *
			 * @return  The length.
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
		 * @return  The Xrm context.
		 */
        getContext(): GlobalContext;

		/**
		 * Gets the handler's depth, which is the order in which the handler is executed.
		 *
		 * @return  The depth, a 0-based index.
		 */
        getDepth(): number;

		/**
		 * Gets save-event arguments.
		 *
		 * @return  The event arguments.
		 *
		 * @remarks Returns null for all but the "save" event.
		 */
        getEventArgs(): EventArguments;

		/**
		 * Gets a reference to the object for which event occurred.
		 *
		 * @return  The event source.
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
		 * @tparam  T   Generic type parameter.
		 * @param   {string} key The key.
		 *
		 * @return  The shared variable.
		 *
		 * @remarks Used to pass values between handlers of an event.
		 */
        getSharedVariable<T>(key: string): T;

		/**
		 * Sets a shared variable.
		 *
		 * @tparam  T   Generic type parameter.
		 * @param   {string} key The key.
		 * @param   {T} value The value.
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
		 * @remarks  You must use parseInt to convert this value to a number before you can use it to
		 *  set the value of an OptionSetAttribute.
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
		 * @param   {EventContext}  context The event context.
		 */
        (context?: EventContext): void;
    }

    export module Attributes {
		/**
		 * Interface for an Entity attribute.
		 */
        export interface Attribute {
			/**
			 * Adds a handler to be called when the attribute's value is changed.
			 *
			 * @param   {EventHandler}  handler The function reference.
			 */
            addOnChange(handler: EventHandler): void;

			/**
			 * Fire all "on change" event handlers.
			 */
            fireOnChange(): void;

			/**
			 * Gets attribute type.
			 *
			 * @return  The attribute's type name.
			 *
			 * @remarks Values returned are: boolean
			 *    datetime
			 *    decimal
			 *    double
			 *    integer
			 *    lookup
			 *    memo
			 *    money
			 *    optionset
			 *    string
			 */
            getAttributeType(): string;

			/**
			 * Gets the attribute format.
			 *
			 * @return  The format of the attribute.
			 *
			 * @see {@link getAttributeType()}
			 *
			 * @remarks Values returned are: date  (datetime)
			 *    datetime (datetime)
			 *    duration (integer)
			 *    email (string)
			 *    language (optionset)
			 *    none  (integer)
			 *    phone (string)
			 *    text  (string)
			 *    textarea (string)
			 *    tickersymbol   (string)
			 *    timezone (optionset)
			 *    url   (string)
			 */
            getFormat(): string;

			/**
			 * Gets a boolean value indicating whether this Attribute has unsaved changes.
			 *
			 * @return  true if there are unsaved changes, otherwise false.
			 */
            getIsDirty(): boolean;

			/**
			 * Gets the logical name of the attribute.
			 *
			 * @return  The logical name.
			 */
            getName(): string;

			/**
			 * Gets a reference to the record context of this attribute.
			 *
			 * @return  The parent record context.
			 */
            getParent(): Entity;

			/**
			 * Gets the current level of requirement for the attribute.
			 *
			 * @return  The required level, as either "none", "required", or "recommended"
			 */
            getRequiredLevel(): string;

			/**
			 * Gets current submit mode for the attribute.
			 *
			 * @return  The submit mode, as either "always", "never", or "dirty"
			 *
			 * @remarks The default value is "dirty"
			 */
            getSubmitMode(): string;

			/**
			 * Gets the current user's privileges for the attribute.
			 *
			 * @return  The user privileges.
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
			 * @param   {EventHandler}   handler The handler.
			 */
            removeOnChange(handler: EventHandler): void;

			/**
			 * Sets required level.
			 *
			 * @param   {"none"} requirementLevel Not required.
			 */
            setRequiredLevel(requirementLevel: "none"): void;

			/**
			 * Sets required level.
			 *
			 * @param   {"required"} requirementLevel Required.
			 */
            setRequiredLevel(requirementLevel: "required"): void;

			/**
			 * Sets required level.
			 *
			 * @param   {"recommended"} requirementLevel Recommended.
			 */
            setRequiredLevel(requirementLevel: "recommended"): void;

			/**
			 * Sets the required level.
			 *
			 * @param   {string} requirementLevel The requirement level, as either "none", "required", or "recommended"
			 */
            setRequiredLevel(requirementLevel: string): void;

			/**
			 * Sets submit mode.
			 *
			 * @param   {"always"} submitMode  Always submit this attribute.
			 */
            setSubmitMode(submitMode: "always"): void;

			/**
			 * Sets submit mode.
			 *
			 * @param   {"never"} submitMode  Never submit this attribute.
			 */
            setSubmitMode(submitMode: "never"): void;

			/**
			 * Sets submit mode.
			 *
			 * @param   {"dirty"} submitMode  Submit this attribute when changed.
			 */
            setSubmitMode(submitMode: "dirty"): void;

			/**
			 * Sets the submit mode.
			 *
			 * @param   {string} submitMode  The submit mode, as either "always", "never", or "dirty".
			 *
			 * @remarks The default value is "dirty"
			 */
            setSubmitMode(submitMode: string): void;

			/**
			 * A collection of all the controls on the form that interface with this attribute.
			 */
            controls: Collection.ItemCollection<Controls.Control>;

			/**
			 * returns true if the value of the attribute isvalid
			 */
            isValid(): boolean
        }

		/**
		 * Interface for a Number attribute.
		 *
		 * @sa  Attribute
		 */
        export interface NumberAttribute extends Attribute {
			/**
			 * Gets the maximum value allowed.
			 *
			 * @return  The maximum value allowed.
			 */
            getMax(): number;

			/**
			 * Gets the minimum value allowed.
			 *
			 * @return  The minimum value allowed.
			 */
            getMin(): number;

			/**
			 * Gets the attribute's configured precision.
			 *
			 * @return  The total number of allowed decimal places.
			 */
            getPrecision(): number;

			/**
			 * Gets the value.
			 *
			 * @return  The value.
			 */
            getValue(): number;

			/**
			 * Sets the value.
			 *
			 * @param   {number} value   The value.
			 */
            setValue(value: number): void;

			/**
			 * Sets the precision.
			 *
			 * @param	{precision} precision	The precision.
			 */
            setPrecision(precision: number): void

        }

		/**
		 * Interface for a String attribute.
		 *
		 * @sa  Attribute
		 */
        export interface StringAttribute extends Attribute {
			/**
			 * Gets maximum length allowed.
			 *
			 * @return  The maximum length allowed.
			 *
			 * @remarks The email form's "Description" attribute does not have the this method.
			 */
            getMaxLength(): number;

			/**
			 * Gets the value.
			 *
			 * @return  The value.
			 */
            getValue(): string;

			/**
			 * Sets the value.
			 *
			 * @param   {string} value   The value.
			 *
			 * @remarks  A String field with the {@link Attribute.getFormat|email} format enforces email
			 *  address formatting. Attributes on Quick Create Forms will not save values set
			 *  with this method.
			 */
            setValue(value: string): void;
        }

		/**
		 * Interface for a Boolean attribute.
		 *
		 * @sa  Attribute
		 */
        export interface BooleanAttribute extends Attribute {
			/**
			 * Gets the initial value of the attribute.
			 *
			 * @return  The initial value.
			 * @remarks Valid for optionset and boolean attribute types
			 */
            getInitialValue(): boolean;

			/**
			 * Gets the value.
			 *
			 * @return  true if it succeeds, false if it fails.
			 */
            getValue(): boolean;

			/**
			 * Sets the value.
			 *
			 * @param   {boolean}   value   The value.
			 *
			 * @remarks  Attributes on Quick Create Forms will not save values set with this method.
			 */
            setValue(value: boolean): void;
        }

		/**
		 * Interface for a Date attribute.
		 *
		 * @sa  Attribute
		 */
        export interface DateAttribute extends Attribute {
			/**
			 * Gets the value.
			 *
			 * @return  The value.
			 */
            getValue(): Date;

			/**
			 * Sets the value.
			 *
			 * @param   {Date}  value   The value.
			 *
			 * @remarks  Attributes on Quick Create Forms will not save values set with this method.
			 */
            setValue(value: Date): void;
        }

		/**
		 * Interface an OptionSet attribute.
		 *
		 * @sa  Attribute
		 */
        export interface OptionSetAttribute extends Attribute {
			/**
			 * Gets the initial value of the attribute.
			 *
			 * @return  The initial value.
			 * @remarks Valid for optionset and boolean attribute types
			 */
            getInitialValue(): number;

			/**
			 * Gets the option matching a value.
			 *
			 * @param   {number} value   The enumeration value of the option desired.
			 *
			 * @return  The option.
			 */
            getOption(value: number): OptionSetItem;

			/**
			 * Gets the option matching a label.
			 *
			 * @param   {string} label   The label of the option desired.
			 *
			 * @return  The option.
			 */
            getOption(label: string): OptionSetItem;

			/**
			 * Gets all of the options.
			 *
			 * @return  An array of options.
			 */
            getOptions(): OptionSetItem[];

			/**
			 * Gets selected option.
			 *
			 * @return  The selected option.
			 */
            getSelectedOption(): OptionSetItem;

			/**
			 * Gets the label of the currently selected option.
			 *
			 * @return  The current value's label.
			 */
            getText(): string;

			/**
			 * Gets the value.
			 *
			 * @return  The value.
			 */
            getValue(): number;

			/**
			 * Sets the value.
			 *
			 * @param   {number} value   The value.
			 *
			 * @remarks  The getOptions() method returns option values as strings. You must use parseInt
			 *  to convert them to numbers before you can use those values to set the value of an
			 *  OptionSet attribute. Attributes on Quick Create Forms will not save values set
			 *  with this method.
			 */
            setValue(value: number): void;
        }

		/**
		 * Interface a Lookup attribute.
		 *
		 * @sa  Attribute
		 */
        export interface LookupAttribute extends Attribute {
			/**
			 * Gets a boolean value indicating whether the Lookup is a multi-value PartyList.
			 *
			 * @return  true the attribute is a PartyList, otherwise false.
			 */
            getIsPartyList(): boolean;

			/**
			 * Gets the value.
			 *
			 * @return  An array of LookupValue.
			 */
            getValue(): LookupValue[];

			/**
			 * Sets the value.
			 *
			 * @param   {LookupValue[]} value   The value.
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
		 * the list of related entity
		 */
        relatedEntities: XrmClientApi.Collection.ItemCollection<Entity>;

		/**
		 * Adds a handler to be called when the record is saved.
		 *
		 * @param   {EventHandler}   handler The handler.
		 */
        addOnSave(handler: EventHandler): void;

		/**
		 * Gets an serialized-XML string representing data that will be passed to the server upon saving
		 * the record.
		 *
		 * @return  The XML in string format.
		 *
		 * @remarks  This function does not work with Microsoft Dynamics CRM for tablets. Example:
		 *  "<account><name>Contoso</name><accountnumber>55555</accountnumber><telephone2>425
		 *  555-1234</telephone2></account>".
		 */
        getDataXml(): string;

		/**
		 * Returns a LookupValue that references this record.
		 * NOTE: This is not yet published for Entity, but is for GridEntity, so including here for compatibility.
		 *
		 * @return  The entity reference.
		 */
        getEntityReference(): LookupValue;

		/**
		 * Gets entity's logical name.
		 *
		 * @return  The logical name.
		 */
        getEntityName(): string;

		/**
		 * Gets the record's unique identifier.
		 *
		 * @return  The identifier, in Guid format.
		 *
		 * @remarks  Example: "{825CB223-A651-DF11-AA8B-00155DBA3804}".
		 */
        getId(): string;

		/**
		 * Gets a boolean value indicating whether the record has unsaved changes.
		 *
		 * @return  true if there are unsaved changes, otherwise false.
		 */
        getIsDirty(): boolean;

		/**
		 * Gets the record's primary attribute value.
		 *
		 * @return  The primary attribute value.
		 *
		 * @remarks The value for this attribute is used when links to the record are displayed.
		 */
        getPrimaryAttributeValue(): string;

		/**
		 * Removes the handler from the "on save" event.
		 *
		 * @param   {EventHandler}   handler The handler.
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
        isValid(): boolean

		/**
		 * The collection of attributes for the record.
		 */
        attributes: Collection.ItemCollection<Attributes.Attribute>;

		/**
		* sets the id of the record if its in create record
		* @param id GUID to be set
		*/
        setRecordId(id: string): void

		/**
		 * Gets entity's logical name.
		 *
		 * @return  The logical name.
		 */
        getEntitySetName(): string;
    }

	/**
	 * Interface for save event arguments.
	 */
    export interface SaveEventArguments extends EventArguments {
		/**
		 * Gets save mode, as an integer.
		 *
		 * @return  The save mode.
		 * @remarks Values returned are: 1   Save
		 *    2   Save and Close
		 *    59  Save and New
		 *    70  AutoSave (Where enabled; can be used with an OnSave handler
		 *   to conditionally disable auto-saving)
		 *    58  Save as Completed (Activities)
		 *    5   Deactivate
		 *    6   Reactivate
		 *    47  Assign (All user- or team-owned entities)
		 *    7   Send (Email)
		 *    16  Qualify (Lead)
		 *    15  Disqualify (Lead)
		 */
        getSaveMode(): Constants.SaveMode;

		/**
		 * Returns a boolean value to indicate if the record's save has been prevented.
		 *
		 * @return  true if saving is prevented, otherwise false.
		 */
        isDefaultPrevented(): boolean;

		/**
		 * Prevents the save operation from being submitted to the server.
		 * @remarks All remaining "on save" handlers will continue execution.
		 */
        preventDefault(): void;
    }

    export interface EventArguments {
    }

    export interface DataLoadEventArguments extends EventArguments {
        getDataLoadState(): Constants.DataLoadState;
    }

    export interface DataLoadEventArguments extends EventArguments {
        getDataLoadState(): Constants.DataLoadState;
    }

    export module Controls {
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
			 * @return  The label.
			 */
            getLabel(): string;

			/**
			 * Gets the visibility state.
			 *
			 * @return  true if the tab is visible, otherwise false.
			 */
            getVisible(): boolean;

			/**
			 * Sets the label.
			 *
			 * @param   {string} label   The label.
			 */
            setLabel(label: string): void;

			/**
			 * Sets the visibility state.
			 *
			 * @param   {boolean}   visible true to show, false to hide.
			 */
            setVisible(visible: boolean): void;
        }

        export interface NamedUiElement extends UiElement {
			/**
			 * Gets the name of the control on the form.
			 *
			 * @return  The name of the control.
			 */
            getName(): string;
        }

        export interface ProcessControl {
            getDisplayState(): string;

            getVisible(): boolean;

			/**
			 * Sets display state of the process flow control.
			 *
			 * @param   {"collapsed"}   displayState Collapsed process flow control.
			 */
            setDisplayState(displayState: "collapsed"): void;

			/**
			 * Sets display state of the process flow control.
			 *
			 * @param   {"expanded"} displayState Expanded process flow control.
			 */
            setDisplayState(displayState: "expanded"): void;

			/**
			 * Sets display state of the process flow control.
			 *
			 * @param   {string} displayState   Display state of the process flow control, as either "expanded" or "collapsed"
			 */
            setDisplayState(displayState: string): void;

			/**
			 * Sets the visibility state.
			 *
			 * @param   {boolean}   visible true to show, false to hide.
			 */
            setVisible(visible: boolean): void;

			/**
			 * Reflow the UI of the process control
			 *
			 * @param	{boolean}	updateUI	Flag indicating if the ui should be updated or not.
			 * @param	{string}	arentStage	Indicate the stage whose child flow has been updated.
			 * @param	{string}	nextStage	Next stage of the parent stage.
			 */
            reflow(updateUI: boolean, parentStage: string, nextStage: string): void;
        }

		/**
		 * Interface for Xrm.Page.ui controls.
		 *
		 * @sa  UiElement
		 */
        export interface Control extends NamedUiElement, UiFocusable {
			/**
			 * Clears the notification identified by uniqueId.
			 *
			 * @param   {string} uniqueId (Optional) Unique identifier.
			 *
			 * @return  true if it succeeds, false if it fails.
			 *
			 * @remarks If the uniqueId parameter is not used, the current notification shown will be removed.
			 */
            clearNotification(uniqueId?: string): boolean;

			/**
			 * Gets the control's type.
			 *
			 * @return  The control type.
			 * @remarks Values returned are: standard
			 *    iframe
			 *    lookup
			 *    optionset
			 *    subgrid
			 *    webresource
			 *    notes
			 *    timercontrol
			 *    kbsearch (CRM Online Only, use parature.d.ts)
			 */
            getControlType(): string;

			/**
			 * Gets a boolean value, indicating whether the control is disabled.
			 *
			 * @return  true if it is disabled, otherwise false.
			 */
            getDisabled(): boolean;

			/**
			 * Gets a reference to the Section parent of the control.
			 *
			 * @return  The parent Section.
			 */
            getParent(): Section;

			/**
			 * Sets the state of the control to either enabled, or disabled.
			 *
			 * @param   {boolean}   disabled true to disable, false to enable.
			 */
            setDisabled(disabled: boolean): void;

			/**
			 * Sets a control-local notification message.
			 *
			 * @param   {string} message  The message.
			 * @param   {string} uniqueId Unique identifier.
			 *
			 * @return  true if it succeeds, false if it fails.
			 *
			 * @remarks  When this method is used on Microsoft Dynamics CRM for tablets a red "X" icon
			 *  appears next to the control. Tapping on the icon will display the message.
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
		 * @sa  Control
		 */
        export interface DataControl extends Control {
			/**
			 * Gets the control's bound attribute.
			 *
			 * @tparam  T   An Attribute type.
			 *
			 * @return  The attribute.
			 */
            getAttribute<T extends Attributes.Attribute>(): T;

			/**
			 * Gets the control's bound attribute.
			 *
			 * @return  The attribute.
			 */
            getAttribute(): Attributes.Attribute;
        }

		/**
		 * Interface for a Date control.
		 *
		 * @sa  DataControl
		 */
        export interface DateControl extends DataControl {
			/**
			 * Gets the control's bound attribute.
			 *
			 * @return  The attribute.
			 */
            getAttribute(): Attributes.DateAttribute;

			/**
			 * Gets the status of the time-of-day component of the Date control.
			 *
			 * @return  true if the time is shown, otherwise false.
			 */
            getShowTime(): boolean;

			/**
			 * Sets the visibility of the time component of the Date control.
			 *
			 * @param   {boolean}   showTimeValue   true to show, false to hide the time value.
			 */
            setShowTime(showTimeValue: boolean): void;
        }

		/**
		 * Interface for a Lookup control.
		 *
		 * @sa  DataControl
		 */
        export interface LookupControl extends DataControl {
			/**
			 * Adds a handler to the "pre search" event of the Lookup control.
			 *
			 * @param   {Function}  handler The handler.
			 */
            addPreSearch(handler: EventHandler): void;

			/**
			 * Adds an additional custom filter to the lookup, with the "AND" filter operator.
			 * Can only be used within a "pre search" event handler
			 *
			 * @sa addPreSearch
			 *
			 * @param   {string} filter  Specifies the filter, as a serialized FetchXML
			 *   "filter" node.
			 * @param   {string} entityLogicalName   (Optional) The logical name of the entity.
			 */
            addCustomFilter(filter: string, entityLogicalName?: string): void;

			/**
			 * Adds a custom view for the Lookup dialog.
			 *
			 * @param   {string} viewId Unique identifier for the view, in Guid format.
			 * @param   {string} entityName   Name of the entity.
			 * @param   {string} viewDisplayName Name of the view to display.
			 * @param   {string} fetchXml  The FetchXML query for the view's contents, serialized as a string.
			 * @param   {string} layoutXml The Layout XML, serialized as a string.
			 * @param   {boolean}   isDefault true, to treat this view as default.
			 */
            addCustomView(viewId: string, entityName: string, viewDisplayName: string, fetchXml: string, layoutXml: string, isDefault: boolean): void;

			/**
			 * Gets the control's bound attribute.
			 *
			 * @return  The attribute.
			 */
            getAttribute(): Attributes.LookupAttribute;

			/**
			 * Gets the unique identifier of the default view.
			 *
			 * @return  The default view, in Guid format.
			 *
			 * @remarks Example: "{00000000-0000-0000-0000-000000000000}"
			 */
            getDefaultView(): string;

			/**
			 * Removes the handler from the "pre search" event of the Lookup control.
			 *
			 * @param   {Function}  handler The handler.
			 */
            removePreSearch(handler: EventHandler): void;

			/**
			 * Sets the Lookup's default view.
			 *
			 * @param   {string} viewGuid Unique identifier for the view.
			 *
			 * @remarks Example viewGuid value: "{00000000-0000-0000-0000-000000000000}"
			 */
            setDefaultView(viewGuid: string): void;
        }

		/**
		 * Interface for an OptionSet control.
		 *
		 * @sa  DataControl
		 */
        export interface OptionSetControl extends DataControl {
			/**
			 * Adds an option.
			 *
			 * @param   {OptionSetItem} option  The option.
			 * @param   {number} index  (Optional) zero-based index of the option.
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
			 * Gets the control's bound attribute.
			 *
			 * @return  The attribute.
			 */
            getAttribute(): Attributes.OptionSetAttribute;

			/**
			 * Removes the option matching the value.
			 *
			 * @param   {number} value   The value.
			 */
            removeOption(value: number): void;

			/**
			 * Gets the collection of option objects.
			 * @returns Collection of option objects.
			 */
            getOptions(): XrmClientApi.OptionSetItem[]
        }

		/**
		 * Text control on the form.
		 */
        // TODO: Task 135676: Which controls do these methods apply to, is it only lookup?  MSDN is unclear.
        interface KeyPressEnabledControl {
            // TODO: Task 135676: Add this interface to text/number controls

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
			 * Show auto complete on returned result.
			 * @param result The result to be displayed in dropdown.
			 */
            showAutoComplete(result: any): void;

			/**
			 * Hide auto complete.
			 */
            hideAutoComplete(): void;

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
        interface QuickFormControl extends Control // TODO: Task 135645: This should also extend Form rather than redefining the form interface here.
        {
            ui: FormUi;
            data: FormData;

			/**
			 * Gets all controls.
			 *
			 * @return  An array of controls.
			 */
            getControl(): Controls.Control[];

			/**
			 * Gets a control matching controlName.
			 *
			 * @tparam  T   A Control type
			 * @param   {string} controlName Name of the control.
			 *
			 * @return  The control.
			 */
            getControl<T extends Controls.Control>(controlName: string): T;

			/**
			 * Gets a control matching controlName.
			 *
			 * @param   {string} controlName Name of the control.
			 *
			 * @return  The control.
			 */
            getControl(controlName: string): Controls.Control;

			/**
			 * Gets a control by index.
			 *
			 * @param   {number} index   The control index.
			 *
			 * @return  The control.
			 */
            getControl(index: number): Controls.Control;

			/**
			 * Gets a control.
			 *
			 * @param   {Collection.MatchingDelegate{Control}}  delegateFunction A matching delegate function.
			 *
			 * @return  An array of control.
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
			 * @returns 1 if search is successful
			 */
            setSearchQuery(value: string): number;

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
			 * Use this method to get the logical name of the entity data displayed in the grid.
			 *
			 * @return  The entity name.
			 */
            getEntityName(): string;

			/**
			* Gets the fetch xml used by the grid to retrieve the grid data.
			*
			* @return  The fetch xml.
			*/
            getFetchXml(): string;

			/**
			 * Use this method to get access to the Grid available in the GridControl.
			 *
			 * @return  The grid.
			 */
            getGrid(): Grid;

			/**
			 * Use this method to get access to the ViewSelector available for the GridControl when it is configured to display views.
			 *
			 * @return  The view selector.
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
			 * @returns The URL for the current grid control.
			 */
            getUrl(clientType?: XrmClientApi.Constants.ClientType): string;
        }

        export interface SubGridControl extends GridControl, Control {
			/**
			 * Use this method to add event handlers to the GridControl's OnLoad event.
			 *
			 * @param   {Function} handler The event handler.
			 */
            addOnLoad(handler: EventHandler): void;

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

			/**
			 * opens the related grid
			 */
            openRelatedGrid(): void;

			/**
			 * Use this method to remove event handlers from the GridControl's OnLoad event.
			 *
			 * @param   {Function} handler The handler.
			 */
            removeOnLoad(handler: EventHandler): void;
        }

		/**
		 * Interface for a framed control, which is either a Web Resource or an Iframe.
		 *
		 * @sa  Control
		 *
		 * @remarks  An Iframe control provides additional methods, so use {@link IframeControl} where
		 *  appropriate.  Silverlight controls should use {@link SilverlightControl}.
		 */
        export interface FramedControl extends Control {
			/**
			 * Gets the DOM element containing the control.
			 *
			 * @return  The container object.
			 *
			 * @remarks Unavailable for Microsoft Dynamics CRM for tablets.
			 */
            getObject(): HTMLIFrameElement;

			/**
			 * Gets the URL value of the control.
			 *
			 * @return  The source URL.
			 *
			 * @remarks Unavailable for Microsoft Dynamics CRM for tablets.
			 */
            getSrc(): string;

			/**
			 * Sets the URL value of the control.
			 *
			 * @param   {string} src The source URL.
			 *
			 * @remarks Unavailable for Microsoft Dynamics CRM for tablets.
			 */
            setSrc(src: string): void;
        }

		/**
		 * Interface for an Iframe control.
		 *
		 * @sa  FramedControl
		 */
        export interface IframeControl extends FramedControl {
			/**
			 * Gets initial URL defined for the Iframe.
			 *
			 * @return  The initial URL.
			 *
			 * @remarks Unavailable for Microsoft Dynamics CRM for tablets.
			 */
            getInitialUrl(): string;
        }


		/**
		 * Interface for a form tab.
		 *
		 * @sa  UiElement
		 * @sa  UiFocusable
		 */
        export interface Tab extends NamedUiElement, UiFocusable {
			/**
			 * Adds or Sets a function to be called on tab's state ("expanded" or "collapsed") change.
			 * @param handler The function to be called on tab state change.
			 */
            addTabStateChange(handler: EventHandler): void;

			/**
			 * Gets display state of the tab.
			 *
			 * @return  The display state, as either "expanded" or "collapsed"
			 */
            getDisplayState(): string;

			/**
			 * Gets a reference to the Xrm.Page.ui parent of the tab.
			 *
			 * @return  The parent.
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
			 * @param   {"collapsed"}   displayState Collapsed tab.
			 */
            setDisplayState(displayState: "collapsed"): void;

			/**
			 * Sets display state of the tab.
			 *
			 * @param   {"expanded"} displayState Expanded tab.
			 */
            setDisplayState(displayState: "expanded"): void;

			/**
			 * Sets display state of the tab.
			 *
			 * @param   {string} displayState   Display state of the tab, as either "expanded" or "collapsed"
			 */
            setDisplayState(displayState: string): void;

			/**
			 * A reference to the collection of form sections within this tab.
			 */
            sections: Collection.ItemCollection<Section>;
        }

		/**
		 * Interface for a form section.
		 *
		 * @sa  UiElement
		 */
        export interface Section extends NamedUiElement {
			/**
			 * Gets a reference to the Xrm.Page.Tab parent of this item.
			 *
			 * @return  The parent.
			 */
            getParent(): Tab;

			/**
			 * A reference to the collection of controls within this tab.
			 */
            controls: Collection.ItemCollection<Control>;
        }

		/**
		 * Interface for a grid.  Use Grid methods to access information about data in the grid. Grid is returned by the
		 * GridControl.getGrid method.
		 */
        export interface Grid {
			/**
			 * Returns a collection of every GridRow in the Grid.
			 *
			 * @return  The rows.
			 */
            getRows(): Collection.ItemCollection<Grid.GridRow>;

			/**
			 * Returns a collection of every selected GridRow in the Grid.
			 *
			 * @return  The selected rows.
			 */
            getSelectedRows(): Collection.ItemCollection<Grid.GridRow>;

			/**
			 * Returns the total number of records in the Grid.
			 *
			 * @return  The total record count.
			 */
            getTotalRecordCount(): number;
        }

		/**
		 * Interface for the view selector.  Use the ViewSelector methods to get or set information about the view selector
		 * of the grid control.
		 */
        export interface ViewSelector {
			/**
			 * Use this method to get a reference to the current view.
			 *
			 * @return  The current view.
			 */
            getCurrentView(): LookupValue;

			/**
			 * Use this method to determine whether the view selector is visible.
			 *
			 * @return  true if visible, false if not.
			 */
            isVisible(): boolean;

			/**
			 * Use this method to set the current view.
			 *
			 * @param   {LookupValue}  viewSelectorItem The view selector item.
			 */
            setCurrentView(viewSelectorItem: LookupValue): void;
        }

		/**
		 * Interface for the form selector control.
		 */
        export interface FormSelector {
			/**
			 * Gets current form.
			 *
			 * @return  The current item.
			 *
			 * @remarks When only one form is available this method will return null.
			 */
            getCurrentItem(): FormSelectorItem;

			/**
			 * A reference to the collection of available forms.
			 */
            items: Collection.ItemCollection<FormSelectorItem>;
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
		 * @sa  UiElement
		 * @sa  UiFocusable
		 */
        export interface NavigationItem extends UiElement, UiFocusable {
			/**
			 * Gets the name of the item.
			 *
			 * @return  The identifier.
			 */
            getId(): string;
        }
    }

    export module Grid {
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
		 * Interface for grid row data.  Use the GridRowData.getEntity method to access the GridEntity. GridRowData is
		 * returned by the GridRow.getData method.
		 */
        export interface GridRowData {
			/**
			 * Returns the GridEntity for the GridRowData.
			 *
			 * @return  The entity.
			 */
            entity: GridEntity;
        }

		/**
		 * Interface for a grid entity.  Use the GridEntity methods to access data about the specific records in the rows.
		 * GridEntity is returned by the GridRowData.getEntity method.
		 */
        export interface GridEntity {
			/**
			 * Returns the logical name for the record in the row.
			 *
			 * @return  The entity name.
			 */
            getEntityName(): string;

			/**
			 * Returns a LookupValue that references this record.
			 *
			 * @return  The entity reference.
			 */
            getEntityReference(): LookupValue;

			/**
			 * Returns the id for the record in the row.
			 *
			 * @return  The identifier of the GridEntity, in GUID format.
			 *
			 * @remarks Example return: "{00000000-0000-0000-0000-000000000000}"
			 */
            getId(): string;

			/**
			 * Returns the primary attribute value for the record in the row.  (Commonly the name.)
			 *
			 * @return  The primary attribute value.
			 */
            getPrimaryAttributeValue(): string;
        }
    }

	/**
	 * Interface for an entity's form selector item.
	 */
    export interface FormSelectorItem {
		/**
		 * Gets the unique identifier of the form.
		 *
		 * @return  The identifier, in Guid format.
		 */
        getId(): string;

		/**
		 * Gets the label for the form.
		 *
		 * @return  The label.
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
    module WebApi {
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
            EntityType = 5
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
            parameterTypes: { [parameterName: string]: ODataParameterType; };

			/**
			 * Name of the operation
			 */
            operationName?: string;

			/**
			 * The type of the operation.
			 */
            operationType?: ODataOperationType;
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
		 * The interface that describes the HeadersMap.
		 */
        interface HeadersMap {
            [index: string]: string;
        }

        export type HeaderInit = Headers | Array<string>;
        export type BodyInit = ArrayBuffer | ArrayBufferView | Blob | FormData | string;
        export type ResponseType = "basic" | "cors" | "default" | "error" | "opaque" | "opaqueredirect";

		/**
		 * The interface that describes the Headers.
		 */
        interface Headers {
            headers?: Headers | HeadersMap;
            get(name: string): string;
            getAll(name: string): Array<string>;
            has(name: string): boolean;
            forEach(callback: (value: string, name: string) => void): void;
        }

		/**
		 * The interface that describes the ResponseInit.
		 */
        interface ResponseInit {
            status: number;
            statusText?: string;
            headers?: HeaderInit;
        }

		/**
		 * The interface that describes the Body.
		 */
        interface Body {
            bodyUsed: boolean;
            arrayBuffer(): XrmPromise<ArrayBuffer, ArrayBuffer>;
            blob(): XrmPromise<Blob, Blob>;
            json(): XrmPromise<any, any>;
            json<T>(): XrmPromise<T, T>;
            text(): XrmPromise<string, string>;
        }

		/**
		 * The interface that describes the Response.
		 */
        interface Response extends Body {
            body?: BodyInit;
            error(): Response;
            type: ResponseType;
            url: string;
            status: number;
            ok: boolean;
            statusText: string;
            headers: Headers;
        }

		/**
		 * Represents Tye of the Odata Operation  
		 */
        export const enum ODataOperationType {
            Action = 0,
            Function = 1,
            CRUD = 2,
        }
    }

	/**
	 * Generic parameters class that's a dictionary of strings.
	 */
    export interface Parameters {
		/**
		 * Additional parameters can be provided to the request, by overloading
		 * this object with additional key and value pairs. This can only be used
		 * to provide default field values for the form, or pass data to custom
		 * parameters that have been customized for the form.
		 */
        [key: string]: any;
    }

    export interface OpenParameters extends Parameters {
        [key: string]: any;
    }

    export interface DialogParameters extends Parameters {

    }

    export interface FormParameters extends Parameters {
		/**
		 * Additional parameters can be provided to the request, by overloading
		 * this object with additional key and value pairs. This can only be used
		 * to provide default field values for the form.
		 */
        [key: string]: boolean | Date | number | string;
    }

    export interface TaskFlowParameters extends Parameters {

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
		 *    "off"  (The navigation bar is not displayed.)
		 *    "entity"  (On an entity form, only the navigation options for related
		 *  entities are available.)
		 */
        navbar?: string;

		/**
		 * Controls whether the command bar is displayed.
		 * Accepted values are: "true" (The command bar is displayed.)
		 *    "false"   (The command bar is not displayed.)
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
    export interface WindowOptions {
        openInNewWindow: boolean;
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
        useQuickCreateForm?: boolean;		// Defaults to true.  Ignored when entityId is specified. 
        createFromEntity?: LookupValue;
        formId?: string;
        openInNewWindow?: boolean;		// Defaults to false.  Ignored when in an app shim. 
        width?: number;		// Ignored when openInNewWindow is false. 
        height?: number;		// Ignored when openInNewWindow is false. 
        cmdbar?: boolean;
        navbar?: string;		// “on”, “off”, “entity”
        processId?: string;
        processInstanceId?: string;
        selectedStageId?: string;
        isCrossEntityNavigate?: boolean;
        position?: Constants.WindowPosition;
        relationship?: any;
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
    interface SuccessResponse {
    }

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
    interface AlertDialogResponse {

    }

	/**
	 * Class passed to an async callback on ErrorDialog close.
	 */
    interface ErrorDialogResponse {

    }

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
	 * Class representing an error.
	 */
    interface ErrorResponse {
        errorCode: number;
        message: string;
        debugMessage?: string;
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
        IsActivity?: boolean;
        IsActivityParty?: boolean;
        IsBusinessProcessEnabled?: boolean;
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
        IsOptimisticConcurrencyEnabled?: boolean;
        IsQuickCreateEnabled?: boolean;
        IsReadOnlyInMobileClient?: boolean;
        IsStateModelAware?: boolean;
        IsValidForAdvancedFind?: boolean;
        IsVisibleInMobileClient?: boolean;
        LogicalCollectionName?: string;
        LogicalName: string;
        OwnershipType?: Constants.EntityOwnershipType;
        PrimaryIdAttribute?: string;
        PrimaryImageAttribute?: string;
        PrimaryNameAttribute?: string;

        Attributes: Collection.ItemCollection<AttributeMetadata>;
    }

    interface AttributeMetadata {
        // TODO: Define the interface for attribute metadata
		OptionSet?: OptionSetOptions;
    }

	/**
	 * Interface for Optionset value
	 */
    interface OptionSetOptions {
        [key: number]: OptionSetItem;
    }

	/**
	 * UI descriptor for an Option set or Two options.
	 */
    export interface OptionDescriptor {
        Color?: string;
        Label: string;
        Value: number;
        DefaultStatus?: number;
        State?: number;
        TransitionData?: number[];
    }

	/**
	 * Attribute metadata type for option-set and boolean attribute
	 */
    interface EnumAttributeMetadata extends AttributeMetadata {
        OptionSet: OptionSetOptions;
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
	 * The Xrm.Page API
	 *
	 * @see {@link http://msdn.microsoft.com/en-us/library/gg328255.aspx|Documentation} for details.
	 */
    export module Process {
		/**
		 * Interface for a CRM Business Process Flow instance.
		 */
        export interface Process {
			/**
			 * Returns the unique identifier of the process.
			 *
			 * @return The identifier for this process, in GUID format.
			 *
			 * @remarks  Example: "{825CB223-A651-DF11-AA8B-00155DBA3804}".
			 */
            getId(): string;

			/**
			 * Returns the name of the process.
			 *
			 * @return  The name.
			 */
            getName(): string;

			/**
			 * Returns an collection of stages in the process.
			 *
			 * @return  The stages.
			 */
            getStages(): Collection.ItemCollection<Stage>;

			/**
			 * Returns a boolean value to indicate if the process is rendered.
			 *
			 * @return  true if the process is rendered, false if not.
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
			 * @return  The stage category.
			 */
            getCategory(): { getValue(): Constants.StageCategory };

			/**
			 * Returns the logical name of the entity associated with the stage.
			 *
			 * @return  The entity name.
			 */
            getEntityName(): string;

			/**
			 * Returns the unique identifier of the stage.
			 *
			 * @return  The identifier of the Stage, in GUID format.
			 *
			 * @remarks  Example: "{825CB223-A651-DF11-AA8B-00155DBA3804}".
			 */
            getId(): string;

			/**
			 * Returns the name of the stage.
			 *
			 * @return  The name.
			 */
            getName(): string;

			/**
			 * Returns the status of the stage.
			 *
			 * @return  The status.
			 *
			 * @remarks  This method will return either "active" or "inactive".
			 */
            getStatus(): string;

			/**
			 * Returns a collection of steps in the stage.
			 *
			 * @return  An array of Step.
			 */
            getSteps(): Collection.ItemCollection<Step>;
        }

        export interface Step {
			/**
			 * Returns the logical name of the attribute associated to the step.
			 *
			 * @return  The attribute.
			 *
			 * @remarks  Some steps don’t contain an attribute value.
			 */
            getAttribute(): string;

			/**
			 * Returns the name of the step.
			 *
			 * @return  The name.
			 */
            getName(): string;

			/**
			 * Returns whether the step is required in the business process flow.
			 *
			 * @return  true if required, false if not.
			 *
			 * @remarks  Returns true if the step is marked as required in the Business Process Flow editor; otherwise, false.
			 *  There is no connection between this value and the values you can change in the Xrm.Page.data.entity
			 *  attribute RequiredLevel methods.
			 */
            isRequired(): boolean;
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
			 * @param handler OnStateChange event handler.
			 */
            removeOnProcessStatusChange(handler: ProcessCallbackDelegate): void;

			/**
			 * Returns a Process object representing the active process.
			 *
			 * @return  current active process.
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
			 * @param   {string} processId  the Id of the process to make the active process.
			 * @param   {function}  callbackFunction (Optional) a function to call when the operation is complete.
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
			 * @return  current active stage.
			 */
            getActiveStage(): Stage;

			/**
			 * Set a stage as the active stage.
			 *
			 * @param   {string} stageId the Id of the stage to make the active stage.
			 * @param   {function}  callbackFunction (Optional) a function to call when the operation is complete.
			 */
            setActiveStage(stageId: string, callbackFunction?: ProcessCallbackDelegate): void;

			/**
			 * Use this method to get a collection of stages currently in the active path with methods to interact with the
			 * stages displayed in the business process flow control. The active path represents stages currently rendered in
			 * the process control based on the branching rules and current data in the record.
			 *
			 * @return  A collection of all completed stages, the currently active stage, and the predicted set of future stages
			 * based on satisfied conditions in the branching rule. This may be a subset of the stages returned with
			 * Xrm.Page.data.process.getActiveProcess because it will only include those stages which represent a valid
			 * transition from the current stage based on branching that has occurred in the process.
			 */
            getActivePath(): Collection.ItemCollection<Stage>;

			/**
			 * Call to open the Abandon Process 
			 */
            abandonProcess(): void;

			/**
			* Call to Reactivate a Process
			*/
            reactivateProcess(): void;


			/**
			 * Call to complete the process
			 */
            completeProcess(): void

			/**
			 * Call to open the Switch Process Dialog
			 */
            switchProcess(): void;

			/**
			 * Use this method to asynchronously retrieve the enabled business process flows that the user can switch to for an
			 * entity.
			 *
			 * @param   {Function} callbackFunction   The callback function must accept a parameter
			 *       that contains an object with dictionary
			 *       properties where the name of the property is the
			 *       Id of the business process flow and the value of
			 *       the property is the name of the business process
			 *       flow.
			 *
			 *       The enabled processes are filtered according to
			 *       the user’s privileges. The list of enabled
			 *       processes is the same ones a user can see in the
			 *       UI if they want to change the process manually.
			 */
            getEnabledProcesses(callbackFunction: (enabledProcesses: ProcessDictionary) => void): void;

			/**
			 * Returns an object for the selected stage.
			 * @returns Stage Object.
			 */
            getSelectedStage(): Process.Stage;

			/**
			 * Use this to add a function as an event handler for the OnStageChange event so that it will be called when the
			 * business process flow stage changes.
			 *
			 * @param   {EventHandler}   handler The function will be added to the bottom of the event handler
			 *    pipeline. The execution context is automatically set to be the first
			 *    parameter passed to the event handler.
			 */
            addOnStageChange(handler: EventHandler): void;

			/**
			 * Use this to remove a function as an event handler for the OnStageChange event.
			 *
			 * @param   {EventHandler}   handler If an anonymous function is set using the addOnStageChange method it
			 *    cannot be removed using this method.
			 */
            removeOnStageSelected(handler: EventHandler): void;

			/**
			 * Progresses to the next stage.
			 *
			 * @param   {ProcessCallbackDelegate}   callbackFunction (Optional) A function to call when the operation is
			 *    complete.
			 */
            moveNext(callbackFunction?: ProcessCallbackDelegate): void;

			/**
			 * Moves to the previous stage.
			 *
			 * @param   {ProcessCallbackDelegate}   callbackFunction (Optional) A function to call when the operation is
			 *    complete.
			 */
            movePrevious(callbackFunction?: ProcessCallbackDelegate): void;
        }

		/**
		 * Called when process change methods have completed.
		 *
		 * @param {string} status  The result of the process change operation.
		 * @remarks  Values returned are: success  (The operation succeeded.)
		 *     crossEntity (The previous stage is for a different entity.)
		 *     beginning   (The active stage is the first stage of the active path.)
		 *     invalid  (The operation failed because the selected stage isn’t the same
		 *     as the active stage.)
		 *     unreachable (The stage exists on a different path.)
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
            /* The date when the process was created */
            CreatedOn: Date;

            /* The process defintion id */
            ProcessDefinitionId: string;

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

    export module Constants {
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
            ProcessStageStatuses: ProcessStageStatusStatic;
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
            Dialog = 12
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
            AutoSave = 70
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
            Resolve = 6
        }

		/**
		 * Return values for the client form factor.
		 */
        const enum FormFactor {
            Unknown = 0,
            Desktop = 1,
            Tablet = 2,
            Phone = 3
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
            AssociationEntity = 2
        }

        const enum relationshipType {
            OneToMany = 0,
            ManyToMany = 1
        }

		/**
		 * Options for the grid type.
		 */
        export const enum GridType {
            HomePageGrid = 1,
            Associated = 2,
            Subgrid = 3
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
            BusinessParented = 16
        }

		/**
		 * The options for global notification types.
		 */
        const enum GlobalNotificationType {
			/**
			 * Toast notification type.
			 */
            toast = 1
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
            information = 4
        }

		/**
		 * The options for openFile mode.
		 */
        const enum OpenFileMode {
            open = 1,
            save = 2
        }

        export interface AttributeTypeStatic {
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

        export type AttributeType = "boolean" | "datetime" | "decimal" | "double" | "integer" | "lookup" | "memo" | "money" | "optionset" | "string";

        export interface ClientNameStatic {
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

        export type ClientName = "Mobile" | "Outlook" | "Web" | "UnifiedServiceDesk";

        export interface ClientStateStatic {
			/**
			 * Name for the Online State.
			 */
            online: "Online";

			/**
			 * Name for the Offline State.
			 */
            offline: "Offline";
        }

        export type ClientState = "Online" | "Offline";

		/**
		 * The type of control.
		 */
        export interface ControlTypeStatic {
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
        }

        export type ControlType = "quickform" | "kbsearch" | "notes" | "webresource" | "subgrid" | "lookup" | "optionset" | "iframe" | "standard" | "button";

		/**
		 * The options for notification levels.
		 */
        export interface FormNotificationLevelStatic {
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

        export type ControlNotificationLevel = "ERROR" | "RECOMMENDATION";

		/**
		 * The type of save action to perform on the form.
		 */
        export interface FormSaveActionStatic {
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

        export type FormSaveAction = "save" | "saveandclose" | "saveandnew"

        export interface AttributeFormatStatic {
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

        export type AttributeFormat = "url" | "timezone" | "tickersymbol" | "textarea" | "text" | "phone" | "none" | "language" | "email" | "duration" | "datetime" | "date";

		/**
		 * The requirement level of an attribute.
		 */
        export interface AttributeRequiredLevelStatic {
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

			/**
			 * Required level SystemRequired.
			 */
            systemRequired: "systemrequired";
        }

        export type AttributeRequiredLevel = "none" | "recommended" | "required" | "systemrequired";

        export interface AttributeSubmitModeStatic {
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

        export type AttributeSubmitMode = "dirty" | "always" | "never";

		/**
		 * Possible values for the tab display state.
		 */
        export interface TabDisplayStateStatic {
			/**
			 * Tab is expanded.
			 */
            expanded: "expanded";
			/**
			 * Tab is collapsed.
			 */
            collapsed: "collapsed";
        }

        export type TabDisplayState = "expanded" | "collapsed";

		/**
		 * Name of the Entity
		 */
        export interface EntityNameStatic {
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

        export type EntityName = "activityparty" | "activitypointer" | "annotation" | "attachment" | "category" | "connection" | "connectionrole" | "systemuser" | "team" | "teammembership" | "webresource";

		/**
		 * The possible values for process instance status
		 */
        export interface ProcessInstanceStatusStatic {
			/**
			 * instance is active
			 */
            active: "active";

			/**
			 * instance is finished
			 */
            finish: "finish";

			/**
			 * instance is abandoned
			 */
            abandoned: "abandoned";
        }

        export type ProcessInstanceStatus = "active" | "finish" | "abandoned";

        export interface ProcessStageStatusStatic {
			/**
			 * The stage is active
			 */
            active: "active";

			/**
			 * The stage is inactive
			 */
            inactive: "inactive";
        }

        export type ProcessStageStatus = "active" | "inactive";
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
		 *  Whether the lookup allows more than one item to be selected.
		 */
        allowMultiSelect?: boolean;

		/**
		 *  The default entity type.
		 */
        defaultEntityType: string;

		/**
		 *  The default view to use.
		 */
        defaultViewId?: string;

		/**
		 *  The entity types to display.
		 */
        entityTypes?: string[];

		/**
		 *  The views to be available in the view picker.  Only System views are supported (not user views).
		 */
        viewIds?: string[];

		/**
		 *	The look up type.
		 */
        lookupType: string;
    }

    export interface IRelationship {
		/**
		 * Name of the relationship
		 */
        name: string

		/**
		 * name of the attribute
		 */
        attributeName: string

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
    export module Commanding {
		/**
		 *  Entity Reference definition 
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
        export interface Grid extends Controls.GridControl {
        }

		/**
		 * Form object definition
		 */
        export interface Form extends XrmClientApi.Form {
        }
    }
}
