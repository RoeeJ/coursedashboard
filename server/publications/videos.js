Meteor.publish("Videos", function(){
  if(!Roles.userIsInRole(this.userId,'locked')) {
    return Videos.collection.find({});
  }
});
