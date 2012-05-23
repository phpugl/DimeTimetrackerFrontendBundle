/**
 * Dime - model/service.js
 *
 * Register Service model to namespace App.
 */
(function ($, App) {

  // create Service model and add it to App.Model
  App.provide('Model.Service', Backbone.Model.extend({
    urlRoot: App.Route.Services
  }));

})(jQuery, Dime);

