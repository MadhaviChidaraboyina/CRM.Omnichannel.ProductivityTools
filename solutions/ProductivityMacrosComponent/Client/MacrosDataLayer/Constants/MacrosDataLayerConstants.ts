/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/

namespace Microsoft.ProductivityMacros.MacrosDataLayer
{
	export class FPIConstants
	{
		public static IFRAMEID = "CCAFPIIframe";
		public static EMPTYGUID = "00000000-0000-0000-0000-000000000000";
		public static FPIMESSAGE_EVENTNAME = "message";
		public static IFRAMETITLE = "CCAFPI_IFrame";
		public static IFRAME_APPNAME = "CCAApp";
		public static AUTH_FAILED_STATUS_MESSAGE = "Authentication failure";
		public static AUTH_FAILED_STATUS_CODE = 401;
		public static QUERY_FPI_STATUS = "QueryFpiStatus";
		public static EXTERNAL_REST_ODATA_API = "ExternalRESTOdataApi";
	}

	export class RequestTypes
	{
		public static GET = "GET";
		public static PUT = "PUT";
		public static POST = "POST";
		public static DELETE = "DELETE";
		public static STATUS = "STATUS";
	}

	export class GeoNames{
		public static TIP = "TIP";
		public static GCC = "GCC";
		public static USG = "USG";
		public static CHN = "CHN";
		public static DEFAULT = "";
	}

	export const FpiGeoSettings = {
		[GeoNames.TIP]: { endpoint: "https://www.d365ccafpi-dev.com/macro/index.html" },
		[GeoNames.GCC]: { endpoint: "https://www.d365ccafpi-gcc.com/macro/index.html" },
		[GeoNames.USG]: { endpoint: "https://www.d365ccafpi-gcc.com/macro/index.html" },
		[GeoNames.CHN]: { endpoint: "https://www.d365ccafpi.chn/macro/index.html" },
		[GeoNames.DEFAULT]: { endpoint: "https://www.d365ccafpi.com/macro/index.html" },
	}

	/**
	 * https://dynamicscrm.visualstudio.com/First%20Party%20Integrations/_git/First%20Party%20Integrations?path=%2Fsrc%2FIntegrations%2FIntegrations%2FMicrosoftFlows%2F9.0%2FFlowApp.js&_a=contents&version=GBv2
	 */
	export const FlowGeoSettings = {
		[GeoNames.TIP]: { endpoint: "https://tip1.api.flow.microsoft.com", resource: "https://service.flow.microsoft.com/" },
		[GeoNames.GCC]: { endpoint: "https://gov.api.flow.microsoft.us", resource: "https://gov.service.flow.microsoft.us/" },
		[GeoNames.USG]: { endpoint: "https://high.api.flow.microsoft.us", resource: "https://high.service.flow.microsoft.us/" },
		[GeoNames.CHN]: { endpoint: "https://api.powerautomate.cn", resource: "https://service.powerautomate.cn/" },
		[GeoNames.DEFAULT]: { endpoint: "https://api.flow.microsoft.com", resource: "https://service.flow.microsoft.com/" },
	}

}