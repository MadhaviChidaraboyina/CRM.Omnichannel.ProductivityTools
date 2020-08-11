/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
module MscrmControls.ProductivityPanel {
	export class TPBotTemplate {

		public static get(isRTL: boolean): string {
			let alignment = "left: calc(100% - 26px);";
			let containerPadding = "0px!important";
			if (isRTL) {
				alignment = "right: calc(100% - 26px);";
				containerPadding = "0px";
			}
			return `
<style id="tpbot-style">
	body, html {
		height: 100%;	
		width: 99%;
		margin: 0;
	}

	.tpbot-title {
		width: 0px;
		height: 0px;
		visibility: hidden;
		font-family: Segoe UI;
		font-size: 16px;
		padding-bottom: 5px;
		font-weight: 600px;
	}

	.tpbot-success {
		color: #107C10;
		font-size: 14px;
		font-family: Segoe UI;
		padding: 2px;
	}

	#tpbot-outer-container {
		max-height: 100%;		
		padding: 2px;
		padding-bottom: 5px;
	}
	
	.card-new {
		background-color: #F0FAFF!important;
	}

	.card-applied{
		background-color: #F6F6F6!important;
	}

	.card-error {
		border: 1px solid #A80000!important;
	}

	#tpbot-outer-container::-webkit-scrollbar-thumb {
		background: #FFFFFF;
		border-radius: 4px;
	}

	#tpbot-outer-container::-webkit-scrollbar-track {
		background: #FFFFFF;
	}

	#tpbot-outer-container:hover::-webkit-scrollbar-thumb {
		background: #b5b5b5;
	}

	#tpbot-outer-container::-webkit-scrollbar {
		width: 7px;
		visibility: hidden;
	}

	.tpbot-card-container {
		max-width: calc(100% - 25px);
		background-color: #FFF;
		box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.18), 0px 2px 4px rgba(0, 0, 0, 0.12);
		border-radius: 4px;
		position: relative;		
		padding: 6px;
		font-color: #666666;
        margin: 0 auto 5px;
	}
	.tpbot-card-container:last-child {
			margin-bottom: 0px;
	}
	.tpb-ac-pushButton {
		background: none!important;
		border: none;
		padding: 0px!important;
		color: #069;
		cursor: pointer;
	}

	.tpb-ac-textBlock {
		color: #666666;
	}

	.tpb-ac-container {
		padding: ${containerPadding}
	}

	.tpb-ac-pushButton > img{
		width: 14px!important;
		height: 14px!important;
	}

	.Cancel:before {
		content: '\\E711'
	}
	.dismiss-button {
		top: 14px;
		${alignment}
		position: absolute;
		cursor: pointer;
	}
</style>
`;
		}
	}
}