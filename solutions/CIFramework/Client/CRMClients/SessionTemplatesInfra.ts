/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.0.2611-manual/clientapi/XrmClientApi.d.ts" />
/// <reference path="Templatesutility.ts" />

/** @internal */
namespace Microsoft.CIFramework.Internal {
	export interface SessionTemplateSessionInput extends XrmClientApi.SessionInput {
		anchorTabTags: string[];
	}
	class UCIApplicationType {
		private _name: XrmClientApi.PageType;
		private _order: number;

		public get name(): XrmClientApi.PageType {
			return this._name;
		}

		public get order(): number {
			return this._order;
		}

		constructor(name: XrmClientApi.PageType, order: number) {
			this._name = name;
			this._order = order;
		}
	}
	export class UCIApplicationTabTemplate {
		private static _appTemplates = new Map<string, UCIApplicationTabTemplate>();

		private static _UCIPageTypes = new Map<string, UCIApplicationType>();
		private static InitPageTypes(): Promise<boolean> {
			let promise = new Promise<boolean>(
				function (resolve, reject) {
					if (UCIApplicationTabTemplate._UCIPageTypes.size > 0) {
						return resolve(true);
					}
					return Xrm.WebApi.retrieveMultipleRecords("msdyn_consoleapplicationtype", "?$select=msdyn_name").then(
						function (result) {
							result.entities.forEach(function (value, index, array) {
								UCIApplicationTabTemplate._UCIPageTypes.set(value["msdyn_consoleapplicationtypeid"], new UCIApplicationType(value["msdyn_name"], value["msdyn_renderingorder"]));
								return resolve(true);
							});
						},
						function (error) {
							return reject(error);
						});
				}
			);
			return promise;
		}
		public static InitTemplates(): Promise<boolean> {
			//UCIApplicationTabTemplate._appTemplates.
			return new Promise<boolean>(function (resolve, reject) {
				UCIApplicationTabTemplate.InitPageTypes().then(
					function (result) {
						if (UCIApplicationTabTemplate._appTemplates.size > 0) {
							return resolve(true);
						}
						Xrm.WebApi.retrieveMultipleRecords("msdyn_consoleapplicationtemplate", "?$select=msdyn_name,msdyn_icon,msdyn_pinned,msdyn_title,_msdyn_pagetype_value,msdyn_templateparameters&$expand=msdyn_msdyn_consoleapplicationtemplate_tags($select=msdyn_name)").then(
							function (result) {
								result.entities.forEach(function (value, index, array) {
									UCIApplicationTabTemplate._appTemplates.set(value["msdyn_name"], new UCIApplicationTabTemplate(
										value["msdyn_consoleapplicationtemplateid"],
										value["msdyn_name"],
										value["msdyn_title"],
										value["msdyn_icon"],
										value["msdyn_pinned"],
										UCIApplicationTabTemplate._UCIPageTypes.get(value["_msdyn_pagetype_value"]),
										value["msdyn_templateparameters"],
										value["msdyn_msdyn_consoleapplicationtemplate_tags"].map(function (tag: {msdyn_name: string}) { return tag.msdyn_name;})));
								});
								return resolve(true);
							},
							function (error) {
								//TODO: Log error
								console.error(error);
								return reject(error);
							});
					},
					function (error) {
						return reject(error);
					}
				);
			});
		}
		public static getAppTemplateById(templateId: string): Promise<string> {
			return new Promise<string>(function (resolve, reject) {
				UCIApplicationTabTemplate.InitTemplates().then(function (result) {
					for (let [appName, appTempl] of UCIApplicationTabTemplate._appTemplates) {
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
		public static getTemplate(name: string): Promise<UCIApplicationTabTemplate> {
			return new Promise<UCIApplicationTabTemplate>(function (resolve, reject) {
				UCIApplicationTabTemplate.InitTemplates().then(
					function (result) {
						return resolve(UCIApplicationTabTemplate._appTemplates.get(name));
					},
					function (error) {
						return reject(error);
					}
				);
			});
		}
		private static convertValue(value: string, runtimeType: string, templateParams: any, scope: string): Promise<any> {
			if (isNullOrUndefined(value)) {
				return Promise.resolve(null);
			}
			switch (runtimeType) {
				case "number":
					return Promise.resolve(Number(value));
				case "boolean":
					return Promise.resolve(Boolean(value));
				case "json":
					return Promise.resolve(JSON.parse(value));
				case "string":
					return TemplatesUtility.resolveTemplateString(value, templateParams, scope);
				default:
					return Promise.resolve(value);
			}
		}
		public instantiateTemplate(templateParams: any): Promise<XrmClientApi.TabInput> {
			return new Promise<XrmClientApi.TabInput>(function (resolve: (value?: XrmClientApi.TabInput | PromiseLike<XrmClientApi.TabInput>) => void, reject: (error: Error) => void) {
				try {   //TODO: Parameterized apptab title
					let ret: any = {};
					let options: XrmClientApi.TabOptions = {
						canBeClosed: !this.isPinned,
					};
					if (!isNullOrUndefined(this.title) && this.title.length > 0) {
						options.title = this.title;
					}
					if (!isNullOrUndefined(this.icon) && this.icon.length > 0) {
						options.iconPath = this.icon;
					}
					ret["pageType"] = this.pageType;
					let stringResolvers: Promise<string>[] = [];                    
					stringResolvers.push(TemplatesUtility.resolveTemplateString(this.title, templateParams, this.name).then(
						function (result) {
							if (!isNullOrUndefined(result) && result.length > 0) {
								options.title = result;
							}
							return Promise.resolve(result);
						},
						function (error) {
							//TODO: log error telemetry
							return Promise.resolve(this.title);
						}));
					let name = this.name;
					for (let prop in this.template) {
						let data = this.template[prop];
						console.log("Initiating resolution for param " + prop + " for templ " + name);
						let runtimeVal = null;
						if (templateParams.hasOwnProperty(this.name) && templateParams[this.name].hasOwnProperty(prop)) {
							runtimeVal = templateParams[this.name][prop];
						}
						else if (templateParams.hasOwnProperty(prop)) {
							runtimeVal = templateParams[prop];
						}
						let val = (data.isRuntime && !data.value ? runtimeVal : data.value);  //TODO: Need to resolve parameterized string here
						stringResolvers.push(UCIApplicationTabTemplate.convertValue(val, data.type, templateParams, this.name).then(
							function (result) {
								if (!isNullOrUndefined(result)) {
									ret[prop] = result;                                    
								}
								console.log("Found value " + prop + " for templ: " + name + " : " + result);
								return Promise.resolve(result);
							},
							function (error) {
								//TODO: Log the error
								//ret[prop] = null;
								console.log("Error retrieving " + prop + " for templ: " + name + " : " + error);
								return Promise.resolve(val);
							}));
					}
					Promise.all(stringResolvers).then(
						function (result: string) {
							console.log("All params for templ " + name + " are done");
							return resolve({ pageInput: ret, options: options });
						}.bind(this),
						function (error: Error) {
							//TODO: log error telemetry
							console.log("All params for templ " + name + " are done with error " + error);
							return resolve({ pageInput: ret, options: options });
						}.bind(this));
				}
				catch (error) {
					return reject(error);
				}
			}.bind(this));
		}

		private _name: string;
		private _tags: string[];
		private _templateId: string;
		private _uciAppType: UCIApplicationType;
		private _template: any;
		private _title: string;
		private _icon: string;
		private _isPinned: boolean;
		public get templateId(): string {
			return this._templateId;
		}
		public get name(): string {
			return this._name;
		}
		protected get title(): string {
			return this._title;
		}
		protected get template(): any {
			return this._template;
		}
		protected get isPinned(): boolean {
			return this._isPinned;
		}
		protected get pageType(): XrmClientApi.PageType {
			return this._uciAppType.name;
		}
		public get order(): number {
			return this._uciAppType.order;
		}
		protected get icon(): string {
			return this._icon;
		}
		public get tags(): string[] {
			return this._tags;
		}
		private constructor(templateId: string, name: string, title: string, icon: string, pinned: boolean, appType: UCIApplicationType, templateParameters: string, tags: string[]) {
			this._name = name;
			this._uciAppType = appType;
			this._template = JSON.parse(templateParameters);
			this._templateId = templateId;
			this._title = title; //TODO: temporary - need to add title attribute to the entity
			this._isPinned = pinned; //TODO: need to add pinned attribute to the entity
			this._icon = icon;
			this._tags = tags;
		}
	}

	export class UCISessionTemplate {
		private static _sessionTemplates = new Map<string, UCISessionTemplate>();
		private static _templateBytag = new Map<string, string[]>();
		public static InitSessionTemplates(): Promise<boolean> {
			return new Promise<boolean>(
				function (resolve, reject) {
					UCIApplicationTabTemplate.InitTemplates().then(
						function (result) {
							if (UCISessionTemplate._sessionTemplates.size > 0) {
								return resolve(true);
							}
							Xrm.WebApi.retrieveMultipleRecords("msdyn_consoleapplicationsessiontemplate",
								"?$select=msdyn_name,msdyn_title,msdyn_icon,msdyn_panelstate,msdyn_pinned,_msdyn_anchortab_value,msdyn_renderingorder&$expand=msdyn_msdyn_consoleapplicationsessiontemp_tag($select=msdyn_name),msdyn_msdyn_consoleapplicationsessiontemplate_m($select=msdyn_name)&$orderby=msdyn_renderingorder").then(
									function (result) {
										result.entities.forEach(
											function (value, index, array) {                                                
												let appTabs = new Array<string>();
												for (let tab in value["msdyn_msdyn_consoleapplicationsessiontemplate_m"]) {
													appTabs.push(value["msdyn_msdyn_consoleapplicationsessiontemplate_m"][tab].msdyn_name);
												}
												UCIApplicationTabTemplate.getAppTemplateById(value["_msdyn_anchortab_value"]).then(
													function (anchorTabName) {
														UCISessionTemplate._sessionTemplates.set(value["msdyn_name"], new UCISessionTemplate(
															value["msdyn_consoleapplicationsessiontemplateid"],
															value["msdyn_name"],
															value["msdyn_title"],
															value["msdyn_icon"],
															value["msdyn_panelstate"],
															value["msdyn_pinned"],
															anchorTabName,
															appTabs
														));
														//TODO: Add to the _templateBytag Map
													},
													function (error) {
														//TODO: log invalid session template
													}
												);
												for (let index in value["msdyn_msdyn_consoleapplicationsessiontemp_tag"]) {
													let tag: string = value["msdyn_msdyn_consoleapplicationsessiontemp_tag"][index].msdyn_name;
													if (!UCISessionTemplate._templateBytag.has(tag)) {
														UCISessionTemplate._templateBytag.set(tag, []);
													}
													UCISessionTemplate._templateBytag.get(tag).push(value["msdyn_name"]);
												}
												return resolve(true);
											}
										);
									});
						},
						function (error) {
							return reject(error);
						}
					);
				}
			);
		}

		public instantiateTemplate(templateParams: any): Promise<SessionTemplateSessionInput> {   //TODO: make this a promise
			return new Promise<SessionTemplateSessionInput>(function (resolve: (value?: SessionTemplateSessionInput | PromiseLike<SessionTemplateSessionInput>) => void, reject: (error: Error) => void) {

				UCIApplicationTabTemplate.getTemplate(this.anchorTabName).then(
					function (result: UCIApplicationTabTemplate) {
						let tags: string[] = result.tags;
						let options: XrmClientApi.SessionOptions = {
							canBeClosed: this.canBeClosed,
						};
						if (!isNullOrUndefined(this.title) && this.title.length > 0) {
							options.title = this.title;
						}
						if (!isNullOrUndefined(this.icon) && this.icon.length > 0) {
							options.iconPath = this.icon;
						}
						let promises: Promise<any>[] = []
						let pageInput: XrmClientApi.PageInput = null;
						promises.push(TemplatesUtility.resolveTemplateString(this.title, templateParams, this.name).then(
							function (result) {
								options.title = result;
								return Promise.resolve(true);
							},
							function (error) {
								//TODO: Log error
								return Promise.resolve(true);
							}));
						promises.push(
							result.instantiateTemplate(templateParams).then(
								function (result: XrmClientApi.TabInput) {
									pageInput = result.pageInput;
									return Promise.resolve(true);
								}.bind(this),
								function (error: Error) {
									//TODO: Log error
									return Promise.reject(error);
								}.bind(this)));
						Promise.all(promises).then(
							function (result: any) {
								return resolve({
									pageInput: pageInput,
									options: options,
									anchorTabTags: tags
								});
							}.bind(this),
							function (error: Error) {
								//TODO: Log error
							}.bind(this));
					}.bind(this),
					function (error: Error) {
						//TODO: Log error
						return reject(error);
					}.bind(this));
			}.bind(this));
		}

		public static getTemplateByTag(tag: string): Promise<UCISessionTemplate> {
			return new Promise<UCISessionTemplate>(function (resolve, reject) {
				UCISessionTemplate.InitSessionTemplates().then(
					function (result) {
						try {
							let name: string = UCISessionTemplate._templateBytag.get(tag)[0];
							return resolve(UCISessionTemplate._sessionTemplates.get(name));
						}
						catch (error) {
							//TODO: log error
							return reject(new Error("Error retrieving template by tag (" + tag + ") : " + error));
						}
					},
					function (error) {
						//TODO: log error
						return reject(error);
					});
			});
		}
		public static getTemplateByName(name: string): Promise<UCISessionTemplate> {
			return new Promise<UCISessionTemplate>(function (resolve, reject) {
				UCISessionTemplate.InitSessionTemplates().then(
					function (result) {
						let templ = UCISessionTemplate._sessionTemplates.get(name);
						if (isNullOrUndefined(templ)) {
							return reject(new Error("Did not find template by name (" + name + ")"));
						}
						return resolve(templ);
					},
					function (error) {
						return reject(new Error("Error retrieving template by name (" + name + ") : " + error));
					});
			});
		}
		private _name: string;
		private _templateId: string;
		private _title: string;
		private _panelState: number;
		private _anchorTabName: string;
		private _icon: string;
		private _pinned: boolean;
		private _appTabs: Promise<UCIApplicationTabTemplate[]>;

		private static _panelOptionToState: Map<number, number> = new Map<number, number>([
			[100000000, 1], //Docked (Expanded)
			[100000001, 0], //Minimized
			[100000002, 2]  //Hidden
		]);
		constructor(templateId: string, name: string, title: string, icon: string, panelState: number, pinned: boolean, anchorTab: string, appTabs: string[]) {
			this._name = name;
			this._templateId = templateId;
			this._title = title;
			this._panelState = UCISessionTemplate._panelOptionToState.get(panelState);
			this._icon = icon;
			this._pinned = pinned;
			this._anchorTabName = anchorTab;
			let apps: Promise<UCIApplicationTabTemplate>[] = [];
			appTabs.forEach(function (tab) {
				apps.push(UCIApplicationTabTemplate.getTemplate(tab).then(
					function (result) {
						return Promise.resolve(result);
					},
					function (error) {
						//TODO: log error
						return Promise.resolve(error);
					}));
			});
			this._appTabs = Promise.all(apps).then(
				function (allApps: UCIApplicationTabTemplate[]) {
					let appTabs = allApps.sort(
						function (a: UCIApplicationTabTemplate, b: UCIApplicationTabTemplate) {
							return (a.order - b.order);
						});
					return Promise.resolve(appTabs);
				}.bind(this),
				function (error: Error) {
					//TODO: log error
					return Promise.reject(error);
				}.bind(this));
		}

		public get name(): string {
			return this._name;
		}

		public get templateId(): string {
			return this._templateId;
		}

		public get title(): string {
			return this._title;
		}

		public get panelState(): number {
			return this._panelState;
		}

		public get icon(): string {
			return this._icon;
		}

		public get canBeClosed(): boolean {
			return !this._pinned;
		}

		/*protected get order(): number {
			return this._order;
		}*/

		public get anchorTabName(): string {
			return this._anchorTabName;
		}

		public get appTabs(): Promise<UCIApplicationTabTemplate[]> {
			return this._appTabs;
		}
	}
}