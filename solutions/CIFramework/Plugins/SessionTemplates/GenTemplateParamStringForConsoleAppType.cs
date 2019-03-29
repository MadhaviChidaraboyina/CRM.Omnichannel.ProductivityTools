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
				trace.Trace("Starting plugin execution");
				/*if(!context.OutputParameters.Contains("BusinessEntity"))
				{
					return;
				}
				if(!(context.OutputParameters["BusinessEntity"] is Entity))
				{
					return;
				}*/
				Entity target = (Entity)context.InputParameters["Target"];
				//Entity target = (Entity)context.OutputParameters["BusinessEntity"];
				if(target.LogicalName != SessionTemplatePluginConstants.APPLICATION_TEMPLATE_ENTITY_NAME)
				{
					return;
				}
				if(!target.GetAttributeValue<bool>(SessionTemplatePluginConstants.APPLICATION_TEMPLATE_IS_STALE_ATTRIBUTE))
				{
					trace.Trace("Entity " + target.Id + " not stale");
					return;
				}
				string[] fetchColumns = {
							SessionTemplatePluginConstants.TEMPLATE_PARAMETER_COL_NAME,
							SessionTemplatePluginConstants.PARAMETER_COL_RUNTIME_TYPE,
							SessionTemplatePluginConstants.TEMPLATE_PARAMETER_COL_VALUE,
							SessionTemplatePluginConstants.PARAMETER_COL_IS_RUNTIME
						};
				string[] primaryEntityCols = {
					SessionTemplatePluginConstants.APPLICATION_TEMPLATE_ENTITY_TEMPLATE_PARAMETER_ATTRIBUTE,
					SessionTemplatePluginConstants.APPLICATION_TEMPLATE_IS_STALE_ATTRIBUTE
				};
				
				Entity targetEntity = null;
				bool found = false;
				trace.Trace("Retrieving template parameters");
				EntityCollection parameters = SessionTemplatePluginUtilities.retrieveRelatedEntities(context, organizationService, trace, target.LogicalName, target.Id,
					new ColumnSet(primaryEntityCols), SessionTemplatePluginConstants.APPLICATION_TEMPLATE_PARAMETER_ENTITY_NAME,
					SessionTemplatePluginConstants.APPLICATION_TEMPLATE_PARAMETER_VALUE_RELATION, new ColumnSet(fetchColumns), out targetEntity, out found);
				trace.Trace("Retrieved template parameters");
				if(!targetEntity.GetAttributeValue<bool>(SessionTemplatePluginConstants.APPLICATION_TEMPLATE_IS_STALE_ATTRIBUTE))
				{
					trace.Trace("Entity " + target.Id + " not stale");
					return;
				}
				Entity updatedEntity = new Entity(target.LogicalName, target.Id);
				Dictionary<string, Parameter> paramInfo = new Dictionary<string, Parameter>(parameters.Entities.Count);
				if (found)
				{
					foreach (Entity param in parameters.Entities)
					{
						string paramName = param.GetAttributeValue<string>(SessionTemplatePluginConstants.TEMPLATE_PARAMETER_COL_NAME);
						Parameter val = new Parameter();
						val.value = param.GetAttributeValue<string>(SessionTemplatePluginConstants.TEMPLATE_PARAMETER_COL_VALUE);
						val.isRuntime = param.GetAttributeValue<bool>(SessionTemplatePluginConstants.PARAMETER_COL_IS_RUNTIME);
						val.type = param.FormattedValues[SessionTemplatePluginConstants.PARAMETER_COL_RUNTIME_TYPE];
						paramInfo[paramName] = val;
					}
					trace.Trace("Created param dict");
				}

				DataContractJsonSerializerSettings settings = new DataContractJsonSerializerSettings();
				settings.UseSimpleDictionaryFormat = true;
				DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(Dictionary<string, Parameter>), settings);




				trace.Trace("Serializing data " + paramInfo.ToString());
				using (MemoryStream memStream = new MemoryStream())
				{
					//DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(Dictionary<string, Parameter>));

					serializer.WriteObject(memStream, paramInfo);
					byte[] jsonData = memStream.ToArray();
					//memStream.Close();
					string jsonStr = Encoding.UTF8.GetString(jsonData, 0, jsonData.Length);


					trace.Trace("Serialized data " + jsonStr);
					updatedEntity.Attributes.Add(SessionTemplatePluginConstants.APPLICATION_TEMPLATE_ENTITY_TEMPLATE_PARAMETER_ATTRIBUTE, jsonStr);
					updatedEntity.Attributes.Add(SessionTemplatePluginConstants.APPLICATION_TEMPLATE_IS_STALE_ATTRIBUTE, false);
					trace.Trace("Setting target attribute val as " + jsonStr);
					organizationService.Update(updatedEntity);
					target[SessionTemplatePluginConstants.APPLICATION_TEMPLATE_ENTITY_TEMPLATE_PARAMETER_ATTRIBUTE] = jsonStr;
					target[SessionTemplatePluginConstants.APPLICATION_TEMPLATE_IS_STALE_ATTRIBUTE] = false;
					trace.Trace("Everything done");
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
