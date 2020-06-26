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
		ExecuteAction(action: IActionItem, state: any, runHistoryData: executionJSON): Promise<string> {
			return new Promise((resolve, reject) => {
				let expressions = action.expression;
				var startTime = new Date().toISOString();
				var outputs = {};
				this.evaluateExpression(expressions,state).then(
					function (result: any) {
						var innerActions: IActionItem[];
						if (result) {
							innerActions = action.actions;
							status = Microsoft.ProductivityMacros.Constants.StatusSucceded;
							var trueInput = {
								"expressionResult": true
							}
							Microsoft.ProductivityMacros.RunHistory.setActionStatus(runHistoryData, status, startTime, outputs, action.name, trueInput);
						}
						else {
							if (action.else) {
								innerActions = action.else.actions;
							}
							status = Microsoft.ProductivityMacros.Constants.StatusFailed;
							var falseInput = {
								"expressionResult": false
							}
							Microsoft.ProductivityMacros.RunHistory.setActionStatus(runHistoryData, status, startTime, outputs, action.name, falseInput);
						}
						let executeActionPromise = ExecuteActions(innerActions, state, runHistoryData).then(
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

		evaluateExpression(expressions: any, state: any): Promise<boolean> {
			return new Promise((resolve, reject) => {
				for (const expression in expressions) {
					let operator = expression;
					switch (operator) {
						case "and":
							let innerExpressions: any[] = expressions[expression];
							var promises = [];
							for (const exp in innerExpressions) {
								var promiseResult = this.evaluateExpression(innerExpressions[exp], state).then(
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
								var promiseResult = this.evaluateExpression(innerExprs[exp], state).then(
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
							this.evaluateExpression(expressions[expression], state).then(
								function (success: boolean) {
									console.log(success);
									return resolve(!success);
								},
								function (error: Error) {
									reject(error);
								});
							break;
						default:
							var slugPromises: Promise<string | void>[] = [];
							var lhsValue: any;
							var rhsValue: any;
							slugPromises.push(
								resolveSlug(expressions[expression][0], state.stateParams).then(
									function (lhs: any) {
										try {
											console.log("LHS : " + lhs);
											lhsValue = lhs;
										}
										catch (ex) {
											console.log(ex);
											reject(ex);
										}
									}.bind(this),
									function (error: Error) {
										reject(error);
									}));
							slugPromises.push(
								resolveSlug(expressions[expression][1], state.stateParams).then(
								function (rhs: any) {
									try {
										console.log("RHS : " + rhs);
										rhsValue = rhs;										
									}
									catch (ex) {
										console.log(ex);
										reject(ex);
									}
								}.bind(this),
								function (error: Error) {
									reject(error);
									}));
							Promise.all(slugPromises).then(
								function (result: any) {
									return resolve(this.evaluateOperation(lhsValue, rhsValue, operator));
								}.bind(this),
								function (error: Error) {
									reject(error);
								}
							);							
					}
				}
			});
		}

		evaluateOperation(lhs: any, rhs: any, operator: string): boolean {
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
						return lhs.toString().startsWith(rhs.toString());
					case "endsWith":
						return lhs.toString().endsWith(rhs.toString());
					case "contains":
						return lhs.toString().includes(rhs.toString());
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