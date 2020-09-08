/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../CommonReferences.ts"/>

module MscrmControls.ProductivityPanel.TPBot {
	export class ViewTemplates {
		public static CardContainerTemplate = '<div id = "{0}" class="' + Constants.TPBotCardContainerClass + '"></div>';
		public static DismissButtonTemplate = '<span class="symbolFont Cancel dismiss-button" id="' + Constants.TPBotDismissCardButtonId + '{0}" tabindex="0"></span>';
		public static SuccessMessageTemplate = '<div class="' + Constants.TPBotSuccessMessageClass + '">{0}</div>';
		public static FailureMessageTemplates = '<div class="' + Constants.TPBotFailureClass + '">{0}</div>';
		public static TPBotTitleTemplate = '<div class="' + Constants.TPBotTitleClass + '"> {0} </div>';
	}
}