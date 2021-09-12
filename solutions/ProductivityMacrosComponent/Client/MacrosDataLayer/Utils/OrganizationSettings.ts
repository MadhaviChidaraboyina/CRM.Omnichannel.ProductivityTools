
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/


namespace Microsoft.ProductivityMacros.MacrosDataLayer {
    export class OrganizationSettings {
        private static singletoneInstance: OrganizationSettings;

        private organizationSettings: IOrganizationSettings;
        private constructor() {
            this.organizationSettings = ((window.top as any).Xrm.Utility as XrmClientApi.Utility)
                .getGlobalContext()
                .organizationSettings as IOrganizationSettings;
        }


        public static get instance(): OrganizationSettings {
            if (!OrganizationSettings.singletoneInstance) {
                OrganizationSettings.singletoneInstance = new OrganizationSettings();
            }

            return OrganizationSettings.singletoneInstance;
        }

        public get geoName(): string {
            let organizationGeoName = "";
            let organizationSettings = this.organizationSettings;
            if (organizationSettings) {
                organizationGeoName = organizationSettings.organizationGeo;
                if (organizationGeoName && organizationGeoName.toUpperCase() === "NA") {
                    organizationGeoName = organizationSettings.isSovereignCloud ? "GCC" : organizationGeoName;
                }
            }
            return organizationGeoName;
        }

        public get originalOrganizationSettings(): XrmClientApi.OrganizationSettings {
            return this.organizationSettings;
        }

        public get isSovereignCloud(): boolean {
            return this.organizationSettings.isSovereignCloud;
        }
    }

    export interface IOrganizationSettings extends XrmClientApi.OrganizationSettings {
        isSovereignCloud: boolean;
        organizationGeo: string;
    }
}