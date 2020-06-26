import * as Designer from "../../DesignerDefinitions";
import { testEnvBadge } from "../../../../constants/EnvironmentBadge";
import callscript from "./callscript";
import startTrigger from "./startTrigger";
import { Metadata } from "../../OperationManifest";
import {Utils} from "../../../sharedUtils";
import * as DesignerConstants from "./../../../../constants/DesignerConstants";
import * as SharedDefines from "../../../sharedDefines";


//all connectors
export const customConnectors:Designer.RecommendationConnector[]=[
    {  
        brandColor: DesignerConstants.Constants.BrandColor,
        icon:  DesignerConstants.icons.connector.agentconnector,
        id: DesignerConstants.manifestConnectorIds.callscript,
        title:  Utils.getResourceString("LADESIGNER_CALLSCRIPT_CONNECTOR_DISPLAYNAME")
}];

//all custom actions operations (actions+triggers)
export const CustomActions: Designer.ApiOperation[] =[ 
    {
    id: DesignerConstants.manifestOperationIds.setCallScript,
    type: 'builtin',
    name: DesignerConstants.manifestOperationIds.setCallScript,
    kind:  SharedDefines.Kind.Action,
    properties: {
        api: {
            brandColor:DesignerConstants.Constants.BrandColor,
            displayName: Utils.getResourceString("LADESIGNER_CALLSCRIPT_CONNECTOR_DISPLAYNAME"),
            iconUri: DesignerConstants.icons.operations.setcallscript,
            id: DesignerConstants.manifestConnectorIds.callscript,
        },
        summary: Utils.getResourceString("LADESIGNER_SETCALLSCRIPT_SUMMARY"), //"Set Default Call Script",
        description: Utils.getResourceString("LADESIGNER_SETCALLSCRIPT_DESCRIPTION"),//call script
        environmentBadge: testEnvBadge,
        operationType: 'setcallscript',
        operationKind: SharedDefines.Kind.Action,
        visibility: 'important',
        }
    }
    
];

export const CustomTriggers: Designer.ApiOperation[] =[   
    {
        id: DesignerConstants.manifestOperationIds.start,
        type: 'builtin',
        name: DesignerConstants.manifestOperationIds.start,
        kind: SharedDefines.Kind.Trigger,
        properties: {
            api: {
                brandColor:DesignerConstants.Constants.BrandColor,
                displayName: Utils.getResourceString("LADESIGNER_CALLSCRIPT_CONNECTOR_DISPLAYNAME"),
                iconUri: DesignerConstants.icons.operations.start,
                id: DesignerConstants.manifestConnectorIds.callscript,
            },
            summary: Utils.getResourceString("LADESIGNER_START_SUMMARY"), //"Set Default Call Script",
            description: Utils.getResourceString("LADESIGNER_START_DESCRIPTION"),//call script
            environmentBadge: testEnvBadge,
            operationType: 'start',
            operationKind: SharedDefines.Kind.Trigger,
            visibility: 'important',
            }
    
    }
];

//list of operationManifest operations with their json.
export const operationManifestMetadata: Metadata[] = [
    {
        conditions: {
            operationType: 'setcallscript'
        },
        connectorId: DesignerConstants.manifestConnectorIds.callscript,
        operationId: DesignerConstants.manifestOperationIds.setCallScript,
        manifest: callscript
    },
    {
        conditions: {
            operationType: 'start'
        },
        connectorId: DesignerConstants.manifestConnectorIds.callscript,
        operationId: DesignerConstants.manifestOperationIds.start,
        manifest: startTrigger
    }
];

export enum LogicAppsCategories {
    LOGIC_APPS_BUILTIN = "LOGIC_APPS_BUILTIN",
    CUSTOM = "CUSTOM"
};

