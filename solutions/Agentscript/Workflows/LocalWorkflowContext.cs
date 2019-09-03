//  -----------------------------------------------------------------------
//  <copyright file="LocalWorkflowContext.cs" company="MicrosoftCorporation">
//      Copyright (c) Microsoft Corporation.  All rights reserved.
//  </copyright>
//  -----------------------------------------------------------------------

namespace Microsoft.Dynamics.Agentscript.Workflows
{
    using System;
    using System.Activities;
    using System.Diagnostics.CodeAnalysis;
    using Xrm.Sdk;
    using Xrm.Sdk.Workflow;

    /// <summary>
    /// The workflow context object. 
    /// </summary>
    [ExcludeFromCodeCoverage]
    public class LocalWorkflowContext : ILocalWorkflowContext
    {
        private const string InputParameterTarget = "Target";

        /// <summary> Gets the service provider. </summary>
        /// <value>
        /// The service provider.
        /// </value>
        public IServiceProvider ServiceProvider
        {
            get;

            private set;
        }

        /// <summary> Gets the organization service. </summary>
        /// <value>
        /// The organization service.
        /// </value>
        public IOrganizationService OrganizationService
        {
            get;

            private set;
        }

        /// <summary> Gets the workflow execution context. </summary>
        /// <value>
        /// The workflow execution context.
        /// </value>
        public IWorkflowContext WorkflowExecutionContext
        {
            get;

            private set;
        }

        /// <summary> Gets the tracing service. </summary>
        /// <value>
        /// The tracing service.
        /// </value>
        public ITracingService TracingService
        {
            get;

            private set;
        }

        /// <summary>
        /// Gets the activity context
        /// </summary>
        public CodeActivityContext ActivityContext { get; private set; }

        private LocalWorkflowContext()
        {
        }

        public LocalWorkflowContext(CodeActivityContext executionContext)
        {
            if (executionContext == null)
            {
                throw new ArgumentNullException(nameof(executionContext));
            }

            ActivityContext = executionContext;

            // Obtain the execution context service from the service provider.
            WorkflowExecutionContext = executionContext.GetExtension<IWorkflowContext>();

            // Obtain the tracing service from the service provider.
            TracingService = executionContext.GetExtension<ITracingService>();

            // Obtain the Organization Service factory service from the service provider
            var factory = executionContext.GetExtension<IOrganizationServiceFactory>();

            // Use the factory to generate the Organization Service.
            OrganizationService = factory.CreateOrganizationService(WorkflowExecutionContext.UserId);
        }

        /// <summary>
        /// Writes a trace message to the CRM trace log.
        /// </summary>
        /// <param name="message">The message.</param>
        public void Trace(string message)
        {
            if (string.IsNullOrWhiteSpace(message) || (TracingService == null))
            {
                return;
            }

            if (WorkflowExecutionContext == null)
            {
                TracingService.Trace(message);
            }
            else
            {
                TracingService.Trace(
                    "{0}, Correlation Id: {1}, Initiating User: {2}",
                    message,
                    WorkflowExecutionContext.CorrelationId,
                    WorkflowExecutionContext.InitiatingUserId);
            }
        }

        /// <summary>
        /// Writes a error message to the CRM trace log.
        /// </summary>
        /// <param name="ex">The Exception</param>
        /// <param name="formatMessage">The format message.</param>
        /// <param name="args">Arguments of format message.</param>
        public void TraceError(Exception ex, string formatMessage, params object[] args) 
        {
            if (string.IsNullOrWhiteSpace(formatMessage) || TracingService == null || ex == null)
            {
                return;
            }

            if (WorkflowExecutionContext == null)
            {
                TracingService.Trace(formatMessage);
            }
            else
            {
                var messageLog = $"Exception:{ex} OrganizationId:{WorkflowExecutionContext.OrganizationId} {string.Format(formatMessage, args)}";
                TracingService.Trace(
                    "{0}, Correlation Id: {1}, Initiating User: {2}",
                    messageLog,
                    WorkflowExecutionContext.CorrelationId,
                    WorkflowExecutionContext.InitiatingUserId);
            }
        }

        /// <summary>
        /// Gets the Target input parameter.
        /// </summary>
        /// <typeparam name="T">Expected type of the Target object.</typeparam>
        /// <returns>Target input parameter.</returns>
        public virtual T GetTargetFromInputParameters<T>() where T : Entity
        {
            var target = default(T);

            if (WorkflowExecutionContext.InputParameters.Contains(InputParameterTarget))
            {
                var interimType = WorkflowExecutionContext.InputParameters[InputParameterTarget];
                if ((interimType as Entity) != null)
                {
                    var entityTarget = (Entity)interimType;
                    target = entityTarget.ToEntity<T>();
                }
                else
                {
                    target = (T)interimType;
                }
            }

            return target;
        }
    }
}
