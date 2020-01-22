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
		queueTimeOutMethod: any,
		timeOutMethod: any,
		correlationId: string,
		hiddenTimeoutMethod: any
	}

	export class NotificationConstants {
		public static NoOfFieldsAllowedInNotification = 4;
	}

	export enum ComparisonResult {
		EQUAL = 0,
		GREATER =1,
		LESSER=-1
	}

	export class SlugPrefix {
		public static CHANNEL_PROVIDER = "ChannelProvider";
		public static SESSION = "Session";
		public static CURRENT_TAB = "CurrentTab";
		public static ANCHOR_TAB = "AnchorTab";
		public static SPLIT_BY_DOT = ".";
	}

	export class LiveWorkItemEntity {
		public static entityName = "msdyn_ocliveworkitem";
		public static title = "msdyn_title";
		public static subject = "subject";
		public static activityId = "activityId";
		public static ocLiveWorkStreamId = "msdyn_ocliveworkitemid";
		public static providerName = "msdyn_channelproviderName";
		public static isThirdPartyConversation = "msdyn_thirdpartyconversation";
	}

	export class ChannelProvider {
		public static Omnichannel = "omnichannel";
	}
}