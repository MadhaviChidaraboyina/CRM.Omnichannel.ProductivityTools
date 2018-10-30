/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/** @internal */
namespace Microsoft.CIFramework.Internal {
	export class SessionPanel {
		sidePanelIFrame: any;
		UIsessions: Map<string, CIProvider>;
		visibleUISession: string;
		counter: number = 0;

		private static instance: SessionPanel;

		private constructor() {
			this.sidePanelIFrame = (<HTMLIFrameElement> window.parent.document.getElementById(Constants.widgetIframeId));;
			this.UIsessions = new Map<string, CIProvider>();
			this.visibleUISession = '';
		}

		static getInstance() {
			if (!SessionPanel.instance) {
				SessionPanel.instance = new SessionPanel();
			}

			return SessionPanel.instance;
		}

		getSessionPanel(): any {
			return this.sidePanelIFrame.contentWindow.document.getElementById("sessionPanel");
		}

		getElement(id: string): any {
			return this.sidePanelIFrame.contentWindow.document.getElementById(id);
		}

		switchSession(sessionId: string) {
			if (this.visibleUISession == sessionId) {
				return;
			}

			if (this.visibleUISession != '') {
				this.UIsessions.get(this.visibleUISession).setInvisibleUISession(this.visibleUISession);

				let sessionElement = this.getElement(this.visibleUISession);
				sessionElement.style.backgroundColor = "white";
				this.getElement(this.visibleUISession + "selectionLine").style.display = "none";
			}

			this.visibleUISession = sessionId;
			this.UIsessions.get(this.visibleUISession).setVisibleUISession(this.visibleUISession);

			let sessionElement = this.getElement(this.visibleUISession);
			let backgroundColor = Constants.activeSessionColors[Constants.sessionColors.indexOf(this.rgb2hex(this.getElement(this.visibleUISession + "avatarCircle").style.backgroundColor))];
			sessionElement.style.backgroundColor = backgroundColor;
			this.getElement(this.visibleUISession + "selectionLine").style.display = "block";
		}


		//ToDo: Change code to prevent conversion
		rgb2hex(orig: string) {
			var rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
			return (rgb && rgb.length === 4) ? "#" +
				("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
				("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
				("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : orig;
		}

		createSessionElement(id: string, initials: string): any {
			let sessionColor = Constants.sessionColors[this.counter++ % Constants.sessionColors.length];
			return '<div class="uiSession" id="' + id + '"><div class="avatarCircle" id="' + id + 'avatarCircle" style="background-color: ' + sessionColor + ';"><span class="initials">' + initials + '</span></div><div class="selectionLine" id="' + id + 'selectionLine" style="background-color: ' + sessionColor + ';"></div></div>';
		}

		canAddUISession(): boolean {
			if (this.UIsessions.size < Constants.MaxUISessions) {
				return true;
			}
			else {
				return false;
			}
		}

		addUISession(sessionId: string, provider: CIProvider, initials: string): void {
			let sessionPanel = this.getSessionPanel();
			if (sessionPanel == null)
				return;

			this.UIsessions.set(sessionId, provider);

			let sessionElementHtml = this.createSessionElement(sessionId, initials);
			var parser = new DOMParser();
			var el = parser.parseFromString(sessionElementHtml, "text/html");
			var sessionElement = el.getElementById(sessionId);
			sessionElement.onclick = this.onclick;

			sessionPanel.appendChild(sessionElement);

			if (this.visibleUISession == '') {
				this.switchSession(sessionId);
			}

			if (this.UIsessions.size == Constants.MaxUISessions) {
				//postmessagewrapper - raiseEvent(new Map<string, any>().set('Limit', Constants.MaxUISessions), MessageType.onMaxUISessionsReached);
			}
		}

		removeUISession(sessionId: string): void {
			let sessionElement = this.getElement(sessionId);
			if (sessionElement && this.UIsessions.has(sessionId)) {
				this.UIsessions.delete(sessionId);
				sessionElement.parentNode.removeChild(sessionElement);

				if (this.visibleUISession == sessionId) {
					this.visibleUISession = '';
					if (this.UIsessions.size > 0) {
						//setting last in the Map as visible
						this.switchSession(Array.from(this.UIsessions.keys()).pop());
					}
				}
			}
		}

		onclick(event: MouseEvent): void {
			Microsoft.CIFramework.Internal.SessionPanel.instance.switchSession((event.currentTarget as HTMLElement).id);
		}
	}
}