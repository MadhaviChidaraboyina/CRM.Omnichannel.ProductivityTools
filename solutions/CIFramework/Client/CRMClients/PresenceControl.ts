/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/** @internal */
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
				presenceListNode.classList.add("PresenceListInnerNode")
				for (var i = 0; i < presenceList.length; i++) {
					var presenceNode = document.createElement('div');
					presenceNode.id = presenceList[i].presenceId;
					presenceNode.classList.add("PresenceListItem");

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

				presenceListNode.addEventListener("click", this.raiseSetPresence, false);
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
			updatedPresenceNode.title = presenceInfo.presenceText;
			updatedPresenceNode.addEventListener("click", this.toggleList, false);

			var innerDiv = document.createElement('div');
			innerDiv.classList.add("innerDiv");

			// Creates the Image Element for the Agent Presence
			var updatedPresenceImageNode = document.createElement('img');
			updatedPresenceImageNode.classList.add('UserImageNode');
			updatedPresenceImageNode.src = "/_imgs/svg_2.svg"; //Source of the Image
			innerDiv.appendChild(updatedPresenceImageNode);

			// Creates the Color Div for Agent Presence
			var updatedPresenceColorNode = document.createElement('div');
			updatedPresenceColorNode.style.backgroundColor = presenceInfo.presenceColor;
			updatedPresenceColorNode.innerText = " ";
			updatedPresenceColorNode.classList.add('AgentPresenceColorNode');
			innerDiv.appendChild(updatedPresenceColorNode);

			// Creates the Text Div for Agent Presence
			var updatedPresenceTextNode = document.createElement('div');
			updatedPresenceTextNode.innerText = presenceInfo.presenceText;
			updatedPresenceTextNode.classList.add('TextNode');

			updatedPresenceNode.appendChild(innerDiv);
			updatedPresenceNode.appendChild(updatedPresenceTextNode);

			return updatedPresenceNode;
		}

		private toggleList() {
		var presenceList = (<HTMLIFrameElement>(window.top.document.getElementById("SidePanelIFrame"))).contentDocument.getElementById("PresenceList");
		if (window.getComputedStyle(presenceList).display === "none")
			presenceList.style.display = "block";
		else
			presenceList.style.display = "none";
		}

		private raiseSetPresence(e:any): any {
			var setPresenceEvent = new CustomEvent('setPresenceEvent', {
				detail: e.target.parentElement.getAttribute("id")
			});
			var presenceList = (<HTMLIFrameElement>(window.top.document.getElementById("SidePanelIFrame"))).contentDocument.getElementById("PresenceList");
			presenceList.style.display = "none";

			window.parent.dispatchEvent(setPresenceEvent);
		}
	}
}