/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/// <reference path="../PrivateReferences.ts"/>

module MscrmControls.ProductivityPanel.TPBot {
    export class Utility {
        
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
                const badge = pane.badge && typeof(pane.badge) == 'number'
                    ? pane.badge + notificationNumber
                    : notificationNumber;
                pane.badge = badge <= 0 ? false : badge;
            }
        }
    }
}