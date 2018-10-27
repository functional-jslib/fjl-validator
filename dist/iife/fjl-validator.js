var fjlValidator = (function (exports,fjl,fjlMutable) {
  'use strict';

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  var 
  /**
   * Default value obscurator.
   * @function module:ValidationUtils.defaultValueObscurator
   * @param x {*} - Value to obscurate.
   * @returns {String} - Obscurated value.
   */
  defaultValueObscurator = function defaultValueObscurator(x) {
    return fjl.repeat((x + '').length, '*');
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
  getErrorMsgByKey = fjl.curry(function (options, key, value) {
    var message;

    var messageTemplates = options.messageTemplates,
        valueObscured = options.valueObscured,
        valueObscurator = options.valueObscurator,
        _value = valueObscured ? valueObscurator(value) : value;

    if (fjl.isFunction(key)) {
      message = fjl.call(key, _value, options);
    } else if (!fjl.isString(key) || !messageTemplates || !messageTemplates[key]) {
      return;
    } else if (fjl.isFunction(messageTemplates[key])) {
      message = fjl.call(messageTemplates[key], _value, options);
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

    return fjl.assignDeep.apply(void 0, [fjlMutable.defineEnumProps$([[Object, 'messageTemplates', {}], [Boolean, 'valueObscured', false], [Function, 'valueObscurator', defaultValueObscurator]], {})].concat(_toConsumableArray(options.length ? options : [{}])));
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

    return fjl.assignDeep.apply(void 0, [fjlMutable.defineEnumProps$([[Boolean, 'result', false], [Array, 'messages', []]], {}), {
      value: undefined
    }].concat(_toConsumableArray(options.length ? options : [{}])));
  },
      isOneOf = function isOneOf(x) {
    var typeName = fjl.typeOf(x);

    for (var _len3 = arguments.length, types = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      types[_key3 - 1] = arguments[_key3];
    }

    return types.map(fjl.toTypeRefName).some(function (name) {
      return typeName === name;
    });
  };

  var 
  /**
   * Normalizes `regexValidator` options.
   * @function module:regexValidator.toRegexValidatorOptions
   * @param options {Object}
   * @returns {Object}
   */
  toRegexValidatorOptions = function toRegexValidatorOptions(options) {
    var _defineEnumProp$ = fjlMutable.defineEnumProp$(RegExp, toValidationOptions(), 'pattern', /./),
        _defineEnumProp$2 = _slicedToArray(_defineEnumProp$, 1),
        _options = _defineEnumProp$2[0];

    _options.messageTemplates = {
      DOES_NOT_MATCH_PATTERN: function DOES_NOT_MATCH_PATTERN(value, ops) {
        return 'The value passed in does not match pattern"' + ops.pattern + '".  Value passed in: "' + value + '".';
      }
    };
    return options ? fjl.assignDeep(_options, options) : _options;
  },

  /**
   * Same as `regexValidator` except this version is not curried and doesn't normalize incoming `options` parameter.
   * @note Useful when the user has a need for calling `toRegexValidatorOptions`
   *  externally/from-outside-the-`regexValidator` call (helps to remove that one extra call in this case (since
   *  `regexValidator` calls `toRegexValidatorOptions` internally)).
   * @function module:regexValidator.regexValidatorNoNormalize$
   * @param options {Object}
   * @param value {*}
   * @returns {*}
   */
  regexValidatorNoNormalize$ = function regexValidatorNoNormalize$(options, value) {
    var result = options.pattern.test(value),
        // If test failed
    messages = !result ? [getErrorMsgByKey(options, 'DOES_NOT_MATCH_PATTERN', value)] : [];
    return toValidationResult({
      result: result,
      messages: messages,
      value: value
    });
  },

  /**
   * Un-curried version of `regexValidator`.
   * @function module:regexValidator.regexValidator$
   * @param options {Object}
   * @param value {*}
   * @returns {Object}
   */
  regexValidator$ = function regexValidator$(options, value) {
    return regexValidatorNoNormalize$(toRegexValidatorOptions(options), value);
  },

  /**
   * Validates a value with the regex `pattern` option passed in.
   * @curried
   * @function module:regexValidator.regexValidator
   * @param options {Object}
   * @param value {*}
   * @returns {Object}
   */
  regexValidator = fjl.curry(regexValidator$);

  /**
   * Created by Ely on 1/21/2015.
   * Module for validating alpha-numeric values.
   * @module alnumValidator
   */
  /**
   * @function module:alnumValidator.alnumValidator
   * @param options {Object}
   * @param value {*}
   * @returns {Object}
   */

  var 
  /**
   * @function module:alnumValidator.alnumValidator
   * @param options {Object}
   * @param value {*}
   * @returns {Object}
   */
  alnumValidator = fjl.curry(function (options, value) {
    return regexValidator(fjl.assignDeep({
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
  digitValidator = fjl.curry(function (options, value) {
    return regexValidator(fjl.assignDeep({
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
    var _options = fjlMutable.defineEnumProps$([[Number, 'min', 0], [Number, 'max', Number.MAX_SAFE_INTEGER]], toValidationOptions());

    _options.messageTemplates = {
      NOT_OF_TYPE: function NOT_OF_TYPE(value) {
        return "Value does not have a `length` property.  " + "Type received: `".concat(fjl.typeOf(value), "`.  ") + "Value received: `".concat(value, "`.");
      },
      NOT_WITHIN_RANGE: function NOT_WITHIN_RANGE(value, ops) {
        return "Value's length is not within range " + "".concat(ops.min, " to ").concat(ops.max, ".  ") + "Evaluated length is `".concat(value.length, "`.  ") + "Value received: `".concat(value, "`.");
      }
    };
    return options ? fjl.assignDeep(_options, options) : _options;
  },

  /**
   * Validates whether given value has a length and whether length is between
   *  given range (@see options for range props).
   * @function module:lengthValidator.lengthValidator
   * @param options {Object}
   * @param value {*}
   * @returns {Object}
   */
  lengthValidator = fjl.curry(function (options, value) {
    var ops = toLengthOptions(options),
        messages = [];
    var valLength,
        isWithinRange,
        result = false;

    if (isOneOf(value, 'Null', 'Undefined', 'NaN', 'Symbol') || !value.hasOwnProperty('length')) {
      messages.push(getErrorMsgByKey(ops, 'NOT_OF_TYPE', value));
      return toValidationResult({
        result: result,
        messages: messages,
        value: value
      });
    }

    valLength = value.length;
    isWithinRange = valLength >= ops.min && valLength <= ops.max;

    if (!isWithinRange) {
      messages.push(getErrorMsgByKey(ops, 'NOT_WITHIN_RANGE', value));
    } else {
      result = true;
    }

    return toValidationResult({
      result: result,
      messages: messages,
      value: value
    });
  });

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
    return toValidationOptions({
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
    var result = fjl.isEmpty(value),
        // If test failed
    messages = result ? [getErrorMsgByKey(options, 'EMPTY_NOT_ALLOWED', value)] : [];
    return toValidationResult({
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
  notEmptyValidator = fjl.curry(notEmptyValidator$);

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
    var _options = fjlMutable.defineEnumProps$([[Number, 'min', 0], [Number, 'max', Number.MAX_SAFE_INTEGER]], toValidationOptions());

    _options.messageTemplates = {
      NOT_OF_TYPE: function NOT_OF_TYPE(value) {
        return "Value is not a String.  " + "Value type received: ".concat(fjl.typeOf(value), ".  ") + "Value received: \"".concat(value, "\".");
      },
      NOT_WITHIN_RANGE: function NOT_WITHIN_RANGE(value, ops) {
        return "Value is not within range " + "".concat(ops.min, " to ").concat(ops.max, ".  ") + "Value length given: \"" + value.length + "\".  " + "Value received: \"" + value + "\".";
      }
    };
    return options ? fjl.assignDeep(_options, options) : _options;
  },

  /**
   * Same as `stringLengthValidator$` except doesn't normalize the incoming options.
   * Useful for cases where you have to call `toStringLengthValidator` options from outside of the `stringLengthValidator` call (
   *  helps eliminate one call in this case).  Also useful for extreme cases (cases where you have hundreds of validators
   *  and want to pull out every ounce of performance from them possible).
   * @function module:stringLengthValidator.stringLengthValidatorNoNormalize$
   * @param options {Object}
   * @param value {*}
   * @returns {Object}
   */
  stringLengthValidatorNoNormalize$ = function stringLengthValidatorNoNormalize$(options, value) {
    var messages = [],
        isOfType = fjl.isString(value),
        valLength = isOfType ? value.length : 0,
        isWithinRange = valLength >= options.min && valLength <= options.max;

    if (!isOfType) {
      messages.push(getErrorMsgByKey(options, 'NOT_OF_TYPE', value));
    } else if (!isWithinRange) {
      messages.push(getErrorMsgByKey(options, 'NOT_WITHIN_RANGE', value));
    }

    return toValidationResult({
      result: isOfType && isWithinRange,
      messages: messages,
      value: value
    });
  },

  /**
   * @function module:stringLengthValidator.stringLengthValidator$
   * @param options {Object}
   * @param value {*}
   * @returns {Object}
   */
  stringLengthValidator$ = function stringLengthValidator$(options, value) {
    return stringLengthValidatorNoNormalize$(toStringLengthOptions(options), value);
  },

  /**
   * @function module:stringLengthValidator.stringLengthValidator
   * @param options {Object}
   * @param value {*}
   * @returns {Object}
   */
  stringLengthValidator = fjl.curry(stringLengthValidator$);

  /**
   * @module fjlValidator
   */

  exports.alnumValidator = alnumValidator;
  exports.alnumValidator1 = alnumValidator1;
  exports.digitValidator = digitValidator;
  exports.digitValidator1 = digitValidator1;
  exports.toLengthOptions = toLengthOptions;
  exports.lengthValidator = lengthValidator;
  exports.toNotEmptyOptions = toNotEmptyOptions;
  exports.notEmptyValidatorNoNormalize$ = notEmptyValidatorNoNormalize$;
  exports.notEmptyValidator$ = notEmptyValidator$;
  exports.notEmptyValidator1 = notEmptyValidator1;
  exports.notEmptyValidator = notEmptyValidator;
  exports.toRegexValidatorOptions = toRegexValidatorOptions;
  exports.regexValidatorNoNormalize$ = regexValidatorNoNormalize$;
  exports.regexValidator$ = regexValidator$;
  exports.regexValidator = regexValidator;
  exports.toStringLengthOptions = toStringLengthOptions;
  exports.stringLengthValidatorNoNormalize$ = stringLengthValidatorNoNormalize$;
  exports.stringLengthValidator$ = stringLengthValidator$;
  exports.stringLengthValidator = stringLengthValidator;
  exports.defaultValueObscurator = defaultValueObscurator;
  exports.getErrorMsgByKey = getErrorMsgByKey;
  exports.toValidationOptions = toValidationOptions;
  exports.toValidationResult = toValidationResult;
  exports.isOneOf = isOneOf;

  return exports;

}({},fjl,fjlMutable));
//# sourceMappingURL=fjl-validator.js.map
