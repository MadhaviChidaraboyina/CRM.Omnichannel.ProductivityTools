/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

import { BasePage } from "../pages/base.page";
import { ChannelIntegrationFrameworkAppsPage } from "../pages/livechat/apps/channel.integration.framework";
import { CustomerServiceAdminAppsPage } from "../pages/livechat/apps/customer.service.admin.center";
import { CustomerServiceWorkspaceAppsPage } from "../pages/livechat/apps/customer.service.workspace";
import { LiveChatWidgetPage } from "../pages/livechat/customer/live.chat.widget.page";
import { AppNames } from "./app.constants";
import {
  AgentApps,
  EnvVariables,
  LiveChatWidget,
  UserApp,
} from "./test.settings";

/**
 * String format.
 * @param str String, needs to be formatted.
 * @param args Arguments, needs to be placed properly in the string.
 */
export const stringFormat = (str: string, ...args: any[]) =>
  str.replace(/{(\d+)}/g, (match, index) => args[index].toString() || "");

/**
 * Load state conditions.
 */
export const enum LoadState {
  DomContentLoaded = "domcontentloaded",
  Load = "load",
  NetworkIdle = "networkidle",
}

/**
 * Keyboard keys.
 */
export const enum KeyboardKeys {
  ArrowDown = "ArrowDown",
  Enter = "Enter",
  Escape = "Escape",
  Tab = "Tab",
  ArrowLeft = "ArrowLeft",
  ShiftTab = "Shift+Tab",
}

/**
 * Element Roles.
 */
export const enum ElementRoles {
  Button = "button",
  Link = "link",
  MenuItem = "menuitem",
  Combobox = "combobox",
  Option = "option",
  Dialog = "dialog",
  Row = "row",
  Checkbox = "checkbox",
  Treeitem = "treeitem",
  Menubar = "menubar",
  Columnheader = "columnheader",
  Region = "region",
  Tab = "tab"
}

/**
 * Element Attributes.
 */
export const enum Attributes {
  Title = "title",
}

/**
 * Different environment types.
 */
export enum EnvironmentType {
  OnPrem = "onprem",
  Online = "online",
}

/**
 * Different environment types.
 */
export enum Timeouts {
  PresenceNotification = 120001,
  DefaultTimeout = 2000,
  ApiTimeout = 10000,
  FiveTimeout = 5000,
  ThreeTimeout = 3000
}

/**
 * Element Label
 */
export enum ElementLabel {
  Name = "Name",
  PresenceText = "Presence text",
  Label = "Label",
  ChannelURL = "Channel URL",
  ChannelOrder = "Channel Order",
}

export function UserEmail(userName: string): string {
  return `${userName}@${process.env.emaildomain}`;
}

export function ChatUserApps(agentApps: AgentApps) {
  return {
    userName: UserEmail(agentApps.userName),
    password: EnvVariables.OrgAgentPassword,
    appName: agentApps.AppName,
  };
}

export function UserApps(userName: string, appName: AppNames) {
  return {
    userName: userName,
    password: EnvVariables.OrgAgentPassword,
    appName: appName,
  };
}

export function ChatAppsPage(userApp: AgentApps, apps: Map<string, BasePage>) {
  const cswAppPage = apps.get(userApp.AppName + userApp.userName);
  return GetAppsPage(userApp.AppName, cswAppPage);
}

export function GetLiveChatWidgetPage(
  lcwWidget: LiveChatWidget,
  lcwWidgetPage: Map<string, BasePage>
) {
  return lcwWidgetPage.get(lcwWidget.widgetName) as LiveChatWidgetPage;
  //return lcwWidgetPage as LiveChatWidgetPage;
}

export function AppsPage(userApp: UserApp, apps: Map<string, BasePage>) {
  const cswAppPage = apps.get(userApp.appName + userApp.userName);
  return GetAppsPage(userApp.appName, cswAppPage);
}

export function GetAppsPage(appName: string, basePage?: BasePage) {
  let appsPage: any;
  switch (appName) {
    case AppNames.CSAdminCenterAppName:
      return basePage as CustomerServiceAdminAppsPage;
      break;
    case AppNames.CSWorkspaceAppName:
      return basePage as CustomerServiceWorkspaceAppsPage;
      break;
    case AppNames.ChannelIntegrationAppName:
      return basePage as ChannelIntegrationFrameworkAppsPage;
      break;
  }
  return appsPage;
}

export function RandomNumber() {
  var minm = 100;
  var maxm = 999;
  return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
}
