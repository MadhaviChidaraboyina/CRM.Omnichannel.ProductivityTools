namespace Microsoft.Dynamics.SmartAssist.Plugins.SmartAssistConfig
{
	using Microsoft.Xrm.Sdk;
	using Microsoft.Xrm.Sdk.Query;
	using System;
	using System.Collections.Generic;
	using System.ServiceModel;
	using Microsoft.Dynamics.SmartAssist.Plugin.Repository;
	using Microsoft.Dynamics.SmartAssist.Plugin.Proxies;

	/// <summary>
	/// Plugin to Enable/Disable Smartassist Config based on Admin settings
	/// </summary>
	public class AdminSettingsPlugin : IPlugin
	{
		public void Execute(IServiceProvider serviceProvider)
		{
			IOrganizationServiceFactory svc = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
			IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));

			IOrganizationService organizationService = svc.CreateOrganizationService(context.UserId);
			ITracingService tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

			SmartassistConfigRepository smartassistConfigRepository = new SmartassistConfigRepository(organizationService);

			if (context.MessageName.ToLower() == "update")
			{
				if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity)
				{

					try
					{
						Entity entity = (Entity)context.InputParameters["Target"];
						msdyn_suggestionssetting suggestionssetting = entity.ToEntity<msdyn_suggestionssetting>();

						if (suggestionssetting.LogicalName == msdyn_suggestionssetting.EntityLogicalName &&
							suggestionssetting.msdyn_suggestionssettingId == Constants.SuggestionSettingsRecordID)
						{
							tracingService.Trace("Executing AdminSettingsPlugin...");

							List<msdyn_smartassistconfig> saconfigs = smartassistConfigRepository.GetSmartassistconfig();
							tracingService.Trace("Smartassist Config records are retrieved");
							foreach (msdyn_smartassistconfig config in saconfigs)
							{
								if (config != null)
								{
									msdyn_smartassistconfig saconfig = config;
									tracingService.Trace($"Processing Smartassist Config record - {saconfig.msdyn_UniqueName}");
									if (saconfig.msdyn_UniqueName == Constants.UniqueCaseName &&
										suggestionssetting.msdyn_CaseIsEnabled != null)
									{
										ActivateOrDeActivateSmartassistConfig(suggestionssetting.msdyn_CaseIsEnabled, ref saconfig, organizationService);
									}
									if (config.msdyn_UniqueName == Constants.UniqueKMName && 
										suggestionssetting.msdyn_KBIsEnabled != null)
									{
										ActivateOrDeActivateSmartassistConfig(suggestionssetting.msdyn_KBIsEnabled, ref saconfig, organizationService);
									}
								}
							}
						}
					}
					catch (FaultException<OrganizationServiceFault> ex)
					{
						throw new InvalidPluginExecutionException($"An error occurred in AdminSettingsPlugin. {ex.ToString()}");
					}
					catch (Exception ex)
					{
						tracingService.Trace("An error occurred in AdminSettingsPlugin: {0}", ex.ToString());
						throw;
					}
				}
			}
		}

		/// <summary>
		/// Set statecode and statuscode and activates the record
		/// </summary>
		/// <param name="saconfig"></param>
		/// <param name="svc"></param>
		private void ActivateSmartassistConfigRecord(ref msdyn_smartassistconfig saconfig, IOrganizationService svc)
		{
			saconfig.statecode = msdyn_smartassistconfigState.Active;
			saconfig.statuscode = new OptionSetValue(Convert.ToInt32(SAConfigStatusReason.Active));
		}

		/// <summary>
		///  Set statecode and statuscode and deactivates the record
		/// </summary>
		/// <param name="saconfig"></param>
		/// <param name="svc"></param>
		private void DeActivateSmartassistConfigRecord(ref msdyn_smartassistconfig saconfig, IOrganizationService svc)
		{
			saconfig.statecode = msdyn_smartassistconfigState.Inactive;
			saconfig.statuscode = new OptionSetValue(Convert.ToInt32(SAConfigStatusReason.InActive));
		}

		/// <summary>
		/// Activates or Deactivates the smart assist config record based on the given flag
		/// </summary>
		/// <param name="enable"></param>
		/// <param name="saconfig"></param>
		/// <param name="svc"></param>
		private void ActivateOrDeActivateSmartassistConfig(bool? enable, ref msdyn_smartassistconfig saconfig, IOrganizationService svc)
		{
			if (enable == true)
			{
				ActivateSmartassistConfigRecord(ref saconfig, svc);
			} else
			{
				DeActivateSmartassistConfigRecord(ref saconfig, svc);
			}
			svc.Update(saconfig);
		}
	}
}