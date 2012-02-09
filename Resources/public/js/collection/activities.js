/**
 * Dime - collection/activities.js
 *
 * Register Activities collection to namespace App
 */
(function ($, App) {

  // Create Activities collection and add it to App.Collection
  App.provide('Collection.Activities', Backbone.Collection.extend({
      url: 'api/activities'
  }));

})(jQuery, Dime);

