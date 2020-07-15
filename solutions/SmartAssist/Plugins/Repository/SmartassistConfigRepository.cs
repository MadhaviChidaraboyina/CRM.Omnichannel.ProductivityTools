namespace Microsoft.Dynamics.SmartAssist.Plugin.Repository
{
	using Microsoft.Dynamics.SmartAssist.Plugin.Proxies;
	using System.Collections.Generic;
	using System.Linq;
	using Xrm.Sdk;
	using Xrm.Sdk.Query;

	/// <summary>
	/// Repository that operates on SmartassistConfig entity
	/// </summary>
	public class SmartassistConfigRepository : EntityRepository<msdyn_smartassistconfig>
	{
		private const string CSCAppmodule = "msdynce_CustomerServiceConsole";

		// Filtering based on app module unique name. This will be removed once there is a way to select a specific SmartassistConfig in SAconfig
		private const string UniqueNameKey = "msdyn_uniquename";
		private const string UniqueCaseName = "msdyn_sa_case_suggestion_config";
		private const string UniqueKMName = "msdyn_sa_knowledge_suggestion_config";


		/// <summary>
		/// Initializes a new instance of the <see cref="SmartassistConfigRepository"/>
		/// </summary>
		/// <param name="organizationService">The service provides programmatic access to the metadata and data for an organization.</param>
		public SmartassistConfigRepository(IOrganizationService organizationService)
			: base(organizationService)
		{
		}

		/// <summary>
		/// Get msdyn_smartassistconfig using unique name
		/// </summary>
		public List<msdyn_smartassistconfig> GetSmartassistconfig()
		{
			var query = new QueryExpression(msdyn_smartassistconfig.EntityLogicalName)
			{
				Criteria =
				{
					FilterOperator = LogicalOperator.Or,
					Conditions =
					{
						new ConditionExpression(UniqueNameKey, ConditionOperator.Equal, UniqueCaseName),
						new ConditionExpression(UniqueNameKey, ConditionOperator.Equal, UniqueKMName),
					}
				},
				ColumnSet = new ColumnSet("msdyn_suggestiontype", "msdyn_uniquename")
			};
			IEnumerable<msdyn_smartassistconfig> saconfig = RetrieveEntities(query);
			return saconfig.ToList();
		}
	}
}
