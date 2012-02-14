/**
 * Dime - model/timeslice.js
 *
 * Register Timeslice model to namespace App.
 */
(function ($, App) {

  // create Timeslice model and add it to App.Model
  App.provide('Model.Timeslice', Backbone.Model.extend({
    urlRoot: App.Route.Timeslices
  }));

})(jQuery, Dime);

