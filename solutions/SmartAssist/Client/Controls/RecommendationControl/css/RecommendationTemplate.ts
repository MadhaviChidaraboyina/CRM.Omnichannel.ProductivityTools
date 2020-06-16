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
		max-width: calc(100% - 15px);
     }

    .recommendation-card-container {
		border-top: 5px solid #FFF;
		background-color: #FFF;
		box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.18), 0px 2px 4px rgba(0, 0, 0, 0.12);
		border-radius: 4px;
		position: relative;
		margin-bottom: 5px;
		padding: 10px;
		font-color: #666666;
	}
    
    .new-card {
		border-top: 5px solid #76A6FF;
	}

    .ac-horizontal-separator {
		height: 5px !important;
	}
	.ac-pushButton {
		background: none;
		border: none;
		padding: 2px!important;
		color: black;
		cursor: pointer;
        justify-content: flex-start!important;
        align-items: flex-start!important;
        margin-left: 10px!important;
        font: menu!important;
        font-size: small!important;
	}
    
    .style-positive {
        background: green;
        color: white;
     }

    .ac-vertical-separator {
        width: 7px!important;
    }
	.ac-textBlock {
		color: #666666!important;
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