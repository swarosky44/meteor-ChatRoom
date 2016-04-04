(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var meteorBabelHelpers;

var require = meteorInstall({"node_modules":{"meteor":{"babel-runtime":{"babel-runtime.js":["regenerator/runtime-module",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// packages/babel-runtime/babel-runtime.js                                                                 //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
var hasOwn = Object.prototype.hasOwnProperty;                                                              // 1
var S = typeof Symbol === "function" ? Symbol : {};                                                        // 2
var iteratorSymbol = S.iterator || "@@iterator";                                                           // 3
                                                                                                           // 4
function canDefineNonEnumerableProperties() {                                                              // 5
  var testObj = {};                                                                                        // 6
  var testPropName = "t";                                                                                  // 7
                                                                                                           // 8
  try {                                                                                                    // 9
    Object.defineProperty(testObj, testPropName, {                                                         // 10
      enumerable: false,                                                                                   // 11
      value: testObj                                                                                       // 12
    });                                                                                                    // 13
                                                                                                           // 14
    for (var k in testObj) {                                                                               // 15
      if (k === testPropName) {                                                                            // 16
        return false;                                                                                      // 17
      }                                                                                                    // 18
    }                                                                                                      // 19
  } catch (e) {                                                                                            // 20
    return false;                                                                                          // 21
  }                                                                                                        // 22
                                                                                                           // 23
  return testObj[testPropName] === testObj;                                                                // 24
}                                                                                                          // 25
                                                                                                           // 26
meteorBabelHelpers = {                                                                                     // 27
  // Meteor-specific runtime helper for wrapping the object of for-in                                      // 28
  // loops, so that inherited Array methods defined by es5-shim can be                                     // 29
  // ignored in browsers where they cannot be defined as non-enumerable.                                   // 30
  sanitizeForInObject: canDefineNonEnumerableProperties()                                                  // 31
    ? function (value) { return value; }                                                                   // 32
    : function (obj) {                                                                                     // 33
      if (Array.isArray(obj)) {                                                                            // 34
        var newObj = {};                                                                                   // 35
        var keys = Object.keys(obj);                                                                       // 36
        var keyCount = keys.length;                                                                        // 37
        for (var i = 0; i < keyCount; ++i) {                                                               // 38
          var key = keys[i];                                                                               // 39
          newObj[key] = obj[key];                                                                          // 40
        }                                                                                                  // 41
        return newObj;                                                                                     // 42
      }                                                                                                    // 43
                                                                                                           // 44
      return obj;                                                                                          // 45
    }                                                                                                      // 46
};                                                                                                         // 47
                                                                                                           // 48
var BabelRuntime = {                                                                                       // 49
  // es6.templateLiterals                                                                                  // 50
  // Constructs the object passed to the tag function in a tagged                                          // 51
  // template literal.                                                                                     // 52
  taggedTemplateLiteralLoose: function (strings, raw) {                                                    // 53
    // Babel's own version of this calls Object.freeze on `strings` and                                    // 54
    // `strings.raw`, but it doesn't seem worth the compatibility and                                      // 55
    // performance concerns.  If you're writing code against this helper,                                  // 56
    // don't add properties to these objects.                                                              // 57
    strings.raw = raw;                                                                                     // 58
    return strings;                                                                                        // 59
  },                                                                                                       // 60
                                                                                                           // 61
  // es6.classes                                                                                           // 62
  // Checks that a class constructor is being called with `new`, and throws                                // 63
  // an error if it is not.                                                                                // 64
  classCallCheck: function (instance, Constructor) {                                                       // 65
    if (!(instance instanceof Constructor)) {                                                              // 66
      throw new TypeError("Cannot call a class as a function");                                            // 67
    }                                                                                                      // 68
  },                                                                                                       // 69
                                                                                                           // 70
  // es6.classes                                                                                           // 71
  inherits: function (subClass, superClass) {                                                              // 72
    if (typeof superClass !== "function" && superClass !== null) {                                         // 73
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }                                                                                                      // 75
                                                                                                           // 76
    if (superClass) {                                                                                      // 77
      if (Object.create) {                                                                                 // 78
        // All but IE 8                                                                                    // 79
        subClass.prototype = Object.create(superClass.prototype, {                                         // 80
          constructor: {                                                                                   // 81
            value: subClass,                                                                               // 82
            enumerable: false,                                                                             // 83
            writable: true,                                                                                // 84
            configurable: true                                                                             // 85
          }                                                                                                // 86
        });                                                                                                // 87
      } else {                                                                                             // 88
        // IE 8 path.  Slightly worse for modern browsers, because `constructor`                           // 89
        // is enumerable and shows up in the inspector unnecessarily.                                      // 90
        // It's not an "own" property of any instance though.                                              // 91
        //                                                                                                 // 92
        // For correctness when writing code,                                                              // 93
        // don't enumerate all the own-and-inherited properties of an instance                             // 94
        // of a class and expect not to find `constructor` (but who does that?).                           // 95
        var F = function () {                                                                              // 96
          this.constructor = subClass;                                                                     // 97
        };                                                                                                 // 98
        F.prototype = superClass.prototype;                                                                // 99
        subClass.prototype = new F();                                                                      // 100
      }                                                                                                    // 101
                                                                                                           // 102
      // For modern browsers, this would be `subClass.__proto__ = superClass`,                             // 103
      // but IE <=10 don't support `__proto__`, and in this case the difference                            // 104
      // would be detectable; code that works in modern browsers could easily                              // 105
      // fail on IE 8 if we ever used the `__proto__` trick.                                               // 106
      //                                                                                                   // 107
      // There's no perfect way to make static methods inherited if they are                               // 108
      // assigned after declaration of the classes.  The best we can do is                                 // 109
      // to copy them.  In other words, when you write `class Foo                                          // 110
      // extends Bar`, we copy the static methods from Bar onto Foo, but future                            // 111
      // ones are not copied.                                                                              // 112
      //                                                                                                   // 113
      // For correctness when writing code, don't add static methods to a class                            // 114
      // after you subclass it.                                                                            // 115
                                                                                                           // 116
      // The ecmascript-runtime package provides adequate polyfills for                                    // 117
      // all of these Object.* functions (and Array#forEach), and anyone                                   // 118
      // using babel-runtime is almost certainly using it because of the                                   // 119
      // ecmascript package, which also implies ecmascript-runtime.                                        // 120
      Object.getOwnPropertyNames(superClass).forEach(function (k) {                                        // 121
        // This property descriptor dance preserves getter/setter behavior                                 // 122
        // in browsers that support accessor properties (all except                                        // 123
        // IE8). In IE8, the superClass can't have accessor properties                                     // 124
        // anyway, so this code is still safe.                                                             // 125
        var descriptor = Object.getOwnPropertyDescriptor(superClass, k);                                   // 126
        if (descriptor && typeof descriptor === "object") {                                                // 127
          if (Object.getOwnPropertyDescriptor(subClass, k)) {                                              // 128
            // If subClass already has a property by this name, then it                                    // 129
            // would not be inherited, so it should not be copied. This                                    // 130
            // notably excludes properties like .prototype and .name.                                      // 131
            return;                                                                                        // 132
          }                                                                                                // 133
                                                                                                           // 134
          Object.defineProperty(subClass, k, descriptor);                                                  // 135
        }                                                                                                  // 136
      });                                                                                                  // 137
    }                                                                                                      // 138
  },                                                                                                       // 139
                                                                                                           // 140
  createClass: (function () {                                                                              // 141
    var hasDefineProperty = false;                                                                         // 142
    try {                                                                                                  // 143
      // IE 8 has a broken Object.defineProperty, so feature-test by                                       // 144
      // trying to call it.                                                                                // 145
      Object.defineProperty({}, 'x', {});                                                                  // 146
      hasDefineProperty = true;                                                                            // 147
    } catch (e) {}                                                                                         // 148
                                                                                                           // 149
    function defineProperties(target, props) {                                                             // 150
      for (var i = 0; i < props.length; i++) {                                                             // 151
        var descriptor = props[i];                                                                         // 152
        descriptor.enumerable = descriptor.enumerable || false;                                            // 153
        descriptor.configurable = true;                                                                    // 154
        if ("value" in descriptor) descriptor.writable = true;                                             // 155
        Object.defineProperty(target, descriptor.key, descriptor);                                         // 156
      }                                                                                                    // 157
    }                                                                                                      // 158
                                                                                                           // 159
    return function (Constructor, protoProps, staticProps) {                                               // 160
      if (! hasDefineProperty) {                                                                           // 161
        // e.g. `class Foo { get bar() {} }`.  If you try to use getters and                               // 162
        // setters in IE 8, you will get a big nasty error, with or without                                // 163
        // Babel.  I don't know of any other syntax features besides getters                               // 164
        // and setters that will trigger this error.                                                       // 165
        throw new Error(                                                                                   // 166
          "Your browser does not support this type of class property.  " +                                 // 167
            "For example, Internet Explorer 8 does not support getters and " +                             // 168
            "setters.");                                                                                   // 169
      }                                                                                                    // 170
                                                                                                           // 171
      if (protoProps) defineProperties(Constructor.prototype, protoProps);                                 // 172
      if (staticProps) defineProperties(Constructor, staticProps);                                         // 173
      return Constructor;                                                                                  // 174
    };                                                                                                     // 175
  })(),                                                                                                    // 176
                                                                                                           // 177
  "typeof": function (obj) {                                                                               // 178
    return obj && obj.constructor === Symbol ? "symbol" : typeof obj;                                      // 179
  },                                                                                                       // 180
                                                                                                           // 181
  possibleConstructorReturn: function (self, call) {                                                       // 182
    if (! self) {                                                                                          // 183
      throw new ReferenceError(                                                                            // 184
        "this hasn't been initialised - super() hasn't been called"                                        // 185
      );                                                                                                   // 186
    }                                                                                                      // 187
                                                                                                           // 188
    var callType = typeof call;                                                                            // 189
    if (call &&                                                                                            // 190
        callType === "function" ||                                                                         // 191
        callType === "object") {                                                                           // 192
      return call;                                                                                         // 193
    }                                                                                                      // 194
                                                                                                           // 195
    return self;                                                                                           // 196
  },                                                                                                       // 197
                                                                                                           // 198
  interopRequireDefault: function (obj) {                                                                  // 199
    return obj && obj.__esModule ? obj : { 'default': obj };                                               // 200
  },                                                                                                       // 201
                                                                                                           // 202
  interopRequireWildcard: function (obj) {                                                                 // 203
    if (obj && obj.__esModule) {                                                                           // 204
      return obj;                                                                                          // 205
    }                                                                                                      // 206
                                                                                                           // 207
    var newObj = {};                                                                                       // 208
                                                                                                           // 209
    if (obj != null) {                                                                                     // 210
      for (var key in obj) {                                                                               // 211
        if (hasOwn.call(obj, key)) {                                                                       // 212
          newObj[key] = obj[key];                                                                          // 213
        }                                                                                                  // 214
      }                                                                                                    // 215
    }                                                                                                      // 216
                                                                                                           // 217
    newObj["default"] = obj;                                                                               // 218
    return newObj;                                                                                         // 219
  },                                                                                                       // 220
                                                                                                           // 221
  interopExportWildcard: function (obj, defaults) {                                                        // 222
    var newObj = defaults({}, obj);                                                                        // 223
    delete newObj["default"];                                                                              // 224
    return newObj;                                                                                         // 225
  },                                                                                                       // 226
                                                                                                           // 227
  defaults: function (obj, defaults) {                                                                     // 228
    Object.getOwnPropertyNames(defaults).forEach(function (key) {                                          // 229
      var desc = Object.getOwnPropertyDescriptor(defaults, key);                                           // 230
      if (desc && desc.configurable && typeof obj[key] === "undefined") {                                  // 231
        Object.defineProperty(obj, key, desc);                                                             // 232
      }                                                                                                    // 233
    });                                                                                                    // 234
                                                                                                           // 235
    return obj;                                                                                            // 236
  },                                                                                                       // 237
                                                                                                           // 238
  // es7.objectRestSpread and react (JSX)                                                                  // 239
  "extends": Object.assign || (function (target) {                                                         // 240
    for (var i = 1; i < arguments.length; i++) {                                                           // 241
      var source = arguments[i];                                                                           // 242
      for (var key in source) {                                                                            // 243
        if (hasOwn.call(source, key)) {                                                                    // 244
          target[key] = source[key];                                                                       // 245
        }                                                                                                  // 246
      }                                                                                                    // 247
    }                                                                                                      // 248
    return target;                                                                                         // 249
  }),                                                                                                      // 250
                                                                                                           // 251
  // es6.destructuring                                                                                     // 252
  objectWithoutProperties: function (obj, keys) {                                                          // 253
    var target = {};                                                                                       // 254
    outer: for (var i in obj) {                                                                            // 255
      if (! hasOwn.call(obj, i)) continue;                                                                 // 256
      for (var j = 0; j < keys.length; j++) {                                                              // 257
        if (keys[j] === i) continue outer;                                                                 // 258
      }                                                                                                    // 259
      target[i] = obj[i];                                                                                  // 260
    }                                                                                                      // 261
    return target;                                                                                         // 262
  },                                                                                                       // 263
                                                                                                           // 264
  // es6.destructuring                                                                                     // 265
  objectDestructuringEmpty: function (obj) {                                                               // 266
    if (obj == null) throw new TypeError("Cannot destructure undefined");                                  // 267
  },                                                                                                       // 268
                                                                                                           // 269
  // es6.spread                                                                                            // 270
  bind: Function.prototype.bind || (function () {                                                          // 271
    var isCallable = function (value) { return typeof value === 'function'; };                             // 272
    var $Object = Object;                                                                                  // 273
    var to_string = Object.prototype.toString;                                                             // 274
    var array_slice = Array.prototype.slice;                                                               // 275
    var array_concat = Array.prototype.concat;                                                             // 276
    var array_push = Array.prototype.push;                                                                 // 277
    var max = Math.max;                                                                                    // 278
    var Empty = function Empty() {};                                                                       // 279
                                                                                                           // 280
    // Copied from es5-shim.js (3ac7942).  See original for more comments.                                 // 281
    return function bind(that) {                                                                           // 282
      var target = this;                                                                                   // 283
      if (!isCallable(target)) {                                                                           // 284
        throw new TypeError('Function.prototype.bind called on incompatible ' + target);                   // 285
      }                                                                                                    // 286
                                                                                                           // 287
      var args = array_slice.call(arguments, 1);                                                           // 288
                                                                                                           // 289
      var bound;                                                                                           // 290
      var binder = function () {                                                                           // 291
                                                                                                           // 292
        if (this instanceof bound) {                                                                       // 293
          var result = target.apply(                                                                       // 294
            this,                                                                                          // 295
            array_concat.call(args, array_slice.call(arguments))                                           // 296
          );                                                                                               // 297
          if ($Object(result) === result) {                                                                // 298
            return result;                                                                                 // 299
          }                                                                                                // 300
          return this;                                                                                     // 301
        } else {                                                                                           // 302
          return target.apply(                                                                             // 303
            that,                                                                                          // 304
            array_concat.call(args, array_slice.call(arguments))                                           // 305
          );                                                                                               // 306
        }                                                                                                  // 307
      };                                                                                                   // 308
                                                                                                           // 309
      var boundLength = max(0, target.length - args.length);                                               // 310
                                                                                                           // 311
      var boundArgs = [];                                                                                  // 312
      for (var i = 0; i < boundLength; i++) {                                                              // 313
        array_push.call(boundArgs, '$' + i);                                                               // 314
      }                                                                                                    // 315
                                                                                                           // 316
      // Create a Function from source code so that it has the right `.length`.                            // 317
      // Probably not important for Babel.  This code violates CSPs that ban                               // 318
      // `eval`, but the browsers that need this polyfill don't have CSP!                                  // 319
      bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);
                                                                                                           // 321
      if (target.prototype) {                                                                              // 322
        Empty.prototype = target.prototype;                                                                // 323
        bound.prototype = new Empty();                                                                     // 324
        Empty.prototype = null;                                                                            // 325
      }                                                                                                    // 326
                                                                                                           // 327
      return bound;                                                                                        // 328
    };                                                                                                     // 329
                                                                                                           // 330
  })(),                                                                                                    // 331
                                                                                                           // 332
  toConsumableArray: function (arr) {                                                                      // 333
    if (Array.isArray(arr)) {                                                                              // 334
      for (var i = arr.length - 1, arr2 = Array(i + 1); i >= 0; --i) {                                     // 335
        arr2[i] = arr[i];                                                                                  // 336
      }                                                                                                    // 337
                                                                                                           // 338
      return arr2;                                                                                         // 339
    }                                                                                                      // 340
                                                                                                           // 341
    return Array.from(arr);                                                                                // 342
  },                                                                                                       // 343
                                                                                                           // 344
  toArray: function (arr) {                                                                                // 345
    return Array.isArray(arr) ? arr : Array.from(arr);                                                     // 346
  },                                                                                                       // 347
                                                                                                           // 348
  slicedToArray: function (iterable, limit) {                                                              // 349
    if (Array.isArray(iterable)) {                                                                         // 350
      return iterable;                                                                                     // 351
    }                                                                                                      // 352
                                                                                                           // 353
    if (iterable) {                                                                                        // 354
      var it = iterable[iteratorSymbol]();                                                                 // 355
      var result = [];                                                                                     // 356
      var info;                                                                                            // 357
                                                                                                           // 358
      if (typeof limit !== "number") {                                                                     // 359
        limit = Infinity;                                                                                  // 360
      }                                                                                                    // 361
                                                                                                           // 362
      while (result.length < limit &&                                                                      // 363
             ! (info = it.next()).done) {                                                                  // 364
        result.push(info.value);                                                                           // 365
      }                                                                                                    // 366
                                                                                                           // 367
      return result;                                                                                       // 368
    }                                                                                                      // 369
                                                                                                           // 370
    throw new TypeError(                                                                                   // 371
      "Invalid attempt to destructure non-iterable instance"                                               // 372
    );                                                                                                     // 373
  },                                                                                                       // 374
                                                                                                           // 375
  slice: Array.prototype.slice                                                                             // 376
};                                                                                                         // 377
                                                                                                           // 378
// Use meteorInstall to install all of the above helper functions within                                   // 379
// node_modules/babel-runtime/helpers.                                                                     // 380
Object.keys(BabelRuntime).forEach(function (helperName) {                                                  // 381
  var helpers = {};                                                                                        // 382
                                                                                                           // 383
  helpers[helperName + ".js"] = function (require, exports, module) {                                      // 384
    module.exports = BabelRuntime[helperName];                                                             // 385
  };                                                                                                       // 386
                                                                                                           // 387
  meteorInstall({                                                                                          // 388
    node_modules: {                                                                                        // 389
      "babel-runtime": {                                                                                   // 390
        helpers: helpers                                                                                   // 391
      }                                                                                                    // 392
    }                                                                                                      // 393
  });                                                                                                      // 394
});                                                                                                        // 395
                                                                                                           // 396
// Use meteorInstall to install the regenerator runtime at                                                 // 397
// node_modules/babel-runtime/regenerator.                                                                 // 398
meteorInstall({                                                                                            // 399
  node_modules: {                                                                                          // 400
    "babel-runtime": {                                                                                     // 401
      "regenerator.js": function (r, e, module) {                                                          // 402
        // Note that we use the require function provided to the                                           // 403
        // babel-runtime.js file, not the one named 'r' above.                                             // 404
        var runtime = require("regenerator/runtime-module");                                               // 405
                                                                                                           // 406
        // If Promise.asyncApply is defined, use it to wrap calls to                                       // 407
        // runtime.async so that the entire async function will run in its                                 // 408
        // own Fiber, not just the code that comes after the first await.                                  // 409
        if (typeof Promise === "function" &&                                                               // 410
            typeof Promise.asyncApply === "function") {                                                    // 411
          var realAsync = runtime.async;                                                                   // 412
          runtime.async = function () {                                                                    // 413
            return Promise.asyncApply(realAsync, runtime, arguments);                                      // 414
          };                                                                                               // 415
        }                                                                                                  // 416
                                                                                                           // 417
        module.exports = runtime;                                                                          // 418
      }                                                                                                    // 419
    }                                                                                                      // 420
  }                                                                                                        // 421
});                                                                                                        // 422
                                                                                                           // 423
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"node_modules":{"regenerator":{"runtime-module.js":["./runtime",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// node_modules/meteor/babel-runtime/node_modules/regenerator/runtime-module.js                            //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
// This method of obtaining a reference to the global object needs to be                                   // 1
// kept identical to the way it is obtained in runtime.js                                                  // 2
var g =                                                                                                    // 3
  typeof global === "object" ? global :                                                                    // 4
  typeof window === "object" ? window :                                                                    // 5
  typeof self === "object" ? self : this;                                                                  // 6
                                                                                                           // 7
// Use `getOwnPropertyNames` because not all browsers support calling                                      // 8
// `hasOwnProperty` on the global `self` object in a worker. See #183.                                     // 9
var hadRuntime = g.regeneratorRuntime &&                                                                   // 10
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;                                        // 11
                                                                                                           // 12
// Save the old regeneratorRuntime in case it needs to be restored later.                                  // 13
var oldRuntime = hadRuntime && g.regeneratorRuntime;                                                       // 14
                                                                                                           // 15
// Force reevalutation of runtime.js.                                                                      // 16
g.regeneratorRuntime = undefined;                                                                          // 17
                                                                                                           // 18
module.exports = require("./runtime");                                                                     // 19
                                                                                                           // 20
if (hadRuntime) {                                                                                          // 21
  // Restore the original runtime.                                                                         // 22
  g.regeneratorRuntime = oldRuntime;                                                                       // 23
} else {                                                                                                   // 24
  // Remove the global property added by runtime.js.                                                       // 25
  try {                                                                                                    // 26
    delete g.regeneratorRuntime;                                                                           // 27
  } catch(e) {                                                                                             // 28
    g.regeneratorRuntime = undefined;                                                                      // 29
  }                                                                                                        // 30
}                                                                                                          // 31
                                                                                                           // 32
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"runtime.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                         //
// node_modules/meteor/babel-runtime/node_modules/regenerator/runtime.js                                   //
//                                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                           //
/**                                                                                                        // 1
 * Copyright (c) 2014, Facebook, Inc.                                                                      // 2
 * All rights reserved.                                                                                    // 3
 *                                                                                                         // 4
 * This source code is licensed under the BSD-style license found in the                                   // 5
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An                                     // 6
 * additional grant of patent rights can be found in the PATENTS file in                                   // 7
 * the same directory.                                                                                     // 8
 */                                                                                                        // 9
                                                                                                           // 10
!(function(global) {                                                                                       // 11
  "use strict";                                                                                            // 12
                                                                                                           // 13
  var hasOwn = Object.prototype.hasOwnProperty;                                                            // 14
  var undefined; // More compressible than void 0.                                                         // 15
  var $Symbol = typeof Symbol === "function" ? Symbol : {};                                                // 16
  var iteratorSymbol = $Symbol.iterator || "@@iterator";                                                   // 17
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";                                          // 18
                                                                                                           // 19
  var inModule = typeof module === "object";                                                               // 20
  var runtime = global.regeneratorRuntime;                                                                 // 21
  if (runtime) {                                                                                           // 22
    if (inModule) {                                                                                        // 23
      // If regeneratorRuntime is defined globally and we're in a module,                                  // 24
      // make the exports object identical to regeneratorRuntime.                                          // 25
      module.exports = runtime;                                                                            // 26
    }                                                                                                      // 27
    // Don't bother evaluating the rest of this file if the runtime was                                    // 28
    // already defined globally.                                                                           // 29
    return;                                                                                                // 30
  }                                                                                                        // 31
                                                                                                           // 32
  // Define the runtime globally (as expected by generated code) as either                                 // 33
  // module.exports (if we're in a module) or a new, empty object.                                         // 34
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};                                    // 35
                                                                                                           // 36
  function wrap(innerFn, outerFn, self, tryLocsList) {                                                     // 37
    // If outerFn provided, then outerFn.prototype instanceof Generator.                                   // 38
    var generator = Object.create((outerFn || Generator).prototype);                                       // 39
    var context = new Context(tryLocsList || []);                                                          // 40
                                                                                                           // 41
    // The ._invoke method unifies the implementations of the .next,                                       // 42
    // .throw, and .return methods.                                                                        // 43
    generator._invoke = makeInvokeMethod(innerFn, self, context);                                          // 44
                                                                                                           // 45
    return generator;                                                                                      // 46
  }                                                                                                        // 47
  runtime.wrap = wrap;                                                                                     // 48
                                                                                                           // 49
  // Try/catch helper to minimize deoptimizations. Returns a completion                                    // 50
  // record like context.tryEntries[i].completion. This interface could                                    // 51
  // have been (and was previously) designed to take a closure to be                                       // 52
  // invoked without arguments, but in all the cases we care about we                                      // 53
  // already have an existing method we want to call, so there's no need                                   // 54
  // to create a new function object. We can even get away with assuming                                   // 55
  // the method takes exactly one argument, since that happens to be true                                  // 56
  // in every case, so we don't have to touch the arguments object. The                                    // 57
  // only additional allocation required is the completion record, which                                   // 58
  // has a stable shape and so hopefully should be cheap to allocate.                                      // 59
  function tryCatch(fn, obj, arg) {                                                                        // 60
    try {                                                                                                  // 61
      return { type: "normal", arg: fn.call(obj, arg) };                                                   // 62
    } catch (err) {                                                                                        // 63
      return { type: "throw", arg: err };                                                                  // 64
    }                                                                                                      // 65
  }                                                                                                        // 66
                                                                                                           // 67
  var GenStateSuspendedStart = "suspendedStart";                                                           // 68
  var GenStateSuspendedYield = "suspendedYield";                                                           // 69
  var GenStateExecuting = "executing";                                                                     // 70
  var GenStateCompleted = "completed";                                                                     // 71
                                                                                                           // 72
  // Returning this object from the innerFn has the same effect as                                         // 73
  // breaking out of the dispatch switch statement.                                                        // 74
  var ContinueSentinel = {};                                                                               // 75
                                                                                                           // 76
  // Dummy constructor functions that we use as the .constructor and                                       // 77
  // .constructor.prototype properties for functions that return Generator                                 // 78
  // objects. For full spec compliance, you may wish to configure your                                     // 79
  // minifier not to mangle the names of these two functions.                                              // 80
  function Generator() {}                                                                                  // 81
  function GeneratorFunction() {}                                                                          // 82
  function GeneratorFunctionPrototype() {}                                                                 // 83
                                                                                                           // 84
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;                                     // 85
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;                               // 86
  GeneratorFunctionPrototype.constructor = GeneratorFunction;                                              // 87
  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction";     // 88
                                                                                                           // 89
  // Helper for defining the .next, .throw, and .return methods of the                                     // 90
  // Iterator interface in terms of a single ._invoke method.                                              // 91
  function defineIteratorMethods(prototype) {                                                              // 92
    ["next", "throw", "return"].forEach(function(method) {                                                 // 93
      prototype[method] = function(arg) {                                                                  // 94
        return this._invoke(method, arg);                                                                  // 95
      };                                                                                                   // 96
    });                                                                                                    // 97
  }                                                                                                        // 98
                                                                                                           // 99
  runtime.isGeneratorFunction = function(genFun) {                                                         // 100
    var ctor = typeof genFun === "function" && genFun.constructor;                                         // 101
    return ctor                                                                                            // 102
      ? ctor === GeneratorFunction ||                                                                      // 103
        // For the native GeneratorFunction constructor, the best we can                                   // 104
        // do is to check its .name property.                                                              // 105
        (ctor.displayName || ctor.name) === "GeneratorFunction"                                            // 106
      : false;                                                                                             // 107
  };                                                                                                       // 108
                                                                                                           // 109
  runtime.mark = function(genFun) {                                                                        // 110
    if (Object.setPrototypeOf) {                                                                           // 111
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);                                           // 112
    } else {                                                                                               // 113
      genFun.__proto__ = GeneratorFunctionPrototype;                                                       // 114
      if (!(toStringTagSymbol in genFun)) {                                                                // 115
        genFun[toStringTagSymbol] = "GeneratorFunction";                                                   // 116
      }                                                                                                    // 117
    }                                                                                                      // 118
    genFun.prototype = Object.create(Gp);                                                                  // 119
    return genFun;                                                                                         // 120
  };                                                                                                       // 121
                                                                                                           // 122
  // Within the body of any async function, `await x` is transformed to                                    // 123
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test                                     // 124
  // `value instanceof AwaitArgument` to determine if the yielded value is                                 // 125
  // meant to be awaited. Some may consider the name of this method too                                    // 126
  // cutesy, but they are curmudgeons.                                                                     // 127
  runtime.awrap = function(arg) {                                                                          // 128
    return new AwaitArgument(arg);                                                                         // 129
  };                                                                                                       // 130
                                                                                                           // 131
  function AwaitArgument(arg) {                                                                            // 132
    this.arg = arg;                                                                                        // 133
  }                                                                                                        // 134
                                                                                                           // 135
  function AsyncIterator(generator) {                                                                      // 136
    function invoke(method, arg, resolve, reject) {                                                        // 137
      var record = tryCatch(generator[method], generator, arg);                                            // 138
      if (record.type === "throw") {                                                                       // 139
        reject(record.arg);                                                                                // 140
      } else {                                                                                             // 141
        var result = record.arg;                                                                           // 142
        var value = result.value;                                                                          // 143
        if (value instanceof AwaitArgument) {                                                              // 144
          return Promise.resolve(value.arg).then(function(value) {                                         // 145
            invoke("next", value, resolve, reject);                                                        // 146
          }, function(err) {                                                                               // 147
            invoke("throw", err, resolve, reject);                                                         // 148
          });                                                                                              // 149
        }                                                                                                  // 150
                                                                                                           // 151
        return Promise.resolve(value).then(function(unwrapped) {                                           // 152
          // When a yielded Promise is resolved, its final value becomes                                   // 153
          // the .value of the Promise<{value,done}> result for the                                        // 154
          // current iteration. If the Promise is rejected, however, the                                   // 155
          // result for this iteration will be rejected with the same                                      // 156
          // reason. Note that rejections of yielded Promises are not                                      // 157
          // thrown back into the generator function, as is the case                                       // 158
          // when an awaited Promise is rejected. This difference in                                       // 159
          // behavior between yield and await is important, because it                                     // 160
          // allows the consumer to decide what to do with the yielded                                     // 161
          // rejection (swallow it and continue, manually .throw it back                                   // 162
          // into the generator, abandon iteration, whatever). With                                        // 163
          // await, by contrast, there is no opportunity to examine the                                    // 164
          // rejection reason outside the generator function, so the                                       // 165
          // only option is to throw it from the await expression, and                                     // 166
          // let the generator function handle the exception.                                              // 167
          result.value = unwrapped;                                                                        // 168
          resolve(result);                                                                                 // 169
        }, reject);                                                                                        // 170
      }                                                                                                    // 171
    }                                                                                                      // 172
                                                                                                           // 173
    if (typeof process === "object" && process.domain) {                                                   // 174
      invoke = process.domain.bind(invoke);                                                                // 175
    }                                                                                                      // 176
                                                                                                           // 177
    var previousPromise;                                                                                   // 178
                                                                                                           // 179
    function enqueue(method, arg) {                                                                        // 180
      function callInvokeWithMethodAndArg() {                                                              // 181
        return new Promise(function(resolve, reject) {                                                     // 182
          invoke(method, arg, resolve, reject);                                                            // 183
        });                                                                                                // 184
      }                                                                                                    // 185
                                                                                                           // 186
      return previousPromise =                                                                             // 187
        // If enqueue has been called before, then we want to wait until                                   // 188
        // all previous Promises have been resolved before calling invoke,                                 // 189
        // so that results are always delivered in the correct order. If                                   // 190
        // enqueue has not been called before, then it is important to                                     // 191
        // call invoke immediately, without waiting on a callback to fire,                                 // 192
        // so that the async generator function has the opportunity to do                                  // 193
        // any necessary setup in a predictable way. This predictability                                   // 194
        // is why the Promise constructor synchronously invokes its                                        // 195
        // executor callback, and why async functions synchronously                                        // 196
        // execute code before the first await. Since we implement simple                                  // 197
        // async functions in terms of async generators, it is especially                                  // 198
        // important to get this right, even though it requires care.                                      // 199
        previousPromise ? previousPromise.then(                                                            // 200
          callInvokeWithMethodAndArg,                                                                      // 201
          // Avoid propagating failures to Promises returned by later                                      // 202
          // invocations of the iterator.                                                                  // 203
          callInvokeWithMethodAndArg                                                                       // 204
        ) : callInvokeWithMethodAndArg();                                                                  // 205
    }                                                                                                      // 206
                                                                                                           // 207
    // Define the unified helper method that is used to implement .next,                                   // 208
    // .throw, and .return (see defineIteratorMethods).                                                    // 209
    this._invoke = enqueue;                                                                                // 210
  }                                                                                                        // 211
                                                                                                           // 212
  defineIteratorMethods(AsyncIterator.prototype);                                                          // 213
                                                                                                           // 214
  // Note that simple async functions are implemented on top of                                            // 215
  // AsyncIterator objects; they just return a Promise for the value of                                    // 216
  // the final result produced by the iterator.                                                            // 217
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {                                          // 218
    var iter = new AsyncIterator(                                                                          // 219
      wrap(innerFn, outerFn, self, tryLocsList)                                                            // 220
    );                                                                                                     // 221
                                                                                                           // 222
    return runtime.isGeneratorFunction(outerFn)                                                            // 223
      ? iter // If outerFn is a generator, return the full iterator.                                       // 224
      : iter.next().then(function(result) {                                                                // 225
          return result.done ? result.value : iter.next();                                                 // 226
        });                                                                                                // 227
  };                                                                                                       // 228
                                                                                                           // 229
  function makeInvokeMethod(innerFn, self, context) {                                                      // 230
    var state = GenStateSuspendedStart;                                                                    // 231
                                                                                                           // 232
    return function invoke(method, arg) {                                                                  // 233
      if (state === GenStateExecuting) {                                                                   // 234
        throw new Error("Generator is already running");                                                   // 235
      }                                                                                                    // 236
                                                                                                           // 237
      if (state === GenStateCompleted) {                                                                   // 238
        if (method === "throw") {                                                                          // 239
          throw arg;                                                                                       // 240
        }                                                                                                  // 241
                                                                                                           // 242
        // Be forgiving, per 25.3.3.3.3 of the spec:                                                       // 243
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume                       // 244
        return doneResult();                                                                               // 245
      }                                                                                                    // 246
                                                                                                           // 247
      while (true) {                                                                                       // 248
        var delegate = context.delegate;                                                                   // 249
        if (delegate) {                                                                                    // 250
          if (method === "return" ||                                                                       // 251
              (method === "throw" && delegate.iterator[method] === undefined)) {                           // 252
            // A return or throw (when the delegate iterator has no throw                                  // 253
            // method) always terminates the yield* loop.                                                  // 254
            context.delegate = null;                                                                       // 255
                                                                                                           // 256
            // If the delegate iterator has a return method, give it a                                     // 257
            // chance to clean up.                                                                         // 258
            var returnMethod = delegate.iterator["return"];                                                // 259
            if (returnMethod) {                                                                            // 260
              var record = tryCatch(returnMethod, delegate.iterator, arg);                                 // 261
              if (record.type === "throw") {                                                               // 262
                // If the return method threw an exception, let that                                       // 263
                // exception prevail over the original return or throw.                                    // 264
                method = "throw";                                                                          // 265
                arg = record.arg;                                                                          // 266
                continue;                                                                                  // 267
              }                                                                                            // 268
            }                                                                                              // 269
                                                                                                           // 270
            if (method === "return") {                                                                     // 271
              // Continue with the outer return, now that the delegate                                     // 272
              // iterator has been terminated.                                                             // 273
              continue;                                                                                    // 274
            }                                                                                              // 275
          }                                                                                                // 276
                                                                                                           // 277
          var record = tryCatch(                                                                           // 278
            delegate.iterator[method],                                                                     // 279
            delegate.iterator,                                                                             // 280
            arg                                                                                            // 281
          );                                                                                               // 282
                                                                                                           // 283
          if (record.type === "throw") {                                                                   // 284
            context.delegate = null;                                                                       // 285
                                                                                                           // 286
            // Like returning generator.throw(uncaught), but without the                                   // 287
            // overhead of an extra function call.                                                         // 288
            method = "throw";                                                                              // 289
            arg = record.arg;                                                                              // 290
            continue;                                                                                      // 291
          }                                                                                                // 292
                                                                                                           // 293
          // Delegate generator ran and handled its own exceptions so                                      // 294
          // regardless of what the method was, we continue as if it is                                    // 295
          // "next" with an undefined arg.                                                                 // 296
          method = "next";                                                                                 // 297
          arg = undefined;                                                                                 // 298
                                                                                                           // 299
          var info = record.arg;                                                                           // 300
          if (info.done) {                                                                                 // 301
            context[delegate.resultName] = info.value;                                                     // 302
            context.next = delegate.nextLoc;                                                               // 303
          } else {                                                                                         // 304
            state = GenStateSuspendedYield;                                                                // 305
            return info;                                                                                   // 306
          }                                                                                                // 307
                                                                                                           // 308
          context.delegate = null;                                                                         // 309
        }                                                                                                  // 310
                                                                                                           // 311
        if (method === "next") {                                                                           // 312
          if (state === GenStateSuspendedYield) {                                                          // 313
            context.sent = arg;                                                                            // 314
          } else {                                                                                         // 315
            context.sent = undefined;                                                                      // 316
          }                                                                                                // 317
                                                                                                           // 318
        } else if (method === "throw") {                                                                   // 319
          if (state === GenStateSuspendedStart) {                                                          // 320
            state = GenStateCompleted;                                                                     // 321
            throw arg;                                                                                     // 322
          }                                                                                                // 323
                                                                                                           // 324
          if (context.dispatchException(arg)) {                                                            // 325
            // If the dispatched exception was caught by a catch block,                                    // 326
            // then let that catch block handle the exception normally.                                    // 327
            method = "next";                                                                               // 328
            arg = undefined;                                                                               // 329
          }                                                                                                // 330
                                                                                                           // 331
        } else if (method === "return") {                                                                  // 332
          context.abrupt("return", arg);                                                                   // 333
        }                                                                                                  // 334
                                                                                                           // 335
        state = GenStateExecuting;                                                                         // 336
                                                                                                           // 337
        var record = tryCatch(innerFn, self, context);                                                     // 338
        if (record.type === "normal") {                                                                    // 339
          // If an exception is thrown from innerFn, we leave state ===                                    // 340
          // GenStateExecuting and loop back for another invocation.                                       // 341
          state = context.done                                                                             // 342
            ? GenStateCompleted                                                                            // 343
            : GenStateSuspendedYield;                                                                      // 344
                                                                                                           // 345
          var info = {                                                                                     // 346
            value: record.arg,                                                                             // 347
            done: context.done                                                                             // 348
          };                                                                                               // 349
                                                                                                           // 350
          if (record.arg === ContinueSentinel) {                                                           // 351
            if (context.delegate && method === "next") {                                                   // 352
              // Deliberately forget the last sent value so that we don't                                  // 353
              // accidentally pass it on to the delegate.                                                  // 354
              arg = undefined;                                                                             // 355
            }                                                                                              // 356
          } else {                                                                                         // 357
            return info;                                                                                   // 358
          }                                                                                                // 359
                                                                                                           // 360
        } else if (record.type === "throw") {                                                              // 361
          state = GenStateCompleted;                                                                       // 362
          // Dispatch the exception by looping back around to the                                          // 363
          // context.dispatchException(arg) call above.                                                    // 364
          method = "throw";                                                                                // 365
          arg = record.arg;                                                                                // 366
        }                                                                                                  // 367
      }                                                                                                    // 368
    };                                                                                                     // 369
  }                                                                                                        // 370
                                                                                                           // 371
  // Define Generator.prototype.{next,throw,return} in terms of the                                        // 372
  // unified ._invoke helper method.                                                                       // 373
  defineIteratorMethods(Gp);                                                                               // 374
                                                                                                           // 375
  Gp[iteratorSymbol] = function() {                                                                        // 376
    return this;                                                                                           // 377
  };                                                                                                       // 378
                                                                                                           // 379
  Gp[toStringTagSymbol] = "Generator";                                                                     // 380
                                                                                                           // 381
  Gp.toString = function() {                                                                               // 382
    return "[object Generator]";                                                                           // 383
  };                                                                                                       // 384
                                                                                                           // 385
  function pushTryEntry(locs) {                                                                            // 386
    var entry = { tryLoc: locs[0] };                                                                       // 387
                                                                                                           // 388
    if (1 in locs) {                                                                                       // 389
      entry.catchLoc = locs[1];                                                                            // 390
    }                                                                                                      // 391
                                                                                                           // 392
    if (2 in locs) {                                                                                       // 393
      entry.finallyLoc = locs[2];                                                                          // 394
      entry.afterLoc = locs[3];                                                                            // 395
    }                                                                                                      // 396
                                                                                                           // 397
    this.tryEntries.push(entry);                                                                           // 398
  }                                                                                                        // 399
                                                                                                           // 400
  function resetTryEntry(entry) {                                                                          // 401
    var record = entry.completion || {};                                                                   // 402
    record.type = "normal";                                                                                // 403
    delete record.arg;                                                                                     // 404
    entry.completion = record;                                                                             // 405
  }                                                                                                        // 406
                                                                                                           // 407
  function Context(tryLocsList) {                                                                          // 408
    // The root entry object (effectively a try statement without a catch                                  // 409
    // or a finally block) gives us a place to store values thrown from                                    // 410
    // locations where there is no enclosing try statement.                                                // 411
    this.tryEntries = [{ tryLoc: "root" }];                                                                // 412
    tryLocsList.forEach(pushTryEntry, this);                                                               // 413
    this.reset(true);                                                                                      // 414
  }                                                                                                        // 415
                                                                                                           // 416
  runtime.keys = function(object) {                                                                        // 417
    var keys = [];                                                                                         // 418
    for (var key in object) {                                                                              // 419
      keys.push(key);                                                                                      // 420
    }                                                                                                      // 421
    keys.reverse();                                                                                        // 422
                                                                                                           // 423
    // Rather than returning an object with a next method, we keep                                         // 424
    // things simple and return the next function itself.                                                  // 425
    return function next() {                                                                               // 426
      while (keys.length) {                                                                                // 427
        var key = keys.pop();                                                                              // 428
        if (key in object) {                                                                               // 429
          next.value = key;                                                                                // 430
          next.done = false;                                                                               // 431
          return next;                                                                                     // 432
        }                                                                                                  // 433
      }                                                                                                    // 434
                                                                                                           // 435
      // To avoid creating an additional object, we just hang the .value                                   // 436
      // and .done properties off the next function object itself. This                                    // 437
      // also ensures that the minifier will not anonymize the function.                                   // 438
      next.done = true;                                                                                    // 439
      return next;                                                                                         // 440
    };                                                                                                     // 441
  };                                                                                                       // 442
                                                                                                           // 443
  function values(iterable) {                                                                              // 444
    if (iterable) {                                                                                        // 445
      var iteratorMethod = iterable[iteratorSymbol];                                                       // 446
      if (iteratorMethod) {                                                                                // 447
        return iteratorMethod.call(iterable);                                                              // 448
      }                                                                                                    // 449
                                                                                                           // 450
      if (typeof iterable.next === "function") {                                                           // 451
        return iterable;                                                                                   // 452
      }                                                                                                    // 453
                                                                                                           // 454
      if (!isNaN(iterable.length)) {                                                                       // 455
        var i = -1, next = function next() {                                                               // 456
          while (++i < iterable.length) {                                                                  // 457
            if (hasOwn.call(iterable, i)) {                                                                // 458
              next.value = iterable[i];                                                                    // 459
              next.done = false;                                                                           // 460
              return next;                                                                                 // 461
            }                                                                                              // 462
          }                                                                                                // 463
                                                                                                           // 464
          next.value = undefined;                                                                          // 465
          next.done = true;                                                                                // 466
                                                                                                           // 467
          return next;                                                                                     // 468
        };                                                                                                 // 469
                                                                                                           // 470
        return next.next = next;                                                                           // 471
      }                                                                                                    // 472
    }                                                                                                      // 473
                                                                                                           // 474
    // Return an iterator with no values.                                                                  // 475
    return { next: doneResult };                                                                           // 476
  }                                                                                                        // 477
  runtime.values = values;                                                                                 // 478
                                                                                                           // 479
  function doneResult() {                                                                                  // 480
    return { value: undefined, done: true };                                                               // 481
  }                                                                                                        // 482
                                                                                                           // 483
  Context.prototype = {                                                                                    // 484
    constructor: Context,                                                                                  // 485
                                                                                                           // 486
    reset: function(skipTempReset) {                                                                       // 487
      this.prev = 0;                                                                                       // 488
      this.next = 0;                                                                                       // 489
      this.sent = undefined;                                                                               // 490
      this.done = false;                                                                                   // 491
      this.delegate = null;                                                                                // 492
                                                                                                           // 493
      this.tryEntries.forEach(resetTryEntry);                                                              // 494
                                                                                                           // 495
      if (!skipTempReset) {                                                                                // 496
        for (var name in this) {                                                                           // 497
          // Not sure about the optimal order of these conditions:                                         // 498
          if (name.charAt(0) === "t" &&                                                                    // 499
              hasOwn.call(this, name) &&                                                                   // 500
              !isNaN(+name.slice(1))) {                                                                    // 501
            this[name] = undefined;                                                                        // 502
          }                                                                                                // 503
        }                                                                                                  // 504
      }                                                                                                    // 505
    },                                                                                                     // 506
                                                                                                           // 507
    stop: function() {                                                                                     // 508
      this.done = true;                                                                                    // 509
                                                                                                           // 510
      var rootEntry = this.tryEntries[0];                                                                  // 511
      var rootRecord = rootEntry.completion;                                                               // 512
      if (rootRecord.type === "throw") {                                                                   // 513
        throw rootRecord.arg;                                                                              // 514
      }                                                                                                    // 515
                                                                                                           // 516
      return this.rval;                                                                                    // 517
    },                                                                                                     // 518
                                                                                                           // 519
    dispatchException: function(exception) {                                                               // 520
      if (this.done) {                                                                                     // 521
        throw exception;                                                                                   // 522
      }                                                                                                    // 523
                                                                                                           // 524
      var context = this;                                                                                  // 525
      function handle(loc, caught) {                                                                       // 526
        record.type = "throw";                                                                             // 527
        record.arg = exception;                                                                            // 528
        context.next = loc;                                                                                // 529
        return !!caught;                                                                                   // 530
      }                                                                                                    // 531
                                                                                                           // 532
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {                                              // 533
        var entry = this.tryEntries[i];                                                                    // 534
        var record = entry.completion;                                                                     // 535
                                                                                                           // 536
        if (entry.tryLoc === "root") {                                                                     // 537
          // Exception thrown outside of any try block that could handle                                   // 538
          // it, so set the completion value of the entire function to                                     // 539
          // throw the exception.                                                                          // 540
          return handle("end");                                                                            // 541
        }                                                                                                  // 542
                                                                                                           // 543
        if (entry.tryLoc <= this.prev) {                                                                   // 544
          var hasCatch = hasOwn.call(entry, "catchLoc");                                                   // 545
          var hasFinally = hasOwn.call(entry, "finallyLoc");                                               // 546
                                                                                                           // 547
          if (hasCatch && hasFinally) {                                                                    // 548
            if (this.prev < entry.catchLoc) {                                                              // 549
              return handle(entry.catchLoc, true);                                                         // 550
            } else if (this.prev < entry.finallyLoc) {                                                     // 551
              return handle(entry.finallyLoc);                                                             // 552
            }                                                                                              // 553
                                                                                                           // 554
          } else if (hasCatch) {                                                                           // 555
            if (this.prev < entry.catchLoc) {                                                              // 556
              return handle(entry.catchLoc, true);                                                         // 557
            }                                                                                              // 558
                                                                                                           // 559
          } else if (hasFinally) {                                                                         // 560
            if (this.prev < entry.finallyLoc) {                                                            // 561
              return handle(entry.finallyLoc);                                                             // 562
            }                                                                                              // 563
                                                                                                           // 564
          } else {                                                                                         // 565
            throw new Error("try statement without catch or finally");                                     // 566
          }                                                                                                // 567
        }                                                                                                  // 568
      }                                                                                                    // 569
    },                                                                                                     // 570
                                                                                                           // 571
    abrupt: function(type, arg) {                                                                          // 572
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {                                              // 573
        var entry = this.tryEntries[i];                                                                    // 574
        if (entry.tryLoc <= this.prev &&                                                                   // 575
            hasOwn.call(entry, "finallyLoc") &&                                                            // 576
            this.prev < entry.finallyLoc) {                                                                // 577
          var finallyEntry = entry;                                                                        // 578
          break;                                                                                           // 579
        }                                                                                                  // 580
      }                                                                                                    // 581
                                                                                                           // 582
      if (finallyEntry &&                                                                                  // 583
          (type === "break" ||                                                                             // 584
           type === "continue") &&                                                                         // 585
          finallyEntry.tryLoc <= arg &&                                                                    // 586
          arg <= finallyEntry.finallyLoc) {                                                                // 587
        // Ignore the finally entry if control is not jumping to a                                         // 588
        // location outside the try/catch block.                                                           // 589
        finallyEntry = null;                                                                               // 590
      }                                                                                                    // 591
                                                                                                           // 592
      var record = finallyEntry ? finallyEntry.completion : {};                                            // 593
      record.type = type;                                                                                  // 594
      record.arg = arg;                                                                                    // 595
                                                                                                           // 596
      if (finallyEntry) {                                                                                  // 597
        this.next = finallyEntry.finallyLoc;                                                               // 598
      } else {                                                                                             // 599
        this.complete(record);                                                                             // 600
      }                                                                                                    // 601
                                                                                                           // 602
      return ContinueSentinel;                                                                             // 603
    },                                                                                                     // 604
                                                                                                           // 605
    complete: function(record, afterLoc) {                                                                 // 606
      if (record.type === "throw") {                                                                       // 607
        throw record.arg;                                                                                  // 608
      }                                                                                                    // 609
                                                                                                           // 610
      if (record.type === "break" ||                                                                       // 611
          record.type === "continue") {                                                                    // 612
        this.next = record.arg;                                                                            // 613
      } else if (record.type === "return") {                                                               // 614
        this.rval = record.arg;                                                                            // 615
        this.next = "end";                                                                                 // 616
      } else if (record.type === "normal" && afterLoc) {                                                   // 617
        this.next = afterLoc;                                                                              // 618
      }                                                                                                    // 619
    },                                                                                                     // 620
                                                                                                           // 621
    finish: function(finallyLoc) {                                                                         // 622
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {                                              // 623
        var entry = this.tryEntries[i];                                                                    // 624
        if (entry.finallyLoc === finallyLoc) {                                                             // 625
          this.complete(entry.completion, entry.afterLoc);                                                 // 626
          resetTryEntry(entry);                                                                            // 627
          return ContinueSentinel;                                                                         // 628
        }                                                                                                  // 629
      }                                                                                                    // 630
    },                                                                                                     // 631
                                                                                                           // 632
    "catch": function(tryLoc) {                                                                            // 633
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {                                              // 634
        var entry = this.tryEntries[i];                                                                    // 635
        if (entry.tryLoc === tryLoc) {                                                                     // 636
          var record = entry.completion;                                                                   // 637
          if (record.type === "throw") {                                                                   // 638
            var thrown = record.arg;                                                                       // 639
            resetTryEntry(entry);                                                                          // 640
          }                                                                                                // 641
          return thrown;                                                                                   // 642
        }                                                                                                  // 643
      }                                                                                                    // 644
                                                                                                           // 645
      // The context.catch method must only be called with a location                                      // 646
      // argument that corresponds to a known catch block.                                                 // 647
      throw new Error("illegal catch attempt");                                                            // 648
    },                                                                                                     // 649
                                                                                                           // 650
    delegateYield: function(iterable, resultName, nextLoc) {                                               // 651
      this.delegate = {                                                                                    // 652
        iterator: values(iterable),                                                                        // 653
        resultName: resultName,                                                                            // 654
        nextLoc: nextLoc                                                                                   // 655
      };                                                                                                   // 656
                                                                                                           // 657
      return ContinueSentinel;                                                                             // 658
    }                                                                                                      // 659
  };                                                                                                       // 660
})(                                                                                                        // 661
  // Among the various tricks for obtaining a reference to the global                                      // 662
  // object, this seems to be the most reliable technique that does not                                    // 663
  // use indirect eval (which violates Content Security Policy).                                           // 664
  typeof global === "object" ? global :                                                                    // 665
  typeof window === "object" ? window :                                                                    // 666
  typeof self === "object" ? self : this                                                                   // 667
);                                                                                                         // 668
                                                                                                           // 669
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/babel-runtime/babel-runtime.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['babel-runtime'] = {}, {
  meteorBabelHelpers: meteorBabelHelpers
});

})();
