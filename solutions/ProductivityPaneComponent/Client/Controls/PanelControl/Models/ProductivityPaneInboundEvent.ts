/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.PanelControl {
    'user strict'

    /**
     *  This is the name of custom event, it should be used to send information to Prodcutivity Panel.
     */
    export const PanelInboundEventName = "MessageToPanel";

    /**
     * PanelOperation defins the operation type that is requested by child control to execute in Productivity Panel 
    */
    export type PanelOperations = PanelNotification
        | Rerender;

    
    /**
     *  This class represents the data model to be used to pass data to panel via custom event in 'detail'. 
     */
    export class PanelInboundEventDataModel {
        requestingControlName: string;
        panelOperation: PanelOperations;

        constructor(controlName: string, operation: PanelOperations) {
            this.requestingControlName = controlName;
            this.panelOperation = operation;
        }
    }

    /**
     *  This is the operation for Notification, it should be used when child control wants to inform Productivity Panel that it has some notification. 
     *  Number of notifications must be passed in notificationNumber attribute. 
     *  SessionId of the session for which notification is generated must be passed in sessionId attribute.
     */
    export class PanelNotification {

        notificationNumber: number;
        sessionId : string;

        constructor(notificaitonNo: number, sessionid: string) {
            this.notificationNumber = notificaitonNo;
            this.sessionId = sessionid;
        }
    }

    /**
     *  This Operation is for rerendering Productivity Panel control.
     *  noData Attribute defines whether the requesting child control has data or not.
     *  sessionId of the session for which noData event is raised.
     */
    export class Rerender {
        noData:boolean;
        sessionId : string;
        constructor(id:string,nodata:boolean = false) {
            this.noData = nodata;
            this.sessionId = id;
        }
    }
}