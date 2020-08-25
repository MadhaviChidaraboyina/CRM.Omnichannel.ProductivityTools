/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.SmartAssistAnyEntityControl {
    export class SuggestionCachePoolForSession {
        public suggestionsForEntityIds: { [key: string]: SuggestionCachePoolForEntity } = {}; // Key is the recordId
    }

    export class SuggestionCachePoolForEntity {
        public suggestionsForConfig: { [key: string]: any[] } = {}; // Key is the configId
    }
}