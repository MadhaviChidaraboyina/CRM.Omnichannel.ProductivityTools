/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.CallscriptControl {
	'use strict';

	export class StringHelper {

		/**
		* @remarks Limited functionality implemented
		* @returns a formatted string, similar to string.Format in C#.
		*/
		public static Format(format: string, ...args: any[]) {
			var returnValue = format;

			for (let i = 1; i < arguments.length; i++) {
				var actualValue = typeof (arguments[i]) == "undefined" || arguments[i] == null ? "" : arguments[i].toString();
				returnValue = returnValue.replace(new RegExp("\\{" + (i - 1) + "\\}", 'g'), actualValue);
			}

			return returnValue;
		}

	}
}