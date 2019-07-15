namespace Microsoft.Dynamics.CIFrameworkPlugins
{
	using Microsoft.Crm.Sdk.Messages;
	using System;
	using System.Collections.Generic;
	using System.IO;
	using System.Runtime.Serialization;
	using System.Runtime.Serialization.Json;
	using System.Text;
	using Microsoft.Xrm.Sdk;
	using Microsoft.Xrm.Sdk.Query;

	[DataContract]
	public class Parameter
	{
		[DataMember]
		public string type { get; set; }

		[DataMember]
		public string value { get; set; }

		[DataMember]
		public bool isRuntime { get; set; }
	}
	public class GenTemplateParamStringOnConsoleApplicationTypeEntity : IPlugin
	{
		/// <summary>
		/// Post create/update actions.
		/// Once template paramter value is changed/parameter got created, CreateOrUpdateApplicationTemplateParameter plugin will set stale attribute in app tab record associated with that template parameter
		/// Since app tab field is updated, GenTemplateParamStringOnConsoleApplicationTypeEntity gets kicked in.
		/// If app tab record's stale field is found to be with value "true", we update app tab record's JSON to have updated value from parameter's record.
		/// </summary>
		/// <param name="serviceProvider">The service provider</param>
		public void Execute(IServiceProvider serviceProvider)
		{
			IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
			ITracingService trace = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
			IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
			IOrganizationService organizationService = serviceFactory.CreateOrganizationService(context.InitiatingUserId);

			if (context.Depth > 2)
			{
				//prevent infinite recursion
				trace.Trace("Bailing out due to recursion check");
				return;
			}

			try
			{
				trace.Trace("Starting plugin execution" + context.MessageName);
				Entity target = (Entity)context.InputParameters["Target"];
				if(target.LogicalName != TemplatePluginConstants.APPLICATION_TEMPLATE_ENTITY_NAME)
				{
					trace.Trace("Target entity is not an app template entity.Returning.. ");
					return;
				}

				if (!target.GetAttributeValue<bool>(TemplatePluginConstants.APPLICATION_TEMPLATE_IS_STALE_ATTRIBUTE))
				{
					trace.Trace("Entity " + target.Id + " not stale");
					return;
				}

				string[] fetchColumns = {
							TemplatePluginConstants.TEMPLATE_PARAMETER_COL_NAME,
							TemplatePluginConstants.PARAMETER_COL_RUNTIME_TYPE,
							TemplatePluginConstants.TEMPLATE_PARAMETER_COL_VALUE,
							TemplatePluginConstants.PARAMETER_COL_IS_RUNTIME
						};

				string[] primaryEntityCols = {
					TemplatePluginConstants.APPLICATION_TEMPLATE_ENTITY_TEMPLATE_PARAMETER_ATTRIBUTE,
					TemplatePluginConstants.APPLICATION_TEMPLATE_IS_STALE_ATTRIBUTE,
					TemplatePluginConstants.APPLICATION_TEMPLATE_ENTITY_PAGETYPE_ATTRIBUTE
				};
				
				Entity targetEntity = null;
				bool found = false;
				trace.Trace("Retrieving template parameters");
				EntityCollection parameters = TemplatePluginUtility.retrieveRelatedEntities(context, organizationService, trace, target.LogicalName, target.Id,
					new ColumnSet(primaryEntityCols), TemplatePluginConstants.APPLICATION_TEMPLATE_PARAMETER_ENTITY_NAME,
					TemplatePluginConstants.APPLICATION_TEMPLATE_PARAMETER_VALUE_RELATION, new ColumnSet(fetchColumns), out targetEntity, out found);
				trace.Trace("Retrieved template parameters");
				if(!targetEntity.GetAttributeValue<bool>(TemplatePluginConstants.APPLICATION_TEMPLATE_IS_STALE_ATTRIBUTE))
				{
					trace.Trace("Entity " + target.Id + " not stale");
					return;
				}
				Entity updatedEntity = new Entity(target.LogicalName, target.Id);
				Dictionary<string, Parameter> paramInfo = new Dictionary<string, Parameter>(parameters.Entities.Count);
				string jsonStr = string.Empty;
				if (found)
				{
					EntityReference pageTypeRef = targetEntity.GetAttributeValue<EntityReference>(TemplatePluginConstants.APPLICATION_TEMPLATE_ENTITY_PAGETYPE_ATTRIBUTE);
					List<Entity> etnList = new List<Entity>(parameters.Entities);
					jsonStr = TemplatePluginUtility.GetJsonStringFromParameters(pageTypeRef, etnList, organizationService, trace);
				}
				else
				{
					trace.Trace("couldn't find any template paramters related to app tab" + targetEntity.Id.ToString());
				}

				trace.Trace("Serialized data " + jsonStr);
				updatedEntity.Attributes.Add(TemplatePluginConstants.APPLICATION_TEMPLATE_ENTITY_TEMPLATE_PARAMETER_ATTRIBUTE, jsonStr);
				updatedEntity.Attributes.Add(TemplatePluginConstants.APPLICATION_TEMPLATE_IS_STALE_ATTRIBUTE, false);
				trace.Trace("Setting target attribute val as " + jsonStr);
				organizationService.Update(updatedEntity);
				target[TemplatePluginConstants.APPLICATION_TEMPLATE_ENTITY_TEMPLATE_PARAMETER_ATTRIBUTE] = jsonStr;
				target[TemplatePluginConstants.APPLICATION_TEMPLATE_IS_STALE_ATTRIBUTE] = false;
				trace.Trace("Everything done");
				
			}
			catch (Exception e)
			{
				if (e.ToString() != null)
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
