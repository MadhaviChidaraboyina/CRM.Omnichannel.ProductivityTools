using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenQA.Selenium.Support.UI;
using CRM.Solutions.ChannelApiFramework.Test.Utility;
using CRM.Solutions.ChannelApiFramework.Test;
using Newtonsoft.Json;
using System.Threading;

namespace CRM.Solutions.ChannelApiFramework.Test
{
	[TestClass]
	public class ChannelApiFrameworkTest : TestCasesBase
	{
		public ChannelApiFrameworkHelper helper = new ChannelApiFrameworkHelper();

		[TestMethod(), TestCategory("CIFGetEnv")]
		public void VerifyGetEnvironmentScenario()
		{
			helper.LaunchConversationControl(driver);
			string inputJson = helper.getJson(Constants.GET_ENVIRONENT);
			string outputJson = helper.PerformAction(driver, inputJson);
			Dictionary<String, Object> result = JsonConvert.DeserializeObject<Dictionary<String, Object>>(outputJson);
			Assert.IsNotNull(result["username"]);
			Assert.IsNotNull(result["appid"]);
			Assert.IsNotNull(result["appUrl"]);
		}

		[TestMethod(), TestCategory("CIFCreateUpdateRetrieveDelete")]
		public void VerifyCreateUpdateRetrieveDeleteScenario()
		{
			helper.LaunchConversationControl(driver);
			string inputJson = helper.getJson(Constants.CREATE_RECORD);
			string outputJson = helper.PerformAction(driver, inputJson);
			Dictionary<String, Object> outputJsonObj = JsonConvert.DeserializeObject<Dictionary<String, Object>>(outputJson);
			string AccountID = (string)outputJsonObj["id"];
			Assert.IsNotNull(AccountID);

			string retrieveInputJson = helper.getJson(Constants.RETRIEVE_RECORD, AccountID);
			string retrieveOutputJson = helper.PerformAction(driver, retrieveInputJson);
			Dictionary<String, Object> getClickOutputJsonObj = JsonConvert.DeserializeObject<Dictionary<String, Object>>(retrieveOutputJson);
			Assert.AreEqual(getClickOutputJsonObj["name"], "Sample Account");

			string updateInputJson = helper.getJson(Constants.UPDATE_RECORD, AccountID);
			string updateJsonOutputJson = helper.PerformAction(driver, updateInputJson);
			Dictionary<String, Object> updateJsonOutputJsonObj = JsonConvert.DeserializeObject<Dictionary<String, Object>>(updateJsonOutputJson);
			string AccountUpdateID = (string)updateJsonOutputJsonObj["id"];
			Assert.AreEqual(AccountID, AccountUpdateID,"Update record test case failed");

			string deleteInputJson = helper.getJson(Constants.DELETE_RECORD, AccountID);
			string deleteOutputJson = helper.PerformAction(driver, deleteInputJson);
			Dictionary<String, Object> deleteOutputJsonOutputJsonObj = JsonConvert.DeserializeObject<Dictionary<String, Object>>(deleteOutputJson);
			string AccountDeleteID = (string)deleteOutputJsonOutputJsonObj["id"];
			Assert.AreEqual(AccountID, AccountDeleteID, "Delete record test case failed");
		}

		[TestMethod(), TestCategory("CIFOpenForm")]
		public void VerifyOpenFormScenario()
		{
			helper.LaunchConversationControl(driver);
			string inputJson = helper.getJson(Constants.OPEN_FORM);
			string outputJson = helper.PerformAction(driver, inputJson);

			string inputGetJson = helper.getJson(Constants.GET_ENVIRONENT);
			string outputGetJson = helper.PerformAction(driver, inputGetJson);
			Dictionary<String, Object> result = JsonConvert.DeserializeObject<Dictionary<String, Object>>(outputGetJson);
			Assert.AreEqual(result["etn"], "contact", "OpenForm test case failed");
		}

		[TestMethod(), TestCategory("CIFSearchandOpen")]
		public void VerifySearchAndOpenScenario()
		{
			helper.LaunchConversationControl(driver);
			string inputJson = helper.getJson(Constants.CREATE_RECORD);
			string outputJson = helper.PerformAction(driver, inputJson);

			string searchJson = helper.getJson(Constants.OPEN_SEARCH_RECORDS);
			string outputSearchJson = helper.PerformAction(driver, searchJson);
			Dictionary<String, Object> result = JsonConvert.DeserializeObject<Dictionary<String, Object>>(outputSearchJson);
			Assert.IsNotNull(result);
		}

		[TestMethod(), TestCategory("CIFAddRemoveHandler")]
		public void VerifyAddRemoveHandlerScenario()
		{
			helper.LaunchConversationControl(driver);
			string inputJson = helper.getJson(Constants.ADD_HANDLER);
			string outputJson = helper.PerformAction(driver, inputJson);
			Assert.AreEqual(Constants.EVENT_ADDED_ASSERT, outputJson, "AddHandler test case failed");

			driver.SwitchTo().DefaultContent();
			Thread.Sleep(3000);
			var sidePanelButton = driver.FindElement(By.XPath("//*[@data-id='expand-collapse-button-sidepanel']"));
			sidePanelButton.Click();

			//For showing Clicking Again
			Thread.Sleep(5000);
			sidePanelButton = driver.FindElement(By.XPath("//*[@data-id='expand-collapse-button-sidepanel']"));
			sidePanelButton.Click();

			driver.SwitchTo().Frame(driver.FindElement(By.Id("SidePanelIFrame")));
			Thread.Sleep(3000);
			driver.SwitchTo().Frame(driver.FindElement(By.XPath("//*[@id='widgetControlDiv']/div/iframe")));
			Thread.Sleep(3000);
			string outputString = helper.clearTextBoxesHelper(driver);
			Assert.AreEqual(Constants.GET_MODE_ASSERT_VALUE_1, outputString);

			driver.SwitchTo().DefaultContent();
			Thread.Sleep(3000);

			driver.SwitchTo().Frame(driver.FindElement(By.Id("SidePanelIFrame")));
			Thread.Sleep(3000);
			driver.SwitchTo().Frame(driver.FindElement(By.XPath("//*[@id='widgetControlDiv']/div/iframe")));
			Thread.Sleep(3000);
			string inputRemoveJson = helper.getJson(Constants.REMOVE_HANDLER);
			string outputRemoveJson = helper.PerformAction(driver, inputRemoveJson);
			Assert.AreEqual(Constants.EVENT_REMOVED_ASSERT, outputRemoveJson);

			driver.SwitchTo().DefaultContent();
			Thread.Sleep(3000);
			sidePanelButton = driver.FindElement(By.XPath("//*[@data-id='expand-collapse-button-sidepanel']"));
			sidePanelButton.Click();

			Thread.Sleep(5000);
			sidePanelButton = driver.FindElement(By.XPath("//*[@data-id='expand-collapse-button-sidepanel']"));
			sidePanelButton.Click();

			driver.SwitchTo().Frame(driver.FindElement(By.Id("SidePanelIFrame")));
			Thread.Sleep(3000);
			driver.SwitchTo().Frame(driver.FindElement(By.XPath("//*[@id='widgetControlDiv']/div/iframe")));
			Thread.Sleep(3000);
			string getModeInputJson = helper.getJson(Constants.GET_MODE);
			string getModeOutputJson = helper.PerformAction(driver, getModeInputJson);
			Assert.AreEqual(Constants.GET_MODE_ASSERT_VALUE_1, getModeOutputJson, "RemoveHandler test case failed");
		}

		[TestMethod(), TestCategory("CIFGetSetModeAndGetSetWidth")]
		public void VerifygetSetModeAndGetSetWidthScenario()
		{
			helper.LaunchConversationControl(driver);
			string inputJson = helper.getJson(Constants.SET_MODE);
			string outputJson = helper.PerformAction(driver, inputJson);

			string inputwidthJson = helper.getJson(Constants.SET_WIDTH);
			string outputwidthJson = helper.PerformAction(driver, inputwidthJson);

			string getModeInputJson = helper.getJson(Constants.GET_MODE);
			string getModeOutputJson = helper.PerformAction(driver, getModeInputJson);
			Assert.AreEqual("1", getModeOutputJson, "Get Set Mode test case failed");

			string getWidthInputJson = helper.getJson(Constants.GET_WIDTH);
			string getWidthOutputJson = helper.PerformAction(driver, getWidthInputJson);
			Assert.AreEqual("300", getWidthOutputJson, "Get Set Width test case failed");
		}

		[TestMethod(), TestCategory("CIFGetSetModeAndGetSetClick")]
		public void VerifygetSetModeAndGetSetClickScenario()
		{
			helper.LaunchConversationControl(driver);
			string inputJson = helper.getJson(Constants.SET_MODE);
			string outputJson = helper.PerformAction(driver, inputJson);

			string inputSetClickJson = helper.getJson(Constants.SET_CLICKTO_ACT);
			string outputGetClickJson = helper.PerformAction(driver, inputSetClickJson);

			string getModeInputJson = helper.getJson(Constants.GET_MODE);
			string getModeOutputJson = helper.PerformAction(driver, getModeInputJson);
			Assert.AreEqual("1", getModeOutputJson, "Get Set Mode test case failed");

			string getClickInputJson = helper.getJson(Constants.GET_CLICKTO_ACT);
			string getClickOutputJson = helper.PerformAction(driver, getClickInputJson);
			Assert.IsTrue(getClickOutputJson == "true", "Test case " + (getClickOutputJson == "true"));
		}

		[TestMethod(), TestCategory("CIFSetModeFailure")]
		public void VerifySetModeFailureScenario()
		{
			helper.LaunchConversationControl(driver);
			string inputJson = helper.getJson(Constants.SET_MODE_FAILURE);
			string outputJson = helper.PerformAction(driver, inputJson);
			Dictionary<String, Object> updateJsonOutputJsonObj = JsonConvert.DeserializeObject<Dictionary<String, Object>>(outputJson);
			Assert.AreEqual("The setMode paramter value must be 0, 1 or 2.", updateJsonOutputJsonObj["message"], "Get Set Mode test case failed");
		}

		[TestMethod(), TestCategory("CIFSetWidthFailure")]
		public void VerifySetWidthFailureScenario()
		{
			helper.LaunchConversationControl(driver);
			string inputJson = helper.getJson(Constants.SET_WIDTH_FAILURE);
			string outputJson = helper.PerformAction(driver, inputJson);
			Dictionary<String, Object> updateJsonOutputJsonObj = JsonConvert.DeserializeObject<Dictionary<String, Object>>(outputJson);
			Assert.AreEqual("The setWidth parameter value is invalid. Provide a positive number to the parameter.", updateJsonOutputJsonObj["message"], "Get Set width test case failed");
		}

		[TestMethod(), TestCategory("CIFCreateRecordFailure")]
		public void VerifyCreateRecordFailureScenario()
		{
			helper.LaunchConversationControl(driver);
			string inputJson = helper.getJson(Constants.CREATE_RECORD_FAILURE);
			string outputJson = helper.PerformAction(driver, inputJson);
			Dictionary<String, Object> outputJsonObj = JsonConvert.DeserializeObject<Dictionary<String, Object>>(outputJson);
			Assert.AreEqual("Provide a value to the data parameter to create record.", outputJsonObj["message"], "Create record test case failed");
		}

		[TestMethod(), TestCategory("CIFUpdateRecordFailure")]
		public void VerifyUpdateRecordFailureScenario()
		{
			helper.LaunchConversationControl(driver);
			string inputJson = helper.getJson(Constants.CREATE_RECORD);
			string outputJson = helper.PerformAction(driver, inputJson);
			Dictionary<String, Object> outputJsonObj = JsonConvert.DeserializeObject<Dictionary<String, Object>>(outputJson);
			string AccountID = (string)outputJsonObj["id"];
			Assert.IsNotNull(AccountID);

			string updateInputJson = helper.getJson(Constants.UPDATE_RECORD_FAILURE, AccountID);
			string updateJsonOutputJson = helper.PerformAction(driver, updateInputJson);
			Dictionary<String, Object> updateJsonOutputJsonObj = JsonConvert.DeserializeObject<Dictionary<String, Object>>(updateJsonOutputJson);
			Assert.AreEqual("The data parameter is blank. Provide a value to the parameter to update the record.", updateJsonOutputJsonObj["message"], "Update record test case failed");
		}

		[TestMethod(), TestCategory("CIFRetrieveRecordFailure")]
		public void VerifyRetrieveRecordFailureScenario()
		{
			helper.LaunchConversationControl(driver);
			string inputJson = helper.getJson(Constants.CREATE_RECORD);
			string outputJson = helper.PerformAction(driver, inputJson);
			Dictionary<String, Object> outputJsonObj = JsonConvert.DeserializeObject<Dictionary<String, Object>>(outputJson);
			string AccountID = (string)outputJsonObj["id"];
			Assert.IsNotNull(AccountID);

			string retrieveInputJson = helper.getJson(Constants.RETRIEVE_RECORD_FAILURE, AccountID);
			string retrieveOutputJson = helper.PerformAction(driver, retrieveInputJson);
			Dictionary<String, Object> getClickOutputJsonObj = JsonConvert.DeserializeObject<Dictionary<String, Object>>(retrieveOutputJson);
			Assert.AreEqual("The EntityId parameter is blank. Provide a value to the parameter.", getClickOutputJsonObj["message"], "Retrieve record test case failed");
		}

		[TestMethod(), TestCategory("CIFGetEntityMetadata")]
		public void VerifyGetEntityMetadataScenario()
		{
			helper.LaunchConversationControl(driver);
			string inputJson = helper.getJson(Constants.GET_ENTITYMETADATA);
			string outputJson = helper.PerformAction(driver, inputJson);
			Dictionary<String, Object> getEntityMetaDataOutput = JsonConvert.DeserializeObject<Dictionary<String, Object>>(outputJson);
			Assert.AreEqual(getEntityMetaDataOutput["DisplayName"], "Account", "Get entity meta data test case failed");
			Assert.AreEqual(getEntityMetaDataOutput["DisplayCollectionName"], "Accounts", "Get entity meta data test case failed");
			Assert.AreEqual(getEntityMetaDataOutput["LogicalName"], "account", "Get entity meta data test case failed");
		}

	}
}
