import { Browser, chromium, Page } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { AppsOrgUrl } from "../utils/app.constants";
import { EnvVariables, User } from "../utils/test.settings";

export class UserPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  static async Login(user: User) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.Login(
      AppsOrgUrl,
      user.userName,
      user.password
    );
    //TODO: Add a check when login fails
    console.log("Successfully logged in" + user.userName);
    await page.context().storageState({
      path: `${user.userName}.json`,
    });
    browser.close();
  }
  
  static async create(browser: Browser, user: User) {
    let page = await browser.newPage();
    try {
    const context = await browser.newContext({
      storageState: `${user.userName}.json`,
    });
    page = await context.newPage();
  } catch(error){
    console.log(user);
      await this.Login(user);
      const context = await browser.newContext({
        storageState: `${user.userName}.json`,
      });
      page = await context.newPage();
  }
    return new UserPage(page);
  }
}
