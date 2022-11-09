/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../CommonReferences.ts"/>

module MscrmControls.ProductivityPanel.TPBot {
	export class CardStateManager {

		public static SetState(conversationId, cardId, state: CardStates, handleNew: boolean = true) {
			if (!localStorage.getItem(conversationId + Constants.CardStatesSuffix)) {
				localStorage.setItem(conversationId + Constants.CardStatesSuffix, JSON.stringify({}));
			}
			let cardStates = JSON.parse(localStorage.getItem(conversationId + Constants.CardStatesSuffix));
			cardStates[cardId] = state;
			localStorage.setItem(conversationId + Constants.CardStatesSuffix, JSON.stringify(cardStates));
			// Handle New state - Change to default after 5secs
			if (state == CardStates.New && handleNew) {
				this.handleNewState(conversationId, cardId);
			}
		}

		private static handleNewState(conversationId, cardId) {
			let self = this;
			setTimeout(() => {
				if (this.getState(conversationId, cardId) !== CardStates.Applied && this.getState(conversationId, cardId) !== CardStates.Applied) {
					self.SetState(conversationId, cardId, CardStates.Default);
					TPBotManager.Instance.ReRenderCards(conversationId, TPBotControl.isRTL);
				}
			}, 5000);
		}

		private static getState(conversationId, cardId): CardStates {
			let cardStates = JSON.parse(localStorage.getItem(conversationId + Constants.CardStatesSuffix));
			return cardStates[cardId];
		}

		public static DeleteState(conversationId, cardId) {
			let cardStates = JSON.parse(localStorage.getItem(conversationId + Constants.CardStatesSuffix));
			delete cardStates[cardId];
			localStorage.setItem(conversationId + Constants.CardStatesSuffix, JSON.stringify(cardStates));
		}

		public static GetAllCardStates(conversationId): any {
			if (localStorage.getItem(conversationId + Constants.CardStatesSuffix)) {
				let cardStates = JSON.parse(localStorage.getItem(conversationId + Constants.CardStatesSuffix));
				return cardStates;
			}
		}
	}
}
