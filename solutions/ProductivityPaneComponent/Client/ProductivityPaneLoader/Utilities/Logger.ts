/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="../../TypeDefinitions/AppRuntimeClientSdk.d.ts" />

module ProductivityPaneLoader {
    export class Logger {
        public static logInfo(message: string, telemetryData?: any) {
            Microsoft.AppRuntime.Internal.telemetryLogInfo(message, telemetryData);
            console.info(message);
        }

        public static logWarning(message: string, telemetryData?: any) {
            Microsoft.AppRuntime.Internal.telemetryLogWarning(message, telemetryData);
            console.warn(message);
        }

        public static logError(message: string, telemetryData?: any) {
            Microsoft.AppRuntime.Internal.telemetryLogError(message, telemetryData);
            console.error(message + ': ' + JSON.stringify(telemetryData));
        }
    }
}
