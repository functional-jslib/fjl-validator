'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.regexValidator = exports.regexValidatorOptions = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Created by Ely on 7/21/2014.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @module regexValidator
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */


var _ValidationUtils = require('./ValidationUtils');

var _fjlMutable = require('fjl-mutable');

var _fjl = require('fjl');

var

/**
 * @function module:regexValidator.regexValidatorOptions
 * @param options {Object}
 * @returns {Object}
 */
regexValidatorOptions = exports.regexValidatorOptions = function regexValidatorOptions(options) {
    var _defineEnumProp$ = (0, _fjlMutable.defineEnumProp$)(RegExp, {}, 'pattern', /./),
        _defineEnumProp$2 = _slicedToArray(_defineEnumProp$, 1),
        _options = _defineEnumProp$2[0];

    _options.messageTemplates = {
        DOES_NOT_MATCH_PATTERN: function DOES_NOT_MATCH_PATTERN(value, ops) {
            return 'The value passed in does not match pattern"' + ops.pattern + '".  Value passed in: "' + value + '".';
        }
    };
    return (0, _ValidationUtils.toValidationOptions)(options ? (0, _fjl.assignDeep)(_options, options) : _options);
},


/**
 * @function module:regexValidator.regexValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
regexValidator = exports.regexValidator = (0, _fjl.curry)(function (options, value) {
    var ops = regexValidatorOptions(options),
        result = ops.pattern.test(value),


    // If test failed
    messages = !result ? [(0, _ValidationUtils.getErrorMsgByKey)(ops, 'DOES_NOT_MATCH_PATTERN', value)] : [];

    return (0, _ValidationUtils.toValidationResult)({ result: result, messages: messages, value: value });
});

exports.default = regexValidator;