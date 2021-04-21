/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="../../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApiInternal.d.ts" />
/// <reference path="./Constants.ts" />
module ProductivityPaneLoader {
    export class Utils {
        public static isNullOrUndefined(obj: any) {
            return obj === null || obj === undefined;
        }

        public static isEmpty(str: string): boolean {
            return str === '';
        }

        /**
         * Indicate if the control is loaded via app side panes
         */
        public static isUsingAppSidePanes(): boolean {
            return Xrm.Internal.isFeatureEnabled(FcbConstants.useAppSidePanes);
        }
    }
}
