/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../PrivateReferences.ts"/>

String.prototype.Format = function (...params: any[]): string {
	"use strict";
	let tempString = this.toString();
	for (let i = 0; i < arguments.length; i++) {
		var actualValue = (arguments[i]) ? arguments[i].toString() : "";
		tempString = tempString.replace(new RegExp("\\{" + i + "\\}", 'gi'), actualValue);
	}
	return tempString;
}