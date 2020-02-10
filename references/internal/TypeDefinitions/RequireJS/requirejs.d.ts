interface RequireJS {
	(deps: string[], ready: (...deps: any[]) => void): void;
}

declare var require: RequireJS;
