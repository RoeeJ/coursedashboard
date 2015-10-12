Meteor.startup(function(){
  Accounts.validateNewUser(function (user) {
    return true;
  });
  Sortable.collections = ['Lessons'];
});
