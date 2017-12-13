/**
 * Created by Ely on 1/21/2015.
 */
import {validationResult, getErrorMsgByKey, validationOptions} from './validationOptions';
import {typeOf, isString, assignDeep, curry} from 'fjl';
import {defineEnumProps$} from 'fjl-mutable';

export const

    stringLengthOptions = options => {
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
    },

    stringLengthValidator = curry((options, value) => {
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

export default stringLengthValidator;