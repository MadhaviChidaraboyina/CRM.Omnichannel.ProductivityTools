/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/

namespace Microsoft.ProductivityMacros.MacrosDataLayer
{
	export class Utils {
		static EMPTY_GUID: string = FPIConstants.EMPTYGUID;

		public static newGuid(): string {
			return Utils.getRandomGuidSubstr(null) + Utils.getRandomGuidSubstr(true)
				+ Utils.getRandomGuidSubstr(true) + Utils.getRandomGuidSubstr(null);
		}

		private static getRandomGuidSubstr(s: boolean): string {
			let p = (Math.random().toString(16) + "000000000").substr(2, 8);
			return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
		}

		public static isNullUndefinedorEmpty(variable: any)
		{
			if(variable === null || variable === undefined || variable === "")
			{
				return true;
			}
			return false;
		}

		public static isOmniChannelFPIApp(event: IFPIAuthenticationMessage): boolean {

			if (!Utils.isNullUndefinedorEmpty(event.data)) {
				if (event.data.senderApp === FPIConstants.IFRAME_APPNAME) {
					return true;
				}
			}
			// Returns false if senderApp is undefined or not FPI App
			return false;
		}
		
		/*
		* Returns true if FPI token acquired flag is set
		* @params event FPI callback event
		*/
		public static isTokenAcquired(event: IFPIAuthenticationMessage): boolean {
			if (Utils.isOmniChannelFPIApp(event)) {
				if (!Utils.isNullUndefinedorEmpty(event.data) &&
					!Utils.isNullUndefinedorEmpty(event.data.responseData) &&
					(event.data.responseData.tokenAcquired === true) &&
					!Utils.isNullUndefinedorEmpty(event.data.responseData.componentId) &&
					(event.data.responseData.componentId.toLowerCase() === FPIConstants.IFRAMEID.toLowerCase())) {
					return true;
				}
			}
			return false;
		}
		
		/*
		 * Returns true if FPI token authentication failed
		 * @params event FPI callback event
		 */
		public static isAuthFailure(event: IFPIAuthenticationMessage): boolean {
			if (Utils.isOmniChannelFPIApp(event)) {
				if (!Utils.isNullUndefinedorEmpty(event.data) &&
					!Utils.isNullUndefinedorEmpty(event.data.responseData) &&
					(event.data.responseData.tokenAcquired === false) &&
					(event.data.isFailure === true)) {
					return true;
				}
			}
			return false;
		}

		/**
		* Generate new guid
		*/
		public static generateNewGuid(): string {
			// possible hex chars for a guid
			const hexChars = "0123456789abcdef";
			const guidSize = 36;

			let guidString = "";
			for (let i = 0; i < guidSize; i++) {
				if (i === 14) {
					// bits 12-15 set to 0010 - indicates version number of UUID RFC
					guidString += "4";
				} else if (i === 8 || i === 13 || i === 18 || i === 23) {
					// Dashes at 8, 13, 18, 23 (count begins at 0)
					guidString += "-";
				} else if (i === 19) {
					// bits 6-7 are reserved to zero and one resp.
					const n = Math.floor(Math.random() * 0x10);
					guidString += hexChars.substr((n & 0x3) | 0x8, 1);
				} else {
					guidString += hexChars.substr(Math.floor(Math.random() * 0x10), 1);
				}
			}

			return guidString;
		}
	}
}