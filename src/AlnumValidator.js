/**
 * Created by Ely on 1/21/2015.
 */
import {regexValidator} from "./RegexValidator";
import {curry, assignDeep} from 'fjl';

export const alnumValidator = curry((options, value) => regexValidator(assignDeep({
        pattern: /^[\da-z]+$/i,
        messageTemplates: {
            DOES_NOT_MATCH_PATTERN: x =>
                `Value is not alpha-numeric.  Value received: "${x}".`
        }
    }, options), value));

export default alnumValidator;
