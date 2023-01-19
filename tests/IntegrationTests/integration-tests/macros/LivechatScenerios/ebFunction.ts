import { Page } from "playwright";
import { Constants } from "../../common/constants";
import { BasePage } from "pages/BasePage";
import { ConstantsEB } from "../LivechatScenerios/ebConstants";

export class FunctionEB extends BasePage {
  adminPage: any;
  constructor(page: Page) {
    super(page)
    this.adminPage = page;
  }

  public async runTrueMacroAndValidate(agentScriptName: string, entitylisttitle1: string, entitylisttitle2: string) {
    //Time Delay for Loading Productivity Pane
    await this.adminPage.waitForSelector(Constants.NavigateToAgentScript);
    await this.adminPage.waitForSelector(Constants.MacroRunButton);
    await this.adminPage.click(Constants.MacroRunButton);
    await this.waitForDomContentLoaded();
    await this.adminPage.waitForTimeout(Constants.FourThousandsMiliSeconds);// Timeout required to run macro
    const MacroValidateTrue = await this.adminPage.isVisible(entitylisttitle1);
    expect(MacroValidateTrue).toBeTruthy();
    await this.adminPage.selectOption(
      Constants.AgentScriptDropDown, { label: agentScriptName }
    );
    await this.adminPage.waitForSelector(Constants.MacroRunButton);
    await this.adminPage.click(Constants.MacroRunButton);
    await this.waitForDomContentLoaded();
    await this.adminPage.waitForTimeout(Constants.FourThousandsMiliSeconds);// Timeout required to run macro
    const MacroValidateFalse = await this.adminPage.isVisible(entitylisttitle2);
    expect(MacroValidateFalse).toBeTruthy();
  }

  public async AddSessionToProfileWithPerameter(
    appProfileName: string,
    SessionName: string
  ) {
    await this.adminPage.waitForSelector(Constants.WorkspaceSiteMap);
    await this.adminPage.locator(Constants.WorkspaceSiteMap).click();
    await this.adminPage.waitForSelector(
      Constants.ManageAgentExperienceProfile
    );
    await this.adminPage.locator(Constants.ManageAgentExperienceProfile).click();
    await this.adminPage.locator(Constants.SearchAppProfile).click();
    await this.adminPage.locator(Constants.SearchAppProfile).click();
    await this.adminPage.locator(Constants.SearchAppProfile).click();
    await this.adminPage.locator(Constants.SearchAppProfile, appProfileName).click();
    await this.adminPage.locator(
      Constants.LinkStart + appProfileName + Constants.LinkEnd
    ).click();
    await this.waitForDomContentLoaded();
    // Timeout required to load session
    await this.adminPage.waitForTimeout(ConstantsEB.TenThousandsMiliSeconds); 
    const isavail = await this. adminPage.isVisible(
      ConstantsEB.EntitySessionTemplate
    );
    if (isavail) {
      await this.adminPage.waitForSelector(Constants.AddEntitySessionTemplate);
      await this.adminPage.locator(Constants.AddEntitySessionTemplate).click();
      await this.adminPage.waitForSelector(Constants.ButtonToAddEntity);
      await this.adminPage.locator(Constants.ButtonToAddEntity).click();
      await this.adminPage.locator(Constants.EntitySessionField).click();
      await this.adminPage.locator(Constants.Case).click();
      await this.adminPage.locator(Constants.SessionTemplateField).click();
      await this.adminPage.waitForSelector(
        Constants.LinkStart + SessionName + Constants.LinkEnd
      );
      await this.adminPage.locator(
        Constants.LinkStart + SessionName + Constants.LinkEnd
      ).click();
      await this.adminPage.waitForSelector(Constants.AddSessionToProfile);
      await this.adminPage.locator(Constants.AddSessionToProfile).click();
      await this.adminPage.waitForSelector(Constants.SaveAndCloseBtn);
      await this.adminPage.click(Constants.SaveAndCloseBtn);
    } else {
      await this.adminPage.waitForSelector(
        ConstantsEB.EntitySessionTemplatesEdit
      );
      await this.adminPage.locator(ConstantsEB.EntitySessionTemplatesEdit).click();
      await this.adminPage.waitForSelector(
        ConstantsEB.EntitySessionTemplatesCheckBox
      );
      await this.adminPage.locator(ConstantsEB.EntitySessionTemplatesCheckBox).click();
      await this.adminPage.waitForSelector(
        ConstantsEB.EntitySessionTemplatesEditbtn
      );
      await this. adminPage.locator(ConstantsEB.EntitySessionTemplatesEditbtn).click();
      await this.adminPage.locator(Constants.SessionTemplateField).click();
      await this. adminPage.waitForSelector(
        Constants.LinkStart + SessionName + Constants.LinkEnd
      );
      await this.adminPage.locator(
        Constants.LinkStart + SessionName + Constants.LinkEnd
      ).click();
      await this.adminPage.waitForSelector(ConstantsEB.SesionSaveAndCloseBtn);
      await this.adminPage.locator(ConstantsEB.SesionSaveAndCloseBtn).click();
      await this.adminPage.waitForSelector(Constants.SaveAndCloseBtn);
      await this.adminPage.click(Constants.SaveAndCloseBtn);
    }
  }
  
  public async addTwoAgentScriptToSesssionTemplateWithParameter(
    sessionName: string,
    agentScriptName1: string,
    agentScriptName2: string
  ) {
    await this.adminPage.waitForSelector(Constants.WorkspaceSiteMap);
    await this.adminPage.locator(Constants.WorkspaceSiteMap).click();
    await this.adminPage.waitForSelector(Constants.ManagedSession);
    await this.adminPage.locator(Constants.ManagedSession).click();
    await this.adminPage.waitForSelector(Constants.SearchOption);
    await this.adminPage.click(Constants.SearchOption);
    await this.adminPage.fill(Constants.SearchOption, sessionName);
    await this.adminPage.click(Constants.SearchTheView);
    await this.adminPage.click(Constants.LinkStart + sessionName + Constants.LinkEnd);
    await this.adminPage.waitForSelector(Constants.AgentScriptsTab);
    await this.adminPage.locator(Constants.AgentScriptsTab).click();
    await this.adminPage.locator(Constants.MoreCommandsForAgentScript).click();
    await this.adminPage.locator(Constants.AddExistingAgentScriptsBtn).click();
    await this.adminPage.locator(Constants.LookForRecordsField).click();
    await this.adminPage.fill(Constants.LookForRecordsField, agentScriptName1);
    await this.adminPage.waitForTimeout(Constants.TwoThousandsMiliSeconds);// we are using keyboard commands 2seconds wait is needed.
    await this.adminPage.keyboard.press(Constants.ArrowDown);
    await this.adminPage.waitForTimeout(Constants.TwoThousandsMiliSeconds);// we are using keyboard commands 2seconds wait is needed.
    await this.adminPage.keyboard.press(Constants.Enter);
    await this.adminPage.locator(ConstantsEB.AddMoreRecordsField).click();
    await this.adminPage.fill(ConstantsEB.AddMoreRecordsField, agentScriptName2);
    await this.adminPage.waitForTimeout(Constants.TwoThousandsMiliSeconds);// we are using keyboard commands 2seconds wait is needed.
    await this.adminPage.keyboard.press(Constants.ArrowDown);
    await this.adminPage.waitForTimeout(Constants.TwoThousandsMiliSeconds);// we are using keyboard commands 2seconds wait is needed.
    await this.adminPage.keyboard.press(Constants.Enter);
    await this.adminPage.waitForSelector(Constants.AddBtn);
    await this.adminPage.locator(Constants.AddBtn).click();
    await this.waitForDomContentLoaded();
  }
}