/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="Constants.ts" />

namespace Microsoft.CIFramework.Internal
{
	export type EventHandler = (event?: CustomEvent) => void;

	type XrmEventHandler = (context?: XrmClientApi.EventContext) => void;

	type RegisterHandler = (eventName: string, handler: EventHandler) => boolean;

	type RemoveHandler = (eventName: string) => boolean;
	/**
	 * Func type for all CRUD functions.
	*/
	type CRUDFunction = (entityName: string, entityId?: string, telemetryData?: Object, data?: Map<string, any> | string) => Promise<Map<string, any>>;

	/**
	 * Func type for all set a setting kind of functions.
	*/
	type SetSettingFunction = (name: string, value: any, telemetryData?: Object) => string | void;

	/**
	 * Func type for all get a specific setting/context functions for which we dont need an input param.
	*/
	type GetContextFunction = (telemetryData?: Object) => string|number|Map<string,any>;

	/**
	 * Func type for retrieve multiple reords and open one of them.
	*/
	type RetrieveMultipleAndOpenFunction = (entityName: string, queryParmeters: string, searchOnly: boolean, telemetryData?: Object) => Promise<Map<string, any>>;

	/**
	 * Func type for opening a new or an existing form page
	*/
	type OpenFormFunction = (entityFormOptions: string, entityFormParameters?: string, telemetryData?: Object) => Promise<Map<string, any>>;

	/**
	 * Func type for loading all widgets.
	*/
	type LoadWidgetsFunction = (ciProviders: Map<string, CIProvider>) => Promise<Map<string, boolean|string>>;

	/**
	 * Client interface/type which all clients will be extending and implementing for client specific logic.
	 * This type specifies all the functions that are exposed to clients for impl. 
	*/
	export type IClient = 
		{

		sizeChanged: XrmEventHandler;

		modeChanged: XrmEventHandler;

		navigationHandler: XrmEventHandler;

		registerHandler: RegisterHandler;

		removeHandler: RemoveHandler;

		createRecord: CRUDFunction;

		updateRecord: CRUDFunction;

		deleteRecord: CRUDFunction;

		retrieveRecord: CRUDFunction;

		getUserID: GetContextFunction;

		loadWidgets: LoadWidgetsFunction;

		retrieveMultipleAndOpenRecords: RetrieveMultipleAndOpenFunction;

		setWidgetMode: SetSettingFunction;

		setWidgetWidth: SetSettingFunction;

		getWidgetMode: GetContextFunction;

		getEnvironment: GetContextFunction;

		getWidgetWidth: GetContextFunction;

		openForm: OpenFormFunction;

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