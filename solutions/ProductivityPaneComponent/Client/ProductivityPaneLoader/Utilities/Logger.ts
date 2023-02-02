/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="../../../../../references/internal/TypeDefinitions/AppRuntimeClientSdk.d.ts" />

module ProductivityPaneLoader {
    export class Logger {
        public static logInfo(eventType: EventType, message: string, additionalData?: any) {
            const telemetryData = Logger.getTelemetryData(eventType, additionalData);
            Microsoft.AppRuntime.Internal.telemetryLogInfo(message, telemetryData);
            console.info(message);
        }

        public static logWarning(eventType: EventType, message: string, additionalData?: any) {
            const telemetryData = Logger.getTelemetryData(eventType, additionalData);
            Microsoft.AppRuntime.Internal.telemetryLogWarning(message, telemetryData);
            console.warn(message);
        }

        public static logError(eventType: EventType, message: string, additionalData?: any) {
            const telemetryData = Logger.getTelemetryData(eventType, additionalData);
            Microsoft.AppRuntime.Internal.telemetryLogError(message, telemetryData);
            console.error(message + ': ' + JSON.stringify(telemetryData));
        }
        
        public static start(eventType: EventType, name: string, telemetryData?: any): void { 
            const startMessage = `${Constants.productivityToolsLogPrefix} ${Constants.StartingMessage} ${name}`;
            this.logInfo(eventType, startMessage, telemetryData);
        }

        public static success(eventType: EventType, name: string, telemetryData?: any): void { 
            const successMessage = `${Constants.productivityToolsLogPrefix} ${name} ${Constants.SuccessMessage}`;
            this.logInfo(eventType, successMessage, telemetryData);
        }

        private static getTelemetryData(eventType, additionalData?: any) {
            if(additionalData && Utils.isIterable(additionalData.customParameters)) {
                (additionalData.customParameters as Map<string, string | number | boolean>).set(
                    CustomParameterConstants.EventType, EventType[eventType]
                )

                return additionalData;
            } 

            return Logger.addParameter(eventType, additionalData);
        }

        private static addParameter(eventType: EventType, telemetryData: any) {
            if (telemetryData) {
                return {
                    eventType: EventType[eventType],
                    telemetryData: telemetryData,
                };
            } else {
                return {
                    eventType: EventType[eventType],
                };
            }
        }
    }
}
