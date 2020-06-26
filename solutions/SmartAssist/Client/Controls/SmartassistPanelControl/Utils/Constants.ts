/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.SmartassistPanelControl {
    'use strict';

	/**
	 * Constants
	 */
    export class Constants {
        public static currentContextChangeEeventId = "currentContextChangeEeventId";
        public static currentContextAnchorEntId = "currentContextAnchorEntId";
        public static currentContextCurrentCtxEntId = "currentContextCurrentCtxEntId";
        public static SessionCloseHandlerId = "SessionCloseHandlerId";
        public static SuggestionOuterContainer = "sa-suggestion-outer-container";
        public static SuggestionInnerDiv = "sa-suggestion-inner-div-";
        public static IncidentEntityName = "incident";
        public static CECEntityRecordType = "entityrecord";        
    }

	/**
	* Ids for localized strings from resx file
	*/
    export class LocalizedStrings {
        public static SmartAssistControlHeader = "ControlHeader";
        public static SmartAssistSuccessMessage = "SuccessMessage";
        public static SmartAssistFailureMessage = "FailureMessage";

        //Accessibility Labels
        public static Accessibility_ExecutedTextStepIndicator = "StepListItem_ExecutedTextStepAccessibilityLabel";
    }

	/**
	 * Telemetry main component names
	 */
    export class TelemetryComponents {
        public static MainComponent = "MainComponent";
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
