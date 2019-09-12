/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>

module MscrmControls.Service.CIProvider {
	'use strict';
	declare var Xrm: any

	//Maintains the state of all the current scenarios and associated templates
	export interface IScenarioMapState {
		TemplateType: TemplateType,
		Scenarios: IScenarioRecord[],
		IsDirty: boolean,
		TemplateEntityName: string,
		ViewId: string,
		BoundEntityName: string
		TemplateScenarioRelationshipName: string,
	}

	//Single scenario record
	export interface IScenarioRecord {
		ScenarioId: string,
		Name: string,
		DisplayName: string,
		TemplateType: TemplateType,
		BoundTemplate: ITemplate
	}

	//Single template record
	export interface ITemplate {
		TemplateId: string,
		LogicalName: string,
		DisplayName: string
	}

	//Base interface which should be implemented i we want to associated scenarios with any other entity
	export interface IEntityBoundScenario {
		LoadInitialState(context: Mscrm.ControlData<IInputBag>, entityId: string, templateType: TemplateType): Promise<IScenarioMapState>,
		PersistState(initialState: IScenarioMapState, currentState: IScenarioMapState): WebApi.ODataContract[]
	}

	export enum TemplateType {
		Session = 0,
		Notification = 1
	}

	export enum ControlInitState {
		Loading,
		Ready,
		Error
	}
}