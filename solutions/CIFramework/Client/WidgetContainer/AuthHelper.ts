/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="../PostmsgWrapper.ts" />
/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
namespace Microsoft.CIFramework {
	export class AuthHelper {
		private static instance: AuthHelper;

		private constructor() {
			addEventListener(this.MessageEventName, this.fpiCallback);
			addEventListener("load", this.insertFipIframe);
		}

		static getInstance() {
			if (!AuthHelper.instance) {
				AuthHelper.instance = new AuthHelper();
			}
			return AuthHelper.instance;
		}

		MessageEventName = "message";
		FPIIframeTitle = "OmniChannelFPI_IFrame";
		FPIEventMethodName = "OCAppLoaded";
		FPIAppName = "OCApp";
		EventHandlers: { [requestId: string]: postMessageNamespace.IDeferred; } = {};
		isTokenAcquired: boolean = false;

		getFPISourceURL(): string {
			return "https://preetiintegrations.azurewebsites.net/OmniChannel/9.0/Runtime.html";
		}

		postMessage = new postMessageNamespace.postMsgWrapper();

		getOmniChannelEndpointPrefixUrl(): string {
			return "https://testorgpot1088sg811tip01-smsint.omnichannel.crmlivetie.com";
		}

		addPromise(requestId: number, promise: postMessageNamespace.IDeferred) {
			this.EventHandlers[requestId] = promise;
		}

		getPromise(requestId: number): postMessageNamespace.IDeferred {
			return this.EventHandlers[requestId];
		}

		sendPostMessage(requestId: number, requestUrl: string, httpMethod?: string, content?: {}, headers?: {}): Promise<any> {
			var args = {
				url: requestUrl,
				requestType: httpMethod,
				staticData: { "requestId": requestId },
				header: headers,
				payload: content
			}

			var deferredPromise = this.postMessage.createDeferred();
			this.addPromise(requestId, deferredPromise)

			var fpiFrame = document.getElementById("StreamControlFpiIframe");
			(fpiFrame as HTMLIFrameElement).contentWindow.postMessage(args, "*");

			return deferredPromise.promise;
		}

		fpiCallback(event: MessageEvent) {
			if (event.data.responseData.tokenAcquired == true) {
				AuthHelper.instance.isTokenAcquired = true;
			}
			else if (event.data.isFailure == false) {
				var promise = AuthHelper.instance.getPromise(event.data.staticData.requestId);
				promise.resolve(event.data.responseData);
			}
			else {
				var promise = AuthHelper.instance.getPromise(event.data.staticData.requestId);
				promise.reject(event.data.responseData);
			}
		}

		insertFipIframe() {
			var fipIframe = document.createElement("iframe");
			fipIframe.id = "StreamControlFpiIframe";
			fipIframe.title = AuthHelper.instance.FPIIframeTitle;
			fipIframe.src = AuthHelper.instance.getFPISourceURL();
			fipIframe.style.display = "none";
			document.body.appendChild(fipIframe);
		}
	}
}