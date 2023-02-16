import * as axios from "axios";
import { AuthenticationContext } from "adal-node";

const OrgUrl = process.env.OrgUrl;
const TenantId = process.env.TenantId;
const ClientId = process.env.ClientId;
const adminAccountEmail = process.env.OrgAdminUserName;
const adminAccountPassword = process.env.OrgAdminPassword;
const Authority = `https://login.microsoftonline.com/${TenantId}/oauth2/authorize`;

const axiosDefault = axios.default;

/**
 * ExecuteGetRequest odata api call.
 * @param getUrl String, url request for get odata api call.
 */
export const ExecuteGetRequest = async (getUrl: string) => {
  const token = await getAuthToken(adminAccountEmail, adminAccountPassword);
  return await axiosDefault.get(getUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

/**
 * ExecutePostRequest odata api call.
 * @param postUrl String, post url request.
 * @param requestBody string, request body for post api call.
 */
export const ExecutePostRequest = async (postUrl: string, requestBody: any) => {
  const token = await getAuthToken(adminAccountEmail, adminAccountPassword);
  return await axiosDefault.post(postUrl, JSON.stringify(requestBody), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const ExecutePatchRequest = async (patchUrl: string, requestBody: any) => {
  const token = await getAuthToken(adminAccountEmail, adminAccountPassword);
  return await axiosDefault.patch(patchUrl, JSON.stringify(requestBody), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};


/**
 * getAuthToken api call to token.
 * @param activeDirectoryUser String, user name.
 * @param activeDirectoryPassword string, user password.
 */
export const getAuthToken = async (
  activeDirectoryUser: string,
  activeDirectoryPassword: string
) => {
  return new Promise((resolve, reject) => {
    const authContext = new AuthenticationContext(Authority, false);
    authContext.acquireTokenWithUsernamePassword(
      OrgUrl,
      activeDirectoryUser,
      activeDirectoryPassword,
      ClientId,
      (error, tokenResponse) => {
        if (error) {
          reject(error);
        }
        resolve((tokenResponse as any).accessToken);
      }
    );
  });
};