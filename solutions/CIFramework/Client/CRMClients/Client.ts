/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="Constants.ts" />

namespace Microsoft.CIFramework.Internal
{
	/**
	 * Func type for all CRUD functions.
	*/
	type CRUDFunction = (entityName: string, entityId: string, valuesToUpdate: Map<string,any>|string) => Promise<Map<string,any>>;

	/**
	 * Func type for all set a setting kind of functions.
	*/
	type SetSettingFunction = (name: string, value: any) => string|void;

	/**
	 * Func type for all get a specific setting/context functions for which we dont need an input param.
	*/
	type GetContextFunction = () => string|number|Map<string,any>;

	/**
	 * Func type for retrieve multiple reords and open one of them.
	*/
	type RetrieveMultipleAndOpenFunction = (entityName: string, queryParmeters: string, searchOnly: boolean) => Promise<Map<string,any>>;

	/**
	 * Client interface/type which all clients will be extending and implementing for client specific logic.
	 * This type specifies all the functions that are exposed to clients for impl. 
	*/
	export type IClient = 
	{
		updateRecord: CRUDFunction;

		retrieveRecord: CRUDFunction;

		getUserID: GetContextFunction;

		loadWidget: SetSettingFunction;

		retrieveMultipleAndOpenRecords: RetrieveMultipleAndOpenFunction;

		setWidgetMode: SetSettingFunction;

		setWidgetWidth: SetSettingFunction;

		getWidgetMode: GetContextFunction;

		getWidgetWidth: GetContextFunction;

	}

	/**
	 * Set the actual client implementation based on client type passed.
	 * @param clientType type of client
	 */
	export function setClient(clientType: number) : IClient
	{
		switch(clientType)
		{
			case ClientType.WebClient:
				return webClient();
			default:
				// log error - not able to identify the client, falling back to webclient impl.
				return webClient();
		}
	}
}