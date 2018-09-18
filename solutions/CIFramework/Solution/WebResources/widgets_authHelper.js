var presenceList;

function updateList() {
	document.getElementById("PresenceList").innerHTML = '';
	for (var i = 0; i < presenceList.length; i++) {
		var node = document.createElement("div");
		node.id = presenceList[i].presenceId
		node.onclick = setPresence;
		var divNode = document.createElement('div');
		divNode.style.height = '16px';
		divNode.style.width = '16px';
		divNode.style.borderRadius = '50%';
		divNode.style.backgroundColor = presenceList[i].presenceColor;
		divNode.style.float = 'left';
		node.appendChild(divNode);
		var textNode = document.createElement('div');
		textNode.innerText = presenceList[i].presenceText;
		textNode.style.float = 'left';
		node.appendChild(textNode);
		var lineBreakNode = document.createElement('br');
		node.appendChild(lineBreakNode);
		document.getElementById("PresenceList").appendChild(node);
	}
}

function updateCurrentPresence(presenceInfo) {
	var currentStatusNode = document.getElementById('CurrentStatus');
	currentStatusNode.innerHTML = '';

	var divNode = document.createElement('div');
	divNode.style.height = '16px';
	divNode.style.width = '16px';
	divNode.style.borderRadius = '50%';
	divNode.style.backgroundColor = presenceInfo.presenceColor;
	divNode.style.float = 'left';
	currentStatusNode.appendChild(divNode);

	var textNode = document.createElement('div');
	textNode.innerText = presenceInfo.presenceText;
	textNode.style.float = 'left';
	currentStatusNode.appendChild(textNode);
}

var hideListFunction = function hideList() {
	var x = document.getElementById("PresenceList");
	if (x.style.display === "block") {
		x.style.display = "none";
		document.removeEventListener("click", hideListFunction);
	}
}

function showList(event) {
	var x = document.getElementById("PresenceList");
	if (x.style.display === "none") {
		x.style.display = "block";
		event.preventDefault();
		event.stopImmediatePropagation();
		document.addEventListener("click", hideListFunction);
	}
}

function setPresence(event) {
	sendPostMessage(Math.random(), getOmniChannelEndpointPrefixUrl() + "/presence/SetAgentPresence/b1ed7d38-e457-484c-9a90-41f46f23a9b9/dfc63fc9-7aa7-e811-a9bb-000d3a346557", 'PUT', "PresenceId='" + event.currentTarget.id + "'", { 'Content-Type': 'application/x-www-form-urlencoded' })
	.then(function (responseData) {
		sendPostMessage(Math.random(), getOmniChannelEndpointPrefixUrl() + "/presence/GetAgentPresence/b1ed7d38-e457-484c-9a90-41f46f23a9b9/dfc63fc9-7aa7-e811-a9bb-000d3a346557", 'GET')
		.then(function (responseData) {
			updateCurrentPresence(responseData.currentPresenceStatusInfo);
		});
	});
}

function invokeRequests() {
	//Do login

	sendPostMessage(Math.random(), getOmniChannelEndpointPrefixUrl() + "/presence/GetAllPresences/b1ed7d38-e457-484c-9a90-41f46f23a9b9", 'GET')
	.then(function (responseData) {
		presenceList = responseData;
		updateList();
	});

	sendPostMessage(Math.random(), getOmniChannelEndpointPrefixUrl() + "/presence/GetAgentPresence/b1ed7d38-e457-484c-9a90-41f46f23a9b9/dfc63fc9-7aa7-e811-a9bb-000d3a346557", 'GET')
	.then(function (responseData) {
		updateCurrentPresence(responseData.currentPresenceStatusInfo);
	});
}

var MessageEventName = "message";
var FPIIframeTitle = "OmniChannelFPI_IFrame";
var FPIEventMethodName = "OCAppLoaded";
var FPIAppName = "OCApp";
var EventHandlers = {};

function getFPISourceURL() {
	return "https://preetiintegrations.azurewebsites.net/OmniChannel/9.0/Runtime.html";
}

function getOmniChannelEndpointPrefixUrl() {
	return "https://testorgpot1088sg811tip01-smsint.omnichannel.crmlivetie.com";
}

function createDeferredPromise() {
	var deferred = {
		promise: null,
		resolve: null,
		reject: null
	};

	deferred.promise = new Promise((resolve, reject) => {
		deferred.resolve = resolve;
		deferred.reject = reject;
	});

	return deferred;
}

function addPromise(requestId, promise) {
	EventHandlers[requestId] = promise;
}

function getPromise(requestId) {
	return EventHandlers[requestId];
}

function sendPostMessage(requestId, requestUrl, httpMethod, content, headers) {
	var args = {
		url: requestUrl,
		requestType: httpMethod,
		staticData: { "requestId": requestId },
		header: headers,
		payload: content
	}

	var deferredPromise = createDeferredPromise();
	addPromise(requestId, deferredPromise)

	var fpiFrame = document.getElementById("StreamControlFpiIframe");
	fpiFrame.contentWindow.postMessage(args, "*");

	return deferredPromise.promise;
}

function fpiCallback(event) {
	if (event.data.responseData.tokenAcquired == true) {
		//raise event saying token is acquired
		invokeRequests();
	}
	else if (event.data.isFailure == false) {
		var promise = getPromise(event.data.staticData.requestId);
		promise.resolve(event.data.responseData);
	}
	else {
		var promise = getPromise(event.data.staticData.requestId);
		promise.reject(event.data.responseData);
	}
}

window.addEventListener(MessageEventName, fpiCallback);

function insertFipIframe() {
	var fipIframe = document.createElement("iframe");
	fipIframe.id = "StreamControlFpiIframe";
	fipIframe.title = FPIIframeTitle;
	fipIframe.src = getFPISourceURL();
	fipIframe.style = "display:none";
	document.body.appendChild(fipIframe);
}

window.addEventListener("load", insertFipIframe);
