'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.toValidationResult = exports.toValidationOptions = exports.getErrorMsgByKey = exports.defaultValueObscurator = undefined;

var _fjl = require('fjl');

var _fjlMutable = require('fjl-mutable');

/**
 * Created by Ely on 7/21/2014.
 * Initial idea borrowed from Zend Framework 2's Zend/Validator
 * @module ValidatorOptions
 */
var

/**
 * Default value obscurator.
 * @function module:ValidatorOptions.defaultValueObscurator
 * @param x {*} - Value to obscurate.
 * @returns {String} - Obscurated value.
 */
defaultValueObscurator = exports.defaultValueObscurator = function defaultValueObscurator(x) {
    return (0, _fjl.repeat)((x + '').length, '*');
},


/**
 * Gets an error message by `messageTemplates` key from `options` object.
 * @function module:ValidatorOptions.getErrorMsgByKey
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
 * @function module:ValidatorOptions.toValidationOptions
 * @param options {...Object}
 * @returns {Object}
 */
toValidationOptions = exports.toValidationOptions = function toValidationOptions() {
    for (var _len = arguments.length, options = Array(_len), _key = 0; _key < _len; _key++) {
        options[_key] = arguments[_key];
    }

    var _options = (0, _fjlMutable.defineEnumProps$)([[Object, 'messageTemplates', {}], [Boolean, 'valueObscured', false], [Function, 'valueObscurator', defaultValueObscurator]], {});
    return options.length ? (0, _fjl.apply)(_fjl.assignDeep, [_options].concat(options.filter(_fjl.isset))) : _options;
},


/**
 * Returns a strongly typed, normalized validation result object.
 * @function module:ValidatorOptions.toValidationResult
 * @param options {Object}
 * @returns {*}
 */
toValidationResult = exports.toValidationResult = function toValidationResult(options) {
    var _options = (0, _fjlMutable.defineEnumProps$)([[Boolean, 'result', false], [Array, 'messages', []]], {});
    _options.value = undefined;
    return options ? (0, _fjl.assign)(_options, options) : _options;
};

exports.default = toValidationResult;