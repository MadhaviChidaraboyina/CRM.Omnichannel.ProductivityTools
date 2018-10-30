/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="Client.ts" />
/// <reference path="Constants.ts" />
/// <reference path="../Constants.ts" />
/// <reference path="State.ts" />
/// <reference path="../TelemetryHelper.ts" />
/// <reference path="aria-webjs-sdk-1.6.2.d.ts" />

namespace Microsoft.CIFramework.Internal {
	let Constants = Microsoft.CIFramework.Constants;
	const listenerWindow = window.parent;
		
	/**
	 * API to invoke toast popup widget
	 *
	 * @param value. It's a string which contains header,body of the popup
	 *
	*/
    export function renderEventNotification(header:any,body:any,actions:any,notificationType:any,panelWidth:any): Map<any,any>{
       	let widgetIFrame = (<HTMLIFrameElement>listenerWindow.document.getElementById(Constants.widgetIframeId));
		let toastDiv =  widgetIFrame.contentWindow.document.getElementById("toastDiv");
		let i = 0;
		let map = new Map();
		if(notificationType[0].search(MessageType.softNotification) != -1){ //For Soft notification
			map = renderSoftNotification(header,body,notificationType[1],panelWidth);
		}else{
			toastDiv.insertAdjacentHTML('beforeend', '<div id="CIFToast" tabindex="0" aria-label="Notification Window" class="CIFToastDiv"><div tabindex="0" class="header_NotificationType_CIF"></div><div aria-label="Notification Header" tabindex="0" class="header_CIF"><span class="CIFHeaderIcon"></span><div tabindex="0" class="headerKeyCIF"></div><div tabindex="0" class="headerNameCIF"></div><div tabindex="0" class="headerDetailsCIF"></div></div><div></div><div tabindex="0" aria-label="Notification Body" class="bodyDivCIF"><div class="bodyDivider_CIF"></div><p tabindex="0" class="body_CIF"><div></div></p></div></div>');
			let len = toastDiv.getElementsByClassName("CIFToastDiv").length;
			toastDiv.getElementsByClassName("CIFHeaderIcon")[len-1].classList.add("FontIcons_CIFHeaderIcon");
			let currentToast = toastDiv.getElementsByClassName("CIFToastDiv")[len-1];
			toastDiv.getElementsByClassName("CIFToastDiv")[len-1].id = "CIFToastDiv_"+len;
			widgetIFrame.contentWindow.document.getElementById("CIFToastDiv_"+len).style.width = panelWidth+"px";
			if(notificationType != null && notificationType != "undefined"  && notificationType.length > 0){
				let headerElement = toastDiv.getElementsByClassName("header_NotificationType_CIF")[len-1];
				if(notificationType[0].search(MessageType.broadCast) != -1 && notificationType.length == 3){
					headerElement.classList.add("header_NotificationType_CIF_Broadcast");
					toastDiv.getElementsByClassName("header_NotificationType_CIF_Broadcast")[len-1].id = "CIFToastType_"+len;
					widgetIFrame.contentWindow.document.getElementById("CIFToastType_"+len).style.width = panelWidth+"px";
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
					widgetIFrame.contentWindow.document.getElementById("CIFToastType_"+len).style.width = panelWidth+"px";
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
					widgetIFrame.contentWindow.document.getElementById("CIFToastType_"+len).style.width = panelWidth+"px";
					var label1 = document.createElement("label");
					headerElement.appendChild(label1);
					label1.classList.add("transferLabel");
					label1.innerText = notificationType[1];
					label1.setAttribute("aria-label", notificationType[1]);
				}else if(notificationType[0].search(MessageType.internalCommunication) != -1 && notificationType.length == 2){
					headerElement.classList.add("header_NotificationType_CIF_internalCommunication");
					toastDiv.getElementsByClassName("header_NotificationType_CIF_internalCommunication")[len-1].id = "CIFToastType_"+len;
					widgetIFrame.contentWindow.document.getElementById("CIFToastType_"+len).style.width = panelWidth+"px";
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
						var label1 = document.createElement("label");
						notificationBody.appendChild(label1);
						label1.classList.add("body_CIFLabel1");
						var label2 = document.createElement("label");
						label2.classList.add("body_CIFLabel2");
						label1.innerText = key;
						label1.setAttribute("aria-label", key);
						label2.innerText = body[i][key];
						label2.setAttribute("aria-label", body[i][key]);
						label2.addEventListener("mouseover", function mouseOverListener() {
							this.classList.add("body_CIFLabel2_mouseover");
							label2.style.width = ((panelWidth * 0.7) - 20)+"px";
						});
						label2.addEventListener("mouseout", function mouseoutListener() {
							this.classList.add("body_CIFLabel2_mouseout");
							label2.style.width = ((panelWidth * 0.7) - 20)+"px";
						});
						label1.style.width = (panelWidth * 0.3)+"px";
						label2.style.width = ((panelWidth * 0.7) - 20)+"px";
						notificationBody.appendChild(label2);
						var div = document.createElement("div");
						notificationBody.appendChild(div);
					}
				}
			}else{
				toastDiv.getElementsByClassName("bodyDivider_CIF")[len-1].classList.add("bodyDivider_CIF_invisible");
			}
			toastDiv.getElementsByClassName("bodyDivider_CIF")[len-1].id = "CIFToastDivider_"+len;
			widgetIFrame.contentWindow.document.getElementById("CIFToastDivider_"+len).style.width = panelWidth+"px";
			toastDiv.getElementsByClassName("bodyDivider_CIF")[len-1].id = "CIFToastDividerInvisible_"+len;
			widgetIFrame.contentWindow.document.getElementById("CIFToastDividerInvisible_"+len).style.width = panelWidth+"px";
			toastDiv.getElementsByClassName("headerDetailsCIF")[len-1].innerHTML = headerVal;
			toastDiv.getElementsByClassName("headerDetailsCIF")[len-1].setAttribute("aria-label", headerVal);
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
					let isTimeOut = false;
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
									btn.style.width = (panelWidth - 30) + "px";
								}else{
									btn.classList.add("singleButtonAccept_CIF");
									btn.style.width = ((panelWidth / 2) - 20) + "px";
								}
								btn.appendChild(span);
								btn.getElementsByTagName("span")[0].classList.add("acceptButtonSpan_CIF");
								btn.getElementsByTagName("span")[0].classList.add("FontIcons_acceptButtonSpan_CIF");
							}else if(actions[i][key].search(Constants.Reject) != -1){
								if(bothButtons == false){
									btn.classList.add("bothButtonsReject_CIF");
									btn.style.width = (panelWidth - 30) + "px";
								}else{
									btn.classList.add("singleButtonReject_CIF");
									btn.style.width = ((panelWidth / 2) - 20) + "px";
								}
								btn.appendChild(span);
								btn.getElementsByTagName("span")[0].classList.add("rejectButtonSpan_CIF");
								btn.getElementsByTagName("span")[0].classList.add("FontIcons-rejectHardNotification_CIF");							}else if(actions[i][key].search(Constants.Timeout) != -1){
								btn.classList.add("timeOutCIF");
								isTimeOut = true;
							}
						}
						if(key.search(Constants.actionDisplayText) != -1){
							var span = document.createElement('span');
							span.innerText = actions[i][key];
							span.classList.add("actionDisplayText_CIF");
							span.tabIndex = 0;
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
						}
					}
					this.parentElement.getElementsByClassName("bodyDivCIF")[0].setAttribute('style', 'display:block;');
				}
			});
		}
		var childDivs = toastDiv.getElementsByTagName('div');
		if(childDivs != null){
			let c = 0;
			for( i=0; i< childDivs.length; i++ ){
				let childDiv = childDivs[i];
				if(childDiv.getElementsByClassName("bodyDivCIF")[0] != null){
					if(c == 0){
						childDiv.getElementsByClassName("bodyDivCIF")[0].setAttribute('style', 'display:block;');
					}else{
						childDiv.getElementsByClassName("bodyDivCIF")[0].setAttribute('style', 'display:none;');
					}
					c++;
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
    export function renderSoftNotification(header: any, body: any, notificationType: string,panelWidth: any): Map<string,any>{
		let map = new Map();
		let widgetIFrame = (<HTMLIFrameElement>listenerWindow.document.getElementById(Constants.widgetIframeId));
		let toastDiv =  widgetIFrame.contentWindow.document.getElementById("softToastDiv");
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
		toastDiv.insertAdjacentHTML('afterbegin', '<div tabindex="0" id="CIFSoftToast" class="CIFSoftNotificationToast"><div tabindex="0" id="header_SoftNotification_CIF" class="headerSoftNotification_CIF"><div><br></div></div><div tabindex="0" id="bodyDivSoftToastCIF" class="bodyDivSoftToast_CIF"></div></div>');
		//Constructing header
		let chatWindowHeader = widgetIFrame.contentWindow.document.getElementById("header_SoftNotification_CIF");
		var span = document.createElement("span");
		chatWindowHeader.appendChild(span);
		chatWindowHeader.getElementsByTagName("span")[0].classList.add("chatWindowHeaderSpan_CIF");
		widgetIFrame.contentWindow.document.getElementById("CIFSoftToast").style.width = panelWidth+"px";
		if(notificationType.search(Constants.SMS) != -1){
			chatWindowHeader.getElementsByTagName("span")[0].classList.add("FontIcons_smsWindowHeaderSpan_CIF");
		}else if(notificationType.search(Constants.Chat) != -1){
			chatWindowHeader.getElementsByTagName("span")[0].classList.add("FontIcons_chatWindowHeaderSpan_CIF");
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
		span.setAttribute("aria-label", "Close");
		chatWindowHeader.appendChild(span);
		chatWindowHeader.getElementsByTagName("span")[1].id = "closeSoftNotificationCIF";
		var div = document.createElement("div");
		div.classList.add("chatWindowHeaderDiv_CIF");
		chatWindowHeader.appendChild(div);
		//Constructing body
		if(body != null && body != "undefined"){
			if(typeof body == "string"){
				var label1 = document.createElement("label");
				let notificationBody = widgetIFrame.contentWindow.document.getElementById("bodyDivSoftToastCIF");
				notificationBody.appendChild(label1);
				label1.classList.add("notificationBodyCIF");
				label1.innerText = body;
				label1.setAttribute("aria-label", body);
			}else{
				for(i = 0; i < body.length; i++){
					for (let key in body[i]) {
						let notificationBody = widgetIFrame.contentWindow.document.getElementById("bodyDivSoftToastCIF");
						var label1 = document.createElement("label");
						notificationBody.appendChild(label1);
						label1.classList.add("notificationBodyLabel1_CIF");
						var label2 = document.createElement("label");
						notificationBody.appendChild(label2);
						label2.classList.add("notificationBodyLabel2_CIF");
						label1.innerText = key;
						label1.setAttribute("aria-label", key);
						label2.innerText = body[i][key];
						label2.setAttribute("aria-label", body[i][key]);
						label1.style.width = (panelWidth * 0.3 - 10)+"px";
						label2.style.width = (panelWidth * 0.7 - 30)+"px";
						div = document.createElement("div");
						div.classList.add("chatWindowHeaderDiv_CIF");
						notificationBody.appendChild(div);
					}
				}
			}
		}
		map.set(widgetIFrame.contentWindow.document.getElementById("closeSoftNotificationCIF"),toastDiv);
		return map;
	}
}
