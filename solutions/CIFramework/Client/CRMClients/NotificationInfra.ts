/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="Client.ts" />
/// <reference path="Constants.ts" />
/// <reference path="../Constants.ts" />
/// <reference path="State.ts" />
/// <reference path="../TelemetryHelper.ts" />
/// <reference path="aria-webjs-sdk-1.8.3.d.ts" />
/// <reference path="../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../../../../Packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApiInternal.d.ts" />
/// <reference path= "../Queue.ts" />
/// <reference path="../CIFrameworkUtilities.ts" />
/// <reference path="NotificationRuntime.ts" />

/** @internal */
namespace Microsoft.CIFramework.Internal {
	export let queue = new Microsoft.CIFramework.Queue<INotificationItem>();
	export let closeId = "";
	let Constants = Microsoft.CIFramework.Constants;
	const listenerWindow = window.parent;
	export let noOfNotifications = 0;
	let len = 0;
	export let maxNotificationCount = 10;
	export let queuedNotificationExpirtyTime = 30000;
	export var displayedNotificationTimer: any;
	export var interval: any;
	export let displayDelayTimeMs = 2000;


	function getKeyFromObject(objectArg: any): string {
		return Object.keys(objectArg[0])[0];
	}

	export function getNotificationTitle(header: any, eventType: any, notificationType: any): string {
		if ((eventType.search(Constants.Chat) != -1 || eventType.search(Constants.SMS) != -1 || eventType.search(Constants.Facebook) != -1) && (notificationType[0].search(MessageType.notification) != -1)) {
			let key = getKeyFromObject(header);
			if (!isNullOrUndefined(key)) {
				return key + " " + header[0][key][0];
			}
		}
		else if ((eventType.search(Constants.Chat) != -1 || eventType.search(Constants.SMS) != -1 || eventType.search(Constants.Facebook) != -1) && (notificationType[0].search(MessageType.softNotification) != -1)) {
			return header[0];
		}
		else if (eventType.search(Constants.Informational) != -1 && (isInformationalNotification(notificationType) || isFailureInformationNotification(notificationType) || isInformationChatSoftNotification(notificationType))) {
			return header[0];
		}
		return "";
	}

	export function isInformationChatSoftNotification(notificationType: any): boolean {
		return (notificationType.length == 2 && notificationType[0].search(MessageType.softNotification) != -1 && notificationType[1].search(Constants.Chat) != -1); 
	}

	export function isInformationalNotification(notificationType: any): boolean {
		return (notificationType.length == 2 && notificationType[1].search(Constants.Informational) != -1); 
	}

	export function isFailureInformationNotification(notificationType: any): boolean {
		return (notificationType.length == 2 && notificationType[1].search(Constants.Failure) != -1);
	}

	export function getNotificationDetails(body: any, eventType: any, notificationType: any, waitTime?: number): any {

		var key: string = "";
		if ((eventType.search(Constants.Chat) != -1 || eventType.search(Constants.SMS) != -1 || eventType.search(Constants.Facebook) != -1) && (notificationType[0].search(MessageType.notification) != -1)) {
			key = getKeyFromObject(body);
			var details: any = {};
			details[Utility.getResourceString("NOTIFICATION_DETAIL_COMMENT_TEXT")] = body[0][key];
			if (!IsPlatformNotificationTimeoutInfra) {
				details[Utility.getResourceString("NOTIFICATION_DETAIL_WAIT_TIME_TEXT")] = waitTime.toString() + " " + Utility.getResourceString("NOTIFICATION_WAIT_TIME_SECONDS");
			}
			return details;
		}
		else if (eventType.search(Constants.Informational) != -1 && isInformationChatSoftNotification(notificationType)) {
			key = getKeyFromObject(body);
			return body[0][key];
		}
		else if (eventType.search(Constants.Informational) != -1 && (isInformationalNotification(notificationType) || isFailureInformationNotification(notificationType))) {
			return body;
		}
		return "";
	}

	export function getImageUrl(eventType: any, notificationType: any): string {
		if ((eventType.search(Constants.Chat) != -1) && (notificationType[0].search(MessageType.notification) != -1)) {
			return "/webresources/msdyn_chat_icon_zfp.svg";
		}
		else if ((eventType.search(Constants.SMS) != -1) && (notificationType[0].search(MessageType.notification) != -1)) {
			return "/webresources/msdyn_sms_icon_zfp.svg";
		}
		else if ((eventType.search(Constants.Facebook) != -1) && (notificationType[0].search(MessageType.notification) != -1)) {
			return "/webresources/msdyn_facebook_icon_zfp.svg";
		}
		else if ((eventType.search(Constants.Chat) != -1 || eventType.search(Constants.SMS) != -1 || eventType.search(Constants.Facebook) != -1) && (notificationType[0].search(MessageType.softNotification) != -1)) {
			return "/webresources/msdyn_entity_icon_zfp.svg";
		}
	}

	export function getAcceptButtonText(eventType: any, notificationType: any): string {
		if ((eventType.search(Constants.Chat) != -1 || eventType.search(Constants.SMS) != -1 || eventType.search(Constants.Facebook) != -1) && (notificationType[0].search(MessageType.notification) != -1)) {
			return Utility.getResourceString("ACCEPT_BUTTON_TEXT");
		}
		else if ((eventType.search(Constants.Chat) != -1 || eventType.search(Constants.SMS) != -1 || eventType.search(Constants.Facebook) != -1) && (notificationType[0].search(MessageType.softNotification) != -1)) {
			return Utility.getResourceString("OPEN_ITEM_BUTTON_TEXT");
		}
	}

	function showGlobalToastNotification(notificationLevel: number, title: string, message: string): any {

		let toastMessage = title + ". " + message;
	
		Xrm.UI.addGlobalNotification(1, notificationLevel, toastMessage, null, null, null).then(
			function (response: any) {
				// success
			},
			function (error: any) {
				console.error("Failed to show notification");
			}
		);
	}

	export function launchZFPNotification(header: any, body: any, notificationType: any, eventType: any, actions: any, waitTime: number, correlationId: string): Promise<any> {
	
		let accept = false;
		let decline = false;
		let i = 0;
		if (actions != null && actions != "undefined") {

			for (i = 0; i < actions.length; i++) {
				for (let key in actions[i]) {
					if (key.search(Constants.actionType) != -1) {
						if (actions[i][key].search(Constants.Accept) != -1) {
							accept = true;
						}
						if (actions[i][key].search(Constants.Reject) != -1) {
							decline = true;
						}
					}
				}
			}
		}

		return new Promise(function (resolve, reject) {
			let waitTimeSeconds = waitTime / 1000;
			let title = getNotificationTitle(header, eventType, notificationType);
			let details = getNotificationDetails(body, eventType, notificationType, waitTimeSeconds);
			let type = 0;
			let image = getImageUrl(eventType, notificationType);

			if (eventType.search(Constants.Informational) != -1 && isInformationalNotification(notificationType)) {
				showGlobalToastNotification(Mscrm.GlobalNotificationLevel.success, title, details);
				var mapReturn = new Map().set(Microsoft.CIFramework.Constants.value, new Map().set(Microsoft.CIFramework.Constants.actionName, Microsoft.CIFramework.Constants.Accept));
				return resolve(mapReturn);
			}
			else if (eventType.search(Constants.Informational) != -1 && isFailureInformationNotification(notificationType)) {
				showGlobalToastNotification(Mscrm.GlobalNotificationLevel.error, title, details);
				var mapReturn = new Map().set(Microsoft.CIFramework.Constants.value, new Map().set(Microsoft.CIFramework.Constants.actionName, Microsoft.CIFramework.Constants.Accept));
				return resolve(mapReturn);
			}
			else if (eventType.search(Constants.Informational) != -1 && isInformationChatSoftNotification(notificationType)) {
				showGlobalToastNotification(Mscrm.GlobalNotificationLevel.information, title, details);
				var mapReturn = new Map().set(Microsoft.CIFramework.Constants.value, new Map().set(Microsoft.CIFramework.Constants.actionName, Microsoft.CIFramework.Constants.Accept));
				return resolve(mapReturn);
			}

			if (accept && decline) {
				type = 0;
			}
			else {
				type = 1;
			}

			//accept handler
			let onAcceptHandler = function () {
				var mapReturn = new Map().set(Microsoft.CIFramework.Constants.value, new Map().set(Microsoft.CIFramework.Constants.actionName, Microsoft.CIFramework.Constants.Accept));
				Xrm.Internal.clearPopupNotification(closeId);
				closeId = "";
				if (!IsPlatformNotificationTimeoutInfra) {
					clearTimeout(displayedNotificationTimer);
				}
				console.log("[NotifyEvent] Notification accepted. Timer cleared");
				logInfoToTelemetry("Notification Accepted on Agent Accept", correlationId);
				raiseSystemAnalyticsEvent(InternalEventName.NotificationResponse, mapReturn, new Map<string, any>().set(Constants.correlationId, correlationId).set(Microsoft.CIFramework.AnalyticsConstants.notificationResponseAction, Microsoft.CIFramework.AnalyticsConstants.acceptNotificationResponse));
				showPopUpNotification();
				return resolve(mapReturn);
			}.bind(this);

			//decline handler
			let onDeclineHandler = function () {
				var mapReturn = new Map().set(Microsoft.CIFramework.Constants.value, new Map().set(Microsoft.CIFramework.Constants.actionName, Microsoft.CIFramework.Constants.Reject));
				Xrm.Internal.clearPopupNotification(closeId);
				closeId = "";
				if (!IsPlatformNotificationTimeoutInfra) {
					clearTimeout(displayedNotificationTimer);
				}
				console.log("[NotifyEvent] Notification rejected.Timer cleared");
				logInfoToTelemetry("Notification Rejected on Agent Decline", correlationId);
				raiseSystemAnalyticsEvent(InternalEventName.NotificationResponse, mapReturn, new Map<string, any>().set(Constants.correlationId, correlationId).set(Microsoft.CIFramework.AnalyticsConstants.notificationResponseAction, Microsoft.CIFramework.AnalyticsConstants.rejectNotificationResponse));
				showPopUpNotification();
				return resolve(mapReturn);
			}.bind(this);

				//Timeout handler
				let onTimeoutHandler = function () {
					var mapReturn = new Map().set(Microsoft.CIFramework.Constants.value, new Map().set(Microsoft.CIFramework.Constants.actionName, Microsoft.CIFramework.Constants.Reject));
					Xrm.Internal.clearPopupNotification(closeId);
					closeId = "";
					console.log("[NotifyEvent] Notification rejected due to timeout");
					logInfoToTelemetry("Notification Rejected on display timeout", correlationId);
					raiseSystemAnalyticsEvent(InternalEventName.NotificationTimedOut, mapReturn, new Map<string, any>().set(Microsoft.CIFramework.Constants.correlationId, correlationId));
					showPopUpNotification();
					return resolve(mapReturn);
				}.bind(this);

				let timeoutAction = {
					actionLabel: Utility.getResourceString("NOTIFICATION_DETAIL_WAIT_TIME_TEXT"),
					eventHandler: onTimeoutHandler,
					timeout: waitTime
				};

			let acceptAction = {
				actionLabel: getAcceptButtonText(eventType, notificationType),
				eventHandler: onAcceptHandler
			};

			let declineAction = {
				actionLabel: Utility.getResourceString("REJECT_BUTTON_TEXT"),
				eventHandler: onDeclineHandler
			};
			// set notification expiry time
			let notificationExpiryTime = -1;
			if (notificationType[0].search(MessageType.softNotification) != -1) {
				if (waitTime == -1) {
					notificationExpiryTime = 20000;
				}
				else {
					notificationExpiryTime = waitTime;
				}
			}
			else if (waitTime != -1) {
				notificationExpiryTime = waitTime;
			}

			// timeout reject function
			let rejectAfterTimeout = function () {
				var mapReturn = new Map().set(Microsoft.CIFramework.Constants.value, new Map().set(Microsoft.CIFramework.Constants.actionName, Microsoft.CIFramework.Constants.Reject));
				Xrm.Internal.clearPopupNotification(closeId);
				closeId = "";
				clearTimeout(displayedNotificationTimer);
				console.log("[NotifyEvent] Notification Timed out. Rejecting...");
				logInfoToTelemetry("Notification Rejected on Display Timeout", correlationId);
				showPopUpNotification();
				return resolve(mapReturn);
			};

			//  reject new notification if queue has 10 items.
			if (queue.count >= maxNotificationCount) {
				var mapReturn = new Map().set(Microsoft.CIFramework.Constants.value, new Map().set(Microsoft.CIFramework.Constants.actionName, Microsoft.CIFramework.Constants.Reject));
				console.log("[NotifyEvent] Queue has " + queue.count + " items. Rejecting new Incoming...");
				logInfoToTelemetry("Notification Rejected as queue is full", correlationId);
				return resolve(mapReturn);
			}

			let rejectAfterQueueLimitExceeded = function () {
				var mapReturn = new Map().set(Microsoft.CIFramework.Constants.value, new Map().set(Microsoft.CIFramework.Constants.actionName, Microsoft.CIFramework.Constants.Reject));
				console.log("[NotifyEvent] Queue item timeout or addpopupNotification failed. Rejecting notification...");
				logInfoToTelemetry("Notification Rejected QueueTimeout or addpopupNotification failed", correlationId);
				return resolve(mapReturn);
			};

			//TO-DO - strongly type after updates Xrm.ClientApi.d.ts is available
			if (IsPlatformNotificationTimeoutInfra) {
				var popUpNotificationItem: XrmClientApi.IPopupNotificationItem = { title: title, acceptAction: acceptAction, declineAction: declineAction, timeoutAction: timeoutAction, details: details, type: type, imageUrl: image };
			}
			else {
				var popUpNotificationItem: XrmClientApi.IPopupNotificationItem = { title: title, acceptAction: acceptAction, declineAction: declineAction, details: details, type: type, imageUrl: image };
			}

			var notificationItem: INotificationItem = {
				popUpNotificationItem: popUpNotificationItem,
				notificationCreatedAt: Date.now(),
				notificationExpiryTime: notificationExpiryTime,
				queueTimeOutMethod: rejectAfterQueueLimitExceeded,
				timeOutMethod: rejectAfterTimeout,
				correlationId: correlationId,
				hiddenTimeoutMethod: onTimeoutHandler
			};
			
			queue.enqueue(notificationItem);
			logInfoToTelemetry("Notification Queued", correlationId);
			console.log("[NotifyEvent] Queued new notification. queue length - " + queue.count);
			
			// start interval check to see if notification in queue has expired, i.e. spent 30 secs in queue. Remove such notifications.
			if (!interval) {
				console.log("[NotifyEvent] starting interval to check for expired notifications in queue");
				interval = setInterval(function () {
					removeExpiredNotificationsFromQueue();
				}, 1000);
			}

			if (closeId == "" && queue.count == 1) {
				console.log("[NotifyEvent] calling show popup notification closeid = empty");
				show();
			}
		});
	}

	export function removeExpiredNotificationsFromQueue(): void {
		if (queue.count < 1) {
			return;
		}
		for (let i = 0; i < queue.count; i++) {
			if (Date.now() - queuedNotificationExpirtyTime > queue.getItemAtIndex(i).notificationCreatedAt) {
				console.log("[NotifyEvent] removing item at index " + i + ". Rejecting Notification...");
				queue.getItemAtIndex(i).queueTimeOutMethod();
				queue.removeItem(i);
			}
		}
	}

	export function show(): void {
		if (queue.count > 0) {
			let popUpItem = queue.getItemAtIndex(0);
			console.log("[NotifyEvent] peeked notification. queue length - " + queue.count);
			let popupnotification = popUpItem.popUpNotificationItem;
			let createdAtTime = popUpItem.notificationCreatedAt;
			let notificationExpiryTime = popUpItem.notificationExpiryTime;
			let leftTime = 0;

			if (notificationExpiryTime > 0) {
				var spentInQueueTime = Date.now() - createdAtTime;
				console.log("[NotifyEvent] - The notification spent " + spentInQueueTime / 1000 + " seconds in queue");
				leftTime = notificationExpiryTime - spentInQueueTime;

				if (leftTime > 0) {
					if (IsPlatformNotificationTimeoutInfra && !(isNullOrUndefined(popupnotification.timeoutAction))) {
							popupnotification.timeoutAction["timeout"] = leftTime;
					}
					else if (!IsPlatformNotificationTimeoutInfra){
						let leftTimeSec = Math.ceil((leftTime) / 1000);
						popupnotification.details[Utility.getResourceString("NOTIFICATION_DETAIL_WAIT_TIME_TEXT")] = leftTimeSec.toString() + " " + Utility.getResourceString("NOTIFICATION_WAIT_TIME_SECONDS");
					}
				}
			}

			Xrm.Internal.addPopupNotification(popupnotification).then((id: string) => {
				closeId = id; console.log(id);
				CheckAndDequeueNotification(popUpItem);
				if (!IsPlatformNotificationTimeoutInfra && leftTime > 0) {
					displayedNotificationTimer = setTimeout(popUpItem.timeOutMethod, leftTime);
				}
				else {
					if (isNullOrUndefined(popupnotification.timeoutAction) && leftTime > 0) {
						//Start notification hidden timer
						console.log("Start notification timer for Id: " + closeId.toString() + "Timer value: " +
							notificationExpiryTime + " CorelationId: " + popUpItem.correlationId);
						logInfoToTelemetry("Start notification timer for Id: " + closeId.toString() + "Timer value: " + notificationExpiryTime, popUpItem.correlationId);
						displayedNotificationTimer = setTimeout(popUpItem.hiddenTimeoutMethod, leftTime);
					}
				}
			}).catch((e: any) => {
				console.log("[NotifyEvent] Error creating new notification: " + e);
				logInfoToTelemetry("Error creating popup notification: " + e, popUpItem.correlationId);
				popUpItem.queueTimeOutMethod(); // queueTimeOut function name to be more generic post GA. This functions resolves the promise with a reject.
				CheckAndDequeueNotification(popUpItem);
			})
		}
	}

	export function CheckAndDequeueNotification(popUpItem: INotificationItem): void {
		if (queue.count > 0) {
			let currentTopItem = queue.getItemAtIndex(0);
			if (popUpItem.notificationCreatedAt == currentTopItem.notificationCreatedAt) {
				queue.dequeue();
				logInfoToTelemetry("Dequeued", popUpItem.correlationId);
				console.log("[NotifyEvent] Dequeued. Queue Length is " + queue.count);
			}
			else {
				console.log("[NotifyEvent] CurrentQueueTop and Displayed Notification are different. Not Dequeuing");
			}
		}
	}

	export function showPopUpNotification(): void {
		setTimeout(show, displayDelayTimeMs); // show the next notification after a delay of 2 seconds, so that user does not confuse it with the previous notifcation
	}

	export function logInfoToTelemetry(information: string, correlationId: string): void {
		logAPIInternalInfo(appId, false, null, MessageType.notifyEvent + "-" + information, cifVersion, "", "", "", correlationId);
	}

	/**
	 * API to invoke toast popup widget
	 *
	 * @param value. It's a string which contains header,body of the popup
	 *
	*/
	export function notifyEventClient(notificationUX: Map<string,Map<string,any>>): Promise<any>{
		let i = 0;
		let header: any,body: any,actions: any;
		let eventType: any;
		let waitTime = -1;
		let notificationType: any = [];
		let correlationId: any;
		let templateName: any;
		let templateParameters: any;
		let templateNameResolver: any;
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
			if (key.search(Constants.correlationId) != -1) {
				correlationId = value;
			}
			if (key == Constants.templateName) { // both templateNameResolver and templateName keys will give non -1 result if we do search instead of equals. hence changed to ==
				templateName = value;
			}
			if (key.search(Constants.templateParameters) != -1) {
				templateParameters = value;
			}
			if (key.search(Constants.templateNameResolver) != -1) {
				templateNameResolver = value;
			}
		}

		if (!correlationId) {
			correlationId = "";
		}

		if (templateNameResolver || templateName) {

			// Consumer can pass either templatename or templatename resolver.
			// Template name resolver should contain webresourcename , functionname and parameters(if any).
			return launchZFPNotificationFromTemplate(templateName, templateParameters, templateNameResolver,correlationId);
		}

		if (header == null || header == "undefined"){
			return postMessageNamespace.rejectWithErrorMessage("The header value is blank. Provide a value to the parameter.");
		}
		if(notificationType[0].search(MessageType.softNotification) != -1){ //For Soft notification
			if (body == null || body == "undefined"){
				return postMessageNamespace.rejectWithErrorMessage("The body value is blank. Provide a value to the parameter.");
			}
		}
		if(notificationType == null || notificationType == "undefined"  || notificationType.length <= 0){
			return postMessageNamespace.rejectWithErrorMessage("The notificationType value is blank. Provide a value to the parameter.");
		}
		/* set timer text*/
		if (actions != null && actions != "undefined") {
			for (i = 0; i < actions.length; i++) {
				for (let key in actions[i]) {
					if (key.search(Constants.Timer) != -1) {
						waitTime = actions[i][key];
					}
				}
			}
		}
		return launchZFPNotification(header, body, notificationType, eventType, actions, waitTime, correlationId);		
	}
}
