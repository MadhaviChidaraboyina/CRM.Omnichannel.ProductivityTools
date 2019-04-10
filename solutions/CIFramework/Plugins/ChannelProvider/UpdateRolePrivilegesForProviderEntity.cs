namespace Microsoft.Dynamics.CIFrameworkPlugins
{
	using Microsoft.Crm.Sdk.Messages;
	using System;
	using Microsoft.Xrm.Sdk;
	using Microsoft.Xrm.Sdk.Query;
	using System.Linq;

	public class UpdateRolePrivilegesForProviderEntity : IPlugin
	{
		public void Execute(IServiceProvider serviceProvider)
		{
			IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
			ITracingService trace = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
			IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
			IOrganizationService organizationService = serviceFactory.CreateOrganizationService(context.InitiatingUserId);


			try
			{
				Entity entity = (Entity)context.InputParameters["Target"];
				string roles = entity.GetAttributeValue<string>("msdyn_roleselector");
				if (!String.IsNullOrEmpty(roles))
				{
					this.GrantReadAccessToRoles(roles, trace, organizationService);
				}
				trace.Trace("UpdateRolePrivilegesForProviderEntity executed successfully");
			}
			catch (Exception error)
			{
				if (error.ToString() != null)
				{
					trace.Trace("UpdateRolePrivilegesForProviderEntity Failed {0}", error.ToString());
				}
				else
				{
					trace.Trace("UpdateRolePrivilegesForProviderEntity Failed");
				}
			}
		}

		private void GrantReadAccessToRoles(string roles, ITracingService trace, IOrganizationService organizationService)
		{
			string[] rolesArray = roles.Split(';');
			if (rolesArray != null & rolesArray.Length > 0)
			{
				try
				{
					QueryExpression queryCIProviderPrivileges = new QueryExpression
					{
						EntityName = "privilege",
						ColumnSet = new ColumnSet("privilegeid", "name"),
						Criteria = new FilterExpression
						{
							Conditions =
						{
							new ConditionExpression
							{
								AttributeName = "name",
								Operator = ConditionOperator.In,
								Values = { "prvReadmsdyn_ciprovider",  "prvReadmsdyn_consoleapplicationnotificationfield", "prvReadmsdyn_consoleapplicationnotificationtemplate", "prvReadmsdyn_consoleappparameterdefinition" ,
											"prvReadmsdyn_consoleapplicationsessiontemplate", "prvReadmsdyn_consoleapplicationtemplate", "prvReadmsdyn_consoleapplicationtemplateparameter", "prvReadmsdyn_templatetags", "prvReadmsdyn_consoleapplicationtype"}
							}
						}
						}
					};

					var privileges = organizationService.RetrieveMultiple(queryCIProviderPrivileges);
					var rolePrivileges = privileges.Entities.Select(p => new RolePrivilege((int)PrivilegeDepth.Global, p.Id)).ToArray();
					if (rolesArray.Length > 2)
					{
						this.AddPrivilegetoRoles(rolePrivileges, rolesArray, organizationService, trace);
					}
				}
				catch (Exception error)
				{
					if (error.ToString() != null)
					{
						trace.Trace("GrantReadAccessToRoles Failed {0}", error.ToString());
					}
					else
					{
						trace.Trace("GrantReadAccessToRoles Failed");
					}
				}
			}
		}

		private  void AddPrivilegetoRoles(RolePrivilege[] rolePrivileges, string[] rolesArray, IOrganizationService organizationService, ITracingService trace)
		{
			trace.Trace("AddPrivilegetoRoles array length{0}", rolesArray.Length.ToString());
			for (int index = 0; index < rolesArray.Length - 2; index++) //last 2 roles are Sys Admin and Sys Customizer which already has read access.
			{
				try
				{
					OrganizationRequest request = new OrganizationRequest("AddPrivilegesRole");
					Guid roleid = new Guid(rolesArray[index]);
					if (rolePrivileges != null)
					{
						request.Parameters.Add("RoleId", roleid);
						request.Parameters.Add("Privileges", rolePrivileges);
						OrganizationResponse response = organizationService.Execute(request);
					}
				}
				catch (Exception error)
				{
					if (error.ToString() != null)
					{
						trace.Trace("AddPrivilegetoRoles Failed {0}", error.ToString());
					}
					else
					{
						trace.Trace("AddPrivilegetoRoles Failed");
					}
				}
			}
		}
	}
}
