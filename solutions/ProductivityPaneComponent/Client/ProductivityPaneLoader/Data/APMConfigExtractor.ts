/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
/// <reference path="../../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />

import { ProductivityPaneConfig } from "../Models/ProductivityPaneConfig";
import { ProductivityToolsConfig } from "../Models/ProductivityToolsConfig";
import { AppRuntimeSDK } from "../TypeDefinition/AppRuntimeClientSdk";
import { Helper } from "./Helper";


export class APMConfigExtractor {
  private helper: Helper;
  private productivityPaneConfigData: ProductivityPaneConfig;
  private isDataFetched: boolean;

  constructor() {
    this.productivityPaneConfigData = new ProductivityPaneConfig(
      false,
      false,
      new ProductivityToolsConfig()
    );
    this.isDataFetched = false;
    this.helper = new Helper();
  }

  public retrieveIntitialData() {
    try {
      //get app config name
      AppRuntimeSDK.Utility.getEnvironment().then(
        (environmentData) => {
          if (environmentData != null) {
            // appConfigUniqueName = "msdyn_csw_app_configuration"
            let appConfigUniqueName = environmentData.AppConfigName;

            if (appConfigUniqueName != null) {
              //get productivity pane configuration data
              this.helper.getProductivityPaneConfigData(appConfigUniqueName).then(
                (configData: ProductivityPaneConfig) => {
                  this.helper.validateToolsIconConfigData(
                      configData.productivityToolsConfig.ToolsList
                    )
                    .then((toolsConfig) => {
                      configData.productivityToolsConfig.ToolsList = toolsConfig;
                      this.productivityPaneConfigData = configData;
                      // this.eventManager.ProductivityPaneConfigData = this.productivityPaneConfigData;
                      if (this.productivityPaneConfigData.validateConfig()) {
                        this.isDataFetched = true;
                      }
                      // this.context.utils.requestRender();
                    });
                },
                (error: XrmClientApi.ErrorResponse) => {
                  console.log(JSON.stringify(error));
                  // Add Telemetry here
                }
              );
            }
          }
        },
        (error: XrmClientApi.ErrorResponse) => {
          console.log(JSON.stringify(error));
          // Add Telemetry here
        }
      );
    } catch (error) {
      console.log(JSON.stringify(error));
      // Add Telemetry here
    }
  }

  public getProductivityPaneConfigData() {
      return this.productivityPaneConfigData;
  }
}
