Meteor.subscribe('Videos')
Template.lesson.helpers({
  getVideoLink: function() {
    return Videos.link(Videos.collection.findOne(this.fileId))
  },
  isDisabled: function(docId) {
    //console.log(docId);
    return this.locked || Roles.userIsInRole(Meteor.userId(),'locked') || (!Roles.userIsInRole(Meteor.userId(),'perm') && this.perm === 2) || this.unavail;
  }
});
