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

namespace CRM.Solutions.ChannelApiFramework.Test
{
	public class ChannelApiFrameworkHelper
	{
		public string getJson(string inputString, string accountId = "")
		{
			string parameters = "";
			switch (inputString)
			{
				case Constants.GET_ENVIRONENT:
					parameters = "{'functionName':'getEnvironment', 'isStringify': false,'parameters':{}}";
					break;
				case Constants.SET_CLICKTO_ACT:
					parameters = "{'functionName':'setClickToAct', 'isStringify': false, 'parameters':{'SetClick': true }}";
					break;
				case Constants.GET_CLICKTO_ACT:
					parameters = "{'functionName':'getClickToAct', 'isStringify': false, 'parameters':{}}";
					break;
				case Constants.SET_MODE:
					parameters = "{'functionName':'setMode', 'isStringify': false, 'parameters':{ 'Mode': 1 }}";
					break;
				case Constants.GET_MODE:
					parameters = "{'functionName':'getMode', 'isStringify': false, 'parameters':{}}";
					break;
				case Constants.SET_MODE_FAILURE:
					parameters = "{'functionName':'setMode', 'isStringify': false, 'parameters':{ 'Mode': 2 }}";
					break;
				case Constants.SET_WIDTH:
					parameters = "{'functionName':'setWidth', 'isStringify': false, 'parameters':{'Width': 300 }}";
					break;
				case Constants.GET_WIDTH:
					parameters = "{'functionName':'getWidth', 'isStringify': false, 'parameters':{}}";
					break;
				case Constants.SET_WIDTH_FAILURE:
					parameters = "{'functionName':'setWidth', 'isStringify': false, 'parameters':{'Width': -300 }}";
					break;
				case Constants.CREATE_RECORD:
					parameters = "{'functionName':'createRecord', 'isStringify': true, 'parameters':{ 'entityName': 'account' ,'data' : {'name':'Sample Account','creditonhold':false,'address1_latitude':47.639583,'description':'This is the description of the sample account','revenue':5000000,'accountcategorycode':1} }}";
					break;
				case Constants.RETRIEVE_RECORD:
					parameters = "{'functionName':'retrieveRecord', 'isStringify': true,'parameters':{ 'entityName': 'account' , 'id':'" + accountId + "'}}";
					break;
				case Constants.UPDATE_RECORD:
					parameters = "{'functionName':'updateRecord','isStringify': true, 'parameters':{'entityName': 'account', 'id':'" + accountId + "', 'data' : {'name':'Updated Sample Account','creditonhold':false,'address1_latitude':80.639583,'description':'This is the description of the updated sample account','revenue':70000000,'accountcategorycode':1} }}";
					break;
				case Constants.DELETE_RECORD:
					parameters = "{'functionName':'deleteRecord','isStringify': true, 'parameters':{ 'entityName': 'account', 'id':'" + accountId + "' }}";
					break;
				case Constants.CREATE_RECORD_FAILURE:
					parameters = "{'functionName':'createRecord', 'isStringify': true, 'parameters':{ 'data' : {'name':'Sample Account','creditonhold':false,'address1_latitude':47.639583,'description':'This is the description of the sample account','revenue':5000000,'accountcategorycode':1} }}";
					break;
				case Constants.RETRIEVE_RECORD_FAILURE:
					parameters = "{'functionName':'retrieveRecord', 'isStringify': true,'parameters':{ 'entityName': 'account'}}";
					break;
				case Constants.UPDATE_RECORD_FAILURE:
					parameters = "{'functionName':'updateRecord','isStringify': true, 'parameters':{'entityName': 'account', 'data' : {'name':'Updated Sample Account','creditonhold':false,'address1_latitude':80.639583,'description':'This is the description of the updated sample account','revenue':70000000,'accountcategorycode':1} }}";
					break;
				case Constants.OPEN_FORM:
					parameters = "{'functionName':'openForm', 'isStringify': true,'parameters':{'param1': {'entityName':'contact','useQuickCreateForm':true} , 'param2' : {'firstname':'Sample','lastname':'Contact','fullname':'Sample Contact','emailaddress1':'contact@adventure-works.com','jobtitle':'Sr. Marketing Manager','donotemail':'1','description':'Default values for this record were set programmatically.'} }}";
					break;
				case Constants.OPEN_SEARCH_RECORDS:
					parameters = "{\"functionName\":\"searchAndOpenRecords\",\"isStringify\":false,\"parameters\":{\"param1\":\"account\",\"param2\":\"?$filter=contains(name,'Sample Account')\",\"param3\":true}}";
					break;
				case Constants.ADD_HANDLER:
					parameters = "{'functionName':'addHandler', 'isStringify': true,'parameters':{} }";
					break;
				case Constants.REMOVE_HANDLER:
					parameters = "{'functionName':'removeHandler', 'isStringify': true,'parameters':{} }";
					break;
				case Constants.GET_ENTITYMETADATA:
					parameters = "{'functionName':'getEntityMetadata', 'isStringify': false, 'parameters':{ 'entityName': 'account' ,'data' : 'Name' }}";
					break;
				default:
					Console.WriteLine("Please provide Case");
					break;
			}
			return parameters;
		}

		public void LaunchConversationControl(IWebDriver driver)
		{
			driver.Manage().Timeouts().AsynchronousJavaScript = TimeSpan.FromSeconds(120);
			try
			{
				driver.Manage().Window.Maximize();
				Thread.Sleep(5000);
				var value = Environment.GetEnvironmentVariable("Config_Path");

				ExeConfigurationFileMap configFileMap =
						new ExeConfigurationFileMap();
				configFileMap.ExeConfigFilename = value;

				// Get the mapped configuration file.
				Configuration config =
				  ConfigurationManager.OpenMappedExeConfiguration(
					configFileMap, ConfigurationUserLevel.None);

				Constants.USER_NAME = config.AppSettings.Settings["UserName"].Value;
				Constants.PASSWORD = config.AppSettings.Settings["UserPassword"].Value;
				Constants.CLIENT_URL = config.AppSettings.Settings["RootDiscoveryServiceUrl"].Value;

				string httpString = "http://";
				string getUrl = Constants.CLIENT_URL.Replace(httpString, "");
				string loginUrl = "http://" + Constants.USER_NAME + ":" + Constants.PASSWORD + "@" + getUrl;

				IWait<IWebDriver> waitBeforeUrl = new DefaultWait<IWebDriver>(driver);
				waitBeforeUrl.PollingInterval = TimeSpan.FromMilliseconds(30000);
				driver.Navigate().GoToUrl(loginUrl);
				Thread.Sleep(5000);
				driver.Navigate().GoToUrl(Constants.CLIENT_URL);

				Thread.Sleep(5000);
				Console.WriteLine("launching Conversation Control- " + Constants.CLIENT_URL);
			}
			catch (Exception ex)
			{
				Assert.IsTrue(false, "failed to launch Conversation Control");
				throw ex;
			}
			Console.WriteLine("driver windows count - " + driver.WindowHandles.Count());
			IWait<IWebDriver> wait = new DefaultWait<IWebDriver>(driver);
			wait.Timeout = TimeSpan.FromSeconds(120);
			wait.PollingInterval = TimeSpan.FromMilliseconds(30000);
			wait.Until(d =>
			{
				driver.SwitchTo().Frame(driver.FindElement(By.Id("SidePanelIFrame")));
				var el = d.FindElement(By.XPath("//*[@id='outputJson']"));
				return el != null;
			});
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
