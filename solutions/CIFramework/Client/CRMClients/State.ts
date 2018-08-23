/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="Constants.ts" />
/// <reference path="WebClient.ts" />
/// <reference path="WidgetIFrame.ts" />

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
            sessionInfo: SessionInfo;

            /**
             * Post message wrapper object
             */
            messageLibrary: postMessageNamespace.postMsgWrapper;
        }

    export class SessionInfo {
        _activeProvider: CIProvider;

        setActiveProvider(provider: CIProvider) {
            if (this._activeProvider != provider) {
                if (this._activeProvider) {
                    this._activeProvider.setMode(0);    //TODO: replace 0 with named constant
                }
                this._activeProvider = provider;
                this._activeProvider.setMode(1);    //TODO: replace with named constant
            }
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
        constructor(x: XrmClientApi.WebApi.Entity, state: IState) {
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
        }
        raiseEvent(data: Map<string, any>, messageType: string, noTimeout?: boolean): void {
            const payload: postMessageNamespace.IExternalRequestMessageType = {
                messageType: messageType,
                messageData: data
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
            this._state.messageLibrary.postMsg(this.getContainer().getContentWindow(), payload, this.landingUrl, true, noTimeout);
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
            if (ret) {
                return Promise.resolve(new Map<string, any>());
            }
            else {
                return Promise.reject(new Map<string, any>().set(Constants.message, "Attempting to set size of a null widget container"));
            }
        }
        setMode(mode: number): Promise<Map<string, any>> {
            this.currentMode = mode;
            return this.updateContainerSize();
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