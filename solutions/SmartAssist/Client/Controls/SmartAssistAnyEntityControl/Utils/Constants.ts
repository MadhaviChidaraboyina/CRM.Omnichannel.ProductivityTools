/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

module MscrmControls.SmartAssistAnyEntityControl {

    /** Control level constants */
    export class StringConstants {
        public static AnyEntityContainer = "sa-anyentity-container-";
        public static AnyEntityInnerDiv = "sa-anyentity-inner-div-";
        public static PPChildControlId = "MscrmControls.SmartassistPanelControl.SmartassistPanelControl";      
        public static TPBotUniqueName = "msdyn_sa_oc_thirdpartybot_config";      
        public static isSmartAssistFound = "_isSmartAssistFound";      
        public static UserEntityName = "systemuser";      
        public static FetchOperator = "?fetchXml=";
        public static LocCacheString = "SAlocStrings";
        public static EnglishLanguageCode = "1033";
        public static SmartAssistPaneId = "AppSidePane_MscrmControls.SmartassistPanelControl.SmartassistPanelControl";
		public static FCB_ProductivityTools_UseAppSidePanes = "ProductivityTools.UseAppSidePanes";
		public static FCB_October2021Update = "October2021Update";
        public static FCB_October2022Update = "October2022Update";

        //FPBot
        public static ConversatonControlOrigin = "ConversatonControlOrigin";
        public static ServiceEndpointEntity = "serviceendpoint";
        public static LWIEntityName = "msdyn_ocliveworkitem";
        public static CDNEndpointFilter = "?$filter=name eq 'oc-cdn-endpoint'";
        public static FPBTag = "FPB";

        // css
        public static AnyentityStyleTemplateId = "smartassist-anyentity-style";
        public static SuggestionsTitleDivCss = "sa-suggestion-title-div";
        public static SuggestionsTitleIconCss = "sa-suggestions-title-icon";
        public static SuggestionsTitLelabelCss = "sa-suggestions-title-label";
        public static NoSuggestionsDivCss = "sa-no-suggestion-div";
        public static NoSuggestionsIconCss = "sa-no-suggestions-icon";
        public static NoSuggestionsLabelCss = "sa-no-suggestions-label";
        public static NoRecordDivIconPath = "/WebResources/msdyn_infoicongrey.svg";
        public static SALoaderCss = "sa-loader";
        public static SALoaderParentCss = "sa-loader-parent";
        public static hideElementCss = "hide-element";
        public static LoaderTimeout = 200;
        public static DismissCardEvent = 'dismissCard';
        public static NoSugegstionsDivId = "noSuggestionsDiv-";
        public static TitleDivId = "saConfigTitleDiv-";

        public static InitializeAnalytics = 'msdyn_InitializeAnalytics';
        public static SuggestionsModelingStatusKey = 'IsSASuggestionsModelingTriggered';
        public static DataInsightsAndAnalyticsFeature = 'msdyn_datainsightsandanalyticsfeature';
        public static CaseSuggestionFeatureId = 'b0d7f44e-b949-4e2f-b0eb-62b5dcf4e76a';
        public static KbSuggestionFeatureId = 'fc5d5a26-e8c6-4feb-a441-2a471efbe350';
        public static suggestionFcsNameSpace = 'FCS_SASuggestion';
        public static suggestionFcsKey = 'DefaultOnFeatureControl';
        public static date = '2022-05-20T24:00:00Z';
    }

    /**
	* Ids for localized strings from resx file
	*/
    export class LocalizedStrings {
        public static KnowledgeArticleTitle = "KnowledgeArticleSuggestionTitle";
        public static NoKnowledgeArticleText = "NoKMSuggestionText";
        public static NoSettingsText = "NoSettingsText";
        public static SimilarCaseTitle = "SimilarCasesSuggestionTitle";
        public static NoSimilarCaseText = "NoSimilarCaseSuggestionText";
        public static LoadingText = "LoadingText";
    }

    /**Smart assist config type */
    export class RecommendationEntityType {
        public static KM = "KM";
        public static Case = "Case";
    }

    /**Adaptive Card States Enum */
    export enum CardStates {
        New = 1,
        Default,
        Applied,
        Error
    }

    /**SA config suggestion rendering control type  */
    export enum SuggestionControlType {
        AdaptiveCard = 192360000
    }

    /**Smart assit config status type */
    export enum SAConfigStatus {
        Active = 1,
        Inactive = 2
    }

    /**Smart Assit Configuration Type KM or Case */
    export enum SuggestionType {
        KnowledgeArticleSuggestion = 192360000,
        SimilarCaseSuggestion = 192360001,
        BotSuggestion = 192360002
    }

    /**Empty status enum*/
    export enum AnyEntityContainerState {
        /**Just show that section which is enabled:s
         * 1. Suggestions turned ON,
         * 2. Supported Source entity
         * 3. Valid SAConfig - SAConfig is present or not
         * */
        Enabled = 0,
        /** No Suggestions Screen:
         * 1. Unsupported Source entity
         * 2. Source Entity ID is empty - opening a new session with create screen
         * */
        NoSuggestions = 1,
        /**AI suggestions not turned ON:
         * 1. Both are disabled and TPB not configured
         * */
        Disabled = 2
    }
}