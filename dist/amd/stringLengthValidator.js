define(["exports", "./ValidationUtils", "fjl", "./lengthValidator"], function (_exports, _ValidationUtils, _fjl, _lengthValidator) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports["default"] = _exports.stringLengthValidator = _exports.stringLengthValidatorNoNormalize = _exports.toStringLengthOptions = void 0;

  /**
   * Created by Ely on 1/21/2015.
   * @module stringLengthValidator
   */
  var
  /**
   * Normalizes (ensures has expected properties) `stringLengthValidator`'s options.
   * @function module:stringLengthValidator.toStringLengthOptions
   * @param options {Object}
   * @returns {Object}
   */
  toStringLengthOptions = function toStringLengthOptions(options) {
    var _options = {
      messageTemplates: {
        NOT_OF_TYPE: function NOT_OF_TYPE(value) {
          return "Value is not a String.  " + "Value type received: ".concat((0, _fjl.typeOf)(value), ".  ") + "Value received: \"".concat(value, "\".");
        }
      }
    };
    return (0, _lengthValidator.toLengthOptions)(options ? (0, _fjl.assignDeep)(_options, options) : _options);
  },

  /**
   * Same as `stringLengthValidator` except doesn't normalize the incoming options.
   * Useful for cases where you have to call `toStringLengthValidator` options from outside of the `stringLengthValidator` call (
   *  helps eliminate one call in this case).  Also useful for extreme cases (cases where you have hundreds of validators
   *  and want to pull out every ounce of performance from them possible).
   * @function module:stringLengthValidator.stringLengthValidatorNoNormalize
   * @param options {Object}
   * @param value {*}
   * @returns {Object}
   */
  stringLengthValidatorNoNormalize = (0, _fjl.curry)(function (options, value) {
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
  }),

  /**
   * @function module:stringLengthValidator.stringLengthValidator
   * @param options {Object}
   * @param value {*}
   * @returns {Object}
   */
  stringLengthValidator = (0, _fjl.curry)(function (options, value) {
    return stringLengthValidatorNoNormalize(toStringLengthOptions(options), value);
  });

  _exports.stringLengthValidator = stringLengthValidator;
  _exports.stringLengthValidatorNoNormalize = stringLengthValidatorNoNormalize;
  _exports.toStringLengthOptions = toStringLengthOptions;
  var _default = stringLengthValidator;
  _exports["default"] = _default;
});