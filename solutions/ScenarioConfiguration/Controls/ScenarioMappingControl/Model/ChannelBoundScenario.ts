/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="../privatereferences.ts"/>

module MscrmControls.Service.CIProvider {
	'use strict';
	declare var Xrm: any

	export class ChannelBoundScenario implements IEntityBoundScenario {

		ScenarioEntityFilter: string = "?$filter=_msdyn_channelid_value eq {0}&$expand=msdyn_NotificationTemplate($select=msdyn_name),msdyn_SessionTemplate($select=msdyn_name)";
		ChannelEntityName = "msdyn_channel";


		/**
		 * 
		 * @param context - Custom control context
		 * @param entityId - Record id of the page where this control is loading
		 * @param templateType - Notification or Session template
		 */
		public LoadInitialState(context: Mscrm.ControlData<IInputBag>, entityId: string, templateType: TemplateType): Promise<IScenarioMapState> {

			return new Promise<IScenarioMapState>((resolve, reject) => {
				ODataUtility.GetScenariosForEntity(context, this.ScenarioEntityFilter, entityId, templateType).then(
					(resp) => {
						

						var templateEntityName = ScenarioContolConstants.GetTemplateEntityName(templateType);
						var viewId = ScenarioContolConstants.GetTemplateLookupViewId(templateType);
						var templateScenarioRelationshipName = ScenarioContolConstants.GetTemplateScenarioRelationship(templateType);

						resolve({
							TemplateType: templateType,
							Scenarios: resp,
							IsDirty: false,
							TemplateEntityName: templateEntityName,
							ViewId: viewId,
							BoundEntityName: this.ChannelEntityName,
							TemplateScenarioRelationshipName: templateScenarioRelationshipName,
						});

					},
					(err) => { console.error("[ScenarioMappingControl]Unable to load Scenarios for Scenario Mapping Control"); });

			});
				
			
		}

		/**
		 * @param initialState - Initial state of all the scenarios when the custom control loaded
		 * @param initialState - Current state of all the scenarios for persisting
		 */
		public PersistState(initialState: IScenarioMapState, currentState: IScenarioMapState): WebApi.ODataContract[] {

			var scenariosAddedTemplates = ODataUtility.GetScenariosWithTemplatesAdded(initialState, currentState);
			var scenariosRemovedTemplates = ODataUtility.GetScenariosWithTemplatesRemoved(initialState, currentState);

			var relationshipName = currentState.TemplateScenarioRelationshipName;

			var webApiRequests: WebApi.ODataContract[] = [];

			for (var addedScenarioRecord of scenariosAddedTemplates) {
				var targetTemplate: Mscrm.LookupValue = ODataUtility.GetTemplateLookupValuefromScenarioRecord(addedScenarioRecord);

				var relatedScenario: Mscrm.LookupValue = {
					id: addedScenarioRecord.ScenarioId,
					name: addedScenarioRecord.Name,
					entityType: ScenarioContolConstants.ScenarioEntityName
				}

				webApiRequests.push(new ODataAssociateRequest(targetTemplate, relationshipName, [relatedScenario]));
			}

			for (var removedScenarioRecord of scenariosRemovedTemplates) {
				var targetTemplate: Mscrm.LookupValue = ODataUtility.GetTemplateLookupValuefromScenarioRecord(removedScenarioRecord);

				var relatedScenario: Mscrm.LookupValue = {
					id: removedScenarioRecord.ScenarioId,
					name: removedScenarioRecord.Name,
					entityType: ScenarioContolConstants.ScenarioEntityName
				}

				webApiRequests.push(new ODataDisassociateRequest(targetTemplate, relationshipName, removedScenarioRecord.ScenarioId));
			}

			return webApiRequests;
		}
	}
}