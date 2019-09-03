/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.ProductivityPanel {
	'use strict';

	export class DataManager {

		private context: Mscrm.ControlData<IInputBag>;

		constructor(context: Mscrm.ControlData<IInputBag>) {
			this.context = context;
		}

		/**
		 * Retrieves callscript data from CRM
		 */
		public retrieveCallScriptsForSession(sessionId: string): Promise<CallScript[]> {
			// to be replaced with logic to fetch callscripts from admin config
			let callScripts = GenerateMockData.getData(this.context);
			let dataRetrievePromise = new Promise<CallScript[]>((resolve, reject) => {
				//added a delay to simulate time taken for network call, to be removed when mock data is removed
				window.setTimeout(() => resolve(callScripts), 300);
			});
			return dataRetrievePromise;
		}
	}

	export class GenerateMockData {
		public static getData(context: Mscrm.ControlData<IInputBag>): CallScript[] {
			// Call Script 1
			let greetAction = new TextAction("action1Id", "Greet Action", "Greet the customer and ask what can you do for them.");
			let verifyCustomerAction = new MacroAction("action2Id", "Verify Customer Action", "verifyCustomerMacroId", "This will automatically verify customer information");
			let openNewAccountAction = new RouteAction("action4Id", "Go to Open New Account Script", "scrip2", "This will route you to 'open new account' script");
			let searchKBAction = new MacroAction("action3Id", "Search KB Action", "searchKBMacroId", "This will open kb search window and search of kb articles with current title");

			let greetStep = new CallScriptStep("step1", "greetStep", "Welcome Customer", 1, greetAction, context);
			let verifyStep = new CallScriptStep("step2", "verifyStep", "Verify Customer", 2, verifyCustomerAction, context);
			let openAccStep = new CallScriptStep("step4", "openAccStep", "Go to Open New Account Script", 3, openNewAccountAction, context);
			let searchkbStep = new CallScriptStep("step3", "searchStep", "Search KB Article", 4, searchKBAction, context);

			let creditLimitCallScript = new CallScript("script1", "creditlimitscript", "Credit Limit Extension",
				"Please perform following steps in order to enhance credit card limit for the customer",
				[greetStep, verifyStep, openAccStep, searchkbStep]);


			// Call script 2
			let greetAction2 = new TextAction("action11Id", "Greet Action", "Greet the customer and ask what can you do for them.");
			let createCaseAction = new MacroAction("action12Id", "Create Case Action", "createCaseMacroId", "This will open a new case form autofilled with session details");

			var num = 30;
			let steps: CallScriptStep[] = [];
			steps.push(new CallScriptStep("step12", "createcase", "Mark conversation as resolved", 2, createCaseAction, context));
			let greetStep2 = new CallScriptStep("step11", "greetStep", "Long text - Welcome Customer Welcome Customer Welcome Customer Welcome Customer Welcome Customer Welcome Customer Welcome Customer Welcome Customer Welcome Customer Welcome Customer Welcome Customer Welcome Customer Welcome Customer End", i, greetAction2, context);
			steps.push(greetStep2);
			for (var i = 0; i < num; i++) {
				let greetAction3 = new TextAction("action11Id", "Greet Action", "Action " + (i + 1)+"- Greet the customer and ask what can you do for them.");
				let greetStep3 = new CallScriptStep("step2" + i, "greetStep", "Welcome Customer " + (i + 1), i, greetAction3, context);
				steps.push(greetStep3);
			}

			let newAccountOpeningScript = new CallScript("scrip2", "newaccountstep", "Open New Account",
				"Steps for opening new account with the company. Also provide case number to customer once completed",
				steps);

			return [creditLimitCallScript, newAccountOpeningScript];
		}
	}

}