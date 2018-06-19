/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>
/// <reference path="../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../../../../references/external/TypeDefinitions/jquery.d.ts" />

module MscrmControls.FieldControls {
	'use strict';
	declare var Xrm: any

	export class AgentClickToActControl implements Mscrm.StandardControl<IInputBag, IOutputBag>
	{
		/**
		 * Bound version for the change event handler.
		 * @param event Optional change event object wrapper.
		 */
		private _changeHandler: (event?: Event) => void;

		/**
		 * Bound version of the keydown event handler for input sub-element.
		 *
		 * @param event Optional keyboard event object wrapper.
		 */
		private _keyDownInputHandler: (event?: KeyboardEvent) => void;

		/**
		 * Bound version of the click event handler for icon sub-element.
		 *
		 * @param event Optional mouse event object wrapper.
		 */
		private _clickButtonHandler: (event?: MouseEvent) => void;

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
		private _value: string;

		/**
		 * String which is assigned as an input element id
		 */
		private static PHONE_INPUT_ID_SEED = "phone-text-input";

		/**
		 * String which is assigned as an icon id
		 */
		private static PHONE_ACTION_ICON_ID_SEED = "phone-action-icon";

		/**
		 * String which is assigned as a container id
		 */
		private static PHONE_CONTAINER_ID_SEED = "phone-container";

		/**
		 * String which is assigned as a aria-descriptor id
		 */
		private static PHONE_ARIA_DESCRIPTOR_ID_SEED = "phone-input-aria-descriptor";

		constructor() {
			this._changeHandler = this._onChange.bind(this);
			this._keyDownInputHandler = this.onInputKeyDown.bind(this);
			//Action Button related Event Handlers
			this._clickButtonHandler = this.onActionTrigger.bind(this);
		}

		/**
		 * @returns The a bag of output values to pass to the infrastructure
		 */
		public getOutputs(): IOutputBag {
			return <IOutputBag>{
				elementUniqueNames: this._value
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
		}

		/**
		 * Renders the control with data from the a context properties currently assigned to the control's manifest parameters
		 */
		public updateView(context: Mscrm.ControlData<IInputBag>): Mscrm.Component {
			// Update context with possible changes since initialization.
			this.context = context;
			// Return the component for the current state for rendering.
			return this.component();
		}

		/**
		 * Handles a change of a value
		 * @params event The change event
		 * @private
		 */
		private _onChange(event: Event): void {
			if (event && event.target) {
				this._value = (<HTMLInputElement>event.target).value;
				this.notifyOutputChanged();
			}
		}

		/**
		 * Handles the keydown event for the input element.
		 *
		 * @param event The keydown event wrapper object.
		 */
		protected onInputKeyDown(event: KeyboardEvent) {
			if (!event) {
				return;
			}

			switch (event.keyCode) {
				case Mscrm.KeyCode.Enter: /* ENTER */
					if (event.ctrlKey) {
						// CTRL + ENTER triggers the action
						this.action();
					}
					break;
				default:
					break;
			}
		}

		/**
		 * This is a handler for control's main action.
		 */
		protected onActionTrigger() {
			this.action();
		}

		/**
		 * Method implements a proper action for the control.
		 */
		protected action() {
			var mdetails : any = {};
			var value = this.context.parameters.elementUniqueNames;
			mdetails["field"] = {
				"value": value.raw,
				"name": value.attributes.LogicalName,
				"type": value.attributes.Format
			};
			mdetails["AssociatedEntityLogicalName"] = (value.attributes as any).EntityLogicalName;
			mdetails["ParentEntityReference"] = Xrm.Page.data.entity.getEntityReference();
			var dict : any = {};
			dict["detail"] = mdetails;
			var event_1 = new CustomEvent("CIClickToAct", dict);
			window.dispatchEvent(event_1);
			return true;
		}

		/**
		 * Control's specific description of the control's action for accessibility.
		 * @return {string} Action's description.
		 */
		protected ariaDescription(): string {
			return this.context.resources.getString("Agent_Action_Description");
		}

		/**
		 * Control's specific prompt to show in the textfield when there is no value given.
		 * @return {string} Placeholder string.
		 */
		protected placeholder(): string {
			return this.context.resources.getString("Control_Placeholder_Text");
		}

		/**
		 * Returns the Action Button Component
		 */
		protected actionButtonComponent(): Mscrm.Component {
			return this.context.factory.createElement("IMG", {
				key: "conditionalImage",
				source: "/webresources/msdyn_Callprovider.svg", // TODO : Retrieve provider icon
				altText: this.context.resources.getString("Provided_Contact_Value"),
				onClick: this._clickButtonHandler,
				style: {
					maxHeight: "2em",
					maxWidth: "2em",
					borderRadius: "50%",
					cursor: "pointer"
				}
			});
		}

		/**
		 * Function forms proper dictionary with properties of the live container
		 * @return Dictionary containing all necessary props for given mode.
		 */
		protected getLiveContainerProps(): Mscrm.Dictionary {
			return {
				style: { // Make visible for screen reader only
					position: "absolute",
					clip: "rect(1px, 1px, 1px, 1px)"
				},
				role: "alert",
				accessibilityLive: "assertive",
				key: "aria-live-container"
			};
		}

		/**
		 * Function forms proper dictionary with properties of the input
		 * based on the given mode.
		 *
		 * @return Dictionary containing all necessary props for given mode.
		 */
		protected propsForMode(): Mscrm.Dictionary {
			return {
				id: AgentClickToActControl.PHONE_INPUT_ID_SEED,
				key: AgentClickToActControl.PHONE_INPUT_ID_SEED,
				value: this.context.parameters.elementUniqueNames.raw,
				placeholder: this.placeholder(),
				readOnly: false,
				style: {
					height: "100%",
					width: "100%",
					"padding-left": "0.5rem",
					"padding-right": "0.5rem",
					"margin-top": "0.5rem"
				},
				selectValueOnFocus: true,
				onChange: this._changeHandler,
				onKeyDown: this._keyDownInputHandler,
			};
		}

		/**
		 * Creates hierarchy for the component in current mode.
		 *
		 * @return Complete component which can be rendered on the form.
		 * @private
		 */
		protected component(): Mscrm.Component {
			let actionBtn: Mscrm.Component = this.actionButtonComponent();
			// Create an element for accessibility, to describe the action of the control.
			const ariaDescriptor = this.context.factory.createElement("LABEL",
				{
					id: AgentClickToActControl.PHONE_ARIA_DESCRIPTOR_ID_SEED,
					key: AgentClickToActControl.PHONE_ARIA_DESCRIPTOR_ID_SEED,
					style: {
						display: "none"
					}
				},
				this.ariaDescription());

			const liveRegion = this.context.factory.createElement("CONTAINER", this.getLiveContainerProps(), "");

			const input = this.context.factory.createElement("TEXTINPUT", this.propsForMode());

			return this.context.factory.createElement("CONTAINER",
				{
					id: AgentClickToActControl.PHONE_CONTAINER_ID_SEED,
					key: AgentClickToActControl.PHONE_CONTAINER_ID_SEED,
					style: {
						position: "relative",
						display: "flex",
						alignItems: "center",
						width: "100%"
					},
				},
				[liveRegion, input, ariaDescriptor, actionBtn]);
		}
	}
}