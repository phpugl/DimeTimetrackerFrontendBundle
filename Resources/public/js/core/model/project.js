'use strict';

/**
 * Dime - model/project.js
 *
 * Register Project model to namespace App.
 */
(function ($, App) {

  // Create Project model and add it to App.Model
  App.provide('Model.Project', Backbone.Model.extend({
    urlRoot: App.Route.Projects
  }));

})(jQuery, Dime);

