/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var Microsoft;
(function (Microsoft) {
    var CIFrameworkAnalytics;
    (function (CIFrameworkAnalytics) {
        var EventType;
        (function (EventType) {
            EventType[EventType["SystemEvent"] = 0] = "SystemEvent";
            EventType[EventType["CustomEvent"] = 1] = "CustomEvent";
        })(EventType = CIFrameworkAnalytics.EventType || (CIFrameworkAnalytics.EventType = {}));
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
        var InternalEventName;
        (function (InternalEventName) {
            InternalEventName[InternalEventName["NotificationReceived"] = 0] = "NotificationReceived";
            InternalEventName[InternalEventName["NotificationAccepted"] = 1] = "NotificationAccepted";
            InternalEventName[InternalEventName["NotificationRejected"] = 2] = "NotificationRejected";
            InternalEventName[InternalEventName["NotificationTimedOut"] = 3] = "NotificationTimedOut";
            InternalEventName[InternalEventName["SessionStarted"] = 4] = "SessionStarted";
            InternalEventName[InternalEventName["SessionSwitched"] = 5] = "SessionSwitched";
            InternalEventName[InternalEventName["SessionClosed"] = 6] = "SessionClosed";
            InternalEventName[InternalEventName["NewTabOpened"] = 7] = "NewTabOpened";
            InternalEventName[InternalEventName["TabClosed"] = 8] = "TabClosed";
            InternalEventName[InternalEventName["TabSwitched"] = 9] = "TabSwitched";
            InternalEventName[InternalEventName["CustomEvent"] = 10] = "CustomEvent";
        })(InternalEventName = CIFrameworkAnalytics.InternalEventName || (CIFrameworkAnalytics.InternalEventName = {}));
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
        class EventsEntity {
        }
        CIFrameworkAnalytics.EventsEntity = EventsEntity;
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
            MessageType.EventName = "logCIFAnalytics";
            Constants.MessageType = MessageType;
            class Entity {
            }
            Entity.conversationEntityName = "ConversationData";
            Entity.sessionEntityName = "SessionData";
            Entity.participantEntityName = "ParticipantData";
            Entity.eventEntityName = "BaseEvents";
            // Attribute names of analytics Entities
            Entity.conversationId = "conversationId";
            Entity.channel = "channel";
            Entity.region = "region";
            Entity.createdts = "createdts";
            Entity.sessionid = "sessionid";
            Entity.sessionname = "sessionname";
            Entity.participantid = "participantid";
            Entity.participantname = "participantname";
            Entity.participanttype = "participanttype";
            Entity.addedtimestamp = "addedtimestamp";
            Entity.additionalData = "event.additionalData";
            Entity.customData = "event.customData";
            Entity.entityName = "event.entityName";
            Entity.entityRecordId = "event.entityRecordId";
            Entity.kpiEventReason = "event.kpiEventReason";
            Entity.eventTimestamp = "event.eventTimestamp";
            Entity.externalCorrelationId = "event.externalCorrelationId";
            Entity.knowledgeArticleId = "event.knowledgeArticleId";
            Entity.knowledgeArticleName = "event.knowledgeArticleName";
            Entity.kpiEventName = "event.kpiEventName";
            Entity.newPresence = "event.newPresence";
            Entity.oldPresence = "event.oldPresence";
            Entity.tabId = "event.tabId";
            Entity.tabName = "event.tabName";
            Constants.Entity = Entity;
            class EventData {
            }
            EventData.analyticsData = "analyticsData";
            Constants.EventData = EventData;
        })(Constants = CIFrameworkAnalytics.Constants || (CIFrameworkAnalytics.Constants = {}));
    })(CIFrameworkAnalytics = Microsoft.CIFrameworkAnalytics || (Microsoft.CIFrameworkAnalytics = {}));
})(Microsoft || (Microsoft = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="./Constants.ts" />
/// <reference path="./AnalyticsDataModel.ts" />
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
var Microsoft;
(function (Microsoft) {
    var CIFrameworkAnalytics;
    (function (CIFrameworkAnalytics) {
        let conversationUCSessionMap = new Map();
        let analyticsDataMap = new Map();
        let analyticsEventMap = new Map();
        /** @internal
         * Initialize method that is called on load of the script
         */
        function initialize() {
            window.addEventListener(CIFrameworkAnalytics.Constants.MessageType.EventName, analyticsEventListener);
            loadAnalyticsEventMap();
        }
        /** @internal
         * Handler for the logCIFAnalytics that is raised from CIF Internal Library
         */
        function analyticsEventListener(event) {
            var payload = event.detail.get(CIFrameworkAnalytics.Constants.EventData.analyticsData);
            if (CIFrameworkAnalytics.Utility.isNullOrUndefined(payload)) {
                let logData = CIFrameworkAnalytics.Utility.validateAnalyticsPayload(payload);
                if (CIFrameworkAnalytics.Utility.isNullOrUndefined(logData)) {
                    if (payload instanceof CIFrameworkAnalytics.InitData) {
                        logAnalyticsInitData(payload);
                    }
                    else if (payload instanceof CIFrameworkAnalytics.EventData) {
                        logEventData(payload);
                    }
                }
            }
        }
        /** @internal
         * Function to log the analytics init data
         */
        function logAnalyticsInitData(payload) {
            // update the conversation id to data map
            let conversationId = payload.conversation.conversationId;
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
            Xrm.WebApi.createRecord(CIFrameworkAnalytics.Constants.Entity.conversationEntityName, CIFrameworkAnalytics.Utility.buildConversationEntity(payload)).then(function success(result) {
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
            Xrm.WebApi.createRecord(CIFrameworkAnalytics.Constants.Entity.sessionEntityName, CIFrameworkAnalytics.Utility.buildSessionEntity(payload)).then(function success(result) {
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
                Xrm.WebApi.createRecord(CIFrameworkAnalytics.Constants.Entity.participantEntityName, record).then(function success(result) {
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
                Xrm.WebApi.createRecord(CIFrameworkAnalytics.Constants.Entity.eventEntityName, record).then(function success(result) {
                    console.log("KPI Event Data record created with ID: " + result.id);
                }, function (error) {
                    console.log(error.message);
                });
            });
        }
        /** @internal
        * Function to log the KPI Event Definitions data
        */
        function loadAnalyticsEventMap() {
            return new Promise(function (resolve, reject) {
                if (analyticsEventMap.size > 0) {
                    return resolve(true);
                }
                Xrm.WebApi.retrieveMultipleRecords("new_kpieventdefinitions", "?$select=new_name,new_kpieventid&$filter=(new_active eq \"yes\")").then(function (result) {
                    result.entities.forEach(function (value, index, array) {
                        analyticsEventMap.set(value["new_name"], value["new_kpieventid"]);
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
            var webresourceName = "Localization/CIF_webresource_strings";
            function getResourceString(key) {
                var value = key;
                if (Xrm && Xrm.Utility && Xrm.Utility.getResourceString) {
                    value = Xrm.Utility.getResourceString(webresourceName, key);
                    if (value === undefined || value === null) {
                        value = key;
                    }
                }
                return value;
            }
            Utility.getResourceString = getResourceString;
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
            function validateAnalyticsPayload(payload) {
                if ((payload instanceof CIFrameworkAnalytics.InitData && !isNullOrUndefined(payload.conversation.conversationId) && !isNullOrUndefined(payload.conversation.session.sessionId)) ||
                    (payload instanceof CIFrameworkAnalytics.EventData && !isNullOrUndefined(payload.conversationId) && !isNullOrUndefined(payload.sessionId) && !isNullOrUndefined(payload.clientSessionId)))
                    return Promise.resolve(true);
                else
                    return Promise.resolve(false);
            }
            Utility.validateAnalyticsPayload = validateAnalyticsPayload;
            /**
             * Given a map, this func returns an equivalent XrmClientApi.WebApi.Entity object for it.
             * @param map Object to build the entity for.
             */
            function buildConversationEntity(data) {
                let entity = {};
                entity[CIFrameworkAnalytics.Constants.Entity.conversationId] = data.conversation.conversationId;
                entity[CIFrameworkAnalytics.Constants.Entity.conversationId] = data.conversation.channel;
                entity[CIFrameworkAnalytics.Constants.Entity.conversationId] = data.conversation.regionData;
                entity[CIFrameworkAnalytics.Constants.Entity.conversationId] = data.conversation.conversationTimestamp;
                let customDataList = data.conversation.customData;
                for (var customData of customDataList) {
                    entity[customData.attribute] = customData.value;
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
                entity[CIFrameworkAnalytics.Constants.Entity.sessionid] = session.sessionId;
                entity[CIFrameworkAnalytics.Constants.Entity.sessionname] = session.sessionName;
                entity[CIFrameworkAnalytics.Constants.Entity.createdts] = session.sessionCreatedTimestamp;
                let customDataList = data.conversation.customData;
                for (var customData of customDataList) {
                    entity[customData.attribute] = customData.value;
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
                    entity[CIFrameworkAnalytics.Constants.Entity.sessionid] = participant.participantId;
                    entity[CIFrameworkAnalytics.Constants.Entity.sessionname] = participant.participantName;
                    entity[CIFrameworkAnalytics.Constants.Entity.createdts] = participant.participantType;
                    entity[CIFrameworkAnalytics.Constants.Entity.createdts] = participant.participantAddedTimestamp;
                    let customDataList = data.conversation.customData;
                    for (var customData of customDataList) {
                        entity[customData.attribute] = customData.value;
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
                    entity[CIFrameworkAnalytics.Constants.Entity.conversationId] = data.conversationId;
                    entity[CIFrameworkAnalytics.Constants.Entity.sessionid] = data.sessionId;
                    entity[CIFrameworkAnalytics.Constants.Entity.additionalData] = event.additionalData;
                    entity[CIFrameworkAnalytics.Constants.Entity.entityName] = event.entityName;
                    entity[CIFrameworkAnalytics.Constants.Entity.entityRecordId] = event.entityRecordId;
                    entity[CIFrameworkAnalytics.Constants.Entity.kpiEventReason] = event.kpiEventReason;
                    entity[CIFrameworkAnalytics.Constants.Entity.eventTimestamp] = event.eventTimestamp;
                    entity[CIFrameworkAnalytics.Constants.Entity.externalCorrelationId] = event.externalCorrelationId;
                    entity[CIFrameworkAnalytics.Constants.Entity.knowledgeArticleId] = event.knowledgeArticleId;
                    entity[CIFrameworkAnalytics.Constants.Entity.knowledgeArticleName] = event.knowledgeArticleName;
                    entity[CIFrameworkAnalytics.Constants.Entity.kpiEventName] = event.kpiEventName;
                    entity[CIFrameworkAnalytics.Constants.Entity.newPresence] = event.newPresence;
                    entity[CIFrameworkAnalytics.Constants.Entity.oldPresence] = event.oldPresence;
                    entity[CIFrameworkAnalytics.Constants.Entity.tabId] = event.tabId;
                    entity[CIFrameworkAnalytics.Constants.Entity.tabName] = event.tabName;
                    let customDataList = event.customData;
                    for (var customData of customDataList) {
                        entity[customData.attribute] = customData.value;
                    }
                    entities.push(entity);
                }
                return entities;
            }
            Utility.buildEventsEntity = buildEventsEntity;
            function extractParameter(queryString, parameterName) {
                var params = {};
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
            Utility.extractParameter = extractParameter;
            function extractSearchText(queryString) {
                var emptyString = "";
                if (queryString) {
                    let query = queryString.split("=");
                    return (query[1] != null && query[1] != "") ? query[1] : emptyString;
                }
                return emptyString;
            }
            Utility.extractSearchText = extractSearchText;
            function splitQueryForSearch(queryString) {
                var splitQuery = [];
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
            Utility.splitQueryForSearch = splitQueryForSearch;
        })(Utility = CIFrameworkAnalytics.Utility || (CIFrameworkAnalytics.Utility = {}));
    })(CIFrameworkAnalytics = Microsoft.CIFrameworkAnalytics || (Microsoft.CIFrameworkAnalytics = {}));
})(Microsoft || (Microsoft = {}));
//# sourceMappingURL=msdyn_CIFAnalytics_internal_library.js.map