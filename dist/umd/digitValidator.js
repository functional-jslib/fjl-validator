(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./regexValidator", "fjl"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./regexValidator"), require("fjl"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.regexValidator, global.fjl);
    global.digitValidator = mod.exports;
  }
})(this, function (_exports, _regexValidator, _fjl) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports["default"] = _exports.digitValidator1 = _exports.digitValidator = void 0;

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

  _exports.digitValidator1 = digitValidator1;
  _exports.digitValidator = digitValidator;
  var _default = digitValidator;
  _exports["default"] = _default;
});