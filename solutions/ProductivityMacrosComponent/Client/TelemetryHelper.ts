/// <reference path="TelemetryConstants.ts" />
/// <reference path="CRMClients/aria-webjs-sdk-1.8.3.d.ts" />
/** @internal */
namespace Microsoft.ProductivityMacros.Internal {
	declare var Xrm: any;
	export declare var appId: string;
	export var crmVersion: string = "";
	export var orgId: string = "";
	declare var macrosLogger: any;
	let prodIngestionKey = "15742b0e58eb4711bc046acff53e7165-1bfb5a4d-2ecc-4c51-8271-a773c63f58de-6809";
	let devIngestionKey = "22fdf28125b2493787078364a7ffe42e-28bf5791-b218-4f89-8d06-8135775da123-7269";

	let GERMANY_ENDPOINT = "https://de.pipe.aria.microsoft.com/Collector/3.0/";
	let GCCH_ENDPOINT = "https://tb.pipe.aria.microsoft.com/Collector/3.0/";
	let DOD_ENDPOINT = "https://pf.pipe.aria.microsoft.com/Collector/3.0";
	let EUROPE_ENDPOINT = "https://eu.pipe.aria.microsoft.com/Collector/3.0/";
	let MOONCAKE_ENDPOINT = ""; // Add MoonCake ARIA Endpoint whenever available

	export function initializeTelemetry() {
		let domain = getDomain();
		let logConfig = getConfiguration(domain);
		if (domain == "Dev") {
			macrosLogger = AWTLogManager.initialize(devIngestionKey, logConfig);
		}
		else {
			macrosLogger = AWTLogManager.initialize(prodIngestionKey, logConfig);
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
		return TelemetryConstants.multiSession;
	}

	function getAppId(): string {
		return top.location.search.split('appid=')[1].split('&')[0];
	}

	function getMacroVersion(): string {
		let MacrosVersion = "";
        (window.top as any).Xrm.WebApi.retrieveMultipleRecords("msdyn_productivitymacrosolutionconfiguration", "?$top=1").then(
			(result: any) => {
				if (result && result.entities) {
					MacrosVersion = result.entities[0].msdyn_macrosversion;
				}
			}
		)
		return MacrosVersion;
	}

	function getClientType(): string {
		return (window.top as any).Xrm.Utility.getGlobalContext().client.getClient();
	}

	function getCrmVersion(): string {
		return (window.top as any).Xrm.Utility.getGlobalContext().getVersion();
	}

	function getOrgId(): string {
		return (window.top as any).Xrm.Utility.getGlobalContext().organizationSettings.organizationId;
	}

	function getOrgName(): string {
		return (window.top as any).Xrm.Utility.getGlobalContext().organizationSettings.uniqueName;
	}

	function getUserId(): string {
		return (window.top as any).Xrm.Utility.getGlobalContext().userSettings.userId;
	}

	// API for Error Telemetry
	export function logFailure(actionName: string, errorObject: IErrorHandler, correlationid?: string) {
		let usageData = new UsageTelemetryData(actionName, "Failure", {}, correlationid, true, errorObject);
		setMacrosRuntimeData(usageData);
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

	export function logNestedApiData(telemetryData: Object | any, startTime: any, timetaken: any, apiName: string, additionalData?: any) {
		let ApiData: any = new Object();
		ApiData["StartTime"] = startTime.toUTCString();
		ApiData["TimeTaken"] = timetaken;
		if (additionalData) {
			ApiData["AdditionalDetails"] = additionalData;
		}
		if (telemetryData) {
			telemetryData[apiName] = ApiData;
		}
	}

	// API to log Success Scenario
	export function logSuccess(actionName: string, correlationId: string, telemetryData?: Object) {
		if (!telemetryData)
			telemetryData = {};
		let usageData = new UsageTelemetryData(actionName, "Success", telemetryData, correlationId, false);
		setMacrosRuntimeData(usageData);
	}

	export function setMacrosAdminData(data: any): void {
		var AdminTelemetry = new AWTEventProperties();
		AdminTelemetry.setName(TelemetryConstants.macrosAdminTable);

		AdminTelemetry.setProperty(TelemetryConstants.adminDesignerInstanceId, data.designerInstanceId ? data.designerInstanceId : "");
		AdminTelemetry.setProperty(TelemetryConstants.adminEventName, data.eventName ? data.eventName : "");
		AdminTelemetry.setProperty(TelemetryConstants.adminEventCorrelationId, data.eventCorrelationId ? data.eventCorrelationId : "");
		AdminTelemetry.setProperty(TelemetryConstants.adminMessage, data.message ? data.message : "");
		AdminTelemetry.setProperty(TelemetryConstants.adminEventData, data.eventData ? data.eventData : "");
		AdminTelemetry.setProperty(TelemetryConstants.adminEventId, data.eventId ? data.eventId : "");
		AdminTelemetry.setProperty(TelemetryConstants.adminEventTimeStamp, data.eventTimeStamp ? data.eventTimeStamp : "");
		AdminTelemetry.setProperty(TelemetryConstants.adminEventType, data.eventType ? data.eventType : "");
		AdminTelemetry.setProperty(TelemetryConstants.adminLevel, data.level ? data.level : "");
		AdminTelemetry.setProperty(TelemetryConstants.adminException, data.exception ? data.exception : "");

		AdminTelemetry.setProperty(TelemetryConstants.macroVersion, getMacroVersion());
		AdminTelemetry.setProperty(TelemetryConstants.appId, getAppId());
		AdminTelemetry.setProperty(TelemetryConstants.navigationType, getNavigationType());
		AdminTelemetry.setProperty(TelemetryConstants.clientType, getClientType());
		AdminTelemetry.setProperty(TelemetryConstants.crmVersion, getCrmVersion());
		AdminTelemetry.setProperty(TelemetryConstants.orgId, getOrgId());
		AdminTelemetry.setProperty(TelemetryConstants.orgName, getOrgName());
		AdminTelemetry.setProperty(TelemetryConstants.userId, getUserId());

		macrosLogger.logEvent(AdminTelemetry);
	}

	// Function to populate the Macros Runtime Data Telemetry
	function setMacrosRuntimeData(data: UsageTelemetryData): void {
		var RuntimeTelemetry = new AWTEventProperties();
		RuntimeTelemetry.setName(TelemetryConstants.macrosRuntimeTable);

		RuntimeTelemetry.setProperty(TelemetryConstants.macroActionName, data.MacrosActionName);
		RuntimeTelemetry.setProperty(TelemetryConstants.macroActionResult, data.MacrosActionResult);
		RuntimeTelemetry.setProperty(TelemetryConstants.telemetryData, data.TelemetryData ? JSON.stringify(data.TelemetryData) : "");
		RuntimeTelemetry.setProperty(TelemetryConstants.isError, data.IsError ? data.IsError : false);
		RuntimeTelemetry.setProperty(TelemetryConstants.errorFunction, data.ErrorObject ? data.ErrorObject.sourceFunc : "");
		RuntimeTelemetry.setProperty(TelemetryConstants.errorMessage, data.ErrorObject ? data.ErrorObject.errorMsg : "");
		RuntimeTelemetry.setProperty(TelemetryConstants.errorType, data.ErrorObject ? errorTypes[data.ErrorObject.errorType] : "");
		RuntimeTelemetry.setProperty(TelemetryConstants.errorReportTime, data.ErrorObject ? data.ErrorObject.reportTime : "");
		RuntimeTelemetry.setProperty(TelemetryConstants.correlationId, data.CorrelationId ? data.CorrelationId : "");

		RuntimeTelemetry.setProperty(TelemetryConstants.macroVersion, getMacroVersion());
		RuntimeTelemetry.setProperty(TelemetryConstants.appId, getAppId());
		RuntimeTelemetry.setProperty(TelemetryConstants.navigationType, getNavigationType());
		RuntimeTelemetry.setProperty(TelemetryConstants.clientType, getClientType());
		RuntimeTelemetry.setProperty(TelemetryConstants.crmVersion, getCrmVersion());
		RuntimeTelemetry.setProperty(TelemetryConstants.orgId, getOrgId());
		RuntimeTelemetry.setProperty(TelemetryConstants.orgName, getOrgName());
		RuntimeTelemetry.setProperty(TelemetryConstants.userId, getUserId());

		macrosLogger.logEvent(RuntimeTelemetry);
	}

	export class UsageTelemetryData {
		MacrosActionName: string;
		MacrosActionResult: string;
		TelemetryData: Object;
		CorrelationId: string;
		IsError: boolean;
		ErrorObject: IErrorHandler;
		constructor(MacrosActionName?: string, MacrosActionResult?: string, TelemetryData?: Object, CorrelationId?: string, IsError?: boolean, errorObject?: IErrorHandler|any) {
			this.MacrosActionName = MacrosActionName ? MacrosActionName : "";
			this.MacrosActionResult = MacrosActionResult ? MacrosActionResult : "";
			this.TelemetryData = TelemetryData ? TelemetryData : {};
			this.CorrelationId = CorrelationId ? CorrelationId : "";
			this.IsError = IsError ? IsError : false;
			this.ErrorObject = errorObject ? errorObject : {};
		}
	}
}