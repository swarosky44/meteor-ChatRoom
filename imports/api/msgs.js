import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { check } from 'meteor/check'
 
export const Msgs = new Mongo.Collection('msgs')
if (Meteor.isServer) {
  Meteor.publish('msgs', function msgsPublication() {
    return Msgs.find({
      $or: [
        { 'sender.id': this.userId },
        { 'recevier.id': this.userId }
      ],
    })
  })
  Meteor.publish('chatMsgs', function chatMsgsPublication(friend_id) {
    return Msgs.find({
      $or: [
        {'sender.id': this.userId, 'recevier.id': friend_id}, 
        {'sender.id': friend_id, 'recevier.id': this.userId}
      ] 
    })
  })
}
 
Meteor.methods({
  'msgs.insert'(text, friend) {
    check(text, String)

    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized')
    }

    Msgs.insert({
      sender: {
        id: Meteor.userId(),
        name: Meteor.user().username
      },
      recevier: friend,
      content: text,
      time: new Date(),
      isUnread: true
    })
  },
  
  'msgs.setUnread'(_id) {
    check(_id, String)
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized')
    }
    Msgs.update(_id, { $set: { isUnread: false } })
  }
})