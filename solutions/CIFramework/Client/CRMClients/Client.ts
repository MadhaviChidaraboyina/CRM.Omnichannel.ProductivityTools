/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="Constants.ts" />
/// <reference path="PresenceControl.ts" />
/** @internal */
namespace Microsoft.CIFramework.Internal
{
	export type EventHandler = (event?: CustomEvent) => void;

	type XrmEventHandler = (context?: XrmClientApi.EventContext) => void;

	type RegisterHandler = (eventName: string, handler: EventHandler) => boolean;

	type RemoveHandler = (eventName: string) => EventHandler;
	/**
	 * Func type for all CRUD functions.
	*/
	type CRUDFunction = (entityName: string, entityId?: string, telemetryData?: Object, data?: Map<string, any> | string) => Promise<Map<string, any>>;

	/**
	 * Func type for all set a setting kind of functions.
	*/
	type SetSettingFunction = (name: string, value: any, telemetryData?: Object) => string|number|void;

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
	 * Func type for opening a KB serach control 
	*/
	type openKBSearchControlFunction = (searchString: string,telemetryData?: Object) => boolean;
	
	/**
	 * Func type for loading all widgets.
	*/
	type LoadWidgetsFunction = (ciProviders: Map<string, CIProvider>) => Promise<Map<string, boolean | string>>;

	/**
	 * Func type for get Metadata about an entity
	*/
	type getMetadataFunction = (entityName: string, attributes?: Array<string>) => Promise<Object>;

	/**
	 * Func type to check if this client can and should load CIF
	*/
	type CheckCapabilityFunction = () => boolean;

	/**
	 * Func type for search based on Search String
	*/
	type renderSearchPageFunction = (entityName: string, searchString: string, telemetryData?: Object) => Promise<void>;

	/**
	 * Func type for Setting Agent Presence
	*/
	type setAgentPresenceFunction = (presenceInfo: PresenceInfo, telemetryData?: Object) => boolean;

	/**
	 * Func type for Setting all presences
	*/
	type initializeAgentPresenceListFunction = (presenceList: PresenceInfo[], telemetryData?: Object) => boolean;

	/**
	 * Func type for using the flap for rendering any control
	*/
	type expandFlapFunction = () => number;

	type collapseFlapFunction = () => number;

	type flapInUseFunction = () => boolean;

	/**
	 * Func type to add UISession
	*/
	type addUISessionFunction = (id: string, initials: string, sessionColor: string, providerId: string) => void;

	/**
	 * Func type to remove UISession
	*/
	type removeUISessionFunction = (id: string) => void;

	/**
	 * Func type to get color of UISession
	*/
	type getUISessionColorFunction = (id: string) => string;

	/**
	 * Func type to update UISession
	*/
	type updateUISessionFunction = (id: string, visible: boolean) => void;

	/**
	 * Func type to update UISession on unread messages
	*/
	type notifyUISessionFunction = (id: string, messagesCount: number) => void;

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

		setPanelWidth: SetSettingFunction;

		getWidgetMode: GetContextFunction;

		getEnvironment: GetContextFunction;

		getWidgetWidth: GetContextFunction;

		openForm: OpenFormFunction;
		
		openKBSearchControl:openKBSearchControlFunction;		

		getEntityMetadata: getMetadataFunction;

		checkCIFCapability: CheckCapabilityFunction;

		renderSearchPage: renderSearchPageFunction;

		expandFlap: expandFlapFunction;

		collapseFlap: collapseFlapFunction;

		addUISession: addUISessionFunction;

		removeUISession: removeUISessionFunction;

		getUISessionColor: getUISessionColorFunction;

		updateUISession: updateUISessionFunction;

		notifyUISession: notifyUISessionFunction;

		flapInUse: flapInUseFunction;
		}

	export type IPresenceManager = {

		setAgentPresence: setAgentPresenceFunction;

		initializeAgentPresenceList: initializeAgentPresenceListFunction;
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

	export function GetPresenceManager(clientType: number): IPresenceManager {
		switch (clientType) {
			case ClientType.WebClient:
				return UCIPresenceManager();
			default:
				return UCIPresenceManager();
		}
	}
}