//-----------------------------------------------------------------------
// <copyright file="SolutionFixture.cs" company="MicrosoftCorporation">
//   Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Agentscript.Xrm.IntegrationTests
{
    using System;
    using System.Configuration;
    using Microsoft.Xrm.Sdk.Test;

    /// <summary>
    /// Imports solutions needs to run Template test scenarios.
    /// </summary>
    public class SolutionFixture : IDisposable
    {
        private const string PackageDeploymentConfiguration = "packageDeployment";
        private const string MSPublisher = "MicrosoftCorporation";

        /// <summary>
        /// Imports solutions needed to run Template test scenarios.
        /// </summary>
        /// <remarks>
        /// Imports Order-to-Invoice and pre-requisite solutions listed in the application configuration file.
        /// </remarks>
        public SolutionFixture()
        {
            SolutionImportTool importTool = new SolutionImportTool();
            TimeSpan importTimeout = TimeSpan.FromMinutes(30);

            var deployment = ConfigurationManager.GetSection(PackageDeploymentConfiguration) as PackageImport;
            foreach (ImportConfiguration configuration in deployment.ImportPlan)
            {
                importTool.ImportSolution(
                    configuration.SolutionUniqueName,
                    configuration.SolutionFileName,
                    MSPublisher,
                    importTimeout,
                    configuration.ImportOverExistingSolution);
            }
        }

        #region [ IDisposable Support ]

        private bool disposedValue = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                disposedValue = true;
            }
        }

        /// <summary>
        /// Dispose resources used in the process.
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
        }

        #endregion
    }
}