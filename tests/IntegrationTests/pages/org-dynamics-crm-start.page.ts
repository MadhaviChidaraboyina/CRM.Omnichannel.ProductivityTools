import { AppConstants, TimeoutConstants } from "../constants";

import { BasePage } from "./base.page";
import { Page } from "playwright";
import { TestSettings } from "../configuration/test-settings";

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

  constructor(page: Page) {
    super(page);
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
    await this.waitForAgentStatusIcon();
    await this.closeGlobalSearchPopUp();
  }

  public async goToOmnichannelAdministration() {
    await this.goToMyApp(AppConstants.OmnichannelAdministration);
  }

  public async goToCustomerServiceAdminCenter(){
    await this.goToMyApp(AppConstants.CustomerServiceAdminCenter)
  }

  public async goToCustomerServiceWorkspace() {
    await this.goToMyApp(AppConstants.CustomerServiceWorkspace);
}
public async goToCustomerServiceAdmincenter() {
  await this.goToMyApp(AppConstants.CustomerServiceAdmincenter);
}

  public async goToMyApp(appName: string) {
    const iframe = await this._page.waitForSelector(`//iframe[@id="AppLandingPage"]`)
      .catch((error) => {
        throw new Error(`Can't verify that current page is App Landing Page. Inner exception: ${error.message}`);
      });
    const iframeNodes = await iframe.contentFrame();
    await iframeNodes.waitForSelector(`[title="${appName}"]`)
      .catch((error) => {
        throw new Error(`Can't verify that App Landing Page contains application with name "${appName}". Inner exception: ${error.message}`);
      });
    await iframeNodes.click(`[title="${appName}"]`);
    await this._page.waitForEvent("domcontentloaded");
  }

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
}