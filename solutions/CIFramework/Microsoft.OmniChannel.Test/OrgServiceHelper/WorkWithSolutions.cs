
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
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

// These namespaces are found in the Microsoft.Xrm.Sdk.dll assembly
// found in the SDK\bin folder.
using Microsoft.Xrm.Sdk.Client;

// This namespace is found in Microsoft.Crm.Sdk.Proxy.dll assembly
// found in the SDK\bin folder.
using OpenQA.Selenium;
using System.Threading;
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

		public static void createServiceProxy()
		{
			System.Net.ServicePointManager.SecurityProtocol = System.Net.SecurityProtocolType.Tls12;
			string ConfigurationFilePath = Environment.GetEnvironmentVariable("CONFIG_PATH");
			ServerConnection serverConnect = new ServerConnection();
			ServerConnection.Configuration config = serverConnect.GetServerConfiguration(ConfigurationFilePath);
			_sProxy = new OrganizationServiceProxy(config.OrganizationUri, config.HomeRealmUri, config.Credentials, config.DeviceCredentials);
		}

		public static Guid GetAppID(string appModuleName)
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

		#endregion Main
	}
}