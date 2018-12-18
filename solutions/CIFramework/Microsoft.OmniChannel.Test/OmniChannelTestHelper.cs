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

namespace CRM.Solutions.OmniChannel.Test
{
	public class OmniChannelHelper
	{

		public void LaunchConversationControl(IWebDriver driver, string appModuleName)
		{
			driver.Manage().Timeouts().AsynchronousJavaScript = TimeSpan.FromSeconds(120);
			bool isOnlineEnv = true;
			try
			{
				driver.Manage().Window.Maximize();
				Thread.Sleep(5000);
				var value = Environment.GetEnvironmentVariable("Config_Path");

				ExeConfigurationFileMap configFileMap = new ExeConfigurationFileMap();
				configFileMap.ExeConfigFilename = value;

				// Get the mapped configuration file.
				Configuration config =
				  ConfigurationManager.OpenMappedExeConfiguration(
					configFileMap, ConfigurationUserLevel.None);

				Constants.USER_NAME = config.AppSettings.Settings["OrgAdminUserName"].Value;
				Constants.PASSWORD = config.AppSettings.Settings["OrgAdminPassword"].Value;
				Constants.CLIENT_URL = config.AppSettings.Settings["ServerAddress"].Value;
				Constants.CLIENTPORTAL_CLIENT_URL = config.AppSettings.Settings["ClientPortalUrl"].Value;
				Constants.CLIENTPORTAL_USER_NAME = config.AppSettings.Settings["ClientPortalUserName"].Value;
				Constants.CLIENTPORTAL_PASSWORD = config.AppSettings.Settings["ClientPortalPassword"].Value;

				if (Constants.CLIENT_URL.Contains("aurora") && Constants.CLIENT_URL.Contains("extest.microsoft.com"))
				{
					isOnlineEnv = false;
				}

				IWait<IWebDriver> waitBeforeUrl = new DefaultWait<IWebDriver>(driver);
				waitBeforeUrl.PollingInterval = TimeSpan.FromMilliseconds(30000);

				if (!isOnlineEnv)
				{
					string httpString = "http://";
					string getUrl = Constants.CLIENT_URL.Replace(httpString, "");
					string loginUrl = "http://" + Constants.USER_NAME + ":" + Constants.PASSWORD + "@" + getUrl;

					Guid appId = WorkWithSolutions.GetAppID(appModuleName);
					Constants.CLIENT_URL += "/CITTest/main.aspx?appid=" + appId;
					loginUrl = string.Format("{0}/CITTest/main.aspx?appid={1}", loginUrl, appId);

					waitBeforeUrl.PollingInterval = TimeSpan.FromMilliseconds(30000);
					driver.Navigate().GoToUrl(loginUrl);
					Thread.Sleep(5000);
					driver.Navigate().GoToUrl(Constants.CLIENT_URL);
				}
				else
				{
					Guid appId = WorkWithSolutions.GetAppID(appModuleName);
					string loginUrl = Constants.CLIENT_URL + "/main.aspx?appid=" + appId;
					driver.Navigate().GoToUrl(loginUrl);

					var userNameTextBox = driver.FindElement(By.Id("i0116"));
					userNameTextBox.SendKeys(Constants.USER_NAME);
					var nextButton = driver.FindElement(By.Id("idSIButton9"));
					nextButton.Click();
					Thread.Sleep(5000);
					var passwordTextBoox = driver.FindElement(By.Id("i0118"));
					passwordTextBoox.SendKeys(Constants.PASSWORD);
					var signInButton = driver.FindElement(By.Id("idSIButton9"));
					signInButton.Click();
					Thread.Sleep(5000);
					var yesButton = driver.FindElement(By.Id("idSIButton9"));
					yesButton.Click();
				}

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
			if (!isOnlineEnv)
			{
				wait.Until(d =>
				{
					if (OmniChannelTest.isPresence)
					{
						var sidePanelButton = driver.FindElement(By.XPath("//*[@id='mainContent']/div[2]/div[2]/div/div[1]/button"));
						sidePanelButton.Click();
					}
					Thread.Sleep(10000);
					driver.SwitchTo().Frame(driver.FindElement(By.Id("SidePanelIFrame")));
					return true;
				});
			}
			else
			{
				if (OmniChannelTest.isPresence)
				{
					var sidePanelButton = driver.FindElement(By.XPath("//*[@id='mainContent']/div[2]/div[2]/div/div[1]/button"));
					sidePanelButton.Click();
				}
				Thread.Sleep(40000);
				driver.SwitchTo().Frame(driver.FindElement(By.Id("SidePanelIFrame")));
			}
		}

		public void SwitchToOnlineChatPortal(IWebDriver driver)
		{
			IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
			js.ExecuteScript(string.Format("window.open('{0}', '_blank');", Constants.CLIENTPORTAL_CLIENT_URL));
			driver.SwitchTo().Window(driver.WindowHandles.Last());
			Thread.Sleep(10000);

			var signInButton = driver.FindElement(By.XPath("//*[@id='navbar']/div[1]/ul/li[11]"));
			signInButton.Click();
			Thread.Sleep(10000);

			var userName = driver.FindElement(By.Id("Username"));
			userName.SendKeys(Constants.CLIENTPORTAL_USER_NAME);

			var passWord = driver.FindElement(By.Id("Password"));
			passWord.SendKeys(Constants.CLIENTPORTAL_PASSWORD);

			var signInButton2 = driver.FindElement(By.Id("submit-signin-local"));
			signInButton2.Click();
			Thread.Sleep(10000);

			var letsChat = driver.FindElement(By.Id("oclcw-chatButton"));
			letsChat.Click();
			Thread.Sleep(5000);

			var selectChatOptions = driver.FindElement(By.XPath("//*[@class='oclcw-pp-container']/div[2]/div/div[8]/div[1]/div/button"));
			selectChatOptions.Click();
			Thread.Sleep(10000);

			driver.SwitchTo().Window(driver.WindowHandles.First());
			Thread.Sleep(5000);
			driver.SwitchTo().Frame(driver.FindElement(By.Id("SidePanelIFrame")));
			Thread.Sleep(5000);
		}

		public void PerformAction(IWebDriver driver, string inputJson)
		{
			IWebElement inputTextBox = driver.FindElement(By.Id(Constants.INPUT_TEXTBOX));
			Thread.Sleep(5000);
			inputTextBox.SendKeys(inputJson);
			Thread.Sleep(5000);
			IWebElement clickButton = driver.FindElement(By.Id(Constants.SUBMIT_BUTTON));
			clickButton.Click();
			Thread.Sleep(1000);
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
