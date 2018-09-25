/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="AuthHelper.ts" />
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

	var authHelperInstance = AuthHelper.getInstance();
	var presenceList: PresenceInfo[] = [];

	function updateList() {
		document.getElementById("PresenceList").innerHTML = '';
		for (var i = 0; i < presenceList.length; i++) {
			var node = document.createElement("div");
			node.id = presenceList[i].presenceId
			node.onclick = setPresenceFunction;
			var divNode = document.createElement('div');
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

	function updateCurrentPresence(presenceInfo: PresenceInfo) {
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

		currentStatusNode.onclick = showListFunction;
	}

	var hideListFunction = function() {
		var x = document.getElementById("PresenceList");
		if (x.style.display === "block") {
			x.style.display = "none";
			document.removeEventListener("click", hideListFunction);
		}
	}

	var showListFunction = function(event: MouseEvent) {
		var x = document.getElementById("PresenceList");
		if (x.style.display === "none") {
			x.style.display = "block";
			(event as Event).preventDefault();
			(event as Event).stopImmediatePropagation();
			document.addEventListener("click", hideListFunction);
		}
	}

	var setPresenceFunction = function(event: MouseEvent) {
		authHelperInstance.sendPostMessage(Math.random(), authHelperInstance.getOmniChannelEndpointPrefixUrl() + "/presence/SetAgentPresence/b1ed7d38-e457-484c-9a90-41f46f23a9b9/dfc63fc9-7aa7-e811-a9bb-000d3a346557", 'PUT', "PresenceId='" + (event.currentTarget as HTMLElement).id + "'", { 'Content-Type': 'application/x-www-form-urlencoded' })
			.then(function (responseData) {
				authHelperInstance.sendPostMessage(Math.random(), authHelperInstance.getOmniChannelEndpointPrefixUrl() + "/presence/GetAgentPresence/b1ed7d38-e457-484c-9a90-41f46f23a9b9/dfc63fc9-7aa7-e811-a9bb-000d3a346557", 'GET')
					.then(function (responseData) {
						updateCurrentPresence((responseData as AgentInfo).currentPresenceStatusInfo);
					});
			});
	}

	function invokeRequests() {
		//Do login

		authHelperInstance.sendPostMessage(Math.random(), authHelperInstance.getOmniChannelEndpointPrefixUrl() + "/presence/GetAllPresences/b1ed7d38-e457-484c-9a90-41f46f23a9b9", 'GET')
			.then(function (responseData) {
				presenceList = responseData as PresenceInfo[];
				updateList();
			});

		authHelperInstance.sendPostMessage(Math.random(), authHelperInstance.getOmniChannelEndpointPrefixUrl() + "/presence/GetAgentPresence/b1ed7d38-e457-484c-9a90-41f46f23a9b9/dfc63fc9-7aa7-e811-a9bb-000d3a346557", 'GET')
			.then(function (responseData) {
				updateCurrentPresence((responseData as AgentInfo).currentPresenceStatusInfo);
			});
	}

	function checkIfTokenIsAcquired() {
		if (!authHelperInstance.isTokenAcquired) {
			setTimeout(checkIfTokenIsAcquired, 10);
		}
		else {
			invokeRequests();
		}
	}

	checkIfTokenIsAcquired();
}
