/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../CommonReferences.ts"/>

module MscrmControls.Smartassist.Suggestion {
	export class ViewTemplates {
		public static CustomActionResolveIcon = '<img alt= "icon" src={0} style="margin-right: 5px; width: 16px; height: 16px"><label>{1}</label></image>';
		public static CardContainerTemplate = '<div id = "{0}" class="' + Constants.RecommendationCardContainerClass + '"></div>';
		public static SuccessMessageTemplate = '<div role="img" aria-label="{2}" id= {0} class="' + Constants.CustomActionSuccessMessageClass + '" style="display: flex; height: auto">{1}</div>';
		public static FailureMessageTemplates = '<div role="img" aria-label="{2}" id = {0} class="' + Constants.CustomActionFailureMessageClass + '"style="display: flex; height: auto">{1}</div>';
	}
}