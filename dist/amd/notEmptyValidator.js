'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.notEmptyValidator = exports.notEmptyOptions = undefined;

var _validationOptions = require('./validationOptions');

var _fjl = require('fjl');

/**
 * Created by Ely on 7/21/2014.
 */
var notEmptyOptions = exports.notEmptyOptions = function notEmptyOptions(options) {
    return (0, _validationOptions.validationOptions)({
        messageTemplates: {
            EMPTY_NOT_ALLOWED: function EMPTY_NOT_ALLOWED() {
                return 'Empty values are not allowed.';
            }
        }
    }, options);
},
    notEmptyValidator = exports.notEmptyValidator = (0, _fjl.curry)(function (options, value) {
    var ops = notEmptyOptions(options),
        result = !(0, _fjl.isEmpty)(value),

    // If test failed
    messages = !result ? [(0, _validationOptions.getErrorMsgByKey)(ops, 'EMPTY_NOT_ALLOWED', value)] : [];
    return (0, _validationOptions.validationResult)({ result: result, messages: messages, value: value });
});

exports.default = notEmptyValidator;