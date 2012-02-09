/**
 * Dime - views/customer.item.js
 */
(function ($, App) {

  // customer item view
  App.provide('Views.Customer.Item', App.Views.Base.Item.extend({
    tagName: 'div',
    prefix: 'customer-',
    template: '#tpl-customer-item'
  }));
})(jQuery, Dime);
