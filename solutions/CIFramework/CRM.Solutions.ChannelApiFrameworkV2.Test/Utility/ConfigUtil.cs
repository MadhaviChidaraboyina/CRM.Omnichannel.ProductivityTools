using System;
using System.Linq;
using System.IO;
using System.Xml.Linq;

namespace CRM.Solutions.ChannelApiFrameworkV2.Test.Utility
{
	public static class ConfigUtil
	{
		public static string Username, Password, Hostname, Browser, OrgName, DomainName, AuthenticationType, RootDiscoveryServiceUrl;
		private static XElement configurationsFromFile;
		/// <summary>
		/// Reads a server configuration file.
		/// Read the configuration from disk, if it exists, at C:\Users\YourUserName\AppData\Roaming\CrmServer\Credentials.xml.
		/// </summary>
		/// <returns>Is configuration settings already available on disk.</returns>
		public static void ReadConfigurations()
		{
			var configFilePath = Environment.GetEnvironmentVariable("CONFIG_PATH");
			System.Configuration.ExeConfigurationFileMap fileMap = new System.Configuration.ExeConfigurationFileMap();
			fileMap.ExeConfigFilename = configFilePath; //Path to your config file
			var config = System.Configuration.ConfigurationManager.OpenMappedExeConfiguration(fileMap, System.Configuration.ConfigurationUserLevel.None);
			Browser = config.AppSettings.Settings["BrowserToLaunch"].Value;
			DomainName = config.AppSettings.Settings["OrgUniqueName"].Value;
			Username = config.AppSettings.Settings["OrgAdminUserName"].Value;
			Password = config.AppSettings.Settings["OrgAdminPassword"].Value;
			AuthenticationType = config.AppSettings.Settings["AuthenticationType"].Value;
			RootDiscoveryServiceUrl = config.AppSettings.Settings["ServerAddress"].Value;
			Hostname = "serverName"; //dummy string
		}

		/// <summary>
		/// Get node value by key
		/// </summary>
		/// <param name="key"></param>
		/// <returns></returns>
		private static string GetNodeValueByKey(XElement config, string key)
		{
			XElement add = config.Element("appSettings").Elements("add").FirstOrDefault(a => (string)a.Attribute("key") == key);
			if (add != null)
			{
				return (string)add.Attribute("value");
			}
			else
				return "";
		}
	}

	internal static class LogUtil
	{
		/// <summary>
		/// Log exceptions to file
		/// </summary>
		/// <param name="exception"></param>
		internal static void LogExceptionToFile(Exception exception)
		{
			string TestLogFileName = "TestLog.txt";
			string DriverPath = Environment.GetEnvironmentVariable("WEB_DRIVER");
			if (DriverPath == null)
			{
				string path = Directory.GetCurrentDirectory();
				DriverPath = Path.GetFullPath(Path.Combine(path, @"webdrivers"));
			}
			string fullpathFileName = Path.Combine(DriverPath, TestLogFileName);
		
			// Exception has to be logged.
			using (StreamWriter outputFile = new StreamWriter(fullpathFileName))
			{
				outputFile.WriteLine(exception.Message);
				outputFile.WriteLine(exception.Source);
				if (exception.InnerException != null)
				{
					outputFile.WriteLine("-- Inner Exception --");
					outputFile.WriteLine(exception.InnerException.Message);
					outputFile.WriteLine(exception.InnerException.Source);
				}
				outputFile.WriteLine("-- Exception StackTrace --");
				outputFile.WriteLine(exception.StackTrace);
				outputFile.Close();
			}
		}
	}
}
