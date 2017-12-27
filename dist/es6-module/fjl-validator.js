import { apply, assign, assignDeep, call, curry, isEmpty, isFunction, isString, isset, repeat, typeOf } from 'fjl';
import { defineEnumProp$, defineEnumProps$ } from 'fjl-mutable';

/**
 * Created by Ely on 7/21/2014.
 * Initial idea borrowed from Zend Framework 2's Zend/Validator
 * @module ValidatorOptions
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
const toValidationOptions = (...options) => {
        const _options = defineEnumProps$([
            [Object, 'messageTemplates', {}],
            [Boolean, 'valueObscured', false],
            [Function, 'valueObscurator', defaultValueObscurator]
        ], {});
        return options.length ?
            apply(assignDeep, [_options].concat(options.filter(isset))) :
            _options;
    };
const toValidationResult = options => {
        const _options = defineEnumProps$([
            [Boolean, 'result', false],
            [Array, 'messages', []]
        ], {});
        _options.value = undefined;
        return options ? assign(_options, options) : _options;
    };

/**
 * Created by Ely on 7/21/2014.
 * @module regexValidator
 */
const regexValidatorOptions = options => {
        const [_options] = defineEnumProp$(RegExp, {}, 'pattern', /./);
        _options.messageTemplates = {
            DOES_NOT_MATCH_PATTERN: (value, ops) =>
                'The value passed in does not match pattern"'
                + ops.pattern + '".  Value passed in: "'
                + value + '".'
        };
        return toValidationOptions(
            options ? assignDeep(_options, options) : _options
        );
    };
const regexValidator = curry((options, value) => {
        const ops = regexValidatorOptions(options),
            result = ops.pattern.test(value),

            // If test failed
            messages = !result ?
                [getErrorMsgByKey(ops, 'DOES_NOT_MATCH_PATTERN', value)] :
                [];

        return toValidationResult({ result, messages, value });
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
const alnumValidator = curry((options, value) => regexValidator(assignDeep({
        pattern: /^[\da-z]+$/i,
        messageTemplates: {
            DOES_NOT_MATCH_PATTERN: x =>
                `Value is not alpha-numeric.  Value received: '${x}'.`
        }
    }, options), value));

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
const digitValidator = curry((options, value) => regexValidator(assignDeep({
        pattern: /^\d+$/,
        messageTemplates: {
            DOES_NOT_MATCH_PATTERN: x =>
                `The value passed in contains non digital characters.  ` +
                `Value received: "${x}".`
        }
    }, options), value));

/**
 * Created by Ely on 7/21/2014.
 * @module notEmptyValidator
 */
const notEmptyOptions = options =>
        toValidationOptions({
            messageTemplates: {
                EMPTY_NOT_ALLOWED: () =>
                    'Empty values are not allowed.'
            }
        }, options);
const notEmptyValidator = curry((options, value) => {
        const ops = notEmptyOptions(options),
            result = !isEmpty(value),
            // If test failed
            messages = !result ? [getErrorMsgByKey(
                ops, 'EMPTY_NOT_ALLOWED', value
            )] : [];
        return toValidationResult({result, messages, value});
    });

/**
 * Created by Ely on 1/21/2015.
 * @module stringLengthValidator
 */
const stringLengthOptions = options => {
        const _options = defineEnumProps$([
            [Number, 'min', 0],
            [Number, 'max', Number.MAX_SAFE_INTEGER]
        ], {});

        _options.messageTemplates = {
            NOT_OF_TYPE: (value) => `Value is not a String.  ` +
                `Value type received: ${typeOf(value)}.  ` +
                `Value received: "${value}".`,
                NOT_WITHIN_RANGE: (value, ops) => `Value is not within range ` +
                    `${ops.min} to ${ops.max}.  ` +
                    `Value length given: "` + value.length + `".  ` +
                    `Value received: "` + value + `".`
        };

        return toValidationOptions(options ? assignDeep(_options, options) : _options);
    };
const stringLengthValidator = curry((options, value) => {
        const ops = stringLengthOptions(options),
            messages = [],
            isOfType = isString(value),
            valLength = isOfType ? value.length : 0,
            isWithinRange = valLength >= ops.min && valLength <= ops.max;
        if (!isOfType) {
            messages.push(getErrorMsgByKey(ops, 'NOT_OF_TYPE', value));
        }
        else if (!isWithinRange) {
            messages.push(getErrorMsgByKey(ops, 'NOT_WITHIN_RANGE', value));
        }
        return toValidationResult({
            result: isOfType && isWithinRange,
            messages,
            value
        });
    });

/**
 * Content generated by '{project-root}/build-scripts/VersionNumberReadStream.js'.
 * Generated Tue Dec 26 2017 23:08:21 GMT-0500 (Eastern Standard Time) 
 */
 
const version = '0.6.4';

/**
 * @module fjlValidator
 */

export { alnumValidator, digitValidator, notEmptyOptions, notEmptyValidator, regexValidatorOptions, regexValidator, stringLengthOptions, stringLengthValidator, defaultValueObscurator, getErrorMsgByKey, toValidationOptions, toValidationResult, version };
