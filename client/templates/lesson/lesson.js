Meteor.subscribe('Videos');
Template.lesson.helpers({
  getVideoLink: function() {
    return Videos.link(Videos.collection.findOne(this.fileId));
  },
  isDisabled: function(docId) {
    var userId = Meteor.userId();
    var roles = Roles.getRolesForUser(userId);
    if(roles.indexOf('admin') > -1) {
        return false;
    }
    if(this.locked || this.unavail) {
        //console.log('this');
        return true;
    }
    if(roles.indexOf('locked') > -1) {
        //console.log('locked');
        return true;
    }
    if(roles.indexOf('perm') == -1 &&
    (this.perm == '2' || this.perm == 2)) {
        return true;
    }
    return false;
  }
});
