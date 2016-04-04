(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var NpmModuleBcrypt = Package['npm-bcrypt'].NpmModuleBcrypt;
var Accounts = Package['accounts-base'].Accounts;
var SRP = Package.srp.SRP;
var SHA256 = Package.sha.SHA256;
var EJSON = Package.ejson.EJSON;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var Email = Package.email.Email;
var EmailInternals = Package.email.EmailInternals;
var Random = Package.random.Random;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"accounts-password":{"email_templates.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-password/email_templates.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
function greet(welcomeMsg) {                                                                                           // 1
  return function (user, url) {                                                                                        // 2
    var greeting = user.profile && user.profile.name ? "Hello " + user.profile.name + "," : "Hello,";                  // 3
    return greeting + "\n\n" + welcomeMsg + ", simply click the link below.\n\n" + url + "\n\nThanks.\n";              // 5
  };                                                                                                                   //
}                                                                                                                      //
                                                                                                                       //
/**                                                                                                                    //
 * @summary Options to customize emails sent from the Accounts system.                                                 //
 * @locus Server                                                                                                       //
 * @importFromPackage accounts-base                                                                                    //
 */                                                                                                                    //
Accounts.emailTemplates = {                                                                                            // 21
  from: "Meteor Accounts <no-reply@meteor.com>",                                                                       // 22
  siteName: Meteor.absoluteUrl().replace(/^https?:\/\//, '').replace(/\/$/, ''),                                       // 23
                                                                                                                       //
  resetPassword: {                                                                                                     // 25
    subject: function () {                                                                                             // 26
      function subject(user) {                                                                                         // 26
        return "How to reset your password on " + Accounts.emailTemplates.siteName;                                    // 27
      }                                                                                                                //
                                                                                                                       //
      return subject;                                                                                                  //
    }(),                                                                                                               //
    text: function () {                                                                                                // 29
      function text(user, url) {                                                                                       // 29
        var greeting = user.profile && user.profile.name ? "Hello " + user.profile.name + "," : "Hello,";              // 30
        return greeting + "\n\nTo reset your password, simply click the link below.\n\n" + url + "\n\nThanks.\n";      // 32
      }                                                                                                                //
                                                                                                                       //
      return text;                                                                                                     //
    }()                                                                                                                //
  },                                                                                                                   //
  verifyEmail: {                                                                                                       // 42
    subject: function () {                                                                                             // 43
      function subject(user) {                                                                                         // 43
        return "How to verify email address on " + Accounts.emailTemplates.siteName;                                   // 44
      }                                                                                                                //
                                                                                                                       //
      return subject;                                                                                                  //
    }(),                                                                                                               //
    text: greet("To verify your account email")                                                                        // 46
  },                                                                                                                   //
  enrollAccount: {                                                                                                     // 48
    subject: function () {                                                                                             // 49
      function subject(user) {                                                                                         // 49
        return "An account has been created for you on " + Accounts.emailTemplates.siteName;                           // 50
      }                                                                                                                //
                                                                                                                       //
      return subject;                                                                                                  //
    }(),                                                                                                               //
    text: greet("To start using the service")                                                                          // 52
  }                                                                                                                    //
};                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"password_server.js":["babel-runtime/helpers/typeof",function(require){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-password/password_server.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _typeof2 = require("babel-runtime/helpers/typeof");                                                                //
                                                                                                                       //
var _typeof3 = _interopRequireDefault(_typeof2);                                                                       //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
/// BCRYPT                                                                                                             //
                                                                                                                       //
var bcrypt = NpmModuleBcrypt;                                                                                          // 3
var bcryptHash = Meteor.wrapAsync(bcrypt.hash);                                                                        // 4
var bcryptCompare = Meteor.wrapAsync(bcrypt.compare);                                                                  // 5
                                                                                                                       //
// User records have a 'services.password.bcrypt' field on them to hold                                                //
// their hashed passwords (unless they have a 'services.password.srp'                                                  //
// field, in which case they will be upgraded to bcrypt the next time                                                  //
// they log in).                                                                                                       //
//                                                                                                                     //
// When the client sends a password to the server, it can either be a                                                  //
// string (the plaintext password) or an object with keys 'digest' and                                                 //
// 'algorithm' (must be "sha-256" for now). The Meteor client always sends                                             //
// password objects { digest: *, algorithm: "sha-256" }, but DDP clients                                               //
// that don't have access to SHA can just send plaintext passwords as                                                  //
// strings.                                                                                                            //
//                                                                                                                     //
// When the server receives a plaintext password as a string, it always                                                //
// hashes it with SHA256 before passing it into bcrypt. When the server                                                //
// receives a password as an object, it asserts that the algorithm is                                                  //
// "sha-256" and then passes the digest to bcrypt.                                                                     //
                                                                                                                       //
Accounts._bcryptRounds = 10;                                                                                           // 25
                                                                                                                       //
// Given a 'password' from the client, extract the string that we should                                               //
// bcrypt. 'password' can be one of:                                                                                   //
//  - String (the plaintext password)                                                                                  //
//  - Object with 'digest' and 'algorithm' keys. 'algorithm' must be "sha-256".                                        //
//                                                                                                                     //
var getPasswordString = function getPasswordString(password) {                                                         // 32
  if (typeof password === "string") {                                                                                  // 33
    password = SHA256(password);                                                                                       // 34
  } else {                                                                                                             //
    // 'password' is an object                                                                                         //
    if (password.algorithm !== "sha-256") {                                                                            // 36
      throw new Error("Invalid password hash algorithm. " + "Only 'sha-256' is allowed.");                             // 37
    }                                                                                                                  //
    password = password.digest;                                                                                        // 40
  }                                                                                                                    //
  return password;                                                                                                     // 42
};                                                                                                                     //
                                                                                                                       //
// Use bcrypt to hash the password for storage in the database.                                                        //
// `password` can be a string (in which case it will be run through                                                    //
// SHA256 before bcrypt) or an object with properties `digest` and                                                     //
// `algorithm` (in which case we bcrypt `password.digest`).                                                            //
//                                                                                                                     //
var hashPassword = function hashPassword(password) {                                                                   // 50
  password = getPasswordString(password);                                                                              // 51
  return bcryptHash(password, Accounts._bcryptRounds);                                                                 // 52
};                                                                                                                     //
                                                                                                                       //
// Check whether the provided password matches the bcrypt'ed password in                                               //
// the database user record. `password` can be a string (in which case                                                 //
// it will be run through SHA256 before bcrypt) or an object with                                                      //
// properties `digest` and `algorithm` (in which case we bcrypt                                                        //
// `password.digest`).                                                                                                 //
//                                                                                                                     //
Accounts._checkPassword = function (user, password) {                                                                  // 61
  var result = {                                                                                                       // 62
    userId: user._id                                                                                                   // 63
  };                                                                                                                   //
                                                                                                                       //
  password = getPasswordString(password);                                                                              // 66
                                                                                                                       //
  if (!bcryptCompare(password, user.services.password.bcrypt)) {                                                       // 68
    result.error = new Meteor.Error(403, "Incorrect password");                                                        // 69
  }                                                                                                                    //
                                                                                                                       //
  return result;                                                                                                       // 72
};                                                                                                                     //
var checkPassword = Accounts._checkPassword;                                                                           // 74
                                                                                                                       //
///                                                                                                                    //
/// LOGIN                                                                                                              //
///                                                                                                                    //
                                                                                                                       //
Accounts._findUserByQuery = function (query) {                                                                         // 80
  var user = null;                                                                                                     // 81
                                                                                                                       //
  if (query.id) {                                                                                                      // 83
    user = Meteor.users.findOne({ _id: query.id });                                                                    // 84
  } else {                                                                                                             //
    var fieldName;                                                                                                     // 86
    var fieldValue;                                                                                                    // 87
    if (query.username) {                                                                                              // 88
      fieldName = 'username';                                                                                          // 89
      fieldValue = query.username;                                                                                     // 90
    } else if (query.email) {                                                                                          //
      fieldName = 'emails.address';                                                                                    // 92
      fieldValue = query.email;                                                                                        // 93
    } else {                                                                                                           //
      throw new Error("shouldn't happen (validation missed something)");                                               // 95
    }                                                                                                                  //
    var selector = {};                                                                                                 // 97
    selector[fieldName] = fieldValue;                                                                                  // 98
    user = Meteor.users.findOne(selector);                                                                             // 99
    // If user is not found, try a case insensitive lookup                                                             //
    if (!user) {                                                                                                       // 85
      selector = selectorForFastCaseInsensitiveLookup(fieldName, fieldValue);                                          // 102
      var candidateUsers = Meteor.users.find(selector).fetch();                                                        // 103
      // No match if multiple candidates are found                                                                     //
      if (candidateUsers.length === 1) {                                                                               // 101
        user = candidateUsers[0];                                                                                      // 106
      }                                                                                                                //
    }                                                                                                                  //
  }                                                                                                                    //
                                                                                                                       //
  return user;                                                                                                         // 111
};                                                                                                                     //
                                                                                                                       //
/**                                                                                                                    //
 * @summary Finds the user with the specified username.                                                                //
 * First tries to match username case sensitively; if that fails, it                                                   //
 * tries case insensitively; but if more than one user matches the case                                                //
 * insensitive search, it returns null.                                                                                //
 * @locus Server                                                                                                       //
 * @param {String} username The username to look for                                                                   //
 * @returns {Object} A user if found, else null                                                                        //
 * @importFromPackage accounts-base                                                                                    //
 */                                                                                                                    //
Accounts.findUserByUsername = function (username) {                                                                    // 124
  return Accounts._findUserByQuery({                                                                                   // 125
    username: username                                                                                                 // 126
  });                                                                                                                  //
};                                                                                                                     //
                                                                                                                       //
/**                                                                                                                    //
 * @summary Finds the user with the specified email.                                                                   //
 * First tries to match email case sensitively; if that fails, it                                                      //
 * tries case insensitively; but if more than one user matches the case                                                //
 * insensitive search, it returns null.                                                                                //
 * @locus Server                                                                                                       //
 * @param {String} email The email address to look for                                                                 //
 * @returns {Object} A user if found, else null                                                                        //
 * @importFromPackage accounts-base                                                                                    //
 */                                                                                                                    //
Accounts.findUserByEmail = function (email) {                                                                          // 140
  return Accounts._findUserByQuery({                                                                                   // 141
    email: email                                                                                                       // 142
  });                                                                                                                  //
};                                                                                                                     //
                                                                                                                       //
// Generates a MongoDB selector that can be used to perform a fast case                                                //
// insensitive lookup for the given fieldName and string. Since MongoDB does                                           //
// not support case insensitive indexes, and case insensitive regex queries                                            //
// are slow, we construct a set of prefix selectors for all permutations of                                            //
// the first 4 characters ourselves. We first attempt to matching against                                              //
// these, and because 'prefix expression' regex queries do use indexes (see                                            //
// http://docs.mongodb.org/v2.6/reference/operator/query/regex/#index-use),                                            //
// this has been found to greatly improve performance (from 1200ms to 5ms in a                                         //
// test with 1.000.000 users).                                                                                         //
var selectorForFastCaseInsensitiveLookup = function selectorForFastCaseInsensitiveLookup(fieldName, string) {          // 155
  // Performance seems to improve up to 4 prefix characters                                                            //
  var prefix = string.substring(0, Math.min(string.length, 4));                                                        // 157
  var orClause = _.map(generateCasePermutationsForString(prefix), function (prefixPermutation) {                       // 158
    var selector = {};                                                                                                 // 160
    selector[fieldName] = new RegExp('^' + Meteor._escapeRegExp(prefixPermutation));                                   // 161
    return selector;                                                                                                   // 163
  });                                                                                                                  //
  var caseInsensitiveClause = {};                                                                                      // 165
  caseInsensitiveClause[fieldName] = new RegExp('^' + Meteor._escapeRegExp(string) + '$', 'i');                        // 166
  return { $and: [{ $or: orClause }, caseInsensitiveClause] };                                                         // 168
};                                                                                                                     //
                                                                                                                       //
// Generates permutations of all case variations of a given string.                                                    //
var generateCasePermutationsForString = function generateCasePermutationsForString(string) {                           // 172
  var permutations = [''];                                                                                             // 173
  for (var i = 0; i < string.length; i++) {                                                                            // 174
    var ch = string.charAt(i);                                                                                         // 175
    permutations = _.flatten(_.map(permutations, function (prefix) {                                                   // 176
      var lowerCaseChar = ch.toLowerCase();                                                                            // 177
      var upperCaseChar = ch.toUpperCase();                                                                            // 178
      // Don't add unneccesary permutations when ch is not a letter                                                    //
      if (lowerCaseChar === upperCaseChar) {                                                                           // 176
        return [prefix + ch];                                                                                          // 181
      } else {                                                                                                         //
        return [prefix + lowerCaseChar, prefix + upperCaseChar];                                                       // 183
      }                                                                                                                //
    }));                                                                                                               //
  }                                                                                                                    //
  return permutations;                                                                                                 // 187
};                                                                                                                     //
                                                                                                                       //
var checkForCaseInsensitiveDuplicates = function checkForCaseInsensitiveDuplicates(fieldName, displayName, fieldValue, ownUserId) {
  // Some tests need the ability to add users with the same case insensitive                                           //
  // value, hence the _skipCaseInsensitiveChecksForTest check                                                          //
  var skipCheck = _.has(Accounts._skipCaseInsensitiveChecksForTest, fieldValue);                                       // 193
                                                                                                                       //
  if (fieldValue && !skipCheck) {                                                                                      // 195
    var matchedUsers = Meteor.users.find(selectorForFastCaseInsensitiveLookup(fieldName, fieldValue)).fetch();         // 196
                                                                                                                       //
    if (matchedUsers.length > 0 && (                                                                                   // 199
    // If we don't have a userId yet, any match we find is a duplicate                                                 //
    !ownUserId ||                                                                                                      // 201
    // Otherwise, check to see if there are multiple matches or a match                                                //
    // that is not us                                                                                                  //
    matchedUsers.length > 1 || matchedUsers[0]._id !== ownUserId)) {                                                   // 204
      throw new Meteor.Error(403, displayName + " already exists.");                                                   // 205
    }                                                                                                                  //
  }                                                                                                                    //
};                                                                                                                     //
                                                                                                                       //
// XXX maybe this belongs in the check package                                                                         //
var NonEmptyString = Match.Where(function (x) {                                                                        // 211
  check(x, String);                                                                                                    // 212
  return x.length > 0;                                                                                                 // 213
});                                                                                                                    //
                                                                                                                       //
var userQueryValidator = Match.Where(function (user) {                                                                 // 216
  check(user, {                                                                                                        // 217
    id: Match.Optional(NonEmptyString),                                                                                // 218
    username: Match.Optional(NonEmptyString),                                                                          // 219
    email: Match.Optional(NonEmptyString)                                                                              // 220
  });                                                                                                                  //
  if (_.keys(user).length !== 1) throw new Match.Error("User property must have exactly one field");                   // 222
  return true;                                                                                                         // 224
});                                                                                                                    //
                                                                                                                       //
var passwordValidator = Match.OneOf(String, { digest: String, algorithm: String });                                    // 227
                                                                                                                       //
// Handler to login with a password.                                                                                   //
//                                                                                                                     //
// The Meteor client sets options.password to an object with keys                                                      //
// 'digest' (set to SHA256(password)) and 'algorithm' ("sha-256").                                                     //
//                                                                                                                     //
// For other DDP clients which don't have access to SHA, the handler                                                   //
// also accepts the plaintext password in options.password as a string.                                                //
//                                                                                                                     //
// (It might be nice if servers could turn the plaintext password                                                      //
// option off. Or maybe it should be opt-in, not opt-out?                                                              //
// Accounts.config option?)                                                                                            //
//                                                                                                                     //
// Note that neither password option is secure without SSL.                                                            //
//                                                                                                                     //
Accounts.registerLoginHandler("password", function (options) {                                                         // 246
  if (!options.password || options.srp) return undefined; // don't handle                                              // 247
                                                                                                                       //
  check(options, {                                                                                                     // 246
    user: userQueryValidator,                                                                                          // 251
    password: passwordValidator                                                                                        // 252
  });                                                                                                                  //
                                                                                                                       //
  var user = Accounts._findUserByQuery(options.user);                                                                  // 256
  if (!user) throw new Meteor.Error(403, "User not found");                                                            // 257
                                                                                                                       //
  if (!user.services || !user.services.password || !(user.services.password.bcrypt || user.services.password.srp)) throw new Meteor.Error(403, "User has no password set");
                                                                                                                       //
  if (!user.services.password.bcrypt) {                                                                                // 264
    if (typeof options.password === "string") {                                                                        // 265
      // The client has presented a plaintext password, and the user is                                                //
      // not upgraded to bcrypt yet. We don't attempt to tell the client                                               //
      // to upgrade to bcrypt, because it might be a standalone DDP                                                    //
      // client doesn't know how to do such a thing.                                                                   //
      var verifier = user.services.password.srp;                                                                       // 270
      var newVerifier = SRP.generateVerifier(options.password, {                                                       // 271
        identity: verifier.identity, salt: verifier.salt });                                                           // 272
                                                                                                                       //
      if (verifier.verifier !== newVerifier.verifier) {                                                                // 274
        return {                                                                                                       // 275
          userId: user._id,                                                                                            // 276
          error: new Meteor.Error(403, "Incorrect password")                                                           // 277
        };                                                                                                             //
      }                                                                                                                //
                                                                                                                       //
      return { userId: user._id };                                                                                     // 281
    } else {                                                                                                           //
      // Tell the client to use the SRP upgrade process.                                                               //
      throw new Meteor.Error(400, "old password format", EJSON.stringify({                                             // 284
        format: 'srp',                                                                                                 // 285
        identity: user.services.password.srp.identity                                                                  // 286
      }));                                                                                                             //
    }                                                                                                                  //
  }                                                                                                                    //
                                                                                                                       //
  return checkPassword(user, options.password);                                                                        // 291
});                                                                                                                    //
                                                                                                                       //
// Handler to login using the SRP upgrade path. To use this login                                                      //
// handler, the client must provide:                                                                                   //
//   - srp: H(identity + ":" + password)                                                                               //
//   - password: a string or an object with properties 'digest' and 'algorithm'                                        //
//                                                                                                                     //
// We use `options.srp` to verify that the client knows the correct                                                    //
// password without doing a full SRP flow. Once we've checked that, we                                                 //
// upgrade the user to bcrypt and remove the SRP information from the                                                  //
// user document.                                                                                                      //
//                                                                                                                     //
// The client ends up using this login handler after trying the normal                                                 //
// login handler (above), which throws an error telling the client to                                                  //
// try the SRP upgrade path.                                                                                           //
//                                                                                                                     //
// XXX COMPAT WITH 0.8.1.3                                                                                             //
Accounts.registerLoginHandler("password", function (options) {                                                         // 312
  if (!options.srp || !options.password) return undefined; // don't handle                                             // 313
                                                                                                                       //
  check(options, {                                                                                                     // 312
    user: userQueryValidator,                                                                                          // 317
    srp: String,                                                                                                       // 318
    password: passwordValidator                                                                                        // 319
  });                                                                                                                  //
                                                                                                                       //
  var user = Accounts._findUserByQuery(options.user);                                                                  // 322
  if (!user) throw new Meteor.Error(403, "User not found");                                                            // 323
                                                                                                                       //
  // Check to see if another simultaneous login has already upgraded                                                   //
  // the user record to bcrypt.                                                                                        //
  if (user.services && user.services.password && user.services.password.bcrypt) return checkPassword(user, options.password);
                                                                                                                       //
  if (!(user.services && user.services.password && user.services.password.srp)) throw new Meteor.Error(403, "User has no password set");
                                                                                                                       //
  var v1 = user.services.password.srp.verifier;                                                                        // 334
  var v2 = SRP.generateVerifier(null, {                                                                                // 335
    hashedIdentityAndPassword: options.srp,                                                                            // 338
    salt: user.services.password.srp.salt                                                                              // 339
  }).verifier;                                                                                                         //
  if (v1 !== v2) return {                                                                                              // 342
    userId: user._id,                                                                                                  // 344
    error: new Meteor.Error(403, "Incorrect password")                                                                 // 345
  };                                                                                                                   //
                                                                                                                       //
  // Upgrade to bcrypt on successful login.                                                                            //
  var salted = hashPassword(options.password);                                                                         // 312
  Meteor.users.update(user._id, {                                                                                      // 350
    $unset: { 'services.password.srp': 1 },                                                                            // 353
    $set: { 'services.password.bcrypt': salted }                                                                       // 354
  });                                                                                                                  //
                                                                                                                       //
  return { userId: user._id };                                                                                         // 358
});                                                                                                                    //
                                                                                                                       //
///                                                                                                                    //
/// CHANGING                                                                                                           //
///                                                                                                                    //
                                                                                                                       //
/**                                                                                                                    //
 * @summary Change a user's username. Use this instead of updating the                                                 //
 * database directly. The operation will fail if there is an existing user                                             //
 * with a username only differing in case.                                                                             //
 * @locus Server                                                                                                       //
 * @param {String} userId The ID of the user to update.                                                                //
 * @param {String} newUsername A new username for the user.                                                            //
 * @importFromPackage accounts-base                                                                                    //
 */                                                                                                                    //
Accounts.setUsername = function (userId, newUsername) {                                                                // 375
  check(userId, NonEmptyString);                                                                                       // 376
  check(newUsername, NonEmptyString);                                                                                  // 377
                                                                                                                       //
  var user = Meteor.users.findOne(userId);                                                                             // 379
  if (!user) throw new Meteor.Error(403, "User not found");                                                            // 380
                                                                                                                       //
  var oldUsername = user.username;                                                                                     // 383
                                                                                                                       //
  // Perform a case insensitive check fro duplicates before update                                                     //
  checkForCaseInsensitiveDuplicates('username', 'Username', newUsername, user._id);                                    // 375
                                                                                                                       //
  Meteor.users.update({ _id: user._id }, { $set: { username: newUsername } });                                         // 388
                                                                                                                       //
  // Perform another check after update, in case a matching user has been                                              //
  // inserted in the meantime                                                                                          //
  try {                                                                                                                // 375
    checkForCaseInsensitiveDuplicates('username', 'Username', newUsername, user._id);                                  // 393
  } catch (ex) {                                                                                                       //
    // Undo update if the check fails                                                                                  //
    Meteor.users.update({ _id: user._id }, { $set: { username: oldUsername } });                                       // 396
    throw ex;                                                                                                          // 397
  }                                                                                                                    //
};                                                                                                                     //
                                                                                                                       //
// Let the user change their own password if they know the old                                                         //
// password. `oldPassword` and `newPassword` should be objects with keys                                               //
// `digest` and `algorithm` (representing the SHA256 of the password).                                                 //
//                                                                                                                     //
// XXX COMPAT WITH 0.8.1.3                                                                                             //
// Like the login method, if the user hasn't been upgraded from SRP to                                                 //
// bcrypt yet, then this method will throw an 'old password format'                                                    //
// error. The client should call the SRP upgrade login handler and then                                                //
// retry this method again.                                                                                            //
//                                                                                                                     //
// UNLIKE the login method, there is no way to avoid getting SRP upgrade                                               //
// errors thrown. The reasoning for this is that clients using this                                                    //
// method directly will need to be updated anyway because we no longer                                                 //
// support the SRP flow that they would have been doing to use this                                                    //
// method previously.                                                                                                  //
Meteor.methods({ changePassword: function () {                                                                         // 416
    function changePassword(oldPassword, newPassword) {                                                                // 416
      check(oldPassword, passwordValidator);                                                                           // 417
      check(newPassword, passwordValidator);                                                                           // 418
                                                                                                                       //
      if (!this.userId) throw new Meteor.Error(401, "Must be logged in");                                              // 420
                                                                                                                       //
      var user = Meteor.users.findOne(this.userId);                                                                    // 423
      if (!user) throw new Meteor.Error(403, "User not found");                                                        // 424
                                                                                                                       //
      if (!user.services || !user.services.password || !user.services.password.bcrypt && !user.services.password.srp) throw new Meteor.Error(403, "User has no password set");
                                                                                                                       //
      if (!user.services.password.bcrypt) {                                                                            // 431
        throw new Meteor.Error(400, "old password format", EJSON.stringify({                                           // 432
          format: 'srp',                                                                                               // 433
          identity: user.services.password.srp.identity                                                                // 434
        }));                                                                                                           //
      }                                                                                                                //
                                                                                                                       //
      var result = checkPassword(user, oldPassword);                                                                   // 438
      if (result.error) throw result.error;                                                                            // 439
                                                                                                                       //
      var hashed = hashPassword(newPassword);                                                                          // 442
                                                                                                                       //
      // It would be better if this removed ALL existing tokens and replaced                                           //
      // the token for the current connection with a new one, but that would                                           //
      // be tricky, so we'll settle for just replacing all tokens other than                                           //
      // the one for the current connection.                                                                           //
      var currentToken = Accounts._getLoginToken(this.connection.id);                                                  // 416
      Meteor.users.update({ _id: this.userId }, {                                                                      // 449
        $set: { 'services.password.bcrypt': hashed },                                                                  // 452
        $pull: {                                                                                                       // 453
          'services.resume.loginTokens': { hashedToken: { $ne: currentToken } }                                        // 454
        },                                                                                                             //
        $unset: { 'services.password.reset': 1 }                                                                       // 456
      });                                                                                                              //
                                                                                                                       //
      return { passwordChanged: true };                                                                                // 460
    }                                                                                                                  //
                                                                                                                       //
    return changePassword;                                                                                             //
  }() });                                                                                                              //
                                                                                                                       //
// Force change the users password.                                                                                    //
                                                                                                                       //
/**                                                                                                                    //
 * @summary Forcibly change the password for a user.                                                                   //
 * @locus Server                                                                                                       //
 * @param {String} userId The id of the user to update.                                                                //
 * @param {String} newPassword A new password for the user.                                                            //
 * @param {Object} [options]                                                                                           //
 * @param {Object} options.logout Logout all current connections with this userId (default: true)                      //
 * @importFromPackage accounts-base                                                                                    //
 */                                                                                                                    //
Accounts.setPassword = function (userId, newPlaintextPassword, options) {                                              // 475
  options = _.extend({ logout: true }, options);                                                                       // 476
                                                                                                                       //
  var user = Meteor.users.findOne(userId);                                                                             // 478
  if (!user) throw new Meteor.Error(403, "User not found");                                                            // 479
                                                                                                                       //
  var update = {                                                                                                       // 482
    $unset: {                                                                                                          // 483
      'services.password.srp': 1, // XXX COMPAT WITH 0.8.1.3                                                           // 484
      'services.password.reset': 1                                                                                     // 485
    },                                                                                                                 //
    $set: { 'services.password.bcrypt': hashPassword(newPlaintextPassword) }                                           // 487
  };                                                                                                                   //
                                                                                                                       //
  if (options.logout) {                                                                                                // 490
    update.$unset['services.resume.loginTokens'] = 1;                                                                  // 491
  }                                                                                                                    //
                                                                                                                       //
  Meteor.users.update({ _id: user._id }, update);                                                                      // 494
};                                                                                                                     //
                                                                                                                       //
///                                                                                                                    //
/// RESETTING VIA EMAIL                                                                                                //
///                                                                                                                    //
                                                                                                                       //
// Method called by a user to request a password reset email. This is                                                  //
// the start of the reset process.                                                                                     //
Meteor.methods({ forgotPassword: function () {                                                                         // 504
    function forgotPassword(options) {                                                                                 // 504
      check(options, { email: String });                                                                               // 505
                                                                                                                       //
      var user = Accounts.findUserByEmail(options.email);                                                              // 507
      if (!user) throw new Meteor.Error(403, "User not found");                                                        // 508
                                                                                                                       //
      var emails = _.pluck(user.emails || [], 'address');                                                              // 511
      var caseSensitiveEmail = _.find(emails, function (email) {                                                       // 512
        return email.toLowerCase() === options.email.toLowerCase();                                                    // 513
      });                                                                                                              //
                                                                                                                       //
      Accounts.sendResetPasswordEmail(user._id, caseSensitiveEmail);                                                   // 516
    }                                                                                                                  //
                                                                                                                       //
    return forgotPassword;                                                                                             //
  }() });                                                                                                              //
                                                                                                                       //
// send the user an email with a link that when opened allows the user                                                 //
// to set a new password, without the old password.                                                                    //
                                                                                                                       //
/**                                                                                                                    //
 * @summary Send an email with a link the user can use to reset their password.                                        //
 * @locus Server                                                                                                       //
 * @param {String} userId The id of the user to send email to.                                                         //
 * @param {String} [email] Optional. Which address of the user's to send the email to. This address must be in the user's `emails` list. Defaults to the first email in the list.
 * @importFromPackage accounts-base                                                                                    //
 */                                                                                                                    //
Accounts.sendResetPasswordEmail = function (userId, email) {                                                           // 529
  // Make sure the user exists, and email is one of their addresses.                                                   //
  var user = Meteor.users.findOne(userId);                                                                             // 531
  if (!user) throw new Error("Can't find user");                                                                       // 532
  // pick the first email if we weren't passed an email.                                                               //
  if (!email && user.emails && user.emails[0]) email = user.emails[0].address;                                         // 529
  // make sure we have a valid email                                                                                   //
  if (!email || !_.contains(_.pluck(user.emails || [], 'address'), email)) throw new Error("No such email for user.");
                                                                                                                       //
  var token = Random.secret();                                                                                         // 541
  var when = new Date();                                                                                               // 542
  var tokenRecord = {                                                                                                  // 543
    token: token,                                                                                                      // 544
    email: email,                                                                                                      // 545
    when: when                                                                                                         // 546
  };                                                                                                                   //
  Meteor.users.update(userId, { $set: {                                                                                // 548
      "services.password.reset": tokenRecord                                                                           // 549
    } });                                                                                                              //
  // before passing to template, update user object with new token                                                     //
  Meteor._ensure(user, 'services', 'password').reset = tokenRecord;                                                    // 529
                                                                                                                       //
  var resetPasswordUrl = Accounts.urls.resetPassword(token);                                                           // 554
                                                                                                                       //
  var options = {                                                                                                      // 556
    to: email,                                                                                                         // 557
    from: Accounts.emailTemplates.resetPassword.from ? Accounts.emailTemplates.resetPassword.from(user) : Accounts.emailTemplates.from,
    subject: Accounts.emailTemplates.resetPassword.subject(user)                                                       // 561
  };                                                                                                                   //
                                                                                                                       //
  if (typeof Accounts.emailTemplates.resetPassword.text === 'function') {                                              // 564
    options.text = Accounts.emailTemplates.resetPassword.text(user, resetPasswordUrl);                                 // 565
  }                                                                                                                    //
                                                                                                                       //
  if (typeof Accounts.emailTemplates.resetPassword.html === 'function') options.html = Accounts.emailTemplates.resetPassword.html(user, resetPasswordUrl);
                                                                                                                       //
  if ((0, _typeof3["default"])(Accounts.emailTemplates.headers) === 'object') {                                        // 573
    options.headers = Accounts.emailTemplates.headers;                                                                 // 574
  }                                                                                                                    //
                                                                                                                       //
  Email.send(options);                                                                                                 // 577
};                                                                                                                     //
                                                                                                                       //
// send the user an email informing them that their account was created, with                                          //
// a link that when opened both marks their email as verified and forces them                                          //
// to choose their password. The email must be one of the addresses in the                                             //
// user's emails field, or undefined to pick the first email automatically.                                            //
//                                                                                                                     //
// This is not called automatically. It must be called manually if you                                                 //
// want to use enrollment emails.                                                                                      //
                                                                                                                       //
/**                                                                                                                    //
 * @summary Send an email with a link the user can use to set their initial password.                                  //
 * @locus Server                                                                                                       //
 * @param {String} userId The id of the user to send email to.                                                         //
 * @param {String} [email] Optional. Which address of the user's to send the email to. This address must be in the user's `emails` list. Defaults to the first email in the list.
 * @importFromPackage accounts-base                                                                                    //
 */                                                                                                                    //
Accounts.sendEnrollmentEmail = function (userId, email) {                                                              // 595
  // XXX refactor! This is basically identical to sendResetPasswordEmail.                                              //
                                                                                                                       //
  // Make sure the user exists, and email is in their addresses.                                                       //
  var user = Meteor.users.findOne(userId);                                                                             // 599
  if (!user) throw new Error("Can't find user");                                                                       // 600
  // pick the first email if we weren't passed an email.                                                               //
  if (!email && user.emails && user.emails[0]) email = user.emails[0].address;                                         // 595
  // make sure we have a valid email                                                                                   //
  if (!email || !_.contains(_.pluck(user.emails || [], 'address'), email)) throw new Error("No such email for user.");
                                                                                                                       //
  var token = Random.secret();                                                                                         // 609
  var when = new Date();                                                                                               // 610
  var tokenRecord = {                                                                                                  // 611
    token: token,                                                                                                      // 612
    email: email,                                                                                                      // 613
    when: when                                                                                                         // 614
  };                                                                                                                   //
  Meteor.users.update(userId, { $set: {                                                                                // 616
      "services.password.reset": tokenRecord                                                                           // 617
    } });                                                                                                              //
                                                                                                                       //
  // before passing to template, update user object with new token                                                     //
  Meteor._ensure(user, 'services', 'password').reset = tokenRecord;                                                    // 595
                                                                                                                       //
  var enrollAccountUrl = Accounts.urls.enrollAccount(token);                                                           // 623
                                                                                                                       //
  var options = {                                                                                                      // 625
    to: email,                                                                                                         // 626
    from: Accounts.emailTemplates.enrollAccount.from ? Accounts.emailTemplates.enrollAccount.from(user) : Accounts.emailTemplates.from,
    subject: Accounts.emailTemplates.enrollAccount.subject(user)                                                       // 630
  };                                                                                                                   //
                                                                                                                       //
  if (typeof Accounts.emailTemplates.enrollAccount.text === 'function') {                                              // 633
    options.text = Accounts.emailTemplates.enrollAccount.text(user, enrollAccountUrl);                                 // 634
  }                                                                                                                    //
                                                                                                                       //
  if (typeof Accounts.emailTemplates.enrollAccount.html === 'function') options.html = Accounts.emailTemplates.enrollAccount.html(user, enrollAccountUrl);
                                                                                                                       //
  if ((0, _typeof3["default"])(Accounts.emailTemplates.headers) === 'object') {                                        // 642
    options.headers = Accounts.emailTemplates.headers;                                                                 // 643
  }                                                                                                                    //
                                                                                                                       //
  Email.send(options);                                                                                                 // 646
};                                                                                                                     //
                                                                                                                       //
// Take token from sendResetPasswordEmail or sendEnrollmentEmail, change                                               //
// the users password, and log them in.                                                                                //
Meteor.methods({ resetPassword: function () {                                                                          // 652
    function resetPassword(token, newPassword) {                                                                       // 652
      var self = this;                                                                                                 // 653
      return Accounts._loginMethod(self, "resetPassword", arguments, "password", function () {                         // 654
        check(token, String);                                                                                          // 660
        check(newPassword, passwordValidator);                                                                         // 661
                                                                                                                       //
        var user = Meteor.users.findOne({                                                                              // 663
          "services.password.reset.token": token });                                                                   // 664
        if (!user) throw new Meteor.Error(403, "Token expired");                                                       // 665
        var email = user.services.password.reset.email;                                                                // 667
        if (!_.include(_.pluck(user.emails || [], 'address'), email)) return {                                         // 668
          userId: user._id,                                                                                            // 670
          error: new Meteor.Error(403, "Token has invalid email address")                                              // 671
        };                                                                                                             //
                                                                                                                       //
        var hashed = hashPassword(newPassword);                                                                        // 674
                                                                                                                       //
        // NOTE: We're about to invalidate tokens on the user, who we might be                                         //
        // logged in as. Make sure to avoid logging ourselves out if this                                              //
        // happens. But also make sure not to leave the connection in a state                                          //
        // of having a bad token set if things fail.                                                                   //
        var oldToken = Accounts._getLoginToken(self.connection.id);                                                    // 659
        Accounts._setLoginToken(user._id, self.connection, null);                                                      // 681
        var resetToOldToken = function () {                                                                            // 682
          function resetToOldToken() {                                                                                 // 682
            Accounts._setLoginToken(user._id, self.connection, oldToken);                                              // 683
          }                                                                                                            //
                                                                                                                       //
          return resetToOldToken;                                                                                      //
        }();                                                                                                           //
                                                                                                                       //
        try {                                                                                                          // 686
          // Update the user record by:                                                                                //
          // - Changing the password to the new one                                                                    //
          // - Forgetting about the reset token that was just used                                                     //
          // - Verifying their email, since they got the password reset via email.                                     //
          var affectedRecords = Meteor.users.update({                                                                  // 691
            _id: user._id,                                                                                             // 693
            'emails.address': email,                                                                                   // 694
            'services.password.reset.token': token                                                                     // 695
          }, { $set: { 'services.password.bcrypt': hashed,                                                             //
              'emails.$.verified': true },                                                                             // 698
            $unset: { 'services.password.reset': 1,                                                                    // 699
              'services.password.srp': 1 } });                                                                         // 700
          if (affectedRecords !== 1) return {                                                                          // 701
            userId: user._id,                                                                                          // 703
            error: new Meteor.Error(403, "Invalid email")                                                              // 704
          };                                                                                                           //
        } catch (err) {                                                                                                //
          resetToOldToken();                                                                                           // 707
          throw err;                                                                                                   // 708
        }                                                                                                              //
                                                                                                                       //
        // Replace all valid login tokens with new ones (changing                                                      //
        // password should invalidate existing sessions).                                                              //
        Accounts._clearAllLoginTokens(user._id);                                                                       // 659
                                                                                                                       //
        return { userId: user._id };                                                                                   // 715
      });                                                                                                              //
    }                                                                                                                  //
                                                                                                                       //
    return resetPassword;                                                                                              //
  }() });                                                                                                              //
                                                                                                                       //
///                                                                                                                    //
/// EMAIL VERIFICATION                                                                                                 //
///                                                                                                                    //
                                                                                                                       //
// send the user an email with a link that when opened marks that                                                      //
// address as verified                                                                                                 //
                                                                                                                       //
/**                                                                                                                    //
 * @summary Send an email with a link the user can use verify their email address.                                     //
 * @locus Server                                                                                                       //
 * @param {String} userId The id of the user to send email to.                                                         //
 * @param {String} [email] Optional. Which address of the user's to send the email to. This address must be in the user's `emails` list. Defaults to the first unverified email in the list.
 * @importFromPackage accounts-base                                                                                    //
 */                                                                                                                    //
Accounts.sendVerificationEmail = function (userId, address) {                                                          // 735
  // XXX Also generate a link using which someone can delete this                                                      //
  // account if they own said address but weren't those who created                                                    //
  // this account.                                                                                                     //
                                                                                                                       //
  // Make sure the user exists, and address is one of their addresses.                                                 //
  var user = Meteor.users.findOne(userId);                                                                             // 741
  if (!user) throw new Error("Can't find user");                                                                       // 742
  // pick the first unverified address if we weren't passed an address.                                                //
  if (!address) {                                                                                                      // 735
    var email = _.find(user.emails || [], function (e) {                                                               // 746
      return !e.verified;                                                                                              // 747
    });                                                                                                                //
    address = (email || {}).address;                                                                                   // 748
                                                                                                                       //
    if (!address) {                                                                                                    // 750
      throw new Error("That user has no unverified email addresses.");                                                 // 751
    }                                                                                                                  //
  }                                                                                                                    //
  // make sure we have a valid address                                                                                 //
  if (!address || !_.contains(_.pluck(user.emails || [], 'address'), address)) throw new Error("No such email address for user.");
                                                                                                                       //
  var tokenRecord = {                                                                                                  // 759
    token: Random.secret(),                                                                                            // 760
    address: address,                                                                                                  // 761
    when: new Date() };                                                                                                // 762
  Meteor.users.update({ _id: userId }, { $push: { 'services.email.verificationTokens': tokenRecord } });               // 763
                                                                                                                       //
  // before passing to template, update user object with new token                                                     //
  Meteor._ensure(user, 'services', 'email');                                                                           // 735
  if (!user.services.email.verificationTokens) {                                                                       // 769
    user.services.email.verificationTokens = [];                                                                       // 770
  }                                                                                                                    //
  user.services.email.verificationTokens.push(tokenRecord);                                                            // 772
                                                                                                                       //
  var verifyEmailUrl = Accounts.urls.verifyEmail(tokenRecord.token);                                                   // 774
                                                                                                                       //
  var options = {                                                                                                      // 776
    to: address,                                                                                                       // 777
    from: Accounts.emailTemplates.verifyEmail.from ? Accounts.emailTemplates.verifyEmail.from(user) : Accounts.emailTemplates.from,
    subject: Accounts.emailTemplates.verifyEmail.subject(user)                                                         // 781
  };                                                                                                                   //
                                                                                                                       //
  if (typeof Accounts.emailTemplates.verifyEmail.text === 'function') {                                                // 784
    options.text = Accounts.emailTemplates.verifyEmail.text(user, verifyEmailUrl);                                     // 785
  }                                                                                                                    //
                                                                                                                       //
  if (typeof Accounts.emailTemplates.verifyEmail.html === 'function') options.html = Accounts.emailTemplates.verifyEmail.html(user, verifyEmailUrl);
                                                                                                                       //
  if ((0, _typeof3["default"])(Accounts.emailTemplates.headers) === 'object') {                                        // 793
    options.headers = Accounts.emailTemplates.headers;                                                                 // 794
  }                                                                                                                    //
                                                                                                                       //
  Email.send(options);                                                                                                 // 797
};                                                                                                                     //
                                                                                                                       //
// Take token from sendVerificationEmail, mark the email as verified,                                                  //
// and log them in.                                                                                                    //
Meteor.methods({ verifyEmail: function () {                                                                            // 802
    function verifyEmail(token) {                                                                                      // 802
      var self = this;                                                                                                 // 803
      return Accounts._loginMethod(self, "verifyEmail", arguments, "password", function () {                           // 804
        check(token, String);                                                                                          // 810
                                                                                                                       //
        var user = Meteor.users.findOne({ 'services.email.verificationTokens.token': token });                         // 812
        if (!user) throw new Meteor.Error(403, "Verify email link expired");                                           // 814
                                                                                                                       //
        var tokenRecord = _.find(user.services.email.verificationTokens, function (t) {                                // 817
          return t.token == token;                                                                                     // 819
        });                                                                                                            //
        if (!tokenRecord) return {                                                                                     // 821
          userId: user._id,                                                                                            // 823
          error: new Meteor.Error(403, "Verify email link expired")                                                    // 824
        };                                                                                                             //
                                                                                                                       //
        var emailsRecord = _.find(user.emails, function (e) {                                                          // 827
          return e.address == tokenRecord.address;                                                                     // 828
        });                                                                                                            //
        if (!emailsRecord) return {                                                                                    // 830
          userId: user._id,                                                                                            // 832
          error: new Meteor.Error(403, "Verify email link is for unknown address")                                     // 833
        };                                                                                                             //
                                                                                                                       //
        // By including the address in the query, we can use 'emails.$' in the                                         //
        // modifier to get a reference to the specific object in the emails                                            //
        // array. See                                                                                                  //
        // http://www.mongodb.org/display/DOCS/Updating/#Updating-The%24positionaloperator)                            //
        // http://www.mongodb.org/display/DOCS/Updating#Updating-%24pull                                               //
        Meteor.users.update({ _id: user._id,                                                                           // 809
          'emails.address': tokenRecord.address }, { $set: { 'emails.$.verified': true },                              // 843
          $pull: { 'services.email.verificationTokens': { address: tokenRecord.address } } });                         // 845
                                                                                                                       //
        return { userId: user._id };                                                                                   // 847
      });                                                                                                              //
    }                                                                                                                  //
                                                                                                                       //
    return verifyEmail;                                                                                                //
  }() });                                                                                                              //
                                                                                                                       //
/**                                                                                                                    //
 * @summary Add an email address for a user. Use this instead of directly                                              //
 * updating the database. The operation will fail if there is a different user                                         //
 * with an email only differing in case. If the specified user has an existing                                         //
 * email only differing in case however, we replace it.                                                                //
 * @locus Server                                                                                                       //
 * @param {String} userId The ID of the user to update.                                                                //
 * @param {String} newEmail A new email address for the user.                                                          //
 * @param {Boolean} [verified] Optional - whether the new email address should                                         //
 * be marked as verified. Defaults to false.                                                                           //
 * @importFromPackage accounts-base                                                                                    //
 */                                                                                                                    //
Accounts.addEmail = function (userId, newEmail, verified) {                                                            // 864
  check(userId, NonEmptyString);                                                                                       // 865
  check(newEmail, NonEmptyString);                                                                                     // 866
  check(verified, Match.Optional(Boolean));                                                                            // 867
                                                                                                                       //
  if (_.isUndefined(verified)) {                                                                                       // 869
    verified = false;                                                                                                  // 870
  }                                                                                                                    //
                                                                                                                       //
  var user = Meteor.users.findOne(userId);                                                                             // 873
  if (!user) throw new Meteor.Error(403, "User not found");                                                            // 874
                                                                                                                       //
  // Allow users to change their own email to a version with a different case                                          //
                                                                                                                       //
  // We don't have to call checkForCaseInsensitiveDuplicates to do a case                                              //
  // insensitive check across all emails in the database here because: (1) if                                          //
  // there is no case-insensitive duplicate between this user and other users,                                         //
  // then we are OK and (2) if this would create a conflict with other users                                           //
  // then there would already be a case-insensitive duplicate and we can't fix                                         //
  // that in this code anyway.                                                                                         //
  var caseInsensitiveRegExp = new RegExp('^' + Meteor._escapeRegExp(newEmail) + '$', 'i');                             // 864
                                                                                                                       //
  var didUpdateOwnEmail = _.any(user.emails, function (email, index) {                                                 // 888
    if (caseInsensitiveRegExp.test(email.address)) {                                                                   // 889
      Meteor.users.update({                                                                                            // 890
        _id: user._id,                                                                                                 // 891
        'emails.address': email.address                                                                                // 892
      }, { $set: {                                                                                                     //
          'emails.$.address': newEmail,                                                                                // 894
          'emails.$.verified': verified                                                                                // 895
        } });                                                                                                          //
      return true;                                                                                                     // 897
    }                                                                                                                  //
                                                                                                                       //
    return false;                                                                                                      // 900
  });                                                                                                                  //
                                                                                                                       //
  // In the other updates below, we have to do another call to                                                         //
  // checkForCaseInsensitiveDuplicates to make sure that no conflicting values                                         //
  // were added to the database in the meantime. We don't have to do this for                                          //
  // the case where the user is updating their email address to one that is the                                        //
  // same as before, but only different because of capitalization. Read the                                            //
  // big comment above to understand why.                                                                              //
                                                                                                                       //
  if (didUpdateOwnEmail) {                                                                                             // 864
    return;                                                                                                            // 911
  }                                                                                                                    //
                                                                                                                       //
  // Perform a case insensitive check for duplicates before update                                                     //
  checkForCaseInsensitiveDuplicates('emails.address', 'Email', newEmail, user._id);                                    // 864
                                                                                                                       //
  Meteor.users.update({                                                                                                // 917
    _id: user._id                                                                                                      // 918
  }, {                                                                                                                 //
    $addToSet: {                                                                                                       // 920
      emails: {                                                                                                        // 921
        address: newEmail,                                                                                             // 922
        verified: verified                                                                                             // 923
      }                                                                                                                //
    }                                                                                                                  //
  });                                                                                                                  //
                                                                                                                       //
  // Perform another check after update, in case a matching user has been                                              //
  // inserted in the meantime                                                                                          //
  try {                                                                                                                // 864
    checkForCaseInsensitiveDuplicates('emails.address', 'Email', newEmail, user._id);                                  // 931
  } catch (ex) {                                                                                                       //
    // Undo update if the check fails                                                                                  //
    Meteor.users.update({ _id: user._id }, { $pull: { emails: { address: newEmail } } });                              // 934
    throw ex;                                                                                                          // 936
  }                                                                                                                    //
};                                                                                                                     //
                                                                                                                       //
/**                                                                                                                    //
 * @summary Remove an email address for a user. Use this instead of updating                                           //
 * the database directly.                                                                                              //
 * @locus Server                                                                                                       //
 * @param {String} userId The ID of the user to update.                                                                //
 * @param {String} email The email address to remove.                                                                  //
 * @importFromPackage accounts-base                                                                                    //
 */                                                                                                                    //
Accounts.removeEmail = function (userId, email) {                                                                      // 948
  check(userId, NonEmptyString);                                                                                       // 949
  check(email, NonEmptyString);                                                                                        // 950
                                                                                                                       //
  var user = Meteor.users.findOne(userId);                                                                             // 952
  if (!user) throw new Meteor.Error(403, "User not found");                                                            // 953
                                                                                                                       //
  Meteor.users.update({ _id: user._id }, { $pull: { emails: { address: email } } });                                   // 956
};                                                                                                                     //
                                                                                                                       //
///                                                                                                                    //
/// CREATING USERS                                                                                                     //
///                                                                                                                    //
                                                                                                                       //
// Shared createUser function called from the createUser method, both                                                  //
// if originates in client or server code. Calls user provided hooks,                                                  //
// does the actual user insertion.                                                                                     //
//                                                                                                                     //
// returns the user id                                                                                                 //
var _createUser = function _createUser(options) {                                                                      // 969
  // Unknown keys allowed, because a onCreateUserHook can take arbitrary                                               //
  // options.                                                                                                          //
  check(options, Match.ObjectIncluding({                                                                               // 972
    username: Match.Optional(String),                                                                                  // 973
    email: Match.Optional(String),                                                                                     // 974
    password: Match.Optional(passwordValidator)                                                                        // 975
  }));                                                                                                                 //
                                                                                                                       //
  var username = options.username;                                                                                     // 978
  var email = options.email;                                                                                           // 979
  if (!username && !email) throw new Meteor.Error(400, "Need to set a username or email");                             // 980
                                                                                                                       //
  var user = { services: {} };                                                                                         // 983
  if (options.password) {                                                                                              // 984
    var hashed = hashPassword(options.password);                                                                       // 985
    user.services.password = { bcrypt: hashed };                                                                       // 986
  }                                                                                                                    //
                                                                                                                       //
  if (username) user.username = username;                                                                              // 989
  if (email) user.emails = [{ address: email, verified: false }];                                                      // 991
                                                                                                                       //
  // Perform a case insensitive check before insert                                                                    //
  checkForCaseInsensitiveDuplicates('username', 'Username', username);                                                 // 969
  checkForCaseInsensitiveDuplicates('emails.address', 'Email', email);                                                 // 996
                                                                                                                       //
  var userId = Accounts.insertUserDoc(options, user);                                                                  // 998
  // Perform another check after insert, in case a matching user has been                                              //
  // inserted in the meantime                                                                                          //
  try {                                                                                                                // 969
    checkForCaseInsensitiveDuplicates('username', 'Username', username, userId);                                       // 1002
    checkForCaseInsensitiveDuplicates('emails.address', 'Email', email, userId);                                       // 1003
  } catch (ex) {                                                                                                       //
    // Remove inserted user if the check fails                                                                         //
    Meteor.users.remove(userId);                                                                                       // 1006
    throw ex;                                                                                                          // 1007
  }                                                                                                                    //
  return userId;                                                                                                       // 1009
};                                                                                                                     //
                                                                                                                       //
// method for create user. Requests come from the client.                                                              //
Meteor.methods({ createUser: function () {                                                                             // 1013
    function createUser(options) {                                                                                     // 1013
      var self = this;                                                                                                 // 1014
      return Accounts._loginMethod(self, "createUser", arguments, "password", function () {                            // 1015
        // createUser() above does more checking.                                                                      //
        check(options, Object);                                                                                        // 1022
        if (Accounts._options.forbidClientAccountCreation) return {                                                    // 1023
          error: new Meteor.Error(403, "Signups forbidden")                                                            // 1025
        };                                                                                                             //
                                                                                                                       //
        // Create user. result contains id and token.                                                                  //
        var userId = _createUser(options);                                                                             // 1020
        // safety belt. createUser is supposed to throw on error. send 500 error                                       //
        // instead of sending a verification email with empty userid.                                                  //
        if (!userId) throw new Error("createUser failed to insert new user");                                          // 1020
                                                                                                                       //
        // If `Accounts._options.sendVerificationEmail` is set, register                                               //
        // a token to verify the user's primary email, and send it to                                                  //
        // that address.                                                                                               //
        if (options.email && Accounts._options.sendVerificationEmail) Accounts.sendVerificationEmail(userId, options.email);
                                                                                                                       //
        // client gets logged in as the new user afterwards.                                                           //
        return { userId: userId };                                                                                     // 1020
      });                                                                                                              //
    }                                                                                                                  //
                                                                                                                       //
    return createUser;                                                                                                 //
  }() });                                                                                                              //
                                                                                                                       //
// Create user directly on the server.                                                                                 //
//                                                                                                                     //
// Unlike the client version, this does not log you in as this user                                                    //
// after creation.                                                                                                     //
//                                                                                                                     //
// returns userId or throws an error if it can't create                                                                //
//                                                                                                                     //
// XXX add another argument ("server options") that gets sent to onCreateUser,                                         //
// which is always empty when called from the createUser method? eg, "admin:                                           //
// true", which we want to prevent the client from setting, but which a custom                                         //
// method calling Accounts.createUser could set?                                                                       //
//                                                                                                                     //
Accounts.createUser = function (options, callback) {                                                                   // 1059
  options = _.clone(options);                                                                                          // 1060
                                                                                                                       //
  // XXX allow an optional callback?                                                                                   //
  if (callback) {                                                                                                      // 1059
    throw new Error("Accounts.createUser with callback not supported on the server yet.");                             // 1064
  }                                                                                                                    //
                                                                                                                       //
  return _createUser(options);                                                                                         // 1067
};                                                                                                                     //
                                                                                                                       //
///                                                                                                                    //
/// PASSWORD-SPECIFIC INDEXES ON USERS                                                                                 //
///                                                                                                                    //
Meteor.users._ensureIndex('services.email.verificationTokens.token', { unique: 1, sparse: 1 });                        // 1073
Meteor.users._ensureIndex('services.password.reset.token', { unique: 1, sparse: 1 });                                  // 1075
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/accounts-password/email_templates.js");
require("./node_modules/meteor/accounts-password/password_server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['accounts-password'] = {};

})();

//# sourceMappingURL=accounts-password.js.map
