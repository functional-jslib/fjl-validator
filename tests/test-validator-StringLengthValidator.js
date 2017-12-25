import {stringLengthOptions, stringLengthValidator} from '../src/stringLengthValidator';
import {typeOf, repeat, subsequences, concat} from 'fjl';
import {expect} from 'chai';
import {peek} from './utils';

/**
 * Created by elyde on 1/15/2016.
 */
describe('sjl.validator.StringLengthValidator', function () {

    describe ('#stringLengthOptions', function () {
        const strLenOptions = stringLengthOptions();
        test ('should have a min and max property.', function () {
            expect(typeOf(strLenOptions.min)).to.equal(Number.name);
            expect(typeOf(strLenOptions.max)).to.equal(Number.name);
        });
        test ('should have a default value of `0` for `min` property.', function () {
            expect(strLenOptions.min).to.equal(0);
        });
        test ('should have a default value of `' + Number.MAX_SAFE_INTEGER + '` for `max` property.', function () {
            expect(strLenOptions.max).to.equal(Number.MAX_SAFE_INTEGER);
        });
    });

    describe ('#stringLengthValidator', function () {
        const testArgs = subsequences('hello')
            .concat([repeat(21, 'a'), repeat(14, 'b')])
            .map(x => x.join(''));
        test ('should return a validation result object with a `result` of `false` and ' +
            'one error message when value is not of type `String`', function () {
            const strValidator = stringLengthValidator(null);
            [false, 99, () => null, null, undefined, [], {}]
                .map(x => [false, x, 1])
                .forEach(([expected, value, messagesLength]) => {
                    const {result, messages} = strValidator(value),
                    expectedMsg = `Value is not a String.  ` +
                        `Value type received: ${typeOf(value)}.  ` +
                        `Value received: "${value}".`;
                    expect(result).to.equal(expected);
                    expect(messages.length).to.equal(messagesLength);
                    expect(messages[0]).to.equal(expectedMsg);
                });
        });
        test ('it should return a validation result object with a `result` of `false` and ' +
            'one error message when the passed in value is not within length range', function () {
            const strValidator = stringLengthValidator({min: 6, max: 13}),
                errMsgTmpl = (value, ops) =>
                    `Value is not within range ` +
                    `${ops.min} to ${ops.max}.  ` +
                    `Value length given: "` + value.length + `".  ` +
                    `Value received: "` + value + `".`;
                testArgs
                .map(x => [false, x, 1])
                .forEach(([expected, value, messagesLength]) => {
                    const {result, messages} = strValidator(value);
                    expect(result).to.equal(expected);
                    expect(messages.length).to.equal(messagesLength);
                    expect(messages[0]).to.equal(errMsgTmpl(value));
                });
        });
        test ('it should return a validation result object with a `result` of `true` and ' +
            'no error messages when the passed in value is a string within range `String`', function () {
            const strValidator = stringLengthValidator({min: 0, max: 22});
                testArgs
                .map(x => [true, x, 0])
                .forEach(([expected, value, messagesLength]) => {
                    const {result, messages} = strValidator(value);
                    expect(result).to.equal(expected);
                    expect(messages.length).to.equal(messagesLength);
                });
        });
    });

});
