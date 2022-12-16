/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>

module MscrmControls.ProductivityPanel {
    'use strict';

    export class TPBotControl implements Mscrm.StandardControl<IInputBag, IOutputBag> {

        private TPBotContainer: HTMLDivElement = null;
        public static _context: Mscrm.ControlData<IInputBag> = null;
        public static isRTL: boolean = false;
        public static telemetryReporter: TelemetryLogger.TelemetryLogger;

        private conversationId: string | undefined;
        private sessionId: string;
        private handlerId: string;

		/**
		 * Empty constructor.
		 */
        constructor() {

        }

		/**
		 * This function should be used for any initial setup necessary for your control.
		 * @params context The "Input Bag" containing the parameters and other control metadata.
		 * @params notifyOutputchanged The method for this control to notify the framework that it has new outputs
		 * @params state The user state for this control set from setState in the last session
		 * @params container The div element to draw this control in
		 */
        public async init(context: Mscrm.ControlData<IInputBag>, notifyOutputChanged: () => void, state: Mscrm.Dictionary, container: HTMLDivElement): Promise<void> {
                        
            let methodName = "init";
            // Initialize Telemetry Repoter
            TPBotControl.telemetryReporter = new TelemetryLogger.TelemetryLogger(context, TPBot.Constants.ControlId);

            const timer = TPBotControl.telemetryReporter.startTimer(methodName);
            const params = new TelemetryLogger.EventParameters();

            try {

                // Get conversation and session IDs for the current session.
                this.conversationId = await TPBot.ConversationStateManager.GetCurrentConversation();
                this.sessionId = Xrm.App.sessions.getFocusedSession().sessionId;
                
                params.addParameter("ConversationId", this.conversationId);
                params.addParameter("SessionId", this.sessionId);

                if (this.conversationId) {
                    // Determine if this session already has an existing handler for session close. If not, create one.
                    const existingHandlerId = sessionStorage.getItem(`${TPBot.Constants.SessionCloseHandlerStorageKey}-${this.conversationId}`);
                    if (existingHandlerId == null) this.handlerId = Xrm.App.sessions.addOnAfterSessionClose(this.handleSessionClose.bind(this));
                    else this.handlerId = existingHandlerId;
                    sessionStorage.setItem(`${TPBot.Constants.SessionCloseHandlerStorageKey}-${this.conversationId}`, this.handlerId);
                    
                    params.addParameter("HandlerId", this.handlerId);

                    if (context.client.isRTL) {
                        TPBotControl.isRTL = true;
                    }
                    TPBotControl._context = context;

                    // Build outer container for TPBot.
                    this.TPBotContainer = container;
                    var el: HTMLDivElement = document.createElement("div");
                    el.id = TPBot.Constants.TPBotOuterContainer;
                    this.TPBotContainer.appendChild(el);

                    // Retrieve Conversation Control Origin from the service endpoint, register message event listener for handling
                    // third-party bot messages.
                    await Xrm.WebApi.retrieveMultipleRecords(TPBot.Constants.ServiceEndpointEntity, TPBot.Constants.CDNEndpointFilter).then((data: any) => {
                        window[TPBot.Constants.ConversatonControlOrigin] = data.entities[0].path;
                        window.top.addEventListener("message", TPBotControl.receiveMessage, false);
                    });

                    // Render the cards for the first time.
                    await TPBot.TPBotManager.Instance.ReRenderCards(this.conversationId, TPBotControl.isRTL, "init");
                }
                
                timer.stop(params);
            } catch (error) {
                params.addParameter("ExceptionDetails", error);
                timer.fail("An error occurred while initializing the TPBotControl", params);
                TPBotControl.telemetryReporter.logError(methodName, "An error occurred while initializing the TPBotControl", params);
            }
        }

		/** 
		 * This function will recieve an "Input Bag" containing the values currently assigned to the parameters in your manifest
		 * It will send down the latest values (static or dynamic) that are assigned as defined by the manifest & customization experience
		 * as well as resource, client, and theming info (see mscrm.d.ts)
		 * @params context The "Input Bag" as described above
		 */
        public updateView(context: Mscrm.ControlData<IInputBag>): void {
            TPBotControl._context = context;

            // If coming from a session switch, re-render cards from storage
            TPBot.TPBotManager.Instance.ReRenderCards(this.conversationId, TPBotControl.isRTL, "update-view");
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

        }

        public static getString(resourceName: string): string {
            if (!TPBotControl._context) {
                //TODO: add telemetry.
                return resourceName;
            }
            return TPBotControl._context.resources.getString(resourceName);
        }

        private static async receiveMessage(event: any): Promise<void> {
            //TODO: Uncomment
            //if (window[TPBot.Constants.ConversatonControlOrigin].indexOf(event.origin) == -1)
            //    return;
            if (event.data.messageType != "notifyEvent") {
                return;
            }
            if (event.data && event.data.messageData.get("notificationUXObject")) {
                const messageMap = event.data.messageData.get("notificationUXObject");

                const timer = TPBotControl.telemetryReporter.startTimer("receiveMessage");
                const params = new TelemetryLogger.EventParameters();
                params.addParameter("Type", "third-party");
                
                try {
                    const message = new SmartAssist.Common.Message(messageMap);
                    params.addParameter("ConversationId", message.conversationId);

                    if (message.isValid && message.type === "third-party") {
                        await TPBot.TPBotManager.Instance.RenderTPBotCard(message);

                        // We only need to stop this timer in the successful scenario if this was a TPB message.
                        timer.stop(params);
                    }
                } catch (error) {
                    params.addParameter("ExceptionDetails", error);
                    timer.fail("Failed to receive, parse, or render notificationUXObject message", params);
                }
            }
        }

        private handleSessionClose(context: XrmClientApi.EventContext) {
            // Get the session ID (session-id-X) that's being closed. Ignore if none found.
            const sessionId = (context.getEventArgs() as any).getInputArguments().sessionId;
            if (sessionId == null) return; // Telemetry?

            const params = new TelemetryLogger.EventParameters();
            params.addParameter("ContextSessionId", sessionId);
            params.addParameter("ThisSessionId", this.sessionId);
            params.addParameter("TearingDown", sessionId === this.sessionId);
            TPBotControl.telemetryReporter.logSuccess("handleSessionClose", params);

            if (sessionId === this.sessionId) {

                // Tear down this TPBotControl instance.
                Xrm.App.sessions.removeOnAfterSessionClose(this.handlerId);
                sessionStorage.removeItem(`${TPBot.Constants.SessionCloseHandlerStorageKey}-${this.conversationId}`);

                // TODO(dawolff): delete everything in browser storage for this conversation.
            }
        }
    }
}