/// <reference path="TelemetryConstants.ts" />
/// <reference path="CRMClients/State.ts" />
/// <reference path="CRMClients/aria-webjs-sdk-1.8.3.d.ts" />
/// <reference path="CRMClients/IErrorHandler.ts" />
/** @internal */
namespace Microsoft.CIFramework.Internal
{
	declare var Xrm: any;
	declare var defaultLogger: any;
	let prodIngestionKey = "0cd345da5c484bff8b75c696a3ac2159-3a768593-5759-4630-a59e-a75af2a7bf20-6631";
	let devIngestionKey = "d129926264ad4dcc891eaf004fb351de-9bb27fd5-7e89-42a5-960c-c397c94ce2af-7153";

	let GERMANY_ENDPOINT = "https://de.pipe.aria.microsoft.com/Collector/3.0/";
	let GCCH_ENDPOINT = "https://tb.pipe.aria.microsoft.com/Collector/3.0/";
	let DOD_ENDPOINT = "https://pf.pipe.aria.microsoft.com/Collector/3.0";
	let EUROPE_ENDPOINT = "https://eu.pipe.aria.microsoft.com/Collector/3.0/";
	let MOONCAKE_ENDPOINT = ""; // Add MoonCake ARIA Endpoint whenever available

	export function initializeTelemetry() {
		let domain = getDomain();
		let logConfig = getConfiguration(domain);
		if (domain == "Dev") {
			defaultLogger = AWTLogManager.initialize(devIngestionKey, logConfig);
		}
		else {
			defaultLogger = AWTLogManager.initialize(prodIngestionKey, logConfig);
		}

		AWTLogManager.addNotificationListener({
			eventsSent: (events) => {
				console.log("CIF Telemetry - Number of Events Sent: " + events.length);
			},
			eventsDropped: (events, reason) => {
				console.log("CIF Telemetry - Number of Events Dropped: " + events.length);
			}
		});
	}

	// Returns the Host Name
	function getHost(): string {
		let hostValue = window.location.host;
		if (!hostValue) {
			hostValue = window.parent.location.host;
		}
		return hostValue;
	}

	// Returns the Domain of the Org
	function getDomain(): string {
		let hostValue = getHost();

		// Need to add checks for MoonCake(China) and Europe Orgs, if needed
		if (hostValue.endsWith("dod-crm.microsoftdynamics.us"))
			return "DoD";
		else if (hostValue.endsWith("crm9.dynamics.com") || hostValue.endsWith("crm.microsoftdynamics.us"))
			return "GCCHigh";
		else if (hostValue.endsWith("crm.microsoftdynamics.de"))
			return "BlackForest";
		else if (hostValue.endsWith("crm.dynamics.cn"))
			return "MoonCake";
		else if (hostValue.endsWith("crm4.dynamics.com"))
			return "Europe";
		else if (hostValue.endsWith("extest.microsoft.com") || hostValue.endsWith("crm10.dynamics.com") || hostValue.endsWith("crm.crmlivetie.com")
			|| hostValue.endsWith("crm2.crmlivetie.com") || hostValue.endsWith("contoso.com:444") || hostValue.endsWith("microsoft.com")
			|| hostValue.endsWith("msmecrm.com") || hostValue.endsWith("crm.crmlivetoday.com") || hostValue.endsWith("crm.1boxtest.com")
			|| hostValue.endsWith("crm.crmifd.com") || hostValue.endsWith("msmecrm.com:444") || hostValue.search("localhost") == 0)
			return "Dev";
		else
			return "Public";
	}

	// Returns the ARIA configuration for the environment type
	function getConfiguration(domain: string): AWTLogConfiguration {
		let logConfiguration: AWTLogConfiguration = {};

		// Disables the logging of Device ID
		logConfiguration.disableCookiesUsage = true;
		switch (domain) {
			case "GCCHigh":
				logConfiguration.collectorUri = GCCH_ENDPOINT;
				break;
			case "DoD":
				logConfiguration.collectorUri = DOD_ENDPOINT;
				break;
			case "BlackForest":
				logConfiguration.collectorUri = GERMANY_ENDPOINT;
				break;
			case "Europe":
				logConfiguration.collectorUri = EUROPE_ENDPOINT;
				break;
			//case "MoonCake":
			//	logConfiguration.collectorUri = MOONCAKE_ENDPOINT;
			//	break;
		}
		return logConfiguration;
	}

	function getNavigationType(): string {
		if (Microsoft.CIFramework.Internal.isConsoleAppInternal())
			return TelemetryConstants.multiSession;
		else
			return TelemetryConstants.singleSession;
	}

	// Generates the IErrorHandler for logging purpose
	export function generateErrorObject(error: any, sourceFunction: string, errorType: errorTypes): IErrorHandler {
		let errorData = {} as IErrorHandler;
		try {
			errorData.errorMsg = error.get("message");
		}
		catch (e) {
			errorData.errorMsg = error.message;
		}
		errorData.sourceFunc = sourceFunction;
		errorData.errorType = errorType;
		errorData.reportTime = new Date().toUTCString();
		return errorData;
	}

	// Logs Failure Events to the d365_cif_usage table
	export function logFailure(appId: string, isError: boolean, error: IErrorHandler, apiName: string, cifVersion: string, providerID?: string, providerName?: string, customParameters?: string, correlationId?: string): Promise<Map<string, any>> {
		var usageData = new UsageTelemetryData(providerID ? providerID : "", providerName ? providerName : "", null, apiName, null, appId ? appId : "", cifVersion, isError ? isError : false, error ? error : null, customParameters ? customParameters : "", correlationId);
		setUsageData(usageData);
		return Promise.reject(Microsoft.CIFramework.Utility.createErrorMap(error.errorMsg, apiName));
	}

	// Logs Failure Events to the d365_cif_apiusage table
	export function logAPIFailure(appId: string, isError: boolean, error: IErrorHandler, apiName: string, cifVersion: string, providerID?: string, providerName?: string, customParameters?: string, correlationId?: string): Promise<Map<string, any>> {
		var usageData = new APIUsageTelemetry(providerID ? providerID : "", providerName ? providerName : "", null, apiName, null, appId ? appId : "", cifVersion, isError ? isError : false, error ? error : null, customParameters ? customParameters : "", correlationId);
		setAPIUsageTelemetry(usageData);
		return Promise.reject(Microsoft.CIFramework.Utility.createErrorMap(error.errorMsg, apiName));
	}

	//Logs Failure API internal error/informational Events to the d365_cif_apiusage table without rejecting the promise
	export function logAPIInternalInfo(appId: string, isError: boolean, error: IErrorHandler, apiName: string, cifVersion: string, providerID?: string, providerName?: string, customParameters?: string, correlationId?: string): void {
		var usageData = new APIUsageTelemetry(providerID ? providerID : "", providerName ? providerName : "", null, apiName, null, appId ? appId : "", cifVersion, isError ? isError : false, error ? error : null, customParameters ? customParameters : "", correlationId);
		setAPIUsageTelemetry(usageData);
	}

	// Function to populate the Usage Data Telemetry
	export function setUsageData(data: UsageTelemetryData): void {
		var UsageTelemetry = new AWTEventProperties();
		UsageTelemetry.setName(TelemetryConstants.usageTable);

		UsageTelemetry.setProperty(TelemetryConstants.apiVersion, data.apiVersion ? data.apiVersion : "");
		UsageTelemetry.setProperty(TelemetryConstants.appId, data.appId ? data.appId : "");
		UsageTelemetry.setProperty(TelemetryConstants.channelOrder, data.sortOrder ? data.sortOrder : "");
		UsageTelemetry.setProperty(TelemetryConstants.clientType, Xrm.Utility.getGlobalContext().client.getClient());
		UsageTelemetry.setProperty(TelemetryConstants.crmVersion, Xrm.Utility.getGlobalContext().getVersion());
		UsageTelemetry.setProperty(TelemetryConstants.orgId, Xrm.Utility.getGlobalContext().organizationSettings.organizationId);
		UsageTelemetry.setProperty(TelemetryConstants.orgName, Xrm.Utility.getGlobalContext().organizationSettings.uniqueName);
		UsageTelemetry.setProperty(TelemetryConstants.providerId, data.providerId ? data.providerId : "");
		UsageTelemetry.setProperty(TelemetryConstants.providerName, data.providerName ? data.providerName : "");
		UsageTelemetry.setProperty(TelemetryConstants.isError, data.isError ? data.isError : false);
		UsageTelemetry.setProperty(TelemetryConstants.errorMessage, data.errorObject ? data.errorObject.errorMsg : "");
		UsageTelemetry.setProperty(TelemetryConstants.errorType, data.errorObject ? errorTypes[data.errorObject.errorType] : "");
		UsageTelemetry.setProperty(TelemetryConstants.errorReportTime, data.errorObject ? data.errorObject.reportTime : "");
		UsageTelemetry.setProperty(TelemetryConstants.errorFunction, data.errorObject ? data.errorObject.sourceFunc : "");
		UsageTelemetry.setProperty(TelemetryConstants.userId, Xrm.Utility.getGlobalContext().userSettings.userId);
		UsageTelemetry.setProperty(TelemetryConstants.apiName, data.apiName ? data.apiName : "");
		UsageTelemetry.setProperty(TelemetryConstants.CIFVersion, data.cifVersion);
		UsageTelemetry.setProperty(TelemetryConstants.customParameters, data.customParameters ? JSON.stringify(data.customParameters) : "");
		UsageTelemetry.setProperty(TelemetryConstants.navigationType, getNavigationType());
		UsageTelemetry.setProperty(TelemetryConstants.correlationId, data.correlationId ? data.correlationId : "");

		defaultLogger.logEvent(UsageTelemetry);
	}

	export function logApiData(telemetryData: Object | any, startTime: any, timetaken: any, apiName: string) {
		let ApiData: any = new Object();
		ApiData["StartTime"] = startTime.toUTCString();
		ApiData["TimeTaken"] = timetaken;
		if (telemetryData) {
			telemetryData[apiName] = ApiData;
		}
	}

	export function logParameterData(telemetryParameter:Object | any, apiName: any, parameters: Object){
		let parameterData: any = new Object();
		parameterData["apiName"] = apiName;
		parameterData["parameters"] = parameters;
		if (telemetryParameter) {
			telemetryParameter[apiName] = parameterData;
		}
	}

	// Function to populate the Performance Data Telemetry
	export function setPerfData(data: PerfTelemetryData) {
		var PerfTelemetry = new AWTEventProperties();
		PerfTelemetry.setName(TelemetryConstants.perfTable);

		PerfTelemetry.setProperty(TelemetryConstants.providerId, data.providerData.providerId ? data.providerData.providerId : "");
		PerfTelemetry.setProperty(TelemetryConstants.providerName, data.providerData.name ? data.providerData.name : "");
		PerfTelemetry.setProperty(TelemetryConstants.crmVersion, data.providerData.crmVersion ? data.providerData.crmVersion : "");
		PerfTelemetry.setProperty(TelemetryConstants.appId, data.providerData.appId ? data.providerData.appId : "");
		PerfTelemetry.setProperty(TelemetryConstants.apiVersion, data.providerData.apiVersion ? data.providerData.apiVersion : "");
		PerfTelemetry.setProperty(TelemetryConstants.orgId, Xrm.Utility.getGlobalContext().organizationSettings.organizationId);
		PerfTelemetry.setProperty(TelemetryConstants.orgName, data.providerData.orgName ? data.providerData.orgName : "");
		PerfTelemetry.setProperty(TelemetryConstants.startTime, data.startTime ? data.startTime.toUTCString() : "");
		PerfTelemetry.setProperty(TelemetryConstants.timeTaken, data.timeTaken ? data.timeTaken : 0);
		PerfTelemetry.setProperty(TelemetryConstants.apiName, data.apiName ? data.apiName : "");
		PerfTelemetry.setProperty(TelemetryConstants.telemetryData, data.telemetryData ? JSON.stringify(data.telemetryData) : "");
		PerfTelemetry.setProperty(TelemetryConstants.CIFVersion, data.cifVersion);
		PerfTelemetry.setProperty(TelemetryConstants.navigationType, getNavigationType());
		PerfTelemetry.setProperty(TelemetryConstants.correlationId, data.correlationId ? data.correlationId : "");

		defaultLogger.logEvent(PerfTelemetry);
	}

	// Function to populate the Parameter Data Telemetry
	export function setAPIUsageTelemetry(data: APIUsageTelemetry): void {
		var ParamTelemetry = new AWTEventProperties();
		ParamTelemetry.setName(TelemetryConstants.apiUsageTable);

		ParamTelemetry.setProperty(TelemetryConstants.apiVersion, data.apiVersion ? data.apiVersion : "");
		ParamTelemetry.setProperty(TelemetryConstants.appId, data.appId ? data.appId : "");
		ParamTelemetry.setProperty(TelemetryConstants.channelOrder, data.sortOrder ? data.sortOrder : "");
		ParamTelemetry.setProperty(TelemetryConstants.clientType, Xrm.Utility.getGlobalContext().client.getClient());
		ParamTelemetry.setProperty(TelemetryConstants.crmVersion, Xrm.Utility.getGlobalContext().getVersion());
		ParamTelemetry.setProperty(TelemetryConstants.orgId, Xrm.Utility.getGlobalContext().organizationSettings.organizationId);
		ParamTelemetry.setProperty(TelemetryConstants.orgName, Xrm.Utility.getGlobalContext().organizationSettings.uniqueName);
		ParamTelemetry.setProperty(TelemetryConstants.providerId, data.providerId ? data.providerId : "");
		ParamTelemetry.setProperty(TelemetryConstants.providerName, data.providerName ? data.providerName : "");
		ParamTelemetry.setProperty(TelemetryConstants.isError, data.isError ? data.isError : false);
		ParamTelemetry.setProperty(TelemetryConstants.errorMessage, data.errorObject ? data.errorObject.errorMsg : "");
		ParamTelemetry.setProperty(TelemetryConstants.errorType, data.errorObject ? errorTypes[data.errorObject.errorType] : "");
		ParamTelemetry.setProperty(TelemetryConstants.errorReportTime, data.errorObject ? data.errorObject.reportTime : "");
		ParamTelemetry.setProperty(TelemetryConstants.errorFunction, data.errorObject ? data.errorObject.sourceFunc : "");
		ParamTelemetry.setProperty(TelemetryConstants.userId, Xrm.Utility.getGlobalContext().userSettings.userId);
		ParamTelemetry.setProperty(TelemetryConstants.apiName, data.apiName ? data.apiName : "");
		ParamTelemetry.setProperty(TelemetryConstants.CIFVersion, data.cifVersion);
		ParamTelemetry.setProperty(TelemetryConstants.customParameters, data.customParameters ? JSON.stringify(data.customParameters): "");
		ParamTelemetry.setProperty(TelemetryConstants.navigationType, getNavigationType());
		ParamTelemetry.setProperty(TelemetryConstants.correlationId, data.correlationId ? data.correlationId : "");

		defaultLogger.logEvent(ParamTelemetry);
	}

	export class UsageTelemetryData {
		providerId: string;
		providerName: string;
		apiVersion: string;
		apiName: string;
		sortOrder: any;
		appId: string;
		isError: boolean;
		errorObject: IErrorHandler;
		cifVersion: string;
		customParameters: string;
		correlationId: string;
		constructor(providerId?: string, providerName?: string, apiVersion?: string, apiName?: string, sortOrder?: any, appId?: string, cifVersion?: string, isError?: boolean, errorObject?: IErrorHandler, customParameters?:string, correlationId?: string) {
			this.providerId = providerId ? providerId : "";
			this.providerName = providerName ? providerName : "";
			this.apiVersion = apiVersion ? apiVersion : "";
			this.apiName = apiName ? apiName : "";
			this.sortOrder = sortOrder ? sortOrder : "";
			this.appId = appId ? appId : "";
			this.isError = isError ? isError : false;
			this.errorObject = errorObject ? errorObject : null;
			this.cifVersion = cifVersion ? cifVersion : "";
			this.customParameters = customParameters ? customParameters : "";
			this.correlationId = correlationId ? correlationId : "";
		}
	}

	export class PerfTelemetryData {
		providerData: CIProvider;
		startTime: any;
		timeTaken: any;
		apiName: string;
		telemetryData: Object;
		cifVersion: string;
		correlationId: string;
		constructor(providerData?: CIProvider, startTime?: any, timeTaken?: any, apiName?: string, cifVersion?: string, telemetryData?: Object, correlationId?: string) {
			this.providerData = providerData ? providerData : null;
			this.startTime = startTime ? startTime : "";
			this.timeTaken = timeTaken ? timeTaken : 0;
			this.apiName = apiName ? apiName : "";
			this.telemetryData = telemetryData ? telemetryData : null;
			this.cifVersion = cifVersion ? cifVersion : "";
			this.correlationId = correlationId ? correlationId : "";
		}
	}

	export class APIUsageTelemetry {
		providerId: string;
		providerName: string;
		apiVersion: string;
		apiName: string;
		sortOrder: any;
		appId: string;
		isError: boolean;
		errorObject: IErrorHandler;
		cifVersion: string;
		customParameters: string;
		correlationId: string;
		constructor(providerId?: string, providerName?: string, apiVersion?: string, apiName?: string, sortOrder?: any, appId?: string, cifVersion?: string, isError?: boolean, errorObject?: IErrorHandler, customParameters?:string, correlationId?: string) {
			this.providerId = providerId ? providerId : "";
			this.providerName = providerName ? providerName : "";
			this.apiVersion = apiVersion ? apiVersion : "";
			this.apiName = apiName ? apiName : "";
			this.sortOrder = sortOrder ? sortOrder : "";
			this.appId = appId ? appId : "";
			this.isError = isError ? isError : false;
			this.errorObject = errorObject ? errorObject : null;
			this.cifVersion = cifVersion ? cifVersion : "";
			this.customParameters = customParameters ? customParameters : "";
			this.correlationId = correlationId ? correlationId : "";
		}
	}
}