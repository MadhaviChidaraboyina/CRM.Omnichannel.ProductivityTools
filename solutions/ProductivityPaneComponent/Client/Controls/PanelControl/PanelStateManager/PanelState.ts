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
        private tabId: number;

        constructor(context: Mscrm.ControlData<IInputBag>) {
            this.context = context;
            this.dataManager = new DataManager(context);
            this.telemetryContext = TelemetryComponents.PanelState;
            this.telemetryLogger = new TelemetryLogger(context);
            this.tabId = Math.random();
        }

        public init() {
            sessionStorage.setItem(LocalStorageKeyConstants.productivityToolDataModel + this.tabId, JSON.stringify({}));
        }

        public deinit() {
            delete sessionStorage[LocalStorageKeyConstants.productivityToolDataModel + this.tabId];
        }

        public SetState(key: string, data: any) {
            let productivityToolDataModel = JSON.parse(sessionStorage.getItem(LocalStorageKeyConstants.productivityToolDataModel + this.tabId));
            productivityToolDataModel[key] = data;
            sessionStorage.setItem(LocalStorageKeyConstants.productivityToolDataModel + this.tabId, JSON.stringify(productivityToolDataModel));
        }

        public getState(key: string): any {
            let productivityToolDataModel = JSON.parse(sessionStorage.getItem(LocalStorageKeyConstants.productivityToolDataModel + this.tabId));
            let value = productivityToolDataModel[key];
            return value;
        }

        public DeleteState(key: string) {
            let productivityToolDataModel = JSON.parse(sessionStorage.getItem(LocalStorageKeyConstants.productivityToolDataModel + this.tabId));
            delete productivityToolDataModel[key];
            sessionStorage.setItem(LocalStorageKeyConstants.productivityToolDataModel + this.tabId, JSON.stringify(productivityToolDataModel));
        }

        public GetAllSessionData(key: string): any {
            if (sessionStorage.getItem(key)) {
                let sessionData = JSON.parse(sessionStorage.getItem(key));
                return sessionData;
            }
        }

	}
}
