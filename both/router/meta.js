if(Meteor.isClient) {
  Meta.config({
      options: {
        // Meteor.settings[Meteor.settings.environment].public.meta.title
        title: 'קורס אנדרואיד',
        suffix: 'קורס אנדרואיד'
      }
  });
}
if(Meteor.isClient){
  window.oncontextmenu = function(){return false;}  
}
