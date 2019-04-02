/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.0.2611-manual/clientapi/XrmClientApi.d.ts" />
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
				let matches = input.match(new RegExp("\\{.*\\}", "g"));
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
						if (val.startsWith("$odata")) {
							//val is assumed to be of the format $odata.<entityLogicalName>.<entityAttributeName>.<query>
							let queryParts: string[] = val.split(".");
							if (queryParts.length != 4) {
								continue;   //Invalid template parameter; ignore it
							}
							let promise: Promise<string> = new Promise<string>(
								function (resolve, reject) {
									Xrm.WebApi.retrieveMultipleRecords(queryParts[1], queryParts[3], 1).then(
										function (result) {
											try {
												paramVals.set(param, result.entities[0][queryParts[2]]);
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
						let searchRegexParts: string[] = [];
						paramVals.forEach(function (val, key, map) {
							let paramName = key.substr(1, key.length - 2);
							searchRegexParts.push("\\{" + paramName + "\\}");
						});
						let regex = searchRegexParts.join("|");
						let ret = input.replace(new RegExp(regex), function (args) { return paramVals.has(args) && paramVals.get(args) || args });
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