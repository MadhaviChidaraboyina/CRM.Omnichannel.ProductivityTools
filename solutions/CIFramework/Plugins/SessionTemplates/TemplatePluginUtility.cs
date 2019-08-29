namespace Microsoft.Dynamics.CIFrameworkPlugins
{
	using System;
	using Microsoft.Xrm.Sdk;
	using Microsoft.Xrm.Sdk.Messages;
	using Microsoft.Xrm.Sdk.Query;
	using System.Collections.Generic;
	using System.Runtime.Serialization;
	using System.Runtime.Serialization.Json;
	using System.IO;
	using System.Text;
	using System.Text.RegularExpressions;


	public class TemplatePluginUtility
	{
		static internal EntityCollection retrieveRelatedEntities(IPluginExecutionContext context, IOrganizationService organizationService, ITracingService trace, string primaryEntityName, Guid primaryEntityGuid, ColumnSet primaryEntityColumnSet, string relatedEntityName, string relationName, ColumnSet relatedEntityColumnSet, out Entity targetEntity, out bool found)
		{
			QueryExpression query = new QueryExpression(relatedEntityName);
			query.Criteria = new FilterExpression();
			query.Criteria.AddCondition(new ConditionExpression("statecode", ConditionOperator.Equal, "Active"));
			query.ColumnSet = relatedEntityColumnSet;
			Relationship relationship = new Relationship();
			relationship.SchemaName = relationName;
			RelationshipQueryCollection relatedEntity = new RelationshipQueryCollection();
			relatedEntity.Add(relationship, query);

			RetrieveRequest request = new RetrieveRequest();
			request.RelatedEntitiesQuery = relatedEntity;
			request.ColumnSet = primaryEntityColumnSet;
			request.Target = new EntityReference { Id = primaryEntityGuid, LogicalName = primaryEntityName };
			RetrieveResponse response = (RetrieveResponse)organizationService.Execute(request);
			found = (response.Entity != null) && (response.Entity.RelatedEntities != null) && response.Entity.RelatedEntities.Contains(relationship) && response.Entity.RelatedEntities[relationship].Entities.Count > 0;
			targetEntity = response.Entity;
			return response.Entity.RelatedEntities[relationship];
		}

		/// <summary>
		/// Gets the JSON string to be stored in app template table
		/// </summary>
		/// <param name="PageTypeReference">The app tab's page type reference</param>
		/// <param name="parameterstoAddToAppTab">The list of parameters that need to be converted to JSON</param>
		/// <param name="organizationService">The organization service</param>
		/// <param name="tracingService">The tracing service</param>
		/// <returns>JSON string of parameters list</returns>
		static internal string GetJsonStringFromParameters(EntityReference PageTypeOfAppTab, List<Entity> parameterstoAddToAppTab, IOrganizationService organizationService, ITracingService tracingService)
		{
			Dictionary<string, Parameter> paramInfo = new Dictionary<string, Parameter>(parameterstoAddToAppTab.Count);

			string pagetype = GetPageType(PageTypeOfAppTab.Id, organizationService,tracingService);
			if (pagetype != null && pagetype.ToLower() == TemplatePluginConstants.APPLICATION_TYPE_THIRD_PARTY_WEBSITE.ToLower())
			{
				object url = string.Empty;
				Entity urlentity = parameterstoAddToAppTab.Find(item => item.GetAttributeValue<string>(TemplatePluginConstants.TEMPLATE_PARAMETER_COL_NAME) == TemplatePluginConstants.URL_PARAMATER);
				string urlvalue = urlentity.GetAttributeValue<string>(TemplatePluginConstants.TEMPLATE_PARAMETER_COL_VALUE);

				Entity dataentity = parameterstoAddToAppTab.Find(item => item.GetAttributeValue<string>(TemplatePluginConstants.TEMPLATE_PARAMETER_COL_NAME) == TemplatePluginConstants.WEBRESOURCEDATA_PARAMETER);
				string datavalue = dataentity?.GetAttributeValue<string>(TemplatePluginConstants.TEMPLATE_PARAMETER_COL_VALUE);

				paramInfo = TemplatePluginUtility.GetDefaultParameterBagForThirdPartyUrlAppType(urlvalue,datavalue,tracingService);
			}
			else
			{
				foreach (Entity param in parameterstoAddToAppTab)
				{
					string paramName = param.GetAttributeValue<string>(TemplatePluginConstants.TEMPLATE_PARAMETER_COL_NAME);
					Parameter val = new Parameter();
					val.value = param.GetAttributeValue<string>(TemplatePluginConstants.TEMPLATE_PARAMETER_COL_VALUE);
					val.isRuntime = param.GetAttributeValue<bool>(TemplatePluginConstants.PARAMETER_COL_IS_RUNTIME);
					val.type = param.FormattedValues[TemplatePluginConstants.PARAMETER_COL_RUNTIME_TYPE];
					paramInfo[paramName] = val;
				}
			}

			DataContractJsonSerializerSettings settings = new DataContractJsonSerializerSettings();
			settings.UseSimpleDictionaryFormat = true;
			string jsonStr = string.Empty;
			DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(Dictionary<string, Parameter>), settings);
			tracingService.Trace("Serializing data " + paramInfo.ToString());
			using (MemoryStream memStream = new MemoryStream())
			{
				serializer.WriteObject(memStream, paramInfo);
				byte[] jsonData = memStream.ToArray();
				jsonStr = Encoding.UTF8.GetString(jsonData, 0, jsonData.Length);
			}
			return jsonStr;
		}

		#region Helper private methods
		/// <summary>
		/// Returns the page type's name.
		/// </summary>
		/// <param name="apptyperecordId">The app type record's ID</param>
		/// <param name="orgService">The organization service</param>
		/// <returns>The page type name</returns>
		static private string GetPageType(Guid apptyperecordId, IOrganizationService orgService, ITracingService tracingService)
		{
			string pageTypeName = null;
			if (apptyperecordId == null || apptyperecordId == Guid.Empty)
			{
				tracingService.Trace("page type reference is null or empty");
				return pageTypeName;
			}
			tracingService.Trace("Getting page type name for record" + apptyperecordId.ToString());

			// TODO: kavrav : If name can changed, have some field to track third party web page type
			Entity apptype = orgService.Retrieve(TemplatePluginConstants.APPLICATION_TYPE_ENTITY_NAME, apptyperecordId, new ColumnSet(TemplatePluginConstants.ENTITY_NAME_ATTRIBUTE));
			if (apptype == null)
			{
				tracingService.Trace("Couldn't find app type record with id" + apptyperecordId.ToString());
				return pageTypeName;
			}
			pageTypeName = apptype.GetAttributeValue<string>(TemplatePluginConstants.ENTITY_NAME_ATTRIBUTE);
			return pageTypeName;
		}

		/// <summary>
		/// Generates and returns the default parameter bag for third party page type with the given url in the data
		/// </summary>
		/// <param name="url">The value of the url</param>
		/// <returns>parameter dictionary containing the key value pairs necessary for third party page type</returns>
		static private Dictionary<string, Parameter> GetDefaultParameterBagForThirdPartyUrlAppType(string url,string data,ITracingService tracingService)
		{
			//checks to handle both create and update flow
			url = url == null ? string.Empty : url;
			data = data == null ? string.Empty : data;

			Dictionary<string, Parameter> paramInfo = new Dictionary<string, Parameter>(2);
			Parameter webresourceParam = new Parameter();
			webresourceParam.type = TemplatePluginConstants.STRING_TYPE;
			webresourceParam.isRuntime = false;
			webresourceParam.value = TemplatePluginConstants.THIRDPARTY_APPTYPE_IFRAMEWEBRESOURCE;
			paramInfo.Add(TemplatePluginConstants.WEBRESOURCENAME_PARAMETER, webresourceParam);
			Parameter webresourceData = new Parameter();
			webresourceData.type = TemplatePluginConstants.STRING_TYPE;
			webresourceData.isRuntime = true;
			try
			{
				if (url != null)
				{
					Uri validUrl = new Uri(url);
				}
			}
			catch(Exception e)
			{
				tracingService.Trace("Invalid Url" + (e!=null?e.Message:""));
				return paramInfo;
			}
			string webresourcedatavalue = url;
			if (data != string.Empty)
			{
				webresourcedatavalue = webresourcedatavalue + "&" + data;
			}

			string finalUrlString = string.Empty;
			int noOfParanthesis = 0;
			// if there are = and & inside slug, don't replace with %3D and %26
			foreach(char ch in webresourcedatavalue)
			{
				switch (ch)
				{
					case '{':
						noOfParanthesis++;
						finalUrlString = string.Concat(finalUrlString, ch);
						break;
					case '}':
						noOfParanthesis--;
						finalUrlString = string.Concat(finalUrlString, ch);
						break;
					case '=':
					case '&':
						if(noOfParanthesis == 0)
							finalUrlString = (ch == '=' ? string.Concat(finalUrlString, "%3D"):string.Concat(finalUrlString, "%26"));
						else
							finalUrlString = string.Concat(finalUrlString, ch);
						break;
					default:
						finalUrlString = string.Concat(finalUrlString, ch);
						break;
				}
			}
			//webresourcedatavalue = webresourcedatavalue.Replace("&", "%26");
			//webresourcedatavalue = webresourcedatavalue.Replace("=", "%3D");
			webresourceData.value = @"url={0}".Replace("{0}", finalUrlString);
			paramInfo.Add(TemplatePluginConstants.WEBRESOURCEDATA_PARAMETER, webresourceData);
			return paramInfo;
		}

		#endregion
	}
}