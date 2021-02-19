/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApiInternal.d.ts"/>
///<reference path="Constants.ts" />
/// <reference path="../TypeDefinitions/AppRuntimeClientSdk.d.ts"/>

let loadMacrosComponentInternal = function () {
  try {
    let macrosLibScript = document.createElement('script');
    macrosLibScript.src =
      Xrm.Utility.getGlobalContext().getClientUrl() +
      '/' +
      '/WebResources/CRMClients/msdyn_ProductivityMacrosComponent_internal_library.js';
    document.getElementsByTagName('body')[0].appendChild(macrosLibScript);
    console.log('Loaded msdyn_ProductivityMacrosComponent_internal_library.js');
  } catch (error) {
    console.log(
      'Failed to load msdyn_ProductivityMacrosComponent_internal_library.js'
    );
  }
};

let loadLogicAppExecutor = function () {
  try {
    let macrosLibScript = document.createElement('script');
    macrosLibScript.src =
      Xrm.Utility.getGlobalContext().getClientUrl() +
      '/' +
      '/WebResources/CRMClients/msdyn_LogicAppExecutor_v2.js';
    document.getElementsByTagName('body')[0].appendChild(macrosLibScript);
    console.log('Loaded msdyn_LogicAppExecutor_v2.js');
  } catch (error) {
    console.log('Failed to load msdyn_LogicAppExecutor_v2.js');
  }
};

let loadMacrosDataLayer = function () {
  try {
    let macrosLibScript = document.createElement('script');
    macrosLibScript.src =
      Xrm.Utility.getGlobalContext().getClientUrl() +
      '/' +
      '/WebResources/MacrosDataLayer/msdyn_MacrosDataLayer.js';
    document.getElementsByTagName('body')[0].appendChild(macrosLibScript);
    console.log('Loaded msdyn_MacrosDataLayer.js');
  } catch (error) {
    console.log('Failed to load msdyn_MacrosDataLayer.js');
  }
};

loadLogicAppExecutor();
loadMacrosComponentInternal();
loadMacrosDataLayer();

let _xrmApp: any = Xrm.App;

var isMultisession = function () {
  return !!_xrmApp.sessions;
};

var shouldShowProductivityPaneLauncher = function (): boolean {
  return (
    isMultisession() &&
    Xrm.Internal.isFeatureEnabled(
      ProductivityPaneLoader.Constants.FCB_EmbedCollab
    )
  );
};

var getFocusedSessionId = function (): string {
  return Microsoft.AppRuntime.Sessions.getFocusedSession().sessionId;
};

var isFocusedOnHomeSession = function (): boolean {
  const sessionId = getFocusedSessionId();
  return sessionId === ProductivityPaneLoader.Constants.HomeSessionId;
};

var loadWidget = function () {
  const paneId = sessionStorage.getItem(
    ProductivityPaneLoader.Constants.sidePaneKey
  );

  let sidepanel = null;
  if (paneId) {
    sidepanel = _xrmApp.panels.getPanel(paneId);
  }

  if (
    sidepanel &&
    sidepanel.title === ProductivityPaneLoader.Constants.sidePaneTitle &&
    !isFocusedOnHomeSession()
  ) {
    sidepanel.state = XrmClientApi.Constants.PanelState.Expanded;
  } else {
    var panelState = isFocusedOnHomeSession()
      ? XrmClientApi.Constants.PanelState.Hidden
      : XrmClientApi.Constants.PanelState.Expanded;
    _xrmApp.panels
      .loadPanel({
        pageInput: {
          pageType: ProductivityPaneLoader.Constants.pageType,
          controlName: ProductivityPaneLoader.Constants.controlName,
        },
        // =True: If already have sidepanel with pageInput at target position, will auto replace with new content.
        // =false: will create new sidepanel at position, event have another sidepanel already
        replaceIfExisted: true,
        width: 340,
        position: XrmClientApi.Constants.PanelPosition.Right,
        state: panelState,
        showTitle: false,
        canBeClosed: false,
        canBeCollapsed: false,
        defaultCollapsedBehavior: false,
        isTitleStatic: true,
        title: ProductivityPaneLoader.Constants.sidePaneTitle,
      })
      .then(
        (paneId: string) => {
          console.log('Panel load success ' + paneId);
          sessionStorage.setItem(
            ProductivityPaneLoader.Constants.sidePaneKey,
            paneId
          );
        },
        (error: any) => {
          console.log('Panel load failed', error);
        }
      );
  }
};

_xrmApp.panels
  .loadPanel({
    pageInput: {
      pageType: ProductivityPaneLoader.Constants.pageType,
      controlName: ProductivityPaneLoader.Constants.controlName,
    },
    // =True: If already have sidepanel with pageInput at target position, will auto replace with new content.
    // =false: will create new sidepanel at position, event have another sidepanel alredy
    replaceIfExisted: true,
    width: 340,
    position: XrmClientApi.Constants.PanelPosition.Right,
    state: XrmClientApi.Constants.PanelState.Hidden,
    showTitle: false, // default = true
    canBeClosed: false, // will display close button in title bar
    canBeCollapsed: true, // will display expand / collapse in title bar,
    defaultCollapsedBehavior: false, // default = true
    isTitleStatic: true,
    title: ProductivityPaneLoader.Constants.sidePaneTitle,
  })
  .then(
    (paneId: string) => {
      console.log('Panel load success ' + paneId);
      sessionStorage.setItem(
        ProductivityPaneLoader.Constants.sidePaneKey,
        paneId
      );
    },
    (error: any) => {
      console.log('Panel load failed', error);
    }
  );
