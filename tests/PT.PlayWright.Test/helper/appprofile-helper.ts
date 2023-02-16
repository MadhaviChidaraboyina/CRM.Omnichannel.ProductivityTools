import { AppProfileConstants } from "../utils/app.constants";
import { OdataURL } from "../utils/OdataURL";
import { ExecuteGetRequest, ExecutePostRequest } from "./odata-helper";

export const UserURLsConstants = {
  UserUrl1: `${process.env.OrgUrl}/api/data/V9.0/systemusers?$filter=domainname eq '${process.env.PresenceUser}'`,
};

export class AppProfileHelper {
  private static instance = new AppProfileHelper();
  public static getInstance() {
    return this.instance;
  }

  public async CreateAppProfile() {
    // create app profile test data 
    if (await this.isAppProfileNotExist(AppProfileConstants.TestAppProfileName)) {
      // Create app profile and add user
      await this.createAppProfileWithUser(
        AppProfileConstants.TestAppProfileName,
        UserURLsConstants.UserUrl1
      );
    }
  }

  private async isAppProfileNotExist(appProfile: string) {
    const response = await ExecuteGetRequest(
      `${process.env.OrgUrl}/api/data/v9.0/msdyn_appconfigurations?$filter=msdyn_name eq '${appProfile}'`
    );
    const data =
      response && response.data
        ? JSON.parse(JSON.stringify(response.data))
        : null;
    let profileName = "";
    if (data) {
      const obj = data.value && Array.isArray(data.value) ? data.value : null;
      if (obj && obj.length > 0) {
        profileName = obj[0].msdyn_name;
        return false;
      } else {
        console.log("Profile doesn't exist");
        return true;
      }
    }
  }

  // get list of app profiles to create
  private getAppProfiles() {
    const appProfiles = new Map<string, string>();
    appProfiles.set(AppProfileConstants.TestAppProfileName, UserURLsConstants.UserUrl1);
    return appProfiles;
  }

  private async createAppProfileWithUser(
    profileName: string,
    appProfileUser: string
  ) {
    // app config api call
    const requestBodyAppConfig = {
      msdyn_appmoduleuniquename: AppProfileConstants.CSApps,
      msdyn_description: AppProfileConstants.dsOData,
      msdyn_name: profileName,
      msdyn_uniquename: AppProfileConstants.msdyn_uniquename + profileName,
    };

    const responseAppConfig = await ExecutePostRequest(
      OdataURL.AppConfigUrl,
      requestBodyAppConfig
    );

    // Panel config api call
    const requestBodyPanelConfig = {
      msdyn_name: profileName + " pane1",
      msdyn_panemode: false,
      msdyn_panestate: false,
      msdyn_uniquename: "msdyn_prod14" + profileName,
    };

    const responsePanelConfig = await ExecutePostRequest(
      OdataURL.PanelConfigUrl,
      requestBodyPanelConfig
    );

    // pane config ref api call
    const requestBodyPanelConfigref = {
      "@odata.id": responsePanelConfig.headers["odata-entityid"],
    };
    const lastref =
      responseAppConfig.headers["odata-entityid"] +
      "/msdyn_msdyn_paneconfig_msdyn_appconfig/$ref";
    await ExecutePostRequest(lastref, requestBodyPanelConfigref);

    // Add user to app profile created above
    await this.addUserToAppProfile(responseAppConfig, appProfileUser);
  }

  private async getGUID(userUrl: string) {
    const response = await ExecuteGetRequest(userUrl);
    const data =
      response && response.data
        ? JSON.parse(JSON.stringify(response.data))
        : null;
    let uguid = "";
    if (data) {
      const obj = data.value && Array.isArray(data.value) ? data.value : null;
      if (obj && obj.length > 0) {
        uguid = obj[0].systemuserid;
      } else {
        console.log("user doesnt exist. Please check user in app");
      }
    }
    return uguid;
  }

  private async addUserToAppProfile(responseAppConfig: any, userUrl: string) {
    const guiduser = await this.getGUID(userUrl);
    const requestBodyAddUser = {
      "@odata.id": OdataURL.UsersUrl + "(" + guiduser + ")",
    };
    const finalEndpoint =
      responseAppConfig.headers["odata-entityid"] +
      "/msdyn_appconfiguration_systemuser/$ref";
    await ExecutePostRequest(finalEndpoint, requestBodyAddUser);
  }

  private async getchannelproviderID() {
    const response = await ExecuteGetRequest(
      `${process.env.OrgUrl}/api/data/v9.0/msdyn_channelproviders?$filter=msdyn_name eq 'omnichannel'`
    );
    const data =
      response && response.data
        ? JSON.parse(JSON.stringify(response.data))
        : null;
    let ChannelProviderID = "";
    if (data) {
      const obj = data.value && Array.isArray(data.value) ? data.value : null;
      if (obj && obj.length > 0) {
        ChannelProviderID = obj[0].msdyn_channelproviderid;
      }
    }
    return ChannelProviderID;
  }
}
