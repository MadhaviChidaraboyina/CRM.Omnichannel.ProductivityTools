module MscrmControls.Smartassist.Suggestion {

    /**
     * This interface is used to define the strutural subtyping for the custom action parameters. 
     * */
    export interface CustomActionArgs {

        /**
         * Action parameters defined in adaptivecard template.
         * */
        customActionParams?: any;

        /**
         * Callback to refresh or dismiss a card.
         * */
        refreshCallback?: (args: CardRefreshArgs) => void;
    }

    export enum Action {
        /**
         * To refresh the card
         */
        Refresh,

        /**
         * To dismiss the card.
         */
        Dismiss
    }

    /**
     * Interface for the argument to be passed in refresh callback.
     * */
    export interface CardRefreshArgs {

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