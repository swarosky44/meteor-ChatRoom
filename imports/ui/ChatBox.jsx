import React, { Component, PropTypes } from 'react'
import { createContainer } from 'meteor/react-meteor-data'
import ReactDOM from 'react-dom'
import { Meteor } from 'meteor/meteor'
import ChatBoxItem from './ChatBoxItem.jsx'
import { Msgs } from "../api/msgs.js"
import { Link } from 'react-router'

class ChatBox extends Component {
  renderChatList() {
    const msgs = this.props.msgs
    const friend_name = msgs[0].sender.name == Meteor.user().username ? msgs[0].recevier.name : msgs[0].sender.name
    return msgs.map((msg) => {
      return (
        <ChatBoxItem
         key={msg._id}
         msg={msg}
         friendName={friend_name}
        />
      )
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim()
    if (text) {
      const _msg = this.props.msgs[0]
      const friend = {
        id: _msg.sender.id === Meteor.userId() ? _msg.recevier.id : _msg.sender.id,
        name: _msg.sender.name == Meteor.user().username ? _msg.recevier.name : _msg.sender.name
      }
      Meteor.call('msgs.insert', text, friend)
      ReactDOM.findDOMNode(this.refs.textInput).value = ''
    }
  }

  render() {
    const msgs = this.props.msgs
    const friend_name = msgs[0].sender.name == Meteor.user().username ? msgs[0].recevier.name : msgs[0].sender.name
    return (
      <div className="chat-box page">
        <h1 className="page-title">
          <Link className="page-title_back" to={'/'}>&lt;</Link>
          { friend_name }
        </h1>
        <ul className="chat-box_list">
          { this.renderChatList() }
        </ul>
        <form className="chat-box_msg" onSubmit={this.handleSubmit.bind(this)}>
          <input className="chat-box_input" type="text" ref="textInput" placeholder="Type to send a messsage"/>
        </form>
      </div>
    )
  }
}


ChatBox.propTypes = {
  msgs: PropTypes.array.isRequired
}

export default createContainer(() => {
  const user_id = Meteor.userId()
  // TODO  == Don't know how to get friend_id from component's props ==
  const friend_id = this.location.pathname.slice(1)
  Meteor.subscribe('chatMsgs', friend_id)
  return {
    msgs: Msgs.find({
      $or: [
        {'sender.id': user_id, 'recevier.id': friend_id}, 
        {'sender.id': friend_id, 'recevier.id': user_id}
      ] 
    }).fetch()
  }
}, ChatBox)
