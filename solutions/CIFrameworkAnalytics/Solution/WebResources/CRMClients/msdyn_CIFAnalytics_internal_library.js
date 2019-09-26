/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Microsoft;
(function (Microsoft) {
    var CIFrameworkAnalytics;
    (function (CIFrameworkAnalytics) {
        class InitData {
        }
        CIFrameworkAnalytics.InitData = InitData;
        class Conversation {
        }
        CIFrameworkAnalytics.Conversation = Conversation;
        class CustomDataEntity {
        }
        CIFrameworkAnalytics.CustomDataEntity = CustomDataEntity;
        class Session {
        }
        CIFrameworkAnalytics.Session = Session;
        class ParticipantsEntity {
        }
        CIFrameworkAnalytics.ParticipantsEntity = ParticipantsEntity;
        class EventData {
        }
        CIFrameworkAnalytics.EventData = EventData;
        class EventEntity {
        }
        CIFrameworkAnalytics.EventEntity = EventEntity;
    })(CIFrameworkAnalytics = Microsoft.CIFrameworkAnalytics || (Microsoft.CIFrameworkAnalytics = {}));
})(Microsoft || (Microsoft = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Microsoft;
(function (Microsoft) {
    var CIFrameworkAnalytics;
    (function (CIFrameworkAnalytics) {
        var Constants;
        (function (Constants) {
            /**
             * All the message types/ APIs that are exposed to the widget
            */
            class MessageType {
            }
            MessageType.initAnalyticsPlatformEventName = "initCIFAnalytics";
            MessageType.logAnalyticsPlatformEventName = "logCIFAnalytics";
            Constants.MessageType = MessageType;
            class ConversationEntity {
            }
            ConversationEntity.entityName = "msdyn_conversationdata";
            ConversationEntity.Name = "msdyn_name";
            ConversationEntity.accountId = "msdyn_accountid";
            ConversationEntity.additionalData = "msdyn_additionaldata";
            ConversationEntity.backendConversationId = "msdyn_backendconversationid";
            ConversationEntity.channel = "msdyn_channel";
            ConversationEntity.channelContext = "msdyn_context";
            ConversationEntity.contactId = "msdyn_contactid";
            ConversationEntity.conversationId = "msdyn_conversationid";
            ConversationEntity.conversationTimestamp = "msdyn_conversationtimestamp";
            ConversationEntity.externalAccountId = "msdyn_externalaccountid";
            ConversationEntity.externalContactId = "msdyn_externalcontactid";
            ConversationEntity.externalConversationId = "msdyn_externalconversationId";
            ConversationEntity.externalCorrelationId = "msdyn_externalcorrelationid";
            ConversationEntity.externalProviderId = "msdyn_externalproviderid";
            ConversationEntity.initialQueueName = "msdyn_initialqueuename";
            ConversationEntity.providerId = "msdyn_providerid";
            ConversationEntity.providerName = "msdyn_providername";
            ConversationEntity.region = "msdyn_region";
            Constants.ConversationEntity = ConversationEntity;
            class SessionEntity {
            }
            SessionEntity.entityName = "msdyn_sessiondata";
            SessionEntity.clientSessionId = "msdyn_ucisessionid";
            SessionEntity.clientSessionName = "msdyn_ucisessionname";
            SessionEntity.conversationId = "msdyn_conversationid";
            SessionEntity.externalCorrelationId = "msdyn_externalcorrelationid";
            SessionEntity.queueId = "msdyn_queueid";
            SessionEntity.queueName = "msdyn_queuename";
            SessionEntity.sessionAdditionalData = "msdyn_sessionadditionaldata";
            SessionEntity.sessionAgentAssignedTimestamp = "msdyn_sessionagentassignedtimestamp";
            SessionEntity.sessionChannel = "msdyn_sessionchannel";
            SessionEntity.sessionCreatedTimestamp = "msdyn_sessioncreatedtimestamp";
            SessionEntity.sessionCreationReason = "msdyn_sessioncreationreason";
            SessionEntity.sessionId = "msdyn_sessionid";
            SessionEntity.sessionQueueAssignedTimestamp = "msdyn_sessionqueueassignedtimestamp";
            Constants.SessionEntity = SessionEntity;
            class ParticipantEntity {
            }
            ParticipantEntity.entityName = "msdyn_sessionparticipantdata";
            ParticipantEntity.conversationId = "msdyn_conversationid";
            ParticipantEntity.externalParticipantIame = "msdyn_externalparticipantid";
            ParticipantEntity.externalParticipantName = "msdyn_externalparticipantname";
            ParticipantEntity.participantAddedTimestamp = "msdyn_participantaddedtimestamp";
            ParticipantEntity.participantAssignReason = "msdyn_participantassignreason";
            ParticipantEntity.participantId = "msdyn_participantid";
            ParticipantEntity.participantName = "msdyn_participantname";
            ParticipantEntity.participantMode = "msdyn_participantmode";
            ParticipantEntity.participantType = "msdyn_participanttype";
            ParticipantEntity.sessionId = "msdyn_sessionid";
            Constants.ParticipantEntity = ParticipantEntity;
            class EventEntity {
            }
            EventEntity.entityName = "msdyn_kpieventdata";
            EventEntity.additionalData = "msdyn_additionaldata";
            EventEntity.clientSessionId = "msdyn_clientsessionid";
            EventEntity.conversationId = "msdyn_conversationid";
            EventEntity.createdEntityRecordId = "msdyn_entityrecordid";
            EventEntity.createdEntityName = "msdyn_entityname";
            EventEntity.eventTimestamp = "msdyn_eventtimestamp";
            EventEntity.externalCorrelationId = "msdyn_externalcorrelationid";
            EventEntity.knowledgeArticleId = "msdyn_knowledgearticleid";
            EventEntity.knowledgeArticleName = "msdyn_knowledgearticlename";
            EventEntity.kpiEventId = "msdyn_kpieventid";
            EventEntity.kpiEventName = "msdyn_kpieventname";
            EventEntity.kpiEventReason = "msdyn_kpieventreason";
            EventEntity.newPresence = "msdyn_newpresence";
            EventEntity.notificationResponseAction = "notificationResponseaction";
            EventEntity.oldPresence = "msdyn_oldpresence";
            EventEntity.participantId = "msdyn_participantid";
            EventEntity.sessionId = "msdyn_sessionid";
            EventEntity.tabId = "msdyn_tabid";
            EventEntity.tabName = "msdyn_tabname";
            EventEntity.tabAction = "msdyn_tabaction";
            Constants.EventEntity = EventEntity;
            class AnalyticsEvent {
            }
            AnalyticsEvent.analyticsData = "analyticsData";
            AnalyticsEvent.correlationId = "correlationId";
            AnalyticsEvent.focussedSession = "focussedSession";
            AnalyticsEvent.eventName = "analyticsEventname";
            AnalyticsEvent.eventType = "analyticsEventtype";
            AnalyticsEvent.notificationReceived = "NotificationReceived";
            AnalyticsEvent.notificationResponse = "NotificationResponse";
            AnalyticsEvent.notificationTimedOut = "NotificationTimedOut";
            AnalyticsEvent.sessionStarted = "SessionStarted";
            AnalyticsEvent.sessionSwitched = "SessionSwitched";
            AnalyticsEvent.sessionClosed = "SessionClosed";
            AnalyticsEvent.newTabOpened = "NewTabOpened";
            Constants.AnalyticsEvent = AnalyticsEvent;
            var EventType;
            (function (EventType) {
                EventType[EventType["SystemEvent"] = 0] = "SystemEvent";
                EventType[EventType["CustomEvent"] = 1] = "CustomEvent";
            })(EventType = Constants.EventType || (Constants.EventType = {}));
        })(Constants = CIFrameworkAnalytics.Constants || (CIFrameworkAnalytics.Constants = {}));
    })(CIFrameworkAnalytics = Microsoft.CIFrameworkAnalytics || (Microsoft.CIFrameworkAnalytics = {}));
})(Microsoft || (Microsoft = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="./Constants.ts" />
/// <reference path="./AnalyticsDataModel.ts" />
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
/// <reference path="../../../../packages/Crm.Moment.1.0.0/Content/Typings/moment.d.ts" />
var Microsoft;
(function (Microsoft) {
    var CIFrameworkAnalytics;
    (function (CIFrameworkAnalytics) {
        let conversationUCSessionMap = new Map();
        let analyticsDataMap = new Map();
        let analyticsEventMap = new Map();
        /** @internal
         * Initialize method called on load of the script
         */
        function initialize() {
            window.addEventListener(CIFrameworkAnalytics.Constants.MessageType.initAnalyticsPlatformEventName, initAnalyticsEventListener);
            window.addEventListener(CIFrameworkAnalytics.Constants.MessageType.logAnalyticsPlatformEventName, logAnalyticsEventListener);
            loadAnalyticsEventMap();
        }
        /** @internal
         * Handler for the logCIFAnalytics that is raised from CIF Internal Library
         */
        function initAnalyticsEventListener(event) {
            var payload = event.detail.get(CIFrameworkAnalytics.Constants.AnalyticsEvent.analyticsData);
            if (!CIFrameworkAnalytics.Utility.isNullOrUndefined(payload)) {
                let logData = CIFrameworkAnalytics.Utility.validateInitAnalyticsPayload(payload);
                if (logData) {
                    logAnalyticsInitData(payload);
                }
            }
        }
        /** @internal
         * Handler for the logCIFAnalytics that is raised from CIF Internal Library
         */
        function logAnalyticsEventListener(event) {
            let eventData = createEventDataForSystemEvents(event.detail);
            if (!CIFrameworkAnalytics.Utility.isNullOrUndefined(eventData)) {
                let logData = CIFrameworkAnalytics.Utility.validateLogAnalyticsPayload(eventData);
                if (logData) {
                    logEventData(eventData);
                }
            }
        }
        /** @internal
         * Function to log the analytics init data
         */
        function logAnalyticsInitData(payload) {
            // update the conversation id to data map
            let conversationId = payload.conversation.conversationId;
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
        function logConversationData(payload) {
            // create Conversation Data record
            Xrm.WebApi.createRecord(CIFrameworkAnalytics.Constants.ConversationEntity.entityName, CIFrameworkAnalytics.Utility.buildConversationEntity(payload)).then(function success(result) {
                console.log("Conversation Data record created with ID: " + result.id);
            }, function (error) {
                console.log(error.message);
            });
        }
        /** @internal
        * Function to log the Session data
        */
        function logSessionData(payload) {
            // create Session Data record
            Xrm.WebApi.createRecord(CIFrameworkAnalytics.Constants.SessionEntity.entityName, CIFrameworkAnalytics.Utility.buildSessionEntity(payload)).then(function success(result) {
                console.log("Session Data record created with ID: " + result.id);
            }, function (error) {
                console.log(error.message);
            });
        }
        /** @internal
        * Function to log the Participant data
        */
        function logParticipantData(payload) {
            let records = CIFrameworkAnalytics.Utility.buildParticipantEntityList(payload);
            records.forEach(function (record) {
                Xrm.WebApi.createRecord(CIFrameworkAnalytics.Constants.ParticipantEntity.entityName, record).then(function success(result) {
                    console.log("Participant Data record created with ID: " + result.id);
                }, function (error) {
                    console.log(error.message);
                });
            });
        }
        /** @internal
        * Function to log the Event data
        */
        function logEventData(payload) {
            let records = CIFrameworkAnalytics.Utility.buildEventsEntity(payload);
            records.forEach(function (record) {
                Xrm.WebApi.createRecord(CIFrameworkAnalytics.Constants.EventEntity.entityName, record).then(function success(result) {
                    console.log("KPI Event Data record created with ID: " + result.id);
                }, function (error) {
                    console.log(error.message);
                });
            });
        }
        /** @internal
        * Function to create the Event data for SystemEvents
        */
        function createEventDataForSystemEvents(payload) {
            let correlationId = payload.get(CIFrameworkAnalytics.Constants.AnalyticsEvent.correlationId);
            let clientSessionId = payload.get(CIFrameworkAnalytics.Constants.AnalyticsEvent.focussedSession);
            let eventName = payload.get(CIFrameworkAnalytics.Constants.AnalyticsEvent.eventName);
            let eventId = analyticsEventMap.get(eventName);
            if (!CIFrameworkAnalytics.Utility.isNullOrUndefined(correlationId) && !CIFrameworkAnalytics.Utility.isNullOrUndefined(eventId)) {
                let conversationData = analyticsDataMap.get(correlationId);
                if (!CIFrameworkAnalytics.Utility.isNullOrUndefined(conversationData)) {
                    var eventData = new CIFrameworkAnalytics.EventData();
                    eventData.conversationId = correlationId;
                    eventData.clientSessionId = clientSessionId;
                    eventData.eventParticipantId = conversationData.conversation.session.participants[0].participantId;
                    eventData.sessionId = conversationData.conversation.session.sessionId;
                    let events = new Array();
                    let event = new CIFrameworkAnalytics.EventEntity();
                    event.kpiEventId = eventId;
                    event.kpiEventName = eventName;
                    fillEventDataForSystemEvents(payload, conversationData, event);
                    events.push(event);
                    eventData.events = events;
                }
                return eventData;
            }
        }
        function fillEventDataForSystemEvents(payload, convData, event) {
            switch (event.kpiEventName) {
                case CIFrameworkAnalytics.Constants.AnalyticsEvent.notificationResponse:
                    {
                        let notificationResponse = payload.get(CIFrameworkAnalytics.Constants.EventEntity.notificationResponseAction);
                        event.notificationResponseAction = notificationResponse;
                    }
                    break;
                case CIFrameworkAnalytics.Constants.AnalyticsEvent.notificationReceived:
                case CIFrameworkAnalytics.Constants.AnalyticsEvent.notificationTimedOut:
                case CIFrameworkAnalytics.Constants.AnalyticsEvent.sessionStarted:
                case CIFrameworkAnalytics.Constants.AnalyticsEvent.sessionSwitched:
                case CIFrameworkAnalytics.Constants.AnalyticsEvent.sessionClosed:
                    break;
            }
        }
        /** @internal
        * Function to log the KPI Event Definitions data
        */
        function loadAnalyticsEventMap() {
            return new Promise(function (resolve, reject) {
                if (analyticsEventMap.size > 0) {
                    return resolve(true);
                }
                Xrm.WebApi.retrieveMultipleRecords("msdyn_kpieventdefinition", "?$select=msdyn_name,msdyn_kpieventdefinitionid&$filter=(msdyn_active eq true)").then(function (result) {
                    result.entities.forEach(function (value, index, array) {
                        analyticsEventMap.set(value["msdyn_name"].trim(), value["msdyn_kpieventdefinitionid"].trim());
                    });
                    return resolve(true);
                }, function (error) {
                    return reject(error);
                });
            });
        }
        //call the initialize method
        setTimeout(initialize(), 0);
    })(CIFrameworkAnalytics = Microsoft.CIFrameworkAnalytics || (Microsoft.CIFrameworkAnalytics = {}));
})(Microsoft || (Microsoft = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="../../../../packages/Crm.Moment.1.0.0/Content/Typings/moment.d.ts" />
/**
 * Constants for CIFramework.
 */
/** @internal */
var Microsoft;
(function (Microsoft) {
    var CIFrameworkAnalytics;
    (function (CIFrameworkAnalytics) {
        var Utility;
        (function (Utility) {
            /**
             * Generic method to convert map data into string
             * @param map
             */
            function mapToString(map, exclusionList = []) {
                let result = "";
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
            Utility.mapToString = mapToString;
            function flatten(obj) {
                let ret = {};
                let propNames = Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).filter(n => n != 'constructor');
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
            Utility.flatten = flatten;
            /**
             * utility func to check whether an object is null or undefined
             */
            /** @internal */
            function isNullOrUndefined(obj) {
                return (obj == null || typeof obj === "undefined");
            }
            Utility.isNullOrUndefined = isNullOrUndefined;
            /**
             * utility func to check whether an object is null or undefined
             */
            /** @internal */
            function validateInitAnalyticsPayload(payload) {
                if ((!isNullOrUndefined(payload.conversation.conversationId) && !isNullOrUndefined(payload.conversation.session.sessionId)))
                    return Promise.resolve(true);
                else
                    return Promise.resolve(false);
            }
            Utility.validateInitAnalyticsPayload = validateInitAnalyticsPayload;
            /**
             * utility func to check whether an object is null or undefined
             */
            /** @internal */
            function validateLogAnalyticsPayload(payload) {
                if ((!isNullOrUndefined(payload.conversationId) && !isNullOrUndefined(payload.sessionId) && !isNullOrUndefined(payload.clientSessionId)))
                    return Promise.resolve(true);
                else
                    return Promise.resolve(false);
            }
            Utility.validateLogAnalyticsPayload = validateLogAnalyticsPayload;
            /**
             * Given a map, this func returns an equivalent XrmClientApi.WebApi.Entity object for it.
             * @param map Object to build the entity for.
             */
            function buildConversationEntity(data) {
                let entity = {};
                let conv = data.conversation;
                entity[CIFrameworkAnalytics.Constants.ConversationEntity.accountId] = conv.accountId;
                entity[CIFrameworkAnalytics.Constants.ConversationEntity.additionalData] = conv.additionalData;
                entity[CIFrameworkAnalytics.Constants.ConversationEntity.backendConversationId] = conv.backendConversationId;
                entity[CIFrameworkAnalytics.Constants.ConversationEntity.channel] = conv.channel;
                entity[CIFrameworkAnalytics.Constants.ConversationEntity.channelContext] = conv.channelContext;
                entity[CIFrameworkAnalytics.Constants.ConversationEntity.contactId] = conv.contactId;
                entity[CIFrameworkAnalytics.Constants.ConversationEntity.conversationId] = conv.conversationId;
                entity[CIFrameworkAnalytics.Constants.ConversationEntity.Name] = conv.conversationId;
                entity[CIFrameworkAnalytics.Constants.ConversationEntity.conversationTimestamp] = isNullOrUndefined(conv.conversationTimestamp) ? conv.conversationTimestamp : getUTCDateTime();
                entity[CIFrameworkAnalytics.Constants.ConversationEntity.externalAccountId] = conv.externalAccountId;
                entity[CIFrameworkAnalytics.Constants.ConversationEntity.externalContactId] = conv.externalContactId;
                entity[CIFrameworkAnalytics.Constants.ConversationEntity.externalConversationId] = conv.externalConversationId;
                entity[CIFrameworkAnalytics.Constants.ConversationEntity.externalCorrelationId] = conv.externalCorrelationId;
                entity[CIFrameworkAnalytics.Constants.ConversationEntity.externalProviderId] = conv.externalProviderId;
                entity[CIFrameworkAnalytics.Constants.ConversationEntity.initialQueueName] = conv.initialQueueName;
                entity[CIFrameworkAnalytics.Constants.ConversationEntity.providerId] = conv.providerId;
                entity[CIFrameworkAnalytics.Constants.ConversationEntity.providerName] = conv.providerName;
                entity[CIFrameworkAnalytics.Constants.ConversationEntity.region] = conv.regionData;
                let customDataList = conv.customData;
                if (!isNullOrUndefined(customDataList)) {
                    for (var customData of customDataList) {
                        entity[customData.attribute] = customData.value;
                    }
                }
                return entity;
            }
            Utility.buildConversationEntity = buildConversationEntity;
            /**
             * Given a map, this func returns an equivalent XrmClientApi.WebApi.Entity object for it.
             * @param map Object to build the entity for.
             */
            function buildSessionEntity(data) {
                let session = data.conversation.session;
                let entity = {};
                entity[CIFrameworkAnalytics.Constants.SessionEntity.clientSessionId] = session.clientSessionId;
                entity[CIFrameworkAnalytics.Constants.SessionEntity.clientSessionName] = session.clientSessionName;
                entity[CIFrameworkAnalytics.Constants.SessionEntity.conversationId] = session.conversationId;
                entity[CIFrameworkAnalytics.Constants.SessionEntity.externalCorrelationId] = session.externalCorrelationId;
                entity[CIFrameworkAnalytics.Constants.SessionEntity.queueId] = session.queueId;
                entity[CIFrameworkAnalytics.Constants.SessionEntity.queueName] = session.queueName;
                entity[CIFrameworkAnalytics.Constants.SessionEntity.sessionAdditionalData] = session.sessionAdditionalData;
                entity[CIFrameworkAnalytics.Constants.SessionEntity.sessionAgentAssignedTimestamp] = session.sessionAgentAssignedTimestamp;
                entity[CIFrameworkAnalytics.Constants.SessionEntity.sessionChannel] = session.sessionChannel;
                entity[CIFrameworkAnalytics.Constants.SessionEntity.sessionCreatedTimestamp] = session.sessionCreatedTimestamp;
                entity[CIFrameworkAnalytics.Constants.SessionEntity.sessionCreationReason] = session.sessionCreationReason;
                entity[CIFrameworkAnalytics.Constants.SessionEntity.sessionId] = session.sessionId;
                entity[CIFrameworkAnalytics.Constants.SessionEntity.sessionQueueAssignedTimestamp] = session.sessionQueueAssignedTimestamp;
                let customDataList = data.conversation.customData;
                if (!isNullOrUndefined(customDataList)) {
                    for (var customData of customDataList) {
                        entity[customData.attribute] = customData.value;
                    }
                }
                return entity;
            }
            Utility.buildSessionEntity = buildSessionEntity;
            /**
            * Given a map, this func returns an equivalent XrmClientApi.WebApi.Entity object for it.
            * @param map Object to build the entity for.
            */
            function buildParticipantEntityList(data) {
                let session = data.conversation.session;
                let entities = [];
                for (var participant of session.participants) {
                    let entity = {};
                    entity[CIFrameworkAnalytics.Constants.ParticipantEntity.participantId] = participant.participantId;
                    entity[CIFrameworkAnalytics.Constants.ParticipantEntity.participantName] = participant.participantName;
                    entity[CIFrameworkAnalytics.Constants.ParticipantEntity.participantType] = participant.participantType;
                    entity[CIFrameworkAnalytics.Constants.ParticipantEntity.participantAddedTimestamp] = participant.participantAddedTimestamp;
                    entity[CIFrameworkAnalytics.Constants.ParticipantEntity.participantId] = participant.participantId;
                    entity[CIFrameworkAnalytics.Constants.ParticipantEntity.participantName] = participant.participantName;
                    entity[CIFrameworkAnalytics.Constants.ParticipantEntity.participantType] = participant.participantType;
                    entity[CIFrameworkAnalytics.Constants.ParticipantEntity.participantAddedTimestamp] = participant.participantAddedTimestamp;
                    entity[CIFrameworkAnalytics.Constants.ParticipantEntity.participantId] = participant.participantId;
                    entity[CIFrameworkAnalytics.Constants.ParticipantEntity.participantName] = participant.participantName;
                    entity[CIFrameworkAnalytics.Constants.ParticipantEntity.participantType] = participant.participantType;
                    entity[CIFrameworkAnalytics.Constants.ParticipantEntity.participantAddedTimestamp] = participant.participantAddedTimestamp;
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
            Utility.buildParticipantEntityList = buildParticipantEntityList;
            /**
             * Given a map, this func returns an equivalent XrmClientApi.WebApi.Entity object for it.
             * @param map Object to build the entity for.
             */
            function buildEventsEntity(data) {
                let entities = [];
                let events = data.events;
                for (var event of events) {
                    let entity = {};
                    entity[CIFrameworkAnalytics.Constants.EventEntity.additionalData] = event.additionalData;
                    entity[CIFrameworkAnalytics.Constants.EventEntity.clientSessionId] = data.clientSessionId;
                    entity[CIFrameworkAnalytics.Constants.EventEntity.conversationId] = data.conversationId;
                    entity[CIFrameworkAnalytics.Constants.EventEntity.createdEntityName] = event.entityName;
                    entity[CIFrameworkAnalytics.Constants.EventEntity.createdEntityRecordId] = event.entityRecordId;
                    entity[CIFrameworkAnalytics.Constants.EventEntity.eventTimestamp] = event.eventTimestamp;
                    entity[CIFrameworkAnalytics.Constants.EventEntity.externalCorrelationId] = event.externalCorrelationId;
                    entity[CIFrameworkAnalytics.Constants.EventEntity.knowledgeArticleId] = event.knowledgeArticleId;
                    entity[CIFrameworkAnalytics.Constants.EventEntity.knowledgeArticleName] = event.knowledgeArticleName;
                    entity[CIFrameworkAnalytics.Constants.EventEntity.kpiEventId] = event.kpiEventId;
                    entity[CIFrameworkAnalytics.Constants.EventEntity.kpiEventName] = event.kpiEventName;
                    entity[CIFrameworkAnalytics.Constants.EventEntity.kpiEventReason] = event.kpiEventReason;
                    entity[CIFrameworkAnalytics.Constants.EventEntity.newPresence] = event.newPresence;
                    entity[CIFrameworkAnalytics.Constants.EventEntity.notificationResponseAction] = event.notificationResponseAction;
                    entity[CIFrameworkAnalytics.Constants.EventEntity.oldPresence] = event.oldPresence;
                    entity[CIFrameworkAnalytics.Constants.EventEntity.participantId] = data.eventParticipantId;
                    entity[CIFrameworkAnalytics.Constants.EventEntity.sessionId] = data.sessionId;
                    entity[CIFrameworkAnalytics.Constants.EventEntity.tabAction] = event.tabAction;
                    entity[CIFrameworkAnalytics.Constants.EventEntity.tabId] = event.tabId;
                    entity[CIFrameworkAnalytics.Constants.EventEntity.tabName] = event.tabName;
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
            Utility.buildEventsEntity = buildEventsEntity;
            /**
             * Returns the current UTC Date Time
             * @param map Object to build the entity for.
             */
            function getUTCDateTime() {
                return moment.utc().valueOf().toString();
            }
            Utility.getUTCDateTime = getUTCDateTime;
        })(Utility = CIFrameworkAnalytics.Utility || (CIFrameworkAnalytics.Utility = {}));
    })(CIFrameworkAnalytics = Microsoft.CIFrameworkAnalytics || (Microsoft.CIFrameworkAnalytics = {}));
})(Microsoft || (Microsoft = {}));
//# sourceMappingURL=msdyn_CIFAnalytics_internal_library.js.map