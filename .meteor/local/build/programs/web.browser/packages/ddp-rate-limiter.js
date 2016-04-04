(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;

/* Package-scope variables */
var RATE_LIMIT_NUM_CALLS, RATE_LIMIT_INTERVAL_TIME_MS, DDPRateLimiter;



/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['ddp-rate-limiter'] = {};

})();
