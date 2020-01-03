import { OperationManifest } from "../../OperationManifest";
import { testEnvBadge } from "../../../../constants/EnvironmentBadge";
import {Utils} from "../../../sharedUtils";
import * as DesignerConstants from "./../../../../constants/DesignerConstants";

export default <OperationManifest>{
    properties: {
        iconUri: DesignerConstants.icons.operations.start,
        brandColor: DesignerConstants.Constants.BrandColor,
        description: Utils.getResourceString("LADESIGNER_START_DESCRIPTION"),
        environmentBadge: testEnvBadge,
    }
};
