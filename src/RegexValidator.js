/**
 * Created by Ely on 7/21/2014.
 */
import {validationResult, validationOptions} from "./ValidationOptions";
import {getErrorMsgByKey} from "./ValidationOptions";
import {defineEnumProp$} from "fjl-mutable";
import {curry, assignDeep} from 'fjl';

export const

    validate = (options, value) => {
        const result = options.pattern.test(value),

            // If test failed
            messages = !result ?
                [getErrorMsgByKey(options, 'DOES_NOT_MATCH_PATTERN', value)] :
                [];

        return validationResult({ result, messages, value });
    },

    regexValidatorOptions = options => {
        const [_options] = defineEnumProp$(RegExp, {}, 'pattern', /./);
        _options.messageTemplates = {
            DOES_NOT_MATCH_PATTERN: (value, options) =>
                'The value passed in does not match pattern"'
                + options.pattern + '".  Value passed in: "'
                + options.value + '".'
        };
        return validationOptions(
            options ? assignDeep(_options, options) : _options
        );
    },

    regexValidator = curry((options, value) => {
        return validate (regexValidatorOptions(options), value);
    });

export default regexValidator;
