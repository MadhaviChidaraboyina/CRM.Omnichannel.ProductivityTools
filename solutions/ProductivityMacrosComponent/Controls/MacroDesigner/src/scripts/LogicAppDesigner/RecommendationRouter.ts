import { isObject } from "util";

export enum GoBackResponse {
    CUSTOM_CATEGORY_SELECTED = 'CUSTOM_CATEGORY_SELECTED',
    DEFAULT = 'DEFAULT'
}

export enum SelectConnectorResponse {
    CHANGE_TO_API_MANAGEMENT = 'CHANGE_TO_API_MANAGEMENT',
    CHANGE_TO_APP_SERVICE = 'CHANGE_TO_APP_SERVICE',
    CHANGE_TO_BATCH_LOGIC_APPS = 'CHANGE_TO_BATCH_LOGIC_APPS',
    CHANGE_TO_FUNCTIONS = 'CHANGE_TO_FUNCTIONS',
    CHANGE_TO_LOGIC_APPS = 'CHANGE_TO_LOGIC_APPS',
    SELECT_APP_SERVICE = 'SELECT_APP_SERVICE',
    SELECT_API_MANAGEMENT = 'SELECT_API_MANAGEMENT',
    SELECT_FUNCTION = 'SELECT_FUNCTION',
    SELECT_LOGIC_APP = 'SELECT_LOGIC_APP',
    SELECT_BATCH_LOGIC_APP = 'SELECT_BATCH_LOGIC_APP',
    DEFAULT = 'DEFAULT'
}

export enum SelectOperationResponse {
    CHANGE_TO_API_MANAGEMENT = 'CHANGE_TO_API_MANAGEMENT',
    CHANGE_TO_APP_SERVICE = 'CHANGE_TO_APP_SERVICE',
    CHANGE_TO_BATCH_LOGIC_APPS = 'CHANGE_TO_BATCH_LOGIC_APPS',
    CHANGE_TO_FUNCTIONS = 'CHANGE_TO_FUNCTIONS',
    CHANGE_TO_LOGIC_APPS = 'CHANGE_TO_LOGIC_APPS',
    CREATE_AZURE_FUNCTION = 'CREATE_AZURE_FUNCTION',
    DEFAULT = 'DEFAULT',
    SELECT_API_MANAGEMENT_API = 'SELECT_API_MANAGEMENT_API',
    SELECT_AZURE_FUNCTION_SWAGGER_ACTION = 'SELECT_AZURE_FUNCTION_SWAGGER_ACTION',
    SELECT_LOGIC_APP = 'SELECT_LOGIC_APP',
    SELECT_SCOPE_OPERATION = 'SELECT_SCOPE_OPERATION'
}

/**
 * Allows customization of the way a known set of events raised by recommendation containers are handled by recommendation services.
 */
export interface RecommendationRouter {
    /**
     * Customize how the designer should handle clicking the Back button.
     * Returning anything other than "DEFAULT" requires modifying the designer to support custom scenarios.
     * @arg {string} category - The category.
     * @return {string}
     */
    goBack(category: string): string;

    /**
     * Customize how the designer should handle connector selection.
     * Returning anything other than "DEFAULT" requires modifying the designer to support custom connector selection.
     * @arg {string} category - The category.
     * @arg {string} connector - The connector ID.
     * @arg {string} kind - The operation kind.
     * @return {string}
     */
    selectConnector(category: string, connector: string, kind: string): string;

    /**
     * Customize how the designer should handle operation selection.
     * Returning anything other than "DEFAULT" requires modifying the designer to support custom operation selection.
     * @arg {string} category - The category.
     * @arg {string} operation - The operation ID.
     * @arg {string} kind - The operation kind.
     * @return {string}
     */
    selectOperation(category: string, operation: string, kind: string): string;
}

// tslint:disable-next-line: no-any
export function isRecommendationRouter(value: any): value is RecommendationRouter {
    return isObject(value)
        && value.goBack instanceof Function
        && value.selectConnector instanceof Function
        && value.selectOperation instanceof Function;
}
