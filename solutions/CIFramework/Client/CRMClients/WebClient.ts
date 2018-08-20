/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="Client.ts" />
/// <reference path="Constants.ts" />
/// <reference path="WidgetIFrame.ts" />

namespace Microsoft.CIFramework.Internal
{
	/**
	 * Actual implementation of IClient for web client 
	*/
	export function webClient() : IClient
	{
		let client = {} as IClient;

		client.registerHandler = (eventName: string, handler: EventHandler): boolean =>
		{
			if (!this.eventHandlers) {
				this.eventHandlers = new Map<string, EventHandler>();
			}
			this.eventHandlers.set(eventName, handler);
			return true;
		}

		client.createRecord = (entityName: string, entityId?: string, valuesToUpdate?: Map<string, any> | string): Promise<Map<string, any>> => {
			if (!valuesToUpdate) {
				return rejectWithErrorMessage("Need values to create for createRecord", "createRecord");
			}
			let data: Map<string, any> = null;
			if (typeof (valuesToUpdate) == "string") {
				data = JSON.parse(valuesToUpdate);
			}
			else {
				data = valuesToUpdate;
			}
			return new Promise<Map<string, any>>((resolve, reject) => {
				return Xrm.WebApi.createRecord(entityName, buildEntity(data)).then(
					(result: XrmClientApi.LookupValue) => {
						return resolve(buildMap(result));
					},
					(error: Error) => {
						return rejectWithErrorMessage(error.message, "createRecord");
					});
			});
		}

		client.updateRecord =  (entityName: string, entityId: string, valuesToUpdate?: Map<string,any>|string): Promise<Map<string,any>> =>
		{
			if (!valuesToUpdate)
			{
				return rejectWithErrorMessage("Need values to update for updateRecord", "updateRecord");
			}
			let data: Map<string, any> = null;
			if (typeof (valuesToUpdate) == "string")
			{
				data = JSON.parse(valuesToUpdate);
			}
			else
			{
				data = valuesToUpdate;
			}
			return new Promise<Map<string, any>>((resolve, reject) =>
			{
				return Xrm.WebApi.updateRecord(entityName, entityId, buildEntity(data)).then(
				(result: XrmClientApi.LookupValue) =>
				{
					return resolve(buildMap(result));
				},
				(error: Error) =>
				{
					return rejectWithErrorMessage(error.message, "updateRecord");
				});
			});
		}

		client.retrieveRecord = (entityName: string, entityId: string, query?: string): Promise<Map<string,any>> =>
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
						return rejectWithErrorMessage(error.message, "retrieveRecord");
					});
			});
			 
		}

		client.deleteRecord = (entityName: string, entityId: string, valuesToUpdate?: Map<string, any> | string): Promise<Map<string, any>> => {
			return new Promise<Map<string, any>>((resolve, reject) => {
				return Xrm.WebApi.deleteRecord(entityName, entityId).then(
					(result: XrmClientApi.LookupValue) => {
						return resolve(buildMap(result));
					},
					(error: Error) => {
						return rejectWithErrorMessage(error.message, "deleteRecord");
					});
			});
		}

		client.sizeChanged = (context?: XrmClientApi.EventContext): void => {
			if (!this.eventHandlers) {
				this.eventHandlers = new Map<string, EventHandler>();
			}
			let handler: EventHandler = this.eventHandlers.get(Constants.SizeChangeHandler);
			if (handler) {
				let data: Map<string, any> = new Map<string, any>().set(Constants.value, Xrm.Panel.width);
				let event = new CustomEvent(Constants.SizeChangeHandler, { detail: data });
				handler(event);
			}
		}

		client.modeChanged = (context?: XrmClientApi.EventContext): void => {
			if (!this.eventHandlers) {
				this.eventHandlers = new Map<string, EventHandler>();
			}
			let handler: EventHandler = this.eventHandlers.get(Constants.ModeChangeHandler);
			if (handler) {
				let data: Map<string, any> = new Map<string, any>().set(Constants.value, Xrm.Panel.state);
				let event = new CustomEvent(Constants.ModeChangeHandler, { detail: data });
				handler(event);
			}
		}

		client.navigationHandler = (context?: XrmClientApi.EventContext): void => {
			if (!this.eventHandlers) {
				this.eventHandlers = new Map<string, EventHandler>();
			}
			let handler: EventHandler = this.eventHandlers.get(Constants.NavigationHandler);
			if (handler) {
				let pageURL: string = "";
				try {
					let args = context.getEventArgs() as XrmClientApi.NavigationEventArgs;  //Navigation events is internal API
					pageURL = args.pageUrl;
				}
				catch (error) { }
				let data: Map<string, any> = new Map<string, any>().set(Constants.value, pageURL);
				let event = new CustomEvent(Constants.ModeChangeHandler, { detail: data });
				handler(event);
			}
		}

		client.getUserID = (): string =>
		{
			return Xrm.Utility.getGlobalContext().userSettings.userId;
		}

		client.loadWidgets = (ciProviders: Map<string, CIProvider>): Promise<Map<string, boolean | string>> =>
		{
			const options: XrmClientApi.PanelOptions = {
				defaultCollapsedBehavior: false,
				onSizeChangeHandler: client.sizeChanged,
				onStateChangeHandler: client.modeChanged
			};
			return new Promise<Map<string, boolean | string>>((resolve, reject) => {
				return Xrm.Panel.loadPanel("/webresources/widgets_container.html", "", options).then(function () {
					Xrm.Navigation.addOnPreNavigation(client.navigationHandler);
					let widgetIFrame = (<HTMLIFrameElement>window.parent.document.getElementById(Constants.widgetIframeId));
					let targetWindow = window.parent;
					let status: Map<string, boolean | string> = new Map<string, boolean | string>();
					let widgetHeight: number = widgetIFrame.clientHeight / ciProviders.size;   //TODO: Figure out correct units to use
					widgetIFrame.onload = function () {
						var doc = widgetIFrame.contentDocument ? widgetIFrame.contentDocument : widgetIFrame.contentWindow.document;
						for (let [key, value] of ciProviders) {
							//TODO: parallelize these loads; add allow attributes for chrome. Also figure out how to set sizes on these
							var iFrame = document.createElement("iframe");
							iFrame.setAttribute("allow", "microphone; camera; geolocation");    //TODO - should we make these configurable?
							iFrame.setAttribute("sandbox", "allow-forms allow-popups allow-scripts allow-same-origin"); //TODO: make configurable?
							//iFrame.setAttribute("data-base_url", Xrm.Utility.getGlobalContext().getClientUrl());
							iFrame.src = key;
							iFrame.title = value.label;     //TODO: We may need to figure out where to put this title based on UX
							value.setContainer(new WidgetIFrameWrapper(iFrame), widgetIFrame.clientWidth, widgetHeight);
							doc.body.appendChild(iFrame);
							status.set(value.name, true);   //TODO: The status should be set once iFrame.src is loaded
						}
					}
					return resolve(status);
				}
				);
			});
		}

		client.openForm = (entityFormOptions: string, entityFormParameters?: string): Promise<Map<string, any>> =>
		{
			var fo: XrmClientApi.EntityFormOptions = JSON.parse(entityFormOptions);
			var fp: XrmClientApi.FormParameters = (entityFormParameters ? JSON.parse(entityFormParameters) : null);

			return new Promise<Map<string, any>>((resolve, reject) => {
				return Xrm.Navigation.openForm(fo, fp).then(function (res) {
					return resolve(new Map<string, any>().set(Constants.value, res));
				},
				function (err) {
					return reject(err);
				}
				);
			});
		}

		client.retrieveMultipleAndOpenRecords = (entityName: string, queryParmeters: string, searchOnly: boolean): Promise<Map<string,any>> =>
		{
			return new Promise<Map<string,any>>((resolve, reject) =>
			{
				Xrm.WebApi.retrieveMultipleRecords(entityName, queryParmeters).then(
					(result: XrmClientApi.WebApi.RetrieveMultipleResponse) =>
					{
						if(result.entities.length == 1) {
							let resultItem = result.entities[0];
							if (searchOnly == false)
							{
								var fo: XrmClientApi.EntityFormOptions = { entityName: entityName, entityId: resultItem[entityName + "id"]};
								Xrm.Navigation.openForm(fo);
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
						return rejectWithErrorMessage(error.message, "retrieveMultipleAndOpenRecords");
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
			Xrm.Panel.width = width;
		}

		client.getWidgetMode = (): number =>
		{
			return Xrm.Panel.state;
		}

		client.getEnvironment = (): Map<string,any> => {
			//Xrm.Page is deprecated hence definition not available in .d.ts
			//Using eval(...) to avoid compiler error
			var data: Map<string, any> = new Map<string, any>();
			try {
				let pageUrl: any = new URL(eval("window.top.Xrm.Page.getUrl()") as string);
				for (var entry of pageUrl.searchParams.entries()) {
					data.set(entry[0], entry[1]);
				}
			}
			catch (error) {
				//geturl not available on this page
			}
			var context: XrmClientApi.GlobalContext = Xrm.Utility.getGlobalContext();
			data.set(Constants.ClientUrl, context.getClientUrl());
			data.set(Constants.AppUrl, context.getCurrentAppUrl());
			data.set(Constants.OrgLcid, context.organizationSettings.languageId);
			data.set(Constants.OrgUniqueName, context.organizationSettings.uniqueName);
			data.set(Constants.UserId, context.userSettings.userId);
			data.set(Constants.UserLcid, context.userSettings.languageId);
			data.set(Constants.UserName, context.userSettings.userName);
			return data;
		}

		client.getWidgetWidth = (): number =>
		{
			return Xrm.Panel.width;
		}

		return client;
	}
}