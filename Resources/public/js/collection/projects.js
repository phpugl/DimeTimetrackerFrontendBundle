/**
 * Dime - collection/projects.js
 *
 * Register Projects collection to namespace App
 */
(function ($, App) {

  // Create Projects collection and add it to App.Collection
  App.provide('Collection.Projects', Backbone.Collection.extend({
    model: App.Model.Project,
    url: App.Route.Projects
  }));

})(jQuery, Dime);

