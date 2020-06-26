/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../CommonReferences.ts"/>

module MscrmControls.PanelControl {
    export class PanelState {
        private context: Mscrm.ControlData<IInputBag>;
        private dataManager: DataManager;
        private telemetryContext: string;
        private telemetryLogger: TelemetryLogger;

        constructor(context: Mscrm.ControlData<IInputBag>) {
            this.context = context;
            this.dataManager = new DataManager(context);
            this.telemetryContext = TelemetryComponents.PanelState;
            this.telemetryLogger = new TelemetryLogger(context);
        }

        public static SetState(key: string, data: any) {
            let productivityToolDataModel = JSON.parse(localStorage.getItem(LocalStorageKeyConstants.productivityToolDataModel));
            productivityToolDataModel[key] = data;
            localStorage.setItem(LocalStorageKeyConstants.productivityToolDataModel, JSON.stringify(productivityToolDataModel));
        }

        public static getState(key: string): any {
            let productivityToolDataModel = JSON.parse(localStorage.getItem(LocalStorageKeyConstants.productivityToolDataModel));
            let value = productivityToolDataModel[key];
            return value;
        }

        public static DeleteState(key: string) {
            let productivityToolDataModel = JSON.parse(localStorage.getItem(LocalStorageKeyConstants.productivityToolDataModel));
            delete productivityToolDataModel[key];
            localStorage.setItem(LocalStorageKeyConstants.productivityToolDataModel, JSON.stringify(productivityToolDataModel));
        }

        public static GetAllSessionData(key: string): any {
            if (localStorage.getItem(key)) {
                let sessionData = JSON.parse(localStorage.getItem(key));
                return sessionData;
            }
        }
        

	}
}
