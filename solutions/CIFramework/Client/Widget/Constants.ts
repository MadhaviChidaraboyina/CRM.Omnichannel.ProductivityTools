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
		export const openForm = "openform";
		export const createRecord = "createrecord";
		export const deleteRecord = "deleterecord";
		export const retrieveRecord = "retrieverecord";
		export const updateRecord = "updaterecord";
		export const search = "search";
		export const setMode = "setmode";
		export const setWidth = "setwidth";
		export const getMode = "getmode";
		export const getEnvironment = "getenvironment";
		export const getWidth = "getwidth";
		export const onClickToAct = "onclicktoact";
		export const onModeChanged = "onmodechanged";
		export const onSizeChanged = "onsizechanged";
		export const onPageNavigate = "onpagenavigate";
	}

	/**
	 * All constants for widget side logic should be placed here
	*/
	export namespace Constants
	{
		export const value: string = "value";
		export const entityName: string = "entityName";
		export const entityId: string = "entityId";
		export const queryParameters: string = "queryParameters";
		export const message: string = "message";
		export const searchOnly = "searchOnly";
		export const entityFormOptions = "entityFormOptions";
		export const entityFormParameters = "entityFormParameters";
		export const ScriptIdAttributeName = "data-cifid";
		export const ScriptIdAttributeValue = "CIFMainLibrary";
		export const ScriptCRMUrlAttributeName = "data-crmurl";
	}

	/**
	 * utility func to check whether an object is null or undefined
	*/
	export function isNullOrUndefined(obj: any)
	{
		return (obj === "null" || obj === "undefined");
	}
}