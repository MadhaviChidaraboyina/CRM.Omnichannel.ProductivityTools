using System;
using System.Linq;
using System.IO;
using System.Xml.Linq;

namespace CRM.Solutions.ChannelApiFramework.Test.Utility
{
	public static class ConfigUtil
	{
		public static string Username, Password, Hostname, Browser, OrgName, DomainName, AuthenticationType;
		public static string serverCredentialFilePath;
		private static XElement configurationsFromFile;
		/// <summary>
		/// Reads a server configuration file.
		/// Read the configuration from disk, if it exists, at C:\Users\YourUserName\AppData\Roaming\CrmServer\Credentials.xml.
		/// </summary>
		/// <returns>Is configuration settings already available on disk.</returns>
		public static void ReadConfigurations()
		{
			serverCredentialFilePath = Environment.GetEnvironmentVariable("CONFIG_PATH");
			if (File.Exists(serverCredentialFilePath))
			{
				configurationsFromFile = XElement.Load(serverCredentialFilePath);
				Browser = GetNodeValueByKey("BrowserToLaunch");
				DomainName = GetNodeValueByKey("ServerDomain");
				Username = GetNodeValueByKey("ServerUserName");
				Password = GetNodeValueByKey("ServerPassword");
				Hostname = GetNodeValueByKey("ServerName");
				OrgName = GetNodeValueByKey("OrganizationName");
				AuthenticationType = GetNodeValueByKey("AuthenticationType");
			}
		}

		/// <summary>
		/// Get node value by key
		/// </summary>
		/// <param name="key"></param>
		/// <returns></returns>
		private static string GetNodeValueByKey(string key)
		{
			XElement add = configurationsFromFile.Element("appSettings").Elements("add").FirstOrDefault(a => (string)a.Attribute("key") == key);
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
