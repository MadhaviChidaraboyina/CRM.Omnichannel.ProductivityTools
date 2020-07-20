import { OperationManifest } from "../../OperationManifest";
import { testEnvBadge } from "../../../../constants/EnvironmentBadge";
import { AgentScriptUtils } from "../../utilities/agentScriptUtils";
import * as DesignerConstants from "./../../../../constants/DesignerConstants";

export default <OperationManifest>{
    properties: {
        iconUri: DesignerConstants.icons.operations.setcallscript,
        brandColor: DesignerConstants.Constants.BrandColor,
        description: AgentScriptUtils.getResourceString("LADESIGNER_SETCALLSCRIPT_DESCRIPTION"),
        environmentBadge: testEnvBadge,

        inputs: {
            type: 'object',
            properties: {
                callscriptId: {
                    title: AgentScriptUtils.getResourceString("LADESIGNER_SETCALLSCRIPT_INPUT_ID_TITLE"),//'Set Default Call script',
                    description: AgentScriptUtils.getResourceString("LADESIGNER_SETCALLSCRIPT_INPUT_ID_DESCRIPTION"),//'Set the default call script',
                    type: 'string',
                    'x-ms-property-name-alias': 'callscriptId',
                    'x-ms-dynamic-list': {
                        'operationId': 'setcallscript',
                        'parameters': {},
                        'itemsPath': 'value',
                        'itemValuePath': 'Name',
                        'itemTitlePath': 'DisplayName'
                    }
                }/*,
                explicitDependencies: {
                    type: 'object',
                    properties: {
                        actions: {
                            title: 'JAVASCRIPT_INPUTS',
                            description: 'JAVASCRIPT_INPUTS',
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        },
                        includeTrigger: {
                            title: 'JAVASCRIPT_INPUTS_TRIGGER_TITLE',
                            description: 'JAVASCRIPT_INPUTS_TRIGGER_TITLE',
                            type: 'boolean'
                        }
                    }
                }*/
            },
            required: ['callscriptId']
        },
        isInputsOptional: false,

        isOutputsOptional: true,
    }
};
