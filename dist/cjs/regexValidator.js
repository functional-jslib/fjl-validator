"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.regexValidator = exports.regexValidatorNoNormalize = exports.toRegexValidatorOptions = void 0;

var _ValidationUtils = require("./ValidationUtils");

var _fjl = require("fjl");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var
/**
 * Normalizes `regexValidator` options.
 * @function module:regexValidator.toRegexValidatorOptions
 * @param options {Object}
 * @returns {Object}
 */
toRegexValidatorOptions = function toRegexValidatorOptions(options) {
  var _defineEnumProp = (0, _fjl.defineEnumProp)(RegExp, (0, _ValidationUtils.toValidationOptions)(), 'pattern', /./),
      _defineEnumProp2 = _slicedToArray(_defineEnumProp, 1),
      _options = _defineEnumProp2[0];

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
 * @function module:regexValidator.regexValidatorNoNormalize
 * @param options {Object}
 * @param value {*}
 * @returns {*}
 */
regexValidatorNoNormalize = (0, _fjl.curry)(function (options, value) {
  var result = options.pattern.test(value),
      // If test failed
  messages = !result ? [(0, _ValidationUtils.getErrorMsgByKey)(options, 'DOES_NOT_MATCH_PATTERN', value)] : [];
  return (0, _ValidationUtils.toValidationResult)({
    result: result,
    messages: messages,
    value: value
  });
}),

/**
 * Validates a value with the regex `pattern` option passed in.
 * @function module:regexValidator.regexValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
regexValidator = (0, _fjl.curry)(function (options, value) {
  return regexValidatorNoNormalize(toRegexValidatorOptions(options), value);
});

exports.regexValidator = regexValidator;
exports.regexValidatorNoNormalize = regexValidatorNoNormalize;
exports.toRegexValidatorOptions = toRegexValidatorOptions;
var _default = regexValidator;
exports["default"] = _default;