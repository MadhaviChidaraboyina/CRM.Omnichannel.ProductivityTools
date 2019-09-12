/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="../privatereferences.ts"/>
/// <reference path="../../../../../references/external/TypeDefinitions/lib.es6.d.ts" />

module MscrmControls.Service.CIProvider {

	export class ODataAssociateRequest implements WebApi.ODataContract {
		public target: Mscrm.LookupValue;
		public relationship: string;
		public relatedEntities: Mscrm.LookupValue[];

		public constructor(target: Mscrm.LookupValue, relationship: string, relatedEntities: Mscrm.LookupValue[]) {
			this.target = target;
			this.relationship = relationship;
			this.relatedEntities = relatedEntities;
		}

		public getMetadata(): WebApi.ODataContractMetadata {
			return {
				boundParameter: "target",
				parameterTypes: {
					"target": {
						"typeName": "mscrm.crmbaseentity",
						"structuralProperty": WebApi.ODataStructuralProperty.EntityType,
					},
					"relationship": {
						"typeName": "Edm.String",
						"structuralProperty": WebApi.ODataStructuralProperty.PrimitiveType,
					},
					"relatedEntities": {
						"typeName": "mscrm.crmbaseentity",
						"structuralProperty": WebApi.ODataStructuralProperty.Collection,
					},
				},
				operationName: "Associate",
				operationType: 2,
			};
		}
	}

	export class ODataDisassociateRequest implements WebApi.ODataContract {
		public target: Mscrm.LookupValue;
		public relationship: string;
		public relatedEntityId: string;

		public constructor(target: Mscrm.LookupValue, relationship: string, relatedEntityId?: string) {
			this.target = target;
			this.relationship = relationship;
			this.relatedEntityId = relatedEntityId || null;
		}

		public getMetadata(): WebApi.ODataContractMetadata {
			return {
				boundParameter: "target",
				parameterTypes: {
					"target": {
						"typeName": "mscrm.crmbaseentity",
						"structuralProperty": WebApi.ODataStructuralProperty.EntityType,
					},
					"relationship": {
						"typeName": "Edm.String",
						"structuralProperty": WebApi.ODataStructuralProperty.PrimitiveType,
					},
					"relatedEntityId": {
						"typeName": "Edm.String",
						"structuralProperty": WebApi.ODataStructuralProperty.PrimitiveType,
					},
				},
				operationName: "Disassociate",
				operationType: 2,
			};
		}
	}

	export class ODataUtility {

		//get all Scenarios for current bound entity (channel or workstream)
		public static GetScenariosForEntity(context: Mscrm.ControlData<IInputBag>, filterAttribute: string, filterId: string, templateType: TemplateType) : Promise<IScenarioRecord[]>{
			return new Promise<IScenarioRecord[]>((resolve, reject) => {
				let filterOption = ODataUtility.Format(filterAttribute, filterId);
				let scenariosList: IScenarioRecord[] = [];

				context.webAPI.retrieveMultipleRecords("msdyn_scenario", filterOption).then(
					(resp: any) => {
						
						if (resp && resp.entities && resp.entities.length > 0) {
							for (let scenario of resp.entities) {
								if (scenario.msdyn_type == templateType) {
									scenariosList.push(this.GetScenarioRecordFromEntity(scenario));
								}
							}
						}
						resolve(scenariosList);
					},
					(err) => { console.error("[ScenarioMappingControl] Unable to fetch scenarios", err); reject(null); });
			});
		}

		//Create IScenarioRecord object from entity dictionary which we get from CRM 
		private static GetScenarioRecordFromEntity(scenarioEntity: any): IScenarioRecord {
			var boundTemplate : ITemplate = null;

			if (scenarioEntity.msdyn_SessionTemplate != null) {
				boundTemplate = {
					DisplayName: scenarioEntity.msdyn_SessionTemplate.msdyn_name || "",
					LogicalName: ScenarioContolConstants.SessionTemplateEntityName,
					TemplateId: scenarioEntity.msdyn_SessionTemplate.msdyn_consoleapplicationsessiontemplateid || null
				};
			}
			else if (scenarioEntity.msdyn_NotificationTemplate != null){
				boundTemplate = {
					DisplayName: scenarioEntity.msdyn_NotificationTemplate.msdyn_name || "",
					LogicalName: ScenarioContolConstants.NotificationTemplateEntityName,
					TemplateId: scenarioEntity.msdyn_NotificationTemplate.msdyn_consoleapplicationnotificationtemplateid || null
				};
			}

			//Take DisplayName from parent if available
			var displayName: string = "";
			if (scenarioEntity.msdyn_ParentScenarioId && scenarioEntity.msdyn_ParentScenarioId.msdyn_displayname) {
				displayName = scenarioEntity.msdyn_ParentScenarioId.msdyn_displayname;
			}
			else {
				displayName = scenarioEntity.msdyn_displayname || "";
			}

			var scenarioRecord : IScenarioRecord = {
				ScenarioId: scenarioEntity.msdyn_scenarioid || "",
				Name: scenarioEntity.msdyn_name || "",
				DisplayName: displayName,
				TemplateType: scenarioEntity.msdyn_type,
				BoundTemplate: boundTemplate
			};
			return scenarioRecord;

		}

		//Get all Scenario Records where we have added a template
		public static GetScenariosWithTemplatesAdded(initialState: IScenarioMapState, currentState: IScenarioMapState): IScenarioRecord[]{
			var changedScenarios: IScenarioRecord[] = [];

			if (initialState.Scenarios && initialState.Scenarios.length > 0) {
				for (var i = 0; i < initialState.Scenarios.length; i++) {

					var initialBoundTemplate = initialState.Scenarios[i].BoundTemplate;
					var currentBoundTemplate = currentState.Scenarios[i].BoundTemplate;

					if ((initialBoundTemplate == null &&
						(currentBoundTemplate && currentBoundTemplate.TemplateId)) ||
						(currentBoundTemplate && currentBoundTemplate.TemplateId && currentBoundTemplate.TemplateId != initialBoundTemplate.TemplateId)) {
						changedScenarios.push(currentState.Scenarios[i]);
					}
				}
			}

			return changedScenarios;

		}

		//Get all Scenario Records where we have removed the template
		public static GetScenariosWithTemplatesRemoved(initialState: IScenarioMapState, currentState: IScenarioMapState): IScenarioRecord[] {
			var changedScenarios: IScenarioRecord[] = [];

			if (initialState.Scenarios && initialState.Scenarios.length > 0) {
				for (var i = 0; i < initialState.Scenarios.length; i++) {

					var initialBoundTemplate = initialState.Scenarios[i].BoundTemplate;
					var currentBoundTemplate = currentState.Scenarios[i].BoundTemplate;

					if ((initialBoundTemplate && initialBoundTemplate.TemplateId) &&
						currentBoundTemplate == null) {
						changedScenarios.push(initialState.Scenarios[i]);
					}
				}
			}

			return changedScenarios;

		}

		//Get the Mscrm.Lookup value for the Template associated with the scenarioRecord
		public static GetTemplateLookupValuefromScenarioRecord(scenarioRecord: IScenarioRecord):Mscrm.LookupValue {
			if (scenarioRecord.BoundTemplate) {
				return {
					id: scenarioRecord.BoundTemplate.TemplateId,
					name: scenarioRecord.BoundTemplate.DisplayName,
					entityType: scenarioRecord.BoundTemplate.LogicalName
				}
			}
			return null;
		}


		/**
		* @remarks Limited functionality implemented
		* @returns a formatted string, similar to string.Format in C#.
		*/
		public static Format(format: string, ...args: any[]) {
			let returnValue = format;

			for (let i = 1; i < arguments.length; i++) {
				const actualValue = typeof arguments[i] == "undefined" || arguments[i] == null ? "" : arguments[i].toString();
				returnValue = returnValue.replace(new RegExp("\\{" + (i - 1) + "\\}", "g"), actualValue);
			}

			return returnValue;
		}

	}

}