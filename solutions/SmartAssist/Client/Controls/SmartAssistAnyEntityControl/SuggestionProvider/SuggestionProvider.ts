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
        getSuggestions(param: SuggestionContext): Promise<Array<any> | SuggestionError>;
        getSuggestionLocalizationProvider(): Promise<string>;
    }

    /**
     * Interface to define SuggestionError for getSuggestions.
     * */
    export interface SuggestionError {
        /**
         * display message on rejecting the request
         * */
        displayMessage?: string
        /**
         * Exception if any
         * */
        exception?: any
    }
}