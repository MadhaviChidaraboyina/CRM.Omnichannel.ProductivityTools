/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/

///<reference path="Constants.ts" />
///<reference path="../TypeDefinitions/XrmClientApi.d.ts" />
///<reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />

module AgentScriptPackage
{
	"use strict";

	export class AgentScriptStepFormScript
	{
		// Properties
		public static Instance = new AgentScriptStepFormScript();

		/**
		 * Form on-load event handler
		 * Applicable forms: Quick create form and Main form
		 * @param executionContext execution context
		 */
		public onFormLoad(executionContext: XrmClientApi.EventContext)
		{
			let resetValue = false;
			let formContext = executionContext.getFormContext();
			let formtype = formContext.ui.getFormType();

			let actionTypeAttribute = formContext.getAttribute(AgentScriptStepEntity.msdyn_actiontype);
			let actionTypeValue: number = actionTypeAttribute.getValue();

			if (formtype == XrmClientApi.Constants.FormType.Create)
			{
				// For quick create form, reset route action field value which is set because of relationship mappings
				let routeActionAttribute = formContext.getAttribute(AgentScriptStepEntity.msdyn_routeactionid);
				routeActionAttribute.setValue(null);
				resetValue = true;
			}

			// Set action fields based on action type values
            this.setActionFields(executionContext, actionTypeValue, resetValue);

            // Set navigation for macro lookup 
            (formContext.getControl(AgentScriptStepEntity.msdyn_macroactionid) as any).addOnLookupTagClick(this.openMacroRecord);
        }

        private openMacroRecord(executionContext: XrmClientApi.EventContext) {
            (executionContext.getEventArgs() as any).preventDefault();

            // Get the Currently Selected Record ID
            let selectedRecordGuid = executionContext.getFormContext().getAttribute(AgentScriptStepEntity.msdyn_macroactionid).getValue()[0].id;
            let vpHeight = (window.top as any).Xrm.Page.ui.getViewPortHeight();
            let vpWidth = (window.top as any).Xrm.Page.ui.getViewPortWidth();
            const dialogOptions: XrmClientApi.DialogOptions = {
                width: vpWidth, height: vpHeight, position: XrmClientApi.Constants.WindowPosition.inline
            };

            const dialogParams: XrmClientApi.DialogParameters = {};
            dialogParams[Constants.RecordIdParam] = selectedRecordGuid;

            Xrm.Navigation.openDialog(Constants.CreateMacrosDialog, dialogOptions, dialogParams);

        }

		/**
		 * Set various step action fields based on action type field selection
		 * @param executionContext execution context
		 * @param currentSelectedAction current selected action type
		 * @param formType form type
		 */
		private setActionFields(executionContext: XrmClientApi.EventContext, currentSelectedAction: number,
			resetValue: boolean)
		{
			this.setTextActionComponents(executionContext, currentSelectedAction == AgentScriptStepActionType.TextAction, resetValue);
			this.setMacroActionComponents(executionContext, currentSelectedAction == AgentScriptStepActionType.MacroAction, resetValue);
			this.setRouteActionComponents(executionContext, currentSelectedAction == AgentScriptStepActionType.RouteAction, resetValue);
			this.setDescriptionFieldState(executionContext, currentSelectedAction, resetValue);
		}

		/**
		 * ActionType attribute on-change handler
		 * Applicable forms: Quick create form and Main form
		 * @param executionContext execution context
		 */
		public onActionTypeChange(executionContext: XrmClientApi.EventContext)
		{
			let formContext = executionContext.getFormContext();
			let formtype = formContext.ui.getFormType();
			let actionTypeAttribute = formContext.getAttribute(AgentScriptStepEntity.msdyn_actiontype);
			let actionTypeValue: number = actionTypeAttribute.getValue();

			this.setActionFields(executionContext, actionTypeValue, true);
		}

		/**
		 * Set visibility state, required level for components related to text action fields
		 * @param executionContext execution context
		 * @param visibilityState field visibility state
		 * @param formType form type
		 */
		public setTextActionComponents(executionContext: XrmClientApi.EventContext, visibilityState: boolean,
			resetValue: boolean)
		{
			let formContext = executionContext.getFormContext();
			let textActionAttribute = formContext.getAttribute(AgentScriptStepEntity.msdyn_textinstruction);
			let textActionControl = formContext.getControl(AgentScriptStepEntity.msdyn_textinstruction);

			textActionControl.setVisible(visibilityState);

			if (resetValue)
			{
				textActionAttribute.setValue(null);
			}

			this.setAttributeLevel(textActionAttribute, visibilityState);
		}

		/**
		 * Set visility state, required level for components related to macro action fields
		 * @param executionContext execution context
		 * @param visibilityState visibility state
		 * @param formType form type
		 */
		public setMacroActionComponents(executionContext: XrmClientApi.EventContext, visibilityState: boolean,
			resetValue: boolean)
		{
			let formContext = executionContext.getFormContext();
			let macroActionAttribute = formContext.getAttribute(AgentScriptStepEntity.msdyn_macroactionid);
			let macroActionControl = formContext.getControl(AgentScriptStepEntity.msdyn_macroactionid);

			macroActionControl.setVisible(visibilityState);

			if (resetValue)
			{
				macroActionAttribute.setValue(null);
			}

			this.setAttributeLevel(macroActionAttribute, visibilityState);
		}

		/**
		 * Set visibility state, required level for components related to route action fields
		 * @param executionContext execution context
		 * @param visibilityState visibility state
		 * @param formType form type
		 */
		public setRouteActionComponents(executionContext: XrmClientApi.EventContext, visibilityState: boolean,
			resetValue: boolean)
		{
			let formContext = executionContext.getFormContext();
			let routeActionAttribute = formContext.getAttribute(AgentScriptStepEntity.msdyn_routeactionid);
			let routeActionControl = formContext.getControl(AgentScriptStepEntity.msdyn_routeactionid);

			routeActionControl.setVisible(visibilityState);

			if (resetValue)
			{
				routeActionAttribute.setValue(null);
			}

			this.setAttributeLevel(routeActionAttribute, visibilityState);
		}

		/**
		 * Set required level for the attribute based on visibility state
		 * @param attribute attribute
		 * @param visibilityState visibility state on the form
		 */
		private setAttributeLevel(attribute: XrmClientApi.Attributes.Attribute, visibilityState: boolean)
		{
			let requiredLevel = visibilityState ? Constants.RequiredLevel : Constants.OptionalLevel;

			if (this.isNullOrUndefined(attribute))
			{
				// ToDo: Add Telemetry
				return;
			}

			attribute.setRequiredLevel(requiredLevel);
		}

		/**
		 * Set description field based on selected action type
		 * @param executionContext execution context
		 * @param actionType action type for the step
		 * @param resetValue if resetting the value is required
		 */
		private setDescriptionFieldState(executionContext: XrmClientApi.EventContext, actionType: AgentScriptStepActionType, resetValue: boolean)
		{
			let formContext = executionContext.getFormContext();
			let descriptionControl = formContext.getControl(AgentScriptStepEntity.msdyn_description);
			let descriptionAttribute = formContext.getAttribute(AgentScriptStepEntity.msdyn_description);

			let visibilityState = !(actionType == AgentScriptStepActionType.TextAction);
			descriptionControl.setVisible(visibilityState);

			if (resetValue)
			{
				descriptionAttribute.setValue(null);
			}
		}

		/**
		 * Form on-save event handler
		 * Applicable forms: Quick create form and Main form
		 * @param executionContext execution context
		 */
		public onFormSave(executionContext: XrmClientApi.EventContext)
		{
			// Placeholder for form save handling
		}

		/**
		 * Returns true if object is null or undefined
		 * @param object input parameter
		 */
		private isNullOrUndefined(object: any): boolean
		{
			return typeof object == "undefined" || object == null;
		}
	}
}


