/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>
/// <reference path="../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../../../../references/external/TypeDefinitions/jquery.d.ts" />

module MscrmControls.Service.CIProvider {
	'use strict';
	declare var Xrm: any

	export class NotificationButtonConfigControl implements Mscrm.StandardControl<IInputBag, IOutputBag>
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

		private currentState: NotificationButtonConfigState;

		constructor() {
		}

		/**
		 * @returns The a bag of output values to pass to the infrastructure
		 */
		public getOutputs(): IOutputBag {
			return <IOutputBag>{
				value: (this.value = JSON.stringify(this.currentState))
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

			this.currentState = NotificationButtonConfigState.FromJSONString(context, this.value);
		}

		/**
		 * Renders the control with data from the a context properties currently assigned to the control's manifest parameters
		 */
		public updateView(context: Mscrm.ControlData<IInputBag>): Mscrm.Component {
			// Update context with possible changes since initialization.
			this.context = context;

			this.removeAriaLabelFromTextbox("Accept_Button");
			this.removeAriaLabelFromTextbox("Reject_Button");

			// Return the component for the current state for rendering.
			return this.getControlComponent();
		}

		public removeAriaLabelFromTextbox(buttonType: NotificationButtonType) {
		setTimeout(function () {
			var textElement = document.getElementById("TextInput_" + buttonType + "-text-box-text");
			if (textElement != null) {
				textElement.removeAttribute("aria-label");
			}
		}, 1000);
		}

		private _changeTextHandler(change: string, buttonType: NotificationButtonType): void {
			if (change !== null) {
				(this.currentState as any)[buttonType + "_String"] = change;
				this.notifyOutputChanged();
			}
		}

		private _changeFlipHandler(value: boolean, buttonType: NotificationButtonType): void {
			(this.currentState as any)[buttonType + "_Enabled"] = value;
			/**
			if (value == false) {
				(this._currentState as any)[buttonType + "String"] = "";
			}
			**/
			this.notifyOutputChanged();
		}
		
		/**
		 * Creates hierarchy for the component in current mode.
		 *
		 * @return Complete component which can be rendered on the form.
		 * @private
		 */
		protected getControlComponent(): Mscrm.Component {

			var acceptButtonConfig = this.createNotificationButtonConfigComponent("Accept_Button");
			var rejectButtonConfig = this.createNotificationButtonConfigComponent("Reject_Button");

			return this.context.factory.createElement("CONTAINER",
				{
					id: "ButtonConfigControlMainContainer",
					key: "ButtonConfigControlMainContainer",
					style: {
						position: "relative",
						display: "flex",
						flexFlow: "column nowrap",
						//alignItems: "center",
						width: "100%"
					},
				},
				[acceptButtonConfig, rejectButtonConfig]);
		}

		protected createFlipSwitch(): Mscrm.Component {
			var props: any = {
				parameters: {
					"value": {
						Usage: 3 /*PropertyUsage.FalseBound*/,
						Static: true,
						Callback: (value: boolean) => { this._changeFlipHandler(value, "Reject_Button")},
						Primary: true,
						Attributes: {
							Type: "boolean",
							DefaultValue: false,
							DisplayName: this.context.resources.getString("Reject_Button_Enabled_Switch"),
							Options: [
								{
									"Label": this.context.resources.getString("FlipSwitch_No_Label"),
									"Value": 0,
								},
								{
									"Label": this.context.resources.getString("FlipSwitch_Yes_Label"),
									"Value": 1,
								}
							]
						},
						Value: this.currentState.Reject_Button_Enabled,
						Type: "boolean"
					}
				}
				
			};

			var flipSwitch = this.context.factory.createComponent("MscrmControls.FlipSwitch.FlipSwitchControl", "FlipSwitch_RejectButton", props);

			var flipSwitchContainer = this.context.factory.createElement("CONTAINER", {
				key: "Reject_Button_FlipSwitchContainer",
				id: "Reject_Button_FlipSwitchContainer",
				style: {
					paddingTop: "10.5px"
				}
			}, [flipSwitch]);

			return flipSwitchContainer;
		}

		protected createLabel(buttonType: NotificationButtonType): Mscrm.Component {
			var label = this.context.factory.createElement("LABEL", {
				key: buttonType + "_Label",
				id: buttonType + "_Label",
				accessibilityLabel: this.context.resources.getString(buttonType + "_Label"),
				title: this.context.resources.getString(buttonType + "_Label"),
				forElementId: 'TextInput_' + buttonType + '-text-box-text',

				style: {
					fontFamily: this.context.theming.fontfamilies.regular,
					fontSize: this.context.theming.fontsizes.font100,
					fontWeight: 400,
					fontColor: this.context.theming.colors.grays.gray06,
					height: "21px",
				}
			}, this.context.resources.getString(buttonType + "_Label"));

			var labelContainer = this.context.factory.createElement("CONTAINER", {
				key: buttonType + "_LabelContainer",
				id: buttonType + "_LabelContainer",
				style: {
					display: "flex",
					flexFlow: "row nowrap",
					justifyContent: "flex-start",
					alignItems: "center",
					width: "160.5px",
					height: "100%",
					padding: "10.5px 0px"
				}
			}, [label]);

			return labelContainer;
		}

		protected createTextBox(buttonType: NotificationButtonType): Mscrm.Component {
			var descriptor: Mscrm.ICustomControlDescriptor = {
				Id: "TextInput_" + buttonType,
				Label: this.context.resources.getString(buttonType + "_Label"),
				ShowLabel: true,
				Name: "TextInput_" + buttonType,
				Visible: true
			};

			let properties: any = {
				"controlstates": {
					"isControlDisabled": this.context.mode.isControlDisabled,
					"label": this.context.resources.getString(buttonType + "_Label"),
					showLabel: true,
				},
				"descriptor": descriptor,
				"parameters":
				{
					"value":
					{
						Usage: 3 /*PropertyUsage.FalseBound*/,
						Static: true,
						Value: (this.currentState as any)[buttonType + "_String"],
						Type: "SingleLine.Text",
						Callback: (change: any) => this._changeTextHandler(change, buttonType),
						Attributes: {
							Format: "text",
							Type: "text"
						}
					},
					
				}
			};

			return this.context.factory.createComponent("MscrmControls.FieldControls.TextBoxControl", "TextInput_" + buttonType, properties);
		}


		protected createNotificationButtonConfigComponent(buttonType: NotificationButtonType): Mscrm.Component {

			var configContainerComponents = [];

			if (buttonType == "Reject_Button") {
				var flipSwitch = this.createFlipSwitch();
				configContainerComponents.push(flipSwitch);
			}

			//We render the text box control only if it is Accept button or if it is Reject button and the flip switch is on
			if (buttonType == "Accept_Button" || (buttonType == "Reject_Button" && this.currentState.Reject_Button_Enabled)) {
				var textBox = this.createTextBox(buttonType);
				configContainerComponents.push(textBox);
			}

			var configContainer = this.context.factory.createElement("CONTAINER", {
				key: buttonType + "_configContainer",
				id: buttonType + "_configContainer",
				style: {
					display: "flex",
					flexFlow: "column nowrap",
					justifyContent: "flex-start",
					width: "calc(100% - 160.5px)"
				},
			}, configContainerComponents);

			var label = this.createLabel(buttonType);

			var buttonConfigContainerComponents = [label, configContainer];
			

			var notificationButtonConfigContainer = this.context.factory.createElement("CONTAINER", {
				key: buttonType + "_buttonConfigContainer",
				id: buttonType + "_buttonConfigContainer",
				style: {
					display: "flex",
					borderBottom: buttonType == "Accept_Button" ? "1px solid rgb(216, 216, 216)" : "0px",
					minHeight: "45.5px",
				}
			}, buttonConfigContainerComponents);

			return notificationButtonConfigContainer;
			
		}
	}

	type NotificationButtonType = 'Accept_Button' | 'Reject_Button';


	class NotificationButtonConfigState {
		public Accept_Button_String: string;
		public Reject_Button_Enabled: boolean;
		public Reject_Button_String: string;


		static FromJSONString(context: Mscrm.ControlData<IInputBag>, jsonString: string): NotificationButtonConfigState {
			if (!jsonString) {
				return NotificationButtonConfigState.getInitialDefaultState(context);
			}
			var parsedJson: any, parsedObject: NotificationButtonConfigState;
			try {
				parsedJson = JSON.parse(jsonString);
				parsedObject = {
					Accept_Button_String: parsedJson.Accept_Button_String,
					Reject_Button_Enabled: parsedJson.Reject_Button_Enabled,
					Reject_Button_String: parsedJson.Reject_Button_String
				};
			}
			catch (ex) {
				console.log("Error parsing the notification button config. JSON string : " + jsonString); 
				return NotificationButtonConfigState.getInitialDefaultState(context);
			}
			return parsedObject;
		}

		static getInitialDefaultState(context: Mscrm.ControlData<IInputBag>) {
			return {
				Accept_Button_String: context ? context.resources.getString("Accept_Button_Default_Text") : "",
				Reject_Button_Enabled: true,
				Reject_Button_String: context ? context.resources.getString("Reject_Button_Default_Text") : ""
			}
		}
	}
}