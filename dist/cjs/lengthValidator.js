"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.lengthValidator = exports.lengthValidatorNoNormalize = exports.toLengthOptions = void 0;

var _ValidationUtils = require("./ValidationUtils");

var _fjl = require("fjl");

/**
 * Created by Ely on 1/21/2015.
 * @module lengthValidator
 * @todo Allow validator option generators to receive `zero` object (object on which to extend on).
 * @todo Allow validator option generators to receive more than one options object.
 */
var
/**
 * Normalizes `lengthValidator` options.
 * @function module:lengthValidator.toLengthOptions
 * @param options {Object}
 * @returns {Object}
 */
toLengthOptions = function toLengthOptions(options) {
  var _options = (0, _fjl.defineEnumProps)([[Number, 'min', 0], [Number, 'max', Number.MAX_SAFE_INTEGER]], (0, _ValidationUtils.toValidationOptions)());

  _options.messageTemplates = {
    NOT_OF_TYPE: function NOT_OF_TYPE(value) {
      return "Value does not have a `length` property.  " + "Type received: `".concat((0, _fjl.typeOf)(value), "`.  ") + "Value received: `".concat(value, "`.");
    },
    NOT_WITHIN_RANGE: function NOT_WITHIN_RANGE(value, ops) {
      return "Value's length is not within range " + "".concat(ops.min, " to ").concat(ops.max, ".  ") + "Evaluated length is `".concat(value.length, "`.  ") + "Value received: `".concat(value, "`.");
    }
  };
  return options ? (0, _fjl.assignDeep)(_options, options) : _options;
},

/**
 * Validates whether given value has a length and whether length is between
 *  given range (if given) but doesn't normalize options.
 *  (@see `toLengthOptions` for range props).
 * @function module:lengthValidator.lengthValidatorNoNormalize
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
lengthValidatorNoNormalize = (0, _fjl.curry)(function (options, value) {
  var messages = [];
  var valLength,
      isWithinRange,
      result = false;

  if ((0, _ValidationUtils.isOneOf)(value, 'Null', 'Undefined', 'NaN', 'Symbol') || !value.hasOwnProperty('length')) {
    messages.push((0, _ValidationUtils.getErrorMsgByKey)(options, 'NOT_OF_TYPE', value));
    return (0, _ValidationUtils.toValidationResult)({
      result: result,
      messages: messages,
      value: value
    });
  }

  valLength = value.length;
  isWithinRange = valLength >= options.min && valLength <= options.max;

  if (!isWithinRange) {
    messages.push((0, _ValidationUtils.getErrorMsgByKey)(options, 'NOT_WITHIN_RANGE', value));
  } else {
    result = true;
  }

  return (0, _ValidationUtils.toValidationResult)({
    result: result,
    messages: messages,
    value: value
  });
}),

/**
 * Validates whether given value has a length and whether length is between
 *  given range (if given).  Same as `lengthValidatorNoNormalize` except normalizes incoming options.
 *  (@see `toLengthOptions` for more on options).
 * @function module:lengthValidator.lengthValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
lengthValidator = (0, _fjl.curry)(function (options, value) {
  return lengthValidatorNoNormalize(toLengthOptions(options), value);
});

exports.lengthValidator = lengthValidator;
exports.lengthValidatorNoNormalize = lengthValidatorNoNormalize;
exports.toLengthOptions = toLengthOptions;
var _default = lengthValidator;
exports["default"] = _default;