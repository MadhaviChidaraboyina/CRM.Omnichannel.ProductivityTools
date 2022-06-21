import { Browser, Page } from "playwright";

import { BrowserContext } from "playwright";
import { HTMLConstants } from "../constants";

export class TestHelper {
	private static finishedTests = {};
	public static CheckDevice(context: BrowserContext, device: string) {
		// tslint:disable-next-line: no-string-literal
		return context["_options"]["userAgent"]?.includes(device);
	}

	public static CheckBrowser(browserName: string, checkBrowser: Browser) {
		// tslint:disable-next-line: no-string-literal
		return checkBrowser["_ownedServer"]["_process"]["spawnfile"]?.includes(browserName);
	}

	public static async dispose(browserContext: BrowserContext) {
		try
		{
			let state = expect.getState();
			let currentTestName = state.currentTestName;
			const regex = /\b(\d{7})\b/;
			let matches = regex.exec(currentTestName);
			let globalBrowser = browserContext.browser();
			const contextGUID = (browserContext as any)._guid;
			const contexts = globalBrowser.contexts();
			for (let [contextIndex, currentContext] of contexts.entries()) {
				const currentContextGUID = (currentContext as any)._guid;
				if (currentContextGUID === contextGUID) {
					let pages = currentContext.pages();
					for (let i = 0; i < pages.length; i++) {
						let cpage = pages[i];
						if (matches && matches.length > 0) {
							let testcaseId = matches[0];
							let itTitle = currentTestName.split(":")[1].trim();
							let testUniqueName = `${testcaseId}/page${i}_${itTitle}`;
							let runningTimes = this.finishedTests[testUniqueName] ?? 0;
							const screenshotFileName = currentTestName.replace(/\W/g, '_');
							try {
								await cpage.screenshot({
									path: `screenshots/${screenshotFileName}_context${contextIndex}_page${i}_${new Date().getUTCHours()}-${new Date().getUTCMinutes()}.png`,
									fullPage: true,
									type: "png"
								});
								this.finishedTests[testUniqueName] = ++runningTimes;
							}
							catch {
								//If page is already closed, there will be an exception
							}
						}
					}
				}
			}
			await browserContext?.close();
	}
	catch(ex){
		console.error("Error while closing the browser context: "+ex);
	}
	}
	
	// tslint:disable-next-line: no-any
	public static GetIframe(page1, html): Promise<any> {
		//promise to resolve and fetch the iframe once framenavigated event occurs.
		let FetchIFrame;
		const promise = new Promise(x => FetchIFrame = x);
		waitForFrame();
		return promise;

		function waitForFrame() {
			const frame = page1.frames().find(f => f.url().indexOf(html) > -1);
			if (frame) {
				FetchIFrame(frame);
			}
			else {
				//waits for framenavigated event to happen and calls waitForFrame to resolve promise and return iframe
				page.once(HTMLConstants.IframeNavigate, waitForFrame);
			}
		}
	}
}