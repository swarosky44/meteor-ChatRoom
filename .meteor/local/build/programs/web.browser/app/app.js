var require = meteorInstall({"client":{"main.html":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// client/template.main.js                                                                                          //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
                                                                                                                    // 1
Template.body.addContent((function() {                                                                              // 2
  var view = this;                                                                                                  // 3
  return HTML.Raw('<div id="app"></div>');                                                                          // 4
}));                                                                                                                // 5
Meteor.startup(Template.body.renderToDocument);                                                                     // 6
                                                                                                                    // 7
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main.jsx":["react","meteor/meteor","react-dom","react-router","../imports/startup/accounts-config.js","../imports/ui/App.jsx","../imports/ui/ChatBox.jsx",function(require){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// client/main.jsx                                                                                                  //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _react = require('react');                                                                                      // 1
                                                                                                                    //
var _react2 = _interopRequireDefault(_react);                                                                       //
                                                                                                                    //
var _meteor = require('meteor/meteor');                                                                             // 2
                                                                                                                    //
var _reactDom = require('react-dom');                                                                               // 3
                                                                                                                    //
var _reactRouter = require('react-router');                                                                         // 4
                                                                                                                    //
require('../imports/startup/accounts-config.js');                                                                   // 6
                                                                                                                    //
var _App = require('../imports/ui/App.jsx');                                                                        // 7
                                                                                                                    //
var _App2 = _interopRequireDefault(_App);                                                                           //
                                                                                                                    //
var _ChatBox = require('../imports/ui/ChatBox.jsx');                                                                // 8
                                                                                                                    //
var _ChatBox2 = _interopRequireDefault(_ChatBox);                                                                   //
                                                                                                                    //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }                   //
                                                                                                                    //
_meteor.Meteor.startup(function () {                                                                                // 10
  (0, _reactDom.render)(_react2['default'].createElement(                                                           // 11
    _reactRouter.Router,                                                                                            //
    { history: _reactRouter.browserHistory },                                                                       //
    _react2['default'].createElement(_reactRouter.Route, { path: '/', component: _App2['default'] }),               //
    _react2['default'].createElement(_reactRouter.Route, { path: '/:friendId', component: _ChatBox2['default'] })   //
  ), document.getElementById('app'));                                                                               //
});                                                                                                                 //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"imports":{"api":{"msgs.js":["meteor/meteor","meteor/mongo","meteor/check",function(require,exports){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/api/msgs.js                                                                                              //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
exports.__esModule = true;                                                                                          //
exports.Msgs = undefined;                                                                                           //
                                                                                                                    //
var _meteor = require('meteor/meteor');                                                                             // 1
                                                                                                                    //
var _mongo = require('meteor/mongo');                                                                               // 2
                                                                                                                    //
var _check = require('meteor/check');                                                                               // 3
                                                                                                                    //
var Msgs = exports.Msgs = new _mongo.Mongo.Collection('msgs');                                                      // 5
if (_meteor.Meteor.isServer) {                                                                                      // 6
  _meteor.Meteor.publish('msgs', function () {                                                                      // 7
    function msgsPublication() {                                                                                    // 7
      return Msgs.find({                                                                                            // 8
        $or: [{ 'sender.id': this.userId }, { 'recevier.id': this.userId }]                                         // 9
      });                                                                                                           //
    }                                                                                                               //
                                                                                                                    //
    return msgsPublication;                                                                                         //
  }());                                                                                                             //
  _meteor.Meteor.publish('chatMsgs', function () {                                                                  // 15
    function chatMsgsPublication(friend_id) {                                                                       // 15
      console.log(friend_id, 'asdsadsdsadasdas');                                                                   // 16
      return Msgs.find({                                                                                            // 17
        $or: [{ 'sender.id': this.userId, 'recevier.id': friend_id }, { 'sender.id': friend_id, 'recevier.id': this.userId }]
      });                                                                                                           //
    }                                                                                                               //
                                                                                                                    //
    return chatMsgsPublication;                                                                                     //
  }());                                                                                                             //
}                                                                                                                   //
                                                                                                                    //
_meteor.Meteor.methods({                                                                                            // 26
  'msgs.insert': function () {                                                                                      // 27
    function msgsInsert(text, friend) {                                                                             //
      (0, _check.check)(text, String);                                                                              // 28
                                                                                                                    //
      if (!_meteor.Meteor.userId()) {                                                                               // 30
        throw new _meteor.Meteor.Error('not-authorized');                                                           // 31
      }                                                                                                             //
                                                                                                                    //
      Msgs.insert({                                                                                                 // 34
        sender: {                                                                                                   // 35
          id: _meteor.Meteor.userId(),                                                                              // 36
          name: _meteor.Meteor.user().username                                                                      // 37
        },                                                                                                          //
        recevier: friend,                                                                                           // 39
        content: text,                                                                                              // 40
        time: new Date(),                                                                                           // 41
        isUnread: true                                                                                              // 42
      });                                                                                                           //
    }                                                                                                               //
                                                                                                                    //
    return msgsInsert;                                                                                              //
  }(),                                                                                                              //
  'msgs.setUnread': function () {                                                                                   // 45
    function msgsSetUnread(_id) {                                                                                   //
      (0, _check.check)(_id, String);                                                                               // 46
      if (!_meteor.Meteor.userId()) {                                                                               // 47
        throw new _meteor.Meteor.Error('not-authorized');                                                           // 48
      }                                                                                                             //
      Msgs.update(_id, { $set: { isUnread: false } });                                                              // 50
    }                                                                                                               //
                                                                                                                    //
    return msgsSetUnread;                                                                                           //
  }()                                                                                                               //
});                                                                                                                 //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"startup":{"accounts-config.js":["meteor/accounts-base",function(require){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/startup/accounts-config.js                                                                               //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _accountsBase = require('meteor/accounts-base');                                                                // 1
                                                                                                                    //
_accountsBase.Accounts.ui.config({                                                                                  // 3
  passwordSignupFields: 'USERNAME_ONLY'                                                                             // 4
});                                                                                                                 //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"ui":{"AccountsUIWrapper.jsx":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits","react","react-dom","meteor/templating","meteor/blaze",function(require,exports){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/ui/AccountsUIWrapper.jsx                                                                                 //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
exports.__esModule = true;                                                                                          //
                                                                                                                    //
var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');                                             //
                                                                                                                    //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                    //
                                                                                                                    //
var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');                       //
                                                                                                                    //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                              //
                                                                                                                    //
var _inherits2 = require('babel-runtime/helpers/inherits');                                                         //
                                                                                                                    //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                //
                                                                                                                    //
var _react = require('react');                                                                                      // 1
                                                                                                                    //
var _react2 = _interopRequireDefault(_react);                                                                       //
                                                                                                                    //
var _reactDom = require('react-dom');                                                                               // 2
                                                                                                                    //
var _reactDom2 = _interopRequireDefault(_reactDom);                                                                 //
                                                                                                                    //
var _templating = require('meteor/templating');                                                                     // 3
                                                                                                                    //
var _blaze = require('meteor/blaze');                                                                               // 4
                                                                                                                    //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }                   //
                                                                                                                    //
var AccountsUIWrapper = function (_Component) {                                                                     //
  (0, _inherits3['default'])(AccountsUIWrapper, _Component);                                                        //
                                                                                                                    //
  function AccountsUIWrapper() {                                                                                    //
    (0, _classCallCheck3['default'])(this, AccountsUIWrapper);                                                      //
    return (0, _possibleConstructorReturn3['default'])(this, _Component.apply(this, arguments));                    //
  }                                                                                                                 //
                                                                                                                    //
  AccountsUIWrapper.prototype.componentDidMount = function () {                                                     //
    function componentDidMount() {                                                                                  //
      // Use Meteor Blaze to render login buttons                                                                   //
      this.view = _blaze.Blaze.render(_templating.Template.loginButtons, _reactDom2['default'].findDOMNode(this.refs.container));
    }                                                                                                               //
                                                                                                                    //
    return componentDidMount;                                                                                       //
  }();                                                                                                              //
                                                                                                                    //
  AccountsUIWrapper.prototype.componentWillUnmount = function () {                                                  // 6
    function componentWillUnmount() {                                                                               //
      // Clean up Blaze view                                                                                        //
      _blaze.Blaze.remove(this.view);                                                                               // 14
    }                                                                                                               //
                                                                                                                    //
    return componentWillUnmount;                                                                                    //
  }();                                                                                                              //
                                                                                                                    //
  AccountsUIWrapper.prototype.render = function () {                                                                // 6
    function render() {                                                                                             //
      // Just render a placeholder container that will be filled in                                                 //
      return _react2['default'].createElement('span', { ref: 'container' });                                        // 18
    }                                                                                                               //
                                                                                                                    //
    return render;                                                                                                  //
  }();                                                                                                              //
                                                                                                                    //
  return AccountsUIWrapper;                                                                                         //
}(_react.Component);                                                                                                //
                                                                                                                    //
exports['default'] = AccountsUIWrapper;                                                                             //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"App.jsx":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits","react","meteor/meteor","meteor/react-meteor-data","../api/msgs.js","./MsgBox.jsx","./AccountsUIWrapper.jsx",function(require,exports){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/ui/App.jsx                                                                                               //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
exports.__esModule = true;                                                                                          //
                                                                                                                    //
var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');                                             //
                                                                                                                    //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                    //
                                                                                                                    //
var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');                       //
                                                                                                                    //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                              //
                                                                                                                    //
var _inherits2 = require('babel-runtime/helpers/inherits');                                                         //
                                                                                                                    //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                //
                                                                                                                    //
var _react = require('react');                                                                                      // 1
                                                                                                                    //
var _react2 = _interopRequireDefault(_react);                                                                       //
                                                                                                                    //
var _meteor = require('meteor/meteor');                                                                             // 2
                                                                                                                    //
var _reactMeteorData = require('meteor/react-meteor-data');                                                         // 3
                                                                                                                    //
var _msgs = require('../api/msgs.js');                                                                              // 4
                                                                                                                    //
var _MsgBox = require('./MsgBox.jsx');                                                                              // 5
                                                                                                                    //
var _MsgBox2 = _interopRequireDefault(_MsgBox);                                                                     //
                                                                                                                    //
var _AccountsUIWrapper = require('./AccountsUIWrapper.jsx');                                                        // 6
                                                                                                                    //
var _AccountsUIWrapper2 = _interopRequireDefault(_AccountsUIWrapper);                                               //
                                                                                                                    //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }                   //
                                                                                                                    //
var App = function (_Component) {                                                                                   //
  (0, _inherits3['default'])(App, _Component);                                                                      //
                                                                                                                    //
  function App() {                                                                                                  //
    (0, _classCallCheck3['default'])(this, App);                                                                    //
    return (0, _possibleConstructorReturn3['default'])(this, _Component.apply(this, arguments));                    //
  }                                                                                                                 //
                                                                                                                    //
  App.prototype.concatMsgs = function () {                                                                          //
    function concatMsgs(msgs) {                                                                                     //
      var _this2 = this;                                                                                            //
                                                                                                                    //
      var fList = [];                                                                                               // 10
      var result = [];                                                                                              // 11
      msgs.forEach(function (msg) {                                                                                 // 12
        var friend_id = msg.sender.id == _this2.props.currentUser._id ? msg.recevier.id : msg.sender.id;            // 13
        if (fList.indexOf(friend_id) < 0) {                                                                         // 14
          fList.push(friend_id);                                                                                    // 15
          result.push(msg);                                                                                         // 16
        }                                                                                                           //
      });                                                                                                           //
      return result;                                                                                                // 19
    }                                                                                                               //
                                                                                                                    //
    return concatMsgs;                                                                                              //
  }();                                                                                                              //
                                                                                                                    //
  App.prototype.render = function () {                                                                              // 7
    function render() {                                                                                             //
      return _react2['default'].createElement(                                                                      // 23
        'div',                                                                                                      //
        { className: 'page-wrap' },                                                                                 //
        _react2['default'].createElement(_AccountsUIWrapper2['default'], null),                                     //
        _react2['default'].createElement(_MsgBox2['default'], { msgs: this.concatMsgs(this.props.msgs) })           //
      );                                                                                                            //
    }                                                                                                               //
                                                                                                                    //
    return render;                                                                                                  //
  }();                                                                                                              //
                                                                                                                    //
  return App;                                                                                                       //
}(_react.Component);                                                                                                //
                                                                                                                    //
App.propTypes = {                                                                                                   // 32
  msgs: _react.PropTypes.array.isRequired,                                                                          // 33
  currentUser: _react.PropTypes.object                                                                              // 34
};                                                                                                                  //
                                                                                                                    //
exports['default'] = (0, _reactMeteorData.createContainer)(function () {                                            //
  _meteor.Meteor.subscribe('msgs');                                                                                 // 38
  return {                                                                                                          // 39
    msgs: _msgs.Msgs.find({}, { sort: { time: -1 } }).fetch(),                                                      // 40
    currentUser: _meteor.Meteor.user()                                                                              // 41
  };                                                                                                                //
}, App);                                                                                                            //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"ChatBox.jsx":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits","react","meteor/react-meteor-data","react-dom","meteor/meteor","./ChatBoxItem.jsx","../api/msgs.js","react-router",function(require,exports){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/ui/ChatBox.jsx                                                                                           //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
exports.__esModule = true;                                                                                          //
                                                                                                                    //
var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');                                             //
                                                                                                                    //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                    //
                                                                                                                    //
var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');                       //
                                                                                                                    //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                              //
                                                                                                                    //
var _inherits2 = require('babel-runtime/helpers/inherits');                                                         //
                                                                                                                    //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                //
                                                                                                                    //
var _this2 = this;                                                                                                  //
                                                                                                                    //
var _react = require('react');                                                                                      // 1
                                                                                                                    //
var _react2 = _interopRequireDefault(_react);                                                                       //
                                                                                                                    //
var _reactMeteorData = require('meteor/react-meteor-data');                                                         // 2
                                                                                                                    //
var _reactDom = require('react-dom');                                                                               // 3
                                                                                                                    //
var _reactDom2 = _interopRequireDefault(_reactDom);                                                                 //
                                                                                                                    //
var _meteor = require('meteor/meteor');                                                                             // 4
                                                                                                                    //
var _ChatBoxItem = require('./ChatBoxItem.jsx');                                                                    // 5
                                                                                                                    //
var _ChatBoxItem2 = _interopRequireDefault(_ChatBoxItem);                                                           //
                                                                                                                    //
var _msgs = require('../api/msgs.js');                                                                              // 6
                                                                                                                    //
var _reactRouter = require('react-router');                                                                         // 7
                                                                                                                    //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }                     //
                                                                                                                    //
var ChatBox = function (_Component) {                                                                               //
  (0, _inherits3['default'])(ChatBox, _Component);                                                                  //
                                                                                                                    //
  function ChatBox() {                                                                                              //
    (0, _classCallCheck3['default'])(this, ChatBox);                                                                //
    return (0, _possibleConstructorReturn3['default'])(this, _Component.apply(this, arguments));                    //
  }                                                                                                                 //
                                                                                                                    //
  ChatBox.prototype.renderChatList = function () {                                                                  //
    function renderChatList() {                                                                                     //
      var msgs = this.props.msgs;                                                                                   // 11
      var friend_name = msgs[0].sender.name == _meteor.Meteor.user().username ? msgs[0].recevier.name : msgs[0].sender.name;
      return msgs.map(function (msg) {                                                                              // 13
        return _react2['default'].createElement(_ChatBoxItem2['default'], {                                         // 14
          key: msg._id,                                                                                             // 16
          msg: msg,                                                                                                 // 17
          friendName: friend_name                                                                                   // 18
        });                                                                                                         //
      });                                                                                                           //
    }                                                                                                               //
                                                                                                                    //
    return renderChatList;                                                                                          //
  }();                                                                                                              //
                                                                                                                    //
  ChatBox.prototype.handleSubmit = function () {                                                                    // 9
    function handleSubmit(event) {                                                                                  //
      event.preventDefault();                                                                                       // 25
      var text = _reactDom2['default'].findDOMNode(this.refs.textInput).value.trim();                               // 26
      if (text) {                                                                                                   // 27
        var _msg = this.props.msgs[0];                                                                              // 28
        var friend = {                                                                                              // 29
          id: _msg.sender.id === _meteor.Meteor.userId() ? _msg.recevier.id : _msg.sender.id,                       // 30
          name: _msg.sender.name == _meteor.Meteor.user().username ? _msg.recevier.name : _msg.sender.name          // 31
        };                                                                                                          //
        _meteor.Meteor.call('msgs.insert', text, friend);                                                           // 33
        _reactDom2['default'].findDOMNode(this.refs.textInput).value = '';                                          // 34
      }                                                                                                             //
    }                                                                                                               //
                                                                                                                    //
    return handleSubmit;                                                                                            //
  }();                                                                                                              //
                                                                                                                    //
  ChatBox.prototype.render = function () {                                                                          // 9
    function render() {                                                                                             //
      var msgs = this.props.msgs;                                                                                   // 39
      var friend_name = msgs[0].sender.name == _meteor.Meteor.user().username ? msgs[0].recevier.name : msgs[0].sender.name;
      return _react2['default'].createElement(                                                                      // 41
        'div',                                                                                                      //
        { className: 'chat-box page' },                                                                             //
        _react2['default'].createElement(                                                                           //
          'h1',                                                                                                     //
          { className: 'page-title' },                                                                              //
          _react2['default'].createElement(                                                                         //
            _reactRouter.Link,                                                                                      //
            { className: 'page-title_back', to: '/' },                                                              //
            '<'                                                                                                     //
          ),                                                                                                        //
          friend_name                                                                                               //
        ),                                                                                                          //
        _react2['default'].createElement(                                                                           //
          'ul',                                                                                                     //
          { className: 'chat-box_list' },                                                                           //
          this.renderChatList()                                                                                     //
        ),                                                                                                          //
        _react2['default'].createElement(                                                                           //
          'form',                                                                                                   //
          { className: 'chat-box_msg', onSubmit: this.handleSubmit.bind(this) },                                    //
          _react2['default'].createElement('input', { className: 'chat-box_input', type: 'text', ref: 'textInput', placeholder: 'Type to send a messsage' })
        )                                                                                                           //
      );                                                                                                            //
    }                                                                                                               //
                                                                                                                    //
    return render;                                                                                                  //
  }();                                                                                                              //
                                                                                                                    //
  return ChatBox;                                                                                                   //
}(_react.Component);                                                                                                //
                                                                                                                    //
ChatBox.propTypes = {                                                                                               // 59
  msgs: _react.PropTypes.array.isRequired                                                                           // 60
};                                                                                                                  //
                                                                                                                    //
exports['default'] = (0, _reactMeteorData.createContainer)(function () {                                            //
  var user_id = _meteor.Meteor.userId();                                                                            // 64
  // TODO  == Don't know how to get friend_id from component's props ==                                             //
  var friend_id = _this2.location.pathname.slice(1);                                                                // 63
  _meteor.Meteor.subscribe('chatMsgs', friend_id);                                                                  // 67
  return {                                                                                                          // 68
    msgs: _msgs.Msgs.find({                                                                                         // 69
      $or: [{ 'sender.id': user_id, 'recevier.id': friend_id }, { 'sender.id': friend_id, 'recevier.id': user_id }]
    }).fetch()                                                                                                      //
  };                                                                                                                //
}, ChatBox);                                                                                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"ChatBoxItem.jsx":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits","react","meteor/meteor",function(require,exports){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/ui/ChatBoxItem.jsx                                                                                       //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
exports.__esModule = true;                                                                                          //
                                                                                                                    //
var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');                                             //
                                                                                                                    //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                    //
                                                                                                                    //
var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');                       //
                                                                                                                    //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                              //
                                                                                                                    //
var _inherits2 = require('babel-runtime/helpers/inherits');                                                         //
                                                                                                                    //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                //
                                                                                                                    //
var _react = require('react');                                                                                      // 1
                                                                                                                    //
var _react2 = _interopRequireDefault(_react);                                                                       //
                                                                                                                    //
var _meteor = require('meteor/meteor');                                                                             // 2
                                                                                                                    //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }                   //
                                                                                                                    //
var ChatBoxItem = function (_Component) {                                                                           //
  (0, _inherits3['default'])(ChatBoxItem, _Component);                                                              //
                                                                                                                    //
  function ChatBoxItem() {                                                                                          //
    (0, _classCallCheck3['default'])(this, ChatBoxItem);                                                            //
    return (0, _possibleConstructorReturn3['default'])(this, _Component.apply(this, arguments));                    //
  }                                                                                                                 //
                                                                                                                    //
  ChatBoxItem.prototype.render = function () {                                                                      //
    function render() {                                                                                             //
      var msg = this.props.msg;                                                                                     // 7
      var friendName = this.props.msg.sender.id === _meteor.Meteor.userId() ? _meteor.Meteor.user().username : this.props.friendName;
      return _react2['default'].createElement(                                                                      // 9
        'li',                                                                                                       //
        { className: 'chat-item' },                                                                                 //
        _react2['default'].createElement(                                                                           //
          'div',                                                                                                    //
          { className: 'chat-item_info' },                                                                          //
          _react2['default'].createElement(                                                                         //
            'span',                                                                                                 //
            { className: 'name' },                                                                                  //
            friendName,                                                                                             //
            ' :'                                                                                                    //
          ),                                                                                                        //
          _react2['default'].createElement(                                                                         //
            'span',                                                                                                 //
            { className: 'time' },                                                                                  //
            msg.time.toLocaleDateString() + '  ' + msg.time.toLocaleTimeString()                                    //
          )                                                                                                         //
        ),                                                                                                          //
        _react2['default'].createElement(                                                                           //
          'p',                                                                                                      //
          { className: 'chat-item_content' },                                                                       //
          msg.content                                                                                               //
        )                                                                                                           //
      );                                                                                                            //
    }                                                                                                               //
                                                                                                                    //
    return render;                                                                                                  //
  }();                                                                                                              //
                                                                                                                    //
  return ChatBoxItem;                                                                                               //
}(_react.Component);                                                                                                //
                                                                                                                    //
exports['default'] = ChatBoxItem;                                                                                   //
                                                                                                                    //
                                                                                                                    //
ChatBoxItem.propTypes = {                                                                                           // 21
  msg: _react.PropTypes.object.isRequired,                                                                          // 22
  friendName: _react.PropTypes.string.isRequired                                                                    // 23
};                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"MsgBox.jsx":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits","react","meteor/meteor","./MsgBoxItem.jsx",function(require,exports){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/ui/MsgBox.jsx                                                                                            //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
exports.__esModule = true;                                                                                          //
                                                                                                                    //
var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');                                             //
                                                                                                                    //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                    //
                                                                                                                    //
var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');                       //
                                                                                                                    //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                              //
                                                                                                                    //
var _inherits2 = require('babel-runtime/helpers/inherits');                                                         //
                                                                                                                    //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                //
                                                                                                                    //
var _react = require('react');                                                                                      // 1
                                                                                                                    //
var _react2 = _interopRequireDefault(_react);                                                                       //
                                                                                                                    //
var _meteor = require('meteor/meteor');                                                                             // 2
                                                                                                                    //
var _MsgBoxItem = require('./MsgBoxItem.jsx');                                                                      // 3
                                                                                                                    //
var _MsgBoxItem2 = _interopRequireDefault(_MsgBoxItem);                                                             //
                                                                                                                    //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }                   //
                                                                                                                    //
// MsgBox component - represents user's msg list                                                                    //
                                                                                                                    //
var MsgBox = function (_Component) {                                                                                //
  (0, _inherits3['default'])(MsgBox, _Component);                                                                   //
                                                                                                                    //
  function MsgBox() {                                                                                               //
    (0, _classCallCheck3['default'])(this, MsgBox);                                                                 //
    return (0, _possibleConstructorReturn3['default'])(this, _Component.apply(this, arguments));                    //
  }                                                                                                                 //
                                                                                                                    //
  MsgBox.prototype.renderMsgList = function () {                                                                    //
    function renderMsgList() {                                                                                      //
      var msgs = this.props.msgs;                                                                                   // 7
      return msgs.map(function (msg) {                                                                              // 8
        return _react2['default'].createElement(_MsgBoxItem2['default'], {                                          // 9
          key: msg._id,                                                                                             // 11
          msg: msg                                                                                                  // 12
        });                                                                                                         //
      });                                                                                                           //
    }                                                                                                               //
                                                                                                                    //
    return renderMsgList;                                                                                           //
  }();                                                                                                              //
                                                                                                                    //
  MsgBox.prototype.unreadMsgCount = function () {                                                                   // 5
    function unreadMsgCount() {                                                                                     //
      var msgs = this.props.msgs;                                                                                   // 18
      var count = 0;                                                                                                // 19
      msgs.forEach(function (msg) {                                                                                 // 20
        return msg.isUnread && count++;                                                                             //
      });                                                                                                           //
      return count;                                                                                                 // 21
    }                                                                                                               //
                                                                                                                    //
    return unreadMsgCount;                                                                                          //
  }();                                                                                                              //
                                                                                                                    //
  MsgBox.prototype.render = function () {                                                                           // 5
    function render() {                                                                                             //
      return _react2['default'].createElement(                                                                      // 24
        'div',                                                                                                      //
        { className: 'page msg-box' },                                                                              //
        _react2['default'].createElement(                                                                           //
          'h1',                                                                                                     //
          { className: 'page-title' },                                                                              //
          'My Messages',                                                                                            //
          _react2['default'].createElement(                                                                         //
            'div',                                                                                                  //
            { className: 'page-title_msg-count' },                                                                  //
            _react2['default'].createElement(                                                                       //
              'span',                                                                                               //
              { className: 'page-title_msg-count--unread' },                                                        //
              ' ',                                                                                                  //
              this.unreadMsgCount(),                                                                                //
              ' '                                                                                                   //
            ),                                                                                                      //
            ' / ',                                                                                                  //
            this.props.msgs.length                                                                                  //
          )                                                                                                         //
        ),                                                                                                          //
        _react2['default'].createElement(                                                                           //
          'ul',                                                                                                     //
          { className: 'msg-list' },                                                                                //
          this.renderMsgList()                                                                                      //
        )                                                                                                           //
      );                                                                                                            //
    }                                                                                                               //
                                                                                                                    //
    return render;                                                                                                  //
  }();                                                                                                              //
                                                                                                                    //
  return MsgBox;                                                                                                    //
}(_react.Component);                                                                                                //
                                                                                                                    //
exports['default'] = MsgBox;                                                                                        //
                                                                                                                    //
                                                                                                                    //
MsgBox.propTypes = {                                                                                                // 40
  msgs: _react.PropTypes.array.isRequired                                                                           // 41
};                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"MsgBoxItem.jsx":["babel-runtime/helpers/classCallCheck","babel-runtime/helpers/possibleConstructorReturn","babel-runtime/helpers/inherits","react","meteor/meteor","classnames","react-router",function(require,exports){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// imports/ui/MsgBoxItem.jsx                                                                                        //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
exports.__esModule = true;                                                                                          //
                                                                                                                    //
var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');                                             //
                                                                                                                    //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                    //
                                                                                                                    //
var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');                       //
                                                                                                                    //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                              //
                                                                                                                    //
var _inherits2 = require('babel-runtime/helpers/inherits');                                                         //
                                                                                                                    //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                //
                                                                                                                    //
var _react = require('react');                                                                                      // 1
                                                                                                                    //
var _react2 = _interopRequireDefault(_react);                                                                       //
                                                                                                                    //
var _meteor = require('meteor/meteor');                                                                             // 2
                                                                                                                    //
var _classnames = require('classnames');                                                                            // 3
                                                                                                                    //
var _classnames2 = _interopRequireDefault(_classnames);                                                             //
                                                                                                                    //
var _reactRouter = require('react-router');                                                                         // 4
                                                                                                                    //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }                   //
                                                                                                                    //
var MsgBoxItem = function (_Component) {                                                                            //
  (0, _inherits3['default'])(MsgBoxItem, _Component);                                                               //
                                                                                                                    //
  function MsgBoxItem() {                                                                                           //
    (0, _classCallCheck3['default'])(this, MsgBoxItem);                                                             //
    return (0, _possibleConstructorReturn3['default'])(this, _Component.apply(this, arguments));                    //
  }                                                                                                                 //
                                                                                                                    //
  MsgBoxItem.prototype.readThisMsg = function () {                                                                  //
    function readThisMsg() {                                                                                        //
      var _id = this.props.msg._id;                                                                                 // 10
      if (this.props.msg.isUnread) {                                                                                // 11
        _meteor.Meteor.call('msgs.setUnread', _id);                                                                 // 12
      }                                                                                                             //
    }                                                                                                               //
                                                                                                                    //
    return readThisMsg;                                                                                             //
  }();                                                                                                              //
                                                                                                                    //
  MsgBoxItem.prototype.render = function () {                                                                       // 7
    function render() {                                                                                             //
      var msg = this.props.msg;                                                                                     // 17
      var friend_id = msg.sender.id == _meteor.Meteor.userId() ? msg.recevier.id : msg.sender.id;                   // 18
      console.log(_meteor.Meteor.user(), ' is my name! <=======>');                                                 // 19
      var friend_name = msg.sender.name == _meteor.Meteor.user().username ? msg.recevier.name : msg.sender.name;    // 20
      var itemClassName = (0, _classnames2['default'])({                                                            // 21
        'msg-item': true,                                                                                           // 22
        'msg-item--unread': msg.isUnread                                                                            // 23
      });                                                                                                           //
      return _react2['default'].createElement(                                                                      // 25
        'li',                                                                                                       //
        { className: itemClassName },                                                                               //
        _react2['default'].createElement(                                                                           //
          _reactRouter.Link,                                                                                        //
          { to: '/' + friend_id, onClick: this.readThisMsg.bind(this) },                                            //
          _react2['default'].createElement(                                                                         //
            'div',                                                                                                  //
            { className: 'msg-item_name' },                                                                         //
            ' ',                                                                                                    //
            friend_name,                                                                                            //
            ' '                                                                                                     //
          ),                                                                                                        //
          _react2['default'].createElement(                                                                         //
            'div',                                                                                                  //
            { className: 'msg-item_content' },                                                                      //
            _react2['default'].createElement(                                                                       //
              'span',                                                                                               //
              { className: 'msg-item_time' },                                                                       //
              ' ',                                                                                                  //
              msg.time.toLocaleDateString() + '  ' + msg.time.toLocaleTimeString()                                  //
            ),                                                                                                      //
            _react2['default'].createElement(                                                                       //
              'p',                                                                                                  //
              null,                                                                                                 //
              msg.content,                                                                                          //
              ' '                                                                                                   //
            )                                                                                                       //
          )                                                                                                         //
        )                                                                                                           //
      );                                                                                                            //
    }                                                                                                               //
                                                                                                                    //
    return render;                                                                                                  //
  }();                                                                                                              //
                                                                                                                    //
  return MsgBoxItem;                                                                                                //
}(_react.Component);                                                                                                //
                                                                                                                    //
exports['default'] = MsgBoxItem;                                                                                    //
                                                                                                                    //
                                                                                                                    //
MsgBoxItem.propTypes = {                                                                                            // 39
  msg: _react.PropTypes.object.isRequired                                                                           // 40
};                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}}},{"extensions":[".js",".json",".html",".jsx",".less"]});
require("./client/main.html");
require("./client/main.jsx");