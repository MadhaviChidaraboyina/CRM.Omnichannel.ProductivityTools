namespace Microsoft.Dynamics.CIFrameworkPlugins
{
	using System;
	using Microsoft.Xrm.Sdk;
	using Microsoft.Xrm.Sdk.Messages;
	using Microsoft.Xrm.Sdk.Query;
	public class SessionTemplatePluginConstants
	{
		public const string APPLICATION_TYPE_ENTITY_NAME = "msdyn_consoleapplicationtype";
		public const string APPLICATION_TEMPLATE_PARAMETER_ENTITY_NAME = "msdyn_consoleapplicationtemplateparameter";
		public const string APPLICATION_TEMPLATE_ENTITY_NAME = "msdyn_consoleapplicationtemplate";
		public const string APPLICATION_TYPE_PARAMETER_DEFINITION_RELATION = "msdyn_msdyn_consoleapplicationtype_msdyn_consol";
		public const string APPLICATION_TEMPLATE_PARAMETER_VALUE_RELATION = "msdyn_msdyn_consoleapplicationtemplate_msdyn_co";
		public const string APPLICATION_TEMPLATE_ENTITY_TEMPLATE_PARAMETER_ATTRIBUTE = "msdyn_templateparameters";
		public const string APPLICATION_TEMPLATE_ENTITY_PAGETYPE_ATTRIBUTE = "msdyn_pagetype";
		public const string ENTITY_NAME_ATTRIBUTE = "msdyn_name";
		public const string APPLICATION_TEMPLATE_IS_STALE_ATTRIBUTE = "msdyn_isstale";
		public const string PARAMETER_DEFINITION_ENTITY_NAME = "msdyn_consoleappparameterdefinition";
		public const string PARAMETER_DEFINITION_ENTITY_ID = PARAMETER_DEFINITION_ENTITY_NAME + "id";
		public const string PARAMETER_COL_DEFAULT_VALUE = "msdyn_defaultvalue";
		public const string TEMPLATE_PARAMETER_COL_VALUE = "msdyn_value";
		public const string PARAMETER_COL_IS_RUNTIME = "msdyn_isruntime";
		public const string PARAMETER_COL_NAME = "msdyn_name";
		public const string TEMPLATE_PARAMETER_COL_NAME = "msdyn_parametername";
		public const string PARAMETER_COL_RUNTIME_TYPE = "msdyn_runtimetype";
		public const string ASSOCIATE_MESSAGE = "Associate";
		public const string DISASSOCIATE_MESSAGE = "Disassociate";
	}

	public class SessionTemplatePluginUtilities {
		static public EntityCollection retrieveRelatedEntities(IPluginExecutionContext context, IOrganizationService organizationService, ITracingService trace, string primaryEntityName, Guid primaryEntityGuid, ColumnSet primaryEntityColumnSet, string relatedEntityName, string relationName, ColumnSet relatedEntityColumnSet, out Entity targetEntity, out bool found)
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
	}
}