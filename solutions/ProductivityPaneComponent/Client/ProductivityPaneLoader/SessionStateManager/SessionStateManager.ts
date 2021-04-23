/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
module ProductivityPaneLoader {
    export class SessionStateManager {
        public static setState(key: string, value: any): void {
            sessionStorage.setItem(key, JSON.stringify(value));
        }

        public static getState(key: string): any {
            return JSON.parse(sessionStorage.getItem(key));
        }

        public static deleteState(key: string): void {
            sessionStorage.removeItem(key);
        }
    }
}
