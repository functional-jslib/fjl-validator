"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.notEmptyValidator = exports.notEmptyValidator1 = exports.notEmptyValidator$ = exports.notEmptyValidatorNoNormalize$ = exports.toNotEmptyOptions = void 0;

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
 * Un-curried version of notEmptyValidator which doesn't normalize the passed in
 * options parameter (since currently `notEmptyValidator` has no options other than it's `messageTemplates`
 * field).  @see module:notEmptyValidator.notEmptyValidatorNoNormalize$ .
 * Also this method is useful when the user, themselves, have to call `toNotEmptyOptions` for a specific reason.
 * @param options {Object}
 * @param value {*}
 * @returns {*}
 */
notEmptyValidatorNoNormalize$ = function notEmptyValidatorNoNormalize$(options, value) {
  var result = (0, _fjl.isEmpty)(value),
      // If test failed
  messages = result ? [(0, _ValidationUtils.getErrorMsgByKey)(options, 'EMPTY_NOT_ALLOWED', value)] : [];
  return (0, _ValidationUtils.toValidationResult)({
    result: !result,
    messages: messages,
    value: value
  });
},

/**
 * Un-curried version of `notEmptyValidator`
 * @function module:notEmptyValidator.notEmptyValidator$
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
notEmptyValidator$ = function notEmptyValidator$(options, value) {
  return notEmptyValidatorNoNormalize$(toNotEmptyOptions(options), value);
},

/**
 * Same as `notEmptyValidator` except doesn't require first parameter ("options" parameter).
 * @function module:notEmptyValidator.notEmptyValidator1
 * @param value {*}
 * @returns {Object}
 */
notEmptyValidator1 = function notEmptyValidator1(value) {
  return notEmptyValidatorNoNormalize$(null, value);
},

/**
 * @function module:notEmptyValidator.notEmptyValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
notEmptyValidator = (0, _fjl.curry)(notEmptyValidator$);

exports.notEmptyValidator = notEmptyValidator;
exports.notEmptyValidator1 = notEmptyValidator1;
exports.notEmptyValidator$ = notEmptyValidator$;
exports.notEmptyValidatorNoNormalize$ = notEmptyValidatorNoNormalize$;
exports.toNotEmptyOptions = toNotEmptyOptions;
var _default = notEmptyValidator;
exports.default = _default;