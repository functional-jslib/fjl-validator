"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.notEmptyValidator1 = exports.notEmptyValidator = exports.notEmptyValidatorNoNormalize = exports.toNotEmptyOptions = void 0;

var _ValidationUtils = require("./ValidationUtils");

var _fjl = require("fjl");

/**
 * Created by Ely on 7/21/2014.
 * @module notEmptyValidator
 */
var
/**
 * Normalizes incoming options so that they are valid `notEmptyValidator` options.
 * @note currently `notEmptyValidator` only takes the `messageTemplates` option (may
 *  have more options in the future).
 * @function module:notEmptyValidator.toNotEmptyOptions
 * @param options {Object}
 * @returns {Object}
 */
toNotEmptyOptions = function toNotEmptyOptions(options) {
  return (0, _ValidationUtils.toValidationOptions)({
    messageTemplates: {
      EMPTY_NOT_ALLOWED: function EMPTY_NOT_ALLOWED() {
        return 'Empty values are not allowed.';
      }
    }
  }, options);
},

/**
 * Validates whether incoming `value` is empty* or not also doesn't normalize the passed in
 * options parameter (since currently `notEmptyValidator` has no options other than it's `messageTemplates`
 * field). * 'empty' in our context means one of `null`, `undefined`, empty lists (strings/arrays) (`x.length === 0`), `false`, empty object (obj with `0` enumerable props), and empty collection/iterable object (`Map`, `Set` etc.), NaN,
 * Also this method is useful when the user, themselves, have to call `toNotEmptyOptions` for a specific reason.
 * @function module:notEmptyValidator.notEmptyValidatorNoNormalize
 * @param options {Object}
 * @param value {*}
 * @returns {*}
 */
notEmptyValidatorNoNormalize = (0, _fjl.curry)(function (options, value) {
  var result = (0, _fjl.isEmpty)(value),
      // If test failed
  messages = result ? [(0, _ValidationUtils.getErrorMsgByKey)(options, 'EMPTY_NOT_ALLOWED', value)] : [];
  return (0, _ValidationUtils.toValidationResult)({
    result: !result,
    messages: messages,
    value: value
  });
}),

/**
 * Returns a validation result indicating whether give `value`
 * is an empty* value or not (*@see `notEmptyValidatorNoNormalize` for more about
 * empties).
 * @function module:notEmptyValidator.notEmptyValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
notEmptyValidator = (0, _fjl.curry)(function (options, value) {
  return notEmptyValidatorNoNormalize(toNotEmptyOptions(options), value);
}),

/**
 * Same as `notEmptyValidator` except doesn't require first parameter ("options" parameter). (*@see `notEmptyValidatorNoNormalize` for more about
 * empties).
 * @function module:notEmptyValidator.notEmptyValidator1
 * @param value {*}
 * @returns {Object}
 */
notEmptyValidator1 = function notEmptyValidator1(value) {
  return notEmptyValidatorNoNormalize(null, value);
};

exports.notEmptyValidator1 = notEmptyValidator1;
exports.notEmptyValidator = notEmptyValidator;
exports.notEmptyValidatorNoNormalize = notEmptyValidatorNoNormalize;
exports.toNotEmptyOptions = toNotEmptyOptions;
var _default = notEmptyValidator;
exports["default"] = _default;