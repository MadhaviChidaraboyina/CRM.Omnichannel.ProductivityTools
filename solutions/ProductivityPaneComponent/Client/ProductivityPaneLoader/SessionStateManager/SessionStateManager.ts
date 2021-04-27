/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
module ProductivityPaneLoader {
    export class SessionStateManager {
        public static setSessionStorageData(key: string, value: any): void {
            sessionStorage.setItem(key, JSON.stringify(value));
        }

        public static getSessionStorageData(key: string): any {
            return JSON.parse(sessionStorage.getItem(key));
        }

        public static deleteSessionStorageData(key: string): void {
            sessionStorage.removeItem(key);
        }
    }
}
