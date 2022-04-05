/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>

module MscrmControls.SmartAssistAnyEntityControl {
    'use strict';

    export class SmartAssistAnyEntityControl implements Mscrm.StandardControl<IInputBag, IOutputBag> {
        public static _context: Mscrm.ControlData<IInputBag> = null;
        public static _telemetryReporter: TelemetryLogger.TelemetryLogger = null;
        public static _sessionContext: AppRuntimeClientSdk.ISessionContext = null;
        private anyEntityContainer: HTMLDivElement = null;
        private initCompleted: boolean;
        private saConfig: SAConfig = null;
        private locString: { [key: string]: string };
        private AnyEntityContainerState: AnyEntityContainerState = AnyEntityContainerState.Enabled;
        private recordId: string;
        private anyEntityDataManager: AnyEntityDataManager = null;
        private parentDivId: string = "";
        private _sessionStateManager: SessionStateManager;
        private _sessionStorageManager: SessionStorageManager;
        private _handleDismissEvent: (args: any) => void;
        private sessionCloseHandlerId: string;
        private receiveFPBMessageEventHandler: any;
        private _cachePoolManager: CachePoolManager;
        private telemetryHelper: TelemetryHelper;

		/**
		 * Empty constructor.
		 */
        constructor() {
            this.initCompleted = false;
            this.anyEntityDataManager = new AnyEntityDataManager();
            this._sessionStateManager = SessionStateManager.Instance;
            this._sessionStorageManager = SessionStorageManager.Instance;
            this._handleDismissEvent = this.handleDismissEvent.bind(this);
            this.receiveFPBMessageEventHandler = this.receiveMessage.bind(this);
            this._cachePoolManager = CachePoolManager.Instance;
            window.top.addEventListener(StringConstants.DismissCardEvent, this._handleDismissEvent, false);
            this.handleSessionClose();
        }

		/**
		 * This function should be used for any initial setup necessary for your control.
		 * @params context The "Input Bag" containing the parameters and other control metadata.
		 * @params notifyOutputchanged The method for this control to notify the framework that it has new outputs
		 * @params state The user state for this control set from setState in the last session
		 * @params container The div element to draw this control in
		 */
        public init(context: Mscrm.ControlData<IInputBag>, notifyOutputChanged: () => void, state: Mscrm.Dictionary, container: HTMLDivElement): void {
            try {
                if (this.initCompleted == false) {
                    SmartAssistAnyEntityControl._context = context;
                    SmartAssistAnyEntityControl._context.reporting.reportSuccess(TelemetryEventTypes.InitStarted);
                    SmartAssistAnyEntityControl._telemetryReporter = new TelemetryLogger.TelemetryLogger(context, "MscrmControls.SmartAssistAnyEntityControl.SmartAssistAnyEntityControl")
                    this.anyEntityContainer = container;
                    this.validateParameters(context);
                    this.recordId = context.parameters.RecordId.raw;
                    this.saConfig = context.parameters.SAConfig.raw as any;
                    this.AnyEntityContainerState = context.parameters.AnyEntityContainerState.raw as any;

                    // Anyentity Main Container
                    this.parentDivId = StringConstants.AnyEntityContainer + this.saConfig.SmartassistConfigurationId;
                    var anyEntityElement: HTMLDivElement = document.createElement("div");
                    anyEntityElement.id = this.parentDivId;
                    this.anyEntityContainer.appendChild(anyEntityElement);
                    this.telemetryHelper = new TelemetryHelper(this.recordId, this.saConfig);
                    this.anyEntityDataManager.initializeOtherParameters(context, this.telemetryHelper);
                    
                    // inner container
                    this.constructAnyEntityInnerContainers();

                    this.registerBotEventHandler();
                    this.initCompleted = true;
                }

                this.InitiateSuggestionControl();
            }
            catch (error) {
                this.hideLoader();
                this.telemetryHelper.logTelemetryError(TelemetryEventTypes.InitFailed, error, null);
            }
        }

		/** 
		 * This function will recieve an "Input Bag" containing the values currently assigned to the parameters in your manifest
		 * It will send down the latest values (static or dynamic) that are assigned as defined by the manifest & customization experience
		 * as well as resource, client, and theming info (see mscrm.d.ts)
		 * @params context The "Input Bag" as described above
		 */
        public updateView(context: Mscrm.ControlData<IInputBag>): void {
            // custom code goes here
            this.anyEntityDataManager.initializeOtherParameters(context, this.telemetryHelper);

            //Note: call getCurrentContext to get current session context on tab switch, 
            //currently it's destroyed everytime but this is temp solution, when this issue is fixed need to get context tab switch as well.
        }

		/** 
		 * This function will return an "Output Bag" to the Crm Infrastructure
		 * The ouputs will contain a value for each property marked as "input-output"/"bound" in your manifest 
		 * i.e. if your manifest has a property "value" that is an "input-output", and you want to set that to the local variable "myvalue" you should return:
		 * {
		 *		value: myvalue
		 * };
		 * @returns The "Output Bag" containing values to pass to the infrastructure
		 */
        public getOutputs(): IOutputBag {
            // custom code goes here - remove the line below and return the correct output
            return null;
        }

		/**
		 * This function will be called when the control is destroyed
		 * It should be used for cleanup and releasing any memory the control is using
		 */
        public destroy(): void {
            window.top.removeEventListener(StringConstants.DismissCardEvent, this._handleDismissEvent, false);
            this._sessionStateManager = null;
            this._sessionStorageManager = null;

            // Remove listener on session close
            window.top.removeEventListener("message", this.receiveFPBMessageEventHandler, false);
        }

        /**
         * Intitiate Recomendation Control
         */
        public async InitiateSuggestionControl(isFPBot = false): Promise<void> {

            // logging initialization . ControlInitializationStarted
            this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.ControlInitializationStarted, null);

            // Get Current context
            await this.getCurrentContext();

            await Utility.checkAndTurnOnSuggestionModeling(this.telemetryHelper);
            
            if (this.saConfig.SuggestionType == SuggestionType.BotSuggestion && this.AnyEntityContainerState == AnyEntityContainerState.Enabled) {
                this.showLoader();
                //TODO: add telemetry for all the scenarios
                this.appendTitle();
                const componentId = "TPBot";
                let properties: any =
                {
                    parameters: {},
                    key: componentId,
                    id: componentId,
                };
                var divElement = document.createElement("div");
                divElement.id = "Component_TPBot";

                //Initiate Suggestion Control
                let suggestionControl = SmartAssistAnyEntityControl._context.factory.createComponent("MscrmControls.ProductivityPanel.TPBotControl", componentId, properties);
                SmartAssistAnyEntityControl._context.utils.bindDOMElement(suggestionControl, divElement);
                $("#" + StringConstants.AnyEntityInnerDiv + this.saConfig.SmartassistConfigurationId).append(divElement);
            }
            else {
                //TODO: add telemetry for all the scenarios

                // Turn off AI suggestions for non-english user if multi-lingual FCB is off
                let englishOrgAndEnglishUser = true;
                if (SmartAssistAnyEntityControl._context.orgSettings && SmartAssistAnyEntityControl._context.userSettings) {
                    englishOrgAndEnglishUser = SmartAssistAnyEntityControl._context.orgSettings.languageId == 1033 && SmartAssistAnyEntityControl._context.userSettings.languageId == 1033;
                }

                var data;
                if (this.AnyEntityContainerState != AnyEntityContainerState.Enabled || (!SmartAssistAnyEntityControl._context.utils.isFeatureEnabled("SmartAssistMultilingualSupport") && !englishOrgAndEnglishUser)) {
                    this.showLoader();
                    if (!SmartAssistAnyEntityControl._context.utils.isFeatureEnabled("SmartAssistMultilingualSupport") && !englishOrgAndEnglishUser) {
                        this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.AISuggestionsNotSupportedForNonEnglishUser, null);
                    }
                    else {
                        this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.ContainerStateIsDisabled, null);
                    }
                    this.appendTitle();
                    var noSuggestionElm = document.getElementById(StringConstants.NoSugegstionsDivId + this.saConfig.SmartassistConfigurationId);
                    if (!noSuggestionElm) {
                        var emptyRecordElm = ViewTemplates.getSuggestionTemplate(this.saConfig, this.AnyEntityContainerState);
                        $("#" + this.parentDivId).append(emptyRecordElm);
                    }
                }
                else if (this.saConfig.IsEnabled) {
                    this.showLoader();
                    this.appendTitle();

                    // Get Suggestions data records for provided saConfig
                    if (isFPBot == true) {
                        data = await this.anyEntityDataManager.getSuggestionsDataFromAPI(this.saConfig, this.recordId) as { [key: string]: any };
                    }
                    else {
                        this.locString = await this.anyEntityDataManager.getLocalizationData(this.saConfig);
                        data = await this.anyEntityDataManager.getSuggestionsData(this.saConfig, this.recordId);
                    }

                    // display backend error message
                    if (typeof data === 'string') {
                        var noSuggestionElm = document.getElementById(StringConstants.NoSugegstionsDivId + this.saConfig.SmartassistConfigurationId);
                        if (!noSuggestionElm) {
                            var emptyRecordElm = ViewTemplates.getSuggestionTemplate(this.saConfig, undefined, data);
                            $("#" + this.parentDivId).append(emptyRecordElm);
                        }
                    } else {
                        var dataLength = 0;
                        if (data && data[this.saConfig.SmartassistConfigurationId]) {
                            dataLength = data[this.saConfig.SmartassistConfigurationId].length;
                        }

                        if (dataLength < 1) {
                            this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.NoDataFound, null);
                            var noSuggestionElm = document.getElementById(StringConstants.NoSugegstionsDivId + this.saConfig.SmartassistConfigurationId);
                            if (!noSuggestionElm) {
                                var emptyRecordElm = ViewTemplates.getSuggestionTemplate(this.saConfig, this.AnyEntityContainerState);
                                $("#" + this.parentDivId).append(emptyRecordElm);
                            }
                        }
                        for (let i = 0; i <= (dataLength - 1); i++) {
                            var record = data[this.saConfig.SmartassistConfigurationId][i];
                            //Initiate Suggestion Control
                            const suggestionControl = this.createAndBindRecommendationControl(record);
                        }
                    }
                }
            }
            setTimeout(() => {
                this.hideLoader();
            }, StringConstants.LoaderTimeout);
        }

        private createAndBindRecommendationControl(record: any, display: string = "block"): string {
            const componentId = Utility.getRCComponentId(record.SuggestionId);
            let data = this.mergeSuggestionDataWithLocalizationData(record);
            let properties: any =
            {
                parameters: {
                    data: {
                        Type: "Multiple",
                        Primary: false,
                        Static: true,
                        Usage: 1, // input
                        Value: data
                    },
                    Template: {
                        Type: "Multiple",
                        Primary: false,
                        Static: true,
                        Usage: 1,
                        Value: this.saConfig.ACTemplate
                    },
                    LocString: {
                        Usage: 3,
                        Value: this.locString,
                        Type: "string"
                    }
                },
                key: componentId,
                id: componentId,
            };

            var divElement = document.createElement("div");
            divElement.id = "Suggestion_" + record.SuggestionId;
            divElement.style.display = display;

            this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.InitiatingRMControl, null);
            //Initiate Suggestion Control
            const suggestionControl = SmartAssistAnyEntityControl._context.factory.createComponent("MscrmControls.Smartassist.RecommendationControl", componentId, properties);
            SmartAssistAnyEntityControl._context.utils.bindDOMElement(suggestionControl, divElement);
            $("#" + StringConstants.AnyEntityInnerDiv + this.saConfig.SmartassistConfigurationId).append(divElement);
            return divElement.id;
        }

        private mergeSuggestionDataWithLocalizationData(record: any) {
            return Object.assign(record, this.locString);
        }

        /**
         * Dismiss all the previus suggestions and clear the cache.
         * */
        private dismissPreviousSuggestions() {
            try {
                var suggestionIds = this._sessionStateManager.getAllRecordsForConfigId(this.recordId, this.saConfig.SmartassistConfigurationId);

                // unbind RM controls for all the previous suggestions and clear suggestions from cache.
                for (let suggestion of suggestionIds) {
                    const componentId = Utility.getRCComponentId(suggestion);
                    var id = "Suggestion_" + suggestion;
                    var el = <HTMLElement>document.querySelector('#' + id);
                    SmartAssistAnyEntityControl._context.utils.unbindDOMComponent(componentId);
                    el.parentNode.removeChild(el);
                    this._sessionStateManager.deleteRecord(this.recordId, this.saConfig.SmartassistConfigurationId, suggestion);
                    this._sessionStorageManager.deleteRecord(suggestion);
                }

                // clear cachepool for previous window.
                this._cachePoolManager.clearCachePoolForConfig(this.saConfig.SmartassistConfigurationId, this.recordId);
                window.sessionStorage.setItem(Utility.getCurrentSessionId(), JSON.stringify([]));
                this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.DismissPreviousSuggestion, null);
            } catch (error) {
                this.telemetryHelper.logTelemetryError(TelemetryEventTypes.FailedToDismissPreviousSuggestion, error, null);
            }
            $("#" + StringConstants.AnyEntityContainer + this.saConfig.SmartassistConfigurationId).empty();
        }

        /** Append title for Specific SA suggestions */
        private appendTitle() {
            var titleElm = document.getElementById(StringConstants.TitleDivId + this.saConfig.SmartassistConfigurationId);
            if (!titleElm) {
                const configTitle = this.getLocalizedTitle(this.saConfig)
                var titleElement = ViewTemplates.getTitleTemplate(StringConstants.TitleDivId + this.saConfig.SmartassistConfigurationId, this.saConfig.TitleIconePath, configTitle);
                $("#" + this.parentDivId).prepend(titleElement)
            }
        }
        
        // this is April release workaround
        // for Bug 2219101: Smart Assist Control shows English headers on localized environments. Also spacing between text and icon is incorrect
        private getLocalizedTitle(saConfig: SAConfig): string {
            switch (saConfig.SuggestionType) {
                case SuggestionType.KnowledgeArticleSuggestion:
                    return Utility.getString(LocalizedStrings.KnowledgeArticleTitle);
                case SuggestionType.SimilarCaseSuggestion:
                    return Utility.getString(LocalizedStrings.SimilarCaseTitle);
                default:
                    return saConfig.SAConfigTitle;
            }
        }

        /**
         * Validates input parameters
         * @param context: The "Input Bag" containing the parameters and other control metadata.
         */
        private validateParameters(context: Mscrm.ControlData<IInputBag>) {
            if (context.utils.isNullOrUndefined(context.parameters.SAConfig.raw)) {
                // one or more required parameters are null or undefined
                let errorMessage = "In-correct parameters are passed.";

                //Log error
                this.telemetryHelper.logTelemetryError(TelemetryEventTypes.ParameterValidationFailed, new Error(errorMessage), null);
                throw errorMessage;
            }
        }

        /**Delete suggestion states on UI session close */
        private handleSessionClose() {
            // TODO: Revert(remove handler from window) this logic when PP is not destroyed in home tab
            if (!window["HandleSuggestionDataOnSessionClose"]) {
                window["HandleSuggestionDataOnSessionClose"] = (event: any) => {
                    var sessions = [];
                    var cachePoolKeys = [];
                    if (event.type == "unload") {
                        var allSessions = Microsoft.AppRuntime.Sessions.getAll();
                        sessions = allSessions;
                        cachePoolKeys = sessions.map(id => "smartassist-" + id + "-cachepool");
                    }
                    else {
                        sessions.push(event.getEventArgs()._inputArguments.sessionId);
                        cachePoolKeys.push("smartassist-" + event.getEventArgs()._inputArguments.sessionId + "-cachepool")
                    }
                    for (let i = 0; i < sessions.length; i++) {
                        const cacheData = window.sessionStorage.getItem(sessions[i]);
                        if (cacheData) {
                            const suggestionIds = JSON.parse(cacheData) as Array<string>;
                            suggestionIds.forEach(id => window.sessionStorage.removeItem(id));
                            window.sessionStorage.removeItem(sessions[i]);
                        }
                    }

                    cachePoolKeys.forEach(cp => window.sessionStorage.removeItem(cp));
                }

                this.sessionCloseHandlerId = Microsoft.AppRuntime.Sessions.addOnAfterSessionClose((<any>window).HandleSuggestionDataOnSessionClose);
                window.addEventListener("unload", (<any>window).HandleSuggestionDataOnSessionClose);
            }
        }

        /**
         * Fetch new suggestion from cachepool.
         * */
        private fetchNewCard(): string {
            var data = this._cachePoolManager.fetchSuggestionFromCachePool(this.recordId, this.saConfig.SmartassistConfigurationId, this.telemetryHelper);
            if (data) {
                this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.DataFetchedFromCachePool, null);
                var id = this.createAndBindRecommendationControl(data, "none");
                this._sessionStateManager.addRecord(this.recordId, this.saConfig.SmartassistConfigurationId, data.SuggestionId);
                this._sessionStorageManager.createRecord(data.SuggestionId, JSON.stringify({ data: data }));
                let suggestionIds = [];
                suggestionIds.push(data.SuggestionId);
                this.anyEntityDataManager.saveAllSuggestionIdsInSessionStorage(suggestionIds);
                return id;
            }
            return null;
        }

        /**
         * Handles dismiss card.
         * @param args: event argument
         */
        private handleDismissEvent(args: any) {
            const suggestionId = args.detail.id;
            try {
                const renderedSuggestionIds = this._sessionStateManager.getAllRecordsForConfigId(this.recordId, this.saConfig.SmartassistConfigurationId);

                if (renderedSuggestionIds.indexOf(suggestionId) != -1) {
                    const componentId = Utility.getRCComponentId(suggestionId);
                    var id = "Suggestion_" + suggestionId;
                    var el = <HTMLElement>document.querySelector('#' + id);
                    if (el) {
                        var speed = 1000;
                        var seconds = 0.5;
                        el.style.transition = "opacity " + seconds + "s ease";
                        el.style.opacity = "0";
                        var self = this;
                        const newCardId = self.fetchNewCard();
                        setTimeout(function () {
                            $("#" + id).slideUp("slow", function () {
                                let moveToNextContainer = false;
                                if ($("#" + id).next().find(".ac-container .ac-selectable").length > 0) {
                                    $("#" + id).next().find(".ac-container .ac-selectable")[0].focus()
                                } else {
                                    moveToNextContainer = true;
                                }

                                $("#" + id).remove();
                                if (moveToNextContainer) {
                                    if ($(".ac-container .ac-selectable").length > 0) {
                                        $(".ac-container .ac-selectable")[0].focus();
                                    }
                                }
                            });
                            if (newCardId) {
                                $("#" + newCardId).fadeIn("slow");
                            }
                        }, speed);

                        self._sessionStateManager.deleteRecord(this.recordId, this.saConfig.SmartassistConfigurationId, suggestionId);
                        self._sessionStorageManager.deleteRecord(suggestionId);

                        // Show empty message if no more suggestions left
                        var suggestions = this._sessionStateManager.getAllRecordsForConfigId(this.recordId, this.saConfig.SmartassistConfigurationId);
                        if (suggestions.length < 1) {
                            self.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.NoSuggestionsFoundAfterDismiss, null);
                            var noSuggestionElm = document.getElementById(StringConstants.NoSugegstionsDivId + this.saConfig.SmartassistConfigurationId);
                            if (!noSuggestionElm) {
                                var emptyRecordElm = ViewTemplates.getSuggestionTemplate(this.saConfig, this.AnyEntityContainerState);
                                $("#" + this.parentDivId).append(emptyRecordElm);
                            }
                        }
                    }
                }
            } catch (error) {
                //Log error
                let eventParameters = new TelemetryLogger.EventParameters();
                eventParameters.addParameter("Exception Details", error.message);
                eventParameters.addParameter("suggestionId", suggestionId)
                let message = "Smart Assist Any Entity Control handleDismissEvent error.";
                SmartAssistAnyEntityControl._telemetryReporter.logError("MainComponent", "handleDismissEvent", message, eventParameters);
            }
        }

        /**Show loader element in the UI */
        private showLoader() {
            $("#" + StringConstants.AnyEntityInnerDiv + this.saConfig.SmartassistConfigurationId).addClass("relative-parent");
            $("#" + Utility.getLoaderComponent(this.saConfig.SmartassistConfigurationId)).removeClass(StringConstants.hideElementCss);
        }

        /**Hide loader element in the UI */
        private hideLoader() {
            $("#" + StringConstants.AnyEntityInnerDiv + this.saConfig.SmartassistConfigurationId).removeClass("relative-parent");
            $("#" + Utility.getLoaderComponent(this.saConfig.SmartassistConfigurationId)).addClass(StringConstants.hideElementCss);
        }

        /**Get CEC current context */
        private async getCurrentContext() {
            const sessionId = Utility.getCurrentSessionId();
            SmartAssistAnyEntityControl._sessionContext = await Microsoft.AppRuntime.Sessions.getSession(sessionId).getContext();
        }

        /**Register message event */
        private async registerBotEventHandler() {
            var anchorContext = await Utility.getAnchorContext();
            //Add message listner for FPB
            if (anchorContext.entityName == StringConstants.LWIEntityName) {
                Xrm.WebApi.retrieveMultipleRecords(StringConstants.ServiceEndpointEntity, StringConstants.CDNEndpointFilter).then((data: any) => {
                    window[StringConstants.ConversatonControlOrigin] = data.entities[0].path;
                    window.top.addEventListener("message", this.receiveFPBMessageEventHandler, false);
                    if (!window['removeCacheForSmartAssist']) {
                        window['removeCacheForSmartAssist'] = (event: any) => {

                            // TODO: Verify and uncomment this condition. 
                            //if (window[Constants.ConversatonControlOrigin].indexOf(event.origin) == -1)
                            //  return;
                            if (event.data.messageType != "notifyEvent") {
                                return;
                            }
                            // clear cache for smart assist if the focus is in home session.
                            if (event.data && event.data.messageData.get("notificationUXObject") && Microsoft.AppRuntime.Sessions.getFocusedSession().sessionId == "session-id-0") {
                                let messageMap = event.data.messageData.get("notificationUXObject");
                                let conversationId = messageMap.get("conversationId");
                                let uiSessionId = messageMap.get("uiSessionId");
                                let tags = messageMap.get("tags");

                                if (conversationId && uiSessionId
                                    && tags.indexOf(StringConstants.FPBTag) != -1) {
                                    Microsoft.AppRuntime.Sessions.getSession(uiSessionId).getContext().then((context) => {
                                        const cacheData = window.sessionStorage.getItem(uiSessionId)
                                        if (cacheData) {
                                            const suggestionIds = JSON.parse(cacheData) as Array<string>;
                                            suggestionIds.forEach(id => window.sessionStorage.removeItem(id));
                                            window.sessionStorage.removeItem(uiSessionId);
                                        }
                                        context.set(conversationId, []);
                                    });

                                }

                            }
                        }
                        window.top.addEventListener("message", (<any>window).removeCacheForSmartAssist)
                    }
                });
            }
        }

        /**
         * Conversation message listner
         * @param event: event payload
         */
        private receiveMessage(event: any): void {
            // TODO: uncomment
            //if (window[Constants.ConversatonControlOrigin].indexOf(event.origin) == -1)
            //  return;
            if (event.data.messageType != "notifyEvent") {
                return;
            }
            if (event.data && event.data.messageData.get("notificationUXObject")) {
                let messageMap = event.data.messageData.get("notificationUXObject");
                let conversationId = messageMap.get("conversationId");
                let uiSessionId = messageMap.get("uiSessionId");
                let tags = messageMap.get("tags");
                if (conversationId && uiSessionId
                    && tags.indexOf(StringConstants.FPBTag) != -1
                    && this.saConfig.UniqueName != StringConstants.TPBotUniqueName) {
                    try {
                        if (this.recordId == conversationId) {
                            this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.FPBEventReceived, null);
                            // remove previous suggestions
                            this.dismissPreviousSuggestions();
                            this.constructAnyEntityInnerContainers();

                            // re-initialize suggestions
                            this.InitiateSuggestionControl(true);
                        } else {
                            // Remove old cached data from conversation than current seesion
                            Utility.getCurrentSessionContextById(uiSessionId).then((context) => {
                                const cacheData = window.sessionStorage.getItem(uiSessionId)
                                if (cacheData) {
                                    const suggestionIds = JSON.parse(cacheData) as Array<string>;
                                    suggestionIds.forEach(id => this._sessionStorageManager.deleteRecord(id));
                                    window.sessionStorage.removeItem(uiSessionId);
                                }
                                SessionStateManager.Instance.deleteAllRecords(context, conversationId);
                            });

                            this.telemetryHelper.logTelemetrySuccess(TelemetryEventTypes.ClearedCacheOnFPBEvent,
                                [
                                    { name: "OtherSessionId", value: uiSessionId },
                                    { name: "OtherRecordId", value: conversationId }
                                ]);
                        }
                    } catch (error) {
                        this.telemetryHelper.logTelemetryError(TelemetryEventTypes.FailedToRenderFPBSuggestion, error, null);
                    }
                }
            }
        }

        /**Add loader element in config div */
        private addConfigLoader() {
            // Loader element
            var loaderElement: HTMLDivElement = document.createElement("div");
            var loaderLocale = Utility.getString(LocalizedStrings.LoadingText);
            loaderElement.innerHTML = ViewTemplates.SALoader.Format(this.saConfig.SmartassistConfigurationId, loaderLocale);
            $("#" + StringConstants.AnyEntityInnerDiv + this.saConfig.SmartassistConfigurationId).append(loaderElement);
        }

        /**Inner container */
        private constructAnyEntityInnerContainers() {
            // Anyentity inner Container with style
            var currentElement = $("#" + this.parentDivId);
            currentElement.html(AnyEntityTemplate.get());
            var innerElm: HTMLDivElement = document.createElement("div");
            innerElm.id = StringConstants.AnyEntityInnerDiv + this.saConfig.SmartassistConfigurationId;
            $("#" + this.parentDivId).append(innerElm);

            //Loder
            this.addConfigLoader();
        }
    }
}