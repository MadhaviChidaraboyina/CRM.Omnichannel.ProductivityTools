//-----------------------------------------------------------------------
// <copyright file="IntegrationTest.cs" company="MicrosoftCorporation">
//   Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace ProductivityPaneControl.Xrm.IntegrationTests
{
    using Autofac;
    using Microsoft.Crm.Sdk.Messages;
    using Microsoft.Dynamics.Solution.Common.Proxies;
    using Microsoft.Xrm.Sdk;
    using Microsoft.Xrm.Sdk.Query;
    using Microsoft.Xrm.Test.Common;
    using System;
    using System.Collections.Generic;
    using System.DirectoryServices.AccountManagement;
    using System.Linq;
    using Xunit.Abstractions;

    /// <summary>
    /// Integration test base class.
    /// </summary>
    /// <remarks>
    /// Defines base components need by every integration test scenario.
    /// </remarks>
    public class IntegrationTest
    {
        private List<EntityReference> createdListCollection = new List<EntityReference>();
        protected readonly ITestOutputHelper logger;

        /// <summary>
        /// Initialize the integration test.
        /// </summary>
        /// <param name="output">Test output logger.</param>
        public IntegrationTest(ITestOutputHelper output)
        {
            logger = output;
            DependencyResolver.Logger = logger;
        }

        /// <summary>
        /// Logs the specified message to output device.
        /// </summary>
        /// <param name="message">Log message.</param>
        public void Log(string message)
        {
            logger.WriteLine(message);
        }

        private IOrganizationService organizationService = null;

        /// <summary>
        /// Organization service.
        /// </summary>
        public IOrganizationService OrganizationService
        {
            get
            {
                return organizationService ?? (organizationService = DependencyResolver.Instance.Resolve<IOrganizationService>());
            }
        }

        private static Guid organizationId = Guid.Empty;

        /// <summary>
        /// Gets the OrganizationId.
        /// </summary>
        public Guid OrganizationId
        {
            get
            {
                if (organizationId.Equals(Guid.Empty))
                {
                    RetrieveOrganizationAndUserInformation();
                }

                return organizationId;
            }
        }

        private static Guid userId = Guid.Empty;

        /// <summary>
        /// Gets the UserId.
        /// </summary>
        public Guid UserId
        {
            get
            {
                if (userId.Equals(Guid.Empty))
                {
                    RetrieveOrganizationAndUserInformation();
                }

                return userId;
            }
        }

        private void RetrieveOrganizationAndUserInformation()
        {
            var response = (Microsoft.Xrm.Test.Common.WhoAmIResponse)OrganizationService.Execute(
                new Microsoft.Xrm.Test.Common.WhoAmIRequest());
            organizationId = response.OrganizationId;
            userId = response.UserId;
        }

        /// <summary>
        /// Provide the connection setting to connect with CRM
        /// </summary>
        /// <returns>Connection settings object.</returns>
        private static IConnectionSettings GetConnectionSettings()
        {
            return DependencyResolver.Instance.Resolve<IConnectionSettingsProvider>().GetSettings();
        }
        /// <summary>
        /// createADUser create a new user in Active directory.
        /// <param name="userName">username of the user that should be created in AD. If username not provided, Random username will be picked for the new user</param>
        /// </summary>
        /// <param name="userName">User name</param>
        /// <returns>AD user</returns>
        public static string CreateADUser(string userName = null)
        {
            if (userName == null)
            {
                //Generating the Random username for the new user.
                userName = RandomString();
            }
            
            var settings = GetConnectionSettings();
            string host = new Uri(settings.OrganizationUrl).Host;
            using (var principalContext = new PrincipalContext(ContextType.Domain, host, settings.UserPrincipalName, settings.Password))
            {
                using (var userPrincipal = new UserPrincipal(principalContext))
                {
                    userPrincipal.SamAccountName = userName;
                    userPrincipal.Enabled = true;
                    userPrincipal.Save();
                }
            }

            return userName;
        }

        /// <summary>
        /// Generate a random string of char between A-Z,0-9 of provided length
        /// </summary>
        /// <param name="length">Length of the random string</param>
        /// <returns>Random string</returns>
        public static string RandomString(int length)
        {
            Random random = new Random();
            const string Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(Chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        /// <summary>
        /// Generate a random string of length 20 for AD user's Username
        /// </summary>
        /// <returns>Random string</returns>
        public static string RandomString()
        {
            string userId = Guid.NewGuid().ToString();
            userId = userId.Replace("-", string.Empty);
            userId = userId.Substring(13); //Getting last 20 chars of GUID, GUID have total 32 chars picking up last 20 chars starting from 13
            return userId;
        }

        /// <summary>
        /// Remove provided user from Active Directory
        /// </summary>
        /// <param name="userName">Username of user that should be removed from AD</param>
        public void RemoveADUser(string userName)
        {
            if (userName == null)
            {
                throw new Exception("Username can't be empty.");
            }

            var settings = GetConnectionSettings();
            string host = new Uri(settings.OrganizationUrl).Host;

            using (var principalContext = new PrincipalContext(ContextType.Domain, host, settings.UserPrincipalName, settings.Password))
            {
                UserPrincipal userPrincipal = UserPrincipal.FindByIdentity(principalContext, userName);
                userPrincipal.Delete();
            }
        }

        /// <summary>
        /// Finds the domain to currently logged in user.
        /// </summary>
        /// <returns>Domain name</returns>
        private string GetDomain()
        {
            string _domain;
            var who = new Microsoft.Xrm.Test.Common.WhoAmIRequest();
            var whoResp = (Microsoft.Xrm.Test.Common.WhoAmIResponse)OrganizationService.Execute(who);
            var currentUserId = whoResp.UserId;
            var currentUser =
                OrganizationService.Retrieve(User.EntityLogicalName,
                currentUserId,
                new ColumnSet(User.AttributeDomainName)).ToEntity<User>();

            // Extract the domain and create the LDAP object.
            string[] userPath = currentUser.DomainName.Split(new char[] { '\\' });

            if (userPath.Length > 1)
            {
                _domain = userPath[0];
            }
            else
            {
                _domain = string.Empty;
            }
                
            return _domain;
        }

        /// <summary>
        /// Create a user in CRM by creating entry in system user table.
        /// </summary>
        /// <param name="username">Username of user that should be created</param>
        /// <returns>System user identifier</returns>
        public Guid CreateSystemUser(string username)
        {
            //String domain = getDomain();
            //EntityReference BusinessUnitId = new EntityReference
            //{
            //    LogicalName = BusinessUnit.EntityLogicalName,
            //    Name = BusinessUnit.AttributeBusinessUnitId,
            //    Id = EntityUtils.GetDefaultBusinessUnitId(OrganizationService)
            //};

            //domain = domain + @"\" + username;

            //User user = new User
            //{
            //    DomainName = domain,
            //    FirstName = username,
            //    LastName = username,
            //    BusinessUnitId = BusinessUnitId
            //};
            Guid userId = Guid.Empty; // OrganizationService.Create(user);
            return userId;
        }

        /// <summary>
        /// Disable the user from CRM
        /// </summary>
        /// <param name="userId">User Id of user that need to be disabled from CRM</param>
        public void RemoveSystemUser(Guid userId)
        {
            if (userId != null && userId != Guid.Empty)
            {
                var request = new SetStateRequest()
                {
                    EntityMoniker = new EntityReference(User.EntityLogicalName, userId),
                    // Sets the user to disabled.
                    State = new OptionSetValue(1),
                    // Required by request but always valued at -1 in this context.
                    Status = new OptionSetValue(-1)
                    /*
                    //Sets the user to enabled.
                    State = new OptionSetValue(0),
                    // Required by request but always valued at -1 in this context.
                    Status = new OptionSetValue(-1)    
                    */
                };

                OrganizationService.Execute(request);
            }
        }

        /// <summary>
        /// Generic function for creating user in CRM
        /// </summary>
        /// <returns>Created user object</returns>
        public Guid CreateUser()
        {
            string username = CreateADUser();
            Guid userId = CreateSystemUser(username);
            return userId;
        }

        /// <summary>
        /// Generic function for removing user from CRM, Remove entry from system user table.
        /// </summary>
        /// <param name="userId">UserId of user that need to be removed</param>
        public void RemoveUser(Guid userId)
        {
            RemoveSystemUser(userId);
            var user = OrganizationService.Retrieve(User.EntityLogicalName, userId, new ColumnSet(User.AttributeDomainName)).ToEntity<User>();
            var userPath = user.DomainName.Split(new char[] { '\\' });
            try
            {
                RemoveADUser(userPath[1]);
            }
            catch
            {
                throw new Exception("Username can't be empty");
            }
        }

        /// <summary>
        /// Releases internal resources used.
        /// </summary>
        public virtual void Dispose()
        {
            //for(int i = createdListCollection.Count-1; i >= 0; i--)
            //{
            //    EntityUtils.DeleteEntity(OrganizationService, logger, createdListCollection[i].LogicalName, createdListCollection[i].Id);
            //}

            createdListCollection.Clear();
        }
    }
}
