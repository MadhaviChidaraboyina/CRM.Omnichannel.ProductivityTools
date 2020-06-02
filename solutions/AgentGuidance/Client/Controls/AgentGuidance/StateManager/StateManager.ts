/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../CommonReferences.ts"/>

module MscrmControls.ProductivityToolAgentGuidance {
    export class StateManager {

        private context: Mscrm.ControlData<IInputBag>;
        private dataManager: DataManager;
        private telemetryContext: string;
        private telemetryLogger: TelemetryLogger;
        private cifExternalUtil: Microsoft.CIFramework.External.CIFExternalUtilityImpl;

        constructor(context: Mscrm.ControlData<IInputBag>) {
            this.context = context;
            this.dataManager = new DataManager(context);
            this.telemetryContext = TelemetryComponents.PanelState;
            this.telemetryLogger = new TelemetryLogger(context);
            if (Microsoft.CIFramework && Microsoft.CIFramework.External) {
                this.cifExternalUtil = new Microsoft.CIFramework.External.CIFExternalUtilityImpl();
            }
        }

        public static SetState(key: string, data: any) {
            let productivityToolDataModel = JSON.parse(localStorage.getItem(LocalStorageKeyConstants.agentGuidanceDataModel));
            productivityToolDataModel[key] = data;
            localStorage.setItem(LocalStorageKeyConstants.agentGuidanceDataModel, JSON.stringify(productivityToolDataModel));
        }

        public static getState(key: string): any {
            let productivityToolDataModel = JSON.parse(localStorage.getItem(LocalStorageKeyConstants.agentGuidanceDataModel));
            let value = productivityToolDataModel[key];
            return value;
        }

        public static DeleteState(key: string) {
            let productivityToolDataModel = JSON.parse(localStorage.getItem(LocalStorageKeyConstants.agentGuidanceDataModel));
            delete productivityToolDataModel[key];
            localStorage.setItem(LocalStorageKeyConstants.agentGuidanceDataModel, JSON.stringify(productivityToolDataModel));
        }

        public storeSessionTemplateIdInLocStorage(sessionId: string) {
            let sessionTemplateId = this.getSessionTemplateId();
            if (!this.context.utils.isNullOrUndefined(sessionTemplateId) &&
                !this.context.utils.isNullOrEmptyString(sessionTemplateId)) {
                StateManager.SetState(sessionId + LocalStorageKeyConstants.sessionTemplateId, sessionTemplateId);
            }
        }

        public storeLiveWorkStreamIdInLocStorage(sessionId: string) {
            let workStreamId = this.getLiveWorkStreamId();
            if (!this.context.utils.isNullOrUndefined(workStreamId) &&
                !this.context.utils.isNullOrEmptyString(workStreamId)) {
                StateManager.SetState(sessionId + LocalStorageKeyConstants.liveWorkStreamId, workStreamId);
            }
        }

        private getSessionTemplateId(): string {
            let methodName = "getSessionTemplateId";
            let sessionTemplateId: string = "";

            try {
                sessionTemplateId = this.cifExternalUtil.getTemplateForSession();
            } catch (error) {
                let errorMsg = "Failed to retrieve session template id from form param";
                let errorParams = new EventParameters();
                errorParams.addParameter("errorDetails", error);
                this.telemetryLogger.logError(this.telemetryContext, methodName, errorMsg, errorParams);
            }

            return sessionTemplateId;
        }

        private getLiveWorkStreamId(): string {
            let methodName = "GetLiveWorkStreamId";
            let workStreamId: string = "";

            try {
                let templateParams = this.cifExternalUtil.getSessionTemplateParams();
                let data = JSON.parse(templateParams.data);
                workStreamId = data.ocContext.config.sessionParams.LiveWorkStreamId;
            } catch (error) {
                let errorMsg = "Failed to retrieve Live WorkStream id from form param";
                let errorParams = new EventParameters();
                errorParams.addParameter("errorDetails", error);
                this.telemetryLogger.logError(this.telemetryContext, methodName, errorMsg, errorParams);
            }

            return workStreamId;
        }

        public checkAgentScript(sessionId: string): boolean {
            try {
                // fetching session template id from form param
                let SessionTemplateId: any = StateManager.getState(sessionId + LocalStorageKeyConstants.sessionTemplateId);

                if (this.context.utils.isNullOrUndefined(SessionTemplateId) ||
                    this.context.utils.isNullOrEmptyString(SessionTemplateId)) {
                    return false;
                }

                //check if agent script is available on local storage
                let isAgentScriptAvailable: any = StateManager.getState(SessionTemplateId + LocalStorageKeyConstants.isAgentScriptFound);
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
                let liveWorkStreamId: any = StateManager.getState(sessionId + LocalStorageKeyConstants.liveWorkStreamId);

                if (this.context.utils.isNullOrUndefined(liveWorkStreamId) ||
                    this.context.utils.isNullOrEmptyString(liveWorkStreamId)) {
                    return false;
                }

                //check if smart Assist bot is available 
                let isSmartAssistBotAvailable: any = StateManager.getState(liveWorkStreamId + LocalStorageKeyConstants.isSmartAssistFound);
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

	}
}
