import React, { Component, PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
import MsgBoxItem from "./MsgBoxItem.jsx"
// MsgBox component - represents user's msg list
export default class MsgBox extends Component {
  renderMsgList () {
    let msgs = this.props.msgs
    return msgs.map(msg => {
      return (
        <MsgBoxItem
          key={msg._id}
          msg={msg}
        />
      )
    })
  }
  unreadMsgCount () {
    const msgs = this.props.msgs
    let count = 0
    msgs.forEach(msg => msg.isUnread && count++)
    return count
  }
  render () {
    return (
      <div className="page msg-box">
        <h1 className="page-title">
          My Messages
          <div className="page-title_msg-count">
            <span className="page-title_msg-count--unread"> { this.unreadMsgCount() } </span> / { this.props.msgs.length }
          </div>
        </h1>
        <ul className="msg-list">  
          { this.renderMsgList() }
        </ul>
      </div>
    )
  }
}
 
MsgBox.propTypes = {
  msgs: PropTypes.array.isRequired
}