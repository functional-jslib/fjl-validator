'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.regexValidator = exports.regexValidator$ = exports.regexValidatorNoNormalize$ = exports.toRegexValidatorOptions = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Created by Ely on 7/21/2014.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Module for validating a value by regular expression.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @module regexValidator
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */


var _ValidationUtils = require('./ValidationUtils');

var _fjlMutable = require('fjl-mutable');

var _fjl = require('fjl');

var

/**
 * Normalizes `regexValidator` options.
 * @function module:regexValidator.toRegexValidatorOptions
 * @param options {Object}
 * @returns {Object}
 */
toRegexValidatorOptions = exports.toRegexValidatorOptions = function toRegexValidatorOptions(options) {
    var _defineEnumProp$ = (0, _fjlMutable.defineEnumProp$)(RegExp, (0, _ValidationUtils.toValidationOptions)(), 'pattern', /./),
        _defineEnumProp$2 = _slicedToArray(_defineEnumProp$, 1),
        _options = _defineEnumProp$2[0];

    _options.messageTemplates = {
        DOES_NOT_MATCH_PATTERN: function DOES_NOT_MATCH_PATTERN(value, ops) {
            return 'The value passed in does not match pattern"' + ops.pattern + '".  Value passed in: "' + value + '".';
        }
    };
    return options ? (0, _fjl.assignDeep)(_options, options) : _options;
},


/**
 * Same as `regexValidator` except this version is not curried and doesn't normalize incoming `options` parameter.
 * @note Useful when the user has a need for calling `toRegexValidatorOptions`
 *  externally/from-outside-the-`regexValidator` call (helps to remove that one extra call in this case (since
 *  `regexValidator` calls `toRegexValidatorOptions` internally)).
 * @function module:regexValidator.regexValidatorNoNormalize$
 * @param options {Object}
 * @param value {*}
 * @returns {*}
 */
regexValidatorNoNormalize$ = exports.regexValidatorNoNormalize$ = function regexValidatorNoNormalize$(options, value) {
    var result = options.pattern.test(value),


    // If test failed
    messages = !result ? [(0, _ValidationUtils.getErrorMsgByKey)(options, 'DOES_NOT_MATCH_PATTERN', value)] : [];

    return (0, _ValidationUtils.toValidationResult)({ result: result, messages: messages, value: value });
},


/**
 * Un-curried version of `regexValidator`.
 * @function module:regexValidator.regexValidator$
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
regexValidator$ = exports.regexValidator$ = function regexValidator$(options, value) {
    return regexValidatorNoNormalize$(toRegexValidatorOptions(options), value);
},


/**
 * Validates a value with the regex `pattern` option passed in.
 * @curried
 * @function module:regexValidator.regexValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
regexValidator = exports.regexValidator = (0, _fjl.curry)(regexValidator$);

exports.default = regexValidator;