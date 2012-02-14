/**
 * Dime - collection/activities.js
 *
 * Register Activities collection to namespace App
 */
(function ($, App) {

  // Create Activities collection and add it to App.Collection
  App.provide('Collection.Activities', Backbone.Collection.extend({
    model: App.Model.Activity,
    url: App.Route.Activities,
    parse: function (response) {
      for (var i=0; i<response.length; i++) {
        if (response[i]['timeslices']) {
          response[i]['timeslices'] = new App.Collection.Timeslices(response[i]['timeslices']);
        }
      }
      return response;
    }
  }));

})(jQuery, Dime);

