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
    relation: function(name) {
      var relation = this.get('relation');
      if (name) {
        return (relation[name]) ? relation[name] : undefined;
      } else {
        return relation;
      }
    },
    parse: function(response) {
      response.relation = {};
      
      if (response.customer) {
        response.relation.customer = new App.Model.Customer(response.customer)
        response.customer = response.customer.id;
      }

      if (response.project) {
        response.relation.project = new App.Model.Project(response.project)
        response.project = response.project.id;
      }

      if (response.service) {
        response.relation.service = new App.Model.Service(response.service)
        response.service = response.service.id;
      }

      var timeslices = new App.Collection.Timeslices();
      if (response.timeslices) {
        var slices = [];
        _.each(response.timeslices, function(item) {
          slices[slices.length] = item.id;
          item.activity = response.id;
          timeslices.add(new App.Model.Timeslice(item));
        });
        response.duration = timeslices.duration();
        response.timeslices = slices;
      }
      response.relation.timeslices = timeslices;

      return response;
    },
    runningTimeslice: function() {
      return (this.relation('timeslices')) ? this.relation('timeslices').firstRunning() : undefined;
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
    }
  }));

})(jQuery, Dime);

