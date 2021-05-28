/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="../../TypeDefinitions/AppRuntimeClientSdk.d.ts" />

module ProductivityPaneLoader {
    export class Logger {
        public static logInfo(eventType: EventType, message: string, additionalData?: any) {
            const telemetryData = Logger.addParamer(eventType, additionalData);
            Microsoft.AppRuntime.Internal.telemetryLogInfo(message, telemetryData);
            console.info(message);
        }

        public static logWarning(eventType: EventType, message: string, additionalData?: any) {
            const telemetryData = Logger.addParamer(eventType, additionalData);
            Microsoft.AppRuntime.Internal.telemetryLogWarning(message, telemetryData);
            console.warn(message);
        }

        public static logError(eventType: EventType, message: string, additionalData?: any) {
            const telemetryData = Logger.addParamer(eventType, additionalData);
            Microsoft.AppRuntime.Internal.telemetryLogError(message, telemetryData);
            console.error(message + ': ' + JSON.stringify(telemetryData));
        }

        private static addParamer(eventType: EventType, telemetryData: any) {
            return {
                eventType: eventType,
                telemetryData: telemetryData,
            };
        }
    }
}
