import { OCCustomer } from "../../../models/oc-customer.t";
import { AsyncConnectorActivity } from "../../../types/e2e/async-connector-activity.t";
import { Extension } from "../../../types/e2e/attachment-extension.t";

export abstract class BaseActivity implements AsyncConnectorActivity {
    private readonly activityTemplate: object = null;
    private currentActivity: object = null;

    constructor() {
        this.activityTemplate = this.getTemplate();
    }

    private get CurrentActivity() {
        if (this.currentActivity === null) {
            this.currentActivity = JSON.parse(JSON.stringify(this.activityTemplate)); // Deep copy
        }

        return this.currentActivity;
    }

    private setValueByJPath(target: object, jPath: string, value: any) {
        const parts = jPath.match(/[^.[\]]+/g) || [];
        parts.slice(0, -1).reduce((a, c, i) => // Iterate all of them except the last one
            Object(a[c]) === a[c] // Does the key exist and is its value an object?
                // Yes: then follow that path
                ? a[c]
                // No: create the key. Is the next key a potential array-index?
                : a[c] = Math.abs(+parts[i + 1]) >> 0 === +parts[i + 1]
                    ? [] // Yes: assign a new array object
                    : {}, // No: assign a new plain object
            target)[parts[parts.length - 1]] = value; // Finally assign the value to the last key
    }

    protected applyToTemplate(jPath: string, value: any) {
        this.setValueByJPath(this.activityTemplate, jPath, value);
    }

    protected apply(jPath: string, value: any) {
        this.setValueByJPath(this.CurrentActivity, jPath, value);
    }

    public build() {
        const createdActivity = this.currentActivity === null ? JSON.stringify(this.activityTemplate) : JSON.stringify(this.currentActivity);
        this.currentActivity = null;
        return createdActivity;
    }

    public abstract useMessage(msg: string): AsyncConnectorActivity;

    public abstract useAttachment(extension: Extension): AsyncConnectorActivity;

    public abstract useCustomer(customer: OCCustomer): AsyncConnectorActivity;

    protected abstract getTemplate(): object;
}