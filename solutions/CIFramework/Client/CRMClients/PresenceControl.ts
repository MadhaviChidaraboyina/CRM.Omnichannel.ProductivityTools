/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/** @internal */

/// <reference path="InternalMainLibrary.ts" />

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
				presenceListNode.classList.add("PresenceListInnerNode");

				// Appends the Header to the List
				var headerDiv = document.createElement('div');
				headerDiv.classList.add("headerDiv");
				headerDiv.innerText = "Set Presence";
				presenceListNode.appendChild(headerDiv);

				for (var i = 0; i < presenceList.length; i++) {
					var presenceNode = document.createElement('div');
					presenceNode.id = presenceList[i].presenceId;
					presenceNode.classList.add("PresenceListItem");
					presenceNode.tabIndex = 0;
					presenceNode.setAttribute("role", "button");
					presenceNode.setAttribute("aria-label", presenceList[i].presenceText);

					var presenceColorNode = document.createElement('div');
					presenceColorNode.classList.add('ColorNode');
					presenceColorNode.style.backgroundColor = presenceList[i].presenceColor;
					presenceNode.appendChild(presenceColorNode);

					var presenceTextNode = document.createElement('div');
					presenceTextNode.classList.add('textNode');
					presenceTextNode.innerText = presenceList[i].presenceText;
					presenceNode.appendChild(presenceTextNode);

					var lineBreakNode = document.createElement('br');
					presenceNode.appendChild(lineBreakNode);
					presenceListNode.appendChild(presenceNode);
				}

				presenceListNode.addEventListener("click", this.raiseSetPresence, false);
				presenceListNode.addEventListener("keypress", this.keyboardSetPresence, false);
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
			updatedPresenceNode.classList.add("agentPresenceDiv");
			updatedPresenceNode.title = presenceInfo.presenceText;
			updatedPresenceNode.tabIndex = 0;
			updatedPresenceNode.setAttribute("role", "button");
			updatedPresenceNode.setAttribute("aria-label", updatedPresenceNode.title);
			updatedPresenceNode.id = presenceInfo.presenceId;
			updatedPresenceNode.addEventListener("click", this.toggleList, false);
			updatedPresenceNode.addEventListener("keypress", this.keyboardToggleList, false);

			var innerDiv = document.createElement('div');
			innerDiv.classList.add("innerDiv");

			var backgroundColorDiv = document.createElement('div');
			backgroundColorDiv.classList.add('backgroundColorDiv');

			// Creates the Image Element for the Agent Presence
			var updatedPresenceImageNode = document.createElement('img');
			updatedPresenceImageNode.classList.add('userImageNode');
			updatedPresenceImageNode.src = "/_imgs/svg_2.svg";
			backgroundColorDiv.appendChild(updatedPresenceImageNode);
			innerDiv.appendChild(backgroundColorDiv);


			// Creates the Color Div for Agent Presence
			var updatedPresenceColorNode = document.createElement('div');
			updatedPresenceColorNode.style.backgroundColor = presenceInfo.presenceColor;
			updatedPresenceColorNode.innerText = " ";
			updatedPresenceColorNode.classList.add('agentPresenceColorNode');
			innerDiv.appendChild(updatedPresenceColorNode);

			// Creates the Text Div for Agent Presence
			var updatedPresenceTextNode = document.createElement('div');
			updatedPresenceTextNode.innerText = presenceInfo.presenceText;
			updatedPresenceTextNode.classList.add('textNode');

			updatedPresenceNode.appendChild(innerDiv);
			updatedPresenceNode.appendChild(updatedPresenceTextNode);

			return updatedPresenceNode;
		}

		// Toggles the visibility of the Presence List
		private toggleList() {
			var presenceList = (<HTMLIFrameElement>(window.top.document.getElementById("SidePanelIFrame"))).contentDocument.getElementById("PresenceList");
			if (window.getComputedStyle(presenceList).display === "none")
				presenceList.style.display = "block";
			else
				presenceList.style.display = "none";
		}

		// Enter and Space KeyPress Handler for Presence List Menu Toggle
		private keyboardToggleList(e: any) {
			if (e.keyCode == 13 || e.keyCode == 32) {
				Microsoft.CIFramework.Internal.PresenceControl.Instance.toggleList();
			}
		}

		// Raises the Set Presence Event when click or keypress happens on Presence List Items
		private raiseSetPresence(e:any): any {
			var presenceList = (<HTMLIFrameElement>(window.top.document.getElementById("SidePanelIFrame"))).contentDocument.getElementById("PresenceList");
			presenceList.style.display = "none";
			let updatedPresence: any = {};

			let actualElement = e.target;

			// Don't call setAgentPresence if click is on the Header or any area of the Parent Div
			if (actualElement.className == "headerDiv" || actualElement.className == "PresenceListInnerNode")
				return;
			if (!isNullOrUndefined(actualElement.getAttribute("id")) && actualElement.getAttribute("id") != "") {
				updatedPresence.presenceId = actualElement.getAttribute("id");
				updatedPresence.presenceText = actualElement.firstElementChild.nextSibling.innerText;
				updatedPresence.presenceColor = actualElement.firstChild.style.backgroundColor;
				updatedPresence.basePresenceStatus = actualElement.firstElementChild.nextSibling.innerText;
			}
			else {
				updatedPresence.presenceId = actualElement.parentElement.getAttribute("id");
				updatedPresence.presenceText = actualElement.parentElement.firstElementChild.nextSibling.innerText;
				updatedPresence.presenceColor = actualElement.parentElement.firstChild.style.backgroundColor;
				updatedPresence.basePresenceStatus = actualElement.parentElement.firstElementChild.nextSibling.innerText;
			}
			var setPresenceEvent = new CustomEvent('setPresenceEvent', {
				detail: { "presenceId": e.target.parentElement.getAttribute("id"), "presenceInfo": updatedPresence }
			});
			window.parent.dispatchEvent(setPresenceEvent);
		}

		// Enter and Space KeyPress Handler for Presence List Items
		private keyboardSetPresence(e: any): any {
			if (e.keyCode == 13 || e.keyCode == 32) {
				Microsoft.CIFramework.Internal.PresenceControl.Instance.raiseSetPresence(e);
			}
		}
	}
}