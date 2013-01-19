'use strict';

/**
 * Dime - collection/settings.js
 *
 * Register Settings collection to namespace App
 */
(function ($, App) {

  // Create Settings collection and add it to App.Collection
  App.provide('Collection.Settings', App.Collection.Base.extend({
    model: App.Model.Setting,
    url: App.Route.Settings
  }));

})(jQuery, Dime);

