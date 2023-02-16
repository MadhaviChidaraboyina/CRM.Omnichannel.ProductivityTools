import { test as base } from "@playwright/test";
import {
 PTTestSettings,
} from "../../utils/test.settings";
import { AppsFixture, ptAppsFixture } from "../apps.fixture";
import {
  ptLiveChatWidgetFixture,
  LiveChatWidgetFixture,
} from "../livechat/livechatwidget.fixture";

const chatTest = base.extend<
  {},
  PTTestSettings & AppsFixture & LiveChatWidgetFixture
>({
  ...ptAppsFixture,
  ...ptLiveChatWidgetFixture,
});

export const test = chatTest;