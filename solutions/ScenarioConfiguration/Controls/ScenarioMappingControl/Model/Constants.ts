/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="../privatereferences.ts"/>

module MscrmControls.Service.CIProvider {
	'use strict';

	export class ScenarioContolConstants {

		public static NotificationTemplateEntityName: string = "msdyn_consoleapplicationnotificationtemplate";
		public static SessionTemplateEntityName: string = "msdyn_consoleapplicationsessiontemplate";

		public static NotificationTemplateViewId: string = "8C04ADA1-02D6-4D35-A3C6-F7B1A7E48801";
		public static SessionTemplateViewId: string = "7D861B13-DFC1-447F-9799-54662A6F7104";

		public static NotificationTemplateToScenarioRelationship: string = "msdyn_msdyn_consoleapplicationnotificationtemplate_msdyn_scenario_NotificationTemplate";
		public static SessionTemplateToScenarioRelationship: string = "msdyn_msdyn_consoleapplicationsessiontemplate_msdyn_scenario_SessionTemplate";

		public static ScenarioEntityName: string = "msdyn_scenario";

		public static GetTemplateEntityName(templateType: TemplateType): string {
			switch (templateType) {
				case TemplateType.Notification:
					return ScenarioContolConstants.NotificationTemplateEntityName;
				case TemplateType.Session:
				default:
					return ScenarioContolConstants.SessionTemplateEntityName;
			}
		}

		public static GetTemplateLookupViewId(templateType: TemplateType): string {
			switch (templateType) {
				case TemplateType.Notification:
					return ScenarioContolConstants.NotificationTemplateViewId;
				case TemplateType.Session:
				default:
					return ScenarioContolConstants.SessionTemplateViewId;
			}
		}

		public static GetTemplateScenarioRelationship(templateType: TemplateType): string {
			switch (templateType) {
				case TemplateType.Notification:
					return ScenarioContolConstants.NotificationTemplateToScenarioRelationship;
				case TemplateType.Session:
				default:
					return ScenarioContolConstants.SessionTemplateToScenarioRelationship;
			}
		}

	}
}