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
    parse: function(response) {
      response.relation = {};
      if (response.activity) {
        response.relation.activity = new App.Model.Activity(response.activity);
        response.activity = response.activity.id;
      }
      return response;
    },
    isRunning: function() {
      return this.get('duration') <= 0
             && !(this.get('stoppedAt') && this.get('stoppedAt').length > 0);
    },
    formatDuration: function() {
      var duration = moment.duration(this.get('duration'), 'seconds');
      return moment()
      .hours(duration.hours())
      .minutes(duration.minutes())
      .seconds(duration.seconds())
      .milliseconds(duration.milliseconds())
      .format('HH:mm:ss');
    }
  }));

})(jQuery, Dime);

