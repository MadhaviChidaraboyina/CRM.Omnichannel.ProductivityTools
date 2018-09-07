/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="Constants.ts" />
/// <reference path="WebClient.ts" />
/// <reference path="WidgetIFrame.ts" />
/// <reference path="../PostMsgWrapper.ts" />
/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.0.2474-manual/clientapi/XrmClientApi.d.ts" />

namespace Microsoft.CIFramework.Internal {
	/**
	 * type defined for storing all local information at one place. 
	*/
    export type IState =
        {
            /**
             * this will refer to the actual IClient implementation based on the type of client CI library is loaded on
            */
            client: IClient;

            /**
             *  Map to store providers information. key'ed on landing urls
            */
            ciProviders: Map<string, CIProvider>;

            /**
             *  Information about current active sessions
            */
            sessionManager: SessionInfo;

            /**
             * Post message wrapper object
             */
            messageLibrary: postMessageNamespace.postMsgWrapper;
        }

    export class SessionInfo {
        _activeProvider: CIProvider;

        setActiveProvider(provider: CIProvider): Promise<Map<string, any>> {
            if (this._activeProvider != provider) {
                //TODO check if it is okay to switch provider
                //if no, reject the promise
                //if yes, switch the providers
                let oldProvider: CIProvider = this._activeProvider;
                this._activeProvider = provider;
                if (oldProvider) {
                    oldProvider.raiseEvent(new Map<string, any>().set(Constants.value, 0), MessageType.onModeChanged);    //TODO: replace 0 with named constant
                }
                if (this._activeProvider) {
                    this._activeProvider.raiseEvent(new Map<string, any>().set(Constants.value, 1), MessageType.onModeChanged);    //TODO: replace with named constant
                }
            }
            return Promise.resolve(new Map<string, any>().set(Constants.value, true));    //TODO: Session manager needs to eval whether it is feasibile to change session and resolve or reject the promise
        }
        getActiveProvider(): CIProvider {
            return this._activeProvider;
        }
    }
    /*Class to store CI providers information locally*/
    export class CIProvider {
        providerId: string;			//Widget id
        name: string; 				// Widget Providers name
        label: string;					// Label of the Widget
        landingUrl: string;
        _state: IState;
        widgetHeight: number; 	// Height of the widget Panel
        widgetWidth: number;	//Width of the widget Panel
        _minimizedHeight: number;
        clickToAct: boolean;		//Boolean flag to enable or disable Click to act functionality , it can be changed through setClickToAct API
        _widgetContainer: WidgetContainer;  //The iFrame hosting this widget
        currentMode: number;
        sortOrder : string;	//Sort Order
        apiVersion : string;	//API Version
        orgId : string;	//Organization ID
        orgName : string;	//Organization Name
        crmVersion : string;	//CRM version
        appId : string;	//App Id
        constructor(x: XrmClientApi.WebApi.Entity, state: IState, environmentInfo: any) {
            this._state = state;
            this.name = x[Constants.name];
            this.providerId = x[Constants.providerId];
            this.label = x[Constants.label];
            this.landingUrl = x[Constants.landingUrl];
            this.widgetHeight = x[Constants.widgetHeight] || 0;
            this.widgetWidth = x[Constants.widgetWidth] || 0;
            this.clickToAct = x[Constants.clickToActAttributeName];
            this._widgetContainer = null;
            this.currentMode = 0;
            this.sortOrder = x[Constants.SortOrder];
            this.apiVersion = x[Constants.APIVersion];
            this.orgId = environmentInfo["orgId"];
            this.orgName = environmentInfo["orgName"];
            this.crmVersion = environmentInfo["crmVersion"];
            this.appId = environmentInfo["appId"];
        }
        raiseEvent(data: Map<string, any>, messageType: string): void {
            const payload: postMessageNamespace.IExternalRequestMessageType = {
                messageType: messageType,
                messageData: JSON.stringify(Microsoft.CIFramework.Utility.buildEntity(data))
            }
            switch (messageType) {
                case MessageType.onModeChanged:
                    this.setMode(data.get(Constants.value) as number);
                    break;
                case MessageType.onClickToAct:
                    if (!this.clickToAct) {
                        return;
                    }
            }
            if (!this.getContainer()) {
                return;
            }
            this._state.messageLibrary.postMsg(this.getContainer().getContentWindow(), payload, this.landingUrl, true);
        }
        getContainer(): WidgetContainer {
            return this._widgetContainer;
        }
        setContainer(container: WidgetContainer, defaultWidth: number, defaultHeight: number, minimizedHeight: number): void {
            this._widgetContainer = container;
            this._minimizedHeight = minimizedHeight;
            if (!this.widgetWidth) {
                this.setWidth(defaultWidth);
            }
            if (!this.widgetHeight) {
                this.setHeight(defaultHeight);
            }
        }
        updateContainerSize(): Promise<Map<string, any>> {
            let container = this.getContainer();
            let ret: boolean = false;
            if (container) {
                ret = container.setHeight(this.getHeight()) && container.setWidth(this.getWidth());
            }
            return Promise.resolve(new Map<string, any>().set(Constants.value, ret));
            /*if (ret) {
                return Promise.resolve(new Map<string, any>());
            }
            else {
                return Promise.reject(new Map<string, any>().set(Constants.message, "Attempting to set size of a null widget container"));
            }*/
        }
        setMode(mode: number): Promise<Map<string, any>> {
            if (this.currentMode == mode) {
                return Promise.resolve(new Map<string, any>().set(Constants.value, true));
            }
            switch (mode) {
                case 1: //TODO - replace with named constant. We have the focus
                    if (this._state.sessionManager.getActiveProvider() == this) {
                        this.currentMode = mode;
                        return this.updateContainerSize();
                    }
                    return this._state.sessionManager.setActiveProvider(this).then(
                        function (result: Map<string, any>) {
                            if (result.get(Constants.value)) {
                                this.currentMode = mode;
                                return this.updateContainerSize();
                            }
                            return Promise.resolve(result);
                        }.bind(this),
                        function (error) {
                            return Promise.reject(error);
                        });
                case 0://TODO - replace with named constant. We lost the focus
                    if (this._state.sessionManager.getActiveProvider() != this) {
                        this.currentMode = mode;
                        return this.updateContainerSize();
                    }
                    return this._state.sessionManager.setActiveProvider(null).then(
                        function (result: Map<string, any>) {
                            if (result.get(Constants.value)) {
                                this.currentMode = mode;
                                return this.updateContainerSize();
                            }
                            return Promise.resolve(result);
                        }.bind(this),
                        function (error) {
                            return Promise.reject(error);
                        });
            }
            return Promise.reject(new Map<string, any>().set(Constants.message, "Invalid mode value"));  
        }
        getMode(): number {
            return this.currentMode;
        }
        setHeight(height: number): Promise<Map<string, any>> {
            this.widgetHeight = height;
            return this.updateContainerSize();
        }
        getHeight(): number {
            if (!this.getMode()) {
                return this._minimizedHeight;  //TODO: figure out what to use as minimized width We are minimized
            }
            return this.widgetHeight;
        }
        setWidth(width: number): Promise<Map<string, any>> {
            this.widgetWidth = width;
            return this.updateContainerSize();
        }
        getWidth(): number {
            return this.widgetWidth;
        }
    }
}