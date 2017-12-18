var fjlValidator = (function (exports,fjl,fjlMutable) {
'use strict';

/**
 * Created by Ely on 7/21/2014.
 * Initial idea borrowed from Zend Framework 2's Zend/Validator
 * @module ValidatorOptions
 */
var defaultValueObscurator = function defaultValueObscurator(x) {
    return fjl.repeat((x + '').length, '*');
};
var getErrorMsgByKey = fjl.curry(function (options, key, value) {
    var message = void 0;

    var messageTemplates = options.messageTemplates,
        valueObscured = options.valueObscured,
        valueObscurator = options.valueObscurator,
        _value = valueObscured ? valueObscurator(value) : value;

    if (fjl.isFunction(key)) {
        message = fjl.call(key, options, _value);
    } else if (!fjl.isString(key) || !messageTemplates || !messageTemplates[key]) {
        return;
    } else if (fjl.isFunction(messageTemplates[key])) {
        message = fjl.call(messageTemplates[key], options, _value);
    } else {
        message = messageTemplates[key];
    }
    return message;
});
var toValidationOptions = function toValidationOptions() {
    for (var _len = arguments.length, options = Array(_len), _key = 0; _key < _len; _key++) {
        options[_key] = arguments[_key];
    }

    var _options = fjlMutable.defineEnumProps$([[Object, 'messageTemplates', {}], [Boolean, 'valueObscured', false], [Function, 'valueObscurator', defaultValueObscurator]], {});
    return options.length ? fjl.apply(fjl.assignDeep, [_options].concat(options.filter(fjl.isset))) : _options;
};
var toValidationResult = function toValidationResult(options) {
    var _options = fjlMutable.defineEnumProps$([[Boolean, 'result'], [Array, 'messages']], {});
    _options.value = undefined;
    return options ? fjl.assign(_options, options) : _options;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
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
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

/**
 * Created by Ely on 7/21/2014.
 * @module regexValidator
 */
var regexValidatorOptions = function regexValidatorOptions(options) {
    var _defineEnumProp$ = fjlMutable.defineEnumProp$(RegExp, {}, 'pattern', /./),
        _defineEnumProp$2 = slicedToArray(_defineEnumProp$, 1),
        _options = _defineEnumProp$2[0];

    _options.messageTemplates = {
        DOES_NOT_MATCH_PATTERN: function DOES_NOT_MATCH_PATTERN(value, ops) {
            return 'The value passed in does not match pattern"' + ops.pattern + '".  Value passed in: "' + ops.value + '".';
        }
    };
    return toValidationOptions(options ? fjl.assignDeep(_options, options) : _options);
};
var regexValidator = fjl.curry(function (options, value) {
    var ops = regexValidatorOptions(options),
        result = ops.pattern.test(value),


    // If test failed
    messages = !result ? [getErrorMsgByKey(ops, 'DOES_NOT_MATCH_PATTERN', value)] : [];

    return toValidationResult({ result: result, messages: messages, value: value });
});

/**
 * Created by Ely on 1/21/2015.
 * @module alnumValidator
 */
/**
 * @function module:alnumValidator.alnumValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
var alnumValidator = fjl.curry(function (options, value) {
  return regexValidator(fjl.assignDeep({
    pattern: /^[\da-z]+$/i,
    messageTemplates: {
      DOES_NOT_MATCH_PATTERN: function DOES_NOT_MATCH_PATTERN(x) {
        return 'Value is not alpha-numeric.  Value received: \'' + x + '\'.';
      }
    }
  }, options), value);
});

/**
 * Created by Ely on 1/21/2015.
 * @module digitValidator
 */
/**
 * @function module:digitValidator.digitValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
var digitValidator = fjl.curry(function (options, value) {
  return regexValidator(fjl.assignDeep({
    pattern: /^\d+$/,
    messageTemplates: {
      DOES_NOT_MATCH_PATTERN: function DOES_NOT_MATCH_PATTERN(x) {
        return 'The value passed in contains non digital characters.  ' + ('Value received: "' + x + '".');
      }
    }
  }, options), value);
});

/**
 * Created by Ely on 7/21/2014.
 * @module notEmptyValidator
 */
var notEmptyOptions = function notEmptyOptions(options) {
    return toValidationOptions({
        messageTemplates: {
            EMPTY_NOT_ALLOWED: function EMPTY_NOT_ALLOWED() {
                return 'Empty values are not allowed.';
            }
        }
    }, options);
};
var notEmptyValidator = fjl.curry(function (options, value) {
    var ops = notEmptyOptions(options),
        result = !fjl.isEmpty(value),

    // If test failed
    messages = !result ? [getErrorMsgByKey(ops, 'EMPTY_NOT_ALLOWED', value)] : [];
    return toValidationResult({ result: result, messages: messages, value: value });
});

/**
 * Created by Ely on 1/21/2015.
 * @module stringLengthValidator
 */
var stringLengthOptions = function stringLengthOptions(options) {
    var _options = fjlMutable.defineEnumProps$([[Number, 'min', 0], [Number, 'max', Number.MAX_SAFE_INTEGER]], {});

    _options.messageTemplates = {
        NOT_OF_TYPE: function NOT_OF_TYPE(value) {
            return 'Value is not a String.  ' + ('Value type received: ' + fjl.typeOf(value) + '.') + ('Value received: "' + value + '".');
        },
        NOT_WITHIN_RANGE: function NOT_WITHIN_RANGE(value, ops) {
            return 'Value is not within range ' + (ops.min + ' to ' + ops.max + '.') + 'Value length given: "' + value.length + '".' + 'Value received: "' + value + '".';
        }
    };

    return toValidationOptions(options ? fjl.assignDeep(_options, options) : _options);
};
var stringLengthValidator = fjl.curry(function (options, value) {
    var ops = stringLengthOptions(options),
        messages = [],
        isOfType = fjl.isString(value),
        valLength = isOfType ? value.length : 0,
        isWithinRange = valLength >= ops.min && valLength <= ops.max;
    if (!isOfType) {
        messages.push(getErrorMsgByKey(ops, 'NOT_OF_TYPE', value));
    } else if (!isWithinRange) {
        messages.push(getErrorMsgByKey(ops, 'NOT_WITHIN_RANGE', value));
    }
    return toValidationResult({
        result: isOfType && isWithinRange,
        messages: messages,
        value: value
    });
});

/**
 * Content generated by '{project-root}/build-scripts/VersionNumberReadStream.js'.
 * Generated Sun Dec 17 2017 23:03:54 GMT-0500 (Eastern Standard Time) 
 */

var version = '0.6.1';

/**
 * @module fjlValidator
 */

exports.alnumValidator = alnumValidator;
exports.digitValidator = digitValidator;
exports.notEmptyOptions = notEmptyOptions;
exports.notEmptyValidator = notEmptyValidator;
exports.regexValidatorOptions = regexValidatorOptions;
exports.regexValidator = regexValidator;
exports.stringLengthOptions = stringLengthOptions;
exports.stringLengthValidator = stringLengthValidator;
exports.defaultValueObscurator = defaultValueObscurator;
exports.getErrorMsgByKey = getErrorMsgByKey;
exports.toValidationOptions = toValidationOptions;
exports.toValidationResult = toValidationResult;
exports.version = version;

return exports;

}({},fjl,fjlMutable));
//# sourceMappingURL=fjl-validator.js.map
