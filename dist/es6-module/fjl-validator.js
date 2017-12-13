import { apply, assign, assignDeep, call, curry, isEmpty, isFunction, isString, isset, repeat, typeOf } from 'fjl';
import { defineEnumProp$, defineEnumProps$ } from 'fjl-mutable';

/**
 * Created by Ely on 7/21/2014.
 * Initial idea borrowed from Zend Framework 2's Zend/Validator
 */
const defaultValueObscurator = x => repeat((x + '').length, '*');
const getErrorMsgByKey = curry((options, key, value) => {
        let message;
        const {messageTemplates, valueObscured, valueObscurator} = options,
            _value = valueObscured ? valueObscurator(value) : value;
        if (isFunction(key)) {
            message = call(key, options, _value);
        }
        else if (!isString(key) || !messageTemplates[key]) {
            return;
        }
        else if (isFunction(messageTemplates[key])) {
            message = call(messageTemplates[key], options, _value);
        }
        else {
            message = messageTemplates[key];
        }
        return message;
    });
const validationOptions = (...options) => {
        const _options = defineEnumProps$([
            [Number, 'messagesMaxLength', 100],
            [Object, 'messageTemplates', {}],
            [Boolean, 'valueObscured', false],
            [Function, 'valueObscurator', defaultValueObscurator]
        ], {});
        return options.length ?
            apply(assignDeep, [_options].concat(options.filter(isset))) :
            _options;
    };
const validationResult = options => {
        const _options = defineEnumProps$([
            [Boolean, 'result'],
            [Array, 'messages']
        ], {});
        _options.value = undefined;
        return options ? assign(_options, options) : _options;
    };

/**
 * Created by Ely on 7/21/2014.
 */
const regexValidatorOptions = options => {
        const [_options] = defineEnumProp$(RegExp, {}, 'pattern', /./);
        _options.messageTemplates = {
            DOES_NOT_MATCH_PATTERN: (value, ops) =>
                'The value passed in does not match pattern"'
                + ops.pattern + '".  Value passed in: "'
                + ops.value + '".'
        };
        return validationOptions(
            options ? assignDeep(_options, options) : _options
        );
    };
const regexValidator = curry((options, value) => {
        const ops = regexValidatorOptions(options),
            result = ops.pattern.test(value),

            // If test failed
            messages = !result ?
                [getErrorMsgByKey(options, 'DOES_NOT_MATCH_PATTERN', value)] :
                [];

        return validationResult({ result, messages, value });
    });

/**
 * Created by Ely on 1/21/2015.
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
 */
const notEmptyOptions = options =>
        validationOptions({
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
        return validationResult({result, messages, value});
    });

/**
 * Created by Ely on 1/21/2015.
 */
const stringLengthOptions = options => {
        const _options = defineEnumProps$([
            [Number, 'min', 0],
            [Number, 'max', Number.MAX_SAFE_INTEGER]
        ], {});

        _options.messageTemplates = {
            NOT_OF_TYPE: (value) => `Value is not a String.  ` +
                `Value type received: ${typeOf(value)}.` +
                `Value received: "${value}".`,
            NOT_WITHIN_RANGE: (value, ops) => `Value is not within range ` +
                `${ops.min} to ${ops.max}.` +
                `Value length given: "` + value.length + `".` +
                `Value received: "` + value + `".`
        };

        return validationOptions(options ? assignDeep(_options, options) : _options);
    };
const stringLengthValidator = curry((options, value) => {
        const ops = stringLengthOptions(options),
            messages = [],
            isOfType = isString(value),
            valLength = isOfType ? value.length : 0,
            isWithinRange = valLength >= ops.min && valLength <= ops.max;
        if (!isOfType) {
            messages.push(getErrorMsgByKey('NOT_OF_TYPE', value, ops));
        }
        else if (!isWithinRange) {
            messages.push(getErrorMsgByKey('NOT_WITHIN_RANGE', value, ops));
        }
        return validationResult({
            result: isOfType && isWithinRange,
            messages,
            value
        });
    });

/**
 * Content generated by '{project-root}/build-scripts/VersionNumberReadStream.js'.
 * Generated Wed Dec 13 2017 13:12:55 GMT-0500 (Eastern Standard Time) 
 */
 
const version = '0.5.0';

export { alnumValidator, digitValidator, notEmptyOptions, notEmptyValidator, regexValidatorOptions, regexValidator, stringLengthOptions, stringLengthValidator, defaultValueObscurator, getErrorMsgByKey, validationOptions, validationResult, version };