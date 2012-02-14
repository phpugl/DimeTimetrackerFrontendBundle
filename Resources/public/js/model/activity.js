/**
 * Dime - model/activity.js
 *
 * Register Activity model to namespace App.
 */
(function ($, App) {

  // Create Activity model and add it to App.Model
  App.provide('Model.Activity', Backbone.Model.extend({
    urlRoot: App.Route.Activities,
    defaults: {
      duration: 0
    },
    relation: {},
    parse: function(response) {
      if (response.customer) {
        this.relation.customer = new App.Model.Customer(response.customer)
        response.customer = response.customer.id;
      }

      if (response.project) {
        this.relation.project = new App.Model.Project(response.project)
        response.project = response.project.id;
      }

      if (response.service) {
        this.relation.service = new App.Model.Service(response.service)
        response.service = response.service.id;
      }

      if (response['timeslices']) {
        var slices = [], duration = 0;
        _.each(response['timeslices'], function(item) {
          var slice = new App.Model.Timeslice(item);
          duration += slice.get('duration');
          slices[slices.length] = slice;
        });

        response['duration'] = duration;
        response['timeslices'] = slices;
      }
      return response;
    },
    runningTimeslice: function() {
      var last = undefined,
          slices = this.get('timeslices');

      if (slices) {
        for (var i=0; i<slices.length; i++) {
          if (slices[i].isRunning()) {
            last = slices[i];
            break;
          }
        }
      }

      return last;
    },
    formatDuration: function(seconds) {
      var d = new Date(seconds * 1000),
        result = [];

      if (d.getHours() > 0) {
        result[result.length] = d.getHours() + 'h';
      }

      if (d.getMinutes() > 0) {
        result[result.length] = d.getMinutes() + 'm';
      }

      if (d.getSeconds() > 0) {
        result[result.length] = d.getSeconds() + 's';
      }

      return result.join(' ');
    },
    calcDuration: function() {
      var duration = 0,
          slices = this.get('timeslices');

      if (slices) {
        _.each(slices, function(item) {
          duration += item.get('duration');
        });
      }
      this.set('duration', duration);
      return duration;
    }
  }));

})(jQuery, Dime);

