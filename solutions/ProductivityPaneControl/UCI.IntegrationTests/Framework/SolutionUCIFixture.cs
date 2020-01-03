//-----------------------------------------------------------------------
// <copyright file="SolutionUCIFixture.cs" company="MicrosoftCorporation">
//   Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace ProductivityPaneControl.UCI.IntegrationTests
{
    using Microsoft.Xrm.Sdk.Test;
    using System;
    using System.Configuration;

    public class SolutionUCIFixture : IDisposable
    {
        private const string PackageDeploymentConfiguration = "packageDeployment";
        private const string MSPublisher = "MicrosoftCorporation";

        /// <summary>
        /// Initialize the UCI integration tests.
        /// </summary>
        public SolutionUCIFixture()
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

        // To detect redundant calls
        private bool disposedValue = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                disposedValue = true;
            }
        }

        // This code added to correctly implement the disposable pattern.
        public void Dispose()
        {
            Dispose(true);
        }

        #endregion
    }
}
