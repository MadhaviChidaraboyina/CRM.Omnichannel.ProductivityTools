import { AppConstants, TimeoutConstants } from "../constants";
import { BasePage } from "./base.page";
import { Page } from "playwright";
import { TestSettings } from "../configuration/test-settings";
import { Iframe } from "../pages/Iframe";
import { IFrameConstants, MacrosConstants } from "../pages/Macros";
import { Constants, SelectorConstants } from "Utility/Constants";

const OrgDynamicsCrmBasePageConstants = {
  LoginPageUrl: "https://login.microsoftonline.com",
  EmailInput: "#i0116",
  NextButton: "#idSIButton9",
  PasswordInput: "#i0118",
  SignInButton: "#idSIButton9",
  NoSaveButton: "#idBtn_Back",
  TaskpaneItemList: ".taskpane-item-list"
};

const MicrosoftSignInPageConstants = {
  EmailInputSelector: "#i0116",
  NextButtonSelector: "#idSIButton9",
  PasswordInputSelector: "#i0118",
  SignInButtonSelector: "#idSIButton9",
  NoSaveButtonSelector: "#idBtn_Back",
  DefaultFillTimeout: 3000
};


export class OrgDynamicsCrmStartPage extends BasePage {
  adminPage: any;
  basepage: any;
  private _orgUrl;

  constructor(page: Page) {
    super(page);
    this.adminPage = page;
    this.basepage = new BasePage(this.adminPage);
    this._orgUrl = TestSettings.OrgUrl;
  }

  public async waitForDomContentLoaded() {
    await this.Page.waitForLoadState(Constants.DomContentLoaded);
  }
  public async navigateToOrgUrl() {
    await Promise.all([this.Page.waitForNavigation(), this.Page.goto(this._orgUrl), this.waitForDomContentLoaded()]);
  }

  private async _signIn(email: string, pwd: string) {
    await this.navigateToOrgUrl();
    await this.waitUntilSelectorIsVisible(SelectorConstants.SignInEmailInput, Constants.Three, this.Page, Constants.MaxTimeout);
    await this.Page.fill(SelectorConstants.SignInEmailInput, email, {
      timeout: Number(Constants.MaxTimeout),
    });
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    await this.Page.fill(SelectorConstants.SignInEmailInput, email);
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    await this.Page.fill(SelectorConstants.SignInEmailInput, email);
    await this.waitUntilSelectorIsVisible(SelectorConstants.SignInNextButton, Constants.Three, this.Page, Constants.MaxTimeout);
    await this.Page.click(SelectorConstants.SignInNextButton);
    await this.waitUntilSelectorIsVisible(SelectorConstants.SignInPasswordInput, Constants.Three, this.Page, Constants.MaxTimeout);
    await this.Page.fill(SelectorConstants.SignInPasswordInput, pwd);
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    await this.Page.fill(SelectorConstants.SignInPasswordInput, pwd);
    await this.Page.fill(SelectorConstants.SignInPasswordInput, pwd);
    await this.waitUntilSelectorIsVisible(SelectorConstants.SignInSignInButton, Constants.Three, this.Page, Constants.MaxTimeout);
    const signInButton = await this.Page.waitForSelector(SelectorConstants.SignInSignInButton);
    await signInButton.click();
    await this.navigateToOrgUrl();
    await this.validateLandingPage();
  }

  private async validateLandingPage() {
    await this.waitUntilSelectorIsVisible(SelectorConstants.HomePageButton, Constants.Five, this.Page, Constants.MaxTimeout);
    const homePageButton = await this.Page.waitForSelector(SelectorConstants.HomePageButton);
    const homePageButtonText = await homePageButton.textContent();
    if (homePageButtonText != Constants.HomePageText) {
      throw new Error("unable to sign-in!");
    }
  }
  public async navigateToOrgUrlAndSignIn(email: string, pwd: string) {
    let retry = 0;
    while (retry <= 3) {
      try {
        await this._signIn(email, pwd);
        retry = 4;
      } catch (e) {
        retry++;
        if (retry >= 4) {
          throw e;
        }
      }
    }
  }

  public async goToOrgUrlAndSignIn(login: string, password: string) {
    await this.goToOrgUrl();
    await this._page.waitForSelector(OrgDynamicsCrmBasePageConstants.EmailInput)
      .catch((error) => {
        throw new Error(`Can't verify that Sign in window contains input field for email, phone or Skype. Inner exception: ${error.message}`);
      });
    await this._page.fill(OrgDynamicsCrmBasePageConstants.EmailInput, login);
    await this._page.waitForTimeout(MicrosoftSignInPageConstants.DefaultFillTimeout);
    await this._page.waitForSelector(OrgDynamicsCrmBasePageConstants.NextButton)
      .catch((error => {
        throw new Error(`Can't verify that Sigh in window contains Next button. Inner exception: ${error.message}`);
      }));
    await this._page.click(OrgDynamicsCrmBasePageConstants.NextButton);
    await this._page.waitForTimeout(MicrosoftSignInPageConstants.DefaultFillTimeout);
    await this._page.waitForSelector(OrgDynamicsCrmBasePageConstants.PasswordInput)
      .catch((error) => {
        throw new Error(`Can't verify that Enter password window contains input field for password. Inner exception: ${error.message}`);
      });
    await this._page.fill(OrgDynamicsCrmBasePageConstants.PasswordInput, password);
    await this._page.waitForTimeout(MicrosoftSignInPageConstants.DefaultFillTimeout);
    await this._page.waitForSelector(OrgDynamicsCrmBasePageConstants.SignInButton)
      .catch((error) => {
        throw new Error(`Can't verify that Enter password window contains Sign in button. Inner exception: ${error.message}`);
      });
    await this._page.click(OrgDynamicsCrmBasePageConstants.SignInButton);
    await this._page.waitForTimeout(MicrosoftSignInPageConstants.DefaultFillTimeout);
    await this._page.waitForSelector(OrgDynamicsCrmBasePageConstants.NoSaveButton)
      .catch((error) => {
        throw new Error(`Can't verify that Stay signed in window contains No button. Inner exception: ${error.message}`);
      });
    await this._page.click(OrgDynamicsCrmBasePageConstants.NoSaveButton);
    await this._page.waitForLoadState("domcontentloaded");
  }

  public async goToOrgUrl() {
    await this._page.goto(TestSettings.OrgUrl + "/main.aspx?forceUCI=1&pagetype=apps");
    await this._page.waitForEvent("domcontentloaded");
  }

  public async reloadPage() {
    await this.Page.reload();
  }

  public async signIn(login: string, password: string) {
    await this._page.waitForSelector(OrgDynamicsCrmBasePageConstants.EmailInput)
      .catch((error) => {
        throw new Error(`Can't verify that Sign in window contains input field for email, phone or Skype. Inner exception: ${error.message}`);
      });
    await this._page.fill(OrgDynamicsCrmBasePageConstants.EmailInput, login);
    await this._page.waitForTimeout(MicrosoftSignInPageConstants.DefaultFillTimeout);
    await this._page.waitForSelector(OrgDynamicsCrmBasePageConstants.NextButton)
      .catch((error) => {
        throw new Error(`Can't verify that Sigh in window contains Next button. Inner exception: ${error.message}`);
      });
    await this._page.click(OrgDynamicsCrmBasePageConstants.NextButton);
    await this._page.waitForSelector(OrgDynamicsCrmBasePageConstants.PasswordInput)
      .catch((error) => {
        throw new Error(`Can't verify that Enter password window contains input field for password. Inner exception: ${error.message}`);
      });
    await this._page.fill(OrgDynamicsCrmBasePageConstants.PasswordInput, password);
    await this._page.waitForTimeout(MicrosoftSignInPageConstants.DefaultFillTimeout);
    await this._page.waitForSelector(OrgDynamicsCrmBasePageConstants.SignInButton)
      .catch((error) => {
        throw new Error(`Can't verify that Enter password window contains Sign in button. Inner exception: ${error.message}`);
      });
    await this._page.click(OrgDynamicsCrmBasePageConstants.SignInButton);
    await this._page.waitForSelector(OrgDynamicsCrmBasePageConstants.NoSaveButton)
      .catch((error) => {
        throw new Error(`Can't verify that Stay signed in window contains No button. Inner exception: ${error.message}`);
      });
    await this._page.click(OrgDynamicsCrmBasePageConstants.NoSaveButton);
    await this._page.waitForNavigation();
  }

  public async goToOmnichannelForCustomers() {
    await this.goToMyApp(AppConstants.OmnichannelForCustomer);
    //await this.waitForAgentStatusIcon();
    await this.closeGlobalSearchPopUp();
  }

  public async goToOmnichannelAdministration() {
    await this.goToMyApp(AppConstants.OmnichannelAdministration);
  }

  public async goToCustomerServiceAdminCenter() {
    await this.goToMyApp(AppConstants.CustomerServiceAdminCenter)
  }

  public async goToCustomerServiceWorkspace() {
    await this.goToMyApp(AppConstants.CustomerServiceWorkspace);
    //await this.waitForAgentStatusIcon();
  }

  public async goToCustomerServiceWorkspaceAsDND() {
    await this.goToMyApp(AppConstants.CustomerServiceWorkspace);
    // await this.waitForAgentStatusIcon();
    // await this.setAgentPresenceAsBusyDND()
  }
  public async goToCustomerServiceAdmincenter() {
    await this.goToMyApp(AppConstants.CustomerServiceAdmincenter);
  }

  public async navigateToSiteMap() {
    await this.Page.waitForSelector(SelectorConstants.AgentScriptMenuItem.replace("{0}", "Overview"));
    await this.Page.click(SelectorConstants.AgentScriptMenuItem.replace("{0}", "Overview"));
    await this.waitForDomContentLoaded();
  }

  public async goToMyApp(appName: string) {
    await this._page.waitForTimeout(Constants.DefaultTimeout);
    // await this._page.waitForSelector("iframe", {
    //   timeout: TimeoutConstants.Minute,
    // });
    const iframe = await this._page.waitForSelector(`//iframe[@id="AppLandingPage"]`)
    // const elementHandle = await this._page.$(SelectorConstants.MainContentFrame);
    const frame = await iframe.contentFrame();
    const selector = `div[title='${appName}']`;
    await this.waitUntilFrameSelectorIsVisible(selector, frame, Constants.Three, Constants.MaxTimeout);
    const tile = await frame.waitForSelector(selector);
    await tile.click();
    await this._page.waitForTimeout(Constants.DefaultTimeout);
    await this.waitForDomContentLoaded();
  }

  public async waitUntilFrameSelectorIsVisible(selectorVal: string, frame: any, maxCount = Constants.Three, timeout: number = Constants.MaxTimeout) {
    let dataCount = 0;
    while (dataCount < maxCount) {
      try {
        await frame.waitForSelector(selectorVal, { timeout });
        return true;
      } catch {
        dataCount++;
      }
    }
    return false;
  }

  // public async goToMyApp(appName: string) {
  //   const iframe = await this._page.waitForSelector(`//iframe[@id="AppLandingPage"]`)
  //     .catch((error) => {
  //       throw new Error(`Can't verify that current page is App Landing Page. Inner exception: ${error.message}`);
  //     });
  //   const iframeNodes = await iframe.contentFrame();
  //   await iframeNodes.waitForSelector(`[title="${appName}"]`)
  //     .catch((error) => {
  //       throw new Error(`Can't verify that App Landing Page contains application with name "${appName}". Inner exception: ${error.message}`);
  //     });
  //   await iframeNodes.click(`[title="${appName}"]`);
  //   await this._page.waitForEvent("domcontentloaded");
  // }

  public async goToCSWAppDesigner() {
    const iframe = await this._page.waitForSelector(`//iframe[@id="AppLandingPage"]`)
      .catch((error) => {
        throw new Error(`Can't verify that current page is App Landing Page. Inner exception: ${error.message}`);
      });
    const iframeNodes = await iframe.contentFrame();
    await iframeNodes.click(`[title="More Options"][role="button"][data-lp-id="msdyn_CustomerServiceWorkspace0-options"]`);
    await iframeNodes.click(`[aria-label="Open in App Designer"]`);
    // Time Delay to load the page
    await iframeNodes.waitForTimeout(2000);
  }

  public async goToCSWManageRoles() {
    const iframe = await this._page.waitForSelector(`//iframe[@id="AppLandingPage"]`)
      .catch((error) => {
        throw new Error(`Can't verify that current page is App Landing Page. Inner exception: ${error.message}`);
      });
    const iframeNodes = await iframe.contentFrame();
    await iframeNodes.click(`[title="More Options"][role="button"][data-lp-id="msdyn_CustomerServiceWorkspace0-options"]`);
    await iframeNodes.click(`[aria-label="Manage Roles"]`);
    await iframeNodes.click(`[title="System Customizer"]`);
    await iframeNodes.click(`[aria-label="Save"]`);
  }

  public async addSlugOrSessionConditionForExpressionBuilder(LhsValue: any, RhsValue: any) {
    const parentIframe: Page = await Iframe.GetIframe(
      this.adminPage,
      IFrameConstants.BuildExpressionParentIframe
    );
    const iframe: Page = await Iframe.GetChildIframeByParentIframe(
      this.adminPage,
      IFrameConstants.BuildExpressionParentIframe
    );
    await iframe.$eval(MacrosConstants.BuiltInTab, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.ControlCondition, (el) => {
      (el as HTMLElement).click();
    });
    const chooseName = await iframe.waitForSelector(
      MacrosConstants.DataEditorName
    );
    await chooseName.fill(LhsValue);

    await iframe.$eval(MacrosConstants.ConditionOperatorSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.ConditionOperatorValueSelector, MacrosConstants.Five, iframe, MacrosConstants.MaxTimeout);
    await iframe.$eval(MacrosConstants.ConditionOperatorValueSelector, (el) => {
      (el as HTMLElement).click();
    });

    const chooseValue = await iframe.waitForSelector(
      MacrosConstants.DataEditorValue
    );
    await chooseValue.fill("");
    await chooseValue.fill(RhsValue);
    await iframe.$eval(MacrosConstants.SelectRowSelector, (el) => {
      (el as HTMLElement).click();
    })
    await iframe.$eval(MacrosConstants.AppTextSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.GroupTypeSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.FalseConditionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.AddanAction, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.CustomerServiceSelector, MacrosConstants.Three, iframe, MacrosConstants.OpenWsWaitTimeout);
    await iframe.$eval(MacrosConstants.CustomerServiceSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.waitForSelector(MacrosConstants.SelectDefaultScriptSelector);
    await iframe.$eval(MacrosConstants.SelectDefaultScriptSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.ShowOptionSelector, MacrosConstants.Three, iframe, MacrosConstants.OpenWsWaitTimeout);
    await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
      (el as HTMLElement).focus();
    });
    await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.TextSelector.replace("{0}", MacrosConstants.AgentScriptName), MacrosConstants.Three, iframe);
    await iframe.$eval(MacrosConstants.TextSelector.replace("{0}", MacrosConstants.AgentScriptName), (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.TrueConditionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.$eval(MacrosConstants.FalseConditionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.AddanAction, MacrosConstants.Three, iframe);
    await iframe.$eval(MacrosConstants.AddanAction, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.CustomerServiceSelector, MacrosConstants.Three, iframe, MacrosConstants.OpenWsWaitTimeout);
    await iframe.waitForSelector(MacrosConstants.CustomerServiceSelector);
    await iframe.$eval(MacrosConstants.CustomerServiceSelector, (el) => {
      (el as HTMLElement).click();
    });
    await iframe.waitForSelector(MacrosConstants.SelectDefaultScriptSelector);
    await iframe.$eval(MacrosConstants.SelectDefaultScriptSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.ShowOptionSelector, MacrosConstants.Three, iframe, MacrosConstants.OpenWsWaitTimeout);
    await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
      (el as HTMLElement).focus();
    });
    await iframe.$eval(MacrosConstants.ShowOptionSelector, (el) => {
      (el as HTMLElement).click();
    });
    await this.basepage.waitUntilSelectorIsVisible(MacrosConstants.TextSelector.replace("{0}", MacrosConstants.AgentscriptName2), MacrosConstants.Three, iframe);
    await iframe.$eval(MacrosConstants.TextSelector.replace("{0}", MacrosConstants.AgentscriptName2), (el) => {
      (el as HTMLElement).click();
    });
    await parentIframe.waitForSelector(MacrosConstants.SaveExpresionBuilderBtnSelector);
    await parentIframe.$eval(MacrosConstants.SaveExpresionBuilderBtnSelector, (el) => {
      (el as HTMLElement).click();
    });
  }

  public async navigateToAgentExperienceOverview() {
    await this.waitUntilSelectorIsVisible(MacrosConstants.AgentScriptOverview);
    await this.Page.click(MacrosConstants.AgentScriptOverview);
    await this.waitForDomContentLoaded();
  }
}