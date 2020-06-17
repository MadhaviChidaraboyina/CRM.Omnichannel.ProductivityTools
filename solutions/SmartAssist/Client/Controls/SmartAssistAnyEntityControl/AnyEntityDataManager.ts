module MscrmControls.SmartAssistAnyEntityControl {
    export class AnyEntityDataManager {
        private Suggestions: { [key: string]: any };

        constructor() {
        }

        /**
         * Gets suggestion data records.
         * @param saConfig: Smart Assist configuration for suggestion.
         * @param recordId: Record id to find the suggestion upon.
         * @param fromServer: Force records to fetch from API
         */
        public async getSuggestionsData(saConfig: SAConfig, recordId: string, fromServer: boolean = false) {
            if (!this.Suggestions || fromServer) {
                await this.getSuggestionsDataFromAPI(saConfig, recordId)
            }
            return this.Suggestions;
        }
        /**
         * Gets the suggestion record from provided API.
         * @param saConfig: Smart Assist configuration for suggestion.
         * @param RecordId: Record id to find the suggestion upon.
         */
        private async getSuggestionsDataFromAPI(saConfig: SAConfig, RecordId: string) {
            // TODO: fetch data from API - Logic           
            var caseMockData = [
                {
                    "SuggestionId": "f14277ca-4fab-48fc-9a22-205adea7d8aa",
                    "Rank": 1,
                    "ConfidenceScore": 82.3,
                    "Tags": ["Tag-Value-1", "Tag-Value-2"],
                    "TargetIncidentId": "825e8824-93c1-439d-98fc-9fe751a6aa6b",
                    "Title": "Printer does not work",
                    "Description": "Post replacing the color refill, the printer has stopped working.",
                    "StateCode": 5,
                    "CreatedOn": "2020-05-20T04:24:34Z",
                    "OwnerId": "16bbd4a6-5a4c-ea11-a815-000d3a30f195",
                    "OwnerName": "Salini Saha",
                    "ResolvedSubject": "Resetting the color cartridge, updating printer drivers, resolved the issue for customer.",
                    "ResolvedOn": "2020-06-09T19:42:15Z",
                    "ResolvedById": "56a382d2-69a1-4390-a247-e96e9165c6b9",
                    "ResolvedByName": "John Doe Sr",
                    "IsLinked": false
                },
                {
                    "SuggestionId": "f14277ca-4fab-48fc-9a22-205adea7d123",
                    "Rank": 1,
                    "ConfidenceScore": 82.3,
                    "Tags": ["Tag-Value-1", "Tag-Value-2"],
                    "TargetIncidentId": "825e8824-93c1-439d-98fc-9fe751a6aa6b",
                    "Title": "Printer does not work",
                    "Description": "Post replacing the color refill, the printer has stopped working.",
                    "StateCode": 5,
                    "CreatedOn": "2020-05-20T04:24:34Z",
                    "OwnerId": "16bbd4a6-5a4c-ea11-a815-000d3a30f195",
                    "OwnerName": "John Doe",
                    "ResolvedSubject": "Resetting the color cartridge, updating printer drivers, resolved the issue for customer.",
                    "ResolvedOn": "2020-06-09T19:42:15Z",
                    "ResolvedById": "56a382d2-69a1-4390-a247-e96e9165c6b9",
                    "ResolvedByName": "John Doe Sr",
                    "IsLinked": false
                }
            ];
            var kmMockData = [{
                SuggestionId: "54321",
                title: "Test Title2",
                description: "test Description",
                filterActionTag: "Published",
                new_confidencescore: "",
                PublishAction: true
            },
            {
                SuggestionId: "123",
                title: "Test Title1",
                description: "test Description",
                filterActionTag: "Published",
                new_confidencescore: "",
                PublishAction: false
            }];

            this.Suggestions = {};
            if (saConfig.SuggestionType == SuggestionType.KnowledgeArticleSuggestion) {
                this.Suggestions[saConfig.SmartassistConfigurationId] = kmMockData;
            }
            else {
                this.Suggestions[saConfig.SmartassistConfigurationId] = caseMockData;
            }

        }

        /**
         * Gets the Recommendartion record from provided API.
         * @param saConfig: Smart Assist configuration for recommendation.
         * @param RecordId: Record id to find the recommendation upon.
         */
        public async getRecommendationsDataFromResource_notInUse(saConfig: SAConfig, RecordId: string) {
            let endpoint = "";
            switch (saConfig.SuggestionType) {
                case SuggestionType.KnowledgeArticleSuggestion:
                    break;
                case SuggestionType.SimilarCaseSuggestion:
                    break;
                default:
            }
            try {
                var response = "" as any; //await Utility.callWebApi(endpoint, HttpVerbs.GET, null);
                this.Suggestions = {};
                this.Suggestions[saConfig.SmartassistConfigurationId] = response;
                //TODO: Add telemetry
            } catch (error) {
                //TODO: Add telemetry
                console.log(error);
            }
        }
    }
}