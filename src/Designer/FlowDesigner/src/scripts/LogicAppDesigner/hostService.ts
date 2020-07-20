import * as Designer from "./DesignerDefinitions";
import {CustomRecommendationProvider} from "./CustomRecommendationProvider";
import { BuiltinProvider} from "./BuiltinProvider";
import { RecommendationRouter, GoBackResponse, SelectConnectorResponse, SelectOperationResponse } from "./RecommendationRouter";
import { Utils } from "../sharedUtils";
import { ILogicAppDesignerOptions } from "../sharedDefines";
import { BaseRecommendationProvider } from "./Provider";

export enum LogicAppsCategories {
    LOGIC_APPS_BUILTIN = "LOGIC_APPS_BUILTIN",
    CUSTOM = "CUSTOM"
}



export class SmartRecommendationImpl implements RecommendationRouter, Designer.RecommendationService2 {

    private _recommendationProviders: { [category: string]: BaseRecommendationProvider } = {};

    constructor(public recommendationOptions: Designer.RecommendationServiceOptions, public designerOptions: ILogicAppDesignerOptions){
        this._recommendationProviders = {

            [LogicAppsCategories.LOGIC_APPS_BUILTIN]: new BuiltinProvider({builtInTypeService:recommendationOptions.builtInTypeService},designerOptions,),
            [LogicAppsCategories.CUSTOM]: new CustomRecommendationProvider(designerOptions)

        };
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
    public getConnectorsByCategory(category: string, filterText: string, kind: string): Promise<Designer.RecommendationResults<Designer.RecommendationConnector>> {
        return this._recommendationProviders[category].getConnectors(filterText, kind);
    }
    public getConnectorsByContinuationToken(category: string, continuationToken: string): Promise<Designer.RecommendationResults<Designer.RecommendationConnector>> {
        return this._recommendationProviders[category].getConnectorsByContinuationToken(continuationToken);
    }

    public getCategories(): Designer.RecommendationCategory[] {
        return this.designerOptions.Categories;
    }

    public getDefaultCategoryKey(): string {
        return LogicAppsCategories.LOGIC_APPS_BUILTIN; 
    }
    public getDefaultOperationKind(category: string, isTrigger: boolean): string {
        return this._recommendationProviders[category].getDefaultOperationKind(isTrigger);
    }
    public getExtraOperations(category: string, kind: string): Designer.RecommendationOperation[] {
        return this._recommendationProviders[category].getExtraOperations(kind);
    }
    public getOperationKindsByCategory(category: string): Designer.RecommendationOperationKind[] {
        return this._recommendationProviders[category].getOperationKinds();
    }
    public getOperationsByCategory(category: string, filterText: string, kind: string): Promise<Designer.RecommendationResults<Designer.RecommendationOperation>> {
        return this._recommendationProviders[category].getOperations(filterText, kind);
    }
    public getOperationsByConnector(category: string, connector: string, filterText: string, kind: string): Promise<Designer.RecommendationResults<Designer.RecommendationOperation>> {
        return this._recommendationProviders[category].getOperationsByConnector(connector, filterText, kind);
    }
    public getOperationsByContinuationToken(category: string, continuationToken: string): Promise<Designer.RecommendationResults<Designer.RecommendationOperation>> {
        return this._recommendationProviders[category].getOperationsByContinuationToken(continuationToken);
    }
    public getProvider(category: string): Designer.RecommendationProvider {
        return this._recommendationProviders[category];
    }
    public getSearchBoxPlaceholder(category: string, kind: string): string {
        return this._recommendationProviders[category].getSearchBoxPlaceholder(kind);
    }
    public getUserVoicePropsByCategory(category: string): Designer.RecommendationUserVoiceProps {
        return this._recommendationProviders[category].getUserVoiceProps();
    }
   /* public addConnectorToMru(connector: any): Promise<void> {
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

        let _this = this;
        let connector = this._recommendationProviders['logicappBuiltin'].
        return Promise.resolve(
            [{
                rawConnector: [],
                rawOperations: [],
                connector: testConnector1,
                operations: [testAction]
            }]);  //TODO
    }*/
    goBack(category: string): string {
        return this._recommendationProviders[category].goBack();
    }

    selectConnector(category: string, connector: string, kind: string): string {
        return this._recommendationProviders[category].selectConnector(connector, kind);
    }

    selectOperation(category: string, operation: string, kind: string): string {
        return this._recommendationProviders[category].selectOperation(operation, kind);
    }
}

