(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "fjl", "fjl-mutable"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("fjl"), require("fjl-mutable"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.fjl, global.fjlMutable);
    global.ValidationUtils = mod.exports;
  }
})(this, function (_exports, _fjl, _fjlMutable) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _exports.isOneOf = _exports.toValidationResult = _exports.toValidationOptions = _exports.getErrorMsgByKey = _exports.defaultValueObscurator = void 0;

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

  function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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

    return _fjl.assignDeep.apply(void 0, [(0, _fjlMutable.defineEnumProps)([[Object, 'messageTemplates', {}], [Boolean, 'valueObscured', false], [Function, 'valueObscurator', defaultValueObscurator]], {})].concat(_toConsumableArray(options.length ? options : [{}])));
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

    return _fjl.assignDeep.apply(void 0, [(0, _fjlMutable.defineEnumProps)([[Boolean, 'result', false], [Array, 'messages', []]], {}), {
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
  _exports.default = _default;
});