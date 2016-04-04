(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;

/* Package-scope variables */
var DDPServer, Server, StreamServer;



/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['ddp-server'] = {};

})();
