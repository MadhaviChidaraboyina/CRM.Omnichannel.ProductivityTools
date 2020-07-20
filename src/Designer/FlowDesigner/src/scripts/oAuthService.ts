import { isNullOrUndefined } from "util";

export interface LoginResult {
	error?: string;
}

export interface OAuthService {
	openLoginPopup(): OAuthPopupInstance;
}

export interface OAuthPopupInstance {
	/* tslint:disable: no-any */
	loginPromise: Promise<any>;    // the promise response coming from IOAuthMessage.queryStringParameters
	/* tslint:enable: no-any */

	url: string;

	getRedirectUrl(): string;

	close(): void;

	closed: boolean;
}

export class OAuthPopup implements OAuthPopupInstance {
	public loginPromise: Promise<LoginResult>;

	private _popupWindow: Window;
    private _timer: NodeJS.Timeout | null = null;
	private _popupId: string;

	constructor(popup: Window, id: string) {
		this._popupWindow = popup;
		this._popupId = id;

		this.loginPromise = new Promise<LoginResult>((resolve, reject) => {
			if (!this._popupWindow) {
				reject({
					name: 'Error',
					message: 'The browser has blocked the popup window.'
				});
			} else {
				let timeoutCounter = 0;
				const isIE = navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0;
				const isEdge = navigator.userAgent.indexOf('Edge/') !== -1;
				this._timer = !isIE && !isEdge
					? setInterval(() => {
						timeoutCounter++;
						this._handlePopupForOtherBrowsers(resolve, reject, timeoutCounter);
					}, 1000)
					: setInterval(() => {
						timeoutCounter++;
						this._handlePopupForIEAndEdge(resolve, reject, timeoutCounter);
					}, 1000);
			}
		});
	}

	public get url(): string {
		return this._popupWindow && this._popupWindow.location.href;
	}

	public set url(value: string) {
		if (this._popupWindow) {
			this._popupWindow.postMessage({ 'logicAppsRedirectUrl': value }, '*');
		}
	}

	public get closed(): boolean {
		return this._popupWindow && this._popupWindow.closed;
	}

	public close(): void {
		if (this._popupWindow) {
			this._popupWindow.close();

			if (this._timer) {
				clearInterval(this._timer);
				this._timer = null;
			}
		}
	}

	public getRedirectUrl(): string {
		const trustedAuthority = getUriEncodedTrustedAuthorityFromQueryString();
		return getOrigin() + `/Html/authredirect.html?pid=${this._popupId}&trustedAuthority=${trustedAuthority}`;
	}

	private getCookie(key: string) {
		const name = encodeURIComponent(key) + '=';
		const ca = document.cookie.split(';');
		for (let c of ca) {
			while (c.charAt(0) === ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) === 0) {
				return decodeURIComponent(c.substring(name.length, c.length));
			}
		}
		return '';
	}

	private deleteCookie(key: string) {
		document.cookie = `${key}=; Path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
	}

	private _handlePopupForIEAndEdge(resolve: Function, reject: Function, timeoutCounter: number) {
		const storageKey = 'LogicAppOAuth' + this._popupId,
			storageValue = this.getCookie(storageKey);

        if (storageValue) {
            if (!isNullOrUndefined(this._timer)) {
                clearInterval(this._timer);
            }
			resolve(JSON.parse(storageValue));
			this.deleteCookie(storageKey);
		} else if (timeoutCounter === 60) { // 1 minute
			reject({
				name: 'Error',
				message: 'Timeout'
            });
            if (!isNullOrUndefined(this._timer)) {
                clearInterval(this._timer);
            }
		}
	}

	private _handlePopupForOtherBrowsers(resolve: Function, reject: Function, timeoutCounter: number) {
		if (this._popupWindow.closed) {

			const storageKey = 'LogicAppOAuth' + this._popupId,
				storageValue = this.getCookie(storageKey);

			if (storageValue) {
				resolve(JSON.parse(storageValue));
				this.deleteCookie(storageKey);
			} else {
				reject({
					name: 'Error',
					message: 'The browser is closed.'
				});
			}

            if (!isNullOrUndefined(this._timer)) {
                clearInterval(this._timer);
            }
		} else if (timeoutCounter === 300) { // 5 minutes
			reject({
				name: 'Error',
				message: 'Timeout'
			});
            if (!isNullOrUndefined(this._timer)) {
                clearInterval(this._timer);
            }
		}
	}
}

export function getOrigin(): string {
	const regex = /([^&=]+)\/Html\/iframedesigner.html\??/i;
	const href = window.location.href;
	let origin = window.location.origin;
	const match = regex.exec(href);

	if (match) {
		origin = match[1];
	}

	return origin;
}

function getAuthRelativeUri(): string {
	const pathName = window.location.pathname;
	return pathName.replace('iframedesigner.html', 'auth.html');
}

function getUriEncodedTrustedAuthorityFromQueryString(): string | undefined {
	const paramsArray = window.location.search.substr(1).split('&');
	for (const param of paramsArray) {
		const pair = param.split('=');
		if (pair[0].toLowerCase() === 'trustedauthority') {
			return pair[1];
		}
	}

	return undefined;
}

export class OAuthPopupService implements OAuthService {	

	constructor() {
	}

	public openLoginPopup(): OAuthPopupInstance {
		const extensionName = 'Microsoft_Azure_EMA';
		const trustedAuthority = getUriEncodedTrustedAuthorityFromQueryString();
		const popupWindowName: string = Date.now().toString();
		// NOTE(shimedh): We need to check isIE because redirect url does not work in IE if the initial host is different from portal's host.
		// Eg. Before this change -> Portal's host = portal.azure.com (A) and for out popup and designer the host is ema.hosting.portal.azure.net (B).
		// We need the designer and popup to be in the same host (B) in order to change the url and redirect once we get the consent url.
		// But, for IE initial host need to match with portal (A) and then the designer and popup need to match (B).
		// Thus, we are using FX provided redirect url which opens in host "A" and immediately redirects to auth.html in host "B" and rest works in host "B".
		const isIE = navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0;
		let initUrl =  getOrigin() + '/Html/auth.html';
		initUrl += `?trustedAuthority=${trustedAuthority}`;
        const popupWindow = window.open(initUrl, popupWindowName, 'scrollbars=1, resizable=1, width=500, height=600');
        if (isNullOrUndefined(popupWindow)) {
            throw new DOMError();
        }
        return new OAuthPopup(popupWindow, popupWindowName);
	}    
}
