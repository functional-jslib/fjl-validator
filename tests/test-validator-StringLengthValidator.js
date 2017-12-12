import {stringLengthOptions, stringLengthValidator} from '../src/StringLengthValidator';
import {validationOptions, validationResult} from '../src/ValidationOptions';
import {typeOf, repeat} from 'fjl';
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

    test ('should return `true` value.length is within default range.', function () {
        let strLenValidator = stringLengthValidator,
            values = [
                [true, 'helloworld'],
                [true, 'testingtesting123testingtesting123'],
                [true, 'sallysellsseashellsdownbytheseashore'],
                [true, 'hello[]world'],
                [true, '99 bottles of beer on the wall']
            ];

        // Validate values and expect value[0] to be return value of validation check
        values.forEach(function (value) {
            const {result, messages} = strLenValidator({}, value[1]);
            expect(result).to.equal(value[0]);
            expect(messages.length).to.equal(0);
        });

    });

    describe ('isValid with set min and max values', function () {
        let strLenValidator = stringLengthValidator({min: 0, max: 55}),
            values = [
                [true, 'within', 'helloworld'],
                [true, 'within', 'testingtesting123testingtesting123'],
                [true, 'within', 'sallysellsseashellsdownbytheseashore'],
                [true, 'within', 'hello[]world'],
                [true, 'within', '99 bottles of beer on the wall'],
                [false, 'without', repeat(56, 'a')],
                [false, 'without', repeat(99, 'b')]
            ];

        // Validate values and expect value[0] to be return value of validation check
        values.forEach(function (args) {
            test ('should return `' + args[0] + '` when value.length is '+ args[1] +' allowed range.', function () {
                expect(strLenValidator(args[2]).result).to.equal(args[0]);
            });
        });

        // Validate values and expect value[0] to be return value of validation check
        values.forEach(function (value) {
            const {result, messages} = strLenValidator(value[2]);
            expect(result).to.equal(value[0]);
            expect(!messages.length).to.equal(result);
        });

    });

});
