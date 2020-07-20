export function stringIncludes(subjectString: string, searchString: string, position: number, ignoreCase = true): boolean {
    if (typeof position === 'undefined') { position = 0; }

    if (ignoreCase) {
        return String.prototype.indexOf.call(subjectString.toLowerCase(), searchString.toLowerCase(), position) >= 0;
    } else {
        return String.prototype.indexOf.call(subjectString, searchString, position) >= 0;
    }
}

/**
 * Returns true if a value is an object.
 * @arg {any} value - The value to check if it is an object.
 * @return {boolean} - True if the value is an object.
 */
export function isObject(value: any): boolean { // tslint:disable-line: no-any
    return Object.prototype.toString.call(value) === '[object Object]';
}
