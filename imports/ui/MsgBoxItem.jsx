import React, { Component, PropTypes } from 'react'
import { Meteor } from 'meteor/meteor'
import classnames from 'classnames'
import { Link } from 'react-router'


export default class MsgBoxItem extends Component {

  readThisMsg() {
    let _id = this.props.msg._id
    if (this.props.msg.isUnread) {
      Meteor.call('msgs.setUnread', _id)
    }
  }

  render () {
    const msg = this.props.msg
    const friend_id = msg.sender.id == Meteor.userId() ? msg.recevier.id : msg.sender.id
    console.log(Meteor.user(), ' is my name! <=======>')
    const friend_name = msg.sender.name == Meteor.user().username ? msg.recevier.name : msg.sender.name
    const itemClassName = classnames({
      'msg-item': true,
      'msg-item--unread': msg.isUnread
    })
    return (
      <li className={itemClassName}>
        <Link to={`/${friend_id}`} onClick={this.readThisMsg.bind(this)}>
        <div className="msg-item_name"> { friend_name } </div> 
        <div className="msg-item_content"> 
          <span className="msg-item_time"> { `${msg.time.toLocaleDateString()}  ${msg.time.toLocaleTimeString()}` }</span>
          <p>{ msg.content } </p>
        </div>  
        </Link>
      </li>
    )
  }
}
 
MsgBoxItem.propTypes = {
  msg: PropTypes.object.isRequired
}
