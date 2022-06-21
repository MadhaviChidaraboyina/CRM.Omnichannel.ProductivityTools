import { AxiosResponse } from "axios";
import { Util } from "../Utility/Util";

export class AsyncConnectorError extends Error {
    constructor(httpResponse: AxiosResponse<any>) {
        super();
        this.message = this.constructErrorMessage(httpResponse);
    }

    private constructErrorMessage(failedResponse: AxiosResponse<any>): string {
        const content = typeof failedResponse.data == "object" ? JSON.stringify(failedResponse.data) : String(failedResponse.data);
        const statusMsg = `AsyncConnector request failed with status: ${failedResponse.status} ${failedResponse.statusText}. `;
        return Util.isNullOrEmptyString(content) ? statusMsg : statusMsg.concat(`Response content: ${content}`);
    }
}

export class BotConnectorError extends Error {
    constructor(httpResponse: AxiosResponse<any>) {
        super();
        this.message = this.constructErrorMessage(httpResponse);
    }

    private constructErrorMessage(failedResponse: AxiosResponse<any>): string {
        // If BotConnector responses with 202 but the message failed the real status defined in the response content.
        if (Util.isSuccessfulStatusCode(failedResponse.status)) {
            return `AsyncConnector request failed. Content: ${JSON.stringify(failedResponse.data)}`;
        }
        else {
            return `AsyncConnector request failed with status: ${failedResponse.status} ${failedResponse.statusText}`;
        }
    }
}

// TwitterConnector responses with the same template. This error created only for type distinction
export class TwitterConnectorError extends BotConnectorError {
    constructor(httpResponse: AxiosResponse<any>) {
        super(httpResponse);
    }
}

// SMSTeleSignConnector responses with the same template. This error created only for type distinction
export class SMSTeleSignConnectorError extends BotConnectorError {
    constructor(httpResponse: AxiosResponse<any>) {
        super(httpResponse);
    }
}

// SMSTwilioConnector responses with the same template. This error created only for type distinction
export class SMSTwilioConnectorError extends AsyncConnectorError {
    constructor(httpResponse: AxiosResponse<any>) {
        super(httpResponse);
    }
}