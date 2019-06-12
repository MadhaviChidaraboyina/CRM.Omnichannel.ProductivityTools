/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/** @internal */
namespace Microsoft.CIFramework.Internal
{
	/**
	 * Enum defining the different client types available for CI
	*/
	export class ClientType
	{
		public static UnifiedClient = "4";
	}
	/**
	 * Enum defining the different session types available for CI
	*/
	export class SessionType
	{
		public static SingleSession = "0";
		public static MultiSession = "1";
	}

	export interface INotificationItem {
		popUpNotificationItem: XrmClientApi.IPopupNotificationItem,
		notificationCreatedAt: number,
		notificationExpiryTime: number,
		queueTimeOutMethod: any;
		timeOutMethod: any
	}
}