import { Constants } from "@azure/cosmos";
import { Page } from "playwright";
import { LiveChatPage } from "./LiveChat";

export enum PortalPageConstants {
    PortalUsernameInputSelector = "#Username",
    PortalPasswordInputSelector = "#PasswordValue",
    PortalSigninButtonSelector = "button#submit-signin-local",
    PortalNavDropDown = "#navbar > div.navbar-right.menu-bar > ul > li:last-child > a.dropdown-toggle",
    PortalSignInLink = "//*[@aria-label='Sign in']",
    PortalSignoutLink = "a[role='menuitem'][aria-label='Sign out']",
    PortalLocalLogin = "#local-login-heading",
}

export enum TimeConstant {
    Five = 5,
    ThreeThousand = 3000
}

export class LiveChatPortalPage extends LiveChatPage {
    constructor(page: Page) {
        super(page);
    }

    public async loginToPortal(email: string, password: string) {
        const timeout: number = TimeConstant.ThreeThousand;
        await this.waitUntilSelectorIsVisible(PortalPageConstants.PortalSignInLink,TimeConstant.Five,null,TimeConstant.ThreeThousand);
        await this.Page.waitForSelector(PortalPageConstants.PortalSignInLink, { timeout: timeout });
        await this.Page.click(PortalPageConstants.PortalSignInLink);
        await this.waitForDomContentLoaded();

        await this.waitUntilSelectorIsVisible(PortalPageConstants.PortalLocalLogin,TimeConstant.Five,null,TimeConstant.ThreeThousand);
        await this.waitUntilSelectorIsVisible(PortalPageConstants.PortalUsernameInputSelector,TimeConstant.Five,null,TimeConstant.ThreeThousand);
        await this.Page.waitForSelector(PortalPageConstants.PortalUsernameInputSelector, { timeout: timeout });
        await this.Page.fill(PortalPageConstants.PortalUsernameInputSelector, email);

        await this.waitUntilSelectorIsVisible(PortalPageConstants.PortalPasswordInputSelector,TimeConstant.Five,null,TimeConstant.ThreeThousand);
        await this.Page.waitForSelector(PortalPageConstants.PortalPasswordInputSelector, { timeout: timeout });
        await this.Page.fill(PortalPageConstants.PortalPasswordInputSelector, password);

        await this.waitUntilSelectorIsVisible(PortalPageConstants.PortalSigninButtonSelector,TimeConstant.Five,null,TimeConstant.ThreeThousand);
        await this.Page.waitForSelector(PortalPageConstants.PortalSigninButtonSelector, { timeout: timeout });
        await this.Page.click(PortalPageConstants.PortalSigninButtonSelector);
        await this.waitForDomContentLoaded();
    }

    public async logoutFromPortal() {
        await this.Page.waitForSelector(PortalPageConstants.PortalNavDropDown);
        await this.Page.click(PortalPageConstants.PortalNavDropDown);
        await this.Page.waitForSelector(PortalPageConstants.PortalSignoutLink);
        await this.Page.click(PortalPageConstants.PortalSignoutLink);
        await this.waitForDomContentLoaded();
    }
}
