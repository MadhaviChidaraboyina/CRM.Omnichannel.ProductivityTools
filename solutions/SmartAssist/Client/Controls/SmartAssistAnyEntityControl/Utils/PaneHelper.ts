/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

 module MscrmControls.SmartAssistAnyEntityControl {

  /**Utility methods */
  export class PaneHelper {

    private static counts: Record<string, Record<string, number>> = {};

    private static getCount(conversationId: string, saConfigId: string): number {
      const countsForConversation = PaneHelper.counts[conversationId] ? PaneHelper.counts[conversationId] : {};
      return countsForConversation[saConfigId] ? countsForConversation[saConfigId] : 0;
    }

    private static setCount(conversationId: string, saConfigId: string, count: number): void {
      PaneHelper.counts[conversationId] = PaneHelper.counts[conversationId] ? PaneHelper.counts[conversationId] : {};
      PaneHelper.counts[conversationId][saConfigId] = count;
    }

    /**
     * Update app side pane badge
     * @param conversationId: the conversation that this badge count update corresponds to.
     * @param saConfigId: the SA Config that's contributing the count.
     * @param count: count that should be contributed to the badge.
     */
    public static updateBadge(conversationId: string, saConfigId: string, count: number) {
      // Don't update badge if current pane is smart assist and is expanded
      if (Xrm.App.sidePanes.getSelectedPane().paneId === StringConstants.SmartAssistPaneId &&
        Xrm.App.sidePanes.state == XrmClientApi.Constants.SidePanesState.Expanded) {
        return;
      }

      const params = new TelemetryLogger.EventParameters();
      params.addParameter("Type", "first-party");
      params.addParameter("SetContributionTo", count);

      const pane = Xrm.App.sidePanes.getPane(StringConstants.SmartAssistPaneId);
      // If app side pane ID does not exist, getPane() returns undefined. 
      if (pane) {
        params.addParameter("BadgeCountBefore", pane.badge === false ? "none" : pane.badge);
                
        // If the pane badge is false then it was reset, so reset the counts here too.
        if (pane.badge === false) PaneHelper.reset(conversationId);
        const current = PaneHelper.getCount(conversationId, saConfigId);
        params.addParameter("CountAlreadyContributed", current);

        // Calculate the new badge number taking into account how much this instance
        // contributed prior to this function call.
        const diff = count - current;
        const badge = pane.badge && typeof(pane.badge) == 'number'
          ? pane.badge + diff
          : diff;
        pane.badge = badge <= 0 ? false : badge;
        params.addParameter("BadgeCountAfter", pane.badge);

        // Update counts to reflect how much of the count is contributed by this instance.
        PaneHelper.setCount(conversationId, saConfigId, count);
        SmartAssistAnyEntityControl._telemetryReporter.logSuccess("updateBadge", params);
      }
      else {
        SmartAssistAnyEntityControl._telemetryReporter.logError("updateBadge", "Could not find pane to set badge count on", params);
      }
    }

    private static reset(conversationId: string) {
      delete PaneHelper.counts[conversationId];
    }
  }
}