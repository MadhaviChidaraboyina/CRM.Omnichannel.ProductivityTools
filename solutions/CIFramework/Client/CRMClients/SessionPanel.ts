/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="../../../../references/external/TypeDefinitions/lib.es6.d.ts" />
/// <reference path="../CIFrameworkUtilities.ts" />
/** @internal */
namespace Microsoft.CIFramework.Internal {
	export class SessionPanel {
		private state: IState;
		private UIsessions: Map<string, CIProvider>;
		private visibleUISession: string;
		public counter: number = 0;

		private static instance: SessionPanel;

		private constructor() {
			this.UIsessions = new Map<string, CIProvider>();
			this.visibleUISession = '';
		}

		static getInstance() {
			if (!SessionPanel.instance) {
				SessionPanel.instance = new SessionPanel();
			}

			return SessionPanel.instance;
		}

		setState(state: IState) {
			this.state = state;
		}

		getvisibleUISession() {
			return this.visibleUISession;
		}

		switchUISession(sessionId: string) {
			if (this.visibleUISession == sessionId || !this.UIsessions.has(sessionId)) {
				return;
			}

			let switchProvider = false;
			let oldProvider: CIProvider;
			let newProvider: CIProvider = this.UIsessions.get(sessionId);
			if (this.visibleUISession != '') {
				oldProvider = this.UIsessions.get(this.visibleUISession);
				if (oldProvider != newProvider) {
					switchProvider = true;
				}

				oldProvider.setInvisibleUISession(this.visibleUISession, switchProvider);
				this.state.client.updateUISession(this.visibleUISession, false);
			}

			this.visibleUISession = sessionId;
			newProvider.setVisibleUISession(this.visibleUISession, switchProvider);
			
			let sessionColor = this.state.client.getUISessionColor(this.visibleUISession);
			this.state.client.updateUISession(this.visibleUISession, true);
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
			this.UIsessions.set(sessionId, provider);

			let sessionColor = Constants.sessionColors[this.counter++ % Constants.sessionColors.length];
			this.state.client.addUISession(sessionId, initials, sessionColor, provider.providerId);

			if (this.visibleUISession == '') {
				this.switchUISession(sessionId);
			}

			if (this.UIsessions.size == Constants.MaxUISessions) {
				//ToDo: postmessagewrapper - raiseEvent(new Map<string, any>().set('Limit', Constants.MaxUISessions), MessageType.onMaxUISessionsReached);
			}
		}

		removeUISession(sessionId: string): void {
			if (this.UIsessions.has(sessionId)) {
				this.UIsessions.delete(sessionId);
				this.state.client.removeUISession(sessionId);

				if (this.visibleUISession == sessionId) {
					this.visibleUISession = '';
					if (this.UIsessions.size > 0) {
						//setting last in the Map as visible
						this.switchUISession(Array.from(this.UIsessions.keys()).pop());
					}
				}
			}
		}

		endUISession(sessionId: string): void {
			if (this.UIsessions.has(sessionId)) {
				let provider: CIProvider = this.UIsessions.get(sessionId);
				endUISession(new Map().set(Constants.sessionId, sessionId).set(Constants.originURL, provider.landingUrl));
			}
		}
	}
}