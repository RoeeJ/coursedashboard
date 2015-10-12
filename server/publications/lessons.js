Meteor.publishComposite("lessons", function() {
  return {
    find: function() {
      if(isInRole(this.userId,'locked')) return;
      if(isInRole(this.userId,'trial')){
        return Lessons.find({perm: {$where:function(){return (this.perm==1 || this.perm==4)}}, locked:false})
      } else {
        if(Roles.userIsInRole(this.userId,'admin')) {
          return Lessons.find();
        } else {
          return Lessons.find({locked:false});
        }
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
