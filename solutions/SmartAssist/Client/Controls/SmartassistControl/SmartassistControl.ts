/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>

module MscrmControls.ProductivityPanel {
	'use strict';

	export class SmartassistControl implements Mscrm.StandardControl<IInputBag, IOutputBag> {

		private smartAssistContainer: HTMLDivElement = null;
		private static _context: Mscrm.ControlData<IInputBag> = null;
		private telemetryReporter: Smartassist.TelemetryLogger
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
			let self = this;
			let methodName = "init";
			// Initialize Telemetry Repoter
			this.telemetryReporter = new Smartassist.TelemetryLogger(context);

			// Listen for session close
			let handlerId;

			try {
				handlerId = Xrm.App.sessions.addOnAfterSessionClose(this.handleSessionClose);
				if (!context.utils.isNullOrUndefined(handlerId) &&
					!context.utils.isNullOrEmptyString(handlerId)) {

					localStorage.setItem(Smartassist.Constants.SessionCloseHandlerId, handlerId);
					let logger = new Smartassist.TelemetryLogger(context);
					Smartassist.SmartAssistManager.Instance.SetLogger(logger);
					SmartassistControl._context = context;
					this.smartAssistContainer = container;
					var el: HTMLDivElement = document.createElement("div");
					el.id = Smartassist.Constants.SmartAssistOuterContainer;
					this.smartAssistContainer.appendChild(el);
					Xrm.WebApi.retrieveMultipleRecords(Smartassist.Constants.ServiceEndpointEntity, Smartassist.Constants.CDNEndpointFilter).then((data: any) => {
						window[Smartassist.Constants.ConversatonControlOrigin] = data.entities[0].path;
						window.top.addEventListener("message", this.receiveMessage, false);
					});
				}
			} catch (Error) {

				let logConstants = Smartassist.TelemetryComponents;
				let eventParameters = new Smartassist.EventParameters();
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
			SmartassistControl._context = context;

			// If coming from a session switch, re-render cards from storage
			Smartassist.SmartAssistManager.Instance.ReRenderCards();
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
			window.top.removeEventListener("message", this.receiveMessage, false);
		}

		public static getString(resourceName: string): string {
			if (!SmartassistControl._context) {
				//TODO: add telemetry.
				return resourceName;
			}
			return SmartassistControl._context.resources.getString(resourceName);
		}

		private receiveMessage(event: any): void {
			if (window[Smartassist.Constants.ConversatonControlOrigin].indexOf(event.origin) == -1)
				return;
			if (event.data.messageType != "notifyEvent") {
				return;
			}
			if (event.data && event.data.messageData.get("notificationUXObject")) {
				let messageMap = event.data.messageData.get("notificationUXObject");
				let content = messageMap.get("content");
				let conversationId = messageMap.get("conversationId");
				let uiSessionId = messageMap.get("uiSessionId");
				let card = Smartassist.AdaptiveCardHelper.GetCardFromMessageContent(content);
				Smartassist.SmartAssistManager.Instance.RenderSmartAssistCard(conversationId, card.content, uiSessionId);
			}
		}

		private handleSessionClose(context: XrmClientApi.EventContext) {
			let eventArgs: any = context.getEventArgs();
			Smartassist.ConversationStateManager.RemoveSessionMapping(eventArgs.getInputArguments().sessionId);
			let handlerId = localStorage.getItem(Smartassist.Constants.SessionCloseHandlerId);
			Xrm.App.sessions.removeOnAfterSessionClose(handlerId);
		}
	}
}