/// <reference path="CRMClients/TelemetryConstants.ts" />
/// <reference path="CRMClients/State.ts" />
/// <reference path="CRMClients/aria-webjs-sdk-1.6.2.d.ts" />
/// <reference path="CRMClients/IErrorHandler.ts" />

namespace Microsoft.CIFramework.Internal
{
	declare var Xrm: any;
	declare var defaultLogger: any;
	var projectIngestionKey = "39f156fe0f00465288756928db675fe0-fef5dc1c-14bd-4361-9259-5f10f8ef5040-7209";
	defaultLogger = AWTLogManager.initialize(projectIngestionKey);

	/**
	 * Methos to log the usage of APIs 
	 * @param result 
	 */
	export function reportUsage(result: string): void
	{
		console.trace(result); // TO-DO: use the actual reporting APIs once integrated with UC client.
	}

	/**
	 * Metjhod to log the error of APIs
	 * @param error 
	 */
	export function reportError(error: string): void
	{
		console.error(error); // TO-DO: use the actual reporting APIs once integrated with UC client.
	}

	/**
	 * Generic method to convert map data into string
	 * @param map 
	 */
	export function mapToString(map: Map<string, any>): string
	{
		let result: string;
        if(!map) {
            return "";
        }
		map.forEach((value, key) => {
			result += key + " : " + value + ", ";
		});
		return result;
	}

	/**
	 * Gereric function to convert event data into string
	 * @param event 
	 */
	export function eventToString(event: CustomEvent): string
	{
		let result: string;
		const data1 = event.detail["field"];
		const data2 = event.detail["ParentEntityReference"];
		result = "value " + data1["value"] + "\nname " + data1["name"] + "\ntype " + data1["type"] + "\n ParentEntityReference "+ data2["entityType"] + ", ID "+ data2["id"] + ", name : "+ data2["name"];
		return result;
	}

	export function logApiData(telemetryData: Object | any, startTime: any, timetaken: any, apiName: string) {
		let ApiData: any = new Object();
		ApiData["StartTime"] = startTime.toUTCString();
		ApiData["TimeTaken"] = timetaken;
		if (telemetryData) {
			telemetryData[apiName] = ApiData;
		}
	}

	export function logFailure(appId: string, isError: boolean, error: IErrorHandler) {
		var usageData = new UsageTelemetryData(null, null, null, null, appId ? appId : "", isError ? isError : false, error ? error : null);
		setUsageData(usageData);
	}

	// Function to populate the Usage Data Telemetry
	export function setUsageData(data: UsageTelemetryData): void {
		var testUsageTelemetry = new AWTEventProperties();
		testUsageTelemetry.setName(TelemetryConstants.usageTable);

		testUsageTelemetry.setProperty(TelemetryConstants.apiVersion, data.apiVersion ? data.apiVersion : "");
		testUsageTelemetry.setProperty(TelemetryConstants.appId, data.appId ? data.appId : "");
		testUsageTelemetry.setProperty(TelemetryConstants.channelOrder, data.sortOrder ? data.sortOrder : "");
		testUsageTelemetry.setProperty(TelemetryConstants.clientType, Xrm.Utility.getGlobalContext().client.getClient());
		testUsageTelemetry.setProperty(TelemetryConstants.crmVersion, Xrm.Utility.getGlobalContext().getVersion());
		testUsageTelemetry.setProperty(TelemetryConstants.orgId, Xrm.Utility.getGlobalContext().organizationSettings.organizationId);
		testUsageTelemetry.setProperty(TelemetryConstants.orgName, Xrm.Utility.getGlobalContext().organizationSettings.uniqueName);
		testUsageTelemetry.setProperty(TelemetryConstants.providerId, data.providerId ? data.providerId : "");
		testUsageTelemetry.setProperty(TelemetryConstants.providerName, data.providerName ? data.providerName : "");
		testUsageTelemetry.setProperty(TelemetryConstants.isError, data.isError ? data.isError : false);
		testUsageTelemetry.setProperty(TelemetryConstants.errorMessage, data.errorObject ? data.errorObject.errorMsg : "");
		testUsageTelemetry.setProperty(TelemetryConstants.errorType, data.errorObject ? errorTypes[data.errorObject.errorType] : "");
		testUsageTelemetry.setProperty(TelemetryConstants.errorReportTime, data.errorObject ? data.errorObject.reportTime : "");
		testUsageTelemetry.setProperty(TelemetryConstants.errorFunction, data.errorObject ? data.errorObject.sourceFunc : "");

		defaultLogger.logEvent(testUsageTelemetry);
	}

	// Function to populate the Performance Data Telemetry
	export function setPerfData(data: PerfTelemetryData) {
		var testPerfTelemetry = new AWTEventProperties();
		testPerfTelemetry.setName(TelemetryConstants.perfTable);

		testPerfTelemetry.setProperty(TelemetryConstants.providerId, data.providerData.providerId ? data.providerData.providerId : "");
		testPerfTelemetry.setProperty(TelemetryConstants.providerName, data.providerData.name ? data.providerData.name : "");
		testPerfTelemetry.setProperty(TelemetryConstants.crmVersion, data.providerData.crmVersion ? data.providerData.crmVersion : "");
		testPerfTelemetry.setProperty(TelemetryConstants.appId, data.providerData.appId ? data.providerData.appId : "");
		testPerfTelemetry.setProperty(TelemetryConstants.apiVersion, data.providerData.apiVersion ? data.providerData.apiVersion : "");
		testPerfTelemetry.setProperty(TelemetryConstants.orgId, data.providerData.orgId ? data.providerData.orgId : "");
		testPerfTelemetry.setProperty(TelemetryConstants.orgName, data.providerData.orgName ? data.providerData.orgName : "");
		testPerfTelemetry.setProperty(TelemetryConstants.startTime, data.startTime ? data.startTime.toUTCString() : "");
		testPerfTelemetry.setProperty(TelemetryConstants.timeTaken, data.timeTaken ? data.timeTaken : "");
		testPerfTelemetry.setProperty(TelemetryConstants.apiName, data.apiName ? data.apiName : "");
		testPerfTelemetry.setProperty(TelemetryConstants.telemetryData, data.telemetryData ? JSON.stringify(data.telemetryData) : "");
		defaultLogger.logEvent(testPerfTelemetry);
	}

	export class UsageTelemetryData {
		providerId: string;
		providerName: string;
		apiVersion: string;
		sortOrder: any;
		appId: string;
		isError: boolean;
		errorObject: IErrorHandler;
		constructor(providerId?: string, providerName?: string, apiVersion?: string, sortOrder?: any, appId?: string, isError?: boolean, errorObject?: IErrorHandler) {
			this.providerId = providerId ? providerId : "";
			this.providerName = providerName ? providerName : "";
			this.apiVersion = apiVersion ? apiVersion : "";
			this.sortOrder = sortOrder ? sortOrder : "";
			this.appId = appId ? appId : "";
			this.isError = isError ? isError : false;
			this.errorObject = errorObject ? errorObject : null;
		}
	}

	export class PerfTelemetryData {
		providerData: CIProvider;
		startTime: any;
		timeTaken: any;
		apiName: string;
		telemetryData: Object;
		constructor(providerData?: CIProvider, startTime?: any, timeTaken?: any, apiName?: string, telemetryData?: Object) {
			this.providerData = providerData ? providerData : null;
			this.startTime = startTime ? startTime : "";
			this.timeTaken = timeTaken ? timeTaken : "";
			this.apiName = apiName ? apiName : "";
			this.telemetryData = telemetryData ? telemetryData : null;
		}
	}
}
