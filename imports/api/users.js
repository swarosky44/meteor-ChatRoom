import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { check } from 'meteor/check'
 
export const Users = Meteor.users;
if (Meteor.isServer) {
  Meteor.publish('users', function usersPublication() {
    return Users.find({})
  })
  Meteor.publish('findUser', function findUserPublication(u_id) {
    return Users.find({
      _id: u_id
    });
  })
} 
