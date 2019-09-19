/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

namespace Microsoft.CIFrameworkAnalytics.Constants {
	/**
	 * All the message types/ APIs that are exposed to the widget
	*/
	export class MessageType {
		public static EventName = "logCIFAnalytics";
	}
	export class Entity {
		public static conversationEntityName = "ConversationData";
		public static sessionEntityName = "SessionData";
		public static participantEntityName = "ParticipantData";
		public static eventEntityName = "BaseEvents";
		// Attribute names of analytics Entities
		public static conversationId = "conversationId";
		public static channel = "channel";
		public static region = "region";
		public static createdts = "createdts";
		public static sessionid = "sessionid";
		public static sessionname = "sessionname";
		public static participantid = "participantid";
		public static participantname = "participantname";
		public static participanttype = "participanttype";
		public static addedtimestamp = "addedtimestamp";
		public static additionalData = "event.additionalData";
		public static customData = "event.customData";
		public static entityName = "event.entityName";
		public static entityRecordId = "event.entityRecordId";
		public static kpiEventReason = "event.kpiEventReason";
		public static eventTimestamp = "event.eventTimestamp";
		public static externalCorrelationId = "event.externalCorrelationId";
		public static knowledgeArticleId = "event.knowledgeArticleId";
		public static knowledgeArticleName = "event.knowledgeArticleName";
		public static kpiEventName = "event.kpiEventName";
		public static newPresence = "event.newPresence";
		public static oldPresence = "event.oldPresence";
		public static tabId = "event.tabId";
		public static tabName = "event.tabName";
    }
    export class EventData {
        public static analyticsData = "analyticsData";
    }
}