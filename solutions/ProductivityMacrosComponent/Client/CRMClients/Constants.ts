/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/** @internal */
namespace Microsoft.ProductivityMacros {

	export class Constants {
		public static AppName = "appName";
		public static ClientUrl = "clientUrl";
		public static AppUrl = "appUrl";
		public static OrgLcid = "orgLcid";
		public static OrgUniqueName = "orgUniqueName";
		public static UserId = "userId";
		public static UserLcid = "userLcid";
		public static UserName = "username";
		public static UserRoles = "userRoles";
		public static OrgId = "orgId";
		public static crmVersion = "crmVersion";
		public static SuffixTabId = ".TabId";
		public static SuffixEntityName = ".EntityName";
		public static SuffixEntityId = ".EntityId";
        public static SuffixPageType = ".PageType";
        public static SuffixPrimaryNameAttributeValue = ".PrimaryNameAttributeValue";
		public static OutputResult = "result";
		public static StatusSucceded = "Succeeded";
		public static StatusFailed = "Failed";
		public static StatusSkipped = "Skipped";
		public static ActionSuccessfull = "Action performed successfully";
		public static SplitByDot = ".";
		public static typeOfExecution = "Microsoft.Logic/workflows/runs";
		public static typeOfDefinition = "Microsoft.Logic/workflows/versions";
	}

	export class ActionTypes {
		public static CREATE_NEW = "Create_New";
		public static OPEN_FORM = "Open_Form";
		public static OPEN_GRID = "Open_Grid";
		public static OPEN_KNOWLEDGE_SEARCH = "Open_knowledge_search";
		public static SEARCH_KNOWLEDGE_BASE = "Search_knowledge_base";
		public static SEARCH_BY_RELEVANCE = "Search_by_relevance";
		public static UPDATE_RECORD = "Update_Record";
		public static OPEN_ASSOCIATED = "Open_Associated";
		public static DRAFT_EMAIL = "Draft_Email";
		public static GET_ENVIRONMENT = "Get_Environment";
		public static RESOLVE_INCIDENT = "Resolve_Case";
		//P2
		public static OPEN_DASHBOARD = "Open_Dashboard";
		
    }

    export class Attributes {
        public static commmonAttributes: string[] = ["modifiedby", "createdby", "createdonbehalfby", "createdon", "statuscode", "statecode", "ownerid", "modifiedon", "owningbusinessunit", "FormattedValue", "owninguser"];
    }

	export class SlugPrefix {
		public static SPLIT_BY_OPENING_BRACKET = "(";
		public static SPLIT_BY_DOT = ".";
        public static SPLIT_BY_COMMA = ",";
        public static SPLIT_BY_DOLLAR = "$";
    }

    export class EntityName {
        public static ActionTemplateEntityName = "msdyn_macroactiontemplate_v2";
		public static ConnectorEntityName = "msdyn_macroconnector_v2";
		public static RunHistoryEntity = "msdyn_macrosession";
		public static WorkflowEntity = "workflow"
	}

}