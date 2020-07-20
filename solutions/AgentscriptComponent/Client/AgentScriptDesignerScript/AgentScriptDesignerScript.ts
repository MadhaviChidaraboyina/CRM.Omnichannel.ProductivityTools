/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />


namespace Microsoft.AgentScript.Utility {

    // Handler Function for the MDD OnLoad to pass the RecordID from MDD to the IFrame Control
    export function agentScriptDialogOnLoadHandler(eventContext: any) {
        let formContext = eventContext.getFormContext();
        let designerControl = formContext.getControl(Microsoft.AgentScript.Constants.DesignerID);
        let appUrl = new URL(Xrm.Utility.getGlobalContext().getCurrentAppUrl());
        let iframeUrl = appUrl.origin + "/WebResources/AgentScriptDesigner/msdyn_agentScriptDesigner.html";
        let input = formContext.data.attributes.getByName(Microsoft.AgentScript.Constants.RecordIdParam).getValue();
        if (input == null) {
            designerControl.setSrc(iframeUrl);
        }
        else {
            designerControl.setSrc(iframeUrl + "?id=" + input);
        }
    }
}
