/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="Client.ts" />
/// <reference path="Constants.ts" />
/// <reference path="../Constants.ts" />
/// <reference path="../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
/// <reference path= "../Queue.ts" />
/// <reference path="../CIFrameworkUtilities.ts" />
/** @internal */
namespace Microsoft.CIFramework.Internal {
	export function launchZFPNotificationFromTemplate(templateName: string, templateParameters: any, templateNameResolver: any ,correlationId: string): Promise<any> {

		return new Promise(function (resolve, reject) {
			// Consumer can pass either templatename or templatename resolver.
			// Template name resolver should contain webresourcename , functionname and parameters(if any).
			let templateNameResolverObj: Promise<TemplateNameResolverResult> = TemplatesUtility.resolveTemplateName(templateNameResolver, templateName);
			templateNameResolverObj.then(function (response: TemplateNameResolverResult) {
				if (response.isFoundByResolver && !isNullOrUndefined(response.templateName)) {
					templateName = response.templateName;
				}
				let fetchTask: Promise<UCINotificationTemplate> = null;

				fetchTask = UCINotificationTemplate.getTemplate(templateName);

				fetchTask.then(function (notificationTemplate: UCINotificationTemplate) {
					let showTimeout: ShowTimeoutOption = notificationTemplate.showTimeout;
					let timeoutForNotification: number = notificationTemplate.timeout;
					//accept handler
					let onAcceptHandler = function () {
						var mapReturn = new Map().set(Microsoft.CIFramework.Constants.value, new Map().set(Microsoft.CIFramework.Constants.actionName, Microsoft.CIFramework.Constants.Accept));
						let originURL = templateParameters.originURL;
						Xrm.Internal.clearPopupNotification(closeId);
						closeId = "";
						if (!IsPlatformNotificationTimeoutInfra || showTimeout == ShowTimeoutOption.No)  {
							clearTimeout(displayedNotificationTimer);
						}
						console.log("[NotifyEventFromTemplate] Notification accepted. Timer cleared");
						logInfoToTelemetry("[NotifyEventFromTemplate] Notification Accepted on Agent Accept", correlationId);
						raiseSystemAnalyticsEvent(InternalEventName.NotificationAccepted, mapReturn, new Map<string, any>().set(Constants.correlationId, correlationId).set(AnalyticsConstants.notificationResponseAction, AnalyticsConstants.acceptNotificationResponse)
							                 .set(Constants.originURL, originURL));
						showPopUpNotification();
						return resolve(mapReturn);
					}.bind(this);

					//decline handler
					let onDeclineHandler = function () {
						var mapReturn = new Map().set(Microsoft.CIFramework.Constants.value, new Map().set(Microsoft.CIFramework.Constants.actionName, Microsoft.CIFramework.Constants.Reject));
						let originURL = templateParameters.originURL;
						Xrm.Internal.clearPopupNotification(closeId);
						closeId = "";
						if (!IsPlatformNotificationTimeoutInfra || showTimeout == ShowTimeoutOption.No) {
							clearTimeout(displayedNotificationTimer);
						}
						console.log("[NotifyEventFromTemplate] Notification rejected.Timer cleared");
						logInfoToTelemetry("[NotifyEventFromTemplate] Notification Rejected on Agent Decline", correlationId);
						raiseSystemAnalyticsEvent(InternalEventName.NotificationRejected, mapReturn, new Map<string, any>().set(Constants.correlationId, correlationId).set(AnalyticsConstants.notificationResponseAction, AnalyticsConstants.rejectNotificationResponse)
							                 .set(Constants.originURL, originURL));
						showPopUpNotification();
						return resolve(mapReturn);
					}.bind(this);

					//Timeout handler
					let onTimeoutHandler = function () {
						var mapReturn = new Map().set(Microsoft.CIFramework.Constants.value, new Map().set(Microsoft.CIFramework.Constants.actionName, Microsoft.CIFramework.Constants.Reject));
						let originURL = templateParameters.originURL;
						Xrm.Internal.clearPopupNotification(closeId);
						closeId = "";
						console.log("[NotifyEventFromTemplate] Notification rejected due to timeout");
						logInfoToTelemetry("[NotifyEventFromTemplate] Notification Rejected on display timeout", correlationId);
						raiseSystemAnalyticsEvent(InternalEventName.NotificationTimedOut, mapReturn, new Map<string, any>().set(Constants.correlationId, correlationId).set(Constants.originURL, originURL));
						showPopUpNotification();
						return resolve(mapReturn);
					}.bind(this);

					//Hidden Timeout handler
					let onHiddenTimeoutHandler = function () {
						console.log("Hidden TimeoutHandler: Notification rejected due to timeout - Custom Timer");
						return onTimeoutHandler();
					}.bind(this);


					let rejectAfterTimeout = function () {
						var mapReturn = new Map().set(Microsoft.CIFramework.Constants.value, new Map().set(Microsoft.CIFramework.Constants.actionName, Microsoft.CIFramework.Constants.Reject));
						Xrm.Internal.clearPopupNotification(closeId);
						closeId = "";
						clearTimeout(displayedNotificationTimer);
						console.log("[NotifyEventFromTemplate] Notification Timed out. Rejecting...");
						logInfoToTelemetry("[NotifyEventFromTemplate] Notification Rejected on Display Timeout", correlationId);
						showPopUpNotification();
						return resolve(mapReturn);
					};

					//  reject new notification if queue has 10 items.
					if (queue.count >= maxNotificationCount) {
						var mapReturn = new Map().set(Microsoft.CIFramework.Constants.value, new Map().set(Microsoft.CIFramework.Constants.actionName, Microsoft.CIFramework.Constants.Reject));
						console.log("[NotifyEventFromTemplate] Queue has " + queue.count + " items. Rejecting new Incoming...");
						logInfoToTelemetry("[NotifyEventFromTemplate] Notification Rejected as queue is full", correlationId);
						return resolve(mapReturn);
					}

					let rejectAfterQueueLimitExceeded = function () {
						var mapReturn = new Map().set(Microsoft.CIFramework.Constants.value, new Map().set(Microsoft.CIFramework.Constants.actionName, Microsoft.CIFramework.Constants.Reject));
						console.log("[NotifyEventFromTemplate] Queue item timeout or addpopupNotification failed. Rejecting notification...");
						logInfoToTelemetry("[NotifyEventFromTemplate] Notification Rejected QueueTimeout or addpopupNotification failed", correlationId);
						return resolve(mapReturn);
					};


					notificationTemplate.instantiateTemplate(templateParameters, onAcceptHandler, onDeclineHandler, onTimeoutHandler, correlationId).then(
						function (popupNotificationItem: XrmClientApi.IPopupNotificationItem) {

							if (IsPlatformNotificationTimeoutInfra) {
								var popUpItem: XrmClientApi.IPopupNotificationItem = popupNotificationItem;
							}
							else {
								var popUpItem: XrmClientApi.IPopupNotificationItem = { title: popupNotificationItem.title, acceptAction: popupNotificationItem.acceptAction, declineAction: popupNotificationItem.declineAction, details: popupNotificationItem.details, type: popupNotificationItem.type, imageUrl: popupNotificationItem.imageUrl };
							}

							let notificationExpiryTime = !isNullOrUndefined(timeoutForNotification) ? timeoutForNotification : 0;

							var notificationItem: INotificationItem = {
								popUpNotificationItem: popUpItem,
								notificationCreatedAt: Date.now(),
								notificationExpiryTime: notificationExpiryTime,
								queueTimeOutMethod: rejectAfterQueueLimitExceeded,
								timeOutMethod: rejectAfterTimeout,
								correlationId: correlationId,
								hiddenTimeoutMethod: onHiddenTimeoutHandler
							};

							queue.enqueue(notificationItem);
							logInfoToTelemetry("[NotifyEventFromTemplate] Notification Queued", correlationId);
							console.log("[NotifyEventFromTemplate] Queued new notification. queue length - " + queue.count);

							// start interval check to see if notification in queue has expired, i.e. spent 30 secs in queue. Remove such notifications.
							if (!interval) {
								console.log("[NotifyEventFromTemplate] starting interval to check for expired notifications in queue");
								interval = setInterval(function () {
									removeExpiredNotificationsFromQueue();
								}, 1000);
							}

							if (closeId == "" && queue.count == 1) {
								console.log("[NotifyEventFromTemplate] calling show popup notification closeid = empty");
								show();
							}

						},
						function (error) {
							var mapReturn = new Map().set(Microsoft.CIFramework.Constants.value, new Map().set(Microsoft.CIFramework.Constants.actionName, Microsoft.CIFramework.Constants.Reject));
							console.log("[NotifyEventFromTemplate] Notification Template not found. Rejecting notification. Error: " + error);
							logInfoToTelemetry("[NotifyEventFromTemplate] Notification Template not found." + error, correlationId);
							return resolve(mapReturn);
						}
					);
				});
			}.bind(this),
				function (error) {
					var mapReturn = new Map().set(Microsoft.CIFramework.Constants.value, new Map().set(Microsoft.CIFramework.Constants.actionName, Microsoft.CIFramework.Constants.Reject));
					console.log("[NotifyEventFromTemplate] Notification Template name/ resolver not found. Rejecting notification. Error: " + error);
					logInfoToTelemetry("[NotifyEventFromTemplate] Notification Template not found." + error, correlationId);
					return resolve(mapReturn);
				});
		});
	}
}