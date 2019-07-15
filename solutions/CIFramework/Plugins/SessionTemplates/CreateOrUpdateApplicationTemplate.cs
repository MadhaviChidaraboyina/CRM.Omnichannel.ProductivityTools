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

		/// <summary>
		/// Post create/update actions
		/// 1. If page type is been changed, this creates the necessary new parameters
		/// 2. Deletes the currently associated paramters if any (in case of create, none. there will be list of records in case of update)
		/// 3. Associates the newly created parameters to the current app tab entity record
		/// 4. In case of update, once parameters are associated, JSON string in the current app tab entity record is updated. for create it is taken in GenTemplateParam plugin 
		/// 5. Special handling in case of thirdpartywebsite pagetype selection
		/// </summary>
		/// <param name="serviceProvider">The service provider</param>
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
				EntityReference pageTypeRef = target.GetAttributeValue<EntityReference>(TemplatePluginConstants.APPLICATION_TEMPLATE_ENTITY_PAGETYPE_ATTRIBUTE);

				if(pageTypeRef == null)
				{
					trace.Trace("Pagetype reference is not updated or couldnt retrieve pagetype reference by GetAttributeValue on target. Returning..");
					return;
				}

				string[] fetchColumns = {
							TemplatePluginConstants.PARAMETER_COL_NAME,
							TemplatePluginConstants.PARAMETER_COL_RUNTIME_TYPE,
							TemplatePluginConstants.PARAMETER_COL_DEFAULT_VALUE,
							TemplatePluginConstants.PARAMETER_COL_IS_RUNTIME
						};
				bool newParamsFound = false;
				Entity appTypeEntity = null;
				trace.Trace("Getting new param definitions for  " + pageTypeRef.Id);
				EntityCollection newParamDefinitions = TemplatePluginUtility.retrieveRelatedEntities(context, organizationService, trace, TemplatePluginConstants.APPLICATION_TYPE_ENTITY_NAME,
					pageTypeRef.Id, new ColumnSet(TemplatePluginConstants.ENTITY_NAME_ATTRIBUTE), TemplatePluginConstants.PARAMETER_DEFINITION_ENTITY_NAME,
					TemplatePluginConstants.APPLICATION_TYPE_PARAMETER_DEFINITION_RELATION, new ColumnSet(fetchColumns), out appTypeEntity, out newParamsFound);

				if(!newParamsFound)
				{
					trace.Trace("Pagetype does not need any params.Returning..");
					return;
				}

				string[] templateParamfetchColumns = {
							TemplatePluginConstants.TEMPLATE_PARAMETER_COL_NAME,
							TemplatePluginConstants.PARAMETER_COL_RUNTIME_TYPE,
							TemplatePluginConstants.TEMPLATE_PARAMETER_COL_VALUE,
							TemplatePluginConstants.PARAMETER_COL_IS_RUNTIME
						};
				bool currentParamsExist = false;
				Entity targetTemplateEntity = null;
				trace.Trace("Getting current param definitions for  " + target.Id);
				EntityCollection currentParamValues = TemplatePluginUtility.retrieveRelatedEntities(context, organizationService, trace, target.LogicalName, target.Id, new ColumnSet(TemplatePluginConstants.ENTITY_NAME_ATTRIBUTE),
					TemplatePluginConstants.APPLICATION_TEMPLATE_PARAMETER_ENTITY_NAME, TemplatePluginConstants.APPLICATION_TEMPLATE_PARAMETER_VALUE_RELATION, new ColumnSet(templateParamfetchColumns), out targetTemplateEntity, out currentParamsExist);

				Dictionary<string, Entity> currentParams = null;
				if (currentParamsExist)
				{
					currentParams = createNameMap(currentParamValues, TemplatePluginConstants.TEMPLATE_PARAMETER_COL_NAME);
					trace.Trace("Created currrentParamMap");
				}
				else {
					trace.Trace("No current params exist");
				}

				Dictionary<string, Entity> requiredParams = createNameMap(newParamDefinitions, TemplatePluginConstants.PARAMETER_COL_NAME);
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
						entity.Attributes.Add(TemplatePluginConstants.TEMPLATE_PARAMETER_COL_NAME, requiredParamName);
						try
						{
							entity.Attributes.Add(TemplatePluginConstants.TEMPLATE_PARAMETER_COL_VALUE, templateParam.GetAttributeValue<string>(TemplatePluginConstants.PARAMETER_COL_DEFAULT_VALUE));
						}
						catch(Exception)
						{
							//No default value set
							entity.Attributes.Add(TemplatePluginConstants.TEMPLATE_PARAMETER_COL_VALUE, "{" + requiredParamName + "}");
						}
						entity.Attributes.Add(TemplatePluginConstants.PARAMETER_COL_IS_RUNTIME, templateParam.GetAttributeValue<bool>(TemplatePluginConstants.PARAMETER_COL_IS_RUNTIME));
						entity.Attributes.Add(TemplatePluginConstants.PARAMETER_COL_RUNTIME_TYPE, templateParam.GetAttributeValue<OptionSetValue>(TemplatePluginConstants.PARAMETER_COL_RUNTIME_TYPE));
						entity.Attributes.Add(TemplatePluginConstants.ENTITY_NAME_ATTRIBUTE, targetTemplateEntity.GetAttributeValue<string>(TemplatePluginConstants.ENTITY_NAME_ATTRIBUTE).ToLower().Replace(' ', '_') +"_" + requiredParamName);
						entity.FormattedValues.Add(TemplatePluginConstants.PARAMETER_COL_RUNTIME_TYPE, templateParam.FormattedValues[TemplatePluginConstants.PARAMETER_COL_RUNTIME_TYPE]);
						paramsToAdd.Add(entity);
					}
				}
				trace.Trace("Added records to be created " + paramsToAdd.Count);
				//EntityReferenceCollection relToDel = new EntityReferenceCollection();

				foreach (Entity entity in paramsToDel)
				{
					organizationService.Delete(entity.LogicalName, entity.Id);
					trace.Trace("Deleted " + entity.Id);
				}
				trace.Trace("Parameter records deletion completed");

				EntityReferenceCollection relToAdd = new EntityReferenceCollection();
				foreach (Entity entity in paramsToAdd)
				{
					Guid entityid = organizationService.Create(entity);
					relToAdd.Add(new EntityReference(entity.LogicalName, entityid));
					trace.Trace("Created " + entityid);
				}
				trace.Trace("Parameter records creation completed");

				organizationService.Associate(target.LogicalName, target.Id, new Relationship(TemplatePluginConstants.APPLICATION_TEMPLATE_PARAMETER_VALUE_RELATION), relToAdd);
				trace.Trace("Records associated");

				Dictionary<string, Parameter> paramInfo = new Dictionary<string, Parameter>(paramsToAdd.Count);
				Entity updatedEntity = new Entity(target.LogicalName,target.Id);
				string jsonStr = string.Empty;

				// If there is a change in page type as part of Update operation, update the json string stored in app tab table
				if (context.MessageName?.ToLower() == "update")
				{
					jsonStr = TemplatePluginUtility.GetJsonStringFromParameters(pageTypeRef, paramsToAdd, organizationService, trace);
					updatedEntity[TemplatePluginConstants.APPLICATION_TEMPLATE_ENTITY_TEMPLATE_PARAMETER_ATTRIBUTE] = jsonStr;
					trace.Trace(string.Format("Serialized data to be stored to {0} record is {1}",target.Id.ToString(), jsonStr));
					target.Attributes.Add(TemplatePluginConstants.APPLICATION_TEMPLATE_ENTITY_TEMPLATE_PARAMETER_ATTRIBUTE, jsonStr);
					organizationService.Update(updatedEntity);
					trace.Trace("Update of msdyn_templateparameters with json got completed");
				}
				
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
