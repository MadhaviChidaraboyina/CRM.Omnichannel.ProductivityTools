import { Constants, SelectorConstants } from "../Utility/Constants";

import { AdminPage } from "../pages/AdminPage";
import { FacebookMessangerConstants } from "../pages/FacebookMessanger";
import { Page } from "playwright";

export enum FileAttachmentConstants {
    FacebookTabSelector = "//*[@aria-label='Facebook']",
    WeChatSelector = "//*[@aria-label='WeChat']",
    FacebookPageNameSelector = "//*[@title='{0}']",
    GeneralSettingsTab = "//*[@aria-label='General settings']",
    FileUploadRadioButtonForAgentYesOption = "//*[@data-id='msdyn_enablefileattachmentsforagents.fieldControl-checkbox-containercheckbox-inner-second']",
    FileUploadRadioButtonForCustomerYesOption = "//*[@data-id='msdyn_enablefileattachmentsforcustomers.fieldControl-checkbox-containercheckbox-inner-second']",
    FileUploadLabelForAgentYesOption = "//*[@data-id='msdyn_enablefileattachmentsforagents.fieldControl-checkbox-inner-second']",
    FileUploadLabelForCustomerYesOption = "//*[@data-id='msdyn_enablefileattachmentsforcustomers.fieldControl-checkbox-inner-second']",
    FileUploadRadioButtonForAgentNoOption = "//*[@data-id='msdyn_enablefileattachmentsforagents.fieldControl-checkbox-containercheckbox-inner-first']",
    FileUploadRadioButtonForCustomerNoOption = "//*[@data-id='msdyn_enablefileattachmentsforcustomers.fieldControl-checkbox-containercheckbox-inner-first']",
}

export class FileAttachment extends AdminPage {
    constructor(page: Page) {
        super(page);
    }

    public async navigateToFacebookTab() {
        await this.Page.click(FileAttachmentConstants.FacebookTabSelector);
    }
    public async navigateToWeChatTab() {
        await this.Page.click(FileAttachmentConstants.WeChatSelector);
    }

    public async searchFacebookAccountRecordAndClick(facebookAccountName: string) {
        await this.searchRecordAndClick(facebookAccountName);
    }

    public async searchFacebookPageRecordAndClick(facebookPageName: string) {
        await this.Page.click(FileAttachmentConstants.FacebookPageNameSelector.replace("{0}", facebookPageName));
    }

    public async enableFileAttachmentOption() {
        await this.Page.click(FileAttachmentConstants.GeneralSettingsTab);

        //Agent File Upload Button
        const agentYesOption = await this.waitUntilSelectorIsVisible(FileAttachmentConstants.FileUploadLabelForAgentYesOption, FacebookMessangerConstants.One, this.Page, Constants.FourThousandsMiliSeconds);
        if (!agentYesOption) {
            await this.Page.click(FileAttachmentConstants.FileUploadRadioButtonForAgentYesOption);
        }
        else {
            await this.Page.click(FileAttachmentConstants.FileUploadRadioButtonForAgentNoOption);
            await this.Page.click(FileAttachmentConstants.FileUploadRadioButtonForAgentYesOption);
        }

        //Customer File Upload Button
        const customerYesOption = await this.waitUntilSelectorIsVisible(FileAttachmentConstants.FileUploadLabelForCustomerYesOption, FacebookMessangerConstants.One, this.Page, Constants.FourThousandsMiliSeconds);
        if (!customerYesOption) {
            await this.Page.click(FileAttachmentConstants.FileUploadRadioButtonForCustomerYesOption);
        }
        else {
            await this.Page.click(FileAttachmentConstants.FileUploadRadioButtonForCustomerNoOption);
            await this.Page.click(FileAttachmentConstants.FileUploadRadioButtonForCustomerYesOption);
        }
        await this.Page.click(SelectorConstants.FormSaveAndCloseButton);
    }
}