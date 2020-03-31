/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="CommonReferences.ts"/>

module MscrmControls.ProductivityPanel.Smartassist {


	export class CustomActionManager {

		public Name: string = "";
		/*
		 * Parameters will contain
		 * kbLink - KBSearch
		 * recordId - RecordId for CustomAction OpenForm/OpenCase
		 * entityName - Logical Name of the entity for CustomAction OpenForm
		 * data - Other entity fields
		 **/
		public Parameters: any = {};
		public isValidAction: boolean = false;
		private logger: TelemetryLogger;

		/* 
		 * Constructor
		 * @params ActionData Action data to be set to invoke Custom action on Action.Submit
		 */
		public constructor(ActionData: any) {

			// Initialize Telemetry Repoter
			this.logger = new Smartassist.TelemetryLogger(SmartassistControl._context);

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
		 * Validate whethere Parameters contains the following data
		 * kbLink - KBSearch
		 * recordId - RecordId for CustomAction OpenForm/OpenCase
		 * entityName - Logical Name of the entity for CustomAction OpenForm/CreateEntity/CloneCase
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
				case CustomActionConstants.OpenForm:
					// Verify whether entityName and recordId are present in Custom action parameters
					if (this.Parameters && this.Parameters.entityId && this.Parameters.entityName) {
						this.isValidAction = true;
					}
					break;
				case CustomActionConstants.OpenCase:
					// Verify whether recordId is present in Custom action parameters
					this.Parameters.entityName = CustomActionConstants.EntityCaseName;
					if (this.Parameters && this.Parameters.entityId) {
						this.isValidAction = true;
					}
					break;
				case CustomActionConstants.CloneEntity:
					// Verify whether entityName is present in Custom action parameters
					if (this.Parameters && this.Parameters.entityName) {
						this.isValidAction = true;
					}
					break;
				case CustomActionConstants.CloneCase:
					this.Parameters.entityName = CustomActionConstants.EntityCaseName;
					this.isValidAction = true;
					break;
				default:
					// Custom CustomAction
					this.isValidAction = true;
					break;
			}
		}

		/*
		 * Custom Action to Copy to conversation control
		 * Sample action button json
		 * {
			"type" : "Action.Submit",
			"title" : "Send",
			"data" : {
				"CustomAction" : "SendKB",
				"CustomParameters" : {
					"kbLink" : "https://ocddemoebc.powerappsportals.com/knowledgebase/article/KA-01011/en-us"
				}
			}
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
		 * Sample action button json:
			{
			"type" : "Action.Submit",
			"title" : "Open",
			"data" : {
				"CustomAction" : "OpenKB",
				"CustomParameters" : {
					"entityId" : "8d443ab8-b581-445a-90e8-2a36de67ca58",
					"kbLink" : "https://ocvaebc.powerappsportals.com/knowledgebase/article/KA-01057/en-us"
				}
			}
		 **/
		public CustomActionOpenKB(): any {
			window.open(this.Parameters.kbLink);
			return Promise.resolve();
		}

		/*
		 * Custom Action to open Form in App tab using CIF
		 * Sample action button json:
		 * {
			"type": "Action.Submit",
			"title": "Open",
			"data": {
				"CustomAction": "OpenCase",
				"CustomParameters": {
					"entityName": "incident",
					"entityId": "c3356c37-bba6-4067-b1a1-8c66e1c203a1",
					"data": {}
				}
			}
		}
		 **/
		public CustomActionOpenForm() {

			let eventParameters = new Smartassist.EventParameters();
			eventParameters.addParameter("Message", "Running Custom Action - OpenForm");
			eventParameters.addParameter("Entity", this.Parameters.entityName);
			eventParameters.addParameter("RecordId", this.Parameters.recordId);

			try {

				var tabInput = {
					pageInput: {
						pageType: CustomActionConstants.RecordPageType,
						entityName: this.Parameters.entityName,
						entityId: this.Parameters.entityId,
						data: this.Parameters.data,
					},
					options: {
						isFocused: true
					}
				};

				new (window as any).top.Microsoft.CIFramework.External.CIFExternalUtilityImpl().createTab(tabInput);

			} catch (Error) {
				eventParameters.addParameter("Exception Details", Error);
				this.logger.logError(this.logger.baseComponent, "CustomActionOpenForm", "Error occurred while running custom action - OpenForm", eventParameters);
				return Promise.reject("Failed while executing custom action to open Form");
			}
		}

		/*
		 * Custom Action to create entity. This opens up create form in a new tab with the prefilled data
		 * Sample action button json:
		 * {
			"type" : "Action.Submit",
			"title" : "Clone Case",
			"data" : {
				"CustomAction" : "CloneCase",
				"CustomParameters": {
					"entityName": "incident",
					"data": {
					"title" : "Cloned case - Offer free replacement",
					}
				}
			}
		}
		 **/
		public CustomActionCreateEntity() {

			let eventParameters = new Smartassist.EventParameters();
			eventParameters.addParameter("Message", "Running Custom Action - CloneCase");
			eventParameters.addParameter("Entity", this.Parameters.entityName);
			eventParameters.addParameter("Data", this.Parameters.data);

			try {
				var tabInput = {
					pageInput: {
						pageType: CustomActionConstants.RecordPageType,
						entityName: this.Parameters.entityName,
						data: this.Parameters.data
					},
					options: {
						isFocused: true
					}
				};
				new (window as any).top.Microsoft.CIFramework.External.CIFExternalUtilityImpl().createTab(tabInput);

			} catch (Error) {
				eventParameters.addParameter("Exception Details", Error);
				this.logger.logError(this.logger.baseComponent, "CustomActionCreateEntity", "Error occurred while running custom action - CreateEntity", eventParameters);
				return Promise.reject("Failed while executing custom action to create entity");
			}
		}
	}
}