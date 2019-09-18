/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
declare namespace Microsoft.ProductivityMacros.Internal {
    function runMacro(macroName: string, params?: string): Promise<string>;
}
declare namespace Microsoft.Macros.Utility {
    function getResourceString(key: any): any;
}
