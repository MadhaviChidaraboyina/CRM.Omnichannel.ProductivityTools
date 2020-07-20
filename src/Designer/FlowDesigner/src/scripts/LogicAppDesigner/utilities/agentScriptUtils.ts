import { isNullOrUndefined } from "util";

export class AgentScriptUtils {
    public static getResourceString(key: string) {
        var webresourceName = "Localization/msdyn_AgentscriptComponent";
        var value = key;
        if ((window.top as any).Xrm && (window.top as any).Xrm.Utility && (window.top as any).Xrm.Utility.getResourceString) {
            value = (window.top as any).Xrm.Utility.getResourceString(webresourceName, key);

            if (value === undefined || value === null) {
                value = key;
            }
        }
        return value;
    }
}