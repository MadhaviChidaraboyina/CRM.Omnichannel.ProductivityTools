/**
 * DO NOT REFERENCE THE .ts FILE DIRECTLY
 * To consume this
 * 1. reference the generated .d.ts file in ../../../../TypeDefinitions/Agentscript/Localization/ResourceStringProvider.d.ts.
 * 2. add Agentscript/Localization/ResourceStringProvider.js as a web resource dependency on the js file that is consuming this.
 */
declare module Agentscript {
    class ResourceStringProvider {
        static WebResourceName: string;
        static getResourceString(key: string): string;
    }
}
