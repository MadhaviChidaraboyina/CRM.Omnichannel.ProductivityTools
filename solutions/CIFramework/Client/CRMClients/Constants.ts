/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

namespace Microsoft.CIFramework.Internal
{
	/**
	 * utility func to  check if an object is null or undefined
	*/
	export function isNullOrUndefined(obj: any)
	{
		return (obj === null || obj === undefined);
	}

	/**
	 * utility func to create a promise and reject it with the passed error message
	*/
	export function rejectWithErrorMessage(errorMessage: string, apiName: string, appId?: string, isError?: boolean, error?: IErrorHandler)
	{
		logFailure(appId, isError, error);
		reportError(apiName + " failed with error: " + errorMessage);
		return Promise.reject(createErrorMap(errorMessage, apiName));
	}

	/**
	 * utility func to create a error map with the error message and optional error code
	*/
	export function createErrorMap(errorMessage : string, apiName?: string)
	{
		return new Map().set(Constants.message, errorMessage).set(Constants.name, apiName);
	}

	/**
	 * utility func to check whether argument passed if of type Error Object
	 * @param arg Object to check whether it is Error or not.
	*/
	export function isError(arg : XrmClientApi.WebApi.Entity|Error) : arg is Error
	{
		return ((<Error>arg).message !== undefined);
	}

	/**
	 * Given a key-value object, this func returns an equivalent Map object for it.
	 * @param dict Object to build the map for.
	 */
	export function buildMap(dict: XrmClientApi.WebApi.Entity|Error) : Map<string, any>
	{
		if(isError(dict))
		{
			return createErrorMap(dict.message);
		}
		else
		{
			let map = new Map<string,any>();
			Object.keys(dict).forEach((key) =>
			{
				map.set(key, dict[key]);
			});
			return map;
		}
	}

	/**
	 * Given a map, this func returns an equivalent XrmClientApi.WebApi.Entity object for it.
	 * @param map Object to build the entity for.
	 */
	export function buildEntity(map: Map<string, any>) : XrmClientApi.WebApi.Entity
	{
		let entity: XrmClientApi.WebApi.Entity = {};
		map.forEach((value, key) => {
			entity[key] = value;
		});
		return entity;
	}

	/**
	 * Enum defining the different client types available for CI
	*/
	export const enum ClientType
	{
		WebClient,
		UCClient
	}

	/**
	 * all constants related to client side logic should go here 
	*/
	export namespace Constants
	{
		export const originURL = "originURL";
		export const CIClickToAct = "CIClickToAct";
		export const widgetIframeId = "SidePanelIFrame";
		export const value = "value";
		export const clickToActAttributeName = "msdyn_clicktoact";
		export const systemUserLogicalName = "systemuser";
		export const appSelectorFieldName = "msdyn_appselector";
		export const roleSelectorFieldName = "msdyn_roleselector";
		export const providerOdataQuery = "?$select=fullname&$expand=msdyn_ciprovider_systemuser_membership($filter=statecode eq 0;$orderby=msdyn_sortorder asc,createdon asc;$top={0})";
		export const providerNavigationProperty = "msdyn_ciprovider_systemuser_membership";
		export const providerId = "msdyn_ciproviderid";
		export const landingUrl = "msdyn_landingurl";
		export const label = "msdyn_label";
		export const name = "msdyn_name";
		export const providerLogicalName = "msdyn_ciprovider";
		export const widgetHeight = "msdyn_widgetheight";
		export const widgetWidth = "msdyn_widgetwidth";
		export const entityName = "entityName";
		export const entityId = "entityId";
		export const queryParameters = "queryParameters";
		export const message = "message";
		export const searchOnly = "searchOnly";
		export const entityFormOptions = "entityFormOptions";
		export const entityFormParameters = "entityFormParameters";
		export const SizeChangeHandler = "sizeChangeHandler";
		export const ModeChangeHandler = "modeChangedHandler";
		export const NavigationHandler = "NavigationHandler";
		export const AppName = "appName";
		export const ClientUrl = "clientUrl";
		export const AppUrl = "appUrl";
		export const Theme = "themeName";
		export const OrgLcid = "orgLcid";
		export const OrgUniqueName = "orgUniqueName";
		export const UserId = "userId";
		export const UserLcid = "userLcid";
		export const UserName = "username";
		export const DefaultCountryCode = "defaultCountryCode";
		export const APIVersion = "msdyn_ciproviderapiversion";
		export const SortOrder = "msdyn_sortorder";
		export const crmVersion = "crmVersion";
	}

	/**
	 * All the message types/ APIs that are triggered by Client
	*/
	export namespace MessageType
	{
		export const onClickToAct = "onclicktoact";
		export const onSizeChanged = "onsizechanged";
		export const onModeChanged = "onmodechanged";
		export const onPageNavigate = "onpagenavigate";
	}
}