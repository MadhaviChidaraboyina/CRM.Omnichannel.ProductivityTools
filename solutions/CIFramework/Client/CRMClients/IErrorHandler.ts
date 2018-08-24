/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

namespace Microsoft.CIFramework.Internal {

	export enum errorTypes {
		InvalidParams,

		TimeOut,

		XrmApiError,

		GenericError,
	}

	// Error Handler Interface which defines all the properties an error must have
	export type IErrorHandler =
		{
			// Error Message
			errorMsg: string;

			// Error Originating Function
			sourceFunc: string;

			// Error Reported Time in GMT
			reportTime: string;

			// Error Type
			errorType: errorTypes;
		}
}