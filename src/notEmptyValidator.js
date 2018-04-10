/**
 * Created by Ely on 7/21/2014.
 * @module notEmptyValidator
 */
import {toValidationResult, toValidationOptions, getErrorMsgByKey} from './ValidationUtils';
import {isEmpty, curry} from 'fjl';

export const

    /**
     * Normalizes incoming options so that they are valid `notEmptyValidator` options.
     * @note currently `notEmptyValidator` only takes the `messageTemplates` option (may
     *  have more options in the future).
     * @function module:notEmptyValidator.toNotEmptyOptions
     * @param options {Object}
     * @returns {Object}
     */
    toNotEmptyOptions = options =>
        toValidationOptions({
            messageTemplates: {
                EMPTY_NOT_ALLOWED: () =>
                    'Empty values are not allowed.'
            }
        }, options),

    /**
     * Un-curried version of notEmptyValidator which doesn't normalize the passed in
     * options parameter (since currently `notEmptyValidator` has no options other than it's `messageTemplates`
     * field).  @see module:notEmptyValidator.notEmptyValidatorPure$ .
     * Also this method is useful when the user, themselves, have to call `toNotEmptyOptions` for a specific reason.
     * @param options {Object}
     * @param value {*}
     * @returns {*}
     */
    notEmptyValidatorPure$ = (options, value) => {
        const result = !isEmpty(value),
            // If test failed
            messages = !result ? [getErrorMsgByKey(
                options, 'EMPTY_NOT_ALLOWED', value
            )] : [];
        return toValidationResult({result, messages, value});
    },

    /**
     * Un-curried version of `notEmptyValidator`
     * @function module:notEmptyValidator.notEmptyValidator$
     * @param options {Object}
     * @param value {*}
     * @returns {Object}
     */
    notEmptyValidator$ = (options, value) =>
        notEmptyValidatorPure$(toNotEmptyOptions(options), value),

    /**
     * Same as `notEmptyValidator` except doesn't require first parameter ("options" parameter).
     * @function module:notEmptyValidator.notEmptyValidator1
     * @param value {*}
     * @returns {Object}
     */
    notEmptyValidator1 = value => notEmptyValidator1$(null, value),

    /**
     * @function module:notEmptyValidator.notEmptyValidator
     * @param options {Object}
     * @param value {*}
     * @returns {Object}
     */
    notEmptyValidator = curry(notEmptyValidator$);

export default notEmptyValidator;
