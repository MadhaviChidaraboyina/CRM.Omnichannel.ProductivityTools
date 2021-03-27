/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

module MscrmControls.ProductivityPanel.TPBot {
    export class Utility {
        /**
         * Dispatch pp notification event
         * @param notificationNumber: notification count
         */
        public static updateBadge(notificationNumber: number) {
            const pane = Xrm.App.sidePanes.getPane(Constants.SmartAssistPaneId);
            notificationNumber == 0 ? pane.clearBadge() : pane.setBadge(notificationNumber);
        }
    }
}