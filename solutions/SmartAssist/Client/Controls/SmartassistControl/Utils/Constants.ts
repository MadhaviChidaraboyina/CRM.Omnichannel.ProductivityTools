/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.ProductivityPanel.Smartassist {
    'use strict';

	/**
	 * Key codes used for keyboard accessibility
	 */
    export enum KeyCodes {
        ENTER_KEY = 13,
        ESCAPE_KEY = 27,
        SPACE_KEY = 32,
        UP_ARROW_KEY = 38,
        DOWN_ARROW_KEY = 40
    }

	/**
	 * Card states
	 */
    export enum CardStates {
        New = 1,
        Default,
        Applied,
        Error
    }

    export enum SuggestionControlType {
        AdaptiveCard = 192350000
    }

    export enum SAConfigStatus {
        Active = 1,
        Inactive = 2  
    }

    export enum SuggestionType {
        KnowledgeArticleSuggestion = 192350000,
        SimilarCaseSuggestion = 192350001
    }

	/**
	 * Constants
	 */
    export class Constants {
        public static EmptyString = "";
        public static UninitializedString = "UNINITIALIZED";

        public static SmartAssistOuterContainer = "smartassist-outer-container";
        public static ServiceEndpointEntity = "serviceendpoint";
        public static CDNEndpointFilter = "?$filter=name eq 'oc-cdn-endpoint'";
        public static ConversatonControlOrigin = "ConversatonControlOrigin";
        public static SmartAssistTitleClass = "smart-assist-title";
        public static CardStatesSuffix = "_cardStates";
        public static CardCountSuffix = "_cardCount";
        public static ConversationCardsSuffix = "_cards";
        public static SmartAssistCardContainerClass = "smartassist-card-container";
        public static SmartAssistCardContainerIdPrefix = "cardContainer";
        public static SmartAssistDismissCardButtonId = "dismissCard";
        public static SmartAssistSuccessMessageClass = "smart-assist-success";
        public static SmartAssistFailureClass = "smart-assist-failure";
        public static SessionCloseHandlerId = "SessionCloseHandlerId";

        public static CardNewClass = "card-new";
        public static CardAppliedClass = "card-applied";
        public static CardErrorClass = "card-error";

        public static EnterKeyCode = 13;
        public static eventClick = "click";
        public static eventKeyPress = "keypress";

        public static customControlProperties = "_customControlProperties";

        //Recommendation 
        public static SuggestionOuterContainer = "sa-suggestion-outer-container";
        public static SuggestionInnerDiv = "sa-suggestion-inner-div-";
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
        public static ConversationStateManager = "ConversationStateManager";
        public static AdaptiveCardHelper = "AdaptiveCardHelper";
    }

    export class CustomActionConstants {
        // OOB CustomActions - KB
        public static SendKB: string = "SendKB";
        public static OpenKB: string = "OpenKB";
        public static OpenForm: string = "OpenForm";
        public static OpenCase: string = "OpenCase";
        public static CloneCase: string = "CloneCase";
        public static CloneEntity: string = "CloneEntity";
        public static EntityCaseName: string = "incident";
        public static RecordPageType: string = "entityrecord";

        // CIF Event to copy to conversation control
        public static onSendKBEvent: string = "onsendkbarticle";
    }
}
