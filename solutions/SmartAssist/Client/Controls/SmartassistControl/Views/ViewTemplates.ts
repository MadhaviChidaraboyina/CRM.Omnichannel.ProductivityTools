/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../CommonReferences.ts"/>

module MscrmControls.ProductivityPanel.Smartassist {
	export class ViewTemplates {
		public static CardContainerTemplate = '<div id = "{0}" class="' + Constants.SmartAssistCardContainerClass + '"></div>';
		public static DismissButtonTemplate = '<span class="symbolFont Cancel dismiss-button" id="' + Constants.SmartAssistDismissCardButtonId + '{0}"></span>';
		public static SuccessMessageTemplate = '<div class="' + Constants.SmartAssistSuccessMessageClass + '">{0}</div>';
		public static FailureMessageTemplates = '<div class="' + Constants.SmartAssistFailureClass + '">{0}</div>';
		public static SmartAssistTitleTemplate = '<div class="' + Constants.SmartAssistTitleClass + '"> {0} </div>';
	}
}