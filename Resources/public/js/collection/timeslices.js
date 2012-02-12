/**
 * Dime - collection/services.js
 *
 * Register Timeslices collection to namespace App
 */
(function ($, App) {

  // Create Timeslices collection and add it to App.Collection
  App.provide('Collection.Timeslices', Backbone.Collection.extend({
    url: 'api/timeslices'
  }));

})(jQuery, Dime);

