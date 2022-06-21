export class HTMLConstants {
    public static readonly IframeHTML = "chat.html";
    public static readonly IframeLCWId = "Microsoft_Omnichannel_LCWidget_Chat_Iframe_Window";
    public static readonly IframeNavigate = "framenavigated";
    public static readonly IframeCC = "ChatControl.htm";
	public static readonly TEXTAREA = "textarea";
    public static readonly END_CONVERSATION_BUTTON = ".menu-button";
	public static readonly PUBLIC_BUTTON = ".public-button";
    public static readonly MORE_ID = "#more";
	public static readonly MORE_MENU_ITEMS_POPUP = "//*[@class='control-list chatreply-more-menuitems cc-popup']";
    public static readonly BUTTON_ROW_FOOTER = ".button-row-footer";

    // Sentiment constants
    public static readonly SlightlyNegative = "Slightly negative";
    public static readonly Negative = "Negative";
    public static readonly VeryNegative = "Very negative";
    public static readonly SlightlyPositive = "Slightly positive";
    public static readonly Positive = "Positive";
    public static readonly VeryPositive = "Very positive";
    public static readonly Neutral = "Neutral";

    public static readonly CONVERSATIONCONTROL_MESSAGE_CONTAINER = "//*[@id='webchat']/div/div[contains(@class, 'webchat__basic-transcript')]";
    public static readonly MESSAGE_BUBBLE_TEXT = HTMLConstants.CONVERSATIONCONTROL_MESSAGE_CONTAINER + "/div/ul/li[{0}]//*[@class='webchat__bubble__content']/div/div[2]";
	public static readonly MESSAGE_ACTIONS_BUTTON = HTMLConstants.CONVERSATIONCONTROL_MESSAGE_CONTAINER + "/div/ul/li[{0}]//*[@class='webchat__bubble__content']//*[@class='cc-message-header']//*[@class='cc-message-actions-button']";
    public static readonly MESSAGE_HEADER_TIMESTAMPS = "cc-web-chat-activityStatus-timestamp";
	public static readonly MESSAGE_HEADER_TIMESTAMP = HTMLConstants.CONVERSATIONCONTROL_MESSAGE_CONTAINER + "/div/ul/li[{0}]//*[@class='webchat__bubble__content']//*[@class='cc-message-header']//*[@class='cc-web-chat-activityStatus-timestamp']";
	public static readonly MESSAGE_ACTION = HTMLConstants.CONVERSATIONCONTROL_MESSAGE_CONTAINER + "/div/ul/li[{0}]//*[@class='webchat__bubble__content']//*[@class='cc-message-header']//*[@class='cc-message-actions-list']/div/div[{1}]";

    public static readonly END_CONVER_BUTTON = "div[data-id='userDetails'] ul[class='control-list header-menu-items'] li[class='menu-item-button'] button";
    public static readonly DISABLED = "disabled";
    public static readonly CONSULT_BUTTON = "//*[@id='consult']";
	public static readonly TRANSFER_BUTTON = "//*[@id='transfer']";
    public static readonly TIME_OUT = "5000";
}