
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
		public static invokeCustomAction(actionParams: any) {
			const actionName = actionParams.customActionName;
			const params = actionParams.customActionArgs;
			return window.top[actionName](params)
		}
	}
}

