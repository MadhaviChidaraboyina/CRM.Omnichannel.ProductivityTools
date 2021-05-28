
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/


namespace Microsoft.ProductivityMacros.MacrosDataLayer {
	export class FlowClient {
		private readonly fpiHelper: FPIHelper;
		private readonly environmentContext: EnvironmentContext;
		private static readonly defaultHeader = { "Content-Type": "application/json", "Cache-Control": "no-cache", "Pragma": "no-cache" };
		private static readonly apiVersion = "2016-11-01";
		/**
		 * 
		 * @param fpiHelper FPI Helper 
		 */
		constructor() {
			this.fpiHelper = FPIHelper.getInstance();
			const organizationSettings = OrganizationSettings.instance;
			this.environmentContext = new EnvironmentContext();
			this.environmentContext.organizationId = organizationSettings.originalOrganizationSettings.organizationId;
			this.environmentContext.organizationName = organizationSettings.originalOrganizationSettings.uniqueName;
			this.setFlowApiConfiguration(organizationSettings.geoName);
		}

		private setFlowApiConfiguration(geoName: string) {
			const setting = FlowGeoSettings[geoName.toUpperCase()] || FlowGeoSettings[GeoNames.DEFAULT];
			this.environmentContext.apiBaseUri = setting.endpoint;
			this.environmentContext.resourceIdentifier = setting.resource;
		}

		public async getEnvironment(requestContext: FlowRequestContext): Promise<any> {
			const message = new FPIRequestMessage();
			message.requestType = RequestTypes.POST;
			message.url = `${this.environmentContext.apiBaseUri}/providers/Microsoft.Flow/getOrCreateLinkedEnvironment?api-version=${FlowClient.apiVersion}`;
			message.payload = JSON.stringify({
				resourceId: this.environmentContext.organizationId,
				type: "Dynamics365Instance"
			});
			message.header = FlowClient.defaultHeader;
			message.resource = this.environmentContext.resourceIdentifier;
			message.staticData = requestContext;
			return this.fpiHelper.makeFPIRequest(message, requestContext.requestId);
		}

		public async getFlows(entityName: string, requestContext: FlowRequestContext): Promise<any> {
			const environment = await this.getEnvironment(requestContext);
			const environmentId = environment.name;
			const url = `${this.environmentContext.apiBaseUri}/providers/Microsoft.Flow/environments/${environmentId}/flows?$filter=`
				+ `operations/any(operation: operation/commondataservice.organization eq 'default.cds' and operation/commondataservice.entity eq '${entityName}') and properties/definitionSummary/triggers/any(t: t/type eq 'request')+or+`
				+ `operations/any(operation: operation/dynamics.organization eq '${this.environmentContext.organizationName}' and operation/dynamics.entity eq '${entityName}') and properties/definitionSummary/triggers/any(t: t/type eq 'request')+or+`
				+ `operations/any(operation: operation/commondataservice.organization eq '${this.environmentContext.organizationName}' and operation/commondataservice.entity eq '${entityName}') and properties/definitionSummary/triggers/any(t: t/type eq 'request')`
				+ `&api-version=${FlowClient.apiVersion}`;
			const message = new FPIRequestMessage();
			message.requestType = RequestTypes.GET;
			message.url = url;
			message.header = FlowClient.defaultHeader;
			message.resource = this.environmentContext.resourceIdentifier;
			message.staticData = requestContext;
			return this.fpiHelper.makeFPIRequest(message, requestContext.requestId);
		}

	}

	export class FlowRequestContext {
		public consumerId: string;
		public requestId: string;

		constructor(consumerId: string, requestId: string) {
			this.consumerId = consumerId;
			this.requestId = requestId;
		}
	}

	class EnvironmentContext {
		public organizationId: string;
		public organizationName: string;
		public apiBaseUri: string;
		public resourceIdentifier: string;
	}
}