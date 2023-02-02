/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/

/// <reference path="./Utils.ts" />
/// <reference path="../Interfaces/ITelemetryData.ts" />

module ProductivityPaneLoader { 
    export class TelemetryData implements ITelemetryData {
        private _customParameters: Map<string, string | number | boolean>;
        private _traceString: string;
        private _correlationId: string; 
        private _sourceFunction: string;

        // Unique ID for each telemetry path. Will be passed to any children methods
        get correlationId(): string {
            return this._correlationId
        }

        // Any additional parameters to be logged
        get customParameters(): Map<string, string | number | boolean> {
            return this._customParameters;
        }

        // Custom trace string for logs
        get traceString(): string {
            return this._traceString
        }

         // Keeps track of current method for logging
         get sourceFunction(): string {
            return this._sourceFunction;
        }

        
        private constructor(
            sourceFunction: string = "", 
            correlationId = Utils.newGuid(), 
            legacyTrace: string = "",
            customParameters = new Map<string, string | number | boolean>(), 
            ) {
            this._sourceFunction = sourceFunction;
            this._correlationId = correlationId;
            this._customParameters = new Map(customParameters);
            this._traceString = legacyTrace;

            this.addFunctionTrace(sourceFunction);
        }

        public static generate(sourceFunction: string, telemetryData?: ITelemetryData | string | null): TelemetryData {
            // check to see if telemetry data is just a correlation ID / string
            if(typeof(telemetryData) === "string") {
                return new TelemetryData(sourceFunction, telemetryData);
            }

            const data = (telemetryData || {}) as TelemetryData; // constructor will take care of any missing props
            return new TelemetryData(sourceFunction, data.correlationId, data.traceString, data.customParameters);
        }
    
        // Adds a custom parameter to be logged in CECRuntime/CECERuntimeError Kusto DBs
        public addCustomParameter(key: string, value: string | number | boolean): void {
            if(Utils.isNullOrUndefined(key)) {
                return;
            }

            this._customParameters.set(key, value);
        }

         // Adds a custom parameters to be logged in CECRuntime/CECERuntimeError Kusto DBs
         public addCustomParameters(params: Array<Array<string | number | boolean>>): void {
            if(Utils.isNullOrUndefined(params)) {
                return;
            }

            params.forEach(([key, value]) => {
                if(typeof key === "string") {
                    this.addCustomParameter(key, value);
                }
            })
        }
    
        // Adds a function name to trace: function1.function2.
        public addFunctionTrace(trace: string): void {
            if(Utils.isNullOrUndefined(trace) || trace.length === 0) {
                return;
            }

            if (Utils.isNullOrUndefined(this._traceString) || this._traceString.length === 0) {
                this._traceString = trace;
            } else {
                this._traceString = this._traceString.concat(" -> ", trace);
            }
        }

        // Adds error details to logs 
        public addError(error: Error | string) {
            if(Utils.isNullOrUndefined(error)) {
                return;
            }

            let errorObj: any = {};

            if(typeof(error) === "string") {
                errorObj.errorString = error;
            } else {
                if(error.message) errorObj.message = error.message;
                if(error.stack) errorObj.stack = error.stack;
            }

            const errorJSON = JSON.stringify(errorObj);
            this.addCustomParameter(Constants.Error, errorJSON);
        }
    }
}