
module MscrmControls.Smartassist.Recommendation {
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
				return !context.utils.isNullOrUndefined(actionParams.CustomAction);
			}
		}

		/**
		 * Invoke the custom actions which will be executed in webresource.
		 * @param actionParams Action parameters
		 */
		public static invokeCustomAction(actionParams: any) {
			const actionName = actionParams.CustomAction;
			const params = actionParams.CustomParameters;
			return window.top[actionName](params)
		}
	}
}

