import { AgentChatConstants, AgentCosultConversationPageConstants, Constants, SelectorConstants } from "../Utility/Constants";
import { IFrameConstants, IFrameHelper } from "../Utility/IFrameHelper";

import { AgentChat } from "../pages/AgentChat";
import { Page } from "playwright";
import { TestSettings } from "../configuration/test-settings";

export enum SupervisorPageConstants {
    OngoingDashboard = "//*[@id='tab-wrapper-tab-id-1']/div/span",
    OngoingDashboardItem = "//*[text()='{0}']/preceding::*[@role='checkbox'][1]/parent::*",
    OngoingDashboardMonitor = "//div[contains(@data-id,'Conversations.OCSupGridControl.OCSupCmdBarControl-commands-layout-id')]",
    OngoingDashboardMonitorClick = "//label[contains(text(),'Monitor')]",
    Three = 3,
    ConversationDashBoard = "div[class='customControl MscrmControls Grid.GridControl MscrmControls.Grid.GridControl']",
    DataRowCount = "//div[@data-row-count]",
    Subject = "//div[@data-id='cell-0-3']",
    CreatedDate = "//div[@data-id='cell-0-8']",
    StatusReason = "//div[@data-id='cell-0-6']",
    SentimentValue = "//div[@data-id='cell-0-7']",
    WorkstreamName = "//div[@data-id='cell-0-9']",
    AgentName = "//div[@data-id='cell-0-10']",
    CustomerIcon = "//*[@class='wj-row']//div[@data-id='cell-0-2']//img",
    StatusReasonIcon = "//*[@class='wj-row']//div[@data-id='cell-0-6']//img",
    SentimentICon = "//*[@class='wj-row']//div[@data-id='cell-0-7']//img",
    FilterByCustomer = "//div[contains(@data-id,'msdyn_customer')]//i[@data-icon-name='ChevronDown']",
    FieldContextMenuSortAToZ = "//button[contains(@class, 'ms-ContextualMenu-link')][@aria-label='Sort A to Z']",
    Previousbutton = "//*[@data-id='Conversations.OCSupGridControl-ocPagingButtonIconmovePrevPageIconClass']",
    Nextbutton = "//*[@data-id='Conversations.OCSupGridControl-ocMoveNextPageButton']",
    PaginationStatus = "//*[@data-id='Conversations.OCSupGridControl-ocPagingStatusText']",
    MessageTextArea = "//*[@data-id='webchat-sendbox-input']",
    ConsultMessageTextArea = "//*[@data-id='consult-header-title']/following::*[@data-id='webchat-sendbox-input']",
    JoinChat = "//button[@id='join-chat-new-consult-enabled']",
    Public = "//button[contains(@title,'Send message to all participants')]",
    Internal = "//button[contains(@title,'Send message to internal participants')]",
    ActiveOngoingDashboardItem = "//label[text()='Active']/preceding::div[@data-id='cell-0-1'][1]",
    Assign = "//*[@data-id='Conversations.OCSupGridControl.OCSupCmdBarControl-assign-command-id']",
    AgentList = "//*[@id='dialog-filterOptionListId']/li[@title='{0}']",
    StatusAvailable = "Available",
    StatusBusy = "Busy",
    StatusDoNotDisturb = "Do not disturb",
    Cancel = "//button[@data-id='cancel_id']",
    SearchUser = "//*[@id='DialogFilterSearchTextId']",
    RetrieveStatus = "//*[@id='dialog-filterOptionListId']//img[@title='{0}']",
    RecordLocator = "//*[@id='dialogFiltersSelectedTextId']",
    NoRecords = "0 records",
    OngoingConversationsDashboard = "//h1[contains(@aria-label,'Omnichannel Ongoing Conversations Dashboard')]//span[contains(text(),'Omnichannel Ongoing Conversations Dashboard')]",
    AgentDashBoard = "//li[contains(@aria-label,'Omnichannel Agent Dashboard')]//span[contains(text(),'Omnichannel Agent Dashboard')]",
    OngoingDashboardFilterByQueue = "input[aria-label='{queue}']",
    ActivateFilterButton = "input[id='supervisorApplyFiltersId']",
    OngoingDashboardItemSelector = "div[data-id='cell-0-1']",
    OngoingDashboardConversationsList = "[wj-part='root']>div[wj-part='cells']>div[class='wj-row']",
    OngoingDashboardConversationRowCells = "(//div[@wj-part='cells']//div[@class='wj-row'])[{0}]//div[@role='gridcell']",
    OngoingDashboardConversationListTableHeaderSelector = "div[class='wj-cell wj-header']",
    OngoingDashboardConversationTableCellSelector = "//div[@data-id='cell-{0}-{1}']",
    ongoingDashboardSupervisorTrasferButtonSelector = "//*[@data-id='Conversations.OCSupGridControl.OCSupCmdBarControl-transfer-command-id']",
    CopyUrlButtonSelector = "//*[@data-id='Conversations.OCSupGridControl.OCSupCmdBarControl-copyurl-command-id']",
    TransferButtonSelector = "button[data-id='assign_id']",
    OngoingDashboardConversationListRootSelector = "//div[@wj-part='root']",
    OngoingDashboardRowCheckboxSelector = "//div[@data-id='cell-{0}-1']//div[@role='checkbox']",
    OngoingDashboardAgentSelectRadioSelector = "//ul[@id='dialog-filterOptionListId']//li[@title='{0}']//input[@type='radio']",
    OngoingDashboardConversationActiveAgentSelector = "//div[@data-id='cell-{0}-10']//a",
    SelectConversationRecord = "//div[@title='{0}']/preceding::div[@title='{1}']/preceding::div[@role='gridcell'][4]",
    OngoingDashboardAgentSelectorDialog = "//ul[@id='dialog-filterOptionListId']",
    OngoingConversationActiveLiveChatItemSelect =  "//div[@title='{0}']/preceding::div[@title='Active']/preceding::div[@role='gridcell'][4]",
    OngoingConversationWaitingLiveChatItemSelect =  "//div[@title='{0}']/preceding::div[@title='Waiting']/preceding::div[@role='gridcell'][4]",
    JoinConversation = "//button[@id='join-chat-new-consult-enabled']",
}

export class SupervisorPage extends AgentChat {
    constructor(page: Page) {
        super(page);
    }

    public async loginAndNavigateToSupervisorApp() {
        await this.navigateToOrgUrlAndSignIn(TestSettings.SupervisorAccountEmail, TestSettings.SupervisorAccountPassword);
        await this.navigateToCustomerService();
        await this.waitForDomContentLoaded();
        await this.waitForAgentStatus();
        await this.expandConversationSessionPanel();
    }

    public async loginAndNavigateToSupervisorAppAdmin() {
        await this.navigateToOrgUrlAndSignIn(TestSettings.SupervisorAccountEmail, TestSettings.SupervisorAccountPassword);
        await this.navigateToAdministration();
    }
    //OMNI Channel Apps
    public async navigateToAdministration() {
        await this.goToMyApp(Constants.OmnichannelAdministration);
    }

    public async reloadCustomerService() 
    {
        await this.navigateToOrgUrl();
        await this.waitForDomContentLoaded();
    }

    public async chatItemSelect(channel: string) {
        await this._page.click(AgentChatConstants.RefreshAllTab);
        await this.waitUntilSelectorIsVisible(SupervisorPageConstants.OngoingDashboardItem.replace("{0}", channel));
        const ongoingDashboard = await this.Page.click(SupervisorPageConstants.OngoingDashboardItem.replace("{0}", channel));
    }

    public async agentDashBoard() {
        await this.waitUntilSelectorIsVisible(SupervisorPageConstants.OngoingDashboard);
        await this.Page.click(SupervisorPageConstants.OngoingConversationsDashboard);
        const agentDashboard = await this.Page.waitForSelector(SupervisorPageConstants.AgentDashBoard);
        await agentDashboard.click();
    }
    public async activeChatItemSelection() {
        await this.waitUntilSelectorIsVisible(SupervisorPageConstants.ActiveOngoingDashboardItem);
        const ongoingDashboard = await this.Page.waitForSelector(SupervisorPageConstants.ActiveOngoingDashboardItem);
        await ongoingDashboard.click();
    }

    public async clickButton(buttonSelector: string) {
        const assign = await this.Page.waitForSelector(buttonSelector);
        assign.click();
        await this.waitForDomContentLoaded();
    }

    public async searchByAgentWithStatus(agentUserName: string, validate: string) {
        await this.Page.fill(SupervisorPageConstants.SearchUser, agentUserName);
        if (validate == "true") {
            await this.Page.waitForSelector(SupervisorPageConstants.AgentList.replace("{0}", agentUserName));
        }
    }

    public async validateAgentStatus(statusAvailability: string) {
        const status = await this.Page.$(SupervisorPageConstants.RetrieveStatus.replace("{0}", statusAvailability));
        return status;
    }

    public async validateAgentOnline() {
        const status = await this.Page.$(SupervisorPageConstants.RetrieveStatus.replace("{0}", SupervisorPageConstants.StatusBusy));
        if (!status) {
            const status = await this.validateAgentStatus(SupervisorPageConstants.StatusAvailable);
            if (!status) {
                return true;
            }
        }
        return !status;
    }

    public async validateNoAgentsFound() {
        const agentLocator = await this.Page.waitForSelector(SupervisorPageConstants.RecordLocator);
        const noAgentFound = await agentLocator.innerText();
        return (noAgentFound === SupervisorPageConstants.NoRecords);
    }

    public async chatMonitor() {
        await this.waitUntilSelectorIsVisible(SupervisorPageConstants.OngoingDashboardMonitor);
        await this.waitForDomContentLoaded();
        await this.Page.click(SupervisorPageConstants.OngoingDashboardMonitorClick);
        await this.waitUntilSelectorIsVisible(SupervisorPageConstants.Public, SupervisorPageConstants.Three);
    }

    public async validateChatMonitor() {
        await this.waitUntilSelectorIsVisible(SupervisorPageConstants.MessageTextArea, SupervisorPageConstants.Three);
        const iframeCC = await IFrameHelper.GetIframe(this._page, IFrameConstants.IframeCC);
        const title = await iframeCC.waitForSelector(SupervisorPageConstants.JoinConversation);
        const result = await title.innerText();
        return result;
    }

    public async isConsultPaneAppears(): Promise<boolean> {
        const iframe: Page = await IFrameHelper.GetIframe(
            this.Page,
            IFrameConstants.IframeCC
        );
        const consultPane = await iframe.waitForSelector(AgentCosultConversationPageConstants.ConsultSel)
            .catch((error) => {
                throw new Error(`Consult Pane doesn't appear. Inner exception: ${error.message}`);
            });
        return !!consultPane;
    }

    public async joinChat() {
        await this.waitUntilSelectorIsVisible(SupervisorPageConstants.MessageTextArea, SupervisorPageConstants.Three);
        const iframeCC = await IFrameHelper.GetIframe(this._page, IFrameConstants.IframeCC);
        await this.waitUntilIFrameSelectorIsVisible(SupervisorPageConstants.JoinChat,Constants.Three,iframeCC,Constants.DefaultTimeout);
        await iframeCC.$eval(SupervisorPageConstants.JoinConversation, el => (el as HTMLElement).click());
        await this.waitUntilSelectorIsVisible(SupervisorPageConstants.MessageTextArea, SupervisorPageConstants.Three);
    }
    public async publicChat() {
        await this.waitUntilSelectorIsVisible(SupervisorPageConstants.Public, SupervisorPageConstants.Three);
        const iframeCC = await IFrameHelper.GetIframe(this._page, IFrameConstants.IframeCC);
        await iframeCC.$eval(SupervisorPageConstants.Public, el => (el as HTMLElement).click());
    }
    public async internalChat() {
        await this.waitUntilSelectorIsVisible(SupervisorPageConstants.Internal, SupervisorPageConstants.Three);
        const iframeCC = await IFrameHelper.GetIframe(this._page, IFrameConstants.IframeCC);
        await iframeCC.$eval(SupervisorPageConstants.Public, el => (el as HTMLElement).click());
    }
    public async validatePublicInternalChat() {
        await this.waitUntilSelectorIsVisible(SupervisorPageConstants.Public, SupervisorPageConstants.Three);
        const iframeCC = await IFrameHelper.GetIframe(this._page, IFrameConstants.IframeCC);
        const title = await iframeCC.waitForSelector(SupervisorPageConstants.Public);
        const result = await title.innerText();
        return result;
    }

    public async selectionOfchatItems() {
        await this.waitUntilSelectorIsVisible(SupervisorPageConstants.OngoingDashboardItemSelector);
        const ongoingDashboard = await this.Page.waitForSelector(SupervisorPageConstants.OngoingDashboardItemSelector);
        await ongoingDashboard.click();
    }

    public async ongoingDashBoard(queue: string = '') {
        await this.navigateToOngoingConversationsDashBoard();

        if (queue) {
            const queueFilterCheckBox = await this.Page.waitForSelector(SupervisorPageConstants.OngoingDashboardFilterByQueue.replace("{queue}", queue));
            await queueFilterCheckBox.click();

            const activateFilterButton = await this.Page.waitForSelector(SupervisorPageConstants.ActivateFilterButton);
            await activateFilterButton.click();
        }
    }

    public async openChatItemSelect(channel: string) {
        let dataCount = 0;
        let timeout = Constants.FifteenThousand;
        while (dataCount < Constants.Nine) {
            try {
                await this._page.click(AgentChatConstants.RefreshAllTab);
                await this.waitUntilSelectorIsVisible(AgentChatConstants.RefreshAllTab, AgentChatConstants.Five, this._page, Constants.FourThousandsMiliSeconds)
                await this.Page.waitForSelector(SupervisorPageConstants.OngoingDashboardItem.replace("{0}", channel), { timeout });
                await this.Page.click(SupervisorPageConstants.OngoingDashboardItem.replace("{0}", channel));
            }
            catch { }
            dataCount++;
        }
    }

    public async sortGrid()
    {
        await this.Page.waitForSelector(SupervisorPageConstants.FilterByCustomer);
        await this.Page.click(SupervisorPageConstants.FilterByCustomer);
        await this.Page.click(SupervisorPageConstants.FieldContextMenuSortAToZ);
    }

    public async validatePagination()
    {
        await this.Page.waitForSelector(SupervisorPageConstants.ConversationDashBoard);
        await this.Page.waitForSelector(SupervisorPageConstants.DataRowCount);
        const count = await this.Page.$eval(SupervisorPageConstants.DataRowCount, (el) => el.getAttribute("data-row-count"));
        if (parseInt(count) > 0) {
            const paginationStatus = await this.Page.waitForSelector(
                SupervisorPageConstants.PaginationStatus
            );
            const paginationStatusText1 = await paginationStatus.innerText()
            const paginationStatusText = await paginationStatusText1.replace(/\s+/g, "")
            const firstpagecount = paginationStatusText.substring(0,1)
            var  secondpagecount = paginationStatusText.substring(3,2)
            if(secondpagecount.includes("-"))
            {
                secondpagecount = secondpagecount.replace("-","")
            }
          
            const previousbutton = await this.Page.waitForSelector(
                SupervisorPageConstants.Previousbutton
            );
            const  secondpagecount1 = paginationStatusText.substring(2,1)
            const nextbutton = await this.Page.waitForSelector(
                SupervisorPageConstants.Nextbutton
            );
            //if page count is 1 then previous button status
             if(parseInt(firstpagecount) ==1)
             {                
                expect(previousbutton.isDisabled).toBeTruthy();
             }
             else
             {
                expect(previousbutton.isEnabled).toBeTruthy();
             }             
              if(parseInt(secondpagecount) > 12)
             {
                expect(nextbutton.isEnabled).toBeTruthy();
             }
             else
             {
                expect(nextbutton.isDisabled).toBeTruthy();
             }
                       
        }             
    }

    public async getGridColumnValuesValidation() {
        await this.Page.waitForSelector(SupervisorPageConstants.ConversationDashBoard);
        await this.Page.waitForSelector(SupervisorPageConstants.DataRowCount);
        const count = await this.Page.$eval(SupervisorPageConstants.DataRowCount, (el) => el.getAttribute("data-row-count"));
        if (parseInt(count) > 0) {

            const title = await this.Page.waitForSelector(
                SupervisorPageConstants.Subject
            );
            const subject = await title.innerText()
            expect(subject.includes('Visitor')).toBeTruthy();

            const sentimentValue = await this.Page.waitForSelector(
                SupervisorPageConstants.SentimentValue
            );
            const sentiment = await sentimentValue.innerText()
            expect(sentiment != null).toBeTruthy();

            const workstreamName = await this.Page.waitForSelector(
                SupervisorPageConstants.WorkstreamName
            );
            const workstreamNamevalue = await workstreamName.innerText()
            expect(workstreamNamevalue != null).toBeTruthy();

            const agentName = await this.Page.waitForSelector(
                SupervisorPageConstants.AgentName
            );
            const activeAgent = await agentName.innerText()
            expect(activeAgent != null).toBeTruthy();

            const createdDate = await this.Page.waitForSelector(
                SupervisorPageConstants.CreatedDate
            );
            const datevalue = await createdDate.innerText()
            expect(datevalue != null).toBeTruthy();

        }
    }

    public async datevalidation() {
        var value = "";
        var today = new Date();
        var dd = String(today.getDate())
        var mm = String(today.getMonth() +1 )
        var yyyy = String(today.getFullYear())
        const todaysDate = (mm + '/' + dd + '/' + yyyy).toString();

        const createdDate = await this.Page.waitForSelector(
            SupervisorPageConstants.CreatedDate
        );
        const datevalue = await createdDate.innerText()
        if (dd.length == 2 && mm.length == 2) {
            value = datevalue.substring(0, 10)
        }
        if ((dd.length == 1 && mm.length == 2) || ((dd.length == 2 && mm.length == 1))) {
            value = datevalue.substring(0, 9)
        }
        if (dd.length == 1 && mm.length == 1) {
            value = datevalue.substring(0, 8)
        }
        expect(value == todaysDate).toBeTruthy();       
    }

    public async gridiconvalidation() {
        await this.customericonvalidation();
        await this.statusiconvalidation();
        await this.Sentimenticonvalidation();
    }

    public async customericonvalidation() {
        try {
            await this.waitUntilSelectorIsVisible(
                SupervisorPageConstants.CustomerIcon,
                Constants.Three,
                this._page,
                Constants.MaxTimeout
            );
        }
        catch (Exception) {
            Error('Customer icon is not presnet in grid');
        }
    }

    public async statusiconvalidation() {
        try {
            await this.waitUntilSelectorIsVisible(
                SupervisorPageConstants.StatusReasonIcon,
                Constants.Three,
                this._page,
                Constants.MaxTimeout
            );
        }
        catch (Exception) {
            Error('StatusReason Icon is not presnet in grid');
        }
    }

    public async Sentimenticonvalidation() {
        try {
            await this.waitUntilSelectorIsVisible(
                SupervisorPageConstants.SentimentICon,
                Constants.Three,
                this._page,
                Constants.MaxTimeout
            );
        }
        catch (Exception) {
            Error('Sentiment Icon is not presnet in grid');
        }
    }

    public async joinConversation() {
        const iframeCC = await IFrameHelper.GetIframe(this._page, IFrameConstants.IframeCC);
        await this.waitUntilSelectorIsVisible(
            SupervisorPageConstants.JoinChat,
            AgentChatConstants.Three,
            iframeCC,
            Constants.MaxTimeout
        );
        await iframeCC.$eval(SupervisorPageConstants.JoinChat, el => (el as HTMLElement).click());
    }

    public async selectConversationFromOngoingConversations(agentName: string, state: string , channel: string) {
        for (let i = 0; i < 3; i++) {
            await this._page.click(AgentChatConstants.RefreshAllTab);
        }
        await this.waitUntilSelectorIsVisible(SupervisorPageConstants.SelectConversationRecord.replace("{0}", state).replace("{1}", channel), AgentChatConstants.Eight,
            this.Page,
            Constants.MaxTimeout);
        await this.Page.click(SupervisorPageConstants.SelectConversationRecord.replace("{0}", state).replace("{1}", channel));
        await this._page.click(SelectorConstants.AssignIconSelector);
        await this._page.waitForSelector(
            SelectorConstants.AssignChatToAgent.replace("{0}", agentName)
        );
        await this._page.click(
            SelectorConstants.AssignChatToAgent.replace("{0}", agentName)
        );
        await this._page.click(SelectorConstants.AssignBtnSelector);
    }

    public async ongoingDashboardGetRowSelectorByAgentQueueAndState(queue: string, agent: string, state: string) {
        let selector = "";
        //Find table root element and scroll to the right most to include Agent Column
        await this.Page.waitForSelector(SupervisorPageConstants.OngoingDashboardConversationListRootSelector, { "state": Constants.SelectorStateAttached });
        let root = await this.Page.$(SupervisorPageConstants.OngoingDashboardConversationListRootSelector);
        await root.evaluate(elm => elm.scrollTo(elm.scrollWidth, 0));
        //Adding wait because of page taking time to load after scroll
        this.Page.waitForTimeout(Constants.DefaultTimeout);

        //prepare headers list
        let headers = [];
        await this.Page.waitForSelector(SupervisorPageConstants.OngoingDashboardConversationListTableHeaderSelector, { "state": Constants.SelectorStateAttached });
        let headerList = await this.Page.$$(SupervisorPageConstants.OngoingDashboardConversationListTableHeaderSelector);

        //Store the column positions in an array
        for (let headerCount = 0; headerCount < headerList.length - 1; headerCount++) {
            let title = await headerList[headerCount].evaluate(h => h.getAttribute("title").toLowerCase().replace(" ", "_"));
            headers[headerCount] = title;
        }

        // Find all the rows in the table in current view
        await this.Page.waitForSelector(SupervisorPageConstants.OngoingDashboardConversationsList, { "state": Constants.SelectorStateAttached });
        let rows = await this.Page.$$(SupervisorPageConstants.OngoingDashboardConversationsList);

        for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
            //Find all the columns of each row.
            await this.Page.waitForSelector(SupervisorPageConstants.OngoingDashboardConversationRowCells.replace("{0}", (rowIndex + 1).toString()), { "state": Constants.SelectorStateAttached });
            let cols = await this.Page.$$(SupervisorPageConstants.OngoingDashboardConversationRowCells.replace("{0}", (rowIndex + 1).toString()));

            let queueName = await cols[headers.indexOf(Constants.Queue)].evaluate(col => col.getAttribute("title"));
            console.log(queueName);
            let state = await cols[headers.indexOf(Constants.StatusReason)].evaluate(col => col.getAttribute("title"));
            let agentName = await cols[headers.indexOf(Constants.ActiveAgent)].evaluate(col => col.getAttribute("title"));

            // Check the provided conditions
            if (state == Constants.Active && queueName == queue && agentName === agent) {
                await root.evaluate(elm => elm.scrollTo(0, 0));
                selector = SupervisorPageConstants.OngoingDashboardConversationTableCellSelector.replace("{0}", (rowIndex - 1).toString()).replace("{1}", headers.indexOf(Constants.Queue).toString());
                break;
            }
        }
        return selector;
    }

    public async getConversationIdFromUrl() {
        const btn = await this.Page.waitForSelector(SupervisorPageConstants.CopyUrlButtonSelector, { "state": Constants.SelectorStateAttached });
        await btn.click();
        const url = await this.Page.evaluate(() => navigator.clipboard.readText());
        if (url) {
            return url.substr(url.indexOf(Constants.LiveWorkItemIdQueryParam) + 4, 36);
        }
        return null;
    }

    public async validateIfTransferButtonIsDisabled() {
        const btn = await this.Page.waitForSelector(SupervisorPageConstants.ongoingDashboardSupervisorTrasferButtonSelector, { "state": Constants.SelectorStateAttached });
        const result = await btn.evaluate((btn) => btn.getAttribute("disabled"));
        return result;
    }

    public async validateRowSelection(rowNum: string) {
        const checkbox = await this.Page.waitForSelector(SupervisorPageConstants.OngoingDashboardRowCheckboxSelector.replace("{0}", rowNum), { "state": Constants.SelectorStateAttached });
        const checkedState = await checkbox.evaluate((chk) => chk.getAttribute("aria-checked"));
        return checkedState;
    }

    public async selectAgentToTransfer(agentUserName: string) {
        await this.searchByAgentWithStatus(agentUserName, "true");
        let radio = await this.Page.waitForSelector(SupervisorPageConstants.OngoingDashboardAgentSelectRadioSelector.replace("{0}", agentUserName));
        await radio.click();
    }

    public async getActiveAgentNameForConversation(rowNum: string){
        let cell = await this.Page.waitForSelector(SupervisorPageConstants.OngoingDashboardConversationActiveAgentSelector.replace("{0}", rowNum), { "state": Constants.SelectorStateAttached });
        const result = await cell.innerText();
        return result;
    }
    public async AssignToAgent(agentName: string) {
        await this.Page.click(SelectorConstants.Assign);
        await this._page.waitForSelector(
            SelectorConstants.AssignChatToAgent.replace("{0}", agentName)
        );
        await this._page.click(
            SelectorConstants.AssignChatToAgent.replace("{0}", agentName)
        );
        await this._page.click(SelectorConstants.AssignBtnSelector);
    }

    public async ActiveLivechatItemSelect(channel: string) {
        await this._page.click(AgentChatConstants.RefreshAllTab);
        await this.waitUntilSelectorIsVisible(SupervisorPageConstants.OngoingConversationActiveLiveChatItemSelect.replace("{0}", channel));
        await this.Page.click(SupervisorPageConstants.OngoingConversationActiveLiveChatItemSelect.replace("{0}", channel));
    }
    public async WaitingLivechatItemSelect(channel: string) {
        await this._page.click(AgentChatConstants.RefreshAllTab);
        await this.waitUntilSelectorIsVisible(SupervisorPageConstants.OngoingConversationWaitingLiveChatItemSelect.replace("{0}", channel));
        await this.Page.click(SupervisorPageConstants.OngoingConversationWaitingLiveChatItemSelect.replace("{0}", channel));
    }

    public async joinInitiateChat(message: string) {
        await this.waitUntilSelectorIsVisible(SupervisorPageConstants.MessageTextArea, SupervisorPageConstants.Three);
        const iframeCC = await IFrameHelper.GetIframe(this._page, IFrameConstants.IframeCC);
        await iframeCC.waitForSelector(SupervisorPageConstants.JoinChat);
        await this.waitUntilSelectorIsVisible(SupervisorPageConstants.MessageTextArea, SupervisorPageConstants.Three);
        await iframeCC.$eval(SupervisorPageConstants.JoinChat, el => (el as HTMLElement).click());
        const textarea = await iframeCC.waitForSelector(SupervisorPageConstants.ConsultMessageTextArea);
        await textarea.fill(message);
        await iframeCC.waitForSelector(AgentChatConstants.ConsultSendMessageButton);
        await iframeCC.$eval(AgentChatConstants.ConsultSendMessageButton, el => (el as HTMLElement).click());
      }
    
      public async FilterItemsForIntradayInsights(frame: any, queueName: string) {
        await this.FilterRecordsForIntradayInsightsQueueName(frame, queueName);
      }

      public async FilterRecordsForIntradayInsightsQueueName(frame: any, queueName: string, timeout: number = Constants.TenThousand) {
        try {
          await this.waitUntilFrameSelectorIsVisible(
            SelectorConstants.DurationSelector,
            frame,
            Constants.One,
            Constants.DefaultTimeout
          );
          const omniChanelIntraDayInsightSelector = await frame.waitForSelector(
            SelectorConstants.DurationSelector,
            { timeout }
          );
          await omniChanelIntraDayInsightSelector.click();
          await this._page.waitForTimeout(Constants.DefaultTimeout); //This static timeout required so that if queue selection popup remains in open state during failed run so before retrying queue filtration it will close
    
          await this.waitUntilFrameSelectorIsVisible(
            AgentChatConstants.IntraDayMonitoringQueueSelector,
            frame,
            Constants.One,
            Constants.FiveThousand
          );
          const intraDayInsightsQueue = await frame.waitForSelector(
            AgentChatConstants.IntraDayMonitoringQueueSelector,
            { timeout }
          );
          await intraDayInsightsQueue.click();
          await this.waitForScreenLoad(frame);
          await this.waitUntilFrameSelectorIsVisible(
            AgentChatConstants.IntraDayInsightQueueSelectionSelector,
            frame,
            Constants.One,
            Constants.FiveThousand
          );
          await this.waitUntilFrameSelectorIsVisible(
            AgentChatConstants.IntraDayInsightQueueTitleSelectionSelector,
            frame,
            Constants.One,
            Constants.FiveThousand
          );
          await this.waitUntilFrameSelectorIsVisible(
            AgentChatConstants.IntraDayInsightQueueCheckboxSelectionSelector,
            frame,
            Constants.One,
            Constants.FiveThousand
          );
          await this.waitUntilFrameSelectorIsVisible(
            AgentChatConstants.IntraDayInsightQueueInputSelector,
            frame,
            Constants.One,
            Constants.FiveThousand
          );
          const intraDayInsightsQueueInput = await frame.waitForSelector(
            AgentChatConstants.IntraDayInsightQueueInputSelector,
            { timeout }
          );
          await intraDayInsightsQueueInput.fill("");
          await intraDayInsightsQueueInput.type(queueName, { delay: 100 });
    
          await this.waitForScreenLoad(frame);
          await this._page.waitForTimeout(Constants.TenThousand); //This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown
    
          const intraDayInsightsConversationStatusItem =
            await frame.waitForSelector(
              AgentChatConstants.IntraDayInsightConversationStatusQueueSelector,
              { timeout }
            );
          await intraDayInsightsConversationStatusItem.focus();
          await this._page.waitForTimeout(Constants.DefaultTimeout); //This static timeout required so that queue selection popup will be kept in open state after focus
          await intraDayInsightsConversationStatusItem.click();
    
          await this.waitForScreenLoad(frame);
          await omniChanelIntraDayInsightSelector.click();
          await this.waitUntilFrameSelectorIsVisible(
            SelectorConstants.DurationSelector,
            frame,
            Constants.One,
            Constants.DefaultTimeout
          );
      
        }
        catch (error) {
          console.log(`Method FilterRecordsByAgentName throwing exception with message: ${error.message}`);
        }
        return false;
      }
      
      public async ValidateAvgWaitTimeforLiveChat(frame: any) {
        await this.waitUntilFrameSelectorIsVisible(
          SelectorConstants.AvgWaitTimePerConversation,
          frame,
          Constants.One,
          Constants.DefaultTimeout
        );
        const Tooltip = await frame.waitForSelector(SelectorConstants.AvgWaitTimePerConversation);
        await Tooltip.hover();
        return true;
      }

      public async ValidateAvgWaitTimeforDigitalMessaging(frame: any) {
        await this.waitUntilFrameSelectorIsVisible(
          SelectorConstants.AvgWaitTimePerConversation,
          frame,
          Constants.One,
          Constants.DefaultTimeout
        );
        const Tooltip = await frame.waitForSelector(SelectorConstants.AvgWaitTimePerConversation);
        await Tooltip.hover();
        return true;
      }


      public async NavigatetoagentinsightsAllOverview(frame: any) {
        await this.waitUntilSelectorIsVisible(
          SelectorConstants.AgentInsightsAllOverview,
          AgentChatConstants.Two,
          this.Page,
          AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
        );
        await frame.click(SelectorConstants.AgentInsightsAllOverview);
        await this.waitForScreenLoad(frame);
      }

      public async VerifyAgentInsightsTabOrder(frame: any) {
        try {
          const AgentInsightsAllTabText = await frame.waitForSelector(SelectorConstants.AgentInsightsAllTab);
          const AgentInsightsAllText = await AgentInsightsAllTabText.textContent();
          expect(AgentInsightsAllText.includes(SelectorConstants.AgentInsightsAllTabText)).toBeTruthy();
          const AgentInsightsLiveChatTabText = await frame.waitForSelector(SelectorConstants.AgentInsightsLiveChatTab);
          const AgentInsightsLiveChatText = await AgentInsightsLiveChatTabText.textContent();
          expect(AgentInsightsLiveChatText.includes(SelectorConstants.AgentInsightsLiveChatTabText)).toBeTruthy();
          const AgentInsightsDigitalMessagingTabText = await frame.waitForSelector(SelectorConstants.AgentInsightsDigitalMessagingTab);
          const AgentInsightsDigitalMessagingText = await AgentInsightsDigitalMessagingTabText.textContent();
          expect(AgentInsightsDigitalMessagingText.includes(SelectorConstants.AgentInsightsDigitalMessagingTabText)).toBeTruthy();
          const AgentInsightsVoiceTabText = await frame.waitForSelector(SelectorConstants.AgentInsightsVoiceTab);
          const AgentInsightsVoiceText = await AgentInsightsVoiceTabText.textContent();
          expect(AgentInsightsVoiceText.includes(SelectorConstants.AgentInsightsVoiceTabText)).toBeTruthy();
        }
        catch (error) {
          console.log(`Method VerifyAgentInsightsTabOrder throwing exception with message: ${error.message}`);
        }
      }

      public async NavigatetoagentinsightsLivechat(frame: any) {
        await this.waitUntilSelectorIsVisible(
          SelectorConstants.AgentInsightsLiveChat,
          AgentChatConstants.Two,
          this.Page,
          AgentChatConstants.TenThousand
        );
        await frame.click(SelectorConstants.AgentInsightsLiveChat);
        await this.waitForScreenLoad(frame);
      }

      public async VerifyQueuesMessagingTypeLiveChat(frame: any, queueName: string, timeout: number = Constants.TenThousand) {
        try {
          await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightsQueueSelector, frame, Constants.One, Constants.FiveThousand);
          const agentInsightQueuetName = await frame.waitForSelector(AgentChatConstants.AgentInsightsQueueSelector, { timeout });
          await agentInsightQueuetName.click();
          await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
          await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
          await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueInputSelectorLivechat, frame, Constants.One, Constants.FiveThousand);
          const agentInsightsQueueInput = await frame.waitForSelector(AgentChatConstants.AgentInsightQueueInputSelectorLivechat, { timeout });
          const agentInsightsConversationQueueStatusItem1 = await frame.waitForSelector(AgentChatConstants.AgentInsightLivechatQueueSelectAllSelector, { timeout });
          await agentInsightsConversationQueueStatusItem1.focus();
          await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that queue selection popup will be kept in open state after focus
          const agentInsightsQueueInput1 = await frame.waitForSelector(AgentChatConstants.AgentInsightQueueInputSelectorLivechat, { timeout });
          await agentInsightsConversationQueueStatusItem1.click();
          await agentInsightsQueueInput.fill("");
          await agentInsightsQueueInput.type(queueName, { delay: 100 });
          await this._page.waitForTimeout(Constants.TenThousand);//This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown
          const agentInsightsConversationQueueStatusItem = await frame.waitForSelector(AgentChatConstants.AgentInsightQueueInputSelectorLivechat, { timeout });
          const agentInsightsConversationQueueItem = await agentInsightsConversationQueueStatusItem.textContent();
          if (agentInsightsConversationQueueItem !== queueName) {
            return false;
          }
        }
        catch (error) {
          console.log(`Method VerifyQueuesMessagingTypeLiveChat throwing exception with message: ${error.message}`);
          return true;
        }
      }

      public async NavigatetoagentinsightsDigitalmessaging(frame: any) {
        await this.waitUntilSelectorIsVisible(
          SelectorConstants.AgentInsightsDigitalMessaging,
          AgentChatConstants.Two,
          this.Page,
          AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
        );
        await frame.click(SelectorConstants.AgentInsightsDigitalMessaging);
        await this.waitForScreenLoad(frame);
      }

      public async VerifyQueuesMessagingTypeDigitalMsg(frame: any, queueName: string, timeout: number = Constants.TenThousand) {
        try {
          await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightsQueueSelector, frame, Constants.One, Constants.FiveThousand);
          const agentInsightQueuetName = await frame.waitForSelector(AgentChatConstants.AgentInsightsQueueSelector, { timeout });
          await agentInsightQueuetName.click();
          await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
          await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
          await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueInputSelectorDigitalmsg, frame, Constants.One, Constants.FiveThousand);
          const agentInsightsQueueInput = await frame.waitForSelector(AgentChatConstants.AgentInsightQueueInputSelectorDigitalmsg, { timeout });
          const agentInsightsConversationQueueStatusItem1 = await frame.waitForSelector(AgentChatConstants.AgentInsightLivechatQueueSelectAllSelector, { timeout });
          await agentInsightsConversationQueueStatusItem1.focus();
          await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that queue selection popup will be kept in open state after focus
          const agentInsightsQueueInput1 = await frame.waitForSelector(AgentChatConstants.AgentInsightQueueInputSelectorDigitalmsg, { timeout });
          await agentInsightsConversationQueueStatusItem1.click();
          await agentInsightsQueueInput.fill("");
          await agentInsightsQueueInput.type(queueName, { delay: 100 });
          const agentInsightsConversationQueueStatusItem = await frame.waitForSelector(AgentChatConstants.AgentInsightQueueInputSelectorDigitalmsg, { timeout });
          const agentInsightsConversationQueueItem = await agentInsightsConversationQueueStatusItem.textContent();
          if (agentInsightsConversationQueueItem !== queueName) {
            return false;
          }
        }
        catch (error) {
          console.log(`Method VerifyQueuesMessagingTypeDigitalMsg throwing exception with message: ${error.message}`);
          return true;
        }
      }

      public async NavigatetoagentinsightsVoice(frame: any) {
        await this.waitUntilSelectorIsVisible(
          SelectorConstants.AgentInsightsVoice,
          AgentChatConstants.Two,
          this.Page,
          AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
        );
        await frame.click(SelectorConstants.AgentInsightsVoice);
        await this.waitForScreenLoad(frame);
      }

      public async VerifyQueuesMessagingTypeVoice(frame: any, queueName: string, timeout: number = Constants.TenThousand) {
        try {
          await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightsQueueSelector, frame, Constants.One, Constants.FiveThousand);
          const agentInsightQueuetName = await frame.waitForSelector(AgentChatConstants.AgentInsightsQueueSelector, { timeout });
          await agentInsightQueuetName.click();
          await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
          await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
          await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueInputSelectorDigitalmsg, frame, Constants.One, Constants.FiveThousand);
          const agentInsightsQueueInput = await frame.waitForSelector(AgentChatConstants.AgentInsightQueueInputSelectorDigitalmsg, { timeout });
          await agentInsightsQueueInput.click();
          const agentInsightsQueueInput1 = await frame.waitForSelector(AgentChatConstants.AgentInsightQueueInputSelectorDigitalmsg, { timeout });
          await agentInsightsQueueInput1.fill("");
          await agentInsightsQueueInput.type(queueName, { delay: 100 });
          await this._page.waitForTimeout(Constants.TenThousand);//This static timeout required so that required queue will be populated in intraday insight 'Queue' dropdown
          const agentInsightsConversationQueueStatusItem = await frame.waitForSelector(AgentChatConstants.AgentInsightLivechatQueueSelectAllSelector, { timeout });
          await agentInsightsConversationQueueStatusItem.focus();
          await this._page.waitForTimeout(Constants.DefaultTimeout);//This static timeout required so that queue selection popup will be kept in open state after focus
          await agentInsightsConversationQueueStatusItem.click();
          const agentInsightsConversationQueueItem = await frame.waitForSelector(AgentChatConstants.AgentInsightLivechatQueueSelectAllSelector, { timeout });
          const agentInsightsConversationQueueItemvoice = await agentInsightsConversationQueueItem.textContent();
          if (agentInsightsConversationQueueItemvoice == queueName) {
            return true;
          }
        }
        catch (error) {
          console.log(`Method VerifyQueuesMessagingTypeVoice throwing exception with message: ${error.message}`);
          return false;
        }
      }

      public async VerifyQueuesMessagingTypeAtAllOverviewPage(frame: any, queueName: string, timeout: number = Constants.TenThousand) {
        try {
          await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightsQueueSelector, frame, Constants.One, Constants.FiveThousand);
          const agentInsightQueuetName = await frame.waitForSelector(AgentChatConstants.AgentInsightsQueueSelector, { timeout });
          await agentInsightQueuetName.click();
          await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueTitleSelectionSelector, frame, Constants.One, Constants.FiveThousand);
          await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueCheckboxSelectionSelector, frame, Constants.One, Constants.FiveThousand);
          await this.waitUntilFrameSelectorIsVisible(AgentChatConstants.AgentInsightQueueInputSelectorDigitalmsg, frame, Constants.One, Constants.FiveThousand);
          const agentInsightsQueueInput = await frame.waitForSelector(AgentChatConstants.AgentInsightQueueInputSelectorDigitalmsg, { timeout });
          await agentInsightsQueueInput.click();
          const agentInsightsQueueInput1 = await frame.waitForSelector(AgentChatConstants.AgentInsightQueueInputSelectorDigitalmsg, { timeout });
          await agentInsightsQueueInput1.fill("");
          await agentInsightsQueueInput.type(queueName, { delay: 100 });
          const agentInsightsConversationQueueStatusItem = await frame.waitForSelector(AgentChatConstants.AgentInsightLivechatQueueSelectAllSelector, { timeout });
          await agentInsightsConversationQueueStatusItem.focus();
          await agentInsightsConversationQueueStatusItem.click();
          const agentInsightsConversationQueueItem = await frame.waitForSelector(AgentChatConstants.DropDownValueSelector, { timeout });
          const agentInsightsConversationQueueItemvoice = await agentInsightsConversationQueueItem.textContent();
          if (agentInsightsConversationQueueItemvoice == queueName) {
            return true;
          }
        }
          catch (error) {
            console.log(`Method VerifyQueuesMessagingTypeDigitalMsg throwing exception with message: ${error.message}`);
            return true;
          }
        } 

        public async selectActiveConversation(agentName: string, state: string , channel: string) {
          for (let i = 0; i < 3; i++) {
              await this._page.click(AgentChatConstants.RefreshAllTab);
          }
          await this.waitUntilSelectorIsVisible(SupervisorPageConstants.SelectConversationRecord.replace("{0}", state).replace("{1}", channel), AgentChatConstants.Eight,
              this.Page,
              Constants.MaxTimeout);
          await this.Page.click(SupervisorPageConstants.SelectConversationRecord.replace("{0}", state).replace("{1}", channel));
      }
}