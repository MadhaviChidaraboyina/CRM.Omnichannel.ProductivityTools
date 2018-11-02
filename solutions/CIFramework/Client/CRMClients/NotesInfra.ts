/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="Client.ts" />
/// <reference path="Constants.ts" />
/// <reference path="../Constants.ts" />
/// <reference path="State.ts" />
/// <reference path="../TelemetryHelper.ts" />
/// <reference path="aria-webjs-sdk-1.6.2.d.ts" />

namespace Microsoft.CIFramework.Internal {
	let Constants = Microsoft.CIFramework.Constants;
	const listenerWindow = window.parent;
	
	export function insertNotesClient(notesDetails: Map<string,any>, state: any): Promise<any>{
		let entityName: string;
		let originURL: string;
		let entityId: string;
		let entitySetName: string;
		let widgetIFrame = (<HTMLIFrameElement>listenerWindow.document.getElementById(Constants.widgetIframeId));
		let notesDiv =  widgetIFrame.contentWindow.document.getElementById("notesDiv");
		var childDivs = notesDiv.getElementsByTagName('div');
		if(childDivs != null && childDivs.length > 0){
			return postMessageNamespace.rejectWithErrorMessage("This conversation already has a note opened.");
		}
       	for (let [key, value] of notesDetails) {
			if(key.search(Constants.entityName) != -1){
				entityName = value;
			}else if(key.search(Constants.originURL) != -1){
				originURL = value;
			}else if(key.search(Constants.entityId) != -1){
				entityId = value;
			}else if(key.search(Constants.entitySetName) != -1){
				entitySetName = value;
			}
		}
		let width: number = 0;
		let panelWidth = state.getWidgetWidth();
		width = panelWidth as number;
		notesDetails.set(Constants.value,width);
		return new Promise(function (resolve,reject) {
			expandFlap(width,state);
			widgetIFrame.contentWindow.document.getElementsByTagName("iframe")[0].setAttribute('style','position: absolute;right: 0px;');
			notesDiv.insertAdjacentHTML('beforeend', '<div id="CIFActivityNotes" tabindex="0" class="CIFNotes"><div id="notesHeaderIdCIF" tabindex="0" class="notesHeader"><div class="notesHeaderSpan_CIF" aria-label="Close" style="margin-left:18px"><br/>Add Notes</div></div></div>');
			notesDiv.getElementsByClassName("CIFNotes")[0].classList.add("notesDivCIF");
			notesDiv.getElementsByClassName("notesHeader")[0].classList.add("notesHeaderCIF");
			widgetIFrame.contentWindow.document.getElementById("notesHeaderIdCIF").style.height = ((listenerWindow.outerHeight * 0.75) * 0.14)+"px";
			var span = document.createElement("span");
			span.classList.add("closeNotes_CIF");
			span.classList.add("FontIcons-closeSoftNotification_CIF");
			span.setAttribute("aria-label", "Close");
			notesDiv.getElementsByClassName("notesHeaderSpan_CIF")[0].appendChild(span);
			var newTextArea = document.createElement('TextArea');
			let notesElement = notesDiv.getElementsByClassName("CIFNotes")[0];
			notesElement.appendChild(newTextArea);
			widgetIFrame.contentWindow.document.getElementById("CIFActivityNotes").style.width = (width-7)+"px";
			widgetIFrame.contentWindow.document.getElementById("CIFActivityNotes").style.height = (listenerWindow.outerHeight * 0.75) + "px";
			newTextArea.setAttribute('placeholder','Start adding notes');
			newTextArea.classList.add("newTextAreaCIF");
			var textAreaWidth = width - width/8 - 7;
			newTextArea.id = "notesTextAreaCIF";
			widgetIFrame.contentWindow.document.getElementById("notesTextAreaCIF").style.width = textAreaWidth+"px";
			widgetIFrame.contentWindow.document.getElementById("notesTextAreaCIF").style.height = ((listenerWindow.outerHeight * 0.75) * 0.7)+"px";
			var saveBtn = document.createElement("BUTTON");
			notesElement.appendChild(saveBtn);
			saveBtn.classList.add("notesSaveButtonCIF");
			saveBtn.innerText = "Add Note";
			saveBtn.tabIndex = 0;
			saveBtn.setAttribute("aria-label", "Add Note");
			var cancelBtn = document.createElement('a');
			cancelBtn.setAttribute('href',"#");
			notesElement.appendChild(cancelBtn);
			cancelBtn.classList.add("notesCancelButtonCIF");
			cancelBtn.innerText = "Cancel";
			cancelBtn.tabIndex = 0;
			cancelBtn.setAttribute("aria-label", "Cancel");
			saveBtn.addEventListener("click", function clickListener() {
				saveNotes(notesDetails,newTextArea).then(function (retval: Map<string, any>) {
					cancelNotes();
					state.setWidgetWidth("setWidgetWidth", width);
					return resolve(new Map().set(Constants.value,retval));
				});
			});
			cancelBtn.addEventListener("click", function clickListener() {
				cancelNotes();
				state.setWidgetWidth("setWidgetWidth", width);
				return resolve(new Map().set(Constants.value,new Map().set(Constants.value,"")));
			});
			span.addEventListener("click", function clickListener() {
				cancelNotes();
				state.setWidgetWidth("setWidgetWidth", width);
				return resolve(new Map().set(Constants.value,new Map().set(Constants.value,"")));
			});
		});
	}

	export function expandFlap(width: number, state: any): void{
		state.removeHandler(Constants.ModeChangeHandler);
		state.removeHandler(Constants.SizeChangeHandler);
		state.setWidgetWidth("setWidgetWidth", width*2);
	}

    export function saveNotes(notesDetails: Map<string,any>,newTextArea: any): Promise<Map<string, any>>{		
		let entityName: string;
		let originURL: string;
		let entityId: string;
		let entitySetName: string;
		let annotationId: string;
       	for (let [key, value] of notesDetails) {
			if(key.search(Constants.entityName) != -1){
				entityName = value;
			}else if(key.search(Constants.originURL) != -1){
				originURL = value;
			}else if(key.search(Constants.entityId) != -1){
				entityId = value;
			}else if(key.search(Constants.entitySetName) != -1){
				entitySetName = value;
			}else if(key.search(Constants.annotationId) != -1){
				annotationId = value;
			}
		}
		let textAreaValue = newTextArea.value;
		let map = new Map().set(Constants.notetext,textAreaValue);
		let noteText = "";
		let createMap = new Map().set(Constants.entityName, Constants.annotation).set(Constants.value, map).set(Constants.originURL,originURL);
		return new Promise(function (resolve) {
			if(annotationId == ""){
				createRecord(createMap).then(function (returnValue: Map<string, any>) {	
					for(let [key,value] of returnValue){
						if(key.search(Constants.value) != -1){
							for(let [key1,value1] of value){
								if(key1.search(Constants.Id) != -1){
									annotationId = value1;
								}
							}
						}
					}
					var returnUpdateValue = new Map();
					let odataBind = entitySetName+"("+entityId+")";
					let odataBindPropertyName = "objectid_"+entityName+"@odata.bind";
					let notesMap = new Map().set(odataBindPropertyName,odataBind);
					let updateMap = new Map().set(Constants.entityName, Constants.annotation).set(Constants.entityId, annotationId).set(Constants.value, notesMap).set(Constants.originURL,originURL);
					updateRecord(updateMap).then(function (updatedAnnotation: Map<string, any>) {
						for(let [key,value] of updatedAnnotation){
							if(key.search(Constants.value) != -1){
								returnUpdateValue = value;
							}
						}
						var mapReturn = new Map().set(Constants.value,annotationId);
						resolve(mapReturn);
					});
				});
			}else{
				let searchQuery = "?$select=notetext&$filter=_objectid_value eq " + entityId;
				let searchMap = new Map().set(Constants.entityName, Constants.annotation).set(Constants.queryParameters,searchQuery).set(Constants.originURL,originURL);
				search(searchMap).then(function (returnSearchResult: Map<string, any>) {
					for(let [key,value] of returnSearchResult){
						if(key.search(Constants.value) != -1){
							for(let i=0; i< value.length; i++ ){
								for(let key1 in value[i]){
									if(key1.search(Constants.notetext) != -1){
										noteText = value[i][key1];
									}
								}
							}
						}
					}
					let notesMap = new Map().set(Constants.notetext,noteText+" "+textAreaValue);
					let updateMap = new Map().set(Constants.entityName, Constants.annotation).set(Constants.entityId, annotationId).set(Constants.value, notesMap).set(Constants.originURL,originURL);
					updateRecord(updateMap).then(function (returnValue: Map<string, any>) {	
						for(let [key,value] of returnValue){
							if(key.search(Constants.value) != -1){
								for(let [key1,value1] of value){
									if(key1.search(Constants.Id) != -1){
										annotationId = value1;
									}
								}
							}
						}
						var mapReturn = new Map().set(Constants.value,annotationId);
						resolve(mapReturn);
					});
				});
			}
		});
    }

	export function cancelNotes(): void{	
		let widgetIFrame = (<HTMLIFrameElement>listenerWindow.document.getElementById(Constants.widgetIframeId));
		let notesDiv =  widgetIFrame.contentWindow.document.getElementById("notesDiv");
		if(!isNullOrUndefined(notesDiv)){
			notesDiv.removeChild(notesDiv.getElementsByClassName("CIFNotes")[0]);
		}
	}
}
