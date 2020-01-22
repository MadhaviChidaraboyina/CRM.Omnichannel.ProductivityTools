/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/

namespace Microsoft.CIFrameworkAnalytics {

	export class InitData {
		public conversation: Conversation;
	}
	export class Conversation {
		public conversationId: string;
		public channel: string;
		public regionData: RegionData;
		public providerId: string;
		public providerName: string;
		public accountId: string;
		public contactId: string;
		public additionalData: string;
		public externalCorrelationId: string;
		public createdTimestamp: string;
		public customData?: (CustomDataEntity)[] | null;
		public session: Session;
	}
	export class RegionData {
		public city: string;
		public state: string;
		public country: string;
		public zip: string;
	}
	export class CustomDataEntity {
		public attribute: string;
		public value: string;
	}
	export class Session {
		public providerSessionId: string;
		public clientSessionId: string;
		public clientSessionName: string;
		public channel: string;
		public creationReason: string;
		public additionalData: string;
		public externalCorrelationId: string;
		public createdTimestamp: string;
		public agentAssignedTimestamp: string;
		public queueAssignedTimestamp: string;
		public queueId: string;
		public queueName: string;
		public customData?: (CustomDataEntity)[] | null;
		public participants?: (ParticipantsEntity)[] | null;
	}
	export class ParticipantsEntity {
		public participantId: string;
		public externalId: string;
		public name: string;
		public mode: string;
		public type: string;
		public addedTimestamp: string;
		public assignReason: string;
		public customData?: (CustomDataEntity)[] | null;
	}
	export class EventData {
		public conversationId: string;
		public providerSessionId: string;
		public clientSessionId: string;
		public participantId: string;
		public events?: (EventEntity)[] | null;
		public cifSessionId: string;
		public providerId: string;
		public sessionId: string;
	}
	export class EventEntity {
		public kpiEventName: string;
		public kpiEventReason: string;
		public eventTimestamp: string;
		public additionalData: string;
		public notificationResponseAction: string;
		public externalCorrelationId: string;
		public customData?: (CustomDataEntity)[] | null;
	}
}
