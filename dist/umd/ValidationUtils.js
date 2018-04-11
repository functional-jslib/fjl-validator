'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.toValidationResult = exports.toValidationOptions = exports.getErrorMsgByKey = exports.defaultValueObscurator = undefined;

var _fjl = require('fjl');

var _fjlMutable = require('fjl-mutable');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                     * Created by Ely on 7/21/2014.
                                                                                                                                                                                                     * Initial idea borrowed from Zend Framework 2's Zend/Validator
                                                                                                                                                                                                     * @module ValidationUtils
                                                                                                                                                                                                     */


var

/**
 * Default value obscurator.
 * @function module:ValidationUtils.defaultValueObscurator
 * @param x {*} - Value to obscurate.
 * @returns {String} - Obscurated value.
 */
defaultValueObscurator = exports.defaultValueObscurator = function defaultValueObscurator(x) {
    return (0, _fjl.repeat)((x + '').length, '*');
},


/**
 * Gets an error message by `messageTemplates` key from `options` object.
 * @function module:ValidationUtils.getErrorMsgByKey
 * @param options {Object}
 * @param key {(String|Function)}
 * @param value {*}
 * @returns {String|undefined} - Error message if successfully resolved one else `undefined`.
 * @curried
 */
getErrorMsgByKey = exports.getErrorMsgByKey = (0, _fjl.curry)(function (options, key, value) {
    var message = void 0;

    var messageTemplates = options.messageTemplates,
        valueObscured = options.valueObscured,
        valueObscurator = options.valueObscurator,
        _value = valueObscured ? valueObscurator(value) : value;

    if ((0, _fjl.isFunction)(key)) {
        message = (0, _fjl.call)(key, _value, options);
    } else if (!(0, _fjl.isString)(key) || !messageTemplates || !messageTemplates[key]) {
        return;
    } else if ((0, _fjl.isFunction)(messageTemplates[key])) {
        message = (0, _fjl.call)(messageTemplates[key], _value, options);
    } else {
        message = messageTemplates[key];
    }
    return message;
}),


/**
 * Returns a strongly typed/normalized ValidatorOptions object.
 * @function module:ValidationUtils.toValidationOptions
 * @param options {...Object}
 * @returns {Object}
 */
toValidationOptions = exports.toValidationOptions = function toValidationOptions() {
    for (var _len = arguments.length, options = Array(_len), _key = 0; _key < _len; _key++) {
        options[_key] = arguments[_key];
    }

    return _fjl.assignDeep.apply(undefined, [(0, _fjlMutable.defineEnumProps$)([[Object, 'messageTemplates', {}], [Boolean, 'valueObscured', false], [Function, 'valueObscurator', defaultValueObscurator]], {})].concat(_toConsumableArray(options.length ? options : [{}])));
},


/**
 * Returns a strongly typed, normalized validation result object.
 * @function module:ValidationUtils.toValidationResult
 * @param options {...Object}
 * @returns {*}
 */
toValidationResult = exports.toValidationResult = function toValidationResult() {
    for (var _len2 = arguments.length, options = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        options[_key2] = arguments[_key2];
    }

    return _fjl.assignDeep.apply(undefined, [(0, _fjlMutable.defineEnumProps$)([[Boolean, 'result', false], [Array, 'messages', []]], {}), { value: undefined }].concat(_toConsumableArray(options.length ? options : [{}])));
};

exports.default = toValidationResult;