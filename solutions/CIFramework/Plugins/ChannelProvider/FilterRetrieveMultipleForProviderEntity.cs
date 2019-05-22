namespace Microsoft.Dynamics.CIFrameworkPlugins
{
	using System;
	using System.Collections.Generic;
	using Microsoft.Xrm.Sdk;
	using Microsoft.Crm.Sdk.Messages;
	using Microsoft.Xrm.Sdk.Query;

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
			IOrganizationService organizationService = serviceFactory.CreateOrganizationService(null);
			
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
							if (context.Stage == 10)
							{
								trace.Trace("FilterRetrieveMultipleForProviderEntity Inside query updater");
								var expression = (FetchExpression)context.InputParameters["Query"];

								string[] userRoles = this.GetUserRoles(organizationService, context, trace);

								trace.Trace("Initial Query {0}", expression.Query.ToString());
								// Convert to query expression
								var conversionRequest = new FetchXmlToQueryExpressionRequest
								{
									FetchXml = expression.Query
								};
								var conversionResponse = (FetchXmlToQueryExpressionResponse)organizationService.Execute(conversionRequest);
								QueryExpression queryExpression = conversionResponse.Query;
								trace.Trace("Converted to query expression {0}", queryExpression.ToString());
								// Add filter with role conditions

								var filter = new FilterExpression(LogicalOperator.Or);

								for (int rolecount = 0; rolecount < userRoles.Length; rolecount++)
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

							else if (context.Stage == 40)
							{
								if (context.OutputParameters.Contains("BusinessEntityCollection") && context.OutputParameters["BusinessEntityCollection"] != null)
								{
									var cifVersion = GetCIFVersion(organizationService, context, trace);
									trace.Trace("CIF Version {0}", cifVersion);

									var retrievedResult = (EntityCollection)context.OutputParameters["BusinessEntityCollection"];
									foreach (Entity entity in retrievedResult.Entities)
									{
										entity.Attributes["msdyn_cifsolversion"] = cifVersion;
										trace.Trace("CifVersion added. Updated value: {0}", entity.GetAttributeValue<string>("msdyn_cifsolversion"));
									}
								}
							}
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
			trace.Trace("Roles Record count {0} for initiating user {1}", userRoles.Entities.Count.ToString(), context.InitiatingUserId);
			int rolesCount = userRoles.Entities.Count;
			if (rolesCount > 0)
			{
				List<Guid> finalRoles = getRootRoles(organizationService, context, trace, userRoles);
				string[] ret = finalRoles.ConvertAll<string>(new Converter<Guid, string>(guid => guid.ToString())).ToArray();
				trace.Trace("Final list of root role Ids to match " + String.Join(";", ret));
				return ret;
			}
			else
			{
				return null;
			}
		}

		private List<Guid> getRootRoles(IOrganizationService organizationService, IPluginExecutionContext context, ITracingService trace, EntityCollection userRoles)
		{
			if(userRoles.Entities.Count <= 0)
			{
				return new List<Guid>(1);
			}
			List<Guid> finalRoles = new List<Guid>(userRoles.Entities.Count / 2);
			List<string> needParentRoles = new List<string>(userRoles.Entities.Count / 2);
			for (int index = 0; index < userRoles.Entities.Count; index++)
			{
				Entity role = userRoles.Entities[index];
				Guid parentRoleId = Guid.Empty;
				if (role.Contains("parentroleid"))
				{
					parentRoleId = ((EntityReference)(role["parentroleid"])).Id;
				}
				if ((parentRoleId == null) || (parentRoleId == Guid.Empty)|| parentRoleId == role.Id)
				{   // This is a root role (has no parent)
					finalRoles.Add(role.Id);
				}
				else {
					needParentRoles.Add(parentRoleId.ToString());
				}
			}
			if (needParentRoles.Count > 0)
			{
				QueryExpression query = new QueryExpression();
				query.EntityName = "role";
				string[] cols = { "parentroleid" };
				query.ColumnSet = new ColumnSet(cols);
				query.Criteria.AddCondition("roleid", ConditionOperator.In, needParentRoles.ToArray());
				EntityCollection parentRoles = organizationService.RetrieveMultiple(query);
				finalRoles.AddRange(getRootRoles(organizationService, context, trace, parentRoles));
			}
			return finalRoles;
		}
		private QueryExpression QueryUserRoles(Guid userid, ITracingService trace)
		{
			QueryExpression query = new QueryExpression();
			query.EntityName = "role";
			string[] cols = { "parentroleid" };
			query.ColumnSet = new ColumnSet(cols);

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

		// Get the CIF Version
		private string GetCIFVersion(IOrganizationService organizationService, IPluginExecutionContext context, ITracingService trace)
		{
			QueryExpression query = new QueryExpression
			{
				EntityName = "solution",
				ColumnSet = new ColumnSet("version"),
				Criteria = new FilterExpression
				{
					Conditions =
					{
						new ConditionExpression
						{
							AttributeName = "uniquename",
							Operator = ConditionOperator.Equal,
							Values = { "ChannelAPIIntegrationFramework" }
						}
					}
				}
			};

			EntityCollection cifVersion = organizationService.RetrieveMultiple(query);
			trace.Trace("CIF Version Retrieved: {0} by User ID {1}", cifVersion[0].GetAttributeValue<string>("version").ToString(), context.InitiatingUserId);
			return cifVersion[0].GetAttributeValue<string>("version").ToString();
		}
	}
}
