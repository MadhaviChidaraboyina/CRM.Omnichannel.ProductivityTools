import { randomBytes } from "crypto";
export class Util {
	public static isNullOrEmptyString(str: string) {
		return !str || str.trim().length === 0;
	}

	public static newGuid() {
		let guidPattern = "xx-x-4m-ym-xxx";
		let newGuid = "";
		for (let i = 0; i < guidPattern.length; i++) {
			let randomString = Math.floor(Math.random() * Date.now());
			switch (guidPattern[i]) {
				case "x":
					newGuid += randomString.toString(16).substring(0, 4);
					break; //get 4 digit
				case "m":
					newGuid += randomString.toString(16).substring(0, 3);
					break; //Get 3 digit
				case "y":
					newGuid += (randomString & 0x3 | 0x8).toString(16);
					break; // To get only one of 8, 9, A, or B
				default:
					newGuid += guidPattern[i]; //Default "-" and "4"
			}
		}

		return newGuid;
	}

	public static generateNumber(length = 9) {
		return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
	}

	public static generateString(length) {
		return randomBytes(length).toString("base64").toLowerCase().substr(0, length);
	}

	public static isSuccessfulStatusCode(statusCode: number) {
		return [200, 202, 204].indexOf(statusCode) !== -1;
	}

	public static isNumber(value: string | number): boolean {
		if (value) {
			return !isNaN(Number(value.toString().trim()));
		}
		return false;
	}

	public static generateRandomAlphabetString(length: number) {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		const charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() *
				charactersLength));
		}
		return result;
	}

	public static getAuthScript(token: string, timeout: number = 10): string {
		return `
		    var payloadToEncrypt = {};
            function convertToJwtToken(payloadToEncrypt){
                    return function(callback){
                        let jwt= "${token}";
                        setTimeout(() => {
                            callback(jwt);
                        }, ${timeout});
                    }
                }
                window.getOmnichannelAuthToken = (callback) => {
                    let payload = {};
                    convertToJwtToken(payload)(callback);
                };
        `;
	}

	public static getAuthScriptWithoutAuthEvent(token: string, timeout: number = 10): string {
		return `
		    var payloadToEncrypt = {};
            function convertToJwtToken(payloadToEncrypt){
                    return function(callback){
                        let jwt= "${token}";
                        setTimeout(() => {
                            callback(jwt);
                        }, ${timeout});
                    }
                }
        `;
	}


	public static getAuthEvent(): string {
		return `
			window.getOmnichannelAuthToken = (callback) => {
				let payload = {};
				convertToJwtToken(payload)(callback);
			};
        `;
	}
}