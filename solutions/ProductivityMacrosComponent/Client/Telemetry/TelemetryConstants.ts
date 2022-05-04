/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/** @internal */
namespace Microsoft.ProductivityMacros.Internal {

	/**
	 * All Constants related to Telemetry should go here 
	*/
	export namespace TelemetryConstants {
		export const macroVersion = "MacrosSolVersion";
		export const macroActionName = "ActionName";
		export const macroActionResult = "ActionResult";
		export const appId = "AppId";
		export const clientType = "ClientType";
		export const crmVersion = "CrmVersion";
		export const orgId = "OrganizationId";
		export const orgName = "OrganizationName";
		export const startTime = "StartTime";
		export const timeTaken = "TimeTaken";
		export const telemetryData = "APIPerfMarkers";
		export const isError = "IsError";
		export const errorMessage = "ErrorMessage";
		export const errorType = "ErrorType";
		export const errorReportTime = "ErrorReportTime";
		export const errorFunction = "ErrorFunction";
		export const macrosRuntimeTable = "D365_Macros_Runtime";
		export const macrosAdminTable = "D365_Macros_Admin";
		export const userId = "UserID";
		export const navigationType = "NavType";
		export const multiSession = "Multi Session";
		export const singleSession = "Single Session";
		export const correlationId = "CorrelationId";
		export const adminDesignerInstanceId = "designerInstanceId";
		export const adminEventName = "eventName";
		export const adminEventCorrelationId = "eventCorrelationId";
		export const adminMessage = "message";
		export const adminEventData = "eventData";
		export const adminEventTimeStamp = "eventTimeStamp";
		export const adminEventType = "eventType";
		export const adminLevel = "level";
		export const adminException = "exception";
		export const adminEventId = "eventId";
	}

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