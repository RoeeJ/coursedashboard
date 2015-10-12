Meteor.subscribe('Videos')
Template.lesson.helpers({
  getVideoLink: function() {
    return Videos.link(Videos.collection.findOne(this.fileId))
  },
  isDisabled: function() {
    return this.locked;
  }
});
