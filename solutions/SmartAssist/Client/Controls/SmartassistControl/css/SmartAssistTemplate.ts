/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
module MscrmControls.ProductivityPanel {
	export class SmartAssistTemplate {

		public static get(isRTL: boolean): string {
			let alignment = "left: calc(100% - 26px);";
			let containerPadding = "0px!important";
			if (isRTL) {
				alignment = "right: calc(100% - 26px);";
				containerPadding = "0px";
			}
			return `
<style id="smartassist-style">
	body, html {
		height: 100%;
		width: 99%;
		margin: 0;
	}

	.smart-assist-title {
		width: 0px;
		height: 0px;
		visibility: hidden;
		font-family: Segoe UI;
		font-size: 16px;
		padding-bottom: 5px;
		font-weight: 600px;
	}

	.smart-assist-success {
		color: #107C10;
		font-size: 14px;
		font-family: Segoe UI;
		padding: 2px;
	}

	#smartassist-outer-container {
		max-height: 100%;
		overflow-y: auto;
		padding: 2px;
		padding-right: 14px;
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

	#smartassist-outer-container::-webkit-scrollbar-thumb {
		background: #FFFFFF;
		border-radius: 4px;
	}

	#smartassist-outer-container::-webkit-scrollbar-track {
		background: #FFFFFF;
	}

	#smartassist-outer-container:hover::-webkit-scrollbar-thumb {
		background: #b5b5b5;
	}

	#smartassist-outer-container::-webkit-scrollbar {
		width: 7px;
		visibility: hidden;
	}

	.smartassist-card-container {
		max-width: calc(100% - 20px);
		background-color: #FFF;
		box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.18), 0px 2px 4px rgba(0, 0, 0, 0.12);
		border-radius: 4px;
		position: relative;
		margin-bottom: 16px;
		padding: 16px;
		font-color: #666666;
	}
	.smartassist-card-container:last-child {
			margin-bottom: 0px;
	}
	.ac-pushButton {
		background: none;
		border: none;
		padding: 0px;
		color: #069;
		cursor: pointer;
	}

	.ac-textBlock {
		color: #666666!important;
	}

	.ac-container {
		padding: ${containerPadding}
	}

	.ac-pushButton > img{
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