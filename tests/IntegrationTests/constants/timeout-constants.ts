export class TimeoutConstants {
    public static readonly WaitForChannelCreation = 5 * 1000;
    public static readonly ThreeSecondsDelay = 3 * 1000;
    public static readonly FiveSecondsDelay = 5 * 1000;
    public static readonly Default = 40 * 1000;
    public static readonly Minute = 60 * 1000;
    public static readonly WaitForLoadingOmnichannelForCustomers = 30 * 1000;
    public static readonly Test = 5 * 60 * 1000;
    public static readonly SaveToCosmosDBMinimumTime = 60 * 1000;
    public static readonly WaitTimeOutForLoadingOmnichannelForCustomers = 60 * 1000;
    public static Minutes(count: number = 1) {
        return count * 60 * 1000; // in millisecond
    }
}