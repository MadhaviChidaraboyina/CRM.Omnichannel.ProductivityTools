module Microsoft.Smartassist.SuggestionProvider {

    /**
     * Interface to define the parameter for SuggestionProvider. 
     * */
    export interface SuggestionContext {
        controlContext: any;
        tabcontext: any
    }

    /**
     * Interface to define the API contract for SuggestionProvider.
     * */
    export interface SuggestionProvider {

        /**
         * Returns data for smartassist suggestions.
         * @param param SuggestionContext
         */
        getSuggestions(param: SuggestionContext): Promise<Array<any>>;
        getSuggestionLocalizationProvider(): Promise<string>;
    }
}