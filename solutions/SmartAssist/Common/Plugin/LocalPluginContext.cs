namespace Microsoft.Dynamics.SmartAssist.Common.Plugin
{
	using Proxies;
	using System;
	using Xrm.Sdk;

	/// <summary>
	/// Plug-in context object. 
	/// </summary>
	public class LocalPluginContext
	{
		private const string TargetEntityParameterName = "Target";
		private const string PreImageName = "PreImage";
		private const string PostImageName = "PostImage";
		private const string DeleteMessageName = "Delete";

		public LocalPluginContext()
		{
		}

		/// <summary>
		/// Helper object that stores the services available in this plug-in.
		/// </summary>
		internal LocalPluginContext(IServiceProvider serviceProvider)
		{
			if (serviceProvider == null)
			{
				throw new ArgumentNullException("serviceProvider");
			}

			// Obtain the execution context service from the service provider.
			this.PluginExecutionContext = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));

			// Obtain the tracing service from the service provider.
			this.TracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

			// Obtain the cloud service from the service provider.
			this.CloudService = (IServiceEndpointNotificationService)serviceProvider.GetService(typeof(IServiceEndpointNotificationService));
			
			// Obtain the Key Vault client from the service provider.
			this.KeyVaultClient = (IKeyVaultClient)serviceProvider.GetService(typeof(IKeyVaultClient));

			// Obtain the local config store  from the service provider.
			this.LocalConfigStore = (ILocalConfigStore)serviceProvider.GetService(typeof(ILocalConfigStore));

			// Get the notification service from the service provider.
			this.NotificationService = (IServiceEndpointNotificationService)serviceProvider.GetService(typeof(IServiceEndpointNotificationService));

			// Obtain the organization factory service from the service provider.
			this.OrganizationServiceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));

			var proxyTypesProvider = this.OrganizationServiceFactory as IProxyTypesAssemblyProvider;
			if (proxyTypesProvider != null)
			{
				proxyTypesProvider.ProxyTypesAssembly = typeof(XRMServiceContext).Assembly;
			}

			// Use the factory to generate the organization service.
			this.OrganizationService = OrganizationServiceFactory.CreateOrganizationService(this.PluginExecutionContext.UserId);

			this.ServiceProvider = serviceProvider;
		}

		[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "LocalPluginContext")]
		internal IServiceProvider ServiceProvider { get; private set; }

		/// <summary>
		/// Organization Service Factory
		/// </summary>
		internal IOrganizationServiceFactory OrganizationServiceFactory { get; set; }

		/// <summary>
		/// The Microsoft Dynamics CRM organization service.
		/// </summary>
		[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "LocalPluginContext")]
		internal IOrganizationService OrganizationService { get; set; }

		/// <summary>
		/// IPluginExecutionContext contains information that describes the run-time environment in which the plug-in executes, information related to the execution pipeline, and entity business information.
		/// </summary>
		internal IPluginExecutionContext PluginExecutionContext { get; private set; }

		/// <summary>
		/// Synchronous registered plug-ins can post the execution context to the Microsoft Azure Service Bus. <br/> 
		/// It is through this notification service that synchronous plug-ins can send brokered messages to the Microsoft Azure Service Bus.
		/// </summary>
		internal IServiceEndpointNotificationService NotificationService { get; private set; }

		/// <summary>
		/// Provides logging run-time trace information for plug-ins. 
		/// </summary>
		internal ITracingService TracingService { get; private set; }
		
		/// <summary>
		/// Helps connect to a service endpoint.
		/// </summary>
		internal IServiceEndpointNotificationService CloudService { get; private set; }
		
		/// <summary>
		/// Helps connect to a keyvault.
		/// </summary>
		internal IKeyVaultClient KeyVaultClient { get; private set; }

		/// <summary>
		/// Helps connect to a local config store.
		/// </summary>
		internal ILocalConfigStore LocalConfigStore { get; private set; }

		/// <summary>
		/// Writes a trace message to the CRM trace log.
		/// </summary>
		/// <param name="message">Message name to trace.</param>
		public virtual void Trace(string message)
		{
			if (string.IsNullOrWhiteSpace(message) || this.TracingService == null)
			{
				return;
			}

			if (this.PluginExecutionContext == null)
			{
				this.TracingService.Trace(message);
			}
			else
			{
				this.TracingService.Trace(
					"{0}, Correlation Id: {1}, Initiating User: {2}",
					message,
					this.PluginExecutionContext.CorrelationId,
					this.PluginExecutionContext.InitiatingUserId);
			}
		}

		/// <summary>
		/// Retrieves an input parameter passed to the plugin.
		/// </summary>
		/// <typeparam name="T">The type of the parameter to be retrieved.</typeparam>
		/// <param name="parameterName">The name of the parameter.</param>
		/// <returns>The value of the given parameter.</returns>
		public virtual T GetInputParameter<T>(string parameterName)
		{
			var value = (T)this.PluginExecutionContext.InputParameters[parameterName];
			return value;
		}

		/// <summary>
		/// Retrieves an input parameter passed to the plugin.
		/// </summary>
		/// <typeparam name="T">The type of the parameter to be retrieved.</typeparam>
		/// <param name="parameterName">The name of the parameter.</param>
		/// <returns>The value of the given parameter.</returns>
		public virtual bool TryGetInputParameter<T>(string parameterName, out T value)
		{
			object valueObject;
			bool couldGetValue = this.PluginExecutionContext.InputParameters.TryGetValue(parameterName, out valueObject);
			if (couldGetValue)
			{
				value = (T)valueObject;
			}
			else
			{
				value = default(T);
			}

			return couldGetValue;
		}

		/// <summary>
		/// Retrieves the business unit of the initiating user
		/// </summary>
		/// <returns>Business unit id</returns>
		public virtual Guid GetInitiatingUserBusinessUnitId()
		{
			return this.PluginExecutionContext.BusinessUnitId;
		}

		/// <summary>
		/// Sets the value of an argument of type output for the action.
		/// </summary>
		/// <param name="argumentName">The name of the output argument.</param>
		/// <param name="value">A value for the output argument.</param>
		public virtual void SetOutputValue(string argumentName, object value)
		{
			this.PluginExecutionContext.OutputParameters[argumentName] = value;
		}

		/// <summary>
		/// Encapsulates getting MessageName from PluginExecutionContext for unit test
		/// </summary>
		/// <returns>The message name</returns>
		public virtual string GetPluginMessageName()
		{
			return this.PluginExecutionContext.MessageName;
		}

		/// <summary>
		/// Get the entity name being processed in the plugin
		/// </summary>
		/// <returns>Entity Name</returns>
		public virtual string GetPluginEntityName()
		{
			return this.PluginExecutionContext.PrimaryEntityName;
		}

		/// <summary>
		/// Retrieves the entity that was passed to the plugin.
		/// </summary>
		/// <typeparam name="T">The type of the entity to be retrieved.</typeparam>
		/// <returns>The target entity for the plugin.</returns>
		internal T GetTargetEntity<T>() where T : Entity
		{
			var entity = this.PluginExecutionContext.InputParameters[TargetEntityParameterName] as Entity;
			return entity.ToEntity<T>();
		}
		
		/// <summary>
		/// Gets the proxy implementation for the entity from the pre entity images.
		/// </summary>
		/// <typeparam name="T">The proxy type of the entity to be returned.</typeparam>
		/// <returns>The proxy for the entity from the pre entity images.</returns>
		internal T GetTargetEntityFromPreEntityImages<T>() where T : Entity
		{
			T entity = null;

			if (this.PluginExecutionContext.PreEntityImages != null && this.PluginExecutionContext.PreEntityImages.Contains(PreImageName))
			{
				entity = this.PluginExecutionContext.PreEntityImages[PreImageName].ToEntity<T>();
			}

			return entity;
		}

		/// <summary>
		/// Gets the proxy implementation for the entity from the post entity images.
		/// </summary>
		/// <typeparam name="T">The proxy type of the entity to be returned.</typeparam>
		/// <returns>The proxy for the entity from the post entity images.</returns>
		internal T GetTargetEntityFromPostEntityImages<T>() where T : Entity
		{
			T entity = null;

			if (this.PluginExecutionContext.PostEntityImages != null && this.PluginExecutionContext.PostEntityImages.Contains(PostImageName))
			{
				entity = this.PluginExecutionContext.PostEntityImages[PostImageName].ToEntity<T>();
			}

			return entity;
		}

		/// <summary>
		/// Retrieves the target entity reference that was passed to the plugin.
		/// </summary>
		internal EntityReference GetTargetEntityReference()
		{
			return this.PluginExecutionContext.InputParameters[TargetEntityParameterName] as EntityReference;
		}

		/// <summary>
		/// Returns true if triggered through cascade delete
		/// </summary>
		/// <returns></returns>
		internal bool IsCascadeDelete()
		{
			return (PluginExecutionContext.ParentContext == null || PluginExecutionContext.ParentContext.MessageName == DeleteMessageName && PluginExecutionContext.ParentContext.PrimaryEntityName != PluginExecutionContext.PrimaryEntityName);
		}
	}
}
