import { SentimentTest } from "../models";
import { HTMLConstants } from "../constants";

export class SentimentConstant {
    public static readonly sentimentTimeout = 3000;
    public static readonly neutralMessage = "hi!";
    public static readonly positiveMessage = "great!";
    public static readonly negativeMessage = "bad!";
    public static readonly sentimentTests: SentimentTest[] = [
        {
            name: "Positive",
            messageBlocks: [HTMLConstants.SlightlyPositive, HTMLConstants.Positive, HTMLConstants.VeryPositive].map(sentiment => ({
                messages: [SentimentConstant.positiveMessage],
                expectedSentiment: sentiment
            }))
        },
        {
            name: "Negative",
            messageBlocks: [HTMLConstants.SlightlyNegative, HTMLConstants.Negative, HTMLConstants.VeryNegative].map(sentiment => ({
                messages: [SentimentConstant.negativeMessage],
                expectedSentiment: sentiment
            }))
        },
        {
            name: "Neutral",
            messageBlocks: Array(6).fill({
                messages: [SentimentConstant.neutralMessage],
                expectedSentiment: HTMLConstants.Neutral
            })
        },
        {
            name: "Neutral and positive",
            messageBlocks: Array(6).fill({
                messages: [SentimentConstant.neutralMessage],
                expectedSentiment: HTMLConstants.Neutral
            }).fill({
                messages: [SentimentConstant.positiveMessage],
                expectedSentiment: HTMLConstants.SlightlyPositive
            }, 5)
        },
        {
            name: "Neutral and negative",
            messageBlocks: Array(6).fill({
                messages: [SentimentConstant.neutralMessage],
                expectedSentiment: HTMLConstants.Neutral
            }).fill({
                messages: [SentimentConstant.negativeMessage],
                expectedSentiment: HTMLConstants.SlightlyNegative
            }, 5)
        }
    ];

    public static readonly sentimentAlertTests: SentimentTest[] = [
        {
            name: "Positive",
            messageBlocks: [HTMLConstants.SlightlyPositive, HTMLConstants.Positive, HTMLConstants.VeryPositive].map(sentiment => ({
                messages: [SentimentConstant.positiveMessage],
                expectedSentiment: sentiment
            }))
        },
        {
            name: "Negative",
            messageBlocks: [HTMLConstants.SlightlyNegative, HTMLConstants.Negative, HTMLConstants.VeryNegative].map(sentiment => ({
                messages: [SentimentConstant.negativeMessage],
                expectedSentiment: sentiment
            }))
        }
    ];
}