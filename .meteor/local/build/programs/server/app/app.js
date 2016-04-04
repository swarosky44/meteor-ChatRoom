var require = meteorInstall({"imports":{"api":{"msgs.js":["meteor/meteor","meteor/mongo","meteor/check",function(require,exports){

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
// imports/api/msgs.js                                                       //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////
                                                                             //
exports.__esModule = true;                                                   //
exports.Msgs = undefined;                                                    //
                                                                             //
var _meteor = require('meteor/meteor');                                      // 1
                                                                             //
var _mongo = require('meteor/mongo');                                        // 2
                                                                             //
var _check = require('meteor/check');                                        // 3
                                                                             //
var Msgs = exports.Msgs = new _mongo.Mongo.Collection('msgs');               // 5
if (_meteor.Meteor.isServer) {                                               // 6
  _meteor.Meteor.publish('msgs', function () {                               // 7
    function msgsPublication() {                                             // 7
      return Msgs.find({                                                     // 8
        $or: [{ 'sender.id': this.userId }, { 'recevier.id': this.userId }]  // 9
      });                                                                    //
    }                                                                        //
                                                                             //
    return msgsPublication;                                                  //
  }());                                                                      //
  _meteor.Meteor.publish('chatMsgs', function () {                           // 15
    function chatMsgsPublication(friend_id) {                                // 15
      console.log(friend_id, 'asdsadsdsadasdas');                            // 16
      return Msgs.find({                                                     // 17
        $or: [{ 'sender.id': this.userId, 'recevier.id': friend_id }, { 'sender.id': friend_id, 'recevier.id': this.userId }]
      });                                                                    //
    }                                                                        //
                                                                             //
    return chatMsgsPublication;                                              //
  }());                                                                      //
}                                                                            //
                                                                             //
_meteor.Meteor.methods({                                                     // 26
  'msgs.insert': function () {                                               // 27
    function msgsInsert(text, friend) {                                      //
      (0, _check.check)(text, String);                                       // 28
                                                                             //
      if (!_meteor.Meteor.userId()) {                                        // 30
        throw new _meteor.Meteor.Error('not-authorized');                    // 31
      }                                                                      //
                                                                             //
      Msgs.insert({                                                          // 34
        sender: {                                                            // 35
          id: _meteor.Meteor.userId(),                                       // 36
          name: _meteor.Meteor.user().username                               // 37
        },                                                                   //
        recevier: friend,                                                    // 39
        content: text,                                                       // 40
        time: new Date(),                                                    // 41
        isUnread: true                                                       // 42
      });                                                                    //
    }                                                                        //
                                                                             //
    return msgsInsert;                                                       //
  }(),                                                                       //
  'msgs.setUnread': function () {                                            // 45
    function msgsSetUnread(_id) {                                            //
      (0, _check.check)(_id, String);                                        // 46
      if (!_meteor.Meteor.userId()) {                                        // 47
        throw new _meteor.Meteor.Error('not-authorized');                    // 48
      }                                                                      //
      Msgs.update(_id, { $set: { isUnread: false } });                       // 50
    }                                                                        //
                                                                             //
    return msgsSetUnread;                                                    //
  }()                                                                        //
});                                                                          //
///////////////////////////////////////////////////////////////////////////////

}],"tasks.js":["meteor/meteor","meteor/mongo","meteor/check",function(require,exports){

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
// imports/api/tasks.js                                                      //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////
                                                                             //
exports.__esModule = true;                                                   //
exports.Tasks = undefined;                                                   //
                                                                             //
var _meteor = require('meteor/meteor');                                      // 1
                                                                             //
var _mongo = require('meteor/mongo');                                        // 2
                                                                             //
var _check = require('meteor/check');                                        // 3
                                                                             //
var Tasks = exports.Tasks = new _mongo.Mongo.Collection('tasks');            // 5
if (_meteor.Meteor.isServer) {                                               // 6
  // This code only runs on the server                                       //
  // Only return public tasks and private tasks belong to owner              //
  _meteor.Meteor.publish('tasks', function () {                              // 9
    function tasksPublication() {                                            // 9
      return Tasks.find({                                                    // 10
        $or: [{ 'private': { $ne: true } }, { owner: this.userId }]          // 11
      });                                                                    //
    }                                                                        //
                                                                             //
    return tasksPublication;                                                 //
  }());                                                                      //
}                                                                            //
_meteor.Meteor.methods({                                                     // 18
  'tasks.insert': function () {                                              // 19
    function tasksInsert(text) {                                             //
      (0, _check.check)(text, String);                                       // 20
                                                                             //
      // Make sure the user is logged in before inserting a task             //
      if (!_meteor.Meteor.userId()) {                                        // 19
        throw new _meteor.Meteor.Error('not-authorized');                    // 24
      }                                                                      //
                                                                             //
      Tasks.insert({                                                         // 27
        text: text,                                                          // 28
        createdAt: new Date(),                                               // 29
        owner: _meteor.Meteor.userId(),                                      // 30
        username: _meteor.Meteor.user().username                             // 31
      });                                                                    //
    }                                                                        //
                                                                             //
    return tasksInsert;                                                      //
  }(),                                                                       //
  'tasks.remove': function () {                                              // 34
    function tasksRemove(taskId) {                                           //
      (0, _check.check)(taskId, String);                                     // 35
                                                                             //
      var task = Tasks.findOne(taskId);                                      // 37
      if (task['private'] && task.owner !== _meteor.Meteor.userId()) {       // 38
        // If the task is private, make sure only the owner can delete it    //
        throw new _meteor.Meteor.Error('not-authorized');                    // 40
      }                                                                      //
                                                                             //
      Tasks.remove(taskId);                                                  // 43
    }                                                                        //
                                                                             //
    return tasksRemove;                                                      //
  }(),                                                                       //
  'tasks.setChecked': function () {                                          // 45
    function tasksSetChecked(taskId, setChecked) {                           //
      (0, _check.check)(taskId, String);                                     // 46
      (0, _check.check)(setChecked, Boolean);                                // 47
      var task = Tasks.findOne(taskId);                                      // 48
      if (task['private'] && task.owner !== _meteor.Meteor.userId()) {       // 49
        // If the task is private, make sure only the owner can check it off
        throw new _meteor.Meteor.Error('not-authorized');                    // 51
      }                                                                      //
      Tasks.update(taskId, { $set: { checked: setChecked } });               // 53
    }                                                                        //
                                                                             //
    return tasksSetChecked;                                                  //
  }(),                                                                       //
  'tasks.setPrivate': function () {                                          // 55
    function tasksSetPrivate(taskId, setToPrivate) {                         //
      (0, _check.check)(taskId, String);                                     // 56
      (0, _check.check)(setToPrivate, Boolean);                              // 57
                                                                             //
      var task = Tasks.findOne(taskId);                                      // 59
                                                                             //
      // Make sure only the task owner can make a task private               //
      if (task.owner !== _meteor.Meteor.userId()) {                          // 55
        throw new _meteor.Meteor.Error('not-authorized');                    // 63
      }                                                                      //
                                                                             //
      Tasks.update(taskId, { $set: { 'private': setToPrivate } });           // 66
    }                                                                        //
                                                                             //
    return tasksSetPrivate;                                                  //
  }()                                                                        //
});                                                                          //
///////////////////////////////////////////////////////////////////////////////

}],"users.js":["meteor/meteor","meteor/mongo","meteor/check",function(require,exports){

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
// imports/api/users.js                                                      //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////
                                                                             //
exports.__esModule = true;                                                   //
exports.Users = undefined;                                                   //
                                                                             //
var _meteor = require('meteor/meteor');                                      // 1
                                                                             //
var _mongo = require('meteor/mongo');                                        // 2
                                                                             //
var _check = require('meteor/check');                                        // 3
                                                                             //
var Users = exports.Users = _meteor.Meteor.users;                            // 5
if (_meteor.Meteor.isServer) {                                               // 6
  _meteor.Meteor.publish('users', function () {                              // 7
    function usersPublication() {                                            // 7
      return Users.find({});                                                 // 8
    }                                                                        //
                                                                             //
    return usersPublication;                                                 //
  }());                                                                      //
  _meteor.Meteor.publish('findUser', function () {                           // 10
    function findUserPublication(u_id) {                                     // 10
      return Users.find({                                                    // 11
        _id: u_id                                                            // 12
      });                                                                    //
    }                                                                        //
                                                                             //
    return findUserPublication;                                              //
  }());                                                                      //
}                                                                            //
///////////////////////////////////////////////////////////////////////////////

}]}},"server":{"main.js":["meteor/meteor","../imports/api/tasks.js","../imports/api/msgs.js","../imports/api/users.js",function(require){

///////////////////////////////////////////////////////////////////////////////
//                                                                           //
// server/main.js                                                            //
//                                                                           //
///////////////////////////////////////////////////////////////////////////////
                                                                             //
var _meteor = require('meteor/meteor');                                      // 1
                                                                             //
require('../imports/api/tasks.js');                                          // 2
                                                                             //
require('../imports/api/msgs.js');                                           // 3
                                                                             //
require('../imports/api/users.js');                                          // 4
                                                                             //
_meteor.Meteor.startup(function () {                                         // 5
  // code to run on server at startup                                        //
});                                                                          //
///////////////////////////////////////////////////////////////////////////////

}]}},{"extensions":[".js",".json",".jsx"]});
require("./server/main.js");
//# sourceMappingURL=app.js.map
