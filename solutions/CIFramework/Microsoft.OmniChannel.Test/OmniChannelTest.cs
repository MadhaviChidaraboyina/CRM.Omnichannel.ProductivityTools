using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenQA.Selenium.Support.UI;
using CRM.Solutions.OmniChannel.Test.Utility;
using CRM.Solutions.OmniChannel.Test;
using Newtonsoft.Json;
using System.Threading;

namespace CRM.Solutions.OmniChannel.Test
{
	[TestClass]
	public class OmniChannelTest : TestCasesBase
	{
		public OmniChannelHelper helper = new OmniChannelHelper();
		public static bool isPresence = false;

		[TestMethod(), TestCategory("VerifyNotification")]
		public void verifyNotification()
		{
			helper.LaunchConversationControl(driver, "Customer Service Hub");
			Thread.Sleep(5000);
			helper.SwitchToOnlineChatPortal(driver);
			IWebElement toastWindow = driver.FindElement(By.Id("CIFToastDiv_1"));
			Assert.IsNotNull(toastWindow);
			Thread.Sleep(5000);
			string displayValue = toastWindow.GetCssValue("display");
			Assert.AreEqual("table", displayValue);
		}

		[TestMethod(), TestCategory("VerifyAccept")]
		public void verifyAccept()
		{
			helper.LaunchConversationControl(driver, "Customer Service Hub");
			Thread.Sleep(5000);
			helper.SwitchToOnlineChatPortal(driver);
			IWebElement toastWindow = driver.FindElement(By.Id("CIFToastDiv_1"));
			Assert.IsNotNull(toastWindow);
			Thread.Sleep(5000);
			IWebElement acceptButton = driver.FindElement(By.XPath("//*[@id='CIFToastDiv_1']/div[4]/button[1]"));
			acceptButton.Click();
			Thread.Sleep(5000);
			driver.SwitchTo().Frame(driver.FindElement(By.XPath("//*[@id='widgetControlDiv']/div/iframe")));
			Thread.Sleep(5000);
			IWebElement ConversationContainer = driver.FindElement(By.Id("conversation-container"));
			Thread.Sleep(5000);
			var ConversationContainerDisplay = ConversationContainer.Displayed;
			Assert.IsTrue(ConversationContainerDisplay, "conversation control is not loading properly");
		}

		[TestMethod(), TestCategory("VerifyReject")]
		public void verifyReject()
		{
			helper.LaunchConversationControl(driver, "Customer Service Hub");
			Thread.Sleep(5000);
			helper.SwitchToOnlineChatPortal(driver);
			IWebElement toastWindow = driver.FindElement(By.Id("CIFToastDiv_1"));
			Assert.IsNotNull(toastWindow);
			Thread.Sleep(5000);
			IWebElement rejectButton = driver.FindElement(By.XPath("//*[@id='CIFToastDiv_1']/div[4]/button[2]"));
			rejectButton.Click();
			Assert.IsNull(toastWindow);
		}

		[TestMethod(), TestCategory("VerifySetAgentPresence")]
		public void verifysetAgentPresence()
		{
			isPresence = true;
			helper.LaunchConversationControl(driver, "Customer Service Hub");
			IWebElement presenceBtn = driver.FindElement(By.Id("CurrentStatus"));
			var predisplay = presenceBtn.Displayed;
			Assert.IsTrue(predisplay, "Presence is not loading properly");
			presenceBtn.Click();
			var presenceOptions = driver.FindElement(By.Id("PresenceList"));
			var presenceListDisplay = presenceOptions.Displayed;
			Assert.IsTrue(presenceListDisplay, "Presence List is not loading properly");
			isPresence = false;
		}

		[TestMethod(), TestCategory("VerifyPresenceOptions")]
		public void verifysetAgentPresenceOptions()
		{
			isPresence = true;
			helper.LaunchConversationControl(driver, "Customer Service Hub");
			IWebElement presenceBtn = driver.FindElement(By.Id("CurrentStatus"));
			presenceBtn.Click();
			Thread.Sleep(5000);
			var presenceOptions = driver.FindElement(By.Id("PresenceList"));
			var busyList = driver.FindElement(By.XPath("//*[@class='textNode'][text()='Busy']"));
			busyList.Click();
			IWebElement presenceBusyBtn = driver.FindElement(By.Id("CurrentStatus"));
			var presenceCurrentStatus = presenceBusyBtn.Text;
			Assert.AreEqual("Busy", presenceCurrentStatus);
			Thread.Sleep(5000);
			IWebElement presenceBusyButton = driver.FindElement(By.Id("CurrentStatus"));
			presenceBusyButton.Click();
			Thread.Sleep(5000);
			var presenceOfflineOptions = driver.FindElement(By.Id("PresenceList"));
			var presenceOfflineStatusBtn = driver.FindElement(By.XPath("//*[@class='textNode'][text()='Offline']"));
			presenceOfflineStatusBtn.Click();
			IWebElement presenceOfflineBtn = driver.FindElement(By.Id("CurrentStatus"));
			var presenceOfflineStatus = presenceOfflineBtn.Text;
			Assert.AreEqual("Offline", presenceOfflineStatus);
			Thread.Sleep(5000);
			IWebElement presenceOffineBtn = driver.FindElement(By.Id("CurrentStatus"));
			presenceOffineBtn.Click();
			Thread.Sleep(5000);
			var presenceAwayOptions = driver.FindElement(By.Id("PresenceList"));
			var PresenceAwayBtn = driver.FindElement(By.XPath("//*[@class='textNode'][text()='Away']"));
			PresenceAwayBtn.Click();
			IWebElement PresenceAwayStatusBtn = driver.FindElement(By.Id("CurrentStatus"));
			var presenceAwayStatus = PresenceAwayStatusBtn.Text;
			Assert.AreEqual("Away", presenceAwayStatus);
			Thread.Sleep(5000);
			IWebElement presenceonlineBtn = driver.FindElement(By.Id("CurrentStatus"));
			presenceonlineBtn.Click();
			Thread.Sleep(5000);
			var presenceOnlineOptions = driver.FindElement(By.Id("PresenceList"));
			var PresenceAvailableBtn = driver.FindElement(By.XPath("//*[@class='textNode'][text()='Available']"));
			PresenceAvailableBtn.Click();
			IWebElement PresenceOnlineStatusBtn = driver.FindElement(By.Id("CurrentStatus"));
			var PresenceOnlineStatus = PresenceOnlineStatusBtn.Text;
			Assert.AreEqual("Available", PresenceOnlineStatus);
			isPresence = false;
		}

		[TestMethod(), TestCategory("VerifyConversationChatControl")]
		public void verifyConversationChatControl()
		{
			helper.LaunchConversationControl(driver, "Customer Service Hub");
			Thread.Sleep(5000);
			helper.SwitchToOnlineChatPortal(driver);
			IWebElement toastWindow = driver.FindElement(By.Id("CIFToastDiv_1"));
			Assert.IsNotNull(toastWindow);
			Thread.Sleep(5000);
			IWebElement acceptButton = driver.FindElement(By.XPath("//*[@id='CIFToastDiv_1']/div[4]/button[1]"));
			acceptButton.Click();
			Thread.Sleep(5000);
			driver.SwitchTo().Frame(driver.FindElement(By.XPath("//*[@id='widgetControlDiv']/div/iframe")));
			Thread.Sleep(5000);
			IWebElement ConversationContainer = driver.FindElement(By.Id("conversation-container"));
			Thread.Sleep(5000);
			var ConversationContainerDisplay = ConversationContainer.Displayed;
			Assert.IsTrue(ConversationContainerDisplay, "conversation control is not loading properly");
			Thread.Sleep(5000);
			IWebElement ChatHeader = driver.FindElement(By.XPath("//*[@id='moving-window']"));
			var chatHeaderDisplay = ChatHeader.Displayed;
			Assert.IsTrue(chatHeaderDisplay, "Chat Header is not loading properly");
			Thread.Sleep(5000);
			var ChatFooter = driver.FindElement(By.XPath("//*[@id='conversation-container']/div[3]"));
			var ChatFooterDisplay = ChatFooter.Displayed;
			Assert.IsTrue(ChatFooterDisplay, "Chat Footer is not loading properly");
		}

	}
}