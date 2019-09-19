/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
/** @internal */
namespace Microsoft.CIFramework.Internal {
	export class TemplatesUtility {
		public static resolveTemplateString(input: string, templateParams: any, scope: string): Promise<string> {
			return new Promise<string>(function (resolve, reject) {
				if (isNullOrUndefined(input)) {
					return resolve(input);
				}
				let paramVals: Map<string, string> = new Map<string, string>();
				let paramResolvers: Promise<string>[] = [];
				//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions : "?" character

				let matches = input.match(new RegExp("\\{[^{]*\\}|\\{(?:[^{]*\\{[^}]*\\}[^{}]*)*\\}", "g")); // "\\{.*?\\}" (non -greedy) allows to resolve "{qp}{param1}" as qp and param1 whereas "\\{.*\\}" (greedy) resolve "{qp}{param1}" as {qp}{param1} itself.

				for (let index in matches) {
					let param = matches[index];
					let paramName: string = param.substr(1, param.length - 2);
					if (paramVals.has(param)) {
						continue;
					}
					paramVals.set(param, "");
					try {
						let val = "";
						if (paramName.startsWith(Internal.SlugPrefix.CHANNEL_PROVIDER) || paramName.startsWith(Internal.SlugPrefix.SESSION)) {
							scope = TemplatesUtility.getScopeforSlugPrefix(paramName, scope);
							paramName = TemplatesUtility.stripSlugPrefix(paramName);
						}
						if (templateParams.hasOwnProperty(scope) && templateParams[scope].hasOwnProperty(paramName)) {
							val = templateParams[scope][paramName];
						}
						else if (templateParams.hasOwnProperty(paramName)) {
							val = templateParams[paramName];
						}
						if (paramName.startsWith("$odata")) {
							//val is assumed to be of the format $odata.<entityLogicalName>.<entityAttributeName>.<query>
							let queryParts: string[] = paramName.split(".");
							if (queryParts.length != 4) {
								continue;   //Invalid template parameter; ignore it
							}
							let promise: Promise<string> = new Promise<string>(
								function (resolve, reject) {
									let qPromises: Promise<string>[] = [];
									qPromises.push(TemplatesUtility.resolveTemplateString(queryParts[1], templateParams, scope));
									qPromises.push(TemplatesUtility.resolveTemplateString(queryParts[2], templateParams, scope));
									qPromises.push(TemplatesUtility.resolveTemplateString(queryParts[3], templateParams, scope));
									Promise.all(qPromises).then(
										function (results: string[]) {
											Xrm.WebApi.retrieveMultipleRecords(results[0], results[2], 1).then(
												function (result) {
													try {
														paramVals.set(param, result.entities[0][results[1]]);
														console.log("Fullfilled odata for " + param + " got value " + paramVals.get(param));
														return resolve(paramVals.get(param));
													}
													catch (error) {
														//TODO: Log telemetry
														console.log("Error resolving " + input + " : " + error);
														return reject(error);
													}
												},
												function (error) {
													//TODO: log telemetry
													console.log("Error resolving " + input + " : " + error);
													return reject(error);
												});
										},
										function (error) {
											console.log("Error resolving " + input + " : " + error);
											return reject(error);
										});
								});
							paramResolvers.push(promise);
						}
						else {
							paramVals.set(param, val);
						}
					}
					catch (error) {
						//TODO: log telemetry
						console.log("Error resolving " + input + " : " + error);
					}
				}

				Promise.all(paramResolvers).then(
					function (result) {
						let ret = input;
						paramVals.forEach(function (val, key, map) {
							ret = ret.split(key).join(val || "");
						});
						return resolve(ret);
					},
					function (error) {
						//TODO: log telemetry
						console.log("Error resolving " + input + " : " + error);
						return reject(error);
					});
			});
		}

		/**
		 * Given the input bag for templates, the function gives the templatename after execueting function mentioned in templateNameResolver property.
		 * Else it returns input.templateName
		 * @param input The input bag for APIs like createSession
		 */
		public static resolveTemplateName(templateNameResolver: any, templateName: string): Promise<TemplateNameResolverResult> {
			var promise = new Promise(function (resolve: any, reject: any) {
				try {
					if (isNullOrUndefined(templateNameResolver)) {
						resolve(new TemplateNameResolverResult(templateName, false));
					}
					else {
						Xrm.Utility.executeFunction(
							templateNameResolver.webresourceName,
							templateNameResolver.functionName,
							templateNameResolver.parameters).then((response: any) => {
								resolve(new TemplateNameResolverResult(response, true));
							}, (error: any) => {
								resolve(new TemplateNameResolverResult(templateName, false));
							});
					}
				}
				catch (error) {
					resolve(new TemplateNameResolverResult(templateName, false));
				}
			});
			return promise;
		}

		public static stripSlugPrefix(param: string): string {
			let splitTextArray = param.split(Internal.SlugPrefix.SPLIT_BY_DOT);
			let len = splitTextArray.length;
			return splitTextArray[len-1];
		}

		public static getScopeforSlugPrefix(param: string, scope: string): string {
			if (param.startsWith(Internal.SlugPrefix.SESSION)) {
				let splitSlugArray = param.split(Internal.SlugPrefix.SPLIT_BY_DOT);
				if (splitSlugArray[1] && (splitSlugArray[1] === Internal.SlugPrefix.CURRENT_TAB || splitSlugArray[1] === Internal.SlugPrefix.ANCHOR_TAB)) {
					scope = TemplatesUtility.getTabId(splitSlugArray[1]);
				}
			}
			return scope;
		}
		public static getTabId(tabName: string): string {
			if (tabName === Internal.SlugPrefix.CURRENT_TAB) {
				return Xrm.App.sessions.getFocusedSession().tabs.getFocusedTab().tabId;
			}
			else {
				return Xrm.App.sessions.getFocusedSession().tabs.getAll().get(0).tabId;
			}
		}
	}


	export class TemplateNameResolverResult {
		public templateName: string;
		public isFoundByResolver: boolean;
		constructor(templateName: string, isFoundByResolver: boolean) {
			this.templateName = templateName;
			this.isFoundByResolver = isFoundByResolver;
		}
	}
}