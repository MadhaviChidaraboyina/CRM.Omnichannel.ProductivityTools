/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../CommonReferences.ts"/>

module MscrmControls.ProductivityPanel {
	export class ViewTemplates {
		public static CardContainerTemplate = '<div id = "{0}" class="' + Constants.SmartAssistCardContainerClass + '"></div>';
		public static DismissButtonTemplate = '<span class="symbolFont Cancel dismiss-button" id="' + Constants.SmartAssistDismissCardButtonId + '{0}"></span>';
		public static SuccessMessageTemplate = '<div class="smart-assist-success">{0}</div>';
		public static FailureMessageTemplates = '<div class="smart-assist-failure">{0}</div>';
	}
}