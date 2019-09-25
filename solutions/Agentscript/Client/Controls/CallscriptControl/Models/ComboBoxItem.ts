/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.CallscriptControl {
	'use strict';

	/**
	* To represent combo box items
	*/
	export class ComboBoxItem {
		public id: string;
		public value: string;
		public text: string;
		public Label: string;
		public Value: string;
		public isCurrent: boolean;

		// Default contructor
		constructor(id: string, value: string, text: string, isCurrent: boolean) {
			this.id = id;
			this.value = value;
			this.text = text;
			this.Label = text;
			this.Value = value;
			this.isCurrent = isCurrent;
		}
	}
}