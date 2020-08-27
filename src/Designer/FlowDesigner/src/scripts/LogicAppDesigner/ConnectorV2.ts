import * as SharedDefines from "../sharedDefines";

export interface ListDynamicValue {
    value: any;        // tslint:disable-line: no-any
    displayName: string;
    description: string;
    disabled: boolean;
}

export interface TreeDynamicValue {
    value: any;        // tslint:disable-line: no-any
    displayName: string;
    isParent: boolean;
    fullyQualifiedDisplayName: string;
    dynamicState?: any;    // tslint:disable-line: no-any
}

/**
 * The v2 connector service.
 */
export interface DesignerConnectorV2Service {
    /**
     * Gets the item dynamic values.
     * @arg {string} connectionId - The connection id.
     * @arg {string} connectorId - The connector id.
     * @arg {string} operationId - The operation id.
     * @arg {string} parameterAlias - The parameter alias for the parameter whose dynamic values must be fetched.
     * @arg {Record<string, any>} parameters - The operation parameters. Keyed by parameter id.
     * @arg {any} dynamicState - Dynamic state required for invocation.
     * @return {Promise<ListDynamicValue[]>}
     */
    getListDynamicValues(
        connectionId: string,
        connectorId: string,
        operationId: string,
        parameterAlias: string,
        parameters: Record<string, any>,    // tslint:disable-line: no-any
        dynamicState: any): Promise<ListDynamicValue[]>;    // tslint:disable-line: no-any

    /**
     * Gets the tree dynamic values.
     * @arg {string} connectionId - The connection id.
     * @arg {string} connectorId - The connector id.
     * @arg {string} operationId - The operation id for the parameter whose dynamic values must be fetched.
     * @arg {string} parameterAlias - The parameter alias for the parameter whose dynamic values must be fetched.
     * @arg {Record<string, any>} parameters - The operation parameters. Keyed by parameter id.
     * @arg {any} dynamicState - Dynamic state required for invocation.
     * @return {Promise<TreeDynamicValue[]>}
     */
    getTreeDynamicValues(
        connectionId: string,
        connectorId: string,
        operationId: string,
        parameterAlias: string,
        parameters: Record<string, any>,    // tslint:disable-line: no-any
        dynamicState: any): Promise<TreeDynamicValue[]>;    // tslint:disable-line: no-any

    /**
     * Gets the dynamic schema for a parameter.
     * @arg {string} connectionId - The connection id.
     * @arg {string} connectorId - The connector id.
     * @arg {string} operationId - The operation id.
     * @arg {string} parameterAlias - The parameter alias for the parameter whose dynamic schema must be fetched.
     * @arg {Record<string, any>} parameters - The operation parameters. Keyed by parameter id.
     * @arg {any} dynamicState - Dynamic state required for invocation.
     * @return {Promise<Swagger.Schema>}
     */
    getDynamicSchema(
        connectionId: string,
        connectorId: string,
        operationId: string,
        parameterAlias: string,
        parameters: Record<string, any>,    // tslint:disable-line: no-any
        dynamicState: any): Promise<any>;    // tslint:disable-line: no-any 
        //todo: move to Promise<Swagger.Schema> once we add the Swagger Schema in our code
}

export class ConnectorV2Service implements DesignerConnectorV2Service {
    private _rpc: any = null;
    public constructor(rpc: any) {
        this._rpc = rpc;
    }
    async getListDynamicValues(
        connectionId: string,
        connectorId: string,
        operationId: string,
        parameterAlias: string,
        parameters: Record<string, any>,    // tslint:disable-line: no-any
        dynamicState: any) :  Promise<ListDynamicValue[]>{
        let response : ListDynamicValue[] =[];
        switch(operationId){
            case "setcallscript" : let crmData = await this._rpc.call(SharedDefines.WrapperMessages.GetCrmData);
                                        response = (JSON.parse(crmData).value);
                                        break;
            case "List_Flows":
                try {
                    let data;
                    if (parameterAlias == "entityLogicalName") {
                        data = await this._rpc.call(SharedDefines.WrapperMessages.GetEntities);
                    }
                    else if (parameterAlias == "flowId") {
                        data = await this._rpc.call(SharedDefines.WrapperMessages.GetFlowsData, [parameters.entityLogicalName]);
                    }
                    response = (JSON.parse(data).value);
                }
                catch (error) {
                    response = [];
                }
                break;
                
            default: response = [];
        }
        return response;
    }

    getDynamicSchema() {
        return Promise.resolve({});
    }

    getTreeDynamicValues() {
        return Promise.resolve([]);
    }
}
