/**
 * Dime - app/service/index.js
 */
(function ($, App) {

  // Define Routes
  App.route("profile", "profile", function() {
      var model = new App.Model.User({id: 1});
      model.fetch({async: false});

      App.UI.router.switchView(new App.Views.Core.Form({
          defaults: {
            title: 'Edit user',
            template: 'DimeTimetrackerFrontendBundle:Users:form',
            templateEl: '#user-form'
          },
          model: model
        }));
  });

})(jQuery, Dime);