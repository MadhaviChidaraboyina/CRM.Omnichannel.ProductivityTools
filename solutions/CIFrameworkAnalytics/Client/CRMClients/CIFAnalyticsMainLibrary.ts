/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="./Constants.ts" />
/// <reference path="./AnalyticsDataModel.ts" />
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />

namespace Microsoft.CIFrameworkAnalytics {

	let clientSessionConversationIdMap = new Map<string, string>(); // Map to store the UCI Session Id and ConversationId 
	let analyticsDataMap = new Map<string, InitData>(); // Map to store the conversation Id and InitData
	let analyticsEventMap = new Map<string, string>(); //Map to store the KPI Event Definitions
	let conversationAnalyticsFlagMap = new Map<string, boolean>(); //Map to store the conversationId and Analytics flag 
	let cifSessionId = newGuid();

	/** @internal
	 * Initialize method called on load of the script
	 */
	function initialize() {
		window.addEventListener(Constants.MessageType.initAnalyticsPlatformEventName, initAnalyticsEventListener);
		window.addEventListener(Constants.MessageType.logAnalyticsPlatformEventName, logAnalyticsEventListener);
		loadAnalyticsEventMap();
	}

	/** @internal
	 * Handler for the logCIFAnalytics that is raised from CIF Internal Library
	 */
	function initAnalyticsEventListener(event: any) {
		let enableAnalyticsFlag = event.detail.get(Constants.AnalyticsEvent.enableAnalytics);
		let conversationId = event.detail.get(Constants.AnalyticsEvent.correlationId);
		if (!Utility.isNullOrUndefined(conversationId) && enableAnalyticsFlag) {
			conversationAnalyticsFlagMap.set(conversationId, enableAnalyticsFlag);
			var payload = event.detail.get(Constants.AnalyticsEvent.analyticsData);
			if (!Utility.isNullOrUndefined(payload) && Utility.validateInitAnalyticsPayload(payload)) {
					logAnalyticsInitData(event.detail);
			}
		}
	}

	/** @internal
	 * Handler for the logCIFAnalytics that is raised from CIF Internal Library
	 */
	function logAnalyticsEventListener(event: any) {
		let enableAnalytics = event.detail.get(Constants.AnalyticsEvent.enableAnalytics);

		if (!enableAnalytics) {
			enableAnalytics = enableAnalticsForUCIEvents(event);
		}
		if (enableAnalytics) {
				let eventData = createEventDataForSystemEventsNew(event.detail);
				if (!Utility.isNullOrUndefined(eventData) && Utility.validateLogAnalyticsPayload(eventData)) {
						logEventData(eventData);
				}
			}
	}

	/** @internal
		 * to log the notification events irrespective of enableanalytics flag
		 */
	function enableAnalticsForUCIEvents(event: any): boolean {
		switch (event.detail.get(Constants.AnalyticsEvent.eventName)) {
			case Constants.AnalyticsEvent.SessionFocusIn:
			case Constants.AnalyticsEvent.SessionFocusOut:
			case Constants.AnalyticsEvent.CifSessionStart:
			case Constants.AnalyticsEvent.CifSessionEnd:
				{
					return true;
				}
		}
	}
	/** @internal
	 * Function to log the analytics init data
	 */
	function logAnalyticsInitData(data: any) {
		let payload: InitData = data.get(Constants.AnalyticsEvent.analyticsData);
		// update the conversation id to data map
		let conversationId: string = payload.conversation.conversationId;
		if (analyticsDataMap.has(conversationId))
			return;

		analyticsDataMap.set(conversationId, payload);

	}

	/** @internal
	* Function to log the Conversation data
	*/
	function logConversationData(data: any) {
		let payload: InitData = data.get(Constants.AnalyticsEvent.analyticsData);
		// create Conversation Data record
		Xrm.WebApi.createRecord(Constants.ConversationEntity.entityName, buildConversationEntity(data)).then(
			function success(result) {
				console.log("Conversation Data record created with ID: " + result.id);
			},
			function (error) {
				console.log(error.message);
			}
		);
	}

	/** @internal
	* Function to log the Session data
	*/
	function logSessionData(data: any) {
		let payload: InitData = data.get(Constants.AnalyticsEvent.analyticsData);
		// create Session Data record
		Xrm.WebApi.createRecord(Constants.SessionEntity.entityName, buildSessionEntity(data)).then(
			function success(result) {
				console.log("Session Data record created with ID: " + result.id);
			},
			function (error) {
				console.log(error.message);
			}
		);
	}

	/** @internal
	* Function to log the Participant data
	*/
	function logParticipantData(data: any) {
		let payload: InitData = data.get(Constants.AnalyticsEvent.analyticsData);
		let records: XrmClientApi.WebApi.Entity[] = buildParticipantEntityList(data);
		records.forEach(function (record) {
			Xrm.WebApi.createRecord(Constants.ParticipantEntity.entityName, record).then(
				function success(result) {
					console.log("Participant Data record created with ID: " + result.id);
				},
				function (error) {
					console.log(error.message);
				}
			);
		});
	}

	/** @internal
	* Function to log the Event data
	*/
	function logEventData(payload: EventData) {
		let records: XrmClientApi.WebApi.Entity[] = buildEventsEntityNew(payload);
		records.forEach(function (record) {
			Xrm.WebApi.createRecord(Constants.EventEntity.entityName, record).then(
				function success(result) {
					console.log("KPI Event Data record created with ID: " + result.id);
				},
				function (error) {
					console.log(error.message);
				}
			);
		});
	}

	/** @internal
	* Function to create the Event data for SystemEvents
	*/
	function createEventDataForSystemEvents(payload: any): EventData {
		let correlationId = getConversationId(payload);
		let clientSessionId = getClientSessionId(payload);
		let eventName = payload.get(Constants.AnalyticsEvent.eventName);
		let eventId = analyticsEventMap.get(eventName);
		if (!Utility.isNullOrUndefined(correlationId) && !Utility.isNullOrUndefined(eventId)) {
			let conversationData = analyticsDataMap.get(correlationId);
			if (!Utility.isNullOrUndefined(conversationData)) {
				var eventData: EventData = new EventData();
				eventData.conversationId = correlationId;
				eventData.clientSessionId = clientSessionId;
				eventData.participantId = conversationData.conversation.session.participants[0].participantId;
				let events: EventEntity[] = new Array<EventEntity>();
				let event = new EventEntity();
				events.push(event);
				eventData.events = events;
				event.kpiEventName = eventName;
				event.eventTimestamp = new Date().toISOString();
				fillEventDataForSystemEvents(payload, eventData);
			}
			return eventData;
		}
	}
	/** @internal
		* Function to create the Event data for SystemEvents
		*/
	function createEventDataForSystemEventsNew(payload: any): EventData {
		let clientSessionId = payload.get(Constants.AnalyticsEvent.clientSessionId);
		let eventName = payload.get(Constants.AnalyticsEvent.eventName);
		let eventId = analyticsEventMap.get(eventName);
		let sessionUniqueId = payload.get(Constants.AnalyticsEvent.sessionUniqueId)
		let providerId = payload.get(Constants.AnalyticsEvent.providerId);
		let conversationId = payload.get(Constants.AnalyticsEvent.conversationId);
		let providerSessionId = payload.get(Constants.AnalyticsEvent.providerSessionId);
		if (!Utility.isNullOrUndefined(eventId) || eventName == Constants.AnalyticsEvent.CifSessionStart ||eventName == Constants.AnalyticsEvent.CifSessionEnd) {
				var eventData: EventData = new EventData();
				eventData.conversationId = conversationId;
				eventData.clientSessionId = clientSessionId;
				eventData.participantId = Xrm.Utility.getGlobalContext().userSettings.userId;
				eventData.providerId = providerId;
				eventData.sessionId = sessionUniqueId;
				eventData.providerSessionId = providerSessionId;
				let events: EventEntity[] = new Array<EventEntity>();
				let event = new EventEntity();
				events.push(event);
				eventData.events = events;
				event.kpiEventName = eventName;
				event.eventTimestamp = new Date().toISOString();
				event.externalCorrelationId = payload.get(Constants.AnalyticsEvent.correlationId);
			}
			return eventData;
	}

	/** @internal
	* Function to get the UCI Conversation Id
	*/
	function getConversationId(payload: any): string {
		let correlationId = payload.get(Constants.AnalyticsEvent.correlationId);
		if (Utility.isNullOrUndefined(correlationId)) {
			let data: EventData = payload.get(Constants.AnalyticsEvent.analyticsData);
			if (!Utility.isNullOrUndefined(data)) {
				correlationId = data.conversationId;
			}
			if (Utility.isNullOrUndefined(correlationId)){
				let clientSessionId = getClientSessionId(payload);
				if (!Utility.isNullOrUndefined(clientSessionId)) {
					correlationId = clientSessionConversationIdMap.get(clientSessionId);
				}
			}
		}
		return correlationId;
	}

	/** @internal
	* Function to get the UCI Session Id
	*/
	function getClientSessionId(payload: any): string {
		let eventName = payload.get(Constants.AnalyticsEvent.eventName);
		let clientSessionId = "";
		if (eventName === Constants.AnalyticsEvent.SessionFocusIn) {
			clientSessionId = payload.get(Constants.AnalyticsEvent.newSessionId);
		}
		else if (eventName === Constants.AnalyticsEvent.SessionFocusOut) {
			clientSessionId = payload.get(Constants.AnalyticsEvent.previousSessionId);
		}
		else if (eventName === Constants.AnalyticsEvent.sessionClosed) {
			clientSessionId = payload.get(Constants.AnalyticsEvent.sessionId);
		}
		else {
			clientSessionId = payload.get(Constants.AnalyticsEvent.clientSessionId);
		}
		if (Utility.isNullOrUndefined(clientSessionId)) {
			// clientSessionId = payload.get(Constants.AnalyticsEvent.focussedSession);
			clientSessionId = Constants.AnalyticsEvent.defaultSessionId;
		}
		return clientSessionId;
	}

	/** @internal
	* Function to fill event specific data
	*/
	function fillEventDataForSystemEvents(payload: any, eventData: EventData): void {
		let event = eventData.events[0];
		switch (event.kpiEventName) {
			case Constants.AnalyticsEvent.notificationResponse:
				{
					let notificationResponse = payload.get(Constants.AnalyticsEvent.notificationResponseAction);
					event.notificationResponseAction = notificationResponse;
				}
				break;
			case Constants.AnalyticsEvent.sessionStarted:
				{
					let sessionId = payload.get(Constants.AnalyticsEvent.clientSessionId);
					let correlationId = payload.get(Constants.AnalyticsEvent.correlationId);
					clientSessionConversationIdMap.set(sessionId, correlationId);
				}
				break;
			case Constants.AnalyticsEvent.SessionFocusIn:
				{
					eventData.clientSessionId = payload.get(Constants.AnalyticsEvent.newSessionId);
				}
				break;
			case Constants.AnalyticsEvent.SessionFocusOut:
				{
					let newClientSessionId = payload.get(Constants.AnalyticsEvent.previousSessionId);
					let newConversationId = clientSessionConversationIdMap.get(newClientSessionId);
					let newConvData: InitData = analyticsDataMap.get(newConversationId);
					if (!Utility.isNullOrUndefined(newConvData) && !Utility.isNullOrUndefined(newConvData.conversation) && !Utility.isNullOrUndefined(newConvData.conversation.session)) {
						eventData.providerSessionId = newConvData.conversation.session.providerSessionId;
					}
					eventData.clientSessionId = newClientSessionId;
					eventData.conversationId = newConversationId;
				}
				break;
			case Constants.AnalyticsEvent.CifSessionStart:
				{
					eventData.clientSessionId = Constants.AnalyticsEvent.defaultSessionId;
					eventData.sessionId = Constants.AnalyticsEvent.defaultSessionId;
				}
			case Constants.AnalyticsEvent.CifSessionEnd:
				{
					eventData.clientSessionId = Constants.AnalyticsEvent.defaultSessionId;
					eventData.sessionId = Constants.AnalyticsEvent.defaultSessionId;
				}
				break;
			default:
				break;
		}
	}
	
	function newGuid() {
		let guidRegex = /[xy]/g;
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(guidRegex, function (c) {
			var r = (Math.random() * 16 | 0), v = (c === 'x' ? r : r & 0x3 | 0x8);
			return v.toString(16);
		});
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
		entity[Constants.ConversationEntity.channel] = conv.channel;
		entity[Constants.ConversationEntity.contactId] = conv.contactId;
		entity[Constants.ConversationEntity.conversationId] = conv.conversationId;
		entity[Constants.ConversationEntity.Name] = conv.conversationId;
		entity[Constants.ConversationEntity.conversationTimestamp] = Utility.isNullOrUndefined(conv.createdTimestamp) ? new Date().toISOString() : conv.createdTimestamp;
		entity[Constants.ConversationEntity.externalCorrelationId] = conv.externalCorrelationId;
		entity[Constants.ConversationEntity.providerId] = Utility.isNullOrUndefined(conv.providerId) ? providerId : conv.providerId;
		entity[Constants.ConversationEntity.providerName] = Utility.isNullOrUndefined(conv.providerName) ? providerName : conv.providerName;
		entity[Constants.ConversationEntity.region] = conv.regionData;

		let customDataList = conv.customData;
		if (!Utility.isNullOrUndefined(customDataList)) {
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
		entity[Constants.SessionEntity.conversationId] = data.conversation.conversationId;
		entity[Constants.SessionEntity.externalCorrelationId] = session.externalCorrelationId;
		entity[Constants.SessionEntity.queueId] = session.queueId;
		entity[Constants.SessionEntity.queueName] = session.queueName;
		entity[Constants.SessionEntity.sessionAdditionalData] = session.additionalData;
		entity[Constants.SessionEntity.sessionAgentAssignedTimestamp] = session.agentAssignedTimestamp;
		entity[Constants.SessionEntity.sessionChannel] = session.channel;
		entity[Constants.SessionEntity.sessionCreatedTimestamp] = session.createdTimestamp;
		entity[Constants.SessionEntity.sessionCreationReason] = session.creationReason;
		entity[Constants.SessionEntity.sessionId] = session.providerSessionId;
		entity[Constants.SessionEntity.sessionQueueAssignedTimestamp] = session.queueAssignedTimestamp;

		let customDataList = data.conversation.customData;
		if (!Utility.isNullOrUndefined(customDataList)) {
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
			entity[Constants.ParticipantEntity.sessionId] = session.providerSessionId;
			entity[Constants.ParticipantEntity.conversationId] = data.conversation.conversationId;
			entity[Constants.ParticipantEntity.participantId] = participant.participantId;
			entity[Constants.ParticipantEntity.participantName] = participant.name;
			entity[Constants.ParticipantEntity.participantType] = participant.type;
			entity[Constants.ParticipantEntity.participantAddedTimestamp] = participant.addedTimestamp;

			let customDataList = data.conversation.customData;
			if (!Utility.isNullOrUndefined(customDataList)) {
				for (var customData of customDataList) {
					entity[customData.attribute] = customData.value;
				}
			}
			entities.push(entity);
		}
		return entities;
	}

	/**
	 * Given a EventData, this func returns an equivalent XrmClientApi.WebApi.Entity object for it.
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
			entity[Constants.EventEntity.eventTimestamp] = event.eventTimestamp;
			entity[Constants.EventEntity.externalCorrelationId] = event.externalCorrelationId;
			entity[Constants.EventEntity.kpiEventName] = event.kpiEventName
			entity[Constants.EventEntity.kpiEventId] = analyticsEventMap.get(event.kpiEventName);
			entity[Constants.EventEntity.kpiEventReason] = event.kpiEventReason;
			entity[Constants.EventEntity.notificationResponseAction] = event.notificationResponseAction;
			entity[Constants.EventEntity.participantId] = data.participantId;
			entity[Constants.EventEntity.sessionId] = data.providerSessionId;

			let customDataList = event.customData;
			if (!Utility.isNullOrUndefined(customDataList)) {
				for (var customData of customDataList) {
					entity[customData.attribute] = customData.value;
				}
			}
			entities.push(entity);
		}
		return entities;
	}

	/**
	 * Given a EventData, this func returns an equivalent XrmClientApi.WebApi.Entity object for it.
	 * @param map Object to build the entity for.
	 */
	export function buildEventsEntityNew(data: EventData): XrmClientApi.WebApi.Entity[] {
		let entities: XrmClientApi.WebApi.Entity[] = [];
		let events = data.events;
		for (var event of events) {
			let entity: XrmClientApi.WebApi.Entity = {};
			entity[Constants.EventEntity.additionalData] = event.additionalData;
			entity[Constants.EventEntity.clientSessionId] = (data.clientSessionId === Constants.AnalyticsEvent.defaultSessionId) ? Constants.AnalyticsEvent.noSessionId : data.clientSessionId;
			entity[Constants.EventEntity.conversationId] = data.conversationId;
			entity[Constants.EventEntity.eventTimestamp] = event.eventTimestamp;
			entity[Constants.EventEntity.externalCorrelationId] = event.externalCorrelationId;
			entity[Constants.EventEntity.kpiEventName] = event.kpiEventName
			entity[Constants.EventEntity.kpiEventId] = analyticsEventMap.get(event.kpiEventName);
			entity[Constants.EventEntity.kpiEventReason] = event.kpiEventReason;
			entity[Constants.EventEntity.participantId] = data.participantId;
			entity[Constants.EventEntity.cifSessionId] = cifSessionId;
			entity[Constants.EventEntity.ProviderId] = data.providerId;
			entity[Constants.EventEntity.sessionId] = data.providerSessionId;
			entity[Constants.EventEntity.sessionUniqueId] = (data.sessionId === Constants.AnalyticsEvent.defaultSessionId) ? Constants.AnalyticsEvent.noSessionId : data.sessionId;


			let customDataList = event.customData;
			if (!Utility.isNullOrUndefined(customDataList)) {
				for (var customData of customDataList) {
					entity[customData.attribute] = customData.value;
				}
			}
			entities.push(entity);
		}
		return entities;
	}


	/** @internal
	* Function to log the KPI Event Definitions data
	*/
	function loadAnalyticsEventMap(): Promise<boolean> {
		return new Promise<boolean>(
			function(resolve, reject) {
				if (analyticsEventMap.size > 0) {
					return resolve(true);
				}
				Xrm.WebApi.retrieveMultipleRecords("msdyn_kpieventdefinition", "?$select=msdyn_name,msdyn_kpieventdefinitionid&$filter=(statecode eq 0)").then(
					function(result) {
						result.entities.forEach(
							function(value, index, array) {
								analyticsEventMap.set(value["msdyn_name"].trim(), value["msdyn_kpieventdefinitionid"].trim());
							});
						return resolve(true);
					},
					function(error) {
						return reject(error);
					});
			});
	}

    //call the initialize method
	setTimeout(initialize(), 0);
}