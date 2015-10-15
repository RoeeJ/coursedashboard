Meteor.subscribe("lessons");
Template.dashboard.helpers({
  listLessons: function() {
    if(isInRole(Meteor.userId(),'locked')) return;
    if(isInRole(Meteor.userId(),'admin')) {
      return Lessons.find({},{sort:{ln:1}});
    } else if(isInRole(Meteor.userId(),'perm')) {
      return Lessons.find({locked:false},{sort:{ln:1}});
    } else {
      return Lessons.find({locked:false, perm: {$ne:2, $ne:'2'}},{sort:{ln:1}});
    }
  },
  isLocked: function(){
    return Roles.userIsInRole(Meteor.userId(),'locked');
  }
});

function isInRole(userId,role) {
  return Roles.userIsInRole(userId,role);
}
