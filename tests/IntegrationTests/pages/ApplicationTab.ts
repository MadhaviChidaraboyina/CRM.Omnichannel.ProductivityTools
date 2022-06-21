import { SelectorConstants } from "../Utility/Constants";
import { AdminPage } from "./AdminPage";

export enum ApplicationTab {
    ApplicationName = "App",
    ApplicationTitle = "Title",
    ApplicationDescription = "Used for creation of Application Tab Template Creation for: ",
    ApplicationEntityRecord = "entityrecord",
    EntityRecord = "Entity Record",
    ThirdParty = "Third Party Website"
  }

export class ApplicationTabPage extends AdminPage {
  public async fillApplicationTabTemplate(templateName: string, templateTitle: string, templateEntity: string) {
    await this.waitForDomContentLoaded();

    try {
      await this.Page.waitForSelector(SelectorConstants.UniqueName);
      await this.fillInputData(
        SelectorConstants.NameInput,
        templateName
      );
      await this.fillInputData(
        SelectorConstants.ApplicationTitle,
        templateTitle
      );
      await this.fillInputData(SelectorConstants.UniqueName, "new_" + templateName);
      await this.Page.selectOption(SelectorConstants.ApplicationPageType, { label: ApplicationTab.EntityRecord });
      await this.Page.fill(SelectorConstants.Description, ApplicationTab.ApplicationDescription + templateName);
      await this.Page.waitForSelector(SelectorConstants.FormSaveButton);
      await this.Page.click(SelectorConstants.FormSaveButton);
      await this.waitForSaveComplete();
    }
    catch{
      await this.fillInputData(
        SelectorConstants.NameInput,
        templateName
      );
      await this.fillInputData(
        SelectorConstants.ApplicationTitle,
        templateTitle
      );
      await this.fillLookupField(SelectorConstants.ApplicationType, SelectorConstants.ApplicationTypeLookupSearch, SelectorConstants.ApplicationTypeLookUpValue, templateEntity);
      await this.Page.fill(SelectorConstants.Description, ApplicationTab.ApplicationDescription + templateName);
      await this.Page.waitForSelector(SelectorConstants.FormSaveButton);
      await this.Page.click(SelectorConstants.FormSaveButton);
      await this.waitForSaveComplete();
    }
  }

  public async validateApplicationType(expectedApplicationType: string,expectedPageType:string) {
    try{
    const locator = await this.Page.waitForSelector(SelectorConstants.PageType);
    const applicationType = await locator.innerText();
    return applicationType == expectedPageType
    }
    catch{
      const locator = await this.Page.waitForSelector(SelectorConstants.CreatedApplicationType);
      const applicationType = await locator.innerText();
      return applicationType == expectedApplicationType
    }
  }
}