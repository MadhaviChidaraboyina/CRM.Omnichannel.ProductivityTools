/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

module MscrmControls.SmartAssistAnyEntityControl {

    /** Control level constants */
    export class StringConstants {
        public static SuggestionOuterContainer = "sa-suggestion-outer-container";
        public static SuggestionInnerDiv = "sa-suggestion-inner-div-";

        public static NoRecordDivIcon = "";
        public static CaseEncodedIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAOCAYAAADwikbvAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACOSURBVHgB7ZLRDYIwFEXPsw7ACI7gIiYygi6gq7iAjRNowgA6kgMApQ0UCiWBhC8Szk/zbt/N+zmC55kZQoQfhXmg5IbhaJOk/buepF4JS02IfieU6oyIpuSOyl9c0n98xA/Dy1OZfXcsYCuvprzvTaEUTk836ewb6RmVvZqOTs8DBR+rZ9rqGSCjCs6kAicPMswh3Ik+AAAAAElFTkSuQmCC";
        public static KnowledgeArticleEncodedIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAOCAYAAADwikbvAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACOSURBVHgB7ZLRDYIwFEXPsw7ACI7gIiYygi6gq7iAjRNowgA6kgMApQ0UCiWBhC8Szk/zbt/N+zmC55kZQoQfhXmg5IbhaJOk/buepF4JS02IfieU6oyIpuSOyl9c0n98xA/Dy1OZfXcsYCuvprzvTaEUTk836ewb6RmVvZqOTs8DBR+rZ9rqGSCjCs6kAicPMswh3Ik+AAAAAElFTkSuQmCC";
        //TODO: Use string from localization
        public static SimilarCaseTitle = "Similar case suggestions";
        public static NoSimilarCaseText = "No suggestions found for similar cases";
        public static KnowledgeArticleTitle = "Knowledge article suggestions";
        public static NoKnowledgeArticleText = "No suggestions found for knowledge article";
    }

    /**
	* Ids for localized strings from resx file
	*/
    export class LocalizedStrings {
        public static KnowledgeArticleTitle = "KnowledgeArticleSuggestionTitle";
        public static NoKnowledgeArticleText = "NoKMSuggestionText";
        public static SimilarCaseTitle = "SimilarCasesSuggestionTitle";
        public static NoSimilarCaseText = "NoSimilarCaseSuggestionText";
    }

    /**Smart assist config type */
    export class RecommendationEntityType {
        public static KM = "KM";
        public static Case = "Case";
    }

    export class Styles {

        public static TitleDivStyle: { [key: string]: string } = {
            display: 'flex',
            marginBottom: '10px'
        }

    }

    export enum CardStates {
        New = 1,
        Default,
        Applied,
        Error
    }

    /**SA config suggestion rendering control type  */
    export enum SuggestionControlType {
        AdaptiveCard = 192350000
    }

    /**Smart assit config status type */
    export enum SAConfigStatus {
        Active = 1,
        Inactive = 2
    }

    /**Smart Assit Configuration Type KM or Case */
    export enum SuggestionType {
        KnowledgeArticleSuggestion = 192350000,
        SimilarCaseSuggestion = 192350001
    }
}