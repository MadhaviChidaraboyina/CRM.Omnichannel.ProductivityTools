export interface ArmResource<TProperties> {
	id: string;
	type: string;
	name: string;
	location?: string;
	kind?: string;
	tags?: Record<string, string>;
	properties: TProperties;
	//brandColor?: string;    //TODO: made this optional - there's some discrepancy in the various function signatures
}
export interface Badge {
	name: string;
	description: string;
}
export interface InfoMessage {
    /**
     * @member {boolean} dismissible - True if the info message can be dismissed.
     */
	dismissible: boolean;

    /**
     * @member {string} text - A string with the text to show in the info message.
     */
	text: string;
}
// TODO(tonytang): handle operation level icon properly
export interface ApiOperationProperties {
	annotation?: {
		status: string;
	};

	isNotification?: boolean;

	api: {
        /**
         * @member {string} [brandColor] - Present in both Flow and Logic Apps.
         */
		brandColor?: string;

        /**
         * @member {string} [description] - Present in Logic Apps only.
         */
		description?: string;

        /**
         * @member {string} displayName - Present in both Flow and Logic Apps.
         */
		displayName?: string;

        /**
         * @member {string} iconUri - Present in both Flow and Logic Apps.
         */
		iconUri: string;

        /**
         * @member {string} id - Present in both Flow and Logic Apps.
         */
		id: string;

        /**
         * @member {string} [location] - Present in Logic Apps only.
         */
		location?: string;

        /**
         * @member {string} [name] - Present in Logic Apps only.
         */
		name?: string;

        /**
         * @member {string} [tier] - Present in Flow only.
         */
		tier?: string;

        /**
         * @member {string} [type] - Present in Logic Apps only.
         */
		type?: string;
	};

    /**
     * @member {string} description - A string with help text to show as a tooltip.
     */
	description: string;

    /**
     * @member {EnvironmentBadge} environmentBadge
     */
	environmentBadge?: Badge;

    /**
     * @member {string} infoMessage
     */
	infoMessage?: InfoMessage;

    /**
     * @member {string} [operationType]
     */
	operationType?: string;

    /**
     * @member {string} [operationKind]
     */
	operationKind?: string;

    /**
     * @member {string} summary - A string with short text to show in the UI list item.
     */
	summary: string;

    /**
     * @member {string} [swaggerOperationId] - A string set to a Swagger operation ID to be used for on-demand triggers.
     */
	swaggerOperationId?: string;

    /**
     * @member {Swagger.ExternalDocumentation} swaggerExternalDocs - Field referencing an external resource for extended documentation
     */
	//swaggerExternalDocs?: Swagger.ExternalDocumentation;

    /**
     * @member {string} [trigger]
     * - Do not include if the operation is an action.
     * - Set to 'single' if the operation does not support debatching.
     * - Set to 'batch' if the operation supports debatching, aka splitOn.
     */
	trigger?: string;

    /**
     * @member {string} visibility
     */
	visibility: string;
}
export interface ConnectorProperty {
	capabilities: string[];
	connectionDisplayName?: string;
	displayName: string;
	environmentBadge?: Badge;
	environment: string;
	purpose: string;
	iconUri: string;
	runtimeUrls: string[];
	//connectionParameters?: Record<string, ConnectionParameter>;
	//connectionParameterSets?: ConnectionParameterSets;
	/* tslint:disable: no-any */
	swagger?: any;
	[property: string]: any;
	/* tslint:enable: no-any */
	wadlUrl?: string;
	brandColor?: string;
	termsOfUseUrl?: string;
	metadata?: {
		brandColor?: string;
		source?: string;
		connectionType?: string;
	};
	scopes?: {
		will?: string[];
		wont?: string[];
	};
	generalInformation?: {
		displayName?: string;
		iconUrl?: string;
		description?: string;
	};
	integrationServiceEnvironment?: {
		id: string;
	};
}

export interface ApiOperation extends ArmResource<ApiOperationProperties> {
}

//export type ConnectionOperation = ApiOperation | FunctionResource | Website | Workflow; -- ORIGINAL
export type ConnectionOperation = ApiOperation;// | FunctionResource | Website | Workflow; --OUR REDUCED

export interface BuiltInOperationIdsTypes {
	ADD_TO_TIME?: string;
	APIMANAGEMENT?: string;
	APPEND_TO_ARRAY_VARIABLE?: string;
	APPEND_TO_STRING_VARIABLE?: string;
	BATCH?: string;
	BUTTON?: string;
	COMPOSE?: string;
	CONVERT_TIME_ZONE?: string;
	CURRENT_TIME?: string;
	DECREMENT_VARIABLE?: string;
	DELAY?: string;
	DELAYUNTIL?: string;
	EVENT_GRID?: string;
	FLAT_FILE_DECODING?: string;
	FLAT_FILE_ENCODING?: string;
	FOREACH?: string;
	FUNCTION?: string;
	GEOFENCE_REQUEST?: string;
	GET_FUTURE_TIME?: string;
	GET_PAST_TIME?: string;
	HTTP_WEBHOOK?: string;
	HTTP_WITH_SWAGGER?: string;
	HTTP?: string;
	HTTPREQUESTTRIGGER?: string;
	IF?: string;
	INCREMENT_VARIABLE?: string;
	INITIALIZE_VARIABLE?: string;
	INTEGRATION_ACCOUNT_ARTIFACT_LOOKUP?: string;
	INTEGRATION_ACCOUNT_GET_SCHEMAS?: string;
	JOIN?: string;
	LIQUID_JSON_TO_JSON?: string;
	LIQUID_JSON_TO_TEXT?: string;
	LIQUID_XML_TO_JSON?: string;
	LIQUID_XML_TO_TEXT?: string;
	MANUALTRIGGER?: string;
	PARSE_JSON?: string;
	POWERAPPS_RESPONSE?: string;
	QUERY?: string;
	RECURRENCETRIGGER?: string;
	RESPONSE?: string;
	SCOPE?: string;
	SECURITY_CENTER_ALERT?: string;
	SELECT_APIMANAGEMENT_ACTION?: string;
	SELECT_APIMANAGEMENT_TRIGGER?: string;
	SELECT_APPSERVICE_ACTION?: string;
	SELECT_APPSERVICE_TRIGGER?: string;
	SELECT_FUNCTION_ACTION?: string;
	SELECT_BATCH_WORKFLOW_ACTION?: string;
	SELECT_MANUAL_WORKFLOW_ACTION?: string;
	SELECT?: string;
	SEND_TO_BATCH?: string;
	SET_VARIABLE?: string;
	SUBTRACT_FROM_TIME?: string;
	SWITCH_CASE?: string;
	SWITCH?: string;
	TABLE_CSV?: string;
	TABLE_HTML?: string;
	TERMINATE?: string;
	UNTIL?: string;
	WORKFLOW?: string;
	XML_VALIDATION?: string;
	XSLT_GET_CONTAINERS?: string;
	XSLT_GET_FUNCTIONS?: string;
	XSLT_GET_MAP?: string;
	XSLT_GET_MAPS?: string;
	XSLT_TRANSFORM?: string;
}

export const builtInOperationIds: BuiltInOperationIdsTypes = {
	ADD_TO_TIME: 'add_to_time',
	APIMANAGEMENT: 'apimanagement',
	APPEND_TO_ARRAY_VARIABLE: 'append_to_array_variable',
	APPEND_TO_STRING_VARIABLE: 'append_to_string_variable',
	BATCH: 'batch',
	BUTTON: 'button',
	COMPOSE: 'compose',
	CONVERT_TIME_ZONE: 'convert_time_zone',
	CURRENT_TIME: 'current_time',
	DECREMENT_VARIABLE: 'decrementvariable',
	DELAY: 'delay',
	DELAYUNTIL: 'delay_until',
	EVENT_GRID: 'event_grid',
	FLAT_FILE_DECODING: 'flat_file_decoding',
	FLAT_FILE_ENCODING: 'flat_file_encoding',
	FOREACH: 'foreach',
	FUNCTION: 'function',
	GEOFENCE_REQUEST: 'geofence_request',
	GET_FUTURE_TIME: 'get_future_time',
	GET_PAST_TIME: 'get_past_time',
	HTTP_WITH_SWAGGER: 'http_with_swagger',
	HTTP: 'http',
	HTTPREQUESTTRIGGER: 'request',
	HTTP_WEBHOOK: 'httpwebhook',
	IF: 'if',
	INCREMENT_VARIABLE: 'increment_variable',
	INITIALIZE_VARIABLE: 'initializevariable',
	INTEGRATION_ACCOUNT_ARTIFACT_LOOKUP: 'integration_account_artifact_lookup',
	INTEGRATION_ACCOUNT_GET_SCHEMAS: 'content_and_schema_operation_get_schemas',
	JOIN: 'join',
	LIQUID_JSON_TO_JSON: 'liquid_json_to_json',
	LIQUID_JSON_TO_TEXT: 'liquid_json_to_text',
	LIQUID_XML_TO_JSON: 'liquid_xml_to_json',
	LIQUID_XML_TO_TEXT: 'liquid_xml_to_text',
	MANUALTRIGGER: 'manual',
	PARSE_JSON: 'parsejson',
	POWERAPPS_RESPONSE: 'powerappsresponse',
	QUERY: 'query',
	RECURRENCETRIGGER: 'recurrence',
	RESPONSE: 'response',
	SCOPE: 'scope',
	SECURITY_CENTER_ALERT: 'securitycenteralert',
	SELECT: 'select',
	SEND_TO_BATCH: 'sendtobatch',
	SET_VARIABLE: 'setvariable',
	SUBTRACT_FROM_TIME: 'subtract_from_time',
	SWITCH_CASE: 'switchcase',
	SWITCH: 'switch',
	TABLE_CSV: 'table_csv',
	TABLE_HTML: 'table_html',
	TERMINATE: 'terminate',
	UNTIL: 'until',
	WORKFLOW: 'workflow',
	XML_VALIDATION: 'xml_validation',
	XSLT_GET_CONTAINERS: 'xslt_get_containers',
	XSLT_GET_FUNCTIONS: 'xslt_get_functions_in_container',
	XSLT_GET_MAP: 'xslt_get_map',
	XSLT_GET_MAPS: 'xslt_get_maps',
	XSLT_TRANSFORM: 'xslt_transform'
};

export const manifestConnectorIds = {
	as2: 'builtin/as2',
	rosettanet: 'builtin/rosettanet',
	code: 'builtin/code'
};

export const manifestOperationIds = {
	as2Decode: 'as2decode',
	as2Encode: 'as2encode',
	rosettanetWaitForResponse: 'rosettanetwaitforresponse',
	rosettanetDecode: 'rosettanetdecode',
	rosettanetEncode: 'rosettanetencode',
	codeJavaScript: 'javascript',
	recurrence: 'recurrence',
	scheduleSlidingWindow: 'slidingwindow'
};
export const builtInConnectorIds = {
	APIMANAGEMENT: 'connectionProviders/apimanagement',
	APPSERVICES: 'connectionProviders/appservice',
	FUNCTION: 'connectionProviders/function',
	WORKFLOW: 'connectionProviders/workflow',
	BATCH_GROUP: 'connectionProviders/batch',
	BUTTON_GROUP: 'connectionProviders/buttonGroup',
	CONTROL_GROUP: 'connectionProviders/control',
	DATA_OPERATIONS_GROUP: 'connectionProviders/dataOperation',
	DATETIME_GROUP: 'connectionProviders/datetime',
	GEOFENCE_GROUP: 'connectionProviders/geofenceGroup',
	HTTP_GROUP: 'connectionProviders/http',
	INTEGRATION_ACCOUNT_GROUP: 'connectionProviders/integrationAccount',
	POWERAPPS_GROUP: 'connectionProviders/powerappsGroup',
	REQUEST_RESPONSE_GROUP: 'connectionProviders/request',
	SCHEDULE_GROUP: 'connectionProviders/schedule',
	VARIABLE_GROUP: 'connectionProviders/variable'
};

export const builtInConnectorNames = {
	BATCH_GROUP: 'batch',
	CONTROL_GROUP: 'control',
	DATA_OPERATIONS_GROUP: 'dataOperation',
	DATETIME_GROUP: 'datetime',
	HTTP_GROUP: 'http',
	INTEGRATION_ACCOUNT_GROUP: 'integrationAccount',
	REQUEST_RESPONSE_GROUP: 'request',
	SCHEDULE_GROUP: 'schedule',
	VARIABLE_GROUP: 'variable',
	FLAT_FILE_GROUP: 'flatFile',
	LIQUID_GROUP: 'liquid',
	XML_GROUP: 'xml'
};

export const builtInSwaggerConnectorIds = {
	FLAT_FILE_GROUP: 'connectionProviders/flatFile',
	LIQUID_GROUP: 'connectionProviders/liquid',
	XML_GROUP: 'connectionProviders/xml'
};

export interface OutputInfo {
	description?: string;
	type: string;
	format?: string;
	isAdvanced: boolean;
	isDynamic?: boolean;
	isInsideArray?: boolean;
	//itemSchema?: Swagger.Schema;
	key: string;
	name: string;
	alias?: string;
	parentArray?: string;
	required?: boolean;
	source?: string;
	title: string;
	dynamicallyAdded?: boolean;
}

export interface Outputs {
	outputs: OutputInfo[];
}

export type InputParameter = any;   //TODO: Check if we need to bring this from Swagger where its originally defined
export type EnumParameterInfo = any; //TODO: Check if we need to bring this from stores/dynamicparameters where it is originally defined

export interface BuiltInParameterDefinition {
	allParameters?: InputParameter[];
	enumParameters?: EnumParameterInfo[];
}

export interface Operation {
	brandColor: string;
	connector?: string;
	connectorKind?: string;
	description: string;
	environmentBadge?: {
		name: string;
		description: string;
	};
	icon: string;
	id: string;
	important?: boolean;
	operationType?: string;
	premium?: boolean;
	preview?: boolean;
	promotionIndex?: number;
	subtitle: string;
	title: string;
}


export interface SuggestedItem {
	connector: Connector;
	operations: Operation[];
}

export interface RecommendationSuggestedItem extends SuggestedItem {
	rawConnector: any;  // tslint:disable-line: no-any
	rawOperations: any[];   // tslint:disable-line: no-any
}

export interface RecommendationResults<T> {
    /**
     * @member {string} [nextLink] - An optional string with the continuation token to follow to fetch more results.
     */
	nextLink?: string;

    /**
     * @member {any[]} rawValue - An array of JSON objects from the API used to fetch the results.
     */
	rawValue: any[]; // tslint:disable-line: no-any

    /**
     * @member {T[]} value - An array of JSON objects projected from the raw data into the specified type T.
     */
	value: T[];
}

export interface OperationKind {
	itemKey: string;
	linkText: string;
}

export interface RecommendationConnector extends Connector {
	isIseConnector?: boolean;
	type?: string;
	name?: string;
	description?: string;
	properties?: any;
}

export interface Connector {
	brandColor: string;
	icon: string;
	id: string;
	environmentBadge?: {
		name: string;
		description: string;
	};
	promotionIndex?: number;
	category?: string;
	title: string;
}

export interface RecommendationOperation extends Operation {
	isIseConnectorOperation?: boolean;
}

export interface RecommendationUserVoiceSegmentProps {
    /**
     * @member {boolean} [disabled]
     * True if the link should not be clickable
     */
	disabled?: boolean;

    /**
     * @member {string} [href]
     * An optional string with the URL for a text link in the UserVoice message
     */
	href?: string;

    /**
     * @member {string} text
     * A string with a text fragment for the UserVoice message
     */
	text: string;
}

export interface RecommendationUserVoiceProps {
    /**
     * @member {boolean} [disabled]
     * True if the UserVoice links should be disabled
     */
	disabled?: boolean;

    /**
     * @member {RecommendationUserVoiceSegmentProps[]} userVoiceSegments
     * An array of segments with text and href (for links) to render as the user voice message.
     */
	segments: RecommendationUserVoiceSegmentProps[];
}

export interface Badge {
	name: string;
	description: string;
}

export interface RecommendationServiceProvider {
	// tslint:disable-next-line: no-any
	canAddOperation?(rawOperation: any): boolean;

	// tslint:disable-next-line: no-any
	getConnectorBrandColor(rawConnector: any): string;

	// tslint:disable-next-line: no-any
	getConnectorIcon(rawConnector: any): string;

	// tslint:disable-next-line: no-any
	getConnectorTitle(rawConnector: any): string;

	getConnectors(filterText: string, kind: string): Promise<RecommendationResults<RecommendationConnector>>;

	getConnectorsByContinuationToken(continuationToken: string): Promise<RecommendationResults<RecommendationConnector>>;

	getDefaultOperationKind(isTrigger: boolean): string;

    /**
     * @deprecated Implement getExtraOperationsByConnector instead.
     */
	getExtraOperations?(kind: string): RecommendationOperation[];

	getExtraOperationsByConnector?(connectorId: string, kind: string): Promise<RecommendationOperation[]>;

	getOperationKinds(): RecommendationOperationKind[];

	getOperations(filterText: string, kind: string): Promise<RecommendationResults<RecommendationOperation>>;

	getOperationsByConnector(connector: string, filterText: string, kind: string): Promise<RecommendationResults<RecommendationOperation>>;

	getOperationsByContinuationToken(continuationToken: string): Promise<RecommendationResults<RecommendationOperation>>;

	getSearchBoxPlaceholder(kind: string): string;

	getUserVoiceProps(): RecommendationUserVoiceProps;

	shouldAllowTriggerSelectionAsAction?(connectorId: string, operationId: string, kind: string): boolean;
}

export interface RecommendationProvider extends Partial<RecommendationRouteProvider>, RecommendationServiceProvider {
}

export interface RecommendationRouteProvider {
	goBack(): string;

	selectConnector(connector: string, kind: string): string;

	selectOperation(operation: string, kind: string): string;
}

export interface Category {
	itemKey: string;
	linkText: string;
}
export type RecommendationCategory = Category;

export type RecommendationOperationKind = OperationKind;
export interface RecommendationService2 {
    /**
     * Set current recommendation context
     * @arg {RecommendationContext} recommendationContext- The current context for recommendation.
     * @return {void}
     */
	//setContext?(recommendationContext: RecommendationContext | undefined): Promise<void>;

    /**
     * Clear current recommendation context
     * @return {void}
     */
	//clearContext?(): void;

    /**
     * Checks if an operation can be added via the recommendation card.
     * @arg {any} rawOperation - A JSON value with operation properties to inspect for the check.
     * @return {Promise<boolean>}
     */
	// tslint:disable-next-line: no-any
	//canAddOperation?(rawOperation: any): Promise<boolean>;

    /**
     * Get the set of categories to render in the category pivot.
     * @return {RecommendationCategory[]}
     */
	getCategories(): RecommendationCategory[];

    /**
     * Get the connector's brand color using the specified category provider.
     * @arg {string} category - The category.
     * @arg {any} rawConnector - The connector.
     * @return {string}
     */
	// tslint:disable-next-line: no-any
	getConnectorBrandColor(category: string, rawConnector: any): string;

    /**
     * Get the connector's icon using the specified category provider.
     * @arg {string} category - The category.
     * @arg {any} rawConnector - The connector.
     * @return {string}
     */
	// tslint:disable-next-line: no-any
	getConnectorIcon(category: string, rawConnector: any): string;

    /**
     * Get the connector's title using the specified category provider.
     * @arg {string} category - The category.
     * @arg {any} rawConnector - The connector.
     * @return {string}
     */
	// tslint:disable-next-line: no-any
	getConnectorTitle(category: string, rawConnector: any): string;

    /**
     * Fetch connectors for the specified category, using filter text to refine the list.
     * @arg {string} category - The category.
     * @arg {string} filterText - The filter text.
     * @arg {string} kind - The operation kind.
     * @return {Promise<RecommendationResults<RecommendationConnector>>}
     */
	getConnectorsByCategory(category: string, filterText: string, kind: string): Promise<RecommendationResults<RecommendationConnector>>;

    /**
     * Fetch more connectors from a continuation token.
     * @arg {string} category - The category.
     * @arg {string} continuationToken - The continuation token.
     * @return {Promise<RecommendationResults<RecommendationConnector>>}
     */
	getConnectorsByContinuationToken(category: string, continuationToken: string): Promise<RecommendationResults<RecommendationConnector>>;

    /**
     * Get the key for the default category to show in the designer.
     * @return {string}
     */
	getDefaultCategoryKey(): string;

    /**
     * Get the default operation kind for the specified trigger, taking into account whether the designer is asking the user to select a trigger or action.
     * @arg {string} category - The category.
     * @arg {boolean} isTrigger - True if the designer is asking the user to select a trigger.
     * @return {string}}
     */
	getDefaultOperationKind(category: string, isTrigger: boolean): string;

    /**
     * Get the set of extra operations to render at the beginning of a list of operations.
     * @deprecated Implement getExtraOperationsByConnector instead.
     * @arg {string} category - The category.
     * @arg {string} kind - The operation kind.
     * @return {RecommendationOperation[]}
     */
	getExtraOperations(category: string, kind: string): RecommendationOperation[];

    /**
     * Get the set of extra operations to render at the beginning of a list of operations for a given connector.
     * @arg {string} category - The category.
     * @arg {string} connectorId - The connector ID.
     * @arg {string} kind - The operation kind.
     * @return {Promise<RecommendationOperation[]>}
     */
	getExtraOperationsByConnector?(category: string, connectorId: string, kind: string): Promise<RecommendationOperation[]>;

    /**
     * Get the set of operation kinds to render in the operation pivot for the specified category.
     * @arg {string} category - The category.
     * @return {RecommendationOperationKind[]}
     */
	getOperationKindsByCategory(category: string): RecommendationOperationKind[];

    /**
     * Fetch operations for the specified category, using filter text and operation kind to refine the list.
     * @arg {string} category - The category.
     * @arg {string} filterText - The filter text.
     * @arg {string} kind - The operation kind.
     * @return {Promise<RecommendationResults<RecommendationOperation>>}
     */
	getOperationsByCategory(category: string, filterText: string, kind: string): Promise<RecommendationResults<RecommendationOperation>>;

    /**
     * Fetch operations for the specified operation, using filter text and operation kind to refine the list.
     * @arg {string} category - The category.
     * @arg {string} connector - The connector.
     * @arg {string} filterText - The filter text.
     * @arg {string} kind - The operation kind.
     * @return {Promise<RecommendationResults<RecommendationOperation>>}
     */
	getOperationsByConnector(category: string, connector: string, filterText: string, kind: string): Promise<RecommendationResults<RecommendationOperation>>;

    /**
     * Fetch more operations from a continuation token.
     * @arg {string} category - The category.
     * @arg {string} continuationToken - The continuation token.
     * @return {Promise<RecommendationResults<RecommendationOperation>>}
     */
	getOperationsByContinuationToken(category: string, continuationToken: string): Promise<RecommendationResults<RecommendationOperation>>;

    /**
     * Gets the recommendation provider for the specified category.
     * @arg {string} category - The category.
     * @return {RecommedationProvider}
     */
	getProvider(category: string): RecommendationProvider;

    /**
     * Gets the placeholder text for the search box for the specified connector and operation kind.
     * @arg {string} category - The category.
     * @arg {string} kind - The operation kind.
     * @return {string}
     */
	getSearchBoxPlaceholder(category: string, kind: string): string;

    /**
     * Customize the UserVoice section rendered at the end of a list of operations.
     * @arg {string} category - The category.
     * @return {RecommendationServiceUserVoiceProps}
     */
	getUserVoicePropsByCategory(category: string): RecommendationUserVoiceProps;

    /**
     * Checks if a trigger operation should be allowed to be used as an action.
     * @arg {string} category - The category.
     * @arg {string} connectorId - The connector.
     * @arg {string} operationId - The operation.
     * @arg {string} kind - The operation kind.
     * @return {boolean}
     */
	shouldAllowTriggerSelectionAsAction?(category: string, connectorId: string, operationId: string, kind: string): boolean;
}


export interface SmartRecommendationService extends RecommendationService2 {
    /**
     * Add a connector to the user's MRU
     * @arg {any} connector - The connector.
     * @return {Promise<void>}
     */
	// tslint:disable-next-line: no-any
	addConnectorToMru(connector: any): Promise<void>;

    /**
     * Clears the MRU list for a user
     * @return {Promise<void>}
     */
	clearMru(): Promise<void>;

    /**
     * Gets the suggested items based on provided connector.
     * @arg {string} connectorId - The connector id.
     * @arg {number} suggestedConnectorsLimit - The limit size for suggested connectors.
     * @arg {number} suggestedOperationsPerConnectorLimit - The limit size for suggested operations per connector.
     * @return {Promise<RecommendationSuggestedItem[]>}
     */
	getSuggestedItems(
		connectorId: string,
		suggestedConnectorsLimit: number,
		suggestedOperationsPerConnectorLimit: number
	): Promise<RecommendationSuggestedItem[]>;
}

export interface Conditions {
    operationType: string;
}
export interface Metadata {
    conditions: Conditions;
    connectorId: string;
    operationId: string;
    manifest: OperationManifest;
}

export interface OperationManifest {
	properties: {
		iconUri: string;
		brandColor?: string;
		description?: string;

		statusBadge?: Badge;
		environmentBadge?: Badge;

		//recurrence?: RecurrenceSetting;

		inputs?: any;//Swagger.Schema;
		inputsLocation?: string[]; // NOTE(tonytang): If not specified, default value is [ 'inputs' ]
		isInputsOptional?: boolean;

		outputs?: any;//Swagger.Schema;
        /*
         * NOTE(trbaratc): Output resolution takes place as follows. If no payload outputs are present, then use outputs.
         * If payload outputs are present then walk the path defined by alternativeOutputs.keyPath to find the outputsKey. If the outputsKey is not defined, use outputs.
         * If outputsKey is defined and specifically present inside of alternativeOutputs.schemas, use the corresponding schema from alternativeOutputs.schemas.
         * Else, if outputsKey is defined but not specifically considered, use alternativeOutputs.defaultSchema.
        */
		//alternativeOutputs?: {
		//  keyPath: string[];
		//defaultSchema: Swagger.Schema;
		//schemas: Record<string, Swagger.Schema>;
		//};
		isOutputsOptional?: boolean;

		//settings?: OperationManifestSettings;

		trigger?: string;
		triggerHint?: string;
		connector?: Connector;
		autoCast?: boolean;
		includeRootOutputs?: boolean;
	};
}
export interface OperationInfo {
	connectorId: string;
	operationId: string;
}

export interface OperationManifestService {
    /**
     * Checks if the operation type is supported.
     * @arg {string} operationType - The operation type.
     * @arg {string | undefined} operationKind - The operation kind.
     * @return {boolean}
     */
	isSupported(operationType: string, operationKind: string | undefined): boolean;

    /**
     * Gets the operation info.
     * @arg {any} definition - The operation definition.
     * @return {Promise<OperationInfo>}
     */
	getOperationInfo(definition: any): Promise<OperationInfo>; // tslint:disable-line: no-any

    /**
     * Gets the operation manifest for an operation.
     * @arg {string} connectorId - The connector id.
     * @arg {string} operationId - The operation id.
     * @return {Promise<OperationManifest>}
     */
	getOperationManifest(connectorId: string, operationId: string): Promise<OperationManifest>;

    /**
     * Gets the split on outputs for an operation.
     * @arg {string} connectorId - The connector id.
     * @arg {string} operationId - The operation id.
     * @arg {SplitOn} splitOn - The split on for the operation.
     * @return {Swagger.Schema>}
     */
	getSplitOnOutputs(connectorId: string, operationId: string, splitOn: /*SplitOn*/ any): any;//Swagger.Schema;
}

export interface Schema {
	'$ref'?: string;
	format?: string;
	title?: string;
	description?: string;
	default?: any;
	multipleOf?: number;
	maximum?: number;
	exclusiveMaximum?: boolean;
	minimum?: number;
	exclusiveMinimum?: boolean;
	maxLength?: number;
	minLength?: number;
	pattern?: string;
	maxItems?: number;
	minItems?: number;
	uniqueItems?: boolean;
	maxProperties?: number;
	minProperties?: number;
	required?: string[];
	enum?: any[];
	type?: string; // NOTE(psamband): We might need to add support for string[] here later.
	items?: Schema;
	allOf?: Schema[];
	properties?: Record<string, Schema>;
	additionalProperties?: boolean | Schema;
	discriminator?: string;
	readOnly?: boolean;
	//xml?: Xml;
	//externalDocs?: ExternalDocumentation;
	example?: any;
	[xdash: string]: any;
}

export interface AnalyticsContext {
	/* tslint:disable: no-any */
	data?: any;
	/* tslint:enable: no-any */

	browserName?: string;
	browserVersion?: string;
	browserArch?: string;
	screenResolution?: string;
	windowLocationHref?: string;
	osName?: string;
	osVersion?: string;
	osArch?: string;
}


export interface AnalyticsService {

	/* tslint:disable: no-any max-line-length */

	getContext(): AnalyticsContext;
	setContextData(contextData: any): void;
	replaceContextData(contextData: any): void;

    /*
     * shim for performance.now() which returns double instead of long and is more precise than Date.now()
     */
	performanceNow(): number;

    /*
        {
            eventId: eventId || guid(),
            eventCorrelationId: eventCorrelationId,
            message: message,
            "eventData": {
              context: getContext(),
              data: data
            },
            eventName: eventName,
            eventTimestamp: eventTimestamp || new Date(),
            eventType: "Trace",
            code: "info"
        }
    */
	logInfo(eventName: string, message: string, data?: any, eventCorrelationId?: string, eventTimestamp?: Date, eventId?: string): void;

    /*
        {
            eventId: eventId || guid(),
            eventCorrelationId: eventCorrelationId,
            message: message,
            "eventData": {
              context: getContext(),
              data: data
            },
            eventName: eventName,
            eventTimestamp: eventTimestamp || new Date(),
            eventType: "Trace",
            code: "warning"
        }
    */
	logWarning(eventName: string, message: string, data?: any, eventCorrelationId?: string, eventTimestamp?: Date, eventId?: string): void;

    /*
        {
          "eventId": eventId || guid(),
          "eventCorrelationId": eventCorrelationId,
          "eventType": "Error",
          "eventTimestamp": eventTimestamp || new Date(),
          "eventName": eventName,
          "eventData": {
              context: getContext(),
              data: data
          },
          "message": error.toString(), // to string defaults to `${error.name}: ${error.message}`
          "code": error.code,
          "exception": error.stack
        }
    */
	logError(eventName: string, error: Error, data?: any, eventCorrelationId?: string, eventTimestamp?: Date, eventId?: string): void;
	// TODO: Add api for logging unhandled exception.

    /*
        {
          "eventId": eventId || guid(),
          "eventCorrelationId": eventCorrelationId,
          "eventType": "Request",
          "eventTimestamp": eventTimestamp || new Date(),
          "eventName": eventName,
          "eventData": {
              context: getContext(),
              data: data,
              request: "start"
          },
          "httpMethod": httpMethod,
          "targetUri": targetUri,
          "hostName": "example.com", // we can autogenerate this from targetUri. this is optional
          "apiVersion": "2.0", // auto generate for targetUri or make this a parameter? this is optional
          "clientRequestId": clientRequestId // optional
        }
    */
	logHttpRequestStart(eventName: string, httpMethod: string, targetUri: string, clientRequestId?: string, data?: any, eventCorrelationId?: string, eventTimestamp?: Date, eventId?: string): void;

    /*
        {
          "eventId": eventId || guid(),
          "eventCorrelationId": eventCorrelationId,
          "eventType": "Request",
          "eventTimestamp": eventTimestamp || new Date(),
          "eventName": eventName,
          "eventData": {
              context: getContext(),
              data: data,
              request: "end" // "end" | "networkerror" | "error",
              preciseDurationInMilliseconds: preciseDurationInMilliseconds
          },
          "durationInMilliseconds": Math.round(preciseDurationInMilliseconds),
          "httpMethod": httpMethod,
          "targetUri": targetUri,
          "clientRequestId": clientRequestId, // optional
          "serviceRequestId": responseData.serviceRequestId, // optional
          "contentLength": responseData.contentLength,
          "httpStatusCode": responseData.statusCode,

          // optional. we can remove this since this info is already available in targetUri and these are optional
          "hostName": responseData.hostName,
          "apiVersion": responseData.apiVersion",
        }
    */
	logHttpRequestEnd(eventName: string, httpMethod: string, targetUri: string, responseData: /*ResponseData*/ any, preciseDurationInMilliseconds: number, clientRequestId?: string, data?: any, eventCorrelationId?: string, eventTimestamp?: Date, eventId?: string): void;

	// Telemetry APIs
    /*
        {
          "eventId": eventId || guid(),
          "eventCorrelationId": eventCorrelationId,
          "eventType": "Telemetry",
          "eventTimestamp": eventTimestamp || new Date(),
          "eventName": eventName,
          "eventData": {
            context: getContext(),
            data: data
          }
        },
    */
	trackEvent(eventName: string, data: any, eventCorrelationId?: string, eventTimestamp?: Date, eventId?: string): void;

	// Profiling APIs
    /*
        {
          "eventId": eventId || guid(),
          "eventCorrelationId": eventCorrelationId,
          "eventType": "Telemetry",
          "eventTimestamp": eventTimestamp || new Date(), // save this internally and remove during profileEnd incase profileEnd passes date instead of duration
          "eventName": eventName,
          "eventData": {
            context: getContext(),
            data: data,
            profile: "start"
          }
        },
    */
	profileStart(eventCorrelationId: string, eventName: string, data: any, preciseDurationInMilliseconds?: number, eventTimestamp?: Date, eventId?: string): void;

    /*
        {
          "eventId": eventId || guid(),
          "eventCorrelationId": eventCorrelationId,
          "eventType": "Telemetry",
          "eventTimestamp": eventTimestamp || new Date(),
          "eventName": eventName,
          "eventData": {
            context: getContext(),
            data: data,
            profile: "end",
            preciseDurationInMilliseconds: preciseDurationInMilliseconds // if not present this is same as durationInMs
          },
          durationInMilliseconds: Math.round(preciseDurationInMilliseconds) // if not present calcaulate from eventTimeStamp. remove from internal data structure
        }
    */
	profileEnd(eventCorrelationId: string, eventName: string, data: any, preciseDurationInMilliseconds?: number, eventTimeStamp?: Date, eventId?: string): void;

    /*
        {
          "eventId": eventId || guid(),
          "eventCorrelationId": eventCorrelationId,
          "eventType": "Telemetry",
          "eventTimestamp": eventTimestamp || new Date(),
          "eventName": eventName,
          "eventData": {
            context: getContext(),
            data: data,
            profile: "profile",
            preciseDurationInMilliseconds: preciseDurationInMilliseconds // this should always be calculated by the caller and is required
          },
          durationInMilliseconds: Math.round(preciseDurationInMilliseconds)
        }
    */
	profile(eventCorrelationId: string, eventName: string, data: any, precisedurationInMilliseconds: number, eventTimestamp?: Date | number, eventId?: string): void;
	/* tslint:enable: no-any max-line-length */

	flush(): Promise<void>;

}


export interface BuiltInTypeService {
	// tslint:disable-next-line: no-any
	getBuiltInTriggers: () => any[];
	// tslint:disable-next-line: no-any
	getBuiltInActions: () => any[];
	// tslint:disable-next-line: no-any
	getBuiltInConnectors: () => any[];
	// tslint:disable-next-line: no-any
	getBuiltInOperationIds: () => any[];
}

export interface RecommendationServiceOptions {
	builtInTypeService: BuiltInTypeService;
}
