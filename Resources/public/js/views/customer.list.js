/**
 * Dime - views/customer.list.js
 */
(function ($, App) {

  // customer list view
  App.provide('Views.Customer.List', App.Views.Base.List.extend({
    el: '#customers',
    prefix: 'customer-',
    ItemView: App.Views.Customer.Item
  }));
})(jQuery, Dime);
