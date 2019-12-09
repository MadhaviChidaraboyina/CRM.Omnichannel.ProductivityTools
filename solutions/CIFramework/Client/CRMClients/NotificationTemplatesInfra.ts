/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
/// <reference path="Templatesutility.ts" />

/** @internal */
namespace Microsoft.CIFramework.Internal {
	export interface CIFPopupNotification extends XrmClientApi.IPopupNotificationItem {
		timeout: number;
	};
	export class UCINotificationTemplate {
		private static _notificationTemplates = new Map<string, UCINotificationTemplate>();
		private static _templateBytag = new Map<string, string[]>();
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
						"?$select=msdyn_name,msdyn_title,msdyn_notificationbuttons,msdyn_icon,msdyn_timeout,msdyn_acceptbuttontext,msdyn_rejectbuttontext&$expand=msdyn_msdyn_consoleapplicationnotificationtempl($select=msdyn_name,msdyn_lineheader,msdyn_value,msdyn_priority),msdyn_msdyn_consoleapplicationnotificationtag($select=msdyn_name)").then(
						function (result) {
							result.entities.forEach(
								function (value, index, array) {
									UCINotificationTemplate._notificationTemplates.set(value["msdyn_name"], new UCINotificationTemplate(
										value["msdyn_consoleapplicationnotificationtemplateid"],
										value["msdyn_name"],
										value["msdyn_title"],
										value["msdyn_notificationbuttons"],
										value["msdyn_icon"],
										value["msdyn_timeout"],
										value["msdyn_acceptbuttontext"],
										value["msdyn_rejectbuttontext"],
										value["msdyn_msdyn_consoleapplicationnotificationtempl"]
									));
									for (let index in value["msdyn_msdyn_consoleapplicationnotificationtag"]) {
										let tag: string = value["msdyn_msdyn_consoleapplicationnotificationtag"][index].msdyn_name;
										if (!UCINotificationTemplate._templateBytag.has(tag)) {
											UCINotificationTemplate._templateBytag.set(tag, []);
										}
										UCINotificationTemplate._templateBytag.get(tag).push(value["msdyn_name"]);
									}
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

		public static getTemplateByTag(tag: string, correlationId?: string): Promise<UCINotificationTemplate> {
			return new Promise<UCINotificationTemplate>(function (resolve, reject) {
				UCINotificationTemplate.InitTemplates().then(
					function (result) {
						try {
							let name: string = UCINotificationTemplate._templateBytag.get(tag)[0];
							return resolve(UCINotificationTemplate._notificationTemplates.get(name));
						}
						catch (error) {
							return reject(new Error("Error retrieving template by tag (" + tag + ") : " + error));
						}
					},
					function (error) {
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

		public instantiateTemplate(templateParams: any, acceptHandler: XrmClientApi.EventHandler, rejectHandler: XrmClientApi.EventHandler, timeoutHandler: XrmClientApi.EventHandler, correlationId?: string): Promise<CIFPopupNotification> { //TODO: The return type here will change based on platform definition
			return new Promise<any>(function (resolve: (value?: XrmClientApi.IPopupNotificationItem | PromiseLike<XrmClientApi.IPopupNotificationItem>) => void, reject: (error: Error) => void) {
				try {   //TODO: Parameterized apptab title
					let ret: XrmClientApi.IPopupNotificationItem = {
						title: this.title,
						acceptAction: {
							eventHandler: acceptHandler,
							actionLabel: this.actionButtons[UCINotificationTemplate.AcceptAction] || Utility.getResourceString("ACCEPT_BUTTON_TEXT")
						},
						declineAction: {
							eventHandler: rejectHandler,
							actionLabel: this.actionButtons[UCINotificationTemplate.RejectAction] || Utility.getResourceString("REJECT_BUTTON_TEXT")
						},
						imageUrl: this.icon,
						details: {},
						type: isNullOrUndefined(this.actionButtons[UCINotificationTemplate.RejectAction]) ? XrmClientApi.Constants.PopupNotificationType.AcceptOnly : XrmClientApi.Constants.PopupNotificationType.AcceptDecline,
						entityLookUpValue: null
					};
					if (!isNullOrUndefined(this.timeout) && this.timeout > 0) {
						let timeoutAction = {
						eventHandler: timeoutHandler,
						actionLabel: Utility.getResourceString("NOTIFICATION_DETAIL_WAIT_TIME_TEXT"),
						timeout: this.timeout
						}
						ret.timeoutAction = timeoutAction;
					}

					let stringResolvers: Promise<string>[] = [];

					stringResolvers.push(TemplatesUtility.resolveTemplateString(this.title, templateParams, this.name).then(
						function (result: string) {
							ret.title = result;
							return Promise.resolve(result);
						},
						function (error: Error) {
							ret.title = this.title;
							console.log(error);
							return Promise.reject(error);
						}));

					stringResolvers.push(TemplatesUtility.resolveTemplateString(this.icon, templateParams, this.name).then(
						function (result: string) {
							ret.imageUrl = result;
							return Promise.resolve(result);
						},
						function (error: Error) {
							ret.imageUrl = this.icon;
							console.log(error);
							return Promise.reject(error);
						}));

					if (this.infoFields.length > 0) {

						// Sort the fields as per priority for evaluation
						var notificationFieldList: NotificationField[] = [];
						for (let i in this.infoFields) {
							notificationFieldList.push(new NotificationField(this.infoFields[i]["msdyn_lineheader"], this.infoFields[i]["msdyn_value"], this.infoFields[i]["msdyn_priority"]));
						}
						notificationFieldList.sort(this.compareInfoFields);

						let noOfNecessaryFields = (notificationFieldList.length > NotificationConstants.NoOfFieldsAllowedInNotification) ? NotificationConstants.NoOfFieldsAllowedInNotification : notificationFieldList.length;
						let availableFields = 0;
						var fieldsWithValues: NotificationField[] = [];
						var promise = new Promise<string>(
								function (resolve: (fields: NotificationField[]) => void, reject: (fields: NotificationField[]) => void) {
								this.resolveFields(notificationFieldList, 0, noOfNecessaryFields, templateParams, this.name, fieldsWithValues, availableFields, noOfNecessaryFields).then(
									function (response: any) {
										this.updatePopupItemDetailswithOrderedFields(ret, fieldsWithValues);
											return resolve(fieldsWithValues);
										}.bind(this),
										function (error: Error) {
											console.log(error);
											this.updatePopupItemDetailswithOrderedFields(ret, fieldsWithValues); // even on error, we wanted fields to be filled with whatever we have and proceed with notification with the available fields.
											return resolve(fieldsWithValues);
										}.bind(this));
								}.bind(this));
						stringResolvers.push(promise);
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

		/**
		 * Resolved the notification fields ordered by priority field 
		 * @param notificationFieldList The list of notification field ordered by priority
		 * @param start The start index from where we need to resolve fields.
		 * @param end The end index till where we need to resolve it together
		 * @param templateParams The template parameters
		 * @param name The notification template name
		 * @param results The result list of notification fields with actual values if resolved.
		 * @param noOfResolvedFields The number of fields which got resolved successfully
		 * @param noOfNecessaryFields The number of necessary fields.
		 */
		private resolveFields(notificationFieldList: NotificationField[], start: number, end: number, templateParams: any, name: string, results: NotificationField[], noOfResolvedFields: number, noOfNecessaryFields: number): Promise<number> {
			return new Promise<number>(
				function (resolve: (noOfResolvedFields: number) => void, reject: (noOfResolvedFields: number) => void) {
					try {
						var stringResolversFields: Promise<string>[] = [];
						for (var i = start; i < end && i < notificationFieldList.length; i++) {
							var obj: any = { index: i };
							stringResolversFields.push(TemplatesUtility.resolveTemplateString(notificationFieldList[i].value, templateParams, name).then(function (indexObj: any, result: any) {
								if (!isNullOrUndefined(result) && result != "") {
									results.push(new NotificationField(notificationFieldList[indexObj.index].lineheader, result, notificationFieldList[indexObj.index].priority));
									noOfResolvedFields++;
								}
								return Promise.resolve("Success");
							}.bind(this, obj), function (error: any) {
								return Promise.resolve("Error");
							}.bind(this)));
						}
						Promise.all(stringResolversFields).then(function (response: any) {
							if (end >= notificationFieldList.length || noOfResolvedFields >= noOfNecessaryFields) { // If we have got necessary no of fields or have completed the evaluation of the full list, resolve with whatever we have.
								return resolve(noOfResolvedFields);
							}
							if (noOfResolvedFields < noOfNecessaryFields) { //if there are  fields for evaluations further, call the same function with start and end index updated.
								this.resolveFields(notificationFieldList, end, end + 1, templateParams, name, results, noOfResolvedFields, noOfNecessaryFields).then(function (response: any) {
									return resolve(response);
								}.bind(this));
							}
						}.bind(this), function (error: any) {
								return resolve(noOfResolvedFields);
						}.bind(this));
					}
					catch (error) {
						return resolve(noOfResolvedFields);
					}
				}.bind(this));
		}

		/// Updates popupItem. details with the notification fields in the order of priority
		private updatePopupItemDetailswithOrderedFields(popupItem: XrmClientApi.IPopupNotificationItem, fieldsWithValues: NotificationField[]) {
			fieldsWithValues.sort(this.compareInfoFields);
			let avaialableFields: number = 0;
			for (var field of fieldsWithValues) {
				popupItem.details[field.lineheader] = field.value;
				avaialableFields++;
				if (avaialableFields == NotificationConstants.NoOfFieldsAllowedInNotification) {
					return popupItem;
				}
			}
			return popupItem;
		}

		// compare function for notification fields.
		private compareInfoFields(field1: NotificationField, field2: NotificationField) {
			if (field1.priority === field2.priority) {
				return ComparisonResult.EQUAL;
			}

			// Null checks are for pushing null values to the end of the list on sorting
			if (isNullOrUndefined(field1.priority)) {
				return ComparisonResult.GREATER;
			}

			if (isNullOrUndefined(field2.priority)) {
				return ComparisonResult.LESSER;
			}

			return field1.priority > field2.priority ? ComparisonResult.GREATER : ComparisonResult.LESSER;
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
		private constructor(templateId: string, name: string, title: string, actionButtons: string, icon: string, timeout: number, acceptButtonText: string, rejectButtonText: string, infoFields: XrmClientApi.Entity[]) {
			this._templateId = templateId;
			this._name = name;
			this._title = title;
			this._icon = icon;
			this._timeout = timeout*1000; //convert to milliseconds
			this._infoField = infoFields;
			this._actionButtons = {};
			let buttonsJson = JSON.parse(actionButtons);
			//let buttons: string[] = actionButtons.split(",");
			//let labels: string[] = actionButonLabels.split(";");
			let labels: string[] = [];
			let buttonsCount = 0;

			// we fallback to JSON to support upgrade scenarios
			labels.push(acceptButtonText ? acceptButtonText : buttonsJson.Accept_Button_String ? buttonsJson.Accept_Button_String:"");
			this._actionButtons[UCINotificationTemplate.AcceptAction] = labels[buttonsCount];
			if (buttonsJson.Reject_Button_Enabled) {
				labels.push(rejectButtonText ? rejectButtonText : buttonsJson.Reject_Button_String ? buttonsJson.Reject_Button_String : "");
				this._actionButtons[UCINotificationTemplate.RejectAction] = labels[++buttonsCount];
			}
		}
	}

	/**
	 * Class for holding notification field related properites.
	 */
	class NotificationField {
		public lineheader: string;
		public value: string;
		public priority: string;
		constructor(lineheader: string, value: string, priority: string) {
			this.lineheader = lineheader;
			this.value = value;
			this.priority = priority;
		}
	}
}