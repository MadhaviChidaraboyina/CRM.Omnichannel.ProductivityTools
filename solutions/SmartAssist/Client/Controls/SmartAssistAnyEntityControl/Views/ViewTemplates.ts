/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../CommonReferences.ts"/>

module MscrmControls.SmartAssistAnyEntityControl {
    export class ViewTemplates {
        private static TitleIconTemplate = '<img src="{0}" alt="icon" class="' + StringConstants.SuggestionsTitleIconCss + '">';
        private static TitleTextTemplate = '<div id="{0}" class="' + StringConstants.SuggestionsTitleDivCss + '" >{1}<label class="' + StringConstants.SuggestionsTitLelabelCss + '">{2}</label></div>';
        private static NoSugegstionsIconTemplate = '<img src="{0}" alt="icon" class="' + StringConstants.NoSuggestionsIconCss + '">';
        private static NoSugegstionsTextTemplate = '<div id="{0}" class="' + StringConstants.NoSuggestionsDivCss + '" >{1}<label class="' + StringConstants.NoSuggestionsLabelCss + '">{2}</label></div>';
        //public static SALoader = '<div id="' + Utility.getLoaderComponent("{0}") + '" class="hide-element ' + StringConstants.SALoaderCss + '" ></div>';
        public static SALoader = '<div id="' + Utility.getLoaderComponent("{0}") + '" class="hide-element ' + StringConstants.SALoaderParentCss + '"><div class="' + StringConstants.SALoaderCss + '"></div><label>{1}</label></div>';

        /**
         * Gets html template for suggestions title.
         * @param icon: given html icon
         * @param text: label to display
         */
        public static getTitleTemplate(divId, icon, text) {
            var iconTemp = "";
            if (!Utility.isNullOrEmptyString(icon))
                iconTemp = this.TitleIconTemplate.Format(icon);
            return this.TitleTextTemplate.Format(divId, iconTemp, text ? text : "");
        }

        /**
         * Gets html template for no suggestions
         * @param suggestionType: SA config type
         */
        public static getSuggestionTemplate(saConfig: SAConfig, anyEntityContainerState: AnyEntityContainerState) {
            var iconTemp = "";
            var text = ""
            if (!Utility.isNullOrEmptyString(StringConstants.NoRecordDivIconPath))
                iconTemp = this.NoSugegstionsIconTemplate.Format(StringConstants.NoRecordDivIconPath);

            switch (saConfig.SuggestionType) {
                case SuggestionType.KnowledgeArticleSuggestion:
                    text = anyEntityContainerState == AnyEntityContainerState.Disabled ? Utility.getString(LocalizedStrings.NoSettingsText) : Utility.getString(LocalizedStrings.NoKnowledgeArticleText);
                    break;
                case SuggestionType.SimilarCaseSuggestion:
                    text = anyEntityContainerState == AnyEntityContainerState.Disabled ? Utility.getString(LocalizedStrings.NoSettingsText) : Utility.getString(LocalizedStrings.NoSimilarCaseText);
                    break;
                default:
            }
            return this.NoSugegstionsTextTemplate.Format(StringConstants.NoSugegstionsDivId + saConfig.SmartassistConfigurationId, iconTemp, text);
        }
    }
}