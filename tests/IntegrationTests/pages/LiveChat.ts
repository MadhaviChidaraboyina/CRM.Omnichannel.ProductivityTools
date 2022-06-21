import {
  AgentChatConstants,
  Constants,
  SelectorConstants,
} from "../Utility/Constants";
import {
  CustomConstants,
  QuickRepliesCustomConstants,
} from "../pages/QuickReplies";
import { IFrameConstants, IFrameHelper } from "../Utility/IFrameHelper";

import { BrowserContext, Page } from "playwright";
import { HTMLConstants } from "../constants/html-constants";
import { TestHelper } from "../helpers/test-helper";
import { TimeoutConstants } from "../constants/timeout-constants";
import { Util } from "../Utility/Util";
import { WorkStreamsPage } from "../pages/WorkStreams";

// tslint:disable-next-line: no-any
declare const Microsoft: any;

export const MarkDownConstants = {
  Message1:
    "*strong*\n_italic_\n_*italic&strong*_\n*_strong&italic_*\n~strikethrough~\n~*strikethrough&strong*~\n~_*strikethrough&strong&italic*_~\nhttps://abc.com\n[abc](https://abc.com)",
  ValidationMessage1:
    '<strong>strong</strong><br>\n<em>italic</em><br>\n<em><strong>italic&amp;strong</strong></em><br>\n<strong><em>strong&amp;italic</em></strong><br>\n<s>strikethrough</s><br>\n<s><strong>strikethrough&amp;strong</strong></s><br>\n<s><em><strong>strikethrough&amp;strong&amp;italic</strong></em></s><br>\n<a href="https://abc.com" target="_blank" rel="noopener noreferrer">https://abc.com</a><br>\n<a href="https://abc.com" target="_blank" rel="noopener noreferrer">abc</a>',
  Message2: "* item1\n* item2\n* item3",
  ValidationMessage2: "\n<li>item1</li>\n<li>item2</li>\n<li>item3</li>\n",
  Message3: "> this is block line1\n> this is block line2",
  ValidationMessage3: "\n<p>this is block line1<br>\nthis is block line2</p>\n",
  Message4:
    "``` js\nvar foo = function (bar) {\n return bar++;};\n\nconsole.log(foo(5));\n```",
  ValidationMessage4:
    '<code class="language-js">var foo = function (bar) {\n return bar++;};\n\nconsole.log(foo(5));\n</code>',
  Message5: "```\n+ - > < / & *= % ^ | ?\n```",
  ValidationMessage5: "<code>+ - &gt; &lt; / &amp; *= % ^ | ?\n</code>",
  markdown1: "markdown 1",
  markdown1Response: '//*[@class="webchat__bubble__content"]/*[contains(@class, "markdown")]/p/em/em[text()="bold"]/parent::em/following-sibling::br/following-sibling::strong[text()="italics"]/following-sibling::br/following-sibling::s/s[text()="strikethrough"]/parent::s/parent::p/following-sibling::h1[text()="header1"]',
  markdownCombined: "markdown combined",
  markdownCombinedResponse: '//*[@class="webchat__bubble__content"]/*[contains(@class, "markdown")]/p/em/em[text()="strong"]/parent::em/following-sibling::br/following-sibling::em[text()="italics"]/following-sibling::br/following-sibling::strong/em/em[text()="strong and italics"]/parent::em/parent::strong/following-sibling::br/following-sibling::code[text()="mono space test"]/following-sibling::br/following-sibling::a[@href="https://bing.com" and text()="Test embedded link"]/following-sibling::a[@href="https://www.bing.com" and text()="https://www.bing.com"]/parent::p/following-sibling::h1[text()="header 1"]/following-sibling::h2[text()="header 2"]/following-sibling::h3[text()="header 3"]/following-sibling::h4[text()="header 4"]/following-sibling::blockquote/p[contains(text(),"blockquote 1")]/parent::*/following-sibling::p/a[@href="mailto:email@emailaddress.com" and contains(text(), "email@emailaddress.com")]',
  markdownImage: "markdown image",
  markdownImageResponse: '//*[@class="webchat__bubble__content"]/*[contains(@class, "markdown")]/p[contains(text(), "Text.")]/img[@alt="Alt Text"]',
  markdownImageMessage: 'Text.![Alt Text](https://picsum.photos/200/200?image=100)More text',
  markdownList: "markdown list",
  markdownListResponse: '//*[@class="webchat__bubble__content"]/*[contains(@class, "markdown")]/ol/li[contains(text(), "List")]/parent::ol/following-sibling::ul/li[contains(text(), "bullet")]/ul/li[contains(text(), "nested")]/ul/li[contains(text(), "2x nested")]/ancestor::ul[3]/following-sibling::ol/li[contains(text(), "Second")]',
  markdownEmailLinkMessage: '[My Link](https://www.bing.com)\n  myemail@myemail.com',
  markdownEmailLinkResponse: '//*[@class="webchat__bubble__content"]/*[contains(@class, "markdown")]/p/a[@href="https://www.bing.com" and contains(text(), "My Link")]/following-sibling::br/following-sibling::a[@href="mailto:myemail@myemail.com"]',
};

export const LiveChatWidgetPageConstants = {
  OperatingHrText: '//*[@id="oclcw-wp-alert-text"]/div',
  ConversationIdSelector: "(//div/div/p)[10]",
  HttpLink: '//a[contains(text(),"{0}")]',
  WaitForLoadingLCW: 5000,
  SystemMessage:
    '//*[contains(@id,"webchat__stacked-layout__id")]/div[2]/div[2]/div/p',
  MessageXpath: `//p[contains(text(),"{0}")]`,
  PrechatSubmitButtonClass: ".ac-pushButton",
  PCSSurveyLink: "//div[contains(text(),'How was your experience')]",
  TextareaXPath: '//*[@data-id="webchat-sendbox-input"]',
  CloseButtonId: "#webChatHeaderCloseButton",
  ChatButtonId: "//*[@id='oclcw-chatButton']",
  SelectSuggestedAction: "//button/*[contains(text(),'Blue')]",
  confirmaCloseChatCloseConfirmButtonId: "#webChatCloseConversationConfirmButtonConfirm",
  SignInLink: "//*[contains(@class,'ac-pushButton style-default')]",
  FoodSelection: "//div[@class='webchat__bubble__content']//button[@aria-label='Chicken']",
  FoodPreparationTextarea: "//div[@class='webchat__bubble__content']//*[@id='ChickenOther']//textarea[@placeholder='Any other preparation requests?']",
  FoodOKClick: "//div[@class='webchat__bubble__content']//button[@aria-label='OK']",
  postChatSurveyFeedbackSurveyLink: "#webChatProvideFeedbackSurveyLink",
  embedModeSurveyId: "#MfpEmbed_Iframe",
  SendButtonXPath:
    '//*[@id="web-chat-root-div"]/div/div[4]/div[2]/div[2]/button',
  UploadFile: '//*[@id="web-chat-root-div"]/div/div[4]/div[2]/div[1]/input',
  UploadSDKFile: "//*[@id='root']/div[2]/div[2]/div[4]/div[2]/div[1]/input",
  SendButtonXPathRu:
    '//*[@id="web-chat-root-div"]//div[@class="main"]//div//button[@title="Отправить"]|//*[@type="button" and contains(@class,"send")]',
  AWTMessageElementXPath: "//p[starts-with(text(),'Average wait time:')]",
  AWTMessage: "Average wait time",
  QueuePositionMessageElementXPath: `xpath=//div[starts-with(text(),'People ahead of you:')]`,
  systemMessage:
    '//*[@id="web-chat-root-div"]/div/div[2]/div/ul/li[3]/div/div/div[2]/div[1]/div[1]/div/div[2]',
  closeChat: '//*[@id="webChatHeaderCloseButton"]',
  confirmaCloseChat: '//*[@id="webChatCloseConversationConfirmButtonConfirm"]',
  minimizeChat: '//*[@id="webChatHeaderMinimizeButton"]',
  receivedMessageSelector: ".ms_lcw_webchat_received_message",
  userMessageListItem: "#web-chat-root-div>div>[class^='css']>div>ul>li",
  sentMessageSelector:
    "//div[contains(@class,'--from-user') and @role='group']",
  RuleBuilderFlyOutTypeAheadListItem:
    '//*[@id="web-chat-root-div" contains(text(),{0})]',
  Messagetext: '//div[contains(text(),"joined")]',
  Messagetexts: '//p[contains(text(),"joined")]',
  Selectedlist: '//div/p[contains(text(),"FoodChoice")]',
  MessageTextJoined:
    '//div[contains(text(),"joined")] | //p[contains(text(),"joined")]',
  SendButtonXPathBlob:
    '//*[@type="button" and contains(@class,"send")]|//*[@id="web-chat-root-div"]//div[@class="main"]//div//button[@title="Send"]',
  SendButtonXPathPopoutChat:
    '//*[@id="web-chat-root-div"]/div/div[4]/div[2]/div[2]/button',
  SendButtonXPathRuBlob:
    '//*[@id="web-chat-root-div"]//div[@class="main"]//div//button[@title="Отправить"]|//*[@type="button" and contains(@class,"send")]',
  MessagetextEnded: '//div[contains(text(),"ended")]',
  MessagetextEnd: '//p[contains(text(),"ended")]',
  BotOptionNone: '//span[normalize-space()="None"]',
  BotOptionRedmond: '//button/*[contains(text(),"Redmond")]',
  BotOptionStoreHours: '//button/*[contains(text(),"Store hours")]',
  BotOptionNo: '//button/*[contains(text(),"No")]',
  BotOptionTalktoAgent: '//button/*[contains(text(),"Talk to an agent")]',
  BotOptionAllDetails: '//p[contains(text(),"All_Details")]',
  BotOptionDiv: "//div[@aria-labelledby='webchat__suggested-actions--dv54k']",
  BotSureveyQuestion:
    '//div/p[contains(text(),"Do you want all store locations list from Bot?")]',
  MessageLocator: '//*[@class="webchat__bubble__content"]/div/following::div/p',
  BotMessageLoad: '//p[contains(text(),"Valid commands")] | //p[contains(text(),"available commands")]',
  BotMessageLoadForHeroCard: '//div[contains(text(),"Choose a color")]',
  FirstNameForAdaptive: "//input[contains(@aria-Label,'Last, First')]",
  EmailForAdaptive: "//input[contains(@aria-Label,'youremail@example.com')]",
  EmailInputBox: "//input[contains(@aria-label,'your email please')]",
  PhoneForAdaptive: "//input[contains(@aria-Label,'xxx.xxx.xxxx')]",
  AdaptiveSubmit: "//button[contains(@aria-Label,'Submit')]",
  RedButtonClick: "//button[contains(@aria-Label,'Red')]",
  ToggleActionClick: "//button[contains(@aria-Label,'Toggle!')]",
  BotAttachmentsMessageLoad: '//p[contains(text(),"Attachments:")]',
  NameforInputform:"//input[contains(@type,'text')]",
  EmailForInputForm:"//input[contains(@type,'email')]",
  PhoneForInputForm:"//input[contains(@type,'tel')]",
  BotTimeout: 4000,
  EmptyFileAttachment: "FileResources//LiveChatEmptyFileAttachment.txt",
  EmptyFileAttachmentErrorMessage:
    "//div[@aria-label='Notification']//div[contains(@class,'text')]",
  ExpectedEmptyFileAttachmentErrorMessage:
    "This file can't be attached because it's empty. Please try again with a different file.",
  SuggestedActionsMessage:
    '//div[contains(text(),"You have selected") or contains(text(),"You said")]',
  SurveyQuestion: "//input[contains(@aria-label,'omnichannelsurvey')]",
  SurveyMultilineQuestion:
    "//textarea[contains(@aria-label,'omnichannelmultiline')]",
  SurveyClick: "//button[contains(@aria-Label,'Submit')]",
  LiveChatHeaderTitle: "[id='webChatHeaderTitle']",
  LiveChatHeaderIcon: "div[class='web-chat-header-icon ']",
  LetsChat: '//*[@id="webChatHeaderTitle"]',
  PopoutWidgetChatContainer: "//div[@id='web-chat-root']",
  LinkValidation: "div[contains(text(),'This is a link')]",
  BotMessagesXpath: '//p[contains(text(),"Transferring the chat to agent.")]',
  BotTransferToAgentSystemMessage: "Transferring the chat to agent.",
  BotBoldMessageXpath: '//p[normalize-space()="Bold"]',
  BotItalicMessageXpath: '//p[normalize-space()="Italic"]',
  BotLinkMessageXpath: '//p[normalize-space()="Link"]',
  BotNumberListMessageXpath: '//p[normalize-space()="NumberList"]',
  BotBulletedListMessageXpath: '//p[normalize-space()="BulletList"]',
  BotBoldSystemMessage: "This is bold. This is also bold.",
  BotItalicSystemMessage: "This is italic. This is also italic.",
  BotLinkSystemMessage: "This is a link.",
  BotNumberListSystemMessage: "A numbered list:",
  BotBulletListSystemMessage: "A bulleted list:",
  ClosePopMsg: '//h1[contains(text(),"Close chat")]',
  CustomerScreenImageBoxSelector:
    "(//*[@class='webchat__fileContent__buttonLink'])[last()]",
  AgentScreenImageBoxSelector: "//*[@class='webchat__fileContent__buttonLink']",
  CustomerScreenImagesBoxSelector:
    "(//*[@class='webchat__fileContent__buttonLink'])",
  LiveChatAttachments: "div[class='webchat__fileContent__fileName']",
  CreateAccount:
    "button[data-id='msdyn_customer.fieldControl-CreateNewButton_account']",
  AccountName: "input[data-id='name.fieldControl-text-box-text']",
  MessageToAgent: "Hello!",
  QuickRepliesMenuItem:
    "//li[contains(@id,'sitemap')]//span[contains(text(),'Quick replies')]",
  QuickReply: "input[data-id='msdyn_title.fieldControl-text-box-text']",
  QuickReplyMessage:
    "textarea[data-id='msdyn_message.fieldControl-text-box-text']",
  Title: "input[data-id='msdyn_title.fieldControl-text-box-text']",
  Message: "textarea[data-id='msdyn_message.fieldControl-text-box-text']",
  SystemMessageXPath:
    "//div[contains(@class, 'oclcw-web-chat-system-message')]",
  AddQuickReply:
    "button[data-id='msdyn_cannedmessage|NoRelationship|SubGridStandard|Mscrm.SubGrid.msdyn_cannedmessage.AddExistingAssoc']",
  QuickReplyName:
    "input[data-id='MscrmControls.FieldControls.SimpleLookupControl-LookupResultsPopup_falseBoundLookup_textInputBox_with_filter_new']",
  QuickReplySearchButton:
    "button[data-id='MscrmControls.FieldControls.SimpleLookupControl-LookupResultsPopup_falseBoundLookup_search']",
  QuickReplyLookupValue:
    "div[data-id='MscrmControls.FieldControls.SimpleLookupControl-LookupResultsPopup_falseBoundLookup_tabContainer'] li[aria-label*='{0}']",
  AddButton: "button[data-id='lookupDialogSaveBtn']",
  SearchTagsName:
    "input[data-id='msdyn_tagscontrolfield.fieldControl-tagInputField']",
  SelectTag:
    "div[data-id='msdyn_tagscontrolfield.fieldControl-finalcontainer'] li[contains(text(),'{0}')]",
  ScrollContainerclick: "//span[contains(text(),'{0}')]",
  SampleVideoMp4File: "FileResources//SampleMp4.mp4",
  ValidateTextForDuplicate:
    '//div/p[contains(text(),"Hi, How can i help you?")]',
  MessageRecievedFromAgent:
    "//div[@class='ms_lcw_webchat_received_message']//div[@class='webchat__bubble__content']//div//p[contains(text(),'{0}')]",
  DuplicateMessageVerificationText: "Hi, How can i help you?",
  LiveChatPingMsg: "Hi, Ping from Live Chat",
  KBArticleMessage:
    "//a[contains(@href,'https://support.microsoft.com/kb/KM-01011')]",
  DownloadTranscriptButton:
    '//button[@class="oclcw-actionBar-DownloadTranscript-icon-button"]',
  EmailTranscriptButton:
    '//button[@class="oclcw-actionBar-EmailTranscript-icon-button"]',
  EmailTranscriptTxtArea: '//input[@id="oclcw-emailTranscriptDialogTextField"]',
  EmailTranscriptSendBtn:
    '//*[@id="oclcw-emailTranscriptDialogContainer"]/div/div[2]/button[1]',
  EmailTranscriptCancelBtn:
    '//*[@id="oclcw-emailTranscriptDialogContainer"]/div/div[2]/button[2]',
  LiveChatSystemMessage: "//*[contains(text(),'Hi, Ping from Live Chat')]",
  AutoCloseAfterInACtivity:
    "//input[@data-id='msdyn_autocloseafterinactivity.fieldControl-duration-combobox-text']",
  PostChatSurveyLink: "//div[contains(text(),'How was your experience?')]",
  UserMessageLayout: "//div[contains(@class,'--from-user') and @role='group']",
  AgentMessageLayout: ".ms_lcw_webchat_received_message",
  Livechatmessage: "//div[text()='Hello! How can I help you?']",
  Livechatmessages: "//p[text()='Hello! How can I help you?']",
  LiveChatSystemMessages: "//p[text()='Hi, Ping from Live Chat']",
  PrechatEmail: "//input[contains(@aria-label,'What is your E-mail ?')]",
  PreChatEmailSelector: "//input[contains(@value,'c@microsoft.com')]",
  //Proactive chat constants
  ProactiveChatWaitTime: 15000,
  ProactiveChatContextKey1:
    "//label[@data-id='msdyn_conversationsummaryfield.fieldControl-Time On PageKeyLabel']",
  ProactiveChatContextVal1: "Time On Page",
  ProactiveChatContextKey2:
    "//label[@data-id='msdyn_conversationsummaryfield.fieldControl-Page URLKeyLabel']",
  ProactiveChatContextVal2: "Page URL",
  ProactiveChatContextKey3:
    "//label[@data-id='msdyn_conversationsummaryfield.fieldControl-Proactive ChatKeyLabel']",
  ProactiveChatContextVal3: "Proactive Chat",
  ClickTag: "span[data-id='msdyn_tagscontrolfield.fieldControl-addTagIcon']",
  ReconnectTimeLimit:
    "input[data-id='msdyn_autocloseafterinactivity.fieldControl-duration-combobox-text']",
  ClickWorkstream: "div[data-id='workstreams_container'] a[title='{0}']",
  InlineSearchMessageForLCW:
    "//div[contains(text(),'Sorry we couldn't finish our chat')]",
  InlineText: "Sorry we couldn't finish our chat",
  videoControl: "//video[contains(@aria-Label,'SampleMp4.mp4')]",
  PreviewCardforMp3: "//*[contains(@aria-label,'{0}')]/div",
  SelectTagRecord:
    "div[data-id='msdyn_tagscontrolfield.fieldControl-finalcontainer'] li[data-id='msdyn_tagscontrolfield.fieldControl-dropdownListItem0']",
  BotMessagesXpathMessage: '(//*[contains(text(),"You said:")])[last()]',
  BotMessagesXpathValidMessage:
    '(//p[contains(text(),"Valid commands include:")])[last()]',
  PVASuggestedActionsMessage:
    '//p[contains(text(),"Redmond") or contains(text(),"Seattle") or contains(text(),"Kirkland")]',
  BotAdaptiveCardMsg:
    '//p[contains(text(),"Would you like to book this flight?")]',
  LastMessageLocator:
    '(//*[@class="webchat__bubble__content"]/div/following::div/p)[last()]',
  ContextMessageLocator:
    '//*[@class="webchat__bubble__content"]/div/following::div/p[contains(text(),"msdyn_liveworkitemid")]',
  PVAGreetingMessages:
    '//*[@class="webchat__bubble__content"]/div/following::div/p[contains(text(),"msdyn_liveworkitemid")]',
  DuplicateGreetingMessage:
    '(//*[@class="webchat__bubble__content"]/div/following::div/p[contains(text(),"Hi! I\'m a virtual agent.")])[2]',
  LiveChatSysMessage: "//*[contains(text(),'{0}')]",
  YouAreNextInLineElemenXPath: `//*[contains(text(),"You're next in line")]`,
  LiveChatStartNewSessionBtnSelector:
    "//*[@aria-label='Start new conversation']",
  LiveChatWidgetInitialMessage:
    "//*[contains(text(),'An agent will be with you in a moment')]",
  CustomerSentMessageLabel:
    "(//div[contains(@class,'oclcw-web-chat-activityStatus-timestampContent')]//span[@aria-hidden='false']|[text()='Sent'])",
  CustomerSentTimeStamp:
    "//div[contains(@class,'oclcw-web-chat-activityStatus-timestampContent')]//span//span[contains(@class,'webchat--css-dognv-bsfxty')]",
  InputCardName: "//div[@id='SimpleVal']/div/input",
  InputCardHomePage: "//div[@id='UrlVal']/div/input",
  InputCardMail: "//div[@id='EmailVal']/div/input",
  InputCardnumber: "//div[@id='TelVal']/div/input",
  InputCardComments: "//div[@id='MultiLineVal']/div/textarea",
  InputCardQuantity: "//div[@id='NumVal']/div/input",
  InputCardDateVal: "//div[@id='DateVal']//input[@type='date']",
  InputCardTimeVal: "//div[@id='TimeVal']//input[@type='time']",
  InputCardDropdown: "//div[@id='CompactSelectVal']//select[@class='ac-input ac-multichoiceInput ac-choiceSetInput-compact']/option/following-sibling::option[text()='Red']/following-sibling::option[text()='Green']/following-sibling::option[text()='Blue']",
  InputCardRadioButtons: "//div[@id='SingleSelectVal']//div[@class='ac-input ac-choiceSetInput-expanded']//input[@type='radio']/following-sibling::label/p[text()='Red']/ancestor::*//input[@type='radio']/following-sibling::label/p[text()='Green']/ancestor::*//input[@type='radio']/following-sibling::label/p[text()='Blue']",
  InputCardMultiSelectButtons: "//div[@id='MultiSelectVal']//*[@class='ac-input ac-choiceSetInput-multiSelect']//input[@type='checkbox' and @aria-label='Red']//ancestor::*//input[@type='checkbox' and @aria-label='Blue']//ancestor::*//input[@type='checkbox' and @aria-label='Green']",
  InputCardToggle: "//div[@id='AcceptsTerms']//div[@class='ac-input ac-toggleInput']/input[@type='checkbox' and @aria-label='I accept the terms and conditions (True/False)']//ancestor::*//div[@id='ColorPreference']//div[@class='ac-input ac-toggleInput']/input[@type='checkbox' and @aria-label='Red cars are better than other cars']",
  InputCardSubmit: "//button[@type='button' and @aria-label='Submit']",
  InputCardCheckBoxAcceptTerms: "//div[@id='AcceptsTerms']/div/div",
  FirstName: "Customer",
  HomePage: "www_microsoft_com",
  Email: "c@microsoft_com",
  Phone: "1234567890",
  SomeComments: "Some comments",
  QuantityNumber: "3",
  DueDate: "2022-01-23",
  StartTime: "16:20",
  InputValidation: "//div/p[contains(text(),'Customer')]",
  PartialCustomerName: "Custom",
  PartialHomePage: "microsoft",
  PartialEmail: "c@microsoft",
  PartialPhoneNumber: "123",
  SystemMessageFirstLaunchText: "Leave as many messages as you’d like and we’ll get",
  BotConversationIdValidation: "conversation id value",
  BotMessageXPath: "//*[contains(text(),'{0}')]",
  CameraEnabled: "//button[@aria-label='Turn camera off']",
  CameraDisabled: "//button[@aria-label='Turn camera on']",
  VideoWidget: "//*[@id='toggleVideo']",
  BotCaseDetailsNotAvailableValidation: "Case details are not available",
  BotCaseDetailsAvailableValidation: "Case details values are",
  BotContactDetailsNotAvailableValidation: "Contact details are not available",
  BotContactDetailsAvailableValidation: "Contact details values are",
  BotAccountDetailsNotAvailableValidation: "Account details are not available",
  BotAccountDetailsAvailableValidation: "Account details values are",
};

export enum LiveChatConstants {
  CrmAdminEmail = "crmadmin@ocautositpw1.onmicrosoft.com",
  AM = "AM",
  PM = "PM",
  OutsideOperatingHrtext = "You have reached us outside of our operating hours",
  MessageToAgent = "Hi, Ping from Live Chat",
  MessageUser = "Hi :)",
  ChatLanguage = "en",
  ReconnectChatMessage = "Pinged for Reconnect",
  GreetingMessage = "Hi! I am a virtual agent. I can help with store information, flight details and more.",
  BYOBGreetingMessages = "Hello and welcome!",
  BYOBEscalateMsg = "Yes please",
  AdaptiveCardGreetingMessage = "Amsterdam",
  BYOBGreetingMessage = "Hi Customer! This is your Omnichannel Test Bot 🤖\n\nPlease say 'help' for available commands.",
  BYOBHelpMessage = "help",
  BYOBSuggestedAction = "Suggested Action",
  AdaptiveCard = "Adaptive Card",
  AdaptiveCardImageGallery = "image gallery",
  AdaptiveCardWithText = "adaptive card with text",
  AdaptiveCardAmsterdam = "Amsterdam",
  AdaptiveCardOpenUrlAction = "Adaptive Card OpenUrl Action",
  AdaptiveCardVideo = "Adaptive Card Video",
  AdaptiveCardSubmitAction = "Adaptive Card Submit Action",
  AdaptiveCardToggleAction = "Adaptive Card Toggle Action",
  AdaptiveCardItinerary = "Flight Itinerary",
  AdaptiveCardInputForm = "Input form",
  AdaptiveCardInput = "Inputs",
  AdaptiveCardFlightUpdate = "Flight Update",
  AdaptiveCardAudio = "Adaptive Card Audio",
  AdaptiveCardShowAction = "Adaptive Card Show Action",
  AdaptiveCardUpdateMessage = "Activity Update",
  AdaptiveCardBase64Images = "Base 64 Images",
  AdaptiveCardCalendarReminder = "Calendar Reminder",
  AdaptiveCardSportingEvent = "Sporting Event",
  AdaptiveCardStockUpdate = "Stockupdate",
  AdaptiveCardMarkdown = "Markdown Card",
  RichCardHeroIMBack = "Hero Card IMBack",
  LiveChatSignInCard = "signin card",
  RichCardHero = "Hero Card",
  RichCardReceipt = "Receipt Card",
  RichCardThumbnail = "Thumbnail Card",
  RichCardAudio = "Audio Card",
  FlightSuggestions = "Show me destinations to fly to today",
  Inputs = "Inputs",
  ShowCardSubmitResponse = "/show_card_submit_response",
  BOTEndChatMessage = "has ended the conversation.",
  BOTEndChatMessagexpath = "(//*[@class='webchat__bubble__content'])[last()]//div",
  maxCapacity = "30000000",
  mediumCapacity = "1000",
  minCapacity = "100",
  ChatRecord = "LiveChatReconnectAccount",
  PreChatRecord = "LivePreChatPopoutPWAccount",
  WorkStreamRecord = "Live chat workstream",
  LiveChatPWAWorkstream = "LiveChatPWWorkstream",
  ReconnectWorkStreamRecord = "LiveChatReconnectWorkstream",
  ReconnectLivechatRecord = "LiveChatReconnectAccount",
  ChatAttachmentsRecord = "LiveChatAttachmentsAccount",
  LiveChatRecord = "LiveChatPWAccount",
  Mode = "Work distribution mode",
  Question1 = "//input[contains(@aria-label,'surveyone')]",
  Question2 = "//input[contains(@aria-label,'surveytwo')]",
  Question3 = "//textarea[contains(@aria-label,'surveythree')]",
  Question4 = "//input[contains(@aria-label,'surveyfour')]",
  Submit = "button[aria-label='Submit']",
  PopupWindowMessage1 = "Hello1",
  PopupWindowMessage2 = "Hello2",
  PopupWindowMessage3 = "Hello3",
  PopupWindowMessage4 = "Hello4",
  DefaultAttachmentPath = "FileResources//LiveChatAttachment.txt",
  LiveChatCloseConversationTimeout = 5000,
  minCapacityForSecondUser = "20",
  MessageToAgentAfterReconnect = "Hi, Ping from Live Chat after Reconnect",
  RelavenceSearchMessage = "RelevanceSearch LiveChat Validation",
  MessageToAgentRelavence = "Hi, Ping from Live Chat Relevance",
  ConsultWorkStreamRecord = "LiveChatConsultWorkstream",
  ConsultLiveChatAccount = "LiveChatConsultAccount",
  FileDownloadLink = "//a[@class='webchat__fileContent__buttonLink']",
  FileDownloadIcon = "//div[@class='webchat__fileContent__fileName']",
  Attachment = "//div[@class='oclcw-web-chat-attachment']",
  WorkStreamAuthRecord = "LiveChatAuthWorkstream",
  LiveChatAuthAccount = "LiveChatAuthAccount",
  ChatRecordWithSurveyQuestion = "LiveChatReconnectSurveyAccount",
  AuthChatRecordWithSurveyQuestion = "AuthLiveChatReconnectSurveyAccount",
  RedirectionUrl = "https://www.microsoft.com/",
  Botname = "Name of bot",
  IsContextEnable = "yes",
  ChatRecordPopoutRecord = "LiveChatReconnectPopoutAccount",
  StoreNearMessage = "store near me",
  PVAContextTopicTriggerMessage = "Context var in greeting topic",
  ReconnectQuickReplyTitleForAuth = "ReconnectQuickReplyAuthAccount",
  LcwMarkdownMessage = "*strong*\n_italics_\n*_strong and italics_*\n_*italics and strong*_\n~strikethrough~\n~*strikethrough&strong*~\n~_*strikethroughItallic&strong*_~\nPlain text\n[abc](https://abc.com)\nhttps://www.abc.com\n```var a = 1;```\n",
  LcwMarkdownMessageValidation = '<strong>strong</strong><br>\n<em>italics</em><br>\n<strong><em>strong and italics</em></strong><br>\n<em><strong>italics and strong</strong></em><br>\n<s>strikethrough</s><br>\n<s><strong>strikethrough&amp;strong</strong></s><br>\n<s><em><strong>strikethroughItallic&amp;strong</strong></em></s><br>\nPlain text<br>\n<a href="https://abc.com" target="_blank" rel="noopener noreferrer">abc</a><br>\n<a href="https://www.abc.com" target="_blank" rel="noopener noreferrer">https://www.abc.com</a><br>\n<code>var a = 1;</code>',
  SurveyMessage = "Great",
  SingleLineValidation = "Welcome to omnichannel customer service application, here we interact with agent and customer servic",
  MultiLineValidation = "Welcome to omnichannel customer service application, here we interact with agent and customer. With any of the channels and proceed with conversations with respective agents. This is the best platform for interaction though different sources. Thanks.",
  FoodOrder = "food order",
  ocautopwliveagentAgentQueue = "ocautopw liveagent",
  ocautopwliveagentAgentName = "ocautopw livechatuser1",
  LCWAutomatedQueue = "LCWAutomatedQueue",
  SelectAllSelector = "LiveChatPWQueue",
  DataMaskingMessage1 = "It Bass player goes to base of instrument",
  DataMaskingMessage2 = "It Bass player bass player baSS player bASs player Base",
  LCWAutomatedQueueName = "LCWAutomatedQueue",
  LiveChatEscalateQueueName = "LiveChatEscalateQueue",
  PVAPWQueue = 'PVAPWQueue',
  LiveChatPWQueue = "LiveChatPWQueue",
  InputValidate = "Input.Text elements",
  HeroCardValidate = "BotFramework Hero Card",
  RichCardReceiptValidate = "More information",
  RichCardThumbnailValidate = "Get Started",
  RichCardAudioValidate = "I am your father",
  InputFormValidate = "Tell us about yourself",
  PersistentChatAuthCustomerMessage = "Hi, Ping from Persistant chat Auth Customer",
  LiveChatPWQueueName = "LiveChatPWQueue",
  LiveChatVoiceQueueName = "LiveChatVoiceQueue",
  Agentaffinity_user1 = "agentaffinity user1",
  LiveChatEscalateQueue = "LiveChatEscalateQueue"
}

export enum SurveyQuestion {
  Question1 = "surveyone",
  Question2 = "surveytwo",
  Question3 = "surveythree",
  Question4 = "surveyfour",
  Question1Text = "surveyone",
  Question2Text = "surveytwo",
  Question3Text = "surveythree",
  Question4Text = "surveyfour",
}

export enum QuickReplies {
  QuickRepliesTitle = "q1",
  QuickRepliesMessage = "quick replies1",
  QuickTagName = "#q1",
  ReconnectQuickReplyTitle = "ReconnectQuickReplyAccount",
  ReconnectQuickRepliesMessage = "In case you disconnect {ReconnectUrl{ReconnectID}}",
  ReconnectQuickTagName = "#reconnect",
  ReconnectQuickReplyTitleForAuth = "ReconnectQuickReplyAuthAccount",
  ReconnectQuickTagNameForAuth = "#authreconnect",
  PreventTagName = "# ",
  PreventTagMessage = "h2#subtitle",
  QuickReplyTag = "div[data-id='msdyn_tagscontrolfield.fieldControl-textInputContainer'] span[data-id*='msdyn_tagscontrolfield.fieldControl-addTagIcon']",
  AuthSigninPage = "//*[@id='local-login-heading']/span/span",
}

export enum LiveChatMessageConstants {
  AgentInAMomentXpath = "//*[contains(text(),'An agent will be with you in a moment')]",
  AgentInAMomentMessage = "An agent will be with you in a moment.",
  AgentJoinedConversationXpath = "//*[contains(text(),'joined the conversation')]",
  AgentJoinedConversationMessage = "{0} has joined the conversation.",
  AnotherAgentJoinedConversationXpath = "//*[contains(text(),'Another agent')]",
  AnotherAgentJoinedConversationMessage = "Another agent has joined the conversation.",
  ConsultAgentLeftConversationXpath = "//*[contains(text(),'has left the conversation')]",
  ConsultAgentLeftConversationMessage = "{0} has left the conversation.",
  ChatTransferredXpath = "//*[contains(text(),'Your chat has been transferred')]",
  ChatTransferredMessage = "Your chat has been transferred. An agent will be with you in a moment.",
  AgentEndedConversationXpath = "//*[contains(text(),'has ended the conversation')]",
  AgentEndedConversationMessage = "{0} has ended the conversation.",
  AgentLeftConversationXpath = "//*[contains(text(),'has left the conversation')]",
  AgentLeftConversationMessage = "{0} has left the conversation.",
  LiveChatTypingStatusXpath = "//*[contains(text(),'{0} is typing')]",
  LiveChatTypingStatusMessage = "{0} is typing",
  Agent2JoinedConversationXpath = "//*[contains(text(),'has joined conversation')]",
  Agent2JoinedConversationMessage = "{0} has joined conversation.",
  Agent1JoinedConversationXpath = "//*[contains(text(),'has joined customer conversation')]",
  Agent1JoinedConversationMessage = "{0} has joined customer conversation.",
  Agent1LeftConversationXpath = "//*[contains(text(),'has left customer conversation')]",
  Agent1LeftConversationMessage = "{0} has left customer conversation.",
  Agent2LeftConversationXpath = "//*[contains(text(),'has left conversation')]",
  Agent2LeftConversationMessage = "{0} has left conversation.",
  HolidayXpath = "//div[contains(text(),'Happy Holiday')] | //p[contains(text(),'Happy Holiday')]",
  HolidayMessage = "Happy Holiday! We are offline today. Please visit tomorrow.",
  OfflineXpath = "//*[contains(text(),'Thanks for contacting us. You have reached us outside of our operating hours. An agent will respond when we open')]",
  OfflineSpanishXpath = "//div[contains(text(),'Gracias por ponerse en contacto con nosotros pero no estamos en horario comercial. Un agente le responderá cuando abramos')]",
  OfflineMessage = "Thanks for contacting us. You have reached us outside of our operating hours. An agent will respond when we open.",
  OfflineSpanishMessage = "Gracias por ponerse en contacto con nosotros pero no estamos en horario comercial. Un agente le responderá cuando abramos",
  AutoCloseMessageXpath = "//div[contains(text(),'The session has paused due to inactivity. Please reply to continue this chat.')]",
  AutoCloseMessageXpaths = "//p[contains(text(),'The session has paused due to inactivity. Please reply to continue this chat.')]",
  SessionInactiveMessage = "The session has paused due to inactivity. Please reply to continue this chat.",
  BotwaitGreetMsg = '//p[contains(text(),"Hi Customer! This is your Omnichannel Test Bot 🤖")]',
  BotValidCommandsMessage = '//p[contains(text(),"Valid commands include:")]',
  MarkdownMessageUnorderedlist1 = "* item1\n * item2\n * item3",
  MarkdownMessageUnorderedlist2 = "+ item1\n + item2\n + item3",
  MarkdownMessageUnorderedlist3 = "- item1\n - item2\n - item3",
  MarkdownMessageUnorderedlistPlaintext = "* item1\n Some Plain text\n * item2\n Some Plain text",
  MarkdownValidationMessageUnorderedlist = "\n<li>item1</li>\n<li>item2</li>\n<li>item3</li>\n",
  MarkdownMessageorderedlist1 = "1. item1\n 2. item2\n 3. item3",
  MarkdownMessageorderedlistPlaintext = "1. item1\n Some Plain text\n 2. item2\n Some Plain text",
  MarkdownValidationMessageorderedlist = "\n<li>item1</li>\n<li>item2</li>\n<li>item3</li>\n",
  MarkdownMessageBlockquote1 = "> block 1\n> block 2",
  MarkdownMessageValidatoinBlockquote1 = "\n<p>block 1<br>\nblock 2</p>\n",
  MarkdownMessageBlockquote2 = "> blockquote 1\n> blockquote 1.1",
  MarkdownMessageValidatoinBlockquote2 = "\n<p>blockquote 1<br>\nblockquote 1.1</p>\n",
  MarkdownMessageBlockquote3 = "> block 2\n>> block 2.1",
  MarkdownMessageValidatoinBlockquote3 = "\n<p>block 2</p>\n<blockquote>\n<p>block 2.1</p>\n</blockquote>\n",
  MarkdownMessageHeader = "# header1",
  LcwMarkdowncodeMessage = "```\nvar foo = function\n(bar) {\nreturn bar++;\n\n};\n\nconsole.log(foo(5));\n```",
  LcwMarkdowncodeValidationMessage = "<code>var foo = function\n(bar) {\nreturn bar++;\n\n};\n\nconsole.log(foo(5));\n</code>",
  ComputeXpath = "//div[contains(text(),'We are unable to compute the average wait time')] | //p[contains(text(),'We are unable to compute the average wait time')]",
  ComputeMessage = "We are unable to compute the average wait time",
}

export enum LiveChatMarkdown {
  MessageSenario1 = "*strong*\n_italics_\n*_strong and italics_*\n_*italics and strong*_\n```mono space test```\n[Test embedded link](https://bing.com)\nhttps://www.bing.com\n",
  ValidationMessageSenario1 = 'strong\nitalics\nstrong and italics\nitalics and strong\nmono space test\nTest embedded link\nhttps://www.bing.com',
  MessageSenario2 = "```this is a long message!!this is a long message!!this is a long message!!this is a long message!!this is a long message!!this is a long message!!this is a long message!!this is a long message!!```",
  ValidationMessageSenario2 = "<code>this is a long message!!this is a long message!!this is a long message!!this is a long message!!this is a long message!!this is a long message!!this is a long message!!this is a long message!!</code>",
  MessageSenario3 = "```aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa```",
  ValidationMessageSenario3 = "<code>aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa aaa</code>",
  Strong = "some text *strong* some text",
  Strongem = "some text <strong>strong</strong> some text",
  selector = "p",
  Italic = "_italics_",
  Italicem = "<em>italics</em>",
  Strikethrough = "~strikethrough~",
  Strikethroughem = "<s>strikethrough</s>",
  Header1 = "# header1",
  Header2 = "## header2",
  Headerem = "header1",
  Headerem2 = "header2",
  H1 = "h1",
  H2 = "h2",
}

export class LiveChatPage extends WorkStreamsPage {
  private newAdaptiveCardData = {
    FirstName: "Test Adaptive",
    Email: "Adaptive@test.com",
    Phone: "123456789",
  };

  private newLablesValidation = {
    Link: "This is a link",
  };

  constructor(page: Page) {
    super(page);
  }

  public getAuthScript(token: string, timeout: number = 10): string {
    return `
            
                function convertToJwtToken(payloadToEncrypt){
                    return function(callback){
                        let jwt= "${token}";
                        setTimeout(() => {
                            callback(jwt);
                        }, ${timeout});
                    }
                }
                window.getOmnichannelAuthToken = (callback) => {
                    let payload = {};
                    convertToJwtToken(payload)(callback);
                };
           
        `;
  }

  public async openChat(isAuthUser: boolean = false) {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.liveChatiframeName,
      Constants.Three,
      null,
      Constants.MaxTimeout
    );
    await this.waitUntilChatWidgetIsVisible(
      Constants.Three,
      Constants.MaxTimeout
    );
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    await iFrame.waitForSelector(SelectorConstants.Letschat);
    await iFrame.$eval(SelectorConstants.Letschat, (el) =>
      (el as HTMLElement).click()
    );
    if (!isAuthUser) {
      await iFrame.waitForSelector(LiveChatWidgetPageConstants.closeChat);
    }
  }

  public async minimizeChat(isAuthUser: boolean = false) {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    await iFrame.waitForSelector(LiveChatWidgetPageConstants.minimizeChat);
    await iFrame.$eval(LiveChatWidgetPageConstants.minimizeChat, (el) =>
      (el as HTMLElement).click()
    );
  }

  public async getChatIframe() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    return await liveChatiframeName.contentFrame();
  }

  public async initiateChat() {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.liveChatiframeName,
      Constants.Three,
      null,
      Constants.MaxTimeout
    );
    await this.waitUntilChatWidgetIsVisible(
      Constants.Three,
      Constants.MaxTimeout
    );
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const chatiFrame = await liveChatiframeName.contentFrame();
    await this.waitForDomContentLoaded();
    chatiFrame.waitForSelector(SelectorConstants.Letschat, {
      timeout: TimeoutConstants.Minutes(2),
    });
    await Promise.all([
      chatiFrame.$eval(SelectorConstants.Letschat, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
    await this.waitForDomContentLoaded();
    const isPrechatEnabled = await chatiFrame.evaluate(() => {
      return Microsoft.Omnichannel.LiveChatWidget.Bootstrapper.lcConfig
        .isPreChatEnabled;
    });
    await this.waitForDomContentLoaded();
    if (isPrechatEnabled) {
      await chatiFrame.waitForSelector(
        LiveChatWidgetPageConstants.PrechatSubmitButtonClass
      );
      chatiFrame.$eval(
        LiveChatWidgetPageConstants.PrechatSubmitButtonClass,
        (el) => (el as HTMLElement).click()
      );
    }

    await this.waitUntilSelectorIsVisible(SelectorConstants.ChatClose);
  }

  public async initiateChatWithEmail() {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.liveChatiframeName,
      Constants.Three,
      null,
      Constants.MaxTimeout
    );
    await this.waitUntilChatWidgetIsVisible(
      Constants.Three,
      Constants.MaxTimeout
    );
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const chatiFrame = await liveChatiframeName.contentFrame();
    await this.waitForDomContentLoaded();
    chatiFrame.waitForSelector(SelectorConstants.Letschat, {
      timeout: TimeoutConstants.Minutes(2),
    });
    await Promise.all([
      chatiFrame.$eval(SelectorConstants.Letschat, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
    await this.waitForDomContentLoaded();
    const isPrechatEnabled = await chatiFrame.evaluate(() => {
      return Microsoft.Omnichannel.LiveChatWidget.Bootstrapper.lcConfig
        .isPreChatEnabled;
    });
    await this.waitForDomContentLoaded();
    if (isPrechatEnabled) {
      const EmailName = await chatiFrame.waitForSelector(
        LiveChatWidgetPageConstants.EmailInputBox
      );
      await EmailName.fill(this.newAdaptiveCardData.Email);
      await chatiFrame.waitForSelector(
        LiveChatWidgetPageConstants.PrechatSubmitButtonClass
      );
      chatiFrame.$eval(
        LiveChatWidgetPageConstants.PrechatSubmitButtonClass,
        (el) => (el as HTMLElement).click()
      );
    }

    await this.waitUntilSelectorIsVisible(SelectorConstants.ChatClose);
  }

  public async initiateSDKChat() {
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(SelectorConstants.ChatSDKButton);
    await this.Page.click(SelectorConstants.ChatSDKButton);
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(SelectorConstants.AgentWillJoineConversationXpath);
    await this.waitUntilSelectorIsVisible(SelectorConstants.ChatSDKSendButton);
  }

  public async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async initiateChatforBlob() {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.liveChatiframeName,
      Constants.Three,
      null,
      Constants.MaxTimeout
    );
    await this.waitUntilChatWidgetIsVisible(
      Constants.Three,
      Constants.MaxTimeout
    );
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const chatiFrame = await liveChatiframeName.contentFrame();
    await chatiFrame.waitForSelector(SelectorConstants.Letschat);
    await Promise.all([
      chatiFrame.$eval(SelectorConstants.Letschat, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
    await this.waitUntilSelectorIsVisible(SelectorConstants.ChatClose);
  }

  public async initiateProactiveChat() {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.liveChatiframeName,
      Constants.Three,
      null,
      Constants.MaxTimeout
    );
    await this.waitUntilChatWidgetIsVisible(
      Constants.Three,
      Constants.MaxTimeout
    );
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const chatiFrame = await liveChatiframeName.contentFrame();
    chatiFrame.waitForSelector(SelectorConstants.ProactiveChatBtn);
    await Promise.all([
      chatiFrame.$eval(SelectorConstants.ProactiveChatBtn, (el) =>
        (el as HTMLElement).click()
      ),
      this._page.waitForEvent("framenavigated"),
    ]);

    const isPrechatEnabled = await chatiFrame.evaluate(() => {
      return Microsoft.Omnichannel.LiveChatWidget.Bootstrapper.lcConfig
        .isPreChatEnabled;
    });

    if (isPrechatEnabled) {
      await chatiFrame.waitForSelector(
        LiveChatWidgetPageConstants.PrechatSubmitButtonClass
      );
      chatiFrame.$eval(
        LiveChatWidgetPageConstants.PrechatSubmitButtonClass,
        (el) => (el as HTMLElement).click()
      );
    }

    await this.waitUntilSelectorIsVisible(SelectorConstants.ChatClose);
  }

  public async initiateProactivePopoutChat() {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.liveChatiframeName,
      Constants.Three,
      null,
      Constants.MaxTimeout
    );
    await this.waitUntilChatWidgetIsVisible(
      Constants.Three,
      Constants.MaxTimeout
    );
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const chatiFrame = await liveChatiframeName.contentFrame();
    chatiFrame.waitForSelector(SelectorConstants.ProactiveChatBtn);
    await Promise.all([
      chatiFrame.$eval(SelectorConstants.ProactiveChatBtn, (el) =>
        (el as HTMLElement).click()
      ),
    ]);

    await this.waitUntilSelectorIsVisible(
      LiveChatWidgetPageConstants.PopoutWidgetChatContainer
    );
  }

  public async validateLetsChatButton() {
    await this.Page.waitForTimeout(Constants.MaxTimeout);
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const chatiFrame = await liveChatiframeName.contentFrame();
    let chatButton = chatiFrame.$(SelectorConstants.Letschat);
    return chatButton;
  }

  public async validateFirstTimeMessage() {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.liveChatiframeName,
      Constants.Three,
      null,
      Constants.OpenWsWaitTimeout
    );
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    await this.waitForDomContentLoaded();
    const textArea = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.SystemMessageXPath
    );
    await this.waitForDomContentLoaded();
    const message = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.SystemMessageXPath
    );
    expect(
      (await message.textContent()).includes(
        LiveChatWidgetPageConstants.SystemMessageFirstLaunchText
      )
    ).toBeTruthy();
  }

  public async initiatePopoutChat() {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.liveChatiframeName,
      Constants.Three,
      null,
      Constants.MaxTimeout
    );
    await this.waitUntilChatWidgetIsVisible(
      Constants.Three,
      Constants.MaxTimeout
    );
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const chatiFrame = await liveChatiframeName.contentFrame();
    chatiFrame.waitForSelector(SelectorConstants.Letschat);
    await Promise.all([
      chatiFrame.$eval(SelectorConstants.Letschat, (el) =>
        (el as HTMLElement).click()
      ),
    ]);

    await this.waitUntilSelectorIsVisible(
      LiveChatWidgetPageConstants.PopoutWidgetChatContainer
    );
  }

  public async validateAttachment() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    return iFrame.waitForSelector(AgentChatConstants.AttachmentSelector);
  }

  public async sendMessage(message: string, language: "en" | "ru" = "en") {
    const sendXPath =
      language === "en"
        ? LiveChatWidgetPageConstants.SendButtonXPathBlob
        : LiveChatWidgetPageConstants.SendButtonXPathRu;
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.liveChatiframeName,
      Constants.Three,
      null,
      Constants.OpenWsWaitTimeout
    );
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    await this.waitForDomContentLoaded();
    const textArea = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.TextareaXPath
    );
    await this.waitForDomContentLoaded();
    await textArea.fill(message);
    await this.Page.keyboard.press(Constants.EnterKey, {
      delay: TimeoutConstants.Default,
    });
    await this.waitUntilFrameIsVisible(
      sendXPath,
      AgentChatConstants.Five,
      iFrame,
      Constants.DefaultTimeout
    );
    await Promise.all([
      iFrame.$eval(sendXPath, (el) => (el as HTMLElement).click()),
    ]);
  }

  public async sendSDKMessage(message: string) {
    const textArea = await this.waitUntilSelectorIsVisible(
      SelectorConstants.ChatSDKTextArea,
      Constants.Three,
      null,
      Constants.OpenWsWaitTimeout
    );
    await this.waitForDomContentLoaded();
    await this.fillInputData(SelectorConstants.ChatSDKTextArea, message);
    await this.waitUntilSelectorIsVisible(SelectorConstants.ChatSDKSendButton);
    await this.Page.click(SelectorConstants.ChatSDKSendButton);
    await this.waitForDomContentLoaded();
  }

  public async sendMessageForSuggestion(
    message: string,
    language: "en" | "ru" = "en"
  ) {
    await this.waitUntilSelectorIsVisible(SelectorConstants.liveChatiframeName);
    const sendXPath =
      language === "en"
        ? LiveChatWidgetPageConstants.SendButtonXPathBlob
        : LiveChatWidgetPageConstants.SendButtonXPathRu;
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const textArea = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.TextareaXPath
    );
    await textArea.fill(message);
    await iFrame.waitForSelector(sendXPath);
    await Promise.all([
      iFrame.$eval(LiveChatWidgetPageConstants.SendButtonXPathBlob, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
  }

  public async sendMessageRequiredTimes(count) {
    for (let i = 0; i < count; i++) {
      await this.sendMessage(LiveChatConstants.MessageToAgent);
    }
  }

  public async sendMessageWithAttachment(
    message: string,
    attachments: string | Array<string> = [
      "FileResources//LiveChatAttachment.txt",
    ],
    language: "en" | "ru" = "en"
  ) {
    await this.waitUntilSelectorIsVisible(SelectorConstants.liveChatiframeName);
    const sendXPath =
      language === "en"
        ? LiveChatWidgetPageConstants.SendButtonXPathBlob
        : LiveChatWidgetPageConstants.SendButtonXPathRu;
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const textArea = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.TextareaXPath
    );
    await textArea.fill(message);

    await iFrame.setInputFiles(
      LiveChatWidgetPageConstants.UploadFile,
      attachments
    );

    await iFrame.waitForSelector(sendXPath);
    await Promise.all([
      iFrame.$eval(LiveChatWidgetPageConstants.SendButtonXPathBlob, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
  }

  public async sendSDKMessageWithAttachment(message: string, attachments: string | Array<string> = ["FileResources//LiveChatAttachment.txt"]) {
    await this.waitUntilSelectorIsVisible(SelectorConstants.ChatSDKTextArea);
    await this.waitForDomContentLoaded();
    await this.fillInputData(SelectorConstants.ChatSDKTextArea, message);
    await this.Page.setInputFiles(
      LiveChatWidgetPageConstants.UploadSDKFile,
      attachments
    );
    await this.waitUntilSelectorIsVisible(SelectorConstants.ChatSDKSendButton);
    await this.Page.click(SelectorConstants.ChatSDKSendButton);
    await this.waitForDomContentLoaded();
  }

  public async getUserMessages(): Promise<Array<string | null>> {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const messages = await iFrame.$$(
      LiveChatWidgetPageConstants.userMessageListItem
    );
    const messageList = [];
    for (let i = 0; i < messages.length; i++) {
      const userMessage = await messages[i].$(
        LiveChatWidgetPageConstants.sentMessageSelector
      );
      if (userMessage) {
        const messageText = await userMessage
          .$eval(".markdown", (el) => el.textContent)
          .catch(() => null);
        messageList.push(messageText);
      }
    }
    return messageList;
  }

  public async VerifyAttachmentButton() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iframe = await liveChatiframeName.contentFrame();
    expect(
      await this.waitUntilSelectorIsHidden(
        LiveChatWidgetPageConstants.UploadFile
      )
    ).toBeTruthy();
  }

  public async ValidateEndBotMessage() {
    await this.Page.waitForTimeout(Constants.MaxTimeout);
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    await this.Page.waitForTimeout(Constants.DefaultTimeout);

    const botEndChatMessage = await iFrame.waitForSelector(
      LiveChatConstants.BOTEndChatMessagexpath
    );
    const entityItemText = await botEndChatMessage.textContent();
    const botMessage = await LiveChatConstants.BOTEndChatMessage;
    expect(entityItemText.includes(botMessage)).toBeTruthy();
  }

  public async sendMessageWithEmptyFileAsAttachment(
    message: string,
    language: "en" | "ru" = "en"
  ) {
    const sendXPath =
      language === "en"
        ? LiveChatWidgetPageConstants.SendButtonXPathBlob
        : LiveChatWidgetPageConstants.SendButtonXPathRu;
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const textArea = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.TextareaXPath
    );
    await textArea.fill(message);
    await iFrame.waitForSelector(sendXPath);
    await iFrame.$eval(LiveChatWidgetPageConstants.SendButtonXPathBlob, (el) =>
      (el as HTMLElement).click()
    );

    await iFrame.setInputFiles(
      LiveChatWidgetPageConstants.UploadFile,
      LiveChatWidgetPageConstants.EmptyFileAttachment
    );
  }

  public async verifyFileDownloadAtCustomerEnd() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iframe = await liveChatiframeName.contentFrame();

    let ImageSelectorFlagValue = await iframe.waitForSelector(
      LiveChatWidgetPageConstants.CustomerScreenImageBoxSelector
    );
    if (ImageSelectorFlagValue) {
      const [download] = await Promise.all([
        this.Page.waitForEvent("download"),
        iframe.$eval(
          LiveChatWidgetPageConstants.CustomerScreenImageBoxSelector,
          (el) => (el as HTMLElement).click()
        ),
      ]);
      const path = await download.path();
      return path != null && path != undefined && path != "";
    }
    return false;
  }

  public async verifyCustomerTranscriptFileContainsText(expectedText: string) {
    const iframe = await this.getChatIframe();
    let downloadButton = await iframe.waitForSelector(
      LiveChatWidgetPageConstants.DownloadTranscriptButton
    );
    expect(downloadButton !== null).toBeTruthy();

    const [download] = await Promise.all([
      this.Page.waitForEvent("download"),
      iframe.$eval(LiveChatWidgetPageConstants.DownloadTranscriptButton, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
    const path = await download.path();
    expect(path != null && path !== undefined && path !== "").toBeTruthy();

    const stream = await download.createReadStream();
    let fileContant = "";
    if (stream !== null) {
      fileContant = await this.streamToString(stream);
    }

    expect(fileContant).toContain(expectedText);
  }

  public async getCustomerScreenImageBoxSelector() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iframe = await liveChatiframeName.contentFrame();

    await this.waitUntilFrameIsVisible(
      LiveChatWidgetPageConstants.CustomerScreenImageBoxSelector,
      AgentChatConstants.Two,
      iframe,
      AgentChatConstants.ConversationWrapUpTimeout
    );

    let ImageSelectorFlagValue = await iframe.waitForSelector(
      LiveChatWidgetPageConstants.AgentScreenImageBoxSelector
    );

    return ImageSelectorFlagValue;
  }

  public async closeChat() {
    try {
      const liveChatiframeName = await this.Page.$(
        SelectorConstants.liveChatiframeName
      );
      const iFrame = await liveChatiframeName.contentFrame();
      await iFrame.waitForSelector(LiveChatWidgetPageConstants.closeChat);
      await iFrame.$eval(LiveChatWidgetPageConstants.closeChat, (el) =>
        (el as HTMLElement).click()
      );
      await iFrame.waitForSelector(
        LiveChatWidgetPageConstants.confirmaCloseChat
      );
      await iFrame.$eval(LiveChatWidgetPageConstants.confirmaCloseChat, (el) =>
        (el as HTMLElement).click()
      );
    } catch (error) {
      console.log(
        `Method closeChat throwing exception with message: ${error.message}`
      );
    }
  }

  public async getCustomerScreenImagesBoxCountSelector() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iframe = await liveChatiframeName.contentFrame();
    await iframe.waitForSelector(
      LiveChatWidgetPageConstants.CustomerScreenImageBoxSelector
    );
    const ImageSelectorFlagValue = await iframe.$$(
      LiveChatWidgetPageConstants.CustomerScreenImagesBoxSelector
    );

    return ImageSelectorFlagValue.length;
  }

  public async closeChatOpenSurveyLink() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    await iFrame.waitForSelector(LiveChatWidgetPageConstants.closeChat);
    await iFrame.$eval(LiveChatWidgetPageConstants.closeChat, (el) =>
      (el as HTMLElement).click()
    );
    await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.postChatSurveyFeedbackSurveyLink
    );
    await iFrame.$eval(
      LiveChatWidgetPageConstants.postChatSurveyFeedbackSurveyLink,
      (el) => (el as HTMLElement).click()
    );
  }

  public async validateEmbedModeSurvey() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    await iFrame.waitForSelector(LiveChatWidgetPageConstants.embedModeSurveyId);
  }

  public async closePopoutChat(popOutChatPage: Page) {
    await Promise.all([
      popOutChatPage.on("dialog", async (dialog) => {
        await dialog.accept();
      }),
      popOutChatPage.close(),
    ]);
  }

  public async validateSurvey(popOutChatPage: Page) {
    const liveChatiframeName = await popOutChatPage.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    await iFrame.waitForSelector(LiveChatWidgetPageConstants.embedModeSurveyId);
  }
  public async validateSystemMessage() {
    let systemmessage;
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    try {
      systemmessage = await iFrame.waitForSelector(
        LiveChatWidgetPageConstants.Messagetext
      );
    } catch {
      systemmessage = await iFrame.waitForSelector(
        LiveChatWidgetPageConstants.Messagetexts
      );
    }
    const entityItemText = await systemmessage.textContent();
    const text = /joined the conversation/gi;
    if (entityItemText.search(text) != -1) {
      return true;
    }
  }

  public async validateAgentMessageInChatWidget(message: string) {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();

    let agentMessage;
    let agentMessageContent;
    try {
      agentMessage = await iFrame.waitForSelector(
        LiveChatWidgetPageConstants.MessageRecievedFromAgent.replace(
          "{0}",
          message
        )
      );
      agentMessageContent = await agentMessage.textContent();
    } catch {
      agentMessageContent = "";
    }

    return agentMessageContent === message;
  }

  public async validateSystemMessages(
    messageXpath: string,
    text: string,
    isAutoClose: boolean = false
  ) {
    let systemmessage;
    if (isAutoClose) {
      //once agent closes conversation, it takes 1 minute to autoclose the conversation with customer, since widget has to wait 1 minute
      await this.Page.waitForTimeout(TimeoutConstants.Minute);
    }
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    await this.waitUntilFrameIsVisible(
      messageXpath,
      AgentChatConstants.Five,
      iFrame,
      AgentChatConstants.AgentPopUpWaitingTimeout
    );
    try {
      systemmessage = await iFrame.waitForSelector(messageXpath);
    } catch {
      systemmessage = await iFrame.waitForSelector(
        LiveChatMessageConstants.AutoCloseMessageXpaths
      );
    }
    const entityItemText = await systemmessage.textContent();

    if (entityItemText.search(text) != -1) {
      return true;
    }
  }

  public async validatePopoutSystemMessages(
    liveChatContext: BrowserContext,
    messageXpath: string,
    text: string
  ) {
    let validatesystemmessage;
    let allPages = liveChatContext.pages();
    let popoutPageIndex = liveChatContext.pages().length - 1;
    await this.waitForDomContentLoaded();

    try {
      validatesystemmessage = await allPages[popoutPageIndex].waitForSelector(
        messageXpath
      );
    } catch {
      validatesystemmessage = await allPages[popoutPageIndex].waitForSelector(
        messageXpath
      );
    }

    const entityItemText = await validatesystemmessage.textContent();

    if (entityItemText.search(text) != -1) {
      return true;
    }
  }

  public async open(lcwUrl: string) {
    await this._page.goto(lcwUrl);
    await this._page.waitForTimeout(Constants.MaxTimeout);
  }

  public async validateSystemEndedMessage() {
    let systemmessage;
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    try {
      systemmessage = await iFrame.waitForSelector(
        LiveChatWidgetPageConstants.MessagetextEnded
      );
    } catch {
      systemmessage = await iFrame.waitForSelector(
        LiveChatWidgetPageConstants.MessagetextEnd
      );
    }
    const entityItemText = await systemmessage.textContent();
    var text = /ended the conversation/gi;
    if (entityItemText.search(text) != -1) {
      return true;
    }
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async validateEmailMessage() {
    const iframe = await this.getChatIframe();

    await iframe.waitForSelector(SelectorConstants.emailButton);
    await iframe.$eval(SelectorConstants.emailButton, (el) =>
      (el as HTMLElement).click()
    );

    let emailTextField = await iframe.waitForSelector(
      SelectorConstants.emailTextField
    );
    expect(emailTextField !== null).toBeTruthy();

    let emailSendButton = await iframe.waitForSelector(
      SelectorConstants.emailSendButton
    );
    expect(emailSendButton !== null).toBeTruthy();

    let emailCancelButton = await iframe.waitForSelector(
      SelectorConstants.emailCancelButton
    );
    expect(emailCancelButton !== null).toBeTruthy();

    await iframe.waitForSelector(SelectorConstants.emailCancelButton);
    await iframe.$eval(SelectorConstants.emailCancelButton, (el) =>
      (el as HTMLElement).click()
    );
  }

  public async validateGreetingMessage(message: string) {
    const expectedGreetingMessage = message;
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const greetingMessage = await iFrame.waitForSelector(
      AgentChatConstants.BotwaitGreetMsg
    );
    const actualGreetingMessage = await greetingMessage.innerText();
    return actualGreetingMessage === expectedGreetingMessage;
  }

  public async validatePVAGreetingMessage(message: string) {
    const expectedGreetingMessage = message;
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const greetingMessage = await iFrame.waitForSelector(
      AgentChatConstants.BotwaitGreetMsgs
    );
    const actualGreetingMessage = await greetingMessage.innerText();
    return actualGreetingMessage === expectedGreetingMessage;
  }

  public async validateLoadMessage(message: string) {
    const expectedGreetingMessage = message;
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const greetingMessage = await iFrame.waitForSelector(
      AgentChatConstants.BotMsg
    );
    const actualGreetingMessage = await greetingMessage.innerText();
    return actualGreetingMessage === expectedGreetingMessage;
  }

  public async validateAdaptiveCardResponse(triggerPhrase: string) {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    //Timeout is required as bot taking time to load.
    switch (triggerPhrase) {
      case LiveChatConstants.AdaptiveCardAmsterdam: {
        return await iFrame.waitForSelector(
          AgentChatConstants.AdaptiveMsgAmsterdam
        );
      }
      case LiveChatConstants.AdaptiveCardOpenUrlAction: {
        return await iFrame.waitForSelector(
          AgentChatConstants.AdaptiveMsgOpenUrlAction
        );
      }
      case LiveChatConstants.AdaptiveCardVideo:
      case LiveChatConstants.AdaptiveCardAudio: {
        return await iFrame.waitForSelector(
          AgentChatConstants.AdaptiveMsgMedia
        );
      }
      case LiveChatConstants.AdaptiveCardSubmitAction: {
        return await iFrame.waitForSelector(
          AgentChatConstants.AdaptiveMsgInputForm
        );
      }
      case LiveChatConstants.BYOBSuggestedAction: {
        return await iFrame.waitForSelector(
          AgentChatConstants.BotMsgSuggestedAction
        );
      }
      case LiveChatConstants.AdaptiveCardToggleAction: {
        return await iFrame.waitForSelector(
          AgentChatConstants.AdaptiveMsgToggleAction
        );
      }
      case LiveChatConstants.AdaptiveCard:
      case LiveChatConstants.AdaptiveCardItinerary: {
        return await iFrame.waitForSelector(
          AgentChatConstants.AdaptiveMsgItinerary
        );
      }
      case LiveChatConstants.AdaptiveCardInputForm: {
        return await iFrame.waitForSelector(
          AgentChatConstants.AdaptiveMsgInputForm
        );
      }
      case LiveChatConstants.AdaptiveCardInput: {
        return await iFrame.waitForSelector(
          AgentChatConstants.AdaptiveMsgInput
        );
      }
      case LiveChatConstants.AdaptiveCardFlightUpdate: {
        return await iFrame.waitForSelector(
          AgentChatConstants.AdaptiveMsgFlightUpdate
        );
      }
      case LiveChatConstants.AdaptiveCardShowAction: {
        return await iFrame.waitForSelector(
          AgentChatConstants.AdaptiveMsgShowAction
        );
      }
      case LiveChatConstants.AdaptiveCardUpdateMessage: {
        return await iFrame.waitForSelector(
          AgentChatConstants.AdaptiveMsgUpdateMessage
        );
      }
      case LiveChatConstants.RichCardHero: {
        return await iFrame.waitForSelector(
          AgentChatConstants.RichCardMsgHeroCard
        );
      }
      case LiveChatConstants.RichCardHeroIMBack: {
        return await iFrame.waitForSelector(
          AgentChatConstants.RichCardMsgHeroCardIMBack
        );
      }
      case LiveChatConstants.AdaptiveCardImageGallery:
      case LiveChatConstants.AdaptiveCardWithText: {
        return await iFrame.waitForSelector(
          AgentChatConstants.AdaptiveMsgImageGallery
        );
      }
      case LiveChatConstants.AdaptiveCardBase64Images: {
        return await iFrame.waitForSelector(
          AgentChatConstants.AdaptiveMsgBase64Images
        );
      }
      case LiveChatConstants.AdaptiveCardCalendarReminder: {
        return await iFrame.waitForSelector(
          AgentChatConstants.AdaptiveMsgCalendarReminder
        );
      }
      case LiveChatConstants.FoodOrder: {
        return await iFrame.waitForSelector(
          LiveChatWidgetPageConstants.FoodSelection
        );
      }
      case LiveChatConstants.RichCardAudio: {
        return await iFrame.waitForSelector(
          AgentChatConstants.RichCardMsgAudio
        );
      }
      case LiveChatConstants.RichCardReceipt: {
        return await iFrame.waitForSelector(
          AgentChatConstants.RichCardMsgReceiptCard
        );
      }
      case LiveChatConstants.AdaptiveCardSportingEvent: {
        return await iFrame.waitForSelector(
          AgentChatConstants.AdaptiveMsgSportingEvent
        );
      }
      case LiveChatConstants.AdaptiveCardStockUpdate: {
        return await iFrame.waitForSelector(
          AgentChatConstants.AdaptiveMsgStockupdate
        );
      }
      case LiveChatConstants.RichCardThumbnail: {
        return await iFrame.waitForSelector(
          AgentChatConstants.RichCardMsgThumbnailCard
        );
      }
      default: throw new Error(`'${triggerPhrase}' does not match an expected trigger phrase`);
    }
  }

  public async validateAdaptiveCardMessage(message: string) {
    const expectedAdaptiveCardMessage = message;
    const adaptiveCardResponse = await this.validateAdaptiveCardResponse(message);
    const actualAdaptiveCardMessage = await adaptiveCardResponse.innerText();
    if (message == LiveChatConstants.AdaptiveCardInput) {
      const acctualmsg = LiveChatConstants.InputValidate;
      return actualAdaptiveCardMessage === acctualmsg;
    }
    else if (message == LiveChatConstants.RichCardHero) {
      const acctualmsg = LiveChatConstants.HeroCardValidate;
      return actualAdaptiveCardMessage === acctualmsg;
    }
    else if (message == LiveChatConstants.RichCardReceipt) {
      const acctualmsg = LiveChatConstants.RichCardReceiptValidate;
      return actualAdaptiveCardMessage === acctualmsg;
    }
    else if (message == LiveChatConstants.RichCardThumbnail) {
      const acctualmsg = LiveChatConstants.RichCardThumbnailValidate;
      return actualAdaptiveCardMessage === acctualmsg;
    }
    else if (message == LiveChatConstants.RichCardAudio) {
      const acctualmsg = LiveChatConstants.RichCardAudioValidate;
      return actualAdaptiveCardMessage === acctualmsg;
    }
    else if (message == LiveChatConstants.AdaptiveCardInputForm) {
      const acctualmsg = LiveChatConstants.InputFormValidate;
      return actualAdaptiveCardMessage === acctualmsg;
    }
    else if (message == LiveChatConstants.AdaptiveCardSubmitAction) {
      const acctualmsg = LiveChatConstants.InputFormValidate;
      return actualAdaptiveCardMessage === acctualmsg;
    }
    else {
      return actualAdaptiveCardMessage === expectedAdaptiveCardMessage;
    }
  }

  public async validateSystemEmptyFileErrorMessage() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const systemMessage = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.EmptyFileAttachmentErrorMessage
    );
    const entityItemText = await systemMessage.textContent();

    if (
      entityItemText.search(
        LiveChatWidgetPageConstants.ExpectedEmptyFileAttachmentErrorMessage
      ) != -1
    ) {
      return true;
    }
  }

  //BYOB Code changes
  public async loadBotMessages(message: string) {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const systemmessage = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.BotMessageLoad
    );
    const entityItemText = await systemmessage.textContent();
    var text = /available commands/gi;

    if (entityItemText.search(text) == -1) {
      await this.loadMessages(message);
    }
    await this._page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async sendMessageforBYOB(
    message: string,
    language: "en" | "ru" = "en"
  ) {
    const sendXPath =
      language === "en"
        ? LiveChatWidgetPageConstants.SendButtonXPathBlob
        : LiveChatWidgetPageConstants.SendButtonXPathRu;
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const textArea = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.TextareaXPath
    );
    await textArea.fill(message);
    await iFrame.waitForSelector(sendXPath);
    await Promise.all([
      iFrame.$eval(LiveChatWidgetPageConstants.SendButtonXPathBlob, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
    await this._page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async fillAdaptiveData() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const firstName = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.NameforInputform
    );
    await firstName.fill(this.newAdaptiveCardData.FirstName);
    const EmailName = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.EmailForInputForm
    );
    await EmailName.fill(this.newAdaptiveCardData.Email);
    const PhoneName = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.PhoneForInputForm
    );
    await PhoneName.fill(this.newAdaptiveCardData.Phone);
    await Promise.all([
      iFrame.$eval(LiveChatWidgetPageConstants.AdaptiveSubmit, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
    await this._page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async fillHeroCardData() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    await Promise.all([
      iFrame.$eval(LiveChatWidgetPageConstants.RedButtonClick, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
    await this._page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async fillToggleAcionData() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    await Promise.all([
      iFrame.$eval(LiveChatWidgetPageConstants.ToggleActionClick, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
    await this._page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async ValidatePageCount(liveChatContext: BrowserContext) {
    let count = await liveChatContext.pages().length;
    if (count >= 1) {
      return true;
    }
  }
  public async VerifySignIN() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    await iFrame.waitForSelector(LiveChatWidgetPageConstants.SignInLink);
    await iFrame.$eval(LiveChatWidgetPageConstants.SignInLink, (el) =>
      (el as HTMLElement).click()
    );
  }

  public async loadAttachmentsMessages(message: string) {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const systemmessage = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.BotAttachmentsMessageLoad
    );
    const entityItemText = await systemmessage.textContent();
    var text = /Choose the Type of Attachments/gi;
    if (entityItemText.search(text) == -1) {
      await this.loadMessages(message);
    }
    await this._page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async loadMessages(message: string) {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const textArea = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.TextareaXPath
    );
    await textArea.fill(message);
    await Promise.all([
      iFrame.$eval(LiveChatWidgetPageConstants.SendButtonXPathBlob, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
    await this._page.waitForTimeout(LiveChatWidgetPageConstants.BotTimeout);
  }

  public async validateSuggestedActions() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const systemmessage = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.SuggestedActionsMessage
    );
    const entityItemText = await systemmessage.textContent();
    var text = /You have selected/gi;
    var textsecond = /You said/gi;
    if (
      entityItemText.search(text) != -1 ||
      entityItemText.search(textsecond) != -1
    ) {
      return true;
    }
  }

  public async selectAction() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.SelectSuggestedAction
    );
    await Promise.all([
      iFrame.$eval(LiveChatWidgetPageConstants.SelectSuggestedAction, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
  }

  public async fillSurveyQuestion(message: string) {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const surveyrecord = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.SurveyQuestion
    );
    await surveyrecord.fill(message);
    await Promise.all([
      iFrame.$eval(LiveChatWidgetPageConstants.SurveyClick, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
  }

  public async fillMultiLineSurveyQuestion(message: string) {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const surveyrecord = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.SurveyMultilineQuestion
    );
    await surveyrecord.fill(message);
    await Promise.all([
      iFrame.$eval(LiveChatWidgetPageConstants.SurveyClick, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
  }

  public async fillPopoutSurveyQuestion(liveChatContext: BrowserContext) {
    let allPages = liveChatContext.pages();
    let popoutPageIndex = liveChatContext.pages().length - 1;
    const surveyrecord = await allPages[popoutPageIndex].waitForSelector(
      LiveChatWidgetPageConstants.SurveyQuestion
    );
    await surveyrecord.fill("Great");

    await allPages[popoutPageIndex].waitForSelector(
      LiveChatWidgetPageConstants.SurveyClick
    );
    await allPages[popoutPageIndex].$eval(
      LiveChatWidgetPageConstants.SurveyClick,
      (el) => (el as HTMLElement).click()
    );
  }

  public async validateSystemEndedMessageForPopout(
    liveChatContext: BrowserContext
  ) {
    let allPages = liveChatContext.pages();
    let popoutPageIndex = liveChatContext.pages().length - 1;
    let systemmessage;
    try {
      systemmessage = await allPages[popoutPageIndex].waitForSelector(
        LiveChatWidgetPageConstants.MessagetextEnded
      );
    } catch {
      systemmessage = await allPages[popoutPageIndex].waitForSelector(
        LiveChatWidgetPageConstants.MessagetextEnd
      );
    }
    const entityItemText = await systemmessage.textContent();
    var text = /ended the conversation/gi;
    if (entityItemText.search(text) != -1) {
      return true;
    }
  }

  public static async initLcw(page: Page, lcwUrl: string) {
    let liveChat = new LiveChatPage(page);
    await liveChat.open(lcwUrl);
    await liveChat.initiateChat();
    return liveChat;
  }

  public static async goToLCWWithoutInit(page: Page, lcwUrl: string) {
    let liveChat = new LiveChatPage(page);
    await liveChat.open(lcwUrl);
    return liveChat;
  }

  public async selectBotOption(Option: string) {
    await this.waitUntilSelectorIsVisible(Option);
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    await iFrame.$(Option);
    await Promise.all([
      iFrame.$eval(Option, (el) => (el as HTMLElement).click()),
    ]);
  }

  public async validateLiveChatHeaderTab() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.LiveChatHeaderTitle
    );
    const result = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.LiveChatHeaderIcon
    );
    return result;
  }
  public async validateText() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    return liveChatiframeName;
  }
  public async validateChatTitle() {
    const liveChatTitle = await this.Page.$(SelectorConstants.Letschat);
    const Title = await liveChatTitle.innerText();
    return Title;
  }

  public async LeaveSitePopup() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    await Promise.all([
      iFrame.$eval(LiveChatWidgetPageConstants.closeChat, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
  }

  public async validateClosePopup() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const PopupMessage = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.ClosePopMsg
    );
    const title = await PopupMessage.textContent();
    return title;
  }

  public async fillSurveyQuestions() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const chatiFrame = await liveChatiframeName.contentFrame();
    const question1 = await chatiFrame.waitForSelector(
      LiveChatConstants.Question1
    );
    await question1.fill(SurveyQuestion.Question1Text);
    const question2 = await chatiFrame.waitForSelector(
      LiveChatConstants.Question2
    );
    await question2.fill(SurveyQuestion.Question2Text);
    const question3 = await chatiFrame.waitForSelector(
      LiveChatConstants.Question3
    );
    await question3.fill(SurveyQuestion.Question3Text);
    await Promise.all([
      chatiFrame.$eval(LiveChatConstants.Submit, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
  }

  public async isAudioPlayable(timeout: number = 10000): Promise<boolean> {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    return await super.isAudioPlayable(timeout, iFrame);
  }

  public async isVideoPlayable(timeout: number = 10000): Promise<boolean> {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    return await super.isVideoPlayable(timeout, iFrame);
  }

  public async validateLiveChatAttachment() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.LiveChatHeaderTitle
    );
    const result = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.LiveChatAttachments
    );
    const entityItemText = await result.textContent();
    var text = /LiveChatAttachment/gi;
    if (entityItemText.search(text) !== -1) {
      return true;
    }
  }

  public async validateLiveChatMessage() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const result = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.PostChatSurveyLink
    );
    const entityItemText = await result.textContent();
    if (entityItemText.search("How was your experience") !== -1) {
      return true;
    }
  }

  public async validateInlineSearch() {
    const ChatWindowFrame = await this.Page.$(
      SelectorConstants.ChatWindowMainIFrame
    );
    const iFrame1 = await ChatWindowFrame.contentFrame();
    const iFrame2 = await iFrame1.$(SelectorConstants.ChatWindowSubIFrame);
    const iFrame3 = await iFrame2.contentFrame();
    const iFramw4 = await iFrame3.waitForSelector(
      SelectorConstants.QuickReplies
    );
    await iFramw4.click();
    await (
      await this.Page.waitForSelector(SelectorConstants.QuickRepliesSearch)
    ).fill("sorry");
    const title = await this.Page.waitForSelector(
      SelectorConstants.QuickRepliesText
    );
    return title;
  }

  public async validateInlineSearchForLiveChat() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const textArea = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.InlineSearchMessageForLCW
    );
    const entityItemText = await textArea.textContent();
    if (entityItemText.search(LiveChatWidgetPageConstants.InlineText) != -1) {
      return true;
    }
  }

  public async validateConversationControlForOpenWorkItems() {
    const ChatWindowFrame = await this.Page.$(
      SelectorConstants.ChatWindowMainIFrame
    );
    const iFrame1 = await ChatWindowFrame.contentFrame();
    const iFrame2 = await iFrame1.$(SelectorConstants.ChatWindowSubIFrame);
    const iFrame3 = await iFrame2.contentFrame();
    const iFramw4 = await iFrame3.waitForSelector(
      SelectorConstants.QuickReplies
    );
    return iFramw4;
  }

  public async sendmp4Attachment(
    message: string,
    language: "en" | "ru" = "en"
  ) {
    const sendXPath =
      language === "en"
        ? LiveChatWidgetPageConstants.SendButtonXPathBlob
        : LiveChatWidgetPageConstants.SendButtonXPathRu;
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const textArea = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.TextareaXPath
    );
    await textArea.fill(message);

    await iFrame.setInputFiles(
      LiveChatWidgetPageConstants.UploadFile,
      "FileResources//videomp4.mp4"
    );

    await iFrame.waitForSelector(sendXPath);
    await Promise.all([
      iFrame.$eval(LiveChatWidgetPageConstants.SendButtonXPathBlob, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
  }

  public async navigateToQuickRepliesTabView() {
    await this.Page.click(LiveChatWidgetPageConstants.QuickRepliesMenuItem);
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async addQuickReplies(title: string = QuickReplies.QuickRepliesTitle) {
    await this.Page.waitForSelector(LiveChatWidgetPageConstants.AddQuickReply);
    await this.Page.click(LiveChatWidgetPageConstants.AddQuickReply);
    await this.fillLookupField(
      LiveChatWidgetPageConstants.QuickReplyName,
      LiveChatWidgetPageConstants.QuickReplySearchButton,
      LiveChatWidgetPageConstants.QuickReplyLookupValue,
      title
    );

    await this.Page.click(LiveChatWidgetPageConstants.AddButton);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
  }

  public async fillQuickReplies(
    title: string,
    message: string,
    tagName: string = QuickReplies.QuickTagName
  ) {
    await this.fillInputData(LiveChatWidgetPageConstants.Title, title);
    await this.Page.fill(LiveChatWidgetPageConstants.Message, message);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
    await this.addTags(tagName);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.Page.click(SelectorConstants.FormSaveAndCloseButton);
    await this.waitForDomContentLoaded();
  }

  public async addTags(tagName: string) {
    await this.fillInputData(
      QuickRepliesCustomConstants.SearchTagsName,
      tagName
    );
    await this.Page.click(LiveChatWidgetPageConstants.SelectTagRecord);
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
  }

  public async validateDuplicateMessage() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const systemmessage = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.ValidateTextForDuplicate
    );
    const entityItemText = await systemmessage.textContent();
    if (
      entityItemText.search(
        LiveChatWidgetPageConstants.DuplicateMessageVerificationText
      ) != -1
    ) {
      return true;
    }
  }

  public async validateChatText(pageCount) {
    return pageCount.length > 1;
  }

  public async validateProactiveChatTitle(
    expectedTitle: string,
    proactiveChatWaitTime: number = LiveChatWidgetPageConstants.ProactiveChatWaitTime
  ) {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const title = await iFrame.waitForSelector(
      SelectorConstants.ProactiveChatTitleSelector,
      { timeout: proactiveChatWaitTime + 2000 }
    );
    const currentTitle = await title.innerText();
    return currentTitle === expectedTitle;
  }

  public getProactiveSnippet(
    message: string = "",
    timeout: number = LiveChatWidgetPageConstants.ProactiveChatWaitTime
  ): string {
    return `<script id="Proactivechattrigger">	     
          window.addEventListener("lcw:ready", function handleLivechatReadyEvent(){
		  var timeToWaitBeforeOfferingProactiveChatInMilliseconds = ${timeout};		 
          Microsoft.Omnichannel.LiveChatWidget.SDK.setContextProvider(function contextProvider(){
            return {
                'Proactive Chat':{'value':'True','isDisplayable':true},
                'Time On Page':{'value': timeToWaitBeforeOfferingProactiveChatInMilliseconds ,'isDisplayable':true},
                'Page URL':{'value': window.location.href,'isDisplayable':true},
            };
        });
        setTimeout(function(){
            Microsoft.Omnichannel.LiveChatWidget.SDK.startProactiveChat({message: "${message}"}, false);
        },timeToWaitBeforeOfferingProactiveChatInMilliseconds);
          });
        </script>`;
  }

  public async sendPopoutMessage(liveChatContext: BrowserContext, message) {
    let allPages = liveChatContext.pages();
    let popoutPageIndex = liveChatContext.pages().length - 1;
    const textArea = await allPages[popoutPageIndex].waitForSelector(
      LiveChatWidgetPageConstants.TextareaXPath
    );
    await textArea.fill(message);
    const sendPopoutMsg = await allPages[popoutPageIndex].waitForSelector(
      LiveChatWidgetPageConstants.SendButtonXPathBlob
    );
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(
      LiveChatWidgetPageConstants.SendButtonXPathBlob
    );
    await this.waitForDomContentLoaded();
    await sendPopoutMsg.click();
  }

  public async AutoCloseAfterInActivity() {
    let autoCloseAfterInActivity = await this.Page.waitForSelector(
      LiveChatWidgetPageConstants.AutoCloseAfterInACtivity
    );
    return await autoCloseAfterInActivity.getAttribute("title");
  }

  public async kbArticleMessageValidate() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const systemmessage = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.KBArticleMessage
    );
    const entityItemText = await systemmessage.textContent();
    var text = /microsoft/gi;
    if (entityItemText.search(text) != -1) {
      return true;
    }
  }

  private async streamToString(stream) {
    stream.setEncoding("utf8");
    let data = "";
    for await (const chunk of stream) {
      data += chunk;
    }
    return data;
  }

  public async validateInvalidReconnectUrlAfterChatEnd() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const chatiFrame = await liveChatiframeName.contentFrame();
    chatiFrame.waitForSelector(SelectorConstants.Letschat);
    await chatiFrame.$eval(SelectorConstants.Letschat, (el) =>
      (el as HTMLElement).click()
    );
    return await this.waitUntilSelectorIsVisible(
      SelectorConstants.RedirectionPageTitle
    );
  }

  public async QuickRepliesTag(
    title: string,
    message: string,
    tagName: string = QuickReplies.QuickTagName
  ) {
    await this.fillInputData(LiveChatWidgetPageConstants.Title, title);
    await this.waitForDomContentLoaded();
    await this.Page.fill(LiveChatWidgetPageConstants.Message, message);
    await this.waitForDomContentLoaded();
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(
      LiveChatWidgetPageConstants.SearchTagsName
    );
    await this.Page.fill(LiveChatWidgetPageConstants.SearchTagsName, tagName);
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(QuickReplies.QuickReplyTag);
    await this.Page.click(QuickReplies.QuickReplyTag);
    await this.waitForDomContentLoaded();
  }

  public async validatePreventTagMessage() {
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(QuickReplies.PreventTagMessage);
    const title = await this.Page.waitForSelector(
      QuickReplies.PreventTagMessage
    );
    const currentTitle = await title.innerText();
    return currentTitle;
  }

  public async loginAuthenticatedUser(
    isLetsChat: boolean = false,
    authUsername: string,
    authPwd: string
  ) {
    if (!isLetsChat) {
      await this.waitUntilChatWidgetIsVisible(
        Constants.Three,
        Constants.MaxTimeout
      );
      const liveChatiframeName = await this.Page.$(
        SelectorConstants.liveChatiframeName
      );
      const chatiFrame = await liveChatiframeName.contentFrame();
      await chatiFrame.waitForSelector(SelectorConstants.Letschat);
      await chatiFrame.$eval(SelectorConstants.Letschat, (el) =>
        (el as HTMLElement).click()
      );
    }

    const signselector = SelectorConstants.AuthSignin;

    try {
      if (signselector != null) {
        await this.Page.click(SelectorConstants.AuthSignin);
      }
      else {
        await this.Page.click(SelectorConstants.AuthSignInXpath);
      }
    }
    catch {
      await this.Page.click(SelectorConstants.AuthSignInXpath);
    }

    const timeout: number = Constants.OpenWsWaitTimeout;
    const user = await this.Page.waitForSelector(
      SelectorConstants.AuthUserName,
      { timeout }
    );
    await user.fill(authUsername);
    const password = await this.Page.waitForSelector(
      SelectorConstants.AuthPassword,
      { timeout }
    );
    await password.fill(authPwd);
    await this.waitUntilSelectorIsVisible(SelectorConstants.AuthLoginSubmit);
    const signIn = await this.Page.waitForSelector(
      SelectorConstants.AuthLoginSubmit
    );
    await signIn.click();
    await this.waitForDomContentLoaded();
  }

  public async continueConversation() {
    let continueConversationSelector = true;
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    try {
      const continueConversation = await iFrame.waitForSelector(
        SelectorConstants.ContinueConversation
      );
      await continueConversation.click();
    } catch {
      continueConversationSelector = false;
    }
    return continueConversationSelector;
  }

  public async validateSigninPage() {
    await this.waitForDomContentLoaded();
    const title = await this.Page.waitForSelector(QuickReplies.AuthSigninPage);
    const currentTitle = await title.innerText();
    return currentTitle;
  }

  public async updateInactivityvalue() {
    await this.fillInputData(
      LiveChatWidgetPageConstants.ReconnectTimeLimit,
      "5 minutes"
    );
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
  }

  public async waitforaudiorendered(timeout: number = 10000) {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    await iFrame.waitForSelector("audio", { timeout });
  }

  public async validatedownloadbutton() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const textArea = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.videoControl
    );
    (await textArea.getAttribute("controlslist")) === "nodownload";
  }

  public async getExistsChatSnippet(name: string): Promise<string> {
    await this.goToChatByName(name);
    return this.getWidgetSnippet();
  }
  public async pagerender() {
    this.Page.keyboard.press(Constants.PageRefresh);
    await this.waitforaudiorendered();
  }
  public async validatePreviewCard(type: string) {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const previewcardmp3 = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.PreviewCardforMp3.replace("{0}", type)
    );
    const isChecked =
      (await previewcardmp3.getAttribute("aria-hidden")) === "true";
    return isChecked;
  }

  public async startNewConversation() {
    let startNewConversationSelector = true;
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    try {
      const StartNewConversation = await iFrame.waitForSelector(
        SelectorConstants.StartNewConversation
      );
      await StartNewConversation.click();
      await this.waitUntilSelectorIsVisible(SelectorConstants.ChatClose);
    } catch {
      startNewConversationSelector = false;
    }
    return startNewConversationSelector;
  }

  public async validateContinueConversation() {
    let continueConversationSelector = true;
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    try {
      await iFrame.waitForSelector(SelectorConstants.ContinueConversation);
    } catch {
      continueConversationSelector = false;
    }
    return continueConversationSelector;
  }

  public async validatePopoutChatStartNewConversation(
    liveChatContext: BrowserContext
  ) {
    try {
      let allPages = liveChatContext.pages();
      let popoutPageIndex = liveChatContext.pages().length - 1;
      await allPages[popoutPageIndex].waitForSelector(
        SelectorConstants.StartNewConversation
      );
      await allPages[popoutPageIndex].$eval(
        SelectorConstants.StartNewConversation,
        (el) => (el as HTMLElement).click()
      );
    } catch { }
    return true;
  }

  public async validateContext() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const greetingMessage = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.MessageLocator
    );
    const actualGreetingMessage = await greetingMessage.innerText();
    return actualGreetingMessage;
  }

  public async closePopoutMessage(liveChatContext: BrowserContext) {
    let allPages = await liveChatContext.pages();
    let popoutPageIndex = (await liveChatContext.pages().length) - 1;
    await allPages[popoutPageIndex].close();
  }

  public async getSelfServiceScript() {
    return `<script>
                    window.addEventListener("lcw:ready", function handleLivechatReadyEvent(){
                        Microsoft.Omnichannel.LiveChatWidget.SDK.setContextProvider(function contextProvider(){
                            return {
                                'SelfService':{'value':'[{"msdyn_displaytitle":"Page View 1","msdyn_url":"http://www.google.com","msdyn_starttime":"2019-08-30T01:59:59Z","msdyn_endtime":"2019-09-30T02:00:00Z","msdyn_type":192350000}, {"msdyn_displaytitle":"search","msdyn_url":"http://www.google.com","msdyn_starttime":"2019-09-14T18:50:59Z","msdyn_endtime":"2019-09-30T07:00:00Z","msdyn_type":192350001}, {"msdyn_displaytitle":"KB Article","msdyn_url":"http://www.google.com","msdyn_starttime":"2019-08-30T17:59:59Z","msdyn_endtime":"2019-09-30T02:00:00Z","msdyn_type":192350002}, {"msdyn_displaytitle":"Custom Action","msdyn_url":"http://www.google.com","msdyn_starttime":"2019-09-14T15:50:59Z","msdyn_endtime":"2019-09-30T07:00:00Z","msdyn_type":192350100}]'},
                                'vaghsdva': {'value': 'safdga', 'isDisplayable':true}
                            };
                        });
                    });
                </script>`;
  }

  public async validateSystemMsg() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const systemMessage = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.MessageTextJoined
    );
    const entityItemText = await systemMessage.textContent();
    const text = /joined the conversation/gi;
    if (entityItemText.search(text) != -1) {
      return true;
    }
  }

  public async acceptVoiceCall() {
    await this.Page.waitForTimeout(Constants.MaxTimeout);
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const chatiFrame = await liveChatiframeName.contentFrame();
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(SelectorConstants.acceptCall);
    chatiFrame.waitForSelector(SelectorConstants.acceptCall, {
      timeout: TimeoutConstants.Minutes(2),
    });
    await Promise.all([
      chatiFrame.$eval(SelectorConstants.acceptCall, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
  }

  public async acceptVideoCall() {
    await this.Page.waitForTimeout(Constants.MaxTimeout);
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const chatiFrame = await liveChatiframeName.contentFrame();
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(SelectorConstants.AcceptVideoCall);
    chatiFrame.waitForSelector(SelectorConstants.AcceptVideoCall, {
      timeout: TimeoutConstants.Minutes(2),
    });
    await Promise.all([
      chatiFrame.$eval(SelectorConstants.AcceptVideoCall, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
  }

  public async verifyVideoEnableStatus(locator: string) {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const chatiFrame = await liveChatiframeName.contentFrame();
    await this.waitForDomContentLoaded();
    const state = chatiFrame.waitForSelector(locator, {
      timeout: TimeoutConstants.Minutes(2),
    });
    return state;
  }

  public async disableVideoCall() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const chatiFrame = await liveChatiframeName.contentFrame();
    await this.waitForDomContentLoaded();
    chatiFrame.waitForSelector(LiveChatWidgetPageConstants.VideoWidget, {
      timeout: TimeoutConstants.Minutes(2),
    });
    await Promise.all([
      chatiFrame.$eval(LiveChatWidgetPageConstants.VideoWidget, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
    await this.waitForDomContentLoaded();
  }

  public async CustomerDeclinedCall() {
    await this.Page.waitForTimeout(Constants.MaxTimeout);
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const chatiFrame = await liveChatiframeName.contentFrame();
    await this.waitForDomContentLoaded();
    await this.waitUntilSelectorIsVisible(SelectorConstants.DeclineCall);
    chatiFrame.waitForSelector(SelectorConstants.DeclineCall, {
      timeout: TimeoutConstants.Minutes(2),
    });
    await Promise.all([
      chatiFrame.$eval(SelectorConstants.DeclineCall, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
  }

  public async waitForBotMsg(botmessage: string) {
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    await this.waitUntilSelectorIsVisible(SelectorConstants.liveChatiframeName);
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const chatiFrame = await liveChatiframeName.contentFrame();
    await this.waitForDomContentLoaded();
    await chatiFrame.waitForSelector(botmessage);
  }

  public async waituntilBotMsg(
    botmessage: string,
    maxCount = 1,
    page: Page = null,
    timeout: number = Constants.DefaultTimeout
  ) {
    await this.waitUntilSelectorIsVisible(SelectorConstants.liveChatiframeName);
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const chatiFrame = await liveChatiframeName.contentFrame();
    await this.waitForDomContentLoaded();

    let dataCount = 0;
    while (dataCount < maxCount) {
      try {
        await this.Page.waitForTimeout(Constants.DefaultTimeout);
        await chatiFrame.waitForSelector(botmessage);
        return true;
      } catch {
        dataCount++;
      }
    }
    return false;
  }

  public async waitForBotReplyContaining(reply: string, quoteMark: string = "\"") {
    return this.waitForBotReplyText(`*[contains(text(), ${quoteMark}${reply}${quoteMark})]`);
  }

  public async waitForBotReplyEqualTo(reply: string, quoteMark: string = "\"") {
    return this.waitForBotReplyText(`*[text()=${quoteMark}${reply}${quoteMark}]`);
  }

  private async waitForBotReplyText(textXpath: string) {
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    const chatiFrame = await this.getChatIframe()
    await this.waitForDomContentLoaded();
    const botReplyXPath = `//*[@class="ms_lcw_webchat_received_message"]//*[contains(@class,"webchat__bubble__content")]//${textXpath}`;
    await chatiFrame.waitForSelector(botReplyXPath);
  }


  public async validatePVASuggestedActions(BotMessage: string) {
    await this.Page.waitForTimeout(Constants.DefaultTimeout);
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const systemmessage = await iFrame.waitForSelector(BotMessage);
    const entityItemText = await systemmessage.textContent();
    if (entityItemText != "") {
      return true;
    }
  }

  public async ValidateHorizontalActionLayOut() {
    try {
      const liveChatiframeName = await this.Page.$(
        SelectorConstants.liveChatiframeName
      );
      const iFrame = await liveChatiframeName.contentFrame();
      await this.waitForDomContentLoaded();
      await iFrame.waitForSelector(
        "//div[contains(@class,'webchat__suggested-action')]/parent::li",
        { timeout: Constants.MaxTimeout as any }
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  public async ValidateHorizontalActionLayOut1() {
    try {
      const liveChatiframeName = await this.Page.$(
        SelectorConstants.liveChatiframeName
      );
      const iFrame = await liveChatiframeName.contentFrame();
      await this.waitForDomContentLoaded();
      await iFrame.waitForSelector(
        SelectorConstants.liveChatHorizontalLayoutSelector,
        { timeout: Constants.MaxTimeout as any }
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  public async ValidateVerticleActionLayOut() {
    try {
      const liveChatiframeName = await this.Page.$(
        SelectorConstants.liveChatiframeName
      );
      const iFrame = await liveChatiframeName.contentFrame();
      await this.waitForDomContentLoaded();
      await iFrame.waitForSelector(
        "//div[contains(@class,'webchat__suggested-action')]/parent::div",
        { timeout: Constants.MaxTimeout as any }
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  public async validateContextVariable() {
    try {
      const liveChatiframeName = await this.Page.$(
        SelectorConstants.liveChatiframeName
      );
      const iFrame = await liveChatiframeName.contentFrame();
      const greetingMessage = await iFrame.waitForSelector(
        LiveChatWidgetPageConstants.ContextMessageLocator
      );
      const actualGreetingMessage = await greetingMessage.innerText();
      let strArray = actualGreetingMessage.split(":");
      var regex = /[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i;
      var match = regex.exec(strArray[1]);
      return match != null;
    } catch (e) {
      return false;
    }
  }

  public async VerifyGreetingMessageOccuringOnlyOnce() {
    try {
      const liveChatiframeName = await this.Page.$(
        SelectorConstants.liveChatiframeName
      );
      const iFrame = await liveChatiframeName.contentFrame();
      await iFrame.waitForSelector(
        LiveChatWidgetPageConstants.DuplicateGreetingMessage
      );
      return false;
    } catch (e) {
      return true;
    }
  }

  public async validateByobMessages(
    messageXpath: string,
    text: string,
    isAutoClose: boolean = false
  ) {
    let systemmessage;
    if (isAutoClose) {
      //once agent closes conversation, it takes 1 minute to autoclose the conversation with customer, since widget has to wait 1 minute
      await this.Page.waitForTimeout(TimeoutConstants.Minute);
    }
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    try {
      systemmessage = await iFrame.waitForSelector(messageXpath);
    } catch {
      systemmessage = await iFrame.waitForSelector(
        LiveChatMessageConstants.AutoCloseMessageXpaths
      );
    }
    const entityItemText = await systemmessage.textContent();

    if (entityItemText.search(text) != -1) {
      return true;
    }
  }

  public async chatWaitForSelector(selector: string, options?: { state?: "attached" | "detached" | "visible" | "hidden" }) {
    const iFrame = await this.getChatIframe();
    return await iFrame.waitForSelector(selector, options);
  }

  public async clickItem(selector: string) {
    const chatIframe = await this.getChatIframe();
    await chatIframe.waitForSelector(selector);
    return chatIframe.$eval(selector, (el) => (el as HTMLElement).click());
  }

  public newQuickReplyData = {
    Title: "ReconnectQuickReplyAuthAccount",
    Message: "In case you disconnect {ReconnectUrl{ReconnectID}}",
    TagName: "#authreconnect",
  };

  public async fillQuickData() {
    await this.fillInputData(
      CustomConstants.Title,
      this.newQuickReplyData.Title
    );
    await this.Page.fill(
      CustomConstants.Message,
      this.newQuickReplyData.Message
    );
    await this.Page.click(SelectorConstants.FormSaveButton);
    await this.waitForSaveComplete();
  }

  public async addTagsForQuickReplies() {
    await this.fillInputData(
      CustomConstants.SearchTagsName,
      this.newQuickReplyData.TagName
    );
    const selectTag = CustomConstants.ScrollContainerclick.replace(
      "{0}",
      this.newQuickReplyData.TagName
    );
    await this.Page.click(selectTag);
    await this.Page.click(CustomConstants.ClickTag);
  }

  public async getUniqueChat(
    senderPage,
    receiverPage,
    uniqueInitialMessage?: string
  ) {
    const sentMessage = uniqueInitialMessage
      ? uniqueInitialMessage
      : Util.newGuid();
    await senderPage.sendMessage(sentMessage);
    await receiverPage.acceptChat(sentMessage);
  }

  public async getUniquePopoutChat(
    context,
    senderPage,
    receiverPage,
    uniqueInitialMessage?: string
  ) {
    const sentMessage = uniqueInitialMessage
      ? uniqueInitialMessage
      : Util.newGuid();
    await senderPage.sendPopoutMessage(context, sentMessage);
    await receiverPage.acceptChat(sentMessage);
  }

  public async waitforLiveChatConnecionLoad() {
    try {
      await this.waitUntilSelectorIsVisible(
        SelectorConstants.liveChatiframeName,
        Constants.Five,
        null,
        Constants.MaxTimeout
      );
      const liveChatiframeName = await this.Page.$(
        SelectorConstants.liveChatiframeName
      );
      const chatiFrame = await liveChatiframeName.contentFrame();
      await this.waitForDomContentLoaded();
      await this.waitUntilFrameSelectorIsVisible(
        SelectorConstants.LiveChatConnectivityStatusSelector.replace(
          "{0}",
          SelectorConstants.LiveChatConnectedMessage
        ),
        chatiFrame,
        Constants.Ten,
        Constants.MaxTimeout
      );
    } catch {
      console.info("Live Chat connection not connected succesfully.");
    }
  }

  public async validateSysMessages(messageXpath: string, text: string) {
    try {
      const liveChatiframeName = await this.Page.$(
        SelectorConstants.liveChatiframeName
      );
      const iFrame = await liveChatiframeName.contentFrame();
      await this.waitUntilFrameIsVisible(
        messageXpath,
        AgentChatConstants.One,
        iFrame,
        AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
      );
      try {
        const systemmessage = await iFrame.waitForSelector(messageXpath);
        const entityItemText = await systemmessage.textContent();
        if (entityItemText.search(text) !== -1) {
          return true;
        }
      } catch {
        Error("Can't find the expected system message.");
      }
    } catch (error) {
      console.log(
        `Method validateSysMessages throwing exception with message: ${error.message}`
      );
    }
    return false;
  }

  public async verifyYouAreNextInLineMessage(customMessage: string = null) {
    //There is a default waiting time to load automated message once we click on Lets Chat
    await this._page.waitForTimeout(2000);
    const iframe = await this._page
      .waitForSelector(`//iframe[@id="${HTMLConstants.IframeLCWId}"]`)
      .catch((error) => {
        throw new Error(
          `Can't verify that Live Chat Widget exsists on the page. Inner exception: ${error.message}`
        );
      });
    const iframeContent = await iframe.contentFrame();
    if (customMessage === null) {
      const queuePositionMessageElement = await iframeContent
        .waitForSelector(
          LiveChatWidgetPageConstants.YouAreNextInLineElemenXPath
        )
        .catch((error) => {
          throw new Error(
            `Can't verify that chat widget has system message: "You're next in line ! Inner exception: ${error.message}"`
          );
        });
      expect(queuePositionMessageElement).toBeTruthy();
      return queuePositionMessageElement;
    } else {
      const queuePositionMessageElement = await iframeContent
        .waitForSelector(`//*[contains(text(),"${customMessage}")]`)
        .catch((error) => {
          throw new Error(
            `Can't verify that chat widget has customized system message: "${customMessage}" Inner exception: ${error.message}`
          );
        });
      expect(queuePositionMessageElement).toBeTruthy();
      return queuePositionMessageElement;
    }
  }
  public async sendReconnectMessage(
    message: string,
    language: "en" | "ru" = "en"
  ) {
    const sendXPath =
      language === "en"
        ? LiveChatWidgetPageConstants.SendButtonXPathBlob
        : LiveChatWidgetPageConstants.SendButtonXPathRu;
    await this.waitUntilSelectorIsVisible(SelectorConstants.liveChatiframeName);
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const delayTimeout: number = Constants.FourThousandsMiliSeconds;
    const iFrame = await liveChatiframeName.contentFrame();
    await this.waitForDomContentLoaded();
    const textArea = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.TextareaXPath
    );
    await this.waitForDomContentLoaded();
    await textArea.fill(message);
    await this.waitUntilFrameSelectorIsVisible(
      LiveChatWidgetPageConstants.LiveChatWidgetInitialMessage,
      iFrame,
      Constants.Five,
      Constants.DefaultTimeout
    );
    await this.Page.keyboard.press(Constants.EnterKey, {
      delay: delayTimeout,
    });
    await this.waitUntilFrameIsVisible(
      sendXPath,
      AgentChatConstants.Five,
      iFrame,
      Constants.DefaultTimeout
    );
    await Promise.all([
      iFrame.$eval(sendXPath, (el) => (el as HTMLElement).click()),
    ]);
  }

  public async initiateAuthChat() {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.liveChatiframeName,
      Constants.Three,
      null,
      Constants.MaxTimeout
    );
    await this.waitUntilChatWidgetIsVisible(
      Constants.Three,
      Constants.MaxTimeout
    );
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const chatiFrame = await liveChatiframeName.contentFrame();
    await this.waitForDomContentLoaded();
    chatiFrame.waitForSelector(SelectorConstants.Letschat, {
      timeout: TimeoutConstants.Minutes(2),
    });
    await Promise.all([
      chatiFrame.$eval(SelectorConstants.Letschat, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
    await this.waitForDomContentLoaded();
    const existingSessionDetected = await this.waitUntilFrameSelectorIsVisible(
      LiveChatWidgetPageConstants.LiveChatStartNewSessionBtnSelector,
      chatiFrame,
      Constants.Two,
      Constants.FiveThousand
    );
    if (existingSessionDetected) {
      chatiFrame.$eval(
        LiveChatWidgetPageConstants.LiveChatStartNewSessionBtnSelector,
        (el) => (el as HTMLElement).click()
      );
    }
    const isPrechatEnabled = await chatiFrame.evaluate(() => {
      return Microsoft.Omnichannel.LiveChatWidget.Bootstrapper.lcConfig
        .isPreChatEnabled;
    });
    await this.waitForDomContentLoaded();
    if (isPrechatEnabled) {
      await chatiFrame.waitForSelector(
        LiveChatWidgetPageConstants.PrechatSubmitButtonClass
      );
      chatiFrame.$eval(
        LiveChatWidgetPageConstants.PrechatSubmitButtonClass,
        (el) => (el as HTMLElement).click()
      );
    }

    await this.waitUntilSelectorIsVisible(SelectorConstants.ChatClose);
  }

  public async initiatePopoutAuthChat(liveChatContext: BrowserContext) {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.liveChatiframeName,
      Constants.Three,
      null,
      Constants.MaxTimeout
    );
    await this.waitUntilChatWidgetIsVisible(
      Constants.Three,
      Constants.MaxTimeout
    );
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const chatiFrame = await liveChatiframeName.contentFrame();
    chatiFrame.waitForSelector(SelectorConstants.Letschat);
    await Promise.all([
      chatiFrame.$eval(SelectorConstants.Letschat, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
    await this.waitUntilSelectorIsVisible(
      LiveChatWidgetPageConstants.PopoutWidgetChatContainer
    );
    await this.continuePopOutConversation(liveChatContext);
  }

  public async continuePopOutConversation(liveChatContext: BrowserContext) {
    try {
      let allPages = liveChatContext.pages();
      let popoutPageIndex = liveChatContext.pages().length - 1;
      const continueConversation = await allPages[
        popoutPageIndex
      ].waitForSelector(SelectorConstants.ContinueConversation);
      await continueConversation.click();
      return true;
    } catch (error) {
      console.log(
        `Method continuePopOutConversation throwing exception with message: ${error.message}`
      );
    }
    return false;
  }

  public async waitUntilChatWidgetIsVisible(
    maxCount: number = Constants.Three,
    timeout: number = Constants.DefaultTimeout
  ) {
    let dataCount = 0;
    while (dataCount < maxCount) {
      try {
        const liveChatiframeName = await this.Page.$(
          SelectorConstants.liveChatiframeName
        );
        const chatiFrame = await liveChatiframeName.contentFrame();
        await chatiFrame.waitForSelector(SelectorConstants.Letschat, {
          timeout,
        });
        return true;
      } catch {
        Error("Can't find the chat widget selector");
      }
      dataCount++;
      await this.Page.waitForTimeout(timeout); // wait for provided timeout if chat widget is not visible with in given time frame and causes an exception, post this time frame it will recheck condition to see if chat widget is visible.
    }
    return false;
  }

  public async sendMessageTimes(
    message: string,
    times: number,
    language: "en" | "ru" = "en"
  ) {
    for (let i = 0; i < times; i++) {
      await this.sendMessage(message, language);
    }
  }

  public async openAuthChat() {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.liveChatiframeName,
      Constants.Four,
      null,
      Constants.MaxTimeout
    );
    const result = await this.waitUntilLetsChatBtnIsVisible(
      Constants.Two,
      Constants.DefaultTimeout
    );
    await this.waitUntilChatSelectorIsVisible(
      SelectorConstants.ChatContentWrapperElementSelector,
      Constants.Two,
      Constants.MaxTimeout
    );
    if (result) {
      await this.waitUntilContinueConversationBtnIsVisible(
        Constants.One,
        Constants.DefaultTimeout
      );
    }
    await this.waitUntilChatSelectorIsVisible(
      SelectorConstants.ChatClose,
      Constants.Five,
      Constants.FourThousandsMiliSeconds
    );
  }

  public async verifyMessage(messageXpath: string, text: string) {
    try {
      const liveChatiframeName = await this.Page.$(
        SelectorConstants.liveChatiframeName
      );
      const iFrame = await liveChatiframeName.contentFrame();
      await this.waitUntilFrameIsVisible(
        messageXpath,
        AgentChatConstants.Three,
        iFrame,
        AgentChatConstants.FiveThousandsMiliSecondsWaitTimeout
      );
      try {
        const systemMessage = await iFrame.waitForSelector(messageXpath);
        const entityItemText = await systemMessage.textContent();
        if (entityItemText.search(text) !== -1) {
          return true;
        }
      } catch (error) {
        console.log(
          `(Child Try Catch Block) Method verifyMessage throwing exception with message: ${error.message}`
        );
      }
    } catch (err) {
      console.log(
        `(Parent Try Catch Block) Method verifyMessage throwing exception with message: ${err.message}`
      );
    }
    return false;
  }

  public async sendChatMessage(message: string, language: "en" | "ru" = "en") {
    const sendXPath =
      language === "en"
        ? LiveChatWidgetPageConstants.SendButtonXPathBlob
        : LiveChatWidgetPageConstants.SendButtonXPathRu;
    await this.waitUntilSelectorIsVisible(SelectorConstants.liveChatiframeName);
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const delayTimeout: number = Constants.FourThousandsMiliSeconds;
    const iFrame = await liveChatiframeName.contentFrame();
    await this.waitForDomContentLoaded();
    const textArea = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.TextareaXPath
    );
    await this.waitForDomContentLoaded();
    await textArea.fill(message);
    await this.waitUntilFrameSelectorIsVisible(
      LiveChatWidgetPageConstants.LiveChatWidgetInitialMessage,
      iFrame,
      Constants.Five,
      Constants.DefaultTimeout
    );
    await this.Page.keyboard.press(Constants.EnterKey, {
      delay: delayTimeout,
    });
    await this.waitUntilFrameIsVisible(
      sendXPath,
      AgentChatConstants.Five,
      iFrame,
      Constants.DefaultTimeout
    );
    await Promise.all([
      iFrame.$eval(sendXPath, (el) => (el as HTMLElement).click()),
    ]);
  }

  public async waitUntilLetsChatBtnIsVisible(
    maxCount: number = Constants.Three,
    timeout: number = Constants.DefaultTimeout
  ) {
    let dataCount = 0;
    while (dataCount < maxCount) {
      try {
        const liveChatiframeName = await this.Page.$(
          SelectorConstants.liveChatiframeName
        );
        const chatiFrame = await liveChatiframeName.contentFrame();
        await chatiFrame.waitForSelector(SelectorConstants.Letschat, {
          timeout,
        });
        await chatiFrame.$eval(SelectorConstants.Letschat, (el) =>
          (el as HTMLElement).click()
        );
        return true;
      } catch {
        Error("Can't find the chat button.");
      }
      dataCount++;
    }
    return false;
  }

  public async waitUntilContinueConversationBtnIsVisible(
    maxCount: number = Constants.Three,
    timeout: number = Constants.DefaultTimeout
  ) {
    let dataCount = 0;
    while (dataCount < maxCount) {
      try {
        const liveChatiframeName = await this.Page.$(
          SelectorConstants.liveChatiframeName
        );
        const chatiFrame = await liveChatiframeName.contentFrame();
        const continueConversation = await chatiFrame.waitForSelector(
          SelectorConstants.ContinueConversation,
          { timeout }
        );
        await continueConversation.click();
        return true;
      } catch {
        Error("Can't find selector for Continue Conversation Button.")
      }
      dataCount++;
    }
    return false;
  }

  public async waitUntilChatSelectorIsVisible(
    selector: string,
    maxCount: number = Constants.Three,
    timeout: number = Constants.DefaultTimeout
  ) {
    let dataCount = 0;
    while (dataCount < maxCount) {
      try {
        const liveChatiframeName = await this.Page.$(
          SelectorConstants.liveChatiframeName
        );
        const chatiFrame = await liveChatiframeName.contentFrame();
        await chatiFrame.waitForSelector(selector, { timeout });
        return true;
      } catch {
        Error("Can't find the Chat selector.");
      }
      dataCount++;
    }
    return false;
  }

  public async sendUniqueMessage(senderPage, receiverPage, uniqueInitialMessage?: string) {
    const sentMessage = uniqueInitialMessage
      ? uniqueInitialMessage
      : Util.newGuid();
    await senderPage.sendMessage(sentMessage);
    await receiverPage.acceptPushChat(sentMessage);
  }

  public async sendMultipleChatMessages(
    message: string,
    times: number,
    language: "en" | "ru" = "en"
  ) {
    for (let i = 0; i < times; i++) {
      await this.sendChatMessage(message, language);
    }
  }

  public async getSelfServiceChatScript() {
    return `window.addEventListener("lcw:ready", function handleLivechatReadyEvent(){
                        Microsoft.Omnichannel.LiveChatWidget.SDK.setContextProvider(function contextProvider(){
                            return {
                                'SelfService':{'value':'[{"msdyn_displaytitle":"Page View 1","msdyn_url":"http://www.google.com","msdyn_starttime":"2019-08-30T01:59:59Z","msdyn_endtime":"2019-09-30T02:00:00Z","msdyn_type":192350000}, {"msdyn_displaytitle":"search","msdyn_url":"http://www.google.com","msdyn_starttime":"2019-09-14T18:50:59Z","msdyn_endtime":"2019-09-30T07:00:00Z","msdyn_type":192350001}, {"msdyn_displaytitle":"KB Article","msdyn_url":"http://www.google.com","msdyn_starttime":"2019-08-30T17:59:59Z","msdyn_endtime":"2019-09-30T02:00:00Z","msdyn_type":192350002}, {"msdyn_displaytitle":"Custom Action","msdyn_url":"http://www.google.com","msdyn_starttime":"2019-09-14T15:50:59Z","msdyn_endtime":"2019-09-30T07:00:00Z","msdyn_type":192350100}]'},
                                'vaghsdva': {'value': 'safdga', 'isDisplayable':true}
                            };
                        });
                    });`;
  }

  public async closePopUp(liveChatContext: BrowserContext) {
    let allPages = liveChatContext.pages();
    let popoutPageIndex = liveChatContext.pages().length - 1;
    await allPages[popoutPageIndex].close();
  }

  public async validateLiveChatPopOutHeaderTab(page: Page) {
    const liveChatiframeName = await page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.LiveChatHeaderTitle
    );
    const result = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.LiveChatHeaderIcon
    );
    return result;
  }

  public async LeaveSitePopOut(page: Page) {
    const liveChatiframeName = await page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    await Promise.all([
      iFrame.$eval(LiveChatWidgetPageConstants.closeChat, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
  }

  public async validateClosePopOut(page: Page) {
    const liveChatiframeName = await page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const PopupMessage = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.ClosePopMsg
    );
    const title = await PopupMessage.textContent();
    return title;
  }

  public async sendPopUpMessageWithAttachment(
    page: Page,
    message: string,
    attachments: string | Array<string> = [
      "FileResources//LiveChatAttachment.txt",
    ],
    language: "en" | "ru" = "en"
  ) {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.liveChatPopUpiframeName,
      Constants.Three,
      page
    );
    const sendXPath =
      language === "en"
        ? LiveChatWidgetPageConstants.SendButtonXPathBlob
        : LiveChatWidgetPageConstants.SendButtonXPathRu;

    const textArea = await page.waitForSelector(
      LiveChatWidgetPageConstants.TextareaXPath
    );
    await textArea.fill(message);

    await page.setInputFiles(
      LiveChatWidgetPageConstants.UploadFile,
      attachments
    );

    await page.waitForSelector(sendXPath);
    await Promise.all([
      page.$eval(LiveChatWidgetPageConstants.SendButtonXPathBlob, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
  }

  public async selectFoodAction() {
    this.clickItem(LiveChatWidgetPageConstants.FoodSelection);
    this.fillTextAreaCardData(LiveChatWidgetPageConstants.FoodPreparationTextarea, "Extra Spicy Please :)");
    this.clickItem(LiveChatWidgetPageConstants.FoodOKClick);
  }

  public async validateselectedresponse() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const systemmessage = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.Selectedlist
    );
    const entityItemText = await systemmessage.textContent();
    var text = /FoodChoice/gi;
    var textsecond = /Chicken/gi;
    if (
      entityItemText.search(text) != -1 &&
      entityItemText.search(textsecond) != -1
    ) {
      return true;
    }
  }

  public async ValidateTimestampMessages() {
    try {
      const liveChatiframeName = await this.Page.$(
        SelectorConstants.liveChatiframeName
      );
      const iframe = await liveChatiframeName.contentFrame();

      await this.waitUntilFrameIsVisible(
        LiveChatWidgetPageConstants.CustomerSentMessageLabel,
        AgentChatConstants.Two,
        iframe,
        AgentChatConstants.ConversationWrapUpTimeout
      );
      await this.waitUntilFrameIsVisible(
        LiveChatWidgetPageConstants.CustomerSentTimeStamp,
        AgentChatConstants.Two,
        iframe,
        AgentChatConstants.ConversationWrapUpTimeout
      );
      return true;
    } catch {
      return false;
    }
  }

  public async fillInputCardData() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();

    const firstName = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.InputCardName
    );
    await firstName.fill(LiveChatWidgetPageConstants.FirstName);

    const Homepage = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.InputCardHomePage
    );
    await Homepage.fill(LiveChatWidgetPageConstants.HomePage);

    const EmailName = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.InputCardMail
    );
    await EmailName.fill(LiveChatWidgetPageConstants.Email);

    const PhoneNumber = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.InputCardnumber
    );
    await PhoneNumber.fill(LiveChatWidgetPageConstants.Phone);

    const AcceptTerms = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.InputCardCheckBoxAcceptTerms
    );
    await AcceptTerms.click();

    await Promise.all([
      iFrame.$eval(LiveChatWidgetPageConstants.AdaptiveSubmit, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
    await this._page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async validateInputResponse(inputMessage: string, validationMessage: string, partialMessage: string) {
    var text;
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const systemmessage = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.InputValidation
    );
    const entityItemText = await systemmessage.textContent();
    if (inputMessage === validationMessage) {
      text = `${partialMessage}`;
      if (entityItemText.search(text) != -1) return true;
      else return false;
    }
  }

  public async fillTextAreaCardData(selector: string, data: string): Promise<void> {
    const chatIframe = await this.getChatIframe();
    await chatIframe.focus(selector);
    return await chatIframe.fill(selector, data);
  }

  public async VerifyUrlLink() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.HttpLink.replace(
        "{0}",
        AgentChatConstants.AgentMessageUrl
      )
    );
    await iFrame.$eval(
      LiveChatWidgetPageConstants.HttpLink.replace(
        "{0}",
        AgentChatConstants.AgentMessageUrl
      ),
      (el) => (el as HTMLElement).click()
    );
  }

  public async verifyLinkOpens(liveChatContext: BrowserContext, linkSelector: string, linkUrl: string) {
    const pagesBeforeClickCount = liveChatContext.pages().length;
    await this.clickItem(linkSelector);
    await liveChatContext.waitForEvent("page");
    const allPages = liveChatContext.pages();
    expect(allPages.length - pagesBeforeClickCount).toBe(1);
    expect(allPages[allPages.length - 1].url()).toMatch(new RegExp(linkUrl));
  }

  public async checkMessage() {
    // Waiting for loading dynamic content on the page, can't be replaced
    await this._page.waitForTimeout(
      LiveChatWidgetPageConstants.WaitForLoadingLCW
    );
    const iframe: Page = await TestHelper.GetIframe(
      this._page,
      HTMLConstants.IframeHTML
    );
    const selector = await iframe.waitForSelector(
      LiveChatWidgetPageConstants.MessageXpath.replace(
        "{0}",
        AgentChatConstants.AgentMessageNotInUrl
      )
    );
    const entityItemText = await selector.textContent();
    var text = /microsoft/gi;
    if (entityItemText.search(text) != -1) {
      return true;
    }
  }

  public async sendMultipleMessages(
    message: string,
    language: "en" | "ru" = "en",
    count: number
  ) {
    const sendXPath =
      language === "en"
        ? LiveChatWidgetPageConstants.SendButtonXPathBlob
        : LiveChatWidgetPageConstants.SendButtonXPathRu;
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.liveChatiframeName,
      Constants.Three,
      null,
      Constants.OpenWsWaitTimeout
    );
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    await this.waitForDomContentLoaded();
    const textArea = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.TextareaXPath
    );
    await this.waitForDomContentLoaded();
    for (let i = 0; i < count; i++) {
      await textArea.fill(message);
      await this.Page.keyboard.press(Constants.EnterKey, {
        delay: TimeoutConstants.ThreeSecondsDelay,
      });
      await Promise.all([
        iFrame.$eval(sendXPath, (el) => (el as HTMLElement).click()),
      ]);
    }
  }
  public async validateEmailTranscriptButton() {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.liveChatiframeName,
      Constants.Three,
      null,
      Constants.OpenWsWaitTimeout
    );
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    await this.waitForDomContentLoaded();
    const emailTranscriptBtn = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.EmailTranscriptButton
    );
    expect(emailTranscriptBtn !== null).toBeTruthy();
    await iFrame.$eval(
      LiveChatWidgetPageConstants.EmailTranscriptButton,
      (el) => (el as HTMLElement).click()
    );
    const textarea = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.EmailTranscriptTxtArea
    );
    await textarea.fill(LiveChatConstants.CrmAdminEmail);
    await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.EmailTranscriptCancelBtn
    );
    await iFrame.$eval(
      LiveChatWidgetPageConstants.EmailTranscriptCancelBtn,
      (el) => (el as HTMLElement).click()
    );
    await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.EmailTranscriptButton
    );
    await iFrame.$eval(
      LiveChatWidgetPageConstants.EmailTranscriptButton,
      (el) => (el as HTMLElement).click()
    );
    const textarea1 = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.EmailTranscriptTxtArea
    );
    await textarea1.fill(LiveChatConstants.CrmAdminEmail);
    await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.EmailTranscriptSendBtn
    );
    await iFrame.$eval(
      LiveChatWidgetPageConstants.EmailTranscriptSendBtn,
      (el) => (el as HTMLElement).click()
    );
  }

  public async validateCustomerHtmlMessageV2(
    messageNumber: number,
    textToValidate: string
  ) {
    this.delay(5000);
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.liveChatiframeName,
      Constants.Three,
      null,
      Constants.MaxTimeout
    );
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const messageInnerHtml = await (
      await iFrame.waitForSelector(
        SelectorConstants.CustomerHtmlMessageXPath.replace(
          "{0}",
          messageNumber.toString()
        )
      )
    ).textContent();
    console.log("MessageInnerHtml", messageInnerHtml);
    return messageInnerHtml === textToValidate;
  }

  public async validateCustomerHtmlMessage(
    messageNumber: number,
    textToValidate: string,
    expectedTag: string
  ) {
    let messageInnerHtml;
    this.delay(5000);
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.liveChatiframeName,
      Constants.Three,
      null,
      Constants.MaxTimeout
    );
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    try {
      messageInnerHtml = await (
        await iFrame.waitForSelector(
          AgentChatConstants.AgentHtmlMessageCustomerXPath.replace(
            "{0}",
            expectedTag
          ).replace("{1}", messageNumber.toString())
        )
      ).innerHTML();
    } catch {
      messageInnerHtml = await (
        await iFrame.waitForSelector(
          AgentChatConstants.AgentHtmlMessageXPathV1.replace(
            "{0}",
            expectedTag
          ).replace("{1}", messageNumber.toString())
        )
      ).innerHTML();
    }
    return messageInnerHtml === textToValidate;
  }

  public async validateDownloadTranscriptButton() {
    await this.waitUntilSelectorIsVisible(
      SelectorConstants.liveChatiframeName,
      Constants.Three,
      null,
      Constants.OpenWsWaitTimeout
    );
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    await this.waitForDomContentLoaded();
    const downloadTranscriptBtn = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.DownloadTranscriptButton
    );
    expect(downloadTranscriptBtn !== null).toBeTruthy();
  }

  public async validateOutOfOperatingHrMessage() {
    let systemmessage;
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();

    systemmessage = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.OperatingHrText
    );

    const entityItemText = await systemmessage.textContent();
    const text = /You have reached us outside of our operating hours/gi;
    if (entityItemText.search(text) != -1) {
      return true;
    }
  }

  public async GetConversationId() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    var result = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.ConversationIdSelector
    );
    const entityItemText = await result.textContent();
    const conversationID = entityItemText.split(".");
    return conversationID[1];
  }

  public async PrechatEmailVerification() {
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const surveyrecord = await iFrame.waitForSelector(
      LiveChatWidgetPageConstants.PrechatEmail
    );
    await surveyrecord.fill(LiveChatWidgetPageConstants.Email);
    await Promise.all([
      iFrame.$eval(LiveChatWidgetPageConstants.AdaptiveSubmit, (el) =>
        (el as HTMLElement).click()
      ),
    ]);
    await this._page.waitForTimeout(Constants.DefaultTimeout);
  }

  public async sendEmailMessage() {
    const iframe = await this.getChatIframe();

    await iframe.waitForSelector(
      SelectorConstants.emailButton
    );
    await iframe.$eval(
      SelectorConstants.emailButton,
      (el) => (el as HTMLElement).click()
    );
    let PreChat = await iframe.waitForSelector(
      LiveChatWidgetPageConstants.PreChatEmailSelector
    );
    expect(PreChat !== null).toBeTruthy();

    let emailTextField = await iframe.waitForSelector(
      SelectorConstants.emailTextField
    );
    expect(emailTextField !== null).toBeTruthy();

    let emailSendButton = await iframe.waitForSelector(
      SelectorConstants.emailSendButton
    );
    expect(emailSendButton !== null).toBeTruthy();

    let emailCancelButton = await iframe.waitForSelector(
      SelectorConstants.emailCancelButton
    );
    expect(emailCancelButton !== null).toBeTruthy();

    await iframe.waitForSelector(
      SelectorConstants.emailSendButton
    );
    await iframe.$eval(
      SelectorConstants.emailSendButton,
      (el) => (el as HTMLElement).click()
    );
  }

  public async verifyQueuePositionIsShown(order: number = null) {
    const xpathQueuePosition = order ?
      `xpath=//*[contains(text(),"People ahead of you: ${order}")]` : `xpath=//*[contains(text(),"People ahead of you:")]`;
    const liveChatiframeName = await this.Page.$(
      SelectorConstants.liveChatiframeName
    );
    const iFrame = await liveChatiframeName.contentFrame();
    const timeout: number = Constants.TwentyThousand;
    const queuePositionMessageElement = await iFrame
      .waitForSelector(xpathQueuePosition, { timeout })
      .catch((error) => {
        throw new Error(`Invalid queue position was shown or system message didn't appear! Expected: ${order ? order : 1}. Inner exception: ${error.message}`);
      });
    expect(queuePositionMessageElement).toBeTruthy();
    return true;
  }

  public async verifyAwerageTimeIsShown(messageXpath: string, text: string) {
    await this._page.waitForTimeout(2000);
    const iframe = await TestHelper.GetIframe(this._page, HTMLConstants.IframeHTML);
    try {
      const AWTMessageElement = await iframe
        .waitForSelector(messageXpath)
        .catch((error) => {
          throw new Error(`Can't verify that chat widget has system message: 'Average wait time:'. Inner exception: ${error.message}`);
        });
      const entityItemText = await AWTMessageElement.textContent();
      if (entityItemText.search(text) !== -1) {
        return true;
      }
    } catch (error) {
      console.log(
        `(Method verifyAwerageTimeIsShown throwing exception with message: ${error.message}`
      );
    }
  }

  public async validateBotMessage(
    messageXpath: string,
    maxCount = 2
  ) {
    try {
      let dataCount = 0;
      await this.waitUntilSelectorIsVisible(SelectorConstants.liveChatiframeName);
      const liveChatiframeName = await this._page.$(
        SelectorConstants.liveChatiframeName
      );
      const iFrame = await liveChatiframeName.contentFrame();
      while (dataCount < maxCount) {
        try {
          await this.Page.waitForTimeout(Constants.DefaultAverageTimeout);
          await iFrame.waitForSelector(messageXpath);
          return true;
        } catch {
          dataCount++;
        }
      }
    } catch {
    }
    return false;
  }
}
