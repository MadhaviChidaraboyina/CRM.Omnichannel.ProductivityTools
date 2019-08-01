/// <reference path="../../../../references/internal/TypeDefinitions/XrmClientApi/XrmClassicWebClientApi.d.ts" />
/// <reference path="../Constants.ts" />

module CIFramework {

	

	export function populateDefaultValuesNotificationTemplate(context: any) {
		var formContext = context.getFormContext();

		//If CreateMode only then set the default values
		if (formContext && formContext.ui && formContext.ui.getFormType() == 1) {
			try {
				formContext.getAttribute(Microsoft.CIFramework.Constants.notificationTemplateIconAttribute).setValue(Microsoft.CIFramework.Constants.notificationTemplateIconDefaultValue);
				formContext.getAttribute(Microsoft.CIFramework.Constants.notificationTemplateTimeoutAttribute).setValue(Microsoft.CIFramework.Constants.notificationTemplateTimeoutDefaultValue);
			}
			catch (ex) {
				console.log("Error setting the default values in Notification template form.");
				console.log(ex);
			}
		}
	}
}