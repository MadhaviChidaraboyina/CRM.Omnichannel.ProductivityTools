/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/** @internal */
namespace Microsoft.ProductivityMacros.Internal {

    export class ProductivityMacroState {
        private _stateParams: any;

        public constructor(stateParams?: any) {
            this._stateParams = stateParams || {};
        }

        public get stateParams(): any {
            return this._stateParams;
        }

        public setStateParams(input: any) {
            for (let key in input) {
                this._stateParams[key] = input[key];
            }
        }

        public removeStateParams(input: any) {
            for (var i = 0; i < input.length; i++) {
                delete this._stateParams[input[i]];
            }
        }
    }
}