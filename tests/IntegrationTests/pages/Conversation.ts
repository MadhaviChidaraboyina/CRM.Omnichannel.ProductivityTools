import { IFrameConstants, IFrameHelper } from "../Utility/IFrameHelper";

import { AdminPage } from "./AdminPage";
import { Page } from "playwright";
import { TestSettings } from "../configuration/test-settings";

export enum ConversationConstants {
  DownloadEvent = "download",
  ConversationEntityFormRelatedPath = "{0}/main.aspx?pagetype=entityrecord&etn=msdyn_ocliveworkitem&id={1}",
  TranscriptDownloadButton = "//*[@id='transcript-outer-container']/div/div[1]/div[2]/a",
  TranscriptControlDownloadButton = "//*/button[@data-test-id='download-transcript-button']",
  TranscriptCustomerMessageSelector = "(//*[@id='transcript-outer-container']//div[@class='message customer external']/div[@class='content'])[{0}]",
  TranscriptAgentMessageSelector = "(//*[@id='transcript-outer-container']//div[@class='message agent external']/div[@class='content'])[{0}]",
  TranscriptConversationControlSelector = "//div[@class='customControl MscrmControls OmniChannel.OCConversationWrapperControl MscrmControls.OmniChannel.OCConversationWrapperControl']",
  NewTranscriptAgentMessageSelector = "(//*[@id='conversation-container']//div[@id='webchat']//div[contains(@class, '--from-user')]//div[contains(@class, 'markdown')])[{0}]",
  NewTranscriptCustomerMessageSelector = "(//*[@id='conversation-container']//div[@id='webchat']//div[contains(@class, '--hide-nub')]//div[contains(@class, 'markdown')])[{0}]",
  
  InfoButtonSelector = "//button[@data-title='{0}']",
  ListPageSelector = "//div[@class='ms-List-page']",
  InfoRowFieldSelector = "//div[@class='ms-List-page']//div[@data-automationid='DetailsRowFields']/div[@data-automation-key='label']//span[text()='{0}']/ancestor::node()[6]",
  InfoRowFieldValueSelector = "//div[@class='ms-List-page']//div[@data-list-index='{0}']//div[@data-automation-key='value']",
  InfoSessionRowFieldValueSelector = "//div[@class='ms-List-page']//div[@data-list-index='{0}']//div[@data-automation-key='sessionInfo']/div/div[2]",
  OverviewTitle = "Overview",
  SessionsTitle = "Sessions",
  MetricsTitle = "Metrics",
  
  // A conversation and transcript messages must be created in advance
  TestConvesationId = "3ce59957-581a-4aa1-bd2e-a16cfd28fdda",
  TestVoiceConvesationId = "8baa95e0-ce25-4262-a669-e32e5d5c5556",
  TestConvesationTranscriptMessage1 = "Hello.",
  TestConvesationTranscriptMessage2 = "How may I help you?",
  TestConvesationTranscriptMessage3 = "Can you please tell me area code for Chicago?",
  TestConvesationTranscriptMessage4 = "The area code for Chicago is 312.",

  TestVoiceConvesationTranscriptMessage1 = "Recording and transcription started. 6/15 1:55 AM",
  TestVoiceConvesationTranscriptMessage2 = "Hello testing.",
  TestVoiceConvesationTranscriptMessage3 = "I'm an agent. How can I help you today?",
  TestVoiceConvesationTranscriptMessage4 = "I'm so angry.",
  TestVoiceConvesationTranscriptMessage5 = "Like, really angry?",
  TestVoiceConvesationTranscriptMessage6 = "Boo.",

  Ten = 10,
  FiveThousandsMiliSecondsWaitTimeout = 5000,
  ValidateEndConversationMessageAgent = "//*[contains(text(),'Customer has ended the conversation')]",
  RecordingPlayback = "//h2[normalize-space()='Recording playback']",
}

export class ConversationPage extends AdminPage {
  constructor(page: Page) {
    super(page);
  }

  public async navigateToConversationForm(conversationId: string) {
    await this.Page.goto(
      ConversationConstants.ConversationEntityFormRelatedPath.replace("{0}", TestSettings.OrgUrl).replace("{1}", conversationId)
    );
    await this.waitForDomContentLoaded();
  }

  public async isTranscriptControl() {
      await this.waitForDomContentLoaded();
      return await this.waitUntilSelectorIsVisible(ConversationConstants.TranscriptConversationControlSelector);
  }

  public async waitForTranscriptLoadedToConversationControl() {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );
    const endConversationMessage = await this.waitUntilSelectorIsVisible(
      ConversationConstants.ValidateEndConversationMessageAgent,
      ConversationConstants.Ten,
      iframeCC,
      ConversationConstants.FiveThousandsMiliSecondsWaitTimeout
    );
    return !endConversationMessage;
   }

    public async openConversationInfoSection(sectionName: string) {
        const selector = ConversationConstants.InfoButtonSelector.replace("{0}", sectionName);
        await this.waitUntilSelectorIsVisible(selector);
        await this.Page.click(selector);
        await this.waitUntilSelectorIsVisible(ConversationConstants.ListPageSelector);
    }

  public async downloadTransriptFile(isOldForm: boolean) {
    const downloadButtonSelector = isOldForm 
      ? ConversationConstants.TranscriptDownloadButton 
      : ConversationConstants.TranscriptControlDownloadButton; 
    const downloadButton = await this.Page.waitForSelector(downloadButtonSelector);
    expect(downloadButton !== null).toBeTruthy();

    const [download] = await Promise.all([
          this.Page.waitForEvent(ConversationConstants.DownloadEvent),
          this.Page.$eval(downloadButtonSelector, el => (el as HTMLElement).click())
      ]);
    const path = await download.path();
    expect(path != null && path !== undefined && path !== "").toBeTruthy();

    const stream = await download.createReadStream();
    if (stream !== null)
    {
      return await this.readStream(stream);
    }

    return "";
  }

  public async verifyInfoRowValue(label: string, expectedValue: string, toBeTruthy: boolean = true) {
    await this.waitForDomContentLoaded();
    await this.Page.hover(ConversationConstants.InfoRowFieldSelector.replace("{0}", label));
    const row = await this.Page.waitForSelector(ConversationConstants.InfoRowFieldSelector.replace("{0}", label));
    expect(row !== null).toBeTruthy();
    await this.waitForDomContentLoaded();
    const rowIndex = await row.getAttribute("data-list-index"); 
    await this.Page.hover(ConversationConstants.InfoRowFieldValueSelector.replace("{0}", rowIndex));
    const value = await (
      await this.Page.waitForSelector(ConversationConstants.InfoRowFieldValueSelector.replace("{0}", rowIndex))
    ).textContent();
    if(toBeTruthy)
    {
      expect(value.includes(expectedValue)).toBeTruthy();
    }
    else
    {
      expect(value.includes(expectedValue)).toBeFalsy();
    }
    
  }

  public async verifyInfoSessionValue(index: number, expectedValue: string) {
    const sessionRow = await this.Page.waitForSelector(ConversationConstants.InfoSessionRowFieldValueSelector.replace("{0}", index.toString()));
    expect(sessionRow !== null).toBeTruthy();
    const value = await sessionRow.textContent();
    expect(value.includes(expectedValue)).toBeTruthy();
  }

  public async verifyTranscriptCustomerMessageText(messageNumber: number, expectedText: string) {
    const message = await this.Page.waitForSelector(
      ConversationConstants.TranscriptCustomerMessageSelector.replace("{0}", messageNumber.toString())
    );
    expect(await message.textContent()).toBe(expectedText);
  }

  public async verifyTranscriptAgentMessageText(messageNumber: number, expectedText: string) {
    const message = await this.Page.waitForSelector(
      ConversationConstants.TranscriptAgentMessageSelector.replace("{0}", messageNumber.toString())
    );
    expect(await message.textContent()).toBe(expectedText);
  }

  public async verifyNewTranscriptCustomerMessageText(messageNumber: number, expectedText: string) {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );

    const message = await iframeCC.waitForSelector(
      ConversationConstants.NewTranscriptCustomerMessageSelector.replace("{0}", messageNumber.toString())
    );
    expect(await message.textContent()).toBe(expectedText);
  }

  public async verifyNewTranscriptAgentMessageText(messageNumber: number, expectedText: string) {
    const iframeCC = await IFrameHelper.GetIframe(
      this._page,
      IFrameConstants.IframeCC
    );

    const message = await iframeCC.waitForSelector(
      ConversationConstants.NewTranscriptAgentMessageSelector.replace("{0}", messageNumber.toString())
    );
    expect(await message.textContent()).toBe(expectedText);
  }

  private async readStream(readable) {
    readable.setEncoding("utf8");
    let data = "";
    for await (const chunk of readable) {
      data += chunk;
    }
    return data;
  }
}
