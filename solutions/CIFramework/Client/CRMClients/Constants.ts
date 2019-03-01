/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/** @internal */
namespace Microsoft.CIFramework.Internal
{
	/**
	 * utility func to create a promise and reject it with the passed error message
	*/
	export function rejectWithErrorMessage(errorMessage: string, apiName: string, appId?: string, isError?: boolean, error?: IErrorHandler, providerID?: string, providerName?: string) {
		logFailure(appId, isError, error, providerID, providerName);
		reportError(apiName + " failed with error: " + errorMessage);
		return Promise.reject(Microsoft.CIFramework.Utility.createErrorMap(errorMessage, apiName));
	}
	/**
	 * Enum defining the different client types available for CI
	*/
	export class ClientType
	{
		public static UnifiedClient = "4";
	}
	/**
	 * Enum defining the different session types available for CI
	*/
	export class SessionType
	{
		public static SingleSession = "0";
		public static MultiSession = "1";
	}
}