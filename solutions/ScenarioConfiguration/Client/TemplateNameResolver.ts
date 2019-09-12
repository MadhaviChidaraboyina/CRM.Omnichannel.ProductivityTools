/// <reference path="TypeDefinitions/XrmClientApi.d.ts" />
/// <reference path="../../../references/external/TypeDefinitions/lib.es6.d.ts" />

namespace Microsoft.CIFramework.ScenarioConfiguration {

	export class TemplateNameResolver {
		private static SelectAttrs: string = "msdyn_name,_msdyn_notificationtemplate_value,_msdyn_sessiontemplate_value,_msdyn_channelid_value,msdyn_type";
		private static _scenarioRecordsChannels = new Map<string, Map<string, string>>(); // ChannelName to Map<scearioName, templateName>
		private static _scenarioRecordsWithAdditionalAttrs = new Map<string, Map<string, Map<string,string>>> ();// AdditionalAttrName to Map<AdditionalAttrValue, Map<ScenarioName,TemplateName>>
		private static IsInitialized: boolean = false;
		private static IsNullOrUndefined(value: any) {
			if (value != null && value != undefined) {
				return false;
			}
			return true;
		}


		// _scenarioRecordsWithAdditionalAttrs will be like [currently for OC]
		// Key1                     | Key2                 | <Key3,Value>
		//_msdyn_workstreamid_value | <ACTUALworkstreamid> | <scenario1,templateValue>
		//													 <scenario2,templateValue>
		//												     <scenario3,templateValue>
		//							<ACTUALworkstreamid>   | <scenario1,templateValue>
		//													 <scenario2,templateValue>
		//							<ACTUALworkstreamid>   | <scenario1,templateValue>
		//													 <scenario2,templateValue>

		// _scenarioRecordsChannels will be like [currently any third party and OC]
		// Key1             <Key2,Value>
		// <channelName1>|  <scenario1,templateValue>
		//				    <scenario2,templateValue>
		//				    <scenario3,templateValue>
		// <channelName2> | <scenario1,templateValue>
		//				    <scenario2,templateValue>
		// <channelName3> | <scenario1,templateValue>
		//				    <scenario2,templateValue>

		/**
		 * Initializes the _scenarioRecordsChannels and _scenarioRecordsWithAdditionalAttrs if not initialized already
		 * @param additionalAttr Additional Attributes that need to be fetched if any. in case of OC, they send _msdyn_workstreamid_value as extra select param.
		 */
		private static InitScenarioMap(additionalAttr?: string): Promise<boolean> {
			return new Promise<boolean>(
				function (resolve, reject) {
					if (!TemplateNameResolver.IsNullOrUndefined(additionalAttr)) {
						var value = TemplateNameResolver._scenarioRecordsWithAdditionalAttrs.get(additionalAttr);
							if (!TemplateNameResolver.IsNullOrUndefined(value)) {
								return resolve(true);
							}
						}
					else if (TemplateNameResolver.IsInitialized) {
						return resolve(true);
					}
					try {
						var selectParams = (additionalAttr != null) ? TemplateNameResolver.SelectAttrs + "," + additionalAttr : TemplateNameResolver.SelectAttrs;
						Xrm.WebApi.online.retrieveMultipleRecords("msdyn_scenario",
							"?$select=" + selectParams + "&$filter=statecode eq 0").then(function (response: any) {
								TemplateNameResolver.FillSessionAndNotificationMap(response.entities, additionalAttr);
								TemplateNameResolver.IsInitialized = true;
								return resolve(true);
							}, function (error) {
								return reject(error);
							});
					} catch (error) {
						return reject(error);
					}
				});
		}

		/**
		 * Gets the session and notification template and updates _scenarioRecordsChannels and _scenarioRecordsWithAdditionalAttrs
		 * @param entities The list of scenario entities
		 * @param addOnAttrName The additional attribute to be used to fill _scenarioRecordsWithAdditionalAttrs if any
		 */
		private static FillSessionAndNotificationMap(entities: any[], addOnAttrName?: string) {
			try {

				for (var i = 0; i < entities.length; i++) {
					let recordName: string = entities[i]["msdyn_name"];
					recordName = recordName.toLowerCase();
					let channelValue: string = entities[i]["_msdyn_channelid_value@OData.Community.Display.V1.FormattedValue"];
					channelValue = TemplateNameResolver.IsNullOrUndefined(channelValue) ? channelValue : channelValue.toLowerCase();

					let additionalAttrValue: string = entities[i][addOnAttrName];
					let templateValue = TemplateNameResolver.getTemplateDetails(entities[i]);
					if (addOnAttrName != null && entities[i][addOnAttrName] != null) {

						// _scenarioRecordsWithAdditionalAttrs will be like [currently for OC]
						// Key1                     | Key2                 | <Key3,Value>
						//_msdyn_workstreamid_value | <ACTUALworkstreamid> | <scenario1,templateValue>
						//													 <scenario2,templateValue>
						//												     <scenario3,templateValue>
						//							<ACTUALworkstreamid>   | <scenario1,templateValue>
						//													 <scenario2,templateValue>
						//							<ACTUALworkstreamid>   | <scenario1,templateValue>
						//													 <scenario2,templateValue>

						var mapForAdditionalAttr: Map<string, Map<string, string>> = TemplateNameResolver._scenarioRecordsWithAdditionalAttrs.get(addOnAttrName);

						// if Key1 is not present, insert key1 and create map to insert key2 and key3.
						if (TemplateNameResolver.IsNullOrUndefined(mapForAdditionalAttr)) {
							var attributeMap = new Map<string, Map<string, string>>();
							attributeMap.set(additionalAttrValue, new Map().set(recordName, templateValue));
							TemplateNameResolver._scenarioRecordsWithAdditionalAttrs.set(addOnAttrName, attributeMap);
						}
						// if Key2 is not present, insert Key2 and have map created with scearnio,template inserted as its value
						else if (TemplateNameResolver.IsNullOrUndefined(mapForAdditionalAttr.get(additionalAttrValue))) {
							var scearioMap = new Map<string, string>();
							scearioMap.set(recordName, templateValue);
							TemplateNameResolver._scenarioRecordsWithAdditionalAttrs.get(addOnAttrName).set(additionalAttrValue, scearioMap);
						}
						//if both key1 and key2 are available,just insert key3 with its value
						else
							TemplateNameResolver._scenarioRecordsWithAdditionalAttrs.get(addOnAttrName).get(additionalAttrValue).set(recordName, templateValue);
					}

					// _scenarioRecordsChannels will be like [currently any third party and OC]
						// Key1             <Key2,Value>
						// <channelName1>|  <scenario1,templateValue>
						//				    <scenario2,templateValue>
						//				    <scenario3,templateValue>
						// <channelName2> | <scenario1,templateValue>
						//				    <scenario2,templateValue>
						// <channelName3> | <scenario1,templateValue>
						//				    <scenario2,templateValue>

					if (channelValue != null) {

						if (TemplateNameResolver.IsNullOrUndefined(TemplateNameResolver._scenarioRecordsChannels.get(channelValue))) {
							TemplateNameResolver._scenarioRecordsChannels.set(channelValue, new Map<string, string>());
						}
						TemplateNameResolver._scenarioRecordsChannels.get(channelValue).set(recordName, templateValue);
					}
				}
			}
			catch (error) {
				console.log(error);
			}
		}

		/**
		 * Given a entity bag, this returns notification template name or session template name depending upon the type
		 * @param entityBag The entity bag.
		 */
		private static getTemplateDetails(entityBag: any) {
			if (entityBag["msdyn_type"]) {
				return entityBag["_msdyn_notificationtemplate_value@OData.Community.Display.V1.FormattedValue"];
				}
					return entityBag["_msdyn_sessiontemplate_value@OData.Community.Display.V1.FormattedValue"];
		}

		/**
		 * Gets the template name for given scearnio and channel (also accepts additional attributes name to override channel)
		 * @param parameters The dictionary containing channelName, ScenarioName
		 * In case of OC, they pass overridingAttribute with attributeName  and attributeValue to get templates on workstream level
		 */
		public static GetTemplateName(parameters: any): Promise<string> {
			return new Promise<string>(
				function (resolve, reject) {
					try {
						var channelName: string = parameters["channelName"];
						channelName = channelName.toLowerCase();
						var scenarioName: string = parameters["scenarioName"];
						scenarioName = scenarioName.toLowerCase();
						if (TemplateNameResolver.IsNullOrUndefined(channelName) || TemplateNameResolver.IsNullOrUndefined(scenarioName)) {
							reject(new Error("Channel or scenario name is not defined"));
						}

						var additionalAttr: any = parameters["overridingAttribute"];
						var overridingAttibuteName: string;
						var overridingAttibuteValue: string;
						if (additionalAttr != null && additionalAttr != undefined) {
							overridingAttibuteName = additionalAttr["attributeName"];
							overridingAttibuteValue = additionalAttr["attributeValue"];
						}

						TemplateNameResolver.InitScenarioMap(overridingAttibuteName).then(function (result) {
							var templateName;
							if (!TemplateNameResolver.IsNullOrUndefined(overridingAttibuteValue)) {

							var scenarioMapAddonAttr: Map<string, Map<string, string>> = TemplateNameResolver._scenarioRecordsWithAdditionalAttrs.get(overridingAttibuteName);
							if (!TemplateNameResolver.IsNullOrUndefined(scenarioMapAddonAttr) &&
								!TemplateNameResolver.IsNullOrUndefined(scenarioMapAddonAttr.get(overridingAttibuteValue))) {
								templateName = scenarioMapAddonAttr.get(overridingAttibuteValue).get((overridingAttibuteValue + "_" + scenarioName).toLowerCase());
								}
							}
							if (TemplateNameResolver.IsNullOrUndefined(templateName) || templateName == "") {
								var scenarioMap: Map<string, string> = TemplateNameResolver._scenarioRecordsChannels.get(channelName);
								if (!TemplateNameResolver.IsNullOrUndefined(scenarioMap)) {
									templateName = scenarioMap.get(scenarioName);
								}
							}
							resolve(templateName);
						}, function (error: any) {
							reject(error);
						});
					}
					catch (error) {
						reject(error);
					}
				});
		}
	}
}