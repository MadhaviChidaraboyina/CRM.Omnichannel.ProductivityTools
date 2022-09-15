import * as axios from "axios";
import { AuthenticationContext } from "adal-node";
import { TestSettings } from "../configuration/test-settings";


const axiosDefault = axios.default;
//TO DO --- Move config id and presence id to test settings
const OCConfigId = "d4d91600-6f21-467b-81fe-6757a2791fa1";
const OCPresenceId = "a89ee9cf-453a-4b52-8d7a-ad647feecd5d";
const OCUserId = "<>";

export const URLConstants = {
	CreateCaseUrl: `${TestSettings.OrgUrl}/api/data/v9.0/incidents`,
    UpdateOCConfig: `${TestSettings.OrgUrl}/api/data/v9.0/msdyn_omnichannelconfigurations(${OCConfigId})`,
	AppConfigUrl: `${TestSettings.OrgUrl}/api/data/v9.0/msdyn_appconfigurations`,
	PanelConfigUrl: `${TestSettings.OrgUrl}/api/data/v9.0/msdyn_paneconfigurations`,
	UserUrl: `${TestSettings.OrgUrl}/api/data/v9.0/systemusers(${OCUserId})`,
	AddUserAppConfig: `${TestSettings.OrgUrl}/api/data/v9.0/msdyn_appconfigurations(AppConfigId)/msdyn_appconfiguration_systemuser/$ref`,
	Authority: `https://login.microsoftonline.com/${TestSettings.TenantId}/oauth2/authorize`,
};

const ExecutePostRequest = async (postUrl: string, requestBody: any) => {
	const token = await getAuthToken(
		TestSettings.AdminAccountEmail,
		TestSettings.AdminAccountPassword
	);
	return await axiosDefault.post(postUrl, JSON.stringify(requestBody), {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});
};

const ExecutePatchRequest = async (
	patchUrl: string,
	requestBody: any
) => {
	const token = await getAuthToken(
		TestSettings.AdminAccountEmail,
		TestSettings.AdminAccountPassword
	);
	return await axiosDefault.patch(patchUrl, JSON.stringify(requestBody), {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});
};

const ExecuteDeleteRequest = async (deleteUrl: string) => {
	const token = await getAuthToken(
		TestSettings.AdminAccountEmail,
		TestSettings.AdminAccountPassword
	);
	return await axiosDefault.delete(deleteUrl, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});
};

const getAuthToken = async (
	activeDirectoryUser: string,
	activeDirectoryPassword: string
) => {
	return new Promise((resolve, reject) => {
		const authContext = new AuthenticationContext(
			URLConstants.Authority,
			false
		);
		authContext.acquireTokenWithUsernamePassword(
			`${TestSettings.OrgUrl}/`,
			activeDirectoryUser,
			activeDirectoryPassword,
			TestSettings.ADClientId,
			(error, tokenResponse) => {
				if (error) {
					reject(error);
				}
				resolve((tokenResponse as any).accessToken);
			}
		);
	});
};

// Turn on Missed Notifications
export const CreateAppProfile_AddUser = async () => {
	const requestBodyAppConfig = {
		msdyn_appmoduleuniquename: "CustomerServiceApps",
		msdyn_description: "ds odata",
		msdyn_name: "profile 1odata",
		msdyn_uniquename: "msdyn_uniqueprofileodata"
	};

	const responseAppConfig = await ExecutePostRequest(URLConstants.AppConfigUrl, requestBodyAppConfig);

	const requestBodyPanelConfig = {
		msdyn_name: "profile 1odata prod pane",
		msdyn_panemode: false,
		msdyn_panestate: false,
		msdyn_uniquename: "msdyn_uniqueprofileodata"
	};

	const responsePanelConfig = await ExecutePostRequest(URLConstants.AppConfigUrl, requestBodyPanelConfig);

	const requestBodyAddUser = {
		"@odata.id": URLConstants.UserUrl
	};
	URLConstants.AddUserAppConfig = URLConstants.AddUserAppConfig.replace("AppConfigId", responseAppConfig && responseAppConfig.headers["odata-entityid"])
	const responseAdduser = await ExecutePostRequest(URLConstants.AddUserAppConfig, requestBodyAddUser);
	//let ourTuple: [string, string, string];
	return [responseAppConfig, responsePanelConfig, responseAdduser];
};

export const DeleteAppProfile = async (deleteApp, deletePanel) => {
	await ExecuteDeleteRequest(deleteApp);
	await ExecuteDeleteRequest(deletePanel);
};

// Turn on Missed Notifications
export const TurnOnMissedNotifications = async () => {
	const requestBody = {
        msdyn_enable_missed_notifications: true,
        "msdyn_inactive_presence_lookup@odata.bind": "/msdyn_presences(a89ee9cf-453a-4b52-8d7a-ad647feecd5d)"
	};

    //To turn off missed notifications
    // const requestBody = {
    //     msdyn_enable_missed_notifications: false,
    //     "_msdyn_inactive_presence_lookup_value": "null",
	// };

	return await ExecutePatchRequest(URLConstants.UpdateOCConfig, requestBody);
};