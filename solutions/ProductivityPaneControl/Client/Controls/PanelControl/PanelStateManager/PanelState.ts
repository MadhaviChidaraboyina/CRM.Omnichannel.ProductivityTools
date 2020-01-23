/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../CommonReferences.ts"/>

module MscrmControls.ProductivityToolPanel {
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

        public storeSessionTemplateIdInLocStorage(sessionId: string) {
            let sessionTemplateId = this.getSessionTemplateId();
            if (!this.context.utils.isNullOrUndefined(sessionTemplateId) &&
                !this.context.utils.isNullOrEmptyString(sessionTemplateId)) {
                PanelState.SetState(sessionId + LocalStorageKeyConstants.sessionTemplateId, sessionTemplateId);
            }
        }

        public storeLiveWorkStreamIdInLocStorage(sessionId: string) {
            let workStreamId = this.getLiveWorkStreamId();
            if (!this.context.utils.isNullOrUndefined(workStreamId) &&
                !this.context.utils.isNullOrEmptyString(workStreamId)) {
                PanelState.SetState(sessionId + LocalStorageKeyConstants.liveWorkStreamId, workStreamId);
            }
        }

        public checkAgentScriptAndSmartAssistBot(sessionId: string): boolean {
            if (this.checkAgentScript(sessionId))
                return true;
            else if (this.checkSmartAssist(sessionId))
                return true;

            return false;
        }

        public checkAgentScript(sessionId: string): boolean {
            try {
                // fetching session template id from form param
                let SessionTemplateId: any = PanelState.getState(sessionId + LocalStorageKeyConstants.sessionTemplateId);

                if (this.context.utils.isNullOrUndefined(SessionTemplateId) ||
                    this.context.utils.isNullOrEmptyString(SessionTemplateId)) {
                    return false;
                }

                //check if agent script is available on local storage
                let isAgentScriptAvailable: any = PanelState.getState(SessionTemplateId + LocalStorageKeyConstants.isAgentScriptFound);
                if (isAgentScriptAvailable == null) {
                    this.dataManager.fetchAgentScriptRecords(SessionTemplateId);
                }
                return (isAgentScriptAvailable === true);
            }
            catch (e) {
                console.log("error occured" + e);
                let errorParam = new EventParameters();
                errorParam.addParameter("errorObj", JSON.stringify(e));
                this.telemetryLogger.logError(this.telemetryContext, TelemetryComponents.checkAgentScript, e.message, errorParam);
            }
            return false;
        }


        public checkSmartAssist(sessionId: string): boolean {
            try {
                //fetching Live work stream id from form params
                let liveWorkStreamId: any = PanelState.getState(sessionId + LocalStorageKeyConstants.liveWorkStreamId);

                if (this.context.utils.isNullOrUndefined(liveWorkStreamId) ||
                    this.context.utils.isNullOrEmptyString(liveWorkStreamId)) {
                    return false;
                }

                //check if smart Assist bot is available 
                let isSmartAssistBotAvailable: any = PanelState.getState(liveWorkStreamId + LocalStorageKeyConstants.isSmartAssistFound);
                if (isSmartAssistBotAvailable == null) {
                    this.dataManager.fetchSmartAssistRecords(liveWorkStreamId);
                }

                return (isSmartAssistBotAvailable === true);
            }
            catch (e) {
                console.log("error occured" + e);
                let errorParam = new EventParameters();
                errorParam.addParameter("errorObj", JSON.stringify(e));
                this.telemetryLogger.logError(this.telemetryContext, TelemetryComponents.checkSmartAssist, e.message, errorParam);
            }

            return false;
        }

        // fetching Live work stream id from form params
        private getLiveWorkStreamId(): string {
            let methodName = "GetLiveWorkStreamId";
            let workStreamId: string = "";

            try {
                //couldn't retrieve from CIF, fetch from form query parameters
                let queryStringParameters = (window as any).Xrm.Page.context.getQueryStringParameters();
                workStreamId = queryStringParameters.ocContext.config.sessionParams.LiveWorkStreamId;
            } catch (error) {
                let errorMsg = "Failed to retrieve Live WorkStream id from form param";
                let errorParams = new EventParameters();
                errorParams.addParameter("errorDetails", error);
                this.telemetryLogger.logError(this.telemetryContext, methodName, errorMsg, errorParams);
            }

            return workStreamId;
        }

        /**
         * Get session template id for focussed session
         * @param uciSessionId uci session id
         * @returns Session template id
         */
        private getSessionTemplateId(): string {
            let methodName = "getSessionTemplateId";
            let sessionTemplateId: string = "";

            try {
                //couldn't retrieve from CIF, fetch from form query parameters
                let queryStringParameters = (window as any).Xrm.Page.context.getQueryStringParameters();
                sessionTemplateId = queryStringParameters.templateId;
            } catch (error) {
                let errorMsg = "Failed to retrieve session template id from form param";
                let errorParams = new EventParameters();
                errorParams.addParameter("errorDetails", error);
                this.telemetryLogger.logError(this.telemetryContext, methodName, errorMsg, errorParams);
            }

            return sessionTemplateId;
        }

	}
}
