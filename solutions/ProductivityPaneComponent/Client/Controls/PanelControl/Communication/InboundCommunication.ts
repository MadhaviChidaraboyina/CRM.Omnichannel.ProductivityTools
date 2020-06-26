/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../inputsOutputs.g.ts"/>
/// <reference path="../Models/ProductivityPaneInboundEvent.ts"/>
/// <refernece path="../utils/Constants.ts" />
/// <reference path="../PanelStateManager/PanelState.ts" />

module MscrmControls.PanelControl {

    export class InboundCommunication {
        private context: Mscrm.ControlData<IInputBag>; 

        constructor(context: Mscrm.ControlData<IInputBag>) {
            this.context = context;
        }

        public requestRerender(data : PanelInboundEventDataModel,currentSessionId : string, productivityPaneConfig : ProductivityPaneConfig): void{
            let controlName = data.requestingControlName;
            let _panelOperation = (data.panelOperation as Rerender);
            let noData = _panelOperation.noData;
            let sessionId = _panelOperation.sessionId;
            let doCollpse : boolean = undefined;

            if (sessionId == undefined ){
                sessionId = currentSessionId;
            }

            if(Microsoft.AppRuntime.Sessions.getAll().indexOf(sessionId)<0){
                return;
            }

            if(sessionId == Constants.homeSessionId){
                return;
            }
            
            let sessionData = PanelState.getState(sessionId + LocalStorageKeyConstants.sessionData);  
            if(sessionData[LocalStorageKeyConstants.hasData+controlName] == !noData){
                return;
            }

            sessionData[LocalStorageKeyConstants.hasData+controlName] = !noData;
            if(!sessionData.isCollapsedByUser){
                for (let tool of productivityPaneConfig.productivityToolsConfig.ToolsList) {
                    doCollpse = doCollpse || sessionData[LocalStorageKeyConstants.hasData+tool.toolControlName];
                }
                sessionData.panelToggle = (noData && !doCollpse) ? false : (true && productivityPaneConfig.productivityPaneMode);
            }
            PanelState.SetState(sessionId+LocalStorageKeyConstants.sessionData,sessionData);

            if(sessionId == currentSessionId && !sessionData.isCollapsedByUser )
            {
                this.context.utils.requestRender();
            }  
        }

        public handleNotification(data : PanelInboundEventDataModel,currentSessionId : string, selectedControlName : string){
            let controlName = data.requestingControlName;
            let notificationNumber = (data.panelOperation as PanelNotification).notificationNumber;
            let sessionId = (data.panelOperation as PanelNotification).sessionId;

            if(notificationNumber == undefined){
                return;
            }

            if(sessionId == undefined) {
                sessionId = currentSessionId;
            }

            if(Microsoft.AppRuntime.Sessions.getAll().indexOf(sessionId)<0){
                return;
            }

            if( sessionId == Constants.homeSessionId || (sessionId == currentSessionId && controlName == selectedControlName)){
                return;
            }

            let sessionNotifications = PanelState.getState(sessionId+LocalStorageKeyConstants.notificationCount);
            if(sessionNotifications == undefined){
                sessionNotifications={};
            }

            if(sessionNotifications.hasOwnProperty(controlName) && !this.context.utils.isNullOrUndefined(sessionNotifications[controlName]) ){
                let _notification = sessionNotifications[controlName] + notificationNumber;
                sessionNotifications[controlName] = _notification < 0 ? 0 : _notification;
            }
            else {
                sessionNotifications[controlName] = notificationNumber < 0 ? 0 : notificationNumber;
            }

            PanelState.SetState(sessionId+LocalStorageKeyConstants.notificationCount,sessionNotifications);

            if(sessionId == currentSessionId){
                this.context.utils.requestRender();
            }            
        }

    }
}
