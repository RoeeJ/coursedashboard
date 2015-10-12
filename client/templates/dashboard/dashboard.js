Meteor.subscribe("lessons");
Template.dashboard.helpers({
  listLessons: function() {
    if(isInRole(Meteor.userId(),'trial')){
      return Lessons.find({perm: {$ne:2}, locked:false})
    }
    return Lessons.find({},{sort:{'ln':1}});
  },
  isLocked: function(){
    return Roles.userIsInRole(Meteor.userId(),'locked');
  }
});

function isInRole(userId,role) {
  return Roles.userIsInRole(userId,role);
}
