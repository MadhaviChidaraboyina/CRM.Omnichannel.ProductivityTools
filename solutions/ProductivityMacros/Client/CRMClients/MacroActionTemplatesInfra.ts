/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />

/** @internal */
namespace Microsoft.ProductivityMacros.Internal {
	export class ProductivityMacroActionTemplate {
		public static macroActionTemplates = new Map<string, ProductivityMacroActionTemplate>();

		public static InitMacroActionTemplates(): Promise<boolean> {
			return new Promise<boolean>(
				function (resolve, reject) {
					if (ProductivityMacroActionTemplate.macroActionTemplates.size > 0) {
						return resolve(true);
					}
					Xrm.WebApi.retrieveMultipleRecords("msdyn_macroactiontemplate",
						"?$select=msdyn_name,msdyn_title,msdyn_runtimeapi").then(
							function (result) {
								result.entities.forEach(
									function (value, index, array) {
										ProductivityMacroActionTemplate.macroActionTemplates.set(value["msdyn_name"], new ProductivityMacroActionTemplate(
											value["msdyn_macroactiontemplateId"],
											value["msdyn_name"],
											value["msdyn_title"],
											value["msdyn_runtimeapi"]
										));
									}
								);
								resolve(true);
							},
							function (error) {
								reject(error);
							});
				}
			);
		}

		private _templateId: string;
		private _name: string;
		private _title: string;
		private _runtimeAPI: string;

		public get runtimeAPI(): string {
			return this._runtimeAPI;
		}

		private constructor(templateId: string, actionName: string, actionTitle: string, actionRuntimeAPI: string) {
			this._templateId = templateId;
			this._name = actionName;
			this._title = actionTitle;
			this._runtimeAPI = actionRuntimeAPI;
		}
	}
}