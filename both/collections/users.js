Users = Meteor.users
if (Meteor.isClient) {
 Meteor.subscribe('allUsers');
}


if (Meteor.isServer) {
 Meteor.publish('allUsers', function() {
   if(Roles.userIsInRole(this.userId,'admin')){
    return Meteor.users.find({}, {fields:{username:1,emails:1, roles:1, status: 1}})
   }
 })
}
