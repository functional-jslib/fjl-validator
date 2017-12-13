/**
 * Created by Ely on 7/21/2014.
 */
import {validationResult, validationOptions, getErrorMsgByKey} from './validationOptions';
import {isEmpty, curry} from 'fjl';

export const

    notEmptyOptions = options =>
        validationOptions({
            messageTemplates: {
                EMPTY_NOT_ALLOWED: () =>
                    'Empty values are not allowed.'
            }
        }, options),

    notEmptyValidator = curry((options, value) => {
        const ops = notEmptyOptions(options),
            result = !isEmpty(value),
            // If test failed
            messages = !result ? [getErrorMsgByKey(
                ops, 'EMPTY_NOT_ALLOWED', value
            )] : [];
        return validationResult({result, messages, value});
    });

export default notEmptyValidator;
