/**
 * Dime - model/timeslice.js
 *
 * Register Timeslice model to namespace App.
 */
(function ($, App) {

  // create Timeslice model and add it to App.Model
  App.provide('Model.Timeslice', Backbone.Model.extend({
    urlRoot: App.Route.Timeslices,
    defaults: {
      duration: 0,
      startedAt: undefined,
      stoppedAt: undefined
    },
    isRunning: function() {
      return !(this.get('stoppedAt') && this.get('stoppedAt').length > 0);
    }
  }));

})(jQuery, Dime);

