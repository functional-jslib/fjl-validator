/**
 * Created by Ely on 7/21/2014.
 */
import {validationResult, validationOptions, getErrorMsgByKey}
    from './validationOptions';
import {defineEnumProp$} from 'fjl-mutable';
import {curry, assignDeep} from 'fjl';

export const

    regexValidatorOptions = options => {
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
    },

    regexValidator = curry((options, value) => {
        const ops = regexValidatorOptions(options),
            result = ops.pattern.test(value),

            // If test failed
            messages = !result ?
                [getErrorMsgByKey(ops, 'DOES_NOT_MATCH_PATTERN', value)] :
                [];

        return validationResult({ result, messages, value });
    });

export default regexValidator;
