var fjlValidator = (function (exports,fjl,fjlMutable) {
'use strict';

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













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

/**
 * Created by Ely on 7/21/2014.
 * Initial idea borrowed from Zend Framework 2's Zend/Validator
 * @module ValidationUtils
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
        message = fjl.call(key, _value, options);
    } else if (!fjl.isString(key) || !messageTemplates || !messageTemplates[key]) {
        return;
    } else if (fjl.isFunction(messageTemplates[key])) {
        message = fjl.call(messageTemplates[key], _value, options);
    } else {
        message = messageTemplates[key];
    }
    return message;
});
var toValidationOptions = function toValidationOptions() {
    for (var _len = arguments.length, options = Array(_len), _key = 0; _key < _len; _key++) {
        options[_key] = arguments[_key];
    }

    return fjl.assignDeep.apply(undefined, [fjlMutable.defineEnumProps$([[Object, 'messageTemplates', {}], [Boolean, 'valueObscured', false], [Function, 'valueObscurator', defaultValueObscurator]], {})].concat(toConsumableArray(options.length ? options : [{}])));
};
var toValidationResult = function toValidationResult() {
    for (var _len2 = arguments.length, options = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        options[_key2] = arguments[_key2];
    }

    return fjl.assignDeep.apply(undefined, [fjlMutable.defineEnumProps$([[Boolean, 'result', false], [Array, 'messages', []]], {}), { value: undefined }].concat(toConsumableArray(options.length ? options : [{}])));
};

/**
 * Created by Ely on 7/21/2014.
 * Module for validating a value by regular expression.
 * @module regexValidator
 */
var toRegexValidatorOptions = function toRegexValidatorOptions(options) {
    var _defineEnumProp$ = fjlMutable.defineEnumProp$(RegExp, toValidationOptions(), 'pattern', /./),
        _defineEnumProp$2 = slicedToArray(_defineEnumProp$, 1),
        _options = _defineEnumProp$2[0];

    _options.messageTemplates = {
        DOES_NOT_MATCH_PATTERN: function DOES_NOT_MATCH_PATTERN(value, ops) {
            return 'The value passed in does not match pattern"' + ops.pattern + '".  Value passed in: "' + value + '".';
        }
    };
    return options ? fjl.assignDeep(_options, options) : _options;
};
var regexValidatorNoNormalize$ = function regexValidatorNoNormalize$(options, value) {
    var result = options.pattern.test(value),


    // If test failed
    messages = !result ? [getErrorMsgByKey(options, 'DOES_NOT_MATCH_PATTERN', value)] : [];

    return toValidationResult({ result: result, messages: messages, value: value });
};
var regexValidator$ = function regexValidator$(options, value) {
    return regexValidatorNoNormalize$(toRegexValidatorOptions(options), value);
};
var regexValidator = fjl.curry(regexValidator$);

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
var alnumValidator1 = function alnumValidator1(value) {
  return alnumValidator(null, value);
};

/**
 * Created by Ely on 1/21/2015.
 * Module for validating digits.
 * @module digitValidator
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
var digitValidator1 = function digitValidator1(value) {
  return digitValidator(null, value);
};

/**
 * Created by Ely on 7/21/2014.
 * @module notEmptyValidator
 */
var toNotEmptyOptions = function toNotEmptyOptions(options) {
    return toValidationOptions({
        messageTemplates: {
            EMPTY_NOT_ALLOWED: function EMPTY_NOT_ALLOWED() {
                return 'Empty values are not allowed.';
            }
        }
    }, options);
};
var notEmptyValidatorNoNormalize$ = function notEmptyValidatorNoNormalize$(options, value) {
    var result = !fjl.isEmpty(value),

    // If test failed
    messages = !result ? [getErrorMsgByKey(options, 'EMPTY_NOT_ALLOWED', value)] : [];
    return toValidationResult({ result: result, messages: messages, value: value });
};
var notEmptyValidator$ = function notEmptyValidator$(options, value) {
    return notEmptyValidatorNoNormalize$(toNotEmptyOptions(options), value);
};
var notEmptyValidator1 = function notEmptyValidator1(value) {
    return notEmptyValidatorNoNormalize$(null, value);
};
var notEmptyValidator = fjl.curry(notEmptyValidator$);

/**
 * Created by Ely on 1/21/2015.
 * @module stringLengthValidator
 */
var toStringLengthOptions = function toStringLengthOptions(options) {
    var _options = fjlMutable.defineEnumProps$([[Number, 'min', 0], [Number, 'max', Number.MAX_SAFE_INTEGER]], toValidationOptions());

    _options.messageTemplates = {
        NOT_OF_TYPE: function NOT_OF_TYPE(value) {
            return 'Value is not a String.  ' + ('Value type received: ' + fjl.typeOf(value) + '.  ') + ('Value received: "' + value + '".');
        },
        NOT_WITHIN_RANGE: function NOT_WITHIN_RANGE(value, ops) {
            return 'Value is not within range ' + (ops.min + ' to ' + ops.max + '.  ') + 'Value length given: "' + value.length + '".  ' + 'Value received: "' + value + '".';
        }
    };

    return options ? fjl.assignDeep(_options, options) : _options;
};
var stringLengthValidatorNoNormalize$ = function stringLengthValidatorNoNormalize$(options, value) {
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
};
var stringLengthValidator$ = function stringLengthValidator$(options, value) {
    return stringLengthValidatorNoNormalize$(toStringLengthOptions(options), value);
};
var stringLengthValidator = fjl.curry(stringLengthValidator$);

/**
 * Content generated by '{project-root}/build-scripts/VersionNumberReadStream.js'.
 * Generated Wed Apr 11 2018 10:53:42 GMT-0400 (EDT) 
 */

var version = '0.6.16';

/**
 * @module fjlValidator
 */

exports.alnumValidator = alnumValidator;
exports.alnumValidator1 = alnumValidator1;
exports.digitValidator = digitValidator;
exports.digitValidator1 = digitValidator1;
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
exports.version = version;

return exports;

}({},fjl,fjlMutable));
//# sourceMappingURL=fjl-validator.js.map
