/**
 * Created by elyde on 1/15/2016.
 */
import {typeOf, keys, isString, concat, isType} from 'fjl';
import {expect, assert} from 'chai';
import {log, peek} from './utils';

import {validationOptions, validationResult, getErrorMsgByKey} from '../src/validator/ValidationOptions';

describe('#fjl.validator.ValidationOptions', function () {

    describe('#validationOptions', function () {
        it('should merge incoming options to `self` on construction', function () {
            const messageTemplates = {
                    A: 'some message',
                    B: value => `some message with value in it.  Value: ${value}`
                },
                v = validationOptions({messageTemplates});

            log(v);

            // Ensure passed in allowed type is merged in
            keys(messageTemplates).forEach(key => {
                expect(v.messageTemplates[key]).to.equal(messageTemplates[key]);
            });

            // Ensure not allowed type is blocked
            // messages must be of type `Array` so should throw error
            assert.throws(() => validationOptions({messageTemplates: 99}), Error);
        });

        const expectedPropertyAndTypes = {
                messagesMaxLength: 'Number',
                valueObscured: 'Boolean',
                valueObscurator: 'Function',
                messageTemplates: 'Object'
            };

        it('should have the expected properties as expected types.', function () {
            let validator = validationOptions();
            Object.keys(expectedPropertyAndTypes).forEach(key => {
                expect(validator.hasOwnProperty(peek(key))).to.equal(true);
                expect(typeOf(validator[key])).to.equal(expectedPropertyAndTypes[key]);
            });
        });
    });

    describe('#getErrorMsgByKey', function () {
        const messageTemplates = {
                EMPTY_NOT_ALLOWED: 'Empty values are not allowed.',
                EXAMPLE_CASE: value => `Some case is not allowed for value ${value}`
            },
            v = validationOptions({messageTemplates});
        it('should return a `string` when key exists on options.messageTemplates', function () {
            expect(
                concat([
                    [getErrorMsgByKey(v, 'EMPTY_NOT_ALLOWED', 'someValue')],
                    [getErrorMsgByKey(v, 'EXAMPLE_CASE', 'someValue')],
                    [getErrorMsgByKey(v, _ => 'Inline error message callback', 'someValue')]
                ])
                .every(x => isString(x))
            )
                .to.equal(true);
        });
        it('should have returned expected error messages when key is valid (exists and is string or function)', function () {
            const someValue = 'someValue',
                messages = concat([
                [getErrorMsgByKey(v, 'EMPTY_NOT_ALLOWED', 'someValue')],
                [getErrorMsgByKey(v, 'EXAMPLE_CASE', 'someValue')],
                [getErrorMsgByKey(v, _ => 'Inline error message callback', 'someValue')]
            ]);
            expect(messages.length).to.equal(3);
            expect(messages[0]).to.equal(messageTemplates.EMPTY_NOT_ALLOWED);
            expect(messages[1]).to.equal(messageTemplates.EXAMPLE_CASE(v, 'someValue'));
            expect(messages[2]).to.equal('Inline error message callback');
        });
        it('should return `undefined` if `key` is not a function and `key` doesn\'t exist on ' +
            '`messageTemplates`', function () {
            expect(getErrorMsgByKey(v, 'SOME_OTHER_CASE', 'someValue')).to.equal(undefined);
        });
    });

});

describe ('#fjl.validator.ValidationResults', function () {

    it ('should return an object with `messages`, and `result` properties', function () {
        const vResults = validationResult();
        expect(
            ['messages', 'result', 'value']
                .every(key => vResults.hasOwnProperty(key))
        )
            .to.equal(true);
    });

    it ('should have properties that obey their types', function () {
        const
            vResults = validationResult(),
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

});
