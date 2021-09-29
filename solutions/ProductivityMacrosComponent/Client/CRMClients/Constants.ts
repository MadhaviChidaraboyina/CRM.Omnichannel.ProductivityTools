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
        public static SuffixFlowId = ".flowId";
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
        public static DIALOG_FLOW_ID = "flow_id";
        public static DIALOG_FLOWS_ENVIRONMENT_ID = "environment_id";
        public static DIALOG_ORG_UNIQUE_NAME = "org_unique_name";
        public static DIALOG_ENTITY_LOGICAL_COLLECTION_NAME = "entity_logical_collection_name";
        public static DIALOG_ENTITY_LOGICAL_NAME = "entity_logical_name";
        public static DIALOG_DYNAMICS365_ACCESS_TOKEN = "dynamics365_access_token";
        public static DIALOG_FLOWS_AUTHENTICATION_STRING = "flows_authentication_string";
        public static DIALOG_DYNAMICS_365_ACCESS_TOKEN = "dynamics365_access_token";
        public static DIALOG_FLOWS_DESTINATION_URL = "flows_destination_url";
        public static DIALOG_FLOWS_FPI_SITE_URL = "flows_fpi_site_url";
        public static DIALOG_FLOWS_ENABLE_WIDGET_V2 = "flows_enable_widget_v2";
        public static FLOW_DESTINATION_URL = "MicrosoftFlowDestinationUrl";
        public static FLOW_FPI_URL = "MicrosoftFlowFirstPartyIntegrationSiteUrl";
        public static FLOW_FPI_URL_ENABLE_WIDGET_V2_PARAMETER = "&flowsEnableWidgetV2=true";
        public static DIALOG_HEIGHT = 600;
        public static DIALOG_WIDTH = 600;
        public static MICROSOFT_FLOWS_DIALOG = "MicrosoftFlowsDialog";
        public static FLOW_ENV_ID = "Flow_Env_Id";
        public static ENTITIES_ID = "entity_ids";
        public static POST_REQUEST = "POST";
        public static ENTITY_LOGICAL_NAME = "entityLogicalName";
        public static ENTITY_LOGICAL_COLLECTION_NAME = "entityLogicalCollectionName";
        public static FLOW_ID = "flowId";
        public static EVENTSOURCE_MACROS = "Macros"
        public static PAGE_TYPE = "pageType";
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
        public static LIST_FLOWS = "List_Flows";
		
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
        public static ActionTemplateEntityName = "msdyn_productivitymacroactiontemplate";
        public static ConnectorEntityName = "msdyn_productivitymacroconnector";
		public static RunHistoryEntity = "msdyn_macrosession";
		public static WorkflowEntity = "workflow"
    }

    export class OpenAppTabType {
        public static Data = "data";
        public static Url = "url";
        public static Relationship = "relationship";
        public static CreateFromEntity = "createfromentity";
        public static SearchType = "searchtype";

        public static CustomControlInputString = "customcontrol";
        public static ThirdPartyWebsiteInputString = "websiteurl";
        public static ThirdPartyWebsiteInputString1 = "thirdpartywebsite";
        public static EntityViewInputString = "entityview";
        public static DashboardInputString = "dashboard";
        public static EntityRecordInputString = "entityrecord";
        public static EntitySearchInputString = "entitysearch";
        public static SearchInputString = "search";
        public static WebResourceInputString = "webresource";

        public static Control = "control";
        public static Dashboard = "dashboard";
        public static Entitylist = "entitylist";
        public static Entityrecord = "entityrecord";
        public static Search = "search";
        public static Webresource = "webresource";
        public static ThirdPartyWebsite = "webresource"; //ThirdPartyWebsite
        public static Custom = "custom";

    }

}