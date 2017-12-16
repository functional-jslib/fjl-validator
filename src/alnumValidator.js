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
export const alnumValidator = curry((options, value) => regexValidator(assignDeep({
        pattern: /^[\da-z]+$/i,
        messageTemplates: {
            DOES_NOT_MATCH_PATTERN: x =>
                `Value is not alpha-numeric.  Value received: '${x}'.`
        }
    }, options), value));

export default alnumValidator;
