/**
 * Created by elyde on 1/15/2016.
 */
import {typeOf, keys, isString, concat} from 'fjl';
import {toValidationOptions, toValidationResult, getErrorMsgByKey} from '../src/ValidationUtils';

describe('#fjl.validator.toValidationOptions', function () {

    describe('#toValidationOptions', function () {
        const expectedPropertyAndTypes = {
            valueObscured: 'Boolean',
            valueObscurator: 'Function',
            messageTemplates: 'Object'
        };
        test ('should merge incoming options to `self` on construction', function () {
            const messageTemplates = {
                    A: 'some message',
                    B: value => `some message with value in it.  Value: ${value}`
                },
                v = toValidationOptions({messageTemplates});

            // Ensure passed in allowed type is merged in
            keys(messageTemplates).forEach(key => {
                expect(v.messageTemplates[key]).toEqual(messageTemplates[key]);
            });

            // Ensure not allowed type is blocked
            // messages must be of type `Array` so should throw error
            expect(() => toValidationOptions({messageTemplates: 99})).toThrow(Error);
        });
        test ('should have the expected properties as expected types.', function () {
            let validator = toValidationOptions();
            Object.keys(expectedPropertyAndTypes).forEach(key => {
                expect(validator.hasOwnProperty(key)).toEqual(true);
                expect(typeOf(validator[key])).toEqual(expectedPropertyAndTypes[key]);
            });
        });
        test ('should still return a valid "ValidationOptions" object even if receiving `null` or `undefined`.', () => {
            [toValidationOptions(null), toValidationOptions()]
                .forEach(validationOptions => {
                    Object.keys(expectedPropertyAndTypes).forEach(key => {
                        expect(validationOptions.hasOwnProperty(key)).toEqual(true);
                        expect(typeOf(validationOptions[key])).toEqual(expectedPropertyAndTypes[key]);
                    });
                });
        });
    });

    describe('#getErrorMsgByKey', function () {
        const emptyNotAllowedMsg = 'Empty values are not allowed.',
            exampleCaseCall = value => `Some case is not allowed for value ${value}`,
            EMPTY_NOT_ALLOWED = 'EMPTY_NOT_ALLOWED',
            EXAMPLE_CASE = 'EXAMPLE_CASE',
            messageTemplates = {
                [EMPTY_NOT_ALLOWED]: emptyNotAllowedMsg,
                [EXAMPLE_CASE]: exampleCaseCall
            },
            validationOptions = toValidationOptions({messageTemplates}),
            testErrorMessages = concat([
                [getErrorMsgByKey(validationOptions, EMPTY_NOT_ALLOWED, 'someEmptyValue')],
                [getErrorMsgByKey(validationOptions, EXAMPLE_CASE, 'someValue')],
                [getErrorMsgByKey(validationOptions, () => emptyNotAllowedMsg, 'someValue')]
            ]);
        test ('should return a `string` when key exists on options.messageTemplates', function () {
            expect(testErrorMessages.every(x => isString(x))).toEqual(true);
        });
        test ('should have returned expected error messages when key is valid (exists and is string or function)', function () {
            const messages = testErrorMessages;
            expect(messages.length).toEqual(3);
            expect(messages[0]).toEqual(messageTemplates.EMPTY_NOT_ALLOWED);
            expect(messages[1]).toEqual(messageTemplates.EXAMPLE_CASE('someValue', validationOptions));
            expect(messages[2]).toEqual(emptyNotAllowedMsg);
        });
        test ('should return `undefined` if `key` is not a function and `key` doesn\'t exist on ' +
            '`messageTemplates`', function () {
            expect(getErrorMsgByKey(validationOptions, 'SOME_OTHER_CASE', 'someValue')).toEqual(undefined);
        });
    });

});

describe ('#fjl.validator.toValidationResults', function () {

    test ('should return an object with `messages`, and `result` properties', function () {
        const vResults = toValidationResult();
        expect(
            ['messages', 'result', 'value']
                .every(key => vResults.hasOwnProperty(key))
        )
            .toEqual(true);
    });

    test ('should have properties that obey their types', function () {
        const
            vResults = toValidationResult(),
            cases = [
                // key, Type, correctValue, incorrectValue
                ['messages', Array, [], 99],
                ['result', Boolean, false, 99]
            ];

        // Allow properties to be set with correct types
        expect(
            cases
                .every(([name, _, correct]) => {
                    vResults[name] = correct;
                    return vResults[name] === correct;
                })
        )
            .toEqual(true);

        // Assert types are obeyed when values are of incorrect types
        cases.map(([name, __, _, incorrect]) => {
            expect(
                ((_name, _incorrect) =>
                    () => { vResults[_name] = _incorrect; }
                )(name, incorrect)
            ).toThrow(Error);
        });

    });
    test ('should still return a valid "ValidationOptions" object even if receiving `null` or `undefined`.', () => {
        const expectedPropertyAndTypes = {
            result: 'Boolean',
            messages: 'Array'
        };
        [toValidationResult(null), toValidationResult()]
            .forEach(validationResult => {
                Object.keys(expectedPropertyAndTypes).forEach(key => {
                    expect(validationResult.hasOwnProperty(key)).toEqual(true);
                    expect(typeOf(validationResult[key])).toEqual(expectedPropertyAndTypes[key]);
                });
            });
    });

});
