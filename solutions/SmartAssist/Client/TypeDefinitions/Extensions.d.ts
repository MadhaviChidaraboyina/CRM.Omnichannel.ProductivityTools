/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

interface String {
	Format(...params: string[]): string;
}

declare namespace Microsoft.ProductivityMacros {
    function runMacro(macroName: string, params?: string): Promise<string>;
}
declare namespace Microsoft.Macros.Utility {
    function getResourceString(key: any): any;
}