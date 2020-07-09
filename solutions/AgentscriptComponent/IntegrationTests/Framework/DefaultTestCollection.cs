//-----------------------------------------------------------------------
// <copyright file="DefaultTestCollection.cs" company="MicrosoftCorporation">
//   Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Agentscript.Xrm.IntegrationTests
{
    using Xunit;

	/// <summary>
	/// Default collection of Agentscript integration tests.
	/// </summary>
	[CollectionDefinition("TemplateIntegrationTests")]
    public class DefaultTestCollection : ICollectionFixture<SolutionFixture>
    {
        // This class is intended not to have any code.
        // Its purpose is simply to be the place to apply [CollectionDefinition] and all the
        // ICollectionFixture<> interfaces.
    }
}
