namespace Microsoft.Dynamics.SmartAssist.Plugin.Repository
{
	using Xrm.Sdk;
	using Xrm.Sdk.Client;
	using Xrm.Sdk.Query;
	using System;
	using System.Collections.Generic;
	using System.Linq;

	/// <summary>
	/// Base class for the repository concrete classes.
	/// The goal of this class is to reuse common behavior between the repositories.
	/// </summary>
	/// <remarks>
	/// The simple operations are public and more complex operations are protected because
	/// the concrete repositories should provide an abstraction for them.
	/// </remarks>>
	public abstract class EntityRepository<T> where T : Entity, new()
	{
		protected IOrganizationService organizationService;

		/// <summary>
		/// Builds the repository that will use a given organization service.
		/// </summary>
		/// <param name="organizationService">The organization service that will be used by the repository.</param>
		public EntityRepository(IOrganizationService organizationService)
		{
			this.organizationService = organizationService;
		}

		/// <summary>
		/// Gets the entity logical name.
		/// </summary>
		public virtual string EntityLogicalName
		{
			get
			{
				return (typeof(T).GetCustomAttributes(typeof(EntityLogicalNameAttribute), true)
					.FirstOrDefault() as EntityLogicalNameAttribute).LogicalName;
			}
		}

		/// <summary>
		/// Gets the AttributeId as default primary key name.
		/// </summary>
		public virtual string PrimaryKeyName
		{
			get
			{
				return typeof(T).GetField("AttributeId").GetRawConstantValue().ToString();
			}
		}

		public virtual Guid Create(T entity)
		{
			entity.Id = this.organizationService.Create(entity);
			return entity.Id;
		}

		/// <summary>
		/// Retrieves a given entity by using the id provided.
		/// </summary>
		/// <param name="id">The ID of the entity to retrieve.</param>
		/// <param name="columnSet">The columns to fetch for that record.</param>
		/// <returns>The entity that matches the Id with the values for the specified columns.</returns>
		public virtual T Retrieve(Guid id, ColumnSet columnSet)
		{
			var retrieved = this.organizationService.Retrieve(this.EntityLogicalName, id, columnSet);
			T entity = null;

			if (retrieved != null)
			{
				entity = retrieved.ToEntity<T>();
			}

			return entity;
		}

		/// <summary>
		/// Retrieves a given entity by using the id provided.
		/// </summary>
		/// <param name="id">The ID of the entity to retrieve.</param>
		/// <param name="columns">The names of the columns to be retrieved.</param>
		/// <returns>The entity that matches the Id with the values for the specified columns.</returns>
		public virtual T Retrieve(Guid id, params string[] columns)
		{
			var columnSet = new ColumnSet(columns);
			return this.Retrieve(id, columnSet);
		}

		/// <summary>
		/// Retrieves a given entity by using the entity reference.
		/// </summary>
		/// <param name="entityReference">Entity reference with the information about the entity to be retrieved.</param>
		/// <param name="columnSet">Columns that must be retrieved.</param>
		/// <returns>Retrieved entity.</returns>
		public virtual T RetrieveByEntityReference(EntityReference entityReference, ColumnSet columnSet)
		{
			T entity = null;

			if (entityReference != null)
			{
				var retrieved = this.organizationService.Retrieve(entityReference.LogicalName, entityReference.Id, columnSet);
				if (retrieved != null)
				{
					entity = retrieved.ToEntity<T>();
				}
			}

			return entity;
		}

		/// <summary>
		/// Retrieves a collection of entities based on a string of comma separated entity Ids.
		/// </summary>
		/// <param name="ids">An array of id objects (GUIDs or strings)</param>
		/// <param name="columnSet">The column set to retrieve; optional.</param>
		/// <returns>A collection of entities</returns>
		public EntityCollection RetrieveByIds(object[] ids, ColumnSet columnSet = null)
		{
			EntityCollection entityCollection = null;

			if (ids != null && ids.Length > 0)
			{
				var query = new QueryExpression(this.EntityLogicalName)
				{
					ColumnSet = columnSet ?? new ColumnSet(),
					Criteria =
					{
						Conditions =
						{
							new ConditionExpression(this.PrimaryKeyName, ConditionOperator.In, ids)
						}
					}
				};

				entityCollection = this.RetrieveMultiple(query);
			}

			return entityCollection;
		}

		/// <summary>
		/// Retrieves a collection of entities based on a string of comma separated entity Ids.
		/// </summary>
		/// <param name="ids">An array of id(GUIDs)</param>
		/// <param name="columnSet">The column set to retrieve; optional.</param>
		/// <returns>A collection of entities</returns>
		public IEnumerable<T> RetrieveByIds(Guid[] ids, ColumnSet columnSet = null)
		{
			IEnumerable<T> entities = Enumerable.Empty<T>();

			if (ids != null && ids.Length > 0)
			{
				var query = new QueryExpression(this.EntityLogicalName)
				{
					ColumnSet = columnSet ?? new ColumnSet(),
					Criteria =
					{
						Conditions =
						{
							new ConditionExpression(this.PrimaryKeyName, ConditionOperator.In, ids)
						}
					}
				};

				var entityCollection = this.RetrieveMultiple(query);
				entities = entityCollection.Entities.Cast<T>();
			}

			return entities;
		}

		/// <summary>
		/// Retrieves a collection of entities based on a string of comma separated entity Ids.
		/// </summary>
		/// <param name="ids">A comma separated list of entity Ids.</param>
		/// <param name="columnSet">The column set to retrieve; optional.</param>
		/// <returns>A collection of entities</returns>
		public EntityCollection RetrieveByIds(string ids, ColumnSet columnSet = null)
		{
			return !string.IsNullOrEmpty(ids) ? this.RetrieveByIds(ids.Split(','), columnSet) : null;
		}

		/// <summary>
		/// Retrieves a collection entities based on the specified attributes.
		/// </summary>
		/// <param name="attributeValues">List of attributes to match.</param>
		/// <param name="columns">List of attributes to return.</param>
		/// <returns>List of entities.</returns>
		public virtual EntityCollection RetrieveByAttributes(Dictionary<string, object> attributeValues, ColumnSet columns = null)
		{
			QueryByAttribute query = new QueryByAttribute(this.EntityLogicalName);
			query.ColumnSet = columns ?? new ColumnSet();

			if (attributeValues != null)
			{
				foreach (KeyValuePair<string, object> attributeValue in attributeValues)
				{
					query.AddAttributeValue(attributeValue.Key, attributeValue.Value);
				}
			}

			return this.RetrieveMultiple(query);
		}

		/// <summary>
		/// Checks if there exists and instance of this entity that is referencing the entity
		/// represented by the id provided.
		/// </summary>
		/// <param name="entityField"> The field that is used for the relationship with the target entity.</param>
		/// <param name="entityId">The id of the target entity.</param>
		/// <returns>True if there is an instance of this entity that refers to the instance provided; otherwise, false.</returns>
		public virtual bool HasReference(string entityField, Guid entityId)
		{
			Dictionary<string, object> attributeValues = new Dictionary<string, object>();
			attributeValues.Add(entityField, entityId);
			EntityCollection results = this.RetrieveByAttributes(attributeValues, new ColumnSet(entityField));
			return results.Entities != null && results.Entities.Count != 0;
		}

		/// <summary>
		/// Updates the given entity.
		/// </summary>
		/// <param name="entity">The entity to update.</param>
		public virtual void Update(T entity)
		{
			this.organizationService.Update(entity);
		}

		/// <summary>
		/// Deleted the entity of the provided id.
		/// </summary>
		/// <param name="id">The id of entity to delete.</param>
		public void Delete(Guid id)
		{
			this.organizationService.Delete(this.EntityLogicalName, id);
		}

		/// <summary>
		/// Executes a message in the form of a request, and returns a response.
		/// </summary>
		/// <remarks>
		/// This method is protected to enforce that an abstraction should be created for it at the repository class.
		/// Do not expose RetrieveMultiple.  Create an abstraction above it instead.
		/// </remarks>
		protected OrganizationResponse Execute(OrganizationRequest request)
		{
			return this.organizationService.Execute(request);
		}

		/// <summary>
		/// Creates a link between records.
		/// </summary>
		/// <remarks>
		/// This method is protected to enforce that an abstraction should be created for it at the repository class.
		/// Do not expose RetrieveMultiple.  Create an abstraction above it instead.
		/// </remarks>
		protected void Associate(Guid entityId, Relationship relationship, EntityReferenceCollection relatedEntities)
		{
			this.organizationService.Associate(this.EntityLogicalName, entityId, relationship, relatedEntities);
		}

		/// <summary>
		/// Deletes a link between records.
		/// </summary>
		/// <remarks>
		/// This method is protected to enforce that an abstraction should be created for it at the repository class.
		/// Do not expose RetrieveMultiple.  Create an abstraction above it instead.
		/// </remarks>
		protected void Disassociate(Guid entityId, Relationship relationship, EntityReferenceCollection relatedEntities)
		{
			this.organizationService.Disassociate(this.EntityLogicalName, entityId, relationship, relatedEntities);
		}

		/// <summary>
		/// Retrieves a collection of records.
		/// </summary>
		/// <remarks>
		/// This method is protected to enforce that an abstraction should be created for it at the repository class.
		/// Do not expose RetrieveMultiple.  Create an abstraction above it instead.
		/// </remarks>
		protected EntityCollection RetrieveMultiple(QueryBase query)
		{
			var retrievedEntities = this.organizationService.RetrieveMultiple(query);
			return retrievedEntities;
		}

		/// <summary>
		/// Retrieves a collection of entities.
		/// </summary>
		/// <param name="query">Query to retrieve the entities.</param>
		/// <returns>A collection of entities.</returns>
		/// <remarks>This is a nicety to have a type safe collection instead of the generic <c>EntityCollection</c>.</remarks>
		protected IEnumerable<T> RetrieveEntities(QueryBase query)
		{
			var queryResult = this.RetrieveMultiple(query);

			foreach (var retrievedEntity in queryResult.Entities)
			{
				var entity = retrievedEntity.ToEntity<T>();
				yield return entity;
			}
		}

		/// <summary>
		/// Retrieves a collection of records.
		/// </summary>
		/// <remarks>
		/// This method is protected to enforce that an abstraction should be created for it at the repository class.
		/// Do not expose RetrieveMultiple.  Create an abstraction above it instead.
		/// </remarks>
		protected EntityCollection RetrieveMultiple(string fetchXml)
		{
			return this.RetrieveMultiple(new FetchExpression(fetchXml));
		}

		/// <summary>
		/// Returns the element find by a query if the query just retrieves one element from the given type.
		/// </summary>
		/// <param name="query">Query to be executed.</param>
		/// <returns>Single element found by the query.</returns>
		/// <remarks>
		/// Null will be returned if no element is found, if the element is not from the given type
		/// or if the query returns more than one element.
		/// </remarks>
		protected T RetrieveSingle(QueryBase query)
		{
			var result = this.RetrieveMultiple(query);

			return RetrieveSingle(result);
		}

		/// <summary>
		/// Returns the element find by a query if the query just retrieves one element from the given type.
		/// </summary>
		/// <param name="query">Query to be executed.</param>
		/// <returns>Single element found by the query.</returns>
		/// <remarks>
		/// Null will be returned if no element is found, if the element is not from the given type
		/// or if the query returns more than one element.
		/// </remarks>
		protected T RetrieveSingle(string query)
		{
			var result = this.RetrieveMultiple(query);

			return RetrieveSingle(result);
		}

		private static T RetrieveSingle(EntityCollection result)
		{
			if (result.Entities.Count == 1)
			{
				return result.Entities[0].ToEntity<T>();
			}

			return null;
		}
	}
}
