/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../CommonReferences.ts"/>

module MscrmControls.SmartAssistAnyEntityControl {
    export class ViewTemplates {
        private static TitleIconTemplate = '<img src="{0}" class="' + StringConstants.SuggestionsTitleIconCss + '">';
        private static TitleTextTemplate = '<div class="' + StringConstants.SuggestionsTitleDivCss + '" tabindex= "0">{0}<label class="' + StringConstants.SuggestionsTitLelabelCss + '">{1}</label></div>';
        private static NoSugegstionsIconTemplate = '<img src="{0}" class="' + StringConstants.NoSuggestionsIconCss + '">';
        private static NoSugegstionsTextTemplate = '<div class="' + StringConstants.NoSuggestionsDivCss + '" >{0}<label class="' + StringConstants.NoSuggestionsLabelCss + '">{1}</label></div>';
        //public static SALoader = '<div id="' + Utility.getLoaderComponent("{0}") + '" class="hide-element ' + StringConstants.SALoaderCss + '" ></div>';
        public static SALoader = '<div id="' + Utility.getLoaderComponent("{0}") + '" class="hide-element ' + StringConstants.SALoaderParentCss + '"><div class="' + StringConstants.SALoaderCss + '"></div><label>{1}</label></div>';

        /**
         * Gets html template for suggestions title.
         * @param icon: given html icon
         * @param text: label to display
         */
        public static getTitleTemplate(icon, text) {
            var iconTemp = "";
            if (!Utility.isNullOrEmptyString(icon))
                iconTemp = this.TitleIconTemplate.Format(icon);
            return this.TitleTextTemplate.Format(iconTemp, text ? text : "");
        }

        /**
         * Gets html template for no suggestions
         * @param suggestionType: SA config type
         */
        public static getNoSuggestionsTemplate(suggestionType: number) {
            var iconTemp = "";
            var text = ""
            if (!Utility.isNullOrEmptyString(StringConstants.NoRecordDivIconPath))
                iconTemp = this.NoSugegstionsIconTemplate.Format(StringConstants.NoRecordDivIconPath);

            switch (suggestionType) {
                case SuggestionType.KnowledgeArticleSuggestion:
                    text = Utility.getString(LocalizedStrings.NoKnowledgeArticleText);
                    break;
                case SuggestionType.SimilarCaseSuggestion:
                    text = Utility.getString(LocalizedStrings.NoSimilarCaseText);
                    break;
                default:
            }
            return this.NoSugegstionsTextTemplate.Format(iconTemp, text);
        }

    }
}