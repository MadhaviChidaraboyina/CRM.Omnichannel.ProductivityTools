//-----------------------------------------------------------------------
// <copyright file="PackageProductivityMacros.cs" company="MicrosoftCorporation">
//   Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace PVSPackage
{
    using Microsoft.Uii.Common.Entities;
    using Microsoft.Crm.Sdk.Messages;
    using Microsoft.Xrm.Sdk;
    using Microsoft.Xrm.Sdk.Query;
    using Microsoft.Xrm.Tooling.PackageDeployment.CrmPackageExtentionBase;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.Composition;

    /// <summary>
    /// Import package starter frame. 
    /// </summary>
    [Export(typeof(IImportExtensions))]
    public class PackageProductivityTools : ImportExtension
    {
        /// <summary>
        /// Called When the package is initialized. 
        /// </summary>
        public override void InitializeCustomExtension()
        {
        }

        /// <summary>
        /// Called Before Import Completes. 
        /// </summary>
        /// <returns>True when stage is before solution import. Otherwise, false.</returns>
        public override bool BeforeImportStage()
        {
            return true;
        }

        /// <summary>
        /// Called for each UII record imported into the system
        /// This is UII Specific and is not generally used by Package Developers
        /// </summary>
        /// <param name="app">App Record</param>
        /// <returns>Application record object.</returns>
        public override ApplicationRecord BeforeApplicationRecordImport(ApplicationRecord app)
        {
            return app;  // do nothing here. 
        }

        /// <summary>
        /// Called during a solution upgrade while both solutions are present in the target CRM instance. 
        /// This function can be used to provide a means to do data transformation or upgrade while a solution update is occurring. 
        /// </summary>
        /// <param name="solutionName">Name of the solution</param>
        /// <param name="oldVersion">version number of the old solution</param>
        /// <param name="newVersion">Version number of the new solution</param>
        /// <param name="oldSolutionId">Solution ID of the old solution</param>
        /// <param name="newSolutionId">Solution ID of the new solution</param>
        public override void RunSolutionUpgradeMigrationStep(string solutionName, string oldVersion, string newVersion, Guid oldSolutionId, Guid newSolutionId)
        {
            base.RunSolutionUpgradeMigrationStep(solutionName, oldVersion, newVersion, oldSolutionId, newSolutionId);
        }

        /// <summary>
        /// Called after Import completes. 
        /// </summary>
        /// <returns>True when stage is after primary solution import. Otherwise, false.</returns>
        public override bool AfterPrimaryImport()
        {
            return true;
        }

        /// <summary>
        /// Override default decision made by PD.
        /// </summary>
        /// <param name="solutionUniqueName">Solution unique name</param>
        /// <param name="organizationVersion">Organization version</param>
        /// <param name="packageSolutionVersion">Package solution version</param>
        /// <param name="inboundSolutionVersion">Inbound solution version</param>
        /// <param name="deployedSolutionVersion">Deployed solution version</param>
        /// <param name="systemSelectedImportAction">Selected import action</param>
        /// <returns>Import action object</returns>
        public override UserRequestedImportAction OverrideSolutionImportDecision(string solutionUniqueName, Version organizationVersion, Version packageSolutionVersion, Version inboundSolutionVersion, Version deployedSolutionVersion, ImportAction systemSelectedImportAction)
        {
            try
            {
                if (IsOnpremiseOrganization()) {
                    PackageLog.Log(string.Format(" Skipping import to onpremise machine for {0}.", solutionUniqueName));
                    return UserRequestedImportAction.Skip;
                }
            }
            catch(Exception ex)
            {
                this.PackageLog.Log($"PackageTemplate::OverrideSolutionImportDecision: Exception occured. Skipping solution {solutionUniqueName}. Exception message is {ex.Message}");
                return UserRequestedImportAction.Skip;
            }

            // Perform “Update” to the existing solution
            // instead of “Delete And Promote” when a new version
            // of an existing solution is detected.
            if (systemSelectedImportAction == ImportAction.Import)
            {
                return UserRequestedImportAction.ForceUpdate;
            }

            return base.OverrideSolutionImportDecision(solutionUniqueName, organizationVersion, packageSolutionVersion, inboundSolutionVersion, deployedSolutionVersion, systemSelectedImportAction);
        }

        #region Properties

        /// <summary>
        /// Name of the Import Package to Use
        /// </summary>
        /// <param name="plural">if true, return plural version</param>
        /// <returns>Name of import</returns>
        public override string GetNameOfImport(bool plural)
        {
            return "ProductivityToolsComponent";
        }

        /// <summary>
        /// Folder Name for the Package data. 
        /// </summary>
        public override string GetImportPackageDataFolderName
        {
            get
            {
                return "ProductivityToolsComponent";
            }
        }

        /// <summary>
        /// Description of the package, used in the package selection UI
        /// </summary>
        public override string GetImportPackageDescriptionText
        {
            get { return "Productivity Tools for Dynamics 365 apps provide capabilities that help users to perform day-to-day business operations in a faster, efficient, and process compliant manner and deliver value to customers."; }
        }

        /// <summary>
        /// Long name of the Import Package. 
        /// </summary>
        public override string GetLongNameOfImport
        {
            get { return "ProductivityToolsComponent"; }
        }

        /// <summary>
        /// Checks whether the Solution Health Solution is installed in the organization
        /// This should be called before trying to register any solution health rules
        /// </summary>
        /// <returns></returns>
        private bool IsSolutionInstalled(String solutionName)
        {
            String uniqueName = solutionName;
            var query = new QueryExpression("solution");
            query.ColumnSet = new ColumnSet("uniquename");
            query.Criteria.AddCondition("uniquename", ConditionOperator.Equal, uniqueName);

            EntityCollection solutions = CrmSvc.RetrieveMultiple(query);
            return solutions != null && solutions.Entities != null && solutions.Entities.Count > 0;
        }

        /// Function to determine whether org is of type on premise
		/// </summary>
		/// <returns>True if org is on premise</returns>
		public bool IsOnpremiseOrganization()
		{
            // Use Geo from RuntimeSetting for New Org provision. 
            // Runtimesetting will not be available for App update (PDU) so we fall back to Geo from OrganizationRequest

			const string GeoNameSetting = "GeoName";
			const string OnpremGeo = "ONP";

            string organizationUrl = string.Empty;
            string organizationGeo = ReadRuntimeSetting(GeoNameSetting);
            
            if (string.IsNullOrEmpty(organizationGeo))
            {
                var orgDetailInfo = (RetrieveCurrentOrganizationResponse)CrmSvc.ExecuteCrmOrganizationRequest(new RetrieveCurrentOrganizationRequest(), "Getting Organization Data");

                if (orgDetailInfo?.Detail != null)
                {
                    organizationGeo = orgDetailInfo.Detail.Geo ?? string.Empty;
                    PackageLog.Log($"PackageTemplate::RetrieveOrganizationGeo: Retrieved organization details from Crm. Geo: {organizationGeo}");
                }

                if (string.IsNullOrEmpty(organizationGeo))
                {
                    return true;
                }
                return organizationGeo.Equals(OnpremGeo, StringComparison.OrdinalIgnoreCase);
            }
            else
            {
                PackageLog.Log($"PackageTemplate::RetrieveOrganizationGeo: Geo from RuntimeSetting: {organizationGeo}");
                return organizationGeo.Equals(OnpremGeo, StringComparison.OrdinalIgnoreCase);                
            } 
		}

        private string ReadRuntimeSetting(string key)
        {
            object runTimeSetting = null;
            if (this.RuntimeSettings != null && this.RuntimeSettings.ContainsKey(key)
                && (this.RuntimeSettings.TryGetValue(key, out runTimeSetting)))
            {
                return runTimeSetting?.ToString() ?? string.Empty;
            }
            return string.Empty;
        }

        #endregion
    }
}
