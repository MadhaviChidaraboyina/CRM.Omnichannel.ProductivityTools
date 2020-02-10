/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../PrivateReferences.ts"/>

module MscrmControls.ProductivityPanel.Smartassist
{
	'use strict';

	/**
	 * Utility class to interact with Macros
	 */
	export class MacroUtil
	{
		/**
		 * Execute macro using macro api
		 * @param macroName macro name
		 * @param macroParam macro parameter
		 */
		public executeMacro(macroName: string, macroParam: any): Promise<string>
		{
			return Microsoft.ProductivityMacros.runMacro(macroName, macroParam);
		}
	}
}