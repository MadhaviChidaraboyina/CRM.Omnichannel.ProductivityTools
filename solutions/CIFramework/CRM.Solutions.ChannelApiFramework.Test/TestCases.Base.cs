using OpenQA.Selenium;
using Microsoft.VisualStudio.TestTools.UnitTesting;
//using SalesInsightsTest.Utility;
using OpenQA.Selenium.Support.UI;
using System;
using CRM.Solutions.ChannelApiFramework.Test.Utility;

namespace CRM.Solutions.ChannelApiFramework.Test
{
	[TestClass]
	public class TestCasesBase
	{
		public static IWebDriver driver;
		public static string Url;
		public static TestContext testContext;
		public static SeleniumDriverManager selUtil;
		public static WebDriverWait waitForPageLoad, waitForElementLoad;

		/// <summary>
		/// ClassInitialize
		/// </summary>
		/// <param name="context"></param>
		[AssemblyInitializeAttribute()]
		public static void ClassInit(TestContext testCtxt)
		{
			testContext = testCtxt;
		}

		/// <summary>
		/// TestInitialize
		/// </summary>
		[TestInitialize()]
		public void Initialize()
		{
			selUtil = new SeleniumDriverManager();
			driver = selUtil.Driver;
			waitForPageLoad = new WebDriverWait(driver, TimeSpan.FromSeconds(20));
			waitForElementLoad = new WebDriverWait(driver, TimeSpan.FromSeconds(200));
		}

		/// <summary>
		/// Clean up work.
		/// </summary>
		[TestCleanup()]
		public void Cleanup()
		{
			selUtil.DriverCleanup();
		}
	}
}

