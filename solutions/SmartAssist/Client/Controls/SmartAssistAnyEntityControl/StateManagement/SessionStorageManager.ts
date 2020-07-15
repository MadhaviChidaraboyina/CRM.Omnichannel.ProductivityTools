module MscrmControls.SmartAssistAnyEntityControl {
    export class SessionStorageManager {

        private static instance: SessionStorageManager = null;

        private constructor() {
        }

        public static get Instance(): SessionStorageManager {
            if (!SessionStorageManager.instance) {
                SessionStorageManager.instance = new SessionStorageManager();
            }
            return SessionStorageManager.instance;
        }

        /**
         * Get the record for the given suggestionId.
         * @param suggestionId
         */
        getRecord(suggestionId: string): any {
            return window.sessionStorage.getItem(suggestionId);
        }

        /**
         * Create or update the record for the given suggestionId.
         * @param suggestionId Creates the record for this suggestionId.
         * @param data The data to be stored in cache.
         */
        createRecord(suggestionId: string, data: string) {
            window.sessionStorage.setItem(suggestionId, data);
        }

        /**
         * delete the record for the given suggestionId.
         * @param suggestionId
         */
        deleteRecord(suggestionId: string) {
            window.sessionStorage.removeItem(suggestionId);
        }

        /**
         * Update the data in the existing cache record for the given suggestionId.
         * @param suggestionId The suggestionId for which the data is cached.
         * @param newData The data to override.
         */
        updateSuggestionData(suggestionId: string, newData: any) {
            let cacheData = JSON.parse(this.getRecord(suggestionId)).data;
            let dataToStore = Object.assign({}, cacheData, newData);
            window.sessionStorage.setItem(suggestionId, JSON.stringify({ data: dataToStore }));
        }
    }
}