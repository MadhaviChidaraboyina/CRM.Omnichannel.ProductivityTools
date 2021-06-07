﻿/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
/// <reference path="Constants.ts" />
/// <reference path="../TelemetryHelper.ts" />
/// <reference path="ProductivityMacrosWrapper.ts" />
/// <reference path="MacroActionTemplatesInfra.ts" />

/** @internal */
namespace Microsoft.ProductivityMacros.Internal {

	export function resolveTemplateString(input: string, templateParams: any, scope: string): Promise<string> {
        return new Promise<string>(function (resolve, reject) {
            if (isNullOrUndefined(input)) {
                return resolve(input);
            }
            let paramVals: Map<string, string> = new Map<string, string>();
            let paramResolvers: Promise<string>[] = [];

            if (input.startsWith(SlugPrefix.SPLIT_BY_DOLLAR)) { // For backward compatibilty.
                input = input.substr(1, input.length - 1);   
            } 

            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions : "?" character

            let matches = input.match(new RegExp("\\{[^{}\"\']*\\}|\\{\\$[^{}]*((\\{[^{}]*\\})+[^{}]*)*\\}|\\$\{[^{}\"\']*\\}|\\$\{\\$[^{}]*((\\{[^{}]*\\})+[^{}]*)*\\}", "g"));            let slugCallbacks: string[] = [];

            for (let index in matches) {
                let param = matches[index];
                let paramName: string;
                if (param.startsWith(ProductivityMacros.SlugPrefix.SPLIT_BY_DOLLAR)) {
                    paramName = param.substr(2, param.length - 3);
                } else {
                    paramName = param.substr(1, param.length - 2);
                }
                if (paramVals.has(param)) {
                    continue;
                }
                paramVals.set(param, "");
                try {
                    let val = "";
                    if (paramName.startsWith(SlugPrefix.SPLIT_BY_DOLLAR) && !(paramName.toLowerCase().startsWith("$odata"))) {
                        let prefixes: string[] = paramName.split(SlugPrefix.SPLIT_BY_DOT);
                        if (prefixes.length > 1) {
                            var connector = Internal.ProductivityMacroOperation.macroConnectorTemplates.get(prefixes[0].substr(1).toLowerCase());
                            if (!isNullOrUndefined(connector)) {
                                slugCallbacks.push(connector.callback);
                                paramName = stripSlugPrefix(paramName);
                            }
                        }
                    }
                    if (!(paramName.toLowerCase().startsWith("$odata")) && slugCallbacks.length == 0) {
                        buildSlugCallbacks(slugCallbacks);
                    }
                    if (!isNullOrUndefined(templateParams) && templateParams.hasOwnProperty(scope) && templateParams[scope].hasOwnProperty(paramName)) {
                        val = templateParams[scope][paramName];
                    }
                    else if (!isNullOrUndefined(templateParams) && templateParams.hasOwnProperty(paramName)) {
                        val = templateParams[paramName];
                    } else if (slugCallbacks.length > 0) {
                        let promise: Promise<string> = new Promise<string>(
                            function (resolve, reject) {
                                let executionpromise = slugCallbacks.reduce((accumulatorPromise, nextId) => {
                                    return accumulatorPromise.then(function (result: any) {
                                        if (result === undefined || result === "") {
                                            return Internal.resolveSlugInCallback(nextId, paramName)
                                        } else {
                                            return Promise.resolve(result)
                                        }
                                    }, function (error: Error) {
                                        return reject(error);
                                    });
                                }, Promise.resolve(""));
                                executionpromise.then((result: any) => {
                                    paramVals.set(param, result);
                                    return resolve(paramVals.get(param))
                                }, (error: Error) => {
                                    return reject(error);
                                })
                       });
                       paramResolvers.push(promise);
                    }

                    if (paramName.toLowerCase().startsWith("$odata")) {
						//val is assumed to be of the format $odata.<entityLogicalName>.<entityAttributeName>.<query>
                        let queryParts: string[] = paramName.split(SlugPrefix.SPLIT_BY_DOT);
						if (queryParts.length < 4) {
							continue;   //Invalid template parameter; ignore it
						}
						let promise: Promise<string> = new Promise<string>(
							function (resolve, reject) {
								let qPromises: Promise<string>[] = [];
								qPromises.push(resolveTemplateString(queryParts[1], templateParams, scope));
								qPromises.push(resolveTemplateString(queryParts[2], templateParams, scope));
								for (let index = 3; index < queryParts.length - 1; index++) {
									queryParts[3] += "." + queryParts[index + 1];
								}
								qPromises.push(resolveTemplateString(queryParts[3], templateParams, scope));
								Promise.all(qPromises).then(
									function (results: string[]) {
										Xrm.WebApi.retrieveMultipleRecords(results[0], results[2], 1).then(
											function (result) {
                                                try {
                                                    if (result.entities.length > 0) {
                                                        paramVals.set(param, result.entities[0][results[1]]);
                                                    } else {
                                                        paramVals.set(param, "");
                                                    }
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

    function isJsonString(str: string): boolean {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    function buildSlugCallbacks(slugCallbacks: string[]) {
        var connector = Internal.ProductivityMacroOperation.macroConnectorTemplates.get("oc");  // Default callback
        if (!isNullOrUndefined(connector)) {
                slugCallbacks.push(connector.callback);
        }
        Internal.ProductivityMacroOperation.macroConnectorTemplates.forEach((value: ProductivityMacroConnector, key: string) => {
            if (key!= "oc" && !isNullOrUndefined(value.callback)) {  //already added
                slugCallbacks.push(value.callback);
            }
        });
    }

    export function resolveSlugInCallback(callback: string, paramName: string) {
        var slugPromise = new Promise<any>((resolve, reject) => {
            var callbackParams = stripCallbackParams(callback);
            if (callbackParams.length == 2) {
                var callbackFun = new Function(callbackParams[0], callbackParams[1], "return " + callback);
            }
            var executionContext = {};
            callbackFun(executionContext, "{" + paramName + "}").then((res: any) => {
                if (res["statusCode"] == 200) {
                    return resolve(res["result"]);
                } else {
                    //TODO: log telemetry
                    return resolve("");
                }
            }, function (error: Error) {
                return reject(error);
            });
        });

        const promiseTimeout = function (ms: any, promise: any) {

            // Create a promise that rejects in <ms> milliseconds
            let timeout = new Promise((resolve, reject) => {
                let id = setTimeout(() => {
                    clearTimeout(id);
                    //TODO: log telemetry
                    resolve("")
                }, ms)
            })

            // Returns a race between our timeout and the passed in promise
            return Promise.race([
                promise,
                timeout
            ])
        }

        return promiseTimeout(1000, slugPromise);
    }

	function stripSlugPrefix(param: string): string {
		let splitTextArray = param.split(SlugPrefix.SPLIT_BY_DOT);
        let slug = splitTextArray[0]
        return param.substr(slug.length +1);
    }

    function stripCallbackParams(param: string): string[] {
        var params = param.split(SlugPrefix.SPLIT_BY_OPENING_BRACKET)[1];
        params = params.substr(0, params.length - 1);
        return params.split(SlugPrefix.SPLIT_BY_COMMA);
    }
}