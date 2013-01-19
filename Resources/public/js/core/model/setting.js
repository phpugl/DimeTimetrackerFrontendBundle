'use strict';

/**
 * Dime - model/setting.js
 *
 * Register Setting model to namespace App.
 */
(function ($, App) {

  // create Setting model and add it to App.Model
  App.provide('Model.Setting', Backbone.Model.extend({
    urlRoot: App.Route.Settings
  }));

})(jQuery, Dime);

