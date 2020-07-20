import * as Designer from "./DesignerDefinitions"
import { RecommendationServiceOptions, BuiltInTypeService, RecommendationResults, RecommendationConnector, RecommendationOperation, Badge, manifestConnectorIds, builtInConnectorIds, builtInSwaggerConnectorIds, builtInOperationIds  } from './DesignerDefinitions';
import { comparePromotionIndex, compareBooleans } from './utilities/comparFunc';
import { stringIncludes } from './utilities/apputil';
import { SelectOperationResponse, GoBackResponse, SelectConnectorResponse } from './RecommendationRouter';
import { ILogicAppDesignerOptions } from "../sharedDefines";
import { BaseRecommendationProvider } from "./Provider";
import * as SharedDefines from "../sharedDefines";

const CaseInsensitiveCollator = new Intl.Collator([], { sensitivity: 'base' });

export class BuiltinProvider extends BaseRecommendationProvider {
    private _builtInTypeService: BuiltInTypeService;
    private readonly _includeConnectorBuiltins: boolean = true;

    constructor(public recommendationOptions: RecommendationServiceOptions,designerOptions: ILogicAppDesignerOptions ) {
        super(designerOptions);
        this._builtInTypeService = recommendationOptions.builtInTypeService;

    }   
    canAddOperation?(rawOperation: any): boolean {
        return true;
    }

    // tslint:disable-next-line: no-any
    getConnectorBrandColor(connector: any): string {
        return connector && connector.properties && connector.properties.metadata && connector.properties.metadata.brandColor;
    }

    // tslint:disable-next-line: no-any
    getConnectorIcon(connector: any): string {
        return connector && connector.properties && connector.properties.iconUri;
    }

    // tslint:disable-next-line: no-any
    getConnectorTitle(connector: any): string {
        return connector && connector.properties && connector.properties.iconUri;
    }
    async getConnectors(filterText: string, kind: string): Promise<RecommendationResults<RecommendationConnector>> {
        //const { promotedConnectorsForActions, promotedConnectorsForTriggers } = this.options;

        //const shouldGetFromOperations = getAppSettings().featureFlags.enableApiResultsFromOperationResults;
       /* if (shouldGetFromOperations) {
            const operations = await this.getOperations(filterText, kind);
            return mapOperationsResultsToConnectorResults(operations);
        }*/

        let connectors = this.recommendationOptions.builtInTypeService.getBuiltInConnectors();
        if (this._includeConnectorBuiltins) {
            connectors = connectors.filter(connectorShouldListAsBuiltin);
        }

        const rawValue = connectors
            .filter(connectorHasDisplayName)
            .filter(connectorMatchesFilterText(filterText));
        const promotedConnectors = [];
       /*= kind === OperationKinds.TRIGGERS
            ? promotedConnectorsForTriggers
            : promotedConnectorsForActions;*/
        const value = mapToConnectors(promotedConnectors)(rawValue).sort(compareFunctionForConnectors);
        return {
            rawValue,
            value
        };    
    }

    getConnectorsByContinuationToken(continuationToken: string): Promise<RecommendationResults<RecommendationConnector>> {
        throw new Error("Method not implemented.");
    }
    getDefaultOperationKind(isTrigger: boolean): string {
        return isTrigger ? SharedDefines.Kind.Trigger : SharedDefines.Kind.Action;
    }
    getExtraOperations(kind: string): RecommendationOperation[] {
        return [];
    }
    getExtraOperationsByConnector?(connectorId: string, kind: string): Promise<RecommendationOperation[]> {
        throw new Error("Method not implemented.");
    }
    getOperationKinds(): Designer.OperationKind[] {
        return [
           /* {
                itemKey: SharedDefines.Kind.Trigger,
                linkText: this.designerOptions.operationKindDisplayText[SharedDefines.Kind.Trigger]
            },*/
            {
                itemKey: SharedDefines.Kind.Action,
                linkText: this.designerOptions.operationKindDisplayText[SharedDefines.Kind.Action]
            }
        ];  
    }
    async getOperations(filterText: string, kind: string): Promise<RecommendationResults<RecommendationOperation>> {
         const operations = this.getBuiltInOperations(kind);
        let rawValue = operations
            .filter(operationMatchesFilterText(filterText));
        if (this._includeConnectorBuiltins) {
            rawValue = rawValue.filter(connectionOperationShouldListAsBuiltin);
        }
        //const { promotedConnectorsForTriggers, promotedConnectorsForActions } = this.options;
        const promotedConnectors = [];
        /*kind === OperationKinds.TRIGGERS
            ? promotedConnectorsForTriggers
            : promotedConnectorsForActions;*/
        const value = mapToOperations(promotedConnectors)(rawValue).sort(compareFunctionForOperations);

        return {
            rawValue,
            value
        };
    }

    async getOperationsByConnector(connector: string, filterText: string, kind: string): Promise<RecommendationResults<RecommendationOperation>> {
    const operations = this.getBuiltInOperations(kind);
        let rawValue = operations
            .filter(operationMatchesConnector(connector))
            .filter(operationMatchesFilterText(filterText));
            if (this._includeConnectorBuiltins) {
                rawValue = rawValue.filter(connectionOperationShouldListAsBuiltin);
            }
        const value = mapToOperations()(rawValue).sort(compareFunctionForOperations);

        return {
            rawValue,
            value
        };  
    }

    getOperationsByContinuationToken(continuationToken: string): Promise<RecommendationResults<RecommendationOperation>> {
        throw new Error("Method not implemented.");
    }
    getSearchBoxPlaceholder(kind: string): string {
        return this.designerOptions.SearchHint.concat(" ", this.designerOptions.operationKindDisplayText[kind]);
    }
 /*   getUserVoiceProps(): Designer.RecommendationUserVoiceProps {
        throw new Error("Method not implemented.");
    }*/
    /*shouldAllowTriggerSelectionAsAction?(connectorId: string, operationId: string, kind: string): boolean {
        return kind === OperationKinds.ACTIONS;
    }*/
   // tslint:disable-next-line: no-any
   protected getBuiltInOperations(kind: string): any[] {
    const operations = this._getOperations(kind);
    return operations;
    }

    _getOperations(kind: string): any[] {
    return kind === SharedDefines.Kind.Trigger
        ? this.recommendationOptions.builtInTypeService.getBuiltInTriggers()
        // We only offer the built-in ability to run a child flow under certain circumstances.
        :  this.recommendationOptions.builtInTypeService.getBuiltInActions();
    }
    goBack(): string {
        return GoBackResponse.DEFAULT;
    }
    selectOperation(operation: string, _kind: string): string {
        switch (operation) {
            case builtInOperationIds.FOREACH:
            case builtInOperationIds.IF:
            case builtInOperationIds.SCOPE:
            case builtInOperationIds.SWITCH:
            case builtInOperationIds.UNTIL:
                return SelectOperationResponse.SELECT_SCOPE_OPERATION;

            default:
                return SelectOperationResponse.DEFAULT;
        }
    }
    selectConnector(connector: string, kind: string): string {
        switch (connector) {
            case builtInConnectorIds.APIMANAGEMENT:
                return SelectConnectorResponse.CHANGE_TO_API_MANAGEMENT;

            case builtInConnectorIds.APPSERVICES:
                return SelectConnectorResponse.CHANGE_TO_APP_SERVICE;

            case builtInConnectorIds.BATCH_GROUP:
                return kind === SharedDefines.Kind.Trigger
                    ? SelectConnectorResponse.SELECT_BATCH_LOGIC_APP
                    : SelectConnectorResponse.CHANGE_TO_BATCH_LOGIC_APPS;

            case builtInConnectorIds.FUNCTION:
                return SelectConnectorResponse.CHANGE_TO_FUNCTIONS;

            case builtInConnectorIds.WORKFLOW:
                return SelectConnectorResponse.CHANGE_TO_LOGIC_APPS;

            default:
                return SelectConnectorResponse.DEFAULT;
        }
    }
}
function compareFunctionForConnectors(a: RecommendationConnector, b: RecommendationConnector): number {
    return comparePromotionIndex(a.promotionIndex, b.promotionIndex)
        || CaseInsensitiveCollator.compare(a.title, b.title);
}

function compareFunctionForOperations(a: RecommendationOperation, b: RecommendationOperation): number {
    return comparePromotionIndex(a.promotionIndex, b.promotionIndex)
        || compareBooleans(!!b.important, !!a.important)
        || CaseInsensitiveCollator.compare(a.subtitle, b.subtitle)
        || CaseInsensitiveCollator.compare(a.title, b.title);
}
export function connectorHasDisplayName(connector: any): boolean {
    return !!connector && !!connector.properties && !!connector.properties.displayName;
}
export function connectorMatchesFilterText(filterText: string) {
    // tslint:disable-next-line: no-any
    return (connector: any): boolean => !filterText || stringIncludes(connector.properties.displayName, filterText, 0);
}

// tslint:disable-next-line: no-any
function mapToConnector(promotedConnectors: string[] = []): (value: any) => RecommendationConnector {
    // tslint:disable-next-line: no-any
    return (value: any): RecommendationConnector => {
        const {
            id,
            properties: {
                displayName: title,
                metadata,
                iconUri: icon
            }
        } = value;
        const {
            brandColor
        } = metadata || { brandColor: undefined };
        const promotionIndex = promotedConnectors.indexOf(id);

        return {
            brandColor,
            icon,
            id,
            promotionIndex: promotionIndex === -1 ? Number.MAX_VALUE : promotionIndex,
            title
        };
    };
}
// tslint:disable-next-line: no-any
function mapToConnectors(promotedConnectors: string[] = []): (values: any[]) => RecommendationConnector[] {
    const mapFn = mapToConnector(promotedConnectors);

    // tslint:disable-next-line: no-any
    return (values: any[]): RecommendationConnector[] => values.map(mapFn);
}

 
// tslint:disable-next-line: no-any
export function mapToOperation(connectorsWithPromotedOperations: string[] = [], badge?: Badge): (value: any[]) => RecommendationOperation {
    // tslint:disable-next-line: no-any
    return (value: any): RecommendationOperation => {
        const {
            id,
            properties: {
                annotation,
                api,
                description,
                summary: title
            }
        } = value;
        const {
            status
        } = annotation || { status: undefined };
        const {
            brandColor,
            displayName: subtitle,
            iconUri: icon,
            id: connector
        } = api || { brandColor: undefined, displayName: undefined, iconUri: undefined, id: undefined };
        const promotionIndex = connectorsWithPromotedOperations.indexOf(connector);
        const operation = {
            id,
            brandColor,
            ...!!connector ? { connector } : undefined,
            connectorKind: '', //ConnectorKind displays the value for environment badge in the UI
            description,
            //environmentBadge: badge,
            icon,
            preview: status === 'Preview',
            promotionIndex: promotionIndex === -1 ? Number.MAX_VALUE : promotionIndex,
            subtitle,
            title
        };

        /*if (!operationShouldListAsBuiltin(operation)) {
            delete operation.connectorKind;
        }*/

        return operation;
    };
}
function connectorShouldListAsBuiltin(connector: any): boolean {
    return CaseInsensitiveCollator.compare(connector.id, builtInConnectorIds.CONTROL_GROUP) === 0;
}

    
function connectionOperationShouldListAsBuiltin(operation: Designer.ConnectionOperation): boolean {
    const { id, properties } = operation;
    return CaseInsensitiveCollator.compare(properties.api.id, builtInConnectorIds.CONTROL_GROUP) === 0
        && CaseInsensitiveCollator.compare(id, builtInOperationIds.IF!) === 0
}

// tslint:disable-next-line: no-any
export function mapToOperations(promotedConnectors: string[] = []): (values: any[]) => RecommendationOperation[] {
    const mapFn = mapToOperation(promotedConnectors);

    // tslint:disable-next-line: no-any
    return (values: any[]): RecommendationOperation[] => values.map(mapFn);
}
export function operationMatchesFilterText(filterText: string) {
    // tslint:disable-next-line: no-any
    return (operation: any): boolean => {
        return !filterText
            || stringIncludes(operation.properties.summary, filterText, 0)
            || stringIncludes(operation.properties.description, filterText, 0)
            || stringIncludes(operation.properties.api && operation.properties.api.displayName, filterText, 0);
    };
}

export function operationMatchesConnector(connector: string) {
    // tslint:disable-next-line: no-any
    return (operation: any): boolean => CaseInsensitiveCollator.compare(operation.properties.api && operation.properties.api.id, connector) === 0;
}

export function operationMatchesCategory(category: string) {
    // tslint:disable-next-line: no-any
    return (operation: any): boolean => CaseInsensitiveCollator.compare(operation.properties.api && operation.properties.api.tier, category) === 0;
}

 
