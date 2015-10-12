Router.route('/', {
  name: 'home'
});

Router.route('/dashboard', {
  name: 'dashboard',
  controller: 'DashboardController'
});
Router.route("/lesson", {
  name:"lesson",
  path:"/lesson/:_id",
  template:"lesson",
  waitOn:function(){
    return Meteor.subscribe('lessons');
  },
  data:function(){
    return Lessons.findOne(this.params._id);
  },
  onRun:function(){
    if(Meteor.user() && !Roles.userIsInRole(Meteor.userId(),'locked')) {
      this.next()
    } else {
      this.render('home');
    }
  },
  onReRun:function(){

  }
});
Router.route("/admin", {
  name:"admin",
  template:"admin",
  onRun:function(){
    var user = Meteor.userId();
     if(!Roles.userIsInRole(user,'admin')) {
       this.render('home')
     } else {
       this.next();
     }
  }
});
Router.plugin('ensureSignedIn', {
  only: ['dashboard','admin','lesson']
});
