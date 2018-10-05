/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
*/

namespace Microsoft.CIFramework {
	type PresenceInfo = {
		presenceId: string;
		presenceColor: string;
		presenceText: string;
		basePresenceStatus: string;
	}

	type AgentInfo = {
		agentId: string;
		agentName: string;
		presenceId: string;
		currentPresenceStatusInfo: PresenceInfo;
	}

	export class PresenceControl {

		private static instance: any = null;

		// Private Constructor
		private PresenceControl() {
			PresenceControl.instance = new PresenceControl();
			return PresenceControl.instance;
		}

		public setAllPresences(presenceList: PresenceInfo[]) {
			document.getElementById("PresenceList").innerHTML = '';
			for (var i = 0; i < presenceList.length; i++) {
				var node = document.createElement("div");
				node.id = presenceList[i].presenceId;
				var setPresenceEvent = new CustomEvent("setPresenceEvent", { detail: presenceList[i].presenceId });
				let raiseSetPresence = function() { window.dispatchEvent(setPresenceEvent); };
				node.onclick = raiseSetPresence;
				var divNode = document.createElement("div");
				divNode.style.height = '16px';
				divNode.style.width = '16px';
				divNode.style.borderRadius = '50%';
				divNode.style.backgroundColor = presenceList[i].presenceColor;
				divNode.style.cssFloat = 'left';
				node.appendChild(divNode);
				var textNode = document.createElement('div');
				textNode.innerText = presenceList[i].presenceText;
				textNode.style.cssFloat = 'left';
				node.appendChild(textNode);
				var lineBreakNode = document.createElement('br');
				node.appendChild(lineBreakNode);
				document.getElementById("PresenceList").appendChild(node);
			}
		}

		public updateCurrentPresence(presenceInfo: PresenceInfo) {
			var currentStatusNode = document.getElementById('CurrentStatus');
			currentStatusNode.innerHTML = '';

			var divNode = document.createElement('div');
			divNode.style.height = '16px';
			divNode.style.width = '16px';
			divNode.style.borderRadius = '50%';
			divNode.style.backgroundColor = presenceInfo.presenceColor;
			divNode.style.cssFloat = 'left';
			currentStatusNode.appendChild(divNode);

			var textNode = document.createElement('div');
			textNode.innerText = presenceInfo.presenceText;
			textNode.style.cssFloat = 'left';
			currentStatusNode.appendChild(textNode);

			currentStatusNode.onclick = this.showListFunction;
		}

		public showListFunction(event: MouseEvent) {
			var x = document.getElementById('PresenceList');
			if (x.style.display == 'none') {
				x.style.display = 'block';
				(event as Event).preventDefault();
				(event as Event).stopImmediatePropagation();
				document.addEventListener("click", this.hideListFunction);
			}
		}

		public hideListFunction() {
			var x = document.getElementById('PresenceList');
			if (x.style.display == 'block') {
				x.style.display = 'none';
				document.removeEventListener('click', this.hideListFunction);
			}
		}
	}
}