/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */

/// <reference path="../../../../../references/external/TypeDefinitions/microsoft.ajax.d.ts" />
/// <reference path="../../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />

import { ProductivityPaneConfig } from "../Models/ProductivityPaneConfig";
import { ProductivityToolsConfig } from "../Models/ProductivityToolsConfig";
import {
  QueryDataConstants,
  ProductivityPaneConfigConstants,
  AppConfigConstants,
  ToolConfigConstants,
} from "../Utilities/Constants";
import { ToolConfig } from "../Models/ProductivityToolConfig";

export class Helper {
  public getProductivityPaneConfigData(
    appConfigName: string
  ): Promise<ProductivityPaneConfig> {
    // let methodName = "GetProductivityPaneConfigData";
    try {
      return new Promise<ProductivityPaneConfig>((resolve, reject) => {
        this.getProductivityPaneUniqueName(appConfigName).then(
          // ProductivityPaneUniqueName = "msdyn_csw_productivitypane"
          (productivityPaneUniqueName: string) => {
            let productivityPaneQuery = this.getProductivityPanelandTabsQuery(
              productivityPaneUniqueName
            );
            let retrieveDataPromise = Xrm.WebApi.retrieveMultipleRecords(
              ProductivityPaneConfigConstants.entityName,
              productivityPaneQuery
            );
            retrieveDataPromise.then(
              (response: any) => {
                this.getToolsConfigData(
                  response.entities[0].msdyn_msdyn_paneconfig_msdyn_tabconfig
                ).then((toolsConfig) => {
                  if (toolsConfig.length > 0) {
                    let productivityPane = new ProductivityPaneConfig(
                      response.entities[0].msdyn_panestate,
                      response.entities[0].msdyn_panemode,
                      new ProductivityToolsConfig(toolsConfig)
                    );
                    resolve(productivityPane);
                  } else {
                    reject("No tools configured");
                  }
                });
              },
              (error) => {
                // Telemetry here
                console.log(JSON.stringify(error));
                reject(error);
              }
            );
          },
          (error) => {
            // Telemetry here
            console.log(JSON.stringify(error));
            reject(error);
          }
        );
      });
    } catch (e) {
      return new Promise<ProductivityPaneConfig>((resolve, reject) => {
        // Telemetry here
        console.log(JSON.stringify(e.message));
        reject(e.message);
      });
    }
  }

  public validateToolsIconConfigData(
    tabconfig: ToolConfig[]
  ): Promise<ToolConfig[]> {
    let methodName = "getToolsConfigData";
    return new Promise<ToolConfig[]>((resolve, reject) => {
      let tPromises: Promise<any>[] = [];
      tabconfig.forEach((tab) => {
        tPromises.push(this.isValidIconPath(tab.toolIcon));
        tPromises.push(this.isValidIconPath(tab.defaultIcon));
      });
      Promise.all(tPromises).then(
        (results: any[]) => {
          var pos = 0;
          results.forEach((result: any, index: number) => {
            if (index % 2 == 0) {
              tabconfig[pos].istoolIconValid = result;
            } else {
              tabconfig[pos].isDefaultIconValid = result;
              pos++;
            }
          });
          resolve(tabconfig);
        },
        (error) => {
          // Telemetry here
          console.log(JSON.stringify(error));
          reject(error);
        }
      );
    });
  }

  private isValidIconPath(iconPath: string): Promise<boolean> {
    let methodName = "isValidIconPath";
    try {
      return new Promise<boolean>((resolve, reject) => {
        if (iconPath == null || iconPath.trim() == "") {
          resolve(false);
        } else {
          iconPath = iconPath.includes("WebResources")
            ? iconPath.includes("/WebResources/")
              ? iconPath.replace("/WebResources/", "")
              : iconPath.replace("WebResources/", "")
            : iconPath;
          let webResourceQuery = this.getWebResourceQuery(iconPath);
          let getIconPath = Xrm.WebApi.retrieveMultipleRecords(
            "webresource",
            webResourceQuery
          );
          getIconPath.then(
            (response: any) => {
              response.entities.length > 0 ? resolve(true) : resolve(false);
            },
            (error) => {
              resolve(false);
            }
          );
        }
      });
    } catch (error) {
      return new Promise<boolean>((resolve, reject) => {
        // Telemetry here
        console.log(JSON.stringify(error));
        resolve(false);
      });
    }
  }

  public getWebResourceQuery(WebResourceName: string): string {
    let query = String.format(
      "?{0}{1} eq '{2}'",
      QueryDataConstants.FilterOperator,
      "name",
      WebResourceName
    );
    return query;
  }

  private getToolsConfigData(tabconfig: any): Promise<ToolConfig[]> {
    // let methodName = "getToolsConfigData";
    return new Promise<ToolConfig[]>((resolve, reject) => {
      var toolsList: ToolConfig[] = [];
      let tPromises: Promise<any>[] = [];
      tabconfig.forEach((tab) => {
        tPromises.push(
          Xrm.WebApi.retrieveRecord(
            ToolConfigConstants.entityName,
            tab._msdyn_toolid_value
          )
        );
      });
      Promise.all(tPromises).then(
        (results: any[]) => {
          results.forEach((result: any, index: number) => {
            toolsList.push(
              new ToolConfig(
                result.msdyn_controlname,
                tabconfig[index].msdyn_iconpath,
                tabconfig[index].msdyn_order,
                tabconfig[index].msdyn_isenabled,
                tabconfig[index].msdyn_uniquename,
                tabconfig[index].msdyn_tooltip,
                result.msdyn_data,
                result.msdyn_defaulticon
              )
            );
          });
          resolve(toolsList);
        },
        (error) => {
          // Telemetry here
          console.log(JSON.stringify(error));
          reject(error);
        }
      );
    });
  }

  private getProductivityPaneUniqueName(
    appConfigName: string
  ): Promise<string> {
    let methodName = "GetProductivityPaneUniqueName";
    return new Promise<string>((resolve, reject) => {
      let productivityPaneUniqueNameQuery = this.getProductivityPaneUniqueNameQuery(
        appConfigName
      );
      let retrieveDataPromise = Xrm.WebApi.retrieveMultipleRecords(
        AppConfigConstants.entityName,
        productivityPaneUniqueNameQuery
      );
      retrieveDataPromise.then(
        (response: any) => {
          if (
            response.entities[0].msdyn_msdyn_paneconfig_msdyn_appconfig.length >
            0
          ) {
            resolve(
              response.entities[0].msdyn_msdyn_paneconfig_msdyn_appconfig[0]
                .msdyn_uniquename
            );
          } else {
            reject("No Pane Configured");
          }
        },
        (error) => {
          // Telemetry here
          console.log(JSON.stringify(error));
          reject(error);
        }
      );
    });
  }

  private getProductivityPaneUniqueNameQuery(appConfigName: string) {
    let query = String.format(
      "?{0}{1}&{2}{3} eq '{4}'&{5}{6}({7}{8})",
      QueryDataConstants.SelectOperator,
      AppConfigConstants.msdyn_appmoduleuniquename,
      QueryDataConstants.FilterOperator,
      AppConfigConstants.msdyn_uniqueName,
      appConfigName,
      QueryDataConstants.ExpandOperator,
      AppConfigConstants.appPaneRelationship,
      QueryDataConstants.SelectOperator,
      ProductivityPaneConfigConstants.msdyn_uniqueName
    );
    return query;
  }

  //This function generates query to fetch productivity pane config data
  //applicationName is set to static. Need to make dynamic.
  private getProductivityPanelandTabsQuery(paneUniqueName: string): string {
    let query = String.format(
      "?{0}{1} eq '{2}'&{3}{4}",
      QueryDataConstants.FilterOperator,
      ProductivityPaneConfigConstants.msdyn_uniqueName,
      paneUniqueName,
      QueryDataConstants.ExpandOperator,
      ProductivityPaneConfigConstants.paneTabRelationship
    );
    return query;
    // query = "?$filter=msdyn_uniquename eq 'msdyn_csw_productivitypane'&$expand=msdyn_msdyn_paneconfig_msdyn_tabconfig"
  }
}
