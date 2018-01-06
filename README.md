ref-union-di
============
### Create ABI-compliant "[union][]" instances on top of Buffers

[![NPM Version](https://img.shields.io/npm/v/ref-union-di.svg?style=flat)](https://npmjs.org/package/ref-union-di)
[![NPM Downloads](https://img.shields.io/npm/dm/ref-union-di.svg?style=flat)](https://npmjs.org/package/ref-union-di)
[![Build Status](https://travis-ci.org/node-ffi-napi/ref-union-di.svg?style=flat&branch=latest)](https://travis-ci.org/node-ffi-napi/ref-union-di?branch=latest)
[![Coverage Status](https://coveralls.io/repos/node-ffi-napi/ref-union-di/badge.svg?branch=latest)](https://coveralls.io/r/node-ffi-napi/ref-union-di?branch=latest)
[![Dependency Status](https://david-dm.org/node-ffi-napi/ref-union-di.svg?style=flat)](https://david-dm.org/node-ffi-napi/ref-union-di)

**Note**: The only difference to `ref-union` is that this module takes its
dependency on `ref` via dependency injection, so that it is easier to use
e.g. `ref-napi` instead.

Installation
------------

Install with `npm`:

``` bash
$ npm install ref-union-di
```


Examples
--------

``` js
var ref = require('ref')
var Union = require('ref-union-di')(ref)

// a couple typedefs
var int = ref.types.int
var float = ref.types.float
var string = ref.types.CString

// define a Union type with 3 data fields
var u_tag = new Union({
    ival: int
  , fval: float
  , sval: string
})

// the size of the union matches the largest data type in the union type
u_tag.size === string.size

// and you can create new instances of the union type
var tag = new u_tag
tag.ival = 5
```


License
-------

(The MIT License)

Copyright (c) 2012 Nathan Rajlich &lt;nathan@tootallnate.net&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


[union]: http://wikipedia.org/wiki/Union_(computer_science)
