/// <reference path="../../../Packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
declare namespace Microsoft.ProductivityMacros.MacrosDataLayer {
    class FPIConstants {
        static IFRAMEID: string;
        static EMPTYGUID: string;
        static FPIMESSAGE_EVENTNAME: string;
        static IFRAMETITLE: string;
        static IFRAME_APPNAME: string;
        static OCBASEURLFIELD: string;
        static OCFPIURLFIELD: string;
        static AUTH_FAILED_STATUS_MESSAGE: string;
        static AUTH_FAILED_STATUS_CODE: number;
        static FPI_COMPONENT_URL_PARAMETER: string;
    }
    class RequestTypes {
        static GET: string;
        static PUT: string;
        static POST: string;
        static DELETE: string;
        static STATUS: string;
    }
    class EndpointConstants {
        static endpointEntityName: string;
        static ocEndpointRecordId: string;
        static pathPropertyKey: string;
        static namePropertyKey: string;
        static descriptionPropertyKey: string;
        static telemetryContext: string;
        static emptyString: string;
        static publicString: string;
        static fairfaxString: string;
        static PRODEnvKey: string;
        static namespaceDeploymentKey: string;
        static PublicDeploymentTypeKey: string;
        static ocBaseUrlKey: string;
        static ocFPIUrlKey: string;
        static ocDeploymentTypeKey: string;
        static ocEndpointNameKey: string;
        static readonly publicFPIUrlMap: Map<any, any>;
        static readonly fairfaxFPIUrlMap: Map<any, any>;
        static getFPIURLMap(cloudType: string): Map<any, any>;
    }
}
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
declare namespace Microsoft.ProductivityMacros.MacrosDataLayer {
    class FPIHelper {
        private static instance;
        private static isAuthenticated;
        private static iFrameExists;
        private static svcMap;
        private static OCEndPoint;
        private static ocBaseURL;
        private static fpiURL;
        private static authenticationFailure;
        private static authenticationQuery;
        private static HelperID;
        private static requestMap;
        private static orgId;
        private static pendingRequests;
        private static isMock;
        private constructor(isMock);
        private static getTenantId();
        private static getAgentId();
        private static getOrgId();
        /**
         * Creates iframe if it does not exist, and queries it using STATUS message if it does to authenticate
         */
        private static startAuthentication();
        private static doesIFrameExist();
        /**
         * Event listener for messages from FPI iframe
         */
        private static addEventListener();
        private static getFPIUrlQueryParams();
        /**
         * Adds FPI Iframe to DOM
         */
        private static addFPIIframe();
        /**
         * Queries FPI iframe if authenticated to return a tokenacquired event or begin authentication if not authenticated
         */
        private static queryAuthenticationStatus();
        private static fpiIframeExistsVerify();
        /**
         * Function for dataResponse Success Handling
         */
        private static dataResponseSuccessHandling(event);
        /**
        * Function for dataResponse Failure Handling
        */
        private static dataResponseFailureHandling(event);
        private static handleInvalidRequestID(requestId);
        /**
         * Method to process FPI Post response
         * @param event Sent by FPI iframe with data
         */
        private static processIframeData(event);
        /**
         * Sets authenticated status to true, returns any authentication promises, and fires pending requests
         */
        private static handleAuthSucess();
        private static handleAuthFailure(statusText);
        /**
         * Callback method for message event
         * @param event Message sent by FPI Iframe
         */
        private static fpiCallBack(event);
        /**
         * Ensures constructor has been called and instance available
         */
        static getInstance(isMock: boolean): FPIHelper;
        /**
         * Creates FPI request message
         * @param method method name of the request
         * @param url url for the request
         * @param payload payload for the request
         * @param orgId orgId
         * @param staticData staticData to be included in message
         */
        private static createFPIRequestMessage(method, url, payload, staticData);
        /**
         * Posts message on FPI Iframe
         * @param message message to be posted
         */
        private static sendMessage(message);
        /**
         * Ability for consumer to manually authenticate or wait for authentication
         * Returns a promise that resolved to true if authenticated and false if auth failure
         */
        static authenticate(): Promise<boolean>;
        static addOCBaseURL(message: FPIRequestMessage): FPIRequestMessage;
        static addOrgIDHeader(message: FPIRequestMessage): FPIRequestMessage;
        /**
         * Makes a request via FPI iframe
         * @param message FPIRequestMessage object - does not need organization ID in headers or base URL in URL
         * @param requestId For logging - needs to match staticData.requestId
         */
        static makeFPIRequest(message: FPIRequestMessage, requestId: string): Promise<any>;
    }
}
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
declare namespace Microsoft.ProductivityMacros.MacrosDataLayer {
    class DataHelper {
        private static instance;
        private static FPIHelper;
        private static isAuthenticated;
        private static consumersList;
        private static isMock;
        private static entityMetadataMap;
        private constructor(isMock);
        /**
         * To be called when a new consumer initializes itself
         * @param consumerId Preferably unique identification of consumer in telemetry
         */
        static registerConsumer(consumerId: string): void;
        /**
         * To be called when a new consumer destroys itself
         * @param consumerId Previously passed identification of consumer in telemetry
         */
        static deRegisterConsumer(consumerId: string): void;
        /**
         * Initializes DataHelper and returns instance reference
         */
        static getInstance(isMock?: boolean): DataHelper;
        static sendFinishedMessage(message: FPIRequestMessage): Promise<any>;
    }
}
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
declare namespace Microsoft.ProductivityMacros.MacrosDataLayer {
    class FPIRequestMessage {
        url: string;
        requestType: string;
        header: any;
        payload: any;
        staticData: any;
    }
    class AdditionalRequestHeaders {
        headerName: string;
        headerValue: string;
    }
    class FPIAuthenticationFailureResponse {
        responseCode: number;
        responseText: string;
        constructor();
    }
    interface IFPIAuthenticationMessage extends Event {
        data: {
            senderApp: string;
            responseData: {
                tokenAcquired: boolean;
                componentId: string;
                responseText: string;
            };
            isFailure?: boolean;
        };
    }
    interface IFPISuccessResponseMessage extends Event {
        data: {
            staticData: {
                HelperID: string;
                requestId: string;
                consumerId: string;
            };
            senderApp: string;
            statusText: string;
            transactionid: string;
            isFailure: boolean;
            statusCode: number;
            responseData: any;
        };
    }
    interface IFPIFailureResponseMessage extends Event {
        data: {
            staticData: {
                HelperID: string;
                requestId: string;
                consumerId: string;
            };
            isFailure: boolean;
            statusCode: number;
            senderApp: string;
            statusText: string;
            transactionid: string;
            responseData: {
                responseText: string;
            };
        };
    }
}
declare namespace Microsoft.ProductivityMacros.MacrosDataLayer {
    class RequestMap {
        private requestMap;
        constructor();
        /**
         * Utility function to add value into RequestMap
         * @param requestId Id of the request to be added in the request map
         * @param value Promise added to the request map
         */
        addToRequestMap(requestId: string, value: any): void;
        /**
         * Gets Promise for given request id
         * @param requestId
         */
        getRequestMapValue(requestId: string): any;
        /**
         * Utility function to delete entry from  RequestMap
         */
        deleteFromRequestMap(requestId: string): void;
    }
}
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
declare namespace Microsoft.ProductivityMacros.MacrosDataLayer {
    class OCEndpoint {
        svcMap: Map<string, string>;
        isMock: boolean;
        /**
         * Default constructor
         * @param context Control context
         * @param controlName Name of the Omnichannel custom control - Will be used in telemetry
         */
        constructor(isMock?: boolean);
        appendParamterstoURL(url: string, env: string, cloudtype: string, isMock: boolean): string;
        /**
         * Getter for Service endpoint Map
         */
        getSvcMap(): Map<string, string>;
        getValue(val: string): string;
        /**
         * Hepler method to set FPI url based on environment type.
         * @param env Environment type DEV, INT, PPE, PROD.
         */
        private setOcFPIUrl();
        /**
         * Retrieve oc endpoint Url
         */
        retrieveOcEndpoint(): Promise<Map<string, string>>;
    }
}
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
declare namespace Microsoft.ProductivityMacros.MacrosDataLayer {
    class Utils {
        static EMPTY_GUID: string;
        static newGuid(): string;
        private static getRandomGuidSubstr(s);
        static isNullUndefinedorEmpty(variable: any): boolean;
        static isOmniChannelFPIApp(event: IFPIAuthenticationMessage): boolean;
        static isTokenAcquired(event: IFPIAuthenticationMessage): boolean;
        static isAuthFailure(event: IFPIAuthenticationMessage): boolean;
        /**
        * Generate new guid
        */
        static generateNewGuid(): string;
    }
}
