## Getting Started:

`fjl-validator` wasn't meant to be used alone though what a user will most likely want is 
[`fjl-input-filter`](https://github.com/functional-jslib/fjl-input-filter) though below is a standalone hypothetical scenario:

```
// Let's say this is somewhere on the server:
import {regexValidator, stringLengthValidator, toValidationResult} from 'fjl-validator';

const nameFieldValidators = [
        stringLengthValidator({min: 3, max: 55}),
        regexValidator({
            pattern: /^[a-z][a-z"'.\s]*$/i,
            messageTemplates: {
                DOES_NOT_MATCH_PATTERN:
                    `Only letters, spaces, quotes (""", "'"), and periods are allowed for names.`
            }
        })
    ],
    
    runValidators = (validators, breakOnFailure, value) => {
        let result = true,
            i = 0,
            messageResults = [];
        if (!validators || !validators.length) {
            return toValidationResult({result});
        }
        const limit = validators.length;
        for (; i < limit; i++) {
            const vResult = validators[i](value);
            if (!vResult.result) {
                messageResults.push(vResult.messages);
                result = false;
                if (breakOnFailure) {
                    break;
                }
            }
        }
        return toValidationResult({result, messages: [].concat(...messageResults)});
    },
    
    nameFieldValue = '', // Extract/receive name field value here
    
    validationResult = runValidators(nameFieldValidators, false, nameFieldValue;
    
// Elsewhere (let's say, hypothetically in a react view)
import React, {Component} from 'react';
import {uuid} from './your-utils';

class SomeReactFormComponent extends Component {
    // ...
    render () {
        const {validationResult} = this.state;
        return (<div className="form-field">
            // ...
            // If validation result is `true` don't render anything, else render error messages
            {validationResult.result ? null :  
                (<ul>{validationResult.messages.map(message => (<li key={uuid()}>{message}</li>))}</ul>)
            // ...
        </div>);
    }
    // ...
}

```

#### Other examples:
- [fjl-input-filter test-fixture example](https://github.com/functional-jslib/fjl-input-filter/blob/master/tests/fixtures/input-filter-1.js)

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
