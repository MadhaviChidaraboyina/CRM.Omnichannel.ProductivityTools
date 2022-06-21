import { AgentChatConstants, Constants, SelectorConstants } from "../Utility/Constants";

import { Page } from "playwright";
import { RoutingRulePage } from "./RoutingRule";
import { TestSettings } from "../configuration/test-settings";

export enum CustomConstants {
    QuickRepliesMenuItem = "//li[contains(@id,'sitemap')]//span[contains(text(),'Quick replies')]",
    Title = "input[data-id='msdyn_title.fieldControl-text-box-text']",
    Message = "textarea[data-id='msdyn_message.fieldControl-text-box-text']",
    AddQuickReply = "button[data-id='msdyn_cannedmessage|NoRelationship|SubGridStandard|Mscrm.SubGrid.msdyn_cannedmessage.AddExistingAssoc']",
    QuickReplyName = "input[data-id='MscrmControls.FieldControls.SimpleLookupControl-LookupResultsPopup_falseBoundLookup_textInputBox_with_filter_new']",
    QuickReplySearchButton = "button[data-id='MscrmControls.FieldControls.SimpleLookupControl-LookupResultsPopup_falseBoundLookup_search']",
    QuickReplyLookupValue = "div[data-id='MscrmControls.FieldControls.SimpleLookupControl-LookupResultsPopup_falseBoundLookup_tabContainer'] li[aria-label*='{0}']",
    DeleteWorkStreamRecord = "button[data-id='msdyn_liveworkstream|NoRelationship|Form|Mscrm.Form.msdyn_liveworkstream.Delete']",
    AddButton = "button[data-id='lookupDialogSaveBtn']",
    OverflowButton = "button[data-lp-id='SubGridStandard:msdyn_liveworkstream-OverflowButton']",
    AddWorkstream = "button[data-id='msdyn_liveworkstream|NoRelationship|SubGridStandard|Mscrm.SubGrid.msdyn_liveworkstream.AddExistingAssoc']",

    WorkStreamName = "input[data-id='MscrmControls.FieldControls.SimpleLookupControl-LookupResultsPopup_falseBoundLookup_textInputBox_with_filter_new']",
    WorkStreamSearchButton = "button[data-id='MscrmControls.FieldControls.SimpleLookupControl-LookupResultsPopup_falseBoundLookup_search']",
    WorkStreamLookupValue = "div[data-id='MscrmControls.FieldControls.SimpleLookupControl-LookupResultsPopup_falseBoundLookup_tabContainer'] li[aria-label*='{0}']",
    ClickWorkstream = "div[data-id='workstreams_container'] a[title='{0}']",
    GridItemClick = "div[data-lp-id='MscrmControls.Grid.ReadOnlyGrid|quickreplies|msdyn_liveworkstream|828d8fea-4462-4a3a-b308-57d0553f5b2d|msdyn_cannedmessage|msdyn_msdyn_cannedmessage_liveworkstream|cc-grid|cc-grid-cell|cell-0-2']",
    QuickRepliesGridItem = "div#DataSetHostContainer_dataSetRoot_quickreplies div a[title='{0}']",
    SearchTagsName = "input[data-id='msdyn_tagscontrolfield.fieldControl-tagInputField']",
    SelectTag = "div[data-id='msdyn_tagscontrolfield.fieldControl-finalcontainer'] li[contains(text(),'{0}')]",
    ClickTag = "//span[data-id='msdyn_tagscontrolfield.fieldControl-addTagIcon']",
    ScrollContainerclick = "//span[contains(text(),'{0}')]",
    HeaderColumn = "button[title='Select All']",
    EditTagsButton = "button[data-id='msdyn_cannedmessage|NoRelationship|HomePageGrid|Mscrm.msdyn_cannedmessage.Button3.Button']",
    EditTaginput = "input[data-id='msdyn_edittagsid-tagInputField']",
    EditTagSelect = "span[data-id='msdyn_edittagsid-addTagIcon']",
    CloseEdit = "button[data-id='close_id']",
    TagContainer = "div[data-id='msdyn_tagscontrolfield.fieldControl-tagscontainer'] div span",
    GridItem = "div[aria-label='Readonly Grid'] div a[title='{0}']",
}

export enum QuickRepliesCustomConstants {
    QuickRepliesTitle = "Current FD Rates",
    Title = "input[data-id='msdyn_title.fieldControl-text-box-text']",
    Message = "textarea[data-id='msdyn_message.fieldControl-text-box-text']",
    SearchTagsName = "input[data-id='msdyn_tagscontrolfield.fieldControl-tagInputField']",
    ScrollContainerclick = "//span[contains(text(),'{0}')]",
    SaveBtn = "//*[@aria-label='Add']",
    TagDivSelector = "//*[@aria-label='Remove {0}']",
    RecordFoundSelector = "//div[@title='{0}']",
    StartSearch = "//*[@aria-label='Start search']",
    LookUpResultSelector = "//*[@aria-label='{0}']",
}

export class QuickReplies extends RoutingRulePage {
    constructor(page: Page) {
        super(page);
    }


    public newQuickReplyData = {
        Title: "q1",
        Message: "Welcome to Omni Channel",
        TagName: "#q1"
    };

    public async navigateToQuickRepliesTabView() {
        await this.Page.click(CustomConstants.QuickRepliesMenuItem);
        await this.Page.waitForTimeout(Constants.DefaultTimeout);
    }

    public async fillQuickReplies() {
        await this.fillInputData(CustomConstants.Title, this.newQuickReplyData.Title);
        await this.Page.fill(CustomConstants.Message, this.newQuickReplyData.Message);
        await this.Page.click(SelectorConstants.FormSaveButton);
        await this.Page.click(SelectorConstants.FormSaveAndCloseButton);
        await this.waitForSaveComplete();
    }

    public async addQuickReplies() {
        await this.Page.waitForSelector(CustomConstants.AddQuickReply);
        await this.Page.click(CustomConstants.AddQuickReply);
        await this.fillLookupField(CustomConstants.QuickReplyName,
            CustomConstants.QuickReplySearchButton,
            CustomConstants.QuickReplyLookupValue, this.newQuickReplyData.Title);

        await this.Page.click(CustomConstants.AddButton);
        await this.waitForSaveComplete();
    }

    public async openNewRecord() {
        await this.waitForDomContentLoaded();
        await this.Page.click(SelectorConstants.NewRecordButton);
    }

    public async deleteQuickReplyWorkstream() {
        await this.Page.click(CustomConstants.DeleteWorkStreamRecord);
    }

    public async closeWorkstream() {
        await this.Page.click(SelectorConstants.FormSaveAndCloseButton);
        await this.waitForDomContentLoaded();
    }

    public async fillQuickRepliesData(workStreamName: string) {
        await this.fillInputData(CustomConstants.Title, this.newQuickReplyData.Title);
        await this.Page.fill(CustomConstants.Message, this.newQuickReplyData.Message);
        await this.Page.click(SelectorConstants.FormSaveButton);
        await this.waitForSaveComplete();
        await this.Page.click(CustomConstants.OverflowButton);
        await this.Page.click(CustomConstants.AddWorkstream);

        await this.fillLookupField(CustomConstants.WorkStreamName,
            CustomConstants.WorkStreamSearchButton,
            CustomConstants.WorkStreamLookupValue, workStreamName);
        await this.Page.click(CustomConstants.AddButton);
        await this.waitForDomContentLoaded();

        const gridItemSelector = CustomConstants.ClickWorkstream.replace(
            "{0}",
            workStreamName
        );
        await this.Page.click(gridItemSelector);
    }

    public async fillWorkstreamData(workStreamName: string) {  
        await this.Page.click(CustomConstants.OverflowButton);
        await this.Page.click(CustomConstants.AddWorkstream);
        await this.fillLookupField(CustomConstants.WorkStreamName,
            CustomConstants.WorkStreamSearchButton,
            CustomConstants.WorkStreamLookupValue, workStreamName);
        await this.Page.click(CustomConstants.AddButton);
        await this.waitForDomContentLoaded();
        await this.waitForSaveComplete();
    }

    public async validateTitle() {
        await this.waitForDomContentLoaded();
        const gridItemSelector = CustomConstants.QuickRepliesGridItem.replace(
            "{0}",
            this.newQuickReplyData.Title
        );
        const gridItem = await this.Page.waitForSelector(gridItemSelector);
        const gridItemValue = await gridItem.textContent();
        return gridItemValue == this.newQuickReplyData.Title;
    }

    public async fillQuickData() {
        await this.fillInputData(CustomConstants.Title, this.newQuickReplyData.Title);
        await this.Page.fill(CustomConstants.Message, this.newQuickReplyData.Message);
        await this.Page.click(SelectorConstants.FormSaveButton);
        await this.waitForSaveComplete();
    }

    public async addTags() {
        await this.fillInputData(CustomConstants.SearchTagsName, this.newQuickReplyData.TagName);
        const selectTag = CustomConstants.ScrollContainerclick.replace(
            "{0}",
            this.newQuickReplyData.TagName
        );
        await this.Page.click(selectTag);
    }

    public async searchRecordandAddTag() {
        await this.Page.fill(SelectorConstants.QuickFindTextBox, this.newQuickReplyData.Title);
        await this.Page.click(SelectorConstants.QuickFindButton);
        await this.waitForDomContentLoaded();
        await this.Page.click(CustomConstants.HeaderColumn);
        await this.Page.click(CustomConstants.EditTagsButton);
        await this.Page.fill(CustomConstants.EditTaginput, this.newQuickReplyData.TagName);
        await this.Page.click(CustomConstants.EditTagSelect);
        await this.Page.click(CustomConstants.CloseEdit);
        await this.Page.reload();
    }

    public async validateTag() {
        await this.Page.fill(SelectorConstants.QuickFindTextBox, this.newQuickReplyData.Title);
        await this.Page.click(SelectorConstants.QuickFindButton);
        await this.waitForDomContentLoaded();

        const gridItemSelector = CustomConstants.GridItem.replace(
            "{0}",
            this.newQuickReplyData.Title
        );
        await this.Page.click(gridItemSelector);

        const tagValue = await this.Page.waitForSelector(
            CustomConstants.TagContainer
        );
        const tagName = await tagValue.innerText();
        return tagName == this.newQuickReplyData.TagName;
    }

    public async fillQuickRepliesWithTag(title: string, message: string, tagname: string) {
        await this.fillInputData(QuickRepliesCustomConstants.Title, title);
        await this.Page.fill(QuickRepliesCustomConstants.Message, message);
        await this.Page.click(SelectorConstants.FormSaveButton);
        await this.waitForSaveComplete();
        await this.fillInputData(QuickRepliesCustomConstants.SearchTagsName, AgentChatConstants.QuickReplyFDTagName);
        await this.Page.click(QuickRepliesCustomConstants.SaveBtn);
        await this.waitUntilSelectorIsVisible(QuickRepliesCustomConstants.TagDivSelector.replace("{0}", tagname));
        await this.Page.click(SelectorConstants.FormSaveAndCloseButton);
        await this.waitForSaveComplete();
        await this.waitForDomContentLoaded();
    }

    public async addQuickRepliesWithTag() {
        await this.waitUntilSelectorIsVisible(CustomConstants.AddQuickReply, Constants.Three, this._page, Constants.MaxTimeout);
        await this.Page.click(CustomConstants.AddQuickReply);
        await this.waitUntilSelectorIsVisible(CustomConstants.QuickReplyName, Constants.Three, this._page, Constants.MaxTimeout);
        await this.fillLookupField(CustomConstants.QuickReplyName,
            CustomConstants.QuickReplySearchButton,
            CustomConstants.QuickReplyLookupValue, QuickRepliesCustomConstants.QuickRepliesTitle);
        await this.waitUntilSelectorIsVisible(QuickRepliesCustomConstants.LookUpResultSelector.replace("{0}", QuickRepliesCustomConstants.QuickRepliesTitle), Constants.Three, this._page, Constants.MaxTimeout);
        await this.Page.click(CustomConstants.AddButton);
        await this.waitForSaveComplete();
        await this.waitForDomContentLoaded();
        await this.waitUntilSelectorIsVisible(SelectorConstants.FormSaveButton, Constants.Three, this._page, Constants.MaxTimeout);
        await this.Page.click(SelectorConstants.FormSaveButton); 
        await this.waitForSaveComplete();
        await this.waitForDomContentLoaded();
    }

    public async createQuickRepliesIfNotExists() {
        await this.waitUntilSelectorIsVisible(CustomConstants.QuickRepliesMenuItem, Constants.Three, this._page, Constants.MaxTimeout);
        await this.Page.click(CustomConstants.QuickRepliesMenuItem);

        await this.waitUntilSelectorIsVisible(SelectorConstants.QuickSearchInput, Constants.Three, this._page, Constants.MaxTimeout);
        await this.fillInputData(SelectorConstants.QuickSearchInput, QuickRepliesCustomConstants.QuickRepliesTitle);
        await this.Page.click(QuickRepliesCustomConstants.StartSearch);
        const quickReplyExists = await this.waitUntilSelectorIsVisible(QuickRepliesCustomConstants.RecordFoundSelector.replace("{0}", QuickRepliesCustomConstants.QuickRepliesTitle), Constants.Three, this._page, Constants.MaxTimeout);
        if (!quickReplyExists) {
            await this.openNewLine();
            await this.fillQuickRepliesWithTag(QuickRepliesCustomConstants.QuickRepliesTitle, TestSettings.OrgUrl, AgentChatConstants.QuickReplyFDTagName);
            await this.waitForDomContentLoaded();
        }
    }
}

