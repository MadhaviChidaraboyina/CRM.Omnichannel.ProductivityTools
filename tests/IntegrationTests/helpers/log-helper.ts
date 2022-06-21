import { Page } from "playwright";

export const LogChatDetails = async (page: Page, methodName?: string, initialChatMessage?: string) => {
  const testCaseName = expect.getState().currentTestName;
  try {
    if (initialChatMessage) {
      const message = `TestCase: ${testCaseName} || ChatMessage: ${initialChatMessage} || methodName: ${methodName}`;
    }
    const liveWorkItemId = await page.evaluate(() => eval("Microsoft.Omnichannel.getConversationId();"));
    const message = `TestCase: ${testCaseName} || ConversationId: ${liveWorkItemId} || methodName: ${methodName}`;
    console.info(message);
  } catch (e) {
    console.info(`Failed to log test: ${testCaseName} \n ${e}`);
  }
};

export const LogRequestDetails = async (logJsonRequest?: string) => {
  const testCaseName = expect.getState().currentTestName;
  let testExecutionDate: String = new Date().toLocaleString();
  try {
    const message = `Request Processed at: ${testExecutionDate}  || Payload Request: ${logJsonRequest}`;
    console.info(message);
  } catch (e) {
    console.info(`Failed to log test: ${testCaseName} \n ${e}`);
  }
};