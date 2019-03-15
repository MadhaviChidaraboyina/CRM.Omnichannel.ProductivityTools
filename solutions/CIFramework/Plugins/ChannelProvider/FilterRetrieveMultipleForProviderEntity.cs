namespace Microsoft.Dynamics.CIFrameworkPlugins
{
	using System;
	using Microsoft.Xrm.Sdk;
	using Microsoft.Crm.Sdk.Messages;
	using Microsoft.Xrm.Sdk.Query;
	using System.Linq;
	using System.Xml;
	public class FilterRetrieveMultipleForProviderEntity : IPlugin
	{
		public void Execute(IServiceProvider serviceProvider)
		{
			if (serviceProvider == null)
			{
				throw new ArgumentNullException("serviceProvider");
			}
			IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
			ITracingService trace = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
			IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
			IOrganizationService organizationService = serviceFactory.CreateOrganizationService(context.InitiatingUserId);
			
			try
			{
				trace.Trace("inside try block");
				if (context.Mode == 0 && context.MessageName.Equals("RetrieveMultiple"))
				{
					if (context.InputParameters.Contains("Query"))
					{
						trace.Trace("inside contains query contains {0}", context.InputParameters["Query"].ToString());
						//FilterExpression query1 = (FilterExpression)context.InputParameters["Query"];
					//	trace.Trace("inside contains query contains {0}", context.InputParameters["Query"].ToString());
						if (context.InputParameters["Query"] is FetchExpression)
						{
							trace.Trace("FilterRetrieveMultipleForProviderEntity Inside query updater");
							var expression = (FetchExpression)context.InputParameters["Query"];

							string[] userRoles = this.GetUserRoles(organizationService, context, trace);

							trace.Trace("Initial Query {0}", expression.Query.ToString());
							// Convert to query expression
							var conversionRequest = new FetchXmlToQueryExpressionRequest {
								FetchXml = expression.Query
							};
							var conversionResponse = (FetchXmlToQueryExpressionResponse)organizationService.Execute(conversionRequest);
							QueryExpression queryExpression = conversionResponse.Query;
							trace.Trace("Converted to query expression {0}", queryExpression.ToString());
							// Add filter with role conditions

							var filter = new FilterExpression(LogicalOperator.Or);

							for (int rolecount=0; rolecount < userRoles.Length; rolecount++)
							{
								ConditionExpression filterbyRoles = new ConditionExpression
								{
									AttributeName = "msdyn_roleselector",
									Operator = ConditionOperator.Like,
									Values = { "%" + userRoles[rolecount] + "%" }
								};
								filter.AddCondition(filterbyRoles);
							}

							queryExpression.Criteria.AddFilter(filter);
							trace.Trace("Added condition {0}", queryExpression.ToString());
							//convert to Fetch Expression
							var FetchconversionRequest = new QueryExpressionToFetchXmlRequest
							{
								Query = queryExpression
							};

							var FetchConversionResponse = (QueryExpressionToFetchXmlResponse)organizationService.Execute(FetchconversionRequest);
							var finalexp = new FetchExpression(FetchConversionResponse.FetchXml);
							context.InputParameters["Query"] = finalexp;

							trace.Trace("Final Query {0}", finalexp.Query.ToString());
						}
					}
				}
			}
			catch (Exception error)
			{
				if (error.ToString() != null)
				{
					trace.Trace("FilterRetrieveMultipleForProviderEntity Failed {0}", error.ToString());
				}
				else
				{
					trace.Trace("FilterRetrieveMultipleForProviderEntity Failed");
				}
			}
		}

		private string[] GetUserRoles(IOrganizationService organizationService, IPluginExecutionContext context, ITracingService trace)
		{
			EntityCollection userRoles = organizationService.RetrieveMultiple(this.QueryUserRoles(context.InitiatingUserId, trace));
			trace.Trace("Roles Record count {0}", userRoles.Entities.Count.ToString());
			int rolesCount = userRoles.Entities.Count;
			if (rolesCount > 0)
			{
				string[] roleArray = new string[rolesCount];
				for (int index = 0; index < userRoles.Entities.Count; index++)
				{
					// Get the ParentRoleId of the current Role
					var parentRoleId = ((EntityReference)(userRoles.Entities[index]["parentroleid"])).Id;
					// Add only the ParentRoles to the roleArray
					roleArray[index] = (parentRoleId == null) ? userRoles.Entities[index]["roleid"].ToString() : parentRoleId.ToString();
				}
				return roleArray;
			}
			else
			{
				return null;
			}
		}

		private QueryExpression QueryUserRoles(Guid userid, ITracingService trace)
		{
			QueryExpression query = new QueryExpression();
			query.EntityName = "role";
			query.ColumnSet = new ColumnSet(true);

			LinkEntity linkEntity1 = new LinkEntity();
			linkEntity1.LinkFromEntityName = "role";
			linkEntity1.LinkFromAttributeName = "roleid";
			linkEntity1.LinkToEntityName = "systemuserroles";
			linkEntity1.LinkToAttributeName = "roleid";

			LinkEntity linkEntity2 = new LinkEntity();
			linkEntity2.LinkFromEntityName = "systemuserroles";
			linkEntity2.LinkFromAttributeName = "systemuserid";
			linkEntity2.LinkToEntityName = "systemuser";
			linkEntity2.LinkToAttributeName = "systemuserid";

			ConditionExpression condition = new ConditionExpression();
			condition.AttributeName = "systemuserid";
			condition.Operator = ConditionOperator.Equal;
			condition.Values.Clear();
			condition.Values.AddRange(new object[] { userid });

			linkEntity2.LinkCriteria = new FilterExpression();
			linkEntity2.LinkCriteria.Conditions.Clear();
			linkEntity2.LinkCriteria.Conditions.AddRange(new ConditionExpression[] { condition });

			linkEntity1.LinkEntities.Add(linkEntity2);
			query.LinkEntities.Clear();
			query.LinkEntities.AddRange(new LinkEntity[] { linkEntity1 });

			return query;
		}
	}
}
