'use strict';

/**
 * Dime - collection/services.js
 *
 * Register Timeslices collection to namespace App
 */
(function ($, App) {

  // Create Timeslices collection and add it to App.Collection
  App.provide('Collection.Timeslices', App.Collection.Base.extend({
    model: App.Model.Timeslice,
    url: App.Route.Timeslices,
    duration: function() {
      var duration = 0;
      this.each(function(item) {
        if (item.get('duration')) {
          duration += item.get('duration')
        }
      });
      return duration;
    },
    firstRunning: function() {
      var first = undefined;
      for (var i=0; i<this.length; i++) {
        if (this.at(i).isRunning()) {
          first = this.at(i);
          break;
        }
      }
      return first;
    }
  }));

})(jQuery, Dime);

