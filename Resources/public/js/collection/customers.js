/**
 * Dime - collection/customer.js
 *
 * Register Customers collection to namespace App
 */
(function ($, App) {

  // Create Customers collection and add it to App.Collection
  App.provide('Collection.Customers', Backbone.Collection.extend({
      url: 'api/customers'
  }));

})(jQuery, Dime);

