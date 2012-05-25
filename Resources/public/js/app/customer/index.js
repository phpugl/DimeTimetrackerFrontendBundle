/**
 * Dime - app/customer/index.js
 */
(function ($, App) {

  // Add menu item to main menu
  App.menu({
    name: "customer",
    title: "Customer",
    route: "customer",
    weight: 0,
    callback: function() {
      App.UI.menu.activateItem('customer');
      App.UI.router.switchView(new App.Views.Customer.Index());
    }
  });

  // Define Routes
  App.route("customer:add", "customer/add", function() {
    var model = new App.Model.Customer();

    App.UI.menu.activateItem('customer');
    App.UI.router.switchView(new App.Views.Customer.Form({
      defaults: {
        title: 'Add Customer',
        template: 'DimeTimetrackerFrontendBundle:Customers:form',
        templateEl: '#customer-form',
        backNavigation: 'customer' 
      },
      model: model
    }));
  });
  App.route("customer:edit", "customer/:id/edit", function(id) {
    var model = new App.Model.Customer({id: id});
    model.fetch({async: false});

    App.UI.menu.activateItem('customer');
    App.UI.router.switchView(new App.Views.Customer.Form({
      defaults: {
        title: 'Edit Customer',
        template: 'DimeTimetrackerFrontendBundle:Customers:form',
        templateEl: '#customer-form',
        backNavigation: 'customer'
      },
      model: model
    }));
  });

  // Customer view
  App.provide('Views.Customer.Index', App.Views.Core.Content.extend({
    template: 'DimeTimetrackerFrontendBundle:Customers:index',
    render: function() {
      this.customers = new App.Collection.Customers();
      this.customerList = new App.Views.Core.List({
        el: '#customers',
        collection: this.customers,
        defaults: {
          prefix: 'customer-',
          item: {
            attributes: { "class": "customer" },
            tagName: 'tr',
            template: '#tpl-customer-item',
            View: App.Views.Customer.Item
          }
        }
      }).render();
      this.customers.fetch();
    }
  }));

})(jQuery, Dime);