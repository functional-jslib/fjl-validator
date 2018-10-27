import { assignDeep, call, isFunction, isString, repeat, curry, toTypeRefName, typeOf, isEmpty } from 'fjl';
import { defineEnumProps$, defineEnumProp$ } from 'fjl-mutable';

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
toValidationOptions = (...options) => assignDeep(defineEnumProps$([[Object, 'messageTemplates', {}], [Boolean, 'valueObscured', false], [Function, 'valueObscurator', defaultValueObscurator]], {}), ...(options.length ? options : [{}])),

/**
 * Returns a strongly typed, normalized validation result object.
 * @function module:ValidationUtils.toValidationResult
 * @param options {...Object}
 * @returns {*}
 */
toValidationResult = (...options) => assignDeep(defineEnumProps$([[Boolean, 'result', false], [Array, 'messages', []]], {}), {
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
  const [_options] = defineEnumProp$(RegExp, toValidationOptions(), 'pattern', /./);
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
 * @function module:regexValidator.regexValidatorNoNormalize$
 * @param options {Object}
 * @param value {*}
 * @returns {*}
 */
regexValidatorNoNormalize$ = (options, value) => {
  const result = options.pattern.test(value),
        // If test failed
  messages = !result ? [getErrorMsgByKey(options, 'DOES_NOT_MATCH_PATTERN', value)] : [];
  return toValidationResult({
    result,
    messages,
    value
  });
},

/**
 * Un-curried version of `regexValidator`.
 * @function module:regexValidator.regexValidator$
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
regexValidator$ = (options, value) => regexValidatorNoNormalize$(toRegexValidatorOptions(options), value),

/**
 * Validates a value with the regex `pattern` option passed in.
 * @curried
 * @function module:regexValidator.regexValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
regexValidator = curry(regexValidator$);

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
 */
const 
/**
 * Normalizes `lengthValidator` options.
 * @function module:lengthValidator.toLengthOptions
 * @param options {Object}
 * @returns {Object}
 */
toLengthOptions = options => {
  const _options = defineEnumProps$([[Number, 'min', 0], [Number, 'max', Number.MAX_SAFE_INTEGER]], toValidationOptions());

  _options.messageTemplates = {
    NOT_OF_TYPE: value => `Value does not have a \`length\` property.  ` + `Type received: \`${typeOf(value)}\`.  ` + `Value received: \`${value}\`.`,
    NOT_WITHIN_RANGE: (value, ops) => `Value's length is not within range ` + `${ops.min} to ${ops.max}.  ` + `Evaluated length is \`${value.length}\`.  ` + `Value received: \`${value}\`.`
  };
  return options ? assignDeep(_options, options) : _options;
},

/**
 * Validates whether given value has a length and whether length is between
 *  given range (@see options for range props).
 * @function module:lengthValidator.lengthValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
lengthValidator = curry((options, value) => {
  const ops = toLengthOptions(options),
        messages = [];
  let valLength,
      isWithinRange,
      result = false;

  if (isOneOf(value, 'Null', 'Undefined', 'NaN', 'Symbol') || !value.hasOwnProperty('length')) {
    messages.push(getErrorMsgByKey(ops, 'NOT_OF_TYPE', value));
    return toValidationResult({
      result,
      messages,
      value
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
    result,
    messages,
    value
  });
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
 * Un-curried version of notEmptyValidator which doesn't normalize the passed in
 * options parameter (since currently `notEmptyValidator` has no options other than it's `messageTemplates`
 * field).  @see module:notEmptyValidator.notEmptyValidatorNoNormalize$ .
 * Also this method is useful when the user, themselves, have to call `toNotEmptyOptions` for a specific reason.
 * @param options {Object}
 * @param value {*}
 * @returns {*}
 */
notEmptyValidatorNoNormalize$ = (options, value) => {
  const result = isEmpty(value),
        // If test failed
  messages = result ? [getErrorMsgByKey(options, 'EMPTY_NOT_ALLOWED', value)] : [];
  return toValidationResult({
    result: !result,
    messages,
    value
  });
},

/**
 * Un-curried version of `notEmptyValidator`
 * @function module:notEmptyValidator.notEmptyValidator$
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
notEmptyValidator$ = (options, value) => notEmptyValidatorNoNormalize$(toNotEmptyOptions(options), value),

/**
 * Same as `notEmptyValidator` except doesn't require first parameter ("options" parameter).
 * @function module:notEmptyValidator.notEmptyValidator1
 * @param value {*}
 * @returns {Object}
 */
notEmptyValidator1 = value => notEmptyValidatorNoNormalize$(null, value),

/**
 * @function module:notEmptyValidator.notEmptyValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
notEmptyValidator = curry(notEmptyValidator$);

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
  const _options = defineEnumProps$([[Number, 'min', 0], [Number, 'max', Number.MAX_SAFE_INTEGER]], toValidationOptions());

  _options.messageTemplates = {
    NOT_OF_TYPE: value => `Value is not a String.  ` + `Value type received: ${typeOf(value)}.  ` + `Value received: "${value}".`,
    NOT_WITHIN_RANGE: (value, ops) => `Value is not within range ` + `${ops.min} to ${ops.max}.  ` + `Value length given: "` + value.length + `".  ` + `Value received: "` + value + `".`
  };
  return options ? assignDeep(_options, options) : _options;
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
stringLengthValidatorNoNormalize$ = (options, value) => {
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
},

/**
 * @function module:stringLengthValidator.stringLengthValidator$
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
stringLengthValidator$ = (options, value) => stringLengthValidatorNoNormalize$(toStringLengthOptions(options), value),

/**
 * @function module:stringLengthValidator.stringLengthValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
stringLengthValidator = curry(stringLengthValidator$);

/**
 * @module fjlValidator
 */

export { alnumValidator, alnumValidator1, digitValidator, digitValidator1, toLengthOptions, lengthValidator, toNotEmptyOptions, notEmptyValidatorNoNormalize$, notEmptyValidator$, notEmptyValidator1, notEmptyValidator, toRegexValidatorOptions, regexValidatorNoNormalize$, regexValidator$, regexValidator, toStringLengthOptions, stringLengthValidatorNoNormalize$, stringLengthValidator$, stringLengthValidator, defaultValueObscurator, getErrorMsgByKey, toValidationOptions, toValidationResult, isOneOf };
//# sourceMappingURL=fjl-validator.mjs.map
