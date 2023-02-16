import { BasePage } from "../pages/base.page";
import { ChannelIntegrationFrameworkAppsPage } from "../pages/livechat/apps/channel.integration.framework";
import { CustomerServiceAdminAppsPage } from "../pages/livechat/apps/customer.service.admin.center";
import { CustomerServiceWorkspaceAppsPage } from "../pages/livechat/apps/customer.service.workspace";
import { LiveChatWidgetPage } from "../pages/livechat/customer/live.chat.widget.page";
import { AppNames } from "./app.constants";

require("dotenv").config();

export type PTApps = {
  customerServiceWorkspaceApp?: CustomerServiceWorkspaceAppsPage;
  customerServiceAdminApp?: CustomerServiceAdminAppsPage;
  channelIntegrationFrameworkAppsPage?: ChannelIntegrationFrameworkAppsPage;
};

const user1: User = { userName: "", password: "" };
const user2: User = { userName: "", password: "" };
const admin: User = { userName: "", password: "" };

export enum PTNotificationUser {
  agent1 = "admin1@ss.com", // { value: 'small', key: 0, size: 25 },
  admin1 = "admin3@ss.com", //{ value: 'medium', key: 1, size: 35 },
  agent2 = "admin@ss.com", //{ value: 'large', key: 2, size: 50 },
}

type PTUserApp = { [key in PTNotificationUser]: PTApps };

const notificationsUserApps: PTUserApp = {
  "admin1@ss.com": { customerServiceWorkspaceApp: undefined },
  "admin3@ss.com": { customerServiceWorkspaceApp: undefined },
  "admin@ss.com": { customerServiceWorkspaceApp: undefined },
};

const s = notificationsUserApps["admin1@ss.com"].customerServiceAdminApp;

export const enum ChannelAreas {
  Presence = "Presence",
  Notification = "Notification",
  Chat = "Chat",
  AppPofile = "AppPofile",
  ChannelIntagration = "ChannelIntagration",
}

export const enum UserRoles {
  Agent = "Agent",
  Admin = "Admin",
}

export type TestSettings = {
  agentUsers: User[];
  adminUsers: User[];
  AppsPage: BasePage[];
  LiveChatWidgetPage: LiveChatWidgetPage[];
};

export type UserApp = {
  userName: string;
  password: string;
  appName: string;
};

export type PTTestSettings = {
  usersApps: UserApp[];
  liveChatWidgets: LiveChatWidget[]; //Map<string, string>;
};

export type UserAppKey = {
  appName: string;
  user: string;
};

export type OrgSettings = {
  orgUrl: string;
  users: User[];
  tenantId: string;
  clientId: string;
  orgUniqueName: string;
};

export type AgentApps = {
  userName: string;
  AppName: AppNames;
};

export type LiveChatWidget = {
  widgetName: string;
};

export const EnvVariables = {
  OrgUrl: process.env.OrgUrl || "",
  OrgAgentUserName: process.env.OrgAgentUserName || "",
  OrgAgentPassword: process.env.OrgAgentPassword || "",
  OrgAdminUserName: process.env.OrgAdminUserName || "",
  OrgAdminPassword: process.env.OrgAdminPassword || "",
  AppName: process.env.AppName || "",
  BlobUrl: process.env.BlobUrl || "",
};

export class User {
  userName: string = "";
  password: string = "";
  constructor(userName: string, password: string) {
    this.userName = userName;
    this.password = password;
  }
}
export class UserAppDetails {
  user: User;
  userRole: UserRoles;
  appName: AppNames;
  constructor(user: User, userRole: UserRoles, appName: AppNames) {
    this.user = user;
    this.userRole = userRole;
    this.appName = appName;
  }
}

export interface User {
  userName: string;
  password: string;
}

export interface AgentUser {
  userName: string;
}
