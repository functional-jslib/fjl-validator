/**
 * Created by Ely on 1/21/2015.
 */
import {validationResult, getErrorMsgByKey, validationOptions} from "./ValidationOptions";
import {typeOf, isString, apply, concat, assign, assignDeep, curry} from 'fjl';
import {defineEnumProps$} from 'fjl-mutable';

export const validate = (options, value) => {
        const messages = [],
            isOfType = isString(value),
            valLength = isOfType ? value.length : 0,
            isWithinRange = valLength >= options.min && valLength <= options.max;
        if (!isOfType) {
            messages.push(getErrorMsgByKey('NOT_OF_TYPE', value, options));
        }
        else if (!isWithinRange) {
            messages.push(getErrorMsgByKey('NOT_WITHIN_RANGE', value, options));
        }
        return validationResult({
            result: isOfType && isWithinRange,
            messages,
            value
        });
    },

    stringLengthOptions = options => {
        const _options = defineEnumProps$([
            [Number, 'min', 0],
            [Number, 'max', Number.MAX_SAFE_INTEGER]
        ], {});

        _options.messageTemplates = {
            NOT_OF_TYPE: (value) => `Value is not a String.  ` +
                `Value type received: ${typeOf(value)}.` +
                `Value received: "${value}".`,
            NOT_WITHIN_RANGE: (value, options) => `Value is not within range ` +
                `${options.min} to ${options.max}.` +
                `Value length given: "` + value.length + `".` +
                `Value received: "` + value + `".`
        };

        return validationOptions(options ? assignDeep(_options, options) : _options);
    },

    stringLengthValidator = curry((options, value) => {
        return validate (stringLengthOptions(options), value);
    });

export default stringLengthValidator;
