'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alnumValidator = undefined;

var _regexValidator = require('./regexValidator');

var _fjl = require('fjl');

/**
 * @function module:alnumValidator.alnumValidator
 * @param options {Object}
 * @param value {*}
 * @returns {Object}
 */
/**
 * Created by Ely on 1/21/2015.
 * @module alnumValidator
 */
var alnumValidator = exports.alnumValidator = (0, _fjl.curry)(function (options, value) {
  return (0, _regexValidator.regexValidator)((0, _fjl.assignDeep)({
    pattern: /^[\da-z]+$/i,
    messageTemplates: {
      DOES_NOT_MATCH_PATTERN: function DOES_NOT_MATCH_PATTERN(x) {
        return 'Value is not alpha-numeric.  Value received: \'' + x + '\'.';
      }
    }
  }, options), value);
});

exports.default = alnumValidator;