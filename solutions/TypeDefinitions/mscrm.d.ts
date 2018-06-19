/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

declare module Mscrm {

	interface StandardControl<TParams, TOutput> {
		getOutputs(): TOutput;
		destroy(): void;
		init(context: Mscrm.ControlData<TParams>, notifyOutputChanged?: () => void, state?: Dictionary, container?: HTMLDivElement): void;
		updateView(context: Mscrm.ControlData<TParams>): void;
	}

	interface Control<TParams, TOutput> {
		getOutputs(): TOutput;
		destroy(): void;
		init(context: Mscrm.ControlData<TParams>, notifyOutputChanged?: () => void, state?: Dictionary): void;
		updateView(context: Mscrm.ControlData<TParams>): Mscrm.Component
	}

	interface ControlUtilities {
		beginSecureSessionForResource(resource: string, cookieName: string, cookieDomain: string): Async.XrmPromise<Date, number>;
		getEntityMetadata(entityType: string, attributes?: string[]): Async.XrmPromise<EntityMetadata, ErrorResponse>;
		getResourceString(webResourceName: string, key: string): string;
		lookupObjects(lookupOptions: LookupOptions): Async.XrmPromise<LookupValue[], void>;
		crmUrlEncode(s: string): string;
		crmHtmlEncode(s: string): string;
		isNullOrUndefined(object: any): boolean;
		createPerformanceMarker(id: string): void;
		createPerformanceStopwatch(id: string): PerformanceStopwatch;
		createCrmUri(url: string): string;
		tryCreateGuid(rawguid: string): Guid;
		openInBrowser(url: string): void;
		getServiceUri(service: string): string;
		setNotification(msg: string, id: string): boolean;
		clearNotification(id: string): boolean;
		log(customControlName: string, message: string, logType: TraceLevel): void;
		getControlDefaultMapping(dataType: string, attributes: BaseAttributes): string;
		setState(state: Dictionary): boolean;
		disablePanoramaScroll(value: boolean): boolean;
		scrollToView(controlContainer: any): void;
		notifyOutputChanged(): void;
		notifyOutputChanged(force: boolean, requestRender: boolean): void;
		fireEvent(eventName: string, params: Dictionary): void;
		eventListenerExists(eventName: string): boolean;
		requestRender(callback?: () => void): void;
		isTabPressed(): boolean;
		setLastTabPressedTime(lastTabPressTime: number): void;
		setInteractionMode(newMode: string): void;
		getInteractionMode(): string;
		getElementByRef(refId: string): Element;
		refreshDataSet(propertyName: string, targetEntityName: string): void;
		triggerBarcodeAction(id: string, success: (data: string) => void, failure: (id: number, message: string) => void): void;
		triggerOfflineMetadataSync(): Promise<void>;
		isCameraAvailable(): boolean;
		bindDOMElement(virtualComponent: Mscrm.Component, DOMNode: Element): void;
		unbindDOMComponent(componentId: string): boolean;
		updateComponent(componentId: string, properties: Mscrm.Dictionary): void;
		isFeatureEnabled(featureName: string): boolean;
		retrieveFormWithAttributes(entityName: string, formId?: string, formType?: string): Async.XrmPromise<any, ErrorResponse>;
		getPopupService(): IPopupService;
		addGlobalNotification(
			type: GlobalNotificationType,
			level: GlobalNotificationLevel,
			message: string,
			title: string,
			action: ActionDescriptor): Async.XrmPromise<string, ErrorResponse>;
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
	 * The User's action.
	 */
	interface ActionDescriptor {
		eventHandler: void;
		actionLabel: string;
	}

	interface IPopupService {
		createPopup(props: IPopupProps): void;
		closePopup(name: string): void;
	}

	interface IPopupProps {
		id?: string;
		name: string;
		closeOnOutsideClick?: boolean;
		popupStyle?: ICCFStyle;
		shadowStyle?: ICCFStyle;
		popupToOpen?: string;
		type: PopupType;
		content: HTMLElement;
	}

	enum PopupType {
		Root = 1,
		Nested = 2,
	}

	/**
	* Interface for style objects as understood by the CCF framework
	*/
	interface ICCFStyle {
		borderWidth?: number | string;
		borderBottomWidth?: number | string;
		borderLeftWidth?: number | string;
		borderRightWidth?: number | string;
		borderTopWidth?: number | string;
		height?: number | string;
		width?: number | string;
		margin?: number | string;
		marginBottom?: number | string;
		marginLeft?: number | string;
		marginRight?: number | string;
		marginTop?: number | string;
		padding?: number | string;
		paddingBottom?: number | string;
		paddingLeft?: number | string;
		paddingRight?: number | string;
		paddingTop?: number | string;
		position?: "absolute" | "relative";
		bottom?: number | string;
		left?: number | string;
		right?: number | string;
		top?: number | string;
		alignSelf?: "auto" | "flex-start" | "flex-end" | "center" | "stretch";
		flex?: number | string;
		backgroundColor?: string;
		borderColor?: string;
		borderBottomColor?: string;
		borderLeftColor?: string;
		borderRightColor?: string;
		borderTopColor?: string;
		borderRadius?: number | string;
		borderBottomLeftRadius?: number | string;
		borderBottomRightRadius?: number | string;
		borderTopLeftRadius?: number | string;
		borderTopRightRadius?: number | string;
		borderStyle?: "solid" | "dotted" | "dashed";
		opacity?: number;
		overflow?: "visible" | "hidden";
	}

	interface Offline {
		isOfflineEnabled(entityLogicalName: string): boolean;
	}

	interface ControlData<TParams> {
		parameters: TParams;

		client: ClientInfo;

		factory: {
			createElement(type: string, properties: any, children?: any): Component;
			createComponent(type: string, id: string, properties: IVirtualComponentProps): Component;
		};

		theming: Theme;
		page: IPageBag;
		resources: {
			getString(id: string): string;
			getResource(id: string, success: (data: string) => void, failure: () => void): void;
		};

		utils: ControlUtilities;

		offline: Offline;

		formatting: {
			formatDateShort(value: Date, includeTime?: boolean): string;
			formatDateLong(value: Date): string;
			formatDateLongAbbreviated(value: Date): string;
			formatDateYearMonth(value: Date): string;
			formatInteger(value: number): string;
			formatDecimal(value: number, precision?: number): string;
			formatCurrency(value: number, precision?: number, symbol?: string): string;
			getWeekOfYear(value: Date): number;
			formatTime(value: Date, behavior: DateTimeFieldBehavior): string;
			formatDateAsFilterStringInUTC(value: Date, includeTime?: boolean): string;
			formatLanguage(value: number): string
			// ...
		};

		accessibility: {
			isHighContrastEnabled: boolean;
			registerShortcut(keyCombination: KeyCode[], shortcutHandler: (event: KeyboardEvent) => void, isGlobal: boolean, areaName: string, shortcutDescription: string, srcElementId?: string): void;
			getUniqueId(id: string): string;
			focusElementById(id: string, isAbsoluteId?: boolean): void;
			blurElementById(id: string, isAbsoluteId?: boolean): void;
		};

		navigation: {
			openForm(options: EntityFormOptions, parameters?: Parameters): Async.XrmPromise<OpenFormSuccessResponse, ErrorResponse>;
			openGridPage(entityTypeName: string, viewId?: string, showChart?: boolean, visualizationId?: string, filterExpression?: string): void;
			openSearch(query?: string): void;
			openPowerBIFullScreenPage(powerBIEmbedUrl?: string, powerBIGroupId?: string, powerBIDashboardId?: string, powerBITileId?: string, powerBIReportId?: string, powerBIReportUrl?: string, powerBIComponentTypeCode?: string): void;
			openPhoneNumber(phoneNumber?: string): void;
			openUrl(target?: string, options?: WindowOptions): void;
			openMaps(target?: string): void;
			openConfirmDialog(confirmStrings: ConfirmDialogStrings, options?: DialogOptions): Async.XrmPromise<{ confirmed: boolean }, ErrorResponse>;
			openAlertDialog(alertStrings: AlertDialogStrings, options?: DialogOptions): Async.XrmPromise<SuccessResponse, ErrorResponse>;
			openWebResource(name: string, options: WindowOptions, data?: string): void
			openDialog(dialogName: string, options?: DialogOptions, parameters?: Parameters): Async.XrmPromise<SuccessResponse, ErrorResponse>;
			openFile(file: File, options?: any): Async.XrmPromise<void, ErrorResponse>;
		};

		webAPI: {
			retrieveRecord(entityType: string, id: string, options?: string): Async.XrmPromise<WebApi.Entity, ErrorResponse>;
			createRecord(entityType: string, data: WebApi.Entity): Async.XrmPromise<LookupValue, ErrorResponse>;
			updateRecord(entityType: string, id: string, data: WebApi.Entity): Async.XrmPromise<LookupValue, ErrorResponse>;
			deleteRecord(entityType: string, id: string): Async.XrmPromise<LookupValue, ErrorResponse>;
			retrieveMultipleRecords(entityType: string, options?: string, maxPageSize?: number): Async.XrmPromise<WebApi.Entity[], ErrorResponse>;
			execute(request: WebApi.ODataContract): Async.XrmPromise<WebApi.Response, ErrorResponse>;
			executeMultiple(requests: WebApi.ODataContract[]): Async.XrmPromise<WebApi.Response[], ErrorResponse>;
		};

		externalContext: {
			getExternalContextProperty(externalContextId: string, externalContextPropertyId: string, options?: ExternalContextPropertyOptions): Async.XrmPromise<ExternalContextSuccessResponse, ExternalContextErrorResponse>;
			invokeExternalContextAction(externalContextId: string, externalContextActionId: string, options?: ExternalContextActionOptions): Async.XrmPromise<ExternalContextSuccessResponse, ExternalContextErrorResponse>;
			getAvailableExternalContexts(): Collection.ItemCollection<ExternalContextDescriptor>;
		};

		orgSettings: {
			isRTL: boolean;
			fiscalYearStartDate: Date;
			fiscalPeriodFormat: number;
			fiscalPeriodType: number;
			fiscalYearFormatYear: number;
			fiscalYearFormatPrefix: number;
			fiscalYearFormatSuffix: number;
			fiscalYearDisplayCode: number;
			fiscalPeriodConnector: string;
			showWeekNumber: boolean;
			localeId: number;
			languageId: number;
			uniqueName: string;
			isAutoSaveEnabled: boolean;
			attributes: { [key: string]: any };
		};

		userSettings: {
			dateFormattingInfo: DateFormattingInfo;
			numberFormattingInfo: NumberFormattingInfo;
			getTimeZoneOffsetMinutes(date?: Date): number;
			userId: string;
			userName: string;
			languageId: number;
			localeId: number;
			securityRoles: string[];
			isHighContrastEnabled: boolean;
			isRTL: boolean;
		};

		mode: Mode;

		reporting: {
			reportSuccess(componentName: string, params?: EventParameter[]): void;
			reportFailure(componentName: string, error: Error, suggestedMitigation?: string, params?: EventParameter[]): void;
			reportEvent(event: ApplicationEvent): void;
		}

		children?: {
			[key: string]: ChildComponent
		}

		/**
		* References to descendant nodes in this component's virtual DOM tree
		*/
		refs: { [ref: string]: Component; }

		updatedProperties: string[];

		device: {
			captureImage(options?: CaptureImageOptions): Async.XrmPromise<File, ErrorResponse>;
			captureAudio(): Async.XrmPromise<File, ErrorResponse>;
			captureVideo(): Async.XrmPromise<File, ErrorResponse>;
			pickFile(options?: PickFileOptions): Async.XrmPromise<File[], ErrorResponse>;
			getBarcodeValue(): Async.XrmPromise<string, ErrorResponse>;
			isGetBarcodeValueOperationAvailable(): boolean;
			getCurrentPosition(): Async.XrmPromise<Position, PositionError>;
			isTakePictureOperationAvailable(): boolean;
			isCaptureVideoOperationAvailable(): boolean;
			isCaptureAudioOperationAvailable(): boolean;
		};

		learningPath?: ILearningPathBag;

		communicationChannel?: ICommunicationChannel;
	}

	interface ILearningPathBag {
		DOMAttributeName: string;
		baseControlId: string;
	}

	interface ICommunicationChannel {
		getPresenceMappedField(entityName: string): string;
		isPresenceEnabled(entityName: string): boolean;
	}

	/**
	* The page bag interface
	*/
	interface IPageBag {
		appId: string;
		isPageReadOnly: boolean;
		entityTypeName: string;
		entityId: string;
		getClientUrl(): string;
	}

	interface Mode {
		isControlDisabled: boolean;
		isRead: boolean;
		isPreview: boolean;
		isOffline: boolean;
		isVisible: boolean;
		label: string;

		/**
		 * Whether the page in which the control is located is active
		 */
		isActive: boolean;
		contextInfo: ContextInfo;

		hasFocus: boolean;
		blur: () => void;
		focus: () => void;

		rowSpan: number;
	}

	interface StandardControlData<TParams> extends ControlData<TParams> {

	}

	interface ChildComponent {
		getVirtualRepresentation(additionalProps: Dictionary): Component;
	}


	// REGION : VDOM COMPLEX CONTROL INTERFACES

	/**
	 * Expected interface of the props object passed into a nested child control via createComponent
	 */
	interface IVirtualComponentProps {
		controlstates?: IVirtualComponentControlStates;

		childeventlisteners?: IVirtualComponentEventHandlerPair[];

		parameters?: IParameterDefinitionMap; // This is only used if a full configuration is not provided.

		configuration?: ICustomControlConfiguration;

		descriptor?: ICustomControlDescriptor;

		nestedFormProps?: IFormProps;

		recordId?: string; /** This is currently only used in a non-ship control, but adding it here for sanity sake. Our system currently ignores it. */
	}

	/**
	 * Descriptor of a custom control as defined via it's form XML definition
	 */
	interface ICustomControlDescriptor {
		Id: string;
		Name: string;
		Label?: string;
		DomId?: string;
		ShowLabel?: boolean;
		Visible?: boolean;
		Disabled?: boolean;
		DataFieldName?: string;
		UniqueId?: string;
		Parameters?: IParameterDefinitionMap;
		ControlLayout?: number;
		ClassId?: { guid: string };
	}

	/**
	 * Interface for nested form properties
	 */
	interface IFormProps {
		FormId?: string;
		EntityName?: string;
		RecordId?: string;
		RibbonId?: string;
	}

	/**
	 * The configuration for a custom control as defined in the form descriptor
	 */
	interface ICustomControlConfiguration {
		FormFactor: number;
		CustomControlId: string;
		Name: string;
		Version: string;
		Parameters: IParameterDefinitionMap;
	}

	/**
	 * EventPair consists of eventName and eventHandler
	 */
	interface IVirtualComponentEventHandlerPair {
		eventname: string;
		eventhandler: (data: any) => void;
	}

	/**
	 * States passed into a nested control (focus, things represented on a descriptor)
	 */
	interface IVirtualComponentControlStates {
		hasFocus?: boolean;
		isControlDisabled?: boolean;
		showLabel?: boolean
		label?: string;
	}

	type ExternalContextSuccessResponse = any;

	interface ExternalContextErrorResponse extends ErrorResponse {
		raw?: any;
	}

	interface ExternalContextResult {
		status: string;
		value?: ExternalContextSuccessResponse;
		error?: ExternalContextErrorResponse;
	}

	interface ExternalContextPropertyOptions {
		args?: { [name: string]: any };
		updateListener?: (updatedResult: ExternalContextResult) => void;
	}

	interface ExternalContextActionOptions {
		args?: { [name: string]: any };
	}

	interface ExternalContextDescriptor {
		id: string;
		properties: Collection.ItemCollection<string>;
		actions: Collection.ItemCollection<string>;
	}

	/**
	 * An object mapping a parameter definition to its key as defined in its manifest
	 */
	interface IParameterDefinitionMap {
		[key: string]: ParameterSpecification | IDataSetCustomControlParameterDefinition | IBusinessProcessFlowParameterDefinition | IWebResourceParameterDefinition | IFormParameterDefinition | ITimelineWallParameterDefinition | ICustomControlGroupDefinition;
	}

	interface ITimelineWallParameterDefinition extends ICustomControlParameterDefinition {
		TimelineWallConfiguration?: any;
	}
	/**
	 * State enum for loading of timeline wall
	 */
	const enum TimelineWallActionStatus {
		None,
		Initializing,
		Completed,
	}

	interface ITimelineWallRetrievalStatus {
		requestId: string;
		status: TimelineWallActionStatus;
	}
	/**
	 * An interface representing the timelineWallData State
	 */
	interface ITimelineWallDataState {
		requestStatusMap: { [key: string]: ITimelineWallRetrievalStatus };
		dataQueues: { [key: string]: IData };
	}

	/**
	 * An interface representing the Queue Data
	 */
	interface IData {
		isError?: boolean;
		errorMessage?: any;
		dataResults?: any;
	}

	/**
	 * Parameter passed to Timelinewall control
	 */
	interface TimelineWallParameter {

		/**
		 * context type of page.
		 */
		contextType: string;

		/**
		 * control id.
		 */
		controlId: string;

		/**
		 * TimelineWall metadata loading state
		 */
		entitiesMetadata: { [entity: string]: IEntityMetadata };

		/**
		 * TimelineWall getCommands
		 */
		getCommands?: any;

		/**
		 * TimelineWallConfigurationData
		 */
		timelineWallConfiguration: TimelineWallConfiguration;

		/**
		 * Timelinewall data State
		 */
		timelineWallData?: ITimelineWallDataState;

		//TODO: add return type based on response structure
		getTimelineWallData: (externalParams: ITimelineWallRequest) => any;
	}

	/**
	* Interface to represent parameters of an timelineWall external params
	*/
	interface ITimelineWallRequest {

		/**
		 * The control Id
		 */
		controlId: string;

		/**
		 * The record Id
		 */
		recordId: string;

		/**
		 * The request Id
		 */
		requestId: string;

		/**
		 * The record entity name
		 */
		recordEntityName: string;

		/**
		 * queue type to Request Map
		 */
		queueTypeToRequestMap: IDataRequests;
	}

	interface IDataRequest {
		/*
		 ** isEnabled flag
		 */
		isEnabled: boolean;

		/*
		 ** type for this queue
		 */
		queueType: string;

		/*
		 ** fetchXml for this queue
		 */
		dataMap: { [key: string]: any };
	}

	interface IDataRequests {
		[key: string]: IDataRequest;
	}

	/**
	* An object that store the timeLine configuration data
	*/
	interface TimelineWallConfiguration {

		/**
		* Label to be shown on control. By default will be Timeline
		*/
		Label?: string;

		/**
		* Display defined label if it is true otherwise label will not be shown.
		*/
		DisplayLabel?: boolean;

		/**
		* Selected modules to show in timeline
		*/
		Modules?: string[]; //Activities, Posts, Notes

		/**
		* Boolean to show Filter Pane
		*/
		ShowFilterPane?: boolean;

		/**
		* Boolean to Expand Filter Pane. If set Filter pane will be expanded by default
		*/
		ExpandFilterPane?: boolean;

		/**
		* Boolean to show OneNote Pane
		*/
		ShowOneNotePane?: boolean;

		/**
		* Name of the Activities Configured
		*/
		Activities?: IEntityMetadata[]; // Appointment, Email, Phone Call, Task etc, metadata of all activities including custom activities By default all are selected

		/**
		* Action Card to be opened when we click on create activity
		*/
		CreateActivityUsing?: string; // QuickCreate will be default.

		/**
		* Form in which Activity to be displayed
		*/
		DisplayActivityUsing?: string; // Card form will be default.

		/**
		* Format of Activity Header in which it will be shown
		*/
		DisplayActivityHeaderUsing?: string; // Deafult format will be default.

		/**
		* Sort timeline according to this field
		*/
		SortActivitiesByValue?: string; //default is Modified date

		/**
		* Order by which timeline will be sorted
		*/
		OrderBy?: string; // ascending descending

		/**
		* Number of Record to be shown per page.
		*/
		RecordPerPage?: number; // default 10

		// Activity - Card maping
		ActivityCardMap?: ITimelineWallCardCollection;
	}

	interface ITimelineWallCardCollection {
		timelineCards?: { [entityName: string]: ITimelineWallCard };
	}

	interface ITimelineWallCard {

		activityType?: string;
		headerFields?: ICardField[];
		bodyFields?: ICardField[];
		moduleName?: string;
	}

	interface ICardField {
		label?: string;
		dataFieldName?: string;
		dataType?: any;
	}

	interface ITimelineWallModuleAccessPrivileges {
		[entityName: string]: ITimelineWallModuleAccessPrivilege;
	}

	interface ITimelineWallModuleAccessPrivilege {
		entityName?: string;
		accessPrivilege?: { [access: string]: boolean };
	}

	/**
	 * Entity metadata definition
	 */
	interface IEntityMetadata {
		LogicalName?: string;
		EntitySetName?: string;
		FormId?: string;
		DisplayName?: any;
		ObjectTypeCode?: number;
		IsCustomEntity?: boolean;
		AttributesMetadata?: any;
		Privileges?: any;
	}

	/**
	 * The common definition of a custom control parameter
	 */
	interface ICustomControlParameterDefinition {
		Type?: string; // Defaults to string
	}

	/**
	 * The definition for a group definition
	 */
	interface ICustomControlGroupDefinition extends ICustomControlParameterDefinition {
		Value: string;
	}

	/**
	 * The definiton of a field control parameter as sent down via the form descriptor
	 */
	interface ParameterSpecification extends ICustomControlParameterDefinition // Same as IPropertyCustomControlParameterDefinition, keeping
	{
		Usage?: PropertyUsage; // Defaults to Input
		Value: any;
		Static?: boolean; // Defaults to true
		Primary?: boolean; //Defaults to false
	}

	/**
	* Timer custom control parameter
	*/
	interface ITimerParameter {
		CancelConditionName: string;
		CancelConditionValue: string;
		FailureTimeField: string;
		FailureConditionName: string;
		FailureConditionValue: string;
		PauseConditionName: string;
		PauseConditionValue: string;
		SuccessConditionName: string;
		SuccessConditionValue: string;
		WarningConditionName: string;
		WarningConditionValue: string;
	}

	/**
	 * The definition of Timer control parameter as sent down via the form descriptor
	 */
	interface ITimerParameterDefinition extends ParameterSpecification {
		TimerParameters: ITimerParameter;
	}

	/**
	 * The definiton of a dataset control column parameter as sent down via the form descriptor
	 */
	interface IPropertySetCustomControlParameterDefinition extends ICustomControlParameterDefinition {
		Alias: string;
		DisplayName?: string;
		DataType: string;
		Name: string;
	}

	interface Promise<T> {
		then<TResult>(onfulfilled?: (value: T) => TResult | Promise<TResult>, onrejected?: (reason: any) => TResult | Promise<TResult>): Promise<TResult>;
		catch(onrejected?: (reason: any) => T | Promise<T>): Promise<T>;
	}

	interface IDataSetDataProvider<TRecord> {
		isLoading(): boolean;
		isError(): boolean;
		getErrorMessage(): string;
		setSorting(sorting: DataSetColumnSortStatus[]): void;
		setFiltering(filtering: FilterExpression): void;
		refresh(): Promise<TRecord[]>;
		getRecords(): TRecord[];
		getPaging(): DataSetPaging;
		getColumns(): DataSetColumn[];
		save(record: TRecord): void;
	}

	/**
	 * The definiton of a dataset control parameter as sent down via the form descriptor
	 */
	interface IDataSetCustomControlParameterDefinition extends ICustomControlParameterDefinition {
		Columns?: Array<IPropertySetCustomControlParameterDefinition>;
		DataProvider?: IDataSetDataProvider<DataSetRecord>;
		ViewId: string;
		EntityName?: string;
		TargetEntityType?: string;
		IsHierarchyEnabled?: boolean;
		EnableViewPicker?: boolean;
		RelationshipName?: string;
		VisualizationId?: string;
		ChartGridMode?: string;
	}

	/**
	 * Definition of Chart Control Parameter definition
	 */
	interface IChartCustomControlParameterDefinition extends IDataSetCustomControlParameterDefinition {
		HighchartFilterExpression?: string;
	}

	/**
	* Definition of Business Process flow Parameter definition
	*/
	interface IBusinessProcessFlowParameterDefinition extends ICustomControlParameterDefinition {
		ProcessWrapper?: any;
	}

	/**
	*  Definition of a Nested Form Parameter definition
	*/
	interface IFormParameterDefinition extends ICustomControlParameterDefinition {
		FormDescriptor?: any;
		EntityName?: string;
		RecordId?: string;
	}

	/**
	* Definition of WebResource Html Parameter definition
	*/
	interface IWebResourceParameterDefinition extends ICustomControlParameterDefinition {
		ControlId: string;
		Title: string;
		Url?: string;
		Visible?: boolean;
		ShowLabel?: boolean;
		Label?: string;
		PageType?: string;
		ControlParameters?: any;
		DeviceType?: string;
	}


	interface IKbSearchRecord {
		knowledgeArticleId?: string;
		articlePublicNumber?: string;
		title?: string;
		content?: string;
		knowledgeArticleViews?: number;
		createdon?: Date;
		modifiedOn?: Date;
		expirationdate?: Date;
		stateCode?: number;
		statusCode?: number;
		languageLocaleId?: string;
		rating?: number;
		articleActions?: number[];
	}

	/**
	 * The definition of Lookup.Simple type parameter as sent down via the form descriptor
	 */
	interface ILookupCustomControlParameterDefinition extends IDataSetCustomControlParameterDefinition, ParameterSpecification {
		AllowFilterOff?: boolean;
		AvailableViewIds?: string;
		ContextFilter?: string;
		DependentAttributeName?: string;
		DependentAttributeType?: string;
		DisableQuickFind: boolean;
		ExtraCondition?: string;
		FilterRelationshipName?: string;
	}

	// END REGION

	interface Component {
		getType(): string;
	}

	enum TraceLevel {
		Off = 0,
		Error = 1,
		Warning = 2,
		Perf = 3,
		Info = 4,
		Verbose = 5
	}

	interface PerformanceStopwatch {
		start(): void;
		stop(): void;
	}

	interface Dictionary {
		[key: string]: any;
	}

	interface ClientInfo {

		getClient(): string;
		isOffline(): boolean;
		getFormFactor(): number;
		isPreview: boolean;

		formFactor: FormFactor;
		userAgent: UserAgent;
		languageCode: string;
		isRtl: boolean;
		locale: string;
		orgSettings: OrgSettings;
		dateFormattingInfo: DateFormattingInfo;
		numberFormattingInfo: NumberFormattingInfo;
		userTimeZoneUtcOffsetMinutes: number;
		getUserTimeZoneUtcOffset(d: Date): number;
		allocatedWidth: number;
		allocatedHeight: number;   // NOTE: This gets added only for data-set controls and will be null for field level controls.
		trackContainerResize(value: boolean | number[]): void;
		isRTL: boolean;
		isHighContrast: boolean;
		setFullscreen(value: boolean): void;

		/**
		 * Internal web client API
		 * This is used to adjust the data area hight of the grid control
		 */
		adjustDataAreaHeight(controlName: string, currentHeight: number, rowHeight: number, nonDataHeight: number): number;
	}

	interface Theme {
		// Keep the variabile names lower case, they are deserialized from the theming bag dictionary
		normalfontfamily: string;
		normalfontcolor: string;
		normalfontsize: string;
		solidborderstyle: string;
		noneborderstyle: string;
		colors: ThemeColors;
		textbox: ThemeTextBox;
		spacings: ThemeSpacings;
		fontfamilies: ThemeFontFamilies;
		fontsizes: ThemeFontSizes;
		breakpoints: ThemeBreakpoints;
		measures: ThemeMeasures;
		lookup: ThemeLookup;
		borders: ThemeBorders;
		shadowes: ThemeShadows;
		// >>>> this is added for backward compatibility with old UnifiedClient
		// to pass CIT tests >>>>>>>>
		textboxlinethickness: string;
		textboxspacing: string;
		textboxverticalpadding: string;
		textboxcontainerspacing: string;
		textboxfontweight: string;
		textboxcontentfontweight: string;
		textboxlineheight: string;
		textboxrightmargin: string;
		textboxredcolor: string;
		textboxbluecolor: string;
		textboxlabelcolor: string;
		textboxfontsize: string;
		textboxfonticonsize: string;
		textboxlinecolor: string;
		textboxerrorfontsize: string;
		//<<<<<<<<<<<<<<<<<<<<<<<<<<
		disableUiTransitions(): void;
		rightAlignEdit(): void;
		inlineLayout(val: boolean): void;
		getEntityColor(entityLogicalName: string): string;
	}

	interface ThemeLookup {
		tagpadding: string;
		tagmargin: string;
		tagbackgroundcolor: string;
	}

	interface ThemeBorders {
		border01: string;
		border02: string;
		border03: string;
	}

	interface ThemeShadows {
		shadow01: string;
	}

	interface ThemeMeasures {
		measure025: string;
		measure050: string;
		measure075: string;
		measure100: string;
		measure125: string;
		measure150: string;
		measure175: string;
		measure200: string;
		measure225: string;
		measure250: string;
		measure300: string;
		measure350: string;
		measure400: string;
		measure450: string;
		measure500: string;
		measure550: string;
		measure600: string;
	}

	interface ThemeBreakpoints {
		dimensionxs: string;
		dimensions: string;
		dimensionm: string;
		dimensionl: string;
		dimensionxl: string;
	}

	interface ThemeFontSizes {
		xsfontsize: string;
		sfontsize: string;
		bfontsize: string;
		mfontsize: string;
		lfontsize: string;
		xlfontsize: string;
		font225: string;
		font200: string;
		font175: string;
		font150: string;
		font125: string;
		font115: string;
		font100: string;
		font085: string;
		font075: string;
	}

	interface ThemeFontFamilies {
		semilight: string;
		semibold: string;
		regular: string;
		bold: string;
	}

	interface ThemeSpacings {
		xshorizontal: string;
		shorizontal: string;
		bhorizontal: string;
		mhorizontal: string;
		lhorizontal: string;
		xlhorizontal: string;
		xxlhorizontal: string;
		xsvertical: string;
		svertical: string;
		bvertical: string;
		mvertical: string;
		lvertical: string;
		xlvertical: string;
		xxlvertical: string;
	}

	interface ThemeColor {
		text?: string;
		fill?: string;
	}

	interface ThemeControlColor extends ThemeColor {
		stroke?: string;
	}

	interface ThemeAccentThemeColor {
		/**
		* Accent1
		*/
		accent1?: ThemeColor;
		/**
		* Accent2
		*/
		accent2?: ThemeColor;
		/**
		* Accent3
		*/
		accent3?: ThemeColor;
	}

	interface ThemeMainThemeColor {
		/**
		* MaincColor1
		*/
		maincolor1?: ThemeColor;
		/**
		* MaincColor2
		*/
		maincolor2?: ThemeColor;
		/**
		* MaincColor3
		*/
		maincolor3?: ThemeColor;
	}

	interface ThemeStatusColor {
		alert?: ThemeColor;
		priority1?: ThemeColor;
		priority2?: ThemeColor;
		priority3?: ThemeColor;
		positive1?: ThemeColor;
		positive2?: ThemeColor;
	}

	interface ThemeBaseColorSetStatic {
		[key: string]: string;
	}

	interface ThemeBaseColor {
		/**
		 * Color definition red
		 */
		red?: ThemeBaseColorSetStatic[];

		/**
		 * Color definition orange
		 */
		orange?: ThemeBaseColorSetStatic[];

		/**
		 * Color definition yellow
		 */
		yellow?: ThemeBaseColorSetStatic[];

		/**
		 * Color definition green
		 */
		green?: ThemeBaseColorSetStatic[];

		/**
		 * Color definition blue
		 */
		blue?: ThemeBaseColorSetStatic[];

		/**
		 * Color definition teal
		 */
		teal?: ThemeBaseColorSetStatic[];

		/**
		 * Color definition purple
		 */
		purple?: ThemeBaseColorSetStatic[];

		/**
		 * Color definition Clay
		 */
		clay?: ThemeBaseColorSetStatic[];

		/**
		 * Color definition Pink
		 */
		pink?: ThemeBaseColorSetStatic[];

		/**
		 * Color definition Grey
		 */
		grey?: ThemeBaseColorSetStatic[];

		/**
		 * Color definition Violet
		 */
		violet?: ThemeBaseColorSetStatic[];

		/**
		 * Color definition White
		 */
		white?: string;

		/**
		 * Color definition Black
		 */
		black?: string;

		/**
		 * Color Transparent
		 */
		transparent?: ThemeTransparentColor;

		/**
		 * Color definition Black
		 */
		calculatecontrast?: Function;
	}

	interface ThemeTransparentColor {
		/**
		* Color
		*/
		color?: string;

		/**
		* Opacity
		*/
		opacity?: string,
	}

	interface ThemeLinkColor {
		/**
		* Default link color
		*/
		normal?: ThemeColor;

		/**
		* Hover color
		*/
		hover?: ThemeColor;

		/**
		* Visited link color
		*/
		visited?: ThemeColor;

		/**
		* Visited link color
		*/
		pressed?: ThemeColor;

		/**
		* Disabled link color
		*/
		disabled?: ThemeColor;
	}

	interface ThemeSiteMapColors {
		/**
		* Color of bar underneath site map area item
		*/
		areaItemborder?: string;
		/**
		* Site Map color
		*/
		default?: string;
		/**
		* Site Map Group Text color
		*/
		grouptext?: string;
		/**
		* SiteMap's AreaBar Color
		*/
		areabar?: string;
		/**
		* SiteMap AreaBar item text color
		*/
		areabaritemtext?: string;
		/**
		* SiteMap AreaBar item icon Color
		*/
		areabaritemicon?: string;
		/**
		* SiteMap's App Launcher Bar
		*/
		applauncherbar?: string;
		/**
		* SiteMap's AppLauncherBar's border
		*/
		applauncherborder?: string;
		/**
		* Color of the text in AppLauncher Bar
		*/
		applaunchertext?: string;
		/**
		* Colors for the Entity Offline Status Icon
		*/
		entityofflinestatusicon?: ThemeEntityOfflineStatusIconColors;
		/**
		* Navigation Bar Color
		*/
		dwaffle?: ThemeColor;
		/**
		* Navigation Bar Color
		*/
		navigationbar?: ThemeColor;
		/**
		* Navigation Bar Color
		*/
		navigationitem?: ThemeColor;
		/**
		* Navigation Bar Color
		*/
		navigationtitle?: ThemeColor;
		/**
		* NavigationShelf
		*/
		navigationshelf?: ThemeControlColor;
		/**
		* Color of NavButton in AppBar
		*/
		navbarappbutton?: ThemeColor;
		/**
		* Color of an area item's icon
		*/
		navbarareaicon?: ThemeColor;
	}

	interface ThemeEntityOfflineStatusIconColors {
		/**
		* Color for the disabled icon
		*/
		disabled?: string;
		/**
		* Color for the enabled icon
		*/
		enabled?: string;
	}

	interface ThemeColors {
		//TODO Task #545273 Delete from here
		whitebackground: string;
		defaulttheming: string;
		navbarshelf: string;
		header: string;
		globallink: string;
		selectedlinkeffect: string;
		selectedlinkeffectcolor: string;
		hoverlinkeffect: string;
		processcontrol: string;
		defaultentity: string;
		defaultcustomentity: string;
		controlshade: string;
		controlborder: string;
		status: ThemeStatusColors;
		base: ThemeBaseColors;
		links: ThemeLinkColors;
		grays: ThemeGrayColors;
		//To here
		control: ThemeControlColor;
		pageheader: ThemeColor;
		pagepanel: ThemeColor;
		defaultsurface: ThemeColor;
		customentity: ThemeColor;
		entity: ThemeColor;
		title: ThemeColor;
		statuscolor: ThemeStatusColor;
		sitemap: ThemeSiteMapColors;
		basecolor: ThemeBaseColor;
		linkcolor: ThemeLinkColor;
		accent?: ThemeAccentThemeColor;
		maintheme?: ThemeMainThemeColor;
	}

	interface ThemeGrayColors {
		gray01: string;
		gray02: string;
		gray03: string;
		gray04: string;
		gray05: string;
		gray06: string;
		gray07: string;
		gray08: string;
		gray09: string;
	}

	interface ThemeLinkColors {
		default: string;
		visited: string;
		disabled: string;
	}

	interface ThemeBaseColors {
		white: string;
		black: string;
		red: string;
		orange: string;
		yellow: string;
		green: string;
		blue: string;
		teal: string;
		purple: string;
	}

	interface ThemeStatusColors {
		neutral: string;
		error: string;
		warning: string;
		success: string;
		info: string;
	}

	interface ThemeTextBox {
		fonticonsize: string;
		fontweight: number;
		contentfontweight: number;
		fontsize: string;
		errorfontsize: string;
		spacing: string;
		containerspacing: string;
		rightmargin: string;
		lineheight: string;
		linethickness: string;
		horizontalpadding: string;
		verticalpadding: string;
		maxlength: number;
		labelcolor: string;
		contentcolor: string;
		linecolor: string;
		hoverboxcolor: string;
		backgroundcolor: string;
		errorbackgroundcolor: string;
		redcolor: string;
		bluecolor: string;
		restmodecolor: string;
	}

	interface UserAgent {
		isWin: boolean;
		isWinPhone10: boolean;
		isMobilePhone: boolean;
		isAndroid: boolean;
		// Gets a value indicating whether the running android version is latest(4.4 or higher version)
		isAndroidModern: boolean;
		isIos: boolean;
		isBrowserIE: boolean;
		isBrowserChrome: boolean;
		isBrowserFirefox: boolean;
	}

	interface OrgSettings {
		fiscalYearStartDate: Date;
		fiscalPeriodFormat: number;
		fiscalPeriodType: number;
		fiscalYearFormatYear: number;
		fiscalYearFormatPrefix: number;
		fiscalYearFormatSuffix: number;
		fiscalYearDisplayCode: number;
		fiscalPeriodConnector: string;
		showWeekNumber: boolean;
	}

	// Example values seen in a default configuration given in comments to right
	interface DateFormattingInfo {
		AMDesignator: string; // "AM"
		AbbreviatedDayNames: string[]; // { "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" }
		AbbreviatedMonthGenitiveNames: string[]; // { "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "" }
		AbbreviatedMonthNames: string[]; // { "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "" }
		CalendarWeekRule: number; // 0
		DateSeparator: string; // "/"
		DayNames: string[]; // { "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" }
		FirstDayOfWeek: DayOfWeek;
		FullDateTimePattern: string; // "dddd, MMMM d, yyyy h:mm:ss tt"
		LongDatePattern: string; // "dddd, MMMM d, yyyy"
		LongTimePattern: string; // "h:mm:ss tt"
		MonthDayPattern: string; // "MMMM dd"
		MonthGenitiveNames: string[];  // { "January", "February", "March", ...  "December", "" }
		MonthNames: string[]; // { "January", "February", "March", ...  "December", "" }
		PMDesignator: string; // "PM"
		ShortDatePattern: string; // "M/d/yyyy"
		ShortTimePattern: string; // "h:mm tt"
		ShortestDayNames: string[]; // { "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" }
		SortableDateTimePattern: string; // "yyyy'-'MM'-'dd'T'HH':'mm':'ss"
		TimeSeparator: string; // ":"
		UniversalSortableDateTimePattern: string; // "yyyy'-'MM'-'dd HH':'mm':'ss'Z'"
		YearMonthPattern: string; // "MMMM yyyy"
	}

	// Example values seen in a default configuration given in comments to right
	interface NumberFormattingInfo {
		CurrencyDecimalDigits: number; // 2
		CurrencyDecimalSeparator: string; // "."
		CurrencyGroupSeparator: string; // ","
		CurrencyGroupSizes: number[]; // { 3 }
		CurrencyNegativePattern: number; // 0
		CurrencyPositivePattern: number; // 0
		CurrencySymbol: string; // "$"
		NANSymbol: string; // "NaN"
		NativeDigits: string[]; // { "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"}
		NegativeInfinitySymbol: string; // "-Infinity"
		NegativeSign: string; // "-"
		NumberDecimalDigits: number; // 2
		NumberDecimalSeparator: string; // "."
		NumberGroupSeparator: string; // ","
		NumberGroupSizes: number[]; // { 3 }
		PerMilleSymbol: string; // "‰"
		PercentDecimalDigits: number; // 2
		PercentDecimalSeparator: string; // "."
		PercentGroupSeparator: string; // ","
		PercentGroupSizes: number[]; // { 3 }
		PercentNegativePattern: number; // 0
		PercentPositivePattern: number; // 0
		PercentSymbol: string; // "%"
		PositiveInfinitySymbol: string; // "Infinity"
		PositiveSign: string; // "+"
	}

	interface ContextInfo {
		entityId: string;
		entityTypeName: string;
	}

	interface Guid {
		toString(): string;
		guid?: string;
	}

	interface OptionSetValue {
		Label: string;
		Value: number;
		Color: string;
	}

	interface EntityReference {
		Id: Guid;
		Name: string;
		LogicalName: string;
	}

	interface EntityRecord {
		fields: Dictionary;
	}

	interface EntityCollection {
		add: (record: EntityRecord) => void;
		remove: (record: EntityRecord) => void;
		removeAt: (index: number) => void;
		getObjectData: () => Dictionary;
	}

	interface WebResourceParameter {
		ControlId: string;
		Title: string;
		Url: string;
		ShowLabel: string;
		Label: string;
		Visible: boolean;
		PageType: string;
		WebResourceType?: number;
		DeviceType?: string;
		ControlParameters: WebResourceControlAttributes;
	}

	interface WebResourceControlAttributes {
		security?: string;
		scrolling?: string;
		border?: string;
		altText?: string;
		sizeType?: string;
		horizontalAlignment?: string;
		verticalAlignment?: string;
		width?: string;
		height?: string;
		showOnMobileClient?: string;
		showOnPhoneClient?: string;
		passParameters?: string;
		data?: string;
	}

	interface SearchRecord {
		/**
		 * Get the record ID of this record.
		 */
		getRecordId(): string;

		/**
		 * Get the attributes of this record.
		 */
		getAttributes(): string[];
	}

	interface IKbSearchResultAction {
		Id: number;
		ActionExecutionId: string;
		Name: string;
		TitleResourceName: string;
		TooltipResourceName: string;
		Title(): string;
		Tooltip(): string;
	}

	interface INotifyHandlersThatEventOccurredParameter {
		eventName: string;
		fieldName: string;
		pageId: string;
	}

	interface ISearchWidgetLanguage {
		name: string;
		localeId: string;
		languageLocaleId: string;
	}

	interface IKbSearchParameter {
		searchText: string,
		stateCode: string;
		useInflection: boolean;
		removeDuplicates: boolean;
		languageLocaleId: string;
		sortBy: string;
		isDescending: boolean;
		showRatingUsing: string;
		currentPageNumber: number;
		numberOfResults: number;
		notifyHandlersThatEventOccurredParameter: INotifyHandlersThatEventOccurredParameter
	}

	interface ISearchWidgetDescriptor {
		numberOfResults?: number;
		articleStatusFilter?: string;
		showArticleStatusFilter?: boolean;
		showLanguageFilter?: boolean;
		languageFilter?: string;
		isAutoSuggestionsEnabled: boolean;
		autoSuggestionSource: string;
		autoSuggestionsFieldToSearch: string;
		enableRating: string;
		showRatingUsing: string;
		selectDefaultLanguage: string;
		selectPrimaryCustomer: string;
	}

	interface SearchWidgetParameter {
		pageId: string;
		controlId: string;
		contextToken: any;
		showLabel?: boolean;
		label?: string;
		isOnPremises: boolean;
		error: boolean;
		errorMessage: string;
		loading: boolean;
		recordIds: string[];
		sortedRecordIds: string[];
		records: IKbSearchRecord[];
		keyPhrasesString: string;
		totalCountString: string;
		isKnowledgeManagementEnabled: boolean;
		isTextAnalyticsDisabled: boolean;
		entityReference: EntityReference,
		activeLanguages: ISearchWidgetLanguage[];
		associatedArticles: string[];
		kbSearchResultActions: IKbSearchResultAction[];
		searchWidgetActionResult: ISearchWidgetAction;
		descriptors: ISearchWidgetDescriptor;

		executeKbSearch(contextToken: any, searchParameter: IKbSearchParameter): void;
		executeRetrieveKeyPhrasesForKnowledgeSearch(contextToken: any, id: string, entityType: string): void;
		executeRetrieveFieldFromParentRecord(contextToken: any, autoSuggestiondFieldToSearch: string): void;
		executeSearchWidgetAction(contextToken: any, searchWidgetAction: ISearchWidgetAction): void;
		executeSearchWidgetInitialization(contextToken: any, pageId: string, controlId: string): void;
		executeNotifyHandlersThatEventOccurred(notifyHandlersThatEventOccurredParameter: INotifyHandlersThatEventOccurredParameter): void;
		executeUpdateCurrentSearchText(contextToken: any, searchText: string): void;
		executeIncrementKnowledgeArticleViewCount(contextToken: any, entityReference: any, viewDate: any, location: number, count: number): void;
	}

	interface ISearchWidgetActionPayload {
		entityReference?: EntityReference;
		articleId?: string;
		selectPrimaryCustomer?: string;
		relationshipName?: string;
		email?: Mscrm.Dictionary;
		copyLink?: string;
	}

	interface ISearchWidgetAction {
		action: IKbSearchResultAction;
		payload: ISearchWidgetActionPayload;
	}

	interface SearchWidgetControlAttributes {
		FilterResults?: boolean;
		AllowChangingFiltersOnUI?: boolean;
		ShowLanguageFilter?: boolean;
		ShowDepartmentFilter?: boolean;
		EnabledAutoSuggestions?: boolean;
		SearchForAutoSuggestionsUsing?: string;
		AutoSuggestionSource?: number;
		EnableRating?: boolean;
		ShowRatingUsing?: string;
		NumberOfResults?: number;
		ShowContextualActions?: string;
		ActionList?: string;
		SelectPrimaryCustomer?: string;
		ReferencePanelSearchWidgetIconUrl?: string;
		SelectDefaultLanguage?: string;
	}

	interface BaseAttributes {
		DisplayName: string;
		LogicalName: string;
		RequiredLevel: RequiredLevel;
		IsSecured: boolean;
		Type: string;
		SourceType: number;
	}

	interface BaseNumberAttributes extends BaseAttributes {
		MinValue: number;
		MaxValue: number;
		ImeMode: ImeMode;
		lastUpdatedField: string;
		lastUpdatedValue: Date;
		rollupStateField: string;
		rollupStateValue: number;
		recalculate: () => void;
		rollupValid: boolean;
		calculatedFieldValid: boolean;
	}

	interface BaseStringAttributes extends BaseAttributes {
		MaxLength: number;
		ImeMode: ImeMode;
	}

	interface DecimalNumberAttributes extends BaseNumberAttributes {
		Precision: number;
	}

	interface WholeNumberAttributes extends BaseNumberAttributes {
		Format: string;
		LanguageByCode?: Dictionary; // A Dictionary when format is type "language", null otherwise
		TimeZoneByCode?: Dictionary; // A Dictionary when format is type "timezone", null otherwise
	}

	interface DateTimeAttributes extends BaseAttributes {
		behavior: string;
		format: string;
		imeMode: ImeMode;
		lastUpdatedField: string;
		lastUpdatedValue: Date;
		rollupStateField: string;
		rollupStateValue: number;
		recalculate: () => void;
		rollupValid: boolean;
		calculatedFieldValid: boolean;
	}

	interface LookupAttributes extends BaseAttributes {
		targets: string[];
	}

	interface SingleLineAttributes extends BaseStringAttributes {
		Format: string;
	}

	interface OptionSetAttributes extends BaseAttributes {
		Options: OptionSetValue[];
		DefaultValue: number;
	}

	interface TwoOptionAttributes extends BaseAttributes {
		Options: OptionSetValue[];
		DefaultValue: boolean;
	}

	interface RollupControlAttributes extends BaseAttributes {
		recalculate(): void;
		lastUpdatedValue: Date;
	}

	/**
	 * Interface for control notification
	 */
	interface BusinessRuleNotification {
		actions?: ActionCollection[];
		messages: string[];
		notificationLevel?: string;
		uniqueId?: string;
	}

	/**
		 * Structure of Action Collection
		 */
	interface ActionCollection {
		/* Collection of actions for control */
		actions?: (() => void)[];

		/* Notification messages for control */
		message: string;
	}

	/*
	 * Interface for error and recommendation notifications for the control
	 */
	interface ControlNotifications {
		error: BusinessRuleNotification;
		recommendation: BusinessRuleNotification;
	}

	interface BaseProperty {
		type: string;
		raw: any;
		attributes?: BaseAttributes;
		formatted?: string;
		error: boolean;
		errorMessage: string;
		notifications?: ControlNotifications;
		security?: SecurityValues;
	}

	interface SecurityValues {
		editable: boolean;
		readable: boolean;
		secured: boolean;
	}

	interface NumberProperty extends BaseProperty {
		raw: number;
		attributes?: BaseNumberAttributes;
	}

	interface DecimalNumberProperty extends NumberProperty {
		attributes?: DecimalNumberAttributes;
	}

	interface WholeNumberProperty extends NumberProperty {
		attributes?: WholeNumberAttributes;
	}

	interface DateTimeProperty extends BaseProperty {
		raw: Date;
		attributes?: DateTimeAttributes;
	}

	interface CommonLookupProperty extends BaseProperty {
		attributes?: LookupAttributes;
		lookupDataSet: LookupDataSet<DataSetRecord>;
	}

	interface LookupProperty extends CommonLookupProperty {
		raw: EntityReference;
	}

	interface PartyListProperty extends CommonLookupProperty {
		raw: EntityCollection;
	}

	interface StringProperty extends BaseProperty {
		raw: string;
		attributes?: BaseStringAttributes;
	}

	interface SingleLineProperty extends StringProperty {
		attributes?: SingleLineAttributes;
	}

	interface EnumProperty<Type> {
		raw: Type;
		type: string;
	}

	interface OptionSetProperty extends BaseProperty {
		raw: number;
		attributes?: OptionSetAttributes;
	}

	interface MultiSelectOptionSetProperty extends BaseProperty {
		raw: number[];
		attributes?: OptionSetAttributes;
	}

	interface TwoOptionsProperty extends BaseProperty {
		raw: boolean;
		attributes?: TwoOptionAttributes;
	}

	/**
	 * The structure of a property parameter as it would be passed to a Timer control
	 */
	interface TimerProperty extends BaseProperty {
		timerParameters: ITimerParameter;
	}

	module DataTypes {
		var names: {
			entityReference: string;
		};

		/**
		 * The base interface for all data types.
		 */
		interface BaseType {
			/**
			 * Name of the data type for this value
			 */
			dataType: string;
		}

		interface PrimitiveValue<T> extends BaseType {
			/**
			 * The raw value
			 */
			value: T;
		}

		/**
		 * A base interface for data types that can be converted into formatted strings
		 */
		interface FormattedPrimitiveValue<T> extends PrimitiveValue<T> {
			/**
			 * The raw value formatted according to the user's formatting preferences.
			 */
			formattedValue: string;
		}

		interface OptionSet extends BaseType {
			label: string;
			value: number;
		}

		interface EntityReference extends BaseType {
			id: string;
			logicalName: string;
		}
	}

	/**
		 * Metadata about a column in a data set
		 */
	interface DataSetColumn {
		/**
		 * Name of the column, unique in this data set
		 */
		name: string;

		/**
		 * Localized display name for the column, can be used in UIs
		 */
		displayName: string;

		/**
		 * The data type of this column's values.
		 */
		dataType: string;

		/**
		* The alias of this column.
		*/
		alias: string;

		/**
		 * The configured size factor for this column relative to other columns in the data set.
		 * By default columns have a size factor of 1.0, but the system customizer or user can
		 * make some columns larger (e.g., 1.5) or smaller (e.g., 0.75).
		 */
		visualSizeFactor: number;

		/**
		* Identifies if the column is hidden or not.
		*/
		isHidden: boolean;

		/**
		* The column order for the layout.
		*/
		order: number;

		/**
		* The attributes of the columns.
		*/
		attributes: any;

		/**
		* The validator of the columns.
		*/
		validator: DataSetColumnValidator;

		/**
		* Identifies if sorting is unavailable for the column.
		*/
		disableSorting: boolean;

		/**
		 * The column is primary attrribute
		 */
		isPrimary?: boolean;

		/**
		 * The column web resource name.
		 */
		imageProviderWebresource?: string;

		/**
		 * The column image provider function name
		 */
		imageProviderFunctionName?: string;
	}

	interface DataSetColumnValidator {
		/**
		 * Validate a changing value and return the result of the validating process as a <see cref="DataSetColumnValidatorResult"/> object.
		 *
		 * @param value The value to validate.
		 * @param isValueChanging True if the value is still being changed, for instance when doing interactive validations; otherwise, false.
		 * @param isDisabled True if the current field is disabled (not editable).
		 * @returns A ValidatorResult object.
		 */
		validate(value: any, isValueChanging: boolean, isDisabled: boolean): ValidatorResult;
	}

	interface ValidatorResult {
		/**
		* Error Message of the CustomControl Validator result of a Dataset Column.
		*/
		errorMessage: string;
		isValid: boolean;
	}

	/**
	 * Paging state for a data set
	 */
	interface DataSetPaging {
		/**
		 * Total number of results on the server for the currently applied query.
		 */
		totalResultCount: number;

		/**
		 * The number of results per page.
		 */
		pageSize: number;

		/**
		 * Sets the number of results to return per page on the next data refresh.
		 */
		setPageSize(pageSize: number): void;

		/**
		 * Whether the result set can be paged forwards.
		 */
		hasNextPage: boolean;

		/**
		 * Whether the result set can be paged backwards.
		 */
		hasPreviousPage: boolean;

		/**
		 * Request the next page of results to be loaded.
		 */
		loadNextPage(): void;

		/**
		 * Request the previous page of results to be loaded.
		 */
		loadPreviousPage(): void;

		/**
		 * Reload the results from the server, and reset to page 1.
		 */
		reset(): void;
	}

	/**
	 * An expression used to represent a filter condition.
	 */
	interface ConditionExpression {

		/**
		* The name of the data-set column to apply the filter on.
		*/
		attributeName: string;

		/**
		* The operator used to evaluate the condition.
		*/
		conditionOperator: ConditionOperator;

		/**
		* The raw value used to evaluate the condition.
		*/
		value: string | Array<string>;

		/**
		* Entity Name
		*/
		entityName?: string;
	}

	/**
		* An expression used to represent a filter.
		*/
	interface FilterExpression {

		/**
			* The set of conditions associated with this filter.
			*/
		conditions: ConditionExpression[];

		/**
			* The operator used to combine conditions in this filter.
			*/
		filterOperator: FilterOperator;

		/**
			* Any child filters that should be evaluated after evaluating this filter.
			*/
		filters?: FilterExpression[];
	}

	/**
	 * Commanding status of an action
	 */
	interface DataSetCommanding {

		/**
		 * Get command data
		 */
		getRecordCommands(recordId: string): IDeferred<Array<DataSetCommandingObject>, Mscrm.ErrorStatus>;
	}

	interface DataSetCommandingObject {

		/**
		 * label
		 */
		label: string;

		/**
		 * command id
		 */
		commandId: string;

		/**
		 * Execute
		 */
		execute(): void;

		/**
		 * Can Execute
		 */
		canExecute: boolean;

	}

	/**
		* Filter state for a data set.
		*/
	interface DataSetFiltering {

		/**
			* Returns the top-most filter associated with the data-set
			*/
		getFilter(): FilterExpression;

		/**
			* Sets the top-most filter associated with the data-set
			*/
		setFilter(expression: FilterExpression): void;

		/**
			* Clears the filter associated with the data-set.
			*/
		clearFilter(): void;

		/**
		* Mapping between dataset columns and entity columns.
		*/
		aliasMap: Dictionary;

	}

	/**
	 * An object that stores filter information and enables filter operations on a custom control lookup dataset
	 */
	interface LookupDataSetFiltering<TRecord> extends DataSetFiltering {
		/**
		 * Flag to indicate if user can clear the filter at runtime
		 */
		canDisableRelationshipFilter(): boolean;

		/**
		 * Clear any relationship constraint configured the lookup dataset if the user is allowed to disable such filter.
		 */
		disableRelationshipFilter(): void;

		/**
		 * Apply any relationship constraint configured the lookup dataset
		 * @param parentRecord The parent record that the lookup dataset will show records related to
		 */
		enableRelationshipFilter(parentRecord: TRecord): void;

		/**
		* The lookup configuration data
		*/
		lookupConfiguration: LookupConfiguration;
	}

	/**
	* An object that store the lookup configuration data
	*/
	interface LookupConfiguration {
		/**
		* The target view id configured for the look up
		*/
		targetViewId: string;

		/**
		* Flag to indicate if filter has been disabled
		*/
		allowFilterOff: boolean;

		/**
		* The context filter configured for the lookup
		*/
		contextFilter: string;

		/**
		* The name of the relationship filter configured for the lookup
		*/
		targetFilterRelationshipName: string;

		/**
		* The relationship dependent attribute name configured for the lookup
		*/

		dependentAttributeName: string;

		/**
		* The relationship dependent target entity configured for the lookup
		*/
		targetEntityName: string;

		/**
		* The dependent entity name of the lookup
		*/
		dependentEntityName: string;

		/**
		* The extra condition configured for the lookup
		*/
		extraCondition: string;
	}

	/**
	 * Current sort status of a data set column
	 */
	interface DataSetColumnSortStatus {
		/**
		 * The name of the column
		 */
		name: string;

		/**
		 * The current sort direction for the column.
		 */
		sortDirection: ColumnSortDirection;
	}

	/**
	 * Base type for data set result values that supports value retrival by column name.
	 * Derived classes can provide named shortcuts to particular column values.
	 */
	interface DataSetRecord {
		/**
		 * Get the record ID of this record.
		 */
		getRecordId(): string;

		/**
		*Returns a record level error message
		*/
		getErrorMessage(): string;

		/**
		* Returns true if record has un-saved values otherwise false
		*/
		isDirty(): boolean;

		/**
		* Returns true if all fields of the record are valid otherwise false
		*/
		isRecordValid(): boolean;

		/**
		* Returns a field level error message
		*/
		getNotification(columnName: string): string;

		/**
		 * Get the currently persisted value in a column of this record.
		 */
		getValue(columnName: string): DataTypes.BaseType;

		/**
		 * Set a new value to a column in this record. This new value will only be persisted
		 * after the custom control raises the notifyOutputChanged event. Both getValue and
		 * getFormattedValue methods will return the persisted values. Such methods will only
		 * return this new value after the persist operation completes successfully.
		 *
		 * Returns: A deferred promise that will resolve to true if the field is editable and
		 * the new value was successfully added to the staging values. The promise will be
		 * rejected if the field is read-only or it was not possible to retrieve its editability.
		 */
		setValue(columnName: string, newValue: any): Mscrm.IDeferred<boolean, Mscrm.ErrorStatus>;

		/**
		 * Get the persisted formatted value associated with the given column name for this data set record.
		 */
		getFormattedValue(columnName: string): any;

		/**
		 * Determines if the specified field is editable.
		 * Returns: A deferred object that when resolved will resolve to true if the field is editable; otherwise false.
		 */
		isEditable(columnName: string): IDeferred<boolean, any>;

		/**
		 * Determines if the specified field is secured.
		 * Returns: A deferred object that when resolved will resolve to true if the field is secured; otherwise false.
		 */
		isSecured(columnName: string): IDeferred<boolean, any>;

		/**
		 * Determines if the specified field is readable.
		 * Returns: A deferred object that when resolved will resolve to true if the field is readable; otherwise false.
		 */
		isReadable(columnName: string): IDeferred<boolean, any>;

		/**
		 * Returns: true if the field is valid; otherwise false.
		 */
		isValid(columnName: string): boolean;

		/**
		 * Determines if the specified field is required.
		 * Returns: A deferred object that when resolved will return a Mscrm.RequiredLevel enum with the required level of the field.
		 */
		getFieldRequiredLevel(columnName: string): IDeferred<Mscrm.RequiredLevel, any>;

		/**
		 * Get the additional attributes for the column
		 * Returns: A deferred object that will return the additional attributes object.
		 */
		getAttributes(column: DataSetColumn): IDeferred<boolean, Dictionary>;

		/**
		 * Get the validator for the column
		 * Returns: A deferred object that will return validator object.
		 */
		getValidator(column: DataSetColumn): IDeferred<DataSetColumnValidator, any>;

		/**
		 * Get the named version of the backing entity reference
		 */
		getNamedReference(): Mscrm.EntityReference;

		/**
		 * Get the activity party record of entity reference
		 */
		getActivityPartyRecord(): Mscrm.EntityRecord;

		/**
		* Runs validators for all columns of the main entity.
		* Internal API.
		*/
		validateAllColumns(): Mscrm.IDeferred<boolean, Mscrm.ErrorStatus>;

		/**
		 * Save record.
		 */
		save(): Mscrm.Promise<any>;
	}

	/**
	 * Component parameter that represents a data set
	 */
	interface DataSet<TRecord extends DataSetRecord> {
		/**
		 * Whether the infrastructure is performing work on this dataset.
		 * This will be true when the dataset is being loaded initially, refreshed, new pages loaded, etc.
		 */
		working: boolean;

		/**
		 * True if the dataset has encountered an error during its last data retrieval.  Otherwise, false
		 */
		hasError: boolean;

		/**
		 * True if data is still loading; false if loading is done.
		 */
		loading?: boolean;

		/**
		 * The error message associated with the last encountered error, if applicable.
		 */
		errorMessage: string;

		/**
		 * The set of columns available in this dataset.
		 */
		columns: DataSetColumn[];

		/**
		 * IDs of the records in the dataset, in order
		 */
		sortedRecordIds: string[];

		/**
		 * Map of IDs to the full record object
		 */
		records: {
			[id: string]: TRecord;
		}

		/**
		 * Get DataSet target entity type name
		 */
		getTargetEntityType(): string;

		/**
		* Pagination status and actions.
		*/
		paging: DataSetPaging;

		/**
		* Filter state and actions.
		*/
		filtering: DataSetFiltering;

		/**
		 * The column sorting for the current query.
		 */
		sorting: DataSetColumnSortStatus[];

		/**
		 * Commanding Status and actions
		 */
		commanding: DataSetCommanding;

		/**
		 * Refreshes the data set base on filters and sorting and Target Entity
		 */
		refresh(target?: string): void;

		/**
		 * Set the ids of the selected records
		 * This method is only supported in Web Client
		 */
		setSelectedRecordIds(id: string[]): void;

		/**
		 * Retrieves the selected dataset record
		 */
		getSelectedRecordIds(): string[];

		/**
		 * Clear selected record ids list
		 */
		clearSelectedRecordIds(): void;

		/**
		 * Retrieves the viewId associated with the dataset
		 */
		getViewId(): string;

		/**
		 * Gets the additional attributes for all the columns in this dataset object
		 * Returns: A deferred object that will return true if the operation was successful. Otherwise, false
		 */
		generateAdditionalAttributes(): IDeferred<boolean, any>;

		/**
		 * Gets the validators for all the columns in this dataset object
		 * Returns: A deferred object that will return true if the operation was successful. Otherwise, false
		 */
		generateValidators(): IDeferred<boolean, any>;

		/**
		 * Add a listener to dataset record change events triggered after a successful or failed record update.
		 */
		add_OnDataSetRecordChange(callback: (updateResult: DataSetUpdateResult) => void): void;

		/**
		 * Remove a listener to dataset record change events triggered after a successful or failed record update.
		 */
		remove_OnDataSetRecordChange(callback: (updateResult: DataSetUpdateResult) => void): void;

		/**
		 * Add a listener to dataset change events triggered after a refresh, filter or pagination action.
		 */
		addOnDataSetUpdated(callback: () => void): void;

		/**
		 * Remove a listener to dataset change events triggered after a refresh, filter or pagination action.
		 */
		removeOnDataSetUpdated(callback: () => void): void;

		/**
		 * Retrieves dataset record level commands
		 */
		retrieveRecordCommand(recordIds: string[], specificCommands: string[]): IDeferred<Array<DataSetCommandingObject>, Mscrm.ErrorStatus>;
	}

	/**
	 * Legacy Base type for data set result values that supports value retrival by column name.
	 * Derived classes can provide named shortcuts to particular column values.
	 */
	interface LegacyDataSetRecord {
		/**
		 * Get the record ID of this record.
		 */
		getRecordId(): string;

		/**
		 *Returns a record level error message
		 */
		getErrorMessage(): string;

		/**
		 * Returns true if record has un-saved values otherwise false
		 */
		isDirty(): boolean;

		/**
		 * Returns true if all fields of the record are valid otherwise false
		 */
		isRecordValid(): boolean;

		/**
		 * Returns a field level error message
		 */
		getNotification(columnName: string): string;

		/**
		 * Get the currently persisted value in a column of this record.
		 */
		getValue(columnName: string): DataTypes.BaseType;

		/**
		 * Set a new value to a column in this record. This new value will only be persisted
		 * after the custom control raises the notifyOutputChanged event. Both getValue and
		 * getFormattedValue methods will return the persisted values. Such methods will only
		 * return this new value after the persist operation completes successfully.
		 *
		 * Returns: A deferred promise that will resolve to true if the field is editable and
		 * the new value was successfully added to the staging values. The promise will be
		 * rejected if the field is read-only or it was not possible to retrieve its editability.
		 */
		setValue(columnName: string, newValue: any): Mscrm.IDeferred<boolean, Mscrm.ErrorStatus>;

		/**
		 * Get the persisted formatted value associated with the given column name for this data set record.
		 */
		getFormattedValue(columnName: string): any;

		/**
		 * Determines if the specified field is editable.
		 * Returns: A deferred object that when resolved will resolve to true if the field is editable; otherwise false.
		 */
		isEditable(columnName: string): IDeferred<boolean, any>;

		/**
		 * Determines if the specified field is secured.
		 * Returns: A deferred object that when resolved will resolve to true if the field is secured; otherwise false.
		 */
		isSecured(columnName: string): IDeferred<boolean, any>;

		/**
		 * Determines if the specified field is readable.
		 * Returns: A deferred object that when resolved will resolve to true if the field is readable; otherwise false.
		 */
		isReadable(columnName: string): IDeferred<boolean, any>;

		/**
		 * Returns: true if the field is valid; otherwise false.
		 */
		isValid(columnName: string): boolean;

		/**
		 * Get the primary entity logical name associated with this record.
		 */
		getPrimaryEntityLogicalName(): string;

		/**
		 * Determines if the specified field is required.
		 * Returns: A deferred object that when resolved will return a Mscrm.RequiredLevel enum with the required level of the field.
		 */
		getFieldRequiredLevel(columnName: string): IDeferred<Mscrm.RequiredLevel, any>;

		/**
		 * Get the additional attributes for the column
		 * Returns: A deferred object that will return the additional attributes object.
		 */
		getAttributes(column: DataSetColumn): IDeferred<boolean, Dictionary>;

		/**
		 * Get the validator for the column
		 * Returns: A deferred object that will return validator object.
		 */
		getValidator(column: DataSetColumn): IDeferred<DataSetColumnValidator, any>;

		/**
		 * Get the named version of the backing entity reference
		 */
		getNamedReference(): Mscrm.EntityReference;

		/**
		 * Get the activity party record of entity reference
		 */
		getActivityPartyRecord(): Mscrm.EntityRecord;

		/**
		 * Runs validators for all columns of the main entity.
		 * Internal API.
		 */
		validateAllColumns(): Mscrm.IDeferred<boolean, Mscrm.ErrorStatus>;
	}

	/**
	 * Legacy Component parameter that represents a data set
	 */
	interface LegacyDataSet<TRecord extends LegacyDataSetRecord> {
		/**
		 * Whether the infrastructure is performing work on this dataset.
		 * This will be true when the dataset is being loaded initially, refreshed, new pages loaded, etc.
		 */
		working: boolean;

		/**
		 * True if the dataset has encountered an error during its last data retrieval.  Otherwise, false
		 */
		hasError: boolean;

		/**
		 * True if data is still loading; false if loading is done.
		 */
		loading?: boolean;

		/**
		 * The error message associated with the last encountered error, if applicable.
		 */
		errorMessage: string;

		/**
		 * The set of columns available in this dataset.
		 */
		columns: DataSetColumn[];

		/**
		 * IDs of the records in the dataset, in order
		 */
		sortedRecordIds: string[];

		/**
		 * Map of IDs to the full record object
		 */
		records: {
			[id: string]: TRecord;
		}

		/**
		 * Target Entity Type name
		 */
		targetEntityType?: string;

		/**
		 * View id for data set
		 */
		viewId?: string;

		/**
		 * Visualization id for data set
		 */
		visualizationId?: string;

		/**
		 * The filter expresion string used to identify the selected chart series
		 */
		filterExpression?: string;

		/**
		* Pagination status and actions.
		*/
		paging: DataSetPaging;

		/**
		* Filter state and actions.
		*/
		filtering: DataSetFiltering;

		/**
		 * The column sorting for the current query.
		 */
		sorting: DataSetColumnSortStatus[];

		/**
		 * Commanding Status and actions
		 */
		commanding: DataSetCommanding;

		/**
		 * IDs of user-selected values in the data set.
		 */
		selectedRecordIds: string[];

		/**
		 * Refreshes the data set base on filters and sorting and Target Entity
		 */
		refresh(target?: string): void;

		/**
		 * Get DataSet target entity type name
		 */
		getTargetEntityType(): string;

		/**
		 * Set the id of the selected record and show a command bar with commands specific to the record you have selected based on the flag
		 */
		setSelectedRecordId: (id: string, openCommandBar?: boolean) => void;

		/**
		 * Set the ids of the selected records
		 * This method is only supported in Web Client
		 */
		setSelectedRecords(id: string[]): void;

		/**
		 * Clears the selected record and closes the app bar
		 */
		clearSelectedRecord(): void;

		/**
		 * Retrieves the selected dataset record
		 */
		getSelectedRecord(): LegacyDataSetRecord;

		/**
		 * Retrieves the viewId associated with the dataset
		 */
		getViewId(): string;

		/**
		 * Gets the additional attributes for all the columns in this dataset object
		 * Returns: A deferred object that will return true if the operation was successful. Otherwise, false
		 */
		generateAdditionalAttributes(): IDeferred<boolean, any>;

		/**
		 * Gets the validators for all the columns in this dataset object
		 * Returns: A deferred object that will return true if the operation was successful. Otherwise, false
		 */
		generateValidators(): IDeferred<boolean, any>;

		/**
		 * Add a listener to dataset record change events triggered after a successful or failed record update.
		 */
		add_OnDataSetRecordChange(callback: (updateResult: DataSetUpdateResult) => void): void;

		/**
		 * Remove a listener to dataset record change events triggered after a successful or failed record update.
		 */
		remove_OnDataSetRecordChange(callback: (updateResult: DataSetUpdateResult) => void): void;

		/**
		 *  Gets the lookup dataset given a column name
		 */
		getLookupDataSet(columnName: string): IDeferred<LegacyLookupDataSet<LegacyDataSetRecord>, any>;

		/**
		 * Add a listener to dataset change events triggered after a refresh, filter or pagination action.
		 */
		addOnDataSetUpdated(callback: () => void): void;

		/**
		 * Remove a listener to dataset change events triggered after a refresh, filter or pagination action.
		 */
		removeOnDataSetUpdated(callback: () => void): void;

		/**
		 * Retrieves dataset record level commands
		 */
		retrieveRecordCommand(recordIds: string[], specificCommands: string[]): IDeferred<Array<DataSetCommandingObject>, Mscrm.ErrorStatus>;


		/**
		 * Open dataset record
		 */
		openDatasetItem?(entityReference: Mscrm.EntityReference): void;

		/**
		 * Adds column to the columnset
		 */
		addColumn?(name: string, entityAlias?: string): void;

		/**
		 * Retrieve image url from column web resource
		 * @param columnName 
		 * @param recordId 
		 */
		getCellImageUrl?: (columnName: string, recordId: string) => Promise<string>;
	}

	/**
	 * Specialized dataset object that represents lookups for custom controls
	 */
	interface LookupDataSet<TRecord extends DataSetRecord> extends DataSet<TRecord> {
		filtering: LookupDataSetFiltering<TRecord>;
	}

	/**
	 * Specialized dataset object that represents lookups for custom controls
	 */
	interface LegacyLookupDataSet<TRecord extends LegacyDataSetRecord> extends LegacyDataSet<TRecord> {
		filtering: LookupDataSetFiltering<TRecord>;
	}

	/**
	 * Specialized dataset object that represents charts for custom controls
	 */
	interface ChartDataSet<TRecord extends DataSetRecord> extends DataSet<TRecord> {
		/**
		 * Get the visualization id for the chart
		 */
		getVisualizationId(): string;

		/**
		 * Set the visualization id for the chart
		 */
		setVisualizationId(visualizationId: string): void;

		/**
		 * Get the chart configuration object that represents a specific chart
		 */
		getChartConfigObject(): ChartQueryModel;

		/**
		 * Set the chart configuration object that represents a specific chart
		 */
		setChartConfigObject(config: ChartQueryModel): void;

		/**
		 * Get the filter expresion string used to identify the selected chart series
		 */
		getChartFilterExpression(): string;

		/**
		 * Get the webresource information for a webresource based chart
		 */
		getWebResourceState(): IWebResourceState;

		/**
		 * Get the chart selector option
		 */
		getChartSelectorOption(): IChartSelectorOption[];
	}

	/**
	 * A representation of the results of a custom control dataset update.
	 */
	interface DataSetUpdateResult {
		resultType: DataSetUpdateResultType;

		/**
		 * The record ID that this object is referencing.
		 */
		recordId: string;

		/**
		 * Deprecated.
		 */
		isSuccessful: boolean;

		isRecordSavedSuccessfully: boolean;

		affectedColumns: string[];

		/**
		 * Deprecated.
		 */
		errorStatus: Mscrm.ErrorStatus;

		/**
		 * Deprecated.
		 * Error messages associated with the last update action, in a map of the form dataset
		 * field name -> error. Dataset level update errors are sent to the recordId field of the map.
		 */
		fieldErrorMessages: {
			[fieldName: string]: string;
		}
	}

	const enum DataSetUpdateResultType {
		Unknown = 0,
		SetValue = 1,
		SetRequiredLevel = 2,
		SetDisabled = 3,
		IsValidChange = 4,
		RecordUpdate = 10
	}

	/**
	* Chart View Selector Options
	*/
	interface IChartSelectorOption {
		categoryId: string;
		id: string;
		value: string;
		text: string;
		defaultValue: string;
	}

	/**
	 * Chart Query Model for handling CRM Charts Data Processing
	 */
	interface ChartQueryModel {
		Title: ChartTitle;
		Legend: Legend;
		XAxes: XAxis[];
		YAxes: YAxis[];
		SeriesList: Series[];
		SubTitle: string;
		Colors: string[];
		DisplayMode: ChartDisplayMode;
		ErrorInformation: ChartErrorInformation;
		EnableDrilldown: boolean;
	}

	/**
	 * The Chart Title DataContract class.
	 */
	interface ChartTitle {
		Text: string;
		HorizontalAlignment: string;
		VerticalAlignment: string;
	}

	/**
	 * The Chart Legend DataContract class.
	 */
	interface Legend {
		Enabled: boolean;
		Floating: boolean;
		VerticalAlignment: string;
		HorizontalAlignment: string;
	}

	/**
	 * The Chart X-Axis DataContract class.
	 */
	interface XAxis {
		Values: string[];
		Title: string;
	}

	/**
	 * The Chart Y-Axis DataContract class.
	 */
	interface YAxis {
		Title: string;
	}

	/**
	 * The Chart Series DataContract class.
	 */
	interface Series {
		DataPoints: DataPoint[];
		DataLabels: DataLabels;
		ChartType: string;
		YAxisNumber: number;
		XAxisNumber: number;
		Title: string;
		Color: string;
		BorderColor: string;
		BorderWidth: number;
		CustomProperties: string;
	}

	/**
	 * The DataContract class for a point on a chart series.
	 */
	interface DataPoint {
		Value: number;
		FormattedValue: any;
		Aggregators: DataPointAggregatorBase[];
	}

	/**
	 * The Aggregator class used for generating filter expression basing on aggregated FieldName and Value.
	 */
	interface DataPointAggregatorBase {
		FieldName: string;
		EntityName: string;
	}

	/**
	 * The Aggregator class used for generating filter expression basing on aggregated FieldName and Value.
	 */
	interface DataPointAggregator extends DataPointAggregatorBase {
		Value: string;
		DisplayName: string;
	}

	/**
	 * The DateTime range Aggregator class used for generating filter expression basing on aggregated FieldName, MinDate and MaxDate.
	*/
	interface DataPointDateTimeRangeAggregator extends DataPointAggregatorBase {
		MinDate: Date;
		MaxDate: Date;
	}

	/**
	 * The Fiscal Period Aggregator class used for generating filter expression basing on aggregated FieldName, FiscalType, Year and Period.
	*/
	interface DataPointFiscalPeriodAggregator extends DataPointAggregatorBase {
		FiscalType: string;
		Year: number;
		Period: number;
	}

	/**
	 * The Fiscal Year Aggregator class used for generating filter expression basing on aggregated FieldName, FiscalType and Year.
	*/
	interface DataPointFiscalYearAggregator extends DataPointAggregatorBase {
		FiscalType: string;
		Year: number;
	}

	/**
	 * Contains error information to be shown on charts
	 */
	interface ChartErrorInformation {

		/**
		 * Gets or sets the type of the error.
		 */
		get_ErrorType(): string;
		set_ErrorType(value: string): void;

		/**
		 * Gets or sets the error description.
		 */
		get_ErrorDescription(): string;
		set_ErrorDescription(value: string): void;
	}

	/**
	 * The DataContract class for a DataLabels on a chart series.
	 */
	interface DataLabels {
		Enabled: boolean;
		X: number;
		Y: number;
		Align: string;
		VerticalAlign: string;
		LabelFormatter: Func0<string>;
	}

	/**
	 * State for a webresource
	 */
	interface IWebResourceState {
		name?: string;
		displayName?: string;
		id?: string;
		type?: string;
		isEnabledForMobileClient?: boolean;
	}

	/**
	 * Function delegate with 0 arguments
	 * @returns result of function
	 */
	interface Func0<TResult> {
		(): TResult;
	}

	/**
	 * Enumeration of display modes used in the Chart control.
	 */
	const enum ChartDisplayMode {
		/**
		 * Standard layout type
		 */
		Normal = 0,

		/**
		 * Error layout type
		 */
		Error = 1,
	}

	/**
	 * Form custom control parameter
	 */
	interface FormParameter {
		/**
		 * Form descriptor object
		 */
		formDescriptor: IFormDescriptor;

		/**
		 * Name of entity edited by form
		 */
		entityName: string;

		/**
		 * RecordId of entity edited by form
		 */
		recordId: string;

		/*
		 * Label for associated entity
		 */
		associatedEntityLabel: string;

		/**
		 * Name of associated entity record
		 */
		associatedEntityRecordName: string;

		/**
		 * URL for the entity image
		 */
		entityImageUrl?: string;

		/**
		 * Get component name of control described by FormParameter
		 * @param controlId Control Id
		 */
		getComponentNameByControlId(controlId: string): string;

		/**
		 * Create component props of control described on form represented by this FormParameter
		 * @param controlId Id of control
		 */
		getComponentPropsByControlId(controlId: string, useDefaultControlConfiguration?: boolean): any

		/**
		 * Retrieves the data for the specified entity based on the form data requirements
		 * @param entityReference record
		 * @param formId form id
		 * @param processControlDataRequest the retrieve process control data request
		 * @param additionalColumns the additional columns to retrieve that are not a part of the form xml
		 */
		retrieveRecordDataForForm(entityReference: any, formId: string, processControlDataRequest?: any, additionalColumns?: string[]): any;
	}

	/**
	 * Descriptor for a Form
	 */
	interface IFormDescriptor {
		/**
		 * The attributes for a form descriptor
		 */
		Attributes?: string[];

		/**
		 * Whether the form is initialized or not
		 */
		initialized?: number;

		/**
		 *  The form id
		 */
		Id?: Guid;

		/**
		 *  The sections
		 */
		Sections?: {
			[sectionName: string]: SectionDescriptor
		};

		/**
		 *  The cell label
		 */
		CellLabel?: any;

		/**
		 *  The Controls on the form
		 */
		Controls?: {
			[controlName: string]: ControlDescriptor;
		};

		/**
		 *  The name of the form
		 */
		Name?: string;

		/**
		 *  The BusinessLogic
		 */
		BusinessLogic?: string;

		/**
		 *  The Subgridviewids
		 */
		SubGridViewIds?: Guid[];
	}

	interface SectionDescriptor {
		Id?: Guid;

		Name?: string;

		ShowLabel?: boolean;

		Visible?: boolean;

		Rows?: RowDescriptor[];

		Label?: string;
	}

	interface RowDescriptor {
		Visible?: boolean;

		Height?: string;

		Cells?: CellDescriptor[];
	}

	interface CellDescriptor {
		Id?: string;

		ColSpan: number;

		RowSpan: number;

		ShowLabel: boolean;

		Visible: boolean;

		ControlName: string;
	}

	interface ControlDescriptor {
		Id?: string;

		Label?: string;

		Name?: string;

		ShowLabel?: string;

		Visible?: boolean;

		ClassId?: Guid;

		Disabled?: boolean;

		LabelId?: string;

		DataFieldName?: string;

		Parameters?: { [parameterName: string]: any };
	}

	export interface IAttributeDescriptor {
		Initialized: number;
		LogicalName: string;
		Id?: Guid;
		Type: string;
		EntityLogicalName?: string;
		DisplayName?: string;
		IsGlobalFilterEnabled?: boolean;
		IsSecured?: boolean;
		IsValidForCreate?: boolean;
		IsValidForRead?: boolean;
		IsValidForUpdate?: boolean;
		MaxLength?: number;
		MinValue?: number;
		MaxValue?: number;
		Precision?: number;
		Format?: string;
		DefaultValue?: string | boolean | number;
		IsBaseCurrency?: boolean;
		Targets?: string[];
		AttributeOf?: string;
		HasChanged?: boolean;
		OptionSetId?: string;
		OptionSetName?: string;
		OptionSetType?: number;
		OptionSet?: IOptionDescriptor[];
		CreatePermissionDictionary?: any;
		IsPartyListControl?: boolean;
		LookupStyle?: string;
		LookupTypes?: number[];
		SubjectLookupData?: any;
		RollupAssociatedDateFieldName?: string;
		RollupAssociatedStateFieldName?: string;
		RollupInvalid?: boolean;
		SourceTypeMask?: number;
		IsFormParameter?: boolean;
	}

	export interface IOptionDescriptor {
		Color?: string;
		Label: string;
		Value: number;
		DefaultStatus?: number;
		State?: number;
		TransitionData?: number[];
	}

	/**
	 * Interface for attributes, attributeLogicalName:IAttributeDescriptor pair.
	 */
	export interface IAttributeDescriptorByName {
		[attributeLogicalName: string]: IAttributeDescriptor;
	}

	export interface IFormDescriptorWithAttributes {
		formDescriptor: IFormDescriptor;
		attributeDescriptors: IAttributeDescriptorByName;
	}

	/**
	* StageValidationResult data for stages
	*/
	interface StageValidationResult {

		isValid?: boolean;

		errorSteps?: string[];

		emptySteps?: string[];
	}

	/**
	 * Business process flow bag
	 */
	interface BusinessProcessFlowParameter {
		ProcessWrapper: IBusinessProcessFlowWrapper;

		Type: string;
	}

	/**
	 * Business Process Flow Wrapper class
	 */
	class IBusinessProcessFlowWrapper {
		/**
		 * Indentifier of the BPF
		 */
		id: Guid;
		/**
		 * Name of the BPF
		 */
		name: string;
		/**
		 * Indentifier of the BPF instance
		 */
		instanceId: Guid;
		/**
		 * Name of the BPF instance
		 */
		instanceName: string;
		/**
		 * State of BPF
		 */
		processState: BusinessProcessFlowProcessState;
		/**
		 * State of the BPF instance
		 */
		state: BusinessProcessFlowInstanceState;
		/**
		 * Status of the BPF instance
		 */
		status: BusinessProcessFlowInstanceStatus;
		/**
		 * Selected stage identifier of the BPF
		 */
		selectedStageId: Guid;
		/**
		 * Active stage indentifier of the BPF
		 */
		activeStageId: Guid;
		/**
		 * Active path of the BPF
		 */
		activePath: Guid[];
		/**
		 * Stages of the BPF
		 */
		stages: IBusinessProcessFlowWrapperStage[];
		/**
		 * State of the display
		 */
		displayState: string;
		/**
		 * Current entity for the BPF
		 */
		currentEntity: Mscrm.EntityReference;
		/**
		 * Delegates from the Process Manager
		 */
		delegates: IBusinessProcessFlowWrapperDelegates;

		/**
		 * Indicates if process control is visible
		 */
		isVisible: boolean;

		/**
		 * whether the form header is collapsed
		 */
		isFormHeaderCollapsed: boolean;

		/**
		 * Collection of Action Logs
		 */
		actionLogs: IActionLogCollection;
	}

	/**
	 * interface definition for array dictionary of actionlogs
	 */
	interface IActionLogCollection {
		[actionStepId: string]: IActionLog;
	}

	/**
	 * interface definition for actionlog
	 */
	interface IActionLog {
		actionLogId: Guid;
		status?: StepProgress;
		modifiedOn?: string;
		message?: string;
		actionStepId?: Guid;
		processDefinitionid?: Guid;
		processInstanceid?: Guid;
	}

	const enum StepProgress {
		/**
		 * ActionStep No Progress
		 */
		None = 0,

		/**
		 * ActionStep In Progress
		 */
		Processing = 1,

		/**
		 * ActionStep Completed Progress
		 */
		Completed = 2,

		/**
		 * ActionStep Failure Progress
		 */
		Failure = 3,

		/**
		 * ActionStep Invalid Progress
		 */
		Invalid = 4,
	}

	const enum BusinessProcessFlowProcessState {
		/**
		* BPF Process Draft State
		*/
		Draft = 0,

		/**
		* BPF Process Activated State
		*/
		Activated = 1
	}

	const enum BusinessProcessFlowInstanceState {
		/**
		* BPF Active State
		*/
		Active = 0,

		/**
		* BPF Inactive State
		*/
		Inactive = 1
	}


	const enum BusinessProcessFlowInstanceStatus {
		/**
		 * BPF Active Status
		 */
		Active = 1,

		/**
		 * BPF Finished Status
		 */
		Finished = 2,

		/**
		 * BPF Aborted Status
		 */
		Aborted = 3
	}

	/**
	 * Interface for a stage in the BusinessProcessFlowWrapper
	 */
	class IBusinessProcessFlowWrapperStage {
		/**
		 * Identifier of the stage
		 */
		id: Guid;
		/**
		 * Name of the stage
		 */
		name: string;
		/**
		 * EntityReference to the entity related to the stage
		 */
		relatedEntityReference: Mscrm.EntityReference;
		/**
		 * referencing attribute name
		 */
		referencingAttributeName: string;
		/**
		 * Entity name of the stage
		 */
		entityName: string;
		/**
		 * Status of the stage
		 */
		status: BusinessProcessFlowStageStatus;
		/**
		 * Steps of the stage
		 */
		steps: IBusinessProcessFlowWrapperStep[];
	}

	const enum BusinessProcessFlowStageStatus {
		/**
		 * BPF Stage Active Status
		 */
		Active = 0,

		/**
		 * BPF Stage Inactive Status
		 */
		Inactive = 1,

		/**
		 * BPF Stage Completed Status
		 */
		Completed = 2
	}

	/**
	 * Interface for a step in the BusinessProcessFlowWrapper
	 */
	class IBusinessProcessFlowWrapperStep {
		/**
		* Identifier of the step
		*/
		stepId: Guid;
		/**
		 * Name of the step
		 */
		name: string;
		/**
		 * Type of the step
		 */
		stepType: string;
		/**
		 * Is the step required by the BPF
		 */
		isRequired: boolean;
		/**
		 * Attribute name of the step
		 */
		attributeName: string;
		/**
		 * Attribute type of the step. Also known as a manifest type.
		 */
		attributeType: string;
		/**
		 * the view Id in case of lookup attribute type
		 */
		viewId: string;
	}
	/**
	 * Delegates for the Process Manager
	 */
	class IBusinessProcessFlowWrapperDelegates {
		/**
		 * complete the process
		 */
		completeProcess(): Promise<void>;
		/**
		 * Attempts to move the process to the next stage
		 */
		moveNext: () => Promise<void>;
		/**
		 * Attempts to move the process to the previous stage
		 */
		movePrevious: () => Promise<void>;
		/**
		 * Attempts to set the active stage to another stage
		 */
		setActiveStage: (stageId: Guid) => void;
		/**
		 * Execute the action through PBL script 
		 */
		triggerActionStepClick: (controlId: String) => void;
		/**
		 * Attempts to set the selected stage to another stage
		 */
		setSelectedStage: (stageId: Guid) => void;
		/**
		 * Sets the display state
		 */
		setDisplayState: (displayState: string) => void;
		/**
		 * Gets the forward navigation entities promise
		 * TODO: Remove once ProcessManager is complete. VSO #179552
		 */
		getForwardNavigationEntities: (currentEntityId: string, referencedEntityLogicalName: string, referencingEntityLogicalName: string, referencingEntityAttributeName: string) => any;
		/**
		 * Navigates to next entity in a business process flow and returns the promise
		 * TODO: Remove once ProcessManager is complete. VSO #179552
		 */
		navigateToNextEntity: (currentEntity: Mscrm.EntityReference, nextEntity: Mscrm.EntityReference, processId: Guid, processInstanceId: Guid) => any;
		/**
		* Validate the required fields for navigation and returns stagevalidationresult
		*/
		validateRequiredFieldsForNavigation: () => StageValidationResult;
		/**
		 * get the kpi for active stage active for
		 */
		getActiveStageActiveFor: () => number;
		/**
		 * get the kpi for BPF Instance active for
		 */
		getBpfInstanceActiveFor: () => number;
		/**
		 * get the kpi for BPF Instance completed on
		 */
		getBpfInstanceCompletedIn: () => number;
	}

	const enum PropertyUsage {
		Bound = 0,
		Input = 1
	}

	interface ColumnSpecification {
		Alias: string; // Property-set Name (in the manifest)
		Name: string; // Value to be bound to
		DataType: string; // Data type of the value
		VisualSizeFactor?: number; // The configured size factor for this column relative to other columns in the data set
		DisplayName?: string; //Label
	}

	/**
	 * Represents a deferred value.
	 * TData is the argument type for success callbacks.
	 * TError is the return type for failure callbacks.
	 */
	interface IDeferred<TData, TError> {
		/**
		 * Add a handler to be called when the deferred object is resolved or rejected. If the
		 * deferred object is already resolved, the handler is still invoked.
		 * alwaysCallback: The callback to invoke.
		 * Returns: the current deferred object.
		 */
		always(alwaysCallback: (value: any) => void): IDeferred<TData, TError>;

		/**
		 * Add a handler to be called when the deferred object is resolved. If the
		 * deferred object is already resolved, the handler is still invoked.
		 * doneCallback: The callback to invoke.
		 * Returns: the current deferred object.
		 */
		done(doneCallback: (value: TData) => void): IDeferred<TData, TError>;

		/**
		 * Add a handler to be called when the deferred object is rejected. If the
		 * deferred object is already resolved, the handler is still invoked.
		 * failCallback: The callback to invoke.
		 * Returns: the current deferred object.
		 */
		fail(failCallback: (value: TError) => void): IDeferred<TData, TError>;

		/**
		 * Determines whether the deferred object has been rejected.
		 * Returns: true if it has been rejected; false otherwise.
		 */
		isRejected(): boolean;

		/**
		 * Determines whether the deferred object has been resolved.
		 * Returns: true if it has been resolved; false otherwise.
		 */
		isResolved(): boolean;

		/**
		 * Add handlers to be called when the deferred object is resolved or rejected.
		 * If the object has already been resolved or rejected, the handlers are still invoked.
		 * doneCallback: The callback to invoke when the object is resolved.
		 * failCallback: The callback to invoke when the object is rejected.
		 * Returns: The current deferred object.
		 */
		then(doneCallback: (value: TData) => void, failCallback: (value: TError) => void): IDeferred<TData, TError>;
	}

	interface ChildEventListener {
		eventname: string;
		eventhandler: void;
	}

	const enum ColumnSortDirection {
		None = -1,
		Ascending = 0,
		Descending = 1
	}

	const enum ConditionOperator {
		None = -1,
		Equal = 0,
		NotEqual = 1,
		GreaterThan = 2,
		LessThan = 3,
		GreaterEqual = 4,
		LessEqual = 5,
		Like = 6,
		In = 8,
		Null = 12,
		Yesterday = 14,
		Today = 15,
		Tomorrow = 16,
		Last7Days = 17,
		Next7Days = 18,
		LastWeek = 19,
		ThisWeek = 20,
		LastMonth = 22,
		ThisMonth = 23,
		On = 25,
		OnOrBefore = 26,
		OnOrAfter = 27,
		LastYear = 28,
		ThisYear = 29,
		Contains = 49,
		InFiscalPeriodAndYear = 70,
		Above = 75,
		Under = 76,
		NotUnder = 77,
		AboveOrEqual = 78,
		UnderOrEqual = 79,
		ContainValues = 80
	}

	const enum FilterOperator {
		And = 0,
		Or = 1
	}

	/**
	* Enum to list out all keycodes for html
	*/
	const enum KeyCode {
		Backspace = 8,
		Tab = 9,
		Enter = 13,
		Shift = 16,
		Ctrl = 17,
		Alt = 18,
		PauseBreak = 19,
		Capslock = 20,
		Escape = 27,
		Space = 32,
		PageUp = 33,
		PageDown = 34,
		End = 35,
		Home = 36,
		LeftArrow = 37,
		UpArrow = 38,
		RightArrow = 39,
		DownArrow = 40,
		Insert = 45,
		Delete = 46,
		Num0 = 48,
		Num1 = 49,
		Num2 = 50,
		Num3 = 51,
		Num4 = 52,
		Num5 = 53,
		Num6 = 54,
		Num7 = 55,
		Num8 = 56,
		Num9 = 57,
		A = 65,
		B = 66,
		C = 67,
		D = 68,
		E = 69,
		F = 70,
		G = 71,
		H = 72,
		I = 73,
		J = 74,
		K = 75,
		L = 76,
		M = 77,
		N = 78,
		O = 79,
		P = 80,
		Q = 81,
		R = 82,
		S = 83,
		T = 84,
		U = 85,
		V = 86,
		W = 87,
		X = 88,
		Y = 89,
		Z = 90,
		LeftWindowKey = 91,
		RightWindowKey = 92,
		SelectKey = 93,
		NumPad0 = 96,
		NumPad1 = 97,
		NumPad2 = 98,
		NumPad3 = 99,
		NumPad4 = 100,
		NumPad5 = 101,
		NumPad6 = 102,
		NumPad7 = 103,
		NumPad8 = 104,
		NumPad9 = 105,
		Multiply = 106,
		Add = 107,
		Subtract = 109,
		DecimalPoint = 110,
		Divide = 111,
		F1 = 112,
		F2 = 113,
		F3 = 114,
		F4 = 115,
		F5 = 116,
		F6 = 117,
		F7 = 118,
		F8 = 119,
		F9 = 120,
		F10 = 121,
		F11 = 122,
		F12 = 123,
		NumLock = 144,
		ScrollLock = 145,
		SemiColon = 186,
		EqualSign = 187,
		Comma = 188,
		Dash = 189,
		Period = 190,
		ForwardSlash = 191,
		GraveAccent = 192,
		OpenBracket = 219,
		BackSlash = 220,
		CloseBraket = 221,
		SingleQuote = 222
	}

	/*
	 * Enum for icon positioning
	 */
	const enum IconPosition {
		None,
		Left,
		Top
	}

	const enum FormFactor {
		Unknown = 0,
		Tablet = 1,
		Phone = 2,
		Desktop = 3,
	}

	const enum ImeMode {
		Auto = 0,
		Inactive = 1,
		Active = 2,
		Disabled = 3,
	}

	const enum RequiredLevel {
		Unknown = -1,
		None = 0,
		SystemRequired = 1,
		ApplicationRequired = 2,
		Recommended = 3,
	}

	const enum DayOfWeek {
		Sunday = 0,
		Monday = 1,
		Tuesday = 2,
		Wednesday = 3,
		Thursday = 4,
		Friday = 5,
		Saturday = 6,
	}

	const enum DateTimeFieldBehavior {
		None = 0,
		UserLocal = 1,
		DateOnly = 2,
		TimeZoneIndependent = 3,
	}

	/**
	 * The error source, if known
	 */
	const enum ErrorSource {
		Unknown = 0,
		Authentication = 1,
		LocalStore = 2,
	}

	/**
	 * An error status that encapsulates the error message
	 */
	interface ErrorStatus {
		/**
		 * The error message.
		 */
		message: string;
		/**
		 * The error that preceded this error
		 */
		innerError: ErrorStatus;
		/**
		 * The source of this error, if known
		 */
		errorSource: ErrorSource;
	}

	/**
	 * Class passed to an async callback on success.
	 */
	interface SuccessResponse {
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
	 * Class representing a close
	 */
	interface CloseResponse {
		outputArguments: {};
	}

	/**
	 * Class representing a cancel
	 */
	interface CancelResponse {
	}

	/**
	 * Interface for a Lookup value.
	 */
	interface LookupValue {
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
	 * Interface for window options.
	 */
	interface DialogOptions {
		height: number;
		width: number;
	}

	/**
	 * Enumeration of window position
	 */
	const enum WindowPosition {
		center = 1,
		side = 2,
	}

	/**
	 * Interface for entity form options.
	 */
	interface EntityFormOptions {
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
		processInstanceId?: string;
		selectedStageId?: string;
		isCrossEntityNavigate?: boolean;
		position?: WindowPosition;
	}

	/**
	 * Represents the String parameters for Confirm Dialog.
	 */
	interface ConfirmDialogStrings {
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
	interface AlertDialogStrings {
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
	 * Generic parameters class that's a dictionary of strings.
	 */
	interface Parameters {
		[key: string]: string;
	}

	/**
	 * Interface for window options.
	 */
	interface WindowOptions {
		openInNewWindow: boolean;
		height?: number;
		width?: number;
	}

	/**
	* The interface for capture image settings.
	*/
	interface CaptureImageOptions {
		height: number;
		width: number;
		allowEdit: boolean;
		quality: number;
		preferFrontCamera: boolean;
	}

	/**
	 * The interface for picking file options.
	 */
	interface PickFileOptions {
		allowMultipleFiles?: boolean;
		maximumAllowedFileSize: number;
		accept?: string //| "audio/*" | "video/*" | "image/*";
	}

	/**
	 * Application event for reporting about something that happened to telemetry
	 */
	interface ApplicationEvent {
		eventName: string;
		eventParameters: EventParameter[];
	}

	/**
	 * Event parameter for reporting additional information to telemetry
	 */
	interface EventParameter {
		name: string;
		value: (string | number | Date | Guid);
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
		ObjectTypeCode: number;
		OwnershipType?: number; // Is actually EntityOwnershipType
		PrimaryIdAttribute?: string;
		PrimaryImageAttribute?: string;
		PrimaryNameAttribute?: string;
		Privileges?: CrmDescriptors.SecurityPrivilegeMetadata[];
		Attributes: Collection.ItemCollection<AttributeMetadata>;
	}

	interface AttributeMetadata {
		// TODO: Define the interface for attribute metadata
	}

	/**
	 * Options used when opening a lookup dialog.
	 */
	interface LookupOptions {
		/**
		 *	Whether the lookup allows more than one item to be selected.
		 */
		allowMultiSelect: boolean;

		/**
		 *	The default entity type.
		 */
		defaultEntityType: string;

		/**
		 *	The default view to use.
		 */
		defaultViewId: string;

		/**
		 *	The entity types to display.
		 */
		entityTypes: string[];

		/**
		 *	The views to be available in the view picker.  Only System views are supported (not user views).
		 */
		viewIds: string[];
	}

}

/**
 * Async module from Xrm containing a promise that takes 2 parameters
 */
declare module Async {
	/**
	 * Called when the operation is successful.
	 */
	interface SuccessCallbackDelegate<T> {
		(successParameter: T): void;
	}

	/**
	 * Called when the operation fails.
	 */
	interface ErrorCallbackDelegate<T> {
		(errorParameter: T): void;
	}

	/**
	 * Interface for Xrm.Page.data promises.
	 */
	interface XrmPromise<T1, T2> {
		/**
		 * A basic 'then' promise.
		 *
		 * @param   {SuccessCallbackDelegate}   successCallback   The success callback.
		 * @param   {ErrorCallbackDelegate}  errorCallback  The error callback.
		 */
		then(successCallback?: SuccessCallbackDelegate<T1>, errorCallback?: ErrorCallbackDelegate<T2>): WebApi.Promise<any>;
	}

}

/**
 * Collection module from Xrm describing its collection interfaces
 */
declare module Collection {
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
 * Objects related to interacting with the Web API.
 */
declare module WebApi {

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
	interface Entity {
		[key: string]: any;
	}

	const enum ODataStructuralProperty {
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
	interface ODataEnumValue {
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
	interface ODataParameterType {
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
	interface ODataContractMetadata {
		/**
		 * The name of the bound parameter. This should have a value of "undefined" if the OData function/action is undefined.
		 */
		boundParameter: string;

		/**
		 * The metadata for parameter types.
		 */
		parameterTypes: { [parameterName: string]: ODataParameterType; };

		/**
		*Name of the operation 
		*/
		operationName: string;

		/**
		 * The type of the operation.
		 */
		operationType?: Constants.ODataOperationType;
	}

	/**
	 * The interface that describes the OData contract (request and response).
	 */
	interface ODataContract {
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
		headers?: Constants.HeaderInit;
	}

	/**
	 * The interface that describes the Body.
	 */
	interface Body {
		bodyUsed: boolean;
		arrayBuffer(): Promise<ArrayBuffer>;
		blob(): Promise<Blob>;
		json(): Promise<any>;
		json<T>(): Promise<T>;
		text(): Promise<string>;
	}

	/**
	 * The interface that describes the Response.
	 */
	interface Response extends Body {
		body?: Constants.BodyInit;
		error(): Response;
		type: Constants.ResponseType;
		url: string;
		status: number;
		ok: boolean;
		statusText: string;
		headers: Headers;
	}

	interface Promise<T> {
		/**
		 * Attaches callbacks for the resolution and/or rejection of the Promise.
		 * @param onfulfilled The callback to execute when the Promise is resolved.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of which ever callback is executed.
		 */
		then<TResult>(onfulfilled?: (value: T) => TResult | PromiseLike<TResult>, onrejected?: (reason: any) => TResult | PromiseLike<TResult>): Promise<TResult>;
		then<TResult>(onfulfilled?: (value: T) => TResult | PromiseLike<TResult>, onrejected?: (reason: any) => void): Promise<TResult>;

		/**
		 * Attaches a callback for only the rejection of the Promise.
		 * @param onrejected The callback to execute when the Promise is rejected.
		 * @returns A Promise for the completion of the callback.
		 */
		catch(onrejected?: (reason: any) => T | PromiseLike<T>): Promise<T>;
		catch(onrejected?: (reason: any) => void): Promise<T>;
	}

	interface PromiseLike<T> {
		/**
		* Attaches callbacks for the resolution and/or rejection of the Promise.
		* @param onfulfilled The callback to execute when the Promise is resolved.
		* @param onrejected The callback to execute when the Promise is rejected.
		* @returns A Promise for the completion of which ever callback is executed.
		*/
		then<TResult>(onfulfilled?: (value: T) => TResult | PromiseLike<TResult>, onrejected?: (reason: any) => TResult | PromiseLike<TResult>): PromiseLike<TResult>;
		then<TResult>(onfulfilled?: (value: T) => TResult | PromiseLike<TResult>, onrejected?: (reason: any) => void): PromiseLike<TResult>;
	}

}

/**
 * Constants used by Client API
 */
declare module Constants {
	import Headers = WebApi.Headers;

	enum ODataOperationType {
		Action = 0,
		Function = 1,
		CRUD = 2,
	}

	type HeaderInit = Headers | Array<string>;
	type BodyInit = ArrayBuffer | ArrayBufferView | Blob | FormData | string;

	//ResponseType looks like this in ClientApi.d.ts: type ResponseType = "basic" | "cors" | "default" | "error" | "opaque" | "opaqueredirect";
	const enum ResponseType {
		"basic",
		"cors",
		"default",
		"error",
		"opaque",
		"opaqueredirect",
	}

}

declare module CrmDescriptors {

	const enum DateTimeFormat {
		DateOnly = 0,
		DateAndTime = 1,
	}

	const enum IntegerFormat {
		None = 0,
		Duration = 1,
		TimeZone = 2,
		Language = 3,
		Locale = 4,
	}

	const enum StringFormat {
		Email = 0,
		Text = 1,
		TextArea = 2,
		Url = 3,
		TickerSymbol = 4,
		PhoneticGuide = 5,
		VersionNumber = 6,
		Phone = 7,
	}

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

	interface SecurityPrivilegeMetadata extends CrmDescriptors.IExtensibleDataObject {
		CanBeBasic: boolean;
		CanBeDeep: boolean;
		CanBeGlobal: boolean;
		CanBeLocal: boolean;
		CanBeEntityReference: boolean;
		CanBeParentEntityReference: boolean;
		Name: string;
		PrivilegeId: string;
		PrivilegeType: CrmDescriptors.PrivilegeType;
	}

	interface ExtensionDataObject {
	}

	interface IExtensibleDataObject {
		ExtensionData: CrmDescriptors.ExtensionDataObject;
	}
}

/**
 * Xrm commands module declaration
 */

declare namespace XrmCore {
	export namespace Commands {
		export namespace Delete {
			export function deletePrimaryRecord(id: string, entityName: string): void;
		}

		export namespace Deactivate {
			export function deactivatePrimaryRecord(id: string, entityName: string): void;
		}

		export namespace ChangeState {
			export function onLoadSetState(): void;
		}
	}
}


interface Date {
	localeFormat(format: string): string;
}
