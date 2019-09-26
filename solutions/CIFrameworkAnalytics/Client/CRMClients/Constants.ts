/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

namespace Microsoft.CIFrameworkAnalytics.Constants {
	/**
	 * All the message types/ APIs that are exposed to the widget
	*/
	export class MessageType {
		public static initAnalyticsPlatformEventName = "initCIFAnalytics";
		public static logAnalyticsPlatformEventName = "logCIFAnalytics";
	}

	export class ConversationEntity {
        public static entityName = "msdyn_conversationdata";
        public static Name = "msdyn_name";
		public static accountId = "msdyn_accountid";
		public static additionalData = "msdyn_additionaldata";
		public static backendConversationId = "msdyn_backendconversationid";
		public static channel = "msdyn_channel";
		public static channelContext = "msdyn_context";
		public static contactId = "msdyn_contactid";
		public static conversationId = "msdyn_conversationid";
		public static conversationTimestamp = "msdyn_conversationtimestamp";	
        public static externalAccountId = "msdyn_externalaccountid";
        public static externalContactId = "msdyn_externalcontactid";
        public static externalConversationId = "msdyn_externalconversationId";
        public static externalCorrelationId = "msdyn_externalcorrelationid";
		public static externalProviderId = "msdyn_externalproviderid";
		public static initialQueueName = "msdyn_initialqueuename";
		public static providerId = "msdyn_providerid";
		public static providerName = "msdyn_providername";
		public static region = "msdyn_region";
	}

	export class SessionEntity {
		public static entityName = "msdyn_sessiondata";
		public static clientSessionId = "msdyn_ucisessionid";
		public static clientSessionName = "msdyn_ucisessionname";
		public static conversationId = "msdyn_conversationid";
        public static externalCorrelationId = "msdyn_externalcorrelationid";
		public static queueId = "msdyn_queueid";
		public static queueName = "msdyn_queuename";
		public static sessionAdditionalData = "msdyn_sessionadditionaldata";
        public static sessionAgentAssignedTimestamp = "msdyn_sessionagentassignedtimestamp";
        public static sessionChannel = "msdyn_sessionchannel";
        public static sessionCreatedTimestamp = "msdyn_sessioncreatedtimestamp";
        public static sessionCreationReason = "msdyn_sessioncreationreason";
		public static sessionId = "msdyn_sessionid";
		public static sessionQueueAssignedTimestamp = "msdyn_sessionqueueassignedtimestamp";
	}

	export class ParticipantEntity {
		public static entityName = "msdyn_sessionparticipantdata";
		public static conversationId = "msdyn_conversationid";
		public static externalParticipantIame = "msdyn_externalparticipantid";
		public static externalParticipantName = "msdyn_externalparticipantname";
		public static participantAddedTimestamp = "msdyn_participantaddedtimestamp";
		public static participantAssignReason = "msdyn_participantassignreason";
		public static participantId = "msdyn_participantid";
		public static participantName = "msdyn_participantname";
		public static participantMode = "msdyn_participantmode";
		public static participantType = "msdyn_participanttype";
		public static sessionId = "msdyn_sessionid";
	}

	export class EventEntity {
		public static entityName = "msdyn_kpieventdata";
		public static additionalData = "msdyn_additionaldata";
		public static clientSessionId = "msdyn_clientsessionid";
		public static conversationId = "msdyn_conversationid";
		public static createdEntityRecordId = "msdyn_entityrecordid";
		public static createdEntityName = "msdyn_entityname";
		public static eventTimestamp = "msdyn_eventtimestamp";
		public static externalCorrelationId = "msdyn_externalcorrelationid";
		public static knowledgeArticleId = "msdyn_knowledgearticleid";
		public static knowledgeArticleName = "msdyn_knowledgearticlename";		
		public static kpiEventId = "msdyn_kpieventid";
		public static kpiEventName = "msdyn_kpieventname";
		public static kpiEventReason = "msdyn_kpieventreason";
		public static newPresence = "msdyn_newpresence";
		public static notificationResponseAction = "notificationResponseaction";
		public static oldPresence = "msdyn_oldpresence";
		public static participantId = "msdyn_participantid";
		public static sessionId = "msdyn_sessionid";
		public static tabId = "msdyn_tabid";
		public static tabName = "msdyn_tabname";
		public static tabAction = "msdyn_tabaction";
	}

	export class AnalyticsEvent {
		public static analyticsData = "analyticsData";
		public static correlationId = "correlationId";
		public static focussedSession = "focussedSession";
		public static eventName = "analyticsEventname";
		public static eventType = "analyticsEventtype";
		public static notificationReceived = "NotificationReceived";
		public static notificationResponse = "NotificationResponse";
		public static notificationTimedOut = "NotificationTimedOut";
		public static sessionStarted = "SessionStarted";
		public static sessionSwitched = "SessionSwitched";
		public static sessionClosed = "SessionClosed";
		public static newTabOpened = "NewTabOpened";
	}

	export enum EventType {
		SystemEvent,
		CustomEvent
	}

}