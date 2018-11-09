define(["exports", "./regexValidator", "fjl"], function (_exports, _regexValidator, _fjl) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _exports.alnumValidator1 = _exports.alnumValidator = void 0;

  /**
   * Created by Ely on 1/21/2015.
   * Module for validating alpha-numeric values.
   * @module alnumValidator
   */
  var
  /**
   * @function module:alnumValidator.alnumValidator
   * @param options {Object}
   * @param value {*}
   * @returns {Object}
   */
  alnumValidator = (0, _fjl.curry)(function (options, value) {
    return (0, _regexValidator.regexValidator)((0, _fjl.assignDeep)({
      pattern: /^[\da-z]+$/i,
      messageTemplates: {
        DOES_NOT_MATCH_PATTERN: function DOES_NOT_MATCH_PATTERN(x) {
          return "Value is not alpha-numeric.  Value received: '".concat(x, "'.");
        }
      }
    }, options), value);
  }),

  /**
   * Same as `alnumValidator` though doesn't-require-`options`/ignores parameter.
   * @function module:alnumValidator.alnumValidator1
   * @param value {*}
   * @returns {Object}
   */
  alnumValidator1 = function alnumValidator1(value) {
    return alnumValidator(null, value);
  };

  _exports.alnumValidator1 = alnumValidator1;
  _exports.alnumValidator = alnumValidator;
  var _default = alnumValidator;
  _exports.default = _default;
});