import { test } from "@playwright/test";
import { BasePage } from "../../pages/base.page";
import { LiveChatWidgetPage } from "../../pages/livechat/customer/live.chat.widget.page";
import { PTTestSettings, EnvVariables } from "../../utils/test.settings";

export type LiveChatWidgetFixture = {
  liveChatWidgetFixture: Map<string, BasePage>;
};

type ExtendParams = Parameters<
  typeof test.extend<{}, PTTestSettings & LiveChatWidgetFixture>
>;

const liveChatWidget = [{ widgetName: "notificationsWidget" }];
export const ptLiveChatWidgetFixture: ExtendParams[0] = {
  liveChatWidgets: [liveChatWidget, { option: true, scope: "worker" }],
  liveChatWidgetFixture: [
    async ({ browser, liveChatWidgets }, use) => {
      const liveChatWidgetPage = new Map<string, LiveChatWidgetPage>();
      await Promise.all(
        liveChatWidgets.map(async (widget) => {
          const context = await browser.newContext();
          const page = await context.newPage();
          const liveChatPage = new LiveChatWidgetPage(
            page,
            EnvVariables.BlobUrl
          );
          await liveChatPage.OpenLCWUrl(widget.widgetName);
          liveChatWidgetPage.set(widget.widgetName, liveChatPage);
        })
      );
      await use(liveChatWidgetPage);
    },
    {
      scope: "worker",
    },
  ],
};
