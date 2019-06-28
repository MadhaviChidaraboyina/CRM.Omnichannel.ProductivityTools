/// <reference path="../../../../references/internal/TypeDefinitions/XrmClientApi/XrmClassicWebClientApi.d.ts" />

module CIFramework {
	let urlRegExp = new RegExp('^((www\.)?[0-9a-zA-Z-_\.]+[a-zA-Z]{2,}$)')
	let protocolRegExp = new RegExp('^(http|https):')


	export function validateAndShowAlert(attributeName: string, alertMessage: string) {
		try {
			let attributeValue: string = Xrm.Page.getAttribute(attributeName).getValue();
			if (!attributeValue) {
				return;
			}

			let url: URL = new URL(attributeValue);
			if (!urlRegExp.test(url.hostname) || !protocolRegExp.test(url.protocol)) {
				let buttonText: string = "OK";
				let alertStrings: any = { confirmButtonLabel: buttonText, text: alertMessage };
				Xrm.Navigation.openAlertDialog(alertStrings);
			}
		}
		catch (e) {
			console.log("Error in url validation. " + e);
		}
	}

	export function wildcardCheckOnLandingUrl() {
		validateAndShowAlert("msdyn_landingurl", "Enter a valid Landing URL");
	}

	export function wildcardCheckOnTrustedDomain() {
		validateAndShowAlert("msdyn_trusteddomain", "Enter a valid Trusted Domain URL");
	}
}