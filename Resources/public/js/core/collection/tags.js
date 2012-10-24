'use strict';

/**
 * Dime - collection/tags.js
 *
 * Register Tags collection to namespace App
 */
(function ($, App) {

  // Create Tags collection and add it to App.Collection
  App.provide('Collection.Tags', App.Collection.Base.extend({
    model: App.Model.Tag,
    url: App.Route.Tags,
  }));

})(jQuery, Dime);

