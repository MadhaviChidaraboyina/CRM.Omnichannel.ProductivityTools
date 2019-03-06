/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="Client.ts" />
/// <reference path="Constants.ts" />
/// <reference path="../Constants.ts" />
/// <reference path="State.ts" />
/// <reference path="../TelemetryHelper.ts" />
/// <reference path="aria-webjs-sdk-1.6.2.d.ts" />
/** @internal */
namespace Microsoft.CIFramework.Internal {
	let Constants = Microsoft.CIFramework.Constants;
	const listenerWindow = window.parent;
	let noOfNotifications = 0;
	let len = 0;
	
	/**
	 * API to invoke toast popup widget
	 *
	 * @param value. It's a string which contains header,body of the popup
	 *
	*/
	export function renderEventNotification(header:any,body:any,actions:any,notificationType:any,eventType:any): Map<any,any>{
		let widgetIFrame = (<HTMLIFrameElement>listenerWindow.document.getElementById(Constants.widgetIframeId));
		let toastDiv =  widgetIFrame.contentWindow.document.getElementById("toastDiv");
		let i = 0;
		let isTimeOut = false;
		let map = new Map();
		if(notificationType[0].search(MessageType.softNotification) != -1){ //For Soft notification
			map = renderSoftNotification(header,body,notificationType[1]);
		}else{
			if(eventType.search(Constants.Chat) != -1){
				toastDiv.insertAdjacentHTML('beforeend', '<div id="CIFToast" tabindex="0" role="region" aria-label="Notification" class="CIFToastDiv"><div class="header_NotificationType_CIF"></div><div aria-label="Notification Header" tabindex="0" class="header_CIF"><div class="CIFHeaderIconDiv"><img class="CIFHeaderImage" src="/webresources/chat_icon.svg" alt="CIF Header Image"></div><div class="headerKeyCIF"></div><div tabindex="0" id="headerTimerCIFId" class="headerTimerCIF"></div><div class="headerNameCIF"></div><div style="height:8px;"></div></div><div></div><div aria-label="Notification Body" class="bodyDivCIF"><div class="bodyDivider_CIF"></div><div style="height:8px"></div><p class="body_CIF"><div style="height: 2px;"></div></div></div>');
			}else if(eventType.search(Constants.Call) != -1){
				toastDiv.insertAdjacentHTML('beforeend', '<div id="CIFToast" tabindex="0" aria-label="Notification Window" class="CIFToastDiv"><div tabindex="0" class="header_NotificationType_CIF"></div><div aria-label="Notification Header" tabindex="0" class="header_CIF"><div class="CIFHeaderIconDiv"><img class="CIFHeaderImage" src="/webresources/call_icon.svg"></div><div tabindex="0" class="headerKeyCIF"></div><div tabindex="0" id="headerTimerCIFId" class="headerTimerCIF"></div><div tabindex="0" class="headerNameCIF"></div><div style="height:8px;"></div></div><div></div><div tabindex="0" aria-label="Notification Body" class="bodyDivCIF"><div class="bodyDivider_CIF"></div><div style="height:8px"></div><p tabindex="0" class="body_CIF"><div style="height: 2px;"></div></div></div>');
			}else if(eventType.search(Constants.Case) != -1){
				toastDiv.insertAdjacentHTML('beforeend', '<div id="CIFToast" tabindex="0" aria-label="Notification Window" class="CIFToastDiv"><div tabindex="0" class="header_NotificationType_CIF"></div><div aria-label="Notification Header" tabindex="0" class="header_CIF"><div class="CIFHeaderIconDiv"><img class="CIFHeaderImage" src="/webresources/case_icon.svg"></div><div tabindex="0" class="headerKeyCIF"></div><div tabindex="0" id="headerTimerCIFId" class="headerTimerCIF"></div><div tabindex="0" class="headerNameCIF"></div><div style="height:8px;"></div></div><div></div><div tabindex="0" aria-label="Notification Body" class="bodyDivCIF"><div class="bodyDivider_CIF"></div><div style="height:8px"></div><p tabindex="0" class="body_CIF"><div style="height: 2px;"></div></div></div>');
			}else if(eventType.search(Constants.SMS) != -1){
				toastDiv.insertAdjacentHTML('beforeend', '<div id="CIFToast" tabindex="0" aria-label="Notification Window" class="CIFToastDiv"><div tabindex="0" class="header_NotificationType_CIF"></div><div aria-label="Notification Header" tabindex="0" class="header_CIF"><div class="CIFHeaderIconDiv"><img class="CIFHeaderImage" src="/webresources/sms_icon.svg"></div><div tabindex="0" class="headerKeyCIF"></div><div tabindex="0" id="headerTimerCIFId" class="headerTimerCIF"></div><div tabindex="0" class="headerNameCIF"></div><div style="height:8px;"></div></div><div></div><div tabindex="0" aria-label="Notification Body" class="bodyDivCIF"><div class="bodyDivider_CIF"></div><div style="height:8px"></div><p tabindex="0" class="body_CIF"><div style="height: 2px;"></div></div></div>');
			}
			let len = toastDiv.getElementsByClassName("CIFToastDiv").length;
			let currentToast = toastDiv.getElementsByClassName("CIFToastDiv")[len-1];
			toastDiv.getElementsByClassName("CIFToastDiv")[len-1].id = "CIFToastDiv_"+len;
			let panelWidth = "100%";
			widgetIFrame.contentWindow.document.getElementById("CIFToastDiv_" + len).style.width = panelWidth;//panelWidth+"px";
			if(notificationType != null && notificationType != "undefined"  && notificationType.length > 0){
				let headerElement = toastDiv.getElementsByClassName("header_NotificationType_CIF")[len-1];
				if(notificationType[0].search(MessageType.broadCast) != -1 && notificationType.length == 3){
					headerElement.classList.add("header_NotificationType_CIF_Broadcast");
					toastDiv.getElementsByClassName("header_NotificationType_CIF_Broadcast")[len-1].id = "CIFToastType_"+len;
					widgetIFrame.contentWindow.document.getElementById("CIFToastType_" + len).style.width = panelWidth;//panelWidth+"px";
					var label1 = document.createElement("label");
					headerElement.appendChild(label1);
					label1.classList.add("broadCastLabel1");
					label1.innerText = notificationType[1];
					label1.setAttribute("aria-label", notificationType[1]);
					var label2 = document.createElement("label");
					headerElement.appendChild(label2);
					label2.classList.add("broadCastLabel2");
					label2.innerText = notificationType[2];
					label2.setAttribute("aria-label", notificationType[2]);
				}else if((notificationType[0].search(MessageType.notification) != -1 || notificationType[0].search(MessageType.escalation)) != -1 && notificationType.length == 2){
					headerElement.classList.add("header_NotificationType_CIF_notification");
					toastDiv.getElementsByClassName("header_NotificationType_CIF_notification")[len-1].id = "CIFToastType_"+len;
					widgetIFrame.contentWindow.document.getElementById("CIFToastType_" + len).style.width = panelWidth;//panelWidth+"px";
					var span = document.createElement("span");
					headerElement.appendChild(span);
					headerElement.getElementsByTagName("span")[0].classList.add("notificationSpan");
					if(notificationType[0].search(MessageType.escalation) != -1){
						headerElement.getElementsByTagName("span")[0].classList.add("FontIcons_escalationSpan");
					}else{
						headerElement.getElementsByTagName("span")[0].classList.add("FontIcons_notificationSpan");
					}
					var label = document.createElement("label");
					headerElement.appendChild(label);
					label.classList.add("notificationLabel");
					label.innerText = notificationType[1];
					label.setAttribute("aria-label", notificationType[1]);
				}else if(notificationType[0].search(MessageType.transfer) != -1 && notificationType.length == 2){
					headerElement.classList.add("header_NotificationType_CIF_transfer");
					toastDiv.getElementsByClassName("header_NotificationType_CIF_transfer")[len-1].id = "CIFToastType_"+len;
					widgetIFrame.contentWindow.document.getElementById("CIFToastType_" + len).style.width = panelWidth;//panelWidth+"px";
					var label1 = document.createElement("label");
					headerElement.appendChild(label1);
					label1.classList.add("transferLabel");
					label1.innerText = notificationType[1];
					label1.setAttribute("aria-label", notificationType[1]);
				}else if(notificationType[0].search(MessageType.internalCommunication) != -1 && notificationType.length == 2){
					headerElement.classList.add("header_NotificationType_CIF_internalCommunication");
					toastDiv.getElementsByClassName("header_NotificationType_CIF_internalCommunication")[len-1].id = "CIFToastType_"+len;
					widgetIFrame.contentWindow.document.getElementById("CIFToastType_" + len).style.width = panelWidth;//panelWidth+"px";
					var span = document.createElement("span");
					headerElement.appendChild(span);
					headerElement.getElementsByTagName("span")[0].classList.add("internalCommunicationSpan");
					headerElement.getElementsByTagName("span")[0].classList.add("FontIcons_internalCommunicationSpan");
					var label = document.createElement("label");
					headerElement.appendChild(label);
					label.classList.add("internalCommunicationLabel");
					label.innerText = notificationType[1];
					label.setAttribute("aria-label", notificationType[1]);
					currentToast.classList.add("internalCommunication_CIFToastDiv");
				}else if(notificationType[0].search(MessageType.notification) != -1){
					headerElement.classList.add("header_NotificationType_CIF_Broadcast");
					toastDiv.getElementsByClassName("header_NotificationType_CIF_Broadcast")[len-1].id = "CIFToastType_"+len;
                    widgetIFrame.contentWindow.document.getElementById("CIFToastType_" + len).style.width = panelWidth;
					var label1 = document.createElement("label");
					headerElement.appendChild(label1);
					label1.classList.add("broadCastLabel1");
					var label2 = document.createElement("label");
					headerElement.appendChild(label2);
					label2.innerText = "secs remaining";
					label2.classList.add("hardNotificationLabel2");
					label2.setAttribute("aria-label", "secs remaining");
				}
			}
			let headerVal = "";
			let bodyVal = "";
			for( i = 0; i < header.length; i++){
				for (let key in header[i]) {
					toastDiv.getElementsByClassName("headerKeyCIF")[len-1].innerHTML = key;
					for(let j = 0; j < header[i][key].length; j++){
						if(j == 0){
							toastDiv.getElementsByClassName("headerNameCIF")[len-1].innerHTML = header[i][key][j];
						}else{
							headerVal += header[i][key][j] + "\n";
						}
					}
				}
			}
			if(body != null && body != "undefined"){
				for( i = 0; i < body.length; i++){
					for (let key in body[i]) {
						let notificationBody = toastDiv.getElementsByClassName("body_CIF")[len-1];
						var outerDiv = document.createElement("div");	
						outerDiv.classList.add("bodyContentDiv");
						var label1 = document.createElement("label");
						outerDiv.appendChild(label1);
						label1.classList.add("body_CIFLabel1");
						var label2 = document.createElement("label");
						label2.classList.add("body_CIFLabel2");
						label1.innerText = key;
						label1.setAttribute("aria-label", key);
						label2.innerText = body[i][key];
						label2.setAttribute("aria-label", body[i][key]);
						/*label2.addEventListener("mouseover", function mouseOverListener() {
							this.classList.add("body_CIFLabel2_mouseover");
							label2.style.width = "calc(70% - 20px)";//((panelWidth * 0.7) - 20)+"px";
						});
						label2.addEventListener("mouseout", function mouseoutListener() {
							this.classList.add("body_CIFLabel2_mouseout");
							label2.style.width = "calc(70% - 20px)";//((panelWidth * 0.7) - 20)+"px";
						});*/
						label1.style.width = "30%";//(panelWidth * 0.3)+"px";
						label2.style.width = "50%";//((panelWidth * 0.7) - 20)+"px";
						outerDiv.appendChild(label2); 
						notificationBody.appendChild(outerDiv);
						var divForSpace = document.createElement("div");
						divForSpace.style.height = "8px";
						notificationBody.appendChild(divForSpace);
					}
				}
			}else{
				toastDiv.getElementsByClassName("bodyDivider_CIF")[len-1].classList.add("bodyDivider_CIF_invisible");
			}
			toastDiv.getElementsByClassName("bodyDivider_CIF")[len-1].id = "CIFToastDivider_"+len;
			widgetIFrame.contentWindow.document.getElementById("CIFToastDivider_" + len).style.width = panelWidth;//panelWidth+"px";
			toastDiv.getElementsByClassName("bodyDivider_CIF")[len-1].id = "CIFToastDividerInvisible_"+len;
			widgetIFrame.contentWindow.document.getElementById("CIFToastDividerInvisible_" + len).style.width = panelWidth;//panelWidth+"px";
			let chatWindowBody = toastDiv.getElementsByClassName("bodyDivCIF")[len-1];
			if(actions != null && actions != "undefined"){
				let accept = false;
				let reject = false;
				for( i = 0; i < actions.length; i++){
					for (let key in actions[i]) {
						if(key.search(Constants.actionType) != -1){
							if(actions[i][key].search(Constants.Accept) != -1){
								accept = true;
							}
							if(actions[i][key].search(Constants.Reject) != -1){
								reject = true;
							}
						}
					}
				}
				for( i = 0; i < actions.length; i++){
					var btn = document.createElement("BUTTON");
					var span = document.createElement('span');
					chatWindowBody.appendChild(btn);
					let actionParam = new Map();
					let k = 0;
					isTimeOut = false;
					let actionNameCIF,actionReturnValueCIF;
					let bothButtons = false;
					if(accept == true && reject == true){
						bothButtons = true;
					}
					for (let key in actions[i]) {
						if(key.search(Constants.actionType) != -1){
							if(actions[i][key].search(Constants.Accept) != -1){
								if(bothButtons == false){
									btn.classList.add("bothButtonsAccept_CIF");
									btn.style.width = "calc(100% - 30px)";//(panelWidth - 30) + "px";
								}else{
									btn.classList.add("singleButtonAccept_CIF");
									btn.style.width = "calc(50% - 20px)";//((panelWidth / 2) - 20) + "px";
								}
								btn.focus();
								btn.appendChild(span);
								btn.getElementsByTagName("span")[0].classList.add("acceptButtonSpan_CIF");
								btn.getElementsByTagName("span")[0].classList.add("FontIcons_acceptButtonSpan_CIF");
							}else if(actions[i][key].search(Constants.Reject) != -1){
								if(bothButtons == false){
									btn.classList.add("bothButtonsReject_CIF");
									btn.style.width = "calc(100% - 30px)";//(panelWidth - 30) + "px";
								}else{
									btn.classList.add("singleButtonReject_CIF");
									btn.style.width = "calc(50% - 20px)";//((panelWidth / 2) - 20) + "px";
								}
								btn.appendChild(span);
								btn.getElementsByTagName("span")[0].classList.add("rejectButtonSpan_CIF");
								btn.getElementsByTagName("span")[0].classList.add("FontIcons-rejectHardNotification_CIF");
							} else if (actions[i][key].search(Constants.Timeout) != -1) {
								btn.classList.add("timeOutCIF");
								isTimeOut = true;
							}
						}
						if(key.search(Constants.actionDisplayText) != -1){
							var span = document.createElement('span');
							span.innerText = actions[i][key];
							span.classList.add("actionDisplayText_CIF");
							span.setAttribute("aria-label", actions[i][key]);
							btn.appendChild(span);
						}else if(key.search(Constants.actionName) != -1){
							actionNameCIF = actions[i][key];
						}else if(key.search(Constants.actionReturnValue) != -1){
							actionReturnValueCIF = actions[i][key];
						}else if(key.search(Constants.actionColor) != -1){
							btn.style.backgroundColor = actions[i][key];
						}
					}
					actionParam.set(Constants.actionName,actionNameCIF);
					actionParam.set(Constants.actionReturnValue,actionReturnValueCIF);
					if(isTimeOut){
						map.set(currentToast,actionParam);
					}else{
						map.set(btn,actionParam);
					}
				}
			}
			toastDiv.getElementsByClassName("header_CIF")[len-1].addEventListener("click", function() {
				childDivs = toastDiv.getElementsByTagName('div');
				if(childDivs != null){
					for( i=0; i< childDivs.length; i++ ){
						let childDiv = childDivs[i];
						if(childDiv.getElementsByClassName("bodyDivCIF")[0] != null){
							childDiv.getElementsByClassName("bodyDivCIF")[0].setAttribute('style', 'display:none;');
							childDiv.getElementsByClassName("headerTimerCIF")[0].setAttribute('style', 'display:block;');
						}
						if(childDiv.getElementsByClassName("header_NotificationType_CIF header_NotificationType_CIF_Broadcast")[0] != null){
							childDiv.getElementsByClassName("header_NotificationType_CIF header_NotificationType_CIF_Broadcast")[0].setAttribute('style', 'display:none;');
						}
					}
					this.parentElement.getElementsByClassName("bodyDivCIF")[0].setAttribute('style', 'display:block;');
					this.parentElement.getElementsByClassName("headerTimerCIF")[0].style.display = "none";
					this.parentElement.getElementsByClassName("header_NotificationType_CIF header_NotificationType_CIF_Broadcast")[0].setAttribute('style', 'display:block;');
					if(this.parentElement.getElementsByClassName("timeOutCIF")[0] == null || this.parentElement.getElementsByClassName("timeOutCIF")[0] == "undefined"){
						this.parentElement.getElementsByClassName("header_NotificationType_CIF header_NotificationType_CIF_Broadcast")[0].setAttribute('style', 'display:none;');
					}
				}
			});
		}
		var childDivs = toastDiv.getElementsByTagName('div');
		if(childDivs != null){
			let countBodyDisp = 0;
			let countNotificationTypeDisp = 0;
			for( i=0; i< childDivs.length; i++ ){
				let childDiv = childDivs[i];
				if(childDiv.getElementsByClassName("bodyDivCIF")[0] != null){
					if(countBodyDisp == 0){
						childDiv.getElementsByClassName("bodyDivCIF")[0].setAttribute('style', 'display:block;');
						childDiv.getElementsByClassName("headerTimerCIF")[0].setAttribute('style', 'display:none;');
					}else{
						childDiv.getElementsByClassName("bodyDivCIF")[0].setAttribute('style', 'display:none;');
						childDiv.getElementsByClassName("headerTimerCIF")[0].setAttribute('style', 'display:block;');
					}
					countBodyDisp++;
				}
				if(childDiv.getElementsByClassName("header_NotificationType_CIF header_NotificationType_CIF_Broadcast")[0] != null){
					if(countNotificationTypeDisp == 0){
						if(isTimeOut == true){
							childDiv.getElementsByClassName("header_NotificationType_CIF header_NotificationType_CIF_Broadcast")[0].setAttribute('style', 'display:block;');
						}
					}else{
						childDiv.getElementsByClassName("header_NotificationType_CIF header_NotificationType_CIF_Broadcast")[0].setAttribute('style', 'display:none;');
					}
					countNotificationTypeDisp++;
				}
			}
			for( i=0; i< childDivs.length; i++ ){
				let childDiv = childDivs[i];
				if(childDiv.getElementsByClassName("headerTimerCIF")[0] != null){
					childDiv.getElementsByClassName("headerTimerCIF")[0].setAttribute('style', 'display:none;');
					break;
				}
			}
		}
		return map;
	}

	/**
	 * Method to construct soft toast popup widget
	 *
	 * @param contains header,body of the popup
	 *
	*/
	export function renderSoftNotification(header: any, body: any, notificationType: string): Map<string,any>{
		let map = new Map();
		let widgetIFrame = (<HTMLIFrameElement>listenerWindow.document.getElementById(Constants.widgetIframeId));
		let toastDiv =  widgetIFrame.contentWindow.document.getElementById("softToastDiv");
		toastDiv.setAttribute("role","alert");
		var childDivs = toastDiv.getElementsByTagName('div');
		let i = 0;
		if(childDivs != null){
			for( i=0; i< childDivs.length; i++ ){
				let childDiv = childDivs[i];
				if(childDiv != null){
					childDiv.setAttribute('style','display:none;');
				}
			}
		}
		toastDiv.insertAdjacentHTML('afterbegin', '<div tabindex="0" id="CIFSoftToast" class="CIFSoftNotificationToast"><div id="header_SoftNotification_CIF" class="headerSoftNotification_CIF"><div style="height:14px"></div></div><div id="bodyDivSoftToastCIF" class="bodyDivSoftToast_CIF"></div></div>');
		//Constructing header
		let panelWidth = "100%";
		let chatWindowHeader = widgetIFrame.contentWindow.document.getElementById("header_SoftNotification_CIF");
		var span = document.createElement("span");
		chatWindowHeader.appendChild(span);
		chatWindowHeader.getElementsByTagName("span")[0].classList.add("chatWindowHeaderSpan_CIF");
		widgetIFrame.contentWindow.document.getElementById("CIFSoftToast").style.width = panelWidth;//panelWidth+"px";
		if(notificationType.search(Constants.SMS) != -1){
			chatWindowHeader.getElementsByTagName("span")[0].classList.add("FontIcons_smsWindowHeaderSpan_CIF");
		}else if(notificationType.search(Constants.Chat) != -1){
			chatWindowHeader.getElementsByTagName("span")[0].classList.add("FontIcons_chatWindowHeaderSpan_CIF");
		}else if(notificationType.search(Constants.Informational) != -1){
			chatWindowHeader.getElementsByTagName("span")[0].classList.add("FontIcons_linkToConversationSuccessWindowHeaderSpan_CIF");
		}else if(notificationType.search(Constants.Failure) != -1){
			chatWindowHeader.getElementsByTagName("span")[0].classList.add("FontIcons_linkToConversationFailWindowHeaderSpan_CIF");
		}
		var label = document.createElement("label");
		chatWindowHeader.appendChild(label);
		label.classList.add("chatWindowHeaderLabel_CIF");
		label.innerText = header[0];
		label.setAttribute("aria-label", header[0]);
		//label.style.width = panelWidth+"px";
		span = document.createElement("span");
		span.classList.add("closeSoftNotification_CIF");
		span.classList.add("FontIcons-closeSoftNotification_CIF");
		span.setAttribute("tabindex", "0");
		span.setAttribute("aria-label", "Close");
		chatWindowHeader.appendChild(span);
		chatWindowHeader.getElementsByTagName("span")[1].id = "closeSoftNotificationCIF";
		var div = document.createElement("div");
		div.classList.add("chatWindowHeaderDiv_CIF");
		chatWindowHeader.appendChild(div);
		//Constructing body
		if(body != null && body != "undefined"){
			let notificationBody = widgetIFrame.contentWindow.document.getElementById("bodyDivSoftToastCIF");
			if(typeof body == "string"){
				div = document.createElement("div");
				div.classList.add("chatWindowHeaderDiv_CIF");
				notificationBody.appendChild(div);
				var label1 = document.createElement("label");
																									 
				notificationBody.appendChild(label1);
				label1.classList.add("notificationBodyCIF");
				label1.innerText = body;
				label1.setAttribute("aria-label", body);
				div = document.createElement("div");
				div.classList.add("chatWindowHeaderDiv_CIF");
				notificationBody.appendChild(div);
			}else{
				div = document.createElement("div");
				div.classList.add("chatWindowHeaderDiv_CIF");
				notificationBody.appendChild(div);
				for(i = 0; i < body.length; i++){
					for (let key in body[i]) {
																									   
						/*var label1 = document.createElement("label");
						notificationBody.appendChild(label1);
						label1.classList.add("notificationBodyLabel1_CIF");
						var label2 = document.createElement("label");
						notificationBody.appendChild(label2);
						label2.classList.add("notificationBodyLabel2_CIF");
						label1.innerText = key;
						label1.setAttribute("aria-label", key);
						label2.innerText = body[i][key];
						label2.setAttribute("aria-label", body[i][key]);
						label1.style.width = "30%";//(panelWidth * 0.3)+"px";
						label2.style.width = "calc(70% - 30px)";//((panelWidth * 0.7) - 20)+"px";
						div = document.createElement("div");
						div.classList.add("chatWindowHeaderDiv_CIF");
						notificationBody.appendChild(div);*/

						div = document.createElement("div");
						div.classList.add("chatWindowHeaderDiv_CIF");
						notificationBody.appendChild(div);
						var label1 = document.createElement("label");
																									 
						notificationBody.appendChild(label1);
						label1.classList.add("notificationBodyCIF");
						label1.innerText = body[i][key];
						label1.setAttribute("aria-label", body[i][key]);
						div = document.createElement("div");
						div.classList.add("chatWindowHeaderDiv_CIF");
						notificationBody.appendChild(div);
					}
				}
			}
		}
		if(childDivs!=null && childDivs.length > 0 && childDivs[0]!= null){
			childDivs[0].focus();
			childDivs[0].setAttribute("aria-label", header[0]);
			childDivs[0].setAttribute("role","presentation");
		}
		map.set(widgetIFrame.contentWindow.document.getElementById("closeSoftNotificationCIF"),toastDiv);
		map.set(widgetIFrame.contentWindow.document.getElementById("CIFSoftToast"),toastDiv);
		return map;
	}

	/**
	 * API to invoke toast popup widget
	 *
	 * @param value. It's a string which contains header,body of the popup
	 *
	*/
	export function notifyEventClient(notificationUX: Map<string,Map<string,any>>): Promise<any>{
		let widgetIFrame = (<HTMLIFrameElement>listenerWindow.document.getElementById(Constants.widgetIframeId));
		let toastDiv =  widgetIFrame.contentWindow.document.getElementById("toastDiv");
		toastDiv.setAttribute("role","alert");
		let i = 0;
		let header,body,actions;
		let eventType;
		let waitTime = -1;
		let notificationType: any = [];
		for (let [key, value] of notificationUX) {
			if(key.search(Constants.eventType) != -1){
				console.log(value);
				eventType = value;
			}
			if(key.search(Constants.notificationUXObject) != -1){
				for(let [key1, value1] of value){
					if(key1.search(Constants.headerDataCIF) != -1){
						header = value1;
					}else if(key1.search(Constants.bodyDataCIF) != -1){
						body = value1;
					}else if(key1.search(Constants.actionsCIF) != -1){
						actions = value1;
					}else if(key1.search(Constants.notificationType) != -1){
						notificationType = value1;
					}
				}
			}
		}
		if(header == null || header == "undefined"){
			return postMessageNamespace.rejectWithErrorMessage("The header value is blank. Provide a value to the parameter.");
		}
		if(notificationType[0].search(MessageType.softNotification) != -1){ //For Soft notification
			if(body == null || body == "undefined"){
				return postMessageNamespace.rejectWithErrorMessage("The body value is blank. Provide a value to the parameter.");
			}
		}
		if(notificationType == null || notificationType == "undefined"  || notificationType.length <= 0){
			return postMessageNamespace.rejectWithErrorMessage("The notificationType value is blank. Provide a value to the parameter.");
		}
		if(notificationType[0].search(MessageType.softNotification) == -1){ //For Soft notification
			noOfNotifications++;
			if(noOfNotifications > 5){
				toastDiv.removeChild(toastDiv.getElementsByClassName("CIFToastDiv")[toastDiv.getElementsByClassName("CIFToastDiv").length-1]);
				noOfNotifications--;
			}
		}
		let map = new Map();
		map = renderEventNotification(header,body,actions,notificationType,eventType);
		if(actions != null && actions != "undefined"){
			for( i = 0; i < actions.length; i++){
				for (let key in actions[i]) {
					if(key.search(Constants.Timer) != -1){
						waitTime = actions[i][key];
					}
				}
			}
		}
		return new Promise(function (resolve,reject) {
			if(notificationType[0].search(MessageType.softNotification) != -1){
				for(let [key,value] of map){
					if(key == widgetIFrame.contentWindow.document.getElementById("CIFSoftToast")){
						key.addEventListener("click", function clickListener() {
							key.removeEventListener("click", clickListener);
							key.parentElement.removeChild(key);
							var mapReturn = new Map().set(Constants.value, new Map().set(Constants.actionName, Constants.Accept));
							return resolve(mapReturn);
						});
					}else{
						key.addEventListener("click", function clickListener() {
							key.removeEventListener("click", clickListener);
							key.parentElement.parentElement.parentElement.removeChild(key.parentElement.parentElement);
							var mapReturn = new Map().set(Constants.value, new Map().set(Constants.actionName, Constants.Reject));
							return resolve(mapReturn);
						});
						key.addEventListener("keydown", function clickListener(event: any) {
							if (event.keyCode == 32 || event.keyCode == 13) {
								key.removeEventListener("keydown", clickListener);
								key.parentElement.parentElement.parentElement.removeChild(key.parentElement.parentElement);
								var mapReturn = new Map().set(Constants.value, new Map().set(Constants.actionName, Constants.Reject));
								return resolve(mapReturn);
							}
						});
						setTimeout(function(){
							if(key.parentElement.parentElement.parentElement != null){
								key.parentElement.parentElement.parentElement.removeChild(key.parentElement.parentElement);
								var mapReturn = new Map().set(Constants.value, new Map().set(Constants.actionName, Constants.Timeout));
								return resolve(mapReturn);
							}
						}, 20000);
					}
				}
			}else{
				len = toastDiv.getElementsByClassName("CIFToastDiv").length;
				if(waitTime == -1){
					(toastDiv.getElementsByClassName("header_NotificationType_CIF header_NotificationType_CIF_Broadcast")[toastDiv.getElementsByClassName("CIFToastDiv").length-1]).setAttribute('style', 'display:none;');
				}
				for(let [key,value] of map){
					if(key == toastDiv.getElementsByClassName("CIFToastDiv")[toastDiv.getElementsByClassName("CIFToastDiv").length-1]){
						if(waitTime != -1){
							var counter = waitTime/1000;
							key.getElementsByClassName("broadCastLabel1")[0].innerHTML = counter+"";
							key.getElementsByClassName("headerTimerCIF")[0].innerHTML = counter+" sec ";
							var interval = setInterval(function() {
								var counterDecr = +(key.getElementsByClassName("broadCastLabel1")[0].innerHTML);
								counterDecr--;
								key.getElementsByClassName("broadCastLabel1")[0].innerHTML = counterDecr+"";
								key.getElementsByClassName("headerTimerCIF")[0].innerHTML = counterDecr+" sec ";
    							if (counterDecr < 0) {
									clearInterval(interval);
									if(key != null && key.parentElement != null){
										key.parentElement.removeChild(key);
										noOfNotifications--;
										var childDivs = toastDiv.getElementsByTagName('div');
										if(childDivs != null){
											for( i=0; i< childDivs.length; i++ ){
												let childDiv = childDivs[i];
												if(childDiv.getElementsByClassName("bodyDivCIF")[0] != null){
													childDiv.getElementsByClassName("bodyDivCIF")[0].setAttribute('style', 'display:none;');
												}
												if(childDiv.getElementsByClassName("header_NotificationType_CIF header_NotificationType_CIF_Broadcast")[0] != null){
													childDiv.getElementsByClassName("header_NotificationType_CIF header_NotificationType_CIF_Broadcast")[0].setAttribute('style', 'display:none;');
												}
											}
											let isBodyDisp = 0;
											let isNotificationTypeDisp = 0;
											for( i=0; i< childDivs.length; i++ ){
												let childDiv = childDivs[i];
												if(childDiv.getElementsByClassName("bodyDivCIF")[0] != null){
													childDiv.getElementsByClassName("bodyDivCIF")[0].setAttribute('style', 'display:block;');
													childDiv.getElementsByClassName("headerTimerCIF")[0].setAttribute('style', 'display:none;');
													isBodyDisp = 1;
												}
												if(childDiv.getElementsByClassName("header_NotificationType_CIF header_NotificationType_CIF_Broadcast")[0] != null){
													childDiv.getElementsByClassName("header_NotificationType_CIF header_NotificationType_CIF_Broadcast")[0].setAttribute('style', 'display:block;');
													isNotificationTypeDisp = 1;
												}
												if(isBodyDisp == 1 && isNotificationTypeDisp == 1){
													break;
												}
											}
										}
									}
									let len = toastDiv.getElementsByClassName("CIFToastDiv").length;
									let x = 0;
									for(x = 1; x <= len; x++){
										toastDiv.getElementsByClassName("CIFToastDiv")[x-1].id = "CIFToastDiv_"+x;			
									}
									var mapReturn = new Map().set(Constants.value,value);
									return resolve(mapReturn);
								}
							}, 1000);
						}
					}else{
						key.addEventListener("click", function clickListener() {
							key.removeEventListener("click", clickListener);
							key.parentElement.parentElement.style.display = "none";
							key.parentElement.parentElement.parentElement.removeChild(key.parentElement.parentElement);
							noOfNotifications--;
							var childDivs = toastDiv.getElementsByTagName('div');
							if(childDivs != null){
								let isBodyDisp = 0;
								let isNotificationTypeDisp = 0;
								for( i=0; i< childDivs.length; i++ ){
									let childDiv = childDivs[i];
									if(childDiv.getElementsByClassName("bodyDivCIF")[0] != null){
										childDiv.getElementsByClassName("bodyDivCIF")[0].setAttribute('style', 'display:block;');
										childDiv.getElementsByClassName("headerTimerCIF")[0].setAttribute('style', 'display:none;');
										isBodyDisp = 1;
									}
									if(childDiv.getElementsByClassName("header_NotificationType_CIF header_NotificationType_CIF_Broadcast")[0] != null){
										if(waitTime != -1){
											childDiv.getElementsByClassName("header_NotificationType_CIF header_NotificationType_CIF_Broadcast")[0].setAttribute('style', 'display:block;');
										}
										isNotificationTypeDisp = 1;
									}
									if(isBodyDisp == 1 && isNotificationTypeDisp == 1){
										break;
									}
								}
							}
							let len = toastDiv.getElementsByClassName("CIFToastDiv").length;
							let x = 0;
							for(x = 1; x <= len; x++){
								toastDiv.getElementsByClassName("CIFToastDiv")[x-1].id = "CIFToastDiv_"+x;
							}
							var mapReturn = new Map().set(Constants.value,value);
							return resolve(mapReturn);
						});
					}
				}
			}
		});
    }
}
