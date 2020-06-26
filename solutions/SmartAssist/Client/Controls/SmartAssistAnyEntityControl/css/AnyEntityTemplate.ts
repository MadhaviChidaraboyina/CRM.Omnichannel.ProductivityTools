/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
module MscrmControls.SmartAssistAnyEntityControl {
    export class AnyEntityTemplate {

        public static get(): string {
            return `
<style id="${StringConstants.AnyentityStyleTemplateId}">
	body, html {
		height: 100%;
		width: 99%;
		margin: 0;
	}
    .sa-suggestion-title-div {
		display: flex;
		margin-bottom: 10px;
		margin-top: 8px;
	}
	.sa-suggestions-title-icon {
		height:16px;
		width:16px; 
		margin-right:5px;
	}
	.sa-suggestions-title-label	{
		font-family:Segoe UI;
		font-size:12px;
		line-height:16px;
		align-items:center;
	}
	.sa-no-suggestion-div	{
		display: flex;
		margin: 10px;
	}
	.sa-no-suggestions-icon	{
		font-family:Segoe UI;
		font-size:12px;
		line-height:16px;
		align-items:center;
		margin-right:5px;
	}
	.sa-no-suggestions-label	{
		font-family:Segoe UI;
		font-size:12px;
		line-height:16px;
		align-items:center;
	}</style>`;
        }
    }
}