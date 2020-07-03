/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.SmartassistPanelControl {
    'use strict';

	/**
	 * Constants
	 */
    export class Constants {
        public static ControlId = "MscrmControls.SmartassistPanelControl.SmartassistPanelControl";
        public static currentContextChangeEeventId = "currentContextChangeEeventId";
        public static currentContextAnchorEntId = "currentContextAnchorEntId";
        public static currentContextCurrentCtxEntId = "currentContextCurrentCtxEntId";
        public static SessionCloseHandlerId = "SessionCloseHandlerId";
        public static SuggestionOuterContainer = "sa-suggestion-outer-container";
        public static SuggestionInnerDiv = "sa-suggestion-inner-div-";
        public static IncidentEntityName = "incident";
        public static CECEntityRecordType = "entityrecord";
        public static SAConfigCacheKey = "SAConfig";

        // CSS
        public static SAPanelLoaderCss = "sa-panel-loader";
        public static SAPanelLoaderParentCss = "sa-panel-loader-parent";
        public static SAPanelLoaderId = "sa-panel-loader-id";
        public static hideElementCss = "hide-element";        
        public static SAPanelLoaderDiv = '<div id="' + Constants.SAPanelLoaderId + '" class="hide-element ' + Constants.SAPanelLoaderParentCss + '"><div class="' + Constants.SAPanelLoaderCss + '"></div><label>{0}</label></div>';
        public static TitleDivCss = "sapanel-title-div";        
        public static TitleLabelCss = "sapanel-title-label";        
        public static TitleImgCss = "sapanel-title-img";
        public static SAPanelTitleIconPath = "/WebResources/msdyn_infoiconblue.svg";
        public static SAPanelTitleDiv = `<div class="${Constants.TitleDivCss}"><label class="${Constants.TitleLabelCss}">{0}</label><img class="${Constants.TitleImgCss}" src="${Constants.SAPanelTitleIconPath}"/></div>`;
        public static SAPanelStyle =
            `<style id="sa-panel-style">
	        .hide-element{
		        display:none !important;
	        }
			.sa-panel-loader-parent{
			    position: fixed;
				margin-left: 120px;
				top: 45%;
				color: #0078D4;
				font-family: Segoe UI;
				font-size: 12px;
				line-height: 16px;
				text-align: center;
			}
	        .sa-panel-loader{
		       border: 1px solid #C7E0F4;
			   border-radius: 50%;
			   border-top: 1px solid #0078D4;
			   width: 28.01px;
			   height: 28.01px;
			   -webkit-animation: spin 2s linear infinite;
			   animation: spin 2s linear infinite;
			   margin: 0 auto;
	        }
	        /* Safari */
	        @-webkit-keyframes spin {
	            0% { -webkit-transform: rotate(0deg); }
	            100% { -webkit-transform: rotate(360deg); }
	        }
	        @keyframes spin {
	            0% { transform: rotate(0deg); }
	            100% { transform: rotate(360deg); }
	        }
            .sapanel-title-div {
                font-family: Segoe UI;    
                line-height: 28px;
                margin: 10px 0px 0 15px;
            }
            .sapanel-title-label {
                font-size: 20px;
                color: #323130;
                font-weight: 600;
            }
            .sapanel-title-img {
                font-size: 16px;
                margin-left: 5px;
                height: 16px;
                width: 16px;
            }
        </style>`;
    }

    /**
    * Ids for localized strings from resx file
    */
    export class LocalizedStrings {
        public static SmartAssistControlHeader = "ControlHeader";
        public static SmartAssistSuccessMessage = "SuccessMessage";
        public static SmartAssistFailureMessage = "FailureMessage";
        public static LoadingText = "LoadingText";
        public static SuggestionControlTitle = "SuggestionControlTitle";

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
