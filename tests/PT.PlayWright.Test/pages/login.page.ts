import { Locator, Page } from "@playwright/test";
import * as selectors from "./selectors.json";
import { ElementRoles } from "../utils/test.utils";

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  protected emailInputLocator(): Locator {
    return this.page.locator(selectors.LoginPage.EmailInput);
  }

  protected nextButtonLocator(): Locator {
    return this.page.getByRole(ElementRoles.Button, {
      name: selectors.LoginPage.NextButton,
    });
  }

  protected passwordInputLocator(): Locator {
    return this.page.locator(selectors.LoginPage.PasswordInput);
  }

  protected signInButtonLocator(): Locator {
    return this.page.getByRole(ElementRoles.Button, {
      name: selectors.LoginPage.SignInButton,
    });
  }

  public async Login(orgUrl: string, username: string, password: string) {
    await Promise.all([this.page.waitForNavigation(), this.page.goto(orgUrl)]);
    await this.emailInputLocator().fill(username);
    await this.nextButtonLocator().click();
    await this.passwordInputLocator().click();
    await this.passwordInputLocator().fill(password);
    await Promise.all([
      this.page.waitForNavigation(),
      this.signInButtonLocator().click(),
    ]);
  }
}
