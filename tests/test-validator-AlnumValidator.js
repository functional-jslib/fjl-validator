/**
 * Created by elyde on 1/15/2016.
 */
import alnumValidator from '../src/alnumValidator';
import {expect, assert} from 'chai';

describe('sjl.validator.AlnumValidator', function () {

    test ('should return `true` value is `alpha numeric` and `false` otherwise.', function () {
        let  validator = alnumValidator({}),
            values = [
                [true, 'helloworld'],
                [true, 'testingtesting123testingtesting123'],
                [true, 'sallysellsseashellsdownbytheseashore'],
                [false, 'hello[]world'],
                [false, '99 bottles of beer on the wall']
            ];

        // Validate values and expect value[0] to be return value of validation check
        values.forEach(value => {
            const {result, messages} = validator(value[1]);
            expect(result).to.equal(value[0]);
            if (!value[0]) {
                expect(messages.length).to.equal(1);
            }
        });
    });

});
