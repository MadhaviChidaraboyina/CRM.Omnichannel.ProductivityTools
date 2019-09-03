//  -----------------------------------------------------------------------
//  <copyright file="ILocalWorkflowContext.cs" company="MicrosoftCorporation">
//      Copyright (c) Microsoft Corporation.  All rights reserved.
//  </copyright>
//  -----------------------------------------------------------------------

namespace Microsoft.Dynamics.Agentscript.Workflows
{
    using System;
    using System.Activities;
    using Xrm.Sdk;
    using Xrm.Sdk.Workflow;

    /// <summary>
    /// The local workflow context
    /// </summary>
    public interface ILocalWorkflowContext
    {
        /// <summary>
        /// Gets the service provider.
        /// </summary>
        IServiceProvider ServiceProvider { get; }

        /// <summary>
        /// Gets an instance of the Organization Service.
        /// </summary>
        IOrganizationService OrganizationService { get; }

        /// <summary>
        /// Gets the workflow execution context.
        /// </summary>
        IWorkflowContext WorkflowExecutionContext { get; }

        /// <summary>
        /// Gets the tracing service.
        /// </summary>
        ITracingService TracingService { get; }

        /// <summary>
        /// Gets the activity context
        /// </summary>
        CodeActivityContext ActivityContext { get; }

        /// <summary>
        /// Traces the specified message.
        /// </summary>
        /// <param name="message">The message.</param>
        void Trace(string message);

        /// <summary>
        /// Writes a error message to the CRM trace log.
        /// </summary>
        /// <param name="ex">The Exception</param>
        /// <param name="formatMessage">The format message.</param>
        /// <param name="args">Arguments for format message.</param>
        void TraceError(Exception ex, string formatMessage, params object[] args);

        /// <summary>
        /// Gets the Target object from input parameters.
        /// </summary>
        /// <typeparam name="T">Type of object.</typeparam>
        /// <returns>Target object in the expected type.</returns>
        T GetTargetFromInputParameters<T>() where T : Entity;
    }
}