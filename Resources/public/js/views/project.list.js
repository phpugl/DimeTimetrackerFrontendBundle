/**
 * Dime - views/project.list.js
 */
(function ($, App) {

  // provide list view in App.Views.Project
  App.provide('Views.Project.List', App.Views.Base.List.extend({
    el: '#projects',
    prefix: 'project-',
    ItemView: App.Views.Project.Item
  }));

})(jQuery, Dime);
