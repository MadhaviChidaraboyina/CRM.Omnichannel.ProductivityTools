declare class AWTLogManager {
    /**
    * Initializes the log manager. After this method is called, events are
    * accepted for transmission.
    * @param {string} tenantToken - A string that contains the default tenant token.
    * @param {object} config      - [Optional] Configuration settings for initialize, as an AWTLogConfiguration object.
    */
    static initialize(tenantToken: string, configuration?: AWTLogConfiguration): AWTLogger;
     /**
     * Gets the global semantic context.
     *
     * @return A AWTSemanticContext object, through which you can set common semantic properties.
     */
    static getSemanticContext(): AWTSemanticContext;
    /**
     * Asynchronously sends events currently in the queue. New events added
     * are sent after the current flush finishes. The passed callback is
     * called when flush finishes. <b>Note:</b> If LogManager is paused, or if
     * flush is called again in less than 30 seconds, then flush is no-op, and
     * the callback is not called.
     * @param {function} callback - The function that is called when flush finishes.
     */
    static flush(callback: () => void): void;
    /**
     * Prevents new events from being added for transmission. It also batches all
     * events currently in the queue, and creates requests for them to be sent. If
     * HTML5 Beacons are supported, then they will be used.
     */
    static flushAndTeardown(): void;
    /**
     * Pasues the transmission of events.
     */
    static pauseTransmission(): void;
    /**
     * Resumes the tranmission of events.
     */
    static resumeTransmision(): void;
    /**
     * Sets the transmit profile. This changes the transmission timers
     * based on the transmit profile.
     * @param {string} profileName - A string that contains the name of the transmit profile.
     */
    static setTransmitProfile(profileName: string): void;
    /**
     * Loads custom transmission profiles. Each profile should have timers for
     * high, normal, and low. Each profile should make sure
     * that a each priority timer is a multiple of the priority higher than it.
     * Setting the timer value to <i>-1</i> means the events for that priority will
     * not be sent. Note that once a priority has been set to <i>not send</i>, then all priorities
     * below it will also not be sent. The timers should be in the form of [low, normal, high].
     * E.g, <i>Custom: [30,10,5]</i>.
     * This method removes any previously loaded custom profiles.
     * @param {object} profiles - A dictionary that contains the transmit profiles.
     */
    static loadTransmitProfiles(profiles: {
        [profileName: string]: number[];
    }): void;
    /**
     * Sets the context sent with every event.
     * @param {string} name                 - A string that contains the name of the context property.
     * @param {string|number|boolean} value - The value of the context property.
     * @param {enum} type                   - [Optional] The type for the context property value, as one of the
     * AWTPropertyType enumeration values.
     */
    static setContext(name: string, value: string | number | boolean, type?: AWTPropertyType): void;
    /**
     * Sets the context sents with every event, and tags it as PII.
     * @param {string} name                 - A string that contains the name of the context property.
     * @param {string|number|boolean} value - The value of the context property.
     * @param {enum} pii                    - The kind of PII for the context property.
     * @param {enum} type                   - [Optional] The type for the context property value, as one of the
     * AWTPropertyType enumeration values.
     */
    static setContextWithPii(name: string, value: string | number | boolean, pii: AWTPiiKind, type?: AWTPropertyType): void;
	 /**
     * Sets the context sent with every event from this logger, and tags it as <i>customer content</i>.
     * @param {string} name                 - A string that contains the name of the context property.
     * @param {string|number|boolean} value - The value of the context property.
     * @param {enum} customerContent        - The kind of customer content for the context property, as one of the
     * AWTCustomerContentKind enumeration values.
     * @param {enum} type                   - [Optional] The type for the context property value, as one of the
     * AWTPropertyType enumeration values.
     */
    static setContextWithCustomerContent(name: string, value: string | number | boolean, customerContent: AWTCustomerContentKind, type?: AWTPropertyType): void;
    /**
     * Gets the logger for the specified tenant token.
     * @param {string} tenantToken - A string that contains the tenant token.
     * @return An AWTLogger object which sends data with the specified tenant token. If the tenant token is
     * undefined, or null, or empty, then undefined is returned.
     */
    static getLogger(tenantToken?: string): AWTLogger;
    /**
     * Adds a notification listener. The Aria SDK calls methods on the listener
     * when an appropriate notification is raised.
     * @param {object} listener - An AWTNotificationListener object.
     */
    static addNotificationListener(listener: AWTNotificationListener): void;
}
declare class AWTSemanticContext {
	/**
     * Sets the field AppInfo.Id with the given value.
     * @param {string} appId  - The Id uniquely identifies the App from this this event originated.
     * In the multi-tenant Aria Platform, this is the Application Id of the
     * registered Application. Example, "735d47645f7c4de69964e2c01888d6b6".
     */
    setAppId(appId: string): void;
    /**
     * Sets the field AppInfo.Version with the given value.
     * @param {string} appVersion  - The version of the App, retrieved programmatically where possible. This
     * is app/platform dependent. Examples such as "7.0.0.100" for Skype,
     * or "12.0.30723.00 Update 3" for Microsoft Visual Studio Ultimate 2013
     */
    setAppVersion(appVersion: string): void;
    /**
     * Sets the field AppInfo.Language with the given value.
     * @param {string} appLanguage  - Language of the App in IETF language tag format, as described in RFC 4646.
     * Examples of acceptable values include "en", "pt-BR" and "zh-Hant-CN".
     */
    setAppLanguage(appLanguage: string): void;
    /**
     * Sets the field DeviceInfo.Id with the given value.
     * @param {string} deviceId  - The device Id uniquely identifies the physical device, using platform
     * available API's. This allows correlation against Aria Hardware Inventory.
     */
    setDeviceId(deviceId: string): void;
    /**
     * Sets the field DeviceInfo.OsName with the given value.
     * @param {string} deviceOsName  - The name of the OS. The SDK should ensure this is a limited normalized
     * set. Asimov is using very high level value e.g. Windows/Android/iOS.
     * Examples such as "iOS" or "Windows Phone".
     */
    setDeviceOsName(deviceOsName: string): void;
    /**
     * Sets the field DeviceInfo.OsVersion with the given value.
     * @param {string} deviceOsVersion  - The version of the OS, retrieved programmatically, which can be used
     * for aggregation or filtering for scenarios like real time monitoring
     * or metrics reporting. Flurry and GA provide aggregation at this level.
     * Examples such as "8.1.2" for iOS, or "8.1" for Windows Phone.
     */
    setDeviceOsVersion(deviceOsVersion: string): void;
    /**
     * Sets the field DeviceInfo.Id with the given value.
     * @param {string} deviceBrowserName  - he name of the OS. The SDK should ensure this is a limited normalized set.
     * Examples such as "Chrome" or "Edge".
     */
    setDeviceBrowserName(deviceBrowserName: string): void;
    /**
     * Sets the field DeviceInfo.Id with the given value.
     * @param {string} deviceBrowserVersion  - The version of the browser, retrieved programmatically, which can be used
     * for aggregation or filtering for scenarios like real time monitoring or metrics reporting.
     * Examples such as "57.0.2987.133" for Chrome, or "15.15063" for Edge.
     */
    setDeviceBrowserVersion(deviceBrowserVersion: string): void;
    /**
     * Set the device manufacturer context information of telemetry event.
     * Can only be set at the LogManager level. Setting it via the object obtained from ILogger
     * will be no-op.
     * @param {string} deviceMake The manufacturer of the device, retrieved
     *            programmatically where possible and is app/platform specific
     */
    setDeviceMake(deviceMake: string): void;
    /**
     * Set the device model context information of telemetry event.
     * Can only be set at the LogManager level. Setting it via the object obtained from ILogger
     * will be no-op.
     * @param {string} deviceModel The model of the device, retrieved programmatically
     *            where possible and is app/platform specific
     */
    setDeviceModel(deviceModel: string): void;
    /**
     * Sets the field UserInfo.Id with the given value.
     * @param {string} userId     - The id uniquely identifies the user in an application-specific
     * user namespace, such as a Skype ID in the Skype App. This may be empty for Apps
     * which do not require user sign-in.
     * @param {enum} pii        - Optional pii type for the user id.
     * @param {enum} userIdType - Optional id type for the user id.
     */
    setUserId(userId: string, pii?: AWTPiiKind, userIdType?: AWTUserIdType): void;
    /**
     * Sets the field UserInfo.AdvertisingId with the given value.
     * @param {string} userAdvertisingId  - The AdvertisingId is the user-specific device id obtainable through
     * platform API's. This may not be available if users choose to opt-out
     * of this id, or if the underlying platform does not support it.
     */
    setUserAdvertisingId(userAdvertisingId: string): void;
    /**
     * Sets the field UserInfo.TimeZone with the given value.
     * @param {string} userTimeZone  - The user's time zone relative to UTC, in ISO 8601 time zone format.
     * Examples of acceptable values include "+00", "+07:00", and "-1130".
     */
    setUserTimeZone(userTimeZone: string): void;
    /**
     * Sets the field UserInfo.Language with the given value.
     * @param {string} userLanguage  - The user's language in IETF language tag format, as described in RFC 4646.
     * Examples of acceptable values include "en", "pt-BR" and "zh-Hant-CN".
     */
    setUserLanguage(userLanguage: string): void;
}
declare class AWTLogger {
    /**
     * Sets the context sent with every event from this logger.
     * @param {string} name                 - The name of the context property.
     * @param {string|number|boolean} value - The context property's value.
     * @param {enum} type                   - [Optional] The type of context property, as one of the AWTPropertyType enumeration values.
     */
    setContext(name: string, value: string | number | boolean, type?: AWTPropertyType): void;
    /**
     * Sets context that will be sent with every event from this logger, and tags it as PII.
     * @param {string} name                 - The name of the context property.
     * @param {string|number|boolean} value - The context property's value.
     * @param {enum} pii                    - The kind of PII for the context property, as one of the AWTPiiKind enumeration values.
     * @param {enum} type                   - [Optional] The type of context property, as one of the AWTPropertyType enumeration values.
     */
    setContextWithPii(name: string, value: string | number | boolean, pii: AWTPiiKind, type?: AWTPropertyType): void;
    /**
     * Sets the context that sent with every event from this logger, and tags it as customer content.
     * @param {string} name                 - The name of the context property.
     * @param {string|number|boolean} value - The context property's value.
     * @param {enum} customerContent        - The customer content kind, as one of the AWTCustomerContentKind enumeration values.
     * @param {enum} type                   - [Optional] The type of context property, as one of the AWTPropertyType enumeration values.
     */
    setContextWithCustomerContent(name: string, value: string | number | boolean, customerContent: AWTCustomerContentKind, type?: AWTPropertyType): void;
    /**
     * Gets the logger semantic context.
     * <b>Note:</b> Device properties are not permitted at the logger level, but you can set them
     * at the global level using the AWTLogManager class.
     *
     * @return A AWTSemanticContext object that you can use to set common semantic properties.
     */
    getSemanticContext(): AWTSemanticContext;
    /**
     * Logs a custom event with the specified name and fields - to track information
     * such as how a particular feature is used.
     * @param {Object} event - Can be either an AWTEventProperties object or an AWTEventData object or an event name.
     */
    logEvent(event: AWTEventProperties | AWTEventData | string): void;
    /**
     * Logs the session state.
     * <b>Note:</b> Calling Logging session <i>start</i> while a session already exists will produce a no-op. Similarly, calling logging
     * session <i>end</i> while a session does not exist will also produce a no-op.
     * @param {enum} state         - The session's state.
     * @param {obbject} properties - [Optional] Properties of the session event as either a AWTEventProperties object,
     * or a AWTEventData object.
     */
    logSession(state: AWTSessionState, properties?: AWTEventProperties | AWTEventData): void;
    /**
     * Gets the session ID for the ongoing session.
     * @return {string} A string that contains the session ID for the ongoing session. Returns undefined if there is
     * no ongoing session.
     */
    getSessionId(): string;
    /**
     * Logs a failure event, such as an application exception.
     * @param {string} signature  - A string that identifies the bucket of the failure.
     * @param {string} detail     - A string that contains the a description of the failure.
     * @param {string} category   - [Optional] A string that identifies the category of the failure, such as an application error,
     * a hang, or a crash.
     * @param {string} id         - [Optional] A string that that uniquely identifies this failure.
     * @param {object} properties - [Optional] Properties of the failure event, as either an AWTEventProperties object or an
     * AWTEventData object. This value can also be null.
     */
    logFailure(signature: string, detail: string, category?: string, id?: string, properties?: AWTEventProperties | AWTEventData): void;
    /**
     * Logs a page view event which is normally a result of a user action on a UI page - such as search query,
     * a content request, or a page navigation.
     *
     * @param {string} id          - A string that uniquely identifies this page.
     * @param {string} pageName    - The name of the page.
     * @param {string} category    - [Optional] A string that contains the category to which this page belongs.
     * @param {string} uri         - [Optional] A string that contains the URI of this page.
     * @param {string} referrerUri - [Optional] A string that contains the URI that refers to this page.
     * @param {object} properties  - [Optional] Properties of the page view event, as an AWTEventProperties object.
     * This value can also be null.
     */
    logPageView(id: string, pageName: string, category?: string, uri?: string, referrerUri?: string, properties?: AWTEventProperties): void;
}
declare class AWTEventProperties {
	 /**
     * The AWTEventProperties class constructor.
     * @constructor
     * @param {string} - [Optional] The name of the event.
     */
    constructor(name?: string);
    /**
     * Sets the name of the event.
     * @param {string} name - The name of the event.
     */
    setName(name: string): void;
    /**
     * Gets the name of the event.
     * @return {string|undefined} - The name of the event, or undefined if the name has not been set.
     */
    getName(): string | undefined;
    /**
     * Sets the base type of the event.
     * @param {string} type - The base type of the event.
     */
    setType(type: string): void;
    /**
     * Gets the base type of the event.
     * @return {string|undefined} The base type of the event, or undefined if the base type has not been set.
     */
    getType(): string | undefined;
    /**
     * Sets the timestamp for the event.
     * @param {number} timestampInEpochMillis - The timestamp (in milliseconds) since UNIX Epoch.
     */
    setTimestamp(timestampInEpochMillis: number): void;
    /**
     * Gets the timestamp for the event.
     * @return {number|undefined} The timestamp for the event, or undefined if it has not been set.
     */
    getTimestamp(): number | undefined;
    /**
     * Sets the priority for sending the event. The default priority
     * of the event is Normal.
     * @param {enum} priority - An AWTEventPriority enumeration value that specifies the priority of the event.
     */
    setEventPriority(priority: AWTEventPriority): void;
    /**
     * Gets the priority for the event.
     * @return {AWTEventPriority} - An AWTEventPriority enumeration value that specifies the priority of the event.
     */
    getEventPriority(): AWTEventPriority;
    /**
     * Sets a property with a name and value. Optionally sets the property type.
     * @param {string} name                 - The name of the property.
     * @param {string|number|boolean} value - The property's value.
     * @param {enum} type                   - [Optional] One of the AWTPropertyType enumeration values that specifies
     * the type for the property.
     */
    setProperty(name: string, value: string | number | boolean, type?: AWTPropertyType): void;
    /**
     * Sets a property with a name, a value, and a PII. Optionally sets the property type.
     * @param {string} name                 - The name of the property.
     * @param {string|number|boolean} value - The property's value.
     * @param {enum} pii                    - The kind of PII for the property.
     * @param {enum} type                   - [Optional] One of the AWTPropertyType enumeration values that specifies
     * the type for the property.
     */
    setPropertyWithPii(name: string, value: string | number | boolean, pii: AWTPiiKind, type?: AWTPropertyType): void;
    /**
     * Sets a property with name, value and customer content. Optionally set the property type of the value.
     * @param {string} name                 - The name of the property.
     * @param {string|number|boolean} value - The property's value.
     * @param {enum} customerContent        - The customer content kind for the property.
     * @param {enum} type                   - [Optional] One of the AWTPropertyType enumeration values that specifies
     * the type for the property.
     */
    setPropertyWithCustomerContent(name: string, value: string | number | boolean, customerContent: AWTCustomerContentKind, type?: AWTPropertyType): void;
    /**
     * Gets the properties currently added to the event.
     * @return {object} A Map<string, AWTEventProperty> containing the current properties.
     */
    getPropertyMap(): {
        readonly [name: string]: AWTEventProperty;
    };
    /**
     * Gets the event from this event properties object.
     * @return {object} The event properties compiled into AWTEventData.
     */
    getEvent(): AWTEventData;
}
/**
 * The AWTLogConfiguration interface holds the configuration details passed to AWTLogManager initialize.
 * @interface
 * @property {string} collectorUri                         - [Optional] A string that contains the collector URI to which requests are sent.
 * @property {number} cacheMemorySizeLimitInNumberOfEvents - [Optional] The number of events that can be kept in memory before
 * the SDK starts to drop events. By default, this is 10,000.
 * @property {object} httpXHROverride                      - [Optional] The HTTP override that should be used to send requests, as an
 * AWTXHROverride object.
 * @property {object} propertyStorageOverride              - [Optional] The property storage override that should be used to store
 * internal SDK properties, otherwise stored as cookies. It is needed where cookies are not available.
 * @property {string} userAgent                            - [Optional] A string that contains the user agent parsed for auto collection in
 * case the userAgent can't be obtained from the DOM.
 * @property {boolean} disableCookiesUsage                 - [Optional] A boolean that indicated whether to disable the use of cookies by
 * the Aria SDK. The cookies added by the SDK are MicrosoftApplicationsTelemetryDeviceId and MicrosoftApplicationsTelemetryFirstLaunchTime.
 *  If cookies are disabled, then session events are not sent unless propertyStorageOverride is provided to store the values elsewhere.
 * @property {function} canSendStats                       - [Optional] A function that returns a boolean that identifies whether
 * statistics can be sent. The SDK calls this method before sending statistics.
 * @property {boolean} enableAutoUserSession               - [Optional] A boolean that indicates if we should auto instrument session
 *  events. Note: This setting is only respected for browsers where window events are accessible.
 */
declare interface AWTLogConfiguration {
    collectorUri?: string;
    cacheMemorySizeLimitInNumberOfEvents?: number;
    httpXHROverride?: AWTXHROverride;
    propertyStorageOverride?: AWTPropertyStorageOverride;
    userAgent?: string;
    disableCookiesUsage?: boolean;
    canSendStatEvent?: (eventName: string) => boolean;
    enableAutoUserSession?: boolean;
}
/**
 * The AWTPropertyStorageOverride interface provides a custom interface for storing internal SDK properties - otherwise they are
 * stored as cookies.
 * You need this interface when you intend to run auto collection for common properties, or when you log a session in
 * a non browser environment.
 * @interface
 * @property {function} setProperty - A function for passing key value pairs to be stored.
 * @property {function} getProperty - A function that gets a value for a given key.
 */
declare interface AWTPropertyStorageOverride {
    setProperty: (key: string, value: string) => void;
    getProperty: (key: string) => string;
}
/**
 * The AWTXHROverride interface overrides the way HTTP requests are sent.
 * @interface
 * @method {function} send - This method sends data to the specified URI using a POST request. If sync is true,
 * then the request is sent synchronously. The <i>ontimeout</i> function should be called when the request is timed out.
 * The <i>onerror</i> function should be called when an error is thrown while sending the request.
 * The <i>onload</i> function should be called when the request is completed.
 */
declare interface AWTXHROverride {
    sendPOST: (urlString: string, data: Uint8Array | string, ontimeout: (status: number, headers: {
        [headerName: string]: string;
    }) => any, onerror: (status: number, headers: {
        [headerName: string]: string;
    }) => any, onload: (status: number, headers: {
        [headerName: string]: string;
    }) => any, sync?: boolean) => void;
}
/**
 * An interface used to create an event property value along with its type, PII, and customer content.
 * <b>Caution:</b> Customer content and PII are mutually exclusive. You can use only one of them at a time.
 * If you use both, then both properties will be considered invalid, and therefore won't be sent.
 * @interface
 * @property {string|number|boolean} value - The value for the property.
 * @property {enum} type                   - [Optional] The type for the property value.
 * @property {enum} pii                    - [Optional] The pii kind associated with property value.
 * @property {enum} cc                     - [Optional] The customer content kind associated with the property value.
 */
declare interface AWTEventProperty {
    value: string | number | boolean;
    type?: AWTPropertyType;
    pii?: AWTPiiKind;
}
/**
 * An interface used to create an event, along with its name, properties, type, timestamp, and priority.
 * @interface
 * @property {string} name        - A string that contains the name of the event.
 * @property {object} properties  - The properties associated with this event. Can be a number, a boolean, or an AWTEventProperty object.
 * @property {string} type        - [Optional] A string that contains the base type of the event.
 * @property {number} timestamp   - [Optional] A number that contain the timestamp for the event.
 * @property {enum} priority      - [Optional] An AWTEventPriority enumeration value, that specifies the priority for the event.
 */
declare interface AWTEventData {
    name?: string;
    properties?: {
        [name: string]: string | number | boolean | AWTEventProperty;
    };
    type?: string;
    timestamp?: number;
    priority?: AWTEventPriority;
}
/**
 * An interface used for an event when it is returned in a notification, or sent to storage.
 * @property {string} name        - A string that contains the name of the event.
 * @property {object} properties  - The properties associated with this event. Can be a number, a boolean, or an AWTEventProperty object.
 * @property {number} timestamp   - [Optional] The timestamp for the event.
 * @property {enum} priority      - [Optional] An AWTEventPriority enumeration value, that specifies the priority for the event.
 * @property {string} apiKey      - [Optional] A string that contains the tenant token (also known as the application key).
 * @property {string} id          - [Optional] A string that contains the event identifier.
 */
declare interface AWTEventDataWithMetaData extends AWTEventData {
    name: string;
    properties: {
        [name: string]: string | number | boolean | AWTEventProperty;
    };
    timestamp: number;
    priority: AWTEventPriority;
    apiKey: string;
    id: string;
}
/**
 * An interface used for the notification listener.
 * @interface
 * @property {function} eventsSent     - [Optional] A function called when events are sent.
 * @property {function} eventsDropped  - [Optional] A function called when events are dropped.
 * @property {function} eventsRejected - [Optional] A function called when events are rejected.
 * @property {function} eventsRetrying - [Optional] A function called when events are resent.
 */
declare interface AWTNotificationListener {
    eventsSent?: (events: AWTEventDataWithMetaData[]) => void;
    eventsDropped?: (events: AWTEventDataWithMetaData[], reason: AWTEventsDroppedReason) => void;
    eventsRejected?: (events: AWTEventDataWithMetaData[], reason: AWTEventsRejectedReason) => void;
    eventsRetrying?: (events: AWTEventDataWithMetaData[]) => void;
}
/**
 * The AWTPropertyType enumeration contains a set of values that specify types of properties.
 * @enum {number}
 */
declare enum AWTPropertyType {
    /**
     * Property type is unspecified.
     */
    Unspecified = 0,
    /**
     * A string.
     */
    String = 1,
    /**
     * A 64-bit integer.
     */
    Int64 = 2,
    /**
     * A double.
     */
    Double = 3,
    /**
     * A boolean.
     */
    Boolean = 4,
}
/**
 * The AWTPiiKind enumeration contains a set of values that specify the kind of PII (Personal Identifiable Information).
 * @enum {number}
 */
declare enum AWTPiiKind {
    /**
     * No kind.
     */
    NotSet = 0,
    /**
     * An LDAP distinguished name. For example, CN=Jeff Smith,OU=Sales,DC=Fabrikam,DC=COM.
     */
    DistinguishedName = 1,
    /**
     * Generic information.
     */
    GenericData = 2,
    /**
     * An IPV4 Internet address. For example, 192.0.2.1.
     */
    IPV4Address = 3,
    /**
     * An IPV6 Internet address. For example, 2001:0db8:85a3:0000:0000:8a2e:0370:7334.
     */
    IPv6Address = 4,
    /**
     * The Subject of an e-mail message.
     */
    MailSubject = 5,
    /**
     * A telephone number.
     */
    PhoneNumber = 6,
    /**
     * A query string.
     */
    QueryString = 7,
    /**
     * An SIP (Session Internet Protocol) address.
     */
    SipAddress = 8,
    /**
     * An e-mail address.
     */
    SmtpAddress = 9,
    /**
     * An user ID.
     */
    Identity = 10,
    /**
     * A URI (Uniform Resource Identifier).
     */
    Uri = 11,
    /**
     * The fully-qualified domain name.
     */
    Fqdn = 12,
    /**
     * Scrubs the last octet in a IPV4 Internet address.
     * For example: 10.121.227.147 becomes 10.121.227.*
     */
    IPV4AddressLegacy = 13,
}
/**
 * The AWTCustomerContentKind enumeration contains a set of values that specify the kind of customer content.
 * @enum {number}
 */
declare enum AWTCustomerContentKind {
    /**
     * No kind.
     */
    NotSet = 0,
    /**
     * Generic content.
     */
    GenericContent = 1,
}
/**
 * The AWTEventPriority enumeration contains a set of values that specify an event's priority.
 * @enum {number}
 */
declare enum AWTEventPriority {
    /**
     * Low priority.
     */
    Low = 1,
    /**
     * Normal priority.
     */
    Normal = 2,
    /**
     * High priority.
     */
    High = 3,
    /**
     * Immediate_sync priority (Events are sent sync immediately).
     */
    Immediate_sync = 4,
}
/**
 * The AWTEventsDroppedReason enumeration contains a set of values that specify the reason for dropping an event.
 * @enum {number}
 */
declare enum AWTEventsDroppedReason {
    /**
     * Status set to non-retryable.
     */
    NonRetryableStatus = 1,
    /**
     * The user ended the app.
     */
    KillSwitch = 2,
    /**
     * The event queue is full.
     */
    QueueFull = 3,
}
/**
 * The AWTEventsRejectedReason enumeration contains a set of values that specify the reason for rejecting an event.
 * @enum {number}
 */
declare enum AWTEventsRejectedReason {
    /**
     * The event is invalid.
     */
    InvalidEvent = 1,
    /**
     * The size of the event is too large.
     */
    SizeLimitExceeded = 2,
}
/**
 * The AWTUserIdType enumeration contains a set of values that specify the type of user ID.
 * @enum {number}
 */
declare enum AWTUserIdType {
    /**
     * The user ID type is unknown.
     */
    Unknown = 0,
    /**
     * Microsoft Account ID.
     */
    MSACID = 1,
    /**
     * Microsoft .NET Passport Unique ID.
     */
    MSAPUID = 2,
    /**
     * Anonymous user ID.
     */
    ANID = 3,
    /**
     * Organization customer ID.
     */
    OrgIdCID = 4,
    /**
     * Microsoft Exchange Passport ID.
     */
    OrgIdPUID = 5,
    /**
     * User object ID.
     */
    UserObjectId = 6,
    /**
     * Skype ID.
     */
    Skype = 7,
    /**
     * Yammer ID.
     */
    Yammer = 8,
    /**
     * E-mail address.
     */
    EmailAddress = 9,
    /**
     * Telephone number.
     */
    PhoneNumber = 10,
    /**
     * SIP address.
     */
    SipAddress = 11,
    /**
     * Multiple unit identity.
     */
    MUID = 12,
}
/**
 * The AWTSessionState enumeration contains a set of values that indicate the session state.
 * @enum {number}
 */
declare enum AWTSessionState {
    /**
     * Session started.
     */
    Started = 0,
    /**
     * Session ended.
     */
    Ended = 1,
}
declare const AWT_COLLECTOR_URL_UNITED_STATES;
declare const AWT_COLLECTOR_URL_GERMANY;
declare const AWT_COLLECTOR_URL_JAPAN;
declare const AWT_COLLECTOR_URL_AUSTRALIA;
declare const AWT_COLLECTOR_URL_EUROPE;
declare const AWT_REAL_TIME;
declare const AWT_NEAR_REAL_TIME;
declare const AWT_BEST_EFFORT;
