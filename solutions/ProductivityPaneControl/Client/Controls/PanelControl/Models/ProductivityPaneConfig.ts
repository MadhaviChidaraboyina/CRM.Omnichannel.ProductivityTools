/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.ProductivityToolPanel {
	'use strict';

	export class ProductivityPaneConfig {
		// Attributes
		public productivityPaneState: boolean;
		public productivityPaneMode: boolean;

		constructor(productivityPaneState: boolean, productivityPaneMode: boolean) {
			this.productivityPaneState = productivityPaneState;
			this.productivityPaneMode = productivityPaneMode;
		}
	}

	export class SessionTemplateCriteria {
		//Attributes
		public SessionTemplateId : string;
		public IsAgentScriptAvailable : boolean;
		public IsSmartAssistAvailable : boolean;

		constructor(templateId: string, agentScript:boolean,smartAssist:boolean){
			this.SessionTemplateId = templateId;
			this.IsAgentScriptAvailable = agentScript;
			this.IsSmartAssistAvailable = smartAssist;
		}

	}


}