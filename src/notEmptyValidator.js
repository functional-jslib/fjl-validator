/**
 * Created by Ely on 7/21/2014.
 * @module notEmptyValidator
 */
import {toValidationResult, toValidationOptions, getErrorMsgByKey} from './ValidationUtils';
import {isEmpty, curry} from 'fjl';

export const

    /**
     * @function module:notEmptyValidator.notEmptyOptions
     * @param options {Object}
     * @returns {Object}
     */
    notEmptyOptions = options =>
        toValidationOptions({
            messageTemplates: {
                EMPTY_NOT_ALLOWED: () =>
                    'Empty values are not allowed.'
            }
        }, options),

    /**
     * @function module:notEmptyValidator.notEmptyValidator
     * @param options {Object}
     * @param value {*}
     * @returns {Object}
     */
    notEmptyValidator = curry((options, value) => {
        const ops = notEmptyOptions(options),
            result = !isEmpty(value),
            // If test failed
            messages = !result ? [getErrorMsgByKey(
                ops, 'EMPTY_NOT_ALLOWED', value
            )] : [];
        return toValidationResult({result, messages, value});
    });

export default notEmptyValidator;
