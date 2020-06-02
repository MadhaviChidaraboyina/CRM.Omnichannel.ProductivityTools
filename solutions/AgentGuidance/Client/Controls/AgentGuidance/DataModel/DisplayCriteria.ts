/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/


module MscrmControls.ProductivityToolAgentGuidance {

    export class DisplayCriterias {
        public isCallScript: boolean;
        public isSmartassist: boolean;

        constructor( agentScript: boolean, smartAssist: boolean) {
            this.isCallScript = agentScript;
            this.isSmartassist = smartAssist;
        }
    }

}