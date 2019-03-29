/// <reference path="../../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../../../../../references/internal/TypeDefinitions/CommonControl/CommonControl.d.ts" />

module MscrmControls.Service.CIProvider {
	'use strict';

	declare var Xrm: any;

	export var elementSeparator: string = ";";

	export interface ElementInformation {
		ElementId: string;
		ElementUniqueName: string;
		ElementName: string;
		NavigationType: string;
		EventHandlers?: AppEventhandlers[];
	}

	export interface FormattedElementInformation {
		Label: string;
		Value: string;
		ElementId: string;
	}

	export interface AppEventhandlers {
		EventName: string;
		FunctionName: string;
		LibraryName: string;
		Parameters: string;
		Enabled: boolean;
	}

	export interface RoleInformation {
		RoleId: string;
		RoleName: string;
		RoleTemplateId: string;
	}

	export class ODataUpdateRequest implements WebApi.ODataContract {
		public etn: string;

		public id: string;

		public payload: any;

		public constructor(etn: string, id: string, payload: any) {
			this.etn = etn;
			this.id = id;
			this.payload = payload;
		}

		public getMetadata(): WebApi.ODataContractMetadata {
			return {
				boundParameter: null,
				parameterTypes: {},
				operationName: "Update",
				operationType: 2,
			};
		}
	}

	export class ODataPublishAppModuleRequest implements WebApi.ODataContract {

		public AppModuleId: any;

		public constructor(payload: any) {
			this.AppModuleId = new Guid(payload);
		}

		public getMetadata(): WebApi.ODataContractMetadata {
			return {
				boundParameter: undefined,
				parameterTypes: {
					"AppModuleId": {
						"typeName": "Edm.Guid",
						"structuralProperty": 1
					}
				},
				operationName: "PublishAppModule",
				operationType: 0,
			};
		}
	}

	export class AppMultiSelectHelper {

		private static instance: AppMultiSelectHelper;
		private my_number: number;
		private appsList: ElementInformation[];
		private selectedApps: string[];
		private selectedAppsToUpdate: ElementInformation[];

		constructor() { }

		public static get Instance(): AppMultiSelectHelper {
			if (this.instance == null) {
				this.instance = new AppMultiSelectHelper();
			}
			return this.instance;
		}

		public UpdateAppModule(context: any, selectedApps: any): void {
			if (selectedApps && selectedApps !== "") {
				this.selectedApps = selectedApps.split(elementSeparator);
				this.getAppsList();
			}
		}

		private getAppsList(): void {

			var queryParam = "(clienttype eq 4)";
			var query = "?$select=name,appmoduleid,uniquename,eventhandlers,navigationtype&$filter=" + queryParam;
			Xrm.WebApi.retrieveMultipleRecords("appmodule", query).then(
				(data: any) => {
						//To-Do - Add Telemetry
					this.appsList = [];
					for (let app of data.entities) {
						this.appsList.push({ ElementId: app.appmoduleid, ElementUniqueName: app.uniquename, ElementName: app.name, NavigationType: app.navigationtype, EventHandlers: JSON.parse(app.eventhandlers) });
					}
					this.batchUpdateAppModuleBase();
				},
				(error: any) => {
						//To-Do - Add Telemetry
				}
			);
		}

		private batchUpdateAppModuleBase(): void {
			this.selectedAppsToUpdate = [];
			var params: string = "";
			for (let i = 0; i < this.selectedApps.length; i++) {
				var selectedApp: ElementInformation[] = this.appsList.filter(app => app.ElementId === this.selectedApps[i]);
				if (selectedApp && selectedApp.length > 0) {
					if (selectedApp[0] && !this.containsEventHandler(selectedApp[0])) {
						params =  "\"4\",\""+selectedApp[0].NavigationType.toString()+"\"";
						var handler = <AppEventhandlers>{};
						handler.EventName = "onload";
						handler.LibraryName = "CRMClients/msdyn_internal_ci_library.js";
						handler.FunctionName = "Microsoft.CIFramework.Internal.initializeCI";
						handler.Parameters = params;
						handler.Enabled = true;
						if (!selectedApp[0].EventHandlers) {
							selectedApp[0].EventHandlers = [];
						}
						selectedApp[0].EventHandlers.push(handler);
					}
					this.selectedAppsToUpdate.push(selectedApp[0]);
				}
			}

			let requestsToExecute: any[] = [];
			let updateAttribute: any = {};
			for (var app of this.selectedAppsToUpdate) {
				let updateHandler: any = {}
				let appModuleId: any = {};
				if (app.EventHandlers && app.EventHandlers.length > 0) {
					updateHandler["eventhandlers"] = JSON.stringify(app.EventHandlers);
					var updateHandlerRequest = new ODataUpdateRequest("appmodule", app.ElementId, updateHandler);
					requestsToExecute.push(updateHandlerRequest);
					appModuleId["AppModuleId"] = app.ElementId;
					var publishApp = new ODataPublishAppModuleRequest(app.ElementId);
					requestsToExecute.push(publishApp);
				}
			}

			if (requestsToExecute.length > 0) {
				Xrm.WebApi.online.executeMultiple(requestsToExecute).then(
					(success: any[]) => {
						//To-Do - Add Telemetry
					},
					(error: any) => {
						//To-Do - Add Telemetry
					}
				)
			}
		}

		private containsEventHandler(selectedApp: ElementInformation): boolean {
			if (selectedApp.EventHandlers) {
				for (let eventHandler of selectedApp.EventHandlers) {
					if (eventHandler.FunctionName === "Microsoft.CIFramework.Internal.initializeCI") {
						return true;
					}
				}
			}
			return false;
		}
	}
}