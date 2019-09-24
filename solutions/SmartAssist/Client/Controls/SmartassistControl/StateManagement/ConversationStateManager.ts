/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../CommonReferences.ts"/>

module MscrmControls.ProductivityPanel.Smartassist {
	export class ConversationStateManager {
		public static GetCurrentConversation(): string {
			let currentSession = Xrm.App.sessions.getFocusedSession().sessionId;
			if (!localStorage.getItem(Constants.ConversationSessionMap)) {
				localStorage.setItem(Constants.ConversationSessionMap, JSON.stringify({}));
			}
			let conversationSessionMap = JSON.parse(localStorage.getItem(Constants.ConversationSessionMap));
			if (conversationSessionMap[currentSession]) {
				return conversationSessionMap[currentSession];
			}
			else {
				return null;
			}
		}

		public static RemoveSessionMapping(sessionId) {
			if (!localStorage.getItem(Constants.ConversationSessionMap)) {
				return;
			}
			let conversationSessionMap = JSON.parse(localStorage.getItem(Constants.ConversationSessionMap));
			if (conversationSessionMap[sessionId]) {
				delete conversationSessionMap[sessionId];
			}
			localStorage.setItem(Constants.ConversationSessionMap, JSON.stringify(conversationSessionMap));
		}

		public static GetConversationState(conversationId: string): ConversationState {
			return new ConversationState(conversationId);
		}
	}
}
