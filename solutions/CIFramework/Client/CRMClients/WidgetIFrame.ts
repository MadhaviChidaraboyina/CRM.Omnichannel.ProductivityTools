namespace Microsoft.CIFramework.Internal
{
	export interface WidgetContainer {
		setHeight(height: number): boolean;
		setWidth(height: number): boolean;
		getContentWindow(): Window;
		setProvider(provider: CIProvider): void;
	}
	export class WidgetIFrameWrapper  implements WidgetContainer {
		hostIFrame: HTMLIFrameElement;
		provider: CIProvider;

		constructor(hostIFrame: HTMLIFrameElement) {
			this.hostIFrame = hostIFrame;
			this.provider = null;
		}

		setHeight(height: number): boolean {
			if (!this.hostIFrame) {
				return false;
			}
			this.hostIFrame.height = height.toString();
			return true;
		}

		setWidth(width: number): boolean {
			if (!this.hostIFrame) {
				return false;
			}
			this.hostIFrame.width = width.toString();
			return true;
		}

		getContentWindow(): Window {
			if (!this.hostIFrame) {
				return null;
			}
			return this.hostIFrame.contentWindow;
		}

		setProvider(provider: CIProvider): void {
			this.provider = provider;
		}
	}
}