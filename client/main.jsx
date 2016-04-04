import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router'
 
import '../imports/startup/accounts-config.js'
import App from '../imports/ui/App.jsx'
import ChatBox from '../imports/ui/ChatBox.jsx'
 
Meteor.startup(() => {
  render((
    <Router history={browserHistory}>
      <Route path="/" component={App} />
      <Route path="/:friendId" component={ChatBox} />
    </Router>), document.getElementById('app'))
});