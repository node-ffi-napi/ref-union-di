'use strict';

/**
 * Module dependencies.
 */

var assert = require('assert')
var debug = require('debug')('ref-union')

/**
 * Module exports.
 */

module.exports = function (ref) {

/**
 * The "Union" type constructor.
 */

function Union () {
  debug('defining new union "type"')

  function UnionType (arg, data) {
    if (!(this instanceof UnionType)) {
      return new UnionType(arg, data)
    }
    debug('creating new union instance')
    var store
    if (Buffer.isBuffer(arg)) {
      debug('using passed-in Buffer instance to back the union', arg)
      assert(arg.length >= UnionType.size, 'Buffer instance must be at least '
          + UnionType.size + ' bytes to back this untion type')
      store = arg
      arg = data
    } else {
      debug('creating new Buffer instance to back the union (size: %d)', UnionType.size)
      store = new Buffer(UnionType.size)
    }

    // set the backing Buffer store
    store.type = UnionType
    this['ref.buffer'] = store

    // initialise the union with values supplied
    if (arg) {
      //TODO: Sanity check - e.g. (Object.keys(arg).length == 1)
      for (var key in arg) {
        // hopefully hit the union setters
        this[key] = arg[key]
      }
    }
    UnionType._instanceCreated = true
  }

  // make instances inherit from `proto`
  UnionType.prototype = Object.create(proto, {
    constructor: {
        value: UnionType
      , enumerable: false
      , writable: true
      , configurable: true
    }
  })

  UnionType.defineProperty = defineProperty
  UnionType.toString = toString
  UnionType.allFields = {}

  // comply with ref's "type" interface
  UnionType.size = 0
  UnionType.alignment = 0
  UnionType.indirection = 1
  UnionType.get = get
  UnionType.set = set

  // Read the allFields list
  var arg = arguments[0]
  if (typeof arg === 'object') {
    Object.keys(arg).forEach(function (name) {
      var type = arg[name];
      UnionType.defineProperty(name, type);
    })
  }

  return UnionType
}

function get (buffer, offset) {
  debug('Union "type" getter for buffer at offset', buffer, offset)
  if (offset > 0) {
    buffer = buffer.slice(offset)
  }
  return new this(buffer)
}

function set (buffer, offset, value) {
  debug('Union "type" setter for buffer at offset', buffer, offset, value)
  if (offset > 0) {
    buffer = buffer.slice(offset)
  }
  var union = new this(buffer)
  var isUnion = value instanceof this
  if (isUnion) {
    // TODO: optimize - use Buffer#copy()
    Object.keys(this.allFields).forEach(function (name) {
      // hopefully hit the setters
      union[name] = value[name]
    })
  } else {
    for (var name in value) {
      // hopefully hit the setters
      union[name] = value[name]
    }
  }
}

function toString () {
  return '[UnionType]'
}

/**
 * Adds a new field to the union instance with the given name and type.
 * Note that this function will throw an Error if any instances of the union
 * type have already been created, therefore this function must be called at the
 * beginning, before any instances are created.
 */

function defineProperty (name, type) {
  debug('defining new union type field', name)

  // allow string types for convenience
  type = ref.coerceType(type)

  assert(!this._instanceCreated, 'an instance of this Union type has already '
      + 'been created, cannot add new data members anymore')
  assert.equal('string', typeof name, 'expected a "string" field name')
  assert(type && /object|function/i.test(typeof type) && 'size' in type &&
      'indirection' in type
      , 'expected a "type" object describing the field type: "' + type + '"')
  assert(!(name in this.prototype), 'the field "' + name
      + '" already exists in this Union type')

  // define the getter/setter property
  Object.defineProperty(this.prototype, name, {
      enumerable: true
    , configurable: true
    , get: get
    , set: set
  });

  var field = {
    type: type
  }
  this.allFields[name] = field

  // calculate the new size and alignment
  recalc(this);

  function get () {
    debug('getting "%s" union field (length: %d)', name, type.size)
    return ref.get(this['ref.buffer'], 0, type)
  }

  function set (value) {
    debug('setting "%s" union field (length: %d)', name, type.size, value)
    return ref.set(this['ref.buffer'], 0, value, type)
  }
}

function recalc (union) {
  var biggest
  var fieldNames = Object.keys(union.allFields)

  // find the largest member field by size / alignment
  fieldNames.forEach(function (name) {
    var field = union.allFields[name]
    var type = field.type

    var size = type.indirection === 1 ? type.size : ref.sizeof.pointer
    var alignment = type.alignment || ref.alignof.pointer
    if (type.indirection > 1) {
      alignment = ref.alignof.pointer
    }
    var fields = {}
    fields[name] = { type: type }

    var current =  { fields: fields, size: size, alignment: alignment }

    if (!biggest || size > biggest.size || alignment > biggest.alignment) {
      biggest = current
    }
  })

  union.alignment = biggest.alignment;
  union.size = biggest.size;
  // Pretend like we only have this one field so that
  // ffi-napi doesn't overcount the size
  union.fields = biggest.fields;
}



/**
 * the base prototype that union type instances will inherit from.
 */

var proto = {}

proto['ref.buffer'] = ref.NULL

/**
 * returns a Buffer pointing to this union data structure.
 */

proto.ref = function ref () {
  return this['ref.buffer']
}

return Union

}
