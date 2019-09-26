/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

namespace Microsoft.CIFrameworkAnalytics {
	
	export class InitData {
		public conversation: Conversation;
	}

	export class Conversation {
		public conversationId: string;
		public backendConversationId: string;
		public channel: string;
		public channelContext: string;
		public regionData: string;
		public providerId: string;
		public externalProviderId: string;
		public providerName: string;
		public externalProviderName: string;
		public accountId: string;
		public externalAccountId: string;
		public contactId: string;
		public externalContactId: string;
		public additionalData: string;
		public externalCorrelationId: string;
		public conversationTimestamp: string;
		public externalConversationId: string;
		public initialQueueName: string;
		public primaryRelatedEntityName: string;
		public primaryRelatedEntityRecordId: string;
		public customData?: (CustomDataEntity)[] | null;
		public session: Session;
	}

	export class CustomDataEntity {
		public attribute: string;
		public value: string;
	}

	export class Session {
		public conversationId: string;
		public sessionId: string;
		public sessionName: string;
		public clientSessionId: string;
		public clientSessionName: string;
		public sessionChannel: string;
		public sessionCreationReason: string;
		public sessionAdditionalData: string;
		public externalCorrelationId: string;
		public sessionCreatedTimestamp: string;
		public sessionAgentAssignedTimestamp: string;
		public sessionQueueAssignedTimestamp: string;
		public queueId: string;
		public queueName: string;
		public customData?: (CustomDataEntity)[] | null;
		public participants?: (ParticipantsEntity)[] | null;
	}

	export class ParticipantsEntity {
		public sessionId: string;
		public conversationId: string;
		public participantId: string;
		public externalParticipantId: string;
		public participantName: string;
		public externalParticipantName: string;
		public participantMode: string;
		public participantType: string;
		public participantAddedTimestamp: string;
		public participantAssignReason: string;
		public customData?: (CustomDataEntity)[] | null;
	}

	export class EventData {
		public conversationId: string;
		public sessionId: string;
		public clientSessionId: string;
		public eventParticipantId: string;
		public events?: (EventEntity)[] | null;
	}

	export class EventEntity {
		public kpiEventId: string;
		public kpiEventName: string;
		public kpiEventReason: string;
		public eventTimestamp: string;
		public entityName: string;
		public entityRecordId: string;
		public additionalData: string;
		public knowledgeArticleId: string;
		public knowledgeArticleName: string;
		public oldPresence: string;
		public newPresence: string;
		public tabId: string;
		public tabName: string;
		public tabAction: string;
		public notificationResponseAction: string;
		public externalCorrelationId: string;
		public customData?: (CustomDataEntity)[] | null;
	}
}
