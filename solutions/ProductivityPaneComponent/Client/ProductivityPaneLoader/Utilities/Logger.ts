/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="../../../../../references/internal/TypeDefinitions/AppRuntimeClientSdk.d.ts" />

module ProductivityPaneLoader {
    export class Logger {
        public static logInfo(eventType: EventType, message: string, additionalData?: any) {
            const telemetryData = Logger.addParameter(eventType, additionalData);
            Microsoft.AppRuntime.Internal.telemetryLogInfo(message, telemetryData);
            console.info(message);
        }

        public static logWarning(eventType: EventType, message: string, additionalData?: any) {
            const telemetryData = Logger.addParameter(eventType, additionalData);
            Microsoft.AppRuntime.Internal.telemetryLogWarning(message, telemetryData);
            console.warn(message);
        }

        public static logError(eventType: EventType, message: string, additionalData?: any) {
            const telemetryData = Logger.addParameter(eventType, additionalData);
            Microsoft.AppRuntime.Internal.telemetryLogError(message, telemetryData);
            console.error(message + ': ' + JSON.stringify(telemetryData));
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
