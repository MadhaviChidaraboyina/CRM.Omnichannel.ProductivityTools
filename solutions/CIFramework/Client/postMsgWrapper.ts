/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/**
 * Wrapper for postMessage. This wrapper will be loaded on both widget and CI domains,
 * and will be the common messaging layer between these two. Without this layer,
 * postMessage acts as a common messaging API between the widget and CI.
 * This wrapper just wraps postMessage with more useful functionality of promises.

   Exposes a function postMsg that accepts a target window, a message and an origin 
 */

/**
 * Creates a new type for mapping an open promise representing a postMessage call, against a correlation Id sent to the message receiver.
 */

/// <reference path="CIFrameworkConstants.ts" />
/// <reference path="../../../references/external/TypeDefinitions/lib.es6.d.ts" />


namespace Microsoft.CIFramework.postMessageNamespace {

	export type IDeferred = {
		timerId: number;
		promise: Promise<Map<string, any>>;
		resolve: <T>(value?: T | Promise<T>) => void;
		reject: <T>(error?: T) => void;
	}

	export type Handler = (dictionary: Map<string, any> | string) => Promise<Map<string, any>>;

	/**
	 * Creates a new request message type, for message exchange between CI and any widget
	 */

	export interface IExternalRequestMessageType {

		messageType: string
		messageData: Map<string, any> | string
	}

	interface IRequestMessageType extends IExternalRequestMessageType {
		messageCorrelationId: string
		isEventFlag: boolean
	}
	/**
	 * Creates a new response message type, for message exchange between CI and any widget
	 */

	export interface IExternalResponseMessageType {
		messageOutcome: string
		messageData: Map<string, any>
	}

	interface IResponseMessageType extends IExternalResponseMessageType {
		messageCorrelationId: string
	}

	export class postMsgWrapper {

		/**
		 * Creates and loads an instance of the wrapper on the CI or widget domain, wherever it is loaded
		 */
		constructor(listenerWindow?: Window, domains?: string[], handlers?: Map<string, Set<Handler>>) {
			// todo - ensure that there is always one listener for message event from CI side. For now: always removing previous one, if any, so that we only have one listener at a time. 
			if (listenerWindow) {
				listenerWindow.removeEventListener(messageConstant, this.processMessage.bind(this));
				listenerWindow.addEventListener(messageConstant, this.processMessage.bind(this));
			}
			//TO-DO, initialization of whitelisted domains may need to take a different path in future
			this.listWhitelistedDomains = domains;
			if (handlers) {
				this.messageHandlers = handlers;
			}
		}

		/**
		 * Collection for promises created on the caller (widget/CI), that represent open requests on the receiver (CI/widget)
		 */
		pendingPromises = new Map<string, IDeferred>();

		listWhitelistedDomains: string[];

		messageHandlers = new Map<string, Set<Handler>>();

		/**
		 * Function for add handlers separate from the constructor
		 */
		addHandler(messageType: string, handler: Handler) {
			if (this.messageHandlers.has(messageType)) {
				this.messageHandlers.get(messageType).add(handler);
			}
			else {
				this.messageHandlers.set(messageType, new Set().add(handler));
			}
		}

		/**
		 * Function for getting handlers registered for an event
		 */
		getHandlers(messageType: string): Set<Handler> {
			if (this.messageHandlers.has(messageType)) {
				return this.messageHandlers.get(messageType);
			}
			return null;
		}
		/**
		 * Function for remove a particular handler
		 */
		removeHandler(messageType: string, handler: Handler) {
			if (!this.messageHandlers.has(messageType)) {
				return;
			}

			this.messageHandlers.get(messageType).delete(handler);
		}


		/**
		 * Create a new correlation Id to map a promise against it, on the caller side (widget/CI)
		 */
		getCorrelationId() {
			return (Math.random() + 1).toString(36).substring(7);
		}

		private createDeferred(noTimeout?: boolean): IDeferred {
			const deferred: IDeferred = {
				promise: null,
				resolve: null,
				reject: null,
				timerId: null,
			};

			let actualpromise = new Promise<Map<string, any>>((resolve, reject) => {
				deferred.resolve = resolve;
				deferred.reject = reject;
			});
			let promises = [actualpromise];
			if (!noTimeout) {
				let timeout = new Promise<Map<string, any>>((resolve, reject) => {
					deferred.timerId = setTimeout(() => {
						reject(Microsoft.CIFramework.Utility.createErrorMap("Timeout occurred as no response was received from listener window"));
					}, promiseTimeOut);
				});
				promises.push(timeout);
			}
			deferred.promise = Promise.race(
				promises
			).then((result) => {
				if (deferred.timerId) {
					clearTimeout(deferred.timerId);
				}
				this.removePromise(deferred);
				return result;
			}).catch((result) => {
				if (deferred.timerId) {
					clearTimeout(deferred.timerId);
				}
				this.removePromise(deferred);
				throw result;
			});
			// TODO - if timed out, handle the deletion of orphaned actualPromise and scenario when actualpromise is resolved/rejected later on.
			return deferred;
		}

		/**
		 * removes the entry from pendingPromises, given the value for that entry.
		 * @param deferred deferred object based on which entry should be deleted.
		 */
		private removePromise(deferred: IDeferred) {
			let keyToDelete = null;
			for (let [key, value] of this.pendingPromises) {
				if (value == deferred) {
					keyToDelete = key;
					break;
				}
			}
			if (keyToDelete) {
				this.pendingPromises.delete(keyToDelete);
			}
		}

		/**
		 * Function on caller (widget/CI) to add a new correlation Id to a message, map a new promise against it and post the message to the receiver (CI/widget)
		 */
		//TO-DO in V2, check if the user should have resolve and reject exposed to send in their custom implementation
		postMsg(receivingWindow: Window, message: IExternalRequestMessageType, targetOrigin: string, isEventFlag: boolean, noTimeout?: boolean): Promise<Map<string, any>> {
			if ((receivingWindow) && (targetOrigin != "*")) {
				if (!isEventFlag) {
					let trackingCorrelationId = this.getCorrelationId();
					let messageInternal = message as IRequestMessageType;
					messageInternal[messageCorrelationId] = trackingCorrelationId;
					let deferred = this.createDeferred(noTimeout);
					this.pendingPromises.set(trackingCorrelationId, deferred);
					return this.postMsgInternal(receivingWindow, messageInternal, targetOrigin, deferred);
				}
				else {
					return this.postMsgInternal(receivingWindow, message, targetOrigin);
				}
			}
			else {
				return rejectWithErrorMessage("Receiving window or targetOrigin cannot be unspecified");
			}
		}

		/**
		 * Internal function that post messages to the window with retry logic
		 * @param receivingWindow window to post message to
		 * @param message message to post
		 * @param targetOrigin target url
		 * @param deferred deferred object related with this message
		 */
		private postMsgInternal(receivingWindow: Window, message: IExternalRequestMessageType, targetOrigin: string, deferred?: IDeferred) {
			let retries = 0;
			while (true) {
				try {
					receivingWindow.postMessage(message, targetOrigin);
					if (deferred) {
						return deferred.promise;
					}
					return;
				}
				catch (error) {
					// todo - log the error and retries number.
					if (++retries == retryCount) {
						return rejectWithErrorMessage("Not able to post the request to receiving window after multiple tries.");
					}
				}
			}
		}


		/**
		 * Function on receiver (widget/CI) to send back a response against an open request to the caller (CI/widget)
		 */
		private sendResponseMsg<T extends IResponseMessageType>(receivingWindow: Window, message: T, targetOrigin: string) {
			if ((receivingWindow) && (targetOrigin != "*")) {
				receivingWindow.postMessage(message, targetOrigin);
			}
		}

		/**
		 * Common function on caller and receiver to process requests and responses
		 */
		private processMessage(event: MessageEvent) {

			let whiteListedOrigin = this.listWhitelistedDomains.find((whiteListedDomain) => {
				//TODO - Replace URL with some other supported object if IE support becomes mandatory. URL is not supported by IE11
				var domainUrl = new URL(event.origin);
				var domainHostName = decodeURIComponent(domainUrl.hostname);
				var whiteListedDomainUrl;
				var whiteListedDomainHostName = "";
				if (whiteListedDomain != null) {
					whiteListedDomainUrl = new URL(whiteListedDomain);
					whiteListedDomainHostName = decodeURIComponent(whiteListedDomainUrl.hostname);
				}
				if (whiteListedDomainHostName != "" && whiteListedDomainHostName == domainHostName)
					return true;
				else if (whiteListedDomain != null && whiteListedDomainHostName.startsWith("*"))
					return (domainHostName.endsWith(whiteListedDomainHostName.substr(2)));
				return false;
			});

			let trackingCorrelationId = event.data[messageCorrelationId];
			let msg: IResponseMessageType;

			let messageData = null;
			if (!event.origin || event.origin === "*" || !event.source) {
				messageData = Microsoft.CIFramework.Utility.createErrorMap("Origin/Source of the message cant be null or all");
			}
			if (!whiteListedOrigin) {
				messageData = Microsoft.CIFramework.Utility.createErrorMap("Sender domain is not a recognised or is invalid and hence the message cant be processed");
			}

			if (!trackingCorrelationId) {
				if (messageData) {
					// log message recieved has no correlation id, with origin & msg details
					console.trace("Ignoring message from unknown event source: " + event.origin);
					return;
				}
			}
			else {
				// correlation id exists, but the domain was not whitelisted. Return an error response
				if (messageData) {
					msg = {
						messageOutcome: messageFailure,
						messageData: messageData,
						messageCorrelationId: trackingCorrelationId
					};
					return this.sendResponseMsg(event.source, msg, event.origin);
				}
			}

			let pendingPromise: IDeferred;
			if (trackingCorrelationId && this.pendingPromises) {
				pendingPromise = this.pendingPromises.get(trackingCorrelationId);
			}
			/**
			 * If an open promise against this message's correlation Id does not exist, 
			 * then invoke registered message handlers and send their result back
			 */
			if (!pendingPromise) {
				let data = <IExternalRequestMessageType>event.data;
				if(typeof(data.messageData) != "string")
					data.messageData.set(originURL, whiteListedOrigin);

				/**
				 * Iterate through the handler list and invoke them all nd handle if there are no handlers
				 */
				if (!this.messageHandlers.get(data.messageType)) {
					if (trackingCorrelationId) {
						msg = {
							messageOutcome: messageSuccess,
							messageData: Microsoft.CIFramework.Utility.createErrorMap("No handlers found to process the request."),
							messageCorrelationId: trackingCorrelationId
						};
						this.sendResponseMsg(event.source, msg, event.origin);
					}
					// todo - log that no handler was found alongwith message & origin details, and if we are sending back a response or silently ignoring.
					return;
				}

				this.messageHandlers.get(data.messageType).forEach((handlerFunction: Handler) => {
					(<Handler>handlerFunction)(data.messageData).then(
						(result: Map<string, any>) => {
							if (trackingCorrelationId) {
								msg = {
									messageOutcome: messageSuccess,
									messageData: result,
									messageCorrelationId: trackingCorrelationId
								};
								this.sendResponseMsg(event.source, msg, event.origin);
							}
						},
						(error: Map<string, any>) => {
							if (trackingCorrelationId) {
								msg = {
									messageOutcome: messageFailure,
									messageData: error,
									messageCorrelationId: trackingCorrelationId
								};
								this.sendResponseMsg(event.source, msg, event.origin);
							}
						}
					);
				})

			}
			/**
			 * If an open promise against this message's correlation Id does exist, 
			 * then process response as success/failure of an earlier request
			 * and delete the open promise from pendingPromises collection
			 */
			else {
				let data = <IExternalResponseMessageType>event.data;
				if (data.messageOutcome === messageSuccess) {
					pendingPromise.resolve(data.messageData);
				}
				else {
					pendingPromise.reject(data.messageData);
				}
			}
		}
	}
}

