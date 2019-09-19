/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
module MscrmControls.ProductivityPanel {
	export class SmartAssistTemplate {
		public static get(): string {
			return `
<style id="smartassist-style">
	body, html {
		height: 100%;
		width: 99%;
		margin: 0;
	}

	.smart-assist-title {
		font-family: Segoe UI;
		font-size: 16px;
		line-height: 20px;
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
		max-height: 480px;
		overflow-y: auto;
		padding-left: 2px;
		padding-top: 10px;
		padding-bottom: 10px;
	}

	#smartassist-outer-container::-webkit-scrollbar-thumb {
		background: #FFFFFF;
	}

	#smartassist-outer-container::-webkit-scrollbar-track {
		background: #FFFFFF;
	}

	#smartassist-outer-container:hover::-webkit-scrollbar-thumb {
		background: #b5b5b5;
	}

	#smartassist-outer-container::-webkit-scrollbar {
		width: 4px;
		visibility: hidden;
	}

	.smartassist-card-container {
		max-width: calc(100% - 20px);
		background-color: #FFF;
		box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.18), 0px 2px 4px rgba(0, 0, 0, 0.12);
		position: relative;
		margin-bottom: 6px;
		margin-top: 10px;
	}

	.ac-pushButton {
		background: none!important;
		border: none;
		padding: 0!important;
		color: #069;
		cursor: pointer;
	}

	.Cancel:before {
		content: '\\E711'
	}

	.dismiss-button {
		top: 14px;
		left: calc(100% - 26px);
		position: absolute;
		cursor: pointer;
	}
</style>
`;
		}
	}
}