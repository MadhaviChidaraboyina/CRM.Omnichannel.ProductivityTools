(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 30);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
* Enums.ts
* @author Abhilash Panwar (abpanwar)
* @copyright Microsoft 2018
* File containing the enums.
*/
/**
 * The AWTPropertyType enumeration contains a set of values that specify types of properties.
 * @enum {number}
 */
var AWTPropertyType;
(function (AWTPropertyType) {
    /**
     * Property type is unspecified.
     */
    AWTPropertyType[AWTPropertyType["Unspecified"] = 0] = "Unspecified";
    /**
     * A string.
     */
    AWTPropertyType[AWTPropertyType["String"] = 1] = "String";
    /**
     * A 64-bit integer.
     */
    AWTPropertyType[AWTPropertyType["Int64"] = 2] = "Int64";
    /**
     * A double.
     */
    AWTPropertyType[AWTPropertyType["Double"] = 3] = "Double";
    /**
     * A boolean.
     */
    AWTPropertyType[AWTPropertyType["Boolean"] = 4] = "Boolean";
    /**
     * A date.
     */
    AWTPropertyType[AWTPropertyType["Date"] = 5] = "Date";
})(AWTPropertyType = exports.AWTPropertyType || (exports.AWTPropertyType = {}));
/**
 * The AWTPiiKind enumeration contains a set of values that specify the kind of PII (Personal Identifiable Information).
 * @enum {number}
 */
var AWTPiiKind;
(function (AWTPiiKind) {
    /**
     * No kind.
     */
    AWTPiiKind[AWTPiiKind["NotSet"] = 0] = "NotSet";
    /**
     * An LDAP distinguished name. For example, CN=Jeff Smith,OU=Sales,DC=Fabrikam,DC=COM.
     */
    AWTPiiKind[AWTPiiKind["DistinguishedName"] = 1] = "DistinguishedName";
    /**
     * Generic information.
     */
    AWTPiiKind[AWTPiiKind["GenericData"] = 2] = "GenericData";
    /**
     * An IPV4 Internet address. For example, 192.0.2.1.
     */
    AWTPiiKind[AWTPiiKind["IPV4Address"] = 3] = "IPV4Address";
    /**
     * An IPV6 Internet address. For example, 2001:0db8:85a3:0000:0000:8a2e:0370:7334.
     */
    AWTPiiKind[AWTPiiKind["IPv6Address"] = 4] = "IPv6Address";
    /**
     * The Subject of an e-mail message.
     */
    AWTPiiKind[AWTPiiKind["MailSubject"] = 5] = "MailSubject";
    /**
     * A telephone number.
     */
    AWTPiiKind[AWTPiiKind["PhoneNumber"] = 6] = "PhoneNumber";
    /**
     * A query string.
     */
    AWTPiiKind[AWTPiiKind["QueryString"] = 7] = "QueryString";
    /**
     * An SIP (Session Internet Protocol) address.
     */
    AWTPiiKind[AWTPiiKind["SipAddress"] = 8] = "SipAddress";
    /**
     * An e-mail address.
     */
    AWTPiiKind[AWTPiiKind["SmtpAddress"] = 9] = "SmtpAddress";
    /**
     * An user ID.
     */
    AWTPiiKind[AWTPiiKind["Identity"] = 10] = "Identity";
    /**
     * A URI (Uniform Resource Identifier).
     */
    AWTPiiKind[AWTPiiKind["Uri"] = 11] = "Uri";
    /**
     * The fully-qualified domain name.
     */
    AWTPiiKind[AWTPiiKind["Fqdn"] = 12] = "Fqdn";
    /**
     * Scrubs the last octet in a IPV4 Internet address.
     * For example: 10.121.227.147 becomes 10.121.227.*
     */
    AWTPiiKind[AWTPiiKind["IPV4AddressLegacy"] = 13] = "IPV4AddressLegacy";
})(AWTPiiKind = exports.AWTPiiKind || (exports.AWTPiiKind = {}));
/**
 * The AWTCustomerContentKind enumeration contains a set of values that specify the kind of customer content.
 * @enum {number}
 */
var AWTCustomerContentKind;
(function (AWTCustomerContentKind) {
    /**
     * No kind.
     */
    AWTCustomerContentKind[AWTCustomerContentKind["NotSet"] = 0] = "NotSet";
    /**
     * Generic content.
     */
    AWTCustomerContentKind[AWTCustomerContentKind["GenericContent"] = 1] = "GenericContent";
})(AWTCustomerContentKind = exports.AWTCustomerContentKind || (exports.AWTCustomerContentKind = {}));
/**
 * The AWTEventPriority enumeration contains a set of values that specify an event's priority.
 * @enum {number}
 */
var AWTEventPriority;
(function (AWTEventPriority) {
    /**
     * Low priority.
     */
    AWTEventPriority[AWTEventPriority["Low"] = 1] = "Low";
    /**
     * Normal priority.
     */
    AWTEventPriority[AWTEventPriority["Normal"] = 2] = "Normal";
    /**
     * High priority.
     */
    AWTEventPriority[AWTEventPriority["High"] = 3] = "High";
    /**
     * Immediate_sync priority (Events are sent sync immediately).
     */
    AWTEventPriority[AWTEventPriority["Immediate_sync"] = 5] = "Immediate_sync";
})(AWTEventPriority = exports.AWTEventPriority || (exports.AWTEventPriority = {}));
/**
 * The AWTEventsDroppedReason enumeration contains a set of values that specify the reason for dropping an event.
 * @enum {number}
 */
var AWTEventsDroppedReason;
(function (AWTEventsDroppedReason) {
    /**
     * Status set to non-retryable.
     */
    AWTEventsDroppedReason[AWTEventsDroppedReason["NonRetryableStatus"] = 1] = "NonRetryableStatus";
    /**
     * The event queue is full.
     */
    AWTEventsDroppedReason[AWTEventsDroppedReason["QueueFull"] = 3] = "QueueFull";
})(AWTEventsDroppedReason = exports.AWTEventsDroppedReason || (exports.AWTEventsDroppedReason = {}));
/**
 * The AWTEventsRejectedReason enumeration contains a set of values that specify the reason for rejecting an event.
 * @enum {number}
 */
var AWTEventsRejectedReason;
(function (AWTEventsRejectedReason) {
    /**
     * The event is invalid.
     */
    AWTEventsRejectedReason[AWTEventsRejectedReason["InvalidEvent"] = 1] = "InvalidEvent";
    /**
     * The size of the event is too large.
     */
    AWTEventsRejectedReason[AWTEventsRejectedReason["SizeLimitExceeded"] = 2] = "SizeLimitExceeded";
    /**
     * The server is not accepting events from this token.
     */
    AWTEventsRejectedReason[AWTEventsRejectedReason["KillSwitch"] = 3] = "KillSwitch";
})(AWTEventsRejectedReason = exports.AWTEventsRejectedReason || (exports.AWTEventsRejectedReason = {}));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
* Utils.ts
* @author  Brent Erickson (brericks) and Abhilash Panwar (abpanwar)
* @copyright Microsoft 2017
* File containing utility functions.
*/
var microsoft_bond_primitives_1 = __webpack_require__(4);
var Enums_1 = __webpack_require__(0);
var GuidRegex = /[xy]/g;
var MSTillUnixEpoch = 62135596800000;
var MSToTicksMultiplier = 10000;
var NullValue = null;
exports.EventNameAndTypeRegex = /^[a-zA-Z]([a-zA-Z0-9]|_){2,98}[a-zA-Z0-9]$/;
exports.EventNameDotRegex = /\./g;
exports.PropertyNameRegex = /^[a-zA-Z](([a-zA-Z0-9|_|\.]){0,98}[a-zA-Z0-9])?$/;
exports.StatsApiKey = 'a387cfcf60114a43a7699f9fbb49289e-9bceb9fe-1c06-460f-96c5-6a0b247358bc-7238';
var beaconsSupported = NullValue;
var uInt8ArraySupported = NullValue;
var useXDR = NullValue;
/**
 * Converts a number to Bond Int64.
 * @param {number} value - The number to be converted.
 * @return {object} The Int64 value for the passed number.
 */
function numberToBondInt64(value) {
    // Construct bond timestamp for aria
    var bond_value = new microsoft_bond_primitives_1.Int64('0');
    bond_value.low = value & 0xffffffff;
    bond_value.high = Math.floor(value / 0x100000000);
    return bond_value;
}
exports.numberToBondInt64 = numberToBondInt64;
/**
 * Creates a new GUID.
 * @return {string} A GUID.
 */
function newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(GuidRegex, function (c) {
        var r = (Math.random() * 16 | 0), v = (c === 'x' ? r : r & 0x3 | 0x8);
        return v.toString(16);
    });
}
exports.newGuid = newGuid;
/**
 * Checks if the type of value is a string.
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a string, false otherwise.
 */
function isString(value) {
    return typeof value === 'string';
}
exports.isString = isString;
/**
 * Checks if the type of value is a number.
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a number, false otherwise.
 */
function isNumber(value) {
    return typeof value === 'number';
}
exports.isNumber = isNumber;
/**
 * Checks if the type of value is a boolean.
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a boolean, false otherwise.
 */
function isBoolean(value) {
    return typeof value === 'boolean';
}
exports.isBoolean = isBoolean;
/**
 * Check if the type of value is a date.
 * @param {any} value - Value to be checked.
 * @return {boolean} True if the value is a date, false otherwise.
 */
function isDate(value) {
    return value instanceof Date;
}
exports.isDate = isDate;
/**
 * Converts milliseconds to ticks since 00:00:00 Jan 1, 0001.
 * @param {number} msToTicks - The milliseconds value to be converted.
 * @return {number} The value of the milliseconds in .Net Ticks.
 */
function msToTicks(timeInMs) {
    return (timeInMs + MSTillUnixEpoch) * MSToTicksMultiplier;
}
exports.msToTicks = msToTicks;
/**
 * Gets the tenant id from the tenant token.
 * @param {string} apiKey - The token from which the tenant id is to be extracted.
 * @return {string} The tenant id.
 */
function getTenantId(apiKey) {
    var indexTenantId = apiKey.indexOf('-');
    if (indexTenantId > -1) {
        return apiKey.substring(0, indexTenantId);
    }
    return '';
}
exports.getTenantId = getTenantId;
/**
 * Checks if HTML5 Beacons are supported in the current environment.
 * @return {boolean} True if supported, false otherwise.
 */
function isBeaconsSupported() {
    if (beaconsSupported === NullValue) {
        beaconsSupported = typeof navigator !== 'undefined' && Boolean(navigator.sendBeacon);
    }
    return beaconsSupported;
}
exports.isBeaconsSupported = isBeaconsSupported;
/**
 * Checks if Uint8Array are available in the current environment. Safari and Firefox along with
 * ReactNative are known to not support Uint8Array properly.
 * @return {boolean} True if available, false otherwise.
 */
function isUint8ArrayAvailable() {
    if (uInt8ArraySupported === NullValue) {
        uInt8ArraySupported = typeof Uint8Array !== 'undefined' && !isSafariOrFirefox() && !isReactNative();
    }
    return uInt8ArraySupported;
}
exports.isUint8ArrayAvailable = isUint8ArrayAvailable;
/**
 * Checks if the value is an AWTEventPriority.
 * @param {enum} value - The value that needs to be checked.
 * @return {boolean} True if the value is in AWTEventPriority, false otherwise.
 */
function isPriority(value) {
    if (isNumber(value) && ((value >= 1 && value <= 3) || value === 5)) {
        return true;
    }
    return false;
}
exports.isPriority = isPriority;
/**
 * Sanitizes the Property. It checks the that the property name and value are valid. It also
 * checks/populates the correct type and pii of the property value.
 * @param {string} name                                - The property name.
 * @param {string|number|boolean|Date|object} property - The property value or an AWTEventProperty containing value,
 * type ,pii and customer content.
 * @return {object} AWTEventProperty containing valid name, value, pii and type or null if invalid.
 */
function sanitizeProperty(name, property) {
    //Check that property is valid
    if (!exports.PropertyNameRegex.test(name) || isNotDefined(property)) {
        return NullValue;
    }
    //Check if type is AWTEventProperty. If not convert to AWTEventProperty
    if (isNotDefined(property.value)) {
        property = { value: property, type: Enums_1.AWTPropertyType.Unspecified };
    }
    property.type = sanitizePropertyType(property.value, property.type);
    if (!property.type) {
        return NullValue;
    }
    //If value is date. Then convert to number in Ticks.
    if (isDate(property.value)) {
        property.value = msToTicks(property.value.getTime());
    }
    //Ensure that only one of pii or customer content can be set
    if (property.pii > 0 && property.cc > 0) {
        return NullValue;
    }
    //If pii is set we need to validate its enum value.
    if (property.pii) {
        return isPii(property.pii) ? property : NullValue;
    }
    //If cc is set we need to validate its enum value.
    if (property.cc) {
        return isCustomerContent(property.cc) ? property : NullValue;
    }
    return property;
}
exports.sanitizeProperty = sanitizeProperty;
/**
 * Converts a date object into an ISO string. This is needed because not all browsers support ISO string format
 * on the date.
 * @param {object} date - The date which needs to be converted to ISO format.
 * @return {string} The date in ISO format.
 */
function getISOString(date) {
    return date.getUTCFullYear() + '-' +
        twoDigit(date.getUTCMonth() + 1) + '-' +
        twoDigit(date.getUTCDate()) + 'T' +
        twoDigit(date.getUTCHours()) + ':' +
        twoDigit(date.getUTCMinutes()) + ':' +
        twoDigit(date.getUTCSeconds()) + '.' +
        threeDigit(date.getUTCMilliseconds()) + 'Z';
}
exports.getISOString = getISOString;
function useXDomainRequest() {
    if (useXDR === NullValue) {
        var conn = new XMLHttpRequest();
        if (typeof conn.withCredentials === 'undefined' &&
            typeof XDomainRequest !== 'undefined') {
            useXDR = true;
        }
        else {
            useXDR = false;
        }
    }
    return useXDR;
}
exports.useXDomainRequest = useXDomainRequest;
function isReactNative() {
    // If running in React Native, navigator.product will be populated
    if (typeof navigator !== 'undefined' && navigator.product) {
        return navigator.product === 'ReactNative';
    }
    return false;
}
exports.isReactNative = isReactNative;
function twoDigit(n) {
    // Format integers to have at least two digits.
    return n < 10 ? '0' + n : n.toString();
}
function threeDigit(n) {
    // Format integers to have at least three digits.
    if (n < 10) {
        return '00' + n;
    }
    else if (n < 100) {
        return '0' + n;
    }
    return n.toString();
}
function sanitizePropertyType(value, type) {
    type = !isPropertyType(type) ? Enums_1.AWTPropertyType.Unspecified : type;
    switch (type) {
        case Enums_1.AWTPropertyType.Unspecified:
            return getCorrectType(value);
        case Enums_1.AWTPropertyType.String:
            return isString(value) ? type : NullValue;
        case Enums_1.AWTPropertyType.Boolean:
            return isBoolean(value) ? type : NullValue;
        case Enums_1.AWTPropertyType.Date:
            return isDate(value) && value.getTime() !== NaN ? type : NullValue;
        case Enums_1.AWTPropertyType.Int64:
            return isNumber(value) && value % 1 === 0 ? type : NullValue;
        case Enums_1.AWTPropertyType.Double:
            return isNumber(value) ? type : NullValue;
    }
    return NullValue;
}
function getCorrectType(value) {
    switch (typeof value) {
        case 'string':
            return Enums_1.AWTPropertyType.String;
        case 'boolean':
            return Enums_1.AWTPropertyType.Boolean;
        case 'number':
            return Enums_1.AWTPropertyType.Double;
        case 'object':
            return isDate(value) ? Enums_1.AWTPropertyType.Date : NullValue;
    }
    return NullValue;
}
function isPii(value) {
    if (isNumber(value) && value >= 0 && value <= 13) {
        return true;
    }
    return false;
}
function isCustomerContent(value) {
    if (isNumber(value) && value >= 0 && value <= 1) {
        return true;
    }
    return false;
}
function isPropertyType(value) {
    if (isNumber(value) && value >= 0 && value <= 4) {
        return true;
    }
    return false;
}
function isSafariOrFirefox() {
    // If non-browser navigator will be undefined
    if (typeof navigator !== 'undefined' && navigator.userAgent) {
        var ua = navigator.userAgent.toLowerCase();
        if ((ua.indexOf('safari') >= 0 || ua.indexOf('firefox') >= 0) && ua.indexOf('chrome') < 0) {
            return true;
        }
    }
    return false;
}
function isNotDefined(value) {
    return value === undefined || value === NullValue || value === '';
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Class to manage sending notifications to all the listeners.
 */
var AWTNotificationManager = /** @class */ (function () {
    function AWTNotificationManager() {
    }
    /**
     * Adds a notification listener.
     * @param {object} listener - The notification listener to be added.
     */
    AWTNotificationManager.addNotificationListener = function (listener) {
        this.listeners.push(listener);
    };
    /**
     * Removes all instances of the listener.
     * @param {object} listener - AWTNotificationListener to remove.
     */
    AWTNotificationManager.removeNotificationListener = function (listener) {
        var index = this.listeners.indexOf(listener);
        while (index > -1) {
            this.listeners.splice(index, 1);
            index = this.listeners.indexOf(listener);
        }
    };
    /**
     * Notification for events sent.
     * @param {object[]} events - The array of events that have been sent.
     */
    AWTNotificationManager.eventsSent = function (events) {
        var _this = this;
        var _loop_1 = function (i) {
            if (this_1.listeners[i].eventsSent) {
                setTimeout(function () { return _this.listeners[i].eventsSent(events); }, 0);
            }
        };
        var this_1 = this;
        for (var i = 0; i < this.listeners.length; ++i) {
            _loop_1(i);
        }
    };
    /**
     * Notification for events being dropped.
     * @param {object[]} events - The array of events that have been dropped.
     * @param {enum} reason     - The reason for which the SDK dropped the events.
     */
    AWTNotificationManager.eventsDropped = function (events, reason) {
        var _this = this;
        var _loop_2 = function (i) {
            if (this_2.listeners[i].eventsDropped) {
                setTimeout(function () { return _this.listeners[i].eventsDropped(events, reason); }, 0);
            }
        };
        var this_2 = this;
        for (var i = 0; i < this.listeners.length; ++i) {
            _loop_2(i);
        }
    };
    /**
     * Notification for events being retried when the request failed with a retryable status.
     * @param {object[]} events - The array of events that are being retried.
     */
    AWTNotificationManager.eventsRetrying = function (events) {
        var _this = this;
        var _loop_3 = function (i) {
            if (this_3.listeners[i].eventsRetrying) {
                setTimeout(function () { return _this.listeners[i].eventsRetrying(events); }, 0);
            }
        };
        var this_3 = this;
        for (var i = 0; i < this.listeners.length; ++i) {
            _loop_3(i);
        }
    };
    /**
     * Notification for events being rejected.
     * @param {object[]} events - The array of events that have been rejected.
     * @param {enum} reason     - The reason for which the SDK rejeceted the events.
     */
    AWTNotificationManager.eventsRejected = function (events, reason) {
        var _this = this;
        var _loop_4 = function (i) {
            if (this_4.listeners[i].eventsRejected) {
                setTimeout(function () { return _this.listeners[i].eventsRejected(events, reason); }, 0);
            }
        };
        var this_4 = this;
        for (var i = 0; i < this.listeners.length; ++i) {
            _loop_4(i);
        }
    };
    AWTNotificationManager.listeners = [];
    return AWTNotificationManager;
}());
exports.default = AWTNotificationManager;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
* AWTTransmissionManagerCore.ts
* @author Abhilash Panwar (abpanwar)
* @copyright Microsoft 2017
*/
var DataModels_1 = __webpack_require__(14);
var Enums_1 = __webpack_require__(0);
var AWTQueueManager_1 = __webpack_require__(28);
var AWTStatsManager_1 = __webpack_require__(10);
var AWTEventProperties_1 = __webpack_require__(5);
var AWTLogManager_1 = __webpack_require__(11);
var Utils = __webpack_require__(1);
var MaxBackoffCount = 4;
var MinDurationBetweenUploadNow = 30000; //30 sec
var StatName = 'awt_stats';
/**
 * Class that manages the timers for when to send events. It also
 * handles flush and flushAndTeardown. This class also allows setting
 * new event handlers. The default event handler is the Inbound Queue Manager.
 */
var AWTTransmissionManagerCore = /** @class */ (function () {
    function AWTTransmissionManagerCore() {
    }
    /**
     * Sets the event handler to be used by the tranmission manager.
     * The default event handler is the Inbound queue manager. This handler
     * is used to batch and send events to Aria. If you intend to send events
     * to Aria please make sure your event handler forwards events to the Inbound
     * Queue Manager. You can retrieve the Inbound Queue Manager by calling
     * getEventsHandler before you set your handler.
     * @param {object} eventsHandler - The new events handler to be used by the tranmission
     * manager.
     */
    AWTTransmissionManagerCore.setEventsHandler = function (eventsHandler) {
        this._eventHandler = eventsHandler;
    };
    /**
     * Gets the current event handler used by the tranmission manager.
     * @return {object} The event handler currently used by the tranmission manager.
     */
    AWTTransmissionManagerCore.getEventsHandler = function () {
        return this._eventHandler;
    };
    /**
     * Try to schedule the timer after which events will be sent. If there are
     * no events to be sent, or there is already a timer scheduled, or the
     * http manager doesn't have any idle connections this method is no-op.
     */
    AWTTransmissionManagerCore.scheduleTimer = function () {
        var _this = this;
        var timer = this._profiles[this._currentProfile][2];
        if (this._timeout < 0 && timer >= 0 && !this._paused) {
            if (this._eventHandler.hasEvents()) {
                //If the transmission is backed off make the timer atleast 1 sec to allow for backoff.
                if (timer === 0 && this._currentBackoffCount > 0) {
                    timer = 1;
                }
                this._timeout = setTimeout(function () { return _this._batchAndSendEvents(); }, timer * (1 << this._currentBackoffCount) * 1000);
            }
            else {
                this._timerCount = 0;
            }
        }
    };
    /**
     * Initialize the transmission manager. After this method is called events are
     * accepted for tranmission.
     * @param {object} config - The configuration passed during AWTLogManager initialize.
     */
    AWTTransmissionManagerCore.initialize = function (config) {
        var _this = this;
        this._newEventsAllowed = true;
        this._config = config;
        this._eventHandler = new AWTQueueManager_1.default(config.collectorUri, config.cacheMemorySizeLimitInNumberOfEvents, config.httpXHROverride, config.clockSkewRefreshDurationInMins);
        this._initializeProfiles();
        AWTStatsManager_1.default.initialize(function (stats, tenantId) {
            if (_this._config.canSendStatEvent(StatName)) {
                var event_1 = new AWTEventProperties_1.default(StatName);
                event_1.setEventPriority(Enums_1.AWTEventPriority.High);
                event_1.setProperty('TenantId', tenantId);
                for (var statKey in stats) {
                    if (stats.hasOwnProperty(statKey)) {
                        event_1.setProperty(statKey, stats[statKey].toString());
                    }
                }
                AWTLogManager_1.default.getLogger(Utils.StatsApiKey).logEvent(event_1);
            }
        });
    };
    /**
     * Set the transmit profile to be used. This will change the tranmission timers
     * based on the transmit profile.
     * @param {string} profileName - The name of the transmit profile to be used.
     */
    AWTTransmissionManagerCore.setTransmitProfile = function (profileName) {
        if (this._currentProfile !== profileName && this._profiles[profileName] !== undefined) {
            this.clearTimeout();
            this._currentProfile = profileName;
            this.scheduleTimer();
        }
    };
    /**
     * Load custom tranmission profiles. Each profile should have timers for
     * high, normal and low.  Each profile should make sure
     * that a each priority timer is a multiple of the priority higher than it.
     * Setting the timer value to -1 means that the events for that priority will
     * not be sent. Note that once a priority has been set to not send, all priorities
     * below it will also not be sent. The timers should be in the form of [low, normal, high].
     * e.g Custom: [30,10,5]
     * This also removes any previously loaded custom profiles.
     * @param {object} profiles - A dictionary containing the transmit profiles.
     */
    AWTTransmissionManagerCore.loadTransmitProfiles = function (profiles) {
        this._resetTransmitProfiles();
        for (var profileName in profiles) {
            if (profiles.hasOwnProperty(profileName)) {
                if (profiles[profileName].length !== 3) {
                    continue;
                }
                //Make sure if a higher priority is set to not send then dont send lower priority
                for (var i = 2; i >= 0; --i) {
                    if (profiles[profileName][i] < 0) {
                        for (var j = i; j >= 0; --j) {
                            profiles[profileName][j] = -1;
                        }
                        break;
                    }
                }
                //Make sure each priority is multiple of the priority higher then it. If not a multiple
                //we round up so that it becomes a multiple.
                for (var i = 2; i > 0; --i) {
                    if (profiles[profileName][i] > 0 && profiles[profileName][i - 1] > 0) {
                        var timerMultiplier = profiles[profileName][i - 1] / profiles[profileName][i];
                        profiles[profileName][i - 1] = Math.ceil(timerMultiplier) * profiles[profileName][i];
                    }
                }
                this._profiles[profileName] = profiles[profileName];
            }
        }
    };
    /**
     * Pass the event to the event handler and try to schedule the timer.
     * @param {object} event - The event to be sent.
     */
    AWTTransmissionManagerCore.sendEvent = function (event) {
        if (this._newEventsAllowed) {
            //If the transmission is backed off then do not send synchronous events.
            //We will convert these events to High priority instead.
            if (this._currentBackoffCount > 0 && event.priority === Enums_1.AWTEventPriority.Immediate_sync) {
                event.priority = Enums_1.AWTEventPriority.High;
            }
            this._eventHandler.addEvent(event);
            this.scheduleTimer();
        }
    };
    /**
     * Sends events for all priority for the current inbound queue.
     * This method adds new inbound queues to which new events will be added.
     * Note: If LogManager is paused or flush is called again in less than 30 sec
     * then flush will be no-op and the callback will not be called.
     * @param {function} callback - The function to be called when flush is finished.
     */
    AWTTransmissionManagerCore.flush = function (callback) {
        var currentTime = (new Date()).getTime();
        if (!this._paused && this._lastUploadNowCall + MinDurationBetweenUploadNow < currentTime) {
            this._lastUploadNowCall = currentTime;
            if (this._timeout > -1) {
                clearTimeout(this._timeout);
                this._timeout = -1;
            }
            this._eventHandler.uploadNow(callback);
        }
    };
    /**
     * Pauses transmission. It pauses the http manager and also clears timers.
     */
    AWTTransmissionManagerCore.pauseTransmission = function () {
        if (!this._paused) {
            this.clearTimeout();
            this._eventHandler.pauseTransmission();
            this._paused = true;
        }
    };
    /**
     * Resumes tranmission. It resumes the http manager and tries to schedule the timer.
     */
    AWTTransmissionManagerCore.resumeTransmision = function () {
        if (this._paused) {
            this._paused = false;
            this._eventHandler.resumeTransmission();
            this.scheduleTimer();
        }
    };
    /**
     * Stops allowing new events being added for tranmission. It also batches all
     * events currently in the queue and creates requests from them to be sent.
     */
    AWTTransmissionManagerCore.flushAndTeardown = function () {
        AWTStatsManager_1.default.teardown();
        this._newEventsAllowed = false;
        this.clearTimeout();
        //No op if offline storage is added
        this._eventHandler.teardown();
    };
    /**
     * Backs off tranmission. This exponentially increases all the timers.
     */
    AWTTransmissionManagerCore.backOffTransmission = function () {
        if (this._currentBackoffCount < MaxBackoffCount) {
            this._currentBackoffCount++;
            this.clearTimeout();
            this.scheduleTimer();
        }
    };
    /**
     * Clears backoff for tranmission.
     */
    AWTTransmissionManagerCore.clearBackOff = function () {
        if (this._currentBackoffCount > 0) {
            this._currentBackoffCount = 0;
            this.clearTimeout();
            this.scheduleTimer();
        }
    };
    /**
     * Resets the transmit profiles to the default profiles of Real Time, Near Real Time
     * and Best Effort. This removes all the custom profiles that were loaded.
     */
    AWTTransmissionManagerCore._resetTransmitProfiles = function () {
        this.clearTimeout();
        this._initializeProfiles();
        this._currentProfile = DataModels_1.AWT_REAL_TIME;
        this.scheduleTimer();
    };
    AWTTransmissionManagerCore.clearTimeout = function () {
        if (this._timeout > 0) {
            clearTimeout(this._timeout);
            this._timeout = -1;
            this._timerCount = 0;
        }
    };
    AWTTransmissionManagerCore._batchAndSendEvents = function () {
        var priority = Enums_1.AWTEventPriority.High;
        this._timerCount++;
        if (this._timerCount * this._profiles[this._currentProfile][2] === this._profiles[this._currentProfile][0]) {
            priority = Enums_1.AWTEventPriority.Low;
            this._timerCount = 0;
        }
        else if (this._timerCount * this._profiles[this._currentProfile][2] === this._profiles[this._currentProfile][1]) {
            priority = Enums_1.AWTEventPriority.Normal;
        }
        this._eventHandler.sendEventsForPriorityAndAbove(priority);
        this._timeout = -1;
        this.scheduleTimer();
    };
    AWTTransmissionManagerCore._initializeProfiles = function () {
        this._profiles = {};
        this._profiles[DataModels_1.AWT_REAL_TIME] = [4, 2, 1];
        this._profiles[DataModels_1.AWT_NEAR_REAL_TIME] = [12, 6, 3];
        this._profiles[DataModels_1.AWT_BEST_EFFORT] = [36, 18, 9];
    };
    AWTTransmissionManagerCore._newEventsAllowed = false;
    AWTTransmissionManagerCore._currentProfile = DataModels_1.AWT_REAL_TIME;
    AWTTransmissionManagerCore._timeout = -1;
    AWTTransmissionManagerCore._currentBackoffCount = 0;
    AWTTransmissionManagerCore._paused = false;
    AWTTransmissionManagerCore._timerCount = 0;
    AWTTransmissionManagerCore._lastUploadNowCall = 0;
    return AWTTransmissionManagerCore;
}());
exports.default = AWTTransmissionManagerCore;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* microsoft.bond.primitives.ts
* Copyright: Microsoft 2016
*/
Object.defineProperty(exports, "__esModule", { value: true });
var Int64 = /** @class */ (function () {
    function Int64(numberStr) {
        this.low = 0;
        this.high = 0;
        this.low = parseInt(numberStr, 10);
        if (this.low < 0) {
            this.high = -1;
        }
    }
    Int64.prototype._Equals = function (numberStr) {
        var tmp = new Int64(numberStr);
        return this.low === tmp.low && this.high === tmp.high;
    };
    return Int64;
}());
exports.Int64 = Int64;
var UInt64 = /** @class */ (function () {
    function UInt64(numberStr) {
        this.low = 0;
        this.high = 0;
        this.low = parseInt(numberStr, 10);
    }
    UInt64.prototype._Equals = function (numberStr) {
        var tmp = new UInt64(numberStr);
        return this.low === tmp.low && this.high === tmp.high;
    };
    return UInt64;
}());
exports.UInt64 = UInt64;
var Number = /** @class */ (function () {
    function Number() {
    }
    Number._ToByte = function (value) {
        return this._ToUInt8(value);
    };
    Number._ToUInt8 = function (value) {
        return value & 0xff;
    };
    Number._ToInt32 = function (value) {
        var signMask = (value & 0x80000000);
        return (value & 0x7fffffff) | signMask;
    };
    Number._ToUInt32 = function (value) {
        return value & 0xffffffff;
    };
    return Number;
}());
exports.Number = Number;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
* AWTEventProperties.ts
* @author Abhilash Panwar (abpanwar)
* @copyright Microsoft 2018
*/
var Utils = __webpack_require__(1);
var Enums_1 = __webpack_require__(0);
/**
* The AWTEventProperties class is used for creating an event.
*/
var AWTEventProperties = /** @class */ (function () {
    /**
     * The AWTEventProperties class constructor.
     * @constructor
     * @param {string} - [Optional] The name of the event.
     */
    function AWTEventProperties(name) {
        this._event = { name: '', properties: {} };
        if (name) {
            this.setName(name);
        }
    }
    /**
     * Sets the name of the event.
     * @param {string} name - The name of the event.
     */
    AWTEventProperties.prototype.setName = function (name) {
        this._event.name = name;
    };
    /**
     * Gets the name of the event.
     * @return {string|undefined} - The name of the event, or undefined if the name has not been set.
     */
    AWTEventProperties.prototype.getName = function () {
        return this._event.name;
    };
    /**
     * Sets the base type of the event.
     * @param {string} type - The base type of the event.
     */
    AWTEventProperties.prototype.setType = function (type) {
        this._event.type = type;
    };
    /**
     * Gets the base type of the event.
     * @return {string|undefined} The base type of the event, or undefined if the base type has not been set.
     */
    AWTEventProperties.prototype.getType = function () {
        return this._event.type;
    };
    /**
     * Sets the timestamp for the event.
     * @param {number} timestampInEpochMillis - The timestamp (in milliseconds) since UNIX Epoch.
     */
    AWTEventProperties.prototype.setTimestamp = function (timestampInEpochMillis) {
        this._event.timestamp = timestampInEpochMillis;
    };
    /**
     * Gets the timestamp for the event.
     * @return {number|undefined} The timestamp for the event, or undefined if it has not been set.
     */
    AWTEventProperties.prototype.getTimestamp = function () {
        return this._event.timestamp;
    };
    /**
     * Sets the priority for sending the event. The default priority
     * of the event is Normal.
     * @param {enum} priority - An AWTEventPriority enumeration value that specifies the priority of the event.
     */
    AWTEventProperties.prototype.setEventPriority = function (priority) {
        this._event.priority = priority;
    };
    /**
     * Gets the priority for the event.
     * @return {AWTEventPriority} - An AWTEventPriority enumeration value that specifies the priority of the event.
     */
    AWTEventProperties.prototype.getEventPriority = function () {
        return this._event.priority;
    };
    /**
     * Sets a property with a name and value. Optionally sets the property type.
     * @param {string} name                      - The name of the property.
     * @param {string|number|boolean|Date} value - The property's value.
     * @param {enum} type                        - [Optional] One of the AWTPropertyType enumeration values that specifies
     * the type for the property.
     */
    AWTEventProperties.prototype.setProperty = function (name, value, type) {
        if (type === void 0) { type = Enums_1.AWTPropertyType.Unspecified; }
        var property = { value: value, type: type, pii: Enums_1.AWTPiiKind.NotSet, cc: Enums_1.AWTCustomerContentKind.NotSet };
        property = Utils.sanitizeProperty(name, property);
        if (property === null) {
            delete this._event.properties[name];
            return;
        }
        this._event.properties[name] = property;
    };
    /**
     * Sets a property with a name, a value, and a PII. Optionally sets the property type.
     * @param {string} name                      - The name of the property.
     * @param {string|number|boolean|Date} value - The property's value.
     * @param {enum} pii                         - The kind of PII for the property.
     * @param {enum} type                        - [Optional] One of the AWTPropertyType enumeration values that specifies
     * the type for the property.
     */
    AWTEventProperties.prototype.setPropertyWithPii = function (name, value, pii, type) {
        if (type === void 0) { type = Enums_1.AWTPropertyType.Unspecified; }
        var property = { value: value, type: type, pii: pii, cc: Enums_1.AWTCustomerContentKind.NotSet };
        property = Utils.sanitizeProperty(name, property);
        if (property === null) {
            delete this._event.properties[name];
            return;
        }
        this._event.properties[name] = property;
    };
    /**
     * Sets a property with name, value and customer content. Optionally set the property type of the value.
     * @param {string} name                      - The name of the property.
     * @param {string|number|boolean|Date} value - The property's value.
     * @param {enum} customerContent             - The customer content kind for the property.
     * @param {enum} type                        - [Optional] One of the AWTPropertyType enumeration values that specifies
     * the type for the property.
     */
    AWTEventProperties.prototype.setPropertyWithCustomerContent = function (name, value, customerContent, type) {
        if (type === void 0) { type = Enums_1.AWTPropertyType.Unspecified; }
        var property = { value: value, type: type, pii: Enums_1.AWTPiiKind.NotSet, cc: customerContent };
        property = Utils.sanitizeProperty(name, property);
        if (property === null) {
            delete this._event.properties[name];
            return;
        }
        this._event.properties[name] = property;
    };
    /**
     * Gets the properties currently added to the event.
     * @return {object} A Map<string, AWTEventProperty> containing the current properties.
     */
    AWTEventProperties.prototype.getPropertyMap = function () {
        return this._event.properties;
    };
    /**
     * Gets the event from this event properties object.
     * @return {object} The event properties compiled into AWTEventData.
     */
    AWTEventProperties.prototype.getEvent = function () {
        return this._event;
    };
    return AWTEventProperties;
}());
exports.default = AWTEventProperties;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
* Enums.ts
* @author Abhilash Panwar (abpanwar)
* @copyright Microsoft 2017
* File containing the enums.
*/
/**
 * The AWTUserIdType enumeration contains a set of values that specify the type of user ID.
 * @enum {number}
 */
var AWTUserIdType;
(function (AWTUserIdType) {
    /**
     * The user ID type is unknown.
     */
    AWTUserIdType[AWTUserIdType["Unknown"] = 0] = "Unknown";
    /**
     * Microsoft Account ID.
     */
    AWTUserIdType[AWTUserIdType["MSACID"] = 1] = "MSACID";
    /**
     * Microsoft .NET Passport Unique ID.
     */
    AWTUserIdType[AWTUserIdType["MSAPUID"] = 2] = "MSAPUID";
    /**
     * Anonymous user ID.
     */
    AWTUserIdType[AWTUserIdType["ANID"] = 3] = "ANID";
    /**
     * Organization customer ID.
     */
    AWTUserIdType[AWTUserIdType["OrgIdCID"] = 4] = "OrgIdCID";
    /**
     * Microsoft Exchange Passport ID.
     */
    AWTUserIdType[AWTUserIdType["OrgIdPUID"] = 5] = "OrgIdPUID";
    /**
     * User object ID.
     */
    AWTUserIdType[AWTUserIdType["UserObjectId"] = 6] = "UserObjectId";
    /**
     * Skype ID.
     */
    AWTUserIdType[AWTUserIdType["Skype"] = 7] = "Skype";
    /**
     * Yammer ID.
     */
    AWTUserIdType[AWTUserIdType["Yammer"] = 8] = "Yammer";
    /**
     * E-mail address.
     */
    AWTUserIdType[AWTUserIdType["EmailAddress"] = 9] = "EmailAddress";
    /**
     * Telephone number.
     */
    AWTUserIdType[AWTUserIdType["PhoneNumber"] = 10] = "PhoneNumber";
    /**
     * SIP address.
     */
    AWTUserIdType[AWTUserIdType["SipAddress"] = 11] = "SipAddress";
    /**
     * Multiple unit identity.
     */
    AWTUserIdType[AWTUserIdType["MUID"] = 12] = "MUID";
})(AWTUserIdType = exports.AWTUserIdType || (exports.AWTUserIdType = {}));
/**
 * The AWTSessionState enumeration contains a set of values that indicate the session state.
 * @enum {number}
 */
var AWTSessionState;
(function (AWTSessionState) {
    /**
     * Session started.
     */
    AWTSessionState[AWTSessionState["Started"] = 0] = "Started";
    /**
     * Session ended.
     */
    AWTSessionState[AWTSessionState["Ended"] = 1] = "Ended";
})(AWTSessionState = exports.AWTSessionState || (exports.AWTSessionState = {}));


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
* AWTAutoCollection.ts
* @author Abhilash Panwar (abpanwar)
* @copyright Microsoft 2018
*/
var Utils = __webpack_require__(1);
var DEVICE_ID_COOKIE = 'MicrosoftApplicationsTelemetryDeviceId';
var FIRSTLAUNCHTIME_COOKIE = 'MicrosoftApplicationsTelemetryFirstLaunchTime';
var BROWSERS = {
    MSIE: 'MSIE',
    CHROME: 'Chrome',
    FIREFOX: 'Firefox',
    SAFARI: 'Safari',
    EDGE: 'Edge',
    ELECTRON: 'Electron',
    SKYPE_SHELL: 'SkypeShell',
    PHANTOMJS: 'PhantomJS',
    OPERA: 'Opera'
};
var OPERATING_SYSTEMS = {
    WINDOWS: 'Windows',
    MACOSX: 'Mac OS X',
    WINDOWS_PHONE: 'Windows Phone',
    WINDOWS_RT: 'Windows RT',
    IOS: 'iOS',
    ANDROID: 'Android',
    LINUX: 'Linux',
    CROS: 'Chrome OS',
    UNKNOWN: 'Unknown'
};
var OSNAMEREGEX = {
    WIN: /(windows|win32)/i,
    WINRT: / arm;/i,
    WINPHONE: /windows\sphone\s\d+\.\d+/i,
    OSX: /(macintosh|mac os x)/i,
    IOS: /(iPad|iPhone|iPod)(?=.*like Mac OS X)/i,
    LINUX: /(linux|joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk)/i,
    ANDROID: /android/i,
    CROS: /CrOS/i
};
var VERSION_MAPPINGS = {
    '5.1': 'XP',
    '6.0': 'Vista',
    '6.1': '7',
    '6.2': '8',
    '6.3': '8.1',
    '10.0': '10'
};
var REGEX_VERSION = '([\\d,.]+)';
var REGEX_VERSION_MAC = '([\\d,_,.]+)';
var UNKNOWN = 'Unknown';
var UNDEFINED = 'undefined';
/**
 * Class that stores semantic properties.
 */
var AWTAutoCollection = /** @class */ (function () {
    function AWTAutoCollection() {
    }
    /**
     * Add a property storage override to override the usage of document.cookie to store
     * properties. The property storage object should implement both getProperty and setProperty, otherwise
     * it will be rejected.
     * @param {object} propertyStorage - Property storage object which is used for storing SDK properties.
     * @return {boolean} True if the property storage override was accepted, false otherwise.
     */
    AWTAutoCollection.addPropertyStorageOverride = function (propertyStorage) {
        if (propertyStorage) {
            this._propertyStorage = propertyStorage;
            return true;
        }
        return false;
    };
    /**
     * Auto collect semantic context properties.
     * @param {object} semantContext   - The semantic context to use to set auto collected information.
     * @param {boolean} disableCookies - Determines if setting cookies is disabled.
     * @param {object} userAgent       - UserAgent string to be used for auto collection of semantic properties.
     */
    AWTAutoCollection.autoCollect = function (semanticContext, disableCookies, userAgent) {
        this._semanticContext = semanticContext;
        this._disableCookies = disableCookies;
        this._autoCollect();
        if (!userAgent && typeof navigator !== UNDEFINED) {
            userAgent = navigator.userAgent || '';
        }
        this._autoCollectFromUserAgent(userAgent);
        if (this._disableCookies && !this._propertyStorage) {
            this._deleteCookie(DEVICE_ID_COOKIE);
            this._deleteCookie(FIRSTLAUNCHTIME_COOKIE);
            return;
        }
        //Only collect device id if it can be stored
        if (this._propertyStorage || (this._areCookiesAvailable && !this._disableCookies)) {
            this._autoCollectDeviceId();
        }
    };
    /**
     * Checks if the device id stored is the same as the new device id. If they are not,
     * store the new id and store a new first launch time.
     * @param {string} deviceId - The new device id.
     */
    AWTAutoCollection.checkAndSaveDeviceId = function (deviceId) {
        if (deviceId) {
            var oldDeviceId = this._getData(DEVICE_ID_COOKIE);
            var flt = this._getData(FIRSTLAUNCHTIME_COOKIE);
            if (oldDeviceId !== deviceId) {
                flt = Utils.getISOString(new Date());
            }
            this._saveData(DEVICE_ID_COOKIE, deviceId);
            this._saveData(FIRSTLAUNCHTIME_COOKIE, flt);
            this._setFirstLaunchTime(flt);
        }
    };
    /**
     * Auto collect the device SDK Id.
     */
    AWTAutoCollection._autoCollectDeviceId = function () {
        var deviceId = this._getData(DEVICE_ID_COOKIE);
        if (!deviceId) {
            deviceId = Utils.newGuid();
        }
        this._semanticContext.setDeviceId(deviceId);
    };
    AWTAutoCollection._autoCollect = function () {
        //Get app language
        if (typeof document !== UNDEFINED && document.documentElement) {
            this._semanticContext.setAppLanguage(document.documentElement.lang);
        }
        //Get user language
        if (typeof navigator !== UNDEFINED) {
            this._semanticContext.setUserLanguage(navigator.userLanguage || navigator.language);
        }
        //Get time zone
        var timeZone = new Date().getTimezoneOffset();
        var minutes = timeZone % 60;
        var hours = (timeZone - minutes) / 60;
        var timeZonePrefix = '+';
        if (hours > 0) {
            timeZonePrefix = '-';
        }
        hours = Math.abs(hours);
        minutes = Math.abs(minutes);
        this._semanticContext.setUserTimeZone(timeZonePrefix + (hours < 10 ? '0' + hours : hours.toString()) + ':'
            + (minutes < 10 ? '0' + minutes : minutes.toString()));
    };
    AWTAutoCollection._autoCollectFromUserAgent = function (userAgent) {
        if (userAgent) {
            var browserName = this._getBrowserName(userAgent);
            this._semanticContext.setDeviceBrowserName(browserName);
            this._semanticContext.setDeviceBrowserVersion(this._getBrowserVersion(userAgent, browserName));
            var osName = this._getOsName(userAgent);
            this._semanticContext.setDeviceOsName(osName);
            this._semanticContext.setDeviceOsVersion(this._getOsVersion(userAgent, osName));
        }
    };
    AWTAutoCollection._getBrowserName = function (userAgent) {
        //Check for Opera first        
        if (this._userAgentContainsString('OPR/', userAgent)) {
            return BROWSERS.OPERA;
        }
        //Check for Phantom JS
        if (this._userAgentContainsString(BROWSERS.PHANTOMJS, userAgent)) {
            return BROWSERS.PHANTOMJS;
        }
        //Check for Edge
        if (this._userAgentContainsString(BROWSERS.EDGE, userAgent)) {
            return BROWSERS.EDGE;
        }
        //Check for Electron
        if (this._userAgentContainsString(BROWSERS.ELECTRON, userAgent)) {
            return BROWSERS.ELECTRON;
        }
        //Check for Chrome
        if (this._userAgentContainsString(BROWSERS.CHROME, userAgent)) {
            return BROWSERS.CHROME;
        }
        //Check for Internet Explorer
        if (this._userAgentContainsString('Trident', userAgent)) {
            return BROWSERS.MSIE;
        }
        //Check for Firefox
        if (this._userAgentContainsString(BROWSERS.FIREFOX, userAgent)) {
            return BROWSERS.FIREFOX;
        }
        //Check for Safari
        if (this._userAgentContainsString(BROWSERS.SAFARI, userAgent)) {
            return BROWSERS.SAFARI;
        }
        //Check for Skype shell
        if (this._userAgentContainsString(BROWSERS.SKYPE_SHELL, userAgent)) {
            return BROWSERS.SKYPE_SHELL;
        }
        return UNKNOWN;
    };
    AWTAutoCollection._setFirstLaunchTime = function (flt) {
        if (!isNaN(flt)) {
            var fltDate = new Date();
            fltDate.setTime(parseInt(flt, 10));
            flt = Utils.getISOString(fltDate);
        }
        this.firstLaunchTime = flt;
    };
    AWTAutoCollection._userAgentContainsString = function (searchString, userAgent) {
        return userAgent.indexOf(searchString) > -1;
    };
    AWTAutoCollection._getBrowserVersion = function (userAgent, browserName) {
        if (browserName === BROWSERS.MSIE) {
            return this._getIeVersion(userAgent);
        }
        else {
            return this._getOtherVersion(browserName, userAgent);
        }
    };
    AWTAutoCollection._getIeVersion = function (userAgent) {
        var classicIeVersionMatches = userAgent.match(new RegExp(BROWSERS.MSIE + ' ' + REGEX_VERSION));
        if (classicIeVersionMatches) {
            return classicIeVersionMatches[1];
        }
        else {
            var ieVersionMatches = userAgent.match(new RegExp('rv:' + REGEX_VERSION));
            if (ieVersionMatches) {
                return ieVersionMatches[1];
            }
        }
    };
    AWTAutoCollection._getOtherVersion = function (browserString, userAgent) {
        if (browserString === BROWSERS.SAFARI) {
            browserString = 'Version';
        }
        var matches = userAgent.match(new RegExp(browserString + '/' + REGEX_VERSION));
        if (matches) {
            return matches[1];
        }
        return UNKNOWN;
    };
    AWTAutoCollection._getOsName = function (userAgent) {
        if (userAgent.match(OSNAMEREGEX.WINPHONE)) {
            return OPERATING_SYSTEMS.WINDOWS_PHONE;
        }
        if (userAgent.match(OSNAMEREGEX.WINRT)) {
            return OPERATING_SYSTEMS.WINDOWS_RT;
        }
        if (userAgent.match(OSNAMEREGEX.IOS)) {
            return OPERATING_SYSTEMS.IOS;
        }
        if (userAgent.match(OSNAMEREGEX.ANDROID)) {
            return OPERATING_SYSTEMS.ANDROID;
        }
        if (userAgent.match(OSNAMEREGEX.LINUX)) {
            return OPERATING_SYSTEMS.LINUX;
        }
        if (userAgent.match(OSNAMEREGEX.OSX)) {
            return OPERATING_SYSTEMS.MACOSX;
        }
        if (userAgent.match(OSNAMEREGEX.WIN)) {
            return OPERATING_SYSTEMS.WINDOWS;
        }
        if (userAgent.match(OSNAMEREGEX.CROS)) {
            return OPERATING_SYSTEMS.CROS;
        }
        return UNKNOWN;
    };
    AWTAutoCollection._getOsVersion = function (userAgent, osName) {
        if (osName === OPERATING_SYSTEMS.WINDOWS) {
            return this._getGenericOsVersion(userAgent, 'Windows NT');
        }
        if (osName === OPERATING_SYSTEMS.ANDROID) {
            return this._getGenericOsVersion(userAgent, osName);
        }
        if (osName === OPERATING_SYSTEMS.MACOSX) {
            return this._getMacOsxVersion(userAgent);
        }
        return UNKNOWN;
    };
    AWTAutoCollection._getGenericOsVersion = function (userAgent, osName) {
        var ntVersionMatches = userAgent.match(new RegExp(osName + ' ' + REGEX_VERSION));
        if (ntVersionMatches) {
            if (VERSION_MAPPINGS[ntVersionMatches[1]]) {
                return VERSION_MAPPINGS[ntVersionMatches[1]];
            }
            return ntVersionMatches[1];
        }
        return UNKNOWN;
    };
    AWTAutoCollection._getMacOsxVersion = function (userAgent) {
        var macOsxVersionInUserAgentMatches = userAgent.match(new RegExp(OPERATING_SYSTEMS.MACOSX + ' ' + REGEX_VERSION_MAC));
        if (macOsxVersionInUserAgentMatches) {
            var versionString = macOsxVersionInUserAgentMatches[1].replace(/_/g, '.');
            if (versionString) {
                var delimiter = this._getDelimiter(versionString);
                if (delimiter) {
                    var components = versionString.split(delimiter);
                    return components[0];
                }
                else {
                    return versionString;
                }
            }
        }
        return UNKNOWN;
    };
    AWTAutoCollection._getDelimiter = function (versionString) {
        if (versionString.indexOf('.') > -1) {
            return '.';
        }
        if (versionString.indexOf('_') > -1) {
            return '_';
        }
        return null;
    };
    AWTAutoCollection._saveData = function (name, value) {
        if (this._propertyStorage) {
            this._propertyStorage.setProperty(name, value);
        }
        else if (this._areCookiesAvailable) {
            //Expires in 365 days
            var date = new Date();
            date.setTime(date.getTime() + 31536000000 /*365 days in milliseconds*/);
            var expires = 'expires=' + date.toUTCString();
            document.cookie = name + '=' + value + '; ' + expires;
        }
    };
    AWTAutoCollection._getData = function (name) {
        if (this._propertyStorage) {
            return this._propertyStorage.getProperty(name) || '';
        }
        else if (this._areCookiesAvailable) {
            name = name + '=';
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                var j = 0;
                while (c.charAt(j) === ' ') {
                    j++;
                }
                c = c.substring(j);
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
        }
        return '';
    };
    AWTAutoCollection._deleteCookie = function (name) {
        if (this._areCookiesAvailable) {
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    };
    AWTAutoCollection._disableCookies = false;
    AWTAutoCollection._areCookiesAvailable = typeof document !== UNDEFINED && typeof document.cookie !== UNDEFINED;
    return AWTAutoCollection;
}());
exports.default = AWTAutoCollection;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AWTAutoCollection_1 = __webpack_require__(7);
var Enums_1 = __webpack_require__(0);
var Enums_2 = __webpack_require__(6);
var UI_IDTYPE = 'UserInfo.IdType';
/**
 *  Class to allow users to set semantic context properties.
 */
var AWTSemanticContext = /** @class */ (function () {
    /**
     * @constructor
     * @param {boolean} _allowDeviceFields - Allow setting of device semantic context.
     * @param {object} _properties         - The event properties where to add the semantic context.
     */
    function AWTSemanticContext(_allowDeviceFields, _properties) {
        this._allowDeviceFields = _allowDeviceFields;
        this._properties = _properties;
    }
    /**
     * Sets the field AppInfo.Id with the given value.
     * @param {string} appId  - The Id uniquely identifies the App from this this event originated.
     * In the multi-tenant Aria Platform, this is the Application Id of the
     * registered Application. Example, "735d47645f7c4de69964e2c01888d6b6".
     */
    AWTSemanticContext.prototype.setAppId = function (appId) {
        this._addContext('AppInfo.Id', appId);
    };
    /**
     * Sets the field AppInfo.Version with the given value.
     * @param {string} appVersion  - The version of the App, retrieved programmatically where possible. This
     * is app/platform dependent. Examples such as "7.0.0.100" for Skype,
     * or "12.0.30723.00 Update 3" for Microsoft Visual Studio Ultimate 2013
     */
    AWTSemanticContext.prototype.setAppVersion = function (appVersion) {
        this._addContext('AppInfo.Version', appVersion);
    };
    /**
     * Sets the field AppInfo.Language with the given value.
     * @param {string} appLanguage  - Language of the App in IETF language tag format, as described in RFC 4646.
     * Examples of acceptable values include "en", "pt-BR" and "zh-Hant-CN".
     */
    AWTSemanticContext.prototype.setAppLanguage = function (appLanguage) {
        this._addContext('AppInfo.Language', appLanguage);
    };
    /**
     * Sets the field DeviceInfo.Id with the given value.
     * @param {string} deviceId  - The device Id uniquely identifies the physical device, using platform
     * available API's. This allows correlation against Aria Hardware Inventory.
     */
    AWTSemanticContext.prototype.setDeviceId = function (deviceId) {
        if (this._allowDeviceFields) {
            AWTAutoCollection_1.default.checkAndSaveDeviceId(deviceId);
            this._addContext('DeviceInfo.Id', deviceId);
        }
    };
    /**
     * Sets the field DeviceInfo.OsName with the given value.
     * @param {string} deviceOsName  - The name of the OS. The SDK should ensure this is a limited normalized
     * set. Asimov is using very high level value e.g. Windows/Android/iOS.
     * Examples such as "iOS" or "Windows Phone".
     */
    AWTSemanticContext.prototype.setDeviceOsName = function (deviceOsName) {
        if (this._allowDeviceFields) {
            this._addContext('DeviceInfo.OsName', deviceOsName);
        }
    };
    /**
     * Sets the field DeviceInfo.OsVersion with the given value.
     * @param {string} deviceOsVersion  - The version of the OS, retrieved programmatically, which can be used
     * for aggregation or filtering for scenarios like real time monitoring
     * or metrics reporting. Flurry and GA provide aggregation at this level.
     * Examples such as "8.1.2" for iOS, or "8.1" for Windows Phone.
     */
    AWTSemanticContext.prototype.setDeviceOsVersion = function (deviceOsVersion) {
        if (this._allowDeviceFields) {
            this._addContext('DeviceInfo.OsVersion', deviceOsVersion);
        }
    };
    /**
     * Sets the field DeviceInfo.Id with the given value.
     * @param {string} deviceBrowserName  - he name of the OS. The SDK should ensure this is a limited normalized set.
     * Examples such as "Chrome" or "Edge".
     */
    AWTSemanticContext.prototype.setDeviceBrowserName = function (deviceBrowserName) {
        if (this._allowDeviceFields) {
            this._addContext('DeviceInfo.BrowserName', deviceBrowserName);
        }
    };
    /**
     * Sets the field DeviceInfo.Id with the given value.
     * @param {string} deviceBrowserVersion  - The version of the browser, retrieved programmatically, which can be used
     * for aggregation or filtering for scenarios like real time monitoring or metrics reporting.
     * Examples such as "57.0.2987.133" for Chrome, or "15.15063" for Edge.
     */
    AWTSemanticContext.prototype.setDeviceBrowserVersion = function (deviceBrowserVersion) {
        if (this._allowDeviceFields) {
            this._addContext('DeviceInfo.BrowserVersion', deviceBrowserVersion);
        }
    };
    /**
     * Set the device manufacturer context information of telemetry event.
     * Can only be set at the LogManager level. Setting it via the object obtained from ILogger
     * will be no-op.
     * @param {string} deviceMake The manufacturer of the device, retrieved
     *            programmatically where possible and is app/platform specific
     */
    AWTSemanticContext.prototype.setDeviceMake = function (deviceMake) {
        if (this._allowDeviceFields) {
            this._addContext('DeviceInfo.Make', deviceMake);
        }
    };
    /**
     * Set the device model context information of telemetry event.
     * Can only be set at the LogManager level. Setting it via the object obtained from ILogger
     * will be no-op.
     * @param {string} deviceModel The model of the device, retrieved programmatically
     *            where possible and is app/platform specific
     */
    AWTSemanticContext.prototype.setDeviceModel = function (deviceModel) {
        if (this._allowDeviceFields) {
            this._addContext('DeviceInfo.Model', deviceModel);
        }
    };
    /**
     * Sets the field UserInfo.Id with the given value.
     * @param {string} userId     - The id uniquely identifies the user in an application-specific
     * user namespace, such as a Skype ID in the Skype App. This may be empty for Apps
     * which do not require user sign-in.
     * @param {enum} pii        - Optional pii type for the user id.
     * @param {enum} userIdType - Optional id type for the user id.
     */
    AWTSemanticContext.prototype.setUserId = function (userId, pii, userIdType) {
        if (!isNaN(userIdType) && userIdType !== null && userIdType >= 0 && userIdType <= 12) {
            this._addContext(UI_IDTYPE, userIdType.toString());
        }
        else {
            var inferredUserIdType = void 0;
            switch (pii) {
                case Enums_1.AWTPiiKind.SipAddress:
                    inferredUserIdType = Enums_2.AWTUserIdType.SipAddress;
                    break;
                case Enums_1.AWTPiiKind.PhoneNumber:
                    inferredUserIdType = Enums_2.AWTUserIdType.PhoneNumber;
                    break;
                case Enums_1.AWTPiiKind.SmtpAddress:
                    inferredUserIdType = Enums_2.AWTUserIdType.EmailAddress;
                    break;
                default:
                    inferredUserIdType = Enums_2.AWTUserIdType.Unknown;
                    break;
            }
            this._addContext(UI_IDTYPE, inferredUserIdType.toString());
        }
        if (isNaN(pii) || pii === null || pii === Enums_1.AWTPiiKind.NotSet || pii > 13) {
            switch (userIdType) {
                case Enums_2.AWTUserIdType.Skype:
                    pii = Enums_1.AWTPiiKind.Identity;
                    break;
                case Enums_2.AWTUserIdType.EmailAddress:
                    pii = Enums_1.AWTPiiKind.SmtpAddress;
                    break;
                case Enums_2.AWTUserIdType.PhoneNumber:
                    pii = Enums_1.AWTPiiKind.PhoneNumber;
                    break;
                case Enums_2.AWTUserIdType.SipAddress:
                    pii = Enums_1.AWTPiiKind.SipAddress;
                    break;
                default:
                    pii = Enums_1.AWTPiiKind.NotSet;
                    break;
            }
        }
        this._addContextWithPii('UserInfo.Id', userId, pii);
    };
    /**
     * Sets the field UserInfo.AdvertisingId with the given value.
     * @param {string} userAdvertisingId  - The AdvertisingId is the user-specific device id obtainable through
     * platform API's. This may not be available if users choose to opt-out
     * of this id, or if the underlying platform does not support it.
     */
    AWTSemanticContext.prototype.setUserAdvertisingId = function (userAdvertisingId) {
        this._addContext('UserInfo.AdvertisingId', userAdvertisingId);
    };
    /**
     * Sets the field UserInfo.TimeZone with the given value.
     * @param {string} userTimeZone  - The user's time zone relative to UTC, in ISO 8601 time zone format.
     * Examples of acceptable values include "+00", "+07:00", and "-1130".
     */
    AWTSemanticContext.prototype.setUserTimeZone = function (userTimeZone) {
        this._addContext('UserInfo.TimeZone', userTimeZone);
    };
    /**
     * Sets the field UserInfo.Language with the given value.
     * @param {string} userLanguage  - The user's language in IETF language tag format, as described in RFC 4646.
     * Examples of acceptable values include "en", "pt-BR" and "zh-Hant-CN".
     */
    AWTSemanticContext.prototype.setUserLanguage = function (userLanguage) {
        this._addContext('UserInfo.Language', userLanguage);
    };
    AWTSemanticContext.prototype._addContext = function (key, value) {
        if (typeof value === 'string') {
            this._properties.setProperty(key, value);
        }
    };
    AWTSemanticContext.prototype._addContextWithPii = function (key, value, pii) {
        if (typeof value === 'string') {
            this._properties.setPropertyWithPii(key, value, pii);
        }
    };
    return AWTSemanticContext;
}());
exports.default = AWTSemanticContext;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
* AWTSerializer.ts
* @author Brent Erickson (brericks) and Abhilash Panwar (abpanwar)
* @copyright Microsoft 2017
*/
var Bond = __webpack_require__(21);
var Enums_1 = __webpack_require__(0);
var AWTNotificationManager_1 = __webpack_require__(2);
var Utils = __webpack_require__(1);
var RequestSizeLimitBytes = 2936012; //approx 2.8 Mb
/**
* Class to handle serialization of event and request.
* Currently uses Bond for serialization. Please note that this may be subject to change.
*/
var AWTSerializer = /** @class */ (function () {
    function AWTSerializer() {
    }
    /**
     * Serialies a request using Bond.
     * @param {object} requestDictionary - A dictionary containing the token to event mapping.
     * @param {number} tokenCount        - Number of tenant tokens to be sent in the request.
     * @return {number[]} The serialized bond request.
     */
    AWTSerializer.getPayloadBlob = function (requestDictionary, tokenCount) {
        var requestFull = false;
        var remainingRequest;
        var stream = new Bond.IO.MemoryStream();
        var writer = new Bond.CompactBinaryProtocolWriter(stream);
        //Write TokenToDataPackagesMap
        writer._WriteFieldBegin(Bond._BondDataType._BT_MAP, 3, null);
        writer._WriteMapContainerBegin(tokenCount, Bond._BondDataType._BT_STRING, Bond._BondDataType._BT_LIST);
        for (var token in requestDictionary) {
            if (!requestFull) {
                if (requestDictionary.hasOwnProperty(token)) {
                    //write token
                    writer._WriteString(token);
                    var dataPackage = requestDictionary[token];
                    // Write list of DataPackages
                    writer._WriteContainerBegin(1, Bond._BondDataType._BT_STRUCT);
                    // Source
                    writer._WriteFieldBegin(Bond._BondDataType._BT_STRING, 2, null);
                    writer._WriteString('act_default_source');
                    // DataPackageId
                    writer._WriteFieldBegin(Bond._BondDataType._BT_STRING, 5, null);
                    writer._WriteString(Utils.newGuid());
                    // Timestamp
                    writer._WriteFieldBegin(Bond._BondDataType._BT_INT64, 6, null);
                    writer._WriteInt64(Utils.numberToBondInt64(Date.now()));
                    // Records
                    writer._WriteFieldBegin(Bond._BondDataType._BT_LIST, 8, null);
                    //Advance position by 1 for the elementy type which is always struct
                    var dpSizePos = stream._GetBuffer().length + 1;
                    writer._WriteContainerBegin(requestDictionary[token].length, Bond._BondDataType._BT_STRUCT);
                    var dpSizeSerialized = stream._GetBuffer().length - dpSizePos;
                    for (var i = 0; i < dataPackage.length; ++i) {
                        var currentStreamPos = stream._GetBuffer().length;
                        this.writeEvent(dataPackage[i], writer);
                        if (stream._GetBuffer().length - currentStreamPos > RequestSizeLimitBytes) {
                            //single event too big
                            AWTNotificationManager_1.default.eventsRejected([dataPackage[i]], Enums_1.AWTEventsRejectedReason.SizeLimitExceeded);
                            //move i one place back so that we can evaluate the next element once we delete the current element at pos i
                            dataPackage.splice(i--, 1);
                            stream._GetBuffer().splice(currentStreamPos);
                            //Bond serialization to change the datapackage length since we couldnt send this event
                            this._addNewDataPackageSize(dataPackage.length, stream, dpSizeSerialized, dpSizePos);
                            continue;
                        }
                        if (stream._GetBuffer().length > RequestSizeLimitBytes) {
                            //Adding this event exceeded the max request size. We should rever this event and send the serialized request.
                            //The remaining events should be returned to send in a separate request.
                            stream._GetBuffer().splice(currentStreamPos);
                            if (!remainingRequest) {
                                remainingRequest = {};
                            }
                            requestDictionary[token] = dataPackage.splice(0, i);
                            remainingRequest[token] = dataPackage;
                            this._addNewDataPackageSize(requestDictionary[token].length, stream, dpSizeSerialized, dpSizePos);
                            requestFull = true;
                            break;
                        }
                    }
                    writer._WriteStructEnd(false);
                }
            }
            else {
                if (!remainingRequest) {
                    remainingRequest = {};
                }
                remainingRequest[token] = requestDictionary[token];
                delete requestDictionary[token];
            }
        }
        // End ClientCollector
        writer._WriteStructEnd(false);
        return { payloadBlob: stream._GetBuffer(), remainingRequest: remainingRequest };
    };
    AWTSerializer._addNewDataPackageSize = function (size, stream, oldDpSize, streamPos) {
        //Bond serialization to change the datapackage length since we couldnt send everything
        var newRecordCountSerialized = Bond._Encoding._Varint_GetBytes(Bond.Number._ToUInt32(size));
        for (var j = 0; j < oldDpSize; ++j) {
            if (j < newRecordCountSerialized.length) {
                stream._GetBuffer()[streamPos + j] = newRecordCountSerialized[j];
            }
            else {
                stream._GetBuffer().slice(streamPos + j, oldDpSize - j);
                break;
            }
        }
    };
    /**
     * Bond serialize the event.
     * @param {object} eventData - The event that needs to be serialized.
     * @return {number[]} The serialized bond event.
     */
    AWTSerializer.writeEvent = function (eventData, writer) {
        // ID
        writer._WriteFieldBegin(Bond._BondDataType._BT_STRING, 1, null);
        writer._WriteString(eventData.id);
        // Timestamp
        writer._WriteFieldBegin(Bond._BondDataType._BT_INT64, 3, null);
        writer._WriteInt64(Utils.numberToBondInt64(eventData.timestamp));
        // Type
        writer._WriteFieldBegin(Bond._BondDataType._BT_STRING, 5, null);
        writer._WriteString(eventData.type);
        // Event Type
        writer._WriteFieldBegin(Bond._BondDataType._BT_STRING, 6, null);
        writer._WriteString(eventData.name);
        var propsString = {};
        var propStringCount = 0;
        var propsInt64 = {};
        var propInt64Count = 0;
        var propsDouble = {};
        var propDoubleCount = 0;
        var propsBool = {};
        var propBoolCount = 0;
        var propsDate = {};
        var propDateCount = 0;
        var piiProps = {};
        var piiPropCount = 0;
        var ccProps = {};
        var ccPropCount = 0;
        // Iterate across event data properties and separate based on pii
        for (var key in eventData.properties) {
            if (eventData.properties.hasOwnProperty(key)) {
                var property = eventData.properties[key];
                if (property.cc > 0) {
                    ccProps[key] = property;
                    ccPropCount++;
                }
                else if (property.pii > 0) {
                    piiProps[key] = property;
                    piiPropCount++;
                }
                else {
                    switch (property.type) {
                        case Enums_1.AWTPropertyType.String:
                            propsString[key] = property.value;
                            propStringCount++;
                            break;
                        case Enums_1.AWTPropertyType.Int64:
                            propsInt64[key] = property.value;
                            propInt64Count++;
                            break;
                        case Enums_1.AWTPropertyType.Double:
                            propsDouble[key] = property.value;
                            propDoubleCount++;
                            break;
                        case Enums_1.AWTPropertyType.Boolean:
                            propsBool[key] = property.value;
                            propBoolCount++;
                            break;
                        case Enums_1.AWTPropertyType.Date:
                            propsDate[key] = property.value;
                            propDateCount++;
                            break;
                    }
                }
            }
        }
        //Extension map
        if (propStringCount) {
            writer._WriteFieldBegin(Bond._BondDataType._BT_MAP, 13, null);
            writer._WriteMapContainerBegin(propStringCount, Bond._BondDataType._BT_STRING, Bond._BondDataType._BT_STRING);
            for (var key in propsString) {
                if (propsString.hasOwnProperty(key)) {
                    var value = propsString[key];
                    writer._WriteString(key);
                    writer._WriteString(value.toString());
                }
            }
        }
        // Pii
        if (piiPropCount) {
            writer._WriteFieldBegin(Bond._BondDataType._BT_MAP, 30, null);
            writer._WriteMapContainerBegin(piiPropCount, Bond._BondDataType._BT_STRING, Bond._BondDataType._BT_STRUCT);
            for (var key in piiProps) {
                if (piiProps.hasOwnProperty(key)) {
                    var property = piiProps[key];
                    writer._WriteString(key);
                    // PII Data
                    // O365 scrubber type
                    writer._WriteFieldBegin(Bond._BondDataType._BT_INT32, 1, null);
                    writer._WriteInt32(1);
                    // PII Kind
                    writer._WriteFieldBegin(Bond._BondDataType._BT_INT32, 2, null);
                    writer._WriteInt32(property.pii);
                    // Value
                    writer._WriteFieldBegin(Bond._BondDataType._BT_STRING, 3, null);
                    writer._WriteString(property.value.toString());
                    writer._WriteStructEnd(false);
                }
            }
        }
        // TypedExtensionBoolean map
        if (propBoolCount) {
            writer._WriteFieldBegin(Bond._BondDataType._BT_MAP, 31, null);
            writer._WriteMapContainerBegin(propBoolCount, Bond._BondDataType._BT_STRING, Bond._BondDataType._BT_BOOL);
            for (var key in propsBool) {
                if (propsBool.hasOwnProperty(key)) {
                    var value = propsBool[key];
                    writer._WriteString(key);
                    writer._WriteBool(value);
                }
            }
        }
        //TypedExtensionDateTime map
        if (propDateCount) {
            writer._WriteFieldBegin(Bond._BondDataType._BT_MAP, 32, null);
            writer._WriteMapContainerBegin(propDateCount, Bond._BondDataType._BT_STRING, Bond._BondDataType._BT_INT64);
            for (var key in propsDate) {
                if (propsDate.hasOwnProperty(key)) {
                    var value = propsDate[key];
                    writer._WriteString(key);
                    writer._WriteInt64(Utils.numberToBondInt64(value));
                }
            }
        }
        //TypedExtensionInt64 map
        if (propInt64Count) {
            writer._WriteFieldBegin(Bond._BondDataType._BT_MAP, 33, null);
            writer._WriteMapContainerBegin(propInt64Count, Bond._BondDataType._BT_STRING, Bond._BondDataType._BT_INT64);
            for (var key in propsInt64) {
                if (propsInt64.hasOwnProperty(key)) {
                    var value = propsInt64[key];
                    writer._WriteString(key);
                    writer._WriteInt64(Utils.numberToBondInt64(value));
                }
            }
        }
        //TypedExtensionDouble map
        if (propDoubleCount) {
            writer._WriteFieldBegin(Bond._BondDataType._BT_MAP, 34, null);
            writer._WriteMapContainerBegin(propDoubleCount, Bond._BondDataType._BT_STRING, Bond._BondDataType._BT_DOUBLE);
            for (var key in propsDouble) {
                if (propsDouble.hasOwnProperty(key)) {
                    var value = propsDouble[key];
                    writer._WriteString(key);
                    writer._WriteDouble(value);
                }
            }
        }
        //CustomerContentExtensions map
        if (ccPropCount) {
            writer._WriteFieldBegin(Bond._BondDataType._BT_MAP, 36, null);
            writer._WriteMapContainerBegin(ccPropCount, Bond._BondDataType._BT_STRING, Bond._BondDataType._BT_STRUCT);
            for (var key in ccProps) {
                if (ccProps.hasOwnProperty(key)) {
                    var property = ccProps[key];
                    writer._WriteString(key);
                    // CustomerContent Data
                    // CustomerContentKind
                    writer._WriteFieldBegin(Bond._BondDataType._BT_INT32, 1, null);
                    writer._WriteInt32(property.cc);
                    // RawContent
                    writer._WriteFieldBegin(Bond._BondDataType._BT_STRING, 2, null);
                    writer._WriteString(property.value.toString());
                    writer._WriteStructEnd(false);
                }
            }
        }
        writer._WriteStructEnd(false);
    };
    /**
     * Base64 encode the given number[].
     * @param {number[]} data - The data to be base64 encoded.
     * @return {string} The base64 encoded data.
     */
    AWTSerializer.base64Encode = function (data) {
        return Bond._Encoding._Base64_GetString(data);
    };
    return AWTSerializer;
}());
exports.default = AWTSerializer;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
* AWTStatsManager.ts
* @author Abhilash Panwar (abpanwar)
* @copyright Microsoft 2017
*/
var Utils = __webpack_require__(1);
var AWTNotificationManager_1 = __webpack_require__(2);
var Enums_1 = __webpack_require__(0);
var StatsTimer = 60000;
/**
* Class that manages the stats.
*/
var AWTStatsManager = /** @class */ (function () {
    function AWTStatsManager() {
    }
    /**
     * Intiailizes the stats collection.
     * @param {function} sendStats - The function to call when the stats are ready to be sent.
     */
    AWTStatsManager.initialize = function (sendStats) {
        var _this = this;
        this._sendStats = sendStats;
        this._isInitalized = true;
        AWTNotificationManager_1.default.addNotificationListener({
            eventsSent: function (events) {
                _this._addStat('records_sent_count', events.length, events[0].apiKey);
            },
            eventsDropped: function (events, reason) {
                switch (reason) {
                    case Enums_1.AWTEventsDroppedReason.NonRetryableStatus:
                        _this._addStat('d_send_fail', events.length, events[0].apiKey);
                        _this._addStat('records_dropped_count', events.length, events[0].apiKey);
                        break;
                    case Enums_1.AWTEventsDroppedReason.QueueFull:
                        _this._addStat('d_queue_full', events.length, events[0].apiKey);
                        break;
                }
            },
            eventsRejected: function (events, reason) {
                switch (reason) {
                    case Enums_1.AWTEventsRejectedReason.InvalidEvent:
                        _this._addStat('r_inv', events.length, events[0].apiKey);
                        break;
                    case Enums_1.AWTEventsRejectedReason.KillSwitch:
                        _this._addStat('r_kl', events.length, events[0].apiKey);
                        break;
                    case Enums_1.AWTEventsRejectedReason.SizeLimitExceeded:
                        _this._addStat('r_size', events.length, events[0].apiKey);
                        break;
                }
                _this._addStat('r_count', events.length, events[0].apiKey);
            },
            eventsRetrying: null
        });
        setTimeout(function () { return _this.flush(); }, StatsTimer);
    };
    /**
     * Flush the current stats and stop the stats collection.
     */
    AWTStatsManager.teardown = function () {
        if (this._isInitalized) {
            this.flush();
            this._isInitalized = false;
        }
    };
    /**
     * Increments the stat for event received.
     * @param {string} apiKey - The apiKey for which the event was received
     */
    AWTStatsManager.eventReceived = function (apiKey) {
        AWTStatsManager._addStat('records_received_count', 1, apiKey);
    };
    /**
     * Creates an event for each tenant token which had a stat and calls the
     * sendStats for that token.
     */
    AWTStatsManager.flush = function () {
        var _this = this;
        if (this._isInitalized) {
            for (var tenantId in this._stats) {
                if (this._stats.hasOwnProperty(tenantId)) {
                    this._sendStats(this._stats[tenantId], tenantId);
                }
            }
            this._stats = {};
            setTimeout(function () { return _this.flush(); }, StatsTimer);
        }
    };
    AWTStatsManager._addStat = function (statName, value, apiKey) {
        if (this._isInitalized && apiKey !== Utils.StatsApiKey) {
            var tenantId = Utils.getTenantId(apiKey);
            if (!this._stats[tenantId]) {
                this._stats[tenantId] = {};
            }
            if (!this._stats[tenantId][statName]) {
                this._stats[tenantId][statName] = value;
            }
            else {
                this._stats[tenantId][statName] = this._stats[tenantId][statName] + value;
            }
        }
    };
    AWTStatsManager._isInitalized = false;
    AWTStatsManager._stats = {};
    return AWTStatsManager;
}());
exports.default = AWTStatsManager;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Enums_1 = __webpack_require__(0);
var Enums_2 = __webpack_require__(6);
var AWTLogManagerSettings_1 = __webpack_require__(12);
var AWTLogger_1 = __webpack_require__(13);
var AWTTransmissionManagerCore_1 = __webpack_require__(3);
var AWTNotificationManager_1 = __webpack_require__(2);
var AWTAutoCollection_1 = __webpack_require__(7);
/**
* The AWTLogManager class manages the Aria SDK.
*/
var AWTLogManager = /** @class */ (function () {
    function AWTLogManager() {
    }
    /**
    * Initializes the log manager. After this method is called, events are
    * accepted for transmission.
    * @param {string} tenantToken - A string that contains the default tenant token.
    * @param {object} config      - [Optional] Configuration settings for initialize, as an AWTLogConfiguration object.
    */
    AWTLogManager.initialize = function (tenantToken, configuration) {
        if (configuration === void 0) { configuration = {}; }
        if (this._isInitialized) {
            return;
        }
        this._isInitialized = true;
        AWTLogManagerSettings_1.default.defaultTenantToken = tenantToken;
        this._overrideValuesFromConfig(configuration);
        if (this._config.disableCookiesUsage && !this._config.propertyStorageOverride) {
            AWTLogManagerSettings_1.default.sessionEnabled = false;
        }
        AWTAutoCollection_1.default.addPropertyStorageOverride(this._config.propertyStorageOverride);
        AWTAutoCollection_1.default.autoCollect(AWTLogManagerSettings_1.default.semanticContext, this._config.disableCookiesUsage, this._config.userAgent);
        //Create sender
        AWTTransmissionManagerCore_1.default.initialize(this._config);
        AWTLogManagerSettings_1.default.loggingEnabled = true;
        //Autolog session events for browsers
        if (this._config.enableAutoUserSession) {
            this.getLogger().logSession(Enums_2.AWTSessionState.Started);
            window.addEventListener('beforeunload', this.flushAndTeardown);
        }
        return this.getLogger();
    };
    /**
     * Gets the global semantic context.
     *
     * @return A AWTSemanticContext object, through which you can set common semantic properties.
     */
    AWTLogManager.getSemanticContext = function () {
        return AWTLogManagerSettings_1.default.semanticContext;
    };
    /**
     * Asynchronously sends events currently in the queue. New events added
     * are sent after the current flush finishes. The passed callback is
     * called when flush finishes. <b>Note:</b> If LogManager is paused, or if
     * flush is called again in less than 30 seconds, then flush is no-op, and
     * the callback is not called.
     * @param {function} callback - The function that is called when flush finishes.
     */
    AWTLogManager.flush = function (callback) {
        if (this._isInitialized && !this._isDestroyed) {
            AWTTransmissionManagerCore_1.default.flush(callback);
        }
    };
    /**
     * Prevents new events from being added for transmission. It also batches all
     * events currently in the queue, and creates requests for them to be sent. If
     * HTML5 Beacons are supported, then they will be used.
     */
    AWTLogManager.flushAndTeardown = function () {
        if (this._isInitialized && !this._isDestroyed) {
            if (this._config.enableAutoUserSession) {
                this.getLogger().logSession(Enums_2.AWTSessionState.Ended);
            }
            AWTTransmissionManagerCore_1.default.flushAndTeardown();
            AWTLogManagerSettings_1.default.loggingEnabled = false;
            this._isDestroyed = true;
        }
    };
    /**
     * Pasues the transmission of events.
     */
    AWTLogManager.pauseTransmission = function () {
        if (this._isInitialized && !this._isDestroyed) {
            AWTTransmissionManagerCore_1.default.pauseTransmission();
        }
    };
    /**
     * Resumes the tranmission of events.
     */
    AWTLogManager.resumeTransmision = function () {
        if (this._isInitialized && !this._isDestroyed) {
            AWTTransmissionManagerCore_1.default.resumeTransmision();
        }
    };
    /**
     * Sets the transmit profile. This changes the transmission timers
     * based on the transmit profile.
     * @param {string} profileName - A string that contains the name of the transmit profile.
     */
    AWTLogManager.setTransmitProfile = function (profileName) {
        if (this._isInitialized && !this._isDestroyed) {
            AWTTransmissionManagerCore_1.default.setTransmitProfile(profileName);
        }
    };
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
    AWTLogManager.loadTransmitProfiles = function (profiles) {
        if (this._isInitialized && !this._isDestroyed) {
            AWTTransmissionManagerCore_1.default.loadTransmitProfiles(profiles);
        }
    };
    /**
     * Sets the context sent with every event.
     * @param {string} name                 - A string that contains the name of the context property.
     * @param {string|number|boolean} value - The value of the context property.
     * @param {enum} type                   - [Optional] The type for the context property value, as one of the
     * AWTPropertyType enumeration values.
     */
    AWTLogManager.setContext = function (name, value, type) {
        if (type === void 0) { type = Enums_1.AWTPropertyType.Unspecified; }
        AWTLogManagerSettings_1.default.logManagerContext.setProperty(name, value, type);
    };
    /**
     * Sets the context sents with every event, and tags it as PII.
     * @param {string} name                 - A string that contains the name of the context property.
     * @param {string|number|boolean} value - The value of the context property.
     * @param {enum} pii                    - The kind of PII for the context property.
     * @param {enum} type                   - [Optional] The type for the context property value, as one of the
     * AWTPropertyType enumeration values.
     */
    AWTLogManager.setContextWithPii = function (name, value, pii, type) {
        if (type === void 0) { type = Enums_1.AWTPropertyType.Unspecified; }
        AWTLogManagerSettings_1.default.logManagerContext.setPropertyWithPii(name, value, pii, type);
    };
    /**
     * Sets the context sent with every event from this logger, and tags it as <i>customer content</i>.
     * @param {string} name                 - A string that contains the name of the context property.
     * @param {string|number|boolean} value - The value of the context property.
     * @param {enum} customerContent        - The kind of customer content for the context property, as one of the
     * AWTCustomerContentKind enumeration values.
     * @param {enum} type                   - [Optional] The type for the context property value, as one of the
     * AWTPropertyType enumeration values.
     */
    AWTLogManager.setContextWithCustomerContent = function (name, value, customerContent, type) {
        if (type === void 0) { type = Enums_1.AWTPropertyType.Unspecified; }
        AWTLogManagerSettings_1.default.logManagerContext.setPropertyWithCustomerContent(name, value, customerContent, type);
    };
    /**
     * Gets the logger for the specified tenant token.
     * @param {string} tenantToken - A string that contains the tenant token.
     * @return An AWTLogger object which sends data with the specified tenant token. If the tenant token is
     * undefined, or null, or empty, then undefined is returned.
     */
    AWTLogManager.getLogger = function (tenantToken) {
        var key = tenantToken;
        if (!key || key === AWTLogManagerSettings_1.default.defaultTenantToken) {
            key = '';
        }
        if (!this._loggers[key]) {
            this._loggers[key] = new AWTLogger_1.default(key);
        }
        return this._loggers[key];
    };
    /**
     * Adds a notification listener. The Aria SDK calls methods on the listener
     * when an appropriate notification is raised.
     * @param {object} listener - An AWTNotificationListener object.
     */
    AWTLogManager.addNotificationListener = function (listener) {
        AWTNotificationManager_1.default.addNotificationListener(listener);
    };
    /**
     * Removes all instances of the listener.
     * @param {object} listener - AWTNotificationListener to remove.
     */
    AWTLogManager.removeNotificationListener = function (listener) {
        AWTNotificationManager_1.default.removeNotificationListener(listener);
    };
    AWTLogManager._overrideValuesFromConfig = function (config) {
        if (config.collectorUri) {
            this._config.collectorUri = config.collectorUri;
        }
        if (config.cacheMemorySizeLimitInNumberOfEvents > 0) {
            this._config.cacheMemorySizeLimitInNumberOfEvents = config.cacheMemorySizeLimitInNumberOfEvents;
        }
        if (config.httpXHROverride && config.httpXHROverride.sendPOST) {
            this._config.httpXHROverride = config.httpXHROverride;
        }
        if (config.propertyStorageOverride && config.propertyStorageOverride.getProperty &&
            config.propertyStorageOverride.setProperty) {
            this._config.propertyStorageOverride = config.propertyStorageOverride;
        }
        if (config.userAgent) {
            this._config.userAgent = config.userAgent;
        }
        if (config.disableCookiesUsage) {
            this._config.disableCookiesUsage = config.disableCookiesUsage;
        }
        if (config.canSendStatEvent) {
            this._config.canSendStatEvent = config.canSendStatEvent;
        }
        if (config.enableAutoUserSession && typeof window !== 'undefined' && window.addEventListener) {
            this._config.enableAutoUserSession = config.enableAutoUserSession;
        }
        if (config.clockSkewRefreshDurationInMins > 0) {
            this._config.clockSkewRefreshDurationInMins = config.clockSkewRefreshDurationInMins;
        }
    };
    AWTLogManager._loggers = {};
    AWTLogManager._isInitialized = false;
    AWTLogManager._isDestroyed = false;
    AWTLogManager._config = {
        collectorUri: 'https://browser.pipe.aria.microsoft.com/Collector/3.0/',
        cacheMemorySizeLimitInNumberOfEvents: 10000,
        disableCookiesUsage: false,
        canSendStatEvent: function (eventName) { return true; },
        clockSkewRefreshDurationInMins: 0
    };
    return AWTLogManager;
}());
exports.default = AWTLogManager;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
* AWTLogManagerSettings.ts
* @author Abhilash Panwar (abpanwar)
* @copyright Microsoft 2017
*/
var AWTEventProperties_1 = __webpack_require__(5);
var AWTSemanticContext_1 = __webpack_require__(8);
/**
* Class that stores LogManagers context.
*/
var AWTLogManagerSettings = /** @class */ (function () {
    function AWTLogManagerSettings() {
    }
    AWTLogManagerSettings.logManagerContext = new AWTEventProperties_1.default();
    AWTLogManagerSettings.sessionEnabled = true;
    AWTLogManagerSettings.loggingEnabled = false;
    AWTLogManagerSettings.defaultTenantToken = '';
    AWTLogManagerSettings.semanticContext = new AWTSemanticContext_1.default(true, AWTLogManagerSettings.logManagerContext);
    return AWTLogManagerSettings;
}());
exports.default = AWTLogManagerSettings;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
* AWTLogger.ts
* @author Abhilash Panwar (abpanwar)
* @copyright Microsoft 2017
*/
var Enums_1 = __webpack_require__(0);
var Enums_2 = __webpack_require__(6);
var AWTEventProperties_1 = __webpack_require__(5);
var Utils = __webpack_require__(1);
var AWTStatsManager_1 = __webpack_require__(10);
var AWTNotificationManager_1 = __webpack_require__(2);
var AWTTransmissionManagerCore_1 = __webpack_require__(3);
var AWTLogManagerSettings_1 = __webpack_require__(12);
var Version = __webpack_require__(15);
var AWTSemanticContext_1 = __webpack_require__(8);
var AWTAutoCollection_1 = __webpack_require__(7);
/**
* The AWTLogger class defines a logger.
*/
var AWTLogger = /** @class */ (function () {
    /**
     * The AWTLogger class constructor.
     * @constructor
     * @param {string} _apiKey - The API key (also known as application key, and tenant token).
     */
    function AWTLogger(_apiKey) {
        this._apiKey = _apiKey;
        this._contextProperties = new AWTEventProperties_1.default();
        this._semanticContext = new AWTSemanticContext_1.default(false, this._contextProperties);
        this._sessionStartTime = 0;
        this._createInitId();
    }
    /**
     * Sets the context sent with every event from this logger.
     * @param {string} name                 - The name of the context property.
     * @param {string|number|boolean} value - The context property's value.
     * @param {enum} type                   - [Optional] The type of context property, as one of the AWTPropertyType enumeration values.
     */
    AWTLogger.prototype.setContext = function (name, value, type) {
        if (type === void 0) { type = Enums_1.AWTPropertyType.Unspecified; }
        this._contextProperties.setProperty(name, value, type);
    };
    /**
     * Sets context that will be sent with every event from this logger, and tags it as PII.
     * @param {string} name                 - The name of the context property.
     * @param {string|number|boolean} value - The context property's value.
     * @param {enum} pii                    - The kind of PII for the context property, as one of the AWTPiiKind enumeration values.
     * @param {enum} type                   - [Optional] The type of context property, as one of the AWTPropertyType enumeration values.
     */
    AWTLogger.prototype.setContextWithPii = function (name, value, pii, type) {
        if (type === void 0) { type = Enums_1.AWTPropertyType.Unspecified; }
        this._contextProperties.setPropertyWithPii(name, value, pii, type);
    };
    /**
     * Sets the context that sent with every event from this logger, and tags it as customer content.
     * @param {string} name                 - The name of the context property.
     * @param {string|number|boolean} value - The context property's value.
     * @param {enum} customerContent        - The customer content kind, as one of the AWTCustomerContentKind enumeration values.
     * @param {enum} type                   - [Optional] The type of context property, as one of the AWTPropertyType enumeration values.
     */
    AWTLogger.prototype.setContextWithCustomerContent = function (name, value, customerContent, type) {
        if (type === void 0) { type = Enums_1.AWTPropertyType.Unspecified; }
        this._contextProperties.setPropertyWithCustomerContent(name, value, customerContent, type);
    };
    /**
     * Gets the logger semantic context.
     * <b>Note:</b> Device properties are not permitted at the logger level, but you can set them
     * at the global level using the AWTLogManager class.
     *
     * @return A AWTSemanticContext object that you can use to set common semantic properties.
     */
    AWTLogger.prototype.getSemanticContext = function () {
        return this._semanticContext;
    };
    /**
     * Logs a custom event with the specified name and fields - to track information
     * such as how a particular feature is used.
     * @param {Object} event - Can be either an AWTEventProperties object or an AWTEventData object or an event name.
     */
    AWTLogger.prototype.logEvent = function (event) {
        if (AWTLogManagerSettings_1.default.loggingEnabled) {
            if (!this._apiKey) {
                this._apiKey = AWTLogManagerSettings_1.default.defaultTenantToken;
                this._createInitId();
            }
            var sanitizeProperties = true;
            if (Utils.isString(event)) {
                event = {
                    name: event
                };
            }
            else if (event instanceof AWTEventProperties_1.default) {
                event = event.getEvent();
                //AWTEventProperties will already sanitize properties
                sanitizeProperties = false;
            }
            AWTStatsManager_1.default.eventReceived(this._apiKey);
            AWTLogger._logEvent(AWTLogger._getInternalEvent(event, this._apiKey, sanitizeProperties), this._contextProperties);
        }
    };
    /**
     * Logs the session state.
     * <b>Note:</b> Calling Logging session <i>start</i> while a session already exists will produce a no-op. Similarly, calling logging
     * session <i>end</i> while a session does not exist will also produce a no-op.
     * @param {enum} state         - The session's state.
     * @param {obbject} properties - [Optional] Properties of the session event as either a AWTEventProperties object,
     * or a AWTEventData object.
     */
    AWTLogger.prototype.logSession = function (state, properties) {
        if (AWTLogManagerSettings_1.default.sessionEnabled) {
            var sessionEvent = {
                name: 'session',
                type: 'session',
                properties: {}
            };
            AWTLogger._addPropertiesToEvent(sessionEvent, properties);
            sessionEvent.priority = Enums_1.AWTEventPriority.High;
            if (state === Enums_2.AWTSessionState.Started) {
                if (this._sessionStartTime > 0) {
                    //Session start called out of order. Session start time being non zero indicates an ongoing session.
                    return;
                }
                this._sessionStartTime = (new Date()).getTime();
                this._sessionId = Utils.newGuid();
                this.setContext('Session.Id', this._sessionId);
                sessionEvent.properties['Session.State'] = 'Started';
            }
            else if (state === Enums_2.AWTSessionState.Ended) {
                if (this._sessionStartTime === 0) {
                    //Session end called out of order. Session start time being zero indicates no ongoing session.
                    return;
                }
                var sessionDurationSec = Math.floor(((new Date()).getTime() - this._sessionStartTime) / 1000);
                sessionEvent.properties['Session.Id'] = this._sessionId;
                sessionEvent.properties['Session.State'] = 'Ended';
                sessionEvent.properties['Session.Duration'] = sessionDurationSec.toString();
                sessionEvent.properties['Session.DurationBucket'] =
                    AWTLogger._getSessionDurationFromTime(sessionDurationSec);
                this._sessionStartTime = 0;
                this.setContext('Session.Id', null);
                this._sessionId = undefined;
            }
            else {
                return;
            }
            sessionEvent.properties['Session.FirstLaunchTime'] = AWTAutoCollection_1.default.firstLaunchTime;
            this.logEvent(sessionEvent);
        }
    };
    /**
     * Gets the session ID for the ongoing session.
     * @return {string} A string that contains the session ID for the ongoing session. Returns undefined if there is
     * no ongoing session.
     */
    AWTLogger.prototype.getSessionId = function () {
        return this._sessionId;
    };
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
    AWTLogger.prototype.logFailure = function (signature, detail, category, id, properties) {
        if (!signature || !detail) {
            return;
        }
        var failureEvent = {
            name: 'failure',
            type: 'failure',
            properties: {}
        };
        AWTLogger._addPropertiesToEvent(failureEvent, properties);
        failureEvent.properties['Failure.Signature'] = signature;
        failureEvent.properties['Failure.Detail'] = detail;
        if (category) {
            failureEvent.properties['Failure.Category'] = category;
        }
        if (id) {
            failureEvent.properties['Failure.Id'] = id;
        }
        failureEvent.priority = Enums_1.AWTEventPriority.High;
        this.logEvent(failureEvent);
    };
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
    AWTLogger.prototype.logPageView = function (id, pageName, category, uri, referrerUri, properties) {
        if (!id || !pageName) {
            return;
        }
        var pageViewEvent = {
            name: 'pageview',
            type: 'pageview',
            properties: {}
        };
        AWTLogger._addPropertiesToEvent(pageViewEvent, properties);
        pageViewEvent.properties['PageView.Id'] = id;
        pageViewEvent.properties['PageView.Name'] = pageName;
        if (category) {
            pageViewEvent.properties['PageView.Category'] = category;
        }
        if (uri) {
            pageViewEvent.properties['PageView.Uri'] = uri;
        }
        if (referrerUri) {
            pageViewEvent.properties['PageView.ReferrerUri'] = referrerUri;
        }
        this.logEvent(pageViewEvent);
    };
    AWTLogger.prototype._createInitId = function () {
        // If no init ID for this tenant token exists, create one
        if (!AWTLogger._initIdMap[this._apiKey] && this._apiKey) {
            AWTLogger._initIdMap[this._apiKey] = Utils.newGuid();
        }
    };
    AWTLogger._addPropertiesToEvent = function (event, propertiesEvent) {
        if (propertiesEvent) {
            if (propertiesEvent instanceof AWTEventProperties_1.default) {
                propertiesEvent = propertiesEvent.getEvent();
            }
            if (propertiesEvent.name) {
                event.name = propertiesEvent.name;
            }
            if (propertiesEvent.priority) {
                event.priority = propertiesEvent.priority;
            }
            for (var name_1 in propertiesEvent.properties) {
                if (propertiesEvent.properties.hasOwnProperty(name_1)) {
                    event.properties[name_1] = propertiesEvent.properties[name_1];
                }
            }
        }
    };
    AWTLogger._getSessionDurationFromTime = function (timeInSec) {
        if (timeInSec < 0) {
            return 'Undefined';
        }
        else if (timeInSec <= 3) {
            return 'UpTo3Sec';
        }
        else if (timeInSec <= 10) {
            return 'UpTo10Sec';
        }
        else if (timeInSec <= 30) {
            return 'UpTo30Sec';
        }
        else if (timeInSec <= 60) {
            return 'UpTo60Sec';
        }
        else if (timeInSec <= 180) {
            return 'UpTo3Min';
        }
        else if (timeInSec <= 600) {
            return 'UpTo10Min';
        }
        else if (timeInSec <= 1800) {
            return 'UpTo30Min';
        }
        return 'Above30Min';
    };
    AWTLogger._logEvent = function (eventWithMetaData, contextProperties) {
        if (!eventWithMetaData.name || !Utils.isString(eventWithMetaData.name)) {
            AWTNotificationManager_1.default.eventsRejected([eventWithMetaData], Enums_1.AWTEventsRejectedReason.InvalidEvent);
            return;
        }
        eventWithMetaData.name = eventWithMetaData.name.toLowerCase();
        //Check if name is a string and replace . with _ if it is. Drop otherwise.
        eventWithMetaData.name = eventWithMetaData.name.replace(Utils.EventNameDotRegex, '_');
        if (!eventWithMetaData.type || !Utils.isString(eventWithMetaData.type)) {
            eventWithMetaData.type = 'custom';
        }
        else {
            eventWithMetaData.type = eventWithMetaData.type.toLowerCase();
        }
        //Validate name and type and drop if invalid
        if (!Utils.EventNameAndTypeRegex.test(eventWithMetaData.name) || !Utils.EventNameAndTypeRegex.test(eventWithMetaData.type)) {
            AWTNotificationManager_1.default.eventsRejected([eventWithMetaData], Enums_1.AWTEventsRejectedReason.InvalidEvent);
            return;
        }
        //Add the timestamp if the timestamp is not set or is negative.
        if (!Utils.isNumber(eventWithMetaData.timestamp) || eventWithMetaData.timestamp < 0) {
            eventWithMetaData.timestamp = (new Date()).getTime();
        }
        //If no properties create one for EventInfo and context 
        if (!eventWithMetaData.properties) {
            eventWithMetaData.properties = {};
        }
        // Logger ContextProperties
        this._addContextIfAbsent(eventWithMetaData, contextProperties.getPropertyMap());
        // LogManager ContextProperties
        this._addContextIfAbsent(eventWithMetaData, AWTLogManagerSettings_1.default.logManagerContext.getPropertyMap());
        //Add event info
        this._setDefaultProperty(eventWithMetaData, 'EventInfo.InitId', this._getInitId(eventWithMetaData.apiKey));
        this._setDefaultProperty(eventWithMetaData, 'EventInfo.Sequence', this._getSequenceId(eventWithMetaData.apiKey));
        this._setDefaultProperty(eventWithMetaData, 'EventInfo.SdkVersion', Version.FullVersionString);
        this._setDefaultProperty(eventWithMetaData, 'EventInfo.Name', eventWithMetaData.name);
        this._setDefaultProperty(eventWithMetaData, 'EventInfo.Time', (new Date(eventWithMetaData.timestamp)).toISOString());
        if (!Utils.isPriority(eventWithMetaData.priority)) {
            eventWithMetaData.priority = Enums_1.AWTEventPriority.Normal;
        }
        this._sendEvent(eventWithMetaData);
    };
    AWTLogger._addContextIfAbsent = function (event, contextProperties) {
        if (contextProperties) {
            for (var name_2 in contextProperties) {
                if (contextProperties.hasOwnProperty(name_2)) {
                    if (!event.properties[name_2]) {
                        event.properties[name_2] = contextProperties[name_2];
                    }
                }
            }
        }
    };
    AWTLogger._setDefaultProperty = function (event, name, value) {
        event.properties[name] = { value: value, pii: Enums_1.AWTPiiKind.NotSet, type: Enums_1.AWTPropertyType.String };
    };
    AWTLogger._sendEvent = function (event) {
        AWTTransmissionManagerCore_1.default.sendEvent(event);
    };
    AWTLogger._getInternalEvent = function (event, apiKey, sanitizeProperties) {
        event.properties = event.properties || {};
        if (sanitizeProperties) {
            // Event Properties 
            for (var name_3 in event.properties) {
                if (event.properties.hasOwnProperty(name_3)) {
                    event.properties[name_3] = Utils.sanitizeProperty(name_3, event.properties[name_3]);
                    if (event.properties[name_3] === null) {
                        delete event.properties[name_3];
                    }
                }
            }
        }
        var internalEvent = event;
        internalEvent.id = Utils.newGuid();
        internalEvent.apiKey = apiKey;
        return internalEvent;
    };
    AWTLogger._getInitId = function (apiKey) {
        return AWTLogger._initIdMap[apiKey];
    };
    AWTLogger._getSequenceId = function (apiKey) {
        if (AWTLogger._sequenceIdMap[apiKey] === undefined) {
            AWTLogger._sequenceIdMap[apiKey] = 0;
        }
        return (++AWTLogger._sequenceIdMap[apiKey]).toString();
    };
    AWTLogger._sequenceIdMap = {};
    AWTLogger._initIdMap = {};
    return AWTLogger;
}());
exports.default = AWTLogger;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AWT_REAL_TIME = 'REAL_TIME';
exports.AWT_NEAR_REAL_TIME = 'NEAR_REAL_TIME';
exports.AWT_BEST_EFFORT = 'BEST_EFFORT';


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
* Version.ts
* @author Abhilash Panwar (abpanwar)
* @copyright Microsoft 2018
* File for SDK version.
*/
exports.Version = '1.8.3';
exports.FullVersionString = 'AWT-Web-JS-' + exports.Version;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
* AriaSDK.ts
* @author Abhilash Panwar (abpanwar)
* @copyright Microsoft 2017
* File to export public classes, interfaces and enums.
*/
var Enums_1 = __webpack_require__(0);
exports.AWTPropertyType = Enums_1.AWTPropertyType;
exports.AWTPiiKind = Enums_1.AWTPiiKind;
exports.AWTEventPriority = Enums_1.AWTEventPriority;
exports.AWTEventsDroppedReason = Enums_1.AWTEventsDroppedReason;
exports.AWTEventsRejectedReason = Enums_1.AWTEventsRejectedReason;
exports.AWTCustomerContentKind = Enums_1.AWTCustomerContentKind;
var Enums_2 = __webpack_require__(6);
exports.AWTUserIdType = Enums_2.AWTUserIdType;
exports.AWTSessionState = Enums_2.AWTSessionState;
var DataModels_1 = __webpack_require__(14);
exports.AWT_BEST_EFFORT = DataModels_1.AWT_BEST_EFFORT;
exports.AWT_NEAR_REAL_TIME = DataModels_1.AWT_NEAR_REAL_TIME;
exports.AWT_REAL_TIME = DataModels_1.AWT_REAL_TIME;
var AWTEventProperties_1 = __webpack_require__(5);
exports.AWTEventProperties = AWTEventProperties_1.default;
var AWTLogger_1 = __webpack_require__(13);
exports.AWTLogger = AWTLogger_1.default;
var AWTLogManager_1 = __webpack_require__(11);
exports.AWTLogManager = AWTLogManager_1.default;
var AWTTransmissionManager_1 = __webpack_require__(29);
exports.AWTTransmissionManager = AWTTransmissionManager_1.default;
var AWTSerializer_1 = __webpack_require__(9);
exports.AWTSerializer = AWTSerializer_1.default;
var AWTSemanticContext_1 = __webpack_require__(8);
exports.AWTSemanticContext = AWTSemanticContext_1.default;
exports.AWT_COLLECTOR_URL_UNITED_STATES = 'https://us.pipe.aria.microsoft.com/Collector/3.0/';
exports.AWT_COLLECTOR_URL_GERMANY = 'https://de.pipe.aria.microsoft.com/Collector/3.0/';
exports.AWT_COLLECTOR_URL_JAPAN = 'https://jp.pipe.aria.microsoft.com/Collector/3.0/';
exports.AWT_COLLECTOR_URL_AUSTRALIA = 'https://au.pipe.aria.microsoft.com/Collector/3.0/';
exports.AWT_COLLECTOR_URL_EUROPE = 'https://eu.pipe.aria.microsoft.com/Collector/3.0/';
exports.AWT_COLLECTOR_URL_USGOV_DOD = 'https://pf.pipe.aria.microsoft.com/Collector/3.0';
exports.AWT_COLLECTOR_URL_USGOV_DOJ = 'https://tb.pipe.aria.microsoft.com/Collector/3.0';


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* bond_const.ts
* Copyright: Microsoft 2016
*/
Object.defineProperty(exports, "__esModule", { value: true });
//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Tool     : bondc, Version=3.0.1, Build=bond-git.debug.not
//     Template : Microsoft.Bond.Rules.dll#TypeScript.tt
//     File     : bond_const.ts
//
//     Changes to this file may cause incorrect behavior and will be lost when
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------
var _BondDataType;
(function (_BondDataType) {
    _BondDataType[_BondDataType["_BT_STOP"] = 0] = "_BT_STOP";
    _BondDataType[_BondDataType["_BT_STOP_BASE"] = 1] = "_BT_STOP_BASE";
    _BondDataType[_BondDataType["_BT_BOOL"] = 2] = "_BT_BOOL";
    _BondDataType[_BondDataType["_BT_DOUBLE"] = 8] = "_BT_DOUBLE";
    _BondDataType[_BondDataType["_BT_STRING"] = 9] = "_BT_STRING";
    _BondDataType[_BondDataType["_BT_STRUCT"] = 10] = "_BT_STRUCT";
    _BondDataType[_BondDataType["_BT_LIST"] = 11] = "_BT_LIST";
    _BondDataType[_BondDataType["_BT_MAP"] = 13] = "_BT_MAP";
    _BondDataType[_BondDataType["_BT_INT32"] = 16] = "_BT_INT32";
    _BondDataType[_BondDataType["_BT_INT64"] = 17] = "_BT_INT64";
})(_BondDataType = exports._BondDataType || (exports._BondDataType = {}));


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* microsoft.bond.encoding.ts
* Copyright: Microsoft 2016
*/
Object.defineProperty(exports, "__esModule", { value: true });
var microsoft_bond_primitives_1 = __webpack_require__(4);
var microsoft_bond_floatutils_1 = __webpack_require__(19);
var microsoft_bond_utils_1 = __webpack_require__(22);
function _Utf8_GetBytes(value) {
    var array = [];
    for (var i = 0; i < value.length; ++i) {
        var char = value.charCodeAt(i);
        if (char < 0x80) {
            array.push(char);
        }
        else if (char < 0x800) {
            array.push(0xc0 | (char >> 6), 0x80 | (char & 0x3f));
        }
        else if (char < 0xd800 || char >= 0xe000) {
            array.push(0xe0 | (char >> 12), 0x80 | ((char >> 6) & 0x3f), 0x80 | (char & 0x3f));
        }
        else {
            char = 0x10000 + (((char & 0x3ff) << 10) | (value.charCodeAt(++i) & 0x3ff));
            array.push(0xf0 | (char >> 18), 0x80 | ((char >> 12) & 0x3f), 0x80 | ((char >> 6) & 0x3f), 0x80 | (char & 0x3f));
        }
    }
    return array;
}
exports._Utf8_GetBytes = _Utf8_GetBytes;
function _Base64_GetString(inArray) {
    var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var output = [];
    var paddingBytes = inArray.length % 3;
    var toBase64 = function (num) {
        return [lookup.charAt((num >> 18) & 0x3F),
            lookup.charAt((num >> 12) & 0x3F),
            lookup.charAt((num >> 6) & 0x3F),
            lookup.charAt(num & 0x3F)].join('');
    };
    for (var i = 0, length_1 = inArray.length - paddingBytes; i < length_1; i += 3) {
        var temp = (inArray[i] << 16) + (inArray[i + 1] << 8) + (inArray[i + 2]);
        output.push(toBase64(temp));
    }
    switch (paddingBytes) {
        case 1:
            var temp = inArray[inArray.length - 1];
            output.push(lookup.charAt(temp >> 2));
            output.push(lookup.charAt((temp << 4) & 0x3F));
            output.push('==');
            break;
        case 2:
            var temp2 = (inArray[inArray.length - 2] << 8) + (inArray[inArray.length - 1]);
            output.push(lookup.charAt(temp2 >> 10));
            output.push(lookup.charAt((temp2 >> 4) & 0x3F));
            output.push(lookup.charAt((temp2 << 2) & 0x3F));
            output.push('=');
            break;
    }
    return output.join('');
}
exports._Base64_GetString = _Base64_GetString;
function _Varint_GetBytes(value) {
    var array = [];
    while (value & 0xffffff80) {
        array.push((value & 0x7f) | 0x80);
        value >>>= 7;
    }
    array.push(value & 0x7f);
    return array;
}
exports._Varint_GetBytes = _Varint_GetBytes;
function _Varint64_GetBytes(value) {
    var low = value.low;
    var high = value.high;
    var array = [];
    while (high || (0xffffff80 & low)) {
        array.push((low & 0x7f) | 0x80);
        low = ((high & 0x7f) << 25) | (low >>> 7);
        high >>>= 7;
    }
    array.push(low & 0x7f);
    return array;
}
exports._Varint64_GetBytes = _Varint64_GetBytes;
// Note: see notes of Float.
function _Double_GetBytes(value) {
    if (microsoft_bond_utils_1.BrowserChecker._IsDataViewSupport()) {
        var view = new DataView(new ArrayBuffer(8));
        view.setFloat64(0, value, true /*littleEndian*/);
        var array = [];
        for (var i = 0; i < 8; ++i) {
            array.push(view.getUint8(i));
        }
        return array;
    }
    else {
        return microsoft_bond_floatutils_1.FloatUtils._ConvertNumberToArray(value, true /*isDouble*/);
    }
}
exports._Double_GetBytes = _Double_GetBytes;
function _Zigzag_EncodeZigzag32(value) {
    value = microsoft_bond_primitives_1.Number._ToInt32(value);
    return ((value << 1) ^ (value >> (4 /*sizeof(int)*/ * 8 - 1)));
}
exports._Zigzag_EncodeZigzag32 = _Zigzag_EncodeZigzag32;
function _Zigzag_EncodeZigzag64(value) {
    var low = value.low;
    var high = value.high;
    var tmpH = (high << 1) | (low >>> 31);
    var tmpL = low << 1;
    if (high & 0x80000000) {
        tmpH = ~tmpH;
        tmpL = ~tmpL;
    }
    var res = new microsoft_bond_primitives_1.UInt64('0');
    res.low = tmpL;
    res.high = tmpH;
    return res;
}
exports._Zigzag_EncodeZigzag64 = _Zigzag_EncodeZigzag64;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
* microsoft.bond.floatutils.ts
* Copyright: Microsoft 2016
*
* This class will be used to convert float/double to byte array on browsers which don't support html5.
*
* Format: IEEE-754, littleEndian, http://en.wikipedia.org/wiki/IEEE_754-1985
*
*  \note
* 1. Don't have negative zero. All zero will be positive zero.
* 2. If the buffer array passed to ConvertArrayToFloat() is actual NaN or Inifinity value,
*    exception will be raised.
*/
var FloatUtils = /** @class */ (function () {
    function FloatUtils() {
    }
    FloatUtils._ConvertNumberToArray = function (num, isDouble) {
        if (!num) {
            return isDouble ? this._doubleZero : this._floatZero;
        }
        var exponentBits = isDouble ? 11 : 8;
        var precisionBits = isDouble ? 52 : 23;
        // follow IEEE-754, exponent bias is 2^(k-1)-1 where k is the number of bits
        // in the exponent: http://en.wikipedia.org/wiki/Exponent_bias
        var bias = (1 << (exponentBits - 1)) - 1;
        var minExponent = 1 - bias;
        var maxExponent = bias;
        var sign = num < 0 ? 1 : 0;
        num = Math.abs(num);
        var intPart = Math.floor(num);
        var floatPart = num - intPart;
        var len = 2 * (bias + 2) + precisionBits;
        var buffer = new Array(len);
        var i = 0;
        while (i < len) {
            buffer[i++] = 0;
        }
        // caculate the intPart
        i = bias + 2;
        while (i && intPart) {
            buffer[--i] = intPart % 2;
            intPart = Math.floor(intPart / 2);
        }
        // caculate the floatPart
        i = bias + 1;
        while (i < len - 1 && floatPart > 0) {
            floatPart *= 2;
            if (floatPart >= 1) {
                buffer[++i] = 1;
                --floatPart;
            }
            else {
                buffer[++i] = 0;
            }
        }
        // find the first 1
        var firstBit = 0;
        while (firstBit < len && !buffer[firstBit]) {
            firstBit++;
        }
        // caculate exponent
        var exponent = bias + 1 - firstBit;
        // caculate round
        var lastBit = firstBit + precisionBits;
        if (buffer[lastBit + 1]) {
            for (i = lastBit; i > firstBit; --i) {
                buffer[i] = 1 - buffer[i];
                if (buffer) {
                    break;
                }
            }
            if (i === firstBit) {
                ++exponent;
            }
        }
        // check overflow
        if (exponent > maxExponent || intPart) {
            if (sign) {
                return isDouble ? this._doubleNegInifinity : this._floatNegInifinity;
            }
            else {
                return isDouble ? this._doubleInifinity : this._floatInifinity;
            }
        }
        else if (exponent < minExponent) {
            return isDouble ? this._doubleZero : this._floatZero;
        }
        // caculate the result
        if (isDouble) {
            var high = 0;
            for (i = 0; i < 20; ++i) {
                high = (high << 1) | buffer[++firstBit];
            }
            var low = 0;
            for (; i < 52; ++i) {
                low = (low << 1) | buffer[++firstBit];
            }
            high |= (exponent + bias) << 20;
            high = (sign << 31) | (high & 0x7FFFFFFF);
            var resArray = [low & 0xff, (low >> 8) & 0xff, (low >> 16) & 0xff, low >>> 24,
                high & 0xff, (high >> 8) & 0xff, (high >> 16) & 0xff, high >>> 24];
            return resArray;
        }
        else {
            var result = 0;
            for (i = 0; i < 23; ++i) {
                result = (result << 1) | buffer[++firstBit];
            }
            result |= (exponent + bias) << 23;
            result = (sign << 31) | (result & 0x7FFFFFFF);
            var resArray = [result & 0xff, (result >> 8) & 0xff, (result >> 16) & 0xff, result >>> 24];
            return resArray;
        }
    };
    FloatUtils._floatZero = [0x00, 0x00, 0x00, 0x00];
    FloatUtils._doubleZero = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
    FloatUtils._floatInifinity = [0x00, 0x00, 0x80, 0x7F];
    FloatUtils._floatNegInifinity = [0x00, 0x00, 0x80, 0xFF];
    FloatUtils._doubleInifinity = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf0, 0x7f];
    FloatUtils._doubleNegInifinity = [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xf0, 0xff];
    return FloatUtils;
}());
exports.FloatUtils = FloatUtils;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
* microsoft.bond.io.ts
* Copyright: Microsoft 2016
*/
var microsoft_bond_primitives_1 = __webpack_require__(4);
var MemoryStream = /** @class */ (function () {
    function MemoryStream() {
        this._buffer = [];
    }
    /*override*/
    MemoryStream.prototype._WriteByte = function (byte) {
        this._buffer.push(microsoft_bond_primitives_1.Number._ToByte(byte));
    };
    /*override*/
    MemoryStream.prototype._Write = function (buffer, offset, count) {
        while (count--) {
            this._WriteByte(buffer[offset++]);
        }
    };
    /**
     * Returns the array of unsigned bytes from which this stream was created.
     */
    MemoryStream.prototype._GetBuffer = function () {
        return this._buffer;
    };
    return MemoryStream;
}());
exports.MemoryStream = MemoryStream;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* microsoft.bond.ts
* Copyright: Microsoft 2016
*/
Object.defineProperty(exports, "__esModule", { value: true });
var bond_const_1 = __webpack_require__(17);
exports._BondDataType = bond_const_1._BondDataType;
var _Encoding = __webpack_require__(18);
exports._Encoding = _Encoding;
var IO = __webpack_require__(20);
exports.IO = IO;
var microsoft_bond_primitives_1 = __webpack_require__(4);
exports.Int64 = microsoft_bond_primitives_1.Int64;
exports.UInt64 = microsoft_bond_primitives_1.UInt64;
exports.Number = microsoft_bond_primitives_1.Number;
var CompactBinaryProtocolWriter = /** @class */ (function () {
    function CompactBinaryProtocolWriter(stream) {
        this._stream = stream;
    }
    /*override*/
    CompactBinaryProtocolWriter.prototype._WriteBlob = function (blob) {
        this._stream._Write(blob, 0, blob.length);
    };
    /*override*/
    CompactBinaryProtocolWriter.prototype._WriteBool = function (value) {
        this._stream._WriteByte(value ? 1 : 0);
    };
    /*override*/
    CompactBinaryProtocolWriter.prototype._WriteContainerBegin = function (size, elementType) {
        this._WriteUInt8(elementType);
        this._WriteUInt32(size);
    };
    /*override*/
    CompactBinaryProtocolWriter.prototype._WriteMapContainerBegin = function (size, keyType, valueType) {
        this._WriteUInt8(keyType);
        this._WriteUInt8(valueType);
        this._WriteUInt32(size);
    };
    /*override*/
    CompactBinaryProtocolWriter.prototype._WriteDouble = function (value) {
        var array = _Encoding._Double_GetBytes(value);
        this._stream._Write(array, 0, array.length);
    };
    /*override*/
    CompactBinaryProtocolWriter.prototype._WriteFieldBegin = function (type, id, metadata) {
        if (id <= 5) {
            this._stream._WriteByte(type | (id << 5));
        }
        else if (id <= 0xff) {
            this._stream._WriteByte(type | (6 << 5));
            this._stream._WriteByte(id);
        }
        else {
            this._stream._WriteByte(type | (7 << 5));
            this._stream._WriteByte(id);
            this._stream._WriteByte(id >> 8);
        }
    };
    /*override*/
    CompactBinaryProtocolWriter.prototype._WriteInt32 = function (value) {
        value = _Encoding._Zigzag_EncodeZigzag32(value);
        this._WriteUInt32(value);
    };
    /*override*/
    CompactBinaryProtocolWriter.prototype._WriteInt64 = function (value) {
        this._WriteUInt64(_Encoding._Zigzag_EncodeZigzag64(value));
    };
    /*override*/
    CompactBinaryProtocolWriter.prototype._WriteString = function (value) {
        if (value === '') {
            this._WriteUInt32(0 /*length*/);
        }
        else {
            var array = _Encoding._Utf8_GetBytes(value);
            this._WriteUInt32(array.length);
            this._stream._Write(array, 0, array.length);
        }
    };
    /*override*/
    CompactBinaryProtocolWriter.prototype._WriteStructEnd = function (isBase) {
        this._WriteUInt8(isBase ? bond_const_1._BondDataType._BT_STOP_BASE : bond_const_1._BondDataType._BT_STOP);
    };
    /*override*/
    CompactBinaryProtocolWriter.prototype._WriteUInt32 = function (value) {
        var array = _Encoding._Varint_GetBytes(microsoft_bond_primitives_1.Number._ToUInt32(value));
        this._stream._Write(array, 0, array.length);
    };
    /*override*/
    CompactBinaryProtocolWriter.prototype._WriteUInt64 = function (value) {
        var array = _Encoding._Varint64_GetBytes(value);
        this._stream._Write(array, 0, array.length);
    };
    /*override*/
    CompactBinaryProtocolWriter.prototype._WriteUInt8 = function (value) {
        this._stream._WriteByte(microsoft_bond_primitives_1.Number._ToUInt8(value));
    };
    return CompactBinaryProtocolWriter;
}());
exports.CompactBinaryProtocolWriter = CompactBinaryProtocolWriter;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* microsoft.bond.utils.ts
* Copyright: Microsoft 2016
*/
Object.defineProperty(exports, "__esModule", { value: true });
var BrowserChecker = /** @class */ (function () {
    function BrowserChecker() {
    }
    BrowserChecker._IsDataViewSupport = function () {
        return typeof ArrayBuffer !== 'undefined' &&
            typeof DataView !== 'undefined';
    };
    return BrowserChecker;
}());
exports.BrowserChecker = BrowserChecker;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
* AWTClockSkewManager.ts
* @author Abhilash Panwar (abpanwar)
* @copyright Microsoft 2017
*/
/**
* Class to manage clock skew correction.
*/
var AWTClockSkewManager = /** @class */ (function () {
    function AWTClockSkewManager(clockSkewRefreshDurationInMins) {
        this.clockSkewRefreshDurationInMins = clockSkewRefreshDurationInMins;
        this._reset();
    }
    /**
     * Determine if the request can be sent.
     * @return {boolean} True if requests can be sent, false otherwise.
     */
    AWTClockSkewManager.prototype.allowRequestSending = function () {
        if (this._isFirstRequest && !this._clockSkewSet) {
            this._isFirstRequest = false;
            this._allowRequestSending = false;
            return true;
        }
        return this._allowRequestSending;
    };
    /**
     * Determine if clock skew headers should be added to the request.
     * @return {boolean} True if clock skew headers should be added, false otherwise.
     */
    AWTClockSkewManager.prototype.shouldAddClockSkewHeaders = function () {
        return this._shouldAddClockSkewHeaders;
    };
    /**
     * Gets the clock skew header value.
     * @return {string} The clock skew header value.
     */
    AWTClockSkewManager.prototype.getClockSkewHeaderValue = function () {
        return this._clockSkewHeaderValue;
    };
    /**
     * Sets the clock skew header value. Once clock skew is set this method
     * is no-op.
     * @param {string} timeDeltaInMillis - Time delta to be saved as the clock skew header value.
     */
    AWTClockSkewManager.prototype.setClockSkew = function (timeDeltaInMillis) {
        if (!this._clockSkewSet) {
            if (timeDeltaInMillis) {
                this._clockSkewHeaderValue = timeDeltaInMillis;
            }
            else {
                this._shouldAddClockSkewHeaders = false;
            }
            this._clockSkewSet = true;
            this._allowRequestSending = true;
        }
    };
    AWTClockSkewManager.prototype._reset = function () {
        var _this = this;
        this._isFirstRequest = true;
        this._clockSkewSet = false;
        this._allowRequestSending = true;
        this._shouldAddClockSkewHeaders = true;
        this._clockSkewHeaderValue = 'use-collector-delta';
        if (this.clockSkewRefreshDurationInMins > 0) {
            setTimeout(function () { return _this._reset(); }, this.clockSkewRefreshDurationInMins * 60000);
        }
    };
    return AWTClockSkewManager;
}());
exports.default = AWTClockSkewManager;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
* AWTKillSwitch.ts
* @author Abhilash Panwar (abpanwar)
* @copyright Microsoft 2017
*/
Object.defineProperty(exports, "__esModule", { value: true });
var SecToMsMultiplier = 1000;
/**
* Class to stop certain tenants sending events.
*/
var AWTKillSwitch = /** @class */ (function () {
    function AWTKillSwitch() {
        this._killedTokenDictionary = {};
    }
    /**
     * Set the tenants that are to be killed along with the duration. If the duration is
     * a special value identifying that the tokens are too be killed for only this request, then
     * a array of tokens is returned.
     * @param {string} killedTokens - Tokens that are too be marked to be killed.
     * @param {string} killDuration - The duration for which the tokens are to be killed.
     * @return {string[]} The tokens that are killed only for this given request.
     */
    AWTKillSwitch.prototype.setKillSwitchTenants = function (killTokens, killDuration) {
        if (killTokens && killDuration) {
            try {
                var killedTokens = killTokens.split(',');
                if (killDuration === 'this-request-only') {
                    return killedTokens;
                }
                var durationMs = parseInt(killDuration, 10) * SecToMsMultiplier;
                for (var i = 0; i < killedTokens.length; ++i) {
                    this._killedTokenDictionary[killedTokens[i]] = Date.now() + durationMs;
                }
            }
            catch (ex) {
                return [];
            }
        }
        return [];
    };
    /**
     * Determing if the given tenant token has been killed for the moment.
     * @param {string} tenantToken - The token to be checked.
     * @return {boolean} True if token has been killed, false otherwise.
     */
    AWTKillSwitch.prototype.isTenantKilled = function (tenantToken) {
        if (this._killedTokenDictionary[tenantToken] !== undefined && this._killedTokenDictionary[tenantToken] > Date.now()) {
            return true;
        }
        delete this._killedTokenDictionary[tenantToken];
        return false;
    };
    return AWTKillSwitch;
}());
exports.default = AWTKillSwitch;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Enums_1 = __webpack_require__(0);
/**
* Class to batch events.
*/
var AWTRecordBatcher = /** @class */ (function () {
    function AWTRecordBatcher(_outboundQueue, _maxNumberOfEvents) {
        this._outboundQueue = _outboundQueue;
        this._maxNumberOfEvents = _maxNumberOfEvents;
        this._currentBatch = {};
        this._currentNumEventsInBatch = 0;
    }
    /**
     * Add an event to the current batch.
     * If the priority of the event is synchronous, it will also return the batch containing only the synchronous event.
     * @param {object} event - The event that needs to be batched.
     * @return {object} If the priority of the event is synchronous, it will also return the batch containing only the synchronous event.
     * Otherwise returns null.
     */
    AWTRecordBatcher.prototype.addEventToBatch = function (event) {
        if (event.priority === Enums_1.AWTEventPriority.Immediate_sync) {
            //batch immediate priority into its own batch
            var immediateBatch = {};
            immediateBatch[event.apiKey] = [event];
            return immediateBatch;
        }
        else {
            if (this._currentNumEventsInBatch >= this._maxNumberOfEvents) {
                this.flushBatch();
            }
            if (this._currentBatch[event.apiKey] === undefined) {
                this._currentBatch[event.apiKey] = [];
            }
            this._currentBatch[event.apiKey].push(event);
            this._currentNumEventsInBatch++;
        }
        return null;
    };
    /**
     * Flush the current batch so that it is added to the outbound queue.
     */
    AWTRecordBatcher.prototype.flushBatch = function () {
        if (this._currentNumEventsInBatch > 0) {
            this._outboundQueue.push(this._currentBatch);
            this._currentBatch = {};
            this._currentNumEventsInBatch = 0;
        }
    };
    /**
     * Check if there is a batch that contains events.
     */
    AWTRecordBatcher.prototype.hasBatch = function () {
        return this._currentNumEventsInBatch > 0;
    };
    return AWTRecordBatcher;
}());
exports.default = AWTRecordBatcher;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
* AWTRetryPolicy.ts
* @author Abhilash Panwar (abpanwar)
* @copyright Microsoft 2017
*/
var RandomizationLowerThreshold = 0.8;
var RandomizationUpperThreshold = 1.2;
var BaseBackoff = 3000;
var MaxBackoff = 120000;
/**
* Class for retry policy.
*/
var AWTRetryPolicy = /** @class */ (function () {
    function AWTRetryPolicy() {
    }
    /**
     * Determine if the request should be retried for the given status code.
     * The below expression reads that we should only retry for:
     *      - HttpStatusCodes that are smaller than 300.
     *      - HttpStatusCodes greater or equal to 500 (except for 501-NotImplement
     *        and 505-HttpVersionNotSupport).
     *      - HttpStatusCode 408-RequestTimeout.
     * This is based on Microsoft.WindowsAzure.Storage.RetryPolicies.ExponentialRetry class
     * @param {number} httpStatusCode - The status code returned for the request.
     * @return {boolean} True if request should be retried, false otherwise.
     */
    AWTRetryPolicy.shouldRetryForStatus = function (httpStatusCode) {
        /* */
        return !((httpStatusCode >= 300 && httpStatusCode < 500 && httpStatusCode !== 408)
            || (httpStatusCode === 501)
            || (httpStatusCode === 505));
    };
    /**
     * Gets the number of milliseconds to back off before retrying the request. The
     * back off duration is exponentially scaled based on the number of retries already
     * done for the request.
     * @param {number} retriesSoFar - The number of times the request has already been retried.
     * @return {number} The back off duration for the request before it can be retried.
     */
    AWTRetryPolicy.getMillisToBackoffForRetry = function (retriesSoFar) {
        var waitDuration = 0;
        var minBackoff = BaseBackoff * RandomizationLowerThreshold;
        var maxBackoff = BaseBackoff * RandomizationUpperThreshold;
        var randomBackoff = Math.floor(Math.random() * (maxBackoff - minBackoff)) + minBackoff;
        waitDuration = Math.pow(4, retriesSoFar) * randomBackoff;
        return Math.min(waitDuration, MaxBackoff);
    };
    return AWTRetryPolicy;
}());
exports.default = AWTRetryPolicy;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Enums_1 = __webpack_require__(0);
var AWTSerializer_1 = __webpack_require__(9);
var AWTRetryPolicy_1 = __webpack_require__(26);
var AWTKillSwitch_1 = __webpack_require__(24);
var AWTClockSkewManager_1 = __webpack_require__(23);
var Version = __webpack_require__(15);
var Utils = __webpack_require__(1);
var AWTNotificationManager_1 = __webpack_require__(2);
var AWTTransmissionManagerCore_1 = __webpack_require__(3);
var MaxConnections = 2;
var MaxRetries = 1;
var Method = 'POST';
/**
 * Class managing the sending of requests.
 */
var AWTHttpManager = /** @class */ (function () {
    /**
     * @constructor
     * @param {object} requestQueue   - The queue that contains the requests to be sent.
     * @param {string} collectorUrl   - The collector url to which the requests must be sent.
     * @param {object} _queueManager  - The queue manager that we should add requests back to if needed.
     * @param {object} _httpInterface - The http interface that should be used to send HTTP requests.
     */
    function AWTHttpManager(_requestQueue, collectorUrl, _queueManager, _httpInterface, clockSkewRefreshDurationInMins) {
        var _this = this;
        this._requestQueue = _requestQueue;
        this._queueManager = _queueManager;
        this._httpInterface = _httpInterface;
        this._urlString = '?qsp=true&content-type=application%2Fbond-compact-binary&client-id=NO_AUTH&sdk-version='
            + Version.FullVersionString;
        this._killSwitch = new AWTKillSwitch_1.default();
        this._paused = false;
        this._useBeacons = false;
        this._activeConnections = 0;
        this._clockSkewManager = new AWTClockSkewManager_1.default(clockSkewRefreshDurationInMins);
        if (!Utils.isUint8ArrayAvailable()) {
            this._urlString += '&content-encoding=base64';
        }
        this._urlString = collectorUrl + this._urlString;
        if (!this._httpInterface) {
            this._useBeacons = !Utils.isReactNative(); //Only use beacons if not running in React Native
            this._httpInterface = {
                sendPOST: function (urlString, data, ontimeout, onerror, onload, sync) {
                    try {
                        if (Utils.useXDomainRequest()) {
                            var xdr = new XDomainRequest();
                            xdr.open(Method, urlString);
                            //can't get the status code in xdr.
                            xdr.onload = function () {
                                // we will assume onload means the request succeeded.
                                onload(200, null);
                            };
                            xdr.onerror = function () {
                                // we will assume onerror means we need to drop the events.
                                onerror(400, null);
                            };
                            xdr.ontimeout = function () {
                                // we will assume ontimeout means we need to retry the events.
                                ontimeout(500, null);
                            };
                            xdr.send(data);
                        }
                        else if (Utils.isReactNative()) {
                            //Use the fetch API to send events in React Native
                            fetch(urlString, {
                                body: data,
                                method: Method
                            }).then(function (response) {
                                var headerMap = {};
                                if (response.headers) {
                                    response.headers.forEach(function (value, name) {
                                        headerMap[name] = value;
                                    });
                                }
                                onload(response.status, headerMap);
                            }).catch(function (error) {
                                //In case there is an error in the request. Set the status to 0
                                //so that the events can be retried later.
                                onerror(0, {});
                            });
                        }
                        else {
                            var xhr_1 = new XMLHttpRequest();
                            xhr_1.open(Method, urlString, !sync);
                            xhr_1.onload = function () {
                                onload(xhr_1.status, _this._convertAllHeadersToMap(xhr_1.getAllResponseHeaders()));
                            };
                            xhr_1.onerror = function () {
                                onerror(xhr_1.status, _this._convertAllHeadersToMap(xhr_1.getAllResponseHeaders()));
                            };
                            xhr_1.ontimeout = function () {
                                ontimeout(xhr_1.status, _this._convertAllHeadersToMap(xhr_1.getAllResponseHeaders()));
                            };
                            xhr_1.send(data);
                        }
                    }
                    catch (e) {
                        // we will assume exception means we need to drop the events.
                        onerror(400, null);
                    }
                }
            };
        }
    }
    /**
     * Check if there is an idle connection overwhich we can send a request.
     * @return {boolean} True if there is an idle connection, false otherwise.
     */
    AWTHttpManager.prototype.hasIdleConnection = function () {
        return this._activeConnections < MaxConnections;
    };
    /**
     * Send requests in the request queue up if there is an idle connection, sending is
     * not pause and clock skew manager allows sending request.
     */
    AWTHttpManager.prototype.sendQueuedRequests = function () {
        while (this.hasIdleConnection() && !this._paused && this._requestQueue.length > 0
            && this._clockSkewManager.allowRequestSending()) {
            this._activeConnections++;
            this._sendRequest(this._requestQueue.shift(), 0, false);
        }
        //No more requests to send, tell TPM to try to schedule timer
        //in case it was waiting for idle connections
        if (this.hasIdleConnection()) {
            AWTTransmissionManagerCore_1.default.scheduleTimer();
        }
    };
    /**
     * Check if there are no active requests being sent.
     * @return {boolean} True if idle, false otherwise.
     */
    AWTHttpManager.prototype.isCompletelyIdle = function () {
        return this._activeConnections === 0;
    };
    /**
     * Queue all the remaning requests to be sent. The requests will be
     * sent using HTML5 Beacons if they are available.
     */
    AWTHttpManager.prototype.teardown = function () {
        while (this._requestQueue.length > 0) {
            this._sendRequest(this._requestQueue.shift(), 0, true);
        }
    };
    /**
     * Pause the sending of requests. No new requests will be sent.
     */
    AWTHttpManager.prototype.pause = function () {
        this._paused = true;
    };
    /**
     * Resume the sending of requests.
     */
    AWTHttpManager.prototype.resume = function () {
        this._paused = false;
        this.sendQueuedRequests();
    };
    /**
     * Removes any pending requests to be sent.
     */
    AWTHttpManager.prototype.removeQueuedRequests = function () {
        this._requestQueue.length = 0;
    };
    /**
     * Sends a request synchronously to the Aria collector. This api is used to send
     * a request containing a single immediate event.
     *
     * @param request - The request to be sent.
     * @param token   - The token used to send the request.
     */
    AWTHttpManager.prototype.sendSynchronousRequest = function (request, token) {
        //This will not take into account the max connections restriction. Since this is sync, we can 
        //only send one of this request at a time and thus should not worry about multiple connections 
        //being used to send synchronoush events.
        if (this._paused) {
            //If paused then convert to High priority. It will be added back to queue in _sendRequest
            request[token][0].priority = Enums_1.AWTEventPriority.High;
        }
        //Increment active connection since we are still going to use a connection to send the request.
        this._activeConnections++;
        //For sync requests we will not wait for the clock skew. 
        this._sendRequest(request, 0, false, true);
    };
    AWTHttpManager.prototype._sendRequest = function (request, retryCount, isTeardown, isSynchronous) {
        var _this = this;
        if (isSynchronous === void 0) { isSynchronous = false; }
        try {
            if (this._paused) {
                this._activeConnections--;
                this._queueManager.addBackRequest(request);
                return;
            }
            var tokenCount_1 = 0;
            var apikey_1 = '';
            for (var token in request) {
                if (request.hasOwnProperty(token)) {
                    if (!this._killSwitch.isTenantKilled(token)) {
                        if (apikey_1.length > 0) {
                            apikey_1 += ',';
                        }
                        apikey_1 += token;
                        tokenCount_1++;
                    }
                    else {
                        AWTNotificationManager_1.default.eventsRejected(request[token], Enums_1.AWTEventsRejectedReason.KillSwitch);
                        delete request[token];
                    }
                }
            }
            if (tokenCount_1 > 0) {
                var payloadResult = AWTSerializer_1.default.getPayloadBlob(request, tokenCount_1);
                if (payloadResult.remainingRequest) {
                    this._requestQueue.push(payloadResult.remainingRequest);
                }
                var urlString = this._urlString + '&x-apikey=' + apikey_1 + '&client-time-epoch-millis='
                    + Date.now().toString();
                if (this._clockSkewManager.shouldAddClockSkewHeaders()) {
                    urlString = urlString + '&time-delta-to-apply-millis=' + this._clockSkewManager.getClockSkewHeaderValue();
                }
                var data = void 0;
                if (!Utils.isUint8ArrayAvailable()) {
                    data = AWTSerializer_1.default.base64Encode(payloadResult.payloadBlob);
                }
                else {
                    data = new Uint8Array(payloadResult.payloadBlob);
                }
                for (var token in request) {
                    if (request.hasOwnProperty(token)) {
                        //Increment the send attempt count
                        for (var i = 0; i < request[token].length; ++i) {
                            request[token][i].sendAttempt > 0 ? request[token][i].sendAttempt++ : request[token][i].sendAttempt = 1;
                        }
                    }
                }
                //beacons will not be used if an http interface was passed by the customer
                if (this._useBeacons && isTeardown && Utils.isBeaconsSupported()) {
                    if (navigator.sendBeacon(urlString, data)) {
                        //Request sent via beacon.
                        return;
                    }
                }
                //Send sync requests if the request is immediate or we are tearing down telemetry.
                this._httpInterface.sendPOST(urlString, data, function (status, headers) {
                    _this._retryRequestIfNeeded(status, headers, request, tokenCount_1, apikey_1, retryCount, isTeardown, isSynchronous);
                }, function (status, headers) {
                    _this._retryRequestIfNeeded(status, headers, request, tokenCount_1, apikey_1, retryCount, isTeardown, isSynchronous);
                }, function (status, headers) {
                    _this._retryRequestIfNeeded(status, headers, request, tokenCount_1, apikey_1, retryCount, isTeardown, isSynchronous);
                }, isTeardown || isSynchronous);
            }
            else if (!isTeardown) {
                this._handleRequestFinished(false, {}, isTeardown, isSynchronous);
            }
        }
        catch (e) {
            //If we catch any error while sending the request, drop the request.
            this._handleRequestFinished(false, {}, isTeardown, isSynchronous);
        }
    };
    AWTHttpManager.prototype._retryRequestIfNeeded = function (status, headers, request, tokenCount, apikey, retryCount, isTeardown, isSynchronous) {
        var _this = this;
        var shouldRetry = true;
        if (typeof status !== 'undefined') {
            if (headers) {
                var killedTokens = this._killSwitch.setKillSwitchTenants(headers['kill-tokens'], headers['kill-duration-seconds']);
                this._clockSkewManager.setClockSkew(headers['time-delta-millis']);
                for (var i = 0; i < killedTokens.length; ++i) {
                    AWTNotificationManager_1.default.eventsRejected(request[killedTokens[i]], Enums_1.AWTEventsRejectedReason.KillSwitch);
                    delete request[killedTokens[i]];
                    tokenCount--;
                }
            }
            else {
                this._clockSkewManager.setClockSkew(null);
            }
            if (status === 200) {
                this._handleRequestFinished(true, request, isTeardown, isSynchronous);
                return;
            }
            if (!AWTRetryPolicy_1.default.shouldRetryForStatus(status) || tokenCount <= 0) {
                shouldRetry = false;
            }
        }
        if (shouldRetry) {
            if (isSynchronous) {
                //Synchronous events only contain a single event so the apiKey is equal to the token for that event.
                //Convert the event to High priority and add back to queue to be sent as High event.
                this._activeConnections--;
                request[apikey][0].priority = Enums_1.AWTEventPriority.High;
                this._queueManager.addBackRequest(request);
            }
            else if (retryCount < MaxRetries) {
                for (var token in request) {
                    if (request.hasOwnProperty(token)) {
                        AWTNotificationManager_1.default.eventsRetrying(request[token]);
                    }
                }
                setTimeout(function () { return _this._sendRequest(request, retryCount + 1, false); }, AWTRetryPolicy_1.default.getMillisToBackoffForRetry(retryCount));
            }
            else {
                this._activeConnections--;
                AWTTransmissionManagerCore_1.default.backOffTransmission();
                this._queueManager.addBackRequest(request);
            }
        }
        else {
            this._handleRequestFinished(false, request, isTeardown, isSynchronous);
        }
    };
    AWTHttpManager.prototype._handleRequestFinished = function (success, request, isTeardown, isSynchronous) {
        if (success) {
            AWTTransmissionManagerCore_1.default.clearBackOff();
        }
        for (var token in request) {
            if (request.hasOwnProperty(token)) {
                if (success) {
                    AWTNotificationManager_1.default.eventsSent(request[token]);
                }
                else {
                    AWTNotificationManager_1.default.eventsDropped(request[token], Enums_1.AWTEventsDroppedReason.NonRetryableStatus);
                }
            }
        }
        this._activeConnections--;
        if (!isSynchronous && !isTeardown) {
            //Only continue sending more requests as long as the current request was not an synchronous request or sent
            //during teardown. We want to return after just sending this one sync request.
            this.sendQueuedRequests();
        }
    };
    /**
     * Converts the XHR getAllResponseHeaders to a map containing the header key and value.
     */
    AWTHttpManager.prototype._convertAllHeadersToMap = function (headersString) {
        var headers = {};
        if (headersString) {
            var headersArray = headersString.split('\n');
            for (var i = 0; i < headersArray.length; ++i) {
                var header = headersArray[i].split(': ');
                headers[header[0]] = header[1];
            }
        }
        return headers;
    };
    return AWTHttpManager;
}());
exports.default = AWTHttpManager;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Enums_1 = __webpack_require__(0);
var AWTHttpManager_1 = __webpack_require__(27);
var AWTTransmissionManagerCore_1 = __webpack_require__(3);
var AWTRecordBatcher_1 = __webpack_require__(25);
var AWTNotificationManager_1 = __webpack_require__(2);
var Utils = __webpack_require__(1);
var UploadNowCheckTimer = 250;
var MaxNumberEventPerBatch = 500;
var MaxSendAttempts = 6;
/**
 * Class that manages adding events to inbound queues and batching of events
 * into requests.
 */
var AWTQueueManager = /** @class */ (function () {
    /**
     * @constructor
     * @param {string} collectorUrl - The collector url to which the requests must be sent.
     */
    function AWTQueueManager(collectorUrl, _queueSizeLimit, xhrOverride, clockSkewRefreshDurationInMins) {
        this._queueSizeLimit = _queueSizeLimit;
        this._isCurrentlyUploadingNow = false;
        this._uploadNowQueue = [];
        this._shouldDropEventsOnPause = false;
        this._paused = false;
        this._queueSize = 0;
        this._outboundQueue = [];
        this._inboundQueues = {};
        this._inboundQueues[Enums_1.AWTEventPriority.High] = [];
        this._inboundQueues[Enums_1.AWTEventPriority.Normal] = [];
        this._inboundQueues[Enums_1.AWTEventPriority.Low] = [];
        this._addEmptyQueues();
        this._batcher = new AWTRecordBatcher_1.default(this._outboundQueue, MaxNumberEventPerBatch);
        this._httpManager = new AWTHttpManager_1.default(this._outboundQueue, collectorUrl, this, xhrOverride, clockSkewRefreshDurationInMins);
    }
    /**
     * Add an event to the appropriate inbound queue based on its priority.
     * @param {object} event - The event to be added to the queue.
     */
    AWTQueueManager.prototype.addEvent = function (event) {
        if (!Utils.isPriority(event.priority)) {
            //If invalid priority, then send it with normal priority
            event.priority = Enums_1.AWTEventPriority.Normal;
        }
        if (event.priority === Enums_1.AWTEventPriority.Immediate_sync) {
            //Log event synchronously
            this._httpManager.sendSynchronousRequest(this._batcher.addEventToBatch(event), event.apiKey);
        }
        else if (this._queueSize < this._queueSizeLimit) {
            this._addEventToProperQueue(event);
        }
        else {
            //Drop old event from lower or equal priority
            if (this._dropEventWithPriorityOrLess(event.priority)) {
                this._addEventToProperQueue(event);
            }
            else {
                //Can't drop events from current queues because the all the slots are taken by queues that are being flushed.
                AWTNotificationManager_1.default.eventsDropped([event], Enums_1.AWTEventsDroppedReason.QueueFull);
            }
        }
    };
    /**
     * Batch and send events currently in the queue for the given priority.
     * @param {enum} priority - Priority for which to send events.
     */
    AWTQueueManager.prototype.sendEventsForPriorityAndAbove = function (priority) {
        this._batchEvents(priority);
        this._httpManager.sendQueuedRequests();
    };
    /**
     * Check if the inbound queues or batcher has any events that can be sent presently.
     * @return {boolean} True if there are events, false otherwise.
     */
    AWTQueueManager.prototype.hasEvents = function () {
        return (this._inboundQueues[Enums_1.AWTEventPriority.High][0].length > 0 || this._inboundQueues[Enums_1.AWTEventPriority.Normal][0].length > 0
            || this._inboundQueues[Enums_1.AWTEventPriority.Low][0].length > 0 || this._batcher.hasBatch())
            && this._httpManager.hasIdleConnection();
    };
    /**
     * Add back the events from a failed request back to the queue.
     * @param {object} request - The request whose events need to be added back to the batcher.
     */
    AWTQueueManager.prototype.addBackRequest = function (request) {
        if (!this._paused || !this._shouldDropEventsOnPause) {
            for (var token in request) {
                if (request.hasOwnProperty(token)) {
                    for (var i = 0; i < request[token].length; ++i) {
                        if (request[token][i].sendAttempt < MaxSendAttempts) {
                            this.addEvent(request[token][i]);
                        }
                        else {
                            AWTNotificationManager_1.default.eventsDropped([request[token][i]], Enums_1.AWTEventsDroppedReason.NonRetryableStatus);
                        }
                    }
                }
            }
            AWTTransmissionManagerCore_1.default.scheduleTimer();
        }
    };
    /**
     * Batch all current events in the queues and send them.
     */
    AWTQueueManager.prototype.teardown = function () {
        if (!this._paused) {
            this._batchEvents(Enums_1.AWTEventPriority.Low);
            this._httpManager.teardown();
        }
    };
    /**
     * Sends events for all priority for the current inbound queue.
     * This method adds new inbound queues to which new events will be added.
     * @param {function} callback - The function to be called when uploadNow is finished.
     */
    AWTQueueManager.prototype.uploadNow = function (callback) {
        var _this = this;
        this._addEmptyQueues();
        if (!this._isCurrentlyUploadingNow) {
            this._isCurrentlyUploadingNow = true;
            setTimeout(function () { return _this._uploadNow(callback); }, 0);
        }
        else {
            this._uploadNowQueue.push(callback);
        }
    };
    /**
     * Pause the tranmission of any requests
     */
    AWTQueueManager.prototype.pauseTransmission = function () {
        this._paused = true;
        this._httpManager.pause();
        if (this.shouldDropEventsOnPause) {
            this._queueSize -= (this._inboundQueues[Enums_1.AWTEventPriority.High][0].length +
                this._inboundQueues[Enums_1.AWTEventPriority.Normal][0].length + this._inboundQueues[Enums_1.AWTEventPriority.Low][0].length);
            this._inboundQueues[Enums_1.AWTEventPriority.High][0] = [];
            this._inboundQueues[Enums_1.AWTEventPriority.Normal][0] = [];
            this._inboundQueues[Enums_1.AWTEventPriority.Low][0] = [];
            this._httpManager.removeQueuedRequests();
        }
    };
    /**
     * Resumes transmission of events.
     */
    AWTQueueManager.prototype.resumeTransmission = function () {
        this._paused = false;
        this._httpManager.resume();
    };
    /**
     * Determines whether events in the queues should be dropped when transmission is paused.
     */
    AWTQueueManager.prototype.shouldDropEventsOnPause = function (shouldDropEventsOnPause) {
        this._shouldDropEventsOnPause = shouldDropEventsOnPause;
    };
    /**
     * Remove the first queues for all priorities in the inbound queues map. This is called
     * when transmission manager has finished flushing the events in the old queues. We now make
     * the next queue the primary queue.
     */
    AWTQueueManager.prototype._removeFirstQueues = function () {
        this._inboundQueues[Enums_1.AWTEventPriority.High].shift();
        this._inboundQueues[Enums_1.AWTEventPriority.Normal].shift();
        this._inboundQueues[Enums_1.AWTEventPriority.Low].shift();
    };
    /**
     * Add empty queues for all priorities in the inbound queues map. This is called
     * when Transmission Manager is being flushed. This ensures that new events added
     * after flush are stored separately till we flush the current events.
     */
    AWTQueueManager.prototype._addEmptyQueues = function () {
        this._inboundQueues[Enums_1.AWTEventPriority.High].push([]);
        this._inboundQueues[Enums_1.AWTEventPriority.Normal].push([]);
        this._inboundQueues[Enums_1.AWTEventPriority.Low].push([]);
    };
    AWTQueueManager.prototype._addEventToProperQueue = function (event) {
        if (!this._paused || !this._shouldDropEventsOnPause) {
            this._queueSize++;
            this._inboundQueues[event.priority][this._inboundQueues[event.priority].length - 1].push(event);
        }
    };
    AWTQueueManager.prototype._dropEventWithPriorityOrLess = function (priority) {
        var currentPriority = Enums_1.AWTEventPriority.Low;
        while (currentPriority <= priority) {
            if (this._inboundQueues[currentPriority][this._inboundQueues[currentPriority].length - 1].length > 0) {
                //Dropped oldest event from lowest possible priority
                AWTNotificationManager_1.default.eventsDropped([this._inboundQueues[currentPriority][this._inboundQueues[currentPriority].length - 1].shift()], Enums_1.AWTEventsDroppedReason.QueueFull);
                return true;
            }
            currentPriority++;
        }
        return false;
    };
    AWTQueueManager.prototype._batchEvents = function (priority) {
        var priorityToProcess = Enums_1.AWTEventPriority.High;
        while (priorityToProcess >= priority) {
            while (this._inboundQueues[priorityToProcess][0].length > 0) {
                var event_1 = this._inboundQueues[priorityToProcess][0].pop();
                this._queueSize--;
                this._batcher.addEventToBatch(event_1);
            }
            priorityToProcess--;
        }
        this._batcher.flushBatch();
    };
    AWTQueueManager.prototype._uploadNow = function (callback) {
        var _this = this;
        if (this.hasEvents()) {
            this.sendEventsForPriorityAndAbove(Enums_1.AWTEventPriority.Low);
        }
        this._checkOutboundQueueEmptyAndSent(function () {
            //Move the next queues to be primary
            _this._removeFirstQueues();
            if (callback !== null && callback !== undefined) {
                callback();
            }
            if (_this._uploadNowQueue.length > 0) {
                setTimeout(function () { return _this._uploadNow(_this._uploadNowQueue.shift()); }, 0);
            }
            else {
                _this._isCurrentlyUploadingNow = false;
                if (_this.hasEvents()) {
                    AWTTransmissionManagerCore_1.default.scheduleTimer();
                }
            }
        });
    };
    AWTQueueManager.prototype._checkOutboundQueueEmptyAndSent = function (callback) {
        var _this = this;
        if (this._httpManager.isCompletelyIdle()) {
            callback();
        }
        else {
            setTimeout(function () { return _this._checkOutboundQueueEmptyAndSent(callback); }, UploadNowCheckTimer);
        }
    };
    return AWTQueueManager;
}());
exports.default = AWTQueueManager;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AWTTransmissionManagerCore_1 = __webpack_require__(3);
/**
 * The AWTTransmissionManager calss is a wrapper class that exposes some of the
 * Transmission functionality needed by other Aria modules.
 */
var AWTTransmissionManager = /** @class */ (function () {
    function AWTTransmissionManager() {
    }
    /**
     * Sets the event handler used by the tranmission manager.
     * The default event handler is the Inbound queue manager. This handler
     * is used to batch and send events to Aria. If you intend to send events
     * to Aria please make sure that your event handler forwards events to the Inbound
     * Queue Manager. You can retrieve the Inbound Queue Manager by calling
     * getEventsHandler before you set your handler.
     * @param {object} eventsHandler - An AWTEventHandler event handler used by the tranmission
     * manager.
     */
    AWTTransmissionManager.setEventsHandler = function (eventsHandler) {
        AWTTransmissionManagerCore_1.default.setEventsHandler(eventsHandler);
    };
    /**
     * Gets the current event handler used by the tranmission manager.
     * @return {object} An AWTEventHandler event handler used by the tranmission manager.
     */
    AWTTransmissionManager.getEventsHandler = function () {
        return AWTTransmissionManagerCore_1.default.getEventsHandler();
    };
    /**
     * The scheduleTimer method tries to schedule the waiting period after which events are sent. If there are
     * no events to be sent, or if there is already a timer scheduled, or if the
     * http manager doesn't have any idle connections, then this method is no-op.
     */
    AWTTransmissionManager.scheduleTimer = function () {
        AWTTransmissionManagerCore_1.default.scheduleTimer();
    };
    return AWTTransmissionManager;
}());
exports.default = AWTTransmissionManager;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(16);


/***/ })
/******/ ]);
});
//# sourceMappingURL=aria-webjs-sdk-1.8.3.js.map