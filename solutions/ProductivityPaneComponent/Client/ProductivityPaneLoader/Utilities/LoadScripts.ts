/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
module ProductivityPaneLoader {
    export class LoadScripts {
        public static loadMacrosComponentInternal() {
            try {
                let macrosLibScript = document.createElement('script');
                macrosLibScript.src =
                    Xrm.Utility.getGlobalContext().getClientUrl() +
                    '/' +
                    '/WebResources/CRMClients/msdyn_ProductivityMacrosComponent_internal_library.js';
                document.getElementsByTagName('body')[0].appendChild(macrosLibScript);
                console.log('Loaded msdyn_ProductivityMacrosComponent_internal_library.js');
            } catch (error) {
                console.log('Failed to load msdyn_ProductivityMacrosComponent_internal_library.js');
            }
        }
        public static loadLogicAppExecutor() {
            try {
                let macrosLibScript = document.createElement('script');
                macrosLibScript.src =
                    Xrm.Utility.getGlobalContext().getClientUrl() +
                    '/' +
                    '/WebResources/CRMClients/msdyn_LogicAppExecutor_v2.js';
                document.getElementsByTagName('body')[0].appendChild(macrosLibScript);
                console.log('Loaded msdyn_LogicAppExecutor_v2.js');
            } catch (error) {
                console.log('Failed to load msdyn_LogicAppExecutor_v2.js');
            }
        }

        public static loadMacrosDataLayer() {
            try {
                let macrosLibScript = document.createElement('script');
                macrosLibScript.src =
                    Xrm.Utility.getGlobalContext().getClientUrl() +
                    '/' +
                    '/WebResources/MacrosDataLayer/msdyn_MacrosDataLayer.js';
                document.getElementsByTagName('body')[0].appendChild(macrosLibScript);
                console.log('Loaded msdyn_MacrosDataLayer.js');
            } catch (error) {
                console.log('Failed to load msdyn_MacrosDataLayer.js');
            }
        }
    }
}
