import * as Designer from "./DesignerDefinitions";
import * as SharedDefines from "./sharedDefines";
import { isNullOrUndefined, isNull } from "util";
import * as Utils from "./sharedUtils";


export class BuiltInTypeService {
    constructor(designerOptions, analytics) { }
    public getBuiltInTriggers(): Designer.ApiOperation[] {
        return [];  //TODO: 
    }
    public getBuiltInActions(recommendationVisibleOnly?: boolean): Designer.ApiOperation[] {
        return [];  //TODO

        //return [testAction];
    }
    public getBuiltInConnectors(): Designer.Connector[] {
        //return [testConnector];  //TODO:
        return [];
    }
    public getBuiltInOperationIds(): Designer.BuiltInOperationIdsTypes {
        const builtInOperationIds: Designer.BuiltInOperationIdsTypes = {
            //ADD_TO_TIME: 'add_to_time',
            //APIMANAGEMENT: 'apimanagement',
            //APPEND_TO_ARRAY_VARIABLE: 'append_to_array_variable',
            //APPEND_TO_STRING_VARIABLE: 'append_to_string_variable',
            //BATCH: 'batch',
            //BUTTON: 'button',
            //COMPOSE: 'compose',
            //CONVERT_TIME_ZONE: 'convert_time_zone',
            //CURRENT_TIME: 'current_time',
            //DECREMENT_VARIABLE: 'decrementvariable',
            //DELAY: 'delay',
            //DELAYUNTIL: 'delay_until',
            //EVENT_GRID: 'event_grid',
            //FLAT_FILE_DECODING: 'flat_file_decoding',
            //FLAT_FILE_ENCODING: 'flat_file_encoding',
            //FOREACH: 'foreach',
            //FUNCTION: 'function',
            //GEOFENCE_REQUEST: 'geofence_request',
            //GET_FUTURE_TIME: 'get_future_time',
            //GET_PAST_TIME: 'get_past_time',
            //HTTP_WITH_SWAGGER: 'http_with_swagger',
            //HTTP: 'http',
            //HTTPREQUESTTRIGGER: 'request',
            //HTTP_WEBHOOK: 'httpwebhook',
            //IF: 'if',
            //INCREMENT_VARIABLE: 'increment_variable',
            //INITIALIZE_VARIABLE: 'initializevariable',
            //INTEGRATION_ACCOUNT_ARTIFACT_LOOKUP: 'integration_account_artifact_lookup',
            //INTEGRATION_ACCOUNT_GET_SCHEMAS: 'content_and_schema_operation_get_schemas',
            //JOIN: 'join',
            //LIQUID_JSON_TO_JSON: 'liquid_json_to_json',
            //LIQUID_JSON_TO_TEXT: 'liquid_json_to_text',
            //LIQUID_XML_TO_JSON: 'liquid_xml_to_json',
            //LIQUID_XML_TO_TEXT: 'liquid_xml_to_text',
            //MANUALTRIGGER: 'manual',
            //PARSE_JSON: 'parsejson',
            //POWERAPPS_RESPONSE: 'powerappsresponse',
            //QUERY: 'query',
            //RECURRENCETRIGGER: 'recurrence',
            //RESPONSE: 'response',
            //SCOPE: 'scope',
            //SECURITY_CENTER_ALERT: 'securitycenteralert',
            //SELECT: 'select',
            //SEND_TO_BATCH: 'sendtobatch',
            //SET_VARIABLE: 'setvariable',
            //SUBTRACT_FROM_TIME: 'subtract_from_time',
            //SWITCH_CASE: 'switchcase',
            //SWITCH: 'switch',
            //TABLE_CSV: 'table_csv',
            //TABLE_HTML: 'table_html',
            //TERMINATE: 'terminate',
            //UNTIL: 'until',
            //WORKFLOW: 'workflow',
            //XML_VALIDATION: 'xml_validation',
            //XSLT_GET_CONTAINERS: 'xslt_get_containers',
            //XSLT_GET_FUNCTIONS: 'xslt_get_functions_in_container',
            //XSLT_GET_MAP: 'xslt_get_map',
            //XSLT_GET_MAPS: 'xslt_get_maps',
            //XSLT_TRANSFORM: 'xslt_transform'
        };
        return builtInOperationIds;
    }
    public isBuiltIn(connectorId: string, connectionOperation: string): boolean {
        return false;    //TODO: Implement this
    }
    public getOperationType(connectorId: string, operation: Designer.ConnectionOperation, isWebhookOperation: boolean, analytics: Designer.AnalyticsService): string {
        //return testOperation.type;    //TODO
        return operation.type;
    }
    public getBuiltInOutputs(): Record<string, Record<string, Designer.Outputs>> {
        return {};  //TODO
    }
    public getBuiltInOutputsForOperation(connectorId: string, operationId: string): Record<string, Designer.Outputs> {
        return {};  //TODO
    }
    /* tslint:disable: no-any */
    public getBuiltInParametersKey(): any {
        return null;    //TODO
    }
    /* tslint:enable: no-any */
    public getBuiltInParameters(): Record<string, Designer.BuiltInParameterDefinition> {
        return {};  //TODO
    }
}

type DesignerAction = Designer.ApiOperation & Designer.Operation & Designer.OperationManifest;
type DesignerConnector = Designer.RecommendationConnector;

function getDesignerSchemaObjectFromInput(inp: SharedDefines.Parameter): Designer.Schema {
    let prop: Designer.Schema = {
        title: inp.title,
        description: inp.description,
        type: inp.type
    };
    if (inp.visibility && inp.visibility != SharedDefines.Visibility.Required) {
        prop["x-ms-visibility"] = inp.visibility;
    }
    if (!inp.compoundObjectDefinitionJSON) {
        return prop;
    }
    let childParams: Record<string, Designer.Schema> = JSON.parse(inp.compoundObjectDefinitionJSON || "");
    switch (inp.type) {
        case SharedDefines.ParameterTypes.Array:
            let childProp: Designer.Schema = {
                type: SharedDefines.ParameterTypes.Object,
            };
            Object.keys(childParams).forEach(
                function (param) {
                    if (isNullOrUndefined(childProp.properties)) {
                        childProp.properties = {};
                    }
                    childProp.properties[param] = childParams[param];
                });
            prop.items = childProp;
            break;
        case SharedDefines.ParameterTypes.Object:
            Object.keys(childParams).forEach(
                function (pname) {
                    if (isNullOrUndefined(prop.properties)) {
                        prop.properties = {};
                    }
                    prop.properties[pname] = childParams[pname];
                });
            break;
    }
    return prop;
}
export class OperationManager {
    private designerOptions: SharedDefines.IDesignerOptions;
    private connectors: { [category: string]: DesignerConnector[] } = {};
    private actions: { [connectorId: string]: DesignerAction[] } = {};
    constructor(designerOptions: SharedDefines.IDesignerOptions/*, category: string, analytics*/) {
        this.designerOptions = designerOptions;
        let _this = this;
        designerOptions.Connectors.forEach(
            function (connector) {
                let ret: DesignerConnector = {
                    id: connector.id,
                    //category: connector.category,
                    type: connector.type,
                    name: connector.name,
                    title: connector.title,
                    brandColor: connector.brandColor,
                    description: connector.description,
                    icon: connector.icon,
                    properties: {
                        capabilities: [],
                        connectionDisplayName: connector.title,
                        displayName: connector.title,
                        environmentBadge: { name: designerOptions.environmentName, description: designerOptions.environmentDescription },
                        environment: designerOptions.environmentName,
                        purpose: connector.description,
                        iconUri: connector.icon,
                        runtimeUrls: [],
                        generalInformation: {
                            displayName: connector.title,
                            iconUrl: connector.icon,
                            description: connector.description
                        }
                    },
                    isIseConnector: false
                };
                let others = _this.connectors[connector.category] || [];
                others.push(ret);
                _this.connectors[connector.category] = others;
            });
        designerOptions.Actions.forEach(
            function (action) {
                let ret: DesignerAction = {
                    id: action.id,
                    type: action.type,
                    name: action.name,
                    brandColor: action.brandColor,
                    description: action.description,
                    icon: action.icon,
                    subtitle: action.subtitle,
                    title: action.title,
                    kind: action.kind,
                    properties: {
                        api: {
                            iconUri: action.icon,
                            id: action.id,
                            name: action.name
                        },
                        description: action.description,
                        summary: action.summary,
                        visibility: action.visibility,
                        iconUri: action.icon,
                        brandColor: action.brandColor,
                    }
                };
                if (action.inputs) {
                    let required: string[] = [];
                    ret.properties.inputs = {
                        type: 'object',
                        properties: {
                        }
                    };
                    action.inputs.forEach(
                        function (inp) {
                            if (inp.visibility && inp.visibility == SharedDefines.Visibility.Required) {
                                required.push(inp.name);
                            }
                            ret.properties.inputs.properties[inp.name] = getDesignerSchemaObjectFromInput(inp);
                        });
                    ret.properties.inputs.required = required;
                }
                if (action.outputs) {
                    ret.properties.outputs = {
                        type: 'object',
                        properties: {}
                    };

                    action.outputs.forEach(
                        function (inp) {
                            ret.properties.outputs.properties[inp.name] = {
                                title: inp.title,
                                description: inp.description,
                                type: inp.type
                            };
                        });
                }
                let others = _this.actions[action.connectorId] || [];
                others.push(ret);
                _this.actions[action.connectorId] = others;
            });
    }
    public getConnectors(category: string, kind?: SharedDefines.Kind): DesignerConnector[] {
        let ret: DesignerConnector[] = [];
        let _this = this;
        if (category) {
            ret = this.connectors[category];
        }
        else {
            Object.keys(this.connectors).forEach(function (category) {
                ret.concat(_this.connectors[category]);
            });
        }
        return ret.filter(function (connector) {
            return _this.getActions(connector.id, kind).length > 0;
        });
    }
    public getDefaultConnector(category?: string): DesignerConnector {
        let defaultCategory = category || this.designerOptions.Categories[0].itemKey;
        return this.connectors[defaultCategory][0];
    }
    public getDefaultAction(connectorId?: string): DesignerAction {
        let defaultConnectorId = connectorId || this.getDefaultConnector().id;
        return this.actions[defaultConnectorId][0];
    }
    public getConnectorById(connectorId: string): DesignerConnector | null {
        for (let cat in this.connectors) {
            for (let conn in this.connectors[cat]) {
                if (this.connectors[cat][conn].id === connectorId) {
                    return this.connectors[cat][conn];
                }
            }
        }
        return null;
    }
    public getActions(connectorid?: string, kind?: SharedDefines.Kind): DesignerAction[] {
        let ret: DesignerAction[] = [];
        if (connectorid) {
            ret = this.actions[connectorid];
        }
        else {
            for (let conn in this.actions) {
                ret = ret.concat(this.actions[conn]);
            }
        }
        return ret.filter(function (action) {
            return isNullOrUndefined(kind) || (kind === action.kind);
        });
    }
    public getActionById(operationId: string): DesignerAction | null {
        for (let conn in this.actions) {
            for (let act in this.actions[conn]) {
                if (this.actions[conn][act].id === operationId) {
                    return this.actions[conn][act];
                }
            }
        }
        return null;
    }
}
class SmartRecommendationProvider implements Designer.RecommendationProvider {
    private designerOptions: SharedDefines.IDesignerOptions;
    private category: string = "";
    private operationManager: OperationManager;
    constructor(designerOptions: SharedDefines.IDesignerOptions, operationManager: OperationManager, category: string, analytics) {
        this.designerOptions = designerOptions;
        this.operationManager = operationManager;
        this.category = category;
    }

    // tslint:disable-next-line: no-any
    canAddOperation?(rawOperation: any): boolean {
        return true;    //TODO
    }

    // tslint:disable-next-line: no-any
    public getConnectorBrandColor(rawConnector: SharedDefines.Connector): string {
        return rawConnector.brandColor;
    }

    // tslint:disable-next-line: no-any
    public getConnectorIcon(rawConnector: SharedDefines.Connector): string {
        return rawConnector.icon;
    }

    // tslint:disable-next-line: no-any
    public getConnectorTitle(rawConnector: SharedDefines.Connector): string {
        return rawConnector.title;
    }

    public getConnectors(filterText: string, kind: SharedDefines.Kind): Promise<Designer.RecommendationResults<Designer.RecommendationConnector>> {

        let ret = this.operationManager.getConnectors(this.category, kind);
        if (filterText) {
            ret = ret.filter(function (connector) {
                return connector.properties.displayName.includes(filterText);
            });
        }
        return Promise.resolve({ rawValue: ret, value: ret });  //TODO
    }

    public getConnectorsByContinuationToken(continuationToken: string): Promise<Designer.RecommendationResults<Designer.RecommendationConnector>> {
        let ret = this.operationManager.getConnectors(this.category);  //TODO - use continuation token if we need
        return Promise.resolve({ rawValue: ret, value: ret });  //TODO
    }

    public getDefaultOperationKind(isTrigger: boolean): string {
        return (isTrigger ? SharedDefines.Kind.Trigger : SharedDefines.Kind.Action);
    }

    /**
     * @deprecated Implement getExtraOperationsByConnector instead.
     */
    /*public getExtraOperations(kind: string): Designer.RecommendationOperation[] {
        return [];  //TODO
    }*/

    public getExtraOperationsByConnector(connectorId: string, kind: SharedDefines.Kind): Promise<Designer.RecommendationOperation[]> {
        return Promise.resolve([]); //TODO
    }

    public getOperationKinds(): Designer.RecommendationOperationKind[] {
        return [{ itemKey: SharedDefines.Kind.Trigger, linkText: Utils.Utils.getResourceString("DESIGNER_TRIGGER") }, { itemKey: SharedDefines.Kind.Action, linkText: Utils.Utils.getResourceString("DESIGNER_ACTION") }];
    }

    private getOperationsInternal(filterText: string, kind: SharedDefines.Kind, connectorId?: string): Promise<Designer.RecommendationResults<Designer.RecommendationOperation>> {
        let ret = this.operationManager.getActions(connectorId, kind);
        if (filterText) {
            ret = ret.filter(function (action) {
                return action.title.includes(filterText);
            });
        }
        return Promise.resolve({ rawValue: ret, value: ret });  //TODO
    }
    public getOperations(filterText: string, kind: SharedDefines.Kind): Promise<Designer.RecommendationResults<Designer.RecommendationOperation>> {
        return this.getOperationsInternal(filterText, kind);
    }

    public getOperationsByConnector(connector: string, filterText: string, kind: SharedDefines.Kind): Promise<Designer.RecommendationResults<Designer.RecommendationOperation>> {
        return this.getOperationsInternal(filterText, kind, connector);
    }

    public getOperationsByContinuationToken(continuationToken: string): Promise<Designer.RecommendationResults<Designer.RecommendationOperation>> {
        let ret = this.operationManager.getActions();
        return Promise.resolve({ rawValue: ret, value: ret });  //TODO
    }

    public getSearchBoxPlaceholder(kind: SharedDefines.Kind): string {
        return this.designerOptions.SearchHint.concat(" ", this.designerOptions.operationKindDisplayText[kind]);
    }

    public getUserVoiceProps(): Designer.RecommendationUserVoiceProps {
        return { segments: [{ text: this.designerOptions.UserVoiceMessage, disabled: false, href: this.designerOptions.UserVoiceURL }], disabled: false };  //TODO
    }

    public shouldAllowTriggerSelectionAsAction(connectorId: string, operationId: string, kind: string): boolean {
        return false;   //TODO
    }
}

export class SmartRecommendationImpl implements Designer.SmartRecommendationService {
    private _recommendationProviders: { [category: string]: SmartRecommendationProvider } = {};
    private designerOptions: SharedDefines.IDesignerOptions;
    private operationManager: OperationManager;
    constructor(designerOptions: SharedDefines.IDesignerOptions, operationManager: OperationManager, analytics) {
        this.designerOptions = designerOptions;
        this.operationManager = operationManager;
        let _this = this;
        designerOptions.Categories.forEach(function (category) {
            _this._recommendationProviders[category.itemKey] = new SmartRecommendationProvider(designerOptions, operationManager, category.itemKey, analytics);
        });
    }
    public getConnectorBrandColor(category: string, rawConnector: any): string {
        return this._recommendationProviders[category].getConnectorBrandColor(rawConnector);
    }
    public getConnectorIcon(category: string, rawConnector: any): string {
        return this._recommendationProviders[category].getConnectorIcon(rawConnector);
    }
    public getConnectorTitle(category: string, rawConnector: any): string {
        return this._recommendationProviders[category].getConnectorTitle(rawConnector);
    }
    public getConnectorsByCategory(category: string, filterText: string, kind: SharedDefines.Kind): Promise<Designer.RecommendationResults<Designer.RecommendationConnector>> {
        return this._recommendationProviders[category].getConnectors(filterText, kind);
    }
    public getConnectorsByContinuationToken(category: string, continuationToken: string): Promise<Designer.RecommendationResults<Designer.RecommendationConnector>> {
        return this._recommendationProviders[category].getConnectorsByContinuationToken(continuationToken);
    }

    public getCategories(): Designer.RecommendationCategory[] {
        return this.designerOptions.Categories;
    }

    public getDefaultCategoryKey(): string {
        return this.designerOptions.Categories[0].itemKey;
    }
    public getDefaultOperationKind(category: string, isTrigger: boolean): string {
        return this._recommendationProviders[category].getDefaultOperationKind(isTrigger);
    }
    /*public getExtraOperations(category: string, kind: string): Designer.RecommendationOperation[] {
        return this._recommendationProviders[category].getExtraOperations(kind);
    }*/
    public getExtraOperationsByConnector(category: string, connectorId: string, kind: SharedDefines.Kind): Promise<Designer.RecommendationOperation[]> {
        return this._recommendationProviders[category].getExtraOperationsByConnector(connectorId, kind);
    }
    public getOperationKindsByCategory(category: string): Designer.RecommendationOperationKind[] {
        return this._recommendationProviders[category].getOperationKinds();
    }
    public getOperationsByCategory(category: string, filterText: string, kind: SharedDefines.Kind): Promise<Designer.RecommendationResults<Designer.RecommendationOperation>> {
        return this._recommendationProviders[category].getOperations(filterText, kind);
    }
    public getOperationsByConnector(category: string, connector: string, filterText: string, kind: SharedDefines.Kind): Promise<Designer.RecommendationResults<Designer.RecommendationOperation>> {
        return this._recommendationProviders[category].getOperationsByConnector(connector, filterText, kind);
    }
    public getOperationsByContinuationToken(category: string, continuationToken: string): Promise<Designer.RecommendationResults<Designer.RecommendationOperation>> {
        return this._recommendationProviders[category].getOperationsByContinuationToken(continuationToken);
    }
    public getProvider(category: string): Designer.RecommendationProvider {
        return this._recommendationProviders[category];
    }
    public getSearchBoxPlaceholder(category: string, kind: SharedDefines.Kind): string {
        return this._recommendationProviders[category].getSearchBoxPlaceholder(kind);
    }
    public getUserVoicePropsByCategory(category: string): Designer.RecommendationUserVoiceProps {
        return this._recommendationProviders[category].getUserVoiceProps();
    }
    public addConnectorToMru(connector: any): Promise<void> {
        return Promise.resolve();   //TODO
    }
    public clearMru(): Promise<void> {
        return Promise.resolve();   //TODO
    }
    public getSuggestedItems(
        connectorId: string,
        suggestedConnectorsLimit: number,
        suggestedOperationsPerConnectorLimit: number
    ): Promise<Designer.RecommendationSuggestedItem[]> {
        let connector = this.operationManager.getConnectorById(connectorId);
        let opers: DesignerAction[] = [];
        let connectors: DesignerConnector[] = [];
        if (connector) {
            opers = this.operationManager.getActions(connector.id);
            connectors = [connector];
            return Promise.resolve(
                [{
                    rawConnector: connectors,
                    rawOperations: opers,
                    connector: connector,
                    operations: opers
                }]);  //TODO
        }
        return Promise.reject("Unknown connector");
    }
}

export class OperationManifestServiceImpl implements Designer.OperationManifestService {
    private designerOptions: SharedDefines.IDesignerOptions;
    private operationManager: OperationManager;
    constructor(designerOptions: SharedDefines.IDesignerOptions, operationManager: OperationManager, analytics) {
        this.designerOptions = designerOptions;
        this.operationManager = operationManager;
    }
    public isSupported(operationType: string, operationKind: string | undefined): boolean {
        return true;    //TODO
    }
    public getOperationInfo(definition: any): Promise<Designer.OperationInfo> {
        let defaultConnector = this.operationManager.getDefaultConnector();
        let action = this.operationManager.getActionById(definition.type);
        return Promise.resolve({ connectorId: defaultConnector.id, operationId: action && action.id || defaultConnector.id });
    }
    public getOperationManifest(connectorId: string, operationId: string): Promise<Designer.OperationManifest> {
        let searchList = [connectorId, operationId];
        for (let conId in searchList) {
            let action = this.operationManager.getActionById(searchList[conId]);
            if (action) {
                return Promise.resolve({
                    properties: action.properties
                });
            }
        }
        return Promise.reject("Unknown connector or operation Id");
    }
    public getSplitOnOutputs(connectorId: string, operationId: string, splitOn: /*SplitOn*/ any): any {
        let searchList = [operationId, connectorId];
        for (let conId in searchList) {
            let action = this.operationManager.getActionById(searchList[conId]);
            if (action) {
                return action.properties.outputs;
            }
        }
        return null;
    }
}

export class Analytics implements Designer.AnalyticsService {
    private _context: Designer.AnalyticsContext = {};
    private _correlationId: string = Utils.Utils.GenGuid();
    private _rpc: any = null;
    public constructor(rpc: any, context: SharedDefines.IDesignerOptions, version: string) {
        this._context = {}; //TODO
        this._rpc = rpc;
    }
    public getContext(): Designer.AnalyticsContext {
        return this._context;
    }
    public setContextData(contextData: any): void {
        this._context.data = contextData;
    }
    public replaceContextData(data: any): void {
        return this.setContextData(data);
    }
    public performanceNow(): number {
        return 0;   //TODO
    }
    private _log(level: SharedDefines.LogLevel, eventType: SharedDefines.TelemetryEventType, eventName: string, message: string, data?: any, eventCorrelationId?: string, eventTimestamp?: Date, eventId?: string, error?: Error) {
        let obj: SharedDefines.LogObject = {
            eventName: eventName,
            eventType: eventType,
            level: level,
            //designerInstanceId: this._correlationId,
            message: Utils.Utils.genMsgForTelemetry(message, error),
            eventCorrelationId: eventCorrelationId,
            eventId: eventId,
            eventTimeStamp: eventTimestamp || new Date(),
            eventData: { data: data, context: this.getContext() }
        };
        if (error) {
            obj.exception = error.stack;
        }
        this._rpc.call(SharedDefines.WrapperMessages.LOG, [JSON.stringify(obj)]);
    }
    public logInfo(eventName: string, message: string, data?: any, eventCorrelationId?: string, eventTimestamp?: Date, eventId?: string): void {
        return this._log(SharedDefines.LogLevel.Info, SharedDefines.TelemetryEventType.Trace, eventName, message, data, eventCorrelationId, eventTimestamp, eventId);
    }
    public logWarning(eventName: string, message: string, data?: any, eventCorrelationId?: string, eventTimestamp?: Date, eventId?: string): void {
        return this._log(SharedDefines.LogLevel.Warning, SharedDefines.TelemetryEventType.Trace, eventName, message, data, eventCorrelationId, eventTimestamp, eventId);
    }
    public logError(eventName: string, error: Error, data?: any, eventCorrelationId?: string, eventTimestamp?: Date, eventId?: string): void {
        return this._log(SharedDefines.LogLevel.Error, SharedDefines.TelemetryEventType.Trace, eventName, error.toString(), data, eventCorrelationId, eventTimestamp, eventId);
    }
    public logHttpRequestStart(eventName: string, httpMethod: string, targetUri: string, clientRequestId?: string, data?: any, eventCorrelationId?: string, eventTimestamp?: Date, eventId?: string): void {
        //TODO
    }
    public logHttpRequestEnd(eventName: string, httpMethod: string, targetUri: string, responseData: /*ResponseData*/ any, preciseDurationInMilliseconds: number, clientRequestId?: string, data?: any, eventCorrelationId?: string, eventTimestamp?: Date, eventId?: string): void {
        //TODO
    }
    public trackEvent(eventName: string, data: any, eventCorrelationId?: string, eventTimestamp?: Date, eventId?: string): void {
        return this._log(SharedDefines.LogLevel.Info, SharedDefines.TelemetryEventType.Telemetry, eventName, "Track Event".concat(":", eventName), data, eventCorrelationId, eventTimestamp, eventId);
    }
    public profileStart(eventCorrelationId: string, eventName: string, data: any, preciseDurationInMilliseconds?: number, eventTimestamp?: Date, eventId?: string): void {
        //TODO
    }
    profileEnd(eventCorrelationId: string, eventName: string, data: any, preciseDurationInMilliseconds?: number, eventTimeStamp?: Date, eventId?: string): void {
        //TODO
    }
    profile(eventCorrelationId: string, eventName: string, data: any, precisedurationInMilliseconds: number, eventTimestamp?: Date | number, eventId?: string): void {
        //TODO
    }
    flush(): Promise<void> {
        //TODO
        return Promise.resolve();
    }
}