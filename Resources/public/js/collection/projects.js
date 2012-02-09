/**
 * Dime - collection/projects.js
 *
 * Register Projects collection to namespace App
 */
(function ($, App) {

  // Create Projects collection and add it to App.Collection
  App.provide('Collection.Projects', Backbone.Collection.extend({
      url: 'api/projects'
  }));

})(jQuery, Dime);

