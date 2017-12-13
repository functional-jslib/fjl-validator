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

#### `validatorOptions(...options) {ValidatorOptions}`
Returns valid options objects that can be used as validator options;

##### Params
- `options {Object}`
  - `valueObscured {Boolean}` 
  - `valueObscurator {Function}` - Obscurator function; E.g. `x => "..."`
  - `messageTemplates {Object}` - Key value pairs of error messages or error message callbacks (
    See virtual type `MessageTemplateCallback` above).
##### Returns
 A strictly typed options object;  Merges passed in options onto strictly typed version which 
 will throw clear error message(s) if type(s) do not match.
 
#### `alnumValidator(options, value) {ValidatorResult}`
Alpha-numeric value validator.

##### Params
- `options {Object}`
- `value {*}`

##### Returns
`{ValidationResult}`

#### `regexValidator(options, value) {ValidatorResult}`
Validates values using a regular expression.

##### Params
- `options {Object}`
  - `pattern {RegExp}`
  - `messageTemplates {Object}`
- `value {*}` - Value to validate.

##### Returns
`{ValidationResult}`

#### `digitValidator(options, value) {ValidatorResult}`
##### Params
- `options {Object}`
- `value {*}` - Value to validate.

##### Returns
`{ValidationResult}`

#### `notEmptyValidator(options, value) {ValidatorResult}`
##### Params
- `options {Object}`
- `value {*}` - Value to validate.

##### Returns
`{ValidationResult}`

#### `stringLengthValidator(options, value) {ValidatorResult}`
##### Params
- `options {Object}`
    - `min {Number}` - Default `0`.
    - `max {Number}` - Default `Number.MAX_SAFE_INTEGER`
- `value {*}` - Value to validate.

##### Returns
`{ValidationResult}`

#### `version {String}` 
Library's version number.

## Resources
- Zend/Validator - https://zendframework.github.io/zend-validator/intro/

## License
BSD 3.0
