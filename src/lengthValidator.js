/**
 * Created by Ely on 1/21/2015.
 * @module lengthValidator
 */
import {toValidationResult, getErrorMsgByKey, toValidationOptions, isOneOf} from './ValidationUtils';
import {typeOf, isString, assignDeep, curry, isset} from 'fjl';
import {defineEnumProps$} from 'fjl-mutable';

export const

    /**
     * Normalizes `lengthValidator` options.
     * @function module:lengthValidator.toLengthOptions
     * @param options {Object}
     * @returns {Object}
     */
    toLengthOptions = options => {
        const _options = defineEnumProps$([
            [Number, 'min', 0],
            [Number, 'max', Number.MAX_SAFE_INTEGER]
        ], toValidationOptions());
        _options.messageTemplates = {
            NOT_OF_TYPE: value => `Value does not have a \`length\` property.  ` +
                `Type received: \`${typeOf(value)}\`.  ` +
                `Value received: \`${value}\`.`,
            NOT_WITHIN_RANGE: (value, ops) => `Value's length is not within range ` +
                `${ops.min} to ${ops.max}.  ` +
                `Evaluated length is \`${value.length}\`.  ` +
                `Value received: \`${value}\`.`
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
            messages = []
        ;
        let valLength,
            isWithinRange,
            result = false
        ;
        if (isOneOf(value, ['Null', 'Undefined', 'NaN', 'Symbol']) || !value.hasOwnProperty('length')) {
            messages.push(getErrorMsgByKey(ops, 'NOT_OF_TYPE', value));
            return toValidationResult({result, messages, value});
        }
        valLength = value.length;
        isWithinRange = valLength >= ops.min && valLength <= ops.max;
        if (!isWithinRange) {
            messages.push(getErrorMsgByKey(ops, 'NOT_WITHIN_RANGE', value));
        }
        else {
            result = true;
        }
        return toValidationResult({
            result,
            messages,
            value
        });
    })
;

export default lengthValidator;
