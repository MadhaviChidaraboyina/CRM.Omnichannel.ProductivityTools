declare module Microsoft.Smartassist.SuggestionProvider {
    /**
     * Interface to define the parameter for SuggestionProvider.
     * */
    interface SuggestionContext {
        controlContext: any;
        tabcontext: any;
    }
    /**
     * Interface to define the API contract for SuggestionProvider.
     * */
    interface SuggestionProvider {
        /**
         * Returns data for smartassist suggestions.
         * @param param SuggestionContext
         */
        getSuggestions(param: SuggestionContext): Array<any>;
    }
}
