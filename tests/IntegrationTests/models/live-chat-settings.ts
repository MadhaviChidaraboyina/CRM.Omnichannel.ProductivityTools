import { Languages } from "./languages";
import { LiveChatFeatures } from "./live-chat-features";

export interface LiveChatCreateSettings {
    workstreamName: string;
    chatName: string;
    features: LiveChatFeatures[];
    language: Languages;
    authSettingsName?: string;
}

export interface LiveChatSurveySettings {
    preChatSurveyEnabled: boolean;
    questionSettings: QuestionSurveySettings[];
    mandatory?: boolean;
    postChatSurveyEnabled?: boolean;
}

export interface QuestionSurveySettings{
    questionName: string;
    questionText: string;
    questionType?: QuestionType;
    mandatory?: boolean;
}

enum QuestionType {
    SingleLine = "192350000",
    MultipleLines = "192350001",
    OptionSet = "192350002",
    UserConsent = "192350004"
}