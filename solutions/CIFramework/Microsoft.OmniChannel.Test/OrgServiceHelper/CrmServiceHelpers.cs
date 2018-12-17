// =====================================================================
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
// =====================================================================
//<snippetCrmServiceHelper>
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.DirectoryServices.AccountManagement;
using System.IO;
using System.Runtime.InteropServices;
using System.Security;
using System.ServiceModel;
using System.ServiceModel.Description;
using System.Text;
using System.Xml;
using System.Xml.Linq;

// These namespaces are found in the Microsoft.Xrm.Sdk.dll assembly
// located in the SDK\bin folder of the SDK download.
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Client;
using Microsoft.Xrm.Sdk.Discovery;


namespace Microsoft.Crm.Sdk.Samples
{
	/// <summary>
	/// Provides server connection information.
	/// </summary>
	public class ServerConnection
	{
		#region Inner classes
		/// <summary>
		/// Stores Microsoft Dynamics CRM server configuration information.
		/// </summary>
		public class Configuration
		{
			public String ServerAddress;
			public String OrganizationName;
			public Uri DiscoveryUri;
			public Uri OrganizationUri;
			public Uri HomeRealmUri = null;
			public ClientCredentials DeviceCredentials = null;
			public ClientCredentials Credentials = null;
			public AuthenticationProviderType EndpointType;
			public String UserPrincipalName;
			#region internal members of the class
			internal IServiceManagement<IOrganizationService> OrganizationServiceManagement;
			internal SecurityTokenResponse OrganizationTokenResponse;
			internal Int16 AuthFailureCount = 0;
			#endregion
		}
		#endregion Inner classes

		#region Public properties

		public List<Configuration> configurations = null;

		#endregion Public properties

		#region Private properties

		private Configuration config = new Configuration();

		#endregion Private properties

		#region Public methods
		/// <summary>
		/// Obtains the server connection information including the target organization's
		/// Uri and user logon credentials from the user.
		/// </summary>
		public virtual Configuration GetServerConfiguration(string serverCredentialFilePath)
		{
			// Read the configuration from the disk, if it exists, at C:\Users\<username>\AppData\Roaming\CrmServer\Credentials.xml.
			Boolean isConfigExist = ReadConfigurations(serverCredentialFilePath);

			if (!isConfigExist)
			{
				Console.WriteLine("Specify the config file");
			}
			else
			{
				config = configurations[0];
				// Reorder the configuration list and save it to file to save the recent configuration as a latest one. 
			}
			return config;
		}

		/// <summary>
		/// Reads a server configuration file.
		/// Read the configuration from disk, if it exists, at C:\Users\YourUserName\AppData\Roaming\CrmServer\Credentials.xml.
		/// </summary>
		/// <returns>Is configuration settings already available on disk.</returns>
		public Boolean ReadConfigurations(string configFilePath)
		{
			Boolean isConfigExist = false;

			if (configurations == null)
				configurations = new List<Configuration>();

			if (File.Exists(configFilePath))
			{
				Configuration newConfig = new Configuration();
				System.Configuration.ExeConfigurationFileMap fileMap = new System.Configuration.ExeConfigurationFileMap();
				fileMap.ExeConfigFilename = configFilePath; //Path to your config file
				var config = System.Configuration.ConfigurationManager.OpenMappedExeConfiguration(fileMap, System.Configuration.ConfigurationUserLevel.None);
				var serverAddress = config.AppSettings.Settings["ServerAddress"].Value;
				newConfig.ServerAddress = serverAddress;
				newConfig.DiscoveryUri = new Uri(String.Format("{0}/XRMServices/2011/Discovery.svc", serverAddress));
				if (config.AppSettings.Settings["OrgUniqueName"] != null && config.AppSettings.Settings["OrgUniqueName"].Value != "")
				{
					newConfig.OrganizationUri = new Uri(String.Format("{0}/{1}/XRMServices/2011/Organization.svc", serverAddress, config.AppSettings.Settings["OrgUniqueName"].Value));
				}
				else
				{
					newConfig.OrganizationUri = new Uri(String.Format("{0}/XRMServices/2011/Organization.svc", serverAddress));
				}				
				newConfig.EndpointType = RetrieveAuthenticationType(config.AppSettings.Settings["EndpointType"].Value);
				newConfig.Credentials = this.ParseInCredentials(config.AppSettings.Settings["OrgAdminUserName"].Value, config.AppSettings.Settings["OrgAdminPassword"].Value);
				configurations.Add(newConfig);
			}

			if (configurations.Count > 0)
				isConfigExist = true;

			return isConfigExist;
		}

		#endregion Public methods

		#region Helper Methods
		/// <summary>
		/// Verify passed strings with the supported AuthenticationProviderType.
		/// </summary>
		/// <param name="authType">String AuthenticationType</param>
		/// <returns>Supported AuthenticatoinProviderType</returns>
		private AuthenticationProviderType RetrieveAuthenticationType(String authType)
		{
			switch (authType)
			{
				case "ActiveDirectory":
					return AuthenticationProviderType.ActiveDirectory;
				case "LiveId":
					return AuthenticationProviderType.LiveId;
				case "Federation":
					return AuthenticationProviderType.Federation;
				case "OnlineFederation":
					return AuthenticationProviderType.OnlineFederation;
				default:
					throw new ArgumentException(String.Format("{0} is not a valid authentication type", authType));
			}
		}

		/// <summary>
		/// Parse credentials from an XML node to required ClientCredentials data type 
		/// based on passed AuthenticationProviderType.
		/// </summary>
		/// <param name="credentials">Credential XML node.</param>
		/// <param name="endpointType">AuthenticationProviderType of the credential.</param>
		/// <param name="target">Target is the key with which associated credentials can be fetched.</param>
		/// <returns>Required ClientCredentials type.</returns>
		private ClientCredentials ParseInCredentials(string uname, string password)
		{
			ClientCredentials credentials = new ClientCredentials();
			credentials.Windows.ClientCredential = new System.Net.NetworkCredential(uname, password);
			credentials.UserName.UserName = uname;
			credentials.UserName.Password = password;
			return credentials;
		}

		#endregion
	}
}
//</snippetCrmServiceHelper>
