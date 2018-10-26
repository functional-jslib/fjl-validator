const fjlValidator = require('../dist/cjs/fjlValidator');

describe ('fjl-validator', function () {
    test ('should have reached this point with no errors', function () {
        expect(!!fjlValidator).toEqual(true);
    });
});
