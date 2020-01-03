/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/

module MscrmControls.ProductivityToolPanel {

	export class ControlStyle {

		public static getSelectionIndicatorStyle(flag: boolean){
			return{
				float: "right",
				width: "3px",
				height: "28px",
				backgroundColor: "#2266E3",
				borderCornerShape: "2px",
				visibility: flag ? "visible" : "hidden"
			}
		}

		public static getNavigationBarLastContainer() {
			return {
				height: "100%",
				borderLeftColor: "#E1DFDD",
				borderLeftStyle: "solid",
				borderLeftWidth: "1px"
			};
		}

		public static getProductivityPanelBtnStyle(flag: boolean){
			return {
				height: "45px",
				width: "45px",
				display: "inline-block",
				borderColor: "none",
				borderWidth: "0px",
				backgroundColor: flag ? "white" : "#efefef",
				borderLeftColor: flag ? "white" : "#E1DFDD",
				borderLeftStyle: "solid",
				borderLeftWidth: "1px"
			};
		}

		public static getProductivityPaneStyle(flag: boolean){
			return {
				height: "100%",
				width: flag ? "295px" : "0px",
				position: "fixed",
				top: "48px",
				right: "46px",
				backgroundColor: "#FFFFFF",
				overflowX: "hidden",
				borderLeftColor: "#E8EAEC",
				borderLeftStyle: "solid",
				borderLeftWidth: flag ? "1px" : "0px"
			};
		}

		public static getProductivityNavBarStyle() {
			return {
				display: "block",
				backgroundColor: "#efefef",
				width: "45px",
				position: "absolute",
				height: "100%",
				top: "0px",
				right: "0px",
				borderColor: "none"
			};
		}
	}
}