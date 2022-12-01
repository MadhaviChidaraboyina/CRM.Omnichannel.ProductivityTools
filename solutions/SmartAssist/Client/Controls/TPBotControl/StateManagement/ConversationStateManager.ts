/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../CommonReferences.ts"/>

module MscrmControls.ProductivityPanel.TPBot {
	export class ConversationStateManager {

		public static async GetCurrentConversation(): Promise<string> {
			const timer = TPBotControl.telemetryReporter.startTimer("GetCurrentConversation");
			const params = new TelemetryLogger.EventParameters();
			const eventParameters = new TelemetryLogger.EventParameters();

			let conversationId: string | undefined;
			try {
				let cifUtil = new Microsoft.CIFramework.External.CIFExternalUtilityImpl();
				let templateParams = cifUtil.getSessionTemplateParams();
				let data = templateParams.data;
				if (typeof data === "string") data = JSON.parse(data);
				conversationId = data.ocContext.config.sessionParams.LiveWorkItemId
				params.addParameter("Source", "CIF");
			} catch (error) {
				eventParameters.addParameter("ExceptionDetails", error);
				eventParameters.addParameter("Message", "Failed to retrieve Live Work Item id from form param");
				TPBotControl.telemetryReporter.logSuccess("GetCurrentConversationTrace", eventParameters);
			}

			// Fallback to APM to get the work item ID.
			if (conversationId == null) {
				eventParameters.addParameter("Message", "Falling back to APM to retrieve the Live Work Item id");
				TPBotControl.telemetryReporter.logSuccess("GetCurrentConversationTrace", eventParameters);
				try {
					const context = await Microsoft.AppRuntime.Sessions.getFocusedSession().getContext();
					conversationId = context.parameters["LiveWorkItemId"];
					params.addParameter("Source", "APM");
				} catch (error) {
						eventParameters.addParameter("ExceptionDetails", error);
						TPBotControl.telemetryReporter.logError("GetCurrentConversationTrace", "Failed to retrieve Live Item id from APM", eventParameters);        
				}
			}

			// Handle timer telemetry. If no conversation ID found, propagate error to caller.
			params.addParameter("ConversationId", conversationId);
			if (conversationId == null) {
				timer.fail("Failed to find conversationId", params);
				throw "Failed to find conversationId";
			} else timer.stop(params);
			
			return conversationId;
    }

		public static GetConversationState(conversationId: string): ConversationState {
			return new ConversationState(conversationId);
		}
	}
}
