/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module TelemetryLogger
{
	'use strict';

	export class TelemetryLogger
	{
		// properties
		private context: Mscrm.ControlData<any>;
		public baseComponent: string;
		private separator: string;

		// Initialize context variable during init
		constructor(context: Mscrm.ControlData<any>, baseComponent: string)
		{
			this.baseComponent = baseComponent;
			this.separator = ".";
			this.context = context;
		}

		/**
		 * Logs success telemetry
		 * @param component name of the component logging telemetry
		 * @param parameterList parameter list
		 */
		public logSuccess(component: string, parameterList: EventParameters)
		{
			let componentName = this.baseComponent + this.separator + component;
			parameterList.addParameter("IsError", false);
			let eventParameters = parameterList.getEventParams();
			this.context.reporting.reportSuccess(componentName, eventParameters);
		}

		/**
		 * Logs error telemetry
		 * @param parentComponent parent component
		 * @param subComponent sub-component
		 * @param errorMessage error message
		 * @param parameterList parameter list
		 * @param errorResponse error response 
		 */
		public logError(component: string, errorMessage: string, parameterList: EventParameters, errorResponse?: Mscrm.ErrorResponse): void
		{
			parameterList.addParameter("IsError", true);
			let errorString: string = errorMessage;

			if (!this.context.utils.isNullOrUndefined(errorResponse))
			{
				errorString = errorString + errorResponse.errorCode + ":" + errorResponse.message;
			}

			let errorObject = new Error(errorString);
			let eventParameters = parameterList.getEventParams();
			
			let componentName = this.baseComponent + this.separator + component;
			let suggestedMitigation: string = "";

			this.context.reporting.reportFailure(componentName, errorObject, suggestedMitigation, eventParameters);
		}

		/**
		 * Creates a Timer starting at the time of the function call. A Timer can be used to log telemetry on how long
		 * an operation takes.
		 * @param component name of the component logging telemetry
		 * @returns A Timer object.
		 */
		public startTimer(component: string): Timer {
			const start = Date.now();
			const self = this;
			const timer = {
				start,
				stop: (params: EventParameters) => {
					params.addParameter("DurationInMs", Date.now() - start);
					self.logSuccess(component, params);
				},
				fail: (error: string, params: EventParameters, errorResponse?: Mscrm.ErrorResponse) => {
					params.addParameter("DurationInMs", Date.now() - start);
					self.logError(component, error, params, errorResponse);
				}
			}
			return timer;
		}
	}

	interface Timer {
		start: number;
		stop: (params: EventParameters) => void;
		fail: (error: string, params: EventParameters, errorResponse?: Mscrm.ErrorResponse) => void;
	}

	/**
	 * Helper class for constructing event parameters
	 */
	export class EventParameters
	{
		// Event parameter list
		private eventParamList: Mscrm.EventParameter[];

		constructor()
		{
			this.eventParamList = [];
		}

		/**
		 * Add event parameter to parameter list
		 * @param paramKey parameter key
		 * @param paramValue parameter value
		 */
		public addParameter(paramKey: string, paramValue?: string | number | Date | Mscrm.Guid)
		{
			if (paramKey == null || paramValue == null) return;
			this.eventParamList.push({
				name: paramKey, value: paramValue
			});
		}

		/**
		 * Returns event parameter list
		 */
		public getEventParams(): Mscrm.EventParameter[]
		{
			return this.eventParamList;
		}
	}
}