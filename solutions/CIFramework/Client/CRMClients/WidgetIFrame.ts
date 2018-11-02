namespace Microsoft.CIFramework.Internal
{
	export interface WidgetContainer {
		setHeight(height: number): boolean;
		setVisibility(visibility: boolean): boolean;
		setWidth(height: number): boolean;
		getContentWindow(): Window;
		setProvider(provider: CIProvider): void;
	}
	export class WidgetIFrameWrapper  implements WidgetContainer {
		hostIFrame: HTMLIFrameElement;
		provider: CIProvider;
		visibility: boolean;
		preservedHeight: number;
		preservedWidth: number;

		constructor(hostIFrame: HTMLIFrameElement) {
			this.hostIFrame = hostIFrame;
			this.provider = null;
			this.visibility = true;
			this.preservedHeight = 0;
		}

		setVisibility(visibility: boolean): boolean {
			this.visibility = visibility;
			this.setHeight(this.preservedHeight);
			this.setWidth(this.preservedWidth);
			return true;
		}

		setHeight(height: number): boolean {
			if (!this.hostIFrame) {
				return false;
			}
			//this.preservedHeight = height;
			if (this.visibility) {
				this.hostIFrame.height = (height > 0 ? height.toString() : "calc(100% - 10px)");
			}
			else {
				this.hostIFrame.height = "0";
			}
			return true;
		}

		private static getDefaultWidth() {
			return Constants.DEFAULT_WIDGET_WIDTH.toString();
		}
		setWidth(width: number): boolean {
			if (!this.hostIFrame) {
				return false;
			}
			this.preservedWidth = width;
			if (this.visibility) {
				this.hostIFrame.width = (width > 0 ? width.toString() : WidgetIFrameWrapper.getDefaultWidth());
			}
			else {
				this.hostIFrame.width = "0";
			}
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