/// <reference path="../../../../references/internal/TypeDefinitions/msdyn_MacrosDataLayer.d.ts" />
/// <reference path="../../../../packages/Crm.ClientApiTypings.1.3.2084/clientapi/XrmClientApi.d.ts" />
/// <reference path="Constants.ts" />

/** @internal */
namespace Microsoft.ProductivityMacros.Internal {

    export class FPIHelper {
        private instanceIdentifier: string;

        //Fpi helper library reference      
        public static isFpiHelperInitialized: boolean = false;

        public constructor() {
            this.instanceIdentifier = Date.now().toString();
        }

        public isNullUndefinedorEmpty(variable: any) {
            if (variable === null || variable === undefined || variable === "") {
                return true;
            }
            return false;
        }

        /**
            * Initialize Fpi Helper Lib instance and register consumer
            */
        private initializeFpiHelper() {
            if (FPIHelper.isFpiHelperInitialized) {
                return;
            }
            let fpiLibHelper = (window.top as any).Microsoft.ProductivityMacros.MacrosDataLayer.DataHelper.getInstance();
            (window.top as any).Microsoft.ProductivityMacros.MacrosDataLayer.DataHelper.registerConsumer(this.instanceIdentifier);
            FPIHelper.isFpiHelperInitialized = true;
        }


        public fetchFlowsEnvId(): Promise<any> {
            let message = this.createFPIRequestMessage();
            if (FPIHelper.isFpiHelperInitialized == false) {
                this.initializeFpiHelper();
            }
            return (window.top as any).Microsoft.ProductivityMacros.MacrosDataLayer.DataHelper.sendFinishedMessage(message);
        }


        /*
            * Returns the FPI static data for GET request
            * This will be sent back to the control along with its response
            */
        private getFPIStaticDataGET() {
            return {
                consumerId: this.instanceIdentifier,
                requestId: this.getRandomString(),
                isFlowEnvIdRequest: true
            };
        }

        /**
            * Generates random string 
            */
        private getRandomString(): string {
            return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        }


        /**
            * Creates FPI request message
            * @param method method name of the request
            * @param url url for the request
            * @param payload payload for the request
            * @param orgId orgId
            * @param staticData staticData to be included in message
            */
        private createFPIRequestMessage() {
            let message = new (window.top as any).Microsoft.ProductivityMacros.MacrosDataLayer.FPIRequestMessage();
            message.payload = this.createPayload();
            message.requestType = Constants.POST_REQUEST;
            message.staticData = this.getFPIStaticDataGET();
            message.header = { "Content-type": "application/json", "cache-control": "no-cache", "pragma": "no-cache" }
            return message;
        }


        public createPayload() {
            return {
                orgId: (window.top as any).Xrm.Utility.getGlobalContext().organizationSettings.organizationId
            };
        }
    }
}