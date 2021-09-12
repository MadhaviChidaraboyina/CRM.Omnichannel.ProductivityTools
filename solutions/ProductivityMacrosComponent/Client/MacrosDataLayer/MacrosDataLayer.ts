/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />

/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/

namespace Microsoft.ProductivityMacros.MacrosDataLayer
{
	export class DataHelper
	{
		private static instance: DataHelper;
		private static FPIHelper: FPIHelper;
		private static isAuthenticated: boolean;
		private static consumersList: string[];
		private static isMock: boolean;
		private static entityMetadataMap: { [entityLogicalName: string]: XrmClientApi.EntityMetadata };

		private constructor(isMock: boolean)
		{
			DataHelper.isMock = isMock ? isMock : false;
			DataHelper.FPIHelper = FPIHelper.getInstance(isMock);
			DataHelper.isAuthenticated = false;
			DataHelper.consumersList = new Array();
			DataHelper.entityMetadataMap = {};
			FPIHelper.authenticate().then(
				(status) =>
				{
					DataHelper.isAuthenticated = status;
				}
			);
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
		public static getInstance(isMock?: boolean)
		{
			if(Utils.isNullUndefinedorEmpty(DataHelper.instance))
			{
				DataHelper.instance = new DataHelper(isMock);
			}
			return DataHelper.instance;
		}

		
		public static sendFinishedMessage(message: FPIRequestMessage)
		{
			if(message.staticData && message.staticData.consumerId && message.staticData.requestId)
			{
				if(DataHelper.consumersList.indexOf(message.staticData.consumerId) === -1)
				{
					DataHelper.registerConsumer(message.staticData.consumerId);
				}
				return FPIHelper.makeFPIRequest(message, message.staticData.requestId);
			}
		}

	}
}