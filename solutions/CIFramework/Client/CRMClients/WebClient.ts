/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="Client.ts" />
/// <reference path="Constants.ts" />

namespace Microsoft.CIFramework.Internal
{
	/**
	 * Actual implementation of IClient for web client 
	*/
	export function webClient() : IClient
	{
		let client = {} as IClient;

		client.updateRecord =  (entityName: string, entityId: string, valuesToUpdate: Map<string,any>|string): Promise<Map<string,any>> =>
		{
			if (typeof(valuesToUpdate) == "string")
			{
				return rejectWithErrorMessage("For updateRecord.valuesToUpdate, expected type is Map and actual type passed is string");
			}
	
			return new Promise<Map<string, any>>((resolve, reject) =>
			{
				return Xrm.WebApi.updateRecord(entityName, entityId, buildEntity(valuesToUpdate)).then(
				(result: XrmClientApi.LookupValue) =>
				{
					return resolve(buildMap(result));
				},
				(error: Error) =>
				{
					return reject(buildMap(error));
				});
			});
		}

		client.retrieveRecord = (entityName: string, entityId: string, query: string): Promise<Map<string,any>> =>
		{
			return new Promise<Map<string, any>>((resolve, reject) =>
			{
				return Xrm.WebApi.retrieveRecord(entityName, entityId, query).then(
					(result: XrmClientApi.WebApi.Entity) =>
					{
						return resolve(buildMap(result));
					},
					(error: Error) =>
					{
						return reject(buildMap(error));
					});
			});
			 
		}

		client.getUserID = (): string =>
		{
			return Xrm.Utility.getGlobalContext().userSettings.userId;
		}

		client.loadWidget = (url: string, title: string): void =>
		{
			Xrm.Panel.loadPanel(url, title, true);
		}

		client.retrieveMultipleAndOpenRecords = (entityName: string, queryParmeters: string, searchOnly: boolean): Promise<Map<string,any>> =>
		{
			return new Promise<Map<string,any>>((resolve, reject) =>
			{
				Xrm.WebApi.retrieveMultipleRecords(entityName, queryParmeters).then(
					(result) =>
					{
						if(result.entities.length == 1) {
							let resultItem = result.entities[0];
							if (searchOnly == false)
							{
								Xrm.Utility.openEntityForm(entityName, resultItem[entityName + "id"]);
							}
						}
						else if(result.entities.length > 1) {
							//To-Do handle this after UC dependency to open categorized search page on same window is resolved
						}
						else {
							//To-Do handle this after UC dependency to open categorized search page on same window is resolved
						}
						return resolve(new Map<string,any>().set(Constants.value, result.entities));
					},
					(error: Error) =>
					{
						return reject(error);
					}
				);
			}); 
		}
		
		client.setWidgetMode = (name: string, mode: number): void =>
		{
			Xrm.Panel.state = mode;
		}

		client.setWidgetWidth = (name: string, width: number): void =>
		{
			Xrm.Panel.setPanelWidth(width);
		}

		client.getWidgetMode = (): number =>
		{
			return Xrm.Panel.state;
		}

		client.getWidgetWidth = (): number =>
		{
			return Xrm.Panel.getPanelWidth();
		}

		return client;
	}
}