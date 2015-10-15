Meteor.publishComposite("lessons", function() {
  return {
    find: function() {
      if(isInRole(this.userId,'locked')) return;
      if(isInRole(this.userId,'admin')) {
        return Lessons.find({},{sort:{ln:1}});
      } else if(isInRole(this.userId,'perm')) {
        return Lessons.find({locked:false},{sort:{ln:1}});
      } else {
        return Lessons.find({locked:false, perm: {$ne:2, $ne:'2'}},{sort:{ln:1}});
      }
    }
  }
});

function isInRole(userId,role) {
  return Roles.userIsInRole(userId,role);
}

function dec2bin(dec){
    return (dec >>> 0).toString(2);
}
