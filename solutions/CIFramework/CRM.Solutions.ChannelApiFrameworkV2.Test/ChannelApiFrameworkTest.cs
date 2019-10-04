using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenQA.Selenium.Support.UI;
using CRM.Solutions.ChannelApiFrameworkV2.Test.Utility;
using CRM.Solutions.ChannelApiFrameworkV2.Test;
using Newtonsoft.Json;
using System.Threading;
using Microsoft.Crm.QA.Utf;
using Microsoft.Crm.Sdk.Samples;

namespace CRM.Solutions.ChannelApiFrameworkV2.Test
{
	[TestClass]
	public class ChannelApiFrameworkTest : TestCasesBase
	{
		public ChannelApiFrameworkHelper helper = new ChannelApiFrameworkHelper();
		public WorkWithSolutions wws = new WorkWithSolutions();

		[TestMethod(), TestCategory("CreateSession")]
		public void verifyCreateSessionScenario()
		{
			Guid contactId = Guid.Empty;
			Guid caseId = Guid.Empty;
			try
			{
				helper.LaunchWidget(driver, Constants.CONSOLE_APP);
				Log.Comment("Side panel widget launched");
				var contactName = Constants.Test_Contact;
				var caseName = Constants.Test_Case1;
				contactId = WorkWithSolutions.createContact(contactName);
				Log.Comment("Contact ID : "+ contactId);
                caseId = WorkWithSolutions.createCase(caseName, contactId);
				Log.Comment("Case ID : " + caseId.ToString());
				string inputJson = helper.getJson(Constants.CREATE_SESSION, caseId.ToString());
				string outputJson = helper.PerformAction(driver, inputJson);
				Log.Comment("Got the output result for create a session");
				driver.SwitchTo().DefaultContent();
				Thread.Sleep(3000);
				var newSession = driver.FindElements(By.XPath(string.Format("//*[@data-id='{0}']", outputJson)));
				Log.Comment("New session element: " + newSession[0]);
				Assert.IsTrue(newSession.Count > 0, "New Session was not created");
				var sessionName = driver.FindElement(By.XPath("//*[@id='tab-wrapper-tab-id-1']/div/span"));
				Assert.IsTrue(sessionName.Text == "Case 1", "Session name is incorrect");
			}
			catch(Exception ex)
			{
				Log.Comment("Exception message "+ ex.Message);
				throw ex;
			}
			finally
			{
				if (caseId != Guid.Empty)
					WorkWithSolutions.deleteRecord("incident", caseId);
				if (contactId != Guid.Empty)
					WorkWithSolutions.deleteRecord("contact", contactId);
			}
		}

		[TestMethod(), TestCategory("getFocusedSession")]
		public void verifyGetFocusedSessionScenario()
		{
			Guid contactId = Guid.Empty;
            Guid caseId = Guid.Empty;
            try
			{
				helper.LaunchWidget(driver, Constants.CONSOLE_APP);
				Log.Comment("Side panel widget launched");
				var contactName = Constants.Test_Contact;
				var caseName = Constants.Test_Case1;
				contactId = WorkWithSolutions.createContact(contactName);
				Log.Comment("Contact ID : " + contactId);
				caseId = WorkWithSolutions.createCase(caseName, contactId);
				Log.Comment("Case ID : " + caseId);
				string inputJson = helper.getJson(Constants.CREATE_SESSION, caseId.ToString());
				string outputJson = helper.PerformAction(driver, inputJson);
				Log.Comment("Got the output result for create a session");
				driver.SwitchTo().DefaultContent();
				Thread.Sleep(3000);
				var newSession = driver.FindElements(By.XPath(string.Format("//*[@data-id='{0}']", outputJson)));
				Assert.IsTrue(newSession.Count > 0, "New Session was not created");
				var sessionName = driver.FindElement(By.XPath("//*[@id='tab-wrapper-tab-id-1']/div/span"));
				Assert.IsTrue(sessionName.Text == "Case 1", "Session name is incorrect");
				string getFocusInputJson = helper.getJson(Constants.GET_FOCUSED_SESSION);
				driver.SwitchTo().Frame(driver.FindElement(By.Id("SidePanelIFrame")));
				Thread.Sleep(3000);
				driver.SwitchTo().Frame(driver.FindElement(By.XPath("//*[@id='widgetControlDiv']/div/iframe")));
				Thread.Sleep(3000);
				string getFocusOutputJson = helper.PerformAction(driver, getFocusInputJson);
				Log.Comment("Got the output result for getting the focus session");
				Assert.AreEqual(outputJson, getFocusOutputJson, "The focused sesion is not correct");
			}
			catch (Exception ex)
			{
				Log.Comment("Exception message " + ex.Message);
				throw ex;
			}
			finally
			{
				if (caseId != Guid.Empty)
					WorkWithSolutions.deleteRecord("incident", caseId);
				if (contactId != Guid.Empty)
					WorkWithSolutions.deleteRecord("contact", contactId);
			}
		}

		[TestMethod(), TestCategory("getAllSessions")]
		public void verifyGetAllSessionsScenario()
		{
			Guid contactId = Guid.Empty;
			Guid caseId = Guid.Empty;
			try
			{
				helper.LaunchWidget(driver, Constants.CONSOLE_APP);
				Log.Comment("Side panel widget launched");
				var contactName = Constants.Test_Contact;
				var caseName = Constants.Test_Case1;
				contactId = WorkWithSolutions.createContact(contactName);
				Log.Comment("Contact ID : " + contactId);
                caseId = WorkWithSolutions.createCase(caseName, contactId);
				Log.Comment("Case ID : " + caseId.ToString());
				string inputJson = helper.getJson(Constants.CREATE_SESSION, caseId.ToString());
				string outputJson1 = helper.PerformAction(driver, inputJson);
				Log.Comment("Got the output result for create a first session");
				Thread.Sleep(3000);
				string outputJson2 = helper.PerformAction(driver, inputJson);
				Log.Comment("Got the output result for create a second session");
				driver.SwitchTo().DefaultContent();
				Thread.Sleep(3000);
				var newSession1 = driver.FindElements(By.XPath(string.Format("//*[@data-id='{0}']", outputJson1)));
				Assert.IsTrue(newSession1.Count > 0, "First new session was not created");
				var newSession2 = driver.FindElements(By.XPath(string.Format("//*[@data-id='{0}']", outputJson2)));
				Assert.IsTrue(newSession2.Count > 0, "Second new session was not created");
				string getAllSessionInputJson = helper.getJson(Constants.GET_ALL_SESSIONS);
				driver.SwitchTo().Frame(driver.FindElement(By.Id("SidePanelIFrame")));
				Thread.Sleep(3000);
				driver.SwitchTo().Frame(driver.FindElement(By.XPath("//*[@id='widgetControlDiv']/div/iframe")));
				Thread.Sleep(3000);
				string getAllSessionOutputJson = helper.PerformAction(driver, getAllSessionInputJson);
				Log.Comment("Got the output result for getting all the sessions");
				Assert.AreEqual(getAllSessionOutputJson, outputJson1 + Constants.COMMA_SEPERATOR + outputJson2, "Get all sessions failed");
			}
			catch (Exception ex)
			{
				Log.Comment("Exception message " + ex.Message);
				throw ex;
			}
			finally
			{
				if (caseId != Guid.Empty)
					WorkWithSolutions.deleteRecord("incident", caseId);
				if (contactId != Guid.Empty)
					WorkWithSolutions.deleteRecord("contact", contactId);
			}
		}

		[TestMethod(), TestCategory("requestFocusSession")]
		public void verifyRequestFocusSessionScenario()
		{
			Guid contactId = Guid.Empty;
			Guid caseId = Guid.Empty;
            string OUPUT_JSON_1 = "";
            try
			{
				helper.LaunchWidget(driver, Constants.CONSOLE_APP);
				Log.Comment("Side panel widget launched");
				var contactName = Constants.Test_Contact;
				var caseName = Constants.Test_Case1;
				contactId = WorkWithSolutions.createContact(contactName);
				Log.Comment("Contact ID : " + contactId);
                caseId = WorkWithSolutions.createCase(caseName, contactId);
				Log.Comment("Case ID : " + caseId.ToString());
				string inputJson = helper.getJson(Constants.CREATE_SESSION, caseId.ToString());
				OUPUT_JSON_1 = helper.PerformAction(driver, inputJson);
				Log.Comment("Got the output result for create a first session");
				Thread.Sleep(3000);
				string outputJson2 = helper.PerformAction(driver, inputJson);
				Log.Comment("Got the output result for create a second session");
				driver.SwitchTo().DefaultContent();
				Thread.Sleep(3000);
				var newSession1 = driver.FindElements(By.XPath(string.Format("//*[@data-id='{0}']", OUPUT_JSON_1)));
				Log.Comment("New session element: " + newSession1[0]);
				Assert.IsTrue(newSession1.Count > 0, "First new session was not created");
				var newSession2 = driver.FindElements(By.XPath(string.Format("//*[@data-id='{0}']", outputJson2)));
				Log.Comment("New session element: " + newSession2[0]);
				Assert.IsTrue(newSession2.Count > 0, "Second new session was not created");
				string requestFocusInputJson = helper.getJson(Constants.REQUEST_FOCUS_SESSION, OUPUT_JSON_1);
				driver.SwitchTo().Frame(driver.FindElement(By.Id("SidePanelIFrame")));
				Thread.Sleep(3000);
				driver.SwitchTo().Frame(driver.FindElement(By.XPath("//*[@id='widgetControlDiv']/div/iframe")));
				Thread.Sleep(3000);
				helper.PerformAction(driver, requestFocusInputJson);
				Thread.Sleep(3000);
				driver.SwitchTo().DefaultContent();
				Thread.Sleep(3000);
				var focusedSession = driver.FindElement(By.XPath("//*[@data-id='session-id-1-indicator']"));
				Log.Comment("Focused session element: " + focusedSession);
				Assert.IsTrue(focusedSession.Displayed, "The requested session was not focused properly");
			}
			catch (Exception ex)
			{
				Log.Comment("Exception message " + ex.Message);
				throw ex;
			}
			finally
			{
				if (caseId != Guid.Empty)
					WorkWithSolutions.deleteRecord("incident", caseId);
				if (contactId != Guid.Empty)
					WorkWithSolutions.deleteRecord("contact", contactId);
			}
		}

		[TestMethod(), TestCategory("canCreateSession")]
		public void verifyCanCreateSessionScenario()
		{
			helper.LaunchWidget(driver, Constants.CONSOLE_APP);
			Log.Comment("Side panel widget launched");
			string inputJson = helper.getJson(Constants.CAN_CREATE_SESSION);
			string outputJson = helper.PerformAction(driver, inputJson);
			Log.Comment("Got the output result for can create session");
			driver.SwitchTo().DefaultContent();
			Thread.Sleep(3000);
			Assert.AreEqual("true", outputJson, "Can create a session api not working properly");
		}

		[TestMethod(), TestCategory("getSession")]
		public void verifyGetSessionScenario()
		{
			Guid contactId = Guid.Empty;
			Guid caseId = Guid.Empty;
            string OUPUT_JSON_1 = "";
            try
			{
				helper.LaunchWidget(driver, Constants.CONSOLE_APP);
				Log.Comment("Side panel widget launched");
				var contactName = Constants.Test_Contact;
				var caseName = Constants.Test_Case1;
				contactId = WorkWithSolutions.createContact(contactName);
				Log.Comment("Contact ID : " + contactId);
                caseId = WorkWithSolutions.createCase(caseName, contactId);
				Log.Comment("Case ID : " + caseId.ToString());
				string inputJson = helper.getJson(Constants.CREATE_SESSION);
				OUPUT_JSON_1 = helper.PerformAction(driver, inputJson);
				Log.Comment("Got the output result for create a session");
				driver.SwitchTo().DefaultContent();
				Thread.Sleep(3000);
				var newSession = driver.FindElements(By.XPath(string.Format("//*[@data-id='{0}']", OUPUT_JSON_1)));
				Assert.IsTrue(newSession.Count > 0, "New Session was not created");
				string getSessionInputJson = helper.getJson(Constants.GET_SESSION, OUPUT_JSON_1);
				driver.SwitchTo().Frame(driver.FindElement(By.Id("SidePanelIFrame")));
				Thread.Sleep(3000);
				driver.SwitchTo().Frame(driver.FindElement(By.XPath("//*[@id='widgetControlDiv']/div/iframe")));
				Thread.Sleep(3000);
				string getSessionOutputJson = helper.PerformAction(driver, getSessionInputJson);
				Log.Comment("Got the parameters for get session");
				Assert.AreEqual(getSessionOutputJson, OUPUT_JSON_1, "Not able to get the current focused session");
			}
			catch (Exception ex)
			{
				Log.Comment("Exception message " + ex.Message);
				throw ex;
			}
			finally
			{
				if (caseId != Guid.Empty)
					WorkWithSolutions.deleteRecord("incident", caseId);
				if (contactId != Guid.Empty)
					WorkWithSolutions.deleteRecord("contact", contactId);
			}

		}

		[TestMethod(), TestCategory("createAndFocusTab")]
		public void verifyCreateAndFocusTabScenarios()
		{
			Guid contactId = Guid.Empty;
			Guid caseId = Guid.Empty;
            string TAB_OUTPUT_JSON = "";
            try
			{
				helper.LaunchWidget(driver, Constants.CONSOLE_APP);
				Log.Comment("Side panel widget launched");
				var contactName = Constants.Test_Contact;
				var caseName = Constants.Test_Case1;
				contactId = WorkWithSolutions.createContact(contactName);
				Log.Comment("Contact ID : " + contactId);
                caseId = WorkWithSolutions.createCase(caseName, contactId);
				Log.Comment("Case ID : " + caseId.ToString());
				string inputJson = helper.getJson(Constants.CREATE_SESSION, caseId.ToString());
				string outputJson = helper.PerformAction(driver, inputJson);
				Log.Comment("Got the output result for create a session");
				string createTabInputJson = helper.getJson(Constants.CREATE_TAB, caseId.ToString());
				driver.SwitchTo().DefaultContent();
				driver.SwitchTo().Frame(driver.FindElement(By.Id("SidePanelIFrame")));
				Thread.Sleep(3000);
				driver.SwitchTo().Frame(driver.FindElement(By.XPath("//*[@id='widgetControlDiv']/div/iframe")));
				Thread.Sleep(3000);
				TAB_OUTPUT_JSON = helper.PerformAction(driver, createTabInputJson);
				Log.Comment("Got the output results for creating the tab");
				driver.SwitchTo().DefaultContent();
				Thread.Sleep(3000);
				var newTab = driver.FindElements(By.XPath(string.Format("//*[@data-id='{0}']", TAB_OUTPUT_JSON)));
				Assert.IsTrue(newTab.Count > 0, "New tab was not created");
				var tabName = driver.FindElement(By.XPath("//*[@id='tab-wrapper-tab-id-2']/div/span"));
				Assert.IsTrue(tabName.Text == "Tab", "Tab name is incorrect");
				driver.SwitchTo().Frame(driver.FindElement(By.Id("SidePanelIFrame")));
				Thread.Sleep(3000);
				driver.SwitchTo().Frame(driver.FindElement(By.XPath("//*[@id='widgetControlDiv']/div/iframe")));
				Thread.Sleep(3000);
				string tab2OutputJson = helper.PerformAction(driver, createTabInputJson);
				Log.Comment("Got the output results for creating the tab");
				driver.SwitchTo().DefaultContent();
				Thread.Sleep(3000);
				var newTab2 = driver.FindElements(By.XPath(string.Format("//*[@data-id='{0}']", tab2OutputJson)));
				Log.Comment("new tab element is: " + newTab);
				Assert.IsTrue(newTab.Count > 0, "New tab was not created");
				string focusTabInputJson = helper.getJson(Constants.FOCUS_TAB, TAB_OUTPUT_JSON);
				driver.SwitchTo().Frame(driver.FindElement(By.Id("SidePanelIFrame")));
				Thread.Sleep(3000);
				driver.SwitchTo().Frame(driver.FindElement(By.XPath("//*[@id='widgetControlDiv']/div/iframe")));
				Thread.Sleep(3000);
				string focusTabOutputJson = helper.PerformAction(driver, focusTabInputJson);
				Log.Comment("Got the output results for focus the tab");
				Assert.AreEqual(focusTabOutputJson, "null", "The tab was not focused properly");
				string getFocusedTabInputJson = helper.getJson(Constants.GET_FOCUSED_TAB);
				Log.Comment("Got the parameters to get the focus tab");
				string getFocusedTabOutputJson = helper.PerformAction(driver, getFocusedTabInputJson);
				Log.Comment("Got the output results for get the focus tab");
				Assert.AreEqual(TAB_OUTPUT_JSON, getFocusedTabOutputJson, "Failed to get the focused tab");
			}
			catch (Exception ex)
			{
				Log.Comment("Exception message " + ex.Message);
				throw ex;
			}
			finally
			{
				if (caseId != Guid.Empty)
					WorkWithSolutions.deleteRecord("incident", caseId);
				if (contactId != Guid.Empty)
					WorkWithSolutions.deleteRecord("contact", contactId);
			}
		}

		[TestMethod(), TestCategory("createAndFocusTab")]
		public void verifyRefreshTab()
		{
			Guid contactId = Guid.Empty;
			Guid caseId = Guid.Empty;
            string TAB_OUTPUT_JSON = "";
            try
			{
				helper.LaunchWidget(driver, Constants.CONSOLE_APP);
				Log.Comment("Side panel widget launched");
				var contactName = Constants.Test_Contact;
				var caseName = Constants.Test_Case1;
				contactId = WorkWithSolutions.createContact(contactName);
				Log.Comment("Contact ID : " + contactId);
                caseId = WorkWithSolutions.createCase(caseName, contactId);
				Log.Comment("Case ID : " + caseId.ToString());
				string inputJson = helper.getJson(Constants.CREATE_SESSION, caseId.ToString());
				string outputJson = helper.PerformAction(driver, inputJson);
				Log.Comment("Got the output result for create a session");
				driver.SwitchTo().DefaultContent();
				Thread.Sleep(3000);
				string createTabInputJson = helper.getJson(Constants.CREATE_TAB, caseId.ToString());
				driver.SwitchTo().DefaultContent();
				driver.SwitchTo().Frame(driver.FindElement(By.Id("SidePanelIFrame")));
				Thread.Sleep(3000);
				driver.SwitchTo().Frame(driver.FindElement(By.XPath("//*[@id='widgetControlDiv']/div/iframe")));
				Thread.Sleep(3000);
				TAB_OUTPUT_JSON = helper.PerformAction(driver, createTabInputJson);
				Log.Comment("Got the output results for creating the tab");
				driver.SwitchTo().DefaultContent();
				Thread.Sleep(3000);
				var newTab = driver.FindElements(By.XPath(string.Format("//*[@data-id='{0}']", TAB_OUTPUT_JSON)));
				Assert.IsTrue(newTab.Count > 0, "New tab was not created");
				driver.SwitchTo().Frame(driver.FindElement(By.Id("SidePanelIFrame")));
				Thread.Sleep(3000);
				driver.SwitchTo().Frame(driver.FindElement(By.XPath("//*[@id='widgetControlDiv']/div/iframe")));
				Thread.Sleep(3000);
				string refreshTab = helper.getJson(Constants.REFRESH_TAB, TAB_OUTPUT_JSON);
				driver.SwitchTo().DefaultContent();
				driver.SwitchTo().Frame(driver.FindElement(By.Id("SidePanelIFrame")));
				Thread.Sleep(3000);
				driver.SwitchTo().Frame(driver.FindElement(By.XPath("//*[@id='widgetControlDiv']/div/iframe")));
				Thread.Sleep(3000);
				string refreshTabOutputJson = helper.PerformAction(driver, refreshTab);
				Assert.AreEqual(refreshTabOutputJson, "null", "The tab was not focused properly");
			}
			catch (Exception ex)
			{
				Log.Comment("Exception message " + ex.Message);
				throw ex;
			}
			finally
			{
				if (caseId != Guid.Empty)
					WorkWithSolutions.deleteRecord("incident", caseId);
				if (contactId != Guid.Empty)
					WorkWithSolutions.deleteRecord("contact", contactId);
			}
		}

		[TestMethod(), TestCategory("createAndFocusTab")]
		public void verifySetTabTitle()
		{
			Guid contactId = Guid.Empty;
			Guid caseId = Guid.Empty;
            string TAB_OUTPUT_JSON = "";
            try
			{
				helper.LaunchWidget(driver, Constants.CONSOLE_APP);
				Log.Comment("Side panel widget launched");
				var contactName = Constants.Test_Contact;
				var caseName = Constants.Test_Case1;
				contactId = WorkWithSolutions.createContact(contactName);
				Log.Comment("Contact ID : " + contactId);
                caseId = WorkWithSolutions.createCase(caseName, contactId);
				Log.Comment("Case ID : " + caseId.ToString());
				string inputJson = helper.getJson(Constants.CREATE_SESSION, caseId.ToString());
				string outputJson = helper.PerformAction(driver, inputJson);
				Log.Comment("Got the output result for create a session");
				driver.SwitchTo().DefaultContent();
				Thread.Sleep(3000);
				var newSession = driver.FindElements(By.XPath(string.Format("//*[@data-id='{0}']", outputJson)));
				Log.Comment("New session element: " + newSession[0]);
				Assert.IsTrue(newSession.Count > 0, "New Session was not created");
				string createTabInputJson = helper.getJson(Constants.CREATE_TAB);
				driver.SwitchTo().DefaultContent();
				driver.SwitchTo().Frame(driver.FindElement(By.Id("SidePanelIFrame")));
				Thread.Sleep(3000);
				driver.SwitchTo().Frame(driver.FindElement(By.XPath("//*[@id='widgetControlDiv']/div/iframe")));
				Thread.Sleep(3000);
				TAB_OUTPUT_JSON = helper.PerformAction(driver, createTabInputJson);
				Log.Comment("Got the output results for creating the tab");
				driver.SwitchTo().DefaultContent();
				Thread.Sleep(3000);
				var newTab = driver.FindElements(By.XPath(string.Format("//*[@data-id='{0}']", TAB_OUTPUT_JSON)));
				Assert.IsTrue(newTab.Count > 0, "New tab was not created");
                Log.Comment("new tab element is: " + newTab);
                driver.SwitchTo().Frame(driver.FindElement(By.Id("SidePanelIFrame")));
				Thread.Sleep(3000);
				driver.SwitchTo().Frame(driver.FindElement(By.XPath("//*[@id='widgetControlDiv']/div/iframe")));
				Thread.Sleep(3000);
				string setTab = helper.getJson(Constants.SET_TAB_TITLE, TAB_OUTPUT_JSON);
				string outputJsonSetTab = helper.PerformAction(driver, setTab);
				Log.Comment("Got the output result to set tab title");
				Assert.IsTrue(outputJsonSetTab == "NewTab", "Tab title is not set");
				driver.SwitchTo().DefaultContent();
				Thread.Sleep(2000);
				var tabName = driver.FindElement(By.XPath("//*[@id='tab-wrapper-tab-id-2']/div/span"));
				Assert.IsTrue(tabName.Text == "NewTab", "Tab name is incorrect");
			}
			catch (Exception ex)
			{
				Log.Comment("Exception message " + ex.Message);
				throw ex;
			}
			finally
			{
				if (caseId != Guid.Empty)
					WorkWithSolutions.deleteRecord("incident", caseId);
				if (contactId != Guid.Empty)
					WorkWithSolutions.deleteRecord("contact", contactId);
			}
		}

		[TestMethod(), TestCategory("createAndFocusTab")]
		public void varifySetSessionTitle()
		{
			Guid contactId = Guid.Empty;
			Guid caseId = Guid.Empty;
			try
			{
				helper.LaunchWidget(driver, Constants.CONSOLE_APP);
				Log.Comment("Side panel widget launched");
				var contactName = Constants.Test_Contact;
				var caseName = Constants.Test_Case1;
				contactId = WorkWithSolutions.createContact(contactName);
				Log.Comment("Contact ID : " + contactId);
                caseId = WorkWithSolutions.createCase(caseName, contactId);
				Log.Comment("Case ID : " + caseId.ToString());
				string inputJson = helper.getJson(Constants.CREATE_SESSION, caseId.ToString());
				string outputJson = helper.PerformAction(driver, inputJson);
				Log.Comment("Got the output result for create a session");
				driver.SwitchTo().DefaultContent();
				Thread.Sleep(3000);
				var newSession = driver.FindElements(By.XPath(string.Format("//*[@data-id='{0}']", outputJson)));
				Assert.IsTrue(newSession.Count > 0, "New Session was not created");
                driver.SwitchTo().Frame(driver.FindElement(By.Id("SidePanelIFrame")));
				Thread.Sleep(3000);
				driver.SwitchTo().Frame(driver.FindElement(By.XPath("//*[@id='widgetControlDiv']/div/iframe")));
				Thread.Sleep(3000);
				string updateSessionTitle = helper.getJson(Constants.SET_SESSION_TITLE, caseId.ToString());
				string outputUpdateSessionTitle = helper.PerformAction(driver, updateSessionTitle);
				Log.Comment("Got the output result for updating a session");
				Assert.IsTrue(outputUpdateSessionTitle == "New Case", "Session title was not set");
				driver.SwitchTo().DefaultContent();
				Thread.Sleep(3000);
				var sessionName = driver.FindElement(By.XPath("//*[@id='session-list-id']/li[2]/span"));
				Assert.IsTrue(sessionName.Text == "New Case", "Session name is incorrect");

			}
			catch (Exception ex)
			{
				Log.Comment("Exception message " + ex.Message);
				throw ex;
			}
			finally
			{
				if (caseId != Guid.Empty)
					WorkWithSolutions.deleteRecord("incident", caseId);
				if (contactId != Guid.Empty)
					WorkWithSolutions.deleteRecord("contact", contactId);
			}
		}

		[TestMethod(), TestCategory("getTabs")]
		public void verifyGetTabs()
		{
			Guid contactId = Guid.Empty;
			Guid caseId = Guid.Empty;
			try
			{
				helper.LaunchWidget(driver, Constants.CONSOLE_APP);
				Log.Comment("Side panel widget launched");
				var contactName = Constants.Test_Contact;
				var caseName = Constants.Test_Case1;
				contactId = WorkWithSolutions.createContact(contactName);
				Log.Comment("Contact ID : " + contactId);
                caseId = WorkWithSolutions.createCase(caseName, contactId);
				Log.Comment("Case ID : " + caseId.ToString());
				string inputJson = helper.getJson(Constants.CREATE_SESSION, caseId.ToString());
				string outputJson = helper.PerformAction(driver, inputJson);
				Log.Comment("Got the output result for create a session");
				driver.SwitchTo().DefaultContent();
				Thread.Sleep(3000);
				var newSession = driver.FindElements(By.XPath(string.Format("//*[@data-id='{0}']", outputJson)));
				Assert.IsTrue(newSession.Count > 0, "New Session was not created");
				driver.SwitchTo().Frame(driver.FindElement(By.Id("SidePanelIFrame")));
				Thread.Sleep(3000);
				driver.SwitchTo().Frame(driver.FindElement(By.XPath("//*[@id='widgetControlDiv']/div/iframe")));
				Thread.Sleep(3000);
				string getTabs = helper.getJson(Constants.GET_TABS);
				string outputGetTabs = helper.PerformAction(driver, getTabs);
				Log.Comment("Got the output result for get Tabs" + outputGetTabs);
				Assert.IsTrue(outputGetTabs == "tab-id-1", "Did not get Tabs by name");
			}
			catch (Exception ex)
			{
				Log.Comment("Exception message " + ex.Message);
				throw ex;
			}
			finally
			{
				if (caseId != Guid.Empty)
					WorkWithSolutions.deleteRecord("incident", caseId);
				if (contactId != Guid.Empty)
					WorkWithSolutions.deleteRecord("contact", contactId);
			}
		}
	}
}
