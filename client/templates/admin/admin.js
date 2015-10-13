Meteor.subscribe('Videos');
if(Meteor.isClient){
  Forms.mixin(Template.userForm);
  Forms.mixin(Template.lessonForm);
}
Template.userForm.events({
  "documentSubmit": function(event, template, doc){
    if(!doc.userEmail || !doc.userPassword) return;
    if(event.currentTarget.checkValidity()) {
      var perm = $('#uperm').val() === '1' ? ['trial'] : [];
      var opts = {
          username: doc.userEmail,
          email: doc.userEmail,
          password: doc.userPassword,
          roles: perm,
          creator: Meteor.userId()
      };
      Meteor.call('mkUser',opts, function(err) {
        if(err) {
          bootbox.alert(err);
        }
        else {
          $('#fuser').replaceWith('<h1><span class="label label-success" style="display:block;">המשתמש נוצר בהצלחה</span></h1>');
        }
      });
    }
     console.log(doc);
  }
});
Template.lessonForm.events({
  "documentSubmit": function(event, template, doc){
    var subject = doc.subject
    if(!subject) return;
    var sum = 0
    var sel = doc.permlvl;
    if(!sel) {
      sel = 1;
    } else {
      sel.forEach(function(t) {
        sum += Number(t);
      });
    }
    if(!!!Session.get('fileId')) {
      bootbox.alert('אנא בחר קובץ ו/או וודא סיום העלאה, תיבת ההעלאה תעלם בסוף ההעלאה');
      return;
    }
    Lessons.insert({
      locked:false,
      subject: subject,
      perm: sum,
      fileId: Session.get('fileId')
    });
    Session.set('fileId',undefined);
    $('#clesson').replaceWith('<h1><span class="label label-success" style="display:block;">השיעור הועלה בהצלחה</span></h1>');
  },
  'propertyChange': function(event,template,changes) {
    if(changes.filebutton) {
      $('.progress').fadeIn(300)
      _.each(event.currentTarget.files, function(file) {
        Videos.insert({
          file: file,
          meta: {},
          onUploaded: function(err, fileObj) {
            if(err) {

            } else {
              Session.set('fileId',fileObj._id);
              $('.progress').fadeOut(300)
              $('[for=filebutton]').fadeOut(300)
              $('#filebutton').fadeOut(300)
            }
          },
          onProgress: function(progress) {
            var el = $('.progress-bar');
            el.css('width',progress+'%');
            el.text(progress.toString().substring(0,5)+'%');
          }
        });
      });
    }
  }
});
Template.admin.helpers({
  getLessonEntryClass: function() {
    return Template.admin.__helpers.get('isDisabled')(this._id) ? "zbg crossed lesson" : "zbg lesson"
  },
  listUsers: function(){
    return Users.find();
  },
  listLessons: function() {
    return Lessons.find({},{sort:{'ln':1}});
  },
  userEmail: function() {
    return this.emails[0].address;
  },
  timeToExpire: function() {
    return self.expire || '';
  },
  isLocked: function() {
    return Roles.userIsInRole(this._id,'locked');
  },
  isDisabled: function(docId) {
    return docId ? Lessons.findOne(docId).locked :  Lessons.findOne(this._id).locked
  },
  isAdmin: function() {
    return Roles.userIsInRole(this._id,'admin');
  },
  isTrialUser: function() {
    return Roles.userIsInRole(this._id, 'trial');
  },
  getOptions: function() {
    //console.log(this)
    return {
      onEnd: function() {
        var index = 1;
        _.each($('.lesson'), function(item) {
          _.each($(item).prop('class').split(' '), function(cls) {
            if(cls.indexOf('et-') > -1) {
              Lessons.update({_id: cls.substr(3)}, {
                $set:{
                  ln: index++
                }
              });
            }
          });
        });
      }
    }
  }
});
Template.admin.events({
  "click #mkperm": function(event) {
    var self = this;
    bootbox.dialog({
      onEscape:true,
      title:'<p rtl>הפיכת משתמש למשתמש קבוע</p>',
      message:'<p rtl>האם אתה בטוח שברצונך להפוך את המשתמש למשתמש קבוע?</p>',
      buttons: {
        "כן": {
          className: "btn-success",
          callback: function(res) {
            if(res) {
              Meteor.call('mkUserPerm',self._id);
            }
          }
        },
        "לא": {
          className: "btn-danger"
        }
      }
    });
  },
  "click #mktrial": function(event) {
    var self = this;
    bootbox.dialog({
      onEscape:true,
      title:'<p rtl>הפיכת משתמש למשתמש ניסיון</p>',
      message:'<p rtl>האם אתה בטוח שברצונך להפוך את המשתמש למשתמש ניסיון?</p>',
      buttons: {
        "כן": {
          className: "btn-success",
          callback: function(res) {
            if(res) {
              Meteor.call('mkUserTrial',self._id);
            }
          }
        },
        "לא": {
          className: "btn-danger"
        }
      }
    });
  },
  "click #lckbtn": function(event){
    var self = this;
    var msgt = "<p rtl>האם אתה בטוח שברצונך לנעול את ה###?<p>"
    var titlet = "<p rtl>נעילת ###</p>";
    if(self.ln) {
      msgt = msgt.replace('###','שיעור');
      titlet = titlet.replace('###','שיעור');
    } else {
      msgt = msgt.replace('###','משתמש');
      titlet = titlet.replace('###','משתמש');
    }
    bootbox.dialog({
      message: msgt,
      title: titlet,
      onEscape: true,
      buttons: {
        yes: {
          label: "כן",
          className: "btn-success",
          callback: function() {
            if(self.ln){
              Lessons.update(self['_id'],{$set:{locked:true}})
            } else {
              Meteor.call('lockUser',self['_id']);
            }
          }
        },
        no: {
          label: "לא",
          className: "btn-danger",
          callback: function() {
          }
        }
      }
    })
  },
  "click #unlckbtn": function(event){
    var self = this;
    var msgt = "<p rtl>האם אתה בטוח שברצונך לבטל את נעילת ה###?<p>"
    var titlet = "<p rtl>ביטול נעילת ###</p>";
    if(self.ln) {
      msgt = msgt.replace('###','שיעור');
      titlet = titlet.replace('###','שיעור');
    } else {
      msgt = msgt.replace('###','משתמש');
      titlet = titlet.replace('###','משתמש');
    }
    bootbox.dialog({
      message: msgt,
      title: titlet,
      onEscape: true,
      buttons: {
        yes: {
          label: "כן",
          className: "btn-success",
          callback: function() {
            if(self.ln){
              Lessons.update(self['_id'],{$set:{locked:false}})
            } else {
              Meteor.call('unlockUser',self['_id']);
            }
            //console.log(self);
          }
        },
        no: {
          label: "לא",
          className: "btn-danger",
          callback: function() {
            //console.log("nope");
          }
        }
      }
    })
  },
  "click #delbtn": function(event){
    var self = this;
    var msgt = "<p rtl>האם אתה בטוח שברצונך למחוק את ה###</p>";
    var titlet = "<p rtl>מחיקת ###</p>"
    if(self.ln) {
      msgt = msgt.replace('###','שיעור');
      titlet = titlet.replace('###','שיעור');
    } else {
      msgt = msgt.replace('###','משתמש');
      titlet = titlet.replace('###','משתמש');
    }
    bootbox.dialog({
      message: msgt,
      title: titlet,
      onEscape: true,
      buttons: {
        yes: {
          label: "כן",
          className: "btn-success",
          callback: function() {
            if(self.ln){
              Lessons.remove(self._id);
            } else {
              Meteor.call('delUser',{id:self._id,oper:Meteor.userId()}, function(err, res) {
                if(err) {
                  bootbox.alert('<p rtl>'+err+'</p>')
                }
              })
            }
            //console.log(self);
          }
        },
        no: {
          label: "לא",
          className: "btn-danger",
          callback: function() {
            //console.log("nope");
          }
        }
      }
    })
  },
  "click #pwdgen": function(event) {
    $('#userPassword').fadeOut(300, function() {
      $('#userPassword').val(generatePassword()).fadeIn(300);
    });
  },
  "click #permbtn": function(event) {
    var self = this;
    bootbox.dialog({
      message: '<select rtl id="cperm" name="permlvl" class="form-control" multiple="multiple"><option value="1">כולם</option><option value="2">לקוחות משלמים</option><option value="4">לקוחות ניסיון</option></select>',
      title: '<p rtl>שינוי הרשאות שיעור</p>',
      onEscape: true,
      buttons: {
        yes: {
          label: "כן",
          className: "btn-success",
          callback: function() {
            var sum = 0;
            $('#cperm').val().forEach(function(t) {
              sum += Number(t);
            });
            Lessons.update(self['_id'], {$set:{perm:sum}})
          }
        },
        no: {
          label: "לא",
          className: "btn-danger",
          callback: function() {
            //console.log("nope");
          }
        }
      }
    });
  }
});
function get_bits(value){
  var base2_ = (value).toString(2).split("").reverse().join("");
  var baseL_ = new Array(32 - base2_.length).join("0");
  var base2 = base2_ + baseL_;
  return base2;
}
function generatePassword() {
  var length = 8,
  charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}
