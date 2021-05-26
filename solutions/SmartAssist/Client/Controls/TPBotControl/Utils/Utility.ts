/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="../PrivateReferences.ts"/>

module MscrmControls.ProductivityPanel.TPBot {
    export class Utility {

        /**
         * Dispatch pp notification event
         * @param notificationNumber: notification count
         */
        public static DispatchPaneNotificationEvent(notificationNumber: number) {
            var sessionId = Microsoft.AppRuntime.Sessions.getFocusedSession().sessionId;
            let panelOperation = new MscrmControls.PanelControl.PanelNotification(notificationNumber, sessionId);
            this.DispatchPanelInboundEvent(panelOperation);
        }

        /**
         * Dispatch no data event to PP 
         * @param noData:No data flag
         */
        public static DispatchNoDataEvent(noData: boolean = true) {
            var sessionId = Microsoft.AppRuntime.Sessions.getFocusedSession().sessionId;
            let panelOperation = new MscrmControls.PanelControl.Rerender(sessionId, noData);
            this.DispatchPanelInboundEvent(panelOperation);
        }

        /**
         * Dispatches Productivity Panel In Bound Event
         * @param panelOperation: panel operation type object
         */
        private static DispatchPanelInboundEvent(panelOperation: MscrmControls.PanelControl.PanelNotification | MscrmControls.PanelControl.Rerender) {
            let eventPayload = new MscrmControls.PanelControl.PanelInboundEventDataModel(TPBot.Constants.PPChildControlId, panelOperation);
            let event = new CustomEvent(MscrmControls.PanelControl.PanelInboundEventName, { "detail": eventPayload });
            window.top.dispatchEvent(event);
        }

        /**
         * Update app side pane badge
         * @param notificationNumber: notification count
         */
         public static updateBadge(notificationNumber: number) {
            // Don't update badge if current pane is smart assist and is expanded
            if (Xrm.App.sidePanes.getSelectedPane().paneId === Constants.SmartAssistPaneId &&
                Xrm.App.sidePanes.state == XrmClientApi.Constants.SidePanesState.Expanded) {
                return;
            }

            const pane = Xrm.App.sidePanes.getPane(Constants.SmartAssistPaneId);
            // If app side pane ID does not exist, getPane() returns undefined. 
            if (pane) {
                const badge = pane.badge && typeof(pane.badge) == 'number' ?
                    pane.badge + notificationNumber : notificationNumber;
                pane.badge = badge <= 0 ? false : badge;
            }
        }

        /**
        * Indicate if smart assist control is rendered in app side pane
        * @param context: PCF control context
        */
        public static isUsingAppSidePane(context: any): boolean {
            return context.utils.isFeatureEnabled(Constants.FCB_ProductivityTools_UseAppSidePanes);
        }
    }
}