/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="Constants.ts" />
/// <reference path="WebClient.ts" />

namespace Microsoft.CIFramework.Internal
{
	/**
	 * type defined for storing all local information at one place. 
	*/
	export type IState = 
	{
		/**
		 * this will refer to the actual IClient implementation based on the type of client CI library is loaded on
		*/
		client: IClient;

		/**
		 *  Map to store providers information. key'ed on landing urls
		*/
		ciProviders : Map<string,any>;

		/**
		 * Post message wrapper object
		 */
		messageLibrary: postMessageNamespace.postMsgWrapper;
	}

	/*Class to store CI providers information locally*/
	export class CIProvider
	{
		readonly providerId : string;			//Widget id
		readonly name : string; 				// Widget Providers name
		readonly label : string;					// Label of the Widget
		readonly widgetHeight : number; 	// Height of the widget Panel
		readonly widgetWidth : number;	//Width of the widget Panel
		clickToAct : boolean;		//Boolean flag to enable or disable Click to act functionality , it can be changed through setClickToAct API
		constructor(x : XrmClientApi.WebApi.Entity)
		{
			this.name = x[Constants.name];
			this.providerId = x[Constants.providerId];
			this.label = x[Constants.label];
			this.widgetHeight = x[Constants.widgetHeight];
			this.widgetWidth = x[Constants.widgetWidth];
			this.clickToAct = x[Constants.clickToActAttributeName];
		}
	}
}