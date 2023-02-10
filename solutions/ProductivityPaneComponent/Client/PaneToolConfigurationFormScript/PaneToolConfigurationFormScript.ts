/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/

///<reference path="../../../../references/internal/TypeDefinitions/XrmClientApi.d.ts" />
///<reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
///<reference path="../ProductivityPaneLoader/Utilities/Constants.ts" />
///<reference path="../Localization/Provider/StringProvider.ts" />

module PaneToolConfigurationPackage {
	"use strict";

	/**
	 * Form event handlers for Pane tool configuration entity
	 */
	export class PaneToolConfigurationFormScript {
		// Properties
		public static Instance = new PaneToolConfigurationFormScript();

		/**
		 * Form onload handler for pane tool configuration entity main form
		 * @param executionContext execution context
		 */
		public onFormLoad(executionContext: XrmClientApi.EventContext) {
			if (this.isNullOrUndefined(executionContext)) {
				return;
			}

			this.setFormVisibilities(executionContext.getFormContext());
			this.setPageOrControlFieldLabel(executionContext.getFormContext());
		}

		/**
		 * Form onType handler for type picklist
		 * @param executionContext execution context
		 */
		public onTypeChange(executionContext: XrmClientApi.EventContext) {
			if (this.isNullOrUndefined(executionContext)) {
				return;
			}

			this.setPageOrControlFieldLabel(executionContext.getFormContext());
		}

		private setFormVisibilities(form: XrmClientApi.Form) {
			if (this.isNullOrUndefined(form)) {
				return;
			}

			// Get control context from form
			const typeControl = form.getControl(PaneToolConfigurationEntity.msdyn_type);
			const iconControl = form.getControl(PaneToolConfigurationEntity.msdyn_icon);
			const categoryControl = form.getControl(PaneToolConfigurationEntity.msdyn_category);
			const toolConfigurationEntityControl = form.getControl(PaneToolConfigurationEntity.msdyn_toolconfigurationentity);
			const dataControl = form.getControl(PaneToolConfigurationEntity.msdyn_data);
			const isConfigurableControl = form.getControl(PaneToolConfigurationEntity.msdyn_isconfigurable);

			// Set visiblities

			// Type - visible
			if (!this.isNullOrUndefined(typeControl)) {
				typeControl.setVisible(true);
			}

			// Icon - visible
			if (!this.isNullOrUndefined(iconControl)) {
				iconControl.setVisible(true);
			}

			// Category - hide
			if (!this.isNullOrUndefined(categoryControl)) {
				categoryControl.setVisible(false);
			}

			// Configuration - hide
			if (!this.isNullOrUndefined(toolConfigurationEntityControl)) {
				toolConfigurationEntityControl.setVisible(false);
			}

			// Data - hide
			if (!this.isNullOrUndefined(dataControl)) {
				dataControl.setVisible(false);
			}

			// IsConfigurable - hide
			if (!this.isNullOrUndefined(isConfigurableControl)) {
				isConfigurableControl.setVisible(false);
			}
		}

		private setPageOrControlFieldLabel(form: XrmClientApi.Form) {
			if (this.isNullOrUndefined(form)) {
				return;
			}

			// Change control name label based on control type on tool configuration form
			const controlNameControl = form.getControl(PaneToolConfigurationEntity.msdyn_controlname);
			const typeAttribute = form.getAttribute(PaneToolConfigurationEntity.msdyn_type);

			// Get label based on type value
			if (!this.isNullOrUndefined(controlNameControl) && !this.isNullOrUndefined(typeAttribute)) {
				const localizedLabelKey = typeAttribute.getValue() === ProductivityPaneLoader.ToolType.CUSTOM_PAGE ?
					ProductivityPaneLoader.LocalizedStringKeys.CustomPageNameLabel :
					ProductivityPaneLoader.LocalizedStringKeys.ControlNameLabel;

				// Retrieve localization
				const localizedString = this.getResourceString(localizedLabelKey)

				// Set New Label
				controlNameControl.setLabel(localizedString)
			}
		}

		private getResourceString(key: string): string {
			const resource = "msdyn_ProductivityPaneComponent";
			var value = Xrm.Utility.getResourceString(resource, key);

			if (this.isNullOrUndefined(value)) {
				value = key;
			}

			return value;
		}

		// Returns true if object is null or undefined
		private isNullOrUndefined(object: any): boolean {
			return typeof object == "undefined" || object == null;
		}
	}

	/**
	 * Attributes for pane tool entity
	 */
	export class PaneToolConfigurationEntity {
		public static msdyn_type = "msdyn_type";
		public static msdyn_icon = "msdyn_icon";
		public static msdyn_toolconfigurationentity = "msdyn_toolconfigurationentity";
		public static msdyn_category = "msdyn_category";
		public static msdyn_isconfigurable = "msdyn_isconfigurable";
		public static msdyn_controlname = "msdyn_controlname";
		public static msdyn_data = "msdyn_data";
	}
}
