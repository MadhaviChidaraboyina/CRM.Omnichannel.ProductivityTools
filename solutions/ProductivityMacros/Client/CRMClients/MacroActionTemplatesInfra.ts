/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
/// <reference path="../Libraries/requirejs/require.d.ts" />

/** @internal */
namespace Microsoft.ProductivityMacros.Internal {
    export class ProductivityMacroOperation {
        public static macroActionTemplates = new Map<string, ProductivityMacroActionTemplate>();
        public static macroConnectorTemplates = new Map<string, ProductivityMacroConnector>();
        private static isWebResourceLoaded = false;

        public static InitMacroActionTemplates(): Promise<boolean> {
            return new Promise<boolean>(
                function (resolve, reject) {
                    if (ProductivityMacroOperation.macroActionTemplates.size > 0 && ProductivityMacroOperation.isWebResourceLoaded == true) {
                        return resolve(true);
                    }
                    let mPromises: Promise<any>[] = [];
                    mPromises.push(Xrm.WebApi.retrieveMultipleRecords(EntityName.ActionTemplateEntityName,
                        "?$select=msdyn_name,msdyn_title,msdyn_runtimeapi"));
                    mPromises.push(Xrm.WebApi.retrieveMultipleRecords(EntityName.ConnectorEntityName,
                        "?$select=msdyn_prefix,msdyn_callback,msdyn_webresourcename"));

                    Promise.all(mPromises).then(
                        function (results: any[]) {
                            results[0].entities.forEach(
                                function (value: any) {
                                    ProductivityMacroOperation.macroActionTemplates.set(value["msdyn_name"], new ProductivityMacroActionTemplate(
                                        value["msdyn_macroactiontemplateId"],
                                        value["msdyn_name"],
                                        value["msdyn_title"],
                                        value["msdyn_runtimeapi"]
                                    ));
                                });
                            results[1].entities.forEach(
                                function (value: any) {
                                    ProductivityMacroOperation.macroConnectorTemplates.set(value["msdyn_prefix"], new ProductivityMacroConnector(
                                        value["msdyn_prefix"],
                                        value["msdyn_callback"],
                                        value["msdyn_webresourcename"]
                                    ));
                                }
                            );
                            loadWebResource().then((result) => {
                                ProductivityMacroOperation.isWebResourceLoaded = true;
                                return resolve(true);
                            }, (error) => {
                                return reject(error);
                            });
                        },
                        function (error) {
                            return reject(error);
                        });
                }
            );
        }
    }

    export class ProductivityMacroActionTemplate {

        private _templateId: string;
        private _name: string;
        private _title: string;
        private _runtimeAPI: string;

        public get runtimeAPI(): string {
            return this._runtimeAPI;
        }

        public constructor(templateId: string, actionName: string, actionTitle: string, actionRuntimeAPI: string) {
            this._templateId = templateId;
            this._name = actionName;
            this._title = actionTitle;
            this._runtimeAPI = actionRuntimeAPI;
        }
    }

    export class ProductivityMacroConnector {
        private _prefix: string;
        private _callback: string;
        private _webresourceName: string;

        public constructor(prefix: string, callback: string, webresourceName: string) {
            this._prefix = prefix;
            this._callback = callback;
            this._webresourceName = webresourceName;
        }

        public get callback(): string {
            return this._callback;
        }

        public get webresourceName(): string {
            return this._webresourceName;
        }
    }

    function loadWebResource(): Promise < any > {
        return new Promise<any>((resolve, reject) => {
            let webresources: { [key: string]: boolean } = {}
            let resources: string[] = [];
            if (Internal.ProductivityMacroOperation.macroConnectorTemplates.size === 0) {
                return resolve(true);
            }
            var serverUrl = (((((window as any).top) as any).Xrm) as any).Page.context.getClientUrl();
            if (serverUrl.match(/\/$/)) {
                serverUrl = serverUrl.substring(0, serverUrl.length - 1);
            }
            Internal.ProductivityMacroOperation.macroConnectorTemplates.forEach((value, key, map) => {
                var webresourcename = value.webresourceName;
                if (!Internal.isNullOrUndefined(webresourcename)) {
                    webresources[webresourcename] = false;
                }
            });
            let promises: Promise<any>[] = [];
            if (Object.keys(webresources).length > 0) {
                Object.keys(webresources).forEach(function (key) {
                    promises.push(findDepedency(key, webresources));
                });
            } else {
                return resolve("success");
            }

            Promise.all(promises).then(
                function (results: any[]) {
                    Object.keys(webresources).forEach(function (key) {
                        resources.push(serverUrl + "/webresources/" + key);
                    });

                    require(resources, function (library: any) {
                        return resolve("success");
                    });
                },
                function (error) {
                    return reject(error);
                }
            );
        });
    }

    function findDepedency(webresourcename: string, webresources: { [key: string]: boolean }): Promise<any> {
        if (webresources[webresourcename] == false) {
            webresources[webresourcename] = true;
            return new Promise<any>((resolve, reject) => {
                Xrm.WebApi.retrieveMultipleRecords("webresource", "?$select=name,dependencyxml,webresourceid&$filter=name%20eq%20%27" + webresourcename + "%27").then(
                    function (result) {
                        result.entities.forEach(
                            function (value, index, array) {
                                let dependencyResources = getDependendency(value["dependencyxml"]);
                                if (dependencyResources.length > 0) {
                                    let promises: Promise<any>[] = [];
                                    dependencyResources.forEach(
                                        function (value, index, array) {
                                            if (!(value in webresources)) {
                                                //if (isResx(value)) {
                                                //    webresources[value] = true;
                                                //} else {
                                                    webresources[value] = false;
                                                    promises.push(findDepedency(value, webresources));
                                                //}
                                            } else if (webresources[value] == false) {
                                                promises.push(findDepedency(value, webresources));
                                            }
                                        }
                                    )
                                    Promise.all(promises).then(
                                        function (results: any[]) {
                                            resolve("success");
                                        },
                                        function (error) {
                                            return reject(error);
                                        }
                                    );
                                } else {
                                    resolve("success");
                                }
                            }
                        );
                    },
                    function (error) {
                        reject(error);
                    }
                );
            });
        }
    }

    function getDependendency(dependencyxml: string): string[] {
        var dependentResources: string[] = [];
        var parsedXml = (window.top as any).$.parseXML(dependencyxml);
        var dependency = parsedXml.documentElement.childNodes;
        for (var i = 0; i < dependency.length; i++) {
            var libraries = dependency[i].childNodes;
            for (var l = 0; l < libraries.length; l++) {
                var webresourceName = libraries[l].getAttribute("name");
                if (!isNullOrUndefined(webresourceName)) {
                    dependentResources.push(webresourceName);
                }
            }
        }
        return dependentResources;
    }

    function isResx(resourceName: string): boolean {
        var type = resourceName.substring(resourceName.length - 4);
        if (type === "resx") {
            return true;
        } else {
            return false;
        }
    }
}