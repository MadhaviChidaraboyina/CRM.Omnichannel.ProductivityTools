import * as Designer from "./DesignerDefinitions";
import { compareFunctionForOperations } from "./utilities/comparFunc";
import {  GoBackResponse, SelectConnectorResponse, SelectOperationResponse } from "./RecommendationRouter";
import { mapToOperations } from "./BuiltinProvider";
import * as SharedDefines from "../sharedDefines";
import { BaseRecommendationProvider } from "./Provider";


export class CustomRecommendationProvider extends BaseRecommendationProvider {

    constructor(public designerOptions: SharedDefines.ILogicAppDesignerOptions) {
        super(designerOptions);
    }
    // tslint:disable-next-line: no-any
    canAddOperation?(rawOperation: any): boolean {
        return true;    //TODO
    }

    // tslint:disable-next-line: no-any
    public getConnectorBrandColor(connector: any): string {
        return connector && connector.brandColor; //&& connector.properties &&  connector.properties.brandColor;
    }

    // tslint:disable-next-line: no-any
    public getConnectorIcon(connector: any): string {
        return connector && connector.icon;//&& connector.properties && connector.properties.iconUri;// "./icons/flow_placeholder.svg";  //TODO
    }

    // tslint:disable-next-line: no-any
    public getConnectorTitle(connector: any): string {
        return connector && connector.title ;//|| "IMPLEMENT_ME_CONNECTOR_TITLE"; //todo
    }

    public getConnectors(filterText: string, kind: string): Promise<Designer.RecommendationResults<Designer.RecommendationConnector>> {
        const connectors = this.designerOptions.Connectors;
        return Promise.resolve({rawValue: connectors, value: connectors});
    }

    public getConnectorsByContinuationToken(continuationToken: string): Promise<Designer.RecommendationResults<Designer.RecommendationConnector>> {
        const connectors = this.designerOptions.Connectors;
        return Promise.resolve({ rawValue: connectors, value: connectors });
    }

    getDefaultOperationKind(isTrigger: boolean): string {
        return (isTrigger ? SharedDefines.Kind.Trigger : SharedDefines.Kind.Action);
    }

    /**
     * @deprecated Implement getExtraOperationsByConnector instead.
     */
    public getExtraOperations(kind: string): Designer.RecommendationOperation[] {
        return [];  // not required for now
    }

    public getExtraOperationsByConnector?(connectorId: string, kind: string): Promise<Designer.RecommendationOperation[]> {
        return Promise.resolve([]); //TODO
    }

    public getOperationKinds(): Designer.RecommendationOperationKind[] {
        return [ // Providing only actions for now, to get both actions and trigger, uncomment below line
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

    async getOperations(filterText: string, kind: string): Promise<Designer.RecommendationResults<Designer.RecommendationOperation>> {
        //const operations = CustomActions;
        const operations = this._getOperations(kind);
        let rawValue = operations;

        const promotedConnectors =[];
        const value = mapToOperations(promotedConnectors)(rawValue).sort(compareFunctionForOperations);

        return {
            rawValue,
            value
        };
    //    return Promise.resolve({ rawValue: [codeJavaScriptAction], value: [codeJavaScriptAction] });  //TODO
    }

    async getOperationsByConnector(connector: string, filterText: string, kind: string): Promise<Designer.RecommendationResults<Designer.RecommendationOperation>> {
        //const operations = CustomActions;
        const operations = this._getOperations(kind);
        let rawValue = operations;

        const promotedConnectors =[];
        const value = mapToOperations(promotedConnectors)(rawValue).sort(compareFunctionForOperations);

        return {
            rawValue,
            value
        };    
    }

    public getOperationsByContinuationToken(continuationToken: string): Promise<Designer.RecommendationResults<Designer.RecommendationOperation>> {
        throw new Error("Method not implemented.");
    }

    public getSearchBoxPlaceholder(kind: string): string {
        return this.designerOptions.SearchHint.concat(" ", this.designerOptions.operationKindDisplayText[kind]);
    }

 /*   public getUserVoiceProps(): Designer.RecommendationUserVoiceProps {
        return { userVoiceSegments: [], isReadOnly: true};  //TODO
    }*/

   /* public shouldAllowTriggerSelectionAsAction?(connectorId: string, operationId: string, kind: string): boolean {
        return false;   //TODO
    }*/
    public goBack(): string {
        return GoBackResponse.DEFAULT;
    }

    public selectConnector(_connector: string, _kind: string): string {
        return SelectConnectorResponse.DEFAULT;
    }

    public selectOperation(_operation: string, _kind: string): string {
        return SelectOperationResponse.DEFAULT;
    }
    private _getOperations(kind: string): any[] {
        return kind === SharedDefines.Kind.Trigger
            ? this.designerOptions.Triggers
            :  this.designerOptions.Actions;
    }
}