(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "fjl"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("fjl"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.fjl);
    global.ValidationUtils = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _fjl) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports["default"] = _exports.isOneOf = _exports.toValidationResult = _exports.toValidationOptions = _exports.getErrorMsgByKey = _exports.defaultValueObscurator = void 0;

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var
  /**
   * Default value obscurator.
   * @function module:ValidationUtils.defaultValueObscurator
   * @param x {*} - Value to obscurate.
   * @returns {String} - Obscurated value.
   */
  defaultValueObscurator = function defaultValueObscurator(x) {
    return (0, _fjl.repeat)((x + '').length, '*');
  },

  /**
   * Gets an error message by `messageTemplates` key from `options` object.
   * @function module:ValidationUtils.getErrorMsgByKey
   * @param options {Object}
   * @param key {(String|Function)}
   * @param value {*}
   * @returns {String|undefined} - Error message if successfully resolved one else `undefined`.
   * @curried
   */
  getErrorMsgByKey = (0, _fjl.curry)(function (options, key, value) {
    var message;

    var messageTemplates = options.messageTemplates,
        valueObscured = options.valueObscured,
        valueObscurator = options.valueObscurator,
        _value = valueObscured ? valueObscurator(value) : value;

    if ((0, _fjl.isFunction)(key)) {
      message = (0, _fjl.call)(key, _value, options);
    } else if (!(0, _fjl.isString)(key) || !messageTemplates || !messageTemplates[key]) {
      return;
    } else if ((0, _fjl.isFunction)(messageTemplates[key])) {
      message = (0, _fjl.call)(messageTemplates[key], _value, options);
    } else {
      message = messageTemplates[key];
    }

    return message;
  }),

  /**
   * Returns a strongly typed/normalized ValidatorOptions object.
   * @function module:ValidationUtils.toValidationOptions
   * @param options {...Object}
   * @returns {Object}
   */
  toValidationOptions = function toValidationOptions() {
    for (var _len = arguments.length, options = new Array(_len), _key = 0; _key < _len; _key++) {
      options[_key] = arguments[_key];
    }

    return _fjl.assignDeep.apply(void 0, [(0, _fjl.defineEnumProps)([[Object, 'messageTemplates', {}], [Boolean, 'valueObscured', false], [Function, 'valueObscurator', defaultValueObscurator]], {})].concat(_toConsumableArray(options.length ? options : [{}])));
  },

  /**
   * Returns a strongly typed, normalized validation result object.
   * @function module:ValidationUtils.toValidationResult
   * @param options {...Object}
   * @returns {*}
   */
  toValidationResult = function toValidationResult() {
    for (var _len2 = arguments.length, options = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      options[_key2] = arguments[_key2];
    }

    return _fjl.assignDeep.apply(void 0, [(0, _fjl.defineEnumProps)([[Boolean, 'result', false], [Array, 'messages', []]], {}), {
      value: undefined
    }].concat(_toConsumableArray(options.length ? options : [{}])));
  },
      isOneOf = function isOneOf(x) {
    var typeName = (0, _fjl.typeOf)(x);

    for (var _len3 = arguments.length, types = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      types[_key3 - 1] = arguments[_key3];
    }

    return types.map(_fjl.toTypeRefName).some(function (name) {
      return typeName === name;
    });
  };

  _exports.isOneOf = isOneOf;
  _exports.toValidationResult = toValidationResult;
  _exports.toValidationOptions = toValidationOptions;
  _exports.getErrorMsgByKey = getErrorMsgByKey;
  _exports.defaultValueObscurator = defaultValueObscurator;
  var _default = toValidationResult;
  _exports["default"] = _default;
});