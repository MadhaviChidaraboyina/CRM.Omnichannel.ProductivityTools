namespace Microsoft.ProductivityMacros.MacrosDataLayer
{
	interface IRequestMap
	{
		[key: string] : any;
	}
	
	export class RequestMap
	{
		private requestMap: IRequestMap = {};

		constructor()
		{
			
		}
		/**
		 * Utility function to add value into RequestMap
		 * @param requestId Id of the request to be added in the request map
		 * @param value Promise added to the request map
		 */
		public addToRequestMap(requestId: string, value: any) 
		{
			if(!Utils.isNullUndefinedorEmpty(requestId))
			{
				this.requestMap[requestId] = value;
			}
		}

		/**
		 * Gets Promise for given request id
		 * @param requestId
		 */
		public getRequestMapValue(requestId: string): any 
		{
			if(!Utils.isNullUndefinedorEmpty(requestId) && !Utils.isNullUndefinedorEmpty(this.requestMap[requestId]))
			{
				return this.requestMap[requestId];
			}
			else
			{
				return new Error("Key not present in dictionary");
			}
		}

		/**
		 * Utility function to delete entry from  RequestMap
		 */
		public deleteFromRequestMap(requestId: string) 
		{
			if(!Utils.isNullUndefinedorEmpty(requestId) && !Utils.isNullUndefinedorEmpty(this.requestMap[requestId]))
			{
				delete this.requestMap[requestId];
			}
		}
	}
}