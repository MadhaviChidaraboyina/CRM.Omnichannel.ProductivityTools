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
		private cifExternalUtil: Microsoft.CIFramework.External.CIFExternalUtilityImpl;

		constructor(context: Mscrm.ControlData<IInputBag>)
		{
			this.context = context;
			this.cifExternalUtil = new Microsoft.CIFramework.External.CIFExternalUtilityImpl();
		}

		/**
		 * Get session template id for focussed session
		 * @param uciSessionId uci session id
		 * @returns Session template id
		 */
		public getSessionTemplateId(): string
		{
			return this.cifExternalUtil.getTemplateForSession();
		}

		/**
		 * Resolve replaceable parameters
		 * @param inputParam input parameter string
		 * @param uciSessionId uci session id
		 * @returns Resolved replaceable parameter
		 */
		public resolveReplaceableParameters(inputParam: string): Promise<string>
		{
			let templateParams = this.cifExternalUtil.getSessionTemplateParams();
			return this.cifExternalUtil.resolveTemplateString(inputParam, templateParams, "");
		}

		/**
		 * Returns value for key in session template params for focussed session
		 * @param key key for entry whose value is returned
		 */
		public getValueFromSessionTemplateParams(key: string): any {
			let sessionTemplateParams = this.cifExternalUtil.getSessionTemplateParams();
			if (!this.context.utils.isNullOrUndefined(sessionTemplateParams) && !this.context.utils.isNullOrUndefined(sessionTemplateParams[key])) {
				return sessionTemplateParams[key];
			}
			return null;
		}

		/**
		 * Updates value in session template params for specified session
		 * @param key key for the new/updated entry in session template params
		 * @param value value for the new/updated entry in session template params
		 * @param sessionId id of session whose params are updated
		 */
		public setValueInSessionTemplateParams(key: string, value: any, sessionId: string): void {
			let input: Mscrm.Dictionary = {};
			input[key] = value;
			this.cifExternalUtil.setSessionTemplateParams(input, sessionId);
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