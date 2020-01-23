/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.ProductivityToolAgentGuidance {

	export class ControlStyle {
        public static agentGuidanceTitleStyle() {

            let style: any = {
                position: "relative",
                left: "16px",
                right: "12.57 %",
                top: "8 %",
                bottom: "88.5 %",
                fontFamily: "Segoe UI",
                fontSize: "20px",
                lineHeight: "28px",
                color: "#323130",
                paddingTop: "16px",
            };

            return style;
		}

        public static agentGuidanceContainerStyle() {

            let style: any = {
                width: "295px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            };

            return style;

        }

        public static toolSeparatorStyle() {
            return {
                position: "absolute",
                width: "100%",
                height: "1px",
                background: "#EDEBE9",
            }
        }
     
	}
}