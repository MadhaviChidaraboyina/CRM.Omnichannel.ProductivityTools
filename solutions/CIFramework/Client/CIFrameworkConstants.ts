/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/**
 * Constants for CIFramework.
 */
namespace Microsoft.CIFramework.postMessageNamespace {

	/**
	 * retry count for post message function
	 */
	export const retryCount = 3;

	/**
	 * wait time for receiving a response from the listener window, before we reject the promise
	 */
	export const promiseTimeOut = 5000; // in milliseconds
	
	/**
	 * String for correlationId to be used as a key.
	 */
	export const messageCorrelationId = 'messageCorrelationId';

	/**
	 * String to represent a successful result.
	 */
	export const messageSuccess = 'success';

	export const messageFailure = 'failure';

	/**
	 * String to represent a web-socket message.
	 */
	export const messageConstant = 'message';

	export const originURL = 'originURL';

	export const message = 'message';

	/**
	 * utility func to create a promise and reject it with the passed error message
	*/
	export function rejectWithErrorMessage(errorMessage: string) {
		return Promise.reject(createErrorMap(errorMessage));
	}

	/**
	 * utility func to create a error map with the error message and optional error code
	*/
	export function createErrorMap(errorMessage : string)
	{
		return new Map().set(message, errorMessage);
	}

}

//export { };