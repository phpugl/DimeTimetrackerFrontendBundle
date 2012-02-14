/**
 * Dime - collection/services.js
 *
 * Register Timeslices collection to namespace App
 */
(function ($, App) {

  // Create Timeslices collection and add it to App.Collection
  App.provide('Collection.Timeslices', Backbone.Collection.extend({
    model: App.Model.Timeslice,
    url: App.Route.Timeslices
  }));

})(jQuery, Dime);

