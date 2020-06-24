﻿/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.Smartassist.Suggestion {
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
	 * Constants
	 */
	export class Constants {
		public static EmptyString = "";
		public static UninitializedString = "UNINITIALIZED";

		public static RecommendationOuterContainer = "recommendation-outer-container";
		public static RecommendationCardContainerClass = "recommendation-card-container";
		public static CardNamePrefix = "card_";
		public static SessionCloseHandlerId = "SessionCloseHandlerId";
		public static PopupActionName = "PopupAction";
		public static PopupOverlayClassName = "ms-ctrl-overlay";
		public static PopupContainerId = "ac-popupAction";
		public static PopupContainerClassName = "ms-ctrl ms-ctrl-popup-container";
		public static CardNewClass = "new-card";
		public static FilterExpression = "$when";
		public static AdaptiveCardActionSetClassName = "ac-actionSet";
		public static AdaptiveCardActionButtonClassName = "ac-pushButton";
		public static PositiveFeedback = "yes";
		public static NegativeFeedback = "no";
		public static DissmissCardAction = "dismissCard";
		public static CustomActionName = "customActionName";
		public static CustomActionParams = "customActionParams";
	}

	/**
	 * Telemetry main component names
	 */
	export class TelemetryComponents {
		public static MainComponent = "MainComponent";
		public static AdaptiveCardHelper = "AdaptiveCardHelper";
	}

	export class Util {
		public static getSuggestionCardId(suggestionId: string) {
			return Suggestion.Constants.CardNamePrefix + suggestionId;
		}
	}
}
