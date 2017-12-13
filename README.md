# fjl-validator
Functional validator(s) implementation (inspired by Zend/Validator validators).


## Virtual Types:
- `ValidatorOptions {Object}`
  - `valueObscured {Boolean}` - Whether to obscure value in validation error messages
    when value doesn't pass validation.  Default `false`.
  - `valueObscurator {Function}` - Function that takes the value
    and returns an obscured version;  E.g., 
    ```
    const obscurator = x => Array.fill('*', 0, (x + '').length).join('');
    obscure('hello') === '*****' // equals `true` 
    ```
  - `messageTemplates {Object}` - Key-value pair hash where
    the values should be either strings and/or functions in the form of `(value, options) => ""` 
    or functions that return error messages for failed validations;  E.g.,
    ```
    import {digitValidator} from 'fjl-validator';
    
        const validateDigits = digitValidator({
            messageTemplates: {
                DOES_NOT_MATCH_PATTERN: x =>
                    `Only digits accepted.  Value entered: "${x}".`
            }
        });
    
        deepEquals(validateDigits('abcdef'), {
            result: false,
            messages: ['Only digits accepted.  Value entered: "abcdef"']
        })
        ; // true
    ```
- `MessageTemplateCallback {Function}`
  - `value {*}`
  - `options {ValidatorOptions}`
- `ValidationResult {Object}`
  - `result {Boolean}` - Whether value passes validation or not.
  - `messages {Array}` - Validation error messages if any.
  - `value {*}` - Value that was validated.
  
## Exported
* All methods are curried.
- `validatorOptions(...options) {ValidatorOptions}`
- `alnumValidator(options, value) {ValidatorResult}`
- `regexValidator(options, value) {ValidatorResult}`
- `digitValidator(options, value) {ValidatorResult}`
- `notEmptyValidator(options, value) {ValidatorResult}`
- `stringLengthValidator(options, value) {ValidatorResult}`
- `version {String}` - Library's version number.

### Params
- `options {Object}`
  - `pattern {RegExp}`
  - `messageTemplates {Object}`
- `value {*}`

## Resources
- Zend/Validator - https://zendframework.github.io/zend-validator/intro/

## License
BSD 3.0
