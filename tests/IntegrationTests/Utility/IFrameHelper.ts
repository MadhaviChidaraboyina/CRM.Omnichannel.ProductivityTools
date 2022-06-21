export enum IFrameConstants {
  IframeNavigate = "framenavigated",
  IframeCC = "ChatControl.htm",
  IframeSelectorLookUpTimeout = "10000",
  IframeWidgetValue = "widgets_container.html",
  IframeCoBrowse = "new_cobrowse",
  IframeScreenShare = "new_screenshare",
  IframeSearchFrame = "main.htm"
}

export class IFrameHelper {
    public static GetIframe(pageObject, html): Promise<any> {
        //promise to resolve and fetch the iframe once framenavigated event occurs.
        return GetIframeSelector(IFrameConstants.IframeSelectorLookUpTimeout, waitForFrame());
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
                pageObject.once(IFrameConstants.IframeNavigate, waitForFrame);
            }
        }
    }
}