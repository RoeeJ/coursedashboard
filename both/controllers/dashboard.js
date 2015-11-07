DashboardController = AppController.extend({
  waitOn: function() {
    Meteor.logoutOtherClients();
    return this.subscribe('lessons');
  },
  data: {
    lessons: Lessons.find({})
  },
  onAfterAction: function () {
    Meteor.logoutOtherClients();
    Meta.setTitle('Dashboard');
  }
});

DashboardController.events({
  'click [data-action=doSomething]': function (event, template) {
    event.preventDefault();
  }
});
