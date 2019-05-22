/**
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */

/// <reference path="Client.ts" />
/// <reference path="Constants.ts" />
/// <reference path="../Constants.ts" />
/// <reference path="State.ts" />
/// <reference path="../TelemetryHelper.ts" />
/// <reference path="aria-webjs-sdk-1.8.3.d.ts" />

namespace Microsoft.CIFramework.Internal {
	let Constants = Microsoft.CIFramework.Constants;
	const listenerWindow = window.parent;

	export function toggleNotesVisibility(): void {
		let widgetIFrame = (<HTMLIFrameElement>listenerWindow.document.getElementById(Constants.widgetIframeId));
		let notesDiv = widgetIFrame.contentWindow.document.getElementById("notesDiv");
		if (notesDiv.style.visibility == "hidden") {
			notesDiv.style.visibility = "visible";
		}
		else {
			notesDiv.style.visibility = "hidden";
		}
	}
	export function insertNotesClient(notesDetails: Map<string,any>/*, width: number*/): Promise<any>{
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
		//notesDetails.set(Constants.value, width);
		return new Promise(function (resolve,reject) {
			//expandFlap(width,state);
			//widgetIFrame.contentWindow.document.getElementsByTagName("iframe")[0].setAttribute('style','position: absolute;right: 0px;');
			notesDiv.insertAdjacentHTML('beforeend', '<div id="notesHeaderIdCIF" class="notesHeader"><div class="notesHeaderSpan_CIF" aria-label="Add Notes">Add notes</div><div class="notesCloseSpanDiv"></div></div><div class="notesbodyDivider_CIF"></div><div style="height: 14px;"></div>');
			notesDiv.classList.add("notesDivCIF");
			notesDiv.getElementsByClassName("notesHeader")[0].classList.add("notesHeaderCIF");
			let availNotesHeight = widgetIFrame.clientHeight - 26;
			widgetIFrame.contentWindow.document.getElementById("notesHeaderIdCIF").style.height = "49px";
			var span = document.createElement("span");
			span.classList.add("closeNotes_CIF");
			span.classList.add("FontIcons-closeSoftNotification_CIF");
			span.setAttribute("aria-label", "Close");
			span.setAttribute("tabindex", "0");
			notesDiv.getElementsByClassName("notesCloseSpanDiv")[0].appendChild(span);
			var newTextArea = document.createElement('TextArea');
			let notesElement = notesDiv;
			notesElement.appendChild(newTextArea);
			newTextArea.setAttribute('placeholder', 'Start adding notes');
			newTextArea.setAttribute("aria-label", "Take Notes");
			newTextArea.classList.add("newTextAreaCIF");
			var textAreaWidth = "calc(100% - 40px)";//width - width/8 - 15;
			newTextArea.id = "notesTextAreaCIF";
			newTextArea.style.width = textAreaWidth;
			newTextArea.style.height = "calc(100% - 120px)";
			var saveBtn = document.createElement("BUTTON");
			saveBtn.classList.add("notesSaveButtonCIF");
			saveBtn.innerText = "Add note";
			saveBtn.tabIndex = 0;
			saveBtn.setAttribute("aria-label", "Add note");
			var cancelBtn = document.createElement("BUTTON");
			cancelBtn.classList.add("notesCancelButtonCIF");
			cancelBtn.innerText = "Cancel";
			cancelBtn.tabIndex = 0;
			cancelBtn.setAttribute("aria-label", "Cancel");
			var addCancelButtonContainer = document.createElement("DIV");
			addCancelButtonContainer.classList.add("addCancelButtonContainer");
			addCancelButtonContainer.appendChild(saveBtn);
			addCancelButtonContainer.appendChild(cancelBtn);
			notesElement.appendChild(addCancelButtonContainer);

			if(isConsoleAppInternal() == true){
				let widgetAreaDiv =  widgetIFrame.contentWindow.document.getElementById("widgetArea");
				let flapAreaDiv =  widgetIFrame.contentWindow.document.getElementById("flapArea");
				widgetAreaDiv.classList.remove("widgetArea");
				widgetAreaDiv.classList.add("widgetAreaZFP");
				flapAreaDiv.classList.add("flapAreaZFP");
			}


			//Saving notes info locally
			let sessionId: string = state.sessionManager.getFocusedSession();
			let session = state.providerManager._activeProvider.sessions.get(sessionId);
			session.notesInfo.notesDetails = notesDetails;
			session.notesInfo.resolve = resolve;
			session.notesInfo.reject = reject;
			saveBtn.addEventListener("click", function clickListener() {
				saveNotes(notesDetails,newTextArea).then(function (retval: Map<string, any>) {
					cancelNotes();
					//state.setWidgetWidth("setWidgetWidth", width);
					return resolve(new Map().set(Constants.value,retval));
				},
				(error: IErrorHandler) => {
						return postMessageNamespace.rejectWithErrorMessage("Failed in saving notes.");
				});
			});
			cancelBtn.addEventListener("click", function clickListener() {
				cancelNotes();
				//state.setWidgetWidth("setWidgetWidth", width);
				return resolve(new Map().set(Constants.value,new Map().set(Constants.value,"")));
			});
			span.addEventListener("click", function clickListener() {
				cancelNotes();
				//state.setWidgetWidth("setWidgetWidth", width);
				return resolve(new Map().set(Constants.value,new Map().set(Constants.value,"")));
			});
			span.addEventListener("keydown", function clickListener(event) {
				if (event.keyCode == 32 || event.keyCode == 13){
					cancelNotes();
					return resolve(new Map().set(Constants.value,new Map().set(Constants.value,"")));
				}
			});
		});
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
			notesDiv.innerHTML = '';
		}
		state.client.removeHandler(Constants.CollapseFlapHandler);
	}

	export function intermediateSaveNotes(): void{	
		let widgetIFrame = (<HTMLIFrameElement>window.parent.document.getElementById(Constants.widgetIframeId));
		let newTextArea = widgetIFrame.contentWindow.document.getElementById("notesTextAreaCIF");
		let sessionId: string = state.sessionManager.getFocusedSession();
		let session = state.providerManager._activeProvider.sessions.get(sessionId);
		let resolve = session.notesInfo.resolve;
		saveNotes(session.notesInfo.notesDetails,newTextArea).then(function (retval: Map<string, any>) {
			cancelNotes();
			return resolve(new Map().set(Constants.value,retval));
		},
		(error: IErrorHandler) => {
				return postMessageNamespace.rejectWithErrorMessage("Failed in saving notes.");
		});
	}
}
