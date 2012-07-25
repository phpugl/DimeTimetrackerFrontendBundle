'use strict';

/**
 * Dime - app/service/index.js
 */
(function ($, App) {

  // Define Routes
  App.route("profile", "profile/:id", function(id) {
      var model = new App.Model.User({id: id});
      model.fetch({async: false});

      App.log(model.attributes);

      if (model.get('username')) {
          App.UI.router.switchView(new App.Views.Core.Form({
              defaults: {
                title: 'Edit user',
                template: 'DimeTimetrackerFrontendBundle:Users:form',
                templateEl: '#user-form'
              },
              model: model
            }));
      } else {
          App.log('Action not allows', 'ERROR');
          App.UI.router.navigate(App.session.get('default-backlink'), { trigger:true });
      }
  });

})(jQuery, Dime);