/// <reference path="../../Typings/msdyn_MacrosDataLayer.d.ts" />
import { Constants } from "./../constants/DesignerConstants";

export class FPIHelper {
    // Instance identifier to filter fpi callback messages
    private instanceIdentifier: string;

    private MacrosDataLayer: typeof Microsoft.ProductivityMacros.MacrosDataLayer;
    private static dataHelper: Microsoft.ProductivityMacros.MacrosDataLayer.DataHelper | null = null;

    //Fpi helper library reference      
    public static isFpiHelperInitialized: boolean = false;

    public constructor() {
        this.instanceIdentifier = Date.now().toString();
        this.MacrosDataLayer = (window.top as any).Microsoft.ProductivityMacros.MacrosDataLayer;
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
        FPIHelper.dataHelper = this.MacrosDataLayer.DataHelper.getInstance();
        this.MacrosDataLayer.DataHelper.registerConsumer(this.instanceIdentifier);
        FPIHelper.isFpiHelperInitialized = true;
    }

    public async listFlows(entityName: any): Promise<any> {
        if (FPIHelper.isFpiHelperInitialized == false) {
            this.initializeFpiHelper();
        }
        const requestContent = new this.MacrosDataLayer.FlowRequestContext(this.instanceIdentifier, this.getRandomString());
        return FPIHelper.dataHelper?.FlowClient.getFlows(entityName, requestContent);
    }

    /**
        * Generates random string 
        */
    private getRandomString(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}