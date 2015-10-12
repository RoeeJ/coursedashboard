if ( Meteor.users.find().count() === 0 ) {
    var t = Accounts.createUser({
        username: 'androidisrael2015',
        email: 'androidisrael2015@gmail.com',
        password: 'sherman1138',
        roles: [
          'admin'
        ]
    });
    if(t){
      Roles.addUsersToRoles(t,'admin');
    } else {
      Roles.addUsersToRoles(Meteor.users.findOne()._id,'admin')  
    }
}
