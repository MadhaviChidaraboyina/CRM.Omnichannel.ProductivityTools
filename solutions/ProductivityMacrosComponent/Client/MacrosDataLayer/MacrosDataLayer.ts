/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />

/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/

namespace Microsoft.ProductivityMacros.MacrosDataLayer
{
	export class DataHelper
	{
		private static instance: DataHelper;
		private static consumersList: string[];
		private readonly flowClient: FlowClient;

		private constructor()
		{
			DataHelper.consumersList = new Array();
			this.flowClient = new FlowClient();
		}

		/**
		 * To be called when a new consumer initializes itself
		 * @param consumerId Preferably unique identification of consumer in telemetry
		 */
		public static registerConsumer(consumerId: string)
		{
			if(DataHelper.consumersList.indexOf(consumerId) === -1)
			{
				DataHelper.consumersList.push(consumerId);
			}
			else
			{
				//TODO: add telemetry.
			}
		}

		/**
		 * To be called when a new consumer destroys itself
		 * @param consumerId Previously passed identification of consumer in telemetry
		 */
		public static deRegisterConsumer(consumerId: string)
		{
			let index = DataHelper.consumersList.indexOf(consumerId);
			if(index > 0)
			{
				DataHelper.consumersList.splice(index, 1);
			}
			if(DataHelper.consumersList.length === 0)
			{
				// Handle no consumers alive scenario destroy resources
			}
		}

		/**
		 * Initializes DataHelper and returns instance reference
		 */
		public static getInstance(): DataHelper
		{
			if(Utils.isNullUndefinedorEmpty(DataHelper.instance))
			{
				DataHelper.instance = new DataHelper();
			}
			return DataHelper.instance;
		}

		public get FlowClient(): FlowClient{
			return this.flowClient;
		}

	}
}