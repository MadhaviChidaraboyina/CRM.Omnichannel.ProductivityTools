using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.Dynamics.CIFrameworkPlugins
{
	public class TemplatePluginConstants
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
		public const string APPLICATION_TYPE_THIRD_PARTY_WEBSITE = "ThirdPartyWebSite";

		// constants needed for third party url
		public const string THIRDPARTY_APPTYPE_IFRAMEWEBRESOURCE = "msdyn_ExternalWebPageContainer.html";
		public const string STRING_TYPE = "string";
		public const string JSON_TYPE = "json";
		public const string WEBRESOURCENAME_PARAMETER = "webresourceName";
		public const string WEBRESOURCEDATA_PARAMETER = "data";
		public const string URL_PARAMATER = "url";
	}
}
