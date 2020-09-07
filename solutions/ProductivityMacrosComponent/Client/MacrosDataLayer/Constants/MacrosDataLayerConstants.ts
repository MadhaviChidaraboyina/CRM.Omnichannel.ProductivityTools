/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/

namespace Microsoft.ProductivityMacros.MacrosDataLayer
{
	export class FPIConstants
	{
		public static IFRAMEID = "OCFPIIframe";
		public static EMPTYGUID = "00000000-0000-0000-0000-000000000000";
		public static FPIMESSAGE_EVENTNAME = "message";
		public static IFRAMETITLE = "OmniChannelFPI_IFrame";
		public static IFRAME_APPNAME = "OCApp";
		public static OCBASEURLFIELD = "ocBaseUrl";
		public static OCFPIURLFIELD = "ocFPIUrl";
		public static AUTH_FAILED_STATUS_MESSAGE = "Authentication failure";
		public static AUTH_FAILED_STATUS_CODE = 401;
		public static FPI_COMPONENT_URL_PARAMETER = "&componentId=" + FPIConstants.IFRAMEID;
	}

	export class RequestTypes
	{
		public static GET = "GET";
		public static PUT = "PUT";
		public static POST = "POST";
		public static DELETE = "DELETE";
		public static STATUS = "STATUS";
	}

	export class EndpointConstants 
	{
		public static endpointEntityName = "serviceendpoint";
		public static ocEndpointRecordId = "8af92c33-e748-4b5a-b772-46cba89bb7ac";
		public static pathPropertyKey = "path";
		public static namePropertyKey = "name";
		public static descriptionPropertyKey = "description";
		public static telemetryContext = "OmniChannelEndpoint";
		public static emptyString = "";
		public static publicString = "public";
		public static fairfaxString = "fairfax";
		public static PRODEnvKey = "PROD";
		public static namespaceDeploymentKey = "solutionnamespace"
		public static PublicDeploymentTypeKey = "default";

		// Service endpoint Map Keys
		public static ocBaseUrlKey = "ocBaseUrl";
		public static ocFPIUrlKey = "ocFPIUrl";
		public static ocDeploymentTypeKey = "ocDeploymentType";
		public static ocEndpointNameKey = "ocEndpointName";

		public static readonly publicFPIUrlMap = new Map()
			.set("DEV", "https://fpi-dev.oc.crmlivetie.com/fpi/OmniChannel/9.0/Runtime.html?")
			.set("INT", "https://fpi.oc.crmlivetie.com/fpi/OmniChannel/9.0/Runtime.html?")
			.set("TEST", "https://fpi.oc.crmlivetie.com/fpi/OmniChannel/9.0/Runtime.html?")
			.set("PPE", "https://fpi.omnichannelengagementhub.com/fpi/OmniChannel/9.0/Runtime.html?")
			.set("PROD", "https://fpi.omnichannelengagementhub.com/fpi/OmniChannel/9.0/Runtime.html?");

		public static readonly fairfaxFPIUrlMap = new Map()
			.set("DEV", "https://omnichanneltestauthservice.azurewebsites.us/OmniChannel/9.0/Runtime.html?")
			.set("INT", "https://omnichanneltestauthservice.azurewebsites.us/OmniChannel/9.0/Runtime.html?")
			.set("TEST", "https://omnichanneltestauthservice.azurewebsites.us/OmniChannel/9.0/Runtime.html?")
			.set("PPE", "https://oc-auth.azurewebsites.us/OmniChannel/9.0/Runtime.html?")
			.set("PROD", "https://oc-auth.azurewebsites.us/OmniChannel/9.0/Runtime.html?");

		//public static readonly mooncakeFPIUrlMap = new Map()  //Not deployed yet, to be updated after deployment. If common deployment for all GCC, will be a copy of fairfaxFPIUrlMap

		public static getFPIURLMap(cloudType: string)
		{
			if(cloudType === null || cloudType === undefined)
			{
				return this.publicFPIUrlMap;
			}
			switch (cloudType.toLowerCase())
			{
				case EndpointConstants.fairfaxString:
					return this.fairfaxFPIUrlMap;
				case EndpointConstants.publicString:
				default:
					return this.publicFPIUrlMap;
			}
		}
	}
}