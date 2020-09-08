/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../CommonReferences.ts"/>

module MscrmControls.ProductivityPanel.TPBot {
	export class ConversationStateManager {

		public static GetCurrentConversation(): string {
			let cifUtil = new Microsoft.CIFramework.External.CIFExternalUtilityImpl();
			let templateParams = cifUtil.getSessionTemplateParams();
			let ocContextObject = templateParams.data;
			let conversationId = ocContextObject.ocContext.config.sessionParams.LiveWorkItemId
			if (conversationId) {
				return conversationId
			}
			else {
				return null;
			}
        }

		public static GetConversationState(conversationId: string): ConversationState {
			return new ConversationState(conversationId);
		}
	}
}
