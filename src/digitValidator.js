/**
 * Created by Ely on 1/21/2015.
 * @module digitValidator
 */
import {regexValidator} from './regexValidator';
import {curry, assignDeep} from 'fjl';

/**
 * @function module:digitValidator.digitValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
export const digitValidator = curry((options, value) => regexValidator(assignDeep({
        pattern: /^\d+$/,
        messageTemplates: {
            DOES_NOT_MATCH_PATTERN: x =>
                `The value passed in contains non digital characters.  ` +
                `Value received: "${x}".`
        }
    }, options), value));

export default digitValidator;
