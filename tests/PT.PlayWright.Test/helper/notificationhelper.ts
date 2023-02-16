import { ExecutePatchRequest } from "./odata-helper";

const OCConfigId = "d4d91600-6f21-467b-81fe-6757a2791fa1";

const NotificationOdataURLs = {
    MissedNotificationsURL: `${process.env.OrgUrl}/api/data/v9.0/msdyn_omnichannelconfigurations(${OCConfigId})`,
    Authority: `https://login.microsoftonline.com/${process.env.TenantId}/oauth2/authorize`,
  };

// Turn on Missed Notifications
export const TurnOnMissedNotifications = async () => {
    const requestBody = {
      msdyn_enable_missed_notifications: true,
    };
    return await ExecutePatchRequest(
        NotificationOdataURLs.MissedNotificationsURL,
      requestBody
    );
  };
  
  // Turn off Missed Notifications
  export const TurnOffMissedNotifications = async () => {
    const requestBody = {
      msdyn_enable_missed_notifications: false,
    };
    return await ExecutePatchRequest(
        NotificationOdataURLs.MissedNotificationsURL,
      requestBody
    );
  };
  