
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/


namespace Microsoft.ProductivityMacros.MacrosDataLayer
{
    export class OCEndpoint
    {
        public svcMap: Map<string, string>;
        public isMock: boolean;

        /**
         * Default constructor
         * @param context Control context
         * @param controlName Name of the Omnichannel custom control - Will be used in telemetry
         */
        public constructor(isMock?: boolean) {

            if(Utils.isNullUndefinedorEmpty(isMock))
            {
                this.isMock = false;
            }
            else
            {
                this.isMock = isMock;
            }

            let fpiURL = this.appendParamterstoURL(EndpointConstants.publicFPIUrlMap.get(EndpointConstants.PRODEnvKey), EndpointConstants.PRODEnvKey.toLowerCase(), EndpointConstants.publicString, false);
            this.svcMap = new Map()
                .set(EndpointConstants.ocEndpointNameKey, EndpointConstants.emptyString)
                .set(EndpointConstants.ocBaseUrlKey, EndpointConstants.emptyString)
                .set(EndpointConstants.ocFPIUrlKey, fpiURL)
                .set(EndpointConstants.ocDeploymentTypeKey, EndpointConstants.emptyString)
                .set(EndpointConstants.namespaceDeploymentKey, EndpointConstants.publicString);
        }


        public appendParamterstoURL(url: string, env: string, cloudtype: string, isMock: boolean)
        {
            if(isMock === true)
            {
                return url + "env=" + env + "&cloudtype=" + cloudtype + "&mock=" + isMock;
            }
            return url + "env=" + env + "&cloudtype=" + cloudtype;
        }

        /**
         * Getter for Service endpoint Map
         */
        public getSvcMap(): Map<string, string>
        {
            return this.svcMap
        }

        /*
        * Utility function: Returns empty string if given string is null or undefined or empty
        * Else it returns the same string 
        * @param val value to be validated
        */
        public getValue(val: string): string
        {
            if (Utils.isNullUndefinedorEmpty(val))
            {
                return EndpointConstants.emptyString;
            }
            return val;
        }

        /**
         * Hepler method to set FPI url based on environment type.
         * @param env Environment type DEV, INT, PPE, PROD.
         */
        private setOcFPIUrl(): void {

            let env = this.svcMap.get(EndpointConstants.ocDeploymentTypeKey);
            let cloudType = this.svcMap.get(EndpointConstants.namespaceDeploymentKey);
            let FPIUrlMap = EndpointConstants.getFPIURLMap(cloudType);


            if (Utils.isNullUndefinedorEmpty(env)) {
                //TODO: add telemetry.
            } else {
                if (FPIUrlMap.has(env.toUpperCase())) {
                    let url = FPIUrlMap.get(env.toUpperCase());
                    url = this.appendParamterstoURL(url, env, cloudType, this.isMock);
                    this.svcMap.set(EndpointConstants.ocFPIUrlKey, url);
                }
            }
        }

        /**
         * Retrieve oc endpoint Url
         */
        public retrieveOcEndpoint(): Promise<Map<string, string>> {
            var retrieveRecordPromise = new Promise<Map<string, string>>((resolve, reject) => {
                (window as any).Xrm.WebApi.retrieveRecord(EndpointConstants.endpointEntityName, EndpointConstants.ocEndpointRecordId).then(
                    (response: any) => {
                        this.svcMap.set(EndpointConstants.ocEndpointNameKey, this.getValue(response[EndpointConstants.namePropertyKey]));
                        this.svcMap.set(EndpointConstants.ocBaseUrlKey, this.getValue(response[EndpointConstants.pathPropertyKey]));
                        this.svcMap.set(EndpointConstants.ocDeploymentTypeKey, this.getValue(response[EndpointConstants.descriptionPropertyKey]));
                        this.svcMap.set(EndpointConstants.namespaceDeploymentKey, this.getValue(response[EndpointConstants.namespaceDeploymentKey]));
                        this.setOcFPIUrl();

                        if (Utils.isNullUndefinedorEmpty(this.svcMap.get(EndpointConstants.ocBaseUrlKey))) {
                            // Add Aria telemetry for OC Base URL missing
                            reject(new Error("Base URL empty in serviceendpoint"));
                        }
                        else {
                            resolve(this.svcMap);
                            // Add aria telemetry for successful svc endpoint retrieval
                        }
                    },
                    (errorResponse: any) => {
                        reject(errorResponse);
                        // Add Aria telemetry for failure in retrieving svc endpoint
                    }
                );
            });
            return retrieveRecordPromise;
        }
    }
}