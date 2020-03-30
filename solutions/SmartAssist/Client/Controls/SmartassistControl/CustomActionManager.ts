/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="CommonReferences.ts"/>

module MscrmControls.ProductivityPanel.Smartassist {


	export class CustomActionManager {

		public Name: string = "";
		public Parameters: any = {};
		public isValidAction: boolean = false;

		/* 
		 * Constructor
		 * @params ActionData Action data to be set to invoke Custom action on Action.Submit
		 */
		public constructor(ActionData: any) {
			if (!SmartassistControl._context.utils.isNullOrUndefined(ActionData)) {
				if (ActionData.CustomAction) {
					this.Name = ActionData.CustomAction;
				}
				if (ActionData.CustomParameters) {
					this.Parameters = ActionData.CustomParameters
				}
				this.ValidateCustomAction();
			}
		}

		/* 
		 * Validate Custom Action Data
		 **/
		private ValidateCustomAction(): void {
			switch (this.Name) {
				case CustomActionConstants.SendKB:
				case CustomActionConstants.OpenKB:
					// Verify whether link is present in Custom action parameters 
					if (this.Parameters && this.Parameters.kbLink) {
						this.isValidAction = true;
					}
					break;
				default:
					// Custom CustomAction
					this.isValidAction = true;
					break;
			}
		}

		/*
		 * Custom Action to Copy to conversation control
		 * (i.e) Copies the URL to conversation control
		 **/
		public CustomActionSendKB(): any {
			let evt = new CustomEvent(CustomActionConstants.onSendKBEvent, {
				"detail": {
					"title": "KB Article",
					"link": this.Parameters.kbLink
				}
			});
			window.top.dispatchEvent(evt);
			return Promise.resolve();
		}

		/*
		 * Custom Action to open KB article in a new browser tab
		 **/
		public CustomActionOpenKB(): void {
			window.open(this.Parameters.kbLink);
			Promise.resolve();
		}

	}
}