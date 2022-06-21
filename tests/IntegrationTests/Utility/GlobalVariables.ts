export class GlobalVariables {

    private static instance: GlobalVariables;

    private  _isTwitterAdminSetupTested: boolean = false;
    private  _workStreamName: string;


    public static getInstance(): GlobalVariables {
        if (!GlobalVariables.instance) {
            GlobalVariables.instance = new GlobalVariables();
        }
        return GlobalVariables.instance;
    }

    public getIsTwitterAdminSetupTested() : boolean
    {
        return this._isTwitterAdminSetupTested;
    }
    public setIsTwitterAdminSetupTested(value: boolean)
    {
        this._isTwitterAdminSetupTested = value;
    }

    public getWorkStreamName() : string
    {
        return this._workStreamName;
    }
    public setWorkStreamName(value: string)
    {
        this._workStreamName = value;
    }
}