/**
 * @license Copyright (c) Microsoft Corporation.  All rights reserved.
 *
 * Typings for jQuery libraries.
 * http://jquery.com
 */

interface Element {
	offsetTop: number;
}

interface Coordinate {
	top: number;
	left: number;
}

interface jQueryObject {
	[i: number]: Element;
	length: number;
	get(): Element[];
	get(i: number): Element;

	slice(start: number, stop?: number) : jQueryObject;

	clone(): jQueryObject;

	on(eventType: string, handler: (e: jQueryEvent) => void): void;
	off(): jQueryObject;
	off(eventType: string): void;
	unbind(): void;
	unbind(eventName: string): void;
	focus(): void;
	focus(handler: (e: jQueryEvent) => void): jQueryObject;
	click(handler: (e: jQueryEvent) => void): jQueryObject;
	show(): void;
	hide(): void;
	bind(eventType: string, handler: any): void;
	append(child: jQueryObject): void;
	prepend(child: jQueryObject): void;
	attr(id: string): string;
	attr(id: string, value: any): string;
	removeAttr(attributeName: string): jQueryObject;
	html(html: string): void;


	find(selector: string): jQueryObject;
	each(iterator: (index: number, element: Element) => void): jQueryObject;
	first(): jQueryObject;
	last(): jQueryObject;
	eq(index: number): jQueryObject;

	// Use sparingly as the css() method has some performance overhead that may not be justified in every case
	css(propertyName: string): string;
	css(propertyName: string, value: any): jQueryObject;

	offset(value: Coordinate): void;

	outerHeight(includeMargin?: boolean): number;
	innerHeight(): number;
	outerWidth(includeMargin?: boolean): number;

	width(): number;
	width(value: number): void;
	height(): number;
	index(): number;
	scrollTop(): number;
    scrollTop(value: number): void;
    scrollLeft(): number;
	scrollLeft(value: number): void;
	scrollParent(): jQueryObject;

	height(value: number): void;
	height(value: string): void;

	appendTo(selector: string): jQueryObject;
	remove(): jQueryObject;

	position(): Coordinate;
	offset(): Coordinate;

	closest(selector: string): jQueryObject;
	closest(element: Element): jQueryObject;

	next(selector?: string): jQueryObject;
	prev(selector?: string): jQueryObject;
	prevAll(selector?: string): jQueryObject;

	is(selection: jQueryObject): boolean;
	is(selection: string): boolean;
	has(contained: jQueryObject): jQueryObject;
	filter(selector: string): jQueryObject;

	draggable(options?: jQueryDraggableOptions): jQueryObject;
	draggable(options?: string): jQueryObject;
	draggable(options?: "destroy"): jQueryObject;

	sortable(options?: jQuerySortableOptions): jQueryObject;
	sortable(method: string): void;

	draggable(method: string): void;

	trigger(event: string): void;

	text(t: string): jQueryObject;
	text(): string;
	data(key: string, value: any): jQueryObject;

	addBack(selector?: string): jQueryObject;
	add(elements: jQueryObject): jQueryObject;
	parents(selector?: string): jQueryObject;
	parent(): jQueryObject;
	not(selector: string): jQueryObject;
	// Returns a subset
	select(selector: string): jQueryObject;
	children(selector?: string): jQueryObject;
	contents(selector?: string): jQueryObject;
	siblings(selector?: string): jQueryObject;
	slider(options: any): jQueryObject;
	val(options: any): jQueryObject;
	daterangepicker(options: any, cb: Function): jQueryObject;
	datepicker(options: any): jQueryObject;
	datepicker(options: any, method: any): jQueryObject;
	_gotoToday(options: any): jQueryObject;
	hasClass(selector: string): jQueryObject;
	addClass(className: string): jQueryObject;
	removeClass(className: string): jQueryObject;
}

interface jQueryEvent extends Event {
	relatedTarget: Element;
	timeStamp: number;
	originalEvent: Event;
	pageX: number;
	pageY: number;
	target: Element;
}

interface jQuerySortableOptions {
	start: (e: jQueryEvent, ui: jQuerySortableObject) => void;
	stop: (e: jQueryEvent, ui: jQuerySortableObject) => void;
	sort: (e: jQueryEvent, ui: jQuerySortableObject) => void;
	disabled: boolean;
}

interface jQuerySortableObject {
	helper: jQueryObject;
	item: jQueryObject;
	offset: Coordinate;
	position: Coordinate;
}

interface jQueryDraggableOptions {
	axis?: string;
	containment?: string;
	revert?: boolean;
	revertDuration?: number;

	start?: (event: jQueryEvent, ui: jQueryDraggableEventUi) => void;
	drag?: (event: jQueryEvent, ui: jQueryDraggableEventUi) => void;
	stop?: (event: jQueryEvent, ui: jQueryDraggableEventUi) => void;
}

interface jQueryDraggableEventUi extends jQueryEvent {
	helper: jQueryObject;
	position: Coordinate;
	offset: Coordinate;
}

interface jQueryDeferred<T, E> extends DynamicsSrc.IDeferred<T, E> {
	promise(): DynamicsSrc.IDeferred<T, E>;
	resolve(val: T): jQueryDeferred<T, E>;
	reject(err: E): jQueryDeferred<T, E>;
}

interface BaseJQueryEventObject extends jQueryEvent {
	data: any;
	delegateTarget: Element;
	isDefaultPrevented(): boolean;
	isImmediatePropogationStopped(): boolean;
	isPropagationStopped(): boolean;
	namespace: string;
	preventDefault(): any;
	relatedTarget: Element;
	result: any;
	stopImmediatePropagation(): void;
	stopPropagation(): void;
	pageX: number;
	pageY: number;
	which: number;
	metaKey: any;
	originalEvent: PopStateEvent;
}

interface JQueryInputEventObject extends BaseJQueryEventObject {
	altKey: boolean;
	ctrlKey: boolean;
	metaKey: boolean;
	shiftKey: boolean;
}

interface JQueryMouseEventObject extends JQueryInputEventObject {
	button: number;
	clientX: number;
	clientY: number;
	offsetX: number;
	offsetY: number;
	pageX: number;
	pageY: number;
	screenX: number;
	screenY: number;
}

interface JQueryKeyEventObject extends JQueryInputEventObject {
	char: any;
	charCode: number;
	key: any;
	keyCode: number;
}


interface JQueryEventObject extends JQueryInputEventObject, JQueryMouseEventObject, JQueryKeyEventObject {
}


interface jQuery {
	(e: Element): jQueryObject;
	(e: Document): jQueryObject;
	(e: Window): jQueryObject;
	(selector: string): jQueryObject;
	(selector: string, context: jQueryObject): jQueryObject;

	Deferred<T, E>(): jQueryDeferred<T, E>;

	isArray(obj: any): boolean;
}


declare var $: jQuery;