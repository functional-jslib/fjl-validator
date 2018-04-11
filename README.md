# fjl-validator
Functional validator(s) implementation (inspired by Zend/Validator validators).

## In this doc:
- [Reasoning](#reasoning-for-lib)
- [Usage](#usage)
- [Docs](#docs)
- [Quick Docs](#quick-docs)
- [Supported Platforms](#supported-platforms)
- [Development](#development)
- [Testing](#testing)
- [Resources](#resources)
- [License](#license)

## Reasoning for lib
- Needed a way to supply custom error messages to different value validation scenarios.
- Wanted to use validators in a functional way.
- Needed a base library from which to build more complex ones ('fjl-input-filter', 'fjl-validator-recaptcha' etc.).
- Needed a base library that could later, easily, accomadate validating via optionally using promises (
    'fjl-input-filter' lib exports methods for this).

## Usage:
@todo include usage examples

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

#### `toValidationOptions(...options) {ValidationOptions}`
Returns valid validation options objects that can be used as validator options;

##### Params
- `options {Object}`
  - `valueObscured {Boolean}` 
  - `valueObscurator {Function.<String>}` - Obscurator function; E.g. `x => "..."`
  - `messageTemplates {Object.<String, (MessageTemplateCallback|Function|String)>}` - Key value pairs of error messages or error message callbacks (
    See virtual type `MessageTemplateCallback` @todo here).
    
##### Returns
`{ValidationOptions}` -  A strictly typed options object;  Merges passed in options onto strictly typed version which 
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

#### `regexValidator(options, value) {ValidationResult}`
Validates values using a regular expression.

##### Params
- `options {Object}`
  - Inherits all properties from `{ValidationOptions}` type (`{valueObscurator, valueObscured, messageTemplates}`).
  - `pattern {RegExp}`
  - `messageTemplates {Object}`
    - `DOES_NOT_MATCH_PATTERN` - Key on `messageTemplates` to populate for custom 'does-not-match-pattern' message.
- `value {*}` - Value to validate.

##### Returns
`{ValidationResult}`

#### `alnumValidator(options, value) {ValidationResult}`
Alpha-numeric value validator.

##### Params
- `options {Object}` - Same as `regexValidator`'s options.
- `value {*}`

##### Composed from
`regexValidator`

##### Returns
`{ValidationResult}`

#### `alnumValidator1(value) {ValidationResult}`
Same as `alnumValidator` except doesn't require an options object.

##### Params
- `value {*}`

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
Validates that a value is not an empty;  I.e., 
Checks that value is not one of 
```
    [[], '', null, undefined, {}, Map(), Set(), WeakSet(), WeakMap()]
```
We'll refer to this set as `Empty` here.

##### Params
- `options {Object}`
  - Inherits all properties from `{ValidationOptions}` type (`{valueObscurator, valueObscured, messageTemplates}`) also.
  - `messageTemplates`
    - `EMPTY_NOT_ALLOWED` - Key that can be populated for custom message on receiving an `Empty` (in virtual types).
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
#### `Empty` 
One of `[null, undefined, '', 0, false, [], {}, Map(), Set(), WeakMap(), WeakSet()]`.

#### `ValidationOptions {Object}`
##### Properties
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

#### `MessageTemplateCallback {Function}`
##### Parameters
- `value {*}`
- `options {ValidationOptions}`

#### `ValidationResult {Object}`
##### Properties
- `result {Boolean}` - Whether value passes validation or not.
- `messages {Array.<String>}` - Validation error messages if any.
- `value {*}` - Value that was validated.

#### `Validator {Function}` - Curried validation function.  Parameters:
##### Parameters
- `options {ValidationOptions}` - Validation/Validator options.
- `value {*}` - Value to be validated.

#### `version {String}` 
Library's version number.

## Development
- For commands see './package.json' scripts.

#### Dir structure
- Everything is in './src'.
- Distrubution is in './dist'.
- Docs are in './docs'.

## Testing
Using `jest`, `chai` - See './package.json' scripts.

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
