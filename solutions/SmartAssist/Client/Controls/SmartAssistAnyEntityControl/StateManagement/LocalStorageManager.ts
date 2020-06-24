module MscrmControls.SmartAssistAnyEntityControl {
    export class LocalStorageManager {

        private static instance: LocalStorageManager = null;

        private constructor() {
        }

        public static get Instance(): LocalStorageManager {
            if (!LocalStorageManager.instance) {
                LocalStorageManager.instance = new LocalStorageManager();
            }
            return LocalStorageManager.instance;
        }

        /**
         * Get the record for the given suggestionId.
         * @param suggestionId
         */
        getRecord(suggestionId: string) : any {
            return window.localStorage.getItem(suggestionId);
        }

        /**
         * Create or update the record for the given suggestionId.
         * @param suggestionId Creates the record for this suggestionId.
         * @param data The data to be stored in cache.
         */
        createRecord(suggestionId: string, data: string) {
            window.localStorage.setItem(suggestionId, data);
        }

        /**
         * delete the record for the given suggestionId.
         * @param suggestionId
         */
        deleteRecord(suggestionId: string) {
            window.localStorage.removeItem(suggestionId);
        }

        /**
         * Update the data in the existing cache record for the given suggestionId.
         * @param suggestionId The suggestionId for which the data is cached.
         * @param newData The data to override.
         */
        updateSuggestionData(suggestionId: string, newData: any) {
            let cacheData = JSON.parse(this.getRecord(suggestionId)).data;
            let dataToStore = Object.assign({}, cacheData, newData);
            window.localStorage.setItem(suggestionId, JSON.stringify({ data: dataToStore }));
        }
    }
}