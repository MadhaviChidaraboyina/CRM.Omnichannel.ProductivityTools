declare module ACData {
	type TokenType = "{" | "?#" | "}" | "[" | "]" | "(" | ")" | "identifier" | "." | "," | "+" | "-" | "*" | "/" | "==" | "!=" | "<" | "<=" | ">" | ">=" | "string" | "number" | "boolean";
	interface Token {
		type: TokenType;
		value: string;
		originalPosition: number;
	} type LiteralValue = string | number | boolean; type FunctionCallback = (...params: any[]) => any;
	export interface IEvaluationContext {
	    /**
	     * The root data object the template will bind to. Expressions that refer to $root in the template payload
	     * map to this field. Initially, $data also maps to $root.
	     */
	    $root: any;
	}
	export class EvaluationContext {
		private static readonly _reservedFields;
		private static _builtInFunctions;
		static init(): void;
		private _functions;
		private _stateStack;
		$root: any;
		$data: any;
		$index: number;
		registerFunction(name: string, callback: FunctionCallback): void;
		unregisterFunction(name: string): void;
		getFunction(name: string): FunctionCallback;
		isReservedField(name: string): boolean;
		saveState(): void;
		restoreLastState(): void;
		readonly currentDataContext: any;
	} abstract class EvaluationNode {
		abstract evaluate(context: EvaluationContext): LiteralValue;
	}
	export class ExpressionParser {
		private _index;
		private _tokens;
		private unexpectedToken;
		private unexpectedEoe;
		private moveNext;
		private parseToken;
		private parseOptionalToken;
		private parseFunctionCall;
		private parseIdentifier;
		private parseIndexer;
		private parsePath;
		private parseExpression;
		private readonly eoe;
		private readonly current;
		static parseBinding(expressionString: string): Binding;
		constructor(tokens: Token[]);
	}
	export class Binding {
		readonly expressionString: string;
		private readonly expression;
		readonly allowNull: boolean;
		constructor(expressionString: string, expression: EvaluationNode, allowNull?: boolean);
		evaluate(context: EvaluationContext): LiteralValue;
	}
	export class GlobalSettings {
		static undefinedExpressionValueSubstitutionString?: string;
	}
	export class Template {
		private static prepare;
		private _context;
		private expandSingleObject;
		private internalExpand;
		preparedPayload: any;
		constructor(payload: any);
		expand(context: IEvaluationContext): any;
	}

}
