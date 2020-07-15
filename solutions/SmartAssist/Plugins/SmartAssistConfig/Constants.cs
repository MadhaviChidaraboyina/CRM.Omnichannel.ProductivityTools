using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.Dynamics.SmartAssist.Plugins.SmartAssistConfig
{
	/// <summary>
	/// Smartassist config status reason
	/// </summary>
	public enum SAConfigStatusReason
	{
		Active = 1,
		InActive
	};

	/// <summary>
	/// Smartassist config's Suggestion Type Enum
	/// </summary>
	public enum SuggestionType
	{
		KBArticle = 192360000,
		SimilarCase = 192360001
	};

	/// <summary>
	/// Contains all the constants required for Smartassistconfig Plugins
	/// </summary>
	public class Constants
	{
		public const string UniqueCaseName = "msdyn_sa_case_suggestion_config";
		public const string UniqueKMName = "msdyn_sa_knowledge_suggestion_config";
		public static Guid? SuggestionSettingsRecordID = new Guid("719e8cd8-e0aa-ea11-a81c-000d3a6ce6ca");
	}
}
