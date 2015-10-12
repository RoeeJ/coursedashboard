Meteor.subscribe("lessons");
Template.dashboard.helpers({
  listLessons: function() {
    return Lessons.find({},{sort:{'ln':1}});
  },
  isLocked: function(){
    return Roles.userIsInRole(Meteor.userId(),'locked');
  }
});
