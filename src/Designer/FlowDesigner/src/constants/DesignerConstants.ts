export class Constants {
    public static LogicAppDesignerRelativeUrl = "/flowcontrol/DesignerBlob/iframeLogicappDesigner.html";
    public static BrandColor = '#2266E3';
    public static GetRequestType = "GET";

    //fallback URL for blob endpoint
    public static publicFallbackURL = "https://oc-cdn-ocprod.azureedge.net/";
    public static fairfaxFallbackURL = "https://ocprodocprodnamgs.blob.core.usgovcloudapi.net/";
    public static gccDataCenter: string[] = ["crm9"];
}

export class GeoNames{
    public static TIP = "TIP";
    public static GCC = "GCC";
    public static USG = "USG";
    public static CHN = "CHN";
    public static DEFAULT = "";
}

export const CdnGeoSettings = {
    [GeoNames.TIP]: Constants.publicFallbackURL,
    [GeoNames.GCC]: Constants.publicFallbackURL,
    [GeoNames.USG]: Constants.fairfaxFallbackURL,
    [GeoNames.CHN]: Constants.publicFallbackURL,
    [GeoNames.DEFAULT]: Constants.publicFallbackURL,
}

let globalContext: XrmClientApi.GlobalContext = (window.top as any).Xrm.Utility.getGlobalContext();

export function getIconUrl(icon: string): string {
    let url = new URL(icon, globalContext.getClientUrl());
    return url.toString();
}
export const manifestConnectorIds = {
    callscript: 'custom/callscript'
};

export const manifestOperationIds = {
    setCallScript: 'setcallscript',
    start: 'start',
    listFlows: 'ListFlows'
};

export const icons = {
    connector :{
        agentconnector : getIconUrl("WebResources/AgentScriptDesigner/msdyn_agentConnector.svg"),
    },
    operations :{
        setcallscript : getIconUrl("WebResources/AgentScriptDesigner/msdyn_setDefaultAction.svg"),
        start: getIconUrl("WebResources/AgentScriptDesigner/msdyn_manualTrigger.svg"),
        listFlows: getIconUrl("WebResources/MacroDesigner/msdyn_ProductivityMacros_run_flow.svg")
    }

};