/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/// <reference path="privatereferences.ts"/>
/// <reference path="utils/TelemetryLogger.ts"/>

module MscrmControls.ProductivityToolAgentGuidance {
	'use strict';

    export class AgentGuidance implements Mscrm.Control<IInputBag, IOutputBag> {


		private initCompleted: boolean;
        private context: Mscrm.ControlData<IInputBag>;
        private telemetryContext: string;
        private telemetryLogger: TelemetryLogger;
        private isCardExist: boolean;
		/**
		 * Constructor.
		 */
        constructor() {
            this.isCardExist = false;
            this.initCompleted = false;
            this.telemetryContext = TelemetryComponents.MainComponent;
		}

		/**
		 * This function should be used for any initial setup necessary for your control.
		 * @params context The "Input Bag" containing the parameters and other control metadata.
		 * @params notifyOutputchanged The method for this control to notify the framework that it has new outputs
		 * @params state The user state for this control set from setState in the last session
		 * @params container The div element to draw this control in
		 */
		public init(context: Mscrm.ControlData<IInputBag>, notifyOutputChanged: () => void, state: Mscrm.Dictionary): void
        {
            if (this.initCompleted == false) {
				this.context = context;
                this.initCompleted = true;
                this.telemetryLogger = new TelemetryLogger(context);
                let params = new EventParameters();
                this.telemetryLogger.logSuccess(this.telemetryContext, "Init", params);
                localStorage.setItem(Constants.agentGuidanceDataModel, JSON.stringify({}));
            }
        }

        private getWindowObject(): any {
            return window.top;
        }

        private SetDefaultCardFlag() {
            let check = StateManager.getState(this.getCurrentSessionId() + Constants.isSmartCardAvailable);
            if (this.context.utils.isNullOrUndefined(check)) {
                StateManager.SetState(this.getCurrentSessionId() + Constants.isSmartCardAvailable, false);
            }
        }

        private getCurrentSessionId(): string {
            return this.getWindowObject().Xrm.App.sessions.getFocusedSession().sessionId;
        }

        private SetCardFlag(flag: boolean) {
            StateManager.SetState(this.getCurrentSessionId() + Constants.isSmartCardAvailable, flag);
        }

		/** 
		 * This function will recieve an "Input Bag" containing the values currently assigned to the parameters in your manifest
		 * It will send down the latest values (static or dynamic) that are assigned as defined by the manifest & customization experience
		 * as well as resource, client, and theming info (see mscrm.d.ts)
		 * @params context The "Input Bag" as described above
		 */
        public updateView(context: Mscrm.ControlData<IInputBag>): Mscrm.Component {
            this.SetDefaultCardFlag();
            let controls = [];
            let sessionContextAttributes = context.factory[Constants.customControlProperties].configuration.Parameters.SessionContext.Attributes;
            controls = this.getAgentGuidanceTools(context, sessionContextAttributes);

			return context.factory.createElement(
				"CONTAINER",
                {
                    key: Constants.agentGuidanceControlKey,
                    id: Constants.agentGuidanceControlKey,
                    style: ControlStyle.agentGuidanceContainerStyle(),
                },
                controls
			);
            
        }

        private getAgentGuidanceTools(context: Mscrm.ControlData<IInputBag>, sessionContextAttributes: any): Mscrm.Component[] {
            let listItems = [];
            this.isCardExist = StateManager.getState(this.getCurrentSessionId() + Constants.isSmartCardAvailable);

            if (sessionContextAttributes.isCallScript || sessionContextAttributes.isSmartassist){
                listItems.push(this.getAgentGuidanceLabel(context));
            }
            if (sessionContextAttributes.isSmartassist){
                listItems.push(this.getSmartScriptCompoment(context));
            } 
            if (sessionContextAttributes.isCallScript){
                if(sessionContextAttributes.isSmartassist && this.isCardExist)
                    listItems.push(this.toolSeparator());
                listItems.push(this.getCallScriptCompoment(context));
            } 
            
            return listItems;
        }

        private toolSeparator(): Mscrm.Component {
            const separator = this.context.factory.createElement(
                "Label",
                {
                    id: Constants.toolSeparatorId,
                    key: Constants.toolSeparatorId,
                    style: ControlStyle.toolSeparatorStyle()
                },
                Constants.EmptyString);

            const listItem = this.context.factory.createElement(
                "CONTAINER",
                {
                    id: `${Constants.toolSeparatorId}`,
                    key: `${Constants.toolSeparatorId}`,
                    style: {
                        paddingTop: "30px"
                    }
                },
                separator);

            return listItem;
        }

        private getAgentGuidanceLabel(context: Mscrm.ControlData<IInputBag>): Mscrm.Component {
            
            let agentGuidanceLabel = context.factory.createElement(
                "TEXT",
                {
                    id: Constants.AgentGuidanceLabel,
                    key: Constants.AgentGuidanceLabel,
                    title: this.context.resources.getString("Agent_Guidance"),
                    style: ControlStyle.agentGuidanceTitleStyle(),
                },
                this.context.resources.getString(Constants.agentGuidanceResourceKey));
            return agentGuidanceLabel;
        }

        private getCallScriptCompoment(context: Mscrm.ControlData<IInputBag>): Mscrm.Component {
            let sessionContextJSON = "";
            let paramValue = context.factory[Constants.customControlProperties].configuration.Parameters.SessionContext;
            if (!this.context.utils.isNullOrUndefined(paramValue))
                sessionContextJSON = paramValue.Value;
            const properties_CallScript: any = {
                parameters: {},
                key: Constants.callScriptControlKey,
                id: Constants.callScriptControlKey,
                configuration: {
                    CustomControlId: Constants.callScriptControlId,
                    Name: Constants.callScriptControlName,
                    Parameters: {
                        SessionContext: {
                            Usage: 1,
                            Static: true,
                            Value: sessionContextJSON,
                            Primary: false,
                        }
                    },
                }
            };

            const viewProperties: Mscrm.Dictionary = {
                style: {
                        paddingRight: "2px",
                        paddingLeft: "2px"
                }
            };

            return this.context.factory.createElement("CONTAINER", viewProperties, [
                context.factory.createComponent(
                    Constants.callScriptControlId,
                    Constants.callScriptChildId,
                    properties_CallScript
                )]);
        }

        private getSmartScriptCompoment(context: Mscrm.ControlData<IInputBag>): Mscrm.Component {
            this.isCardExist = StateManager.getState(this.getCurrentSessionId() + Constants.isSmartCardAvailable);
            let sessionContextJSON = "";
            let paramValue = context.factory[Constants.customControlProperties].configuration.Parameters.SessionContext;
            if (!this.context.utils.isNullOrUndefined(paramValue))
                sessionContextJSON = paramValue.Value;
            const properties_smartassist: any = {
                parameters: {},
                key: Constants.smartAssistControlKey,
                id: Constants.smartAssistControlKey,
                configuration: {
                    CustomControlId: Constants.smartAssistControlId,
                    Name: Constants.smartAssistControlName,
                    Parameters: {
                        SessionContext: {
                            Usage: 1,
                            Static: true,
                            Value: sessionContextJSON,
                            Primary: false,
                            Attributes: {},
                            Callback: (value: any) => {
                                if (value) {
                                    this.SetCardFlag(value);
                                    context.factory[Constants.customControlProperties].configuration.Parameters.SessionContext.Callback(value);
                                    this.context.utils.requestRender();
                                }
                            }, 
                        },
                    },
                }
            };

            const viewProperties: Mscrm.Dictionary = {
                style: {
                    paddingLeft: "14px",
                    paddingRight: "4px",
                    marginTop: "10px",
                }
            };

            return this.context.factory.createElement("CONTAINER", viewProperties, [
                context.factory.createComponent(
                    Constants.smartAssistControlId,
                    Constants.smartScriptChildId,
                    properties_smartassist
                )]);
        }

		/** 
		 * This function will return an "Output Bag" to the Crm Infrastructure
		 * The ouputs will contain a value for each property marked as "input-output"/"bound" in your manifest 
		 * i.e. if your manifest has a property "value" that is an "input-output", and you want to set that to the local variable "myvalue" you should return:
		 * {
		 *		value: myvalue
		 * };
		 * @returns The "Output Bag" containing values to pass to the infrastructure
		 */
		public getOutputs(): IOutputBag {
			// custom code goes here - remove the line below and return the correct output
			return null;
		}

		/**
		 * This function will be called when the control is destroyed
		 * It should be used for cleanup and releasing any memory the control is using
		 */
		public destroy(): void	{
            delete localStorage[Constants.agentGuidanceDataModel];
		}
    }
}