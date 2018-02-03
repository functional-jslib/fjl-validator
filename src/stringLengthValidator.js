/**
 * Created by Ely on 1/21/2015.
 * @module stringLengthValidator
 */
import {toValidationResult, getErrorMsgByKey, toValidationOptions} from './ValidationUtils';
import {typeOf, isString, assignDeep, curry} from 'fjl';
import {defineEnumProps$} from 'fjl-mutable';

export const

    /**
     * @function module:stringLengthValidator.stringLengthOptions
     * @param options {Object}
     * @returns {Object}
     */
    stringLengthOptions = options => {
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
    },

    toStringLengthOptions = stringLengthOptions,

    stringLengthValidator1$ = (options, value) => {
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
    },

    stringLengValidator$ = (options, value) => stringLengthValidator1$(toStringLengthOptions(options), value),

    stringLengthValidator1 = curry(stringLengthValidator1$),

    /**
     * @function module:stringLengthValidator.stringLengthValidator
     * @param options {Object}
     * @value {*}
     * @returns {Object}
     */
    stringLengthValidator = curry(stringLengValidator$)

;

export default stringLengthValidator;
