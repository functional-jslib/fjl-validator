"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.digitValidator1 = exports.digitValidator = void 0;

var _regexValidator = require("./regexValidator");

var _fjl = require("fjl");

/**
 * Created by Ely on 1/21/2015.
 * Module for validating digits.
 * @module digitValidator
 */
var
/**
 * @function module:digitValidator.digitValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
digitValidator = (0, _fjl.curry)(function (options, value) {
  return (0, _regexValidator.regexValidator)((0, _fjl.assignDeep)({
    pattern: /^\d+$/,
    messageTemplates: {
      DOES_NOT_MATCH_PATTERN: function DOES_NOT_MATCH_PATTERN(x) {
        return "The value passed in contains non digital characters.  " + "Value received: \"".concat(x, "\".");
      }
    }
  }, options), value);
}),

/**
 * Same as `digitValidator` though doesn't-require/ignores `options` parameter.
 * @function module:digitValidator.digitValidator1
 * @param value {*}
 * @returns {Object}
 */
digitValidator1 = function digitValidator1(value) {
  return digitValidator(null, value);
};

exports.digitValidator1 = digitValidator1;
exports.digitValidator = digitValidator;
var _default = digitValidator;
exports.default = _default;