# fjl-validator
Functional validator(s) implementation (inspired by Zend/Validator validators).

## In this doc:
- [Reasoning](#reasoning-for-lib)
- [Usage](#usage)
- [Docs](#docs)
- [Quick Docs](#quick-docs)
- [Supported Platforms](#supported-platforms)
- [Resources](#resources)
- [License](#license)

## Reasoning for lib
- Needed a way to supply custom error messages to different value validation scenarios.
- Wanted to use validators in a functional way.
- Needed a base library from which to build more complex ones ('fjl-input-filter', 'fjl-validator-recaptcha' etc.).
- Needed a base library that could later, easily, accomadate validating via optionally using promises (
    'fjl-input-filter' lib exports methods for this).

## Usage:

### Usage example 1 (barebones usage):
```
import {regexValidator, stringLengthValidator} from 'fjl-validator';

const formFieldValidators = {

    // ...

    location: [
    
        stringLength(fromDefaultStringLengthOps({min: 3, max: 144})),

        regexValidator({
            pattern: /^[a-z\d][a-z\d\s.\-,"'\n\t\r]*$/gim,
            messageTemplates: {
                DOES_NOT_MATCH_PATTERN: () =>
                    `Locations format is incorrect.  ` +
                    `Only letters, spaces, numbers, commas, dashes, and plain quotes (', ") are allowed.`
            }
        })
    ],
    
    // ...
    
    },
    
    validateFormData = formData => {
        // @todo finish examples
    }
;

                
```

### Importing:
### In Browser:
See desired export type below:
- './dist/amd/' - Asynchronous module format.
- './dist/cjs/' - CommonJs module format.
- './dist/umd/' - Universal module definition format.
- './dist/iife/' - Immediately Invoked Function Execution - (exports `fjl` as a global).
- './dist/es6-module/' - Ecmascript 6 module format.

### In NodeJs: 

#### Using es2015 modules:
```
import {...} from 'fjl-validator';
```

#### Using CommonJs modules:
```
const {...} = require('fjl-validator');
```

## Docs:
(https://functional-jslib.github.io/fjl-validator/) [https://functional-jslib.github.io/fjl-validator/]

## Quick Docs:

### Preamble:
All methods that are multiary (take two or more arguments), and don't end with a '$'
symbol are curried:  I.e.,
```
alnumValidator, digitValidator, notEmptyValidator, 
regexValidator, stringLengthValidator, getErrorMsgByKey
```

- Explicit one arg variadic methods (`(...args) => (...)`) are not curried:
```
toValidationResult, toValidationOptions
``` 

- The docs below only outline the default exports, and the pertinent methods required for rolling up your 
own validation functions, from the sources in lib (except for 'ValidationUtils` file).  
To see what other methods are exported in lib you can read the in-depth docs at 
[https://functional-jslib.github.io/fjl-validator/](https://functional-jslib.github.io/fjl-validator/) .

### Exported:

#### `toValidationOptions(...options) {ValidatorOptions}`
Returns valid validation options objects that can be used as validator options;

##### Params
- `options {Object}`
  - `valueObscured {Boolean}` 
  - `valueObscurator {Function}` - Obscurator function; E.g. `x => "..."`
  - `messageTemplates {Object}` - Key value pairs of error messages or error message callbacks (
    See virtual type `MessageTemplateCallback` above).
    
##### Returns
`{ValidatorOptions}` -  A strictly typed options object;  Merges passed in options onto strictly typed version which 
 will throw clear error message(s) if type(s) for properties do not match.
 
#### `toValidationResult(...options) {ValidationResult}`
Returns a valid validation result object;

##### Params
- `options {Object}`
    - `result {Boolean}` - Result of validation (`true || false` etc.). 
    - `messages {Array}` - Error messages if any.
    - `[value {*}]` - Optionally, value that was passed in for validation. 

##### Returns
`{ValidationResult}` - 
 A strictly typed validation result object;  Merges passed in options onto strictly typed version which 
 will throw clear error message(s) if type(s) do not match.

#### `alnumValidator(options, value) {ValidationResult}`
Alpha-numeric value validator.

##### Params
- `options {Object}`
- `value {*}`

##### Returns
`{ValidationResult}`

#### `alnumValidator1(value) {ValidationResult}`
Same as `alnumValidator` except doesn't require an options object.

##### Params
- `value {*}`

##### Returns
`{ValidationResult}`

#### `regexValidator(options, value) {ValidationResult}`
Validates values using a regular expression.

##### Params
- `options {Object}`
  - `pattern {RegExp}`
  - `messageTemplates {Object}`
- `value {*}` - Value to validate.

##### Returns
`{ValidationResult}`

#### `digitValidator(options, value) {ValidationResult}`
Validates digits.  

##### Composed from 
`regexValidator`

##### Params
- `options {Object}` - Same as `regexValidator`'s options.
- `value {*}` - Value to validate.

##### Returns
`{ValidationResult}`

#### `notEmptyValidator(options, value) {ValidationResult}`
Validates that a value is not empty;  I.e., 
Checks that value is not one of 
```
    [[], '', null, undefined, {}, Map(), Set(), WeakSet(), WeakMap()]
```

##### Params
- `options {Object}`
- `value {*}` - Value to validate.

##### Returns
`{ValidationResult}`

#### `notEmptyValidator1(value) {ValidationResult}`
Same as `notEmptyValidator` except ignores first parameter.

##### Params
- `value {*}` - Value to validate.

##### Returns
`{ValidationResult}`

#### `stringLengthValidator(options, value) {ValidationResult}`
Validates a string's length.

##### Params
- `options {Object}`
    - `min {Number}` - Default `0`.
    - `max {Number}` - Default `Number.MAX_SAFE_INTEGER`
- `value {*}` - Value to validate.

##### Returns
`{ValidationResult}`


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
- `ValidatorOptions {Object}`
  - `result {Boolean}` - Whether value passes validation or not.
  - `messages {Array}` - Validation error messages if any.
  - `value {*}` - Value that was validated.

#### `version {String}` 
Library's version number.

## Requirements:
- Javascript Ecmascript 5+.

### Supported Platforms:

#### Browsers
- IE9+, and all other modern day browsers.

#### NodeJs
- 8+

## Resources
- Zend/Validator - https://zendframework.github.io/zend-validator/intro/

## License
BSD 3.0
