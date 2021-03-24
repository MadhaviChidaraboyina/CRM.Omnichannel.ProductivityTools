/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
///<reference path="Constants.ts" />

import { APMConfigExtractor } from "./Data/APMConfigExtractor";
import { ToolConfig } from "./Models/ProductivityToolConfig";

let loadMacrosComponentInternal = function () {
  try {
    let macrosLibScript = document.createElement("script");
    macrosLibScript.src =
      Xrm.Utility.getGlobalContext().getClientUrl() +
      "/" +
      "/WebResources/CRMClients/msdyn_ProductivityMacrosComponent_internal_library.js";
    document.getElementsByTagName("body")[0].appendChild(macrosLibScript);
    console.log("Loaded msdyn_ProductivityMacrosComponent_internal_library.js");
  } catch (error) {
    console.log(
      "Failed to load msdyn_ProductivityMacrosComponent_internal_library.js"
    );
  }
};

let loadLogicAppExecutor = function () {
  try {
    let macrosLibScript = document.createElement("script");
    macrosLibScript.src =
      Xrm.Utility.getGlobalContext().getClientUrl() +
      "/" +
      "/WebResources/CRMClients/msdyn_LogicAppExecutor_v2.js";
    document.getElementsByTagName("body")[0].appendChild(macrosLibScript);
    console.log("Loaded msdyn_LogicAppExecutor_v2.js");
  } catch (error) {
    console.log("Failed to load msdyn_LogicAppExecutor_v2.js");
  }
};

let loadMacrosDataLayer = function () {
  try {
    let macrosLibScript = document.createElement("script");
    macrosLibScript.src =
      Xrm.Utility.getGlobalContext().getClientUrl() +
      "/" +
      "/WebResources/MacrosDataLayer/msdyn_MacrosDataLayer.js";
    document.getElementsByTagName("body")[0].appendChild(macrosLibScript);
    console.log("Loaded msdyn_MacrosDataLayer.js");
  } catch (error) {
    console.log("Failed to load msdyn_MacrosDataLayer.js");
  }
};

loadLogicAppExecutor();
loadMacrosComponentInternal();
loadMacrosDataLayer();

let _xrmApp: any = Xrm.App;
// _xrmApp.panels.loadPanel({
//     pageInput: {
//         pageType: ProductivityPaneLoader.Constants.pageType,
//         controlName: ProductivityPaneLoader.Constants.controlName,
//     },
//     // =True: If already have sidepanel with pageInput at target position, will auto replace with new content.
//     // =false: will create new sidepanel at position, event have another sidepanel alredy
//     replaceIfExisted: true,
//     width: 340,
//     position: 2,						// 1=left, 2=right, default = right
//     state: 2,							// 0=collapsed, 1=Expanded, 2=Hidden, default = Expanded
//     showTitle: false,					// default = true
//     canBeClosed: false,					// will display close button in title bar
//     canBeCollapsed: true,				// will display expland / collapse in title bar,
//     defaultCollapsedBehavior: false,	// default = true
//     isTitleStatic: true,
// }).then(
//     (paneId: string) => {
//         console.log("Panel load success " + paneId);
//         sessionStorage.setItem(ProductivityPaneLoader.Constants.sidePaneKey, paneId);
//     }),
//     ((error: any) =>
//     {
//     console.log("Panel load failed")
//     });
// module MscrmControls.PanelControl {

let configExtractor = new APMConfigExtractor();
configExtractor.retrieveIntitialData();
let isSmartAssistEnabled = false;
configExtractor.getProductivityPaneConfigData().productivityToolsConfig.ToolsList.forEach(
  (tool: ToolConfig) => {
    if (
      tool.isEnabled &&
      tool.toolName == "msdyn_csw_productivitypane_sa_tab"
    ) {
      isSmartAssistEnabled = true;
    }
  }
);

if (isSmartAssistEnabled) {
  let props = {
    parameters: {
      SessionContext: {
        Usage: 1,
        Static: true,
        Value: `{"event":0,"prevSessionId":"Not Available","newSessionId":"session-id-0"}`,
        Primary: false,
      },
      AnchorTabContext: {
        Usage: 1,
        Static: true,
        Value: `{"entityName":"incident","entityId":"{F8219018-DA88-EB11-B1AD-000D3A542497}","pageType":"entityrecord","createFromEntity":null}`,
        Primary: false,
      },
      IsLoadedInPanel: {
        Usage: 1,
        Static: true,
        Value: true,
        Primary: false,
      },
      StaticData: {
        Usage: 1,
        Static: true,
        Value: "{}",
        Primary: false,
      },
      IsSelected: {
        Usage: 1,
        Static: true,
        Value: true,
        Primary: false,
      },
    },
    key: "roductivitytoolcontrol_child0",
    id: "productivitytoolcontrol_child0",
  };

  _xrmApp.sidePanes
    .createPane({
      canClose: true,
      title: "SmartAssist",
    })
    .then(function (pane) {
      pane.navigate(
        {
          pageType: ProductivityPaneLoader.Constants.pageType,
          controlName:
            "MscrmControls.SmartassistPanelControl.SmartassistPanelControl",
          data: props.parameters,
        },
        {
          replaceState: false, // Not sure about his one. "* If true, a new history entry will not be added, the current one will be replaced. i.e. refresh"
          resetHistory: false,
        }
      );
      //return 'helloworld';
      return pane.paneId;
    })
    .then(
      function (paneId) {
        console.log("Panel load success " + paneId);
        sessionStorage.setItem(
          ProductivityPaneLoader.Constants.sidePaneKey,
          paneId
        );
      },
      function (error) {
        console.log("Panel load failed", error);
      }
    );
}
