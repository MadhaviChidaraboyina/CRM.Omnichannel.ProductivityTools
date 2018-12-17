using System;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Edge;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.IE;
using System.IO;

namespace CRM.Solutions.OmniChannel.Test.Utility
{
	public class SeleniumDriverManager
	{
		public string DriverPath;
		private IWebDriver WebDriver;

		/// <summary>
		/// Get web driver from TestCases folder
		/// </summary>
		/// <returns></returns>
		private IWebDriver GetWebDriver()
		{
			DriverPath = Environment.GetEnvironmentVariable("WEB_DRIVER");
			if (DriverPath == null)
			{
				string path = Directory.GetCurrentDirectory();
				DriverPath = Path.GetFullPath(Path.Combine(path));
			}
			Console.WriteLine("DriverPath - "+ DriverPath);
			ConfigUtil.ReadConfigurations();

			WebDriver = null;
			ConfigUtil.Browser = "Chrome";
			switch (ConfigUtil.Browser)
			{
				case "Edge":
					WebDriver = new EdgeDriver(DriverPath);
					break;
				case "Chrome":
					var options = new ChromeOptions();
					options.AddArgument("no-sandbox");
					options.AddArgument("--start-maximized");
					options.AddArgument("--allow-file-access-from-files");
					WebDriver = new ChromeDriver(DriverPath, options);
					break;
				case "Firefox":
					FirefoxOptions profile = new FirefoxOptions();
					profile.SetPreference("network.automatic-ntlm-auth.trusted-uris", Utility.ConfigUtil.Hostname);
					WebDriver = new FirefoxDriver(profile);
					break;
				case "IEx86":
				default:
					InternetExplorerOptions ieOptions = new InternetExplorerOptions();
					ieOptions.IgnoreZoomLevel = true;
					ieOptions.IntroduceInstabilityByIgnoringProtectedModeSettings = true;
					ieOptions.EnsureCleanSession = true;
					WebDriver = new InternetExplorerDriver(DriverPath, ieOptions);
					break;
			}
			return WebDriver;
		}

		/// <summary>
		/// Handle alert
		/// </summary>
		/// <param name="driver"></param>
		public void HandlePopup(ref IWebDriver driver)
		{
			try
			{
				//if alert present, accept and move on.
				IAlert alert = driver.SwitchTo().Alert();
				alert.Accept();
			}
			catch (NoAlertPresentException)
			{
			}
			System.Threading.Thread.Sleep(500);
		}

		/// <summary>
		/// driver clean up
		/// </summary>
		/// <param name="driver"></param>
		public void DriverCleanup()
		{
			try
			{
				HandlePopup(ref WebDriver);
			}
			catch (NoAlertPresentException)
			{
			}
			finally
			{
				WebDriver.Quit();
			}
		}

		public IWebDriver Driver
		{
			get { return GetWebDriver(); }
		}
	}
}

