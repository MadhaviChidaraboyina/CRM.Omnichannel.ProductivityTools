/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 */
module ProductivityPaneLoader {
    export class ProductivityPaneConfig {
        public productivityPaneState: boolean;
        public productivityPaneMode: boolean;
        public productivityToolsConfig: ProductivityToolsConfig;

        constructor(
            productivityPaneState: boolean,
            productivityPaneMode: boolean,
            productivityToolsConfig: ProductivityToolsConfig,
        ) {
            this.productivityPaneState = productivityPaneState;
            this.productivityPaneMode = productivityPaneMode;
            this.productivityToolsConfig = productivityToolsConfig;
        }
    }
}
