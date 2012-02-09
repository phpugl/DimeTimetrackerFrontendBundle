/**
 * Dime - collection/services.js
 *
 * Register Services collection to namespace App
 */
(function ($, App) {

  // Create Services collection and add it to App.Collection
  var Services = App.provide('Collection.Services', Backbone.Collection.extend({
    url: 'api/services'
  }));

})(jQuery, Dime);

