﻿/**
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
        private AnyEntityContainerState: AnyEntityContainerState = AnyEntityContainerState.Enabled;
        private recordId: string;
        private anyEntityDataManager: AnyEntityDataManager = null;
        private parentDivId: string = "";
        private _sessionStateManager: SessionStateManager;
        private _sessionStorageManager: SessionStorageManager;
        private _handleDismissEvent: (args: any) => void;
        private sessionCloseHandlerId: string;
        private receiveFPBMessageEventHandler: any;

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
            window.top.addEventListener(StringConstants.DismissCardEvent, this._handleDismissEvent, false);
            this.sessionCloseHandlerId = Microsoft.AppRuntime.Sessions.addOnAfterSessionClose(this.handleSessionClose.bind(this));
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
                    this.anyEntityDataManager.initializeContextParameters(context);

                    // inner container
                    this.constructAnyEntityInnerContainers();

                    this.registerBotEventHandler();
                    this.initCompleted = true;
                }
                // fromcache: true; fromServer: false;
                this.InitiateSuggestionControl();
            }
            catch (error) {
                this.hideLoader();
                //Log error
                let eventParameters = new TelemetryLogger.EventParameters();
                eventParameters.addParameter("Exception Details", error.message);
                SmartAssistAnyEntityControl._telemetryReporter.logError("MainComponent", "init", "Smart Assist Any Entity Control Init error", eventParameters);
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
            this.anyEntityDataManager.initializeContextParameters(context);

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
            Microsoft.AppRuntime.Sessions.removeOnAfterSessionClose(this.sessionCloseHandlerId);
            this._sessionStateManager = null;
            this._sessionStorageManager = null;

            // Remove listener on session close
            window.top.removeEventListener("message", this.receiveFPBMessageEventHandler, false);

        }

        /**
         * Intitiate Recomendation Control
         */
        public async InitiateSuggestionControl(isFPBot = false): Promise<void> {

            //Get Current context
            await this.getCurrentContext();
            this.showLoader();
            if (this.saConfig.SuggestionType == SuggestionType.BotSuggestion && this.AnyEntityContainerState == AnyEntityContainerState.Enabled) {
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
                var data;                
                if (this.AnyEntityContainerState != AnyEntityContainerState.Enabled) {
                    this.appendTitle();
                    var noSuggestionElm = document.getElementById(StringConstants.NoSugegstionsDivId + this.saConfig.SmartassistConfigurationId);
                    if (!noSuggestionElm) {
                        var emptyRecordElm = ViewTemplates.getSuggestionTemplate(this.saConfig, this.AnyEntityContainerState);
                        $("#" + this.parentDivId).append(emptyRecordElm);
                    }
                }
                else if (this.saConfig.IsValid) {
                    this.appendTitle();

                    // Get Suggestions data records for provide saConfig
                    if (isFPBot == true) {
                        data = await this.anyEntityDataManager.getSuggestionsDataFromAPI(this.saConfig, this.recordId) as { [key: string]: any };
                    }
                    else {
                        data = await this.anyEntityDataManager.getSuggestionsData(this.saConfig, this.recordId) as { [key: string]: any };
                    }

                    var dataLength = 0;
                    if (data && data[this.saConfig.SmartassistConfigurationId]) {
                        dataLength = data[this.saConfig.SmartassistConfigurationId].length;
                    }

                    if (dataLength < 1) {
                        var noSuggestionElm = document.getElementById(StringConstants.NoSugegstionsDivId + this.saConfig.SmartassistConfigurationId);
                        if (!noSuggestionElm) {
                            var emptyRecordElm = ViewTemplates.getSuggestionTemplate(this.saConfig, this.AnyEntityContainerState);
                            $("#" + this.parentDivId).append(emptyRecordElm);
                        }
                    }
                    for (let i = 0; i <= (dataLength - 1); i++) {
                        var record = data[this.saConfig.SmartassistConfigurationId][i];
                        const componentId = Utility.getRCComponentId(record.SuggestionId);
                        let properties: any =
                        {
                            parameters: {
                                data: {
                                    Type: "Multiple",
                                    Primary: false,
                                    Static: true,
                                    Usage: 1, // input
                                    Value: record
                                },
                                Template: {
                                    Type: "Multiple",
                                    Primary: false,
                                    Static: true,
                                    Usage: 1,
                                    Value: this.saConfig.ACTemplate
                                }
                            },
                            key: componentId,
                            id: componentId,
                        };
                        var divElement = document.createElement("div");
                        divElement.id = "Suggestion_" + record.SuggestionId;

                        //Initiate Suggestion Control
                        const suggestionControl = SmartAssistAnyEntityControl._context.factory.createComponent("MscrmControls.Smartassist.RecommendationControl", componentId, properties);
                        SmartAssistAnyEntityControl._context.utils.bindDOMElement(suggestionControl, divElement);
                        $("#" + StringConstants.AnyEntityInnerDiv + this.saConfig.SmartassistConfigurationId).append(divElement);
                    }
                }
            }
            setTimeout(() => {
                this.hideLoader();
            }, StringConstants.LoaderTimeout);
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
            } catch (error) {
                let eventParameters = new TelemetryLogger.EventParameters();
                eventParameters.addParameter("Exception Details", error.message);
                let message = "Failed to dismiss previous suggestions";
                SmartAssistAnyEntityControl._telemetryReporter.logError("MainComponent", "dismissPreviousSuggestions", message, eventParameters);
            }
            $("#" + StringConstants.AnyEntityContainer + this.saConfig.SmartassistConfigurationId).empty();
        }

        /** Append title for Specific SA suggestions */
        private appendTitle() {
            var titleElm = document.getElementById(StringConstants.TitleDivId + this.saConfig.SmartassistConfigurationId);
            if (!titleElm) {
                var titleElement = ViewTemplates.getTitleTemplate(StringConstants.TitleDivId + this.saConfig.SmartassistConfigurationId, this.saConfig.TitleIconePath, this.saConfig.SAConfigTitle);
                $("#" + this.parentDivId).prepend(titleElement)
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
                let eventParameters = new TelemetryLogger.EventParameters();
                eventParameters.addParameter("SAConfig", context.parameters.SAConfig.raw);
                eventParameters.addParameter("RecordId", context.parameters.RecordId.raw);
                SmartAssistAnyEntityControl._telemetryReporter.logError("MainComponent", "validateParameters", errorMessage, eventParameters);
                throw errorMessage;
            }
        }

        private handleSessionClose(event: any) {
            try {
                const sessionId = event.getEventArgs()._inputArguments.sessionId;
                const cacheData = window.sessionStorage.getItem(sessionId)
                if (cacheData) {
                    const suggestionIds = JSON.parse(cacheData) as Array<string>;
                    suggestionIds.forEach(id => this._sessionStorageManager.deleteRecord(id));
                    window.sessionStorage.removeItem(sessionId);
                }
            } catch (error) {
                // TODo: Unable to clear cache.
            }
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
                        var seconds = 1;
                        el.style.transition = "opacity " + seconds + "s ease";
                        el.style.opacity = "0";
                        setTimeout(function () {
                            SmartAssistAnyEntityControl._context.utils.unbindDOMComponent(componentId);
                            el.parentNode.removeChild(el);
                        }, speed);

                        this._sessionStateManager.deleteRecord(this.recordId, this.saConfig.SmartassistConfigurationId, suggestionId);
                    }

                    const dataToOverride = args.detail.data;
                    this._sessionStorageManager.updateSuggestionData(suggestionId, dataToOverride);
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
                        }
                    } catch (error) {
                        let eventParameters = new TelemetryLogger.EventParameters();
                        eventParameters.addParameter("Exception Details", error.message);
                        let message = "Failed to render FPB suggestions";
                        SmartAssistAnyEntityControl._telemetryReporter.logError("MainComponent", "receiveMessage", message, eventParameters);
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