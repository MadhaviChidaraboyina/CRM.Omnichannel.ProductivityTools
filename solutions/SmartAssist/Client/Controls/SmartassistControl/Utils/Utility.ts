/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */


module MscrmControls.ProductivityPanel.Smartassist {
	/*
	* utility methods
	*/
    export class Utility {
        private context: Mscrm.ControlData<IInputBag>;

        constructor(context: Mscrm.ControlData<IInputBag>) {
            this.context = context;
        }

		/** 
		*  Utility function - returns empty string if the value provided is null or Undefined
	    * @param value: string value to be checked null or undefined.
		*/
        public GetValue(value: string): any {
            if (this.context.utils.isNullOrUndefined(value)) {
                return "";
            }
            return value;
        }
    }
}