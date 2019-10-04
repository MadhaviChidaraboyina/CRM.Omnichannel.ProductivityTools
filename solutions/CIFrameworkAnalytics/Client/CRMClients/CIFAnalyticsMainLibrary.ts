/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="./Constants.ts" />
/// <reference path="./AnalyticsDataModel.ts" />
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />

namespace Microsoft.CIFrameworkAnalytics {

	let clientSessionConversationIdMap = new Map<string, string>();
	let analyticsDataMap = new Map<string, InitData>();
	let analyticsEventMap = new Map<string, string>();
	let conversationAnalyticsFlagMap = new Map<string, boolean>();

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
		let conversationId = getConversationId(event.detail);
		if (!Utility.isNullOrUndefined(conversationId)) {
			if (conversationAnalyticsFlagMap.get(conversationId)) {
				let eventData = createEventDataForSystemEvents(event.detail);
				if (!Utility.isNullOrUndefined(eventData) && Utility.validateLogAnalyticsPayload(eventData)) {
						logEventData(eventData);
				}
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

		//create the records. 
		logConversationData(data);
		logSessionData(data);
		logParticipantData(data);
	}

	/** @internal
	* Function to log the Conversation data
	*/
	function logConversationData(data: any) {
		let payload: InitData = data.get(Constants.AnalyticsEvent.analyticsData);
		// create Conversation Data record
		Xrm.WebApi.createRecord(Constants.ConversationEntity.entityName, Utility.buildConversationEntity(data)).then(
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
		Xrm.WebApi.createRecord(Constants.SessionEntity.entityName, Utility.buildSessionEntity(data)).then(
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
		let records: XrmClientApi.WebApi.Entity[] = Utility.buildParticipantEntityList(data);
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
		let records: XrmClientApi.WebApi.Entity[] = Utility.buildEventsEntity(payload);
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
				eventData.eventParticipantId = conversationData.conversation.session.participants[0].participantId;
				eventData.sessionId = conversationData.conversation.session.sessionId;
				let events: EventEntity[] = new Array<EventEntity>();
				let event = new EventEntity();
				event.kpiEventId = eventId;
				event.kpiEventName = eventName;
				event.eventTimestamp = new Date().toISOString();
				fillEventDataForSystemEvents(payload,conversationData,event);
				events.push(event);
				eventData.events = events;
			}
			return eventData;
		}
	}

	function getConversationId(payload: any): string {
		let correlationId = payload.get(Constants.AnalyticsEvent.correlationId);
		let clientSessionId = getClientSessionId(payload);
		if (Utility.isNullOrUndefined(correlationId)) {
			correlationId = clientSessionConversationIdMap.get(clientSessionId);
		}
		return correlationId;
	}

	function getClientSessionId(payload: any): string {
		let clientSessionId = payload.get(Constants.AnalyticsEvent.sessionId);
		if (Utility.isNullOrUndefined(clientSessionId)) {
			clientSessionId = payload.get(Constants.AnalyticsEvent.focussedSession);
		}
		return clientSessionId;
	}

	function fillEventDataForSystemEvents(payload: any, convData: InitData, event: EventEntity): void {
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
			case Constants.AnalyticsEvent.notificationReceived:
			case Constants.AnalyticsEvent.notificationTimedOut:
			case Constants.AnalyticsEvent.sessionSwitched:
			case Constants.AnalyticsEvent.sessionClosed:
				break;
		}
	}

	/** @internal
	* Function to log the KPI Event Definitions data
	*/
	function loadAnalyticsEventMap(): Promise<boolean> {
		return new Promise<boolean>(
			function (resolve, reject) {
				if (analyticsEventMap.size > 0) {
					return resolve(true);
				}
				Xrm.WebApi.retrieveMultipleRecords("msdyn_kpieventdefinition", "?$select=msdyn_name,msdyn_kpieventdefinitionid&$filter=(msdyn_active eq true)").then(
					function (result) {
						result.entities.forEach(
							function (value, index, array) {
								analyticsEventMap.set(value["msdyn_name"].trim(), value["msdyn_kpieventdefinitionid"].trim());
							});
						return resolve(true);
					},
					function (error) {
						return reject(error);
					});
			});
	}

	//call the initialize method
	setTimeout(initialize(), 0);
}