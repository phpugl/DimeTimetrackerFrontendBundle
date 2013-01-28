'use strict';

/**
 * Dime - app/service/index.js
 */
(function ($, App) {

  // Define Routes
  App.router.route("profile/:id", "profile", function(id) {
      var model = new App.Model.User({id: id});
      model.fetch({async: false});
      if (model.get('username')) {
          App.router.switchView(new App.Views.Core.Form({
              model: model,
              template:'DimeTimetrackerFrontendBundle:Users:form',
              options: {
                  prefix: 'user-',
                  ui: {
                      title: 'Edit User',
                      titleElement: 'header.page-header h1'
                  }
              }
            }));
      } else {
          App.log('Action not allows', 'ERROR');
          App.router.navigate(App.session.get('default-backlink'), { trigger:true });
      }
  });

})(jQuery, Dime);
