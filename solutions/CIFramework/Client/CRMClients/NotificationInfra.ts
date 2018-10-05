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
    export function renderEventNotification(header:any,body:any,actions:any,icon:any,notificationType:any): Map<any,any>{
       	let widgetIFrame = (<HTMLIFrameElement>listenerWindow.document.getElementById(Constants.widgetIframeId));
		let toastDiv =  widgetIFrame.contentWindow.document.getElementById("toastDiv");
		let i = 0;
		let map = new Map();
		if(notificationType[0].search(MessageType.softNotification) != -1){ //For Soft notification
			map = renderSoftNotification(header,body);
		}else{
            toastDiv.insertAdjacentHTML('beforeend', '<div id="CIFToast" class="CIFToastDiv" style="position: relative;display:table;background-color: rgba(102, 102, 102, 0.5);width:280px;z-index: 2;border-radius: 4px;background-color: #333333;padding-bottom: 10px;"><div class="header_NotificationType_CIF" style="display:block;min-height:21px;"></div><div class="header_CIF" style="display:block;min-height:71px;"><img style="width:71px; height:71px; float:left; margin-left: 10px;" alt="Notification Icon"></img><div class="headerKeyCIF" style="font-family:Segoe UI;font-style:normal;font-size:12px;text-align:left;color:#D8D8D8;"></div><div class="headerNameCIF" style="font-family:Segoe UI;font-style:Semibold;font-size:18px;text-align:left;color:#FFFFFF;"></div><div class="headerDetailsCIF"  style="font-family:Segoe UI;font-style:normal;font-size:12px;text-align:left;color:#D8D8D8;"></div></div><div></div><div class="bodyDivCIF" style="display:block;"><div class="bodyDivider_CIF" style="width:280px; height:1px; background-color: #F1F1F1;"></div><p class="body_CIF"><div></div></p></div></div>');
			let len = toastDiv.getElementsByClassName("CIFToastDiv").length;
			let currentToast = toastDiv.getElementsByClassName("CIFToastDiv")[len-1];
			if(notificationType != null && notificationType != "undefined"  && notificationType.length > 0){
				let headerElement = toastDiv.getElementsByClassName("header_NotificationType_CIF")[len-1];
				if(notificationType[0].search(MessageType.broadCast) != -1 && notificationType.length == 3){
					headerElement.setAttribute('style','display:block;min-height:21px;width:280px;background-color:#000000;');
					var label1 = document.createElement("label");
					headerElement.appendChild(label1);
					label1.setAttribute('style', 'margin-left: 10px;font-family:Segoe UI;font-style:Semibold;font-size:11px;text-align:Left;height:13px;color:#FFFFFF;margin-right:35px;');
					label1.innerText = notificationType[1];
					var label2 = document.createElement("label");
					headerElement.appendChild(label2);
					label2.setAttribute('style', 'margin-left: 10px;font-family:Segoe UI;font-style:Regular;font-size:11px;text-align:Right;height:13px;color:#FFFFFF;');
					label2.innerText = notificationType[2];
				}else if((notificationType[0].search(MessageType.notification) != -1 || notificationType[0].search(MessageType.escalation)) != -1 && notificationType.length == 3){
					headerElement.setAttribute('style','display:block;min-height:21px;background-color:#B22912;width:280px;');
					var img = document.createElement("img");
					headerElement.appendChild(img);
					headerElement.getElementsByTagName("img")[0].src = notificationType[1];
					headerElement.getElementsByTagName("img")[0].setAttribute('style','width:12px; height:12px; font-style:Regular; font-size:12px; text-align:Left; float:left; margin-right:10px;margin-left: 10px;');
					var label = document.createElement("label");
					headerElement.appendChild(label);
					label.setAttribute('style', 'font-family:Segoe UI;font-style:Semibold;font-size:11px;text-align:Left;height:13px;color:#FFFFFF;');
					label.innerText = notificationType[2];
				}else if(notificationType[0].search(MessageType.transfer) != -1 && notificationType.length == 2){
					headerElement.setAttribute('style','display:block;min-height:21px;background-color:#B22912;width:280px;');
					var label1 = document.createElement("label");
					headerElement.appendChild(label1);
					label1.setAttribute('style', 'margin-left: 10px;font-family:Segoe UI;font-style:Semibold;font-size:11px;text-align:Left;height:13px;color:#FFFFFF;');
					label1.innerText = notificationType[1];
				}else if(notificationType[0].search(MessageType.internalCommunication) != -1 && notificationType.length == 3){
					headerElement.setAttribute('style','display:block;min-height:21px;background-color:#000000;width:280px;');
					var img = document.createElement("img");
					headerElement.appendChild(img);
					headerElement.getElementsByTagName("img")[0].src = notificationType[1];
					headerElement.getElementsByTagName("img")[0].setAttribute('style','width:12px; height:12px; font-style:Regular; font-size:12px; text-align:Left; float:left; margin-right:10px;margin-left: 10px;');
					var label = document.createElement("label");
					headerElement.appendChild(label);
					label.setAttribute('style', 'font-family:Segoe UI;font-style:Semibold;font-size:11px;text-align:Left;height:13px;color:#FFFFFF;');
					label.innerText = notificationType[2];
					currentToast.setAttribute('style','position: relative;display:table;background-color: rgba(102, 102, 102, 0.5);width:280px;z-index: 2;border-radius: 4px;background-color: #25477A;padding-bottom: 10px');
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
						label1.setAttribute('style', 'display: inline-table;margin-left: 10px;font-family:Segoe UI;font-style:normal;font-size:14px;text-align:left;height:16px;margin-right:11px;width:78px;word-wrap:break-word;color:#D8D8D8;');
						var label2 = document.createElement("label");
						notificationBody.appendChild(label2);
						label2.setAttribute('style', 'font-family:Segoe UI;font-style:Semibold;font-size:14px;text-align:left;height:16px;width:163px;word-wrap:break-word;color:#FFFFFF;display:inline-table;');
						label1.innerText = key;
						label2.innerText = body[i][key];
						var div = document.createElement("div");
						notificationBody.appendChild(div);
					}
				}
			}else{
				toastDiv.getElementsByClassName("bodyDivider_CIF")[len-1].setAttribute('style','width:280px; height:1px; background-color: #F1F1F1; display:none');
			}
			toastDiv.getElementsByClassName("headerDetailsCIF")[len-1].innerHTML = headerVal;
            toastDiv.getElementsByClassName("header_CIF")[len - 1].getElementsByTagName("img")[0].src = "/WebResources/msdyn_Defaultprovider.svg";
			let chatWindowBody = toastDiv.getElementsByClassName("bodyDivCIF")[len-1];
			if(actions != null && actions != "undefined"){
				for( i = 0; i < actions.length; i++){
					var btn = document.createElement("BUTTON");
					chatWindowBody.appendChild(btn);
					var img = document.createElement("img");
					btn.appendChild(img);
					let actionParam = new Map();
					let k = 0;
					let isTimeOut = false;
					let actionNameCIF,actionReturnValueCIF;
					let bothButtons = false;
					let accept = false;
					let reject = false;
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
					if(accept == true && reject == true){
						bothButtons = true;
					}
					for (let key in actions[i]) {
						if(key.search(Constants.actionType) != -1){
							if(actions[i][key].search(Constants.Accept) != -1){
								if(bothButtons == false){
									btn.setAttribute('style','width:252px;background-color:#47C21D;height:40px;margin-left: 10px;');
								}else{
									btn.setAttribute('style','width:120px;background-color:#47C21D;height:40px;margin-right:14px;margin-left: 10px;');
								}
								btn.getElementsByTagName("img")[0].src = ""; //Default image URL.
								btn.getElementsByTagName("img")[0].setAttribute('style','width:16px; height:16px; float:left; font-style:Regular; font-size:16px; text-align:Left;');
							}else if(actions[i][key].search(Constants.Reject) != -1){
								if(bothButtons == false){
									btn.setAttribute('style','width:252px;background-color:#EA0600;height:40px;margin-left: 10px;');
								}else{
									btn.setAttribute('style','width:120px;background-color:#EA0600;height:40px;margin-right:14px;');
								}
								btn.getElementsByTagName("img")[0].src = ""; //Default image URL.
								btn.getElementsByTagName("img")[0].setAttribute('style','width:16px; height:16px; float:left; font-style:Regular; font-size:16px; text-align:Left;');
							}else if(actions[i][key].search(Constants.Timeout) != -1){
								btn.setAttribute('style','display:none');
								isTimeOut = true;
							}
						}
						if(key.search(Constants.actionDisplayText) != -1){
							btn.innerText = actions[i][key];
						}else if(key.search(Constants.actionName) != -1){
							actionNameCIF = actions[i][key];
						}else if(key.search(Constants.actionReturnValue) != -1){
							actionReturnValueCIF = actions[i][key];
						}else if(key.search(Constants.actionColor) != -1){
							btn.style.backgroundColor = actions[i][key];
						}else if(key.search(Constants.actionImage) != -1){
							btn.getElementsByTagName("img")[0].src = actions[i][key];
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
    export function renderSoftNotification(header: any, body: any): Map<string,any>{
		let map = new Map();
		let widgetIFrame = (<HTMLIFrameElement>listenerWindow.document.getElementById(Constants.widgetIframeId));
		let toastDiv =  widgetIFrame.contentWindow.document.getElementById("softToastDiv");
		var childDivs = toastDiv.getElementsByTagName('div');
		let i = 0;
		if(childDivs != null){
			for( i=0; i< childDivs.length; i++ ){
				let childDiv = childDivs[i];
				if(childDiv != null){
					childDiv.setAttribute('style', 'display:none;');
				}
			}
		}
		toastDiv.insertAdjacentHTML('afterbegin', '<div id="CIFSoftToast" style="position:relative;display:table;box-shadow: 4px 0 2px rgba(0, 0, 0, 0.5);width:320px;border-radius: 4px;background-color: #333333;"><div id="header_SoftNotification_CIF" style="display:block;min-height:21px;"></div><div id="bodyDivSoftToastCIF" style="display:block;"></div></div>');
		//Constructing header
		let chatWindowHeader = widgetIFrame.contentWindow.document.getElementById("header_SoftNotification_CIF");
		var img = document.createElement("img");
		chatWindowHeader.appendChild(img);
		chatWindowHeader.getElementsByTagName("img")[0].src = header[0];
		chatWindowHeader.getElementsByTagName("img")[0].setAttribute('style','width:16px; height:16px; font-style:Regular; font-size:12px; text-align:Left; float:left; margin-right:10px;margin-left: 10px;');
		var label = document.createElement("label");
		chatWindowHeader.appendChild(label);
		label.setAttribute('style', 'font-family:Segoe UI;font-style:Semibold;font-size:14px;text-align:Left;height:16px;color:#FFFFFF; margin-right:50px;');
		label.innerText = header[1];
		img = document.createElement("img");
		chatWindowHeader.appendChild(img);
		chatWindowHeader.getElementsByTagName("img")[1].id = "closeSoftNotificationCIF";
		chatWindowHeader.getElementsByTagName("img")[1].src = "https://wecision.com/enterprise/images/icons/closeIcon.png";
		//chatWindowHeader.getElementsByTagName("img")[1].setAttribute('style','width:16px; height:16px; font-style:Regular; font-size:16px; text-align:Left; float:left; margin-right:10px;margin-left: 250px;');
		var div = document.createElement("div");
		div.setAttribute('style','height:11px;');
		chatWindowHeader.appendChild(div);
		//Constructing body
		if(body != null && body != "undefined"){
			if(typeof body == "string"){
				var label1 = document.createElement("label");
				let notificationBody = widgetIFrame.contentWindow.document.getElementById("bodyDivSoftToastCIF");
				notificationBody.appendChild(label1);
				label1.setAttribute('style', 'display: inline-table;margin-left: 10px;font-family:Segoe UI;font-style:normal;font-size:14px;text-align:left;color:#D8D8D8;');
				label1.innerText = body;
			}else{
				for(i = 0; i < body.length; i++){
					for (let key in body[i]) {
						let notificationBody = widgetIFrame.contentWindow.document.getElementById("bodyDivSoftToastCIF");
						var label1 = document.createElement("label");
						notificationBody.appendChild(label1);
						label1.setAttribute('style', 'display: inline-table;margin-left: 10px;font-family:Segoe UI;font-style:normal;font-size:14px;text-align:left;height:16px;margin-right:11px;width:78px;word-wrap:break-word;color:#D8D8D8;');
						var label2 = document.createElement("label");
						notificationBody.appendChild(label2);
						label2.setAttribute('style', 'font-family:Segoe UI;font-style:Semibold;font-size:14px;text-align:left;height:16px;width:163px;word-wrap:break-word;color:#FFFFFF;display:inline-table;');
						label1.innerText = key;
						label2.innerText = body[i][key];
						div = document.createElement("div");
						div.setAttribute('style','height:11px;');
						notificationBody.appendChild(div);
					}
				}
			}
		}
		map.set(widgetIFrame.contentWindow.document.getElementById("closeSoftNotificationCIF"),toastDiv);
		return map;
	}
}
