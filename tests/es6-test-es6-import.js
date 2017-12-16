import * as fjlValidator from '../dist/es6-module/fjl-validator';
import {expect} from 'chai';

describe ('fjl-validator', function () {
    test ('should have reached this point with no errors', function () {
        expect(!!fjlValidator, true);
    });
});
