/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
module MscrmControls.Callscript
{
	'use strict';

	/**
	 * Utility class to interact with CIF
	 */
	export class CECUtil
	{
		// properties
        private context: Mscrm.ControlData<IInputBag>;
        private appRuntime: AppRuntimeClientSdk.ISessionContext;
		private telemetryContext: string;
        private telemetryLogger: TelemetryLogger;

		constructor(context: Mscrm.ControlData<IInputBag>)
		{
            this.context = context;
			this.telemetryContext = TelemetryComponents.CIFUtil;
            this.telemetryLogger = new TelemetryLogger(this.context);
        }

		/**
		 * Get session template name for focussed session
		 * @returns Session template name
		 */
		public async getSessionTemplateName(): Promise<string>
		{
            let methodName = "getSessionTemplateName";
            let sessionTemplateName: string = "";

            try {
                let context = await Microsoft.AppRuntime.Sessions.getFocusedSession().getContext();
                if (!this.context.utils.isNullOrUndefined(context)) {
                    sessionTemplateName = context.templateName;
                }
			}
			catch (error) {
				let errorMessage = "Failed to retrieve session template name";
				let errorParam = new EventParameters();
				errorParam.addParameter("errorDetails", error);
				this.telemetryLogger.logError(this.telemetryContext, methodName, errorMessage, errorParam);
			}

            return sessionTemplateName;
		}

		/**
		 * Returns value for key in session template params for focussed session
		 * @param key key for entry whose value is returned
		 */
        public async getValueFromSessionTemplateParams(key: string): Promise<any> {
			let methodName = "getValueFromSessionTemplateParams";
			try {
                //let sessionTemplateParams = this.cifExternalUtil.getSessionTemplateParams();
                let sessionId = Microsoft.AppRuntime.Sessions.getFocusedSession().sessionId;
                let sessionTemplateParams;
                var context = await Microsoft.AppRuntime.Sessions.getSession(sessionId).getContext();
                if (!this.context.utils.isNullOrUndefined(context)) {
                    sessionTemplateParams = context.get(sessionId);
                }
				if (!this.context.utils.isNullOrUndefined(sessionTemplateParams) && !this.context.utils.isNullOrUndefined(sessionTemplateParams[key])) {
					return sessionTemplateParams[key];
				}
			}
			catch (error) {
				let errorMessage = "Failed to get value from session template params";
				let errorParam = new EventParameters();
				errorParam.addParameter("errorDetails", error);
				errorParam.addParameter("lookupKey", key);
				this.telemetryLogger.logError(this.telemetryContext, methodName, errorMessage, errorParam);
				return null;
			}
		}

		/**
		 * Updates value in session template params for specified session
		 * @param key key for the new/updated entry in session template params
		 * @param value value for the new/updated entry in session template params
		 * @param sessionId id of session whose params are updated
		 */
        public async setValueInSessionTemplateParams(key: string, value: any, sessionId: string): Promise<void> {
			let methodName = "setValueInSessionTemplateParams";
			let input: Mscrm.Dictionary = {};
			input[key] = value;
            try {
                var context = await Microsoft.AppRuntime.Sessions.getSession(sessionId).getContext();
                if (!this.context.utils.isNullOrUndefined(context)) {
                    context.set(sessionId, input);
                }
			}
			catch (error) {
				let errorMessage = "Failed to add/update key-value pair in session template params";
				let errorParam = new EventParameters();
				errorParam.addParameter("errorDetails", error);
				errorParam.addParameter("uciSessionId", sessionId);
				this.telemetryLogger.logError(this.telemetryContext, methodName, errorMessage, errorParam);
			}
		}
	}

	/**
	 * Utility class to interact with Macros
	 */
	export class MacroUtil
	{
		// properties
		private context: Mscrm.ControlData<IInputBag>;
		private telemetryContext: string;
        private telemetryLogger: TelemetryLogger;
        private static isInitMacroActionTemplates: boolean;
        private static initMacroActionTemplatesPromise: Promise<boolean>;

		constructor(context: Mscrm.ControlData<IInputBag>)
		{
			this.context = context;
			this.telemetryContext = TelemetryComponents.MacroUtil;
            this.telemetryLogger = new TelemetryLogger(this.context);
            
            if (!MacroUtil.initMacroActionTemplatesPromise) {
                MacroUtil.initMacroActionTemplatesPromise = Microsoft.ProductivityMacros.Internal.ProductivityMacroOperation.InitMacroActionTemplates();
            }
            this.resolveInitMacroTemplate();
        }

		/**
		 * Execute macro using macro api
		 * @param macroName macro name
		 * @param macroParam macro parameter
		 */
		public executeMacro(macroName: string, macroId: string, macroParam?: any): Promise<string>
		{
			let methodName = "executeMacro";
			try {
				return Microsoft.ProductivityMacros.runMacro(macroName);
			}
			catch (error) {
				let errorMessage = "Failed to execute run macro api";
				let errorParam = new EventParameters();
				errorParam.addParameter("errorDetails", error);
				errorParam.addParameter("macroId", macroId);
				this.telemetryLogger.logError(this.telemetryContext, methodName, errorMessage, errorParam);

				return new Promise<string>((resolve, reject) => {
					reject(error);
				});
			}
        }

        public async resolveInitMacroTemplate() {
			await MacroUtil.initMacroActionTemplatesPromise.then(
				function (value) {
					MacroUtil.isInitMacroActionTemplates = value;
				},
				function (error) {
					MacroUtil.isInitMacroActionTemplates = false;
				}
			);
        }

        /**
         * Resolve replaceable parameters
         * @param inputParam input parameter string
         * @returns Resolved replaceable parameter
         */
        public resolveReplaceableParameters(inputParam: string): Promise<string> {
            let methodName = "resolveReplaceableParameters";
            try {
                if (MacroUtil.isInitMacroActionTemplates) {
                    return Microsoft.ProductivityMacros.Internal.resolveTemplateString(inputParam, null, "");
                }
                else {
                    return new Promise((resolve, reject) => {
                        resolve(inputParam);
                    });
                }
            }
            catch (error) {
                let errorMessage = "Failed to resolve replaceable parameters in text";
                let errorParam = new EventParameters();
                errorParam.addParameter("errorDetails", error);
                this.telemetryLogger.logError(this.telemetryContext, methodName, errorMessage, errorParam);
                return new Promise((resolve, reject) => {
                    resolve(inputParam);
                });
            }
        }
	}
}