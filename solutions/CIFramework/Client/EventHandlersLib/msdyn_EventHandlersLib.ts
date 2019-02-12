/// <reference path="../../../../references/internal/TypeDefinitions/XrmClientApi/XrmClassicWebClientApi.d.ts" />

module CIFramework {
	let urlRegExp = new RegExp('^((www\.)?[0-9a-zA-Z-_\.]+[a-zA-Z]{2,}$)')
	
	export function wildcardCheckOnLandingUrl() {
		try
		{
			let landingURL: URL = new URL(Xrm.Page.getAttribute("msdyn_landingurl").getValue());
			if (!urlRegExp.test(landingURL.hostname)) {
				let alertMessage: string = "Enter a valid URL";
				let buttonText: string = "OK";
				let alertStrings: any = { confirmButtonLabel: buttonText, text: alertMessage };
				Xrm.Navigation.openAlertDialog(alertStrings);
			}
		}
		catch (e)
		{
			console.log(e);
		}
	}

	export function wildcardCheckOnTrustedDomain() {
		try
		{
		let trustedDomain: URL = new URL(Xrm.Page.getAttribute("msdyn_trusteddomain").getValue());
		if (!urlRegExp.test(trustedDomain.hostname)) {
			let alertMessage: string = "Enter a valid Trusted Domain URL";
			let buttonText: string = "OK";
			let alertStrings: any = { confirmButtonLabel: buttonText, text: alertMessage };
			Xrm.Navigation.openAlertDialog(alertStrings);
			}
		}
		catch (e)
		{
			console.log(e);
		}
	}
}