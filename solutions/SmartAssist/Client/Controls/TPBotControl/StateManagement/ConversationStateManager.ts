/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../CommonReferences.ts"/>

module MscrmControls.ProductivityPanel.TPBot {
	export class ConversationStateManager {

		public static async GetCurrentConversation(): Promise<string | null> {
			const eventParameters = new EventParameters();
			let conversationId: string | null = null;
			try {
				let cifUtil = new Microsoft.CIFramework.External.CIFExternalUtilityImpl();
				let templateParams = cifUtil.getSessionTemplateParams();
				let data = templateParams.data;
				if (typeof data === "string") data = JSON.parse(data);
				conversationId = data.ocContext.config.sessionParams.LiveWorkItemId
			} catch (error) {
				eventParameters.addParameter("Exception Details", error.message);
				eventParameters.addParameter("Message", "Failed to retrieve Live Work Item id from form param");
				TPBotControl.telemetryReporter.logEvent("Main Component", "GetCurrentConversation", eventParameters);
			}

			// Fallback to APM to get the work item ID.
			if (conversationId == null) {
				eventParameters.addParameter("Message", "Falling back to APM to retrieve the Live Work Item id");
				TPBotControl.telemetryReporter.logEvent("Main Component", "GetCurrentConversation", eventParameters);
				try {
					const context = await Microsoft.AppRuntime.Sessions.getFocusedSession().getContext();
					conversationId = context.parameters["LiveWorkItemId"];
				} catch (error) {
						eventParameters.addParameter("Exception Details", error.message);
						TPBotControl.telemetryReporter.logError("Main Component", "GetCurrentConversation", "Failed to retrieve Live Item id from APM", eventParameters);        
				}
			}

			return conversationId;
    }

		public static GetConversationState(conversationId: string): ConversationState {
			return new ConversationState(conversationId);
		}
	}
}
