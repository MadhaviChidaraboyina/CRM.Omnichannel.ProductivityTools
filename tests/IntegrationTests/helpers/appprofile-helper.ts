import { ExecuteGetRequest, ExecutePostRequest, URLConstants } from "./odata-helper";
import { TestSettings } from "configuration/test-settings";

export const UserURLsConstants = {
    UserUrl1: `${TestSettings.OrgUrl}/api/data/V9.2/systemusers?$filter=domainname eq '${TestSettings.AdminAccountEmail1}'`,
    UserUrl2: `${TestSettings.OrgUrl}/api/data/V9.2/systemusers?$filter=domainname eq '${TestSettings.AdminAccountEmail2}'`,
    UserUrl3: `${TestSettings.OrgUrl}/api/data/V9.2/systemusers?$filter=domainname eq '${TestSettings.AdminAccountEmail3}'`,
    UserUrl4: `${TestSettings.OrgUrl}/api/data/V9.2/systemusers?$filter=domainname eq '${TestSettings.AdminAccountEmail4}'`,
    UserUrl5: `${TestSettings.OrgUrl}/api/data/V9.2/systemusers?$filter=domainname eq '${TestSettings.AdminAccountEmail5}'`,
    UserUrl6: `${TestSettings.OrgUrl}/api/data/V9.2/systemusers?$filter=domainname eq '${TestSettings.AdminAccountEmail6}'`,
};

export const appProfileNames = {
    AppProfileTest: "AppProfileUser",
    appProfileTest1: "AppProfileUser1",
    appProfileTest2: "AppProfileUser2",
    appProfileTest3: "AppProfileUser3",
    appProfileTest4: "AppProfileUser4",
    appProfileTest5: "AppProfileUser5",
    appProfileTest6: "AppProfileUser6",
};

export class AppProfileHelper {
    private static instance = new AppProfileHelper();

    public static getInstance() {
        return this.instance;
    }

    public async CreateAppProfile() {
        // create app profile test data
        this.getAppProfiles().forEach(async (appProfileUserUrl: string, appProfileName: string) => {
            if (await this.isAppProfileExist(appProfileName)) {
                // Create app profile and add user 
                await this.createAppProfileWithUser(appProfileName, appProfileUserUrl);
            }
        });
    }

    private async isAppProfileExist(appProfile: string) {
        const response = await ExecuteGetRequest(
            `${TestSettings.OrgUrl}/api/data/v9.0/msdyn_appconfigurations?$filter=msdyn_name eq '${appProfile}'`
        );
        const data = response && response.data ? JSON.parse(JSON.stringify(response.data)) : null;
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
        appProfiles.set(appProfileNames.appProfileTest1, UserURLsConstants.UserUrl1);
        appProfiles.set(appProfileNames.appProfileTest2, UserURLsConstants.UserUrl2);
        appProfiles.set(appProfileNames.appProfileTest3, UserURLsConstants.UserUrl3);
        appProfiles.set(appProfileNames.appProfileTest4, UserURLsConstants.UserUrl4);
        appProfiles.set(appProfileNames.appProfileTest5, UserURLsConstants.UserUrl5);
        appProfiles.set(appProfileNames.appProfileTest6, UserURLsConstants.UserUrl6);
        return appProfiles;
    }

    private async createAppProfileWithUser(profileName: string, appProfileUser: string) {
        // app config api call
        const requestBodyAppConfig = {
            msdyn_appmoduleuniquename: "CustomerServiceApps",
            msdyn_description: "ds odata",
            msdyn_name: profileName,
            msdyn_uniquename: "msdyn_99" + profileName
        };

        const responseAppConfig = await ExecutePostRequest(URLConstants.AppConfigUrl, requestBodyAppConfig);

        // Panel config api call
        const requestBodyPanelConfig = {
            msdyn_name: profileName + " pane1",
            msdyn_panemode: false,
            msdyn_panestate: false,
            msdyn_uniquename: "msdyn_prod14" + profileName
        };

        const responsePanelConfig = await ExecutePostRequest(URLConstants.PanelConfigUrl, requestBodyPanelConfig);

        // pane config ref api call
        const requestBodyPanelConfigref = {
            "@odata.id": responsePanelConfig.headers["odata-entityid"]
        };
        const lastref = responseAppConfig.headers["odata-entityid"] + "/msdyn_msdyn_paneconfig_msdyn_appconfig/$ref";
        await ExecutePostRequest(lastref, requestBodyPanelConfigref);

        // Add user to app profile created above
        await this.addUserToAppProfile(responseAppConfig, appProfileUser);
    }

    private async getGUID(userUrl: string) {
        const response = await ExecuteGetRequest(
            userUrl
        );
        const data = response && response.data ? JSON.parse(JSON.stringify(response.data)) : null;
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
            "@odata.id": URLConstants.UsersUrl + "(" + guiduser + ")"
        };
        const finalEndpoint = responseAppConfig.headers["odata-entityid"] + "/msdyn_appconfiguration_systemuser/$ref"
        await ExecutePostRequest(finalEndpoint, requestBodyAddUser);
    }
}