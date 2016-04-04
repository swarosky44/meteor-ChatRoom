var require = meteorInstall({"imports":{"api":{"msgs.js":["meteor/meteor","meteor/mongo","meteor/check",function(require,exports){

//////////////////////////////////////////////////////////////////////////////
//                                                                          //
// imports/api/msgs.js                                                      //
//                                                                          //
//////////////////////////////////////////////////////////////////////////////
                                                                            //
exports.__esModule = true;                                                  //
exports.Msgs = undefined;                                                   //
                                                                            //
var _meteor = require('meteor/meteor');                                     // 1
                                                                            //
var _mongo = require('meteor/mongo');                                       // 2
                                                                            //
var _check = require('meteor/check');                                       // 3
                                                                            //
var Msgs = exports.Msgs = new _mongo.Mongo.Collection('msgs');              // 5
if (_meteor.Meteor.isServer) {                                              // 6
  _meteor.Meteor.publish('msgs', function () {                              // 7
    function msgsPublication() {                                            // 7
      return Msgs.find({                                                    // 8
        $or: [{ 'sender.id': this.userId }, { 'recevier.id': this.userId }]
      });                                                                   //
    }                                                                       //
                                                                            //
    return msgsPublication;                                                 //
  }());                                                                     //
  _meteor.Meteor.publish('chatMsgs', function () {                          // 15
    function chatMsgsPublication(friend_id) {                               // 15
      console.log(friend_id, 'asdsadsdsadasdas');                           // 16
      return Msgs.find({                                                    // 17
        $or: [{ 'sender.id': this.userId, 'recevier.id': friend_id }, { 'sender.id': friend_id, 'recevier.id': this.userId }]
      });                                                                   //
    }                                                                       //
                                                                            //
    return chatMsgsPublication;                                             //
  }());                                                                     //
}                                                                           //
                                                                            //
_meteor.Meteor.methods({                                                    // 26
  'msgs.insert': function () {                                              // 27
    function msgsInsert(text, friend) {                                     //
      (0, _check.check)(text, String);                                      // 28
                                                                            //
      if (!_meteor.Meteor.userId()) {                                       // 30
        throw new _meteor.Meteor.Error('not-authorized');                   // 31
      }                                                                     //
                                                                            //
      Msgs.insert({                                                         // 34
        sender: {                                                           // 35
          id: _meteor.Meteor.userId(),                                      // 36
          name: _meteor.Meteor.user().username                              // 37
        },                                                                  //
        recevier: friend,                                                   // 39
        content: text,                                                      // 40
        time: new Date(),                                                   // 41
        isUnread: true                                                      // 42
      });                                                                   //
    }                                                                       //
                                                                            //
    return msgsInsert;                                                      //
  }(),                                                                      //
  'msgs.setUnread': function () {                                           // 46
    function msgsSetUnread(_id) {                                           //
      (0, _check.check)(_id, String);                                       // 47
      if (!_meteor.Meteor.userId()) {                                       // 48
        throw new _meteor.Meteor.Error('not-authorized');                   // 49
      }                                                                     //
      Msgs.update(_id, { $set: { isUnread: false } });                      // 51
    }                                                                       //
                                                                            //
    return msgsSetUnread;                                                   //
  }()                                                                       //
});                                                                         //
//////////////////////////////////////////////////////////////////////////////

}]}},"server":{"main.js":["meteor/meteor","../imports/api/msgs.js",function(require){

//////////////////////////////////////////////////////////////////////////////
//                                                                          //
// server/main.js                                                           //
//                                                                          //
//////////////////////////////////////////////////////////////////////////////
                                                                            //
var _meteor = require('meteor/meteor');                                     // 1
                                                                            //
require('../imports/api/msgs.js');                                          // 2
                                                                            //
_meteor.Meteor.startup(function () {                                        // 3
  // code to run on server at startup                                       //
});                                                                         //
//////////////////////////////////////////////////////////////////////////////

}]}},{"extensions":[".js",".json",".jsx"]});
require("./server/main.js");
//# sourceMappingURL=app.js.map
