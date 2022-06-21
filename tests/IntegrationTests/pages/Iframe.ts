
export enum IframeConstants {
    IframeNavigate = "framenavigated",
    IframeCC = "ChatControl.htm",
    IframeSelectorLookUpTimeout = "10000",
    IframeWidgetValue = "widgets_container.html",
}

export class Iframe {
    public static GetIframe(pageObject, html): Promise<any> {
        //promise to resolve and fetch the iframe once framenavigated event occurs.
        return GetIframeSelector(IframeConstants.IframeSelectorLookUpTimeout, waitForFrame());
        function GetIframeSelector(ms, promise) {
            // Create a promise that rejects in <ms> milliseconds
            let timeout = new Promise((resolve, reject) => {
                let id = setTimeout(() => {
                    clearTimeout(id);
                    reject();
                }, ms)
            })
            // Returns a race between our timeout and the passed in promise
            return Promise.race([
                promise,
                timeout
            ])
        }

        function waitForFrame() {
            const frame = pageObject.frames().find(f => f.url().indexOf(html) > -1);
            if (frame) {
                return frame;
            }
            else {
                //waits for framenavigated event to happen and calls waitForFrame to resolve promise and return iframe
                page.once(IframeConstants.IframeNavigate, waitForFrame);
            }
        }
    }

    public static GetChildIframeByParentIframe(pageObject, parentIFrameHtmlSrc): Promise<any> {
        //promise to resolve and fetch the iframe once framenavigated event occurs.
        return GetIframeSelector(IframeConstants.IframeSelectorLookUpTimeout, waitForFrame());
        function GetIframeSelector(ms, promise) {
            // Create a promise that rejects in <ms> milliseconds
            let timeout = new Promise((resolve, reject) => {
                let id = setTimeout(() => {
                    clearTimeout(id);
                    reject();
                }, ms)
            })
            // Returns a race between our timeout and the passed in promise
            return Promise.race([
                promise,
                timeout
            ])
        }

        function waitForFrame() {
            const parentFrame = pageObject.frames().find(f => f.url().indexOf(parentIFrameHtmlSrc) > -1);
            if (parentFrame) {
                for (const childFrame of parentFrame.childFrames()) {
                    if (childFrame) {
                        return childFrame;
                    }
                }
            }
            else {
                //waits for framenavigated event to happen and calls waitForFrame to resolve promise and return iframe
                page.once(IframeConstants.IframeNavigate, waitForFrame);
            }
        }
    }
}