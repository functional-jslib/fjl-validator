/**
 * Created by elyde on 1/15/2016.
 */
import {typeOf, keys, isString, concat, isType, jsonClone, log, peek} from 'fjl';
import {expect, assert} from 'chai';

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
                expect(v.messageTemplates[key]).to.equal(messageTemplates[key]);
            });

            // Ensure not allowed type is blocked
            // messages must be of type `Array` so should throw error
            assert.throws(() => toValidationOptions({messageTemplates: 99}), Error);
        });
        test ('should have the expected properties as expected types.', function () {
            let validator = peek(toValidationOptions());
            Object.keys(expectedPropertyAndTypes).forEach(key => {
                expect(validator.hasOwnProperty(key)).to.equal(true);
                expect(typeOf(validator[key])).to.equal(expectedPropertyAndTypes[key]);
            });
        });
        test ('should still return a valid "ValidationOptions" object even if receiving `null` or `undefined`.', () => {
            [toValidationOptions(null), toValidationOptions()]
                .forEach(validationOptions => {
                    Object.keys(expectedPropertyAndTypes).forEach(key => {
                        expect(validationOptions.hasOwnProperty(key)).to.equal(true);
                        expect(typeOf(validationOptions[key])).to.equal(expectedPropertyAndTypes[key]);
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
                [getErrorMsgByKey(validationOptions, _ => emptyNotAllowedMsg, 'someValue')]
            ]);
        test ('should return a `string` when key exists on options.messageTemplates', function () {
            expect(testErrorMessages.every(x => isString(x))).to.equal(true);
        });
        test ('should have returned expected error messages when key is valid (exists and is string or function)', function () {
            const someValue = 'someValue',
                messages = testErrorMessages;
            expect(messages.length).to.equal(3);
            expect(messages[0]).to.equal(messageTemplates.EMPTY_NOT_ALLOWED);
            expect(messages[1]).to.equal(messageTemplates.EXAMPLE_CASE('someValue', validationOptions));
            expect(messages[2]).to.equal(emptyNotAllowedMsg);
        });
        test ('should return `undefined` if `key` is not a function and `key` doesn\'t exist on ' +
            '`messageTemplates`', function () {
            expect(getErrorMsgByKey(validationOptions, 'SOME_OTHER_CASE', 'someValue')).to.equal(undefined);
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
            .to.equal(true);
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
            .to.equal(true);

        // Assert types are obeyed when values are of incorrect types
        cases.map(([name, Type, _, incorrect]) => {
            assert.throws(
                ((_name, _incorrect) => () => vResults[_name] = _incorrect)(name, incorrect),
                Error
            );
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
                    expect(validationResult.hasOwnProperty(key)).to.equal(true);
                    expect(typeOf(validationResult[key])).to.equal(expectedPropertyAndTypes[key]);
                });
            });
    });

});
