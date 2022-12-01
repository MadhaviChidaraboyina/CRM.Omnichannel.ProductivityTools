import * as axios from "axios";
import { AuthenticationContext } from "adal-node";
import { TestSettings } from "../configuration/test-settings";

const axiosDefault = axios.default;
//TO DO --- Move config id and presence id to test settings
const OCConfigId = "d4d91600-6f21-467b-81fe-6757a2791fa1";

export const URLConstants = {
	CreateCaseUrl: `${TestSettings.OrgUrl}/api/data/v9.0/incidents`,
	TurnOnMissedNotificationsURL: `${TestSettings.OrgUrl}/api/data/v9.0/msdyn_omnichannelconfigurations(${OCConfigId})`,
	AppConfigUrl: `${TestSettings.OrgUrl}/api/data/v9.0/msdyn_appconfigurations`,
	PanelConfigUrl: `${TestSettings.OrgUrl}/api/data/v9.0/msdyn_paneconfigurations`,
	UsersUrl: `${TestSettings.OrgUrl}/api/data/v9.0/systemusers`,
	UserUrl1: `${TestSettings.OrgUrl}/api/data/V9.2/systemusers?$filter=domainname eq '${TestSettings.AdminAccountEmail4}'`,
	AddUserAppConfig: `${TestSettings.OrgUrl}/api/data/v9.0/msdyn_appconfigurations(AppConfigId)/msdyn_appconfiguration_systemuser/$ref`,
	Authority: `https://login.microsoftonline.com/${TestSettings.TenantId}/oauth2/authorize`,
	OrgUrl: `${TestSettings.OrgUrl}/api/data/v9.0/organizations(${TestSettings.OrgId})`,
};

export const ExecutePostRequest = async (postUrl: string, requestBody: any) => {
	const token = await getAuthToken(
		TestSettings.AdminAccountEmail,
		TestSettings.AdminAccountPassword
	);
	return await axiosDefault.post(postUrl, JSON.stringify(requestBody), {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
			"OrganizationId": TestSettings.OrgId
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

export const ExecuteGetRequest = async (getUrl: string) => {
	const token = await getAuthToken(
		TestSettings.AdminAccountEmail,
		TestSettings.AdminAccountPassword
	);
	return await axiosDefault.get(getUrl, {
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

export const addUserToAppProfile = async (responseAppConfig: any, userUrl: string) => {
	const guiduser = await getGUID(userUrl);
	const requestBodyAddUser = {
		"@odata.id": URLConstants.UsersUrl + "(" + guiduser + ")"
	};
	const finalEndpoint = responseAppConfig.headers["odata-entityid"] + "/msdyn_appconfiguration_systemuser/$ref"
	await ExecutePostRequest(finalEndpoint, requestBodyAddUser);
}

// Turn on Missed Notifications
export const TurnOnMissedNotifications = async () => {
	const requestBody = {
		msdyn_enable_missed_notifications: true,
		"msdyn_inactive_presence_lookup@odata.bind": "/msdyn_presences(a89ee9cf-453a-4b52-8d7a-ad647feecd5d)"
	};
	return await ExecutePatchRequest(URLConstants.TurnOnMissedNotificationsURL, requestBody);
};

export const getGUID = async (UserUrl: string) => {
	const response = await ExecuteGetRequest(UserUrl);
	const data = response && response.data ? JSON.parse(JSON.stringify(response.data)) : null;
	let uguid = "";
	if (data) {
		const obj = data.value && Array.isArray(data.value) ? data.value : null;
		if (obj && obj.length > 0) {
			uguid = obj[0].systemuserid;
		}
	}
	return uguid;
};

export const getGlobalSearchEnable = async (OrgUrl: string) => {
	const response = await ExecuteGetRequest(
		OrgUrl
	);
	const data = response && response.data ? JSON.parse(JSON.stringify(response.data)) : null;
	expect(data).toBeTruthy();
	let newsearchexperience: boolean = false;
	if (data) {
		newsearchexperience = data.newsearchexperienceenabled;
	}
	return newsearchexperience;
};

export const enableGlobalSearch = async () => {
	const isenable = await getGlobalSearchEnable(URLConstants.OrgUrl);
	if (!isenable) {
		const globalsearchbody = {
			"isexternalsearchindexenabled": true,
			"newsearchexperienceenabled": true
		};
		const finalEndpoint = URLConstants.OrgUrl
		await ExecutePatchRequest(finalEndpoint, globalsearchbody);
	}
};