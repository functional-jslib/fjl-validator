/**
 * Created by Ely on 7/21/2014.
 * Initial idea borrowed from Zend Framework 2's Zend/Validator
 * @module validationOptions
 */
import {assignDeep, assign, isset,
    call, isFunction, isString, apply, repeat, curry} from 'fjl';

import {defineEnumProps$} from 'fjl-mutable';

export const

    /**
     * Default value obscurator.
     * @function module:validationOptions.defaultValueObscurator
     * @param x {*} - Value to obscurate.
     * @returns {String} - Obscurated value.
     */
    defaultValueObscurator = x => repeat((x + '').length, '*'),

    /**
     * Gets an error message by `messageTemplates` key from `options` object.
     * @function module:validationOptions.getErrorMsgByKey
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

    /**
     * Returns a strongly typed/normalized validationOptions object.
     * @function module:validationOptions.validationOptions
     * @param options {...Object}
     * @returns {Object}
     */
    validationOptions = (...options) => {
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
     * @function module:validationOptions.validationResult
     * @param options {Object}
     * @returns {*}
     */
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
