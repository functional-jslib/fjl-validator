/**
 * Created by Ely on 7/21/2014.
 */
import {validationResult, validationOptions, getErrorMsgByKey} from "./ValidationOptions";
import {isEmpty, curry} from 'fjl';

export const

    validate = (options, value) => {
        const result = !isEmpty(value),
            // If test failed
            messages = !result ? [getErrorMsgByKey(
                options, 'EMPTY_NOT_ALLOWED', value
            )] : [];
        return validationResult({result, messages, value});
    },

    notEmptyOptions = options =>
        validationOptions({
            messageTemplates: {
                EMPTY_NOT_ALLOWED: () =>
                    'Empty values are not allowed.'
            }
        }, options),

    notEmptyValidator = curry((options, value) => {
        return validate (notEmptyOptions(options), value);
    });

export default notEmptyValidator;
