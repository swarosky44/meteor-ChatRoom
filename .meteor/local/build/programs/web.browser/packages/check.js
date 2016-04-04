(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;

/* Package-scope variables */
var check, Match;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/check/match.js                                                                                           //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// XXX docs                                                                                                          // 1
                                                                                                                     // 2
// Things we explicitly do NOT support:                                                                              // 3
//    - heterogenous arrays                                                                                          // 4
                                                                                                                     // 5
var currentArgumentChecker = new Meteor.EnvironmentVariable;                                                         // 6
                                                                                                                     // 7
/**                                                                                                                  // 8
 * @summary Check that a value matches a [pattern](#matchpatterns).                                                  // 9
 * If the value does not match the pattern, throw a `Match.Error`.                                                   // 10
 *                                                                                                                   // 11
 * Particularly useful to assert that arguments to a function have the right                                         // 12
 * types and structure.                                                                                              // 13
 * @locus Anywhere                                                                                                   // 14
 * @param {Any} value The value to check                                                                             // 15
 * @param {MatchPattern} pattern The pattern to match                                                                // 16
 * `value` against                                                                                                   // 17
 */                                                                                                                  // 18
check = function (value, pattern) {                                                                                  // 19
  // Record that check got called, if somebody cared.                                                                // 20
  //                                                                                                                 // 21
  // We use getOrNullIfOutsideFiber so that it's OK to call check()                                                  // 22
  // from non-Fiber server contexts; the downside is that if you forget to                                           // 23
  // bindEnvironment on some random callback in your method/publisher,                                               // 24
  // it might not find the argumentChecker and you'll get an error about                                             // 25
  // not checking an argument that it looks like you're checking (instead                                            // 26
  // of just getting a "Node code must run in a Fiber" error).                                                       // 27
  var argChecker = currentArgumentChecker.getOrNullIfOutsideFiber();                                                 // 28
  if (argChecker)                                                                                                    // 29
    argChecker.checking(value);                                                                                      // 30
  var result = testSubtree(value, pattern);                                                                          // 31
  if (result) {                                                                                                      // 32
    var err = new Match.Error(result.message);                                                                       // 33
    if (result.path) {                                                                                               // 34
      err.message += " in field " + result.path;                                                                     // 35
      err.path = result.path;                                                                                        // 36
    }                                                                                                                // 37
    throw err;                                                                                                       // 38
  }                                                                                                                  // 39
};                                                                                                                   // 40
                                                                                                                     // 41
/**                                                                                                                  // 42
 * @namespace Match                                                                                                  // 43
 * @summary The namespace for all Match types and methods.                                                           // 44
 */                                                                                                                  // 45
Match = {                                                                                                            // 46
  Optional: function (pattern) {                                                                                     // 47
    return new Optional(pattern);                                                                                    // 48
  },                                                                                                                 // 49
  Maybe: function (pattern) {                                                                                        // 50
    return new Maybe(pattern);                                                                                       // 51
  },                                                                                                                 // 52
  OneOf: function (/*arguments*/) {                                                                                  // 53
    return new OneOf(_.toArray(arguments));                                                                          // 54
  },                                                                                                                 // 55
  Any: ['__any__'],                                                                                                  // 56
  Where: function (condition) {                                                                                      // 57
    return new Where(condition);                                                                                     // 58
  },                                                                                                                 // 59
  ObjectIncluding: function (pattern) {                                                                              // 60
    return new ObjectIncluding(pattern);                                                                             // 61
  },                                                                                                                 // 62
  ObjectWithValues: function (pattern) {                                                                             // 63
    return new ObjectWithValues(pattern);                                                                            // 64
  },                                                                                                                 // 65
  // Matches only signed 32-bit integers                                                                             // 66
  Integer: ['__integer__'],                                                                                          // 67
                                                                                                                     // 68
  // XXX matchers should know how to describe themselves for errors                                                  // 69
  Error: Meteor.makeErrorType("Match.Error", function (msg) {                                                        // 70
    this.message = "Match error: " + msg;                                                                            // 71
    // The path of the value that failed to match. Initially empty, this gets                                        // 72
    // populated by catching and rethrowing the exception as it goes back up the                                     // 73
    // stack.                                                                                                        // 74
    // E.g.: "vals[3].entity.created"                                                                                // 75
    this.path = "";                                                                                                  // 76
    // If this gets sent over DDP, don't give full internal details but at least                                     // 77
    // provide something better than 500 Internal server error.                                                      // 78
    this.sanitizedError = new Meteor.Error(400, "Match failed");                                                     // 79
  }),                                                                                                                // 80
                                                                                                                     // 81
  // Tests to see if value matches pattern. Unlike check, it merely returns true                                     // 82
  // or false (unless an error other than Match.Error was thrown). It does not                                       // 83
  // interact with _failIfArgumentsAreNotAllChecked.                                                                 // 84
  // XXX maybe also implement a Match.match which returns more information about                                     // 85
  //     failures but without using exception handling or doing what check()                                         // 86
  //     does with _failIfArgumentsAreNotAllChecked and Meteor.Error conversion                                      // 87
                                                                                                                     // 88
  /**                                                                                                                // 89
   * @summary Returns true if the value matches the pattern.                                                         // 90
   * @locus Anywhere                                                                                                 // 91
   * @param {Any} value The value to check                                                                           // 92
   * @param {MatchPattern} pattern The pattern to match `value` against                                              // 93
   */                                                                                                                // 94
  test: function (value, pattern) {                                                                                  // 95
    return !testSubtree(value, pattern);                                                                             // 96
  },                                                                                                                 // 97
                                                                                                                     // 98
  // Runs `f.apply(context, args)`. If check() is not called on every element of                                     // 99
  // `args` (either directly or in the first level of an array), throws an error                                     // 100
  // (using `description` in the message).                                                                           // 101
  //                                                                                                                 // 102
  _failIfArgumentsAreNotAllChecked: function (f, context, args, description) {                                       // 103
    var argChecker = new ArgumentChecker(args, description);                                                         // 104
    var result = currentArgumentChecker.withValue(argChecker, function () {                                          // 105
      return f.apply(context, args);                                                                                 // 106
    });                                                                                                              // 107
    // If f didn't itself throw, make sure it checked all of its arguments.                                          // 108
    argChecker.throwUnlessAllArgumentsHaveBeenChecked();                                                             // 109
    return result;                                                                                                   // 110
  }                                                                                                                  // 111
};                                                                                                                   // 112
                                                                                                                     // 113
var Optional = function (pattern) {                                                                                  // 114
  this.pattern = pattern;                                                                                            // 115
};                                                                                                                   // 116
                                                                                                                     // 117
var Maybe = Optional;                                                                                                // 118
                                                                                                                     // 119
var OneOf = function (choices) {                                                                                     // 120
  if (_.isEmpty(choices))                                                                                            // 121
    throw new Error("Must provide at least one choice to Match.OneOf");                                              // 122
  this.choices = choices;                                                                                            // 123
};                                                                                                                   // 124
                                                                                                                     // 125
var Where = function (condition) {                                                                                   // 126
  this.condition = condition;                                                                                        // 127
};                                                                                                                   // 128
                                                                                                                     // 129
var ObjectIncluding = function (pattern) {                                                                           // 130
  this.pattern = pattern;                                                                                            // 131
};                                                                                                                   // 132
                                                                                                                     // 133
var ObjectWithValues = function (pattern) {                                                                          // 134
  this.pattern = pattern;                                                                                            // 135
};                                                                                                                   // 136
                                                                                                                     // 137
var typeofChecks = [                                                                                                 // 138
  [String, "string"],                                                                                                // 139
  [Number, "number"],                                                                                                // 140
  [Boolean, "boolean"],                                                                                              // 141
  // While we don't allow undefined in EJSON, this is good for optional                                              // 142
  // arguments with OneOf.                                                                                           // 143
  [undefined, "undefined"]                                                                                           // 144
];                                                                                                                   // 145
                                                                                                                     // 146
// Return `false` if it matches. Otherwise, return an object with a `message` and a `path` field.                    // 147
var testSubtree = function (value, pattern) {                                                                        // 148
  // Match anything!                                                                                                 // 149
  if (pattern === Match.Any)                                                                                         // 150
    return false;                                                                                                    // 151
                                                                                                                     // 152
  // Basic atomic types.                                                                                             // 153
  // Do not match boxed objects (e.g. String, Boolean)                                                               // 154
  for (var i = 0; i < typeofChecks.length; ++i) {                                                                    // 155
    if (pattern === typeofChecks[i][0]) {                                                                            // 156
      if (typeof value === typeofChecks[i][1])                                                                       // 157
        return false;                                                                                                // 158
      return {                                                                                                       // 159
        message: "Expected " + typeofChecks[i][1] + ", got " + (value === null ? "null" : typeof value),             // 160
        path: ""                                                                                                     // 161
      };                                                                                                             // 162
    }                                                                                                                // 163
  }                                                                                                                  // 164
  if (pattern === null) {                                                                                            // 165
    if (value === null)                                                                                              // 166
      return false;                                                                                                  // 167
    return {                                                                                                         // 168
      message: "Expected null, got " + EJSON.stringify(value),                                                       // 169
      path: ""                                                                                                       // 170
    };                                                                                                               // 171
  }                                                                                                                  // 172
                                                                                                                     // 173
  // Strings, numbers, and booleans match literally. Goes well with Match.OneOf.                                     // 174
  if (typeof pattern === "string" || typeof pattern === "number" || typeof pattern === "boolean") {                  // 175
    if (value === pattern)                                                                                           // 176
      return false;                                                                                                  // 177
    return {                                                                                                         // 178
      message: "Expected " + pattern + ", got " + EJSON.stringify(value),                                            // 179
      path: ""                                                                                                       // 180
    };                                                                                                               // 181
  }                                                                                                                  // 182
                                                                                                                     // 183
  // Match.Integer is special type encoded with array                                                                // 184
  if (pattern === Match.Integer) {                                                                                   // 185
    // There is no consistent and reliable way to check if variable is a 64-bit                                      // 186
    // integer. One of the popular solutions is to get reminder of division by 1                                     // 187
    // but this method fails on really large floats with big precision.                                              // 188
    // E.g.: 1.348192308491824e+23 % 1 === 0 in V8                                                                   // 189
    // Bitwise operators work consistantly but always cast variable to 32-bit                                        // 190
    // signed integer according to JavaScript specs.                                                                 // 191
    if (typeof value === "number" && (value | 0) === value)                                                          // 192
      return false;                                                                                                  // 193
    return {                                                                                                         // 194
      message: "Expected Integer, got " + (value instanceof Object ? EJSON.stringify(value) : value),                // 195
      path: ""                                                                                                       // 196
    };                                                                                                               // 197
  }                                                                                                                  // 198
                                                                                                                     // 199
  // "Object" is shorthand for Match.ObjectIncluding({});                                                            // 200
  if (pattern === Object)                                                                                            // 201
    pattern = Match.ObjectIncluding({});                                                                             // 202
                                                                                                                     // 203
  // Array (checked AFTER Any, which is implemented as an Array).                                                    // 204
  if (pattern instanceof Array) {                                                                                    // 205
    if (pattern.length !== 1) {                                                                                      // 206
      return {                                                                                                       // 207
        message: "Bad pattern: arrays must have one type element" + EJSON.stringify(pattern),                        // 208
        path: ""                                                                                                     // 209
      };                                                                                                             // 210
    }                                                                                                                // 211
    if (!_.isArray(value) && !_.isArguments(value)) {                                                                // 212
      return {                                                                                                       // 213
        message: "Expected array, got " + EJSON.stringify(value),                                                    // 214
        path: ""                                                                                                     // 215
      };                                                                                                             // 216
    }                                                                                                                // 217
                                                                                                                     // 218
    for (var i = 0, length = value.length; i < length; i++) {                                                        // 219
      var result = testSubtree(value[i], pattern[0]);                                                                // 220
      if (result) {                                                                                                  // 221
        result.path = _prependPath(i, result.path);                                                                  // 222
        return result;                                                                                               // 223
      }                                                                                                              // 224
    }                                                                                                                // 225
    return false;                                                                                                    // 226
  }                                                                                                                  // 227
                                                                                                                     // 228
  // Arbitrary validation checks. The condition can return false or throw a                                          // 229
  // Match.Error (ie, it can internally use check()) to fail.                                                        // 230
  if (pattern instanceof Where) {                                                                                    // 231
    var result;                                                                                                      // 232
    try {                                                                                                            // 233
      result = pattern.condition(value);                                                                             // 234
    } catch (err) {                                                                                                  // 235
      if (!(err instanceof Match.Error))                                                                             // 236
        throw err;                                                                                                   // 237
      return {                                                                                                       // 238
        message: err.message,                                                                                        // 239
        path: err.path                                                                                               // 240
      };                                                                                                             // 241
    }                                                                                                                // 242
    if (result)                                                                                                      // 243
      return false;                                                                                                  // 244
    // XXX this error is terrible                                                                                    // 245
    return {                                                                                                         // 246
      message: "Failed Match.Where validation",                                                                      // 247
      path: ""                                                                                                       // 248
    };                                                                                                               // 249
  }                                                                                                                  // 250
                                                                                                                     // 251
                                                                                                                     // 252
  if (pattern instanceof Maybe) {                                                                                    // 253
    pattern = Match.OneOf(undefined, null, pattern.pattern);                                                         // 254
  }                                                                                                                  // 255
  else if (pattern instanceof Optional) {                                                                            // 256
    pattern = Match.OneOf(undefined, pattern.pattern);                                                               // 257
  }                                                                                                                  // 258
                                                                                                                     // 259
  if (pattern instanceof OneOf) {                                                                                    // 260
    for (var i = 0; i < pattern.choices.length; ++i) {                                                               // 261
      var result = testSubtree(value, pattern.choices[i]);                                                           // 262
      if (!result) {                                                                                                 // 263
        // No error? Yay, return.                                                                                    // 264
        return false;                                                                                                // 265
      }                                                                                                              // 266
      // Match errors just mean try another choice.                                                                  // 267
    }                                                                                                                // 268
    // XXX this error is terrible                                                                                    // 269
    return {                                                                                                         // 270
      message: "Failed Match.OneOf, Match.Maybe or Match.Optional validation",                                       // 271
      path: ""                                                                                                       // 272
    };                                                                                                               // 273
  }                                                                                                                  // 274
                                                                                                                     // 275
  // A function that isn't something we special-case is assumed to be a                                              // 276
  // constructor.                                                                                                    // 277
  if (pattern instanceof Function) {                                                                                 // 278
    if (value instanceof pattern)                                                                                    // 279
      return false;                                                                                                  // 280
    return {                                                                                                         // 281
      message: "Expected " + (pattern.name ||"particular constructor"),                                              // 282
      path: ""                                                                                                       // 283
    };                                                                                                               // 284
  }                                                                                                                  // 285
                                                                                                                     // 286
  var unknownKeysAllowed = false;                                                                                    // 287
  var unknownKeyPattern;                                                                                             // 288
  if (pattern instanceof ObjectIncluding) {                                                                          // 289
    unknownKeysAllowed = true;                                                                                       // 290
    pattern = pattern.pattern;                                                                                       // 291
  }                                                                                                                  // 292
  if (pattern instanceof ObjectWithValues) {                                                                         // 293
    unknownKeysAllowed = true;                                                                                       // 294
    unknownKeyPattern = [pattern.pattern];                                                                           // 295
    pattern = {};  // no required keys                                                                               // 296
  }                                                                                                                  // 297
                                                                                                                     // 298
  if (typeof pattern !== "object") {                                                                                 // 299
    return {                                                                                                         // 300
      message: "Bad pattern: unknown pattern type",                                                                  // 301
      path: ""                                                                                                       // 302
    };                                                                                                               // 303
  }                                                                                                                  // 304
                                                                                                                     // 305
  // An object, with required and optional keys. Note that this does NOT do                                          // 306
  // structural matches against objects of special types that happen to match                                        // 307
  // the pattern: this really needs to be a plain old {Object}!                                                      // 308
  if (typeof value !== 'object') {                                                                                   // 309
    return {                                                                                                         // 310
      message: "Expected object, got " + typeof value,                                                               // 311
      path: ""                                                                                                       // 312
    };                                                                                                               // 313
  }                                                                                                                  // 314
  if (value === null) {                                                                                              // 315
    return {                                                                                                         // 316
      message: "Expected object, got null",                                                                          // 317
      path: ""                                                                                                       // 318
    };                                                                                                               // 319
  }                                                                                                                  // 320
  if (! jQuery.isPlainObject(value)) {                                                                               // 321
    return {                                                                                                         // 322
      message: "Expected plain object",                                                                              // 323
      path: ""                                                                                                       // 324
    };                                                                                                               // 325
  }                                                                                                                  // 326
                                                                                                                     // 327
  var requiredPatterns = {};                                                                                         // 328
  var optionalPatterns = {};                                                                                         // 329
  _.each(pattern, function (subPattern, key) {                                                                       // 330
    if (subPattern instanceof Optional || subPattern instanceof Maybe)                                               // 331
      optionalPatterns[key] = subPattern.pattern;                                                                    // 332
    else                                                                                                             // 333
      requiredPatterns[key] = subPattern;                                                                            // 334
  });                                                                                                                // 335
                                                                                                                     // 336
  //XXX: replace with underscore's _.allKeys if Meteor updates underscore to 1.8+ (or lodash)                        // 337
  var allKeys = function(obj){                                                                                       // 338
    var keys = [];                                                                                                   // 339
    if (_.isObject(obj)){                                                                                            // 340
      for (var key in obj) keys.push(key);                                                                           // 341
    }                                                                                                                // 342
    return keys;                                                                                                     // 343
  }                                                                                                                  // 344
                                                                                                                     // 345
  for (var keys = allKeys(value), i = 0, length = keys.length; i < length; i++) {                                    // 346
    var key = keys[i];                                                                                               // 347
    var subValue = value[key];                                                                                       // 348
    if (_.has(requiredPatterns, key)) {                                                                              // 349
      var result = testSubtree(subValue, requiredPatterns[key]);                                                     // 350
      if (result) {                                                                                                  // 351
        result.path = _prependPath(key, result.path);                                                                // 352
        return result;                                                                                               // 353
      }                                                                                                              // 354
      delete requiredPatterns[key];                                                                                  // 355
    } else if (_.has(optionalPatterns, key)) {                                                                       // 356
      var result = testSubtree(subValue, optionalPatterns[key]);                                                     // 357
      if (result) {                                                                                                  // 358
        result.path = _prependPath(key, result.path);                                                                // 359
        return result;                                                                                               // 360
      }                                                                                                              // 361
    } else {                                                                                                         // 362
      if (!unknownKeysAllowed) {                                                                                     // 363
        return {                                                                                                     // 364
          message: "Unknown key",                                                                                    // 365
          path: key                                                                                                  // 366
        };                                                                                                           // 367
      }                                                                                                              // 368
      if (unknownKeyPattern) {                                                                                       // 369
        var result = testSubtree(subValue, unknownKeyPattern[0]);                                                    // 370
        if (result) {                                                                                                // 371
          result.path = _prependPath(key, result.path);                                                              // 372
          return result;                                                                                             // 373
        }                                                                                                            // 374
      }                                                                                                              // 375
    }                                                                                                                // 376
  }                                                                                                                  // 377
                                                                                                                     // 378
  var keys = _.keys(requiredPatterns);                                                                               // 379
  if (keys.length) {                                                                                                 // 380
    return {                                                                                                         // 381
      message: "Missing key '" + keys[0] + "'",                                                                      // 382
      path: ""                                                                                                       // 383
    };                                                                                                               // 384
  }                                                                                                                  // 385
};                                                                                                                   // 386
                                                                                                                     // 387
var ArgumentChecker = function (args, description) {                                                                 // 388
  var self = this;                                                                                                   // 389
  // Make a SHALLOW copy of the arguments. (We'll be doing identity checks                                           // 390
  // against its contents.)                                                                                          // 391
  self.args = _.clone(args);                                                                                         // 392
  // Since the common case will be to check arguments in order, and we splice                                        // 393
  // out arguments when we check them, make it so we splice out from the end                                         // 394
  // rather than the beginning.                                                                                      // 395
  self.args.reverse();                                                                                               // 396
  self.description = description;                                                                                    // 397
};                                                                                                                   // 398
                                                                                                                     // 399
_.extend(ArgumentChecker.prototype, {                                                                                // 400
  checking: function (value) {                                                                                       // 401
    var self = this;                                                                                                 // 402
    if (self._checkingOneValue(value))                                                                               // 403
      return;                                                                                                        // 404
    // Allow check(arguments, [String]) or check(arguments.slice(1), [String])                                       // 405
    // or check([foo, bar], [String]) to count... but only if value wasn't                                           // 406
    // itself an argument.                                                                                           // 407
    if (_.isArray(value) || _.isArguments(value)) {                                                                  // 408
      _.each(value, _.bind(self._checkingOneValue, self));                                                           // 409
    }                                                                                                                // 410
  },                                                                                                                 // 411
  _checkingOneValue: function (value) {                                                                              // 412
    var self = this;                                                                                                 // 413
    for (var i = 0; i < self.args.length; ++i) {                                                                     // 414
      // Is this value one of the arguments? (This can have a false positive if                                      // 415
      // the argument is an interned primitive, but it's still a good enough                                         // 416
      // check.)                                                                                                     // 417
      // (NaN is not === to itself, so we have to check specially.)                                                  // 418
      if (value === self.args[i] || (_.isNaN(value) && _.isNaN(self.args[i]))) {                                     // 419
        self.args.splice(i, 1);                                                                                      // 420
        return true;                                                                                                 // 421
      }                                                                                                              // 422
    }                                                                                                                // 423
    return false;                                                                                                    // 424
  },                                                                                                                 // 425
  throwUnlessAllArgumentsHaveBeenChecked: function () {                                                              // 426
    var self = this;                                                                                                 // 427
    if (!_.isEmpty(self.args))                                                                                       // 428
      throw new Error("Did not check() all arguments during " +                                                      // 429
                      self.description);                                                                             // 430
  }                                                                                                                  // 431
});                                                                                                                  // 432
                                                                                                                     // 433
var _jsKeywords = ["do", "if", "in", "for", "let", "new", "try", "var", "case",                                      // 434
  "else", "enum", "eval", "false", "null", "this", "true", "void", "with",                                           // 435
  "break", "catch", "class", "const", "super", "throw", "while", "yield",                                            // 436
  "delete", "export", "import", "public", "return", "static", "switch",                                              // 437
  "typeof", "default", "extends", "finally", "package", "private", "continue",                                       // 438
  "debugger", "function", "arguments", "interface", "protected", "implements",                                       // 439
  "instanceof"];                                                                                                     // 440
                                                                                                                     // 441
// Assumes the base of path is already escaped properly                                                              // 442
// returns key + base                                                                                                // 443
var _prependPath = function (key, base) {                                                                            // 444
  if ((typeof key) === "number" || key.match(/^[0-9]+$/))                                                            // 445
    key = "[" + key + "]";                                                                                           // 446
  else if (!key.match(/^[a-z_$][0-9a-z_$]*$/i) || _.contains(_jsKeywords, key))                                      // 447
    key = JSON.stringify([key]);                                                                                     // 448
                                                                                                                     // 449
  if (base && base[0] !== "[")                                                                                       // 450
    return key + '.' + base;                                                                                         // 451
  return key + base;                                                                                                 // 452
};                                                                                                                   // 453
                                                                                                                     // 454
                                                                                                                     // 455
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package.check = {}, {
  check: check,
  Match: Match
});

})();
