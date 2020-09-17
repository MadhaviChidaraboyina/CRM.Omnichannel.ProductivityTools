/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.Smartassist.Suggestion {
	'use strict';

	/**
	 * Key codes used for keyboard accessibility
	 */
	export enum KeyCodes {
		TAB_KEY = 9,
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
		public static CustomActionSuccessMessageClass = "ca-success-message";
		public static CustomActionFailureMessageClass = "ca-failure-message";
		public static CustomActionSuccessStyle = "ca-success-style";
		public static CustomActionErrorStyle = "cs-failure-style";
		public static SuccessImageEncode = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAQCAYAAADwMZRfAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGWSURBVHgBlVRNToJBDH0zoiEqydxAPIEcwBg8gdwAOIG4U1CBKMYlrlwCJ1BPADHu/TiB3MCaYEKigK8DGH4Fm8x8aad9nbZvPoMpcRnnsIUUDI6oxtTEJVwBeqjJjVSnY+wEwLmLI4LXIUARbezKtRj9et0g7i7cm/ebJ+7SJXn4vtBhLJHLEYj+I5vxB6cuijXU0cWh3EoLS8RlXYz+D/ga+A/KWUee+91KAEzIvgToo4YQKmqz/hY9xKUk5aUAOVdhYMorIah/TAdhqegEmisBsHw2uqC6FER4mydsIqHlxNiZ4NdZR7wIoCSpiQODFucbtTMpI8hzjJWlAGNi2Y8WEXdGBrmSE9qMAi0FMNjjRAOLDTyytsR4GT6o58f/5w2gregPW0EC1bkK+IeQbMfDmw5p/4008yY9iVYBUFp0keEqqr6mW+elI+H98Ae1+/BBuNl57rQWAuizsGS3xRlJ11CbmXHok4UWDc/INgIpi/h+bXs+5WmPMipNvjRGcWZutqxLEUgf2OSvQMn1iaoCj/v/AFT9mvKsZoIJAAAAAElFTkSuQmCC';
		public static ErrorImageEncode = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADySURBVHgBlZPNDYJAEIUfXEw8UQIlUIJ0oSelAmiFCtSTerIE7EA6kBI4mXgR32PRrCLiTjKBzH5vlvnBw4ftgJUHLPka0QN6TS8bYLsANjbrWaLQB46E6juQ34BTwvc1E0yAGc9SYiHPYyap7NvCPXChZ/hhOhcn3g6OCu0EB+D8qpGBYgBsBuKFdL6aoxrhYOKlYx8QqTkuYvEURxIHiRnH3yae9QQSt+NwEYvnzbXEpeb4DZpbe2CbeN5c+tqcbgF6NtRt8dI9IZc5p+K7JG36GCY4tmH6wqzj33fbM8tS8Zlfrd2emhp7u91riMtf9QAM/1hcZmWVXAAAAABJRU5ErkJggg==';
	}

	export class LocalizedStrings {
		public static CustomActionSuccessMessage = "SuccessMessage";
		public static CustomActionFailureMessage = "FailureMessage";
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

		/**
		 * Get Telemetery params
		 * @param additionalParameters
		 * @param suggestionId
		 */
		public static getTelemetryParameter(additionalParameters: Mscrm.EventParameter[], suggestionId: string): Mscrm.EventParameter[] {
			var entityContext = Util.getSuggestedForRecordIdAndEntityLogicalName();
			var params: Mscrm.EventParameter[] = [
				{ name: "SuggestionForEntityId", value: entityContext.recordId },
				{ name: "SuggestedForEntityLogicalName", value: entityContext.entityLogicalName },
				{ name: "UISuggestionId", value: suggestionId }
			]
			if (additionalParameters) {
				return params.concat(additionalParameters);
            }
			return params;
		}

		/**
		 * Get anchor tab entitycontext.
		 * */
		public static getSuggestedForRecordIdAndEntityLogicalName(): any {
			var context = RecommendationControl.anchorTabContext;
			if (context) {
				//Get anchor context
				var anchorContext = context.getTabContext("anchor") as any;
				let recordId;
				if (anchorContext.entityName == "msdyn_ocliveworkitem" && anchorContext.data != null) {
					recordId = anchorContext.data.ocContext.config.sessionParams.LiveWorkItemId;
				}
				else {
					recordId = anchorContext.entityId;
                }
				return {
					recordId: recordId,
					entityLogicalName: anchorContext.entityName
				};
			}
			return {};
		}
	}

	export class TelemetryEventTypes {
		public static CustomActionActivityFailed = "MscrmControls.Smartassist.RecommendationControl.OnExecuteAction.Failed";
		public static CustomActionActivitySuccess = "MscrmControls.Smartassist.RecommendationControl.OnExecuteAction.Succeed";
		public static CustomActionInvocationFailed = "MscrmControls.Smartassist.RecommendationControl.CustomActionInvocationFailed";
		public static CustomActionInvocationSuccess = "MscrmControls.Smartassist.RecommendationControl.CustomActionInvocationSucceed";
		public static AdaptiveCardRenderingFailed = "MscrmControls.Smartassist.RecommendationControl.RenderAdaptiveCard.Failed";
		public static AdaptiveCardRenderingSucceed = "MscrmControls.Smartassist.RecommendationControl.RenderAdaptiveCard.Succeed";
		public static TemplateParsingCompleted = "MscrmControls.Smartassist.RecommendationControl.TemplateParsing.Completed";
		public static InitStarted = "MscrmControls.Smartassist.RecommendationControl.InitStarted";
		public static InitFailed = "MscrmControls.Smartassist.RecommendationControl.InitFailed";
		public static HandleCardRefreshOrDismissFailed = "MscrmControls.Smartassist.RecommendationControl.HandleCardRefreshOrDismiss.Failed";
		public static CardRefreshInitiated = "MscrmControls.Smartassist.RecommendationControl.CardRefresh.Initiated";
		public static CardDismissInitiated = "MscrmControls.Smartassist.RecommendationControl.CardDismiss.Initiated";
		public static ActionNotSupported = "MscrmControls.Smartassist.RecommendationControl.ActionNotSupported"; 
		public static CustomActionValidationFailed = "MscrmControls.Smartassist.RecommendationControl.CustomActionValidationFailed"
	}
}
