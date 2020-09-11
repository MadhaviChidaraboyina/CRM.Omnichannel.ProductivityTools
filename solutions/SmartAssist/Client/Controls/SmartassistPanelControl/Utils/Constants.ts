/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.SmartassistPanelControl {
    'use strict';

    /**
     * Keyboard key codes
     * */
    export enum KeyCodes {
        TAB_KEY = 9,
        ENTER_KEY = 13,
        ESCAPE_KEY = 27,
        SPACE_KEY = 32,
        UP_ARROW_KEY = 38,
        DOWN_ARROW_KEY = 40
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
        public static TitleIconInfoText = "SuggestionControlTitleIconText";
        public static InfoIcon = "SmartAssistInformationIcon";

        //Accessibility Labels
        public static Accessibility_ExecutedTextStepIndicator = "StepListItem_ExecutedTextStepAccessibilityLabel";
    }

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
        public static SAPanelInfoIcon = "sapanel-info-icon";
        public static SAAnyEntityControlContainerId = "SAAnyEntityControl_";
        public static FPBTag = "FPB";
        public static TPBTag = "smartbot";
        public static UserEntityName = "systemuser";
        public static FetchOperator = "?fetchXml=";

        //AppConfig
        public static saAppRealtionName = "msdyn_smartassistconfig_msdyn_appconfig";
        public static appIdSchema = "msdyn_appconfigurationid";
        public static appConfigEntityName = "msdyn_appconfiguration";
        public static uniqueNameSchema = "msdyn_uniquename";
        public static ocAppName = "msdyn_oehapp";

        //TPBot
        public static ConversatonControlOrigin = "ConversatonControlOrigin";
        public static ServiceEndpointEntity = "serviceendpoint";
        public static LWIEntityName = "msdyn_ocliveworkitem";
        public static CDNEndpointFilter = "?$filter=name eq 'oc-cdn-endpoint'";
        public static ValidSourceEntities = [Constants.LWIEntityName, Constants.IncidentEntityName];

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
        public static IconPopOutId = "IconPopOutId";
        public static SAPanelTitleIconInfoDiv = `<div role="button" aria-label="{2}" id="sapanel-info-icon" tabindex="0" class="popup"><img alt="icon" class="popup ${Constants.TitleImgCss}" src="${Constants.SAPanelTitleIconPath}"/><span tabindex="-1" class="popuptext" id="${Constants.IconPopOutId}">{1}</span></div>`;
        public static SAPanelTitleDiv = `<div class="${Constants.TitleDivCss}" ><label class="${Constants.TitleLabelCss}">{0}</label>${Constants.SAPanelTitleIconInfoDiv}</div>`;
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
            .popup {
              position: relative;
              display: inline-block;
              cursor: pointer;
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
            }

            /* The actual popup */
            .popup .popuptext {
	            visibility: hidden;
                background-color: #fff;
                color: #323130;
                text-align: center;
                border-radius: 2px;
                padding: 6px;
                position: fixed;
                z-index: 1;
                margin-left: -111px;   
                opacity: 1;
                width: 184px;
                max-height: 52px;   
                margin-top: 35px;
                font-family: Segoe UI;
                font-style: normal;
                font-weight: normal;
                font-size: 12px;
                box-shadow: 0.5px 0.5px 10px #ccc !important;
                position:absolute;
                line-height: 16px;
            }
            /* Popup arrow */
            .popup .popuptext::after {
                content: "▲";
                position: absolute;
                top: -16px;
                left: 47%;
                color: #fff;
                font-size: 25px;
                text-shadow: 1px -3px 6px #ccc;
            }
            /* Toggle this class - hide and show the popup */
            .popup .show {
              visibility: visible;
              -webkit-animation: fadeIn .5s;
              animation: fadeIn .5s;
            }

            /* Add animation (fade in the popup) */
            @-webkit-keyframes fadeIn {
              from {opacity: 0;} 
              to {opacity: 1;}
            }

            @keyframes fadeIn {
              from {opacity: 0;}
              to {opacity:1 ;}
            }
        </style>`;
        public static SAPanelControlDivCss = "overflow:auto;max-height:100%;width:100%;";
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
        SimilarCaseSuggestion = 192360001,
        BotSuggestion = 192360002
    }

    /**Suggestions Setting  status type */
    export enum SuggestionsSettingState {
        Active = 0,
        Inactive = 1
    }

    /**Empty status enum*/
    export enum AnyEntityContainerState {
        /**Just show that section which is enabled:
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
