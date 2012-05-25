/**
 * Dime - app/service/index.js
 */
(function ($, App) {

  // Add menu item to main menu
  App.menu({
    name: "service",
    title: "Service",
    route: "service",
    weight: 0,
    callback: function() {
      App.UI.menu.activateItem('service');
      App.UI.router.switchView(new App.Views.Service.Index());
    }
  });

  // Define Routes
  App.route("service:add", "service/add", function() {
    var model = new App.Model.Service();
    
    App.UI.menu.activateItem('service');
    App.UI.router.switchView(new App.Views.Core.Form({
      defaults: {
        title: 'Add Service',
        template: 'DimeTimetrackerFrontendBundle:Services:form',
        templateEl: '#service-form',
        backNavigation: 'serivce'
      },
      model: model
    }));
  });
  App.route("service:edit", "service/:id/edit", function(id) {
    var model = new App.Model.Service({id: id});
    model.fetch({async: false});

    App.UI.menu.activateItem('service');
    App.UI.router.switchView(new App.Views.Core.Form({
      defaults: {
        title: 'Edit Service',
        template: 'DimeTimetrackerFrontendBundle:Services:form',
        templateEl: '#service-form',
        backNavigation: 'serivce'
      },
      model: model
    }));
  });

  // Service view
  App.provide('Views.Service.Index', App.Views.Core.Content.extend({
    template: 'DimeTimetrackerFrontendBundle:Services:index',
    render: function() {
      this.services = new App.Collection.Services();
      this.serviceList = new App.Views.Base.List({
        el: '#services',
        collection: this.services,
        defaults: {
          prefix: 'service-',
          itemTagName: "tr",
          itemView: App.Views.Service.Item,
          itemAttributes: {
            "class": "service"
          }
        }
      }).render();
      this.services.fetch();
    }
  }));

})(jQuery, Dime);