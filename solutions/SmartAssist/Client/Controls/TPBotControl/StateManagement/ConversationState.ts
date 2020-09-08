/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../CommonReferences.ts"/>

module MscrmControls.ProductivityPanel.TPBot {
	export class ConversationState {
		private conversationId: string;

		constructor(conversationId: string) {
			this.conversationId = conversationId;
		}

		public PersistCard(card: any): number {
			if (!localStorage.getItem(this.conversationId + Constants.ConversationCardsSuffix)) {
				localStorage.setItem(this.conversationId + Constants.ConversationCardsSuffix, JSON.stringify({}));
			}
			let cards = JSON.parse(localStorage.getItem(this.conversationId + Constants.ConversationCardsSuffix));
			let cardCount = this.renewCardCount();
			cards[cardCount] = card;
			localStorage.setItem(this.conversationId + Constants.ConversationCardsSuffix, JSON.stringify(cards));
			return cardCount;
		}

		public GetAllCards(): any {
			if (localStorage.getItem(this.conversationId + Constants.ConversationCardsSuffix)) {
				let cards = JSON.parse(localStorage.getItem(this.conversationId + Constants.ConversationCardsSuffix));
				return cards;
			}
		}

		public RemoveCard(cardId: number) {
			let cards = JSON.parse(localStorage.getItem(this.conversationId + Constants.ConversationCardsSuffix));
			delete cards[cardId];
			localStorage.setItem(this.conversationId + Constants.ConversationCardsSuffix, JSON.stringify(cards));
		}

		private renewCardCount(): number {
			//Card Count state
			if (!window[this.conversationId + Constants.CardCountSuffix]) {
				window[this.conversationId + Constants.CardCountSuffix] = 0;
			}
			let cardCount = window[this.conversationId + Constants.CardCountSuffix];
			window[this.conversationId + Constants.CardCountSuffix] = cardCount + 1;
			return cardCount + 1;
		}
	}
}
