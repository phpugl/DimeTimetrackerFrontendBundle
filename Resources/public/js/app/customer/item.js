/**
 * Dime - app/customer/item.js
 */
(function ($, App) {
  
  // Create item view in App.Views.Customer
  App.provide('Views.Customer.Item', App.Views.Base.Item.extend({
    tagName: 'div',
    template: '#tpl-customer-item',
    prefix: 'customer-'
  }));
  
})(jQuery, Dime);
