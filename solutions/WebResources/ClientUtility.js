var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var AddItemCampaignActivityRequest = (function () {
        function AddItemCampaignActivityRequest(campaignActivity /*Microsoft.Dynamics.CRM.campaignactivity*/, item /*Microsoft.Dynamics.CRM.crmbaseentity*/) {
            this.CampaignActivity = campaignActivity;
            this.Item = item;
        }
        AddItemCampaignActivityRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "CampaignActivity": {
                        "typeName": "Microsoft.Dynamics.CRM.campaignactivity",
                        "structuralProperty": 5,
                    },
                    "Item": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5,
                    },
                },
                operationName: "AddItemCampaignActivity",
                operationType: 0,
            };
            return metadata;
        };
        return AddItemCampaignActivityRequest;
    }());
    ODataContract.AddItemCampaignActivityRequest = AddItemCampaignActivityRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var AddItemCampaignRequest = (function () {
        function AddItemCampaignRequest(entity /*Microsoft.Dynamics.CRM.campaign*/, campaign /*Microsoft.Dynamics.CRM.campaign*/) {
            this.entity = entity;
            this.Campaign = campaign;
        }
        AddItemCampaignRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.campaign",
                        "structuralProperty": 5,
                    },
                    "Campaign": {
                        "typeName": "Microsoft.Dynamics.CRM.campaign",
                        "structuralProperty": 5,
                    },
                },
                operationName: "AddItemCampaign",
                operationType: 0,
            };
            return metadata;
        };
        return AddItemCampaignRequest;
    }());
    ODataContract.AddItemCampaignRequest = AddItemCampaignRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var AddToQueueRequest = (function () {
        function AddToQueueRequest(entity /*Microsoft.Dynamics.CRM.queue*/, target /*Microsoft.Dynamics.CRM.crmbaseentity*/, sourceQueue /*Microsoft.Dynamics.CRM.queue*/, queueItemProperties /*Microsoft.Dynamics.CRM.queueitem*/) {
            this.entity = entity;
            this.Target = target;
            this.SourceQueue = sourceQueue;
            this.QueueItemProperties = queueItemProperties;
        }
        AddToQueueRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.queue",
                        "structuralProperty": 5,
                    },
                    "Target": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5,
                    },
                    "SourceQueue": {
                        "typeName": "Microsoft.Dynamics.CRM.queue",
                        "structuralProperty": 5,
                    },
                    "QueueItemProperties": {
                        "typeName": "Microsoft.Dynamics.CRM.queueitem",
                        "structuralProperty": 5,
                    },
                },
                operationName: "AddToQueue",
                operationType: 0,
            };
            return metadata;
        };
        return AddToQueueRequest;
    }());
    ODataContract.AddToQueueRequest = AddToQueueRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var AssignRequest = (function () {
        function AssignRequest(ownerSetType, ownerId, recordTypeName, id) {
            ownerId = "(" + ownerId.replace("{", "").replace("}", "") + ")";
            this.id = id.replace("{", "").replace("}", "");
            this.etn = recordTypeName;
            this.payload = {
                "@odata.type": "#Microsoft.Dynamics.CRM." + recordTypeName,
                "ownerid@odata.bind": "/" + ownerSetType + ownerId
            };
        }
        AssignRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: undefined,
                parameterTypes: {},
                operationName: "Update",
                operationType: 2 /* CRUD */
            };
            return metadata;
        };
        return AssignRequest;
    }());
    ODataContract.AssignRequest = AssignRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var ConvertActivityRequest = (function () {
        function ConvertActivityRequest(activityId, activityEntityName, targetEntity /*Microsoft.Dynamics.CRM.crmbaseentity*/, targetEntityName, createCampaignResponse) {
            this.ActivityId = activityId;
            this.ActivityEntityName = activityEntityName;
            this.TargetEntity = targetEntity;
            this.TargetEntityName = targetEntityName;
            this.CreateCampaignResponse = createCampaignResponse;
        }
        ConvertActivityRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "ActivityId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1,
                    },
                    "ActivityEntityName": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "TargetEntity": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5,
                    },
                    "TargetEntityName": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "CreateCampaignResponse": {
                        "typeName": "Edm.Boolean",
                        "structuralProperty": 1,
                    },
                },
                operationName: "ConvertActivity",
                operationType: 0,
            };
            return metadata;
        };
        return ConvertActivityRequest;
    }());
    ODataContract.ConvertActivityRequest = ConvertActivityRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var CopyCampaignRequest = (function () {
        function CopyCampaignRequest(entity /*Microsoft.Dynamics.CRM.campaign*/, saveAsTemplate) {
            this.entity = entity;
            this.SaveAsTemplate = saveAsTemplate;
        }
        CopyCampaignRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.campaign",
                        "structuralProperty": 5 /* EntityType */,
                    },
                    "SaveAsTemplate": {
                        "typeName": "Edm.Boolean",
                        "structuralProperty": 1 /* PrimitiveType */,
                    },
                },
                operationName: "CopyCampaign",
                operationType: 0 /* Action */,
            };
            return metadata;
        };
        return CopyCampaignRequest;
    }());
    ODataContract.CopyCampaignRequest = CopyCampaignRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var CopyCampaignResponseRequest = (function () {
        function CopyCampaignResponseRequest(entity /*Microsoft.Dynamics.CRM.campaignresponse*/) {
            this.entity = entity;
        }
        CopyCampaignResponseRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.campaignresponse",
                        "structuralProperty": 5,
                    },
                },
                operationName: "CopyCampaignResponse",
                operationType: 0,
            };
            return metadata;
        };
        return CopyCampaignResponseRequest;
    }());
    ODataContract.CopyCampaignResponseRequest = CopyCampaignResponseRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var CopyDynamicListToStaticRequest = (function () {
        function CopyDynamicListToStaticRequest(entity /*Microsoft.Dynamics.CRM.list*/) {
            this.entity = entity;
        }
        CopyDynamicListToStaticRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.list",
                        "structuralProperty": 5,
                    },
                },
                operationName: "CopyDynamicListToStatic",
                operationType: 0,
            };
            return metadata;
        };
        return CopyDynamicListToStaticRequest;
    }());
    ODataContract.CopyDynamicListToStaticRequest = CopyDynamicListToStaticRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    var AccessRights;
    (function (AccessRights) {
        AccessRights[AccessRights["None"] = 0] = "None";
        AccessRights[AccessRights["ReadAccess"] = 1] = "ReadAccess";
        AccessRights[AccessRights["WriteAccess"] = 2] = "WriteAccess";
        AccessRights[AccessRights["AppendAccess"] = 4] = "AppendAccess";
        AccessRights[AccessRights["AppendToAccess"] = 16] = "AppendToAccess";
        AccessRights[AccessRights["CreateAccess"] = 32] = "CreateAccess";
        AccessRights[AccessRights["DeleteAccess"] = 65536] = "DeleteAccess";
        AccessRights[AccessRights["ShareAccess"] = 262144] = "ShareAccess";
        AccessRights[AccessRights["AssignAccess"] = 524288] = "AssignAccess";
    })(AccessRights = ODataContract.AccessRights || (ODataContract.AccessRights = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var AssociatedMenuBehavior;
    (function (AssociatedMenuBehavior) {
        AssociatedMenuBehavior[AssociatedMenuBehavior["UseCollectionName"] = 0] = "UseCollectionName";
        AssociatedMenuBehavior[AssociatedMenuBehavior["UseLabel"] = 1] = "UseLabel";
        AssociatedMenuBehavior[AssociatedMenuBehavior["DoNotDisplay"] = 2] = "DoNotDisplay";
    })(AssociatedMenuBehavior = ODataContract.AssociatedMenuBehavior || (ODataContract.AssociatedMenuBehavior = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var AssociatedMenuGroup;
    (function (AssociatedMenuGroup) {
        AssociatedMenuGroup[AssociatedMenuGroup["Details"] = 0] = "Details";
        AssociatedMenuGroup[AssociatedMenuGroup["Sales"] = 1] = "Sales";
        AssociatedMenuGroup[AssociatedMenuGroup["Service"] = 2] = "Service";
        AssociatedMenuGroup[AssociatedMenuGroup["Marketing"] = 3] = "Marketing";
    })(AssociatedMenuGroup = ODataContract.AssociatedMenuGroup || (ODataContract.AssociatedMenuGroup = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var AttributeRequiredLevel;
    (function (AttributeRequiredLevel) {
        AttributeRequiredLevel[AttributeRequiredLevel["None"] = 0] = "None";
        AttributeRequiredLevel[AttributeRequiredLevel["SystemRequired"] = 1] = "SystemRequired";
        AttributeRequiredLevel[AttributeRequiredLevel["ApplicationRequired"] = 2] = "ApplicationRequired";
        AttributeRequiredLevel[AttributeRequiredLevel["Recommended"] = 3] = "Recommended";
    })(AttributeRequiredLevel = ODataContract.AttributeRequiredLevel || (ODataContract.AttributeRequiredLevel = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var AttributeTypeCode;
    (function (AttributeTypeCode) {
        AttributeTypeCode[AttributeTypeCode["Boolean"] = 0] = "Boolean";
        AttributeTypeCode[AttributeTypeCode["Customer"] = 1] = "Customer";
        AttributeTypeCode[AttributeTypeCode["DateTime"] = 2] = "DateTime";
        AttributeTypeCode[AttributeTypeCode["Decimal"] = 3] = "Decimal";
        AttributeTypeCode[AttributeTypeCode["Double"] = 4] = "Double";
        AttributeTypeCode[AttributeTypeCode["Integer"] = 5] = "Integer";
        AttributeTypeCode[AttributeTypeCode["Lookup"] = 6] = "Lookup";
        AttributeTypeCode[AttributeTypeCode["Memo"] = 7] = "Memo";
        AttributeTypeCode[AttributeTypeCode["Money"] = 8] = "Money";
        AttributeTypeCode[AttributeTypeCode["Owner"] = 9] = "Owner";
        AttributeTypeCode[AttributeTypeCode["PartyList"] = 10] = "PartyList";
        AttributeTypeCode[AttributeTypeCode["Picklist"] = 11] = "Picklist";
        AttributeTypeCode[AttributeTypeCode["State"] = 12] = "State";
        AttributeTypeCode[AttributeTypeCode["Status"] = 13] = "Status";
        AttributeTypeCode[AttributeTypeCode["String"] = 14] = "String";
        AttributeTypeCode[AttributeTypeCode["Uniqueidentifier"] = 15] = "Uniqueidentifier";
        AttributeTypeCode[AttributeTypeCode["CalendarRules"] = 16] = "CalendarRules";
        AttributeTypeCode[AttributeTypeCode["Virtual"] = 17] = "Virtual";
        AttributeTypeCode[AttributeTypeCode["BigInt"] = 18] = "BigInt";
        AttributeTypeCode[AttributeTypeCode["ManagedProperty"] = 19] = "ManagedProperty";
        AttributeTypeCode[AttributeTypeCode["EntityName"] = 20] = "EntityName";
    })(AttributeTypeCode = ODataContract.AttributeTypeCode || (ODataContract.AttributeTypeCode = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var BusinessNotificationParameterType;
    (function (BusinessNotificationParameterType) {
        BusinessNotificationParameterType[BusinessNotificationParameterType["None"] = 0] = "None";
        BusinessNotificationParameterType[BusinessNotificationParameterType["String"] = 1] = "String";
        BusinessNotificationParameterType[BusinessNotificationParameterType["Attribute"] = 2] = "Attribute";
    })(BusinessNotificationParameterType = ODataContract.BusinessNotificationParameterType || (ODataContract.BusinessNotificationParameterType = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var BusinessNotificationSeverity;
    (function (BusinessNotificationSeverity) {
        BusinessNotificationSeverity[BusinessNotificationSeverity["None"] = 0] = "None";
        BusinessNotificationSeverity[BusinessNotificationSeverity["Error"] = 1] = "Error";
        BusinessNotificationSeverity[BusinessNotificationSeverity["Warning"] = 2] = "Warning";
        BusinessNotificationSeverity[BusinessNotificationSeverity["Information"] = 3] = "Information";
        BusinessNotificationSeverity[BusinessNotificationSeverity["UserDefined"] = 4] = "UserDefined";
    })(BusinessNotificationSeverity = ODataContract.BusinessNotificationSeverity || (ODataContract.BusinessNotificationSeverity = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var CascadeType;
    (function (CascadeType) {
        CascadeType[CascadeType["NoCascade"] = 0] = "NoCascade";
        CascadeType[CascadeType["Cascade"] = 1] = "Cascade";
        CascadeType[CascadeType["Active"] = 2] = "Active";
        CascadeType[CascadeType["UserOwned"] = 3] = "UserOwned";
        CascadeType[CascadeType["RemoveLink"] = 4] = "RemoveLink";
        CascadeType[CascadeType["Restrict"] = 5] = "Restrict";
    })(CascadeType = ODataContract.CascadeType || (ODataContract.CascadeType = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var ChannelAccessProfilePrivilegeDepth;
    (function (ChannelAccessProfilePrivilegeDepth) {
        ChannelAccessProfilePrivilegeDepth[ChannelAccessProfilePrivilegeDepth["None"] = 0] = "None";
        ChannelAccessProfilePrivilegeDepth[ChannelAccessProfilePrivilegeDepth["EntityReference"] = 1] = "EntityReference";
        ChannelAccessProfilePrivilegeDepth[ChannelAccessProfilePrivilegeDepth["ParentEntityReference"] = 2] = "ParentEntityReference";
        ChannelAccessProfilePrivilegeDepth[ChannelAccessProfilePrivilegeDepth["Global"] = 8] = "Global";
    })(ChannelAccessProfilePrivilegeDepth = ODataContract.ChannelAccessProfilePrivilegeDepth || (ODataContract.ChannelAccessProfilePrivilegeDepth = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var ConditionOperator;
    (function (ConditionOperator) {
        ConditionOperator[ConditionOperator["Equal"] = 0] = "Equal";
        ConditionOperator[ConditionOperator["NotEqual"] = 1] = "NotEqual";
        ConditionOperator[ConditionOperator["GreaterThan"] = 2] = "GreaterThan";
        ConditionOperator[ConditionOperator["LessThan"] = 3] = "LessThan";
        ConditionOperator[ConditionOperator["GreaterEqual"] = 4] = "GreaterEqual";
        ConditionOperator[ConditionOperator["LessEqual"] = 5] = "LessEqual";
        ConditionOperator[ConditionOperator["Like"] = 6] = "Like";
        ConditionOperator[ConditionOperator["NotLike"] = 7] = "NotLike";
        ConditionOperator[ConditionOperator["In"] = 8] = "In";
        ConditionOperator[ConditionOperator["NotIn"] = 9] = "NotIn";
        ConditionOperator[ConditionOperator["Between"] = 10] = "Between";
        ConditionOperator[ConditionOperator["NotBetween"] = 11] = "NotBetween";
        ConditionOperator[ConditionOperator["Null"] = 12] = "Null";
        ConditionOperator[ConditionOperator["NotNull"] = 13] = "NotNull";
        ConditionOperator[ConditionOperator["Yesterday"] = 14] = "Yesterday";
        ConditionOperator[ConditionOperator["Today"] = 15] = "Today";
        ConditionOperator[ConditionOperator["Tomorrow"] = 16] = "Tomorrow";
        ConditionOperator[ConditionOperator["Last7Days"] = 17] = "Last7Days";
        ConditionOperator[ConditionOperator["Next7Days"] = 18] = "Next7Days";
        ConditionOperator[ConditionOperator["LastWeek"] = 19] = "LastWeek";
        ConditionOperator[ConditionOperator["ThisWeek"] = 20] = "ThisWeek";
        ConditionOperator[ConditionOperator["NextWeek"] = 21] = "NextWeek";
        ConditionOperator[ConditionOperator["LastMonth"] = 22] = "LastMonth";
        ConditionOperator[ConditionOperator["ThisMonth"] = 23] = "ThisMonth";
        ConditionOperator[ConditionOperator["NextMonth"] = 24] = "NextMonth";
        ConditionOperator[ConditionOperator["On"] = 25] = "On";
        ConditionOperator[ConditionOperator["OnOrBefore"] = 26] = "OnOrBefore";
        ConditionOperator[ConditionOperator["OnOrAfter"] = 27] = "OnOrAfter";
        ConditionOperator[ConditionOperator["LastYear"] = 28] = "LastYear";
        ConditionOperator[ConditionOperator["ThisYear"] = 29] = "ThisYear";
        ConditionOperator[ConditionOperator["NextYear"] = 30] = "NextYear";
        ConditionOperator[ConditionOperator["LastXHours"] = 31] = "LastXHours";
        ConditionOperator[ConditionOperator["NextXHours"] = 32] = "NextXHours";
        ConditionOperator[ConditionOperator["LastXDays"] = 33] = "LastXDays";
        ConditionOperator[ConditionOperator["NextXDays"] = 34] = "NextXDays";
        ConditionOperator[ConditionOperator["LastXWeeks"] = 35] = "LastXWeeks";
        ConditionOperator[ConditionOperator["NextXWeeks"] = 36] = "NextXWeeks";
        ConditionOperator[ConditionOperator["LastXMonths"] = 37] = "LastXMonths";
        ConditionOperator[ConditionOperator["NextXMonths"] = 38] = "NextXMonths";
        ConditionOperator[ConditionOperator["LastXYears"] = 39] = "LastXYears";
        ConditionOperator[ConditionOperator["NextXYears"] = 40] = "NextXYears";
        ConditionOperator[ConditionOperator["EqualUserId"] = 41] = "EqualUserId";
        ConditionOperator[ConditionOperator["NotEqualUserId"] = 42] = "NotEqualUserId";
        ConditionOperator[ConditionOperator["EqualBusinessId"] = 43] = "EqualBusinessId";
        ConditionOperator[ConditionOperator["NotEqualBusinessId"] = 44] = "NotEqualBusinessId";
        ConditionOperator[ConditionOperator["ChildOf"] = 45] = "ChildOf";
        ConditionOperator[ConditionOperator["Mask"] = 46] = "Mask";
        ConditionOperator[ConditionOperator["NotMask"] = 47] = "NotMask";
        ConditionOperator[ConditionOperator["MasksSelect"] = 48] = "MasksSelect";
        ConditionOperator[ConditionOperator["Contains"] = 49] = "Contains";
        ConditionOperator[ConditionOperator["DoesNotContain"] = 50] = "DoesNotContain";
        ConditionOperator[ConditionOperator["EqualUserLanguage"] = 51] = "EqualUserLanguage";
        ConditionOperator[ConditionOperator["NotOn"] = 52] = "NotOn";
        ConditionOperator[ConditionOperator["OlderThanXMonths"] = 53] = "OlderThanXMonths";
        ConditionOperator[ConditionOperator["BeginsWith"] = 54] = "BeginsWith";
        ConditionOperator[ConditionOperator["DoesNotBeginWith"] = 55] = "DoesNotBeginWith";
        ConditionOperator[ConditionOperator["EndsWith"] = 56] = "EndsWith";
        ConditionOperator[ConditionOperator["DoesNotEndWith"] = 57] = "DoesNotEndWith";
        ConditionOperator[ConditionOperator["ThisFiscalYear"] = 58] = "ThisFiscalYear";
        ConditionOperator[ConditionOperator["ThisFiscalPeriod"] = 59] = "ThisFiscalPeriod";
        ConditionOperator[ConditionOperator["NextFiscalYear"] = 60] = "NextFiscalYear";
        ConditionOperator[ConditionOperator["NextFiscalPeriod"] = 61] = "NextFiscalPeriod";
        ConditionOperator[ConditionOperator["LastFiscalYear"] = 62] = "LastFiscalYear";
        ConditionOperator[ConditionOperator["LastFiscalPeriod"] = 63] = "LastFiscalPeriod";
        ConditionOperator[ConditionOperator["LastXFiscalYears"] = 64] = "LastXFiscalYears";
        ConditionOperator[ConditionOperator["LastXFiscalPeriods"] = 65] = "LastXFiscalPeriods";
        ConditionOperator[ConditionOperator["NextXFiscalYears"] = 66] = "NextXFiscalYears";
        ConditionOperator[ConditionOperator["NextXFiscalPeriods"] = 67] = "NextXFiscalPeriods";
        ConditionOperator[ConditionOperator["InFiscalYear"] = 68] = "InFiscalYear";
        ConditionOperator[ConditionOperator["InFiscalPeriod"] = 69] = "InFiscalPeriod";
        ConditionOperator[ConditionOperator["InFiscalPeriodAndYear"] = 70] = "InFiscalPeriodAndYear";
        ConditionOperator[ConditionOperator["InOrBeforeFiscalPeriodAndYear"] = 71] = "InOrBeforeFiscalPeriodAndYear";
        ConditionOperator[ConditionOperator["InOrAfterFiscalPeriodAndYear"] = 72] = "InOrAfterFiscalPeriodAndYear";
        ConditionOperator[ConditionOperator["EqualUserTeams"] = 73] = "EqualUserTeams";
        ConditionOperator[ConditionOperator["EqualUserOrUserTeams"] = 74] = "EqualUserOrUserTeams";
        ConditionOperator[ConditionOperator["Under"] = 75] = "Under";
        ConditionOperator[ConditionOperator["NotUnder"] = 76] = "NotUnder";
        ConditionOperator[ConditionOperator["UnderOrEqual"] = 77] = "UnderOrEqual";
        ConditionOperator[ConditionOperator["Above"] = 78] = "Above";
        ConditionOperator[ConditionOperator["AboveOrEqual"] = 79] = "AboveOrEqual";
        ConditionOperator[ConditionOperator["EqualUserOrUserHierarchy"] = 80] = "EqualUserOrUserHierarchy";
        ConditionOperator[ConditionOperator["EqualUserOrUserHierarchyAndTeams"] = 81] = "EqualUserOrUserHierarchyAndTeams";
        ConditionOperator[ConditionOperator["OlderThanXYears"] = 82] = "OlderThanXYears";
        ConditionOperator[ConditionOperator["OlderThanXWeeks"] = 83] = "OlderThanXWeeks";
        ConditionOperator[ConditionOperator["OlderThanXDays"] = 84] = "OlderThanXDays";
        ConditionOperator[ConditionOperator["OlderThanXHours"] = 85] = "OlderThanXHours";
        ConditionOperator[ConditionOperator["OlderThanXMinutes"] = 86] = "OlderThanXMinutes";
    })(ConditionOperator = ODataContract.ConditionOperator || (ODataContract.ConditionOperator = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var DateTimeFormat;
    (function (DateTimeFormat) {
        DateTimeFormat[DateTimeFormat["DateOnly"] = 0] = "DateOnly";
        DateTimeFormat[DateTimeFormat["DateAndTime"] = 1] = "DateAndTime";
    })(DateTimeFormat = ODataContract.DateTimeFormat || (ODataContract.DateTimeFormat = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var DependencyDepth;
    (function (DependencyDepth) {
        DependencyDepth[DependencyDepth["Unknown"] = 0] = "Unknown";
        DependencyDepth[DependencyDepth["OnDemandWithContext"] = 1] = "OnDemandWithContext";
        DependencyDepth[DependencyDepth["OnDemandWithoutContext"] = 2] = "OnDemandWithoutContext";
        DependencyDepth[DependencyDepth["OnDemandContextOnly"] = 3] = "OnDemandContextOnly";
        DependencyDepth[DependencyDepth["Offline"] = 4] = "Offline";
        DependencyDepth[DependencyDepth["Mobile"] = 5] = "Mobile";
    })(DependencyDepth = ODataContract.DependencyDepth || (ODataContract.DependencyDepth = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var EndpointAccessType;
    (function (EndpointAccessType) {
        EndpointAccessType[EndpointAccessType["Default"] = 0] = "Default";
        EndpointAccessType[EndpointAccessType["Internet"] = 1] = "Internet";
        EndpointAccessType[EndpointAccessType["Intranet"] = 2] = "Intranet";
    })(EndpointAccessType = ODataContract.EndpointAccessType || (ODataContract.EndpointAccessType = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var EndpointType;
    (function (EndpointType) {
        EndpointType[EndpointType["OrganizationService"] = 0] = "OrganizationService";
        EndpointType[EndpointType["OrganizationDataService"] = 1] = "OrganizationDataService";
        EndpointType[EndpointType["WebApplication"] = 2] = "WebApplication";
    })(EndpointType = ODataContract.EndpointType || (ODataContract.EndpointType = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var EntityFilters;
    (function (EntityFilters) {
        EntityFilters[EntityFilters["Entity"] = 1] = "Entity";
        EntityFilters[EntityFilters["Attributes"] = 2] = "Attributes";
        EntityFilters[EntityFilters["Privileges"] = 4] = "Privileges";
        EntityFilters[EntityFilters["Relationships"] = 8] = "Relationships";
        EntityFilters[EntityFilters["All"] = 15] = "All";
    })(EntityFilters = ODataContract.EntityFilters || (ODataContract.EntityFilters = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var EntityKeyIndexStatus;
    (function (EntityKeyIndexStatus) {
        EntityKeyIndexStatus[EntityKeyIndexStatus["Pending"] = 0] = "Pending";
        EntityKeyIndexStatus[EntityKeyIndexStatus["InProgress"] = 1] = "InProgress";
        EntityKeyIndexStatus[EntityKeyIndexStatus["Active"] = 2] = "Active";
        EntityKeyIndexStatus[EntityKeyIndexStatus["Failed"] = 3] = "Failed";
    })(EntityKeyIndexStatus = ODataContract.EntityKeyIndexStatus || (ODataContract.EntityKeyIndexStatus = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var ErrorType;
    (function (ErrorType) {
        ErrorType[ErrorType["Error"] = 1] = "Error";
        ErrorType[ErrorType["Warning"] = 2] = "Warning";
    })(ErrorType = ODataContract.ErrorType || (ODataContract.ErrorType = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var ImeMode;
    (function (ImeMode) {
        ImeMode[ImeMode["Auto"] = 0] = "Auto";
        ImeMode[ImeMode["Inactive"] = 1] = "Inactive";
        ImeMode[ImeMode["Active"] = 2] = "Active";
        ImeMode[ImeMode["Disabled"] = 3] = "Disabled";
    })(ImeMode = ODataContract.ImeMode || (ODataContract.ImeMode = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var IntegerFormat;
    (function (IntegerFormat) {
        IntegerFormat[IntegerFormat["None"] = 0] = "None";
        IntegerFormat[IntegerFormat["Duration"] = 1] = "Duration";
        IntegerFormat[IntegerFormat["TimeZone"] = 2] = "TimeZone";
        IntegerFormat[IntegerFormat["Language"] = 3] = "Language";
        IntegerFormat[IntegerFormat["Locale"] = 4] = "Locale";
    })(IntegerFormat = ODataContract.IntegerFormat || (ODataContract.IntegerFormat = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var JoinOperator;
    (function (JoinOperator) {
        JoinOperator[JoinOperator["Inner"] = 0] = "Inner";
        JoinOperator[JoinOperator["LeftOuter"] = 1] = "LeftOuter";
        JoinOperator[JoinOperator["Natural"] = 2] = "Natural";
    })(JoinOperator = ODataContract.JoinOperator || (ODataContract.JoinOperator = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var LogicalOperator;
    (function (LogicalOperator) {
        LogicalOperator[LogicalOperator["And"] = 0] = "And";
        LogicalOperator[LogicalOperator["Or"] = 1] = "Or";
    })(LogicalOperator = ODataContract.LogicalOperator || (ODataContract.LogicalOperator = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var ManagedPropertyEvaluationPriority;
    (function (ManagedPropertyEvaluationPriority) {
        ManagedPropertyEvaluationPriority[ManagedPropertyEvaluationPriority["None"] = 0] = "None";
        ManagedPropertyEvaluationPriority[ManagedPropertyEvaluationPriority["Low"] = 1] = "Low";
        ManagedPropertyEvaluationPriority[ManagedPropertyEvaluationPriority["Normal"] = 2] = "Normal";
        ManagedPropertyEvaluationPriority[ManagedPropertyEvaluationPriority["High"] = 3] = "High";
        ManagedPropertyEvaluationPriority[ManagedPropertyEvaluationPriority["Essential"] = 4] = "Essential";
    })(ManagedPropertyEvaluationPriority = ODataContract.ManagedPropertyEvaluationPriority || (ODataContract.ManagedPropertyEvaluationPriority = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var ManagedPropertyOperation;
    (function (ManagedPropertyOperation) {
        ManagedPropertyOperation[ManagedPropertyOperation["None"] = 0] = "None";
        ManagedPropertyOperation[ManagedPropertyOperation["Create"] = 1] = "Create";
        ManagedPropertyOperation[ManagedPropertyOperation["Update"] = 2] = "Update";
        ManagedPropertyOperation[ManagedPropertyOperation["CreateUpdate"] = 3] = "CreateUpdate";
        ManagedPropertyOperation[ManagedPropertyOperation["Delete"] = 4] = "Delete";
        ManagedPropertyOperation[ManagedPropertyOperation["UpdateDelete"] = 6] = "UpdateDelete";
        ManagedPropertyOperation[ManagedPropertyOperation["All"] = 7] = "All";
    })(ManagedPropertyOperation = ODataContract.ManagedPropertyOperation || (ODataContract.ManagedPropertyOperation = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var ManagedPropertyType;
    (function (ManagedPropertyType) {
        ManagedPropertyType[ManagedPropertyType["Operation"] = 0] = "Operation";
        ManagedPropertyType[ManagedPropertyType["Attribute"] = 1] = "Attribute";
        ManagedPropertyType[ManagedPropertyType["CustomEvaluator"] = 2] = "CustomEvaluator";
        ManagedPropertyType[ManagedPropertyType["Custom"] = 3] = "Custom";
    })(ManagedPropertyType = ODataContract.ManagedPropertyType || (ODataContract.ManagedPropertyType = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var OptionSetType;
    (function (OptionSetType) {
        OptionSetType[OptionSetType["Picklist"] = 0] = "Picklist";
        OptionSetType[OptionSetType["State"] = 1] = "State";
        OptionSetType[OptionSetType["Status"] = 2] = "Status";
        OptionSetType[OptionSetType["Boolean"] = 3] = "Boolean";
    })(OptionSetType = ODataContract.OptionSetType || (ODataContract.OptionSetType = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var OrderType;
    (function (OrderType) {
        OrderType[OrderType["Ascending"] = 0] = "Ascending";
        OrderType[OrderType["Descending"] = 1] = "Descending";
    })(OrderType = ODataContract.OrderType || (ODataContract.OrderType = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var OrganizationState;
    (function (OrganizationState) {
        OrganizationState[OrganizationState["Enabled"] = 0] = "Enabled";
        OrganizationState[OrganizationState["Disabled"] = 1] = "Disabled";
    })(OrganizationState = ODataContract.OrganizationState || (ODataContract.OrganizationState = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var OwnershipTypes;
    (function (OwnershipTypes) {
        OwnershipTypes[OwnershipTypes["None"] = 0] = "None";
        OwnershipTypes[OwnershipTypes["UserOwned"] = 1] = "UserOwned";
        OwnershipTypes[OwnershipTypes["TeamOwned"] = 2] = "TeamOwned";
        OwnershipTypes[OwnershipTypes["BusinessOwned"] = 4] = "BusinessOwned";
        OwnershipTypes[OwnershipTypes["OrganizationOwned"] = 8] = "OrganizationOwned";
        OwnershipTypes[OwnershipTypes["BusinessParented"] = 16] = "BusinessParented";
    })(OwnershipTypes = ODataContract.OwnershipTypes || (ODataContract.OwnershipTypes = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var PrivilegeDepth;
    (function (PrivilegeDepth) {
        PrivilegeDepth[PrivilegeDepth["Basic"] = 0] = "Basic";
        PrivilegeDepth[PrivilegeDepth["Local"] = 1] = "Local";
        PrivilegeDepth[PrivilegeDepth["Deep"] = 2] = "Deep";
        PrivilegeDepth[PrivilegeDepth["Global"] = 3] = "Global";
    })(PrivilegeDepth = ODataContract.PrivilegeDepth || (ODataContract.PrivilegeDepth = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var PrivilegeType;
    (function (PrivilegeType) {
        PrivilegeType[PrivilegeType["None"] = 0] = "None";
        PrivilegeType[PrivilegeType["Create"] = 1] = "Create";
        PrivilegeType[PrivilegeType["Read"] = 2] = "Read";
        PrivilegeType[PrivilegeType["Write"] = 3] = "Write";
        PrivilegeType[PrivilegeType["Delete"] = 4] = "Delete";
        PrivilegeType[PrivilegeType["Assign"] = 5] = "Assign";
        PrivilegeType[PrivilegeType["Share"] = 6] = "Share";
        PrivilegeType[PrivilegeType["Append"] = 7] = "Append";
        PrivilegeType[PrivilegeType["AppendTo"] = 8] = "AppendTo";
    })(PrivilegeType = ODataContract.PrivilegeType || (ODataContract.PrivilegeType = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var PropagationOwnershipOptions;
    (function (PropagationOwnershipOptions) {
        PropagationOwnershipOptions[PropagationOwnershipOptions["None"] = 0] = "None";
        PropagationOwnershipOptions[PropagationOwnershipOptions["Caller"] = 1] = "Caller";
        PropagationOwnershipOptions[PropagationOwnershipOptions["ListMemberOwner"] = 2] = "ListMemberOwner";
    })(PropagationOwnershipOptions = ODataContract.PropagationOwnershipOptions || (ODataContract.PropagationOwnershipOptions = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var RelationshipType;
    (function (RelationshipType) {
        RelationshipType[RelationshipType["OneToManyRelationship"] = 0] = "OneToManyRelationship";
        RelationshipType[RelationshipType["ManyToManyRelationship"] = 1] = "ManyToManyRelationship";
    })(RelationshipType = ODataContract.RelationshipType || (ODataContract.RelationshipType = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var RibbonLocationFilters;
    (function (RibbonLocationFilters) {
        RibbonLocationFilters[RibbonLocationFilters["Form"] = 1] = "Form";
        RibbonLocationFilters[RibbonLocationFilters["HomepageGrid"] = 2] = "HomepageGrid";
        RibbonLocationFilters[RibbonLocationFilters["SubGrid"] = 4] = "SubGrid";
        RibbonLocationFilters[RibbonLocationFilters["All"] = 7] = "All";
    })(RibbonLocationFilters = ODataContract.RibbonLocationFilters || (ODataContract.RibbonLocationFilters = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var RollupType;
    (function (RollupType) {
        RollupType[RollupType["None"] = 0] = "None";
        RollupType[RollupType["Related"] = 1] = "Related";
        RollupType[RollupType["Extended"] = 2] = "Extended";
    })(RollupType = ODataContract.RollupType || (ODataContract.RollupType = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var SearchDirection;
    (function (SearchDirection) {
        SearchDirection[SearchDirection["Forward"] = 0] = "Forward";
        SearchDirection[SearchDirection["Backward"] = 1] = "Backward";
    })(SearchDirection = ODataContract.SearchDirection || (ODataContract.SearchDirection = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var SecurityTypes;
    (function (SecurityTypes) {
        SecurityTypes[SecurityTypes["None"] = 0] = "None";
        SecurityTypes[SecurityTypes["Append"] = 1] = "Append";
        SecurityTypes[SecurityTypes["ParentChild"] = 2] = "ParentChild";
        SecurityTypes[SecurityTypes["Pointer"] = 4] = "Pointer";
        SecurityTypes[SecurityTypes["Inheritance"] = 8] = "Inheritance";
    })(SecurityTypes = ODataContract.SecurityTypes || (ODataContract.SecurityTypes = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var StringFormat;
    (function (StringFormat) {
        StringFormat[StringFormat["Email"] = 0] = "Email";
        StringFormat[StringFormat["Text"] = 1] = "Text";
        StringFormat[StringFormat["TextArea"] = 2] = "TextArea";
        StringFormat[StringFormat["Url"] = 3] = "Url";
        StringFormat[StringFormat["TickerSymbol"] = 4] = "TickerSymbol";
        StringFormat[StringFormat["PhoneticGuide"] = 5] = "PhoneticGuide";
        StringFormat[StringFormat["VersionNumber"] = 6] = "VersionNumber";
        StringFormat[StringFormat["Phone"] = 7] = "Phone";
    })(StringFormat = ODataContract.StringFormat || (ODataContract.StringFormat = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var SubCode;
    (function (SubCode) {
        SubCode[SubCode["Unspecified"] = 0] = "Unspecified";
        SubCode[SubCode["Schedulable"] = 1] = "Schedulable";
        SubCode[SubCode["Committed"] = 2] = "Committed";
        SubCode[SubCode["Uncommitted"] = 3] = "Uncommitted";
        SubCode[SubCode["Break"] = 4] = "Break";
        SubCode[SubCode["Holiday"] = 5] = "Holiday";
        SubCode[SubCode["Vacation"] = 6] = "Vacation";
        SubCode[SubCode["Appointment"] = 7] = "Appointment";
        SubCode[SubCode["ResourceStartTime"] = 8] = "ResourceStartTime";
        SubCode[SubCode["ResourceServiceRestriction"] = 9] = "ResourceServiceRestriction";
        SubCode[SubCode["ResourceCapacity"] = 10] = "ResourceCapacity";
        SubCode[SubCode["ServiceRestriction"] = 11] = "ServiceRestriction";
        SubCode[SubCode["ServiceCost"] = 12] = "ServiceCost";
    })(SubCode = ODataContract.SubCode || (ODataContract.SubCode = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var TargetFieldType;
    (function (TargetFieldType) {
        TargetFieldType[TargetFieldType["All"] = 0] = "All";
        TargetFieldType[TargetFieldType["ValidForCreate"] = 1] = "ValidForCreate";
        TargetFieldType[TargetFieldType["ValidForUpdate"] = 2] = "ValidForUpdate";
        TargetFieldType[TargetFieldType["ValidForRead"] = 3] = "ValidForRead";
    })(TargetFieldType = ODataContract.TargetFieldType || (ODataContract.TargetFieldType = {}));
})(ODataContract || (ODataContract = {}));
(function (ODataContract) {
    var TimeCode;
    (function (TimeCode) {
        TimeCode[TimeCode["Available"] = 0] = "Available";
        TimeCode[TimeCode["Busy"] = 1] = "Busy";
        TimeCode[TimeCode["Unavailable"] = 2] = "Unavailable";
        TimeCode[TimeCode["Filter"] = 3] = "Filter";
    })(TimeCode = ODataContract.TimeCode || (ODataContract.TimeCode = {}));
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
///<reference path="../Enums/Enums.ts" />
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var CreateActivitiesListRequest = (function () {
        function CreateActivitiesListRequest(listId, friendlyName, activity /*Microsoft.Dynamics.CRM.crmbaseentity*/, templateId, propagate, ownershipOptions, owner /*Microsoft.Dynamics.CRM.crmbaseentity*/, sendEmail, postWorkflowEvent, queueId) {
            this.ListId = listId;
            this.FriendlyName = friendlyName;
            this.Activity = activity;
            this.TemplateId = templateId;
            this.Propagate = propagate;
            this.OwnershipOptions = ownershipOptions;
            this.Owner = owner;
            this.sendEmail = sendEmail;
            this.PostWorkflowEvent = postWorkflowEvent;
            this.QueueId = queueId;
        }
        CreateActivitiesListRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "ListId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1,
                    },
                    "FriendlyName": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "Activity": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5,
                    },
                    "TemplateId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1,
                    },
                    "Propagate": {
                        "typeName": "Edm.Boolean",
                        "structuralProperty": 1,
                    },
                    "OwnershipOptions": {
                        "typeName": "Microsoft.Dynamics.CRM.PropagationOwnershipOptions",
                        "structuralProperty": 3,
                        "enumProperties": [,
                            {
                                "name": "None",
                                "value": 0,
                            },
                            {
                                "name": "Caller",
                                "value": 1,
                            },
                            {
                                "name": "ListMemberOwner",
                                "value": 2,
                            },
                        ],
                    },
                    "Owner": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5,
                    },
                    "sendEmail": {
                        "typeName": "Edm.Boolean",
                        "structuralProperty": 1,
                    },
                    "PostWorkflowEvent": {
                        "typeName": "Edm.Boolean",
                        "structuralProperty": 1,
                    },
                    "QueueId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1,
                    },
                },
                operationName: "CreateActivitiesList",
                operationType: 0,
            };
            return metadata;
        };
        return CreateActivitiesListRequest;
    }());
    ODataContract.CreateActivitiesListRequest = CreateActivitiesListRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
///<reference path="../Enums/Enums.ts" />
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var DistributeCampaignActivityRequest = (function () {
        function DistributeCampaignActivityRequest(entity /*Microsoft.Dynamics.CRM.campaignactivity*/, propagate, activity /*Microsoft.Dynamics.CRM.crmbaseentity*/, template /*Microsoft.Dynamics.CRM.template*/, ownershipOptions, owner /*Microsoft.Dynamics.CRM.crmbaseentity*/, sendEmail, queue /*Microsoft.Dynamics.CRM.queue*/, postWorkflowEvent) {
            this.entity = entity;
            this.Propagate = propagate;
            this.Activity = activity;
            this.Template = template;
            this.OwnershipOptions = ownershipOptions;
            this.Owner = owner;
            this.SendEmail = sendEmail;
            this.Queue = queue;
            this.PostWorkflowEvent = postWorkflowEvent;
        }
        DistributeCampaignActivityRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.campaignactivity",
                        "structuralProperty": 5,
                    },
                    "Propagate": {
                        "typeName": "Edm.Boolean",
                        "structuralProperty": 1,
                    },
                    "Activity": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5,
                    },
                    "Template": {
                        "typeName": "Microsoft.Dynamics.CRM.template",
                        "structuralProperty": 5,
                    },
                    "OwnershipOptions": {
                        "typeName": "Microsoft.Dynamics.CRM.PropagationOwnershipOptions",
                        "structuralProperty": 3,
                        "enumProperties": [,
                            {
                                "name": "None",
                                "value": 0,
                            },
                            {
                                "name": "Caller",
                                "value": 1,
                            },
                            {
                                "name": "ListMemberOwner",
                                "value": 2,
                            },
                        ],
                    },
                    "Owner": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5,
                    },
                    "SendEmail": {
                        "typeName": "Edm.Boolean",
                        "structuralProperty": 1,
                    },
                    "Queue": {
                        "typeName": "Microsoft.Dynamics.CRM.queue",
                        "structuralProperty": 5,
                    },
                    "PostWorkflowEvent": {
                        "typeName": "Edm.Boolean",
                        "structuralProperty": 1,
                    },
                },
                operationName: "DistributeCampaignActivity",
                operationType: 0,
            };
            return metadata;
        };
        return DistributeCampaignActivityRequest;
    }());
    ODataContract.DistributeCampaignActivityRequest = DistributeCampaignActivityRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var Object = (function () {
        function Object() {
        }
        Object.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                operationName: null,
                operationType: null,
                parameterTypes: {
                    "Type": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1 /* PrimitiveType */,
                    },
                    "Value": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1 /* PrimitiveType */,
                    },
                },
            };
            return metadata;
        };
        return Object;
    }());
    ODataContract.Object = Object;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
///<reference path="../ComplexType/Object.ts" />
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var InputArgument = (function () {
        function InputArgument() {
        }
        InputArgument.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                operationName: null,
                operationType: null,
                parameterTypes: {
                    "Count": {
                        "typeName": "Edm.Int32",
                        "structuralProperty": 1 /* PrimitiveType */,
                    },
                    "IsReadOnly": {
                        "typeName": "Edm.Boolean",
                        "structuralProperty": 1 /* PrimitiveType */,
                    },
                    "Keys": {
                        "typeName": "Edm.String",
                        "structuralProperty": 4 /* Collection */,
                    },
                    "Values": {
                        "typeName": "mscrm.Object",
                        "structuralProperty": 4 /* Collection */,
                    },
                },
            };
            return metadata;
        };
        return InputArgument;
    }());
    ODataContract.InputArgument = InputArgument;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
///<reference path="../ComplexType/InputArgument.ts" />
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var InputArgumentCollection = (function () {
        function InputArgumentCollection() {
        }
        InputArgumentCollection.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                operationName: null,
                operationType: null,
                parameterTypes: {
                    "Arguments": {
                        "typeName": "Microsoft.Dynamics.CRM.InputArgument",
                        "structuralProperty": 2 /* ComplexType */,
                    },
                },
            };
            return metadata;
        };
        return InputArgumentCollection;
    }());
    ODataContract.InputArgumentCollection = InputArgumentCollection;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
///<reference path="../ComplexType/InputArgumentCollection.ts" />
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var ExecuteWorkflowRequest = (function () {
        function ExecuteWorkflowRequest(entity /*Microsoft.Dynamics.CRM.workflow*/, entityId, inputArguments) {
            this.entity = entity;
            this.EntityId = entityId;
            this.InputArguments = inputArguments;
        }
        ExecuteWorkflowRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.workflow",
                        "structuralProperty": 5,
                    },
                    "EntityId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1,
                    },
                    "InputArguments": {
                        "typeName": "Microsoft.Dynamics.CRM.InputArgumentCollection",
                        "structuralProperty": 2,
                    },
                },
                operationName: "ExecuteWorkflow",
                operationType: 0,
            };
            return metadata;
        };
        return ExecuteWorkflowRequest;
    }());
    ODataContract.ExecuteWorkflowRequest = ExecuteWorkflowRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var MergeRequest = (function () {
        function MergeRequest(target /*Microsoft.Dynamics.CRM.crmbaseentity*/, subordinate /*Microsoft.Dynamics.CRM.crmbaseentity*/, updateContent /*Microsoft.Dynamics.CRM.crmbaseentity*/, performParentingChecks) {
            this.Target = target;
            this.Subordinate = subordinate;
            this.UpdateContent = updateContent;
            this.PerformParentingChecks = performParentingChecks;
        }
        MergeRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "Target": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5,
                    },
                    "Subordinate": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5,
                    },
                    "UpdateContent": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5,
                    },
                    "PerformParentingChecks": {
                        "typeName": "Edm.Boolean",
                        "structuralProperty": 1,
                    },
                },
                operationName: "Merge",
                operationType: 0,
            };
            return metadata;
        };
        return MergeRequest;
    }());
    ODataContract.MergeRequest = MergeRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var PickFromQueueRequest = (function () {
        function PickFromQueueRequest(entity /*Microsoft.Dynamics.CRM.queueitem*/, systemUser /*Microsoft.Dynamics.CRM.systemuser*/, removeQueueItem) {
            this.entity = entity;
            this.SystemUser = systemUser;
            this.RemoveQueueItem = removeQueueItem;
        }
        PickFromQueueRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.queueitem",
                        "structuralProperty": 5,
                    },
                    "SystemUser": {
                        "typeName": "Microsoft.Dynamics.CRM.systemuser",
                        "structuralProperty": 5,
                    },
                    "RemoveQueueItem": {
                        "typeName": "Edm.Boolean",
                        "structuralProperty": 1,
                    },
                },
                operationName: "PickFromQueue",
                operationType: 0,
            };
            return metadata;
        };
        return PickFromQueueRequest;
    }());
    ODataContract.PickFromQueueRequest = PickFromQueueRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var ReleaseToQueueRequest = (function () {
        function ReleaseToQueueRequest(entity /*Microsoft.Dynamics.CRM.queueitem*/) {
            this.entity = entity;
        }
        ReleaseToQueueRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.queueitem",
                        "structuralProperty": 5,
                    },
                },
                operationName: "ReleaseToQueue",
                operationType: 0,
            };
            return metadata;
        };
        return ReleaseToQueueRequest;
    }());
    ODataContract.ReleaseToQueueRequest = ReleaseToQueueRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var RemoveFromQueueRequest = (function () {
        function RemoveFromQueueRequest(entity /*Microsoft.Dynamics.CRM.queueitem*/) {
            this.entity = entity;
        }
        RemoveFromQueueRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.queueitem",
                        "structuralProperty": 5,
                    },
                },
                operationName: "RemoveFromQueue",
                operationType: 0,
            };
            return metadata;
        };
        return RemoveFromQueueRequest;
    }());
    ODataContract.RemoveFromQueueRequest = RemoveFromQueueRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var RouteToRequest = (function () {
        function RouteToRequest(target /*Microsoft.Dynamics.CRM.crmbaseentity*/, queueItem /*Microsoft.Dynamics.CRM.queueitem*/) {
            this.Target = target;
            this.QueueItem = queueItem;
        }
        RouteToRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "Target": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5,
                    },
                    "QueueItem": {
                        "typeName": "Microsoft.Dynamics.CRM.queueitem",
                        "structuralProperty": 5,
                    },
                },
                operationName: "RouteTo",
                operationType: 0,
            };
            return metadata;
        };
        return RouteToRequest;
    }());
    ODataContract.RouteToRequest = RouteToRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var RecalculateRequest = (function () {
        function RecalculateRequest(entity /*Microsoft.Dynamics.CRM.goal*/) {
            this.entity = entity;
        }
        RecalculateRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.goal",
                        "structuralProperty": 5,
                    },
                },
                operationName: "Recalculate",
                operationType: 0,
            };
            return metadata;
        };
        return RecalculateRequest;
    }());
    ODataContract.RecalculateRequest = RecalculateRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var ColumnSet = (function () {
        function ColumnSet(allColumns, columns) {
            this.AllColumns = allColumns;
            this.Columns = columns;
        }
        ColumnSet.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "AllColumns": {
                        "typeName": "Edm.Boolean",
                        "structuralProperty": 1,
                    },
                    "Columns": {
                        "typeName": "Edm.String",
                        "structuralProperty": 4,
                    },
                },
                operationName: null,
                operationType: null,
            };
            return metadata;
        };
        return ColumnSet;
    }());
    ODataContract.ColumnSet = ColumnSet;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var WhoAmIResponse = (function () {
        function WhoAmIResponse(businessUnitId, userId, organizationId) {
            this.BusinessUnitId = businessUnitId;
            this.UserId = userId;
            this.OrganizationId = organizationId;
        }
        WhoAmIResponse.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "BusinessUnitId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1,
                    },
                    "UserId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1,
                    },
                    "OrganizationId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1,
                    },
                },
                operationName: null,
                operationType: null,
            };
            return metadata;
        };
        return WhoAmIResponse;
    }());
    ODataContract.WhoAmIResponse = WhoAmIResponse;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var RetrieveUserPrivilegesRequest = (function () {
        function RetrieveUserPrivilegesRequest(entity /*Microsoft.Dynamics.CRM.systemuser*/) {
            this.entity = entity;
        }
        RetrieveUserPrivilegesRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.systemuser",
                        "structuralProperty": 5,
                    },
                },
                operationName: "RetrieveUserPrivileges",
                operationType: 1,
            };
            return metadata;
        };
        return RetrieveUserPrivilegesRequest;
    }());
    ODataContract.RetrieveUserPrivilegesRequest = RetrieveUserPrivilegesRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var RetrievePrincipalAccessRequest = (function () {
        function RetrievePrincipalAccessRequest(entity /*Microsoft.Dynamics.CRM.systemuser*/, target /*Microsoft.Dynamics.CRM.crmbaseentity*/) {
            this.entity = entity;
            this.Target = target;
        }
        RetrievePrincipalAccessRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entity",
                parameterTypes: {
                    "entity": {
                        "typeName": "Microsoft.Dynamics.CRM.systemuser",
                        "structuralProperty": 5,
                    },
                    "Target": {
                        "typeName": "Microsoft.Dynamics.CRM.crmbaseentity",
                        "structuralProperty": 5,
                    },
                },
                operationName: "RetrievePrincipalAccess",
                operationType: 1,
            };
            return metadata;
        };
        return RetrievePrincipalAccessRequest;
    }());
    ODataContract.RetrievePrincipalAccessRequest = RetrievePrincipalAccessRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var RetrieveUserDefaultCurrencyRequest = (function () {
        function RetrieveUserDefaultCurrencyRequest() {
        }
        RetrieveUserDefaultCurrencyRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: "entityset",
                parameterTypes: {
                    "entityset": {
                        "typeName": "mscrm.transactioncurrency",
                        "structuralProperty": 4,
                    },
                },
                operationName: "RetrieveUserDefaultCurrency",
                operationType: 1,
            };
            return metadata;
        };
        return RetrieveUserDefaultCurrencyRequest;
    }());
    ODataContract.RetrieveUserDefaultCurrencyRequest = RetrieveUserDefaultCurrencyRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var WhoAmIRequest = (function () {
        function WhoAmIRequest() {
        }
        WhoAmIRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {},
                operationName: "WhoAmI",
                operationType: 1,
            };
            return metadata;
        };
        return WhoAmIRequest;
    }());
    ODataContract.WhoAmIRequest = WhoAmIRequest;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
///<reference path="../Enums/Enums.ts" />
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var MetadataQuery = (function () {
        function MetadataQuery(metadataType, metadataSubtype, entityLogicalName, metadataId, metadataName, getDefault, dependencyDepth, changedAfter, exclude, appId) {
            this.MetadataType = metadataType;
            this.MetadataSubtype = metadataSubtype;
            this.EntityLogicalName = entityLogicalName;
            this.MetadataId = metadataId;
            this.MetadataName = metadataName;
            this.GetDefault = getDefault;
            this.DependencyDepth = dependencyDepth;
            this.ChangedAfter = changedAfter;
            this.Exclude = exclude;
            this.AppId = appId;
        }
        MetadataQuery.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "MetadataType": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "MetadataSubtype": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "EntityLogicalName": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "MetadataId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1,
                    },
                    "MetadataName": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "GetDefault": {
                        "typeName": "Edm.Boolean",
                        "structuralProperty": 1,
                    },
                    "DependencyDepth": {
                        "typeName": "Microsoft.Dynamics.CRM.DependencyDepth",
                        "structuralProperty": 3,
                        "enumProperties": [,
                            {
                                "name": "Unknown",
                                "value": 0,
                            },
                            {
                                "name": "OnDemandWithContext",
                                "value": 1,
                            },
                            {
                                "name": "OnDemandWithoutContext",
                                "value": 2,
                            },
                            {
                                "name": "OnDemandContextOnly",
                                "value": 3,
                            },
                            {
                                "name": "Offline",
                                "value": 4,
                            },
                            {
                                "name": "Mobile",
                                "value": 5,
                            },
                        ],
                    },
                    "ChangedAfter": {
                        "typeName": "Edm.String",
                        "structuralProperty": 1,
                    },
                    "Exclude": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 4,
                    },
                    "AppId": {
                        "typeName": "Edm.Guid",
                        "structuralProperty": 1,
                    },
                },
                operationName: null,
                operationType: null,
            };
            return metadata;
        };
        return MetadataQuery;
    }());
    ODataContract.MetadataQuery = MetadataQuery;
})(ODataContract || (ODataContract = {}));
/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
 * IMPORTANT!
 * DO NOT MAKE CHANGES TO THIS FILE - THIS FILE IS AUTO-GENERATED FROM ODATA CSDL METADATA DOCUMENT
 * SEE https://msdn.microsoft.com/en-us/library/mt607990.aspx FOR MORE INFORMATION
 */
///<reference path="../ComplexType/MetadataQuery.ts" />
var ODataContract;
(function (ODataContract) {
    /* tslint:disable:crm-force-fields-private */
    var GetClientMetadataRequest = (function () {
        function GetClientMetadataRequest(clientMetadataQuery) {
            this.ClientMetadataQuery = clientMetadataQuery;
        }
        GetClientMetadataRequest.prototype.getMetadata = function () {
            var metadata = {
                boundParameter: null,
                parameterTypes: {
                    "ClientMetadataQuery": {
                        "typeName": "Microsoft.Dynamics.CRM.MetadataQuery",
                        "structuralProperty": 2,
                    },
                },
                operationName: "GetClientMetadata",
                operationType: 1,
            };
            return metadata;
        };
        return GetClientMetadataRequest;
    }());
    ODataContract.GetClientMetadataRequest = GetClientMetadataRequest;
})(ODataContract || (ODataContract = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var ClientUtility;
(function (ClientUtility) {
    var DataUtil = (function () {
        function DataUtil() {
        }
        /**
         * Checks whether an object is null.
         * @param object The object to check.
         * @returns A flag indicating whether the object is null.
         */
        DataUtil.isNull = function (object) {
            return object === null;
        };
        /**
         * Checks whether an object is undefined.
         * @param object The object to check.
         * @returns A flag indicating whether the object is undefined.
         */
        DataUtil.isUndefined = function (object) {
            return object === undefined;
        };
        /**
         * Checks whether an object is null or undefined.
         * @param object The object to check.
         * @returns A flag indicating whether the object is null or undefined.
         */
        DataUtil.isNullOrUndefined = function (object) {
            return object === null || object === undefined;
        };
        /**
         * Checks whether an object is an undefined, null or empty string.
         * @param object The object to check.
         * @returns A flag indicating whether the object is undefined, null or an empty string.
         */
        DataUtil.isNullOrEmptyString = function (object) {
            return DataUtil.isNullOrUndefined(object) || object === "";
        };
        /**
         * Checks whether an object is an null, an empty or whitespace string.
         * @param object The object to check.
         * @returns A Boolean value indicating whether the object is null, an empty or whitespace string.
         */
        DataUtil.isNullOrWhiteSpace = function (value) {
            return DataUtil.isNullOrEmptyString(value) || (DataUtil.isString(value) && value.trim() == "");
        };
        /**
         * Tries to convert an object to string
         * @param object The object to convert.
         * @returns Returns the object converted to string or the object itself if this is null or undefined.
         */
        DataUtil.toStringWithNullCheck = function (object) {
            return DataUtil.isNullOrUndefined(object) ? object : object.toString();
        };
        /**
         * Checks if a given object is a string
         * @param object The object check.
         * @returns true if the object is a string; otherwise, false.
         */
        DataUtil.isString = function (object) {
            return typeof object === 'string' || object instanceof String;
        };
        return DataUtil;
    }());
    DataUtil.EmptyString = "";
    /**
     * Checks if a given object is a function
     * @param object The object check.
     * @returns true if the object is a function; otherwise, false.
     */
    DataUtil.isFunction = function (object) {
        return !!object && typeof object === 'function';
    };
    /**
     * Checks if a given object has a given function
     * @param object The object check.
     * @param functionName The name of the function to check for.
     * @returns true if the object has a given function; otherwise, false.
     */
    DataUtil.hasFunction = function (object, functionName) {
        return !!object && functionName && DataUtil.isFunction(object[functionName]);
    };
    ClientUtility.DataUtil = DataUtil;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../../../../TypeDefinitions/CRM/Localization/ResourceStringProvider.d.ts" />
/*
 * Invokes the ResourceStringProvider if available; otherwise returns *key*.
 * Using this class as a proxy for the ResourceStringProvider that is included per web dependency declaration
 * in order to avoid null reference errors in case the dependency is not loaded for some reason.
 */
var ClientUtility;
(function (ClientUtility) {
    var StringProvider = (function () {
        function StringProvider() {
        }
        StringProvider.getResourceString = function (key) {
            return ClientUtility.ResourceStringProvider ? ClientUtility.ResourceStringProvider.getResourceString(key) : "*" + key + "*";
        };
        return StringProvider;
    }());
    ClientUtility.StringProvider = StringProvider;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="DataUtil.ts" />
/// <reference path="../../../TypeDefinitions/CRM/Localization/ResourceStringProvider.d.ts" />
/// <reference path="../Localization/Provider/StringProvider.ts" />
var ClientUtility;
(function (ClientUtility) {
    var ActionFailedHandler = (function () {
        function ActionFailedHandler() {
        }
        ActionFailedHandler.actionFailedCallback = function (response) {
            if (!ClientUtility.DataUtil.isNullOrUndefined(response.errorCode)) {
                switch (response.errorCode) {
                    case 0x80048306:
                        var hexCode = response.errorCode.toString(16);
                        return Xrm.Navigation.openErrorDialog({
                            errorCode: response.errorCode,
                            message: ClientUtility.ResourceStringProvider.getResourceString("Error_Title_0x" + hexCode),
                            details: String.format(ClientUtility.ResourceStringProvider.getResourceString("Error_Message_0x" + hexCode), ClientUtility.ResourceStringProvider.getResourceString("Brand_CRM"))
                        });
                    case 0x8003F452:
                    case 0x80081018:
                    case 0x80040220:
                    case 0x80042f0a:
                        var hexCode = response.errorCode.toString(16);
                        return Xrm.Navigation.openErrorDialog({
                            errorCode: response.errorCode,
                            message: ClientUtility.ResourceStringProvider.getResourceString("Error_Title_0x" + hexCode),
                            details: ClientUtility.ResourceStringProvider.getResourceString("Error_Message_0x" + hexCode)
                        });
                    default:
                        var alertStrings = {
                            text: response.message
                        };
                        // TODO: Show a more error-oriented dialog (& icon)?
                        return Xrm.Navigation.openAlertDialog(alertStrings);
                }
            }
        };
        ActionFailedHandler.actionFailedErrorDialog = function (errorResponse) {
            Xrm.Navigation.openErrorDialog({ errorCode: errorResponse.errorCode, message: errorResponse.message });
        };
        return ActionFailedHandler;
    }());
    ClientUtility.ActionFailedHandler = ActionFailedHandler;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var ClientUtility;
(function (ClientUtility) {
    var AlertDialogStrings = (function () {
        function AlertDialogStrings() {
        }
        return AlertDialogStrings;
    }());
    ClientUtility.AlertDialogStrings = AlertDialogStrings;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var ClientUtility;
(function (ClientUtility) {
    var DataUtils = (function () {
        function DataUtils() {
        }
        return DataUtils;
    }());
    /**
     * Checks if a given object is a function
     * @param object The object check.
     * @returns true if the object is a function; otherwise, false.
     */
    DataUtils.isFunction = function (object) {
        return !!object && typeof object === 'function';
    };
    /**
     * Checks if a given object has a given function
     * @param object The object check.
     * @param functionName The name of the function to check for.
     * @returns true if the object has a given function; otherwise, false.
     */
    DataUtils.hasFunction = function (object, functionName) {
        return !!object && functionName && DataUtils.isFunction(object[functionName]);
    };
    ClientUtility.DataUtils = DataUtils;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="DataUtils.ts" />
var ClientUtility;
(function (ClientUtility) {
    var ClientUtils = (function () {
        function ClientUtils() {
        }
        /**
         * Checks whether the code is running on a UCI client.
         * @returns A flag indicating whether the code is running on a UCI client.
         */
        ClientUtils.isUCI = function () {
            var global = window;
            var xrm = global.Xrm;
            var result = false;
            if (xrm && xrm.Internal && ClientUtility.DataUtils.hasFunction(xrm.Internal, 'isUci')) {
                result = xrm.Internal.isUci();
            }
            else {
                // fall back to url inspection
                result = window && window.parent && window.parent.location && window.parent.location.href && window.parent.location.href.toLowerCase().indexOf('uclient') !== -1;
            }
            return result;
        };
        return ClientUtils;
    }());
    ClientUtility.ClientUtils = ClientUtils;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="DataUtil.ts" />
/// <reference path="Utils.NoClientApi/ClientUtils.ts" />
var ClientUtility;
(function (ClientUtility) {
    var ClientUtil = (function () {
        function ClientUtil() {
        }
        /**
         * Checks whether the client is mobile.
         * @returns A flag indicating whether the client is mobile.
         */
        ClientUtil.isMobile = function () {
            return Xrm.Utility.getGlobalContext().client.getClient() === Xrm.Constants.ClientNames.mobile;
        };
        /**
         * Checks whether the mobile device is offline.
         * @returns A flag indicating whether the mobile device is offline.
         */
        ClientUtil.isMobileOffline = function () {
            // TODO: Consider adding a check for the org Setting for offline enabled
            return Xrm.Utility.getGlobalContext().client.getClient() === Xrm.Constants.ClientNames.mobile &&
                Xrm.Utility.getGlobalContext().client.getClientState() === Xrm.Constants.ClientStates.offline;
        };
        /**
         * Checks whether it is outlook client.
         * @returns A flag indicating it is outlook client
         */
        ClientUtil.isOutlook = function () {
            return Xrm.Utility.getGlobalContext().client.getClient() === Xrm.Constants.ClientNames.outlook;
        };
        /**
         * Checks whether the code is running on an iOS device (iPhone, iPad).
         * @returns A flag indicating whether the code is running on iOS.
         */
        ClientUtil.isIOSDevice = function () {
            var uaString = navigator.userAgent;
            if (ClientUtility.DataUtil.isNullOrUndefined(uaString)) {
                return false;
            }
            uaString = uaString.toLowerCase();
            return uaString !== "" && uaString.search("ipad|ipod|iphone") > -1;
        };
        /**
         * Checks whether the code is running on a UCI client.
         * @returns A flag indicating whether the code is running on a UCI client.
         */
        ClientUtil.isUCI = function () {
            return ClientUtility.ClientUtils.isUCI();
        };
        return ClientUtil;
    }());
    ClientUtil.outlook = "Outlook";
    ClientUtil.web = "Web";
    ClientUtil.mobile = "Mobile";
    ClientUtil.offline = "Offline";
    ClientUtility.ClientUtil = ClientUtil;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var ClientUtility;
(function (ClientUtility) {
    var MetadataDrivenDialogConstants = (function () {
        function MetadataDrivenDialogConstants() {
        }
        return MetadataDrivenDialogConstants;
    }());
    MetadataDrivenDialogConstants.action = "action";
    MetadataDrivenDialogConstants.activate = "activate";
    MetadataDrivenDialogConstants.commaSeperator = ",";
    MetadataDrivenDialogConstants.defaultIndex = 0;
    MetadataDrivenDialogConstants.DialogCancelId = "cancel_id";
    MetadataDrivenDialogConstants.DialogOkId = "ok_id";
    MetadataDrivenDialogConstants.EntityId = "entityId";
    MetadataDrivenDialogConstants.EntityName = "entityName";
    MetadataDrivenDialogConstants.EntityTypeCode = "entityTypeCode";
    MetadataDrivenDialogConstants.firstIndex = 1;
    MetadataDrivenDialogConstants.GridControl = "gridControl";
    MetadataDrivenDialogConstants.LastButtonClicked = "lastButtonClicked";
    MetadataDrivenDialogConstants.Records = "records";
    MetadataDrivenDialogConstants.SetState = "SetState";
    MetadataDrivenDialogConstants.StateId = "state_id";
    MetadataDrivenDialogConstants.StatusId = "status_id";
    MetadataDrivenDialogConstants.paramEntityName = "param_entityName";
    MetadataDrivenDialogConstants.paramEntityId = "param_entityId";
    MetadataDrivenDialogConstants.paramEntityTypeCode = "param_entityTypeCode";
    MetadataDrivenDialogConstants.paramLastButtonClicked = "param_lastButtonClicked";
    MetadataDrivenDialogConstants.paramOwnerId = "param_ownerId";
    MetadataDrivenDialogConstants.paramOwnerName = "param_ownerName";
    MetadataDrivenDialogConstants.paramOwnerType = "param_ownerType";
    MetadataDrivenDialogConstants.paramRecords = "param_records";
    ClientUtility.MetadataDrivenDialogConstants = MetadataDrivenDialogConstants;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="CommandBarActions.ts" />
/// <reference path="DataUtil.ts" />
/// <reference path="MetadataDrivenDialogConstants.ts" />
/// <reference path="../Localization/Provider/StringProvider.ts" />
var ClientUtility;
(function (ClientUtility) {
    var DialogUtil = (function () {
        function DialogUtil() {
        }
        DialogUtil.showMoCAOfflineError = function () {
            Xrm.Navigation.openAlertDialog({ text: ClientUtility.StringProvider.getResourceString("Error_Message_Generic_Mobile_Client_Offline") });
        };
        DialogUtil.serializeSdkEntityReferences = function (records) {
            return JSON.stringify(DialogUtil.getEntityReference(records));
        };
        DialogUtil.deserializeSdkEntityReferences = function (stringifiedRecords) {
            if (ClientUtility.DataUtil.isNullOrEmptyString(stringifiedRecords))
                return new Array(0);
            return DialogUtil.getEntityReference(JSON.parse(stringifiedRecords));
        };
        ;
        DialogUtil.openAlertDialog = function (message) {
            Xrm.Navigation.openAlertDialog({ text: message }, { height: 500, width: 500 });
        };
        DialogUtil.getEntityReference = function (records) {
            var entities = new Array(0);
            for (var i = 0; i < records.length; i++) {
                var item = records[i];
                var entity = {};
                if (!ClientUtility.DataUtil.isNullOrUndefined(item.Name)) {
                    entity.Name = item.Name;
                }
                if (!ClientUtility.DataUtil.isNullOrUndefined(item.Id)) {
                    entity.Id = item.Id.toString();
                }
                if (!ClientUtility.DataUtil.isNullOrUndefined(item.TypeName)) {
                    entity.TypeName = item.TypeName;
                }
                if (!ClientUtility.DataUtil.isNullOrUndefined(item.TypeCode)) {
                    entity.TypeCode = item.TypeCode;
                }
                if (!ClientUtility.DataUtil.isNullOrUndefined(item.LogicalName)) {
                    entity.LogicalName = item.LogicalName;
                }
                entities[entities.length] = entity;
            }
            return entities;
        };
        DialogUtil.closeDialogCallback = function (response) {
            //TODO: dialogParams
            if (true /*(!DataUtil.isNullOrUndefined(dialogParams) && dialogParams[MetadataDrivenDialogConstants.LastButtonClicked] === MetadataDrivenDialogConstants.DialogOkId)*/) {
                Xrm.Page.data.refresh(true);
            }
        };
        DialogUtil.closeDialogFromGridCallback = function (response) {
            //TODO: CommandBarActions.IsWebClient
            //TODO: dialogParams
            //TODO: IXrmGridControl
            //if (CommandBarActions.IsWebClient() || (!JSTypes.IsNull(dialogParams) && (string)dialogParams[MetadataDrivenDialogConstants.LastButtonClicked] == MetadataDrivenDialogConstants.DialogOkId))
            //{
            //    IXrmGridControl gridControl = (IXrmGridControl)callbackParams[MetadataDrivenDialogConstants.GridControl];
            //    if (!JSTypes.IsNull(gridControl)) {
            //        gridControl.Refresh();
            //    }
            //}
        };
        DialogUtil.setAttributeValue = function (attributeId, value, formContext) {
            var formContext = formContext || Xrm.Page;
            var attribute = formContext.data.attributes.get(attributeId);
            if (!ClientUtility.DataUtil.isNullOrUndefined(attribute)) {
                attribute.setValue(value);
            }
        };
        DialogUtil.getAttributeValue = function (attributeId, formContext) {
            var context = formContext || Xrm.Page;
            var attribute = context.data.attributes.get(attributeId);
            var result = null;
            if (!ClientUtility.DataUtil.isNullOrUndefined(attribute)) {
                result = attribute.getValue();
            }
            return result;
        };
        DialogUtil.setLastButtonClicked = function (buttonId, formContext) {
            var formContext = formContext || Xrm.Page;
            var lastButtonClicked = Xrm.Page.data.attributes.get(ClientUtility.MetadataDrivenDialogConstants.paramLastButtonClicked);
            if (!ClientUtility.DataUtil.isNullOrUndefined(lastButtonClicked)) {
                lastButtonClicked.setValue(buttonId);
            }
        };
        /// <summary>
        /// hides the progress message.
        /// </summary>
        DialogUtil.hideProgressMessage = function () {
            Xrm.Utility.closeProgressIndicator();
        };
        /// <summary>
        /// shows the progress message if the SDK call is taking time.
        /// </summary>
        DialogUtil.showProgressMessage = function () {
            var processingMessage = ClientUtility.StringProvider.getResourceString("Msg_Progress_MOCA_Dialog");
            Xrm.Utility.showProgressIndicator(processingMessage);
        };
        DialogUtil.createCallbackFunctionFactory = function (callbackFunction) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return function (returnValue) { args.unshift(returnValue); return callbackFunction.apply(null, args); };
        };
        DialogUtil.defaultConfirmDialog = function (title, text) {
            var options = { width: 400, height: 200, position: 1 /* center */ };
            var confirmDialogStrings = { text: text, title: title };
            var callbackFunctionClose = DialogUtil.createCallbackFunctionFactory(DialogUtil.closeDialogCallback, null);
            Xrm.Navigation.openConfirmDialog(confirmDialogStrings, options).then(callbackFunctionClose);
        };
        DialogUtil.actionFailedCallbackForMoca = function (response) {
            DialogUtil.hideProgressMessage();
            return ClientUtility.ActionFailedHandler.actionFailedCallback(response);
        };
        return DialogUtil;
    }());
    DialogUtil.getDialogTelemetryPayload = function (context, dialogName, entityName, isMultiPageMDD, appName) {
        var eventValues = {
            ActionName: "OpenDialogAction",
            EventMessage: "Dialog Opened",
            EntityName: entityName,
            CommandContext: context,
            AppName: appName,
            DialogName: dialogName,
            IsMultiPageMDD: isMultiPageMDD
        };
        var eventParameters = [];
        for (var key in eventValues) {
            if (eventValues.hasOwnProperty(key)) {
                eventParameters.push({ name: key, value: eventValues[key] });
            }
        }
        var eventPayLoad = {
            activityId: ClientUtility.Guid.newGuid(),
            eventName: appName + "_OpenDialogAction",
            eventParameters: eventParameters
        };
        return eventPayLoad;
    };
    DialogUtil.DialogTelemetryContext = {
        form: "form",
        grid: "grid"
    };
    ClientUtility.DialogUtil = DialogUtil;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="DataUtil.ts" />
var ClientUtility;
(function (ClientUtility) {
    var Guid = (function () {
        function Guid() {
        }
        Guid.create = function (guidValue) {
            var rawGuidValue = Guid.getRawGuid(guidValue);
            // TODO: throw argument out of range if rawGuid is null
            return Guid.getFormattedGuid(rawGuidValue);
        };
        Guid.tryCreate = function (guidValue) {
            var rawGuidValue = Guid.getRawGuid(guidValue);
            if (ClientUtility.DataUtil.isNullOrEmptyString(rawGuidValue)) {
                return Guid.Empty;
            }
            return Guid.getFormattedGuid(rawGuidValue);
        };
        Guid.getFormattedGuid = function (rawGuidValue) {
            var formattedGuidValue = rawGuidValue.substring(0, 8) +
                "-" +
                rawGuidValue.substring(8, 12) +
                "-" +
                rawGuidValue.substring(12, 16) +
                "-" +
                rawGuidValue.substring(16, 20) +
                "-" +
                rawGuidValue.substring(20, 32);
            return formattedGuidValue;
        };
        Guid.getRawGuid = function (guidValue) {
            if (ClientUtility.DataUtil.isNullOrEmptyString(guidValue)) {
                return null;
            }
            var parsedValue = guidValue.replace('{', '').replace('}', '').replace(new RegExp('-', 'g'), '').toLowerCase();
            if (Guid.HyphenGuidVerifierPattern.test(parsedValue) || Guid.BraceAndHyphenGuidVerifierPattern.test(parsedValue)) {
                return parsedValue.replace(Guid.GuidStripperPattern, "");
            }
            else if (Guid.ContiguousGuidVerifierPattern.test(parsedValue)) {
                return parsedValue;
            }
            return null;
        };
        Guid.formatToUpper = function (sourceGuid) {
            if (ClientUtility.DataUtil.isNullOrUndefined(sourceGuid)) {
                return sourceGuid;
            }
            // pattern only recognizes lower case
            sourceGuid = sourceGuid.toLowerCase();
            if (Guid.BraceAndHyphenGuidVerifierPattern.test(sourceGuid)) {
                return sourceGuid.toUpperCase();
            }
            else {
                return String.format("{{{0}}}", sourceGuid.toUpperCase());
            }
        };
        //TODO: Replace this with the core implementation
        Guid.newGuid = function () {
            var HexChars = '0123456789abcdef';
            var GuidSize = 36;
            var sGuid = new Sys.StringBuilder();
            for (var i = 0; i < GuidSize; i++) {
                if (i === 14) {
                    sGuid.append('4');
                    continue;
                }
                if (i === 8 || i === 13 || i === 18 || i === 23) {
                    sGuid.append('-');
                    continue;
                }
                if (i === 19) {
                    var n = Math.floor(Math.random() * 16);
                    HexChars.substr(n & 3 | 8, 1);
                }
                sGuid.append(HexChars.substr(Math.floor(Math.random() * 16), 1));
            }
            return sGuid.toString();
        };
        return Guid;
    }());
    Guid.Empty = "00000000-0000-0000-0000-000000000000";
    Guid.HyphenGuidVerifierPattern = new RegExp("^(\\d|[a-f]){8}-(\\d|[a-f]){4}-(\\d|[a-f]){4}-(\\d|[a-f]){4}-(\\d|[a-f]){12}$");
    Guid.BraceAndHyphenGuidVerifierPattern = new RegExp("^\{(\\d|[a-f]){8}-(\\d|[a-f]){4}-(\\d|[a-f]){4}-(\\d|[a-f]){4}-(\\d|[a-f]){12}\}$");
    Guid.ContiguousGuidVerifierPattern = new RegExp("^(\\d|[a-f]){32}$");
    Guid.GuidStripperPattern = new RegExp("{|}", "g");
    ClientUtility.Guid = Guid;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="ActionFailedHandler.ts" />
/// <reference path="DataUtil.ts" />
/// <reference path="DialogUtil.ts" />
/// <reference path="Guid.ts" />
/// <reference path="MetadataDrivenDialogConstants.ts" />
/// <reference path="../Localization/Provider/StringProvider.ts" />
var ClientUtility;
(function (ClientUtility) {
    var CommandBarActions = (function () {
        function CommandBarActions() {
        }
        CommandBarActions.refreshParentGrid = function (entityId, entityName) {
            if (entityName) {
                Xrm.Utility.refreshParentGrid({
                    id: entityId,
                    entityType: entityName
                });
            }
        };
        CommandBarActions.setState = function (entityId, entityName, stateCode, statusCode, closeWindow, entityToOpen, entityIdToOpen) {
            XrmCore.Commands.Common.setState(entityId, entityName, stateCode, statusCode, closeWindow, entityToOpen, entityIdToOpen);
        };
        CommandBarActions.setStateUpdate = function (entityId, entityName, stateCode, statusCode, closeWindow, entityToOpen, entityIdToOpen) {
            XrmCore.Commands.Common.setState(entityId, entityName, stateCode, statusCode, closeWindow, entityToOpen, entityIdToOpen);
        };
        CommandBarActions.handleStateChangeAction = function (entityName, id, activate, gridControl) {
            XrmCore.Commands.Common.handleStateChangeAction(entityName, id, activate, gridControl);
        };
        CommandBarActions.closeSetStateDialogFromGridCallback = function (dialogParams, callbackParams, gridControl, callback) {
            XrmCore.Commands.Common.closeSetStateDialogFromGridCallback(dialogParams, callbackParams, gridControl, callback);
        };
        CommandBarActions.isWebClient = function () {
            return Xrm.Page.context.client.getClient() === Xrm.Constants.ClientNames.web;
        };
        CommandBarActions.isMobileCompanionApp = function () {
            return Xrm.Page.context.client.getClient() === Xrm.Constants.ClientNames.mobile;
        };
        /// <summary>
        /// Performs page refresh.
        /// </summary>
        /// <param name="shouldSaveAndRefresh"> Should the data be saved before refresh. Default value is true</param>
        CommandBarActions.performPageRefresh = function (shouldSaveAndRefresh) {
            if (shouldSaveAndRefresh === void 0) { shouldSaveAndRefresh = true; }
            Xrm.Page.data.refresh(shouldSaveAndRefresh).then(function () {
                Xrm.Page.ui.refreshRibbon();
            });
        };
        return CommandBarActions;
    }());
    CommandBarActions.isBusy = false;
    CommandBarActions.setFormDirty = function (isDirty) {
        //TODO: check if it can be done through other API
        var crmFormCtrl = $find("crmForm");
        crmFormCtrl && crmFormCtrl.SetFormDirty(isDirty);
    };
    CommandBarActions.performPageDataAndRibbonRefresh = function () {
        Xrm.Page.data.refresh(true).then(function () {
            Xrm.Page.ui.refreshRibbon();
        }, ClientUtility.ActionFailedHandler.actionFailedCallback);
    };
    CommandBarActions.executeFunction = function (callbackReference, value) {
        if (ClientUtility.DataUtil.isNullOrUndefined(callbackReference))
            return null;
        var callbackFunc = callbackReference._callback$i$0;
        if (ClientUtility.DataUtil.isNullOrUndefined(callbackFunc))
            return null;
        var context = callbackReference._context$i$0, parameters = callbackReference._parameters$i$0, values = [value];
        if (!ClientUtility.DataUtil.isNullOrUndefined(parameters))
            for (var i = 0; i < parameters.length; i++)
                values[i + 1] = parameters[i];
        try {
            return callbackFunc.apply(context, values);
        }
        catch ($$e_7) {
            Xrm.Navigation.openAlertDialog({ text: ClientUtility.StringProvider.getResourceString("Web.ipad.error.parentWindowClosed") });
        }
        return null;
    };
    CommandBarActions.openAlertDialogForSetStateMultipleError = function (gridControl) {
        var alertDialogStrings = { text: undefined };
        alertDialogStrings.text = ClientUtility.StringProvider.getResourceString("Error_Message_Action_MultipleErrorsFound");
        Xrm.Navigation.openAlertDialog(alertDialogStrings).then(function () {
            gridControl.refresh();
        });
    };
    CommandBarActions.openAlertDialogForDeleteMultipleError = function (gridControl) {
        var alertDialogStrings = { text: undefined };
        alertDialogStrings.text = ClientUtility.StringProvider.getResourceString("Error_Message_Action_MultipleErrorsFound");
        Xrm.Navigation.openAlertDialog(alertDialogStrings).then(function () {
            gridControl.refresh();
        });
    };
    ClientUtility.CommandBarActions = CommandBarActions;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="DataUtil.ts" />
var ClientUtility;
(function (ClientUtility) {
    var DateValidation = (function () {
        function DateValidation() {
        }
        DateValidation.validateStartDateIsSmallerThanEndDate = function (oStartDate, oEndDate, errorMessage, oDateToClear) {
            var startDate = oStartDate.getValue();
            var endDate = oEndDate.getValue();
            if (startDate && endDate && endDate < startDate) {
                var alertStrings = {
                    text: errorMessage
                };
                Xrm.Navigation.openAlertDialog(alertStrings);
                oDateToClear.setValue(null);
                oDateToClear.fireOnChange();
            }
        };
        DateValidation.isStartDateLessThanEndDate = function (oBeginDate, oEndDate, fixBeginDate, oBeginDateValue, oEndDateValue, errorMessage) {
            if (!ClientUtility.DataUtil.isNullOrUndefined(oBeginDate.getValue()) && !ClientUtility.DataUtil.isNullOrUndefined(oEndDate.getValue()) && oBeginDate.getValue() > oEndDate.getValue()) {
                var alertStrings = {
                    text: errorMessage
                };
                Xrm.Navigation.openAlertDialog(alertStrings, null);
                if (fixBeginDate) {
                    oBeginDate.setValue(oBeginDateValue);
                }
                else {
                    oEndDate.setValue(oEndDateValue);
                }
                return false;
            }
            return true;
        };
        return DateValidation;
    }());
    ClientUtility.DateValidation = DateValidation;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var ClientUtility;
(function (ClientUtility) {
    var EntityReference = (function () {
        function EntityReference(name, id) {
            this.Id = id;
            this.Name = name;
        }
        return EntityReference;
    }());
    ClientUtility.EntityReference = EntityReference;
    var EntityReferenceWebApi = (function () {
        function EntityReferenceWebApi(logicalName, id) {
            this.id = id;
            this.logicalName = logicalName;
        }
        return EntityReferenceWebApi;
    }());
    ClientUtility.EntityReferenceWebApi = EntityReferenceWebApi;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var ClientUtility;
(function (ClientUtility) {
    var EntityUtils = (function () {
        function EntityUtils() {
        }
        /**
         * Gets the entity type code for a given entity name.
         * @param entityName the name of the entity.
         * @param entityNames A constant map object that maps names to string literal names.
         * @param entityTypes A constant map object that maps names to type codes.
         * @return the entity type code.
         * @remarks the entityNames should contain a key/value pair where the value matches the
         * entityName parameter. The entityTypeCodes should contain a key with the same key value.
         */
        EntityUtils.getEntityTypeCode = function (entityName, entityNames, entityTypeCodes) {
            var propertyName = null;
            for (var key in entityNames) {
                if (entityNames.hasOwnProperty(key)) {
                    var value = entityNames[key];
                    if (value === entityName) {
                        propertyName = key;
                        break;
                    }
                }
            }
            return entityTypeCodes.hasOwnProperty(propertyName) ? entityTypeCodes[propertyName] : null;
        };
        /**
         * Gets the entity type name for a given entity type code.
         * @param entityTypeCode the type code of the entity.
         * @param entityNames A constant map object that maps names to string literal names.
         * @param entityTypes A constant map object that maps names to type codes.
         * @return the entity name.
         * @remarks the entityTypeCodes should contain a key/value pair where the value matches the
         * entityTypeCode parameter. The entityNames should contain a key with the same key value.
         */
        EntityUtils.getEntityTypeName = function (entityTypeCode, entityNames, entityTypeCodes) {
            var propertyName = null;
            for (var key in entityNames) {
                if (entityTypeCodes.hasOwnProperty(key)) {
                    var value = entityTypeCodes[key];
                    if (value === entityTypeCode) {
                        propertyName = key;
                        break;
                    }
                }
            }
            return entityNames.hasOwnProperty(propertyName) ? entityNames[propertyName] : null;
        };
        return EntityUtils;
    }());
    ClientUtility.EntityUtils = EntityUtils;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="DataUtil.ts" />
var ClientUtility;
(function (ClientUtility) {
    var NumberUtil = (function () {
        function NumberUtil() {
        }
        return NumberUtil;
    }());
    NumberUtil._defaultFormattingPrecision = 10;
    NumberUtil.addFormatting = function (value, precision, noTrailingZeroes) {
        Sys.Debug.assert(!ClientUtility.DataUtil.isNullOrUndefined(value), "Invalid value");
        Sys.Debug.assert(ClientUtility.DataUtil.isNullOrUndefined(precision) || precision >= 0, "Invalid precision");
        var decimalPlaces = ClientUtility.DataUtil.isNullOrUndefined(precision) || precision < 0 ? NumberUtil._defaultFormattingPrecision : precision;
        var localizedValue = value.localeFormat("n" + decimalPlaces.toString());
        if (ClientUtility.DataUtil.isNullOrUndefined(noTrailingZeroes)) {
            noTrailingZeroes = false;
        }
        if (!noTrailingZeroes) {
            try {
                if (value !== Number.parseLocale(localizedValue)) {
                    var correctNumber = value.toString(10);
                    var RealDecimalPlace = NumberUtil._findDecimalPlace(correctNumber, true);
                    var WrongDecimalPlace = NumberUtil._findDecimalPlace(localizedValue, false);
                    var buildResult = "";
                    var seperator = Sys.CultureInfo.CurrentCulture.numberFormat["NumberDecimalSeparator"].toString();
                    seperator = seperator.charAt(seperator.length - 1);
                    if (RealDecimalPlace <= WrongDecimalPlace) {
                        var offset = WrongDecimalPlace - RealDecimalPlace;
                        for (var i = 0; i < localizedValue.length; i++) {
                            var index = localizedValue.length - 1 - i;
                            if (localizedValue.charAt(index) === seperator) {
                                break;
                            }
                            if (i >= offset) {
                                buildResult = correctNumber.charAt(correctNumber.length - 1 - i + offset) + buildResult;
                            }
                            else {
                                buildResult = "0" + buildResult;
                            }
                        }
                        buildResult = localizedValue.substring(0, localizedValue.length - i) + buildResult;
                    }
                    if (value === Number.parseLocale(buildResult)) {
                        localizedValue = buildResult;
                    }
                }
            }
            catch (ex) {
            }
        }
        return localizedValue;
    };
    NumberUtil._findDecimalPlace = function (value, isInvariantCulture) {
        var cultureInfo = isInvariantCulture ? Sys.CultureInfo.InvariantCulture : Sys.CultureInfo.CurrentCulture;
        var seperator = Sys.CultureInfo.CurrentCulture.numberFormat["NumberDecimalSeparator"].toString();
        seperator = seperator.charAt(seperator.length - 1);
        for (var i = value.length - 1; i >= 0; i--) {
            if (value.charAt(i) === seperator) {
                return value.length - i - 1;
            }
        }
        return 0;
    };
    ClientUtility.NumberUtil = NumberUtil;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="EntitySetNames.ts" />
/// <reference path="EntityReference.ts" />
/// <reference path="NavigationPropertyNames.ts" />
/// <reference path="Guid.ts" />
var ClientUtility;
(function (ClientUtility) {
    var ODataUtil = (function () {
        function ODataUtil() {
        }
        /**
         * Gets the select query option for OData calls.
         * @param {string[]} selectParameters The attributes to select.
         * @return the select query option.
         */
        ODataUtil.getSelectOption = function (selectParameters) {
            return "?$select=" + selectParameters.join(",");
        };
        /**
         * Converts date to edm.date format.
         * @param {Date[]} date: The date.
         * @returns {string} The edm.date format.
         */
        ODataUtil.getEdmDate = function (date) {
            return date.toISOString().slice(0, 10);
        };
        /**
         * Returns the navigation property name for a given attribute.
         * @param attributeName The name of the attribute.
         * @param value the lookup value of the attribute.
         * @param navigationProperties dictionary to lookup the correct navigation
         * @returns The @odata.bind attribute name.
        */
        ODataUtil.getNavigationPropertyName = function (attributeName, value, navigationProperties) {
            if (value === void 0) { value = null; }
            if (navigationProperties === void 0) { navigationProperties = null; }
            var navigationPropertyName = null;
            if (value && navigationProperties && navigationProperties.length > 0) {
                var i = 0;
                while (!navigationPropertyName && i < navigationProperties.length) {
                    navigationPropertyName = navigationProperties[i].name(attributeName, value.logicalName);
                    i++;
                }
            }
            return navigationPropertyName || attributeName;
        };
        ODataUtil.getBindAttributeName = function (attributeName) {
            return attributeName + "@odata.bind";
        };
        /**
         * Returns the @odata.bind attribute value for the given entity and Id.
         * @param entityName The name of the entity.
         * @param entityId The Id of the entity.
         * @entitySetNames An array of IEntitySetNames objects; optional.
         * @returns The @odata.bind attribute name.
        */
        ODataUtil.getBindAttributeValue = function (entityName, entityId, entitySetNames) {
            var id = ClientUtility.Guid.create(entityId);
            var entitySetName = ODataUtil.getEntitySetName(entityName, entitySetNames) || '';
            return "/" + entitySetName + "(" + id + ")";
        };
        ODataUtil.getEntitySetName = function (entityName, entitySetNames) {
            var result = null;
            if (entityName && entitySetNames && entitySetNames.length > 0) {
                var i = 0;
                while (!result && i < entitySetNames.length) {
                    result = entitySetNames[i].name(entityName);
                    i++;
                }
            }
            return result;
        };
        /**
         * Returns the OData entity id from the WebApi response headers.
         * Header URL example: "http://org.contoso.com/org/api/data/v9.0/leads(bf3a132b-6d4b-e711-80ee-00155dc9e64a)"
         * @param oDataResponse The WebApi response.
         * @returns The OData entity id.
        */
        ODataUtil.getResponseEntityId = function (oDataResponse) {
            if (oDataResponse && oDataResponse.ok) {
                var entityIdUrl = oDataResponse.headers[this.ODataEntityId];
                if (ClientUtility.DataUtil.isNullOrUndefined(entityIdUrl)) {
                    entityIdUrl = oDataResponse.headers[this.ODataEntityId.toLowerCase()];
                }
                if (entityIdUrl) {
                    var urlSlice = entityIdUrl.slice(entityIdUrl.indexOf('(') + 1, entityIdUrl.indexOf(')'));
                    return urlSlice !== entityIdUrl ? urlSlice : null;
                }
            }
            return null;
        };
        return ODataUtil;
    }());
    ODataUtil.ODataEntityId = "OData-EntityId";
    ClientUtility.ODataUtil = ODataUtil;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var ClientUtility;
(function (ClientUtility) {
    var PageUtil = (function () {
        function PageUtil() {
        }
        /**
        * Gets the value from a page attribute matching attributeName.
        *
        * @tparam  T                        The attribute value type.
        * @param   {string} attributeName   The name of the attribute.
        *
        * @return  The attribute value.
        */
        PageUtil.getAttributeValue = function (attributeName) {
            var attribute = Xrm.Page.getAttribute(attributeName);
            if (attribute) {
                return attribute.getValue();
            }
            return null;
        };
        /**
        * Sets the value of a page attribute matching attributeName.
        *
        * @tparam  T                        The attribute value type.
        * @param   {string} attributeName   The name of the attribute.
        * @param   {string} attributeValue  The value of the attribute.
        *
        * @return  The attribute value.
        */
        PageUtil.setAttributeValue = function (attributeName, attributeValue) {
            var attribute = Xrm.Page.getAttribute(attributeName);
            if (attribute) {
                attribute.setValue(attributeValue);
            }
        };
        /**
        * Gets the value from a page data attribute matching attributeName.
        *
        * @tparam  T                        The attribute value type.
        * @param   {string} attributeName   The name of the attribute.
        *
        * @return  The attribute value.
        */
        PageUtil.getDataAttributeValue = function (attributeName) {
            if (Xrm.Page.data && Xrm.Page.data.attributes) {
                var attribute = Xrm.Page.data.attributes.get(attributeName);
                if (attribute) {
                    return attribute.getValue();
                }
            }
            return null;
        };
        /**
        * Gets the value from the page control matching controlName.
        *
        * @tparam T                     The control value type.
        * @param {string} controlName   The name of the control.
        *
        * @return  The value from the control.
        */
        PageUtil.getControlValue = function (controlName) {
            var control = this.getPageControl(controlName);
            if (control) {
                var controlAttribute = control.getAttribute();
                if (controlAttribute) {
                    return controlAttribute.getValue();
                }
            }
            return null;
        };
        /**
        * Sets the value of a page control matching controlName.
        *
        * @param {string} controlName   The name of the control.
        * @param {string} controlValue  The value of the control.
        *
        */
        PageUtil.setControlValue = function (controlName, controlValue) {
            var control = this.getPageControl(controlName);
            if (control) {
                var controlAttribute = control.getAttribute();
                if (controlAttribute) {
                    controlAttribute.setValue(controlValue);
                }
            }
        };
        /**
        * Disables or enables the control matching controlName based on the disabled flag.
        *
        * @param {string} controlName   The name of the control.
        * @param {boolean} disabled     The disabled flag, indicating if the control should be disabled.
        *
        */
        PageUtil.setControlDisabled = function (controlName, disabled) {
            var control = this.getPageControl(controlName);
            if (control) {
                control.setDisabled(disabled);
            }
        };
        ;
        /**
        * Shows or hides the control matching controlName based on the visibility flag.
        *
        * @param {string} controlName   The name of the control.
        * @param {boolean} visible      The visible flag, indicating if the control should be visible.
        *
        */
        PageUtil.setControlVisible = function (controlName, visible) {
            var control = this.getPageControl(controlName);
            if (control) {
                control.setVisible(visible);
            }
        };
        ;
        /**
        * Gets the value from the page lookup control matching controlName.
        *
        * @param {string} controlName   The name of the control.
        *
        */
        PageUtil.getLookupControlValue = function (controlName) {
            var controlItems = PageUtil.getControlValue(controlName);
            if (controlItems && controlItems.length > 0) {
                return controlItems[0];
            }
            return null;
        };
        /**
        * Specifies whether the lookup control matching controlName is set.
        *
        * @param {string} controlName   The name of the control.
        *
        */
        PageUtil.isLookupControlValueSet = function (controlName) {
            var lookupValue = PageUtil.getLookupControlValue(controlName);
            return PageUtil.isLookupValueSet(lookupValue);
        };
        /**
        * Specifies whether a lookup value is properly set.
        *
        * @param {string} lookupValue   The lookup value.
        *
        */
        PageUtil.isLookupValueSet = function (lookupValue) {
            return lookupValue && lookupValue.entityType && ClientUtility.Guid.tryCreate(lookupValue.id) !== ClientUtility.Guid.Empty;
        };
        /**
        * Gets a control matching controlName from the page.
        *
        * @tparam T                     The control type.
        * @param {string} controlName   The name of the control.
        *
        * @return  The control element.
        */
        PageUtil.getPageControl = function (controlName) {
            var control = Xrm.Page.getControl(controlName);
            if (control) {
                return control;
            }
            else {
                return Xrm.Page.ui.controls.get(controlName);
            }
        };
        return PageUtil;
    }());
    ClientUtility.PageUtil = PageUtil;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var ClientUtility;
(function (ClientUtility) {
    var Parameters = (function () {
        function Parameters() {
        }
        return Parameters;
    }());
    ClientUtility.Parameters = Parameters;
    var OpenParameters = (function (_super) {
        __extends(OpenParameters, _super);
        function OpenParameters() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return OpenParameters;
    }(Parameters));
    ClientUtility.OpenParameters = OpenParameters;
    /**
     * Interface for defining parameters on a Xrm.Utility.openEntityForm() request.
     */
    var FormOpenParameters = (function (_super) {
        __extends(FormOpenParameters, _super);
        function FormOpenParameters() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return FormOpenParameters;
    }(OpenParameters));
    ClientUtility.FormOpenParameters = FormOpenParameters;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var ClientUtility;
(function (ClientUtility) {
    var Polyfills = (function () {
        function Polyfills() {
        }
        return Polyfills;
    }());
    Polyfills.ctor = (function () {
        // startsWith has been added to the ECMAScript 6 specification and may not be available in all JavaScript implementations yet
        if (!String.prototype.startsWith) {
            String.prototype.startsWith = function (searchString, position) {
                position = position || 0;
                // ReSharper disable once SuspiciousThisUsage
                return this.substr(position, searchString.length) === searchString;
            };
        }
    })();
    ClientUtility.Polyfills = Polyfills;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var ClientUtility;
(function (ClientUtility) {
    /**
    * helper class that stores the begin and end date
    */
    var PreviousDateTimeValues = (function () {
        function PreviousDateTimeValues() {
            this._beginDate = null;
            this._endDate = null;
        }
        PreviousDateTimeValues.prototype.getBeginDate = function () {
            return this._beginDate;
        };
        PreviousDateTimeValues.prototype.setBeginDate = function (value) {
            this._beginDate = value;
            return value;
        };
        PreviousDateTimeValues.prototype.getEndDate = function () {
            return this._endDate;
        };
        PreviousDateTimeValues.prototype.setEndDate = function (value) {
            this._endDate = value;
            return value;
        };
        return PreviousDateTimeValues;
    }());
    ClientUtility.PreviousDateTimeValues = PreviousDateTimeValues;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../Localization/Provider/StringProvider.ts" />
var ClientUtility;
(function (ClientUtility) {
    var ProgressIndicator = (function () {
        function ProgressIndicator(message) {
            var _this = this;
            /*
             * Show the progress indicator, if not already shown.
            */
            this.show = function () {
                Xrm.Utility.showProgressIndicator(_this.message);
            };
            /*
             * Hide the progress indicator, if currently shown.
            */
            this.hide = function () {
                Xrm.Utility.closeProgressIndicator();
            };
            /*
             * Get a function that hides the progress indicator and then invokes the error callback.
            */
            this.hideOnError = function (func) {
                var _that = _this;
                // return a function that can be used as 'reject' handler
                return function (response) {
                    var args = Array.prototype.slice.call(arguments);
                    _that.hide();
                    return func ? func.apply(this, args) : undefined;
                };
            };
            /*
             * Get a function that hides the progress indicator and then invokes the success callback.
            */
            this.hideOnSuccess = function (func) {
                var _that = _this;
                // return a function that can be used as 'resolve' handler
                return function (response) {
                    var args = Array.prototype.slice.call(arguments);
                    _that.hide();
                    return func ? func.apply(this, args) : undefined;
                };
            };
            this.message = message || ClientUtility.StringProvider.getResourceString('Msg_Progress_MOCA_Dialog');
        }
        return ProgressIndicator;
    }());
    ClientUtility.ProgressIndicator = ProgressIndicator;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="DataUtil.ts" />
/// <reference path="EntityReference.ts" />
/// <reference path="EntitySetNames.ts" />
/// <reference path="NavigationPropertyNames.ts" />
/// <reference path="Guid.ts" />
/// <reference path="ODataUtil.ts" />
var ClientUtility;
(function (ClientUtility) {
    var AttributeTypes;
    (function (AttributeTypes) {
        AttributeTypes[AttributeTypes["Boolean"] = 0] = "Boolean";
        AttributeTypes[AttributeTypes["DateTime"] = 1] = "DateTime";
        AttributeTypes[AttributeTypes["Integer"] = 2] = "Integer";
        AttributeTypes[AttributeTypes["Lookup"] = 3] = "Lookup";
        AttributeTypes[AttributeTypes["PartyList"] = 4] = "PartyList";
        AttributeTypes[AttributeTypes["OptionSet"] = 5] = "OptionSet";
        AttributeTypes[AttributeTypes["String"] = 6] = "String";
        AttributeTypes[AttributeTypes["Money"] = 7] = "Money";
        AttributeTypes[AttributeTypes["Decimal"] = 8] = "Decimal";
        AttributeTypes[AttributeTypes["Double"] = 9] = "Double";
    })(AttributeTypes = ClientUtility.AttributeTypes || (ClientUtility.AttributeTypes = {}));
    var SdkSerializationHelper = (function () {
        function SdkSerializationHelper() {
        }
        SdkSerializationHelper.getEntityObject = function (entityName, entityId, overrideTypes, entitySetNames, navigationProperties) {
            var entityReference = new ClientUtility.EntityReferenceWebApi(entityName, entityId);
            var update = entityId !== ClientUtility.Guid.Empty;
            var result = {
                fieldValues: {},
                fieldTypes: {},
                changedFieldNames: []
            };
            Xrm.Page.data.entity.attributes.forEach(function (wrapper, index) {
                if (wrapper.getSubmitMode() !== "never")
                    if (update && wrapper.getIsDirty() || !update) {
                        var value = wrapper.getValue();
                        var attributeName = wrapper.getName();
                        var attributeType = overrideTypes[attributeName];
                        if (ClientUtility.DataUtil.isNullOrUndefined(attributeType)) {
                            attributeType = SdkSerializationHelper.getXrmAttributeType(wrapper);
                        }
                        var attribute = SdkSerializationHelper.getXrmObject(attributeName, value, attributeType, entitySetNames, navigationProperties);
                        // Skip filling attribute with null values, which will cause odata error when calling Xrm.WebApi.createRecord
                        if (!ClientUtility.DataUtil.isNullOrUndefined(attribute.value)) {
                            result.fieldValues[attribute.name] = attribute.value;
                            result.fieldTypes[attributeName] = attributeType;
                            if (wrapper.getIsDirty() || (!update && !ClientUtility.DataUtil.isNullOrUndefined(value))) {
                                result.changedFieldNames.push(attributeName);
                            }
                        }
                    }
            });
            return result;
        };
        SdkSerializationHelper.getXrmObject = function (name, value, attributeType, entitySetNames, navigationProperties) {
            var resultValue = null;
            if (!ClientUtility.DataUtil.isNullOrUndefined(value)) {
                switch (attributeType) {
                    case AttributeTypes.PartyList:
                        var parties = value;
                        var entities = new Array(parties.length);
                        for (var index = 0; index < parties.length; index++) {
                            var party = parties[index];
                            var reference = new ClientUtility.EntityReferenceWebApi(party.entityType, party.id);
                            var partyEntity = {
                                "partyid": reference
                            };
                            entities[index] = partyEntity;
                        }
                        resultValue = entities;
                        break;
                    case AttributeTypes.Lookup:
                        var items = value;
                        if (!ClientUtility.DataUtil.isNullOrUndefined(value) && items.length > 0) {
                            var item = items[0];
                            resultValue = new ClientUtility.EntityReferenceWebApi(item.entityType, item.id);
                        }
                        break;
                    case AttributeTypes.DateTime:
                        var dateValue = value;
                        dateValue = new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate(), dateValue.getHours(), dateValue.getMinutes());
                        resultValue = dateValue;
                    default:
                        resultValue = value;
                }
            }
            var result = {
                name: SdkSerializationHelper.getAttributeName(attributeType, name, resultValue, navigationProperties),
                value: SdkSerializationHelper.getAttributeValue(attributeType, entitySetNames, resultValue)
            };
            return result;
        };
        SdkSerializationHelper.getXrmAttributeType = function (wrapper) {
            var attributeType = wrapper.getAttributeType();
            switch (attributeType) {
                case Xrm.Constants.AttributeTypes.booleanType:
                    return AttributeTypes.Boolean;
                case Xrm.Constants.AttributeTypes.dateTimeType:
                    return AttributeTypes.DateTime;
                case Xrm.Constants.AttributeTypes.integerType:
                    return AttributeTypes.Integer;
                case Xrm.Constants.AttributeTypes.lookupType:
                    var isPartyList = !!wrapper && wrapper.getIsPartyList();
                    return isPartyList ? AttributeTypes.PartyList : AttributeTypes.Lookup;
                case Xrm.Constants.AttributeTypes.optionSetType:
                    return AttributeTypes.OptionSet;
                case Xrm.Constants.AttributeTypes.stringType:
                case Xrm.Constants.AttributeTypes.memoType:
                    return AttributeTypes.String;
                case Xrm.Constants.AttributeTypes.moneyType:
                    return AttributeTypes.Money;
                case Xrm.Constants.AttributeTypes.decimalType:
                    return AttributeTypes.Decimal;
                case Xrm.Constants.AttributeTypes.doubleType:
                    return AttributeTypes.Double;
                default:
                    throw new Error("attributeType '" + attributeType + "' is not supported");
            }
        };
        SdkSerializationHelper.getAttributeName = function (attributeType, name, value, navigationProperties) {
            var result = name;
            if (value) {
                switch (attributeType) {
                    case AttributeTypes.PartyList:
                    case AttributeTypes.Lookup:
                        result = ClientUtility.ODataUtil.getBindAttributeName(ClientUtility.ODataUtil.getNavigationPropertyName(name, value, navigationProperties));
                        break;
                }
            }
            return result;
        };
        SdkSerializationHelper.getAttributeValue = function (attributeType, entitySetNames, value) {
            var result = value;
            if (value) {
                switch (attributeType) {
                    case AttributeTypes.PartyList:
                    case AttributeTypes.Lookup:
                        result = ClientUtility.ODataUtil.getBindAttributeValue(value.logicalName, value.id, entitySetNames);
                        break;
                }
            }
            return result;
        };
        return SdkSerializationHelper;
    }());
    ClientUtility.SdkSerializationHelper = SdkSerializationHelper;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var ClientUtility;
(function (ClientUtility) {
    var StringUtil = (function () {
        function StringUtil() {
        }
        /**
            * @remarks Limited functionality implemented
            * @returns a formatted string, similar to string.Format in C#.
            */
        StringUtil.format = function (format) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var returnValue = format;
            for (var i = 1; i < arguments.length; i++) {
                var actualValue = typeof (arguments[i]) == "undefined" || arguments[i] == null ? "" : arguments[i].toString();
                returnValue = returnValue.replace(new RegExp("\\{" + (i - 1) + "\\}", 'g'), actualValue);
            }
            return returnValue;
        };
        StringUtil.trimBraces = function (input) {
            return input.replace(/{/g, "").replace(/}/g, "");
        };
        return StringUtil;
    }());
    StringUtil.StringEmpty = "";
    ClientUtility.StringUtil = StringUtil;
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="../StringUtil.ts" />
var ClientUtility;
(function (ClientUtility) {
    var CommandBarUtils = (function () {
        function CommandBarUtils() {
        }
        return CommandBarUtils;
    }());
    /*
     * Retrieves an element value from a given url element
     * @param urlElement The url element
     * @param elementToFind The element to find
     * @returns The element value
     */
    CommandBarUtils.getElementValue = function (urlElement, elementToFind) {
        var elementValue = ClientUtility.StringUtil.StringEmpty;
        var index = urlElement.indexOf(elementToFind);
        if (index !== -1) {
            elementValue = urlElement.substr(index + elementToFind.length + 1);
            index = elementValue.indexOf("&");
            elementValue = index !== -1 ? elementValue.substr(0, index) : elementValue;
        }
        return elementValue;
    };
    ClientUtility.CommandBarUtils = CommandBarUtils;
})(ClientUtility || (ClientUtility = {}));
/// <reference path="ClientUtils.ts" />
/// <reference path="DataUtils.ts" />
/// <reference path="CommandBarUtils.ts" /> 
var ClientUtility;
(function (ClientUtility) {
    var OperationType;
    (function (OperationType) {
        OperationType[OperationType["Operator"] = 0] = "Operator";
        OperationType[OperationType["Function"] = 1] = "Function";
    })(OperationType = ClientUtility.OperationType || (ClientUtility.OperationType = {}));
    var FilterExpression = (function () {
        function FilterExpression() {
            this.parent = null;
            this.opType = OperationType.Operator;
            this.isInverted = false;
            this.operation = '';
            this.operands = [];
            this.isGroup = false;
            this.pre = null;
        }
        FilterExpression.prototype.addp = function (p) {
            this.operands.push(p);
        };
        return FilterExpression;
    }());
    ClientUtility.FilterExpression = FilterExpression;
})(ClientUtility || (ClientUtility = {}));
///<reference path="./ODataQueryOptionData.ts" />
var ClientUtility;
(function (ClientUtility) {
    var FilterBuilderBase = (function () {
        function FilterBuilderBase() {
            this.filter = null;
        }
        FilterBuilderBase.prototype.build = function () {
            return this.filter;
        };
        return FilterBuilderBase;
    }());
    ClientUtility.FilterBuilderBase = FilterBuilderBase;
    var FilterValueBuilder = (function (_super) {
        __extends(FilterValueBuilder, _super);
        function FilterValueBuilder(filter) {
            var _this = _super.call(this) || this;
            _this.filter = filter;
            return _this;
        }
        FilterValueBuilder.prototype._not = function () {
            if (this.filter === undefined) {
                this.filter = new ClientUtility.FilterExpression();
            }
            this.filter.isInverted = true;
        };
        FilterValueBuilder.prototype._group = function (expression) {
            if (this.filter === undefined) {
                this.filter = new ClientUtility.FilterExpression();
            }
            expression.isGroup = true;
            this.filter.addp(expression);
        };
        FilterValueBuilder.prototype._field = function (field) {
            if (this.filter === undefined) {
                this.filter = new ClientUtility.FilterExpression();
            }
            this.filter.addp(field);
        };
        FilterValueBuilder.prototype._literal = function (literal) {
            if (this.filter === undefined) {
                this.filter = new ClientUtility.FilterExpression();
            }
            this.filter.addp(JSON.stringify(literal));
        };
        FilterValueBuilder.prototype._filter = function () {
            if (this.filter === undefined) {
                return undefined;
            }
            return this.filter.parent === null ? this.filter : this.filter.parent;
        };
        return FilterValueBuilder;
    }(FilterBuilderBase));
    ClientUtility.FilterValueBuilder = FilterValueBuilder;
    var FilterOneValueBuilderBase = (function (_super) {
        __extends(FilterOneValueBuilderBase, _super);
        function FilterOneValueBuilderBase() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FilterOneValueBuilderBase.prototype.group = function (expression) {
            this._group(expression);
            return new FilterOperatorBuilder(this._filter());
        };
        FilterOneValueBuilderBase.prototype.not = function () {
            this._not();
            return this;
        };
        FilterOneValueBuilderBase.prototype.field = function (field) {
            this._field(field);
            return new FilterOperatorBuilder(this._filter());
        };
        FilterOneValueBuilderBase.prototype.literal = function (literal) {
            this._literal(literal);
            return new FilterOperatorBuilder(this._filter());
        };
        return FilterOneValueBuilderBase;
    }(FilterValueBuilder));
    ClientUtility.FilterOneValueBuilderBase = FilterOneValueBuilderBase;
    /**
     * Builds FilterExpression with one parameter.
     */
    var FilterOneValueBuilder = (function (_super) {
        __extends(FilterOneValueBuilder, _super);
        function FilterOneValueBuilder() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FilterOneValueBuilder.prototype.not = function () {
            _super.prototype.not.call(this);
            return this;
        };
        FilterOneValueBuilder.prototype.fn = function () {
            return new FilterFuncBuilder(this._filter());
        };
        return FilterOneValueBuilder;
    }(FilterOneValueBuilderBase));
    ClientUtility.FilterOneValueBuilder = FilterOneValueBuilder;
    /**
     * Builds FilterExpression with one parameter (for functions).
     */
    var FilterOneValueFnBuilder = (function (_super) {
        __extends(FilterOneValueFnBuilder, _super);
        function FilterOneValueFnBuilder() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FilterOneValueFnBuilder.prototype.not = function () {
            _super.prototype.not.call(this);
            return this;
        };
        return FilterOneValueFnBuilder;
    }(FilterOneValueBuilderBase));
    ClientUtility.FilterOneValueFnBuilder = FilterOneValueFnBuilder;
    /**
     * Builds FilterExpression with multiple parameters (for functions).
     */
    var FilterManyValueFnBuilder = (function (_super) {
        __extends(FilterManyValueFnBuilder, _super);
        function FilterManyValueFnBuilder() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FilterManyValueFnBuilder.prototype.fieldn = function (field) {
            this._field(field);
            return new FilterManyValueFnBuilder(this.filter);
        };
        FilterManyValueFnBuilder.prototype.group = function (expression) {
            this._group(expression);
            return new FilterManyValueFnBuilder(this.filter);
        };
        FilterManyValueFnBuilder.prototype.not = function () {
            this._not();
            return this;
        };
        FilterManyValueFnBuilder.prototype.field = function (field) {
            this._field(field);
            return new FilterOneValueFnBuilder(this.filter);
        };
        FilterManyValueFnBuilder.prototype.literal = function (literal) {
            this._literal(literal);
            return new FilterOneValueFnBuilder(this.filter);
        };
        return FilterManyValueFnBuilder;
    }(FilterValueBuilder));
    ClientUtility.FilterManyValueFnBuilder = FilterManyValueFnBuilder;
    var FilterOpBuilder = (function (_super) {
        __extends(FilterOpBuilder, _super);
        function FilterOpBuilder() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FilterOpBuilder.prototype._add = function (op, opType) {
            var filter = new ClientUtility.FilterExpression();
            filter.operation = op;
            filter.opType = opType;
            return filter;
        };
        return FilterOpBuilder;
    }(FilterBuilderBase));
    ClientUtility.FilterOpBuilder = FilterOpBuilder;
    /**
     * Builds FilterExpression for OData functions.
     */
    var FilterFuncBuilder = (function (_super) {
        __extends(FilterFuncBuilder, _super);
        function FilterFuncBuilder(expression) {
            var _this = _super.call(this) || this;
            _this.filter = expression;
            return _this;
        }
        FilterFuncBuilder.prototype.startswith = function () {
            return this.addFunc(ClientUtility.FunctionName.startswith);
        };
        FilterFuncBuilder.prototype.endswith = function () {
            return this.addFunc(ClientUtility.FunctionName.endswith);
        };
        FilterFuncBuilder.prototype.substringof = function () {
            return this.addFunc(ClientUtility.FunctionName.substringof);
        };
        FilterFuncBuilder.prototype.addFunc = function (func) {
            var filter = this._add(func, ClientUtility.OperationType.Function);
            if (this.filter !== undefined) {
                this.filter.addp(filter);
                filter.parent = this.filter;
            }
            return new FilterManyValueFnBuilder(filter);
        };
        return FilterFuncBuilder;
    }(FilterOpBuilder));
    ClientUtility.FilterFuncBuilder = FilterFuncBuilder;
    /**
     * Builds FilterExpression for OData operators.
     */
    var FilterOperatorBuilder = (function (_super) {
        __extends(FilterOperatorBuilder, _super);
        function FilterOperatorBuilder(expression) {
            var _this = _super.call(this) || this;
            _this.filter = expression;
            return _this;
        }
        FilterOperatorBuilder.prototype.eq = function () {
            return this.addOp(ClientUtility.OperatorSymbol.Eq);
        };
        FilterOperatorBuilder.prototype.ne = function () {
            return this.addOp(ClientUtility.OperatorSymbol.Ne);
        };
        FilterOperatorBuilder.prototype.gt = function () {
            return this.addOp(ClientUtility.OperatorSymbol.Gt);
        };
        FilterOperatorBuilder.prototype.ge = function () {
            return this.addOp(ClientUtility.OperatorSymbol.Ge);
        };
        FilterOperatorBuilder.prototype.lt = function () {
            return this.addOp(ClientUtility.OperatorSymbol.Lt);
        };
        FilterOperatorBuilder.prototype.le = function () {
            return this.addOp(ClientUtility.OperatorSymbol.Le);
        };
        FilterOperatorBuilder.prototype.or = function () {
            return this.addOp(ClientUtility.OperatorSymbol.Or);
        };
        FilterOperatorBuilder.prototype.and = function () {
            return this.addOp(ClientUtility.OperatorSymbol.And);
        };
        FilterOperatorBuilder.prototype.addOp = function (operator) {
            var filter = this._add(operator, ClientUtility.OperationType.Operator);
            if (this.filter !== undefined) {
                filter.addp(this.filter);
            }
            return new FilterOneValueBuilder(filter);
        };
        return FilterOperatorBuilder;
    }(FilterOpBuilder));
    ClientUtility.FilterOperatorBuilder = FilterOperatorBuilder;
})(ClientUtility || (ClientUtility = {}));
var ClientUtility;
(function (ClientUtility) {
    var SelectBuilder = (function () {
        function SelectBuilder() {
        }
        SelectBuilder.prototype.columns = function () {
            var columns = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                columns[_i] = arguments[_i];
            }
            if (this.cols === undefined) {
                this.cols = [];
            }
            this.cols = columns;
            return this;
        };
        SelectBuilder.prototype.build = function () {
            return this.cols;
        };
        return SelectBuilder;
    }());
    ClientUtility.SelectBuilder = SelectBuilder;
})(ClientUtility || (ClientUtility = {}));
var ClientUtility;
(function (ClientUtility) {
    var OperatorSymbol;
    (function (OperatorSymbol) {
        OperatorSymbol.Eq = 'eq';
        OperatorSymbol.Ne = 'ne';
        OperatorSymbol.Gt = 'gt';
        OperatorSymbol.Ge = 'ge';
        OperatorSymbol.Lt = 'lt';
        OperatorSymbol.Le = 'le';
        OperatorSymbol.And = 'and';
        OperatorSymbol.Or = 'or';
        OperatorSymbol.Not = 'not';
    })(OperatorSymbol = ClientUtility.OperatorSymbol || (ClientUtility.OperatorSymbol = {}));
    var FunctionName;
    (function (FunctionName) {
        FunctionName.startswith = 'startswith';
        FunctionName.endswith = 'endswith';
        FunctionName.substringof = 'substringof';
    })(FunctionName = ClientUtility.FunctionName || (ClientUtility.FunctionName = {}));
})(ClientUtility || (ClientUtility = {}));
///<reference path="./ODataQueryFilterBuilder.ts" />
///<reference path="./ODataQuerySelectBuilder.ts" />
///<reference path="./ODataQueryOptionData.ts" />
///<reference path="./ODataQueryOptionConstants.ts" />
var ClientUtility;
(function (ClientUtility) {
    /**
     * Builds ODataQuery strings example usage:
     * var optionBuilder = new ODataQueryOptionsBuilder();
     * optionBuilder.$filter = OptionFactory.filter().field("alias").eq().literal("jacyang").and().field("location").eq().literal("advanta").build();
     * optionBuilder.$select = OptionFactory.select().columns("address", "lastname").build();
     * optionBuilder.build(); //$filter=name eq "jacyang" and location eq "advanta"&$select=address,lastname
     */
    var ODataQueryOptionsBuilder = (function () {
        function ODataQueryOptionsBuilder() {
            this.$filter = undefined;
            this.$select = undefined;
        }
        ODataQueryOptionsBuilder.prototype.build = function () {
            var builders = [];
            if (this.$filter !== undefined) {
                builders.push(new FilterOptionBuilder(this.$filter));
            }
            if (this.$select !== undefined) {
                builders.push(new SelectOptionBuilder(this.$select));
            }
            return builders.filter(function (builder) {
                return builder !== undefined;
            }).map(function (builder) {
                return builder.buildQueryString();
            }).join("&");
        };
        return ODataQueryOptionsBuilder;
    }());
    ClientUtility.ODataQueryOptionsBuilder = ODataQueryOptionsBuilder;
    /**
     * Creates option data structures.
     */
    var OptionFactory = (function () {
        function OptionFactory() {
        }
        /**
         * Creates a filter builder.
         */
        OptionFactory.filter = function () {
            return new ClientUtility.FilterOneValueBuilder();
        };
        /**
         * creates a select builder.
         */
        OptionFactory.select = function () {
            return new ClientUtility.SelectBuilder();
        };
        return OptionFactory;
    }());
    ClientUtility.OptionFactory = OptionFactory;
    /**
     * Builds $filter query parameter string from {FilterExpression}.
     */
    var FilterOptionBuilder = (function () {
        function FilterOptionBuilder(expression) {
            this.parameter = "$filter=";
            this.expression = expression;
        }
        /**
         * Builds the query value string.
         */
        FilterOptionBuilder.prototype.build = function () {
            var filterExpression = this.expression;
            if (typeof this.expression === "string") {
                return this.expression;
            }
            var expressionStr = '';
            switch (filterExpression.opType) {
                case ClientUtility.OperationType.Operator:
                    expressionStr = this.operatorString(filterExpression);
                    break;
                case ClientUtility.OperationType.Function:
                    expressionStr = this.functionString(filterExpression);
                    break;
                default:
                    break;
            }
            if ((filterExpression.isGroup || filterExpression.isInverted)) {
                expressionStr = (filterExpression.isInverted ? ClientUtility.OperatorSymbol.Not : '') + "(" + expressionStr + ")";
            }
            return "" + expressionStr;
        };
        /**
         * Builds the entire query parameter string.
         */
        FilterOptionBuilder.prototype.buildQueryString = function () {
            return "" + this.parameter + this.build();
        };
        /**
         * Gets the string representation for {FilterExpression} of type Operator.
         * @param {FilterExpression} expression The filter expression.
         */
        FilterOptionBuilder.prototype.operatorString = function (expression) {
            return this.getOperands(expression).map(function (operand) {
                return (new FilterOptionBuilder(operand).build());
            }).join(" " + expression.operation + " ");
        };
        /**
         * Gets the string representation for {FilterExpression} of type Function.
         * @param {FilterExpression} expression The filter expression.
         */
        FilterOptionBuilder.prototype.functionString = function (expression) {
            var args = this.getOperands(expression).map(function (operand) {
                return (new FilterOptionBuilder(operand).build());
            }).join(',');
            return expression.operation + "(" + args + ")";
        };
        FilterOptionBuilder.prototype.getOperands = function (filterExpression) {
            return filterExpression.operands.filter(function (expression) {
                return expression !== undefined;
            });
        };
        return FilterOptionBuilder;
    }());
    /**
     * Builds $select query parameter string from {FilterExpression}.
     */
    var SelectOptionBuilder = (function () {
        function SelectOptionBuilder(columns) {
            this.parameter = "$select=";
            this.columns = columns;
        }
        /**
         * Builds the query value string.
         */
        SelectOptionBuilder.prototype.build = function () {
            return "" + this.columns.join(",");
        };
        /**
         * Builds the entire query parameter string.
         */
        SelectOptionBuilder.prototype.buildQueryString = function () {
            return "" + this.parameter + this.build();
        };
        return SelectOptionBuilder;
    }());
})(ClientUtility || (ClientUtility = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
var ClientUtility;
(function (ClientUtility) {
    var ConsentDialog = (function () {
        function ConsentDialog() {
        }
        /**
         * Handler for ok button.
         * @param eventContext The event context.
         */
        ConsentDialog.onOkButtonClick = function (eventContext) {
            var formContext = eventContext.getFormContext();
            var dialogAttributes = formContext.data.attributes;
            dialogAttributes.get("is_confirmed").setValue(true);
            Xrm.Page.ui.close();
        };
        /**
         * Handler for cancel button.
         * @param eventContext The event context.
         */
        ConsentDialog.onCancelButtonClick = function (eventContext) {
            Xrm.Page.ui.close();
        };
        return ConsentDialog;
    }());
    ClientUtility.ConsentDialog = ConsentDialog;
})(ClientUtility || (ClientUtility = {}));
/// <reference path="DataContracts/Action/AddItemCampaignActivityRequest.ts" />
/// <reference path="DataContracts/Action/AddItemCampaignRequest.ts" />
/// <reference path="DataContracts/Action/AddToQueueRequest.ts" />
/// <reference path="DataContracts/Action/AssignRequest.ts" />
/// <reference path="DataContracts/Action/ConvertActivityRequest.ts" />
/// <reference path="DataContracts/Action/CopyCampaignRequest.ts" />
/// <reference path="DataContracts/Action/CopyCampaignResponseRequest.ts" />
/// <reference path="DataContracts/Action/CopyDynamicListToStaticRequest.ts" />
/// <reference path="DataContracts/Action/CreateActivitiesListRequest.ts" />
/// <reference path="DataContracts/Action/DistributeCampaignActivityRequest.ts" />
/// <reference path="DataContracts/Action/ExecuteWorkflowRequest.ts" />
/// <reference path="DataContracts/Action/MergeRequest.ts" />
/// <reference path="DataContracts/Action/PickFromQueueRequest.ts" />
/// <reference path="DataContracts/Action/ReleaseToQueueRequest.ts" />
/// <reference path="DataContracts/Action/RemoveFromQueueRequest.ts" />
/// <reference path="DataContracts/Action/RouteToRequest.ts" />
/// <reference path="DataContracts/Action/RecalculateRequest.ts" />
/// <reference path="DataContracts/ComplexType/ColumnSet.ts" />
/// <reference path="DataContracts/ComplexType/InputArgument.ts" />
/// <reference path="DataContracts/ComplexType/InputArgumentCollection.ts" />
/// <reference path="DataContracts/ComplexType/Object.ts" />
/// <reference path="DataContracts/ComplexType/WhoAmIResponse.ts" />
/// <reference path="DataContracts/Function/RetrieveUserPrivilegesRequest.ts" />
/// <reference path="DataContracts/Function/RetrievePrincipalAccessRequest.ts" />
/// <reference path="DataContracts/Function/RetrieveUserDefaultCurrencyRequest.ts" />
/// <reference path="DataContracts/Function/WhoAmIRequest.ts" />
/// <reference path="DataContracts/Function/GetClientMetadataRequest.ts" />
/// <reference path="ActionFailedHandler.ts" />
/// <reference path="AlertDialogStrings.ts" />
/// <reference path="ClientUtil.ts" />
/// <reference path="CommandBarActions.ts" />
/// <reference path="DataUtil.ts" />
/// <reference path="DateValidation.ts" />
/// <reference path="DialogUtil.ts" />
/// <reference path="EntityReference.ts" />
/// <reference path="EntitySetNames.ts" />
/// <reference path="EntityUtils.ts" />
/// <reference path="NavigationPropertyNames.ts" />
/// <reference path="Guid.ts" />
/// <reference path="NumberUtil.ts" />
/// <reference path="MetadataDrivenDialogConstants.ts" />
/// <reference path="ODataUtil.ts" />
/// <reference path="PageUtil.ts" />
/// <reference path="Parameters.ts" />
/// <reference path="Polyfills.ts" />
/// <reference path="PreviousDate.ts" />
/// <reference path="ProgressIndicator.ts" />
/// <reference path="SdkSerializationHelper.ts" />
/// <reference path="StringUtil.ts" />
/// <reference path="Utils.NoClientApi/Utils.ts" />
/// <reference path="ODataQueryOption/ODataQueryOptionsBuilder.ts" />
/// <reference path="ConsentDialog.ts" /> 
