import { OdataURL } from "../utils/OdataURL";
import { ExecutePostRequest } from "./odata-helper";
import * as selectors from "../pages/selectors.json";
import { ChannelProviderConstants } from "../utils/app.constants";

export class PTProviderHelper {
  private static instance = new PTProviderHelper();
  public static getInstance() {
    return this.instance;
  }

  public async createPTProvider(providerName: string, order: any) {
    const requestBody = {
      msdyn_appselector: ChannelProviderConstants.AppSelect,
      msdyn_sortorder: order,
      msdyn_landingurl: selectors.ChannelIntegrationPage.ChannelURL,
      msdyn_label: providerName,
      msdyn_name: providerName,
      msdyn_roleselector: ChannelProviderConstants.RoleSelector,
      msdyn_enableanalytics: false,
      msdyn_ciproviderapiversion: 0,
      msdyn_clicktoact: true,
    };
    await ExecutePostRequest(OdataURL.PtChannelProviderUrl, requestBody);
  }

  public async createThirdPartyChannelProvider(
    providerName: string,
    uniqueName: string
  ) {
    const requestBody = {
      msdyn_sortorder: 0,
      msdyn_channelurl:
        process.env.OrgUrl +
        ChannelProviderConstants.AppendChannelUrl,
      msdyn_label: providerName,
      msdyn_uniquename: uniqueName,
      msdyn_name: providerName,
      msdyn_enableanalytics: false,
      msdyn_apiversion: ChannelProviderConstants.ApiVersion,
      msdyn_enableoutbound: true,
    };
    await ExecutePostRequest(OdataURL.ChannelProvider, requestBody);
  }
}
