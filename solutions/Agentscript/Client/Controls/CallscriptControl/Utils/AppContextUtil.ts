/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.ProductivityPanel
{
	'use strict';

	/**
	 * Utility class to interact with CIF
	 */
	export class CIFUtil
	{
		// properties
		private context: Mscrm.ControlData<IInputBag>;

		constructor(context: Mscrm.ControlData<IInputBag>)
		{
			this.context = context;
		}

		/**
		 * Get session template id for given UCI session id
		 * @param uciSessionId uci session id
		 * @returns Session template id
		 */
		public getSessionTemplateId(uciSessionId: string): Promise<string>
		{
			return new Promise((resolve, reject) => {
				// ToDo: Integrate with new CIF API once available
				resolve(Constants.EmptyString);
			});
		}

		/**
		 * Resolve replaceable parameters
		 * @param inputParam input parameter string
		 * @param uciSessionId uci session id
		 * @returns Resolved replaceable parameter
		 */
		public resolveReplaceableParameters(inputParam: string, uciSessionId?: string): Promise<string>
		{
			return new Promise((resolve, reject) => {
				// ToDo: Integrate with new CIF API once available
				resolve(inputParam);
			});
		}
	}

	/**
	 * Utility class to interact with Macros
	 */
	export class MacroUtil
	{
		// properties
		private context: Mscrm.ControlData<IInputBag>;

		constructor(context: Mscrm.ControlData<IInputBag>)
		{
			this.context = context;
		}

		/**
		 * Execute macro using macro api
		 * @param macroName macro name
		 * @param macroParam macro parameter
		 */
		public executeMacro(macroName: string, macroParam: any): Promise<string>
		{
			// ToDo: Integration with macro when available
			return new Promise((resolve, reject) => {
				resolve(Constants.EmptyString);
			});
		}
	}
}