namespace Microsoft.Dynamics.Template.IntegrationTests
{
    using Autofac;
    using Microsoft.Dynamics.Solution.Common;
    using Microsoft.Xrm.Sdk;
    using Microsoft.Xrm.Test.Common;
    using System;

    public class TestPluginContext : PluginContextBase
    {
        internal TestPluginContext(IServiceProvider serviceProvider) : base(serviceProvider)
        {
        }

        public override IOrganizationService OrganizationService
        {
            get
            {
                return DependencyResolver.Instance.Resolve<IOrganizationService>();
            }
        }
    }
}
