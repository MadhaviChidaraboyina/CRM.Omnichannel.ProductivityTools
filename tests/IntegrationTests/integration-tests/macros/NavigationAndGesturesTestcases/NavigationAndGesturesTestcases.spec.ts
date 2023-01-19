import { BrowserContext, Page } from "playwright";
import { Constants } from "../../common/constants";
import { Macros } from "../../macropages/macrosAdmin";
import { OrgDynamicsCrmStartPage } from "../../../pages/org-dynamics-crm-start.page";
import { TestHelper } from "../../../helpers/test-helper";
import { TestSettings } from "../../../configuration/test-settings";
import { AgentChatConstants } from "../../../Utility/Constants";
import { stringFormat } from "../../../Utility/Constants";
import { AgentChat } from "../../../pages/AgentChat";
import { AgentScript } from "../../agentScript/pages/agentScriptAdmin";
import { AppProfileHelper } from "helpers/appprofile-helper";

describe("Navigation and Gestures - ", () => {
    let adminContext: BrowserContext;
    let adminPage: Page;
    let adminStartPage: OrgDynamicsCrmStartPage;
    let macrosAdminPage: Macros;
    let agentChat: AgentChat;
    let rnd: any;
    const agentScriptAdminPage = new AgentScript(adminPage);
    var caseNameList: string[] = [];

    beforeAll(async () => {
        await AppProfileHelper.getInstance().CreateAppProfile();
    })

    beforeEach(async () => {
        adminContext = await browser.newContext({
            viewport: TestSettings.Viewport, extraHTTPHeaders: {
                origin: "",
            },
        });
        adminPage = await adminContext.newPage();
        adminStartPage = new OrgDynamicsCrmStartPage(adminPage);
        macrosAdminPage = new Macros(adminPage);
        agentChat = new AgentChat(adminPage)
    });

    afterAll(async () => {
        TestHelper.dispose(adminContext);
    });

    ///<summary>
    ///Test Case 2045186: [Navigation and Gestures] : Verify if records can be opened as sessions from case views
    ///Test Case Link  https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045186
    ///<summary>        
    it("Test Case 2045186: [Navigation and Gestures] : Verify if records can be opened as sessions from case views", async () => {
        rnd = agentScriptAdminPage.RandomNumber();
        await agentChat.navigateToOrgUrlAndSignIn(
            TestSettings.AgentEmailSecond,
            TestSettings.AdminAccountPassword
        );

        await agentChat.goToMyApp(Constants.CustomerServiceWorkspace);
        await adminStartPage.waitForDomContentLoaded();
        await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);
        var CaseUserName = Constants.XRMCaseName + rnd;
        caseNameList = [CaseUserName];
        await macrosAdminPage.createIncidents(agentChat, caseNameList);
        await adminStartPage.waitUntilSelectorIsVisible(AgentChatConstants.AgentScreenAvailablitySelector,
            AgentChatConstants.Five, adminStartPage.Page, Constants.FourThousandsMiliSeconds);
            await macrosAdminPage.waitForDomContentLoaded();
            await macrosAdminPage.GoToCases();
        //Initiate session
        await macrosAdminPage.InitiateSession(
            CaseUserName,
            stringFormat(Constants.XRMSpecificCaseLink1, rnd)
        );
        await macrosAdminPage.ValidateNandGThePage(CaseUserName);
    });

    ///<summary>
    ///Test Case 2045190: [Navigation and Gestures] : Verify if records can be opened as tabs from case views
    /// Test Case Link hhttps://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045190
    ///</summary>
    it("Test Case 2045190: [Navigation and Gestures] : Verify if records can be opened as tabs from case views)", async () => {
        rnd = agentScriptAdminPage.RandomNumber();

        await agentChat.navigateToOrgUrlAndSignIn(
            TestSettings.AgentEmailSecond,
            TestSettings.AdminAccountPassword
        );
        await agentChat.goToMyApp(Constants.CustomerServiceWorkspace);
        await adminStartPage.waitForDomContentLoaded();
        await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage);

        var CaseUserName = Constants.XRMCaseName + rnd;
        caseNameList = [CaseUserName];
        //create case through XRM API
        await macrosAdminPage.createIncidents(agentChat, caseNameList);
        await adminStartPage.waitUntilSelectorIsVisible(AgentChatConstants.AgentScreenAvailablitySelector,
            AgentChatConstants.Five, adminStartPage.Page, Constants.FourThousandsMiliSeconds);
            await macrosAdminPage.waitForDomContentLoaded();
            await macrosAdminPage.GoToCases();
        //Initiate session
        await macrosAdminPage.InitiateSession(
            CaseUserName,
            stringFormat(Constants.XRMSpecificCaseLink1, rnd)
        );
        //validate record
        await macrosAdminPage.ValidateClosePage(CaseUserName);
    });

    ///<summary>
    ///Test Case 2045193: [Navigation and Gestures] : Verify if records can be opened as tabs from queue views
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045193
    ///<summary> 
    it("Test Case 2045193: [Navigation and Gestures] : Verify if records can be opened as tabs from queue views", async () => {
        rnd = agentScriptAdminPage.RandomNumber();

        await agentChat.navigateToOrgUrlAndSignIn(
            TestSettings.AgentEmailSecond,
            TestSettings.AdminAccountPassword
        );
        await adminStartPage.goToMyApp(Constants.CustomerServiceAdminCenter);

        // Create a public Queue
        await macrosAdminPage.navigateToBasicQueues();
        await macrosAdminPage.CreatePublicQueue(Constants.UserQueueName + rnd);

        await macrosAdminPage.openAppLandingPage(adminPage);
        await adminStartPage.goToCustomerServiceWorkspace();
        await adminStartPage.waitForDomContentLoaded();
        await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage)

        var CaseUserName = Constants.XRMCaseName + rnd;
        caseNameList = [CaseUserName];

        await macrosAdminPage.createIncidents(agentChat, caseNameList);

        await macrosAdminPage.addQueueToCase(CaseUserName, Constants.UserQueueName + rnd);

        await adminStartPage.waitUntilSelectorIsVisible(AgentChatConstants.AgentScreenAvailablitySelector,
            AgentChatConstants.Five, adminStartPage.Page, Constants.FourThousandsMiliSeconds);

        await macrosAdminPage.casesLinkedToQueue(stringFormat(Constants.TextPath, Constants.UserQueueName + rnd));

        //Validate Queue title
        await macrosAdminPage.ValidateTheQueueTitle(Constants.UserQueueName + rnd);
        await macrosAdminPage.ValidateThePage(stringFormat(Constants.SpanPath, CaseUserName));
    });

    ///<summary>
    ///Test Case Test Case 2045196: [Navigation and Gestures] : Verifiy if records can be opened in line from views
    ///Test Case Link https://dynamicscrm.visualstudio.com/OneCRM/_workitems/edit/2045196
    ///<summary>
    it("Test Case 2045196: [Navigation and Gestures] : Verifiy if records can be opened in line from views", async () => {
        rnd = agentScriptAdminPage.RandomNumber();

        await agentChat.navigateToOrgUrlAndSignIn(
            TestSettings.AgentEmailSecond,
            TestSettings.AdminAccountPassword
        );
        //navigating to CSW App
        await agentChat.goToMyApp(Constants.CustomerServiceWorkspace);
        await adminStartPage.waitForDomContentLoaded();
        await adminStartPage.waitUntilSelectorIsVisible(Constants.LandingPage)
        var CaseUserName = Constants.XRMCaseName + rnd;
        caseNameList = [CaseUserName];
        //create case through XRM API
        await macrosAdminPage.createIncidents(agentChat, caseNameList);
        await macrosAdminPage.waitForDomContentLoaded();
        await macrosAdminPage.GoToCases();
        await macrosAdminPage.InitiateSession(
            CaseUserName,
            stringFormat(Constants.XRMSpecificCaseLink1, rnd)
        );
        //validate records
        await macrosAdminPage.ValidateNandGThePage(CaseUserName);
        await macrosAdminPage.ValidateClosePageinTab(CaseUserName);
    });
});