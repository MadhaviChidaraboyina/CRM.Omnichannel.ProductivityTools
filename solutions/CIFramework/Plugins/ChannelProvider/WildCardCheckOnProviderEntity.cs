namespace Microsoft.Dynamics.CIFrameworkPlugins
{
	using Microsoft.Crm.Sdk.Messages;
	using System;
	using Microsoft.Xrm.Sdk;
	using Microsoft.Xrm.Sdk.Query;
	using System.Linq;
	using System.Text.RegularExpressions;

	public class WildcardForUrlOnProviderEntity : IPlugin
	{
		Regex regEx = new Regex(@"^((www\.)?[0-9a-zA-Z-_\.]+[a-zA-Z]{2,}$)");

		public void Execute(IServiceProvider serviceProvider)
		{
			IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
			ITracingService trace = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
			IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
			IOrganizationService organizationService = serviceFactory.CreateOrganizationService(context.InitiatingUserId);

			try
			{
				trace.Trace("Inside try block");
				Entity entity = (Entity)context.InputParameters["Target"];
				Uri trustedDomain = null;
				Uri channelUrl = new Uri(entity.GetAttributeValue<string>("msdyn_landingurl"));
				string trustedDomainValue = entity.GetAttributeValue<string>("msdyn_trusteddomain");
				//Check for Trusted Domain
				if (trustedDomainValue != "" && trustedDomainValue != null)
				{
					trace.Trace("Inside check for Trusted Domain");
					trustedDomain = new Uri(entity.GetAttributeValue<string>("msdyn_trusteddomain"));
					if (!regEx.IsMatch(trustedDomain.Host))
						throw new InvalidPluginExecutionException("The following characters are not allowed in the Trusted Domain: \n !~@{}$/\\%^()&*[]+=|,\"<>\':?; \n\n\n Allowed set of characters are: \n Uppercase letter (A-Z), Lowercase letter (a-z), Number (0-9), Hyphen (-), Period(.) and Underscore (_).");
				}
				//Check for Landing URL
				if (!regEx.IsMatch(channelUrl.Host))
				{
					trace.Trace("Inside check for Landing URL");
					throw new InvalidPluginExecutionException("The following characters are not allowed in the Channel URL: \n !~@{}$/\\%^()&*[]+=|,\"<>\':?; \n\n\n Allowed set of characters are: \n Uppercase letter (A-Z), Lowercase letter (a-z), Number (0-9), Hyphen (-), Period(.) and Underscore (_).");
				}
			}
			catch(Exception e)
			{
				if(e.ToString() != null)
				{
					trace.Trace("WildCard Check Failed {0}", e.ToString());
				}
				else
				{
					trace.Trace("WildCard Check Failed");
				}
			}
		}
	}
}
