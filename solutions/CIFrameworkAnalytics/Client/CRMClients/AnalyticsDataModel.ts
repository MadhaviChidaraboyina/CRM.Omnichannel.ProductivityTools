/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

namespace Microsoft.CIFrameworkAnalytics {
	export enum EventType {
		SystemEvent,
		CustomEvent,
	}

	/*
	export enum InternalEventName {
		NotificationReceived = "Notification Received​",
		NotificationAccepted = "Notification Accepted​",
		NotificationRejected = "Notification Rejected​",
		NotificationTimedOut = "Notification Timed Out​",
		SessionStarted = "Session Started​",
		SessionSwitched = "Session Switched​",
		SessionClosed = "Session Closed​",
		NewTabOpened = "New Tab Opened​",
		TabClosed = "Tab Closed​",
		TabSwitched = "Tab Switched​",
		CustomEvent = "CustomEvent"
	}
	*/

    export enum InternalEventName {
        NotificationReceived,
        NotificationAccepted,
        NotificationRejected,
        NotificationTimedOut,
        SessionStarted,
        SessionSwitched,
        SessionClosed,
        NewTabOpened,
        TabClosed,
        TabSwitched,
        CustomEvent
    }

	export class InitData {
		conversation: Conversation;
	}

	export class Conversation {
		conversationId: string;
		channel: string;
		channelContext: string;
		regionData: string;
		providerId: string;
		externalProviderId: string;
		providerName: string;
		externalProviderName: string;
		accountId: string;
		externalAccountId: string;
		contactId: string;
		externalContactId: string;
		initialQueueName: string;
		additionalData: string;
		externalCorrelationId: string;
		conversationTimestamp: string;
		customData?: (CustomDataEntity)[] | null;
		session: Session;
	}

	export class CustomDataEntity {
		attribute: string;
		value: string;
	}

	export class Session {
		conversationId: string;
		sessionId: string;
		sessionName: string;
		clientSessionId: string;
		clientSessionName: string;
		sessionChannel: string;
		sessionCreationReason: string;
		sessionAdditionalData: string;
		externalCorrelationId: string;
		sessionCreatedTimestamp: string;
		customData?: (CustomDataEntity)[] | null;
		participants?: (ParticipantsEntity)[] | null;
	}

	export class ParticipantsEntity {
		sessionId: string;
		conversationId: string;
		participantId: string;
		externalParticipantId: string;
		participantName: string;
		externalParticipantName: string;
		participantMode: string;
		participantType: string;
		participantAddedTimestamp: string;
		customData?: (CustomDataEntity)[] | null;
	}

	export class EventData {
		conversationId: string;
		sessionId: string;
		clientSessionId: string;
		eventParticipantId: string;
		events?: (EventsEntity)[] | null;
	}

	export class EventsEntity {
		kpiEventName: string;
		kpiEventReason: string;
		eventTimestamp: string;
		entityName: string;
		entityRecordId: string;
		additionalData: string;
		knowledgeArticleId: string;
		knowledgeArticleName: string;
		oldPresence: string;
		newPresence: string;
		tabId: string;
		tabName: string;
		notificationResponseAction: string;
		externalCorrelationId: string;
		customData?: (CustomDataEntity)[] | null;
	}
}
