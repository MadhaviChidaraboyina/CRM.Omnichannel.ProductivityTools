/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

namespace Microsoft.CIFramework
{
	/**
	 * All the message types/ APIs that are exposed to the widget
	*/
	export namespace MessageType
	{
		export const setClickToAct = "setclicktoact";
		export const getClickToAct = "getclicktoact";
		export const searchAndOpenRecords = "searchandopenrecords";
		export const setMode = "setmode";
		export const setWidth = "setwidth";
		export const getMode = "getmode";
		export const getWidth = "getwidth";
		export const onClickToAct = "onclicktoact";
	}

	/**
	 * All constants for widget side logic should be placed here
	*/
	export namespace Constants
	{
		export const value: string = "value";
		export const entityName: string = "entityName";
		export const queryParameters: string = "queryParameters";
		export const message: string = "message";
		export const searchOnly = "searchOnly";
	}

	/**
	 * utility func to check whether an object is null or undefined
	*/
	export function isNullOrUndefined(obj: any)
	{
		return (obj === "null" || obj === "undefined");
	}
}