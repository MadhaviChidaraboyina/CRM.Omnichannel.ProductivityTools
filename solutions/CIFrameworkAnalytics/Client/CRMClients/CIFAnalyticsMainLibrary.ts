/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="./Constants.ts" />
/// <reference path="./AnalyticsDataModel.ts" />
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
/// <reference path="../../../../packages/Crm.Moment.1.0.0/Content/Typings/moment.d.ts" />

namespace Microsoft.CIFrameworkAnalytics {

	let conversationUCSessionMap = new Map<string, string>();
	let analyticsDataMap = new Map<string, InitData>();
	let analyticsEventMap = new Map<string, string>();

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
		var payload = event.detail.get(Constants.AnalyticsEvent.analyticsData);
		if (!Utility.isNullOrUndefined(payload)) {
			let logData = Utility.validateInitAnalyticsPayload(payload);
			if (logData) {
				logAnalyticsInitData(payload);
			}
		}
	}

	/** @internal
	 * Handler for the logCIFAnalytics that is raised from CIF Internal Library
	 */
	function logAnalyticsEventListener(event: any) {
		let eventData = createEventDataForSystemEvents(event.detail);
		if (!Utility.isNullOrUndefined(eventData)) {
			let logData = Utility.validateLogAnalyticsPayload(eventData);
			if (logData) {
				logEventData(eventData);
			}
		}
	}

	/** @internal
	 * Function to log the analytics init data
	 */
	function logAnalyticsInitData(payload: InitData) {
		// update the conversation id to data map
		let conversationId: string = payload.conversation.conversationId;
		if (analyticsDataMap.has(conversationId))
			return;

		analyticsDataMap.set(conversationId, payload);

		//create the records. 
		logConversationData(payload);
		logSessionData(payload);
		logParticipantData(payload);
	}

	/** @internal
	* Function to log the Conversation data
	*/
	function logConversationData(payload: InitData) {
		// create Conversation Data record
		Xrm.WebApi.createRecord(Constants.ConversationEntity.entityName, Utility.buildConversationEntity(payload)).then(
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
	function logSessionData(payload: InitData) {
		// create Session Data record
		Xrm.WebApi.createRecord(Constants.SessionEntity.entityName, Utility.buildSessionEntity(payload)).then(
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
	function logParticipantData(payload: InitData) {
		let records: XrmClientApi.WebApi.Entity[] = Utility.buildParticipantEntityList(payload);
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
		let correlationId = payload.get(Constants.AnalyticsEvent.correlationId);
		let clientSessionId = payload.get(Constants.AnalyticsEvent.focussedSession);
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
				fillEventDataForSystemEvents(payload,conversationData,event);
				events.push(event);
				eventData.events = events;
			}
			return eventData;
		}
	}

	function fillEventDataForSystemEvents(payload: any, convData: InitData, event: EventEntity): void {
		switch (event.kpiEventName) {
			case Constants.AnalyticsEvent.notificationResponse:
				{
					let notificationResponse = payload.get(Constants.EventEntity.notificationResponseAction);
					event.notificationResponseAction = notificationResponse;
				}
				break;
			case Constants.AnalyticsEvent.notificationReceived:
			case Constants.AnalyticsEvent.notificationTimedOut:
			case Constants.AnalyticsEvent.sessionStarted:
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