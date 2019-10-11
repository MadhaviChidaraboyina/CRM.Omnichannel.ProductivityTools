/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/** @internal */
namespace Microsoft.CIFrameworkAnalytics.Utility {

	/**
	 * utility func to check whether an object is null or undefined
	 */
	/** @internal */
	export function isNullOrUndefined(obj: any) {
		return (obj == null || typeof obj === "undefined");
	}

	/**
	 * utility func to check whether an object is null or undefined
	 */
	/** @internal */
	export function validateInitAnalyticsPayload(payload: any): Promise<boolean> {
		if ((!isNullOrUndefined(payload.conversation.conversationId) && !isNullOrUndefined(payload.conversation.session.sessionId)))
			return Promise.resolve(true);
		else
			return Promise.resolve(false);
	}

	/**
	 * utility func to check whether an object is null or undefined
	 */
	/** @internal */
	export function validateLogAnalyticsPayload(payload: any): Promise<boolean> {
		if ((!isNullOrUndefined(payload.conversationId) && !isNullOrUndefined(payload.sessionId) && !isNullOrUndefined(payload.clientSessionId)))
			return Promise.resolve(true);
		else
			return Promise.resolve(false);
	}

}