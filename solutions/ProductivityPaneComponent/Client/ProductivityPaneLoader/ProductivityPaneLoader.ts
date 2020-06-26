/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
///<reference path="Constants.ts" />

let _xrmApp: any = Xrm.App;
_xrmApp.panels.loadPanel({
    pageInput: {
        pageType: ProductivityPaneLoader.Constants.pageType,
        controlName: ProductivityPaneLoader.Constants.controlName,
    },
    // =True: If already have sidepanel with pageInput at target position, will auto replace with new content.
    // =false: will create new sidepanel at position, event have another sidepanel alredy
    replaceIfExisted: true,
    width: 340,
    position: 2,						// 1=left, 2=right, default = right
    state: 2,							// 0=collapsed, 1=Expanded, 2=Hidden, default = Expanded
    showTitle: false,					// default = true
    canBeClosed: false,					// will display close button in title bar
    canBeCollapsed: true,				// will display expland / collapse in title bar,
    defaultCollapsedBehavior: false,	// default = true
    isTitleStatic: true,
}).then(
    (paneId: string) => {
        console.log("Panel load success " + paneId);
        sessionStorage.setItem(ProductivityPaneLoader.Constants.sidePaneKey, paneId);
    }),
    ((error: any) =>
    {
    console.log("Panel load failed")
    });