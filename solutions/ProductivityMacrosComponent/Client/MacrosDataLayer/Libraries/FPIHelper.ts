/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/


namespace Microsoft.ProductivityMacros.MacrosDataLayer
{
	export class FPIHelper
	{
		private static instance: FPIHelper = null;
		private static isAuthenticated: boolean;
		private static iFrameExists: boolean;
		private static fpiURL: string;
		private static fpiOrigin: string;
		private static authenticationFailure: boolean;
		private static authenticationQuery: any;
		private static HelperID: string;
		private static requestMap: RequestMap;
		private static orgId: string;
		private static pendingRequests: FPIRequestMessage[];

		private constructor()
		{
			FPIHelper.isAuthenticated = false;
			FPIHelper.iFrameExists = false;
			FPIHelper.authenticationFailure = false;
			FPIHelper.requestMap = new RequestMap();
			FPIHelper.HelperID = Utils.newGuid();
			FPIHelper.orgId = FPIHelper.getOrgId();
			FPIHelper.pendingRequests = new Array<FPIRequestMessage>();
			if(Utils.isNullUndefinedorEmpty((window as any).omnichannelRequestStatus))
			{
				(window as any).omnichannelRequestStatus = {};
			}
			this.setFpiConfiguration(OrganizationSettings.instance.geoName);
			FPIHelper.fpiOrigin = new URL(FPIHelper.fpiURL).origin;
			FPIHelper.startAuthentication();
		}

		private setFpiConfiguration(geoName: string) {
            const setting = FpiGeoSettings[geoName.toUpperCase()] || FpiGeoSettings[GeoNames.DEFAULT];
            FPIHelper.fpiURL = setting.endpoint;
        }

        private static getOrgId(): string
		{
			try
			{
				let orgId: string = (window.top as any).Xrm.Utility.getGlobalContext().organizationSettings.organizationId;
				if(!Utils.isNullUndefinedorEmpty(orgId))
				{
					return orgId;
				}
			}
			catch(error)
			{
				return Utils.EMPTY_GUID
			}
			return Utils.EMPTY_GUID;
		}

		/**
		 * Creates iframe if it does not exist, and queries it using STATUS message if it does to authenticate
		 */
		private static startAuthentication()
		{
			FPIHelper.addEventListener();
			if(FPIHelper.doesIFrameExist())
			{
				FPIHelper.iFrameExists = true;
				FPIHelper.queryAuthenticationStatus();
			}
			else
			{
				FPIHelper.addFPIIframe();
			}
		}

		private static doesIFrameExist(): boolean
		{
			// Validate FpiIframe DOM element
            let fpiFrame = window.top.document.getElementById(FPIConstants.IFRAMEID);
			if (Utils.isNullUndefinedorEmpty(fpiFrame)) {
				return false;
			}
			return true;
		}

		/**
		 * Event listener for messages from FPI iframe
		 */
		private static addEventListener()
		{
			window.top.addEventListener(FPIConstants.FPIMESSAGE_EVENTNAME, FPIHelper.fpiCallBack.bind(this));
		}

		/**
		 * Adds FPI Iframe to DOM
		 */
		private static addFPIIframe()
		{
			let FpiIframe = window.top.document.createElement("iframe");
			FpiIframe.id = FPIConstants.IFRAMEID;
			FpiIframe.name = FPIConstants.IFRAMEID;
			FpiIframe.title = FPIConstants.IFRAMETITLE;
			FpiIframe.src = FPIHelper.fpiURL;
			FpiIframe.style.display = "none";
			FpiIframe.onload = FPIHelper.fpiIframeExistsVerify.bind(this);
			window.top.document.body.appendChild(FpiIframe);
			FPIHelper.iFrameExists = true;
		}

		/**
		 * Queries FPI iframe if authenticated to return a tokenacquired event or begin authentication if not authenticated
		 */
		private static queryAuthenticationStatus()
		{
			let message: FPIRequestMessage =  FPIHelper.createFPIRequestMessage(RequestTypes.STATUS, "", null, {});
			FPIHelper.sendMessage(message);
		}

		private static fpiIframeExistsVerify()
		{
			if(!FPIHelper.doesIFrameExist())
			{
				FPIHelper.iFrameExists = false;
			}
		}

		/**
		 * Function for dataResponse Success Handling
		 */
		private static dataResponseSuccessHandling(event: IFPISuccessResponseMessage): void
		{
			let requestId = event.data.staticData.requestId;
			if (!Utils.isNullUndefinedorEmpty(requestId))
			{
				let response = event.data.responseData;
				try
				{
					FPIHelper.requestMap.getRequestMapValue(requestId).resolve(response);
                    FPIHelper.requestMap.deleteFromRequestMap(requestId);
					let map: Map<string, string> = (window as any).omnichannelRequestStatus[event.data.staticData.consumerId];
					map.set(event.data.staticData.requestId, event.data.transactionid);
				}
				catch(error)
				{
                    console.log("Error Success response handling : " + error);
				}
			}
			else
			{
				FPIHelper.handleInvalidRequestID(requestId);
			}
		}

		/**
		* Function for dataResponse Failure Handling
		*/
		private static dataResponseFailureHandling(event: IFPIFailureResponseMessage): void
		{
			let requestId = event.data.staticData.requestId;
			if (!Utils.isNullUndefinedorEmpty(requestId))
			{
				try
				{
					FPIHelper.requestMap.getRequestMapValue(requestId).reject(event.data.responseData);

					// Log failure with details
					let statusCode = -1;
					if (!Utils.isNullUndefinedorEmpty(event.data.statusCode)) {
						statusCode = event.data.statusCode;
					}
					let additionalDetails = "status: " + statusCode;
					FPIHelper.requestMap.deleteFromRequestMap(requestId);
					let map: Map<string, string> = (window as any).omnichannelRequestStatus[event.data.staticData.consumerId];
					map.set(event.data.staticData.requestId, event.data.transactionid);
				}
				catch(error)
				{
                    console.log("Error failure response handling : " + error);
				}
			}
			else
			{
				FPIHelper.handleInvalidRequestID(requestId);
			}
		}

		/*
		 * Invalid request Id Handler
		 */
		private static handleInvalidRequestID(requestId: string): void
		{
			FPIHelper.requestMap.deleteFromRequestMap(requestId);
		}

		/**
		 * Method to process FPI Post response 
		 * @param event Sent by FPI iframe with data
		 */
		private static processIframeData(event: IFPISuccessResponseMessage): void
        {
			if (!Utils.isNullUndefinedorEmpty(event.data))
			{
				if (!Utils.isNullUndefinedorEmpty(event.data.staticData))
				{
					if (event.data.staticData.HelperID !== FPIHelper.HelperID)
						return;
					else
					{
						// Do processing for this control instance based on isFailure and responseData
						if (event.data.isFailure === false && event.data.statusCode === 200)
						{
							FPIHelper.dataResponseSuccessHandling(event);
						}
						else
						{
							// Log to (window as any).omnichannelRequestStatus and telemetry with transaction id
							// Call failure handler
							FPIHelper.dataResponseFailureHandling(event);
						}
					}
				}
			}
		}

		/**
		 * Sets authenticated status to true, returns any authentication promises, and fires pending requests
		 */
		private static handleAuthSucess()
		{
			FPIHelper.isAuthenticated = true;
			if(!Utils.isNullUndefinedorEmpty(FPIHelper.authenticationQuery))
			{
				FPIHelper.authenticationQuery.resolve(true);
			}

			while(FPIHelper.pendingRequests.length > 0)
			{
				let message = FPIHelper.pendingRequests.pop();
				FPIHelper.sendMessage(message);
			}
		}

		private static handleAuthFailure(statusText: any)
		{
			FPIHelper.authenticationFailure = true;
			if(!Utils.isNullUndefinedorEmpty(FPIHelper.authenticationQuery))
			{
				FPIHelper.authenticationQuery.resolve(false);
            }

			while(FPIHelper.pendingRequests.length > 0)
			{
				let message = FPIHelper.pendingRequests.pop();
				let requestId = message.staticData.requestId;
				try
				{
					let authFailureResponse = new FPIAuthenticationFailureResponse();
					FPIHelper.requestMap.getRequestMapValue(requestId).reject(authFailureResponse);
					FPIHelper.requestMap.deleteFromRequestMap(requestId);
				}
				catch(error)
				{
                    console.log("Error handling auth failure : " + error);
				}
			}
		}

		/**
		 * Callback method for message event
		 * @param event Message sent by FPI Iframe
		 */
		private static fpiCallBack(event: MessageEvent): void
		{
			if(!FPIHelper.verifyMessageEventOrigin(event.origin)){
				console.debug(`Unexpected origin: ${event.origin}.`);
				return;
			}
			FPIHelper.convertResponseMessage(event);
			if (Utils.isNullUndefinedorEmpty(event.data) || !Utils.isOmniChannelFPIApp(event))
			{
				return;
			}
			if (Utils.isTokenAcquired(event)) //Authentication successful and token is acquired
			{
				this.handleAuthSucess();
			}
			else
			{
				/* Process GET/POST Response
				 * Token is acquired and received response back to the control
				 */
				if (FPIHelper.isAuthenticated)
				{
					FPIHelper.processIframeData(event);
				}
				else if (Utils.isAuthFailure(event))
				{
					this.handleAuthFailure(event.data.responseText);
				}
			}
		}

		/**
		 * Ensures constructor has been called and instance available
		 */
		public static getInstance()
		{
			if(Utils.isNullUndefinedorEmpty(FPIHelper.instance))
			{
				FPIHelper.instance = new FPIHelper();
			}
			return FPIHelper.instance;
		}

		/**
		 * Creates FPI request message
		 * @param method method name of the request
		 * @param url url for the request
		 * @param payload payload for the request
		 * @param orgId orgId
		 * @param staticData staticData to be included in message
		 */
		private static createFPIRequestMessage(method: string, url: string, payload: string, staticData: any) 
		{
			let message = new FPIRequestMessage();
			message.url = url;
			message.payload = payload;
			message.requestType = method;
			message.staticData = staticData;
			message.header = { "OrganizationId": FPIHelper.orgId };
			return message;
		}

		/**
		 * Posts message on FPI Iframe
		 * @param message message to be posted
		 */
		private static sendMessage(message: FPIRequestMessage)
		{
			try
			{
				if(Utils.isNullUndefinedorEmpty((window as any).omnichannelRequestStatus[message.staticData.consumerId]))
				{
					(window as any).omnichannelRequestStatus[message.staticData.consumerId] = new Map<string, string>();
				}
				let map: Map<string, string> = (window as any).omnichannelRequestStatus[message.staticData.consumerId];
				if(map.size >= 10)
				{
					map.delete(map.keys().next().value)
				}
				map.set(message.staticData.requestId, "Pending");
			}
			catch(error)
			{
				//TODO: add telemetry.
                console.log("Error sending message : " + error);
			}
			let fpiFrame = window.top.document.getElementById(FPIConstants.IFRAMEID);

			if (!Utils.isNullUndefinedorEmpty(fpiFrame))
			{
				// Post message on FPI Iframe
                console.log("Message sent to FPI");
                (<HTMLIFrameElement>fpiFrame).contentWindow.postMessage(FPIHelper.convertRequestMessage(message), FPIHelper.fpiOrigin);
			}
			else
			{
                console.log("FPIIframe is not defined : ");
			}
		}

		/**
		 * Ability for consumer to manually authenticate or wait for authentication
		 * Returns a promise that resolved to true if authenticated and false if auth failure
		 */
		public static authenticate(): Promise<boolean>
		{
			if(FPIHelper.isAuthenticated && FPIHelper.iFrameExists)
			{
				return Promise.resolve(true);
			}
			if(FPIHelper.authenticationFailure)
			{
				return Promise.resolve(false);
			}
			let authenticationPromise;
			if (Utils.isNullUndefinedorEmpty((window as any).$) || Utils.isNullUndefinedorEmpty((window as any).$.Deferred())) {
				authenticationPromise = (window as any).top.$.Deferred();
			}
			else {
				authenticationPromise = (window as any).$.Deferred();
			}
			FPIHelper.authenticationQuery = authenticationPromise;
			return FPIHelper.authenticationQuery;
		}

		/**
		 * Makes a request via FPI iframe
		 * @param message FPIRequestMessage object - does not need organization ID in headers or base URL in URL
		 * @param requestId For logging - needs to match staticData.requestId
		 */
		public makeFPIRequest(message: FPIRequestMessage, requestId: string): Promise<any>
		{
			let dataPromise;
			if (Utils.isNullUndefinedorEmpty((<any>window).$) || Utils.isNullUndefinedorEmpty((<any>window).$.Deferred)) {
				dataPromise = (<any>window).top.$.Deferred();
			}
			else {
				dataPromise = (<any>window).$.Deferred();
			}
			if(message && message.staticData && message.staticData.requestId && message.staticData.requestId === requestId && FPIHelper.authenticationFailure === false)
			{
				message.staticData.HelperID = FPIHelper.HelperID;
				FPIHelper.requestMap.addToRequestMap(message.staticData.requestId, dataPromise);

				if(FPIHelper.isAuthenticated)
				{
					FPIHelper.sendMessage(message);
				}
				else
				{
					FPIHelper.pendingRequests.push(message);
				}
				return dataPromise;
			}
			else if(!(message && message.staticData && message.staticData.requestId && message.staticData.requestId === requestId))
			{
				return dataPromise.reject("Static data must contain requestId property");
			}
			else
			{
				let authFailureResponse = new FPIAuthenticationFailureResponse();
				return dataPromise.reject(authFailureResponse);
			}
		}

		private static convertRequestMessage(message: FPIRequestMessage): FpiRequestMessageEventData {
			const data = new FpiRequestMessageEventDataData();
			data.apiUrl = message.url;
			data.resourceUri = message.resource;
			data.methodType = message.requestType;
			data.postdata = message.payload;
			data.additionalHeaders = message.header;
            const eventData = new FpiRequestMessageEventData();
            eventData.method = message.requestType === RequestTypes.STATUS
                ? FPIConstants.QUERY_FPI_STATUS
                : FPIConstants.EXTERNAL_REST_ODATA_API;
			eventData.windowPostMessageProxy = message.staticData;
			eventData.data = data;
			return eventData;
		}

		private static convertResponseMessage(messageEvent: MessageEvent): void {
			const data = messageEvent.data as FpiResponseMessageEventData;
			if (!data) {
				return;
			}

			if (FPIHelper.isStatusResponse(data)) {
				const authenticationMessage = (messageEvent as IFPIAuthenticationMessage).data;
				authenticationMessage.isFailure = !!data.error;
				authenticationMessage.senderApp = FPIConstants.IFRAME_APPNAME;
				authenticationMessage.responseData = { tokenAcquired: true, componentId: FPIConstants.IFRAMEID, responseText: "" };
				return;
			}

			if (data.error) {
				const failureResponseMessage = (messageEvent as IFPIFailureResponseMessage).data;
				failureResponseMessage.staticData = data.windowPostMessageProxy;
				failureResponseMessage.isFailure = !!data.error;
				failureResponseMessage.statusCode = data.responseData && data.responseData.status;
				failureResponseMessage.senderApp = FPIConstants.IFRAME_APPNAME;
				failureResponseMessage.statusText = data.responseData && data.responseData.statusText;
				failureResponseMessage.transactionid = null;
				failureResponseMessage.responseData = { responseText: data.error };
			}
			else {
				const successResponseMessage = (messageEvent as IFPISuccessResponseMessage).data;
				successResponseMessage.staticData = data.windowPostMessageProxy;
				successResponseMessage.senderApp = FPIConstants.IFRAME_APPNAME;
				successResponseMessage.statusText = data.responseData && data.responseData.statusText;
				successResponseMessage.transactionid = null;
				successResponseMessage.isFailure = !!data.error;
				successResponseMessage.statusCode = data.responseData && data.responseData.status;
				successResponseMessage.responseData = data.data;
			}
		}

		private static isStatusResponse(data: FpiResponseMessageEventData): boolean{
			return data.key === FPIConstants.QUERY_FPI_STATUS;
		}

		private static verifyMessageEventOrigin(origin: string): boolean {
			const url = new URL(origin);
			return url.origin === FPIHelper.fpiOrigin;
		}

	}
}