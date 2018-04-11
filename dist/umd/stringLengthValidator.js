'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.stringLengthValidator = exports.stringLengthValidator$ = exports.stringLengthValidatorNoNormalize$ = exports.toStringLengthOptions = undefined;

var _ValidationUtils = require('./ValidationUtils');

var _fjl = require('fjl');

var _fjlMutable = require('fjl-mutable');

var

/**
 * Normalizes (ensures has expected properties) `stringLengthValidator`'s options.
 * @function module:stringLengthValidator.toStringLengthOptions
 * @param options {Object}
 * @returns {Object}
 */
toStringLengthOptions = exports.toStringLengthOptions = function toStringLengthOptions(options) {
    var _options = (0, _fjlMutable.defineEnumProps$)([[Number, 'min', 0], [Number, 'max', Number.MAX_SAFE_INTEGER]], (0, _ValidationUtils.toValidationOptions)());

    _options.messageTemplates = {
        NOT_OF_TYPE: function NOT_OF_TYPE(value) {
            return 'Value is not a String.  ' + ('Value type received: ' + (0, _fjl.typeOf)(value) + '.  ') + ('Value received: "' + value + '".');
        },
        NOT_WITHIN_RANGE: function NOT_WITHIN_RANGE(value, ops) {
            return 'Value is not within range ' + (ops.min + ' to ' + ops.max + '.  ') + 'Value length given: "' + value.length + '".  ' + 'Value received: "' + value + '".';
        }
    };

    return options ? (0, _fjl.assignDeep)(_options, options) : _options;
},


/**
 * Same as `stringLengthValidator$` except doesn't normalize the incoming options.
 * Useful for cases where you have to call `toStringLengthValidator` options from outside of the `stringLengthValidator` call (
 *  helps eliminate one call in this case).  Also useful for extreme cases (cases where you have hundreds of validators
 *  and want to pull out every ounce of performance from them possible).
 * @function module:stringLengthValidator.stringLengthValidatorNoNormalize$
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
stringLengthValidatorNoNormalize$ = exports.stringLengthValidatorNoNormalize$ = function stringLengthValidatorNoNormalize$(options, value) {
    var messages = [],
        isOfType = (0, _fjl.isString)(value),
        valLength = isOfType ? value.length : 0,
        isWithinRange = valLength >= options.min && valLength <= options.max;
    if (!isOfType) {
        messages.push((0, _ValidationUtils.getErrorMsgByKey)(options, 'NOT_OF_TYPE', value));
    } else if (!isWithinRange) {
        messages.push((0, _ValidationUtils.getErrorMsgByKey)(options, 'NOT_WITHIN_RANGE', value));
    }
    return (0, _ValidationUtils.toValidationResult)({
        result: isOfType && isWithinRange,
        messages: messages,
        value: value
    });
},


/**
 * @function module:stringLengthValidator.stringLengthValidator$
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
stringLengthValidator$ = exports.stringLengthValidator$ = function stringLengthValidator$(options, value) {
    return stringLengthValidatorNoNormalize$(toStringLengthOptions(options), value);
},


/**
 * @function module:stringLengthValidator.stringLengthValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
stringLengthValidator = exports.stringLengthValidator = (0, _fjl.curry)(stringLengthValidator$); /**
                                                                                                  * Created by Ely on 1/21/2015.
                                                                                                  * @module stringLengthValidator
                                                                                                  */
exports.default = stringLengthValidator;