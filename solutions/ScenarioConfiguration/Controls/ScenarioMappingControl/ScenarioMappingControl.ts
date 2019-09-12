/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>
/// <reference path="../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../../../../references/external/TypeDefinitions/jquery.d.ts" />

module MscrmControls.Service.CIProvider {
	'use strict';
	declare var Xrm: any

	export class ScenarioMappingControl implements Mscrm.StandardControl<IInputBag, IOutputBag>
	{

		
		/**
		 * Property bag that contains the parameters/ resources info and required utility/ navigation / formatting methods.
		 * This field is initialised at the control instance creation and so, the required data/functions will be ready to be used in init/render using (this.context).
		 */
		protected context: Mscrm.ControlData<IInputBag>;

		/**
		 * Callback to notify the framework about changing the value in the control.
		 */
		protected notifyOutputChanged: () => void;

		/**
		 * Actual value of the control
		 */
		private value: string;

		private scenarioMapState: IScenarioMapState;
		private initialMapState: IScenarioMapState;

		private entityBoundScenario: IEntityBoundScenario;

		private controlInitState: ControlInitState = ControlInitState.Loading;

		

		constructor() {
		}

		/**
		 * @returns The a bag of output values to pass to the infrastructure
		 */
		public getOutputs(): IOutputBag {
			return <IOutputBag>{
				value: Math.random().toString() //(this.value = JSON.stringify(this.currentState))
			};
		}

		/**
		 * This function will be called when the control is destroyed
		 * It should be used for cleanup and releasing any memory the control is using
		 */
		public destroy(): void {

		}

		/**
		 * Initializes the control. This function has access to the property bag context that will contain your custom control properties and utility functions.
		 * Predefinitions and initialisations can be done in this.
		 * 
		 * @param context Dictionary containing custom control's context.
		 * @param notifyOutputChanged Function to call when control changed its value, to propagate changes to redux state.
		 * @param state The control's internal state. Has nothing to do with redux state tree.
		 * @param container Wrapping div element.
		 */
		public init(context: Mscrm.ControlData<IInputBag>, notifyOutputChanged?: () => void, state?: Mscrm.Dictionary, container?: HTMLDivElement): void {
			this.context = context;
			this.notifyOutputChanged = notifyOutputChanged;

			this.value = context.parameters.value.raw;

			if (context.parameters.BoundEntityName.raw == "workstream") {
				this.entityBoundScenario = new WorkstreamBoundScenario();
			}
			else {

				this.entityBoundScenario = new ChannelBoundScenario();
			}

			Xrm.Page.data.entity.addOnSave((saveEvent: any) => { this.onSaveHandler(saveEvent);})

			var templateType: TemplateType = context.parameters.TemplateType.raw == "session" ? TemplateType.Session : TemplateType.Notification;

			this.entityBoundScenario.LoadInitialState(this.context, this.context.page.entityId, templateType).then(
				(resp) => {
					this.scenarioMapState = resp;
					this.initialMapState = JSON.parse(JSON.stringify(this.scenarioMapState)); // Create a copy of the original state, so that during save we can call only for changed scenarios

					this.controlInitState = ControlInitState.Ready;
					this.context.utils.requestRender();
				},
				(err) => {
					this.controlInitState = ControlInitState.Error;
					this.context.utils.requestRender();
				}
			);
			
		}

		/**
		 * Renders the control with data from the a context properties currently assigned to the control's manifest parameters
		 */
		public updateView(context: Mscrm.ControlData<IInputBag>): Mscrm.Component {
			// Update context with possible changes since initialization.
			this.context = context;

			switch (this.controlInitState) {
				case ControlInitState.Loading:
					return this.getLoadingComponent();
				case ControlInitState.Ready:
					return this.getControlComponent();
				case ControlInitState.Error:
					return this.getErrorComponent();
			}

			// Return the component for the current state for rendering.
			return this.getControlComponent();
		}

		
		
		/**
		 * Creates hierarchy for the component in current mode.
		 *
		 * @return Complete component which can be rendered on the form.
		 * @private
		 */
		protected getControlComponent(): Mscrm.Component {

			var scenarioRecordsControls = [];

			if (this.scenarioMapState) {


				for (var i = 0; i < this.scenarioMapState.Scenarios.length; i++) {
					scenarioRecordsControls.push(this.createScenarioField(this.scenarioMapState.Scenarios[i], i == (this.scenarioMapState.Scenarios.length - 1)));
				}

				return this.context.factory.createElement("CONTAINER", {
					key: this.scenarioMapState.TemplateEntityName + "ScenarioContainer",
					id: this.scenarioMapState.TemplateEntityName + "ScenarioContainer",
					style: {
						display: "flex",
						flexFlow: "column",
						width: "100%"
					}
				}, scenarioRecordsControls);
			}
			return null;
			
		}

		protected getLoadingComponent(): Mscrm.Component {
			let progressIndicator = this.context.factory.createElement(
				'PROGRESSINDICATOR', {
					id: this.context.parameters.TemplateType.raw + "containerProgressIndicator",
					key: this.context.parameters.TemplateType.raw + "containerProgressIndicator",
					progressType: "ring",
					active: true,
					style: {
						width: "32px",
						height: "32px",
						display: "table",
						margin: "0 auto",
					}
				}
			);
			return this.context.factory.createElement("CONTAINER",
				{
					key: this.context.parameters.TemplateType.raw + "controlLoadingContainer",
					id: this.context.parameters.TemplateType.raw + "controlLoadingContainer",
					style: {
						"padding-top": "30px",
						"position": "absolute",
						//height: "100px"
					}
				},
				[progressIndicator]
			);

		}

		protected getErrorComponent(): Mscrm.Component {
			var label = this.context.factory.createElement("LABEL", {
				key: this.context.parameters.TemplateType.raw + "_Error",
				id: this.context.parameters.TemplateType.raw + "_Error",
				accessibilityLabel: this.context.resources.getString("Error_Message"),
				title: this.context.resources.getString("Error_Message"),

				style: {
					fontFamily: this.context.theming.fontfamilies.regular,
					fontSize: this.context.theming.fontsizes.font100,
					fontWeight: 400,
					fontColor: this.context.theming.colors.grays.gray06,
					height: "21px",
				}
			}, "Something went wrong. Pelase reload the page.");//this.context.resources.getString("Error_Message"));

			var labelContainer = this.context.factory.createElement("CONTAINER", {
				key: this.context.parameters.TemplateType.raw + "_ErrorContainer",
				id: this.context.parameters.TemplateType.raw + "_ErrorContainer",
				style: {
					display: "flex",
					flexFlow: "row nowrap",
					justifyContent: "flex-start",
					alignItems: "center",
					width: "100%",
					height: "100%",
					padding: "10.5px 0px"
				}
			}, [label]);

			return labelContainer;
		}

		protected createScenarioField(scenarioRecord: IScenarioRecord, isLastScenario: boolean) {
			
			var label = this.createLabel(scenarioRecord);
			var lookup = this.createLookupControl(scenarioRecord);

			var fieldComponents: Mscrm.Component[] = [label, lookup];

			return this.context.factory.createElement("CONTAINER", {
				key: scenarioRecord.Name + "LookupFieldContainer",
				id: scenarioRecord.Name + "LookupFieldContainer",
				style: {
					display: "flex",
					borderBottom: isLastScenario ? "0px" : "1px solid rgb(216, 216, 216)",
					minHeight: "45.5px",
				}
			}, fieldComponents);
		}

		protected createLabel(scenarioRecord: IScenarioRecord): Mscrm.Component {
			var label = this.context.factory.createElement("LABEL", {
				key: scenarioRecord.Name + "_Label",
				id: scenarioRecord.Name + "_Label",
				accessibilityLabel: scenarioRecord.DisplayName,
				title: scenarioRecord.DisplayName,
				//forElementId: 'TextInput_' + buttonType + '-text-box-text',

				style: {
					fontFamily: this.context.theming.fontfamilies.regular,
					fontSize: this.context.theming.fontsizes.font100,
					fontWeight: 400,
					fontColor: this.context.theming.colors.grays.gray06,
					height: "21px",
				}
			}, scenarioRecord.DisplayName);

			var labelContainer = this.context.factory.createElement("CONTAINER", {
				key: scenarioRecord.Name + "_LabelContainer",
				id: scenarioRecord.Name + "_LabelContainer",
				style: {
					display: "flex",
					flexFlow: "row nowrap",
					justifyContent: "flex-start",
					alignItems: "center",
					width: "190.5px",
					height: "100%",
					padding: "10.5px 0px"
				}
			}, [label]);

			return labelContainer;
		}

		protected getLookupValue(scenarioRecord: IScenarioRecord): any {
			if (scenarioRecord.BoundTemplate != null) {
				let lookupValue: any = {
					id: scenarioRecord.BoundTemplate.TemplateId,
					Name: scenarioRecord.BoundTemplate.DisplayName,
					LogicalName: this.scenarioMapState.TemplateEntityName
				};
				return lookupValue;
			}
			return null;
		}


		protected createLookupControl(scenarioRecord: IScenarioRecord): Mscrm.Component {
			let viewId: string = this.scenarioMapState.ViewId;
			let entityName: string = this.scenarioMapState.TemplateEntityName;

			let lookupValue: any = this.getLookupValue(scenarioRecord);

			var attributes = {
				DisplayName: scenarioRecord.DisplayName,
				IsSecured: false,
				Format: "none",
				LogicalName: scenarioRecord.Name + 'LookupControl',
				ImeMode: -1,
				RequiredLevel: 0,
				Type: "lookup",
				Targets: [entityName]
			};

			var simpleLookupProps: any = {
				id: scenarioRecord.Name + "LookupControl_Id",
				key: scenarioRecord.Name + "LookupControl_Id",
				parameters: {
					value: {
						Attributes: attributes,
						Callback: (value: any) => this.lookupControlCallBack(value, scenarioRecord),
						Usage: 3,
						Static: false,
						Type: "Lookup.Simple",
						Value: lookupValue,
						Primary: true,
						EntityName: entityName,
						Name: "value",
						ViewId: viewId,
						AllowFilterOff: false,
						DisableQuickFind: false,
						TargetEntityType: entityName,
						DisableMru: false
					},
					valueDataSet: {
						EntityName: entityName,
						ViewId: viewId,
						TargetEntityType: entityName,
						Name: "valueDataSet"
					}
				},
				controlstates: {
					isControlDisabled: false
				}
			};

			var lookupControl = this.context.factory.createComponent("MscrmControls.FieldControls.SimpleLookupControl", scenarioRecord.Name + "LookupControl_Id", simpleLookupProps);

			var lookupContainer = this.context.factory.createElement("CONTAINER", {
				key: scenarioRecord.Name + "_LookupContainer",
				id: scenarioRecord.Name + "_LookupContainer",
				style: {
					//display: "flex",
					//flexFlow: "row nowrap",
					//justifyContent: "flex-start",
					//alignItems: "center",
					width: "calc(100% - 190.5px)",
					height: "100%",
					//padding: "10.5px 0px"
				}
			}, [lookupControl]);

			return lookupContainer;
		}

		protected lookupControlCallBack(returnLookupValues: any, changedScenarioRecord: IScenarioRecord): void {

			this.scenarioMapState.IsDirty = true;

			for (var scenarioRecord of this.scenarioMapState.Scenarios) {
				if (scenarioRecord.ScenarioId == changedScenarioRecord.ScenarioId) {
					if (returnLookupValues.length == 0) { // Template was removed from scenario
						scenarioRecord.BoundTemplate = null;
					}
					else { // Template was added to the scenario
						scenarioRecord.BoundTemplate = {
							DisplayName: returnLookupValues[0].Name || "",
							LogicalName: returnLookupValues[0].LogicalName || "",
							TemplateId: returnLookupValues[0].id || ""
						}
					}
				}
			}

			this.notifyOutputChanged();

			this.context.utils.requestRender();
		}


		private onSaveHandler(event: any) {

			if (this.scenarioMapState && this.scenarioMapState.IsDirty && this.entityBoundScenario) {
				var webAPIRequests = this.entityBoundScenario.PersistState(this.initialMapState, this.scenarioMapState);

				this.context.webAPI.executeMultiple(webAPIRequests).then(
					(resp: any) => {
						//Once it is saved, we update the initial map state
						this.scenarioMapState.IsDirty = false;
						this.initialMapState = JSON.parse(JSON.stringify(this.scenarioMapState));
					},
					(resp: any) => {
						console.error("[ScenarioMappingControl]Error in persisting scenarios and templates", resp)
						this.controlInitState = ControlInitState.Error;
						this.context.utils.requestRender();
					}
				);
			}
		}
		
	}
}