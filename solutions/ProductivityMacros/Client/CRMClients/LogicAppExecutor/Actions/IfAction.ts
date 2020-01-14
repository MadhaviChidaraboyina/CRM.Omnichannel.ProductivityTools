/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/// <reference path="../Interfaces.ts" />
/// <reference path="../LogicAppExecutor.ts" />

namespace Microsoft.LogicAppExecutor {

	export class IfAction implements ActionExecutor {
		private static _instance: ActionExecutor = null;
		private constructor() { }

		public static get Instance(): ActionExecutor {
			if (!IfAction._instance) {
				IfAction._instance = new IfAction();
			}
			return IfAction._instance;
		}
		ExecuteAction(action: IActionItem): Promise<string> {
			return new Promise((resolve, reject) => {
				let expressions = action.expression;
				this.evaluvateExpression(expressions).then(
					function (result: any) {
						var innerActions: IActionItem[];
						if (result) {
							innerActions = action.actions;
						}
						else {
							innerActions = action.else.actions;
						}
						let executeActionPromise = ExecuteActions(innerActions).then(
							function (result: any) {
								return (result);
							},
							function (error: Error) {
								reject(error);
							}
						);
						executeActionPromise.then(
							function (success: any) {
								console.log(success);
								resolve(success)
							},
							function (error: Error) {
								reject(error);
							});
					},
					function (error: Error) {
						reject(error);
					});
			});
		}		

		evaluvateExpression(expressions: any): Promise<boolean> {
			return new Promise((resolve, reject) => {
				for (const expression in expressions) {
					let operator = expression;
					switch (operator) {
						case "and":
							let innerExpressions: any[] = expressions[expression];
							var promises = [];
							for (const exp in innerExpressions) {
								var promiseResult = this.evaluvateExpression(innerExpressions[exp]).then(
									function (result: any) {
										if (!result) {
											return resolve(result);
										}
									},
									function (error: Error) {
										reject(error);
									});
								promises.push(promiseResult);
							}
							Promise.all(promises).then(
								function (success: any) {
									return resolve(true);
								},
								function (error: Error) {
									reject(error);
								});
							break;
						case "or":
							let innerExprs: any[] = expressions[expression];
							var orPromises = [];
							for (const exp in innerExprs) {
								var promiseResult = this.evaluvateExpression(innerExprs[exp]).then(
									function (result: any) {
										if (result) {
											return resolve(result);
										}
									},
									function (error: Error) {
										reject(error);
									});
								orPromises.push(promiseResult);
							}
							Promise.all(orPromises).then(
								function (success: any) {
									return resolve(false);
								},
								function (error: Error) {
									reject(error);
								});
							break;
						case "not":
							this.evaluvateExpression(expressions[expression]).then(
										function (success: boolean) {
											console.log(success);
											return resolve(!success);
										},
										function (error: Error) {
											reject(error);
								});							
						default:
							let slugPromise = resolveSlug(expressions[expression][0]).then(
								function (lhs: any) {
									try {
										console.log("LHS : " + lhs);
										return (this.evaluvateOperation(lhs, expressions[expression][1], operator));
									}
									catch (ex) {
										console.log(ex);
										reject(ex);
									}
								}.bind(this),
								function (error: Error) {
									reject(error);
								});
							slugPromise.then(
								function (result: any) {
									console.log(result);
									return resolve(result);
								},
								function (error: Error) {
									reject(error);
								}
							);							
					}
				}
			});
		}

		evaluvateOperation(lhs: any, rhs: any, operator: string): boolean {
			try {
				switch (operator) {
					case "greater":
						return (lhs > rhs);
					case "less":
						return (lhs < rhs);
					case "equals":
						return (lhs == rhs);
					case "greaterOrEquals":
						return (lhs >= rhs);
					case "lessOrEquals":
						return (lhs <= rhs);
					case "startsWith":
						return lhs.startsWith(rhs);
					case "endsWith":
						return lhs.endsWith(rhs);
					case "contains":
						return lhs.includes(rhs);
				}
			}
			catch (ex)
			{
				console.log(ex);
				throw ex;
			}
		}
	}

	interface IExpression {
		operator: string;
		expressions: IExpression[];
		lhs: string;
		rhs: string;
	}
}