/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
module MscrmControls.SmartAssistAnyEntityControl {
    export class AnyEntityTemplate {

        public static get(): string {
            return `
			<style>
				body, html {
					height: 100%;
					width: 99%;
					margin: 0;
				}
				.sa-suggestion-title-div {
					display: flex;
					margin-bottom: 10px;
					margin-top: 8px;
					margin-left: 15px;					
				}
				.sa-suggestions-title-icon {
					height:16px;
					width:16px; 
					margin-right:5px;
					letter-spacing: 0.02em;
				}
				.sa-suggestions-title-label	{
					font-family:Segoe UI;
					font-size:12px;
					line-height:16px;
					align-items:center;
					color: #605E5C;
					font-weight: 600;
				}
				.sa-no-suggestion-div	{
					display: flex;
					margin: 10px 10px 10px 20px;  
				}
				.sa-no-suggestions-icon	{
					font-family:Segoe UI;
					font-size:12px;
					line-height:16px;
					align-items:center;
					margin-right:5px;
					height:unset;
					width:unset;
				}
				.sa-no-suggestions-label	{
					font-family:Segoe UI;
					font-size:11px;
					line-height:16px;
					align-items:center;
					color: #605e5c;
				}
				.hide-element{
					display:none !important;
				}
				.sa-loader{
					border: 1px solid #C7E0F4;
					border-radius: 50%;
					border-top: 1px solid #0078D4;
					width: 28.01px;
					height: 28.01px;
					-webkit-animation: spin 2s linear infinite;
					animation: spin 2s linear infinite;
					margin: 0 auto;
				}
				.sa-loader-parent{
					position: absolute;
					margin-left: 120px;
					top: 45%;
					color: #0078D4;
					font-family: Segoe UI;
					font-size: 12px;
					line-height: 16px;
					text-align: center;
				}
				.relative-parent
				{
					position: relative !important;
					min-height:356px;
					min-width:200px;	
				}
				/* Safari */
				@-webkit-keyframes spin {
					0% { -webkit-transform: rotate(0deg); }
					100% { -webkit-transform: rotate(360deg); }
				}
				@keyframes spin {
					0% { transform: rotate(0deg); }
					100% { transform: rotate(360deg); }
				}
			</style>`;
        }
    }
}