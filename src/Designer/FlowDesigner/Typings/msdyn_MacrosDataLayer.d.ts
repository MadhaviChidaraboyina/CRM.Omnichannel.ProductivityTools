/// <reference path="./XrmClientApi.d.ts" />
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
        static AUTH_FAILED_STATUS_MESSAGE: string;
        static AUTH_FAILED_STATUS_CODE: number;
        static QUERY_FPI_STATUS: string;
        static EXTERNAL_REST_ODATA_API: string;
    }
    class RequestTypes {
        static GET: string;
        static PUT: string;
        static POST: string;
        static DELETE: string;
        static STATUS: string;
    }
    class GeoNames {
        static TIP: string;
        static GCC: string;
        static USG: string;
        static CHN: string;
        static DEFAULT: string;
    }
    const FpiGeoSettings: {
        [x: string]: {
            endpoint: string;
        };
    };
    /**
     * https://dynamicscrm.visualstudio.com/First%20Party%20Integrations/_git/First%20Party%20Integrations?path=%2Fsrc%2FIntegrations%2FIntegrations%2FMicrosoftFlows%2F9.0%2FFlowApp.js&_a=contents&version=GBv2
     */
    const FlowGeoSettings: {
        [x: string]: {
            endpoint: string;
            resource: string;
        };
    };
}
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
declare namespace Microsoft.ProductivityMacros.MacrosDataLayer {
    class FlowClient {
        private readonly fpiHelper;
        private readonly environmentContext;
        private static readonly defaultHeader;
        private static readonly apiVersion;
        /**
         *
         * @param fpiHelper FPI Helper
         */
        constructor();
        private setFlowApiConfiguration(geoName);
        getEnvironment(requestContext: FlowRequestContext): Promise<any>;
        getFlows(entityName: string, requestContext: FlowRequestContext): Promise<any>;
    }
    class FlowRequestContext {
        consumerId: string;
        requestId: string;
        constructor(consumerId: string, requestId: string);
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
        private static fpiURL;
        private static fpiOrigin;
        private static authenticationFailure;
        private static authenticationQuery;
        private static HelperID;
        private static requestMap;
        private static orgId;
        private static pendingRequests;
        private constructor();
        private setFpiConfiguration(geoName);
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
        static getInstance(): FPIHelper;
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
        /**
         * Makes a request via FPI iframe
         * @param message FPIRequestMessage object - does not need organization ID in headers or base URL in URL
         * @param requestId For logging - needs to match staticData.requestId
         */
        makeFPIRequest(message: FPIRequestMessage, requestId: string): Promise<any>;
        private static convertRequestMessage(message);
        private static convertResponseMessage(messageEvent);
        private static isStatusResponse(data);
        private static verifyMessageEventOrigin(origin);
    }
}
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
declare namespace Microsoft.ProductivityMacros.MacrosDataLayer {
    class DataHelper {
        private static instance;
        private static consumersList;
        private readonly flowClient;
        private constructor();
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
        static getInstance(): DataHelper;
        readonly FlowClient: FlowClient;
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
        resource: string;
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
    class FpiRequestMessageEventDataData {
        apiUrl: string;
        resourceUri: string;
        methodType: string;
        postdata: any;
        additionalHeaders: any;
    }
    class FpiRequestMessageEventData {
        method: string;
        windowPostMessageProxy: any;
        data: FpiRequestMessageEventDataData;
    }
    class FpiResponseMessageEventData {
        data: any;
        error: any | null;
        key: string;
        windowPostMessageProxy: any;
        responseData: {
            status: number;
            statusText: string;
        } | null;
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
    class OrganizationSettings {
        private static singletoneInstance;
        private organizationSettings;
        private constructor();
        static readonly instance: OrganizationSettings;
        readonly geoName: string;
        readonly originalOrganizationSettings: XrmClientApi.OrganizationSettings;
    }
    interface IOrganizationSettings extends XrmClientApi.OrganizationSettings {
        isSovereignCloud: boolean;
        organizationGeo: string;
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
