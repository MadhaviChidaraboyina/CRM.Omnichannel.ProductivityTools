/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
namespace Microsoft.CIFramework.Internal
{
	/**
	 * utility func to create a promise and reject it with the passed error message
	*/
	export function rejectWithErrorMessage(errorMessage: string, apiName: string, appId?: string, isError?: boolean, error?: IErrorHandler) {
		logFailure(appId, isError, error);
		reportError(apiName + " failed with error: " + errorMessage);
		return Promise.reject(Microsoft.CIFramework.Utility.createErrorMap(errorMessage, apiName));
	}
	/**
	 * Enum defining the different client types available for CI
	*/
	export const enum ClientType
	{
		WebClient,
		UCClient
	}
}