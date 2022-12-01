/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module SmartAssist.Common
{
	'use strict';
	
	export class Message {
		public conversationId: string;
		public uiSessionId: string;
		public id: string;
		public tags: string[];
		public content?: string;

		public type: "first-party" | "third-party";
		public isValid: boolean;

		constructor(map: Map<any,any>) {
			this.id = map.get("id");
			this.conversationId = map.get("conversationId");
			this.uiSessionId = map.get("uiSessionId");
			this.tags = map.get("tags");
			this.content = map.get("content");

			this.isValid = this.conversationId != null && this.uiSessionId != null;
			this.type = (this.tags.indexOf("FPB") === -1 && this.content != null) ? "third-party" : "first-party";
		}
	}
}