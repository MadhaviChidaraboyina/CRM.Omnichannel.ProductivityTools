/// <reference path="../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
/// <reference path="Constants.ts" />

namespace Microsoft.Macros.Utility {
	var webresourceName = "Localization/ProductivityMacros_webresource_strings";

	export function getResourceString(key: any) {
		var value = key;
		if (Xrm && Xrm.Utility && Xrm.Utility.getResourceString) {
			value = Xrm.Utility.getResourceString(webresourceName, key);

			if (value === undefined || value === null) {
				value = key;
			}
		}
		return value;
	}

	export function isMacrosView(viewId: any) {
		if (viewId === Microsoft.Macros.Guids.AllMacrosViewGuid || viewId === Microsoft.Macros.Guids.ActiveMacrosViewGuid || viewId === Microsoft.Macros.Guids.InactiveMacrosViewGuid) {
			return true;
		}
		return false;
	}

	// Handler Function for Click on a Record in the Grid View
	export function openRecordHandler(selectedControlSelectedItemReferences: any, selectedControl: any) {
		// Get the Current View ID
		let viewSelector = selectedControl.getViewSelector();
		let viewId = viewSelector.getCurrentView().id.toLowerCase();

		// Get the Currently Selected Record ID
		let selectedRecordGuid = selectedControlSelectedItemReferences[0].Id;

		if (isMacrosView(viewId)) {
			let vpHeight = (window.top as any).Xrm.Page.ui.getViewPortHeight();
			let vpWidth = (window.top as any).Xrm.Page.ui.getViewPortWidth();
			const dialogOptions: XrmClientApi.DialogOptions = {
				width: vpWidth, height: vpHeight, position: XrmClientApi.Constants.WindowPosition.inline
			};

			const dialogParams: XrmClientApi.DialogParameters = {};
			dialogParams[Microsoft.Macros.Constants.RecordIdParam] = selectedRecordGuid;
			Xrm.Navigation.openDialog(Microsoft.Macros.Constants.CreateMacrosDialog, dialogOptions, dialogParams);
		}
		else {
			let entityFormOptions = {
				entityName: "workflow",
				entityId: selectedRecordGuid
			};

			Xrm.Navigation.openForm(entityFormOptions);
		}

	}

	export function openMacrosMonitorRecordHandler(selectedControlSelectedItemReferences: any, selectedControl: any) {

		let selectedRecordGuid = selectedControlSelectedItemReferences[0].Id;
		let vpHeight = (window.top as any).Xrm.Page.ui.getViewPortHeight();
		let vpWidth = (window.top as any).Xrm.Page.ui.getViewPortWidth();
		const dialogOptions: XrmClientApi.DialogOptions = {
			width: vpWidth, height: vpHeight, position: XrmClientApi.Constants.WindowPosition.inline
		};

		const dialogParams: XrmClientApi.DialogParameters = {};
		dialogParams[Microsoft.Macros.Constants.RecordIdParam] = selectedRecordGuid;

		Xrm.Navigation.openDialog(Microsoft.Macros.Constants.MacrosMonitorDialog, dialogOptions, dialogParams);
	}

	// Enable Function for Click on a Record in the Grid View
	export function macrosEnableRule(selectedControlSelectedItemReferences: any, selectedControl: any): boolean {
		// Get the Current View ID
		let viewSelector = selectedControl.getViewSelector();
		let viewId = viewSelector.getCurrentView().id.toLowerCase();

		if (isMacrosView(viewId)) {
			return true;
		}
		else {
			return false;
		}
	}

	export function newRecordHandler(selectedControl: any) {
		let viewSelector = selectedControl.getViewSelector();
		let viewId = viewSelector.getCurrentView().id.toLowerCase();

		if (isMacrosView(viewId)) {
			let vpHeight = (window.top as any).Xrm.Page.ui.getViewPortHeight();
			let vpWidth = (window.top as any).Xrm.Page.ui.getViewPortWidth();

			const dialogOptions: XrmClientApi.DialogOptions = {
				width: vpWidth, height: vpHeight, position: XrmClientApi.Constants.WindowPosition.inline
			};
			Xrm.Navigation.openDialog(Microsoft.Macros.Constants.CreateMacrosDialog, dialogOptions, null);
		}
		else {
			let entityFormOptions = {
				entityName: "workflow"
			};

			Xrm.Navigation.openForm(entityFormOptions);
		}
	}

	// Handler Function for the MDD OnLoad to pass the RecordID from MDD to the IFrame Control
	export function dialogOnLoadHandler(eventContext: any) {
		let formContext = eventContext.getFormContext();
		let designerControl = formContext.getControl(Microsoft.Macros.Constants.DesignerID);
		let appUrl = new URL(Xrm.Utility.getGlobalContext().getCurrentAppUrl());
		let iframeUrl = appUrl.origin + "/WebResources/MacroDesigner/msdyn_ProductivityMacros_macroDesigner.html";
		let input = formContext.data.attributes.getByName(Microsoft.Macros.Constants.RecordIdParam).getValue();
		if (input == null) {
			designerControl.setSrc(iframeUrl);
		}
		else {
			designerControl.setSrc(iframeUrl+ "?id=" + input);
		}
	}

		// Handler Function for the MDD OnLoad to pass the RecordID from MDD to the IFrame Control
		export function agentScriptDialogOnLoadHandler(eventContext: any) {
			let formContext = eventContext.getFormContext();
			let designerControl = formContext.getControl(Microsoft.Macros.Constants.DesignerID);
			let appUrl = new URL(Xrm.Utility.getGlobalContext().getCurrentAppUrl());
			let iframeUrl = appUrl.origin + "/WebResources/MacroDesigner/msdyn_ProductivityMacros_agentScriptDesigner.html";
			let input = formContext.data.attributes.getByName(Microsoft.Macros.Constants.RecordIdParam).getValue();
			if (input == null) {
				designerControl.setSrc(iframeUrl);
			}
			else {
				designerControl.setSrc(iframeUrl+ "?id=" + input);
			}
		}

	export function monitorDialogOnLoadHandler(eventContext: any) {
		let formContext = eventContext.getFormContext();
		let monitorControl = formContext.getControl(Microsoft.Macros.Constants.MonitorID);
		let appUrl = new URL(Xrm.Utility.getGlobalContext().getCurrentAppUrl());
		let iframeUrl = appUrl.origin + "/WebResources/MacroDesigner/msdyn_ProductivityMacros_macroMonitor.html";        //Check Name
		let input = formContext.data.attributes.getByName(Microsoft.Macros.Constants.RecordIdParam).getValue();
		if (input == null) {
			monitorControl.setSrc(iframeUrl);
		}
		else {
			monitorControl.setSrc(iframeUrl + "?id=" + input);
		}
		formContext.getControl("macrosname_id").setFocus();
	}
}