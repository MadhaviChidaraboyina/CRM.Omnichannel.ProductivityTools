/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="../../TypeDefinitions/AppRuntimeClientSdk.d.ts" />

 module ProductivityPaneLoader {
    export class TelemetryLogger {
        public static logInfo(message: string, telemetryData?: any) {
            Microsoft.AppRuntime.Internal.telemetryLogInfo(message, telemetryData);
        }

        public static logWarning(message: string, telemetryData?: any) {
            Microsoft.AppRuntime.Internal.telemetryLogWarning(message, telemetryData);
        }

        public static logError(message: string, telemetryData?: any) {
            Microsoft.AppRuntime.Internal.telemetryLogError(message, telemetryData);
        }
    }
}
