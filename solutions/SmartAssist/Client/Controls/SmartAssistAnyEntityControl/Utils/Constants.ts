﻿/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

module MscrmControls.SmartAssistAnyEntityControl {

    /** Control level constants */
    export class StringConstants {
        public static AnyEntityContainer = "sa-anyentity-container-";
        public static AnyEntityInnerDiv = "sa-anyentity-inner-div-";
        public static PPChildControlId = "MscrmControls.SmartassistPanelControl.SmartassistPanelControl";

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
    }

    /**
	* Ids for localized strings from resx file
	*/
    export class LocalizedStrings {
        public static KnowledgeArticleTitle = "KnowledgeArticleSuggestionTitle";
        public static NoKnowledgeArticleText = "NoKMSuggestionText";
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
        SimilarCaseSuggestion = 192360001
    }
}