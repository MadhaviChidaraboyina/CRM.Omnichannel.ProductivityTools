/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.PanelControl
{
	'use strict';

	export class SessionChangeManager
	{
		private sessionChangeEventData: SessionChangeEventData;
        private sessionContextChanged: (sessionContext: SessionChangeEventData, actionType: string) => any;
        private telemetryLogger: TelemetryLogger;
        private telemetryContext: string;
        private anchorTabContext: any;

        constructor(sessionContextChangeCallback: (sessionContext: any) => any, telemetryLogger: TelemetryLogger)
        {
            this.telemetryLogger = telemetryLogger;
            this.telemetryContext = TelemetryComponents.SessionChangeManager;
			this.sessionContextChanged = sessionContextChangeCallback;
            this.sessionChangeEventData = new SessionChangeEventData();
            this.anchorTabContext = {};

			// initialize with current session id
			this.sessionChangeEventData.newSessionId = this.getCurrentFocusedSessionId();

			this.registerEventHandler();
		}

		public getSessionChangeEventData(): SessionChangeEventData
		{
			return this.sessionChangeEventData;
        }

        public get AnchorTabContext(): any {
            return this.anchorTabContext;
        }

		private registerEventHandler()
		{
			try
			{
                let windowObject = this.getWindowObject();
				windowObject.Xrm.App.sessions.addOnAfterSessionSwitch(this.onSessionSwitched.bind(this));
				windowObject.Xrm.App.sessions.addOnAfterSessionCreate(this.onSessionCreated.bind(this));
				windowObject.Xrm.App.sessions.addOnAfterSessionClose(this.onSessionClosed.bind(this));
			}
			catch (e)
			{
                console.log("error occured" + e);
                let errorParam = new EventParameters();
                errorParam.addParameter("errorObj", JSON.stringify(e));
                this.telemetryLogger.logError(this.telemetryContext, TelemetryComponents.registerEventHandler, e.message, errorParam);
			}
		}

		private onSessionSwitched(event: any)
        {
            setTimeout(() => {
                try {
                    let currentSessionId = event.getEventArgs()._inputArguments.newSessionId;
                    let previousSessionId = event.getEventArgs()._inputArguments.previousSessionId;
                    let sessionContext = Microsoft.AppRuntime.Sessions.getFocusedSession().context;

                    this.sessionChangeEventData.event = SessionEvent.SessionSwitch;
                    this.sessionChangeEventData.prevSessionId = previousSessionId;
                    this.sessionChangeEventData.newSessionId = currentSessionId;

                    if (!Utils.isNullOrUndefined(sessionContext)) {
                        this.anchorTabContext = sessionContext.getTabContext('anchor');
                    }

                    this.sessionContextChanged(this.sessionChangeEventData, Constants.sessionSwitched);
                }
                catch (e) {
                    console.log("error occured" + e);
                    let errorParam = new EventParameters();
                    errorParam.addParameter("errorObj", JSON.stringify(e));
                    this.telemetryLogger.logError(this.telemetryContext, TelemetryComponents.onSessionSwitched, e.message, errorParam);
                }
            });
		}

		private onSessionCreated(event: any)
        {
            setTimeout(() => { 
                try {
                    let createdSessionId = event.getEventArgs()._inputArguments.sessionId;
                    let sessionContext = Microsoft.AppRuntime.Sessions.getFocusedSession().context;

                    this.sessionChangeEventData.event = SessionEvent.SessionCreate;
                    this.sessionChangeEventData.prevSessionId = "Not Available";
                    this.sessionChangeEventData.newSessionId = createdSessionId;

                    if (!Utils.isNullOrUndefined(sessionContext)) {
                        this.anchorTabContext = sessionContext.getTabContext('anchor');
                    }

                    this.sessionContextChanged(this.sessionChangeEventData, Constants.sessionCreated);
                }
                catch (e) {
                    console.log("error occured" + e);
                    let errorParam = new EventParameters();
                    errorParam.addParameter("errorObj", JSON.stringify(e));
                    this.telemetryLogger.logError(this.telemetryContext, TelemetryComponents.onSessionCreated, e.message, errorParam);
                }
            });
		}

		private onSessionClosed(event: any)
        {
            setTimeout(() => {
                try {
                    let closedSessionId = event.getEventArgs()._inputArguments.sessionId;

                    this.sessionChangeEventData.event = SessionEvent.SessionClose;
                    this.sessionChangeEventData.prevSessionId = "Not Available";
                    this.sessionChangeEventData.newSessionId = closedSessionId;

                    this.anchorTabContext = {};

                    this.sessionContextChanged(this.sessionChangeEventData, Constants.sessionClosed);
                }
                catch (e) {
                    console.log("error occured" + e);
                    let errorParam = new EventParameters();
                    errorParam.addParameter("errorObj", JSON.stringify(e));
                    this.telemetryLogger.logError(this.telemetryContext, TelemetryComponents.onSessionClosed, e.message, errorParam);
                }
            });
		}

		public getCurrentFocusedSessionId(): string
		{
			let windowObject = this.getWindowObject();
			try
            {
                return Microsoft.AppRuntime.Sessions.getFocusedSession().sessionId;
			}
			catch (e)
			{
                console.log("error occured" + e);
                let errorParam = new EventParameters();
                errorParam.addParameter("errorObj", JSON.stringify(e));
                this.telemetryLogger.logError(this.telemetryContext, TelemetryComponents.getCurrentFocusedSessionId, e.message, errorParam);
            }
            return "";
		}

		private getWindowObject(): any
		{
			return window.top;
		}
	}


	export class SessionChangeEventData
	{
		constructor() {
			this.event = SessionEvent.Undefined;
			this.prevSessionId = "Not Available";
			this.newSessionId = "Not Available";
		}

		event: SessionEvent;
		prevSessionId: string;
		newSessionId: string;
	}

	export enum SessionEvent
	{
		SessionCreate,
		SessionSwitch,
		SessionClose,
		Undefined
	}
}