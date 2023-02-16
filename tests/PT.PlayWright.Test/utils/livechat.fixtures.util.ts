import { AppNames } from "./app.constants";
import {
  AgentApps,
  ChannelAreas,
  LiveChatWidget,
  UserApp,
} from "./test.settings";
import * as data from "../data/test.data.json";
import {
  AppsPage,
  ChatUserApps,
  GetLiveChatWidgetPage,
  UserApps,
} from "./test.utils";
import { CustomerServiceWorkspaceAppsPage } from "../pages/livechat/apps/customer.service.workspace";
import { LiveChatWidgetPage } from "../pages/livechat/customer/live.chat.widget.page";
import { BasePage } from "../pages/base.page";
import { Browser, Page } from "@playwright/test";
import { UserPage } from "../users-storage-state/user";
export const NotificationTestData = {
  agent1: {
    userName: data.Users.notifications.agents[0].userName,
    AppName: AppNames.CSWorkspaceAppName,
  },
  lcwWidget1: { widgetName: data.Users.notifications.livechatwidget[0].Name },
};

export const PresenceTestData = {
  agent1: {
    userName: data.Users.notifications.agents[0].userName,
    AppName: AppNames.CSWorkspaceAppName,
  },
};

export function GetTestData(channelArea: ChannelAreas) {
  let userApps: UserApp[] = [];
  let lcwWidgets: LiveChatWidget[] = [];

  switch (channelArea) {
    case ChannelAreas.Notification:
      userApps.push(ChatUserApps(NotificationTestData.agent1));
      lcwWidgets.push(NotificationTestData.lcwWidget1);
      break;
    case ChannelAreas.Presence:
      userApps.push(ChatUserApps(PresenceTestData.agent1));
      break;
  }

  return { usersApps: userApps, liveChatWidgets: lcwWidgets };
}

export type NotificationPages = {
  cswAppsPage: CustomerServiceWorkspaceAppsPage;
  lcwWidget: LiveChatWidgetPage;
};

export type PresencePageFixtures = {
  cswAppsPage?: CustomerServiceWorkspaceAppsPage;
  agentPage?: UserPage;
};
