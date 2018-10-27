"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.lengthValidator = exports.toLengthOptions = void 0;

var _ValidationUtils = require("./ValidationUtils");

var _fjl = require("fjl");

var _fjlMutable = require("fjl-mutable");

/**
 * Created by Ely on 1/21/2015.
 * @module lengthValidator
 */
var
/**
 * Normalizes `lengthValidator` options.
 * @function module:lengthValidator.toLengthOptions
 * @param options {Object}
 * @returns {Object}
 */
toLengthOptions = function toLengthOptions(options) {
  var _options = (0, _fjlMutable.defineEnumProps$)([[Number, 'min', 0], [Number, 'max', Number.MAX_SAFE_INTEGER]], (0, _ValidationUtils.toValidationOptions)());

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
 *  given range (@see options for range props).
 * @function module:lengthValidator.lengthValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
lengthValidator = (0, _fjl.curry)(function (options, value) {
  var ops = toLengthOptions(options),
      messages = [];
  var valLength,
      isWithinRange,
      result = false;

  if ((0, _ValidationUtils.isOneOf)(value, 'Null', 'Undefined', 'NaN', 'Symbol') || !value.hasOwnProperty('length')) {
    messages.push((0, _ValidationUtils.getErrorMsgByKey)(ops, 'NOT_OF_TYPE', value));
    return (0, _ValidationUtils.toValidationResult)({
      result: result,
      messages: messages,
      value: value
    });
  }

  valLength = value.length;
  isWithinRange = valLength >= ops.min && valLength <= ops.max;

  if (!isWithinRange) {
    messages.push((0, _ValidationUtils.getErrorMsgByKey)(ops, 'NOT_WITHIN_RANGE', value));
  } else {
    result = true;
  }

  return (0, _ValidationUtils.toValidationResult)({
    result: result,
    messages: messages,
    value: value
  });
});

exports.lengthValidator = lengthValidator;
exports.toLengthOptions = toLengthOptions;
var _default = lengthValidator;
exports.default = _default;