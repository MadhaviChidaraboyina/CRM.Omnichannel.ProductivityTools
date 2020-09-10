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
        /**
         * PCF control context
         * */
        controlContext?: any;
    }
    const enum Action {
        /**
         * To refresh the card
         */
        Refresh = 0,
        /**
         * To dismiss the card.
         */
        Dismiss = 1,
        /**
         * To update data in cache.
         * */
        CacheUpdate = 2
    }
    const enum CustomActionType {
        /**
         * Action added on the card's body.
         * */
        PrimaryAction = 1,
        /**
         * Popup actions
         * */
        PopupAction = 2
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
        /**
         * CustomAction's type.
         * */
        actionType?: CustomActionType;
    }
    interface CustomActionReturn {
        /**
         * Success/Error message on resolving the action
         * */
        notificationMessage?: string;
        /**
         * Telemetry details to log
         * */
        telemetryContext: TelemetryContext;
    }
    interface TelemetryContext {
        /**
         * Telemetry parameter
         * */
        telemetryParameters: TelemetryParameter;
        /**
         * Additional telemetry parameter if any
         * */
        additionalTelemetryParameters?: {
            [name: string]: string;
        };
    }
    interface TelemetryParameter {
        /**
         * Suggested entity id.
         * */
        suggestedEntityId: string;
        /**
         * Entity logical name for suggested entity id.
         * */
        suggestedEntityLogicalName: string;
        /**
         * Webresource name
         * */
        sourceType: string;
        /**
         * Custom Action's name
         * */
        interactionType: string;
        /**
         * Exception if any
         * */
        exception?: any;
    }
}
