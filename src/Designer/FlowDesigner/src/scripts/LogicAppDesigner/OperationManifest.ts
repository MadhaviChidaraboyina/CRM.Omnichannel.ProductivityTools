import * as Designer from "./DesignerDefinitions";
import { Badge, Connector } from "./DesignerDefinitions";
import * as SharedDefines from "./../sharedDefines";

export interface Conditions {
    operationType: string;

    // NOTE(tonytang): This is deprecated. This is only for legacy operations. For new operations, please
    // use operationType/operationKind to distinguish different operations.
    inputsExistance?: string;
}

export interface Metadata {
    conditions: Conditions;
    connectorId: string;
    operationId: string;
    manifest: OperationManifest;
}

export interface OperationInfo {
    connectorId: string;
    operationId: string;
}

export interface SecureDataOptions {
    outputsMode?: OutputSecureDataMode;
}

export enum OutputSecureDataMode {
    Disabled = 'disabled',
    LinkedToInputs = 'linkedtoinputs'
}

export enum SettingScope {
    Trigger = 'trigger',
    Action = 'action'
}

export type SplitOn = string | any[] | undefined; // tslint:disable-line: no-any

export interface OperationManifestSetting<T> {
    scopes?: SettingScope[]; // NOTE(yuxyao): If the scopes set to undefined, then the options apply to all scopes.
    options?: T;
}

export enum RecurrenceType {
    SlidingWindow,
    Basic,
    Advanced
}

export interface RecurrenceSetting {
    type: RecurrenceType;
    useLegacyParameterGroup?: boolean;
}


export interface OperationManifest {
    properties: {
        iconUri: string;
        brandColor: string;
        description?: string;

        statusBadge?: Badge;
        environmentBadge?: Badge;

        recurrence?: RecurrenceSetting;

        inputs?: any;   //Swagger.Schema
        isInputsOptional?: boolean;

        outputs?: any; //Swagger.Schema
        isOutputsOptional?: boolean;

        settings?: {
            secureData?: OperationManifestSetting<SecureDataOptions>;
            paging?: OperationManifestSetting<void>;
            trackedProperties?: OperationManifestSetting<void>;
            correlation?: OperationManifestSetting<void>;
            concurrency?: OperationManifestSetting<void>;
        };

        trigger?: string;
        triggerHint?: string;
        connector?: Connector;
        autoCast?: boolean;
        includeRootOutputs?: boolean;
    };
}


export class OperationManifestServiceImpl implements Designer.OperationManifestService {
    private designerOptions: SharedDefines.ILogicAppDesignerOptions;
    private operationManifestData: Metadata[];
    constructor(designerOptions: SharedDefines.ILogicAppDesignerOptions) {
        this.designerOptions = designerOptions;
        this.operationManifestData = this.designerOptions.OperationManifest;
    }

    isSupported(operationType: string): boolean {
        const normalizedOperationType = operationType.toLowerCase(); 
        return this.operationManifestData.some(metadata => metadata.conditions.operationType === normalizedOperationType);
    }

    async getOperationInfo(definition: any): Promise<OperationInfo> { // tslint:disable-line: no-any
        for (const metadata of this.operationManifestData) {
            if (this._conditionsSatisfied(metadata, definition)) {
                const { connectorId, operationId } = metadata;
                return {
                    connectorId,
                    operationId
                };
            }
        }

        throw new Error("Manifest operation not found");        
    }

    async getOperationManifest(connectorId: string, operationId: string): Promise<OperationManifest> {
        const manifest = this._lookupOperationManifest(connectorId, operationId);
        if (manifest) {
            return manifest;
        } else {
            throw new Error("Manifest not found");        
        }
    }

    getSplitOnOutputs(connectorId: string, operationId: string, splitOn: SplitOn): any {
        const manifest = this._lookupOperationManifest(connectorId, operationId);
        if (manifest) {
            if (splitOn === undefined) {
                return manifest.properties.outputs;
            } else {
                // TODO(tonytang): Support split on trigger.
                throw new Error("Method not implemented.");
            }
        } else {
            throw new Error("Manifest not found");        
        }
    }

    private _conditionsSatisfied(metadata: Metadata, definition: any): boolean { // tslint:disable-line: no-any
        const normalizedOperationType = definition.type.toLowerCase();
        const { operationType, inputsExistance } = metadata.conditions;

        if (operationType !== normalizedOperationType) {
            return false;
        }

        if (inputsExistance && definition.inputs && definition.inputs[inputsExistance] === undefined) {
            return false;
        }

        return true;
    }

    private _lookupOperationManifest(connectorId: string, operationId: string): OperationManifest | undefined {
        for (const metadata of this.operationManifestData) {
            if (metadata.connectorId === connectorId && metadata.operationId === operationId) {
                return metadata.manifest;
            }
        }

        return undefined;
    }
}