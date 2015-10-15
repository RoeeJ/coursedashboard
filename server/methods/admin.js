Meteor.methods({
  fetchUserList:function(user){
     if(Roles.userIsInRole(user,'admin')) {
       return Meteor.users.find({});
     } else {
       return new Meteor.Error(403,'Unauthorized access.');
     }
  },
  lockUser: function(userId) {
    Roles.addUsersToRoles(userId,'locked')
  },
  unlockUser: function(userId) {
    Roles.removeUsersFromRoles(userId,'locked')
  },
  mkUserPerm: function(userId) {
    Roles.addUsersToRoles(userId,'perm');
  },
  mkUserTrial: function(userId) {
    Roles.removeUsersFromRoles(userId,'perm');
  },
  mkUser: function(userDoc) {
    if(!userDoc.creator === this.userId) return new Meteor.Error(403,'Unauthorized access');
    return Accounts.createUser(userDoc);
  },
  delUser: function(doc) {
    if(Roles.userIsInRole(doc.oper,'admin')){
      Meteor.users.remove(doc.id);
    } else {
      throw new Meteor.Error('403','גישה לא מורשית');
    }
  }
});
