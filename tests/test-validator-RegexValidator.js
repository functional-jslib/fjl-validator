/**
 * Created by edelacruz on 7/28/2014.
 */
import {regexValidator, regexValidatorOptions} from '../src/regexValidator';
import {expect, assert} from 'chai';
import {typeOf, keys} from 'fjl';

describe('sjl.validator.RegexValidator`', function () {

    describe ('#regexValidatorOptions', function () {
        test ('should be an object with a `pattern` property', function () {
            expect(regexValidatorOptions().hasOwnProperty('pattern')).to.equal(true);
        });
    });

    describe ('#regexValidator', function () {

        test ('should generate expected error message for failing values', function () {
            const {result, messages} = regexValidator({pattern: /[a-z]+/}, '');
            expect(result).to.equal(false);
            expect(messages[0]).to.equal('');
        });

        const regexTest = (keyValMap, expected) => {
               keys(keyValMap).map(key => {
                    test ('should return ' + expected + ' when testing "' + key + '" with "' + keyValMap[key] + '".', function () {
                        const value = keyValMap[key],
                            {result, messages} = regexValidator({pattern: new RegExp(key, 'i')}, value);
                        expect(result).to.equal(expected);
                    });
                });
            },

            truthyMap = {
                '^\\d+$': 199, // Unsigned Number
                '^[a-z]+$': 'abc', // Alphabetical
                '^(:?\\+|\\-)?\\d+$': -100 // Signed Number
            },
            falsyMap = {
                '^\\d+$': '-199edd1', // Unsigned Number
                '^[a-z]+$': '0123a12bc', // Alphabetical
                '^(:?\\+|\\-)?\\d+$': '-10sd0e+99' // Signed Number
            };

        // Run tests
        regexTest(truthyMap, true);
        regexTest(falsyMap, false);

    });

});
