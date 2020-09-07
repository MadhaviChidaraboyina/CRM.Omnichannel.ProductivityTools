/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.ProductivityToolAgentGuidance {

    export class ControlStyle {

        public static agentGuidanceTitleStyle(isRTL: boolean) {

            let style: any = {
                position: "relative",
                left: !isRTL ? "15px" : "12.57 %",
                right: !isRTL ? "12.57 %" : "15px",
                top: "8 %",
                bottom: "88.5 %",
                fontFamily: "Segoe UI",
                fontSize: "20px",
                lineHeight: "28px",
                color: "#323130",
                paddingTop: "16px",
                paddingBottom: "5px",
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

        public static agentGuidanceToolsStyle() {
            return {
                height: "87%",
                display: "flex",
                flexDirection: "column"
            }
        }

        public static CallScriptComponentStyle(isSmartassist: boolean, isCardExist: boolean) {
            return {
                paddingRight: "4px",
                paddingLeft: "2px",
                height: "auto",
                maxHeight: isSmartassist && isCardExist ? "inherit" : "100%",
                overflowX: "hidden", 
                overflowY: "auto"
            }
        }

        public static smartAssistComponentStyle(isCallScript: boolean, isCardExist: boolean) {
            return {
                paddingLeft: "14px",
                paddingRight: "4px",
                paddingTop: "11px",
                paddingBottom: "10px",
                height: "auto",
                maxHeight: isCallScript ? "50%" : "100%",
                display: isCardExist ? "" : "none"                       
            }
        }

        public static agentGuidanceErrorScreenStyle() {
            return {
                paddingTop: "15px",
                fontWeight: "600",
                fontFamily: "Segoe UI",
                fontSize: "18px",
                lineHeight: "20px",
                textAlign: "center",
                display: "block"
            }
        }

        public static agentGuidanceErroContainerStyle() {
            return {
                position: "absolute",
                top: "40%",
                display: "block"
            }
        }
     
	}
}