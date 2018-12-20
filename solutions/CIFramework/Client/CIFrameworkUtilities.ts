/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/**
 * Constants for CIFramework.
 */
/** @internal */
namespace Microsoft.CIFramework.Utility {
	/**
	 * utility func to create a error map with the error message and optional error code
	*/
	export function createErrorMap(errorMessage: string, apiName?: string) {
		return new Map().set(Constants.message, errorMessage).set(Constants.name, apiName);
	}

	/**
	 * utility func to check whether argument passed if of type Error Object
	 * @param arg Object to check whether it is Error or not.
	*/
	export function isError(arg: XrmClientApi.WebApi.Entity | Error): arg is Error {
		return ((<Error>arg).message !== undefined);
	}

	/**
	 * Given a key-value object, this func returns an equivalent Map object for it.
	 * @param dict Object to build the map for.
	 */
	export function buildMap(dict: XrmClientApi.WebApi.Entity | Error): Map<string, any> {
		if (isError(dict)) {
			return createErrorMap(dict.message);
		}
		else {
			let map = new Map<string, any>();
			Object.keys(dict).forEach((key) => {
				map.set(key, dict[key]);
			});
			return map;
		}
	}

	/**
	 * Given a map, this func returns an equivalent XrmClientApi.WebApi.Entity object for it.
	 * @param map Object to build the entity for.
	 */
	export function buildEntity(map: Map<string, any>): XrmClientApi.WebApi.Entity {
		let entity: XrmClientApi.WebApi.Entity = {};
		map.forEach((value, key) => {
			entity[key] = value;
		});
		return entity;
	}

	export function extractParameter(queryString: string, parameterName: string): string {
		var params: any = {};
		if (queryString != null && queryString != "") {
			var queryStringArray = queryString.substr(1).split("&");
			queryStringArray.forEach((query) => {
				var queryPair = query.split("=");
				var queryKey = decodeURIComponent(queryPair[0]);
				var queryValue = decodeURIComponent(queryPair.length > 1 ? queryPair[1] : "");
				params[queryKey] = queryValue;
			});
		}
		if (params.hasOwnProperty(parameterName))
			return params.parameterName;
		else
			return "";
	}

	/**
	 * Converts given rgb value to hex value
	 */
	export function rgb2hex(value: string): string {
		var rgb = value.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
		return (rgb && rgb.length === 4) ? "#" +
			("0" + parseInt(rgb[1], 10).toString(16)).slice(-2).toUpperCase() +
			("0" + parseInt(rgb[2], 10).toString(16)).slice(-2).toUpperCase() +
			("0" + parseInt(rgb[3], 10).toString(16)).slice(-2).toUpperCase() : value;
	}

	/**
	 * Utility to get element by id from iframe
	 */
	export function getElementFromIframe(iFrameObject: HTMLIFrameElement, id: string): any {
		return iFrameObject.contentWindow.document.getElementById(id);
	}

	/**
	 * Utility to get elements by classname from iframe
	 */
	export function getElementsByClassName(iFrameObject: HTMLIFrameElement, className: string): any {
		return iFrameObject.contentWindow.document.getElementsByClassName(className);
	}

	export function blinkBrowserTab(iFrameObject: HTMLIFrameElement) {
		if (iFrameObject.contentWindow.document.hasFocus() || (window.top as any).titleAnimation == true) {
			return;
		}

		let originalTitle = window.top.document.title;  // save original title
		let animatedTitle = "Incoming notification";
		let timer = setInterval(startAnimation, 800);
		(window.top as any).titleAnimation = true;

		function startAnimation() {
			// animate between the original and the new title
			window.top.document.title = window.top.document.title == animatedTitle ? originalTitle : animatedTitle;
		}

		let restoreTitleFunction = function restoreTitle() {
			clearInterval(timer);
			window.top.document.title = originalTitle; // restore original title
			(window.top as any).titleAnimation = false;
			iFrameObject.contentWindow.removeEventListener("focus", restoreTitleFunction);
		}

		// Change page title back on focus
		iFrameObject.contentWindow.addEventListener("focus", restoreTitleFunction);
	}
}