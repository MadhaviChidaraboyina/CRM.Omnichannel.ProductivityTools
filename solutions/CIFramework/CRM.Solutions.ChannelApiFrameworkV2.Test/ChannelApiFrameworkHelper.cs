using Microsoft.Crm.Sdk.Samples;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Crm.QA.Utf;
using Microsoft.Xrm.Sdk;

namespace CRM.Solutions.ChannelApiFrameworkV2.Test
{
	public class ChannelApiFrameworkHelper
	{
        public string getJson(string inputString, string param = "", string accountId = "")
		{
			string parameters = "";
			switch (inputString)
			{
				case Constants.CREATE_SESSION:
					parameters = "{'functionName':'createSession', 'isStringify': false, 'parameters':{'param1':{'templateTag':'Case_Session','context':'Session 1','templateParameters':{'caseTitle':'Case 1','entityId':'" + param + "'}}}}";
					break;
				case Constants.GET_FOCUSED_SESSION:
					parameters = "{ 'functionName':'getFocusedSession', 'isStringify': false, 'parameters': {} }";
					break;
				case Constants.GET_ALL_SESSIONS:
					parameters = "{ 'functionName':'getAllSessions', 'isStringify': false, 'parameters': {} }";
					break;
				case Constants.REQUEST_FOCUS_SESSION:
					parameters = "{ 'functionName':'requestFocusSession', 'isStringify': false, 'parameters': {'param1':'" + param + "'} }";
					break;
				case Constants.CAN_CREATE_SESSION:
					parameters = "{ 'functionName':'canCreateSession', 'isStringify': false, 'parameters': {} }";
					break;
				case Constants.GET_SESSION:
					parameters = "{ 'functionName':'getSession', 'isStringify': false, 'parameters': {'param1':'" + param + "'} }";
					break;
				case Constants.CREATE_TAB:
					parameters = "{'functionName':'createTab', 'isStringify': false, 'parameters':{'param1':{'templateName':'Case_App_Tab', 'templateParameters':{'entityName':'incident', 'entityId': '" + param + "','caseTitle':'Tab'}}}}";

					break;
				case Constants.FOCUS_TAB:
					parameters = "{'functionName':'focusTab', 'isStringify': false, 'parameters': {'param1':'" + param + "'} }";
					break;
				case Constants.GET_FOCUSED_TAB:
					parameters = "{'functionName':'getFocusedTab', 'isStringify': false, 'parameters': {} }";
					break;
				case Constants.REFRESH_TAB:
					parameters = "{'functionName':'refreshTab', 'isStringify': false, 'parameters': {'param1':'" + param + "'} }";
					break;
				case Constants.SET_SESSION_TITLE:
					parameters = "{'functionName':'setSessionTitle', 'isStringify': false, 'parameters':{'param1':{'caseTitle':'New Case','entityId':'" + param + "'}}}";
					break;
                case Constants.SET_TAB_TITLE:
                    parameters = "{'functionName':'setTabTitle', 'isStringify': false ,'parameters':{ 'param1':'" + param + "','param2' : { 'caseTitle': 'NewTab' }}}";
                    break;
                case Constants.GET_TABS:
                    parameters = "{'functionName':'getTabs', 'isStringify': true, 'parameters':{'param1':'Case_App_Tab'}}";
                    break;
                default:
					Console.WriteLine("Please provide Case");
					break;
			}
			return parameters;
		}

		public void LaunchWidget(IWebDriver driver, string appModuleName)
		{
			Log.Comment("Launching side panel widget");
			WorkWithSolutions.TryLaunchConversationControl(driver, Constants.CONSOLE_APP);
			Log.Comment("Side panel widget launched");
			Console.WriteLine("driver windows count - " + driver.WindowHandles.Count());
			IWait<IWebDriver> wait = new DefaultWait<IWebDriver>(driver);
			wait.Timeout = TimeSpan.FromSeconds(120);
			wait.PollingInterval = TimeSpan.FromMilliseconds(30000);
			wait.Until(d =>
			{
				Thread.Sleep(5000);
				driver.SwitchTo().Frame(driver.FindElement(By.Id("SidePanelIFrame")));
				Thread.Sleep(10000);
				driver.SwitchTo().Frame(driver.FindElement(By.XPath("//*[@id='widgetControlDiv']/div/iframe")));
				Thread.Sleep(10000);
				var el = d.FindElement(By.Id("outputJson"));
				return el != null;
			});
		}

		public bool validateValue(int value,int expectedValue)
		{
			if (value >= expectedValue-1 && value <= expectedValue + 1)
			{
				return true;
			}
			else
			{
				return false;
			}
		}

		public string PerformAction(IWebDriver driver, string inputJson)
		{
			IWebElement inputTextBox = driver.FindElement(By.Id(Constants.INPUT_TEXTBOX));
			Thread.Sleep(5000);
			inputTextBox.SendKeys(inputJson);
			Thread.Sleep(5000);
			IWebElement clickButton = driver.FindElement(By.Id(Constants.SUBMIT_BUTTON));
			clickButton.Click();
			Thread.Sleep(5000);
			if (!inputJson.Contains("openForm"))
			{
				IWait<IWebDriver> wait = new DefaultWait<IWebDriver>(driver);
				wait.Timeout = TimeSpan.FromSeconds(120);
				wait.PollingInterval = TimeSpan.FromMilliseconds(30000);
				wait.Until(d =>
				{
					var el = d.FindElement(By.Id(Constants.OUTPUT_TEXTBOX));
					return el != null && !String.IsNullOrEmpty(el.GetAttribute(Constants.VALUE_ATTRIBUTE));
				});
			}
			string outputString = clearTextBoxesHelper(driver);
			return outputString;
		}

		public string clearTextBoxesHelper(IWebDriver driver)
		{
			IWebElement inputTextBox = driver.FindElement(By.Id(Constants.INPUT_TEXTBOX));
			IWebElement outputTextBox = driver.FindElement(By.Id(Constants.OUTPUT_TEXTBOX));
			string outputString = outputTextBox.GetAttribute(Constants.VALUE_ATTRIBUTE);
			inputTextBox.Clear();
			Thread.Sleep(5000);
			outputTextBox.Clear();
			Thread.Sleep(5000);
			return outputString;
		}

		public double getFormWidthHelper(IWebDriver driver)
		{
			IWebElement formElement = driver.FindElement(By.Id(Constants.FORM_DOM_ELEMENT_ID));
			return formElement.Size.Width;
		}

	}
}
