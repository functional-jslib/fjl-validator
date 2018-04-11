import { assignDeep, call, curry, isEmpty, isFunction, isString, repeat, typeOf } from 'fjl';
import { defineEnumProp$, defineEnumProps$ } from 'fjl-mutable';

/**
 * Created by Ely on 7/21/2014.
 * Initial idea borrowed from Zend Framework 2's Zend/Validator
 * @module ValidationUtils
 */
const defaultValueObscurator = x => repeat((x + '').length, '*');
const getErrorMsgByKey = curry((options, key, value) => {
        let message;
        const {messageTemplates, valueObscured, valueObscurator} = options,
            _value = valueObscured ? valueObscurator(value) : value;
        if (isFunction(key)) {
            message = call(key, _value, options);
        }
        else if (!isString(key) || !messageTemplates || !messageTemplates[key]) {
            return;
        }
        else if (isFunction(messageTemplates[key])) {
            message = call(messageTemplates[key], _value, options);
        }
        else {
            message = messageTemplates[key];
        }
        return message;
    });
const toValidationOptions = (...options) =>
        assignDeep(defineEnumProps$([
            [Object, 'messageTemplates', {}],
            [Boolean, 'valueObscured', false],
            [Function, 'valueObscurator', defaultValueObscurator]
        ], {}), ...(options.length ? options : [{}]));
const toValidationResult = (...options) =>
        assignDeep(defineEnumProps$([
                [Boolean, 'result', false],
                [Array, 'messages', []]
            ], {}),
            {value: undefined},
            ...(options.length ? options : [{}])
        );

/**
 * Created by Ely on 7/21/2014.
 * Module for validating a value by regular expression.
 * @module regexValidator
 */
const toRegexValidatorOptions = options => {
        const [_options] = defineEnumProp$(RegExp, toValidationOptions(), 'pattern', /./);
        _options.messageTemplates = {
            DOES_NOT_MATCH_PATTERN: (value, ops) =>
                'The value passed in does not match pattern"'
                + ops.pattern + '".  Value passed in: "'
                + value + '".'
        };
        return options ? assignDeep(_options, options) : _options;
    };
const regexValidatorNoNormalize$ = (options, value) => {
        const result = options.pattern.test(value),

            // If test failed
            messages = !result ?
                [getErrorMsgByKey(options, 'DOES_NOT_MATCH_PATTERN', value)] :
                [];

        return toValidationResult({ result, messages, value });
    };
const regexValidator$ = (options, value) => regexValidatorNoNormalize$(toRegexValidatorOptions(options), value);
const regexValidator = curry(regexValidator$);

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
const alnumValidator = curry((options, value) =>
        regexValidator(assignDeep({
            pattern: /^[\da-z]+$/i,
            messageTemplates: {
                DOES_NOT_MATCH_PATTERN: x =>
                    `Value is not alpha-numeric.  Value received: '${x}'.`
            }
        }, options), value)
    );
const alnumValidator1 = value => alnumValidator(null, value);

/**
 * Created by Ely on 1/21/2015.
 * Module for validating digits.
 * @module digitValidator
 */
const digitValidator = curry((options, value) => regexValidator(assignDeep({
        pattern: /^\d+$/,
        messageTemplates: {
            DOES_NOT_MATCH_PATTERN: x =>
                `The value passed in contains non digital characters.  ` +
                `Value received: "${x}".`
        }
    }, options), value));
const digitValidator1 = value => digitValidator(null, value);

/**
 * Created by Ely on 7/21/2014.
 * @module notEmptyValidator
 */
const toNotEmptyOptions = options =>
        toValidationOptions({
            messageTemplates: {
                EMPTY_NOT_ALLOWED: () =>
                    'Empty values are not allowed.'
            }
        }, options);
const notEmptyValidatorNoNormalize$ = (options, value) => {
        const result = !isEmpty(value),
            // If test failed
            messages = !result ? [getErrorMsgByKey(
                options, 'EMPTY_NOT_ALLOWED', value
            )] : [];
        return toValidationResult({result, messages, value});
    };
const notEmptyValidator$ = (options, value) =>
        notEmptyValidatorNoNormalize$(toNotEmptyOptions(options), value);
const notEmptyValidator1 = value => notEmptyValidatorNoNormalize$(null, value);
const notEmptyValidator = curry(notEmptyValidator$);

/**
 * Created by Ely on 1/21/2015.
 * @module stringLengthValidator
 */
const toStringLengthOptions = options => {
        const _options = defineEnumProps$([
            [Number, 'min', 0],
            [Number, 'max', Number.MAX_SAFE_INTEGER]
        ], toValidationOptions());

        _options.messageTemplates = {
            NOT_OF_TYPE: (value) => `Value is not a String.  ` +
                `Value type received: ${typeOf(value)}.  ` +
                `Value received: "${value}".`,
            NOT_WITHIN_RANGE: (value, ops) => `Value is not within range ` +
                `${ops.min} to ${ops.max}.  ` +
                `Value length given: "` + value.length + `".  ` +
                `Value received: "` + value + `".`
        };

        return options ? assignDeep(_options, options) : _options;
    };
const stringLengthValidatorNoNormalize$ = (options, value) => {
        const messages = [],
            isOfType = isString(value),
            valLength = isOfType ? value.length : 0,
            isWithinRange = valLength >= options.min && valLength <= options.max;
        if (!isOfType) {
            messages.push(getErrorMsgByKey(options, 'NOT_OF_TYPE', value));
        }
        else if (!isWithinRange) {
            messages.push(getErrorMsgByKey(options, 'NOT_WITHIN_RANGE', value));
        }
        return toValidationResult({
            result: isOfType && isWithinRange,
            messages,
            value
        });
    };
const stringLengthValidator$ = (options, value) =>
        stringLengthValidatorNoNormalize$(toStringLengthOptions(options), value);
const stringLengthValidator = curry(stringLengthValidator$);

/**
 * Content generated by '{project-root}/build-scripts/VersionNumberReadStream.js'.
 * Generated Wed Apr 11 2018 10:59:21 GMT-0400 (EDT) 
 */
 
const version = '0.6.17';

/**
 * @module fjlValidator
 */

export { alnumValidator, alnumValidator1, digitValidator, digitValidator1, toNotEmptyOptions, notEmptyValidatorNoNormalize$, notEmptyValidator$, notEmptyValidator1, notEmptyValidator, toRegexValidatorOptions, regexValidatorNoNormalize$, regexValidator$, regexValidator, toStringLengthOptions, stringLengthValidatorNoNormalize$, stringLengthValidator$, stringLengthValidator, defaultValueObscurator, getErrorMsgByKey, toValidationOptions, toValidationResult, version };
