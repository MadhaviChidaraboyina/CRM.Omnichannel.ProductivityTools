declare module MscrmControls.Smartassist.Suggestion {
    /**
     * This interface is used to define the strutural subtyping for the custom action parameters.
     * */
    interface CustomActionArgs {
        /**
         * Action parameters defined in adaptivecard template.
         * */
        customActionParams?: any;
        /**
         * Callback to refresh or dismiss a card.
         * */
        refreshCallback?: (args: CardRefreshArgs) => void;
    }
    type action = "refresh" | "dismiss";
    /**
     * Interface for the argument to be passed in refresh callback.
     * */
    interface CardRefreshArgs {
        /**
         * The value should be refresh or dismiss.
         * */
        type: action;
        /**
         * The data to override.
         * */
        data: any;
    }
}
