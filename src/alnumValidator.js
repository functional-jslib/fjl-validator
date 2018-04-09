/**
 * Created by Ely on 1/21/2015.
 * @module alnumValidator
 */
import {regexValidator} from './regexValidator';
import {curry, assignDeep} from 'fjl';

/**
 * @function module:alnumValidator.alnumValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
export const alnumValidator = curry((options, value) => {
    const _options = {
        pattern: /^[\da-z]+$/i,
        messageTemplates: {
            DOES_NOT_MATCH_PATTERN: x =>
                `Value is not alpha-numeric.  Value received: '${x}'.`
        }
    };
    return regexValidator(
        options ? assignDeep(_options, options) : _options,
        value
    );
});

export default alnumValidator;
