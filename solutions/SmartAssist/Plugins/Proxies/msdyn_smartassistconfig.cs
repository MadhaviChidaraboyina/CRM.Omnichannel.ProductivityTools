﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

[assembly: Microsoft.Xrm.Sdk.Client.ProxyTypesAssemblyAttribute()]

namespace Microsoft.Dynamics.SmartAssist.Plugin.Proxies
{

	/// <summary>
	/// Stores Smartassist configurations
	/// </summary>
	[System.Runtime.Serialization.DataContractAttribute()]
	[Microsoft.Xrm.Sdk.Client.EntityLogicalNameAttribute("msdyn_smartassistconfig")]
	[System.CodeDom.Compiler.GeneratedCodeAttribute("CrmSvcUtil", "9.1.0.45")]
	public partial class msdyn_smartassistconfig : Microsoft.Xrm.Sdk.Entity, System.ComponentModel.INotifyPropertyChanging, System.ComponentModel.INotifyPropertyChanged
	{

		/// <summary>
		/// Default Constructor.
		/// </summary>
		public msdyn_smartassistconfig() :
				base(EntityLogicalName)
		{
		}

		public const string EntityLogicalName = "msdyn_smartassistconfig";

		public const int EntityTypeCode = 10128;

		public event System.ComponentModel.PropertyChangedEventHandler PropertyChanged;

		public event System.ComponentModel.PropertyChangingEventHandler PropertyChanging;

		private void OnPropertyChanged(string propertyName)
		{
			if ((this.PropertyChanged != null))
			{
				this.PropertyChanged(this, new System.ComponentModel.PropertyChangedEventArgs(propertyName));
			}
		}

		private void OnPropertyChanging(string propertyName)
		{
			if ((this.PropertyChanging != null))
			{
				this.PropertyChanging(this, new System.ComponentModel.PropertyChangingEventArgs(propertyName));
			}
		}

		/// <summary>
		/// For internal use only.
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("componentidunique")]
		public System.Nullable<System.Guid> ComponentIdUnique
		{
			get
			{
				return this.GetAttributeValue<System.Nullable<System.Guid>>("componentidunique");
			}
		}

		/// <summary>
		/// For internal use only.
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("componentstate")]
		public Microsoft.Xrm.Sdk.OptionSetValue ComponentState
		{
			get
			{
				return this.GetAttributeValue<Microsoft.Xrm.Sdk.OptionSetValue>("componentstate");
			}
		}

		/// <summary>
		/// Unique identifier of the user who created the record.
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("createdby")]
		public Microsoft.Xrm.Sdk.EntityReference CreatedBy
		{
			get
			{
				return this.GetAttributeValue<Microsoft.Xrm.Sdk.EntityReference>("createdby");
			}
		}

		/// <summary>
		/// Date and time when the record was created.
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("createdon")]
		public System.Nullable<System.DateTime> CreatedOn
		{
			get
			{
				return this.GetAttributeValue<System.Nullable<System.DateTime>>("createdon");
			}
		}

		/// <summary>
		/// Unique identifier of the delegate user who created the record.
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("createdonbehalfby")]
		public Microsoft.Xrm.Sdk.EntityReference CreatedOnBehalfBy
		{
			get
			{
				return this.GetAttributeValue<Microsoft.Xrm.Sdk.EntityReference>("createdonbehalfby");
			}
		}

		/// <summary>
		/// Sequence number of the import that created this record.
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("importsequencenumber")]
		public System.Nullable<int> ImportSequenceNumber
		{
			get
			{
				return this.GetAttributeValue<System.Nullable<int>>("importsequencenumber");
			}
			set
			{
				this.OnPropertyChanging("ImportSequenceNumber");
				this.SetAttributeValue("importsequencenumber", value);
				this.OnPropertyChanged("ImportSequenceNumber");
			}
		}

		/// <summary>
		/// For internal use only.
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("iscustomizable")]
		public Microsoft.Xrm.Sdk.BooleanManagedProperty IsCustomizable
		{
			get
			{
				return this.GetAttributeValue<Microsoft.Xrm.Sdk.BooleanManagedProperty>("iscustomizable");
			}
			set
			{
				this.OnPropertyChanging("IsCustomizable");
				this.SetAttributeValue("iscustomizable", value);
				this.OnPropertyChanged("IsCustomizable");
			}
		}

		/// <summary>
		/// Indicates whether the solution component is part of a managed solution.
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("ismanaged")]
		public System.Nullable<bool> IsManaged
		{
			get
			{
				return this.GetAttributeValue<System.Nullable<bool>>("ismanaged");
			}
		}

		/// <summary>
		/// Unique identifier of the user who modified the record.
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("modifiedby")]
		public Microsoft.Xrm.Sdk.EntityReference ModifiedBy
		{
			get
			{
				return this.GetAttributeValue<Microsoft.Xrm.Sdk.EntityReference>("modifiedby");
			}
		}

		/// <summary>
		/// Date and time when the record was modified.
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("modifiedon")]
		public System.Nullable<System.DateTime> ModifiedOn
		{
			get
			{
				return this.GetAttributeValue<System.Nullable<System.DateTime>>("modifiedon");
			}
		}

		/// <summary>
		/// Unique identifier of the delegate user who modified the record.
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("modifiedonbehalfby")]
		public Microsoft.Xrm.Sdk.EntityReference ModifiedOnBehalfBy
		{
			get
			{
				return this.GetAttributeValue<Microsoft.Xrm.Sdk.EntityReference>("modifiedonbehalfby");
			}
		}

		/// <summary>
		/// Icon for the suggestion group container
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("msdyn_iconurl")]
		public string msdyn_IconURL
		{
			get
			{
				return this.GetAttributeValue<string>("msdyn_iconurl");
			}
			set
			{
				this.OnPropertyChanging("msdyn_IconURL");
				this.SetAttributeValue("msdyn_iconurl", value);
				this.OnPropertyChanged("msdyn_IconURL");
			}
		}

		/// <summary>
		/// This number denotes the maximum number of suggestions that can be displayed in smart assist control
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("msdyn_maxsuggestioncount")]
		public System.Nullable<int> msdyn_maxsuggestioncount
		{
			get
			{
				return this.GetAttributeValue<System.Nullable<int>>("msdyn_maxsuggestioncount");
			}
			set
			{
				this.OnPropertyChanging("msdyn_maxsuggestioncount");
				this.SetAttributeValue("msdyn_maxsuggestioncount", value);
				this.OnPropertyChanged("msdyn_maxsuggestioncount");
			}
		}

		/// <summary>
		/// The name of the custom entity.
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("msdyn_name")]
		public string msdyn_name
		{
			get
			{
				return this.GetAttributeValue<string>("msdyn_name");
			}
			set
			{
				this.OnPropertyChanging("msdyn_name");
				this.SetAttributeValue("msdyn_name", value);
				this.OnPropertyChanged("msdyn_name");
			}
		}

		/// <summary>
		/// Order in which the entities are grouped in smart assist.
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("msdyn_order")]
		public System.Nullable<int> msdyn_Order
		{
			get
			{
				return this.GetAttributeValue<System.Nullable<int>>("msdyn_order");
			}
			set
			{
				this.OnPropertyChanging("msdyn_Order");
				this.SetAttributeValue("msdyn_order", value);
				this.OnPropertyChanged("msdyn_Order");
			}
		}

		/// <summary>
		/// Unique identifier for entity instances
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("msdyn_smartassistconfigid")]
		public System.Nullable<System.Guid> msdyn_smartassistconfigId
		{
			get
			{
				return this.GetAttributeValue<System.Nullable<System.Guid>>("msdyn_smartassistconfigid");
			}
			set
			{
				this.OnPropertyChanging("msdyn_smartassistconfigId");
				this.SetAttributeValue("msdyn_smartassistconfigid", value);
				if (value.HasValue)
				{
					base.Id = value.Value;
				}
				else
				{
					base.Id = System.Guid.Empty;
				}
				this.OnPropertyChanged("msdyn_smartassistconfigId");
			}
		}

		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("msdyn_smartassistconfigid")]
		public override System.Guid Id
		{
			get
			{
				return base.Id;
			}
			set
			{
				this.msdyn_smartassistconfigId = value;
			}
		}

		/// <summary>
		/// This will be used as a title for entity suggestion panel
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("msdyn_suggestioncontainertitle")]
		public string msdyn_Suggestioncontainertitle
		{
			get
			{
				return this.GetAttributeValue<string>("msdyn_suggestioncontainertitle");
			}
			set
			{
				this.OnPropertyChanging("msdyn_Suggestioncontainertitle");
				this.SetAttributeValue("msdyn_suggestioncontainertitle", value);
				this.OnPropertyChanged("msdyn_Suggestioncontainertitle");
			}
		}

		/// <summary>
		/// Unique name of the suggestion control configuration entity. if suggestion type is adaptive card, then it should refer to the associated adaptive configuration.
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("msdyn_suggestioncontrolconfiguniquename")]
		public string msdyn_SuggestionControlConfigUniquename
		{
			get
			{
				return this.GetAttributeValue<string>("msdyn_suggestioncontrolconfiguniquename");
			}
			set
			{
				this.OnPropertyChanging("msdyn_SuggestionControlConfigUniquename");
				this.SetAttributeValue("msdyn_suggestioncontrolconfiguniquename", value);
				this.OnPropertyChanged("msdyn_SuggestionControlConfigUniquename");
			}
		}

		/// <summary>
		/// Denotes the control type for suggestions, (e.g) Adaptive card
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("msdyn_suggestioncontroltype")]
		public Microsoft.Xrm.Sdk.OptionSetValue msdyn_Suggestioncontroltype
		{
			get
			{
				return this.GetAttributeValue<Microsoft.Xrm.Sdk.OptionSetValue>("msdyn_suggestioncontroltype");
			}
			set
			{
				this.OnPropertyChanging("msdyn_Suggestioncontroltype");
				this.SetAttributeValue("msdyn_suggestioncontroltype", value);
				this.OnPropertyChanged("msdyn_Suggestioncontroltype");
			}
		}

		/// <summary>
		/// Provide the class name of Suggestion provider
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("msdyn_suggestionprovider")]
		public string msdyn_SuggestionProvider
		{
			get
			{
				return this.GetAttributeValue<string>("msdyn_suggestionprovider");
			}
			set
			{
				this.OnPropertyChanging("msdyn_SuggestionProvider");
				this.SetAttributeValue("msdyn_suggestionprovider", value);
				this.OnPropertyChanged("msdyn_SuggestionProvider");
			}
		}

		/// <summary>
		/// Denotes the type of suggestions like Similar case or KB article suggestion
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("msdyn_suggestiontype")]
		public Microsoft.Xrm.Sdk.OptionSetValue msdyn_Suggestiontype
		{
			get
			{
				return this.GetAttributeValue<Microsoft.Xrm.Sdk.OptionSetValue>("msdyn_suggestiontype");
			}
			set
			{
				this.OnPropertyChanging("msdyn_Suggestiontype");
				this.SetAttributeValue("msdyn_suggestiontype", value);
				this.OnPropertyChanged("msdyn_Suggestiontype");
			}
		}

		/// <summary>
		/// Suggestion Webresource which brings smart assist actions or api to retrieve suggestions
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("msdyn_suggestionwebresourceurl")]
		public string msdyn_SuggestionWebresourceURL
		{
			get
			{
				return this.GetAttributeValue<string>("msdyn_suggestionwebresourceurl");
			}
			set
			{
				this.OnPropertyChanging("msdyn_SuggestionWebresourceURL");
				this.SetAttributeValue("msdyn_suggestionwebresourceurl", value);
				this.OnPropertyChanged("msdyn_SuggestionWebresourceURL");
			}
		}

		/// <summary>
		/// Unique Name for the entity.
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("msdyn_uniquename")]
		public string msdyn_UniqueName
		{
			get
			{
				return this.GetAttributeValue<string>("msdyn_uniquename");
			}
			set
			{
				this.OnPropertyChanging("msdyn_UniqueName");
				this.SetAttributeValue("msdyn_uniquename", value);
				this.OnPropertyChanged("msdyn_UniqueName");
			}
		}

		/// <summary>
		/// Unique identifier for the organization
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("organizationid")]
		public Microsoft.Xrm.Sdk.EntityReference OrganizationId
		{
			get
			{
				return this.GetAttributeValue<Microsoft.Xrm.Sdk.EntityReference>("organizationid");
			}
		}

		/// <summary>
		/// Date and time that the record was migrated.
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("overriddencreatedon")]
		public System.Nullable<System.DateTime> OverriddenCreatedOn
		{
			get
			{
				return this.GetAttributeValue<System.Nullable<System.DateTime>>("overriddencreatedon");
			}
			set
			{
				this.OnPropertyChanging("OverriddenCreatedOn");
				this.SetAttributeValue("overriddencreatedon", value);
				this.OnPropertyChanged("OverriddenCreatedOn");
			}
		}

		/// <summary>
		/// For internal use only.
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("overwritetime")]
		public System.Nullable<System.DateTime> OverwriteTime
		{
			get
			{
				return this.GetAttributeValue<System.Nullable<System.DateTime>>("overwritetime");
			}
		}

		/// <summary>
		/// Unique identifier of the associated solution.
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("solutionid")]
		public System.Nullable<System.Guid> SolutionId
		{
			get
			{
				return this.GetAttributeValue<System.Nullable<System.Guid>>("solutionid");
			}
		}

		/// <summary>
		/// Status of the Smartassist configuration
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("statecode")]
		public System.Nullable<Microsoft.Dynamics.SmartAssist.Plugin.Proxies.msdyn_smartassistconfigState> statecode
		{
			get
			{
				Microsoft.Xrm.Sdk.OptionSetValue optionSet = this.GetAttributeValue<Microsoft.Xrm.Sdk.OptionSetValue>("statecode");
				if ((optionSet != null))
				{
					return ((Microsoft.Dynamics.SmartAssist.Plugin.Proxies.msdyn_smartassistconfigState)(System.Enum.ToObject(typeof(Microsoft.Dynamics.SmartAssist.Plugin.Proxies.msdyn_smartassistconfigState), optionSet.Value)));
				}
				else
				{
					return null;
				}
			}
			set
			{
				this.OnPropertyChanging("statecode");
				if ((value == null))
				{
					this.SetAttributeValue("statecode", null);
				}
				else
				{
					this.SetAttributeValue("statecode", new Microsoft.Xrm.Sdk.OptionSetValue(((int)(value))));
				}
				this.OnPropertyChanged("statecode");
			}
		}

		/// <summary>
		/// Reason for the status of the Smartassist configuration
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("statuscode")]
		public Microsoft.Xrm.Sdk.OptionSetValue statuscode
		{
			get
			{
				return this.GetAttributeValue<Microsoft.Xrm.Sdk.OptionSetValue>("statuscode");
			}
			set
			{
				this.OnPropertyChanging("statuscode");
				this.SetAttributeValue("statuscode", value);
				this.OnPropertyChanged("statuscode");
			}
		}

		/// <summary>
		/// For internal use only.
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("timezoneruleversionnumber")]
		public System.Nullable<int> TimeZoneRuleVersionNumber
		{
			get
			{
				return this.GetAttributeValue<System.Nullable<int>>("timezoneruleversionnumber");
			}
			set
			{
				this.OnPropertyChanging("TimeZoneRuleVersionNumber");
				this.SetAttributeValue("timezoneruleversionnumber", value);
				this.OnPropertyChanged("TimeZoneRuleVersionNumber");
			}
		}

		/// <summary>
		/// Time zone code that was in use when the record was created.
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("utcconversiontimezonecode")]
		public System.Nullable<int> UTCConversionTimeZoneCode
		{
			get
			{
				return this.GetAttributeValue<System.Nullable<int>>("utcconversiontimezonecode");
			}
			set
			{
				this.OnPropertyChanging("UTCConversionTimeZoneCode");
				this.SetAttributeValue("utcconversiontimezonecode", value);
				this.OnPropertyChanged("UTCConversionTimeZoneCode");
			}
		}

		/// <summary>
		/// Version Number
		/// </summary>
		[Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("versionnumber")]
		public System.Nullable<long> VersionNumber
		{
			get
			{
				return this.GetAttributeValue<System.Nullable<long>>("versionnumber");
			}
		}
	}
}
