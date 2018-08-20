namespace Microsoft.CIFramework.Internal
{
    export interface WidgetContainer {
        setHeight(height: number): boolean;
        setWidth(height: number): boolean;
        getContentWindow(): Window;
    }
    export class WidgetIFrameWrapper  implements WidgetContainer {
        hostIFrame: HTMLIFrameElement;
        constructor(hostIFrame: HTMLIFrameElement) {
            this.hostIFrame = hostIFrame;
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
    }
}