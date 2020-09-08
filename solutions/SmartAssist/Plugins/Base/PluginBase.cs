namespace Microsoft.Dynamics.SmartAssist.Plugin.Base
{

	using System;
	using System.Diagnostics;
	using System.Globalization;
	using Xrm.Sdk;

	/// <summary>
	/// Base class for all plug-in classes.
	/// </summary>
	public abstract class PluginBase : IPlugin
	{
		/// <summary>
		/// Initializes a new instance of the <see cref="PluginBase"/> class.
		/// </summary>
		/// <param name="childClassName">The <see cref=" cred="Type"/> of the derived class.</param>
		[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "PluginBase")]
		public PluginBase(Type childClassName)
		{
			this.ChildClassName = childClassName.ToString();
		}

		/// <summary>
		/// Gets or sets the name of the child class.
		/// </summary>
		/// <value>The name of the child class.</value>
		[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode", Justification = "PluginBase")]
		protected string ChildClassName { get; private set; }

		/// <summary>
		/// Main entry point for the business logic that the plug-in is to execute.
		/// </summary>
		/// <param name="serviceProvider">The service provider.</param>
		[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Globalization", "CA1303:Do not pass literals as localized parameters", MessageId = "CrmVSSolution411.NewProj.PluginBase+LocalPluginContext.Trace(System.String)", Justification = "Execute")]
		public void Execute(IServiceProvider serviceProvider)
		{
			if (serviceProvider == null)
			{
				throw new ArgumentNullException("serviceProvider");
			}

			// Construct the local plug-in context.
			LocalPluginContext localcontext = new LocalPluginContext(serviceProvider);

			localcontext.Trace(string.Format(CultureInfo.InvariantCulture, "Entered {0}.Execute()", this.ChildClassName));

			Stopwatch sw = new Stopwatch();
			sw.Start();

			try
			{
				// Invoke the custom implementation 
				this.ExecuteCrmPlugin(localcontext);

				// now exit - if the derived plug-in has incorrectly registered overlapping event registrations,
				// guard against multiple executions.
				return;
			}
			catch (Exception e)
			{
				localcontext.Trace(string.Format(CultureInfo.InvariantCulture, "Exception: {0}", e.ToString()));
				throw;
			}
			finally
			{
				localcontext.Trace(string.Format(CultureInfo.InvariantCulture, "Exiting {0}.Execute()", this.ChildClassName));
			}
		}

		/// <summary>
		/// Placeholder for a custom plug-in implementation. 
		/// </summary>
		/// <param name="localcontext">Context for the current plug-in.</param>
		public abstract void ExecuteCrmPlugin(LocalPluginContext localcontext);
	}
}