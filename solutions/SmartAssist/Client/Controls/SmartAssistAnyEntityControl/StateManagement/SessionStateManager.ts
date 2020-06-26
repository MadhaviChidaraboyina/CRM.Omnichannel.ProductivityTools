module MscrmControls.SmartAssistAnyEntityControl {
    export class SessionStateManager {
        private static instance: SessionStateManager = null;

        private constructor() {
        }

        public static get Instance(): SessionStateManager {
            if (!SessionStateManager.instance) {
                SessionStateManager.instance = new SessionStateManager();
            }
            return SessionStateManager.instance;
        }

        /**
         * Returns data like this: 
         * {
         *   "<KM SAConfig Id>" : [Ids],
         *   "<Case SAConfig Id>" : [Ids]
         * }
         * @param entityId The record Id.
         */
        getAllRecords(entityId: string): {[key: string]: string[]} {
            const sessionContext = Utility.getCurrentSessionContext();
            return sessionContext.get(entityId);  
        }

        /**
         * Returns for the given entityId and configId
         * @param entityId The record Id.
         * @param configId SAConfig Id.
         */
        getAllRecordsForConfigId(entityId: string, configId: string): string[] {
            const sessionContext = Utility.getCurrentSessionContext();
            const data = sessionContext.get(entityId);
            if (data) {
                return sessionContext.get(entityId)[configId];
            }
            return [];
        }

        /**
         * Stores the given suggestion ids in sessioncontext
         * @param entityId The record Id.
         * @param suggestionIds All the suggestion ids to be cached in session scope.
         */
        createOrUpdateRecord(entityId: string, suggestionIds: { [key: string]: string[] }) {
            // this will create or add suggestionIds into the existing record.
            const sessionContext = Utility.getCurrentSessionContext();
            let cacheData = this.getAllRecords(entityId);
            if (cacheData) {
                const newData = Object.assign({}, cacheData, suggestionIds);
                sessionContext.set(entityId, newData);
            }
            else {
                sessionContext.set(entityId, suggestionIds);
            }
        }

        /**
         * Add the new suggestion Id for the given config id in session context.
         * @param entityId
         * @param configId
         * @param suggestionId
         */
        addRecord(entityId: string, configId:string, suggestionId: string) {
            let cacheData = this.getAllRecords(entityId)[configId];
            if (cacheData) {
                cacheData.push(suggestionId);
            }
            else {
                this.createOrUpdateRecord(entityId, { configId: [suggestionId] });
            }
        }

        /**
         * Delete the suggestionId from the sessionContext.
         * @param entityId The record Id.
         * @param configId SAConfig Id.
         * @param suggestionId The suggestion Id to be removed from the session context.
         */
        deleteRecord(entityId: string, configId: string, suggestionId: string) {
            const sessionContext = Utility.getCurrentSessionContext();
            let cacheData = this.getAllRecords(entityId);
            let dataForConfigType = cacheData[configId];
            let filteredData = dataForConfigType.filter((el) => el !== suggestionId);
            cacheData[configId] = filteredData;
            sessionContext.set(entityId, cacheData);
        }   
    }
}