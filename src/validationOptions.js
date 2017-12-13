/**
 * Created by Ely on 7/21/2014.
 * Initial idea borrowed from Zend Framework 2's Zend/Validator
 */
import {assignDeep, assign, isset,
    isType, typeOf, call, isFunction,
    isString, apply, repeat,
    concat, curry} from 'fjl';

import {defineEnumProps$} from 'fjl-mutable';

export const

    defaultValueObscurator = x => repeat((x + '').length, '*'),

    getErrorMsgByKey = curry((options, key, value) => {
        let message;
        const {messageTemplates, valueObscured, valueObscurator} = options,
            _value = valueObscured ? valueObscurator(value) : value;
        if (isFunction(key)) {
            message = call(key, options, _value);
        }
        else if (!isString(key) || !messageTemplates[key]) {
            return;
        }
        else if (isFunction(messageTemplates[key])) {
            message = call(messageTemplates[key], options, _value);
        }
        else {
            message = messageTemplates[key];
        }
        return message;
    }),

    validationOptions = (...options) => {
        const _options = defineEnumProps$([
            [Number, 'messagesMaxLength', 100],
            [Object, 'messageTemplates', {}],
            [Boolean, 'valueObscured', false],
            [Function, 'valueObscurator', defaultValueObscurator]
        ], {});
        return options.length ?
            apply(assignDeep, [_options].concat(options.filter(isset))) :
            _options;
    },

    validationResult = options => {
        const _options = defineEnumProps$([
            [Boolean, 'result'],
            [Array, 'messages']
        ], {});
        _options.value = undefined;
        return options ? assign(_options, options) : _options;
    }
;

export default validationResult;
