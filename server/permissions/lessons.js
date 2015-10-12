Lessons.allow({
  insert: function(user){
    return Roles.userIsInRole(user,'admin');
  },
  update: function(user){
    return Roles.userIsInRole(user,'admin');
  },
  remove: function(user){
    return Roles.userIsInRole(user,'admin');
  }
});
Lessons.before.insert(function(userId, doc) {
  if(!doc.ln) {
    var temp = Lessons.findOne({},{sort:{'ln':-1}});
    if(temp) doc.ln = temp.ln+1;
    else doc.ln = 1;
    //doc.ln = (.ln || 0) + 1
  }
});
Lessons.before.remove(function(userId, doc) {
  Videos.remove(doc.fileId || doc.fileRef)
});
