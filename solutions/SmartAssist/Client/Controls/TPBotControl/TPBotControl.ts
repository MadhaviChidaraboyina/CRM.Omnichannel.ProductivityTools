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
        private telemetryReporter: TPBot.TelemetryLogger;
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
        public init(context: Mscrm.ControlData<IInputBag>, notifyOutputChanged: () => void, state: Mscrm.Dictionary, container: HTMLDivElement): void {
                        
            let methodName = "init";
            // Initialize Telemetry Repoter
            this.telemetryReporter = new TPBot.TelemetryLogger(context);

            // Listen for session close
            let handlerId;

            try {
                handlerId = Xrm.App.sessions.addOnAfterSessionClose(this.handleSessionClose);
                if (!context.utils.isNullOrUndefined(handlerId) &&
                    !context.utils.isNullOrEmptyString(handlerId)) {

                    localStorage.setItem(TPBot.Constants.SessionCloseHandlerId, handlerId);
                    let logger = new TPBot.TelemetryLogger(context);
                    TPBot.TPBotManager.Instance.SetLogger(logger);
                    if (context.client.isRTL) {
                        TPBotControl.isRTL = true;
                    }
                    TPBotControl._context = context;
                    this.TPBotContainer = container;
                    var el: HTMLDivElement = document.createElement("div");
                    el.id = TPBot.Constants.TPBotOuterContainer;
                    this.TPBotContainer.appendChild(el);

                    Xrm.WebApi.retrieveMultipleRecords(TPBot.Constants.ServiceEndpointEntity, TPBot.Constants.CDNEndpointFilter).then((data: any) => {
                        window[TPBot.Constants.ConversatonControlOrigin] = data.entities[0].path;
                        window.top.addEventListener("message", this.receiveMessage, false);
                    });
                }
            } catch (Error) {

                let logConstants = TPBot.TelemetryComponents;
                let eventParameters = new TPBot.EventParameters();
                eventParameters.addParameter("handlerId", handlerId);
                let error = { name: "Smart Assist Control Init error", message: "Error while initializing smart assist control" };
                this.telemetryReporter.logError(logConstants.MainComponent, methodName, "", eventParameters);
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
            TPBot.TPBotManager.Instance.ReRenderCards(TPBotControl.isRTL);
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

        private receiveMessage(event: any): void {
            //TODO: Uncomment
            //if (window[TPBot.Constants.ConversatonControlOrigin].indexOf(event.origin) == -1)
            //    return;
            if (event.data.messageType != "notifyEvent") {
                return;
            }
            if (event.data && event.data.messageData.get("notificationUXObject")) {
                let messageMap = event.data.messageData.get("notificationUXObject");
                let content = messageMap.get("content");
                let conversationId = messageMap.get("conversationId");
                let uiSessionId = messageMap.get("uiSessionId");
                let card = TPBot.AdaptiveCardHelper.GetCardFromMessageContent(content);
                let tags = messageMap.get("tags");
                if (conversationId && uiSessionId && tags.indexOf(TPBot.Constants.FPBTag) == -1) {
                    TPBot.TPBotManager.Instance.RenderTPBotCard(conversationId, card.content);
                    TPBot.Utility.updateBadge(1);
                }
            }
        }

        private handleSessionClose(context: XrmClientApi.EventContext) {
            // Remove listener on session close
            window.top.removeEventListener("message", this.receiveMessage, false);

            let eventArgs: any = context.getEventArgs();
            let handlerId = localStorage.getItem(TPBot.Constants.SessionCloseHandlerId);
            Xrm.App.sessions.removeOnAfterSessionClose(handlerId);
        }
    }
}