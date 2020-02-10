/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../CommonReferences.ts"/>

module MscrmControls.ProductivityToolAgentGuidance {
    export class StateManager {

        public static SetState(key: string, data: any) {
            let productivityToolDataModel = JSON.parse(localStorage.getItem(Constants.agentGuidanceDataModel));
            productivityToolDataModel[key] = data;
            localStorage.setItem(Constants.agentGuidanceDataModel, JSON.stringify(productivityToolDataModel));
        }

        public static getState(key: string): any {
            let productivityToolDataModel = JSON.parse(localStorage.getItem(Constants.agentGuidanceDataModel));
            let value = productivityToolDataModel[key];
            return value;
        }

        public static DeleteState(key: string) {
            let productivityToolDataModel = JSON.parse(localStorage.getItem(Constants.agentGuidanceDataModel));
            delete productivityToolDataModel[key];
            localStorage.setItem(Constants.agentGuidanceDataModel, JSON.stringify(productivityToolDataModel));
        }
	}
}
