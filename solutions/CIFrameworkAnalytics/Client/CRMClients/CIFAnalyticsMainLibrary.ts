/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="./Constants.ts" />
/// <reference path="./AnalyticsDataModel.ts" />
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />

namespace Microsoft.CIFrameworkAnalytics {

	let conversationUCSessionMap = new Map<string, string>();
	let analyticsDataMap = new Map<string, InitData>();
	let analyticsEventMap = new Map<string, string>();

/** @internal
 * Initialize method that is called on load of the script
 */
	function initialize() {
		window.addEventListener(Constants.MessageType.EventName, analyticsEventListener);
		loadAnalyticsEventMap();
	}

/** @internal
 * Handler for the logCIFAnalytics that is raised from CIF Internal Library
 */
	function analyticsEventListener(event: any) {
		var payload = event.detail.get(Constants.EventData.analyticsData);
		if (Utility.isNullOrUndefined(payload)) {
			let logData = Utility.validateAnalyticsPayload(payload);
			if (Utility.isNullOrUndefined(logData)) {
				if (payload instanceof InitData) {
					logAnalyticsInitData(payload);
				}
				else if (payload instanceof EventData) {
					logEventData(payload);
				}
			}
		}
	}

/** @internal
 * Function to log the analytics init data
 */
	function logAnalyticsInitData(payload: InitData) {
		// update the conversation id to data map
		let conversationId: string = payload.conversation.conversationId;
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
		Xrm.WebApi.createRecord(Constants.Entity.conversationEntityName, Utility.buildConversationEntity(payload)).then(
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
		Xrm.WebApi.createRecord(Constants.Entity.sessionEntityName, Utility.buildSessionEntity(payload)).then(
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
			Xrm.WebApi.createRecord(Constants.Entity.participantEntityName, record).then(
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
			Xrm.WebApi.createRecord(Constants.Entity.eventEntityName, record).then(
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
* Function to log the KPI Event Definitions data
*/
	function loadAnalyticsEventMap() : Promise < boolean >{
		return new Promise<boolean>(
			function (resolve, reject) {
				if (analyticsEventMap.size > 0) {
					return resolve(true);
				}
				Xrm.WebApi.retrieveMultipleRecords("new_kpieventdefinitions", "?$select=new_name,new_kpieventid&$filter=(new_active eq \"yes\")").then(
						function (result) {
						result.entities.forEach(
							function (value, index, array) {
								analyticsEventMap.set(value["new_name"], value["new_kpieventid"]);
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