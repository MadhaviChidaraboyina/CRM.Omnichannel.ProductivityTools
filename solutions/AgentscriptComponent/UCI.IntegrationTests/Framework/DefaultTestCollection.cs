//-----------------------------------------------------------------------
// <copyright file="DefaultTestCollection.cs" company="MicrosoftCorporation">
//   Copyright (c) Microsoft Corporation.  All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Agentscript.UCI.IntegrationTests
{
    using Xunit;

	/// <summary>
	/// Default collection of Agentscript UCI integration tests.
	/// </summary>
	[CollectionDefinition("AgentscriptIntegrationTests")]
    public class DefaultTestCollection : ICollectionFixture<SolutionUCIFixture>
    {
        // This class is intended not to have any code.
        // Its purpose is simply to be the place to apply [CollectionDefinition] and all the
        // ICollectionFixture<> interfaces.
    }
}
