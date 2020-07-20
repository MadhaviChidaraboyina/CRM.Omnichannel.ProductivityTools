import { RecommendationConnector, RecommendationOperation } from "../DesignerDefinitions";

export type CompareFunction<T> = (a: T, b: T) => number;

/**
 * @arg {(item: T): boolean} selector - A function to translate an item of type T into a Boolean.
 * @return {CompareFunction<T>} - A comparer function for items of type T for Boolean comparisons.
 */
export function makeBooleanComparer<T>(selector: (item: T) => boolean): CompareFunction<T> {
    return (a: T, b: T): number => {
        const booleanA = selector(a);
        const booleanB = selector(b);

        if (booleanA < booleanB) {
            return -1;
        } else if (booleanA > booleanB) {
            return 1;
        } else {
            return 0;
        }
    };
}

/**
 * @arg {(item: T): number} selector - A function to translate an item of type T into a number.
 * @return {CompareFunction<T>} - A comparer function for items of type T for numerical comparisons.
 */
export function makeNumberComparer<T>(selector: (item: T) => number): CompareFunction<T> {
    return (a: T, b: T): number => {
        const numberA = selector(a);
        const numberB = selector(b);

        if (numberA < numberB) {
            return -1;
        } else if (numberA > numberB) {
            return 1;
        } else {
            return 0;
        }
    };
}

export const CaseInsensitiveCollator = new Intl.Collator([], { sensitivity: 'base' });
export const compareBooleans = makeBooleanComparer<boolean>(a => a);
const compareNumbers = makeNumberComparer<number>(a => a);

export function compareFunctionForConnectors(a: RecommendationConnector, b: RecommendationConnector): number {
    return comparePromotionIndex(a.promotionIndex, b.promotionIndex)
        || CaseInsensitiveCollator.compare(a.title, b.title);
}

export function compareFunctionForOperations(a: RecommendationOperation, b: RecommendationOperation): number {
    return comparePromotionIndex(a.promotionIndex, b.promotionIndex)
        || compareBooleans(!!b.important, !!a.important)
        || CaseInsensitiveCollator.compare(a.subtitle, b.subtitle)
        || CaseInsensitiveCollator.compare(a.title, b.title);
}

export function comparePromotionIndex(a: number | undefined, b: number | undefined): number {
    const comparandA = a !== undefined ? a : Number.MAX_VALUE;
    const comparandB = b !== undefined ? b : Number.MAX_VALUE;
    return compareNumbers(comparandA, comparandB);
}
