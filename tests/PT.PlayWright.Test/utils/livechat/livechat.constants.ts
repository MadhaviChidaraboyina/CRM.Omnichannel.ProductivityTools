/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

import { stringFormat } from "../test.utils";

/**
 * Type of the entity
 */
export const enum AgentPresenseStatus {
  Available = "Available",
  Away = "Away",
  Offline = "Offline",
  Busy = "Busy",
  AwayTest1 = "AwayTest1",
  AwayTest2 = "AwayTest2",
}

/**
 * Agent Presence APIs
 */
export const enum PresenceAPI {
  GetPresence = "/presence/GetAllPresences",
  SetPresence = "/presence/SetAgentPresence",
  ResetPresence = "/presence/ResetAgentPresence",
  GetAgentPresence = "/presence/GetAgentPresence",
}

export const NotificationMessageButtonNameRegex =
  /You have \d+ notifications\. Select to view\./i;

const launchPresenceDialog = "Launch presence dialog";
/**
 * GetPresenceMenuButton - Get presence status menu button text based on agent presence status.
 * @param agentPresenseStatus AgentPresenseStatus, agent presence status.
 */
export const GetPresenceMenuButton = (
  agentPresenseStatus: AgentPresenseStatus
) => {
  return stringFormat(agentPresenseStatus, launchPresenceDialog);
};

export const enum ChatConstants {
  Accept = "Accept",
  End = "End",
  CommunicationPanel = "Communication panel header",
  Visitor1 = "Press Enter to close the session Visitor 1",
  Visitor2 = "Press Enter to close the session Visitor 2",
  Close = "Close",
  SendURL = "Send URL",
  TypeMsg = "Type your message",
  Msg = "hii",
  Open = "Open",
  All = "*",
  SendKbArticle = "Knowledge search",
  OngoingConversationsDashboard = "Omnichannel Ongoing Conversations Dashboard",
  IntradayDashboard = "Omnichannel Intraday Insights",
  AwayTest1 = "AwayTest1",
  AwayTest2 = "AwayTest2",
  AwayTestOption = "192360003",
}
