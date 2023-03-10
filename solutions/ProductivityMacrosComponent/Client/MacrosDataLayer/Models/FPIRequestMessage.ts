/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/

namespace Microsoft.ProductivityMacros.MacrosDataLayer
{
	export class FPIRequestMessage 
	{
		public url: string;
		public requestType: string;
		public header: any;
		public payload: any;
		public staticData: any;
    }

    export class AdditionalRequestHeaders {
        headerName: string;
        headerValue: string;
    }

    export class FPIAuthenticationFailureResponse {
        responseCode: number;
        responseText: string;

        constructor() {
            this.responseCode = FPIConstants.AUTH_FAILED_STATUS_CODE;
            this.responseText = FPIConstants.AUTH_FAILED_STATUS_MESSAGE;
        }
    }

    export interface IFPIAuthenticationMessage extends Event {
        data: {
            senderApp: string,
            responseData: {
                tokenAcquired: boolean,
                componentId: string,
                responseText: string
            },
            isFailure?: boolean
        };
    }

    export interface IFPISuccessResponseMessage extends Event {
        data: {
            staticData: {
                HelperID: string,
                requestId: string,
                consumerId: string
            }
            senderApp: string,
            statusText: string,
            transactionid: string,
            isFailure: boolean,
            statusCode: number,
            responseData: any
        };
    }

    export interface IFPIFailureResponseMessage extends Event {
        data: {
            staticData: {
                HelperID: string,
                requestId: string,
                consumerId: string
            }
            isFailure: boolean,
            statusCode: number,
            senderApp: string,
            statusText: string,
            transactionid: string,
            responseData: {
                responseText: string,
            }
        };
    }
}