import { repeat, curry, isFunction, call, isString, assignDeep, defineEnumProps, typeOf, toTypeRefName, defineEnumProp, isEmpty } from 'fjl';

/**
 * Created by Ely on 7/21/2014.
 * Initial idea borrowed from Zend Framework 2's Zend/Validator
 * @module ValidationUtils
 */
const 
/**
 * Default value obscurator.
 * @function module:ValidationUtils.defaultValueObscurator
 * @param x {*} - Value to obscurate.
 * @returns {String} - Obscurated value.
 */
defaultValueObscurator = x => repeat((x + '').length, '*'),

/**
 * Gets an error message by `messageTemplates` key from `options` object.
 * @function module:ValidationUtils.getErrorMsgByKey
 * @param options {Object}
 * @param key {(String|Function)}
 * @param value {*}
 * @returns {String|undefined} - Error message if successfully resolved one else `undefined`.
 * @curried
 */
getErrorMsgByKey = curry((options, key, value) => {
  let message;

  const {
    messageTemplates,
    valueObscured,
    valueObscurator
  } = options,
        _value = valueObscured ? valueObscurator(value) : value;

  if (isFunction(key)) {
    message = call(key, _value, options);
  } else if (!isString(key) || !messageTemplates || !messageTemplates[key]) {
    return;
  } else if (isFunction(messageTemplates[key])) {
    message = call(messageTemplates[key], _value, options);
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
toValidationOptions = (...options) => assignDeep(defineEnumProps([[Object, 'messageTemplates', {}], [Boolean, 'valueObscured', false], [Function, 'valueObscurator', defaultValueObscurator]], {}), ...(options.length ? options : [{}])),

/**
 * Returns a strongly typed, normalized validation result object.
 * @function module:ValidationUtils.toValidationResult
 * @param options {...Object}
 * @returns {*}
 */
toValidationResult = (...options) => assignDeep(defineEnumProps([[Boolean, 'result', false], [Array, 'messages', []]], {}), {
  value: undefined
}, ...(options.length ? options : [{}])),
      isOneOf = (x, ...types) => {
  const typeName = typeOf(x);
  return types.map(toTypeRefName).some(name => typeName === name);
};

/**
 * Created by Ely on 7/21/2014.
 * Module for validating a value by regular expression.
 * @module regexValidator
 */
const 
/**
 * Normalizes `regexValidator` options.
 * @function module:regexValidator.toRegexValidatorOptions
 * @param options {Object}
 * @returns {Object}
 */
toRegexValidatorOptions = options => {
  const [_options] = defineEnumProp(RegExp, toValidationOptions(), 'pattern', /./);
  _options.messageTemplates = {
    DOES_NOT_MATCH_PATTERN: (value, ops) => 'The value passed in does not match pattern"' + ops.pattern + '".  Value passed in: "' + value + '".'
  };
  return options ? assignDeep(_options, options) : _options;
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
regexValidatorNoNormalize = curry((options, value) => {
  const result = options.pattern.test(value),
        // If test failed
  messages = !result ? [getErrorMsgByKey(options, 'DOES_NOT_MATCH_PATTERN', value)] : [];
  return toValidationResult({
    result,
    messages,
    value
  });
}),

/**
 * Validates a value with the regex `pattern` option passed in.
 * @function module:regexValidator.regexValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
regexValidator = curry((options, value) => regexValidatorNoNormalize(toRegexValidatorOptions(options), value));

/**
 * Created by Ely on 1/21/2015.
 * Module for validating alpha-numeric values.
 * @module alnumValidator
 */
const 
/**
 * @function module:alnumValidator.alnumValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
alnumValidator = curry((options, value) => regexValidator(assignDeep({
  pattern: /^[\da-z]+$/i,
  messageTemplates: {
    DOES_NOT_MATCH_PATTERN: x => `Value is not alpha-numeric.  Value received: '${x}'.`
  }
}, options), value)),

/**
 * Same as `alnumValidator` though doesn't-require-`options`/ignores parameter.
 * @function module:alnumValidator.alnumValidator1
 * @param value {*}
 * @returns {Object}
 */
alnumValidator1 = value => alnumValidator(null, value);

/**
 * Created by Ely on 1/21/2015.
 * Module for validating digits.
 * @module digitValidator
 */
const 
/**
 * @function module:digitValidator.digitValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
digitValidator = curry((options, value) => regexValidator(assignDeep({
  pattern: /^\d+$/,
  messageTemplates: {
    DOES_NOT_MATCH_PATTERN: x => `The value passed in contains non digital characters.  ` + `Value received: "${x}".`
  }
}, options), value)),

/**
 * Same as `digitValidator` though doesn't-require/ignores `options` parameter.
 * @function module:digitValidator.digitValidator1
 * @param value {*}
 * @returns {Object}
 */
digitValidator1 = value => digitValidator(null, value);

/**
 * Created by Ely on 1/21/2015.
 * @module lengthValidator
 * @todo Allow validator option generators to receive `zero` object (object on which to extend on).
 * @todo Allow validator option generators to receive more than one options object.
 */
const 
/**
 * Normalizes `lengthValidator` options.
 * @function module:lengthValidator.toLengthOptions
 * @param options {Object}
 * @returns {Object}
 */
toLengthOptions = options => {
  const _options = defineEnumProps([[Number, 'min', 0], [Number, 'max', Number.MAX_SAFE_INTEGER]], toValidationOptions());

  _options.messageTemplates = {
    NOT_OF_TYPE: value => `Value does not have a \`length\` property.  ` + `Type received: \`${typeOf(value)}\`.  ` + `Value received: \`${value}\`.`,
    NOT_WITHIN_RANGE: (value, ops) => `Value's length is not within range ` + `${ops.min} to ${ops.max}.  ` + `Evaluated length is \`${value.length}\`.  ` + `Value received: \`${value}\`.`
  };
  return options ? assignDeep(_options, options) : _options;
},

/**
 * Validates whether given value has a length and whether length is between
 *  given range (if given) but doesn't normalize options.
 *  (@see `toLengthOptions` for range props).
 * @function module:lengthValidator.lengthValidatorNoNormalize
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
lengthValidatorNoNormalize = curry((options, value) => {
  const messages = [];
  let valLength,
      isWithinRange,
      result = false;

  if (isOneOf(value, 'Null', 'Undefined', 'NaN', 'Symbol') || !value.hasOwnProperty('length')) {
    messages.push(getErrorMsgByKey(options, 'NOT_OF_TYPE', value));
    return toValidationResult({
      result,
      messages,
      value
    });
  }

  valLength = value.length;
  isWithinRange = valLength >= options.min && valLength <= options.max;

  if (!isWithinRange) {
    messages.push(getErrorMsgByKey(options, 'NOT_WITHIN_RANGE', value));
  } else {
    result = true;
  }

  return toValidationResult({
    result,
    messages,
    value
  });
}),

/**
 * Validates whether given value has a length and whether length is between
 *  given range (if given).  Same as `lengthValidatorNoNormalize` except normalizes incoming options.
 *  (@see `toLengthOptions` for more on options).
 * @function module:lengthValidator.lengthValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
lengthValidator = curry((options, value) => {
  return lengthValidatorNoNormalize(toLengthOptions(options), value);
});

/**
 * Created by Ely on 7/21/2014.
 * @module notEmptyValidator
 */
const 
/**
 * Normalizes incoming options so that they are valid `notEmptyValidator` options.
 * @note currently `notEmptyValidator` only takes the `messageTemplates` option (may
 *  have more options in the future).
 * @function module:notEmptyValidator.toNotEmptyOptions
 * @param options {Object}
 * @returns {Object}
 */
toNotEmptyOptions = options => toValidationOptions({
  messageTemplates: {
    EMPTY_NOT_ALLOWED: () => 'Empty values are not allowed.'
  }
}, options),

/**
 * Validates whether incoming `value` is empty* or not also doesn't normalize the passed in
 * options parameter (since currently `notEmptyValidator` has no options other than it's `messageTemplates`
 * field). * 'empty' in our context means one of `null`, `undefined`, empty lists (strings/arrays) (`x.length === 0`), `false`, empty object (obj with `0` enumerable props), and empty collection/iterable object (`Map`, `Set` etc.), NaN,
 * Also this method is useful when the user, themselves, have to call `toNotEmptyOptions` for a specific reason.
 * @function module:notEmptyValidator.notEmptyValidatorNoNormalize
 * @param options {Object}
 * @param value {*}
 * @returns {*}
 */
notEmptyValidatorNoNormalize = curry((options, value) => {
  const result = isEmpty(value),
        // If test failed
  messages = result ? [getErrorMsgByKey(options, 'EMPTY_NOT_ALLOWED', value)] : [];
  return toValidationResult({
    result: !result,
    messages,
    value
  });
}),

/**
 * Returns a validation result indicating whether give `value`
 * is an empty* value or not (*@see `notEmptyValidatorNoNormalize` for more about
 * empties).
 * @function module:notEmptyValidator.notEmptyValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
notEmptyValidator = curry((options, value) => notEmptyValidatorNoNormalize(toNotEmptyOptions(options), value)),

/**
 * Same as `notEmptyValidator` except doesn't require first parameter ("options" parameter). (*@see `notEmptyValidatorNoNormalize` for more about
 * empties).
 * @function module:notEmptyValidator.notEmptyValidator1
 * @param value {*}
 * @returns {Object}
 */
notEmptyValidator1 = value => notEmptyValidatorNoNormalize(null, value);

/**
 * Created by Ely on 1/21/2015.
 * @module stringLengthValidator
 */
const 
/**
 * Normalizes (ensures has expected properties) `stringLengthValidator`'s options.
 * @function module:stringLengthValidator.toStringLengthOptions
 * @param options {Object}
 * @returns {Object}
 */
toStringLengthOptions = options => {
  const _options = {
    messageTemplates: {
      NOT_OF_TYPE: value => `Value is not a String.  ` + `Value type received: ${typeOf(value)}.  ` + `Value received: "${value}".`
    }
  };
  return toLengthOptions(options ? assignDeep(_options, options) : _options);
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
stringLengthValidatorNoNormalize = curry((options, value) => {
  const messages = [],
        isOfType = isString(value),
        valLength = isOfType ? value.length : 0,
        isWithinRange = valLength >= options.min && valLength <= options.max;

  if (!isOfType) {
    messages.push(getErrorMsgByKey(options, 'NOT_OF_TYPE', value));
  } else if (!isWithinRange) {
    messages.push(getErrorMsgByKey(options, 'NOT_WITHIN_RANGE', value));
  }

  return toValidationResult({
    result: isOfType && isWithinRange,
    messages,
    value
  });
}),

/**
 * @function module:stringLengthValidator.stringLengthValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
stringLengthValidator = curry((options, value) => stringLengthValidatorNoNormalize(toStringLengthOptions(options), value));

export { alnumValidator, alnumValidator1, defaultValueObscurator, digitValidator, digitValidator1, getErrorMsgByKey, isOneOf, lengthValidator, lengthValidatorNoNormalize, notEmptyValidator, notEmptyValidator1, notEmptyValidatorNoNormalize, regexValidator, regexValidatorNoNormalize, stringLengthValidator, stringLengthValidatorNoNormalize, toLengthOptions, toNotEmptyOptions, toRegexValidatorOptions, toStringLengthOptions, toValidationOptions, toValidationResult };
//# sourceMappingURL=fjl-validator.mjs.map
