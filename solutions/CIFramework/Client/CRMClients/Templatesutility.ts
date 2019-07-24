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
	}
}