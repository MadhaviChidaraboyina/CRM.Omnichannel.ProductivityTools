/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
*/

namespace Microsoft.CIFramework.Internal {
	export type PresenceInfo = {
		presenceId: string;
		presenceColor: string;
		presenceText: string;
		basePresenceStatus: string;
	}

	export type AgentInfo = {
		agentId: string;
		agentName: string;
		presenceId: string;
		currentPresenceStatusInfo: PresenceInfo;
	}

	export class PresenceControl {

		private static instance: PresenceControl;

		// Empty Constructor
		constructor() { }

		public static get Instance(): PresenceControl {
			if (this.instance == null) {
				this.instance = new PresenceControl();
			}
			return this.instance;
		}

		public setAllPresences(presenceList: PresenceInfo[]): HTMLDivElement {
			if (presenceList != null) {
				var presenceListNode = document.createElement('div');
				for (var i = 0; i < presenceList.length; i++) {
					var presenceNode = document.createElement('div');
					presenceNode.id = presenceList[i].presenceId;
					var setPresenceEvent = new CustomEvent('setPresenceEvent', {
						detail: presenceList[i].presenceId
					});
					var raiseSetPresence = function () {
						window.dispatchEvent(setPresenceEvent);
					};
					presenceNode.onclick = raiseSetPresence;

					var presenceColorNode = document.createElement('div');
					presenceColorNode.classList.add('ColorNode');
					presenceColorNode.style.backgroundColor = presenceList[i].presenceColor;
					presenceNode.appendChild(presenceColorNode);

					var presenceTextNode = document.createElement('div');
					presenceTextNode.classList.add('TextNode');
					presenceTextNode.innerText = presenceList[i].presenceText;
					presenceNode.appendChild(presenceTextNode);

					var lineBreakNode = document.createElement('br');
                    presenceNode.appendChild(lineBreakNode);
                    presenceListNode.appendChild(presenceNode);
				}
				return presenceListNode;
			}
			else {
				var presenceListNode = document.createElement('div');
				return presenceListNode;
			}
		}

		public setAgentPresence(presenceInfo: PresenceInfo): HTMLDivElement {
			// Creates the Main Div for Agent Presence
			var updatedPresenceNode = document.createElement('div');
			updatedPresenceNode.classList.add("AgentPresenceDiv");

			// Creates the Image Element for the Agent Presence
			var updatedPresenceImageNode = document.createElement('img');
			updatedPresenceImageNode.classList.add('UserImageNode');
			updatedPresenceImageNode.src = ""; //Source of the Image
			updatedPresenceNode.appendChild(updatedPresenceImageNode);

			// Creates the Color Div for Agent Presence
			var updatedPresenceColorNode = document.createElement('div');
			updatedPresenceColorNode.style.backgroundColor = presenceInfo.presenceColor;
			updatedPresenceColorNode.innerText = " ";
			updatedPresenceColorNode.classList.add('AgentPresenceColorNode');
			updatedPresenceNode.appendChild(updatedPresenceColorNode);

			// Creates the Text Div for Agent Presence
			var updatedPresenceTextNode = document.createElement('div');
			updatedPresenceTextNode.innerText = presenceInfo.presenceText;
			updatedPresenceTextNode.classList.add('TextNode');
			updatedPresenceNode.appendChild(updatedPresenceTextNode);

			return updatedPresenceNode;
		}
	}
}