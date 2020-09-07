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
        private panelState: PanelState;

        constructor(context: Mscrm.ControlData<IInputBag>, panelState: PanelState) {
            this.context = context;
            this.panelState = panelState;
        }

        public requestRerender(data : PanelInboundEventDataModel,currentSessionId : string, productivityPaneConfig : ProductivityPaneConfig): void{
            let controlName = data.requestingControlName;
            let _panelOperation = (data.panelOperation as Rerender);
            let noData = _panelOperation.noData;
            let sessionId = _panelOperation.sessionId;
            let doCollpse : boolean = undefined;
            let toolWithData: string = undefined;
            let toolControlNameInFocus: string = undefined;

            if (sessionId == undefined ){
                sessionId = currentSessionId;
            }

            if(Microsoft.AppRuntime.Sessions.getAll().indexOf(sessionId)<0){
                return;
            }

            if(sessionId == Constants.homeSessionId){
                return;
            }
            
            let sessionData = this.panelState.getState(sessionId + LocalStorageKeyConstants.sessionData);  
            if(sessionData[LocalStorageKeyConstants.hasData+controlName] == !noData){
                return;
            }

            sessionData[LocalStorageKeyConstants.hasData+controlName] = !noData;
            for (let tool of productivityPaneConfig.productivityToolsConfig.ToolsList) {
                doCollpse = doCollpse || sessionData[LocalStorageKeyConstants.hasData + tool.toolControlName];
                if (tool.toolName === sessionData.productivityToolSelected) {
                    toolControlNameInFocus = tool.toolControlName;
                }
                if (sessionData[LocalStorageKeyConstants.hasData + tool.toolControlName] && this.context.utils.isNullOrUndefined(toolWithData)) {
                    toolWithData = tool.toolName;
                }
            }

            if (!sessionData.isCollapsedByUser) {
                sessionData.panelToggle = (noData && !doCollpse) ? false : (true && (productivityPaneConfig.productivityPaneMode || sessionData.isToggledByUser));
            }

            // if control in focus doesnt have data and atleast one control has data to show, then change focus
            if (!sessionData[LocalStorageKeyConstants.hasData + toolControlNameInFocus] && // check if focused control has no data
                !this.context.utils.isNullOrUndefined(toolWithData) && // check if there is a control with data
                doCollpse && // true if a control has data, false if no control has data
                ((toolControlNameInFocus != controlName && !noData) || // check if another control has sent noData(false)
                  toolControlNameInFocus == controlName && noData)) // OR focus control has sent noData(true)
                { 
                    sessionData.productivityToolSelected = toolWithData;
                    this.context.utils.requestRender();
                }
            this.panelState.SetState(sessionId+LocalStorageKeyConstants.sessionData,sessionData);

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

            let sessionNotifications = this.panelState.getState(sessionId+LocalStorageKeyConstants.notificationCount);
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

            this.panelState.SetState(sessionId+LocalStorageKeyConstants.notificationCount,sessionNotifications);

            if(sessionId == currentSessionId){
                this.context.utils.requestRender();
            }            
        }

    }
}
