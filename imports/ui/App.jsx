import React, { Component, PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import { Msgs } from '../api/msgs.js'
import MsgBox from './MsgBox.jsx'
import AccountsUIWrapper from './AccountsUIWrapper.jsx'
class App extends Component {

  concatMsgs (msgs) {
    let fList = []
    let result = []
    msgs.forEach((msg) => {
      let friend_id = msg.sender.id == this.props.currentUser._id ? msg.recevier.id : msg.sender.id
      if(fList.indexOf(friend_id) < 0) {
        fList.push(friend_id)
        result.push(msg)
      }
    })
    return result
  }

  render() {
    return (
      <div className="page-wrap">
        <AccountsUIWrapper />
        <MsgBox msgs={ this.concatMsgs(this.props.msgs) }/>
      </div> 
    );
  }
}
 
App.propTypes = {
  msgs: PropTypes.array.isRequired,
  currentUser: PropTypes.object
}
 
export default createContainer(() => {
  Meteor.subscribe('msgs')
  return {
    msgs: Msgs.find({}, { sort:{ time :-1} }).fetch(),
    currentUser: Meteor.user()
  }
}, App)