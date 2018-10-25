/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />

namespace Microsoft.CIFramework.Internal {
	export class SessionPanel {
		sidePanelIFrame: any;
		UIsessions: Map<string, CIProvider>;
		visibleUISession: string;
		colors: string[] = ["lightgreen", "blue", "green", "goldenrod"];
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

		getSessionElement(sessionId: string): any {
			return this.sidePanelIFrame.contentWindow.document.getElementById(sessionId);
		}

		setVisibleUISession(sessionId: string) {
			if (sessionId == this.visibleUISession) {
				return;
			}

			if (this.visibleUISession != '' && !isNullOrUndefined(this.UIsessions.get(this.visibleUISession))) {
				this.UIsessions.get(this.visibleUISession).setInvisibleSession(this.visibleUISession);
			}

			this.visibleUISession = sessionId;
			this.UIsessions.get(this.visibleUISession).setVisibleSession(this.visibleUISession);
		}

		createSessionElement(id: string, initials: string): any {
			return '<div id="' + id + '" class="avatar-circle" style="width: 26px; height: 26px; background-color: ' + this.colors[this.counter++ % 4] +' ; border-radius: 50%; -webkit-border-radius: 50%; text-align: center; margin: 4px;"><span class="initials" style=" position: relative; top: 3px; font-size: 14px; line-height: normal; color: #fff; font-family: Segoe UI;">' + initials + '</span></div>';
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
				this.setVisibleUISession(sessionId);
			}
		}

		removeUISession(sessionId: string): void {
			let sessionElement = this.getSessionElement(sessionId);
			if (sessionElement == null)
				return;

			this.UIsessions.delete(sessionId);

			sessionElement.parentNode.removeChild(sessionElement);

			if (this.UIsessions.size > 0) {
				//setting last in the Map as visible
				this.setVisibleUISession(Array.from(this.UIsessions.keys()).pop());
			}
		}

		onclick(event: MouseEvent): void {
			Microsoft.CIFramework.Internal.SessionPanel.instance.setVisibleUISession((event.currentTarget as HTMLElement).id);
		}
	}
}