/**
 * Created by Ely on 1/21/2015.
 */
import {regexValidator} from "./regexValidator";
import {curry, assignDeep} from 'fjl';

export const digitValidator = curry((options, value) => regexValidator(assignDeep({
        pattern: /^\d+$/,
        messageTemplates: {
            DOES_NOT_MATCH_PATTERN: x =>
                `The value passed in contains non digital characters.  ` +
                `Value received: "${x}".`
        }
    }, options), value));

export default digitValidator;
