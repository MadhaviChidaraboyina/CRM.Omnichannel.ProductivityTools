
module MscrmControls.Smartassist.Suggestion {
	export class CustomActionHelper {
		/**
		 * Validate the custom action parameters.
		 * @param actionParams Action parameters
		 */
		public static validateCustomAction(actionParams: any, context: Mscrm.ControlData<IInputBag>): boolean {
			if (!actionParams) {
				return false;
			}
			else {
				return !context.utils.isNullOrUndefined(actionParams.customActionName);
			}
		}

		/**
		 * Invoke the custom actions which will be executed in webresource.
		 * @param actionParams Action parameters
		 */
		public static invokeCustomAction(actionParams: any, context: Mscrm.ControlData<IInputBag>) : Promise<any> {
			const actionName = actionParams.customActionName;
			const params = actionParams.customActionArgs;

			return CustomActionHelper.getCustomActionMethod(actionName, context)(params);
		}

		/**
		 * Returns the custom action method to be invoked.
		 * @param customActioName Full qualified name for action.
		 */
		public static getCustomActionMethod(customActioName: string, context: Mscrm.ControlData<IInputBag>): (param: any) => Promise<any> {
			let findFunc = window;
			for (const ctorNamePart of customActioName.split(".")) {
				findFunc = findFunc[ctorNamePart];
				if (!findFunc) {
					break;
				}
			}

			if (!findFunc || typeof findFunc !== "function") {
				const e = new Error(`Could not find/invoke ${customActioName}`);
				context.reporting.reportFailure(TelemetryEventTypes.CustomActionInvocationFailed, e, "TSG-TODO", [{ name: "ActionName", value: customActioName }])
				throw e;
			}
			return findFunc;
		}

		/**
		 * Gets localized string for custom action's resolve or error states.
		 * @param resourceName : key for localized string.
		 */
		public static getString(context: Mscrm.ControlData<IInputBag>, resourceName: string): string {
			return context.resources.getString(resourceName);
		}
	}
}

