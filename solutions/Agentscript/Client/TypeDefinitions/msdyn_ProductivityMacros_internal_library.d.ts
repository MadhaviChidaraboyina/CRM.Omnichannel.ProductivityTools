/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
declare namespace Microsoft.ProductivityMacros {
	function runMacro(macroName: string, params?: string): Promise<string>;
}

declare namespace Microsoft.ProductivityMacros.Internal {
    class ProductivityMacroOperation {
        static macroActionTemplates: any;
        static macroConnectorTemplates: any;
        private static isWebResourceLoaded;
        static InitMacroActionTemplates(): Promise<boolean>;
    }
    class ProductivityMacroActionTemplate {
        private _templateId;
        private _name;
        private _title;
        private _runtimeAPI;
        readonly runtimeAPI: string;
        constructor(templateId: string, actionName: string, actionTitle: string, actionRuntimeAPI: string);
    }
    class ProductivityMacroConnector {
        private _prefix;
        private _callback;
        private _webresourceName;
        constructor(prefix: string, callback: string, webresourceName: string);
        readonly callback: string;
        readonly webresourceName: string;
    }
}

declare namespace Microsoft.ProductivityMacros.Internal {
    function resolveTemplateString(input: string, templateParams: any, scope: string): Promise<string>;
}
