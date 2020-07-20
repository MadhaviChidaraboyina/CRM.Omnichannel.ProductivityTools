import { RecommendationProvider, RecommendationResults, RecommendationConnector, RecommendationOperation, RecommendationOperationKind, RecommendationUserVoiceProps, builtInOperationIds } from './DesignerDefinitions';
import { ILogicAppDesignerOptions } from '../sharedDefines';
import * as SharedDefines from "../sharedDefines";
import { GoBackResponse, SelectConnectorResponse, SelectOperationResponse } from './RecommendationRouter';

export abstract class BaseRecommendationProvider implements RecommendationProvider {

    constructor(readonly designerOptions: ILogicAppDesignerOptions) {
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
        return connector && connector.properties && connector.properties.displayName;
    }

    abstract getConnectors(filterText: string, kind: string): Promise<RecommendationResults<RecommendationConnector>>;

    abstract getConnectorsByContinuationToken(continuationToken: string): Promise<RecommendationResults<RecommendationConnector>>;

    getDefaultOperationKind(isTrigger: boolean): string {
        return isTrigger ? SharedDefines.Kind.Trigger : SharedDefines.Kind.Action;
    }

    getExtraOperations(_kind: string): RecommendationOperation[] {
        return [];
    }

    getOperationKinds(): RecommendationOperationKind[] {
        return [
            {
                itemKey: SharedDefines.Kind.Trigger,
                linkText: this.designerOptions.operationKindDisplayText[SharedDefines.Kind.Trigger]
            },
            {
                itemKey: SharedDefines.Kind.Action,
                linkText: this.designerOptions.operationKindDisplayText[SharedDefines.Kind.Action]
            }
        ];
    }

    abstract getOperations(filterText: string, kind: string): Promise<RecommendationResults<RecommendationOperation>>;

    abstract getOperationsByConnector(connector: string, filterText: string, kind: string): Promise<RecommendationResults<RecommendationOperation>>;

    abstract getOperationsByContinuationToken(continuationToken: string): Promise<RecommendationResults<RecommendationOperation>>;

    getSearchBoxPlaceholder(kind: string): string {
        return this.designerOptions.SearchHint.concat(" ", this.designerOptions.operationKindDisplayText[kind]);
    }

    getUserVoiceProps(): RecommendationUserVoiceProps {
        return { segments: [{ text: this.designerOptions.UserVoiceMessage, disabled: false, href: this.designerOptions.UserVoiceURL }], disabled: false };
    }

    goBack(): string {
        return GoBackResponse.DEFAULT;
    }

    selectConnector(_connector: string, _kind: string): string {
        return SelectConnectorResponse.DEFAULT;
    }

    selectOperation(operation: string, kind: string): string {
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

    shouldAllowTriggerSelectionAsAction(connectorId: string, operationId: string, kind: string): boolean {
        return false;
        //return kind === SharedDefines.Kind.Action;
    }

}
