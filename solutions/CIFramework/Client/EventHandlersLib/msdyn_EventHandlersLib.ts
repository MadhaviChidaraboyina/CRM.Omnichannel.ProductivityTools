/// <reference path="../../../../references/internal/TypeDefinitions/XrmClientApi/XrmClassicWebClientApi.d.ts" />

module CIFramework {
	let urlRegExp = new RegExp('^((www\.)?[0-9a-zA-Z-_\.]+[a-zA-Z]{2,}$)')
	
	export function wildcardCheckOnLandingUrl() {
		let landingURL: URL = new URL(Xrm.Page.getAttribute("msdyn_landingurl").getValue());
		if (!urlRegExp.test(landingURL.hostname)) {
			let alertMessage: string = "The following characters are not allowed in the Channel URL: \n !~@{}$/\\%^()&*[]+=|,\"<>\':?; \n\n\n Allowed set of characters are: \n Uppercase letter (A-Z), Lowercase letter (a-z), Number (0-9), Hyphen (-), Period(.) and Underscore (_).";
			let buttonText: string = "OK";
			let alertStrings: any = { confirmButtonLabel: buttonText, text: alertMessage };
			Xrm.Navigation.openAlertDialog(alertStrings);
		}
	}

	export function wildcardCheckOnTrustedDomain() {
		let trustedDomain: URL = new URL(Xrm.Page.getAttribute("msdyn_trusteddomain").getValue());
		if (!urlRegExp.test(trustedDomain.hostname)) {
			let alertMessage: string = "The following characters are not allowed in the Trusted Domain: \n !~@{}$/\\%^()&*[]+=|,\"<>\':?; \n\n\n Allowed set of characters are: \n Uppercase letter (A-Z), Lowercase letter (a-z), Number (0-9), Hyphen (-), Period(.) and Underscore (_).";
			let buttonText: string = "OK";
			let alertStrings: any = { confirmButtonLabel: buttonText, text: alertMessage };
			Xrm.Navigation.openAlertDialog(alertStrings);
		}
	}
}