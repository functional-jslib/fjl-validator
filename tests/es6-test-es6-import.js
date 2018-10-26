import * as fjlValidator from '../dist/es6-module/fjl-validator';

describe ('fjl-validator', function () {
    test ('should have reached this point with no errors', function () {
        expect(!!fjlValidator).toEqual(true);
    });
});
