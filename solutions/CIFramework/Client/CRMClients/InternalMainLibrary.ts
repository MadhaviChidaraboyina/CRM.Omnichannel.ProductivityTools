/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="Client.ts" />
/// <reference path="Constants.ts" />
/// <reference path="State.ts" />
/// <reference path="../TelemetryHelper.ts" />

namespace Microsoft.CIFramework.Internal
{
	/**
	 * mapping of handlers for each API needed by postMessageWrapper
	 */
	const apiHandlers = new Map<string, any>([
		["setclicktoact", [setClickToAct]],
		["searchandopenrecords", [searchAndOpenRecords]], 
		["setmode", [setMode]],
		["setwidth", [setWidth]],
		["getmode", [getMode]],
		["getwidth", [getWidth]],
		["getclicktoact", [getClickToAct]]
	]);

	/**
	 * Variable that will store all the info needed for library. There should be no other global variables in the library. Any info that needs to be stored should go into this.
	 */
	let state = {} as IState;
	const listenerWindow = window.parent;

	/**
	 * This method will starting point for CI library and perform setup operations. retrieve the providers from CRM and initialize the Panels, if needed.
	 * returns false to disable the button visibility
	 */
	export function initializeCI(clientType: number) : boolean
	{
		let startTime = Date.now();
		// set the client implementation.
		state.client = setClient(clientType);

		// Todo - User story - 1083257 - Get the no. of widgets to load based on client & listener window and accordingly set the values.
		const widgetCount = 1;

		// Retrieve providers associated with system user
		state.client.retrieveRecord(Constants.systemUserLogicalName, state.client.getUserID().toString(), String.format(Constants.providerOdataQuery, widgetCount)).then(
		(result : Map<string,any>)=>
		{
			if (result && result.get(Constants.providerNavigationProperty))
			{
				//event listener for the onCliCkToAct event
				listenerWindow.removeEventListener(Constants.CIClickToAct, onClickToAct);
				listenerWindow.addEventListener(Constants.CIClickToAct, onClickToAct);
				// populate ciProviders in state.
				state.ciProviders = new Map<string,any>();
				for(var x of result.get(Constants.providerNavigationProperty))
				{
					state.ciProviders.set(x[Constants.landingUrl], new CIProvider(x));
				}

				// initialize and set post message wrapper.
				state.messageLibrary = new postMessageNamespace.postMsgWrapper(listenerWindow, Array.from(state.ciProviders.keys()), apiHandlers);
				
				// load the widgets onto client. 
				// todo: check if we need to load the widgets or the client will do it based on client config
				for(let [key, value]  of state.ciProviders)
				{
					state.client.loadWidget(key, value.label);
				}

				reportUsage(initializeCI.name + "Executed successfully in" + (Date.now() - startTime) + "ms for providers: " + mapToString(result));
			}
			else
			{
				reportUsage(initializeCI.name + "Executed successfully in" + (Date.now() - startTime) + "ms with zero providers for the current user");
			}
		},(error : Map<string,any>)=>
		{
			reportError(initializeCI.name + "Execution failed  in" + (Date.now() - startTime) + "ms with error as " + error.get(Constants.message));
		});
		return false;
	}

/**
	 * setClickToAct API's client side handler that post message library will invoke. 
	*/
	export function setClickToAct(parameters: Map<string, any>) : Promise<Map<string,any>>
	{
		let startTime =	Date.now();
		if (!parameters)
		{
			return rejectWithErrorMessage("Parameter list cant be empty");
		}
		if (!parameters.get(Constants.originURL))
		{
			return rejectWithErrorMessage("Paramter:url cant be empty");
		}
		if (isNullOrUndefined(parameters.get(Constants.value)))
		{
			return rejectWithErrorMessage("Parameter:value cant be empty");
		}

		let provider = state.ciProviders.get(parameters.get(Constants.originURL));
		if(provider && provider.providerId)
		{
			return new Promise<Map<string, any>>((resolve, reject) =>
			{
				return state.client.updateRecord(Constants.providerLogicalName, provider.providerId,
										new Map<string, any>([ [Constants.clickToActAttributeName, parameters.get(Constants.value) as boolean] ])).then(
				(result: Map<string, any>) =>
				{
					provider.clickToAct = parameters.get(Constants.value) as boolean;
					state.ciProviders.set(parameters.get(Constants.originURL), provider);
					reportUsage(setClickToAct.name + "Executed successfully with result as " + mapToString(result));
					return resolve(result);
				},
				(error: Map<string, any>) =>
				{
					reportError(setClickToAct.name + "Execution failed with error as " + error.get(Constants.message));
					return reject(error);
				});
			});
		}
		else
		{
			reportError(setClickToAct.name + "Execution failed with error as Associated Provider record not found.");
			return rejectWithErrorMessage("Associated Provider record not found.");
		}
	}

	/**
	* API to check ClickToAct is enabled or not
	*/
	export function getClickToAct(parameters: Map<string, any>) : Promise<Map<string, any>>
	{
		let startTime  = Date.now();
		if (!parameters)
		{
			return rejectWithErrorMessage("Parameter list cant be empty");
		}
		if (!parameters.get(Constants.originURL))
		{
			return rejectWithErrorMessage("Paramter:url cant be empty");
		}

		const provider = state.ciProviders.get(parameters.get(Constants.originURL));
		if(provider && provider.providerId)
		{
			reportUsage(getClickToAct.name + "Executed successfully with result as " + provider.clickToAct);
			return Promise.resolve(new Map().set(Constants.value, provider.clickToAct));
		}
		else
		{
			reportError(getClickToAct.name + "Execution failed with error as Associated Provider record not found.");
			return rejectWithErrorMessage("Associated Provider record not found.");
		}

	}

	/**
	 * setMode API's client side handler that post message library will invoke. 
	*/
	export function setMode(parameters: Map<string, any>) : Promise<Map<string, any>>
	{
		let startTime  = Date.now();
		if (!parameters)
		{
			return rejectWithErrorMessage("Parameter list cant be empty");
		}
		if (!parameters.get(Constants.originURL))
		{
			return rejectWithErrorMessage("Paramter:url cant be empty");
		}
		if (isNullOrUndefined(parameters.get(Constants.value)))
		{
			return rejectWithErrorMessage("Parameter:value cant be empty");
		}

		const provider = state.ciProviders.get(parameters.get(Constants.originURL));
		if(provider && provider.providerId)
		{
			state.client.setWidgetMode(null, parameters.get(Constants.value) as number);
			reportUsage(setMode.name + "Executed successfully");
			return Promise.resolve(new Map());
		}
		else
		{
			reportError(setMode.name + "Execution failed with error as Associated Provider record not found.");
			return rejectWithErrorMessage("Associated Provider record not found.");
		}
	}

	/**
	 * setWidth API's client side handler that post message library will invoke. 
	*/
	export function setWidth(parameters: Map<string, any>) : Promise<Map<string, any>>
	{
		let startTime  = Date.now();
		if (!parameters)
		{
			return rejectWithErrorMessage("Parameter list cant be empty");
		}
		if (!parameters.get(Constants.originURL))
		{
			return rejectWithErrorMessage("Paramter:url cant be empty");
		}
		if (isNullOrUndefined(parameters.get(Constants.value)))
		{
			return rejectWithErrorMessage("Parameter:value cant be empty");
		}

		const provider = state.ciProviders.get(parameters.get(Constants.originURL));
		if(provider && provider.providerId)
		{
			state.client.setWidgetWidth(null, parameters.get(Constants.value) as number);
			reportUsage(setWidth.name + "Executed successfully");
			return Promise.resolve(new Map());
		}
		else
		{
			reportError(setWidth.name + "Execution failed with error as Associated Provider record not found.");
			return rejectWithErrorMessage("Associated Provider record not found.");
		}
	}

	/**
	 * getMode API's client side handler that post message library will invoke. 
	*/
	export function getMode(parameters: Map<string, any>) : Promise<Map<string, any>>
	{
		let startTime  = Date.now();
		if (!parameters)
		{
			return rejectWithErrorMessage("Parameter list cant be empty");
		}
		if (!parameters.get(Constants.originURL))
		{
			return rejectWithErrorMessage("Paramter:url cant be empty");
		}

		const provider = state.ciProviders.get(parameters.get(Constants.originURL)); // if there are multiple widgets then we need this to get the value of particular widget 
		if(provider && provider.providerId)
		{
			reportUsage(getMode.name + "Executed successfully");
			return Promise.resolve(new Map().set(Constants.value, state.client.getWidgetMode()));
		}
		else
		{
			reportError(getMode.name + "Execution failed with error as Associated Provider record not found.");
			return rejectWithErrorMessage("Associated Provider record not found.");
		}
	}

	/**
	 * getWidth API's client side handler that post message library will invoke. 
	*/
	export function getWidth(parameters: Map<string, any>) : Promise<Map<string, any>>
	{
		let startTime  = Date.now();
		if (!parameters)
		{
			return rejectWithErrorMessage("Parameter list cant be empty");
		}
		if (!parameters.get(Constants.originURL))
		{
			return rejectWithErrorMessage("Paramter:url cant be empty");
		}

		const provider = state.ciProviders.get(parameters.get(Constants.originURL));
		if(provider && provider.providerId)
		{
			reportUsage(getWidth.name + "Executed successfully");
			return Promise.resolve(new Map().set(Constants.value, state.client.getWidgetWidth()));
		}
		else
		{
			reportError(getWidth.name + "Execution failed with error as Associated Provider record not found.");
			return rejectWithErrorMessage("Associated Provider record not found.");
		}
	}

	/**
	 * subscriber of onClickToAct event
	*/
	export function onClickToAct(event: CustomEvent) : void
	{
		let startTime =	Date.now();
		const payload: postMessageNamespace.IExternalRequestMessageType = {
			messageType: MessageType.onClickToAct,
			messageData : buildMap(event.detail)
		}

		let widgetIFrame = (<HTMLIFrameElement>listenerWindow.document.getElementById(Constants.widgetIframeId));//TO-DO: for multiple widgets, this might be the part of for loop
		for(let [key, value] of state.ciProviders)
		{
			if(value.clickToAct)
			{
				state.messageLibrary.postMsg(widgetIFrame.contentWindow, payload, key, true);
			}
		}
		reportUsage(onClickToAct.name + " event recieved from client with event data as " + eventToString(event));
	}

	export function searchAndOpenRecords(parameters: Map<string, any>) : Promise<Map<string,any>>
	{
		if (!parameters)
		{
			return rejectWithErrorMessage("Parameter list cant be empty");
		}
		if (!parameters.get(Constants.originURL))
		{
			return rejectWithErrorMessage("Paramter:url cant be empty");
		}
		if (!parameters.get(Constants.entityName))
		{
			return rejectWithErrorMessage("Parameter:entityName cant be empty");
		}
		if (!parameters.get(Constants.queryParameters))
		{
			return rejectWithErrorMessage("Parameter:query cant be empty");
		}

		const provider = state.ciProviders.get(parameters.get(Constants.originURL));
		if(provider && provider.providerId)
		{
			return state.client.retrieveMultipleAndOpenRecords(parameters.get(Constants.entityName), parameters.get(Constants.queryParameters));
		}
		else
		{
			reportError(searchAndOpenRecords.name + "Execution failed with error as Associated Provider record not found.");
			return rejectWithErrorMessage("Associated Provider record not found.");
		}
	}
}
