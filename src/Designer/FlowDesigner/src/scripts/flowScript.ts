import * as Designer from "./DesignerDefinitions";
import { Utils } from "./sharedUtils";
import { testEnvBadge } from "../constants/EnvironmentBadge";
import * as DesignerConstants from "./../constants/DesignerConstants";

export default <Designer.OperationManifest>{
    properties: {
        iconUri: DesignerConstants.icons.operations.listFlows,
        brandColor: DesignerConstants.Constants.BrandColor,
        description: Utils.getResourceString("FLOW_ACTION_DESCRIPTION"),
        environmentBadge: testEnvBadge,

        inputs: {
            type: 'object',
            properties: {
                entityLogicalName: {
                    title: Utils.getResourceString("ENTITY_NAME_TITLE"),
                    description: Utils.getResourceString("ENTITY_NAME_DESCRIPTION"),
                    type: 'string',
                    'x-ms-property-name-alias': 'entityLogicalName',
                    'x-ms-dynamic-values': {
                        'operationId': 'entityLogicalName',
                        'parameters': {},
                        'value-collection': 'value',
                        'value-path': 'Name',
                        'value-title': 'DisplayName'
                    }
                },
                entityRecordId: {
                    title: Utils.getResourceString("ENTITY_RECORD_ID_TITLE"),
                    description: Utils.getResourceString("ENTITY_RECORD_ID_DESCRIPTION"),
                    type: 'string',
                },
                flowId: {
                    title: Utils.getResourceString("FLOW_ID_TITLE"),
                    description: Utils.getResourceString("FLOW_ID_DESCRIPTION"),
                    type: 'string',
                    'x-ms-property-name-alias': 'flowId',
                    'x-ms-dynamic-values': {
                        'operationId': 'ListFlows',
                        'parameters': { "entityLogicalName": { "parameter": "entityLogicalName", "parameterReference": "entityLogicalName" } },
                        'itemsPath': 'value',
                        'itemValuePath': 'Name',
                        'itemTitlePath': 'DisplayName'
                    }
                },

            },
            required: ['flowId', 'entityLogicalName', 'entityRecordId']
        },
        isInputsOptional: false,

        isOutputsOptional: true,
    }
};
