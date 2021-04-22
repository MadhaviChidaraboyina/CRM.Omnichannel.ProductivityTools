/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
module ProductivityPaneLoader {
    export class SessionStateManager {
        public static setState(key: string, value: any) {
            sessionStorage.setItem(key, value);
        }

        public static getState(key: string): any {
            return JSON.parse(sessionStorage.getItem(key));
        }

        public static destroy(key: string) {
            delete sessionStorage[key];
        }
    }
}
