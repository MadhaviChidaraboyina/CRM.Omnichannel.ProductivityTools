/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>
/// <reference path="../../../TypeDefinitions/mscrm.d.ts" />
/// <reference path="../../../../references/external/TypeDefinitions/jquery.d.ts" />


module MscrmControls.Service.CIProvider {
	'use strict';


	declare let Xrm: any;

	export function compare(a: any, b: any): any {
		const labelA = a.Label.toUpperCase();
		const labelB = b.Label.toUpperCase();

		let comparison = 0;
		if (labelA > labelB) {
			comparison = 1;
		} else if (labelA < labelB) {
			comparison = -1;
		}
		return comparison;
	}

	/**
	 * Uber control for all App Config.
	 */
	export class CustomMultiSelectControl implements Mscrm.StandardControl<IConfigControlInputBag, IConfigControlOutputBag> {

		private context: Mscrm.ControlData<IConfigControlInputBag>;
		private notifyOutputChanged: () => void;
		private currentControl: Mscrm.Component;
		private elementList: ElementInformation[];
		private currentSelectedElements: string[];
		private currentselectedElementsString: string;
		private fieldName: string;
		private sysAdminCustomizerRoles: RoleInformation[];

		// List of Apps not to be shown in the App Picker for CIF Config
		private invalidAppsForCif: string[] = ["msdyn_ChannelIntegrationFrameworkApp", "msdyusd_USDAdminSettings", "msdyn_OCAPP"];

		/**
		 * Empty constructor.
		 */
		constructor() {
		}

		/**
		 * This function should be used for any initial setup necessary for your control.
		 * @params context The "Input Bag" containing the parameters and other control metadata.
		 * @params notifyOutputchanged The method for this control to notify the framework that it has new outputs
		 * @params state The user state for this control set from setState in the last session
		 * @params container The div element to draw this control in
		 */
		public init(context: Mscrm.ControlData<IConfigControlInputBag>, notifyOutputChanged: () => void, state: Mscrm.Dictionary): void {
			// custom code goes here
			this.context = context;
			this.notifyOutputChanged = notifyOutputChanged;
			this.elementList = [];
			this.currentSelectedElements = [];
			this.fieldName = this.context.parameters.elementUniqueNames.attributes.LogicalName;
			this.currentselectedElementsString = this.isNullOrUndefined(this.context.parameters.elementUniqueNames) ? "" : this.context.parameters.elementUniqueNames.raw;

			if (!this.isNullOrUndefined(this.currentselectedElementsString) && this.currentselectedElementsString != "") {
				this.currentSelectedElements = this.currentselectedElementsString.split(elementSeparator, 200);
			}
			this.getOptionsList();
		}


		/**
		 * This method checks if object is null or undefined.
		 * @param object object to be checked
		 */
		private isNullOrUndefined(object: any) {
			return this.context.utils.isNullOrUndefined(object);
		}

		public getOptionsList(): void {
			if (this.fieldName == CustomMultiSelectorConfig.AppSelectorFieldName) {
				this.getAppList();
			}
			else if (this.fieldName == CustomMultiSelectorConfig.RoleSelectorFieldName) {
				this.getRoleList();
			}
		}

		public getAppList(): void {

			var queryParam = "(clienttype eq 4)";
			var query = "?$select=name,appmoduleid,uniquename,eventhandlers&$filter=" + queryParam;
			this.context.webAPI.retrieveMultipleRecords("appmodule", query).then(
				(data: any) => {
						//To-Do - Add Telemetry
					for (let app of data.entities) {
						console.log(app);
						if (this.invalidAppsForCif.indexOf(app.uniquename) == -1) {
							this.elementList.push({ ElementId: app.appmoduleid, ElementUniqueName: app.uniquename, ElementName: app.name, EventHandlers: JSON.parse(app.eventhandlers) });
						}
					}
					this.context.utils.requestRender();
				},
				(error) => {

				}
			);
		}

		private getRoleList(): void {


			var query = "?$select=name,roleid,_roletemplateid_value";
			this.context.webAPI.retrieveMultipleRecords("role", query).then(
				(data: any) => {
					this.sysAdminCustomizerRoles = [];
					for (let role of data.entities) {
						console.log(role);
						if (role._roletemplateid_value === CustomMultiSelectorConfig.SysAdminRoleTemplateGuid || role._roletemplateid_value === CustomMultiSelectorConfig.SysCustomizerTemplateGuid) {
							var roleItem = <RoleInformation>{};
							roleItem.RoleId = role.roleid;
							roleItem.RoleName = role.name;
							roleItem.RoleTemplateId = role._roletemplateid_value;
							this.sysAdminCustomizerRoles.push(roleItem);
						}
						else {
							this.elementList.push({ ElementId: role.roleid, ElementUniqueName: role.name, ElementName: role.name });
						}
						
					}
					this.notifyOutputChanged();
					this.context.utils.requestRender();
				},
				(error) => {
						//To-Do - Add Telemetry
				}
			);
		}

		/** 
		 * This function will recieve an "Input Bag" containing the values currently assigned to the parameters in your manifest
		 * It will send down the latest values (static or dynamic) that are assigned as defined by the manifest & customization experience
		 * as well as resource, client, and theming info (see mscrm.d.ts)
		 * @params context The "Input Bag" as described above
		 */
		public updateView(context: Mscrm.ControlData<IConfigControlInputBag>): Mscrm.Component {
			//return null;

			if (this.elementList.length == 0) {
				return null;
			}
			const MultipleAppSelector = this.createMultipleAppSelector();



			const MultiAppSelectorContainer = this.context.factory.createElement(
				"CONTAINER",
				{
					id: "MultiAppSelectorContainer" + this.fieldName,
					key: "MultiAppSelectorContainer" + this.fieldName,
					style:
					{
						height: 250,
						width: "100%"
					}
				},
				[MultipleAppSelector]
			)
			return MultiAppSelectorContainer;
		}

		private getMultiAppSelectorWidth(fieldName: string): number {
			let sectionElement = $("section[data-id='{2190ec7e-bb48-4408-aa64-6008072a8a39}_section_3']")[0];
			return sectionElement.getClientRects()[0].width;
		}

		private createMultipleAppSelector(): Mscrm.Component {

			var formattedList: FormattedElementInformation[] = [];

			for (let i = 0; i < this.elementList.length; i++) {
				var formattedAppElement: FormattedElementInformation = { Label: this.elementList[i].ElementName, Value: this.elementList[i].ElementId, ElementId: this.elementList[i].ElementId }; // Value is set as app uniquename
				formattedList.push(formattedAppElement);
			}

			formattedList = formattedList.sort(compare);
			var preSelected: any[] = []; 

			if (this.fieldName == CustomMultiSelectorConfig.RoleSelectorFieldName) {
				this.filterAdminAndCustomizerRoles();
			}
			for (let i = 0; i < this.currentSelectedElements.length; i++) {
				preSelected.push(this.currentSelectedElements[i]);
			}


			let autoCompleteProps: any =
				{
					Usage: 3,
					Static: false,
					Type: "OptionSet",
					Value: preSelected,
					Attributes: {
						DefaultValue: preSelected[0],
						Options: formattedList,
						OptionSet: formattedList,
						IsHeightReduced: true
					},
					Callback: (selectedElements: any) => { this.setSelectedElements(selectedElements); }
				};

			return this.context.factory.createComponent(
				"MscrmControls.MultiSelectPicklist.MultiSelectPicklistControl",
				"MultipleAppSelector_AppModule" + this.fieldName,
				{
                    parameters: { value: autoCompleteProps }
                });
		}


		private filterAdminAndCustomizerRoles(): void {
			this.currentSelectedElements = this.currentSelectedElements.filter(role => (role !== this.sysAdminCustomizerRoles[0].RoleId || role !== this.sysAdminCustomizerRoles[1].RoleId))
		}

		private setSelectedElements(selectedElements: any): void {
			this.currentSelectedElements = [];
			for (let i = 0; i < selectedElements.length; i++)
			{
				this.currentSelectedElements.push(selectedElements[i]);
				
			}
			this.notifyOutputChanged();
		}


		public static UpdateAppModuleBase(ExecutionObj: any, allApps: any): void {
			var appHelper = AppMultiSelectHelper.Instance;
			appHelper.UpdateAppModule(ExecutionObj, allApps);
		}

		/** 
		 * This function will return an "Output Bag" to the Crm Infrastructure
		 * The ouputs will contain a value for each property marked as "input-output"/"bound" in your manifest 
		 * i.e. if your manifest has a property "value" that is an "input-output", and you want to set that to the local variable "myvalue" you should return:
		 * {
		 *		value: myvalue
		 * };
		 * @returns The "Output Bag" containing values to pass to the infrastructure
		 */
		public getOutputs(): IConfigControlOutputBag {
			// custom code goes here - remove the line below and return the correct output
			return {
				elementUniqueNames: this.getCurrentSelectedElements()
			};
		}

		private getCurrentSelectedElements(): string {
			if (this.fieldName === CustomMultiSelectorConfig.RoleSelectorFieldName) {
				return (this.currentSelectedElements.join(elementSeparator).length > 0 ? (this.currentSelectedElements.join(elementSeparator) +
					elementSeparator + this.sysAdminCustomizerRoles[0].RoleId + elementSeparator + this.sysAdminCustomizerRoles[1].RoleId)
					: (this.sysAdminCustomizerRoles[0].RoleId + elementSeparator + this.sysAdminCustomizerRoles[1].RoleId));
			}
			return this.currentSelectedElements.join(elementSeparator);
		}

		/**
		 * This function will be called when the control is destroyed
		 * It should be used for cleanup and releasing any memory the control is using
		 */
		public destroy(): void {

		}
	}
}