/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
module ProductivityPaneLoader {
    export class LoadScripts {
        public static loadMacrosComponentInternal() {
            try {
                let macrosLibScript = document.createElement('script');
                macrosLibScript.src = `${Xrm.Utility.getGlobalContext().getClientUrl()}//WebResources/CRMClients/msdyn_ProductivityMacrosComponent_internal_library.js`;
                document.getElementsByTagName('body')[0].appendChild(macrosLibScript);
                Logger.logInfo(
                    EventType.SCRIPT_LOAD_SUCCESS,
                    `${Constants.productivityToolsLogPrefix} Success: loaded msdyn_ProductivityMacrosComponent_internal_library.js`,
                );
            } catch (error) {
                Logger.logError(
                    EventType.SCRIPT_LOAD_FAILURE,
                    `${Constants.productivityToolsLogPrefix} Failed to load msdyn_ProductivityMacrosComponent_internal_library.js`,
                    error,
                );
            }
        }
        public static loadLogicAppExecutor() {
            try {
                let macrosLibScript = document.createElement('script');
                macrosLibScript.src = `${Xrm.Utility.getGlobalContext().getClientUrl()}//WebResources/CRMClients/msdyn_LogicAppExecutor_v2.js`;
                document.getElementsByTagName('body')[0].appendChild(macrosLibScript);
                Logger.logInfo(
                    EventType.SCRIPT_LOAD_SUCCESS,
                    `${Constants.productivityToolsLogPrefix} Success: loaded msdyn_LogicAppExecutor_v2.js`,
                );
            } catch (error) {
                Logger.logError(
                    EventType.SCRIPT_LOAD_FAILURE,
                    `${Constants.productivityToolsLogPrefix} Failed to load msdyn_LogicAppExecutor_v2.js`,
                    error,
                );
            }
        }

        public static loadMacrosDataLayer() {
            try {
                let macrosLibScript = document.createElement('script');
                macrosLibScript.src = `${Xrm.Utility.getGlobalContext().getClientUrl()}//WebResources/MacrosDataLayer/msdyn_MacrosDataLayer.js`;
                document.getElementsByTagName('body')[0].appendChild(macrosLibScript);
                Logger.logInfo(
                    EventType.SCRIPT_LOAD_SUCCESS,
                    `${Constants.productivityToolsLogPrefix} Success: loaded msdyn_MacrosDataLayer.js`,
                );
            } catch (error) {
                Logger.logError(
                    EventType.SCRIPT_LOAD_FAILURE,
                    `${Constants.productivityToolsLogPrefix} Failed to load msdyn_MacrosDataLayer.js`,
                    error,
                );
            }
        }
    }
}
