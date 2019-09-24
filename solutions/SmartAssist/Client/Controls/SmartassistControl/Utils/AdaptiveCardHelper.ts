/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../CommonReferences.ts"/>

module MscrmControls.ProductivityPanel.Smartassist {
	export class AdaptiveCardHelper {

		private static startingTag: string = 'b64="';
		private static endingTag: string = '"'

		public static GetCardFromMessageContent(messageContent: string) {
			let startIndex = messageContent.indexOf(AdaptiveCardHelper.startingTag) + AdaptiveCardHelper.startingTag.length;
			let endIndex = messageContent.substr(startIndex).indexOf(AdaptiveCardHelper.endingTag);
			let jsonContent = JSON.parse(atob(messageContent.substr(startIndex, endIndex)));
			if (jsonContent.attachments && jsonContent.attachments.length > 0) {
				return jsonContent.attachments[0];
			}
		}

		public static InitializeAdaptiveCardsHostConfig(): any {
			let adaptiveCard = new AdaptiveCards.AdaptiveCard();
			adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
				"hostCapabilities": {
					"capabilities": null
				},
				"choiceSetInputValueSeparator": ",",
				"supportsInteractivity": true,
				"fontFamily": "Segoe UI",
				"spacing": {
					"small": 3,
					"default": 8,
					"medium": 20,
					"large": 30,
					"extraLarge": 40,
					"padding": 10
				},
				"separator": {
					"lineThickness": 0,
					"lineColor": "#FFFFFF"
				},
				"fontSizes": {
					"small": 12,
					"default": 14,
					"medium": 17,
					"large": 21,
					"extraLarge": 26
				},
				"fontWeights": {
					"lighter": 200,
					"default": 400,
					"bolder": 600
				},
				"imageSizes": {
					"small": 40,
					"medium": 80,
					"large": 160
				},
				"containerStyles": {
					"default": {
						"foregroundColors": {
							"default": {
								"default": "#333333",
								"subtle": "#EE333333"
							},
							"dark": {
								"default": "#000000",
								"subtle": "#66000000"
							},
							"light": {
								"default": "#FFFFFF",
								"subtle": "#33000000"
							},
							"accent": {
								"default": "#2E89FC",
								"subtle": "#882E89FC"
							},
							"good": {
								"default": "#54a254",
								"subtle": "#DD54a254"
							},
							"warning": {
								"default": "#c3ab23",
								"subtle": "#DDc3ab23"
							},
							"attention": {
								"default": "#FF0000",
								"subtle": "#DDFF0000"
							}
						},
						"backgroundColor": "#FFFFFF"
					},
					"emphasis": {
						"foregroundColors": {
							"default": {
								"default": "#333333",
								"subtle": "#EE333333"
							},
							"dark": {
								"default": "#000000",
								"subtle": "#66000000"
							},
							"light": {
								"default": "#FFFFFF",
								"subtle": "#33000000"
							},
							"accent": {
								"default": "#2E89FC",
								"subtle": "#882E89FC"
							},
							"good": {
								"default": "#54a254",
								"subtle": "#DD54a254"
							},
							"warning": {
								"default": "#c3ab23",
								"subtle": "#DDc3ab23"
							},
							"attention": {
								"default": "#FF0000",
								"subtle": "#DDFF0000"
							}
						},
						"backgroundColor": "#08000000"
					}
				},
				"actions": {
					"maxActions": 3,
					"spacing": "Default",
					"buttonSpacing": 24,
					"showCard": {
						"actionMode": "Inline",
						"inlineTopMargin": 16,
						"style": "emphasis"
					},
					"preExpandSingleShowCardAction": false,
					"actionsOrientation": "Horizontal",
					"actionAlignment": "Right"
				},
				"adaptiveCard": {
					"allowCustomStyle": true
				},
				"imageSet": {
					"imageSize": "Medium",
					"maxImageHeight": 100
				},
				"media": {
					"allowInlinePlayback": true
				},
				"factSet": {
					"title": {
						"size": "Default",
						"color": "Default",
						"isSubtle": false,
						"weight": "Bolder",
						"wrap": true
					},
					"value": {
						"size": "Default",
						"color": "Default",
						"isSubtle": false,
						"weight": "Default",
						"wrap": true
					},
					"spacing": 10
				},
				"cssClassNamePrefix": null
				// More host config options
			});
			return adaptiveCard;
		}
	}
}