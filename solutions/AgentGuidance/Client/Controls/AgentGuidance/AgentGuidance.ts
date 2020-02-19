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
                let productivityToolAgentGuidance = localStorage.getItem(ProductivityToolAgentGuidance.Constants.agentGuidanceDataModel);
                if (this.context.utils.isNullOrUndefined(productivityToolAgentGuidance)) localStorage.setItem(ProductivityToolAgentGuidance.Constants.agentGuidanceDataModel, JSON.stringify({}));
                let windowObject = this.getWindowObject();
                windowObject.Xrm.App.sessions.addOnAfterSessionSwitch(this.onSessionSwitched.bind(this));
                windowObject.Xrm.App.sessions.addOnAfterSessionCreate(this.SetDefaultCardFlag.bind(this));
                windowObject.Xrm.App.sessions.addOnAfterSessionClose(this.onSessionClosed.bind(this));
            }
        }

        private getWindowObject(): any {
            return window.top;
        }

        private getCurrentSessionId(): string {
            return this.getWindowObject().Xrm.App.sessions.getFocusedSession().sessionId;
        }

        private onSessionClosed(event: any) {
            let closingSessionId = event[Constants.eventArgs][Constants.inputArguments].sessionId;
            StateManager.DeleteState(closingSessionId + Constants.isSmartCardAvailable);
        }

        private onSessionSwitched(){
            this.isCardExist = StateManager.getState(this.getCurrentSessionId() + Constants.isSmartCardAvailable);
        }

        //set flag true if smart card available for current session
        private SetCardFlag(flag: boolean) {
            StateManager.SetState(this.getCurrentSessionId() + Constants.isSmartCardAvailable, flag);
        }

        //set flag false if smart card available for new session
        private SetDefaultCardFlag() {
            let check = StateManager.getState(this.getCurrentSessionId() + Constants.isSmartCardAvailable);
            if (this.context.utils.isNullOrUndefined(check)) {
                StateManager.SetState(this.getCurrentSessionId() + Constants.isSmartCardAvailable, false);
            }
        }

		/** 
		 * This function will recieve an "Input Bag" containing the values currently assigned to the parameters in your manifest
		 * It will send down the latest values (static or dynamic) that are assigned as defined by the manifest & customization experience
		 * as well as resource, client, and theming info (see mscrm.d.ts)
		 * @params context The "Input Bag" as described above
		 */
        public updateView(context: Mscrm.ControlData<IInputBag>): Mscrm.Component {
            let controls = [];
            let sessionContextAttributes = context.navigation[Constants.customControlProperties].configuration.Parameters.SessionContext.Attributes;
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
            let agentGuidancePane = [];
            let tools = [];
            this.isCardExist = StateManager.getState(this.getCurrentSessionId() + Constants.isSmartCardAvailable);

            if (sessionContextAttributes.isCallScript || sessionContextAttributes.isSmartassist) {
                agentGuidancePane.push(this.getAgentGuidanceLabel(context));

                if (sessionContextAttributes.isSmartassist) {
                    tools.push(this.getSmartAssistComponent(context, sessionContextAttributes));
                }
                if (sessionContextAttributes.isCallScript) {
                    if (sessionContextAttributes.isSmartassist && this.isCardExist)
                        tools.push(this.toolSeparator());
                    tools.push(this.getCallScriptComponent(context, sessionContextAttributes));
                }

                let agentGuidanceTools = context.factory.createElement(
                    "CONTAINER",
                    {
                        key: Constants.agentGuidanceTools,
                        id: Constants.agentGuidanceTools,
                        style: ControlStyle.agentGuidanceToolsStyle()
                    },
                    tools
                );

                agentGuidancePane.push(agentGuidanceTools);
            }
            else if (!sessionContextAttributes.isCallScript && !sessionContextAttributes.isSmartassist) {
                agentGuidancePane.push(this.getErrorScreen());    
            }

            
            return agentGuidancePane;
        }


        private getErrorScreen(): Mscrm.Component {
                const icon = this.context.factory.createElement("IMG", {
                    id: Constants.agentGuidance_error_icon_id,
                    source: Constants.agentGuidance_error_icon
                    style: {
                        verticalAlign: "middle"
                    }
                });

                const no_item = this.context.factory.createElement(
                    "Label",
                    {
                        id: Constants.agentGuidance_no_item,
                        key: Constants.agentGuidance_no_item,
                        style: ControlStyle.agentGuidanceErrorScreenStyle()
                    },
                    this.context.resources.getString(Constants.noConfigHeaderResourceKey));  

                    const not_configured = this.context.factory.createElement(
                        "Label",
                        {
                            id: Constants.agentGuidance_not_configured,
                            key: Constants.agentGuidance_not_configured,
                            style:{
                                textAlign: "center"
                            }
                        },
                        this.context.resources.getString(Constants.noConfigMessageResourceKey));  


                let errorScreen = this.context.factory.createElement(
                    "CONTAINER",
                    {
                        key: Constants.agentGuidance_error_container,
                        id: Constants.agentGuidance_error_container,
                        style: ControlStyle.agentGuidanceErroContainerStyle()
                    },
                    [icon, no_item, not_configured ]
                );


                return errorScreen;
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
                        paddingTop: "10px"
                    }
                },
                separator);

            return listItem;
        }

        private getAgentGuidanceLabel(context: Mscrm.ControlData<IInputBag>): Mscrm.Component {
            let isRTL = context.client.isRTL;
            let agentGuidanceLabel = context.factory.createElement(
                "TEXT",
                {
                    id: Constants.AgentGuidanceLabel,
                    key: Constants.AgentGuidanceLabel,
                    title: this.context.resources.getString("Agent_Guidance"),
                    style: ControlStyle.agentGuidanceTitleStyle(isRTL),
                },
                this.context.resources.getString(Constants.agentGuidanceResourceKey));
            return agentGuidanceLabel;
        }

        private getCallScriptComponent(context: Mscrm.ControlData<IInputBag>, sessionContextAttributes: any): Mscrm.Component {
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
                style: ControlStyle.CallScriptComponentStyle(sessionContextAttributes.isSmartassist, this.isCardExist)
            };

            return this.context.factory.createElement("CONTAINER", viewProperties, [
                context.factory.createComponent(
                    Constants.callScriptControlId,
                    Constants.callScriptChildId,
                    properties_CallScript
                )]);
        }

        private getSmartAssistComponent(context: Mscrm.ControlData<IInputBag>, sessionContextAttributes: any): Mscrm.Component {
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
                                this.SetCardFlag(value);
                                if (value) {
                                    context.factory[Constants.customControlProperties].configuration.Parameters.SessionContext.Callback(value);
                                }
                                else {
                                    this.context.utils.requestRender();
                                }
                            }, 
                        },
                    },
                }
            };

            const viewProperties: Mscrm.Dictionary = {
                style: ControlStyle.smartAssistComponentStyle(sessionContextAttributes.isCallScript, this.isCardExist)
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

		}
    }
}