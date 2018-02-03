/**
 * Created by Ely on 7/21/2014.
 * @module regexValidator
 */
import {toValidationResult, toValidationOptions, getErrorMsgByKey}
    from './ValidationUtils';
import {defineEnumProp$} from 'fjl-mutable';
import {curry, assignDeep} from 'fjl';

export const

    /**
     * @function module:regexValidator.regexValidatorOptions
     * @param options {Object}
     * @returns {Object}
     */
    regexValidatorOptions = options => {
        const [_options] = defineEnumProp$(RegExp, toValidationOptions(), 'pattern', /./);
        _options.messageTemplates = {
            DOES_NOT_MATCH_PATTERN: (value, ops) =>
                'The value passed in does not match pattern"'
                + ops.pattern + '".  Value passed in: "'
                + value + '".'
        };
        return options ? assignDeep(_options, options) : _options;
    },

    toRegexValidatorOptions = regexValidatorOptions,

    regexValidator1$ = (options, value) => {
        const result = options.pattern.test(value),

            // If test failed
            messages = !result ?
                [getErrorMsgByKey(options, 'DOES_NOT_MATCH_PATTERN', value)] :
                [];

        return toValidationResult({ result, messages, value });
    },

    regexValidator$ = (options, value) => regexValidator1$(toRegexValidatorOptions(options), value),

    regexValidator1 = curry(regexValidator1$),

    /**
     * @function module:regexValidator.regexValidator
     * @param options {Object}
     * @param value {*}
     * @returns {Object}
     */
    regexValidator = curry(regexValidator$)

;

export default regexValidator;
