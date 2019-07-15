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
	using Microsoft.Xrm.Sdk.Messages;
	using Microsoft.Xrm.Sdk.Query;

	public class CreateOrUpdateApplicationTemplateParameter : IPlugin
	{
		private Dictionary<string, Entity>createNameMap(EntityCollection entities, string mapColumn)
		{
			Dictionary<string, Entity> currentParams = new Dictionary<string, Entity>(entities.Entities.Count);
			foreach (Entity entity in entities.Entities)
			{
				string paramName = entity.GetAttributeValue<string>(mapColumn);
				currentParams[paramName] = entity;
			}
			return currentParams;
		}
 		public void Execute(IServiceProvider serviceProvider)
		{
			IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
			ITracingService trace = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
			IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
			IOrganizationService organizationService = serviceFactory.CreateOrganizationService(context.InitiatingUserId);

			if (context.Depth > 1)
			{
				//prevent infinite recursion
				return;
			}

			try
			{
				trace.Trace("Starting plugin execution " + context.MessageName);
				Entity target = (Entity)context.InputParameters["Target"];
				Entity targetRef = null;
				bool found = false;
				EntityCollection affectedEntities = TemplatePluginUtility.retrieveRelatedEntities(context, organizationService, trace, target.LogicalName, target.Id, new ColumnSet(TemplatePluginConstants.ENTITY_NAME_ATTRIBUTE),
					TemplatePluginConstants.APPLICATION_TEMPLATE_ENTITY_NAME, TemplatePluginConstants.APPLICATION_TEMPLATE_PARAMETER_VALUE_RELATION, new ColumnSet(TemplatePluginConstants.APPLICATION_TEMPLATE_IS_STALE_ATTRIBUTE), out targetRef, out found);
				if(!found)
				{
					//No entities related to this one
					return;
				}
				foreach(Entity entity in affectedEntities.Entities)
				{
					Entity updatedEntity = new Entity(entity.LogicalName, entity.Id);
					updatedEntity.Attributes.Add(TemplatePluginConstants.APPLICATION_TEMPLATE_IS_STALE_ATTRIBUTE, true);
					trace.Trace("Marked entity " + entity.LogicalName + " " + entity.Id + " as stale");
					organizationService.Update(updatedEntity);
				}
				//organizationService.
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
