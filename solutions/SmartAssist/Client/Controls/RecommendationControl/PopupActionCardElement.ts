/// <reference path="./CommonReferences.ts"/>
/// <reference path="../../TypeDefinitions/adaptivecards-templating.d.ts"/>

module MscrmControls.Smartassist.Recommendation {
    export class PopupAction extends AdaptiveCards.CardElement {

        private _popupOwner: HTMLElement;
        private _renderedItems: HTMLElement;
        private _overlayElement: HTMLElement;
        private _actionElement: HTMLElement;
        private _isOpen: boolean = false;
        private _actionSet: AdaptiveCards.ActionSet;
        private _actionItems: Array<any>;
        private _actionFilterTag: string;
        private _imageUrl: string;
        private _contextId: string;  // for KM suggestions, this is KM id.

        constructor(actionFilterTag: string, id: string) {
            super();
            this._contextId = id;
            this._actionFilterTag = actionFilterTag;
            this.onExecuteAction.bind(this);
        }

        protected internalRender(): HTMLElement {
            // Creating the popup container.
            var popupContainer = document.createElement("div");
            popupContainer.className = Recommendation.Constants.PopupContainerClassName;
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


            let container = new AdaptiveCards.Container();
            container.id = Recommendation.Constants.PopupContainerId;
            if (this._actionSet) {
                container.addItem(this._actionSet);
            }

            this._actionElement = container.render();
            this.setPopupStyleForActions();            
            popupContainer.appendChild(this._actionElement);
            this._renderedItems = popupContainer;

            for (let i = 0; i < this._actionSet.getActionCount(); i++) {
                var action = this._actionSet.getActionAt(i);
                action.onExecute = this.onExecuteAction;
            }

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
            // TODO;
        }

        getScrollX(): number {
            return window.pageXOffset;
        }

        getScrollY(): number {
            return window.pageYOffset;
        }

        setPopupStyleForActions() {
            (<HTMLElement>this._actionElement.getElementsByClassName(Recommendation.Constants.AdaptiveCardActionSetClassName)[0]).style.flexDirection = "column";
            const actions = this._actionElement.getElementsByClassName(Recommendation.Constants.AdaptiveCardActionSetClassName)[0].getElementsByClassName(Recommendation.Constants.AdaptiveCardActionButtonClassName);
            const noOfActions = actions.length;
            for (let i = 0; i < noOfActions; i++) {
                let action = <HTMLElement>actions[i];
                action.style.margin = "5px 40px 5px 10px";
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
                this._overlayElement.className = Recommendation.Constants.PopupOverlayClassName;
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
            return Recommendation.Constants.PopupActionName;
        }

        parse(json: any, errors?: Array<AdaptiveCards.IValidationError>) {
            // TODO: Parse data binding associated with item.tag.
            this._actionItems = json.items;
            this._imageUrl = json.image;
            for (var item of this._actionItems) {
                if (item && item.tag === this._actionFilterTag) {
                    this._actionSet = new AdaptiveCards.ActionSet();
                    this._actionSet.parse(item.actionset, errors);
                    break;
                }
            }
        }
    }
}