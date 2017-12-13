'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.stringLengthValidator = exports.stringLengthOptions = undefined;

var _validationOptions = require('./validationOptions');

var _fjl = require('fjl');

var _fjlMutable = require('fjl-mutable');

var stringLengthOptions = exports.stringLengthOptions = function stringLengthOptions(options) {
    var _options = (0, _fjlMutable.defineEnumProps$)([[Number, 'min', 0], [Number, 'max', Number.MAX_SAFE_INTEGER]], {});

    _options.messageTemplates = {
        NOT_OF_TYPE: function NOT_OF_TYPE(value) {
            return 'Value is not a String.  ' + ('Value type received: ' + (0, _fjl.typeOf)(value) + '.') + ('Value received: "' + value + '".');
        },
        NOT_WITHIN_RANGE: function NOT_WITHIN_RANGE(value, ops) {
            return 'Value is not within range ' + (ops.min + ' to ' + ops.max + '.') + 'Value length given: "' + value.length + '".' + 'Value received: "' + value + '".';
        }
    };

    return (0, _validationOptions.validationOptions)(options ? (0, _fjl.assignDeep)(_options, options) : _options);
},
    stringLengthValidator = exports.stringLengthValidator = (0, _fjl.curry)(function (options, value) {
    var ops = stringLengthOptions(options),
        messages = [],
        isOfType = (0, _fjl.isString)(value),
        valLength = isOfType ? value.length : 0,
        isWithinRange = valLength >= ops.min && valLength <= ops.max;
    if (!isOfType) {
        messages.push((0, _validationOptions.getErrorMsgByKey)('NOT_OF_TYPE', value, ops));
    } else if (!isWithinRange) {
        messages.push((0, _validationOptions.getErrorMsgByKey)('NOT_WITHIN_RANGE', value, ops));
    }
    return (0, _validationOptions.validationResult)({
        result: isOfType && isWithinRange,
        messages: messages,
        value: value
    });
}); /**
     * Created by Ely on 1/21/2015.
     */
exports.default = stringLengthValidator;