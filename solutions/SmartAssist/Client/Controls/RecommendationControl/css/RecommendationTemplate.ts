/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
module MscrmControls.Smartassist {
	export class RecommendationTemplate {

		public static get(isRTL: boolean): string {
			let alignment = "left: calc(100% - 26px);";
			let containerPadding = "0px!important";
			if (isRTL) {
				alignment = "right: calc(100% - 26px);";
				containerPadding = "0px";
			}
			return `
<style id="recommendation-style">
	body, html {
		height: 100%;
		width: 99%;
		margin: 0;
	}
    
    .recommendation-outer-container {
		max-width: calc(100% - 25px);
		margin: 0 auto;
		box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.18), 0px 2px 4px rgba(0, 0, 0, 0.12);
		border-radius: 2px;
        margin-bottom: 5px;
     }

     .ca-success-style {
        border: 1px solid #1AD358;
		border-radius: 2px;
     }

    .cs-failure-style {
        border: 1px solid #FF7676;
		border-radius: 2px;
     }

    .recommendation-card-container {
		border-top: 5px solid #FFF;
		background-color: #FFF;
		position: relative;
		margin-left: 1px;
		padding-left: 10px;
        padding-right: 10px;
		padding-top: 5px;
        padding-bottom: 7px;
		font-color: #666666;
	}
    
    .new-card {
		border-top: 5px solid #76A6FF;
	}

    .ca-failure-message {
		height: 20px;
        font-family: Segoe UI;
        font-size: 12px;
		color: #444444;
        background: #FDE7E9;
        padding: 5px
     }

    .ca-success-message {
		height: 20px;
        font-family: Segoe UI;
        font-size: 12px;
		color: #444444;
        background: #DFF6DD;
        padding: 5px;
	 }

    .ac-horizontal-separator {
		height: 5px !important;
	}
	.ac-pushButton {
		background: none;
		border: none;
		padding: 2px!important;
        color: #605E5C;
		cursor: pointer;
        justify-content: flex-start!important;
        align-items: flex-start!important;
        font-size: 10px;
        font-weight: 600;
        font-family: Segoe UI;
	}
    
	.ac-selectable {
		cursor: pointer;
	}

    .style-positive {
        background: #1AAD4B;
        color: white;
     }

    .ac-vertical-separator {
        width: 7px!important;
    }

	.ac-container {
		padding: ${containerPadding}
	}

	.ac-pushButton > img{
		width: 14px!important;
		height: 30px!important;
	}
</style>
`;
		}
	}
}