/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="InboundCommunication.ts"/>
/// <reference path="../Models/ProductivityPaneInboundEvent.ts"/>
/// <reference path="../Models/ProductivityPaneConfig.ts"/>
/// <reference path="../utils/Constants.ts"/>

module MscrmControls.PanelControl {

    export class EventManager {
        private context: Mscrm.ControlData<IInputBag>; 
        private inboundCommunication: InboundCommunication;
        private currentSessionId : string;
        private selectedTool : string;
        private productivityPaneConfigData : ProductivityPaneConfig;

        constructor(context: Mscrm.ControlData<IInputBag>, panelState: PanelState) {
            this.context = context
            this.inboundCommunication = new InboundCommunication(this.context, panelState);
            window.top.addEventListener(MscrmControls.PanelControl.PanelInboundEventName, this.inboundMessage.bind(this), false);
            this.selectedTool = "";
            this.productivityPaneConfigData = undefined;
        }

        public set CurrentSessionId(id:string){
            this.currentSessionId = id;
        }
        public set SelectedTool(tool:string){
            this.selectedTool = tool;
        }
        public set ProductivityPaneConfigData(paneConfigData:ProductivityPaneConfig){
            this.productivityPaneConfigData = paneConfigData;
        }

        private inboundMessage(event: CustomEvent) {

            try {
                let data: any = event.detail;

                if (this.context.utils.isNullOrUndefined(data) || 
                    !data.hasOwnProperty(InboundEventPropName.requestingControlName)  || this.context.utils.isNullOrUndefined(data.requestingControlName) ||  
                    !data.hasOwnProperty(InboundEventPropName.panelOperation) || this.context.utils.isNullOrUndefined(data.panelOperation) ) {
                    return;
                }

                if(!this.isChildControl(data.requestingControlName)){
                    return;
                }

                switch(data.panelOperation.constructor.name) {
                    case EventOperation.Rerender:
                        this.inboundCommunication.requestRerender(data,this.currentSessionId,this.productivityPaneConfigData);
                        break;
                    case EventOperation.PanelNotification:
                         this.inboundCommunication.handleNotification(data,this.currentSessionId,this.selectedTool);
                         break;
                    default:
                        return;
                }
            }
            catch (e) {
                return;
            }
        }


       private isChildControl(controlName : string) {
            if(this.productivityPaneConfigData != undefined){
                    for (let tool of this.productivityPaneConfigData.productivityToolsConfig.ToolsList) {
                        if (tool.toolControlName === controlName) {
                            return true;
                        }
                    };     
            }
            return false;        
       }

    }

}
