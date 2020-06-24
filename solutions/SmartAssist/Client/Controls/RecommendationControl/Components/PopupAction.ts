/// <reference path="../CommonReferences.ts"/>

module MscrmControls.Smartassist.Suggestion {
    export class PopupAction extends AdaptiveCards.CardElement {

        private _popupOwner: HTMLElement; // Ellipse Icon
        private _renderedItems: HTMLElement;
        private _overlayElement: HTMLElement;
        private _popupActionContainer: AdaptiveCards.Container;
        private _popupContainerActionElement: HTMLElement;
        private _isOpen: boolean = false;
        private _imageUrl: string;
        private onExecuteAdaptiveCardAction: (action: AdaptiveCards.Action) => void;

        constructor(onExecuteAction: (action: AdaptiveCards.Action) => void) {
            super();
            this.onExecuteAdaptiveCardAction = onExecuteAction;
            this._popupActionContainer = new AdaptiveCards.Container();
            this.onExecuteAction.bind(this);
        }

        protected internalRender(): HTMLElement {
            // Creating the popup container.
            var popupContainer = document.createElement("div");
            popupContainer.className = Suggestion.Constants.PopupContainerClassName;
            popupContainer.style.border = "1px solid #EEEEEE";
            popupContainer.style.backgroundColor = "#FFFFFF";
            popupContainer.style.position = "absolute";
            popupContainer.style.borderRadius = "2px";
            popupContainer.style.boxShadow = "0px 0.6px 1.8px rgba(0, 0, 0, 0.108)";

            // Setting up ellipse icon.
            let imageBox = new AdaptiveCards.Image();
            imageBox.url = this._imageUrl;
            imageBox.size = AdaptiveCards.Size.Small;
            imageBox.pixelWidth = 16;
            imageBox.horizontalAlignment = AdaptiveCards.HorizontalAlignment.Right;
            this._popupOwner = imageBox.render();
            (<HTMLElement>this._popupOwner.children[0]).style.cursor = "pointer";

            this._popupContainerActionElement = this._popupActionContainer.render();
            popupContainer.appendChild(this._popupContainerActionElement);
            this.setPopupStyleForActions();
            this._renderedItems = popupContainer;


            this._popupOwner.onclick = (e) => {

                if (this._isOpen) {
                    this.closePopup();
                }
                else {
                    this.popup(this._popupOwner);
                }
            };

            return this._popupOwner;
        }

        onExecuteAction(action: AdaptiveCards.Action) {
            this.onExecuteAdaptiveCardAction(action);
            this.closePopup();
        }

        getScrollX(): number {
            return window.pageXOffset;
        }

        getScrollY(): number {
            return window.pageYOffset;
        }

        setPopupStyleForActions() {
            const actions = this._popupContainerActionElement.getElementsByClassName(Suggestion.Constants.AdaptiveCardActionButtonClassName) || [];
            const noOfActions = actions.length;
            for (let i = 0; i < noOfActions; i++) {
                let action = <HTMLElement>actions[i];
                action.style.margin = "2px 40px 2px 10px";
                action.style.fontFamily = "Segoe UI";
                action.style.fontSize = "12px";
                action.style.fontWeight = "400";
            }
        }

        closePopup() {
            if (this._isOpen) {
                document.body.removeChild(this._overlayElement);
                this._isOpen = false;
            }
        }

        popup(rootElement: HTMLElement) {
            if (!this._isOpen) {
                this._overlayElement = document.createElement("div");
                this._overlayElement.className = Suggestion.Constants.PopupOverlayClassName;
                this._overlayElement.tabIndex = 0;
                this._overlayElement.style.display = "flex";
                this._overlayElement.style.flexDirection = "column";
                this._overlayElement.style.width = document.documentElement.scrollWidth + "px";
                this._overlayElement.style.height = document.documentElement.scrollHeight + "px";
                this._overlayElement.onfocus = (e) => {
                    this.closePopup();
                };

                this._overlayElement.style.position = "absolute";
                this._overlayElement.style.left = "0";
                this._overlayElement.style.top = "0";
                this._overlayElement.style.zIndex = "10000";

                document.body.appendChild(this._overlayElement);
                var rootElementBounds = rootElement.getBoundingClientRect();

                let _popupElement = this._renderedItems;
                this._overlayElement.appendChild(_popupElement);

                var popupElementBounds = _popupElement.getBoundingClientRect();

                var availableSpaceBelow = window.innerHeight - rootElementBounds.bottom;
                var availableSpaceAbove = rootElementBounds.top;

                var left = rootElementBounds.left + this.getScrollX();
                var top;

                if (availableSpaceAbove < popupElementBounds.height && availableSpaceBelow < popupElementBounds.height) {
                    // Not enough space above or below root element
                    var actualPopupHeight = Math.min(popupElementBounds.height, window.innerHeight);

                    _popupElement.style.maxHeight = actualPopupHeight + "px";

                    if (actualPopupHeight < popupElementBounds.height) {
                        top = this.getScrollY();
                    }
                    else {
                        top = this.getScrollY() + rootElementBounds.top + (rootElementBounds.height - actualPopupHeight) / 2;
                    }
                }
                else {
                    // Enough space above or below root element
                    if (availableSpaceBelow >= popupElementBounds.height) {
                        top = this.getScrollY() + rootElementBounds.bottom;
                    }
                    else {
                        top = this.getScrollY() + rootElementBounds.top - popupElementBounds.height
                    }
                }

                left = rootElementBounds.right - popupElementBounds.width;
                _popupElement.style.left = left + "px";
                _popupElement.style.top = top + "px";
                this._isOpen = true;
            }
        }

        getJsonTypeName(): string {
            return Suggestion.Constants.PopupActionName;
        }

        parse(json: any, errors?: Array<AdaptiveCards.IValidationError>) {
            const actionItems = json.items;
            this._imageUrl = json.image;
            for (var item of actionItems) {
                const displayAction = item && ((item.hasOwnProperty(Suggestion.Constants.FilterExpression) && item[Suggestion.Constants.FilterExpression]) || !item.hasOwnProperty(Suggestion.Constants.FilterExpression));
                if (displayAction == true) {
                    let actionSet = new AdaptiveCards.ActionSet();
                    actionSet.parse(item.actionset, errors);
                    actionSet.orientation = AdaptiveCards.Orientation.Vertical;
                    actionSet.hostConfig.actions.buttonSpacing = 3;
                    for (let i = 0; i < actionSet.getActionCount(); i++) {
                        var action = actionSet.getActionAt(i);
                        action.onExecute = this.onExecuteAction.bind(this);
                    }
                    this._popupActionContainer.addItem(actionSet);
                }
            }
        }
    }
}