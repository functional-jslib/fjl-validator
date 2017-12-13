'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validationResult = exports.validationOptions = exports.getErrorMsgByKey = exports.defaultValueObscurator = undefined;

var _fjl = require('fjl');

var _fjlMutable = require('fjl-mutable');

/**
 * Created by Ely on 7/21/2014.
 * Initial idea borrowed from Zend Framework 2's Zend/Validator
 */
var defaultValueObscurator = exports.defaultValueObscurator = function defaultValueObscurator(x) {
    return (0, _fjl.repeat)((x + '').length, '*');
},
    getErrorMsgByKey = exports.getErrorMsgByKey = (0, _fjl.curry)(function (options, key, value) {
    var message = void 0;

    var messageTemplates = options.messageTemplates,
        valueObscured = options.valueObscured,
        valueObscurator = options.valueObscurator,
        _value = valueObscured ? valueObscurator(value) : value;

    if ((0, _fjl.isFunction)(key)) {
        message = (0, _fjl.call)(key, options, _value);
    } else if (!(0, _fjl.isString)(key) || !messageTemplates[key]) {
        return;
    } else if ((0, _fjl.isFunction)(messageTemplates[key])) {
        message = (0, _fjl.call)(messageTemplates[key], options, _value);
    } else {
        message = messageTemplates[key];
    }
    return message;
}),
    validationOptions = exports.validationOptions = function validationOptions() {
    for (var _len = arguments.length, options = Array(_len), _key = 0; _key < _len; _key++) {
        options[_key] = arguments[_key];
    }

    var _options = (0, _fjlMutable.defineEnumProps$)([[Number, 'messagesMaxLength', 100], [Object, 'messageTemplates', {}], [Boolean, 'valueObscured', false], [Function, 'valueObscurator', defaultValueObscurator]], {});
    return options.length ? (0, _fjl.apply)(_fjl.assignDeep, [_options].concat(options.filter(_fjl.isset))) : _options;
},
    validationResult = exports.validationResult = function validationResult(options) {
    var _options = (0, _fjlMutable.defineEnumProps$)([[Boolean, 'result'], [Array, 'messages']], {});
    _options.value = undefined;
    return options ? (0, _fjl.assign)(_options, options) : _options;
};

exports.default = validationResult;