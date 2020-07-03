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
    const enum Action {
        /**
         * To refresh the card
         */
        Refresh = 0,
        /**
         * To dismiss the card.
         */
        Dismiss = 1
    }
    /**
     * Interface for the argument to be passed in refresh callback.
     * */
    interface CardRefreshArgs {
        /**
         * The value should be refresh or dismiss.
         * */
        type: Action;
        /**
         * The data to override.
         * */
        data: any;
    }
}
