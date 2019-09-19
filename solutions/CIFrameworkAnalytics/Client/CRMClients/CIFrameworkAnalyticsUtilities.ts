/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/**
 * Constants for CIFramework.
 */
/** @internal */
namespace Microsoft.CIFrameworkAnalytics.Utility {

	var webresourceName = "Localization/CIF_webresource_strings";

	export function getResourceString(key: any) {
		var value = key;
		if (Xrm && Xrm.Utility && Xrm.Utility.getResourceString) {
			value = Xrm.Utility.getResourceString(webresourceName, key);

			if (value === undefined || value === null) {
				value = key;
			}
		}

		return value;
	}

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
	export function validateAnalyticsPayload(payload: InitData | EventData): Promise<boolean> {
		if ((payload instanceof InitData && !isNullOrUndefined(payload.conversation.conversationId) && !isNullOrUndefined(payload.conversation.session.sessionId)) ||
			(payload instanceof EventData && !isNullOrUndefined(payload.conversationId) && !isNullOrUndefined(payload.sessionId) && !isNullOrUndefined(payload.clientSessionId)))
			return Promise.resolve(true);
		else
			return Promise.resolve(false);
	}

	/**
	 * Given a map, this func returns an equivalent XrmClientApi.WebApi.Entity object for it.
	 * @param map Object to build the entity for.
	 */
	export function buildConversationEntity(data: InitData): XrmClientApi.WebApi.Entity {
		let entity: XrmClientApi.WebApi.Entity = {};
		entity[Constants.Entity.conversationId] = data.conversation.conversationId;
		entity[Constants.Entity.conversationId] = data.conversation.channel;
		entity[Constants.Entity.conversationId] = data.conversation.regionData;
		entity[Constants.Entity.conversationId] = data.conversation.conversationTimestamp;
		let customDataList = data.conversation.customData;
		for (var customData of customDataList) {
			entity[customData.attribute] = customData.value;
		}
		return entity;
	}

	/**
	 * Given a map, this func returns an equivalent XrmClientApi.WebApi.Entity object for it.
	 * @param map Object to build the entity for.
	 */
	export function buildSessionEntity(data: InitData): XrmClientApi.WebApi.Entity {
		let session = data.conversation.session;
		let entity: XrmClientApi.WebApi.Entity = {};
		entity[Constants.Entity.sessionid] = session.sessionId;
		entity[Constants.Entity.sessionname] = session.sessionName;
		entity[Constants.Entity.createdts] = session.sessionCreatedTimestamp;
		let customDataList = data.conversation.customData;
		for (var customData of customDataList) {
			entity[customData.attribute] = customData.value;
		}
		return entity;
	}

	/**
	* Given a map, this func returns an equivalent XrmClientApi.WebApi.Entity object for it.
	* @param map Object to build the entity for.
	*/
	export function buildParticipantEntityList(data: InitData): XrmClientApi.WebApi.Entity [] {
		let session = data.conversation.session;
		let entities: XrmClientApi.WebApi.Entity[] = [];
		for (var participant of session.participants) {
			let entity: XrmClientApi.WebApi.Entity = {};
			entity[Constants.Entity.sessionid] = participant.participantId;
			entity[Constants.Entity.sessionname] = participant.participantName;
			entity[Constants.Entity.createdts] = participant.participantType;
			entity[Constants.Entity.createdts] = participant.participantAddedTimestamp;
			let customDataList = data.conversation.customData;
			for (var customData of customDataList) {
				entity[customData.attribute] = customData.value;
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
			entity[Constants.Entity.conversationId] = data.conversationId;
			entity[Constants.Entity.sessionid] = data.sessionId;
			entity[Constants.Entity.additionalData] = event.additionalData;
			entity[Constants.Entity.entityName] = event.entityName;
			entity[Constants.Entity.entityRecordId] = event.entityRecordId;
			entity[Constants.Entity.kpiEventReason] = event.kpiEventReason;
			entity[Constants.Entity.eventTimestamp] = event.eventTimestamp;
			entity[Constants.Entity.externalCorrelationId] = event.externalCorrelationId;
			entity[Constants.Entity.knowledgeArticleId] = event.knowledgeArticleId;
			entity[Constants.Entity.knowledgeArticleName] = event.knowledgeArticleName;
			entity[Constants.Entity.kpiEventName] = event.kpiEventName;
			entity[Constants.Entity.newPresence] = event.newPresence;
			entity[Constants.Entity.oldPresence] = event.oldPresence;
			entity[Constants.Entity.tabId] = event.tabId;
			entity[Constants.Entity.tabName] = event.tabName;
			let customDataList = event.customData;
			for (var customData of customDataList) {
				entity[customData.attribute] = customData.value;
			}
			entities.push(entity);
		}
		return entities;
	}

	export function extractParameter(queryString: string, parameterName: string): string {
		var params: any = {};
		if (queryString) {
			var queryStringArray = queryString.substr(1).split("&");
			queryStringArray.forEach((query) => {
				var queryPair = query.split("=");
				var queryKey = decodeURIComponent(queryPair.shift());
				var queryValue = decodeURIComponent(queryPair.join("="));
				params[queryKey] = queryValue;
			});
		}
		if (params.hasOwnProperty(parameterName))
			return params[parameterName];
		else
			return "";
	}

	export function extractSearchText(queryString: string): string {
		var emptyString = "";
		if (queryString) {
			let query = queryString.split("=");
			return (query[1] != null && query[1] != "") ? query[1] : emptyString;
		}
		return emptyString;
	}


	export function splitQueryForSearch(queryString: string): Array<string> {

		var splitQuery: Array<string> = [];
		if (queryString) {
			splitQuery = queryString.split("&");
		}
		let splitSearchQuery = ["", ""];

		splitQuery.forEach((query) => {
			if (!query.startsWith("$search") && !query.startsWith("?$search")) {
				splitSearchQuery[0] == "" ? splitSearchQuery[0] += query : splitSearchQuery[0] += "&" + query;
			}
			else {
				splitSearchQuery[1] = query;
			}
		});
		if (!splitSearchQuery[0].startsWith("?")) {
			splitSearchQuery[0] = "?" + splitSearchQuery[0];
		}
		if (splitSearchQuery[1].startsWith("?")) {
			splitSearchQuery[1] = splitSearchQuery[1].substr(1);
		}
		return splitSearchQuery;
	}

	
}