'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.digitValidator = undefined;

var _regexValidator = require('./regexValidator');

var _fjl = require('fjl');

/**
 * Created by Ely on 1/21/2015.
 */
var digitValidator = exports.digitValidator = (0, _fjl.curry)(function (options, value) {
    return (0, _regexValidator.regexValidator)((0, _fjl.assignDeep)({
        pattern: /^\d+$/,
        messageTemplates: {
            DOES_NOT_MATCH_PATTERN: function DOES_NOT_MATCH_PATTERN(x) {
                return 'The value passed in contains non digital characters.  ' + ('Value received: "' + x + '".');
            }
        }
    }, options), value);
});

exports.default = digitValidator;