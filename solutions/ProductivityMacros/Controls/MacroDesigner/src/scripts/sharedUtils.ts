/// <reference path="../../../../Client/TelemetryHelper.ts" />

export class Utils {
    public static serialize(message, source, destination) {
        /*let ret = {
            signature: destination,
            data: message
        };
        ret.data.signature = source;*/
        let ret = message;
        //console.log("Sending msg from " + source + " for " + destination + " " + ret);
        return ret;
    }
    public static deserialize(message, source, destination) {
        //let ret = (message && message.signature && message.data /*&& message.data.signature */ && message.signature === destination /* && message.data.signature === source */ ? message : null);
        let ret = message;
        //console.log("Received msg from " + source + " for " + destination + " " + ret);
        return ret;
    }
    private static _urlParams = new URLSearchParams(window.location.search);
    public static genMsgForTelemetry(message?: string, error?: Error): string {
        let msg = message || "";
        let err = error && error.message || "";
        return err.concat(":", msg);
    }
    public static getUrlParam(paramName: string, defaultValue?: string): string {
        return Utils._urlParams.get(paramName) || defaultValue || "";
    }
    public static getResourceString(key: string) {
        var webresourceName = "Localization/ProductivityMacros_webresource_strings";
        var value = key;
        if ((window.top as any).Xrm && (window.top as any).Xrm.Utility && (window.top as any).Xrm.Utility.getResourceString) {
            value = (window.top as any).Xrm.Utility.getResourceString(webresourceName, key);

            if (value === undefined || value === null) {
                value = key;
            }
        }
        return value;
    }
    public static GenGuid(): string {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    public static logAdminTelemetry(msg: any) {
        (window.top as any).Microsoft.ProductivityMacros.Internal.setMacrosAdminData(msg);
    }
};