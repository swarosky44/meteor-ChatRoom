import React, { Component, PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'


export default class ChatBoxItem extends Component {
  render() {
    const msg = this.props.msg
    const friendName = this.props.msg.sender.id === Meteor.userId() ? Meteor.user().username : this.props.friendName
    return (
      <li className="chat-item">
        <div className="chat-item_info">
          <span className="name">{ friendName } :</span>
          <span className="time">{ `${msg.time.toLocaleDateString()}  ${msg.time.toLocaleTimeString()}` }</span>
        </div>
        <p className="chat-item_content">{ msg.content }</p>
      </li>
    )
  }
}

ChatBoxItem.propTypes = {
  msg: PropTypes.object.isRequired,
  friendName: PropTypes.string.isRequired
}

