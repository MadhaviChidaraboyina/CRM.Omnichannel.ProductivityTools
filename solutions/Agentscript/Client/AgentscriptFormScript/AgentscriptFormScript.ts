/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/

///<reference path="../TypeDefinitions/XrmClientApi.d.ts" />
///<reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />

module AgentScriptPackage
{
	"use strict";

	/**
	 * Form event handlers for Agent script entity
	 */
	export class AgentscriptFormScript
	{
		// Properties
		public static Instance = new AgentscriptFormScript();

		/**
		 * Form onload handler for agent script entity main form
		 * @param executionContext execution context
		 */
		public onFormLoad(executionContext: XrmClientApi.EventContext)
		{
			let formContext = executionContext.getFormContext();
			let languageAttribute = formContext.getAttribute(AgentScriptEntity.msdyn_language);
			let languageControl = formContext.getControl(AgentScriptEntity.msdyn_language);

			let languageOptions: LanguageOption[] = (languageControl as any).getOptions();

			if (this.isNullOrUndefined(languageOptions))
			{
				// ToDo: Telemetry
				return;
			}

			let length = languageOptions.length;
			if (length <= 1)
			{
				// ToDo: Telemetry
				return;
			}

			// First option is empty, so get the second option and set default value to it
			let languageOption = languageOptions[1];
			languageAttribute.setValue(languageOption.value);
		}

		// Returns true if object is null or undefined
		private isNullOrUndefined(object: any): boolean
		{
			return typeof object == "undefined" || object == null;
		}
	}

	/**
	 * Option interface for language formatted number field
	 */
	export interface LanguageOption
	{
		text: string;
		value: number;
	}

	/**
	 * Attributes for agent script entity
	 */
	export class AgentScriptEntity
	{
		public static msdyn_language = "msdyn_language";
	}
}
