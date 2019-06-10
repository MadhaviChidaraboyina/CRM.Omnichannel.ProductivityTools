/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.0.2611-manual/clientapi/XrmClientApi.d.ts" />
/// <reference path="Templatesutility.ts" />

/** @internal */
namespace Microsoft.CIFramework.Internal {
	export interface CIFPopupNotification extends XrmClientApi.IPopupNotificationItem {
		timeout: number;
	};
	export class UCINotificationTemplate {
		private static _notificationTemplates = new Map<string, UCINotificationTemplate>();
		private static AcceptAction: string = "100000000";
		private static RejectAction: string = "100000001";

		public static InitTemplates(): Promise<boolean> {
			//UCIApplicationTabTemplate._appTemplates.
			return new Promise<boolean>(
				function (resolve, reject) {
					if (UCINotificationTemplate._notificationTemplates.size > 0) {
						return resolve(true);
					}
					Xrm.WebApi.retrieveMultipleRecords("msdyn_consoleapplicationnotificationtemplate",
						"?$select=msdyn_name,msdyn_title,msdyn_actionbuttons,msdyn_icon,msdyn_timeout&$expand=msdyn_msdyn_consoleapplicationnotificationtempl($select=msdyn_name,msdyn_lineheader,msdyn_value)").then(
						function (result) {
							result.entities.forEach(
								function (value, index, array) {
									UCINotificationTemplate._notificationTemplates.set(value["msdyn_name"], new UCINotificationTemplate(
										value["msdyn_consoleapplicationnotificationtemplateid"],
										value["msdyn_name"],
										value["msdyn_title"],
										value["msdyn_actionbuttons"],
										value["msdyn_actionbuttons@OData.Community.Display.V1.FormattedValue"],
										value["msdyn_icon"],
										value["msdyn_timeout"],
										value["msdyn_msdyn_consoleapplicationnotificationtempl"]
										));
								});
							return resolve(true);
						},
						function (error) {
							//TODO: log telemetry
							return reject(error);
						});
				});
		}
		public static getAppTemplateById(templateId: string): Promise<string> {
			return new Promise<string>(function (resolve, reject) {
				UCINotificationTemplate.InitTemplates().then(function (result) {
					for (let [appName, appTempl] of UCINotificationTemplate._notificationTemplates) {
						if (templateId === appTempl.templateId) {
							return resolve(appName);
						}
					}
					return reject(new Error("No matching application template found with Id " + templateId));
				}, function (error) {
					return reject(error);
				});
			});
		}
		public static getTemplate(name: string): Promise<UCINotificationTemplate> {
			return new Promise<UCINotificationTemplate>(function (resolve, reject) {
				UCINotificationTemplate.InitTemplates().then(
					function (result) {
						return resolve(UCINotificationTemplate._notificationTemplates.get(name));
					},
					function (error) {
						return reject(error);
					}
				);
			});
		}

		public instantiateTemplate(templateParams: any, acceptHandler: XrmClientApi.EventHandler, rejectHandler: XrmClientApi.EventHandler, correlationId?: string): Promise<CIFPopupNotification> { //TODO: The return type here will change based on platform definition
			return new Promise<any>(function (resolve: (value?: CIFPopupNotification | PromiseLike<CIFPopupNotification>) => void, reject: (error: Error) => void) {
				try {   //TODO: Parameterized apptab title
					let ret: CIFPopupNotification = {
						title: this.title,
						acceptAction: {
							eventHandler: acceptHandler,
							actionLabel: this.actionButtons[UCINotificationTemplate.AcceptAction] || "Accept"   //TODO: Need to localize
							},
						declineAction: {
							eventHandler: rejectHandler,
							actionLabel: this.actionButtons[UCINotificationTemplate.RejectAction] || "Reject"   //TODO: Need to localize
						},
						imageUrl: this.icon,
						details: {},
						type: isNullOrUndefined(this.actionButtons[UCINotificationTemplate.RejectAction]) ? XrmClientApi.Constants.PopupNotificationType.AcceptOnly : XrmClientApi.Constants.PopupNotificationType.AcceptDecline,
						entityLookUpValue: null,
						timeout: this.timeout
					};
					let stringResolvers: Promise<string>[] = [];

					stringResolvers.push(TemplatesUtility.resolveTemplateString(this.title, templateParams, this.name).then(
						function (result: string) {
							ret.title = result;
							return Promise.resolve(result);
						},
						function (error: Error) {
							ret.title = this.title;
							return Promise.reject(error);
							//TODO: log error
						}));

					for (let i in this.infoFields) {
						stringResolvers.push(TemplatesUtility.resolveTemplateString(this.infoFields[i]["msdyn_value"], templateParams, this.name).then(
							function (result: string) {
								ret.details[this.infoFields[i]["msdyn_lineheader"]] = result;
							}.bind(this),
							function (error: Error) {
								ret.details[this.infoFields[i]["msdyn_lineheader"]] = this.infoFields[i]["msdyn_value"];
								//TODO: log error
							}.bind(this)));
					}
					Promise.all(stringResolvers).then(
						function (result: any) {
							return resolve(ret);
						}.bind(this),
						function (error: Error) {
							//TODO: log telemetry
							return resolve(ret);
						}.bind(this));
				}
				catch (error) {
					return reject(error);
				}
			}.bind(this));
		}

		private _name: string;
		private _templateId: string;
		private _title: string;
		private _actionButtons: { [value: string]: string };
		private _icon: string;
		private _timeout: number;
		private _infoField: XrmClientApi.Entity[];
		public get templateId(): string {
			return this._templateId;
		}
		public get name(): string {
			return this._name;
		}
		
		protected get title(): string {
			return this._title;
		}
		protected get actionButtons(): { [value: string]: string } {
			return this._actionButtons;
		}
		protected get icon(): string {
			return this._icon;
		}
		protected get timeout(): number {
			return this._timeout;
		}
		protected get infoFields(): XrmClientApi.Entity[] {
			return this._infoField;
		}
		private constructor(templateId: string, name: string, title: string, actionButtons: string, actionButonLabels: string, icon: string, timeout: number, infoFields: XrmClientApi.Entity[]) {
			this._templateId = templateId;
			this._name = name;
			this._title = title;
			this._icon = icon;
			this._timeout = timeout;
			this._infoField = infoFields;
			this._actionButtons = {};
			let buttons: string[] = actionButtons.split(",");
			let labels: string[] = actionButonLabels.split(";");
			for (let index in buttons) {
				this._actionButtons[buttons[index]] = labels[index];
			}
		}
	}
}