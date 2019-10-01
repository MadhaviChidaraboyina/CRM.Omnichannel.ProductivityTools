/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/** @internal */
namespace Microsoft.CIFrameworkAnalytics.Utility {

	/**
	 * Generic method to convert map data into string
	 * @param map 
	 */
	export function mapToString(map: Map<string, any>, exclusionList: string[] = []): string {
		let result: string = "";
		if (!map) {
			return "";
		}
		map.forEach((value, key) => {
			if (exclusionList.indexOf(key) == -1) {
				result += key + " : " + value + ", ";
			}
		});
		return result;
	}

	export function flatten(obj: XrmClientApi.WebApi.Entity): XrmClientApi.WebApi.Entity {
		let ret: XrmClientApi.WebApi.Entity = {};
		let propNames = Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).filter(n => n != 'constructor')
		for (let pi in propNames) {
			let prop = propNames[pi];
			if (typeof (obj[prop]) === "object") {
				ret[prop] = flatten(obj[prop]);
			}
			else {
				ret[prop] = obj[prop];
			}
		}
		return ret;
	}

	/**
	 * utility func to check whether an object is null or undefined
	 */
	/** @internal */
	export function isNullOrUndefined(obj: any) {
		return (obj == null || typeof obj === "undefined");
	}

	/**
	 * utility func to check whether an object is null or undefined
	 */
	/** @internal */
	export function validateInitAnalyticsPayload(payload: any): Promise<boolean> {
		if ((!isNullOrUndefined(payload.conversation.conversationId) && !isNullOrUndefined(payload.conversation.session.sessionId)))
			return Promise.resolve(true);
		else
			return Promise.resolve(false);
	}

	/**
	 * utility func to check whether an object is null or undefined
	 */
	/** @internal */
	export function validateLogAnalyticsPayload(payload: any): Promise<boolean> {
		if ((!isNullOrUndefined(payload.conversationId) && !isNullOrUndefined(payload.sessionId) && !isNullOrUndefined(payload.clientSessionId)))
			return Promise.resolve(true);
		else
			return Promise.resolve(false);
	}

	/**
	 * Given a map, this func returns an equivalent XrmClientApi.WebApi.Entity object for it.
	 * @param map Object to build the entity for.
	 */
	export function buildConversationEntity(payload: any): XrmClientApi.WebApi.Entity {
		let data: InitData = payload.get(Constants.AnalyticsEvent.analyticsData);
		let providerId = payload.get(Constants.AnalyticsEvent.providerId);
		let providerName = payload.get(Constants.AnalyticsEvent.providerName);
		let entity: XrmClientApi.WebApi.Entity = {};
		let conv = data.conversation;
		entity[Constants.ConversationEntity.accountId] = conv.accountId;
		entity[Constants.ConversationEntity.additionalData] = conv.additionalData;
		entity[Constants.ConversationEntity.backendConversationId] = conv.backendConversationId;
		entity[Constants.ConversationEntity.channel] = conv.channel;
		entity[Constants.ConversationEntity.channelContext] = conv.channelContext;
		entity[Constants.ConversationEntity.contactId] = conv.contactId;
		entity[Constants.ConversationEntity.conversationId] = conv.conversationId;
		entity[Constants.ConversationEntity.Name] = conv.conversationId;
		entity[Constants.ConversationEntity.conversationTimestamp] = isNullOrUndefined(conv.conversationTimestamp) ? new Date().toISOString() : conv.conversationTimestamp;
		entity[Constants.ConversationEntity.externalAccountId] = conv.externalAccountId;
		entity[Constants.ConversationEntity.externalContactId] = conv.externalContactId;
		entity[Constants.ConversationEntity.externalConversationId] = conv.externalConversationId;
		entity[Constants.ConversationEntity.externalCorrelationId] = conv.externalCorrelationId;
		entity[Constants.ConversationEntity.externalProviderId] = conv.externalProviderId;
		entity[Constants.ConversationEntity.initialQueueName] = conv.initialQueueName;
		entity[Constants.ConversationEntity.providerId] = isNullOrUndefined(conv.providerId) ? providerId : conv.providerId;
		entity[Constants.ConversationEntity.providerName] = isNullOrUndefined(conv.providerName) ? providerName : conv.providerName;
		entity[Constants.ConversationEntity.region] = conv.regionData;

		let customDataList = conv.customData;
		if (!isNullOrUndefined(customDataList)) { 
		for (var customData of customDataList) {
			entity[customData.attribute] = customData.value;
		}
	}
		return entity;
	}

	/**
	 * Given a map, this func returns an equivalent XrmClientApi.WebApi.Entity object for it.
	 * @param map Object to build the entity for.
	 */
	export function buildSessionEntity(payload: any): XrmClientApi.WebApi.Entity {
		let data: InitData = payload.get(Constants.AnalyticsEvent.analyticsData);
		let session = data.conversation.session;
		let entity: XrmClientApi.WebApi.Entity = {};
		entity[Constants.SessionEntity.clientSessionId] = session.clientSessionId;
		entity[Constants.SessionEntity.clientSessionName] = session.clientSessionName;
		entity[Constants.SessionEntity.conversationId] = session.conversationId;
		entity[Constants.SessionEntity.externalCorrelationId] = session.externalCorrelationId;
		entity[Constants.SessionEntity.queueId] = session.queueId;
		entity[Constants.SessionEntity.queueName] = session.queueName;
		entity[Constants.SessionEntity.sessionAdditionalData] = session.sessionAdditionalData;
		entity[Constants.SessionEntity.sessionAgentAssignedTimestamp] = session.sessionAgentAssignedTimestamp;
		entity[Constants.SessionEntity.sessionChannel] = session.sessionChannel;
		entity[Constants.SessionEntity.sessionCreatedTimestamp] = session.sessionCreatedTimestamp;
		entity[Constants.SessionEntity.sessionCreationReason] = session.sessionCreationReason;
		entity[Constants.SessionEntity.sessionId] = session.sessionId;
		entity[Constants.SessionEntity.sessionQueueAssignedTimestamp] = session.sessionQueueAssignedTimestamp;

		let customDataList = data.conversation.customData;
		if (!isNullOrUndefined(customDataList)) {
			for (var customData of customDataList) {
				entity[customData.attribute] = customData.value;
			}
		}
		return entity;
	}

	/**
	* Given a map, this func returns an equivalent XrmClientApi.WebApi.Entity object for it.
	* @param map Object to build the entity for.
	*/
	export function buildParticipantEntityList(payload: any): XrmClientApi.WebApi.Entity[] {
		let data: InitData = payload.get(Constants.AnalyticsEvent.analyticsData);
		let session = data.conversation.session;
		let entities: XrmClientApi.WebApi.Entity[] = [];
		for (var participant of session.participants) {
			let entity: XrmClientApi.WebApi.Entity = {};
			entity[Constants.ParticipantEntity.sessionId] = session.sessionId;
			entity[Constants.ParticipantEntity.conversationId] = session.conversationId;
			entity[Constants.ParticipantEntity.participantId] = participant.participantId;
			entity[Constants.ParticipantEntity.participantName] = participant.participantName;
			entity[Constants.ParticipantEntity.participantType] = participant.participantType;
			entity[Constants.ParticipantEntity.participantAddedTimestamp] = participant.participantAddedTimestamp;
			entity[Constants.ParticipantEntity.participantId] = participant.participantId;
			entity[Constants.ParticipantEntity.participantName] = participant.participantName;
			entity[Constants.ParticipantEntity.participantType] = participant.participantType;
			entity[Constants.ParticipantEntity.participantAddedTimestamp] = participant.participantAddedTimestamp;
			entity[Constants.ParticipantEntity.participantId] = participant.participantId;
			entity[Constants.ParticipantEntity.participantName] = participant.participantName;
			entity[Constants.ParticipantEntity.participantType] = participant.participantType;
			entity[Constants.ParticipantEntity.participantAddedTimestamp] = participant.participantAddedTimestamp;

			let customDataList = data.conversation.customData;
			if (!isNullOrUndefined(customDataList)) {
				for (var customData of customDataList) {
					entity[customData.attribute] = customData.value;
				}
			}
			entities.push(entity);
		}
		return entities;
	}

	/**
	 * Given a map, this func returns an equivalent XrmClientApi.WebApi.Entity object for it.
	 * @param map Object to build the entity for.
	 */
	export function buildEventsEntity(data: EventData): XrmClientApi.WebApi.Entity[] {
		let entities: XrmClientApi.WebApi.Entity[] = [];
		let events = data.events;
		for (var event of events) {
			let entity: XrmClientApi.WebApi.Entity = {};
			entity[Constants.EventEntity.additionalData] = event.additionalData;
			entity[Constants.EventEntity.clientSessionId] = (data.clientSessionId === Constants.AnalyticsEvent.defaultSessionId) ? Constants.AnalyticsEvent.noSessionId : data.clientSessionId;
			entity[Constants.EventEntity.conversationId] = data.conversationId;
			entity[Constants.EventEntity.createdEntityName] = event.entityName;
			entity[Constants.EventEntity.createdEntityRecordId] = event.entityRecordId;
			entity[Constants.EventEntity.eventTimestamp] = event.eventTimestamp;
			entity[Constants.EventEntity.externalCorrelationId] = event.externalCorrelationId;
			entity[Constants.EventEntity.knowledgeArticleId] = event.knowledgeArticleId;
			entity[Constants.EventEntity.knowledgeArticleName] = event.knowledgeArticleName
			entity[Constants.EventEntity.kpiEventId] = event.kpiEventId;
			entity[Constants.EventEntity.kpiEventName] = event.kpiEventName
			entity[Constants.EventEntity.kpiEventReason] = event.kpiEventReason;
			entity[Constants.EventEntity.newPresence] = event.newPresence;
			entity[Constants.EventEntity.notificationResponseAction] = event.notificationResponseAction;
			entity[Constants.EventEntity.oldPresence] = event.oldPresence;
			entity[Constants.EventEntity.participantId] = data.eventParticipantId;
			entity[Constants.EventEntity.sessionId] = data.sessionId;
			entity[Constants.EventEntity.tabAction] = event.tabAction;
			entity[Constants.EventEntity.tabId] = event.tabId;
			entity[Constants.EventEntity.tabName] = event.tabName;

			let customDataList = event.customData;
			if (!isNullOrUndefined(customDataList)) {
				for (var customData of customDataList) {
					entity[customData.attribute] = customData.value;
				}
			}
			entities.push(entity);
		}
		return entities;
	}

}