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

	public class CreateOrUpdateApplicationTemplate : IPlugin
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
				EntityReference pageTypeRef = target.GetAttributeValue<EntityReference>(SessionTemplatePluginConstants.APPLICATION_TEMPLATE_ENTITY_PAGETYPE_ATTRIBUTE);
				
				string[] fetchColumns = {
							SessionTemplatePluginConstants.PARAMETER_COL_NAME,
							SessionTemplatePluginConstants.PARAMETER_COL_RUNTIME_TYPE,
							SessionTemplatePluginConstants.PARAMETER_COL_DEFAULT_VALUE,
							SessionTemplatePluginConstants.PARAMETER_COL_IS_RUNTIME
						};
				bool newParamsFound = false;
				Entity appTypeEntity = null;
				trace.Trace("Getting new param definitions for  " + pageTypeRef.Id);
				EntityCollection newParamDefinitions = SessionTemplatePluginUtilities.retrieveRelatedEntities(context, organizationService, trace, SessionTemplatePluginConstants.APPLICATION_TYPE_ENTITY_NAME,
					pageTypeRef.Id, new ColumnSet(SessionTemplatePluginConstants.ENTITY_NAME_ATTRIBUTE), SessionTemplatePluginConstants.PARAMETER_DEFINITION_ENTITY_NAME,
					SessionTemplatePluginConstants.APPLICATION_TYPE_PARAMETER_DEFINITION_RELATION, new ColumnSet(fetchColumns), out appTypeEntity, out newParamsFound);

				if(!newParamsFound)
				{
					trace.Trace("Pagetype does not need any params");
					return;
				}

				string[] templateParamfetchColumns = {
							SessionTemplatePluginConstants.TEMPLATE_PARAMETER_COL_NAME,
							SessionTemplatePluginConstants.PARAMETER_COL_RUNTIME_TYPE,
							SessionTemplatePluginConstants.TEMPLATE_PARAMETER_COL_VALUE,
							SessionTemplatePluginConstants.PARAMETER_COL_IS_RUNTIME
						};
				bool currentParamsExist = false;
				Entity targetTemplateEntity = null;
				trace.Trace("Getting current param definitions for  " + target.Id);
				EntityCollection currentParamValues = SessionTemplatePluginUtilities.retrieveRelatedEntities(context, organizationService, trace, target.LogicalName, target.Id, new ColumnSet(SessionTemplatePluginConstants.ENTITY_NAME_ATTRIBUTE),
					SessionTemplatePluginConstants.APPLICATION_TEMPLATE_PARAMETER_ENTITY_NAME, SessionTemplatePluginConstants.APPLICATION_TEMPLATE_PARAMETER_VALUE_RELATION, new ColumnSet(templateParamfetchColumns), out targetTemplateEntity, out currentParamsExist);

				Dictionary<string, Entity> currentParams = null;
				if (currentParamsExist)
				{
					currentParams = createNameMap(currentParamValues, SessionTemplatePluginConstants.TEMPLATE_PARAMETER_COL_NAME);
					trace.Trace("Created currrentParamMap");
				}
				else {
					trace.Trace("No current params exist");
				}
				Dictionary<string, Entity> requiredParams = createNameMap(newParamDefinitions, SessionTemplatePluginConstants.PARAMETER_COL_NAME);
				trace.Trace("Created requiredParamMap");
				List<Entity> paramsToDel = new List<Entity>();
				List<Entity> paramsToAdd = new List<Entity>();
				if (currentParamsExist)
				{
					foreach(string currentParamName in currentParams.Keys)
					{
						if(!requiredParams.ContainsKey(currentParamName))
						{
							paramsToDel.Add(currentParams[currentParamName]);
						}
					}
				}
				trace.Trace("Added records to be deleted " + paramsToDel.Count);
				foreach (string requiredParamName in requiredParams.Keys)
				{
					if(!currentParamsExist || !currentParams.ContainsKey(requiredParamName))
					{
						Entity entity = new Entity(currentParamValues.EntityName);
						Entity templateParam = requiredParams[requiredParamName];
						entity.Attributes.Add(SessionTemplatePluginConstants.TEMPLATE_PARAMETER_COL_NAME, requiredParamName);
						try
						{
							entity.Attributes.Add(SessionTemplatePluginConstants.TEMPLATE_PARAMETER_COL_VALUE, templateParam.GetAttributeValue<string>(SessionTemplatePluginConstants.PARAMETER_COL_DEFAULT_VALUE));
						}
						catch(Exception)
						{
							//No default value set
							entity.Attributes.Add(SessionTemplatePluginConstants.TEMPLATE_PARAMETER_COL_VALUE, "{" + requiredParamName + "}");
						}
						entity.Attributes.Add(SessionTemplatePluginConstants.PARAMETER_COL_IS_RUNTIME, templateParam.GetAttributeValue<bool>(SessionTemplatePluginConstants.PARAMETER_COL_IS_RUNTIME));
						entity.Attributes.Add(SessionTemplatePluginConstants.PARAMETER_COL_RUNTIME_TYPE, templateParam.GetAttributeValue<OptionSetValue>(SessionTemplatePluginConstants.PARAMETER_COL_RUNTIME_TYPE));
						entity.Attributes.Add(SessionTemplatePluginConstants.ENTITY_NAME_ATTRIBUTE, targetTemplateEntity.GetAttributeValue<string>(SessionTemplatePluginConstants.ENTITY_NAME_ATTRIBUTE).ToLower().Replace(' ', '_') +"_" + requiredParamName);
						paramsToAdd.Add(entity);
					}
				}
				trace.Trace("Added records to be created " + paramsToAdd.Count);
				//EntityReferenceCollection relToDel = new EntityReferenceCollection();
				foreach(Entity entity in paramsToDel)
				{
					//organizationService.Disassociate()
					organizationService.Delete(entity.LogicalName, entity.Id);
					//relToDel.Add(new EntityReference(entity.LogicalName, entity.Id));
				}
				trace.Trace("Records deleted");
				//organizationService.Disassociate(target.LogicalName, target.Id, new Relationship(SessionTemplatePluginConstants.APPLICATION_TEMPLATE_PARAMETER_VALUE_RELATION), relToDel);
				EntityReferenceCollection relToAdd = new EntityReferenceCollection();
				foreach (Entity entity in paramsToAdd)
				{
					Guid entityid = organizationService.Create(entity);
					relToAdd.Add(new EntityReference(entity.LogicalName, entityid));
				}
				trace.Trace("Records created");
				organizationService.Associate(target.LogicalName, target.Id, new Relationship(SessionTemplatePluginConstants.APPLICATION_TEMPLATE_PARAMETER_VALUE_RELATION), relToAdd);
				trace.Trace("Records associated");
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
