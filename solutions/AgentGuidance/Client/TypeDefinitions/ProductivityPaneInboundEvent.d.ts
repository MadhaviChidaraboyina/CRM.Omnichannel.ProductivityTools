/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
declare module MscrmControls.PanelControl {
    /**
     *  This is the name of custom event, it should be used to send information to Prodcutivity Panel.
     */
    const PanelInboundEventName = "MessageToPanel";
    /**
     * PanelOperation defins the operation type that is requested by child control to execute in Productivity Panel
    */
    type PanelOperations = PanelNotification | Rerender | NoInformation;
    /**
     *  This class represents the data model to be used to pass data to panel via custom event in 'detail'.
     */
    class PanelInboundEventDataModel {
        requestingControlName: string;
        panelOperation: PanelOperations;
        constructor(controlName: string, operation: PanelOperations);
    }
    /**
     *  This is the operation for Notification, it should be used when child control wants to inform Productivity Panel that it has some notification.
     *  Number of notifications must be passed in notificationNumber attribute.
     *  SessionId of the session for which notification is generated must be passed in sessionId attribute.
     */
    class PanelNotification {
        notificationNumber: number;
        sessionId: string;
        constructor(notificaitonNo: number, sessionid: string);
    }
    /**
     *  This Operation is for rerendering Productivity Panel control.
     */
    class Rerender {
        constructor();
    }
    /**
     *  This operation to inform Productivity Panel that there is no configuration set for respective child control.
     */
    class NoInformation {
        constructor();
    }
}
