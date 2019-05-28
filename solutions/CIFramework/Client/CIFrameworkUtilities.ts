/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/**
 * Constants for CIFramework.
 */
/** @internal */
namespace Microsoft.CIFramework.Utility {

	var webresourceName = "Localization/CIF_webresource_strings";

	export function getResourceString(key: any) {
		var value = key;
		if (Xrm && Xrm.Utility && Xrm.Utility.getResourceString) {
			value = Xrm.Utility.getResourceString(webresourceName, key);

			if (value === undefined || value === null) {
				value = key;
			}
		}

		return value;
	}

	/**
	 * utility func to create a error map with the error message and optional error code
	*/
	export function createErrorMap(errorMessage: string, apiName?: string) {
		return new Map().set(Constants.message, errorMessage).set(Constants.nameParameter, apiName);
	}

	/**
	 * utility func to check whether argument passed if of type Error Object
	 * @param arg Object to check whether it is Error or not.
	*/
	export function isError(arg: XrmClientApi.WebApi.Entity | Error): arg is Error {
		return ((<Error>arg).message !== undefined);
	}

	export function launchSearchPage(searchQuery: string, entityName: string): void {
		try {
				const searchPageInput: XrmClientApi.PageInput = {
					pageType: "search" as any,
					searchText: Microsoft.CIFramework.Utility.extractSearchText(searchQuery),
					searchType: 1,
					EntityNames: [entityName],
					EntityGroupName: "",
				};
				Xrm.Navigation.navigateTo(searchPageInput);
			}
		catch (error) { }
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
	 * Generic method to convert map data into string
	 * @param map 
	 */
	export function mapToString(map: Map<string, any>, exclusionList: string[] = []): string {
		let result: string = "";
		if (!map) {
			return "";
		}
		map.forEach((value, key) => {
			if (exclusionList.indexOf(key) == -1) {
				result += key + " : " + value + ", ";
			}
		});
		return result;
	}

	export function flatten(obj: XrmClientApi.WebApi.Entity): XrmClientApi.WebApi.Entity {
		let ret: XrmClientApi.WebApi.Entity = {};
		for (let prop in obj) {
			if (typeof (obj[prop]) === "object") {
				ret[prop] = flatten(obj[prop]);
			}
			else {
				ret[prop] = obj[prop];
			}
		}
		return ret;
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
		if (queryString) {
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

	export function extractSearchText(queryString: string): string {
		var emptyString = "";
		if (queryString) {
			let query = queryString.split("=");
			return (query[1] != null && query[1] != "") ? query[1] : emptyString;
		}
		return emptyString;
	}


	export function splitQueryForSearch(queryString: string): Array<string> {

		var splitQuery: Array<string> = [];
		if (queryString) {
			splitQuery = queryString.split("&");
		}
		let splitSearchQuery = ["",""] ;

		splitQuery.forEach((query) => {
			if (!query.startsWith("$search") && !query.startsWith("?$search")) {
				splitSearchQuery[0] == "" ? splitSearchQuery[0] += query : splitSearchQuery[0] += "&" + query;
			}
			else {
				splitSearchQuery[1] = query;
			}
		});
		if (!splitSearchQuery[0].startsWith("?")) {
			splitSearchQuery[0] = "?" + splitSearchQuery[0];
		}
		if (splitSearchQuery[1].startsWith("?")) {
			splitSearchQuery[1] = splitSearchQuery[1].substr(1);
		}
		return splitSearchQuery;
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
		let animatedTitle = "New notification";
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