/**
 * Created by Ely on 7/21/2014.
 * Initial idea borrowed from Zend Framework 2's Zend/Validator
 * @module ValidatorOptions
 */
import {assignDeep, assign, isset,
    call, isFunction, isString, apply, repeat, curry} from 'fjl';

import {defineEnumProps$} from 'fjl-mutable';

export const

    /**
     * Default value obscurator.
     * @function module:ValidatorOptions.defaultValueObscurator
     * @param x {*} - Value to obscurate.
     * @returns {String} - Obscurated value.
     */
    defaultValueObscurator = x => repeat((x + '').length, '*'),

    /**
     * Gets an error message by `messageTemplates` key from `options` object.
     * @function module:ValidatorOptions.getErrorMsgByKey
     * @param options {Object}
     * @param key {(String|Function)}
     * @param value {*}
     * @returns {String|undefined} - Error message if successfully resolved one else `undefined`.
     * @curried
     */
    getErrorMsgByKey = curry((options, key, value) => {
        let message;
        const {messageTemplates, valueObscured, valueObscurator} = options,
            _value = valueObscured ? valueObscurator(value) : value;
        if (isFunction(key)) {
            message = call(key, _value, options);
        }
        else if (!isString(key) || !messageTemplates || !messageTemplates[key]) {
            return;
        }
        else if (isFunction(messageTemplates[key])) {
            message = call(messageTemplates[key], _value, options);
        }
        else {
            message = messageTemplates[key];
        }
        return message;
    }),

    /**
     * Returns a strongly typed/normalized ValidatorOptions object.
     * @function module:ValidatorOptions.toValidationOptions
     * @param options {...Object}
     * @returns {Object}
     */
    toValidationOptions = (...options) => {
        const _options = defineEnumProps$([
            [Object, 'messageTemplates', {}],
            [Boolean, 'valueObscured', false],
            [Function, 'valueObscurator', defaultValueObscurator]
        ], {});
        return options.length ?
            apply(assignDeep, [_options].concat(options.filter(isset))) :
            _options;
    },

    /**
     * Returns a strongly typed, normalized validation result object.
     * @function module:ValidatorOptions.toValidationResult
     * @param options {Object}
     * @returns {*}
     */
    toValidationResult = options => {
        const _options = defineEnumProps$([
            [Boolean, 'result'],
            [Array, 'messages']
        ], {});
        _options.value = undefined;
        return options ? assign(_options, options) : _options;
    }
;

export default toValidationResult;
