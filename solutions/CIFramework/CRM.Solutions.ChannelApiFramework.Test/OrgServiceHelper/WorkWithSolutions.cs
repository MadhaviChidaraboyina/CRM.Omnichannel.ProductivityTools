
// =====================================================================
//
//  This file is part of the Microsoft Dynamics CRM SDK code samples.
//
//  Copyright (C) Microsoft Corporation.  All rights reserved.
//
//  This source code is intended only as a supplement to Microsoft
//  Development Tools and/or on-line documentation.  See these other
//  materials for detailed information regarding Microsoft code samples.
//
//  THIS CODE AND INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY
//  KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
//  IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//  PARTICULAR PURPOSE.
//
// =====================================================================
//<snippetWorkWithSolutions>
using System;
using System.Xml;
using System.ServiceModel;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System.IO;

// These namespaces are found in the Microsoft.Xrm.Sdk.dll assembly
// found in the SDK\bin folder.
using Microsoft.Xrm.Sdk.Client;

// This namespace is found in Microsoft.Crm.Sdk.Proxy.dll assembly
// found in the SDK\bin folder.
using Microsoft.Crm.Sdk.Messages;
using System.Collections.Generic;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Metadata;
using System.Text.RegularExpressions;
using OpenQA.Selenium;
using System.Threading;
using CRM.Solutions.ChannelApiFramework.Test;
using CRM.Solutions.ChannelApiFramework.Test.Utility;
using OpenQA.Selenium.Support.UI;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Microsoft.Crm.Sdk.Samples
{

	/// <summary>
	/// Demonstrates common tasks performed using Microsoft Dynamics CRM Solutions
	/// </summary>
	public class WorkWithSolutions
	{
		const int FAULT_EXCEPTION_EXIT_CODE = 1;
		const int TIMEOUT_EXCEPTION_EXIT_CODE = 2;
		const int GENERIC_EXCEPTION_EXIT_CODE = 3;

		private static IOrganizationService _sProxy;
		private static Guid _webResourceId;

		#region Main

		public static void ImportWebResource()
		{
			System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
			string ConfigurationFilePath = Environment.GetEnvironmentVariable("CONFIG_PATH");
			ServerConnection serverConnect = new ServerConnection();
			ServerConnection.Configuration config = serverConnect.GetServerConfiguration(ConfigurationFilePath);
			UploadWebResource(config);
		}
		private static string getEncodedFileContent(String resouceFileString)
		{
			var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(resouceFileString);
			return Convert.ToBase64String(plainTextBytes);
		}

		private static void UploadWebResource(ServerConnection.Configuration serverConfig)
		{
			_sProxy = new OrganizationServiceProxy(serverConfig.OrganizationUri, serverConfig.HomeRealmUri, serverConfig.Credentials, serverConfig.DeviceCredentials);

			string resouceFileString = CRM.Solutions.ChannelApiFramework.Test.Properties.Resources.CIFrameworkSelenium;

			var content = getEncodedFileContent(resouceFileString);
			Entity wr = new Entity("webresource");
			wr["content"] = content;
			wr["displayname"] = "CIFramework_Test_Case_Helper_File_V1";
			wr["description"] = "File required to run the automation test cases for CIFramework";
			wr["name"] = "CIFramework_Test_Case_Helper_File_V1";
			wr["webresourcetype"] = new OptionSetValue(1);
			QueryByAttribute qba = new QueryByAttribute("webresource");
			qba.ColumnSet = new ColumnSet(true);
			qba.AddAttributeValue("name", Constants.WEB_RESOURCE_NAME);
			if (_sProxy.RetrieveMultiple(qba).Entities.Count == 0)
			{
				_webResourceId = _sProxy.Create(wr);
			}
		}

		public static void RemoveWebResource()
		{
			if (_sProxy != null && _webResourceId != null && _webResourceId != Guid.Empty)
			{
				_sProxy.Delete("webresource", _webResourceId);
			}
		}


		public static void LaunchControl(IWebDriver driver, string AppModuleName)
		{
			driver.Manage().Timeouts().AsynchronousJavaScript = TimeSpan.FromSeconds(120);
			try
			{
				Constants.USER_NAME = ConfigUtil.Username;
				Constants.PASSWORD = ConfigUtil.Password;
				Constants.CLIENT_URL = ConfigUtil.RootDiscoveryServiceUrl;
				if (Constants.CLIENT_URL.IndexOf("http://") > -1)
				{
					string loginUrl = CreateURL(AppModuleName);

					IWait<IWebDriver> waitBeforeUrl = new DefaultWait<IWebDriver>(driver);
					waitBeforeUrl.PollingInterval = TimeSpan.FromMilliseconds(30000);
					driver.Navigate().GoToUrl(loginUrl);
					Thread.Sleep(5000);
					driver.Navigate().GoToUrl(Constants.CLIENT_URL);
				}
				else
				{
					Guid appId = GetAppID(AppModuleName);
					string loginUrl = Constants.CLIENT_URL + "/main.aspx?appid=" + appId;

					driver.Navigate().GoToUrl(loginUrl);
					Thread.Sleep(10000);
					if (driver.FindElements(By.Id("i0116")).Count == 1)
					{
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
				}
				Thread.Sleep(10000);
				Console.WriteLine("launching Conversation Control- " + Constants.CLIENT_URL);
			}
			catch (Exception ex)
			{
				Assert.IsTrue(false, "failed to launch Conversation Control");
				throw ex;
			}
		}

		private static string CreateURL(string appModuleName)
		{
			string httpString = "http://";
			string getUrl = Constants.CLIENT_URL.Replace(httpString, "");
			string loginUrl = "http://" + Constants.USER_NAME + ":" + Constants.PASSWORD + "@" + getUrl;

			Guid appId = GetAppID(appModuleName);
			Constants.CLIENT_URL += "/CITTest/main.aspx?appid=" + appId;
			loginUrl = string.Format("{0}/CITTest/main.aspx?appid={1}", loginUrl, appId);
			return loginUrl;

		}

		private static Guid GetAppID(string appModuleName)
		{
			Guid appId = Guid.Empty;

			QueryExpression orgQuery = new QueryExpression
			{
				EntityName = "organization",
				ColumnSet = new ColumnSet("organizationid"),
				Criteria = new FilterExpression
				{
					Conditions =
					{
						new ConditionExpression("organizationid", ConditionOperator.NotNull)
					}
				}
			};

			DataCollection<Entity> orgIdCollection = _sProxy.RetrieveMultiple(orgQuery).Entities;

			Guid OrgId = Guid.Empty;
			if (orgIdCollection.Count > 0)
			{
				OrgId = orgIdCollection[0].Id;
			}

			QueryExpression appModuleQuery = new QueryExpression
			{
				EntityName = "appmodule",
				ColumnSet = new ColumnSet("organizationid", "appmoduleid", "name"),
				Criteria = new FilterExpression
				{
					Conditions =
					{
						new ConditionExpression("organizationid", ConditionOperator.Equal, OrgId),
						new ConditionExpression("name", ConditionOperator.Equal, appModuleName)
					}
				}
			};

			DataCollection<Entity> services = _sProxy.RetrieveMultiple(appModuleQuery).Entities;

			if (services.Count > 0)
			{
				appId = services[0].Id;
			}
			return appId;
		}

		public static void CreateChannelApiFrameWorkEntity(IWebDriver driver)
		{
			LaunchControl(driver, Constants.CHANNEL_INTEGRATION_FRAMEWORK);
			CreateChannelApiFramworkEntityHelper(driver);
		}

		private static void CreateChannelApiFramworkEntityHelper(IWebDriver driver)
		{
			Thread.Sleep(10000);
			IWebElement CreateChannelButton = driver.FindElement(By.XPath("//*[@data-id='msdyn_ciprovider|NoRelationship|HomePageGrid|Mscrm.HomepageGrid.msdyn_ciprovider.NewRecord']"));
			CreateChannelButton.Click();
			Thread.Sleep(10000);

			string name = "CIF Test";
			IWebElement nameTextBox = driver.FindElement(By.XPath("//*[@data-id='msdyn_name.fieldControl-text-box-text']"));
			setInputValue(nameTextBox, name);

			IWebElement labelTextBox = driver.FindElement(By.XPath("//*[@data-id='msdyn_label.fieldControl-text-box-text']"));
			setInputValue(labelTextBox, name);

			IWebElement urlTextBox = driver.FindElement(By.XPath("//*[@data-id='msdyn_landingurl.fieldControl-url-text-input']"));
			if (Constants.CLIENT_URL.IndexOf("http://") > -1)
			{
				string url = ConfigUtil.RootDiscoveryServiceUrl + "/CITTest/WebResources/CIFramework_Test_Case_Helper_File_V1";
				setInputValue(urlTextBox, url);
			}
			else
			{
				string url = ConfigUtil.RootDiscoveryServiceUrl + "/WebResources/CIFramework_Test_Case_Helper_File_V1";
				setInputValue(urlTextBox, url);
			}

			Thread.Sleep(2000);
			IWebElement channelOrderTextBox = driver.FindElement(By.XPath("//*[@data-id='msdyn_sortorder.fieldControl-whole-number-text-input']"));
			setInputValue(channelOrderTextBox, "0");

			IWebElement channelSectionList = driver.FindElement(By.Id("_ledit"));
			string channelName = "Customer Service Hub";
			setInputValue(channelSectionList, channelName);
			Thread.Sleep(2000);

			IWebElement channelAppsList = driver.FindElement(By.Id("_selectAll"));
			channelAppsList.Click();
			Thread.Sleep(5000);


			IWebElement channelSaveButton = driver.FindElement(By.XPath("//*[@data-id='msdyn_ciprovider|NoRelationship|Form|Mscrm.Form.msdyn_ciprovider.Save']"));
			channelSaveButton.Click();
			Thread.Sleep(10000);
		}

		public static void RemoveChannelApiFramworkEntity(IWebDriver driver)
		{
			LaunchControl(driver, Constants.CHANNEL_INTEGRATION_FRAMEWORK);
			RemoveChannelApiFramworkEntityHelper(driver);
		}

		private static void RemoveChannelApiFramworkEntityHelper(IWebDriver driver)
		{
			IWebElement channelSelectgrid = driver.FindElement(By.XPath("//*[@data-id='cell-0-2']"));
			channelSelectgrid.Click();

			Thread.Sleep(4000);
			IWebElement deleteButton = driver.FindElement(By.XPath("//*[@data-id='msdyn_ciprovider|NoRelationship|Form|Mscrm.Form.msdyn_ciprovider.Delete']"));
			deleteButton.Click();
			Thread.Sleep(3000);

			IWebElement dialogDeleteButton = driver.FindElement(By.Id("confirmButton"));
			dialogDeleteButton.Click();
		}

		private static void setInputValue(IWebElement element, string value)
		{
			element.Click();
			Thread.Sleep(2000);
			for (var i = 0; i < value.Length; i++)
			{
				element.SendKeys(value[i].ToString());
			}
			Thread.Sleep(2000);
		}

		#endregion Main
	}
}