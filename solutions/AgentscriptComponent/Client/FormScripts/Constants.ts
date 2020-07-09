/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/

module AgentScriptPackage
{
	"use strict";

	/**
	 * Fields for AgentScriptStep entity
	 */
	export class AgentScriptStepEntity
	{
		public static msdyn_actiontype = "msdyn_actiontype";
		public static msdyn_macroactionid = "msdyn_macroactionid";
		public static msdyn_routeactionid = "msdyn_routeactionid";
		public static msdyn_textinstruction = "msdyn_textinstruction";
		public static msdyn_description = "msdyn_description";
	}

	/**
	 * Option set values for action type fields
	 */
	export class AgentScriptStepActionType
	{
		public static TextAction = 192350000;
		public static MacroAction = 192350001;
		public static RouteAction = 192350002;
		public static Undefined = null;
	}

	/**
	 * General constants
	 */
	export class Constants
	{
		public static RequiredLevel = "required";
        public static OptionalLevel = "none";
        public static RecordIdParam = "record_Id";
        public static CreateMacrosDialog = "CreateMacrosMDD";
	}
}