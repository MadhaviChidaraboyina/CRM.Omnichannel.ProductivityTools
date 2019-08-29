namespace Microsoft.Macros.Utility {
	var webresourceName = "Localization/Macros_webresource_strings.1033.resx";

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
}