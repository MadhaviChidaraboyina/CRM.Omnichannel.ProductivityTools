/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.ProductivityToolPanel
{
	'use strict';

	export class TelemetryLogger
	{
		// properties
		private context: Mscrm.ControlData<IInputBag>;
		public baseComponent: string;
		private separator: string;

		// Initialize context variable during init
		constructor(context: Mscrm.ControlData<IInputBag>)
		{
			this.baseComponent = "MscrmControls.PanelControl";
			this.separator = ".";
			this.context = context;
		}

		/**
		 * Reports error event
		 * @param subComponent Sub-Component name
		 * @param errorObject error objectss
		 * @param eventParameters Event parameter dictionary
		 */
		private reportErrorEvent(subComponent: string, errorObject: Error, eventParameters: Mscrm.EventParameter[])
		{
			let componentName = this.baseComponent + this.separator + subComponent;
			let suggestedMitigation: string = "";

			this.context.reporting.reportFailure(componentName, errorObject, suggestedMitigation, eventParameters);
		}

		/**
		 * Logs success telemetry
		 * @param parentComponent parent component
		 * @param subComponentName sub-component
		 * @param parameterList parameter list
		 */
		public logSuccess(parentComponent: string, subComponentName: string, parameterList: EventParameters)
		{
			let componentName = this.baseComponent + this.separator + parentComponent + this.separator + subComponentName;
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
		public logError(parentComponent: string, subComponent: string, errorMessage: string, parameterList: EventParameters,
			errorResponse?: Mscrm.ErrorResponse): void
		{
			let currentComponentName = parentComponent + this.separator + subComponent;
			let errorString: string = errorMessage;

			if (!this.context.utils.isNullOrUndefined(errorResponse))
			{
				errorString = errorString + errorResponse.errorCode + ":" + errorResponse.message;
			}

			let errorObject = new Error(errorString);
			let eventParameters = parameterList.getEventParams();
			this.reportErrorEvent(currentComponentName, errorObject, eventParameters);
		}
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
		public addParameter(paramKey: string, paramValue: string)
		{
			if (EventParameters.IsNullOrUndefined(paramKey) || EventParameters.IsNullOrUndefined(paramValue))
			{
				return;
			}

			let eventParam: Mscrm.EventParameter =
			{
				name: paramKey, value: paramValue
			};

			this.eventParamList.push(eventParam);
		}

		/**
		 * Returns event parameter list
		 */
		public getEventParams(): Mscrm.EventParameter[]
		{
			return this.eventParamList;
		}

		/**
		 * Return true if input is null or undefined
		 * Note: Use context.utils.isNullOrUndefined wherever possible
		 * @param object input param
		 */
		public static IsNullOrUndefined(object: any): boolean
		{
			return typeof (object) == "undefined" || object == null;
		}
	}
}