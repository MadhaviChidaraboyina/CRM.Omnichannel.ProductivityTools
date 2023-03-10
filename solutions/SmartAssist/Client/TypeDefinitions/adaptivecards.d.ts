declare module AdaptiveCards {
	export enum Size {
		Auto = 0,
		Stretch = 1,
		Small = 2,
		Medium = 3,
		Large = 4
	}
	export enum SizeUnit {
		Weight = 0,
		Pixel = 1
	}
	export enum TextSize {
		Small = 0,
		Default = 1,
		Medium = 2,
		Large = 3,
		ExtraLarge = 4
	}
	export enum Spacing {
		None = 0,
		Small = 1,
		Default = 2,
		Medium = 3,
		Large = 4,
		ExtraLarge = 5,
		Padding = 6
	}
	export enum TextWeight {
		Lighter = 0,
		Default = 1,
		Bolder = 2
	}
	export enum TextColor {
		Default = 0,
		Dark = 1,
		Light = 2,
		Accent = 3,
		Good = 4,
		Warning = 5,
		Attention = 6
	}
	export enum HorizontalAlignment {
		Left = 0,
		Center = 1,
		Right = 2
	}
	export enum VerticalAlignment {
		Top = 0,
		Center = 1,
		Bottom = 2
	}
	export enum ActionAlignment {
		Left = 0,
		Center = 1,
		Right = 2,
		Stretch = 3
	}
	export enum ImageStyle {
		Default = 0,
		Person = 1
	}
	export enum ShowCardActionMode {
		Inline = 0,
		Popup = 1
	}
	export enum Orientation {
		Horizontal = 0,
		Vertical = 1
	}
	export enum BackgroundImageMode {
		Stretch = 0,
		RepeatHorizontally = 1,
		RepeatVertically = 2,
		Repeat = 3
	}
	export enum ActionIconPlacement {
		LeftOfTitle = 0,
		AboveTitle = 1
	}
	export enum InputTextStyle {
		Text = 0,
		Tel = 1,
		Url = 2,
		Email = 3
	}
	export enum ValidationError {
		Hint = 0,
		ActionTypeNotAllowed = 1,
		CollectionCantBeEmpty = 2,
		Deprecated = 3,
		ElementTypeNotAllowed = 4,
		InteractivityNotAllowed = 5,
		InvalidPropertyValue = 6,
		MissingCardType = 7,
		PropertyCantBeNull = 8,
		TooManyActions = 9,
		UnknownActionType = 10,
		UnknownElementType = 11,
		UnsupportedCardVersion = 12
	}
	export enum ContainerFitStatus {
		FullyInContainer = 0,
		Overflowing = 1,
		FullyOutOfContainer = 2
	}

	/**
	 * Fast UUID generator, RFC4122 version 4 compliant.
	 * @author Jeff Ward (jcward.com).
	 * @license MIT license
	 * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
	 **/
	export class UUID {
		private static lut;
		static generate(): string;
		static initialize(): void;
	}
	export const ContentTypes: {
		applicationJson: string;
		applicationXWwwFormUrlencoded: string;
	};
	export interface ISeparationDefinition {
		spacing: number;
		lineThickness?: number;
		lineColor?: string;
	}
	export interface IInput {
		id: string;
		value: string;
	}
	export function getValueOrDefault<T>(obj: any, defaultValue: T): T;
	export function isNullOrEmpty(value: string): boolean;
	export function appendChild(node: Node, child: Node): void;
	export function setProperty(target: any, propertyName: string, propertyValue: any, defaultValue?: any): void;
	export function setEnumProperty(enumType: {
		[s: number]: string;
	}, target: any, propertyName: string, propertyValue: number, defaultValue?: number): void;
	export function getEnumValueOrDefault(targetEnum: {
		[s: number]: string;
	}, name: string, defaultValue: number): number;
	export function parseHostConfigEnum(targetEnum: {
		[s: number]: string;
	}, value: string | number, defaultValue: any): any;
	export function renderSeparation(separationDefinition: ISeparationDefinition, orientation: Orientation): HTMLElement;
	export function stringToCssColor(color: string): string;
	export class StringWithSubstitutions {
		private _isProcessed;
		private _original;
		private _processed;
		substituteInputValues(inputs: Array<IInput>, contentType: string): void;
		getOriginal(): string;
		get(): string;
		set(value: string): void;
	}
	export function truncate(element: HTMLElement, maxHeight: number, lineHeight?: number): void;
	export function getFitStatus(element: HTMLElement, containerEnd: number): ContainerFitStatus;

	export interface IValidationError {
		error: ValidationError;
		message: string;
	}
	export class TextColorDefinition {
		default: string;
		subtle: string;
		constructor(obj?: any);
	}
	export class AdaptiveCardConfig {
		allowCustomStyle: boolean;
		constructor(obj?: any);
	}
	export class ImageSetConfig {
		imageSize: Size;
		maxImageHeight: number;
		constructor(obj?: any);
		toJSON(): {
			imageSize: string;
			maxImageHeight: number;
		};
	}
	export class MediaConfig {
		defaultPoster: string;
		allowInlinePlayback: boolean;
		constructor(obj?: any);
		toJSON(): {
			defaultPoster: string;
			allowInlinePlayback: boolean;
		};
	}
	export class FactTextDefinition {
		size: TextSize;
		color: TextColor;
		isSubtle: boolean;
		weight: TextWeight;
		wrap: boolean;
		constructor(obj?: any);
		getDefaultWeight(): TextWeight;
		toJSON(): any;
	}
	export class FactTitleDefinition extends FactTextDefinition {
		maxWidth?: number;
		weight: TextWeight;
		constructor(obj?: any);
		getDefaultWeight(): TextWeight;
	}
	export class FactSetConfig {
		readonly title: FactTitleDefinition;
		readonly value: FactTextDefinition;
		spacing: number;
		constructor(obj?: any);
	}
	export class ShowCardActionConfig {
		actionMode: ShowCardActionMode;
		inlineTopMargin: number;
		style?: string;
		constructor(obj?: any);
		toJSON(): {
			actionMode: string;
			inlineTopMargin: number;
			style: string;
		};
	}
	export class ActionsConfig {
		maxActions: number;
		spacing: Spacing;
		buttonSpacing: number;
		readonly showCard: ShowCardActionConfig;
		preExpandSingleShowCardAction?: boolean;
		actionsOrientation: Orientation;
		actionAlignment: ActionAlignment;
		iconPlacement: ActionIconPlacement;
		allowTitleToWrap: boolean;
		iconSize: number;
		constructor(obj?: any);
		toJSON(): {
			maxActions: number;
			spacing: string;
			buttonSpacing: number;
			showCard: ShowCardActionConfig;
			preExpandSingleShowCardAction: boolean;
			actionsOrientation: string;
			actionAlignment: string;
		};
	}
	export class ContainerStyleDefinition {
		private getTextColorDefinitionOrDefault;
		backgroundColor?: string;
		readonly foregroundColors: {
			default: TextColorDefinition;
			dark: TextColorDefinition;
			light: TextColorDefinition;
			accent: TextColorDefinition;
			good: TextColorDefinition;
			warning: TextColorDefinition;
			attention: TextColorDefinition;
		};
		highlightBackgroundColor?: string;
		highlightForegroundColor?: string;
		parse(obj: any): void;
		constructor(obj?: any);
		readonly isBuiltIn: boolean;
	}
	export interface ILineHeightDefinitions {
		small: number;
		medium: number;
		default: number;
		large: number;
		extraLarge: number;
	}
	export class ContainerStyleSet {
		private _allStyles;
		constructor(obj?: any);
		toJSON(): any;
		getStyleByName(name: string, defaultValue?: ContainerStyleDefinition): ContainerStyleDefinition;
		readonly default: ContainerStyleDefinition;
		readonly emphasis: ContainerStyleDefinition;
	}
	export class Version {
		private _versionString;
		private _major;
		private _minor;
		private _isValid;
		constructor(major?: number, minor?: number);
		static parse(versionString: string, errors?: Array<IValidationError>): Version;
		toString(): string;
		compareTo(otherVersion: Version): number;
		readonly major: number;
		readonly minor: number;
		readonly isValid: boolean;
	}
	export type HostCapabilityVersion = Version | "*";
	export type HostCapabilityMap = {
		[key: string]: HostCapabilityVersion;
	};
	export class HostCapabilities {
		private setCapability;
		capabilities: HostCapabilityMap;
		parse(json: any, errors?: Array<IValidationError>): void;
		hasCapability(name: string, version: HostCapabilityVersion): boolean;
		areAllMet(hostCapabilities: HostCapabilities): boolean;
	}
	export class HostConfig {
		readonly hostCapabilities: HostCapabilities;
		choiceSetInputValueSeparator: string;
		supportsInteractivity: boolean;
		lineHeights?: ILineHeightDefinitions;
		fontFamily?: string;
		readonly spacing: {
			small: number;
			default: number;
			medium: number;
			large: number;
			extraLarge: number;
			padding: number;
		};
		readonly separator: {
			lineThickness: number;
			lineColor: string;
		};
		readonly fontSizes: {
			small: number;
			default: number;
			medium: number;
			large: number;
			extraLarge: number;
		};
		readonly fontWeights: {
			lighter: number;
			default: number;
			bolder: number;
		};
		readonly imageSizes: {
			small: number;
			medium: number;
			large: number;
		};
		readonly containerStyles: ContainerStyleSet;
		readonly actions: ActionsConfig;
		readonly adaptiveCard: AdaptiveCardConfig;
		readonly imageSet: ImageSetConfig;
		readonly media: MediaConfig;
		readonly factSet: FactSetConfig;
		cssClassNamePrefix: string;
		constructor(obj?: any);
		getEffectiveSpacing(spacing: Spacing): number;
		makeCssClassName(...classNames: string[]): string;
	}

	export function formatText(lang: string, text: string): string;

	export function createActionInstance(parent: CardElement, json: any, errors: Array<IValidationError>): Action;
	export function createElementInstance(parent: CardElement, json: any, errors: Array<IValidationError>): CardElement;
	export class SpacingDefinition {
		left: number;
		top: number;
		right: number;
		bottom: number;
		constructor(top?: number, right?: number, bottom?: number, left?: number);
	}
	export class PaddingDefinition {
		top: Spacing;
		right: Spacing;
		bottom: Spacing;
		left: Spacing;
		constructor(top?: Spacing, right?: Spacing, bottom?: Spacing, left?: Spacing);
		toSpacingDefinition(hostConfig: HostConfig): SpacingDefinition;
	}
	export class SizeAndUnit {
		physicalSize: number;
		unit: SizeUnit;
		static parse(input: any): SizeAndUnit;
		constructor(physicalSize: number, unit: SizeUnit);
	}
	export interface IResourceInformation {
		url: string;
		mimeType: string;
	}
	export interface ICardObject {
		shouldFallback(): boolean;
		setParent(parent: CardElement): any;
		parse(json: any): any;
	}
	export abstract class CardElement implements ICardObject {
		private _shouldFallback;
		private _lang;
		private _hostConfig?;
		private _internalPadding;
		private _parent;
		private _renderedElement;
		private _separatorElement;
		private _isVisible;
		private _truncatedDueToOverflow;
		private _defaultRenderedElementDisplayMode;
		private _padding;
		private internalRenderSeparator;
		private updateRenderedElementVisibility;
		private hideElementDueToOverflow;
		private showElementHiddenDueToOverflow;
		private handleOverflow;
		private resetOverflow;
		protected createPlaceholderElement(): HTMLElement;
		protected internalGetNonZeroPadding(padding: PaddingDefinition, processTop?: boolean, processRight?: boolean, processBottom?: boolean, processLeft?: boolean): void;
		protected adjustRenderedElementSize(renderedElement: HTMLElement): void;
		protected abstract internalRender(): HTMLElement;
		protected truncateOverflow(maxHeight: number): boolean;
		protected undoOverflowTruncation(): void;
		protected isDesignMode(): boolean;
		protected readonly useDefaultSizing: boolean;
		protected readonly allowCustomPadding: boolean;
		protected readonly defaultPadding: PaddingDefinition;
		protected internalPadding: PaddingDefinition;
		protected readonly separatorOrientation: Orientation;
		protected getPadding(): PaddingDefinition;
		protected setPadding(value: PaddingDefinition): void;
		readonly requires: HostCapabilities;
		id: string;
		speak: string;
		horizontalAlignment?: HorizontalAlignment;
		spacing: Spacing;
		separator: boolean;
		height: "auto" | "stretch";
		customCssSelector: string;
		abstract getJsonTypeName(): string;
		toJSON(): {};
		setParent(value: CardElement): void;
		getNonZeroPadding(): PaddingDefinition;
		getForbiddenElementTypes(): Array<string>;
		getForbiddenActionTypes(): Array<any>;
		parse(json: any, errors?: Array<IValidationError>): void;
		getActionCount(): number;
		getActionAt(index: number): Action;
		validate(): Array<IValidationError>;
		remove(): boolean;
		render(): HTMLElement;
		updateLayout(processChildren?: boolean): void;
		indexOf(cardElement: CardElement): number;
		isRendered(): boolean;
		isAtTheVeryTop(): boolean;
		isFirstElement(element: CardElement): boolean;
		isAtTheVeryBottom(): boolean;
		isLastElement(element: CardElement): boolean;
		isAtTheVeryLeft(): boolean;
		isBleeding(): boolean;
		isLeftMostElement(element: CardElement): boolean;
		isAtTheVeryRight(): boolean;
		isRightMostElement(element: CardElement): boolean;
		isHiddenDueToOverflow(): boolean;
		canContentBleed(): boolean;
		getRootElement(): CardElement;
		getParentContainer(): Container;
		getAllInputs(): Array<Input>;
		getResourceInformation(): Array<IResourceInformation>;
		getElementById(id: string): CardElement;
		getActionById(id: string): Action;
		shouldFallback(): boolean;
		setShouldFallback(value: boolean): void;
		lang: string;
		hostConfig: HostConfig;
		readonly index: number;
		readonly isInteractive: boolean;
		readonly isStandalone: boolean;
		readonly parent: CardElement;
		isVisible: boolean;
		readonly hasVisibleSeparator: boolean;
		readonly renderedElement: HTMLElement;
		readonly separatorElement: HTMLElement;
	}
	export abstract class CardElementContainer extends CardElement {
		abstract getItemCount(): number;
		abstract getItemAt(index: number): CardElement;
		abstract removeItem(item: CardElement): boolean;
	}
	export class TextBlock extends CardElement {
		private _computedLineHeight;
		private _originalInnerHtml;
		private _text;
		private _processedText;
		private _treatAsPlainText;
		private _selectAction;
		private _effectiveStyleDefinition;
		private restoreOriginalContent;
		private truncateIfSupported;
		private getEffectiveStyleDefinition;
		protected getRenderedDomElementType(): string;
		protected internalRender(): HTMLElement;
		protected truncateOverflow(maxHeight: number): boolean;
		protected undoOverflowTruncation(): void;
		size: TextSize;
		weight: TextWeight;
		color: TextColor;
		isSubtle: boolean;
		wrap: boolean;
		maxLines: number;
		useMarkdown: boolean;
		toJSON(): {};
		applyStylesTo(targetElement: HTMLElement): void;
		parse(json: any, errors?: Array<IValidationError>): void;
		getJsonTypeName(): string;
		renderSpeech(): string;
		updateLayout(processChildren?: boolean): void;
		text: string;
		selectAction: Action;
	}
	export class Fact {
		name: string;
		value: string;
		speak: string;
		constructor(name?: string, value?: string);
		toJSON(): {
			title: string;
			value: string;
		};
		renderSpeech(): string;
	}
	export class FactSet extends CardElement {
		protected readonly useDefaultSizing: boolean;
		protected internalRender(): HTMLElement;
		facts: Array<Fact>;
		getJsonTypeName(): string;
		toJSON(): {};
		parse(json: any, errors?: Array<IValidationError>): void;
		renderSpeech(): string;
	}
	export class Image extends CardElement {
		private _selectAction;
		private parseDimension;
		private applySize;
		protected readonly useDefaultSizing: boolean;
		protected internalRender(): HTMLElement;
		style: ImageStyle;
		backgroundColor: string;
		url: string;
		size: Size;
		width: SizeAndUnit;
		pixelWidth?: number;
		pixelHeight?: number;
		altText: string;
		toJSON(): {};
		getJsonTypeName(): string;
		getActionById(id: string): Action;
		parse(json: any, errors?: Array<IValidationError>): void;
		getResourceInformation(): Array<IResourceInformation>;
		renderSpeech(): string;
		selectAction: Action;
	}
	export class ImageSet extends CardElementContainer {
		private _images;
		protected internalRender(): HTMLElement;
		imageSize: Size;
		getItemCount(): number;
		getItemAt(index: number): CardElement;
		getResourceInformation(): Array<IResourceInformation>;
		removeItem(item: CardElement): boolean;
		getJsonTypeName(): string;
		toJSON(): {};
		parse(json: any, errors?: Array<IValidationError>): void;
		addImage(image: Image): void;
		indexOf(cardElement: CardElement): number;
		renderSpeech(): string;
	}
	export class MediaSource {
		mimeType: string;
		url: string;
		constructor(url?: string, mimeType?: string);
		parse(json: any, errors?: Array<IValidationError>): void;
		toJSON(): {
			mimeType: string;
			url: string;
		};
	}
	export class Media extends CardElement {
		static readonly supportedMediaTypes: string[];
		private _selectedMediaType;
		private _selectedSources;
		private getPosterUrl;
		private processSources;
		private renderPoster;
		private renderMediaPlayer;
		protected internalRender(): HTMLElement;
		static onPlay: (sender: Media) => void;
		sources: Array<MediaSource>;
		poster: string;
		altText: string;
		parse(json: any, errors?: Array<IValidationError>): void;
		toJSON(): {};
		getJsonTypeName(): string;
		getResourceInformation(): Array<IResourceInformation>;
		renderSpeech(): string;
		readonly selectedMediaType: string;
	}
	export abstract class Input extends CardElement implements IInput {
		protected valueChanged(): void;
		abstract readonly value: string;
		onValueChanged: (sender: Input) => void;
		title: string;
		defaultValue: string;
		toJSON(): {};
		validate(): Array<IValidationError>;
		parse(json: any, errors?: Array<IValidationError>): void;
		renderSpeech(): string;
		getAllInputs(): Array<Input>;
		readonly isInteractive: boolean;
	}
	export class TextInput extends Input {
		private _textareaElement;
		private _inputElement;
		protected internalRender(): HTMLElement;
		maxLength: number;
		isMultiline: boolean;
		placeholder: string;
		style: InputTextStyle;
		getJsonTypeName(): string;
		toJSON(): {};
		parse(json: any, errors?: Array<IValidationError>): void;
		readonly value: string;
	}
	export class ToggleInput extends Input {
		private _checkboxInputElement;
		protected internalRender(): HTMLElement;
		valueOn: string;
		valueOff: string;
		getJsonTypeName(): string;
		toJSON(): {};
		parse(json: any, errors?: Array<IValidationError>): void;
		readonly value: string;
	}
	export class Choice {
		title: string;
		value: string;
		constructor(title?: string, value?: string);
		toJSON(): {
			title: string;
			value: string;
		};
	}
	export class ChoiceSetInput extends Input {
		private static uniqueCategoryCounter;
		private static getUniqueCategoryName;
		private _selectElement;
		private _toggleInputs;
		protected internalRender(): HTMLElement;
		choices: Array<Choice>;
		isCompact: boolean;
		isMultiSelect: boolean;
		placeholder: string;
		getJsonTypeName(): string;
		toJSON(): {};
		validate(): Array<IValidationError>;
		parse(json: any, errors?: Array<IValidationError>): void;
		readonly value: string;
	}
	export class NumberInput extends Input {
		private _numberInputElement;
		protected internalRender(): HTMLElement;
		min: string;
		max: string;
		placeholder: string;
		getJsonTypeName(): string;
		toJSON(): {};
		parse(json: any, errors?: Array<IValidationError>): void;
		readonly value: string;
	}
	export class DateInput extends Input {
		private _dateInputElement;
		protected internalRender(): HTMLElement;
		getJsonTypeName(): string;
		readonly value: string;
	}
	export class TimeInput extends Input {
		private _timeInputElement;
		protected internalRender(): HTMLElement;
		getJsonTypeName(): string;
		readonly value: string;
	}
	export abstract class Action implements ICardObject {
		private _shouldFallback;
		private _parent;
		private _actionCollection;
		private _renderedElement;
		private setCollection;
		protected addCssClasses(element: HTMLElement): void;
		abstract getJsonTypeName(): string;
		readonly requires: HostCapabilities;
		id: string;
		title: string;
		iconUrl: string;
		isPrimary: boolean;
		onExecute: (sender: Action) => void;
		toJSON(): {};
		render(): void;
		setParent(value: CardElement): void;
		execute(): void;
		setStatus(status: any): void;
		validate(): Array<IValidationError>;
		prepare(inputs: Array<Input>): void;
		parse(json: any, errors?: Array<IValidationError>): void;
		remove(): boolean;
		getAllInputs(): Array<Input>;
		getResourceInformation(): Array<IResourceInformation>;
		getActionById(id: string): Action;
		readonly parent: CardElement;
		readonly renderedElement: HTMLElement;
		shouldFallback(): boolean;
	}
	export class SubmitAction extends Action {
		private _isPrepared;
		private _originalData;
		private _processedData;
		getJsonTypeName(): string;
		toJSON(): {};
		prepare(inputs: Array<Input>): void;
		parse(json: any, errors?: Array<IValidationError>): void;
		data: Object;
	}
	export class OpenUrlAction extends Action {
		url: string;
		getJsonTypeName(): string;
		toJSON(): {};
		validate(): Array<IValidationError>;
		parse(json: any, errors?: Array<IValidationError>): void;
	}
	export class HttpHeader {
		private _value;
		name: string;
		constructor(name?: string, value?: string);
		toJSON(): {
			name: string;
			value: string;
		};
		prepare(inputs: Array<Input>): void;
		value: string;
	}
	export class HttpAction extends Action {
		private _url;
		private _body;
		private _headers;
		method: string;
		getJsonTypeName(): string;
		toJSON(): {};
		validate(): Array<IValidationError>;
		prepare(inputs: Array<Input>): void;
		parse(json: any, errors?: Array<IValidationError>): void;
		url: string;
		body: string;
		headers: Array<HttpHeader>;
	}
	export class ShowCardAction extends Action {
		protected addCssClasses(element: HTMLElement): void;
		readonly card: AdaptiveCard;
		getJsonTypeName(): string;
		toJSON(): {};
		validate(): Array<IValidationError>;
		parse(json: any, errors?: Array<IValidationError>): void;
		setParent(value: CardElement): void;
		getAllInputs(): Array<Input>;
		getResourceInformation(): Array<IResourceInformation>;
		getActionById(id: string): Action;
	}
	export class ActionSet extends CardElement {
		private _actionCollection;
		protected internalRender(): HTMLElement;
		orientation?: Orientation;
		constructor();
		toJSON(): {};
		isBleeding(): boolean;
		getJsonTypeName(): string;
		getActionCount(): number;
		getActionAt(index: number): Action;
		validate(): Array<IValidationError>;
		parse(json: any, errors?: Array<IValidationError>): void;
		addAction(action: Action): void;
		getAllInputs(): Array<Input>;
		getResourceInformation(): Array<IResourceInformation>;
		renderSpeech(): string;
		readonly isInteractive: boolean;
	}
	export class BackgroundImage {
		url: string;
		mode: BackgroundImageMode;
		horizontalAlignment: HorizontalAlignment;
		verticalAlignment: VerticalAlignment;
		parse(json: any, errors?: Array<IValidationError>): void;
		apply(element: HTMLElement): void;
	}
	export class Container extends CardElementContainer {
		private _selectAction;
		private _items;
		private _renderedItems;
		private _style?;
		private isElementAllowed;
		private insertItemAt;
		private readonly hasExplicitStyle;
		protected getItemsCollectionPropertyName(): string;
		protected isLastElementBleeding(): boolean;
		protected applyPadding(): void;
		protected internalRender(): HTMLElement;
		protected truncateOverflow(maxHeight: number): boolean;
		protected undoOverflowTruncation(): void;
		protected readonly hasBackground: boolean;
		protected readonly defaultStyle: string;
		protected readonly allowCustomStyle: boolean;
		backgroundImage: BackgroundImage;
		verticalContentAlignment: VerticalAlignment;
		rtl?: boolean;
		toJSON(): {};
		getItemCount(): number;
		getItemAt(index: number): CardElement;
		getJsonTypeName(): string;
		isBleeding(): boolean;
		isFirstElement(element: CardElement): boolean;
		isLastElement(element: CardElement): boolean;
		isRtl(): boolean;
		validate(): Array<IValidationError>;
		parse(json: any, errors?: Array<IValidationError>): void;
		indexOf(cardElement: CardElement): number;
		addItem(item: CardElement): void;
		insertItemBefore(item: CardElement, insertBefore: CardElement): void;
		insertItemAfter(item: CardElement, insertAfter: CardElement): void;
		removeItem(item: CardElement): boolean;
		clear(): void;
		canContentBleed(): boolean;
		getAllInputs(): Array<Input>;
		getResourceInformation(): Array<IResourceInformation>;
		getElementById(id: string): CardElement;
		getActionById(id: string): Action;
		renderSpeech(): string;
		updateLayout(processChildren?: boolean): void;
		style: string;
		padding: PaddingDefinition;
		selectAction: Action;
	}
	export type ColumnWidth = "auto" | "stretch";
	export class Column extends Container {
		private _computedWeight;
		protected adjustRenderedElementSize(renderedElement: HTMLElement): void;
		protected readonly separatorOrientation: Orientation;
		width: ColumnWidth;
		constructor(width?: ColumnWidth);
		getJsonTypeName(): string;
		toJSON(): {};
		parse(json: any, errors?: Array<IValidationError>): void;
		readonly hasVisibleSeparator: boolean;
		readonly isStandalone: boolean;
	}
	export class ColumnSet extends CardElementContainer {
		private _columns;
		private _selectAction;
		protected applyPadding(): void;
		protected internalRender(): HTMLElement;
		protected truncateOverflow(maxHeight: number): boolean;
		protected undoOverflowTruncation(): void;
		toJSON(): {};
		isFirstElement(element: CardElement): boolean;
		getCount(): number;
		getItemCount(): number;
		getColumnAt(index: number): Column;
		getItemAt(index: number): CardElement;
		getJsonTypeName(): string;
		parse(json: any, errors?: Array<IValidationError>): void;
		validate(): Array<IValidationError>;
		updateLayout(processChildren?: boolean): void;
		addColumn(column: Column): void;
		removeItem(item: CardElement): boolean;
		indexOf(cardElement: CardElement): number;
		isLeftMostElement(element: CardElement): boolean;
		isRightMostElement(element: CardElement): boolean;
		getAllInputs(): Array<Input>;
		getResourceInformation(): Array<IResourceInformation>;
		getElementById(id: string): CardElement;
		getActionById(id: string): Action;
		renderSpeech(): string;
		padding: PaddingDefinition;
		selectAction: Action;
	}
	export interface ITypeRegistration<T> {
		typeName: string;
		createInstance: () => T;
	}
	export abstract class ContainerWithActions extends Container {
		private _actionCollection;
		protected readonly renderIfEmpty: boolean;
		protected internalRender(): HTMLElement;
		protected isLastElementBleeding(): boolean;
		constructor();
		toJSON(): {};
		getActionCount(): number;
		getActionAt(index: number): Action;
		getActionById(id: string): Action;
		parse(json: any, errors?: Array<IValidationError>): void;
		validate(): Array<IValidationError>;
		isLastElement(element: CardElement): boolean;
		addAction(action: Action): void;
		clear(): void;
		getAllInputs(): Array<Input>;
		getResourceInformation(): Array<IResourceInformation>;
		readonly isStandalone: boolean;
	}
	export abstract class TypeRegistry<T> {
		private _items;
		private findTypeRegistration;
		constructor();
		clear(): void;
		abstract reset(): any;
		registerType(typeName: string, createInstance: () => T): void;
		unregisterType(typeName: string): void;
		createInstance(typeName: string): T;
		getItemCount(): number;
		getItemAt(index: number): ITypeRegistration<T>;
	}
	export class ElementTypeRegistry extends TypeRegistry<CardElement> {
		reset(): void;
	}
	export class ActionTypeRegistry extends TypeRegistry<Action> {
		reset(): void;
	}
	export interface IMarkdownProcessingResult {
		didProcess: boolean;
		outputHtml?: any;
	}
	export class AdaptiveCard extends ContainerWithActions {
		private static currentVersion;
		static useAutomaticContainerBleeding: boolean;
		static useAdvancedTextBlockTruncation: boolean;
		static useAdvancedCardBottomTruncation: boolean;
		static useMarkdownInRadioButtonAndCheckbox: boolean;
		static allowMarkForTextHighlighting: boolean;
		static readonly elementTypeRegistry: ElementTypeRegistry;
		static readonly actionTypeRegistry: ActionTypeRegistry;
		static onAnchorClicked: (element: CardElement, anchor: HTMLAnchorElement) => boolean;
		static onExecuteAction: (action: Action) => void;
		static onElementVisibilityChanged: (element: CardElement) => void;
		static onImageLoaded: (image: Image) => void;
		static onInlineCardExpanded: (action: ShowCardAction, isExpanded: boolean) => void;
		static onParseElement: (element: CardElement, json: any, errors?: Array<IValidationError>) => void;
		static onParseAction: (element: Action, json: any, errors?: Array<IValidationError>) => void;
		static onParseError: (error: IValidationError) => void;
		static onProcessMarkdown: (text: string, result: IMarkdownProcessingResult) => void;
		static processMarkdown: (text: string) => string;
		static applyMarkdown(text: string): IMarkdownProcessingResult;
		private _cardTypeName?;
		private _fallbackCard;
		private isVersionSupported;
		protected readonly renderIfEmpty: boolean;
		protected getItemsCollectionPropertyName(): string;
		protected applyPadding(): void;
		protected internalRender(): HTMLElement;
		protected readonly bypassVersionCheck: boolean;
		protected readonly defaultPadding: PaddingDefinition;
		protected readonly allowCustomPadding: boolean;
		protected readonly allowCustomStyle: boolean;
		protected readonly hasBackground: boolean;
		onAnchorClicked: (element: CardElement, anchor: HTMLAnchorElement) => boolean;
		onExecuteAction: (action: Action) => void;
		onElementVisibilityChanged: (element: CardElement) => void;
		onImageLoaded: (image: Image) => void;
		onInlineCardExpanded: (action: ShowCardAction, isExpanded: boolean) => void;
		onParseElement: (element: CardElement, json: any, errors?: Array<IValidationError>) => void;
		onParseAction: (element: Action, json: any, errors?: Array<IValidationError>) => void;
		version?: Version;
		fallbackText: string;
		designMode: boolean;
		getJsonTypeName(): string;
		toJSON(): {};
		validate(): Array<IValidationError>;
		parse(json: any, errors?: Array<IValidationError>): void;
		render(target?: HTMLElement): HTMLElement;
		updateLayout(processChildren?: boolean): void;
		canContentBleed(): boolean;
		shouldFallback(): boolean;
		readonly hasVisibleSeparator: boolean;
	}

	export interface IAction {
		id: string;
		title?: string;
	}
	export interface ISubmitAction extends IAction {
		type: "Action.Submit";
		data?: any;
	}
	export interface IOpenUrlAction extends IAction {
		type: "Action.OpenUrl";
		url: string;
	}
	export interface IShowCardAction extends IAction {
		type: "Action.ShowCard";
		card: IAdaptiveCard;
	}
	export interface ICardElement {
		id?: string;
		speak?: string;
		horizontalAlignment?: HorizontalAlignment;
		spacing?: Spacing;
		separator?: boolean;
		height?: "auto" | "stretch";
		[propName: string]: any;
	}
	export interface IBackgroundImage {
		url: string;
	}
	export interface ITextBlock extends ICardElement {
		type: "TextBlock";
		size?: TextSize;
		weight?: TextWeight;
		color?: TextColor;
		text: string;
		isSubtle?: boolean;
		wrap?: boolean;
		maxLines?: number;
	}
	export interface IContainer extends ICardElement {
		type: "Container";
		backgroundImage?: IBackgroundImage | string;
		verticalContentAlignment?: VerticalAlignment;
		selectAction?: IAction;
		items?: ICardElement[];
	}
	export interface IColumn extends IContainer {
		width?: number | "auto" | "stretch" | "auto";
	}
	export interface IColumnSet extends ICardElement {
		type: "ColumnSet";
		columns: IColumn[];
	}
	export interface IFact {
		title: string;
		value: string;
		speak?: string;
	}
	export interface IFactSet extends ICardElement {
		type: "FactSet";
		facts: IFact[];
	}
	export interface IImage extends ICardElement {
		type: "Image";
		altText?: string;
		selectAction?: IAction;
		size?: Size;
		style?: ImageStyle;
		url: string;
	}
	export interface IImageSet extends ICardElement {
		type: "ImageSet";
		images: IImage[];
		size?: Size;
	}

	export interface IDateInput extends IInput {
		type: "Input.Date";
		min?: string;
		max?: string;
		placeholder?: string;
	}
	export interface ITimeInput extends IInput {
		type: "Input.Time";
		min?: string;
		max?: string;
		placeholder?: string;
	}
	export interface INumberInput extends IInput {
		type: "Input.Number";
		min?: number;
		max?: number;
		placeholder?: string;
	}
	export interface ITextInput extends IInput {
		type: "Input.Text";
		isMultiline?: boolean;
		maxLength?: number;
		placeholder?: string;
	}
	export interface IToggleInput extends IInput {
		type: "Input.Toggle";
		title: string;
		valueOn?: string;
		valueOff?: string;
	}
	export interface IChoice {
		title: string;
		value: string;
	}
	export interface IChoiceSetInput extends IInput {
		type: "Input.ChoiceSet";
		isMultiSelect?: boolean;
		style?: "expanded" | "compact";
		placeholder?: string;
		choices: IChoice[];
	}
	export interface IVersion {
		major: number;
		minor: number;
	}
	export interface IAdaptiveCard extends ICardElement {
		type: "AdaptiveCard";
		version?: IVersion | string;
		backgroundImage?: IBackgroundImage | string;
		body?: (ITextBlock | IImage | IImageSet | IFactSet | IColumnSet | IContainer)[];
		actions?: (ISubmitAction | IOpenUrlAction | IShowCardAction)[];
		speak?: string;
	}
}
